import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SeverityLevel, SEVERITY_COLORS, SEVERITY_LABELS } from '../types';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'small' | 'normal';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'normal' }) => {
  const color = SEVERITY_COLORS[severity];
  const label = SEVERITY_LABELS[severity];
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }, isSmall && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: color }, isSmall && styles.dotSmall]} />
      <Text style={[styles.label, { color }, isSmall && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 10,
  },
});

export default SeverityBadge;
