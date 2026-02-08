import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChecklistItem, ChecklistPhase } from '../../src/types';
import { cacheService } from '../../src/services';
import { ChecklistItemCard } from '../../src/components';

const PHASES: { key: ChecklistPhase; label: string; icon: string }[] = [
  { key: 'before', label: 'Before', icon: 'shield-check' },
  { key: 'during', label: 'During', icon: 'alert' },
  { key: 'after', label: 'After', icon: 'wrench' },
];

export default function ChecklistScreen() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activePhase, setActivePhase] = useState<ChecklistPhase>('before');

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    const data = await cacheService.getChecklist();
    setItems(data);
  };

  const handleToggle = useCallback(async (itemId: string) => {
    const updated = await cacheService.toggleChecklistItem(itemId);
    setItems(updated);
  }, []);

  const filteredItems = items.filter((item) => item.phase === activePhase);
  const completedCount = filteredItems.filter((i) => i.isCompleted).length;
  const totalCount = filteredItems.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Checklist</Text>
        <Text style={styles.headerSubtitle}>
          {items.length} preparation steps • Works offline
        </Text>
      </View>

      {/* Phase Tabs */}
      <View style={styles.tabContainer}>
        {PHASES.map((phase) => {
          const isActive = activePhase === phase.key;
          const phaseItems = items.filter((i) => i.phase === phase.key);
          const done = phaseItems.filter((i) => i.isCompleted).length;
          return (
            <TouchableOpacity
              key={phase.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActivePhase(phase.key)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={phase.icon as any}
                size={18}
                color={isActive ? '#1E3A5F' : '#9CA3AF'}
              />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {phase.label}
              </Text>
              <Text
                style={[styles.tabCount, isActive && styles.tabCountActive]}
              >
                {done}/{phaseItems.length}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  totalCount > 0
                    ? `${(completedCount / totalCount) * 100}%`
                    : '0%',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedCount} of {totalCount} completed
        </Text>
      </View>

      {/* Checklist Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChecklistItemCard item={item} onToggle={handleToggle} />
        )}
        contentContainerStyle={styles.listContent}
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
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 3,
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#1E3A5F',
  },
  tabCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  tabCountActive: {
    color: '#1E3A5F',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
