import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_KEY = '@babala_user_location';
const LOCATION_PERMISSION_KEY = '@babala_location_permission';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UserLocation extends Coordinates {
  address?: string;
  city?: string;
  province?: string;
  timestamp: string;
}

/**
 * Location Service
 * Handles GPS location, permissions, and geocoding
 */
export class LocationService {
  private static instance: LocationService;
  private currentLocation: UserLocation | null = null;
  private watchSubscription: Location.LocationSubscription | null = null;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      console.log('[Location] Requesting permissions...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      const granted = status === 'granted';
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, String(granted));

      if (granted) {
        console.log('✅ Location permission granted');
      } else {
        console.log('⚠️ Location permission denied');
      }

      return granted;
    } catch (error) {
      console.error('❌ Error requesting location permission:', error);
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'false');
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.log('[Location] No permission - requesting...');
        const granted = await this.requestPermissions();
        if (!granted) {
          return this.getCachedLocation();
        }
      }

      console.log('[Location] Getting current position...');
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        timestamp: new Date().toISOString(),
      };

      // Try to get address
      try {
        const address = await this.reverseGeocode(
          userLocation.latitude,
          userLocation.longitude
        );
        if (address) {
          userLocation.address = address.address;
          userLocation.city = address.city;
          userLocation.province = address.province;
        }
      } catch (error) {
        console.log('[Location] Could not get address:', error);
      }

      this.currentLocation = userLocation;
      await this.cacheLocation(userLocation);

      console.log(`✅ Location obtained: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`);
      return userLocation;
    } catch (error) {
      console.error('❌ Error getting current location:', error);
      return this.getCachedLocation();
    }
  }

  /**
   * Watch user location (continuous tracking)
   */
  async watchLocation(callback: (location: UserLocation) => void): Promise<boolean> {
    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return false;
      }

      console.log('[Location] Starting location watch...');

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Or every 50 meters
        },
        (location) => {
          const userLocation: UserLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            timestamp: new Date().toISOString(),
          };

          this.currentLocation = userLocation;
          callback(userLocation);
        }
      );

      console.log('✅ Location watch started');
      return true;
    } catch (error) {
      console.error('❌ Error watching location:', error);
      return false;
    }
  }

  /**
   * Stop watching location
   */
  async stopWatchingLocation(): Promise<void> {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
      console.log('🛑 Location watch stopped');
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ address: string; city?: string; province?: string } | null> {
    try {
      console.log(`[Location] Reverse geocoding: ${latitude}, ${longitude}`);
      
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const result = results[0];
        const addressParts = [
          result.street,
          result.district,
          result.city,
          result.subregion,
          result.region,
        ].filter(Boolean);

        return {
          address: addressParts.join(', ') || 'Unknown location',
          city: result.city || result.district || undefined,
          province: result.region || result.subregion || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string): Promise<Coordinates | null> {
    try {
      console.log(`[Location] Geocoding address: ${address}`);
      
      const results = await Location.geocodeAsync(address);

      if (results.length > 0) {
        const result = results[0];
        console.log(`✅ Geocoded to: ${result.latitude}, ${result.longitude}`);
        return {
          latitude: result.latitude,
          longitude: result.longitude,
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(
    from: Coordinates,
    to: Coordinates
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.latitude)) *
        Math.cos(this.toRad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get cached location
   */
  async getCachedLocation(): Promise<UserLocation | null> {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_KEY);
      if (cached) {
        const location = JSON.parse(cached);
        console.log('[Location] Using cached location');
        return location;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached location:', error);
      return null;
    }
  }

  /**
   * Cache location
   */
  private async cacheLocation(location: UserLocation): Promise<void> {
    try {
      await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Get current cached location (synchronous)
   */
  getCurrentCachedLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Check if within a geofence radius
   */
  isWithinRadius(
    userLocation: Coordinates,
    centerLocation: Coordinates,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(userLocation, centerLocation);
    return distance <= radiusKm;
  }

  /**
   * Get nearest location from a list
   */
  getNearestLocation<T extends { coordinates: Coordinates }>(
    userLocation: Coordinates,
    locations: T[]
  ): { location: T; distance: number } | null {
    if (locations.length === 0) return null;

    let nearest = locations[0];
    let minDistance = this.calculateDistance(userLocation, nearest.coordinates);

    for (let i = 1; i < locations.length; i++) {
      const distance = this.calculateDistance(userLocation, locations[i].coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = locations[i];
      }
    }

    return { location: nearest, distance: minDistance };
  }

  /**
   * Sort locations by distance from user
   */
  sortByDistance<T extends { coordinates: Coordinates }>(
    userLocation: Coordinates,
    locations: T[]
  ): Array<T & { distance: number }> {
    return locations
      .map((location) => ({
        ...location,
        distance: this.calculateDistance(userLocation, location.coordinates),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    await this.stopWatchingLocation();
  }
}

export const locationService = LocationService.getInstance();
