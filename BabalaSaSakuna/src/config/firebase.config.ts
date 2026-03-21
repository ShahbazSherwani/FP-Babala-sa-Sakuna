/**
 * Firebase Configuration
 * 
 * For development: Update these values with your Firebase project credentials
 * For production: Use environment variables or secure configuration management
 * 
 * Get your config from: Firebase Console > Project Settings > Your apps
 */

// react-native-dotenv injects .env variables via @env module
// process.env does NOT work in React Native — must use @env imports
let envVars: Record<string, string> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  envVars = require('@env');
} catch {
  // @env not available (babel plugin not configured) — keys must be hardcoded below
}

const env = (key: string, fallback: string): string =>
  (envVars as any)[key] || fallback;

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
  apiKey: env('FIREBASE_API_KEY', 'your_firebase_api_key_here'),
  authDomain: env('FIREBASE_AUTH_DOMAIN', 'your_project.firebaseapp.com'),
  projectId: env('FIREBASE_PROJECT_ID', 'your_project_id'),
  storageBucket: env('FIREBASE_STORAGE_BUCKET', 'your_project.appspot.com'),
  messagingSenderId: env('FIREBASE_MESSAGING_SENDER_ID', 'your_sender_id'),
  appId: env('FIREBASE_APP_ID', 'your_app_id'),
  measurementId: env('FIREBASE_MEASUREMENT_ID', ''),
};

// API Keys Configuration
export const apiKeys = {
  openWeather: env('OPENWEATHER_API_KEY', 'ade2bca4f247dbdd7bed3dd5fb79e703'),
  airQuality:  env('AIR_QUALITY_API_KEY',  '925510c3bb6898e3e4f606ae3816ec66ed235c24'),
  googleMaps:  env('GOOGLE_MAPS_API_KEY',  'AIzaSyBK6h8aw6inbEGKnJvf0ERU1T7uwb9JV_Q'),
};

// API Endpoints
export const apiEndpoints = {
  pagasa: 'https://pubfiles.pagasa.dost.gov.ph',
  openWeather: 'https://api.openweathermap.org/data/2.5',
  airQuality: 'https://api.waqi.info', // World Air Quality Index — NOTE: no /feed suffix
  googleMaps: 'https://maps.googleapis.com/maps/api',
};

// Environment
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Feature Flags
export const features = {
  useRealApis: true, // Toggle to switch between mock and real data
  enablePushNotifications: true,
  enableLocationTracking: true,
  enableCrashReporting: false, // Enable when Sentry is configured
};
