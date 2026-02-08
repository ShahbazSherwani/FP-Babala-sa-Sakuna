import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, SEVERITY_COLORS, CATEGORY_ICONS } from '../types';
import SeverityBadge from './SeverityBadge';

interface AlertCardProps {
  alert: Alert;
  onPress: (alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress }) => {
  const borderColor = SEVERITY_COLORS[alert.severity];
  const iconName = CATEGORY_ICONS[alert.category];

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={() => onPress(alert)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={iconName as any}
            size={24}
            color={borderColor}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {alert.title}
          </Text>
          <Text style={styles.timestamp}>
            Updated {formatTimeAgo(alert.updatedAt)}
          </Text>
        </View>
        <SeverityBadge severity={alert.severity} />
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {alert.description}
      </Text>
      <View style={styles.footer}>
        <MaterialCommunityIcons name="map-marker" size={14} color="#6B7280" />
        <Text style={styles.regions} numberOfLines={1}>
          {alert.affectedRegions.slice(0, 3).join(', ')}
          {alert.affectedRegions.length > 3 &&
            ` +${alert.affectedRegions.length - 3} more`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regions: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
});

export default AlertCard;
