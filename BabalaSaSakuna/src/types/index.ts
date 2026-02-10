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

// --------------- Weather & PSI Types ---------------

export type PSILevel = 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;          // mm/hour
  windSpeed: number;         // km/h
  condition: string;         // "Clear", "Rainy", "Cloudy", etc.
  lastUpdated: string;
}

export interface PSIData {
  psiValue: number;
  level: PSILevel;
  location: string;
  lastUpdated: string;
  healthAdvice: string;
}

export const PSI_COLORS: Record<PSILevel, string> = {
  good: '#16A34A',           // Green
  moderate: '#D97706',       // Yellow
  unhealthy: '#EA580C',      // Orange
  very_unhealthy: '#DC2626', // Red
  hazardous: '#7C2D12',      // Dark Red
};

export const PSI_RANGES: Record<PSILevel, { min: number; max: number }> = {
  good: { min: 0, max: 50 },
  moderate: { min: 51, max: 100 },
  unhealthy: { min: 101, max: 200 },
  very_unhealthy: { min: 201, max: 300 },
  hazardous: { min: 301, max: 500 },
};

// --------------- Resource Hub Types ---------------

export type ResourceType = 'shelter' | 'hospital' | 'fire_station' | 'police_station' | 'evacuation_center';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  capacity?: number;         // For shelters/evacuation centers
  services: string[];
  isOperational: boolean;
  operational24_7?: boolean; // 24/7 availability
  distance?: number;         // Distance from user in km
}

export const RESOURCE_ICONS: Record<ResourceType, string> = {
  shelter: 'home-account',
  hospital: 'hospital-box',
  fire_station: 'fire-truck',
  police_station: 'shield-account',
  evacuation_center: 'tent',
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  shelter: '#2563EB',
  hospital: '#DC2626',
  fire_station: '#EA580C',
  police_station: '#1E40AF',
  evacuation_center: '#16A34A',
};

// --------------- Missions & Badges Types ---------------

export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export type BadgeCategory = 'preparedness' | 'knowledge' | 'community' | 'survival';

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;     // Index of correct option
  explanation: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  pointsReward: number;
  quizzes: Quiz[];
  requiredScore: number;     // Minimum correct answers to pass
  status: MissionStatus;
  completedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  isEarned: boolean;
  earnedAt?: string;
  missionId: string;
}

export interface UserProgress {
  totalPoints: number;
  completedMissions: number;
  earnedBadges: number;
  level: number;
}

export const BADGE_COLORS: Record<BadgeCategory, string> = {
  preparedness: '#2563EB',
  knowledge: '#7C3AED',
  community: '#16A34A',
  survival: '#EA580C',
};
