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

const WEATHER_CACHE_KEY = '@babala_weather_cache';
const PSI_CACHE_KEY = '@babala_psi_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export class WeatherService {
  private static instance: WeatherService;

  private constructor() {}

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
      // In a real app, this would fetch from an API
      // For now, return mock data
      return WEATHER_DATA;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return [];
    }
  }

  /**
   * Get weather for specific location
   */
  async getWeatherForLocation(location: string): Promise<WeatherData | null> {
    try {
      const weather = getWeatherByLocation(location);
      return weather || null;
    } catch (error) {
      console.error(`Error fetching weather for ${location}:`, error);
      return null;
    }
  }

  /**
   * Get all PSI data
   */
  async getAllPSI(): Promise<PSIData[]> {
    try {
      // In a real app, this would fetch from an API
      // For now, return mock data
      return PSI_DATA;
    } catch (error) {
      console.error('Error fetching PSI data:', error);
      return [];
    }
  }

  /**
   * Get PSI for specific location
   */
  async getPSIForLocation(location: string): Promise<PSIData | null> {
    try {
      const psi = getPSIByLocation(location);
      return psi || null;
    } catch (error) {
      console.error(`Error fetching PSI for ${location}:`, error);
      return null;
    }
  }

  /**
   * Check if any locations have concerning PSI levels
   */
  async getUnhealthyPSILocations(): Promise<PSIData[]> {
    try {
      const allPSI = await this.getAllPSI();
      return allPSI.filter(psi => shouldAlertForPSI(psi.psiValue));
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
   * Cache weather data locally
   */
  private async cacheWeatherData(data: WeatherData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        WEATHER_CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error caching weather data:', error);
    }
  }

  /**
   * Cache PSI data locally
   */
  private async cachePSIData(data: PSIData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        PSI_CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error caching PSI data:', error);
    }
  }

  /**
   * Get cached weather data if still valid
   */
  private async getCachedWeather(): Promise<WeatherData[] | null> {
    try {
      const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving cached weather:', error);
      return null;
    }
  }

  /**
   * Get cached PSI data if still valid
   */
  private async getCachedPSI(): Promise<PSIData[] | null> {
    try {
      const cached = await AsyncStorage.getItem(PSI_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error retrieving cached PSI:', error);
      return null;
    }
  }
}

export const weatherService = WeatherService.getInstance();
