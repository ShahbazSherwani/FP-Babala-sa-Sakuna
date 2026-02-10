import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getWeatherIcon = (condition: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('rainy')) {
      return 'weather-rainy';
    } else if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'weather-sunny';
    } else if (conditionLower.includes('cloud')) {
      return 'weather-cloudy';
    } else if (conditionLower.includes('storm')) {
      return 'weather-lightning';
    }
    return 'weather-partly-cloudy';
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#2563eb" />
          <Text style={styles.location}>{weather.location}</Text>
        </View>
        <Text style={styles.updateTime}>
          Updated: {formatTime(weather.lastUpdated)}
        </Text>
      </View>

      <View style={styles.mainInfo}>
        <View style={styles.temperatureSection}>
          <MaterialCommunityIcons
            name={getWeatherIcon(weather.condition)}
            size={64}
            color="#3b82f6"
          />
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
        </View>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="water-percent" size={20} color="#64748b" />
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="weather-pouring" size={20} color="#64748b" />
          <Text style={styles.detailLabel}>Rainfall</Text>
          <Text style={styles.detailValue}>{weather.rainfall}mm</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="weather-windy" size={20} color="#64748b" />
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weather.windSpeed}km/h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  updateTime: {
    fontSize: 12,
    color: '#64748b',
  },
  mainInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  condition: {
    fontSize: 18,
    color: '#475569',
    marginTop: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});
