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
import { Alert as AlertType, FilterOption } from '../../src/types';
import { alertService } from '../../src/services';
import { AlertCard, FilterChips } from '../../src/components';

export default function DashboardScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

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
        <Text style={styles.appTitle}>Babala sa Sakuna</Text>
        <Text style={styles.subtitle}>
          {activeCount} Active {activeCount === 1 ? 'Alert' : 'Alerts'}
        </Text>
      </View>
      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>No Active Alerts</Text>
      <Text style={styles.emptyText}>
        No alerts match the selected filter. Try selecting a different category.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
