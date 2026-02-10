import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  onPress: () => void;
  isCompleted?: boolean;
}

export const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  onPress,
  isCompleted = false,
}) => {
  const getCategoryIcon = (category: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
      preparedness: 'shield-check',
      survival: 'lifebuoy',
      knowledge: 'book-open-variant',
      community: 'account-group',
    };
    return icons[category] || 'star';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      preparedness: '#2563eb',
      survival: '#dc2626',
      knowledge: '#7c3aed',
      community: '#10b981',
    };
    return colors[category] || '#64748b';
  };

  const categoryColor = getCategoryColor(mission.category);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
        <MaterialCommunityIcons
          name={getCategoryIcon(mission.category)}
          size={32}
          color={categoryColor}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {mission.title}
          </Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {mission.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="help-circle" size={16} color="#64748b" />
            <Text style={styles.infoText}>
              {mission.quizzes.length} questions
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
            <Text style={styles.infoText}>
              +{mission.pointsReward} points
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="check-circle-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>
              {mission.requiredScore}/{mission.quizzes.length} to pass
            </Text>
          </View>
        </View>

        {!isCompleted && (
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Mission</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#2563eb" />
          </View>
        )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  iconContainer: {
    width: 60,
    height: 60,
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
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 22,
  },
  completedBadge: {
    marginLeft: 8,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
});
