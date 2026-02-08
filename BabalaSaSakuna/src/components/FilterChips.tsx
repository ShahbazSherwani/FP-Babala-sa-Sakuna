import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FilterOption, HazardCategory } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterChipsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

interface ChipData {
  key: FilterOption;
  label: string;
  icon: string;
}

const CHIPS: ChipData[] = [
  { key: 'all', label: 'All', icon: 'alert-circle' },
  { key: 'typhoon', label: 'Typhoon', icon: 'weather-hurricane' },
  { key: 'flood', label: 'Flood', icon: 'water' },
  { key: 'earthquake', label: 'Earthquake', icon: 'earth' },
  { key: 'volcano', label: 'Volcano', icon: 'fire' },
];

const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHIPS.map((chip) => {
          const isActive = activeFilter === chip.key;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onFilterChange(chip.key)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={chip.icon as any}
                size={16}
                color={isActive ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#1E3A5F',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default FilterChips;
