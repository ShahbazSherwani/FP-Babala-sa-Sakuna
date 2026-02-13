import { firebaseConfig } from '../config/firebase.config';

// Try to import Firebase modules, fallback to null if not available (Expo Go)
let initializeApp: any = null;
let firestore: any = null;
let auth: any = null;
let storage: any = null;
let messaging: any = null;
let FirebaseApp: any = null;
let FirebaseFirestoreTypes: any = null;
let FirebaseAuthTypes: any = null;
let FirebaseStorageTypes: any = null;
let FirebaseMessagingTypes: any = null;

let isNativeModuleAvailable = false;

try {
  const firebaseApp = require('@react-native-firebase/app');
  initializeApp = firebaseApp.default;
  FirebaseApp = firebaseApp.FirebaseApp;
  
  firestore = require('@react-native-firebase/firestore').default;
  auth = require('@react-native-firebase/auth').default;
  storage = require('@react-native-firebase/storage').default;
  messaging = require('@react-native-firebase/messaging').default;
  
  isNativeModuleAvailable = true;
  console.log('🔥 Firebase native modules loaded successfully');
} catch (error) {
  console.log('📱 Firebase: Stub mode (Expo Go) - Use development build for Firebase features');
  isNativeModuleAvailable = false;
}

/**
 * Firebase Service
 * Central service for initializing and accessing Firebase services
 * Supports both native Firebase and stub mode for Expo Go
 */

class FirebaseService {
  private static instance: FirebaseService;
  private app: any = null;
  private initialized: boolean = false;
  private stubMode: boolean = !isNativeModuleAvailable;

  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Check if running in stub mode (Expo Go)
   */
  isStubMode(): boolean {
    return this.stubMode;
  }

  /**
   * Initialize Firebase
   * Call this once at app startup
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      console.log('Firebase already initialized');
      return true;
    }

    // In stub mode, just mark as initialized
    if (this.stubMode) {
      console.log('🔥 Firebase: Running in stub mode (guest access only)');
      this.initialized = true;
      return true;
    }

    try {
      // Check if Firebase is already initialized
      const apps = initializeApp.apps || [];
      
      if (apps.length === 0) {
        // Initialize Firebase with config
        this.app = initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
      } else {
        this.app = apps[0];
        console.log('Using existing Firebase instance');
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Check if Firebase is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get Firestore instance
   */
  getFirestore(): any {
    if (this.stubMode) {
      throw new Error('Firebase Firestore requires a development build. Use Expo Go guest mode or build with EAS.');
    }
    if (!this.initialized) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return firestore();
  }

  /**
   * Get Auth instance
   */
  getAuth(): any {
    if (this.stubMode) {
      throw new Error('Firebase Auth requires a development build. Use Expo Go guest mode or build with EAS.');
    }
    if (!this.initialized) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return auth();
  }

  /**
   * Get Storage instance
   */
  getStorage(): any {
    if (this.stubMode) {
      throw new Error('Firebase Storage requires a development build. Use Expo Go guest mode or build with EAS.');
    }
    if (!this.initialized) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return storage();
  }

  /**
   * Get Messaging instance
   */
  getMessaging(): any {
    if (this.stubMode) {
      throw new Error('Firebase Messaging requires a development build. Use Expo Go guest mode or build with EAS.');
    }
    if (!this.initialized) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return messaging();
  }

  /**
   * Get current user (stub mode returns null)
   */
  getCurrentUser(): any | null {
    if (this.stubMode) {
      return null;
    }
    try {
      return this.getAuth().currentUser;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (this.stubMode) {
      return false;
    }
    return this.getCurrentUser() !== null;
  }
}

export const firebaseService = FirebaseService.getInstance();

// Export Firebase modules for direct access if needed (will be null in stub mode)
// In production, you should use firebaseService methods instead
export { firestore, auth, storage, messaging };
