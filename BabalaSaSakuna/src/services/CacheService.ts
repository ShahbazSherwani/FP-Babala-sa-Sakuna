import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistItem, CommunityReport } from '../types';
import { checklistItems as defaultChecklist } from '../data/checklist';

const STORAGE_KEYS = {
  CHECKLIST: '@babala_checklist',
  REPORTS: '@babala_reports',
  CACHED_ALERTS: '@babala_cached_alerts',
};

class CacheService {
  // ============ Checklist Operations ============

  /**
   * Load checklist from local storage, or return defaults on first use
   */
  async getChecklist(): Promise<ChecklistItem[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (stored) {
        return JSON.parse(stored) as ChecklistItem[];
      }
      // First time: save defaults and return
      await this.saveChecklist(defaultChecklist);
      return defaultChecklist;
    } catch (error) {
      console.error('Error loading checklist:', error);
      return defaultChecklist;
    }
  }

  /**
   * Save checklist state to local storage
   */
  async saveChecklist(items: ChecklistItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  }

  /**
   * Toggle a checklist item's completion status
   */
  async toggleChecklistItem(itemId: string): Promise<ChecklistItem[]> {
    const items = await this.getChecklist();
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    await this.saveChecklist(updated);
    return updated;
  }

  // ============ Report Operations ============

  /**
   * Get all saved community reports
   */
  async getReports(): Promise<CommunityReport[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
      return stored ? (JSON.parse(stored) as CommunityReport[]) : [];
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  }

  /**
   * Save a new community report
   */
  async saveReport(report: CommunityReport): Promise<void> {
    try {
      const existing = await this.getReports();
      existing.push(report);
      await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving report:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const cacheService = new CacheService();
