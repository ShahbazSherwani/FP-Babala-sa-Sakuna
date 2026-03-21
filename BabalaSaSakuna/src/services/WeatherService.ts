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
import { locationService } from './LocationService';

const WEATHER_CACHE_KEY = '@babala_weather_cache';
const PSI_CACHE_KEY = '@babala_psi_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Default Philippines coordinates (Manila)
const DEFAULT_COORDINATES = {
  latitude: 14.5995,
  longitude: 120.9842,
};

// Philippines geographic bounding box
const PH_BOUNDS = {
  minLat: 4.5,  maxLat: 21.5,
  minLon: 116.0, maxLon: 127.0,
};

/**
 * Returns true if coordinates are within the Philippines.
 * Emulator default location (Mountain View, CA) will fail this check
 * and fall back to Manila.
 */
function isWithinPhilippines(lat: number, lon: number): boolean {
  return (
    lat >= PH_BOUNDS.minLat && lat <= PH_BOUNDS.maxLat &&
    lon >= PH_BOUNDS.minLon && lon <= PH_BOUNDS.maxLon
  );
}

/**
 * Returns Philippines-safe coordinates.
 * Falls back to Manila if coords are outside PH (e.g. emulator fake location).
 */
function safeCoords(lat: number, lon: number): { latitude: number; longitude: number } {
  if (isWithinPhilippines(lat, lon)) {
    return { latitude: lat, longitude: lon };
  }
  console.log(`[Weather] Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)}) outside Philippines — using Manila`);
  return DEFAULT_COORDINATES;
}

export interface WeatherAlert {
  id: string;
  type: 'weather' | 'air_quality';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  location: string;
  timestamp: string;
}

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

      // Get Philippines-safe coordinates (falls back to Manila for emulator/fake GPS)
      const coords = await this.getPhilippinesCoords();

      console.log(`[Weather] Fetching for ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      const response = await openWeatherApi.getCurrentWeather(coords.latitude, coords.longitude);
      if (!response) throw new Error('Empty weather response');

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

      const coords = safeCoords(lat, lon);
      console.log(`[Weather] Fetching weather for: ${coords.latitude}, ${coords.longitude}`);
      const response = await openWeatherApi.getCurrentWeather(coords.latitude, coords.longitude);
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

      // Get Philippines-safe coordinates (falls back to Manila for emulator/fake GPS)
      const coords = await this.getPhilippinesCoords();
      // Query WAQI by nearest PH city name — geo endpoint returns nearest global station
      // which can be outside PH (e.g. Taiwan). City lookup ensures PH data.
      const city = this.getNearestPHCity(coords.latitude, coords.longitude);

      console.log(`[PSI] Fetching air quality for city: ${city}`);
      const response = await airQualityApi.getAirQualityByCity(city);
      if (!response) throw new Error('Empty PSI response');

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

      const coords = safeCoords(lat, lon);
      const city = this.getNearestPHCity(coords.latitude, coords.longitude);
      console.log(`[PSI] Fetching air quality for city: ${city}`);
      const response = await airQualityApi.getAirQualityByCity(city);
      return response ? this.transformAirQualityResponse(response) : PSI_DATA[0];
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
   * Get real-time disaster / weather alerts based on live data.
   * Uses current weather condition codes + AQI values to infer severity.
   * Works with the free OpenWeatherMap plan — no One Call API needed.
   */
  async getWeatherAlerts(lat?: number, lon?: number): Promise<WeatherAlert[]> {
    const raw = {
      lat: lat ?? DEFAULT_COORDINATES.latitude,
      lon: lon ?? DEFAULT_COORDINATES.longitude,
    };
    // Clamp to Philippines — emulator fake GPS (Mountain View CA etc.) falls back to Manila
    const safe = safeCoords(raw.lat, raw.lon);
    const coords = { lat: safe.latitude, lon: safe.longitude };
    const alerts: WeatherAlert[] = [];

    // --- Weather-based alerts ---
    try {
      console.log('[Alerts] Checking weather conditions...');
      const response = await openWeatherApi.getCurrentWeather(coords.lat, coords.lon);
      const weatherId: number = response.weather?.[0]?.id ?? 800;
      const location: string = response.name ?? 'Your area';
      const description: string = response.weather?.[0]?.description ?? '';
      const windSpeed: number = (response.wind?.speed ?? 0) * 3.6; // m/s → km/h

      const weatherAlert = this.buildWeatherAlert(weatherId, description, windSpeed, location);
      if (weatherAlert) alerts.push(weatherAlert);
    } catch (err) {
      console.warn('[Alerts] Could not fetch weather alert conditions:', err);
    }

    // --- Air quality alerts ---
    try {
      console.log('[Alerts] Checking air quality...');
      const response = await airQualityApi.getAirQuality(coords.lat, coords.lon);
      const aqi: number = response.data?.aqi ?? 0;
      const location: string = response.data?.city?.name ?? 'Your area';

      if (aqi > 200) {
        alerts.push({
          id: `aqi-${Date.now()}`,
          type: 'air_quality',
          severity: 'extreme',
          title: '🟤 Very Unhealthy Air Quality',
          description: `AQI is ${aqi} in ${location}. Avoid all outdoor activity. Wear N95 mask if going outside.`,
          location,
          timestamp: new Date().toISOString(),
        });
      } else if (aqi > 150) {
        alerts.push({
          id: `aqi-${Date.now()}`,
          type: 'air_quality',
          severity: 'high',
          title: '🔴 Unhealthy Air Quality',
          description: `AQI is ${aqi} in ${location}. Sensitive groups should stay indoors.`,
          location,
          timestamp: new Date().toISOString(),
        });
      } else if (aqi > 100) {
        alerts.push({
          id: `aqi-${Date.now()}`,
          type: 'air_quality',
          severity: 'medium',
          title: '🟠 Moderate Air Quality Warning',
          description: `AQI is ${aqi} in ${location}. Limit prolonged outdoor exertion.`,
          location,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('[Alerts] Could not fetch air quality conditions:', err);
    }

    console.log(`[Alerts] Found ${alerts.length} active alert(s)`);
    return alerts;
  }

  /**
   * Map OpenWeatherMap condition code + wind speed to a structured alert.
   * Condition codes: https://openweathermap.org/weather-conditions
   */
  private buildWeatherAlert(
    id: number,
    description: string,
    windSpeedKph: number,
    location: string
  ): WeatherAlert | null {
    const desc = description.charAt(0).toUpperCase() + description.slice(1);

    // Extreme: tornado, tropical storm, hurricane
    if (id === 781 || id === 900 || id === 902) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        severity: 'extreme',
        title: '🌀 EXTREME WEATHER — Evacuate if advised',
        description: `${desc} detected near ${location}. Follow official evacuation orders immediately.`,
        location,
        timestamp: new Date().toISOString(),
      };
    }

    // Severe: heavy thunderstorm
    if (id >= 200 && id <= 232) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        severity: 'high',
        title: '⛈️ Thunderstorm Warning',
        description: `${desc} in ${location}. Stay indoors, avoid low-lying areas.`,
        location,
        timestamp: new Date().toISOString(),
      };
    }

    // Heavy rain (502, 503, 504, 522, 531)
    if ([502, 503, 504, 522, 531].includes(id)) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        severity: 'high',
        title: '🌧️ Heavy Rain Warning',
        description: `${desc} in ${location}. Risk of flash floods. Avoid low-lying areas.`,
        location,
        timestamp: new Date().toISOString(),
      };
    }

    // Moderate rain (501) or strong winds
    if (id === 501 || windSpeedKph > 60) {
      return {
        id: `weather-${Date.now()}`,
        type: 'weather',
        severity: 'medium',
        title: '🌦️ Weather Advisory',
        description: windSpeedKph > 60
          ? `Strong winds (${Math.round(windSpeedKph)} km/h) in ${location}. Secure loose objects outdoors.`
          : `${desc} in ${location}. Take caution when travelling.`,
        location,
        timestamp: new Date().toISOString(),
      };
    }

    // No severe alert
    return null;
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
   * Map coordinates to the nearest Philippine city with a WAQI monitoring station.
   * WAQI city-name lookup guarantees a PH result unlike the geo endpoint.
   */
  private getNearestPHCity(lat: number, lon: number): string {
    // Major PH cities with WAQI stations and their approximate centres
    const stations: { city: string; lat: number; lon: number }[] = [
      { city: 'manila',      lat: 14.5995, lon: 120.9842 },
      { city: 'quezon-city', lat: 14.6760, lon: 121.0437 },
      { city: 'cebu',        lat: 10.3157, lon: 123.8854 },
      { city: 'davao',       lat:  7.1907, lon: 125.4553 },
      { city: 'zamboanga',   lat:  6.9214, lon: 122.0790 },
    ];

    let nearest = stations[0];
    let minDist = Infinity;
    for (const s of stations) {
      const d = Math.hypot(s.lat - lat, s.lon - lon);
      if (d < minDist) { minDist = d; nearest = s; }
    }
    return nearest.city;
  }

  /**
   * Get the user's GPS location clamped to Philippines bounds.
   * Emulator fake GPS (Mountain View CA etc.) falls back to Manila.
   */
  private async getPhilippinesCoords(): Promise<{ latitude: number; longitude: number }> {
    try {
      const loc = await locationService.getCurrentLocation();
      return safeCoords(loc.coords.latitude, loc.coords.longitude);
    } catch {
      // Location permission denied or unavailable — use Manila
      return DEFAULT_COORDINATES;
    }
  }

  /**
   * Clear weather and PSI cache (call after changing location or API keys)
   */
  async clearCache(): Promise<void> {
    await AsyncStorage.multiRemove([WEATHER_CACHE_KEY, PSI_CACHE_KEY]);
    console.log('[Weather] Cache cleared');
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
