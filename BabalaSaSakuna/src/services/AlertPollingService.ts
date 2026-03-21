/**
 * AlertPollingService
 *
 * Polls OpenWeatherMap + WAQI every 15 minutes.
 * Uses React Native Alert.alert() for in-app notifications — works in Expo Go
 * without any native build or push token required.
 */

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { weatherService, WeatherAlert } from './WeatherService';
import { locationService } from './LocationService';

const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const LAST_ALERT_KEY = '@babala_last_alert_ids';

export class AlertPollingService {
  private static instance: AlertPollingService;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private permissionGranted = false;

  static getInstance(): AlertPollingService {
    if (!AlertPollingService.instance) {
      AlertPollingService.instance = new AlertPollingService();
    }
    return AlertPollingService.instance;
  }

  /**
   * Initialize — request notification permission, then start polling.
   * Safe to call multiple times (idempotent).
   */
  async init(): Promise<void> {
    await this.requestPermission();
    if (this.intervalId) return; // already running

    // Run immediately on startup, then every 15 min
    await this.poll();
    this.intervalId = setInterval(() => this.poll(), POLL_INTERVAL_MS);
    console.log('[AlertPolling] Started — checking every 15 minutes');
  }

  /** Stop polling (call on app backgrounding if needed) */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[AlertPolling] Stopped');
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private async requestPermission(): Promise<void> {
    // Using in-app Alert dialogs — no OS permission needed
    this.permissionGranted = true;
    console.log('[AlertPolling] Ready — using in-app alerts ✅');
  }

  private async poll(): Promise<void> {
    try {
      console.log('[AlertPolling] Polling for weather alerts...');

      // Try to use the user's current GPS location; fall back to Manila
      let lat: number | undefined;
      let lon: number | undefined;
      try {
        const loc = await locationService.getCurrentLocation();
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      } catch {
        // location permission not granted — use defaults inside WeatherService
      }

      const alerts = await weatherService.getWeatherAlerts(lat, lon);

      if (alerts.length === 0) {
        console.log('[AlertPolling] No active alerts');
        return;
      }

      // Deduplicate — avoid re-notifying for the same alert within 1 hour
      const seenIds = await this.getSeenAlertIds();
      const newAlerts = alerts.filter((a) => !seenIds.includes(a.id));

      for (const alert of newAlerts) {
        await this.sendNotification(alert);
      }

      // Persist sent IDs (keep last 50)
      const updatedIds = [
        ...newAlerts.map((a) => a.id),
        ...seenIds,
      ].slice(0, 50);
      await AsyncStorage.setItem(LAST_ALERT_KEY, JSON.stringify(updatedIds));
    } catch (err) {
      console.warn('[AlertPolling] Poll error (non-fatal):', err);
    }
  }

  private async sendNotification(alert: WeatherAlert): Promise<void> {
    if (!this.permissionGranted) return;

    // Show in-app Alert dialog for medium+ severity
    if (alert.severity === 'high' || alert.severity === 'extreme') {
      Alert.alert(alert.title, alert.description, [{ text: 'Dismiss' }]);
    }
    console.log(`[AlertPolling] Alert shown: ${alert.title}`);
  }

  private async getSeenAlertIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(LAST_ALERT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Manually trigger a poll right now (useful for testing from the UI).
   */
  async checkNow(): Promise<WeatherAlert[]> {
    try {
      let lat: number | undefined;
      let lon: number | undefined;
      try {
        const loc = await locationService.getCurrentLocation();
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      } catch { /* use defaults */ }

      const alerts = await weatherService.getWeatherAlerts(lat, lon);
      for (const alert of alerts) {
        await this.sendNotification(alert);
      }
      return alerts;
    } catch (err) {
      console.warn('[AlertPolling] checkNow error:', err);
      return [];
    }
  }
}

export const alertPollingService = AlertPollingService.getInstance();
