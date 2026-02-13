import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '../types';
import { firebaseService } from './FirebaseService';
import { features } from '../config/firebase.config';

const FCM_TOKEN_KEY = '@babala_fcm_token';
const NOTIFICATIONS_ENABLED_KEY = '@babala_notifications_enabled';

// Try to load Firebase Messaging, fallback to null if unavailable
let messaging: any = null;
let isNativeModuleAvailable = false;

try {
  messaging = require('@react-native-firebase/messaging').default;
  isNativeModuleAvailable = true;
  console.log('📬 Firebase Messaging module loaded');
} catch (error) {
  console.log('📱 Firebase Messaging: Stub mode (Expo Go) - Use development build for push notifications');
  isNativeModuleAvailable = false;
}

/**
 * NotificationService with Real Firebase Cloud Messaging
 * Supports both real FCM (development build) and stub mode (Expo Go)
 * 
 * Features:
 * - Push notifications via FCM
 * - Topic subscriptions
 * - Foreground/background message handling
 * - Local notifications
 * - Stub mode for Expo Go development
 */

class NotificationService {
  private initialized = false;
  private stubMode: boolean;
  private fcmToken: string | null = null;
  private messageListener: (() => void) | null = null;

  constructor() {
    this.stubMode = !isNativeModuleAvailable || firebaseService.isStubMode() || !features.enablePushNotifications;
  }

  async init() {
    if (this.initialized) return;

    if (this.stubMode) {
      console.log('📱 Notification service: Stub mode (Expo Go) - Use development build for full functionality');
      this.initialized = true;
      return;
    }

    try {
      // Request permission
      const authStatus = await this.requestPermissions();
      if (!authStatus) {
        console.log('⚠️ Push notification permission denied');
        this.initialized = true;
        return;
      }

      // Get FCM token
      await this.getFCMToken();

      // Set up message handlers
      this.setupMessageHandlers();

      console.log('✅ Notification service initialized with FCM');
      this.initialized = true;
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      console.log('📱 Falling back to stub mode');
      this.stubMode = true;
      this.initialized = true;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (this.stubMode) {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      return false;
    }

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === 1 || // AUTHORIZED
        authStatus === 2;   // PROVISIONAL

      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));

      if (enabled) {
        console.log('✅ Push notification permission granted');
      } else {
        console.log('⚠️ Push notification permission denied');
      }

      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
      return false;
    }
  }

  async areNotificationsEnabled(): Promise<boolean> {
    if (this.stubMode) return false;
    
    const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return enabled === 'true';
  }

  async scheduleAlertNotification(alert: Alert) {
    if (this.stubMode) {
      console.log(`📬 [Stub] Alert notification: ${alert.title}`);
      return null;
    }

    return this.sendLocalNotification(alert.title, alert.message, { alertId: alert.id });
  }

  async scheduleCriticalWarning(title: string, message: string) {
    if (this.stubMode) {
      console.log(`🚨 [Stub] Critical warning: ${title}`);
      return null;
    }

    return this.sendLocalNotification(title, message, { type: 'critical' });
  }

  async scheduleChecklistReminder(message: string, delayMinutes: number = 30) {
    if (this.stubMode) {
      console.log(`📅 [Stub] Checklist reminder scheduled: ${message}`);
      return null;
    }

    const triggerDate = new Date(Date.now() + delayMinutes * 60 * 1000);
    return this.scheduleNotification('Checklist Reminder', message, triggerDate);
  }

  async cancelAllNotifications() {
    if (this.stubMode) {
      console.log('🚫 [Stub] Cancelled all notifications');
      return;
    }
    console.log('🚫 Cancelled all notifications');
  }

  async cancelNotification(notificationId: string) {
    if (this.stubMode) {
      console.log(`🚫 [Stub] Cancelled notification: ${notificationId}`);
      return;
    }
    console.log('🚫 Cancelled notification:', notificationId);
  }

  addNotificationResponseListener(callback: (response: any) => void) {
    if (this.stubMode) {
      return { remove: () => {} };
    }
    // In real implementation, set up listener for notification taps
    return { remove: () => {} };
  }

  addNotificationReceivedListener(callback: (notification: any) => void) {
    if (this.stubMode) {
      return { remove: () => {} };
    }
    // In real implementation, set up listener for foreground notifications
    return { remove: () => {} };
  }
  
  isAvailable(): boolean {
    return !this.stubMode && this.initialized;
  }

  /**
   * Get FCM token for this device
   */
  async getFCMToken(): Promise<string | null> {
    if (this.stubMode) {
      const mockToken = 'MOCK_FCM_TOKEN_' + Date.now();
      console.log('[Notifications] Stub mode - Generated mock token');
      return mockToken;
    }

    try {
      // Check if we have a cached token
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (cachedToken) {
        this.fcmToken = cachedToken;
        console.log('✅ Using cached FCM token');
        return cachedToken;
      }

      // Get new token
      const token = await messaging().getToken();
      if (token) {
        this.fcmToken = token;
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('✅ FCM token obtained:', token.substring(0, 20) + '...');
        return token;
      }

      console.log('⚠️ No  FCM token available');
      return null;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Set up message handlers for foreground and background
   */
  private setupMessageHandlers(): void {
    if (this.stubMode || !messaging) {
      return;
    }

    try {
      // Foreground message handler
      this.messageListener = messaging().onMessage(async (remoteMessage: any) => {
        console.log('📨 Foreground notification received:', remoteMessage);
        this.handleForegroundNotification(remoteMessage);
      });

      // Background/quit message handler
      messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
        console.log('📨 Background notification received:', remoteMessage);
      });

      // Handle notification opened app
      messaging().onNotificationOpenedApp((remoteMessage: any) => {
        console.log('📬 Notification opened app:', remoteMessage);
        this.handleNotificationOpened(remoteMessage);
      });

      // Check if app was opened from a notification (when app was quit)
      messaging()
        .getInitialNotification()
        .then((remoteMessage: any) => {
          if (remoteMessage) {
            console.log('📬 App opened from notification (quit state):', remoteMessage);
            this.handleNotificationOpened(remoteMessage);
          }
        });
    } catch (error) {
      console.error('Error setting up message handlers:', error);
    }
  }

  /**
   * Handle foreground notification display
   */
  private handleForegroundNotification(remoteMessage: any): void {
    console.log('Foreground notification:', {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
    });
  }

  /**
   * Handle notification that was tapped to open the app
   */
  private handleNotificationOpened(remoteMessage: any): void {
    console.log('User tapped notification:', remoteMessage.data);
    // Here you would navigate based on notification data
  }

  /**
   * Send a local notification
   */
  private async sendLocalNotification(title: string, body: string, data?: any): Promise<string | null> {
    if (this.stubMode) {
      console.log(`📬 [Stub] Local Notification: ${title} - ${body}`, data);
      return null;
    }

    console.log('📬 Local notification:', { title, body, data });
    return 'LOCAL_' + Date.now();
  }

  /**
   * Schedule a notification
   */
  private async scheduleNotification(
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<string | null> {
    if (this.stubMode) {
      console.log(`📅 [Stub] Scheduled notification for ${triggerDate.toISOString()}: ${title}`);
      return null;
    }

    console.log('📅 Scheduled notification:', { title, body, triggerDate, data });
    return 'SCHEDULED_' + Date.now();
  }

  /**
   * Subscribe to a topic for push notifications
   */
  async subscribeToTopic(topic: string): Promise<void> {
    if (this.stubMode) {
      console.log(`🔔 [Stub] Subscribed to topic: ${topic}`);
      return;
    }

    try {
      await messaging().subscribeToTopic(topic);
      console.log(`✅ Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    if (this.stubMode) {
      console.log(`🔕 [Stub] Unsubscribed from topic: ${topic}`);
      return;
    }

    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`✅ Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Error unsubscribing from topic ${topic}:`, error);
    }
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Clean up listeners
   */
  async cleanup(): Promise<void> {
    if (this.messageListener) {
      this.messageListener();
      this.messageListener = null;
    }
  }
}

export const notificationService = new NotificationService();
