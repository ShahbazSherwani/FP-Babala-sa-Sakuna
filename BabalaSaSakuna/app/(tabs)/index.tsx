import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert as AlertType, FilterOption } from '../../src/types';
import { alertService, localizationService } from '../../src/services';
import { notificationService } from '../../src/services/NotificationService';
import { AlertCard, FilterChips, SeverityGuideModal, LanguageSwitcher } from '../../src/components';

const SEVERITY_GUIDE_KEY = '@babala_severity_guide_shown';

export default function DashboardScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSeverityGuide, setShowSeverityGuide] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    loadAlerts();
    checkFirstLaunch();
    setupNotificationListeners();
  }, []);

  const checkFirstLaunch = async () => {
    const hasSeenGuide = await AsyncStorage.getItem(SEVERITY_GUIDE_KEY);
    if (!hasSeenGuide) {
      // Show guide after a short delay for better UX
      setTimeout(() => setShowSeverityGuide(true), 1000);
    }
  };

  const setupNotificationListeners = () => {
    if (notificationService.isAvailable()) {
      // Handle notification tap
      notificationService.addNotificationResponseListener((response) => {
        const alertId = response.notification.request.content.data.alertId;
        if (alertId) {
          router.push(`/alert/${alertId}`);
        }
      });
    }
  };

  const handleGuideClose = async () => {
    setShowSeverityGuide(false);
    await AsyncStorage.setItem(SEVERITY_GUIDE_KEY, 'true');
  };

  const handleLanguageChange = () => {
    forceUpdate(prev => prev + 1);
  };

  const loadAlerts = useCallback(() => {
    const data = alertService.getAlertsByCategory(activeFilter);
    setAlerts(data);
    setLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    loadAlerts();
  }, [activeFilter, loadAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await alertService.refreshAlerts();
    loadAlerts();
    setRefreshing(false);
  }, [loadAlerts]);

  const handleAlertPress = (alert: AlertType) => {
    router.push(`/alert/${alert.id}`);
  };

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  const activeCount = alertService.getActiveAlertCount();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>{localizationService.t('dashboard.title')}</Text>
        <Text style={styles.subtitle}>
          {activeCount} {localizationService.t(activeCount === 1 ? 'dashboard.activeAlert' : 'dashboard.activeAlerts')}
        </Text>
      </View>
      <View style={styles.languageContainer}>
        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      </View>
      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      {!notificationService.isAvailable() && (
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information" size={16} color="#2563EB" />
          <Text style={styles.infoBannerText}>
            Push notifications require a development build
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>{localizationService.t('dashboard.noAlerts')}</Text>
      <Text style={styles.emptyText}>
        {localizationService.t('dashboard.noAlertsDesc')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>{localizationService.t('dashboard.loadingAlerts')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SeverityGuideModal
        visible={showSeverityGuide}
        onClose={handleGuideClose}
      />
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard alert={item} onPress={handleAlertPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1E3A5F"
            colors={['#1E3A5F']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    backgroundColor: '#1E3A5F',
    paddingBottom: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  languageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 6,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#93C5FD',
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
