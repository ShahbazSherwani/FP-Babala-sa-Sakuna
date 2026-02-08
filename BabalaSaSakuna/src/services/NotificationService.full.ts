/**
 * NotificationService - Full Implementation for Development Builds
 * 
 * This is the FULL implementation with expo-notifications support.
 * 
 * TO USE THIS FILE:
 * 1. Build a development build: `npx expo run:android` or `npx expo run:ios`
 * 2. Rename this file to NotificationService.ts (backup the stub first)
 * 
 * This file imports expo-notifications which causes crashes in Expo Go.
 * Only use this after creating a development build.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '../types';
import { localizationService } from './LocalizationService';

const PUSH_TOKEN_KEY = '@babala_push_token';
const NOTIFICATIONS_ENABLED_KEY = '@babala_notifications_enabled';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private initialized = false;

  async init() {
    if (this.initialized) return;

    await this.requestPermissions();
    this.initialized = true;
    console.log('📱 Notification service: Full mode (Development Build)');
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Disaster Alerts',
        description: 'Critical disaster warnings and updates',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#DC2626',
        sound: 'default',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      return false;
    }

    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');

    // Get push token (for future integration with push notification service)
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }

    return true;
  }

  async areNotificationsEnabled(): Promise<boolean> {
    const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return enabled === 'true';
  }

  async scheduleAlertNotification(alert: Alert) {
    const enabled = await this.areNotificationsEnabled();
    if (!enabled) return null;

    const isCritical = alert.severity === 'critical';
    const title = isCritical
      ? `🚨 ${localizationService.t('severity.critical')}`
      : `⚠️ ${alert.title}`;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: alert.description.substring(0, 200),
        data: { alertId: alert.id },
        sound: true,
        priority: isCritical
          ? Notifications.AndroidNotificationPriority.MAX
          : Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: isCritical ? 'critical-alert' : 'alert',
      },
      trigger: null, // Show immediately
    });
  }

  async scheduleCriticalWarning(title: string, message: string) {
    const enabled = await this.areNotificationsEnabled();
    if (!enabled) return null;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚨 ${title}`,
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 250, 250, 250],
        categoryIdentifier: 'critical-alert',
      },
      trigger: null,
    });
  }

  async scheduleChecklistReminder(message: string, delayMinutes: number = 30) {
    const enabled = await this.areNotificationsEnabled();
    if (!enabled) return null;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: localizationService.t('checklist.title'),
        body: message,
        data: { type: 'checklist-reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayMinutes * 60,
        repeats: false,
      },
    });
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Subscribe to notification responses (when user taps notification)
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Subscribe to notifications received while app is in foreground
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }
  
  isAvailable(): boolean {
    return true;
  }
}

export const notificationService = new NotificationService();
