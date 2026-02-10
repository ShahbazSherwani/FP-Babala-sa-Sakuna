import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Resource, RESOURCE_ICONS, RESOURCE_COLORS } from '../types';

interface ResourceCardProps {
  resource: Resource & { distance?: number };
  onPress?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onPress 
}) => {
  const handleCall = () => {
    if (resource.phone) {
      Linking.openURL(`tel:${resource.phone.replace(/[^\d+]/g, '')}`);
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${resource.coordinates.latitude},${resource.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const iconName = RESOURCE_ICONS[resource.type];
  const iconColor = RESOURCE_COLORS[resource.type];

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <MaterialCommunityIcons 
          name={iconName as any} 
          size={32} 
          color={iconColor} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {resource.name}
          </Text>
          {resource.distance !== undefined && (
            <View style={styles.distanceBadge}>
              <MaterialCommunityIcons name="map-marker-distance" size={14} color="#64748b" />
              <Text style={styles.distance}>
                {resource.distance.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>

        <View style={styles.addressRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#64748b" />
          <Text style={styles.address} numberOfLines={2}>
            {resource.address}
          </Text>
        </View>

        {resource.services && resource.services.length > 0 && (
          <View style={styles.servicesRow}>
            <MaterialCommunityIcons name="check-circle" size={14} color="#10b981" />
            <Text style={styles.services} numberOfLines={1}>
              {resource.services.join(' • ')}
            </Text>
          </View>
        )}

        {resource.capacity && (
          <View style={styles.capacityRow}>
            <MaterialCommunityIcons name="account-group" size={14} color="#64748b" />
            <Text style={styles.capacity}>
              Capacity: {resource.capacity} people
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {resource.phone && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleCall}
            >
              <MaterialCommunityIcons name="phone" size={18} color="#2563eb" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleDirections}
          >
            <MaterialCommunityIcons name="directions" size={18} color="#2563eb" />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>

          {resource.operational24_7 && (
            <View style={styles.badge24}>
              <Text style={styles.badge24Text}>24/7</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  services: {
    flex: 1,
    fontSize: 12,
    color: '#10b981',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  capacity: {
    fontSize: 12,
    color: '#64748b',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563eb',
  },
  badge24: {
    marginLeft: 'auto',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badge24Text: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});
