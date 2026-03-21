import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherCard, PSIIndicator } from '../../src/components';
import { weatherService } from '../../src/services';
import { alertPollingService } from '../../src/services/AlertPollingService';
import { WeatherAlert } from '../../src/services/WeatherService';
import { WeatherData, PSIData } from '../../src/types';
import { localizationService } from '../../src/services/LocalizationService';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [psi, setPsi] = useState<PSIData[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingAlerts, setCheckingAlerts] = useState(false);

  const loadData = async (clearFirst = false) => {
    try {
      // Clear stale cache when explicitly refreshing
      if (clearFirst) await weatherService.clearCache();
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

  const checkAlerts = async () => {
    setCheckingAlerts(true);
    try {
      const liveAlerts = await alertPollingService.checkNow();
      setAlerts(liveAlerts);
      if (liveAlerts.length === 0) {
        Alert.alert(`✅ ${localizationService.t('weather.allClear')}`, localizationService.t('weather.allClearDesc'));
      }
    } catch (err) {
      Alert.alert('Error', localizationService.t('weather.error'));
    } finally {
      setCheckingAlerts(false);
    }
  };

  useEffect(() => {
    loadData(true); // clear stale cache on first open
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true); // always fetch fresh on manual pull-to-refresh
  };

  const severityColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme': return '#dc2626';
      case 'high':    return '#ea580c';
      case 'medium':  return '#d97706';
      default:        return '#2563eb';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>{localizationService.t('weather.loading')}</Text>
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
          <Text style={styles.title}>{localizationService.t('weather.title')}</Text>
        </View>
        <Text style={styles.subtitle}>
          {localizationService.t('weather.subtitle')}
        </Text>
      </View>

      {/* Air Quality Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="air-filter" size={24} color="#1e293b" />
          <Text style={styles.sectionTitle}>{localizationService.t('weather.airQuality')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {localizationService.t('weather.airQualityDesc')}
        </Text>

        {psi.length > 0 ? (
          psi.map((item) => (
            <PSIIndicator key={item.location} psi={item} showDetails />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cloud-off-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>{localizationService.t('weather.noPSI')}</Text>
          </View>
        )}
      </View>

      {/* Weather Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="weather-cloudy" size={24} color="#1e293b" />
          <Text style={styles.sectionTitle}>{localizationService.t('weather.currentWeather')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {localizationService.t('weather.currentWeatherDesc')}
        </Text>

        {weather.length > 0 ? (
          weather.map((item) => (
            <WeatherCard key={item.location} weather={item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cloud-off-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>{localizationService.t('weather.noWeather')}</Text>
          </View>
        )}
      </View>

      {/* Active Disaster Alerts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#dc2626" />
          <Text style={styles.sectionTitle}>{localizationService.t('weather.disasterAlerts')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {localizationService.t('weather.disasterAlertsDesc')}
        </Text>

        <TouchableOpacity
          style={[styles.checkButton, checkingAlerts && styles.checkButtonDisabled]}
          onPress={checkAlerts}
          disabled={checkingAlerts}
        >
          {checkingAlerts ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="radar" size={20} color="#fff" />
          )}
          <Text style={styles.checkButtonText}>
            {checkingAlerts ? localizationService.t('weather.checking') : localizationService.t('weather.checkAlerts')}
          </Text>
        </TouchableOpacity>

        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <View
              key={alert.id}
              style={[styles.alertCard, { borderLeftColor: severityColor(alert.severity) }]}
            >
              <Text style={[styles.alertTitle, { color: severityColor(alert.severity) }]}>
                {alert.title}
              </Text>
              <Text style={styles.alertDesc}>{alert.description}</Text>
              <Text style={styles.alertMeta}>
                📍 {alert.location} · {new Date(alert.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noAlerts}>
            <MaterialCommunityIcons name="shield-check" size={36} color="#22c55e" />
            <Text style={styles.noAlertsText}>{localizationService.t('weather.noAlerts')}</Text>
          </View>
        )}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information" size={20} color="#2563eb" />
        <Text style={styles.infoText}>
          Data updates every 30 minutes. Pull down to refresh manually. Alerts are checked automatically every 15 minutes.
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
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  checkButtonDisabled: {
    backgroundColor: '#f87171',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    marginBottom: 6,
  },
  alertMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  noAlerts: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  noAlertsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#16a34a',
  },
});
