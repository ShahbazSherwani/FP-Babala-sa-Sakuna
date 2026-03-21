import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiKeys, apiEndpoints, features } from '../config/firebase.config';

/**
 * Generic API Client
 * Handles HTTP requests with error handling and retry logic
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.maxRetries = 3;

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[API] Response error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request with retry logic
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(() => this.axiosInstance.get(url, config));
  }

  /**
   * POST request with retry logic
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(() => this.axiosInstance.post(url, data, config));
  }

  /**
   * PUT request with retry logic
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(() => this.axiosInstance.put(url, data, config));
  }

  /**
   * DELETE request with retry logic
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(() => this.axiosInstance.delete(url, config));
  }

  /**
   * Request with automatic retry on failure
   */
  private async requestWithRetry<T>(
    requestFn: () => Promise<AxiosResponse>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error: any) {
      // Don't retry on 401 (bad key) or 403 (forbidden) — retrying won't help
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        console.warn(
          `[API] Auth error ${status} — check your API key. Returning null to trigger fallback.`
        );
        return null as unknown as T;
      }
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        console.log(`[API] Retrying request (${retryCount + 1}/${this.maxRetries})...`);
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.requestWithRetry(requestFn, retryCount + 1);
      }
      throw this.handleError(error);
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    );
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.message;
      return new Error(`API Error ${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error: No response from server');
    } else {
      // Request setup error
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * OpenWeatherMap API Client
 */
export class OpenWeatherApiClient extends ApiClient {
  private apiKey: string;

  constructor() {
    super(apiEndpoints.openWeather);
    this.apiKey = apiKeys.openWeather;
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeather(lat: number, lon: number) {
    return this.get('/weather', {
      params: {
        lat,
        lon,
        appid: this.apiKey,
        units: 'metric',
      },
    });
  }

  /**
   * Get 5-day forecast
   */
  async getForecast(lat: number, lon: number) {
    return this.get('/forecast', {
      params: {
        lat,
        lon,
        appid: this.apiKey,
        units: 'metric',
      },
    });
  }

  /**
   * Get weather alerts
   */
  async getWeatherAlerts(lat: number, lon: number) {
    return this.get('/onecall', {
      params: {
        lat,
        lon,
        appid: this.apiKey,
        exclude: 'minutely,hourly',
      },
    });
  }
}

/**
 * Air Quality API Client (World Air Quality Index)
 */
export class AirQualityApiClient extends ApiClient {
  private apiKey: string;

  constructor() {
    super(apiEndpoints.airQuality);
    this.apiKey = apiKeys.airQuality;
  }

  /**
   * Get air quality by coordinates
   * Correct WAQI URL: https://api.waqi.info/feed/geo:{lat};{lon}/?token=TOKEN
   */
  async getAirQuality(lat: number, lon: number) {
    return this.get(`/feed/geo:${lat};${lon}/`, {
      params: {
        token: this.apiKey,
      },
    });
  }

  /**
   * Get air quality by city name
   */
  async getAirQualityByCity(city: string) {
    return this.get(`/feed/${city}`, {
      params: {
        token: this.apiKey,
      },
    });
  }

  /**
   * Search for monitoring stations
   */
  async searchStations(keyword: string) {
    return this.get('/search', {
      params: {
        keyword,
        token: this.apiKey,
      },
    });
  }
}

/**
 * PAGASA API Client (Philippines Weather Agency)
 * Note: PAGASA doesn't have an official public API
 * This is a placeholder for web scraping or alternative data source
 */
export class PagasaApiClient extends ApiClient {
  constructor() {
    super(apiEndpoints.pagasa);
  }

  /**
   * Get PAGASA weather bulletins
   * Note: This would require web scraping or RSS feed parsing
   */
  async getWeatherBulletin() {
    // Placeholder - implement based on available PAGASA data source
    console.log('[PAGASA] Weather bulletin API not yet implemented');
    return {
      message: 'PAGASA API requires custom implementation',
      source: 'https://pubfiles.pagasa.dost.gov.ph/index.html',
    };
  }

  /**
   * Get typhoon information
   */
  async getTyphoonInfo() {
    // Placeholder - implement based on available PAGASA data source
    console.log('[PAGASA] Typhoon info API not yet implemented');
    return {
      message: 'PAGASA typhoon tracking requires custom implementation',
      source: 'https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin',
    };
  }
}

/**
 * Google Maps API Client
 */
export class GoogleMapsApiClient extends ApiClient {
  private apiKey: string;

  constructor() {
    super(apiEndpoints.googleMaps);
    this.apiKey = apiKeys.googleMaps;
  }

  /**
   * Get directions between two points
   */
  async getDirections(origin: string, destination: string, mode: string = 'driving') {
    return this.get('/directions/json', {
      params: {
        origin,
        destination,
        mode,
        key: this.apiKey,
      },
    });
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string) {
    return this.get('/geocode/json', {
      params: {
        address,
        key: this.apiKey,
      },
    });
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lon: number) {
    return this.get('/geocode/json', {
      params: {
        latlng: `${lat},${lon}`,
        key: this.apiKey,
      },
    });
  }

  /**
   * Search nearby places
   */
  async searchNearby(lat: number, lon: number, type: string, radius: number = 5000) {
    return this.get('/place/nearbysearch/json', {
      params: {
        location: `${lat},${lon}`,
        radius,
        type,
        key: this.apiKey,
      },
    });
  }
}

// Export singleton instances
export const openWeatherApi = new OpenWeatherApiClient();
export const airQualityApi = new AirQualityApiClient();
export const pagasaApi = new PagasaApiClient();
export const googleMapsApi = new GoogleMapsApiClient();
