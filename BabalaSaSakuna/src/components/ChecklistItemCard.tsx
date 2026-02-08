import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChecklistItem, PRIORITY_COLORS } from '../types';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}

const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  item,
  onToggle,
}) => {
  const priorityColor = PRIORITY_COLORS[item.priority];

  return (
    <TouchableOpacity
      style={[styles.card, item.isCompleted && styles.cardCompleted]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <MaterialCommunityIcons
          name={item.isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={24}
          color={item.isCompleted ? '#16A34A' : '#9CA3AF'}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              item.isCompleted && styles.titleCompleted,
            ]}
          >
            {item.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '18' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.description,
            item.isCompleted && styles.descriptionCompleted,
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  descriptionCompleted: {
    color: '#D1D5DB',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ChecklistItemCard;
