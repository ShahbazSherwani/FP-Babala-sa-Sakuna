import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherCard, PSIIndicator } from '../../src/components';
import { weatherService } from '../../src/services';
import { WeatherData, PSIData } from '../../src/types';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [psi, setPsi] = useState<PSIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [weatherData, psiData] = await Promise.all([
        weatherService.getAllWeather(),
        weatherService.getAllPSI(),
      ]);
      setWeather(weatherData);
      setPsi(psiData);
    } catch (error) {
      console.error('Error loading weather/PSI data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading environmental data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color="#2563eb" />
          <Text style={styles.title}>Weather & Air Quality</Text>
        </View>
        <Text style={styles.subtitle}>
          Real-time environmental monitoring across the Philippines
        </Text>
      </View>

      {/* Air Quality Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="air-filter" size={24} color="#1e293b" />
          <Text style={styles.sectionTitle}>Air Quality Index (PSI)</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Monitor pollution levels and protect your health
        </Text>

        {psi.length > 0 ? (
          psi.map((item) => (
            <PSIIndicator key={item.location} psi={item} showDetails />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cloud-off-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No PSI data available</Text>
          </View>
        )}
      </View>

      {/* Weather Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="weather-cloudy" size={24} color="#1e293b" />
          <Text style={styles.sectionTitle}>Current Weather</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Live weather conditions and forecasts
        </Text>

        {weather.length > 0 ? (
          weather.map((item) => (
            <WeatherCard key={item.location} weather={item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cloud-off-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No weather data available</Text>
          </View>
        )}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color="#2563eb" />
        <Text style={styles.infoText}>
          Data updates every 30 minutes. Pull down to refresh manually.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});
