import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PSIData, PSI_COLORS } from '../types';

interface PSIIndicatorProps {
  psi: PSIData;
  showDetails?: boolean;
}

export const PSIIndicator: React.FC<PSIIndicatorProps> = ({ 
  psi, 
  showDetails = true 
}) => {
  const getLevelText = (level: string): string => {
    const levels: Record<string, string> = {
      good: 'Good',
      moderate: 'Moderate',
      unhealthy: 'Unhealthy',
      very_unhealthy: 'Very Unhealthy',
      hazardous: 'Hazardous',
    };
    return levels[level] || level;
  };

  const getIcon = (level: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    if (level === 'good') return 'emoticon-happy';
    if (level === 'moderate') return 'emoticon-neutral';
    if (level === 'unhealthy') return 'emoticon-sad';
    if (level === 'very_unhealthy') return 'emoticon-angry';
    return 'alert-circle';
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const backgroundColor = PSI_COLORS[psi.level];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
          <Text style={styles.location}>{psi.location}</Text>
        </View>
        <Text style={styles.updateTime}>
          {formatTime(psi.lastUpdated)}
        </Text>
      </View>

      <View style={styles.mainInfo}>
        <MaterialCommunityIcons
          name={getIcon(psi.level)}
          size={48}
          color="#fff"
        />
        <View style={styles.valueContainer}>
          <Text style={styles.psiValue}>{psi.psiValue}</Text>
          <Text style={styles.psiLabel}>PSI</Text>
        </View>
      </View>

      <Text style={styles.levelText}>{getLevelText(psi.level)}</Text>

      {showDetails && (
        <View style={styles.adviceContainer}>
          <MaterialCommunityIcons name="information" size={16} color="#fff" />
          <Text style={styles.advice}>{psi.healthAdvice}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  updateTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 12,
  },
  valueContainer: {
    alignItems: 'center',
  },
  psiValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  psiLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: -4,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  advice: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
  },
});
