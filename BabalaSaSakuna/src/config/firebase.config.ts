/**
 * Firebase Configuration
 * 
 * For development: Update these values with your Firebase project credentials
 * For production: Use environment variables or secure configuration management
 * 
 * Get your config from: Firebase Console > Project Settings > Your apps
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Development/Test Configuration
// TODO: Replace with your actual Firebase project credentials
export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// API Keys Configuration
export const apiKeys = {
  openWeather: process.env.OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_KEY',
  airQuality: process.env.AIR_QUALITY_API_KEY || 'YOUR_AIR_QUALITY_KEY',
  googleMaps: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_KEY',
};

// API Endpoints
export const apiEndpoints = {
  pagasaWeather: 'https://api.pagasa.dost.gov.ph', // Example - check actual PAGASA API
  openWeather: 'https://api.openweathermap.org/data/2.5',
  airQuality: 'https://api.waqi.info/feed', // World Air Quality Index
  googleMaps: 'https://maps.googleapis.com/maps/api',
};

// Environment
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Feature Flags
export const features = {
  useRealApis: false, // Toggle to switch between mock and real data
  enablePushNotifications: true,
  enableLocationTracking: true,
  enableCrashReporting: false, // Enable when Sentry is configured
};
