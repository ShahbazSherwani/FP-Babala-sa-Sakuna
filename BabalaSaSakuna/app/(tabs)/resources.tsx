import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResourceCard } from '../../src/components';
import { resourceService } from '../../src/services';
import { Resource, ResourceType } from '../../src/types';

export default function ResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');

  useEffect(() => {
    loadResources();
  }, [selectedType]);

  const loadResources = () => {
    if (selectedType === 'all') {
      setResources(resourceService.getAllResources());
    } else {
      setResources(resourceService.getResourcesByType(selectedType));
    }
  };

  const resourceTypes: Array<{ type: ResourceType | 'all'; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
    { type: 'all', label: 'All', icon: 'view-grid' },
    { type: 'shelter', label: 'Shelters', icon: 'home-roof' },
    { type: 'evacuation_center', label: 'Evacuation', icon: 'run' },
    { type: 'hospital', label: 'Hospitals', icon: 'hospital-box' },
    { type: 'fire_station', label: 'Fire', icon: 'fire-truck' },
    { type: 'police_station', label: 'Police', icon: 'shield-account' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="map-marker-multiple" size={32} color="#2563eb" />
          <Text style={styles.title}>Resource Hub</Text>
        </View>
        <Text style={styles.subtitle}>
          Find emergency services and shelters near you
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {resourceTypes.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.filterChip,
              selectedType === item.type && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(item.type)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={18}
              color={selectedType === item.type ? '#fff' : '#64748b'}
            />
            <Text
              style={[
                styles.filterText,
                selectedType === item.type && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resource List */}
      <ScrollView style={styles.listContainer}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {resources.length} {resources.length === 1 ? 'resource' : 'resources'} found
          </Text>
        </View>

        {resources.length > 0 ? (
          <View style={styles.list}>
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="map-marker-off" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No resources found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={20} color="#2563eb" />
          <Text style={styles.infoText}>
            Tap "Call" to contact directly or "Directions" to navigate using your maps app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#eff6ff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
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
