import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge, BADGE_COLORS } from '../types';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badge, 
  size = 'medium' 
}) => {
  const dimensions = {
    small: { container: 60, icon: 24, name: 10, desc: 0 },
    medium: { container: 90, icon: 36, name: 12, desc: 10 },
    large: { container: 120, icon: 48, name: 14, desc: 11 },
  };

  const dim = dimensions[size];
  const badgeColor = BADGE_COLORS[badge.category];

  return (
    <View style={[styles.container, { width: dim.container }]}>
      <View
        style={[
          styles.iconContainer,
          {
            width: dim.container,
            height: dim.container,
            backgroundColor: badge.isEarned ? `${badgeColor}20` : '#f1f5f9',
            borderColor: badge.isEarned ? badgeColor : '#cbd5e1',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={badge.icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={dim.icon}
          color={badge.isEarned ? badgeColor : '#94a3b8'}
        />
        {badge.isEarned && (
          <View style={styles.checkmark}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
          </View>
        )}
      </View>

      {dim.name > 0 && (
        <Text
          style={[
            styles.name,
            { fontSize: dim.name },
            !badge.isEarned && styles.nameDisabled,
          ]}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
      )}

      {dim.desc > 0 && size !== 'small' && (
        <Text
          style={[
            styles.description,
            { fontSize: dim.desc },
            !badge.isEarned && styles.descriptionDisabled,
          ]}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
  },
  iconContainer: {
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  name: {
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  nameDisabled: {
    color: '#94a3b8',
  },
  description: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  descriptionDisabled: {
    color: '#cbd5e1',
  },
});
