import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '../types';
import { localizationService } from './LocalizationService';

const PUSH_TOKEN_KEY = '@babala_push_token';
const NOTIFICATIONS_ENABLED_KEY = '@babala_notifications_enabled';

/**
 * NotificationService - Stub Implementation for Expo Go
 * 
 * This is a stub service that provides no-op implementations for all notification methods
 * to ensure the app works in Expo Go without crashes.
 * 
 * expo-notifications is not supported in Expo Go since SDK 53+.
 * All methods return null/false/no-op and isAvailable() returns false.
 * 
 * For full push notification functionality:
 * 1. Build a development build: `npx expo run:android` or `npx expo run:ios`
 * 2. Replace this stub with the full implementation that imports expo-notifications
 * 
 * See: https://docs.expo.dev/develop/development-builds/introduction/
 */

class NotificationService {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    console.log('📱 Notification service: Stub mode (Expo Go) - Use development build for full functionality');
    this.initialized = true;
  }

  async requestPermissions(): Promise<boolean> {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
    return false;
  }

  async areNotificationsEnabled(): Promise<boolean> {
    return false;
  }

  async scheduleAlertNotification(alert: Alert) {
    return null;
  }

  async scheduleCriticalWarning(title: string, message: string) {
    return null;
  }

  async scheduleChecklistReminder(message: string, delayMinutes: number = 30) {
    return null;
  }

  async cancelAllNotifications() {
    return;
  }

  async cancelNotification(notificationId: string) {
    return;
  }

  addNotificationResponseListener(callback: (response: any) => void) {
    return { remove: () => {} };
  }

  addNotificationReceivedListener(callback: (notification: any) => void) {
    return { remove: () => {} };
  }
  
  isAvailable(): boolean {
    return false;
  }
}

export const notificationService = new NotificationService();
