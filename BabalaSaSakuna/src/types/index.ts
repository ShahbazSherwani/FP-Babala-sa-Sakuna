// ============================================================
// Babala sa Sakuna - TypeScript Type Definitions
// ============================================================

// --------------- Alert Types ---------------

export type HazardCategory = 'typhoon' | 'flood' | 'earthquake' | 'volcano';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: HazardCategory;
  severity: SeverityLevel;
  affectedRegions: string[];
  timestamp: string;       // ISO date string
  updatedAt: string;       // ISO date string
  recommendedActions: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;        // Impact radius in kilometers
  isActive: boolean;
}

// --------------- Checklist Types ---------------

export type ChecklistPhase = 'before' | 'during' | 'after';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  phase: ChecklistPhase;
  title: string;
  description: string;
  priority: PriorityLevel;
  isCompleted: boolean;
}

// --------------- Report Types ---------------

export type ReportCategory =
  | 'flooding'
  | 'road_blocked'
  | 'structural_damage'
  | 'landslide'
  | 'power_outage'
  | 'other';

export interface CommunityReport {
  id: string;
  category: ReportCategory;
  location: string;
  description: string;
  timestamp: string;
  status: 'submitted' | 'under_review' | 'verified';
}

// --------------- Map Types ---------------

export interface HazardZone {
  id: string;
  alertId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  severity: SeverityLevel;
  category: HazardCategory;
  title: string;
}

// --------------- Filter Types ---------------

export type FilterOption = 'all' | HazardCategory;

// --------------- Navigation Types ---------------

export interface AlertDetailParams {
  id: string;
}

// --------------- Severity Color Mapping ---------------

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: '#DC2626',  // Red
  high: '#EA580C',      // Orange
  medium: '#D97706',    // Amber
  low: '#2563EB',       // Blue
};

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low / Advisory',
};

export const CATEGORY_ICONS: Record<HazardCategory, string> = {
  typhoon: 'weather-hurricane',
  flood: 'water',
  earthquake: 'earth',
  volcano: 'fire',
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
};
