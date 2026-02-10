import { WeatherData, PSIData } from '../types';

// Mock weather data for Philippine cities
export const WEATHER_DATA: WeatherData[] = [
  {
    location: 'Manila',
    temperature: 32,
    humidity: 75,
    rainfall: 12,
    windSpeed: 15,
    condition: 'Partly Cloudy',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Quezon City',
    temperature: 31,
    humidity: 78,
    rainfall: 8,
    windSpeed: 12,
    condition: 'Rainy',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Cebu City',
    temperature: 30,
    humidity: 72,
    rainfall: 0,
    windSpeed: 10,
    condition: 'Clear',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Davao City',
    temperature: 29,
    humidity: 80,
    rainfall: 5,
    windSpeed: 8,
    condition: 'Light Rain',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Makati',
    temperature: 33,
    humidity: 68,
    rainfall: 0,
    windSpeed: 14,
    condition: 'Sunny',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Pasig',
    temperature: 31,
    humidity: 76,
    rainfall: 15,
    windSpeed: 11,
    condition: 'Heavy Rain',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Taguig',
    temperature: 32,
    humidity: 74,
    rainfall: 3,
    windSpeed: 13,
    condition: 'Cloudy',
    lastUpdated: new Date().toISOString(),
  },
];

// Mock PSI data for Philippine locations
export const PSI_DATA: PSIData[] = [
  {
    location: 'Manila',
    psiValue: 85,
    level: 'moderate',
    healthAdvice: 'Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor activities.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Quezon City',
    psiValue: 125,
    level: 'unhealthy',
    healthAdvice: 'Everyone may begin to experience health effects. Sensitive groups should avoid prolonged outdoor activities.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Cebu City',
    psiValue: 45,
    level: 'good',
    healthAdvice: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Davao City',
    psiValue: 32,
    level: 'good',
    healthAdvice: 'Air quality is excellent. Ideal conditions for outdoor activities.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Makati',
    psiValue: 165,
    level: 'unhealthy',
    healthAdvice: 'Health effects may be experienced by everyone. Sensitive groups should avoid all outdoor activities.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Pasig',
    psiValue: 220,
    level: 'very_unhealthy',
    healthAdvice: 'Health alert! Everyone should avoid prolonged outdoor activities. Sensitive groups should remain indoors.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Taguig',
    psiValue: 95,
    level: 'moderate',
    healthAdvice: 'Air quality is acceptable for most people. Sensitive individuals should watch for symptoms.',
    lastUpdated: new Date().toISOString(),
  },
  {
    location: 'Pasay',
    psiValue: 350,
    level: 'hazardous',
    healthAdvice: 'Health warning: Everyone should avoid all outdoor activities. Stay indoors and keep windows closed.',
    lastUpdated: new Date().toISOString(),
  },
];

// Helper function to get weather by location
export const getWeatherByLocation = (location: string): WeatherData | undefined => {
  return WEATHER_DATA.find(w => w.location.toLowerCase() === location.toLowerCase());
};

// Helper function to get PSI by location
export const getPSIByLocation = (location: string): PSIData | undefined => {
  return PSI_DATA.find(p => p.location.toLowerCase() === location.toLowerCase());
};

// Helper function to check if PSI level requires alert
export const shouldAlertForPSI = (psiValue: number): boolean => {
  return psiValue > 100; // Alert when unhealthy or worse
};

// Helper function to check if weather conditions require alert
export const shouldAlertForWeather = (weather: WeatherData): boolean => {
  return weather.rainfall > 10 || weather.windSpeed > 60; // Heavy rain or strong winds
};
