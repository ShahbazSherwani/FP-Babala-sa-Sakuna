import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, PSIData } from '../types';
import { 
  WEATHER_DATA, 
  PSI_DATA, 
  getWeatherByLocation, 
  getPSIByLocation,
  shouldAlertForPSI,
  shouldAlertForWeather 
} from '../data/weather';
import { openWeatherApi, airQualityApi } from './ApiClient';
import { features } from '../config/firebase.config';

const WEATHER_CACHE_KEY = '@babala_weather_cache';
const PSI_CACHE_KEY = '@babala_psi_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Default Philippines coordinates (Manila)
const DEFAULT_COORDINATES = {
  latitude: 14.5995,
  longitude: 120.9842,
};

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private useRealApis: boolean;

  private constructor() {
    this.useRealApis = features.useRealApis;
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Get all weather data
   */
  async getAllWeather(): Promise<WeatherData[]> {
    try {
      // Check if we should use real APIs
      if (!this.useRealApis) {
        console.log('[Weather] Using mock data (set features.useRealApis = true for real data)');
        return WEATHER_DATA;
      }

      // Try to get from cache first
      const cached = await this.getFromCache<WeatherData[]>(WEATHER_CACHE_KEY);
      if (cached) {
        console.log('[Weather] Returning cached data');
        return cached;
      }

      // Fetch from real API
      console.log('[Weather] Fetching from OpenWeatherMap API');
      const response = await openWeatherApi.getCurrentWeather(
        DEFAULT_COORDINATES.latitude,
        DEFAULT_COORDINATES.longitude
      );

      const weatherData = this.transformOpenWeatherResponse(response);
      await this.saveToCache(WEATHER_CACHE_KEY, [weatherData]);
      
      return [weatherData];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      console.log('[Weather] Falling back to mock data');
      return WEATHER_DATA;
    }
  }

  /**
   * Get weather for specific location
   */
  async getWeatherForLocation(location: string): Promise<WeatherData | null> {
    try {
      if (!this.useRealApis) {
        const weather = getWeatherByLocation(location);
        return weather || null;
      }

      // For real API, we'd need to geocode the location first
      // For now, use default coordinates
      const allWeather = await this.getAllWeather();
      return allWeather[0] || null;
    } catch (error) {
      console.error(`Error fetching weather for ${location}:`, error);
      return getWeatherByLocation(location);
    }
  }

  /**
   * Get weather by coordinates
   */
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      if (!this.useRealApis) {
        console.log('[Weather] Using mock data');
        return WEATHER_DATA[0] || null;
      }

      console.log(`[Weather] Fetching weather for coordinates: ${lat}, ${lon}`);
      const response = await openWeatherApi.getCurrentWeather(lat, lon);
      return this.transformOpenWeatherResponse(response);
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      return WEATHER_DATA[0] || null;
    }
  }

  /**
   * Get all PSI data
   */
  async getAllPSI(): Promise<PSIData[]> {
    try {
      if (!this.useRealApis) {
        console.log('[PSI] Using mock data');
        return PSI_DATA;
      }

      // Try to get from cache first
      const cached = await this.getFromCache<PSIData[]>(PSI_CACHE_KEY);
      if (cached) {
        console.log('[PSI] Returning cached data');
        return cached;
      }

      // Fetch from real API
      console.log('[PSI] Fetching from Air Quality API');
      const response = await airQualityApi.getAirQuality(
        DEFAULT_COORDINATES.latitude,
        DEFAULT_COORDINATES.longitude
      );

      const psiData = this.transformAirQualityResponse(response);
      await this.saveToCache(PSI_CACHE_KEY, [psiData]);
      
      return [psiData];
    } catch (error) {
      console.error('Error fetching PSI data:', error);
      console.log('[PSI] Falling back to mock data');
      return PSI_DATA;
    }
  }

  /**
   * Get PSI for specific location
   */
  async getPSIForLocation(location: string): Promise<PSIData | null> {
    try {
      if (!this.useRealApis) {
        const psi = getPSIByLocation(location);
        return psi || null;
      }

      const allPSI = await this.getAllPSI();
      return allPSI[0] || null;
    } catch (error) {
      console.error(`Error fetching PSI for ${location}:`, error);
      return getPSIByLocation(location);
    }
  }

  /**
   * Get PSI by coordinates
   */
  async getPSIByCoordinates(lat: number, lon: number): Promise<PSIData | null> {
    try {
      if (!this.useRealApis) {
        console.log('[PSI] Using mock data');
        return PSI_DATA[0] || null;
      }

      console.log(`[PSI] Fetching air quality for coordinates: ${lat}, ${lon}`);
      const response = await airQualityApi.getAirQuality(lat, lon);
      return this.transformAirQualityResponse(response);
    } catch (error) {
      console.error('Error fetching PSI by coordinates:', error);
      return PSI_DATA[0] || null;
    }
  }

  /**
   * Check if any locations have concerning PSI levels
   */
  async getUnhealthyPSILocations(): Promise<PSIData[]> {
    try {
      const allPSI = await this.getAllPSI();
      return allPSI.filter(psi => shouldAlertForPSI(psi));
    } catch (error) {
      console.error('Error filtering unhealthy PSI:', error);
      return [];
    }
  }

  /**
   * Check if any locations have severe weather
   */
  async getSevereWeatherLocations(): Promise<WeatherData[]> {
    try {
      const allWeather = await this.getAllWeather();
      return allWeather.filter(weather => shouldAlertForWeather(weather));
    } catch (error) {
      console.error('Error filtering severe weather:', error);
      return [];
    }
  }

  /**
   * Get combined weather and PSI for a location
   */
  async getLocationConditions(location: string): Promise<{
    weather: WeatherData | null;
    psi: PSIData | null;
  }> {
    const [weather, psi] = await Promise.all([
      this.getWeatherForLocation(location),
      this.getPSIForLocation(location),
    ]);

    return { weather, psi };
  }

  /**
   * Check if location should receive weather alert
   */
  async shouldAlertForLocationWeather(location: string): Promise<boolean> {
    const weather = await this.getWeatherForLocation(location);
    return weather ? shouldAlertForWeather(weather) : false;
  }

  /**
   * Check if location should receive PSI alert
   */
  async shouldAlertForLocationPSI(location: string): Promise<boolean> {
    const psi = await this.getPSIForLocation(location);
    return psi ? shouldAlertForPSI(psi) : false;
  }

  /**
   * Transform OpenWeatherMap API response to our WeatherData format
   */
  private transformOpenWeatherResponse(response: any): WeatherData {
    const temp = response.main?.temp || 0;
    const humidity = response.main?.humidity || 0;
    const windSpeed = response.wind?.speed || 0;
    const description = response.weather?.[0]?.description || 'Unknown';

    // Determine condition based on weather code
    let condition: 'clear' | 'cloudy' | 'rainy' | 'stormy' = 'clear';
    const weatherId = response.weather?.[0]?.id || 800;
    
    if (weatherId >= 200 && weatherId < 300) condition = 'stormy';
    else if (weatherId >= 300 && weatherId < 600) condition = 'rainy';
    else if (weatherId >= 801 && weatherId < 900) condition = 'cloudy';

    return {
      id: String(response.id || Date.now()),
      location: response.name || 'Unknown',
      temperature: Math.round(temp),
      condition,
      description: description.charAt(0).toUpperCase() + description.slice(1),
      humidity,
      windSpeed: Math.round(windSpeed * 3.6), // Convert m/s to km/h
      rainfall: 0, // OpenWeatherMap doesn't always provide this
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Transform Air Quality API response to our PSIData format
   */
  private transformAirQualityResponse(response: any): PSIData {
    const aqi = response.data?.aqi || 0;
    
    // Determine level based on AQI value
    let level: 'good' | 'moderate' | 'unhealthy' | 'hazardous' = 'good';
    if (aqi > 300) level = 'hazardous';
    else if (aqi > 150) level = 'unhealthy';
    else if (aqi > 50) level = 'moderate';

    // Extract pollutant data
    const pollutants = response.data?.iaqi || {};
    
    return {
      id: String(response.data?.idx || Date.now()),
      location: response.data?.city?.name || 'Unknown',
      psiValue: aqi,
      level,
      pollutants: {
        pm25: pollutants.pm25?.v || 0,
        pm10: pollutants.pm10?.v || 0,
        o3: pollutants.o3?.v || 0,
        no2: pollutants.no2?.v || 0,
        so2: pollutants.so2?.v || 0,
        co: pollutants.co?.v || 0,
      },
      lastUpdated: response.data?.time?.iso || new Date().toISOString(),
      healthRecommendations: this.getHealthRecommendations(level),
    };
  }

  /**
   * Get health recommendations based on PSI level
   */
  private getHealthRecommendations(level: string): string[] {
    switch (level) {
      case 'good':
        return [
          'Air quality is satisfactory',
          'Normal outdoor activities recommended',
        ];
      case 'moderate':
        return [
          'Unusually sensitive people should limit outdoor exertion',
          'General public can continue normal activities',
        ];
      case 'unhealthy':
        return [
          'Everyone should limit prolonged outdoor exertion',
          'Sensitive groups should avoid outdoor activities',
          'Wear N95 masks if going outside',
        ];
      case 'hazardous':
        return [
          'Everyone should avoid all outdoor exertion',
          'Stay indoors and keep windows closed',
          'Use air purifiers if available',
          'Wear N95 masks if must go outside',
        ];
      default:
        return ['Check local advisories'];
    }
  }

  /**
   * Generic cache storage
   */
  private async saveToCache<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`Error saving to cache (${key}):`, error);
    }
  }

  /**
   * Generic cache retrieval
   */
  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp }: CachedData<T> = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }

      return null;
    } catch (error) {
      console.error(`Error retrieving from cache (${key}):`, error);
      return null;
    }
  }
}

export const weatherService = WeatherService.getInstance();
