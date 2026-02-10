import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, Badge, UserProgress, Quiz } from '../types';
import { MISSIONS, BADGES, INITIAL_USER_PROGRESS } from '../data/missions';

const USER_PROGRESS_KEY = '@babala_user_progress';
const COMPLETED_MISSIONS_KEY = '@babala_completed_missions';
const EARNED_BADGES_KEY = '@babala_earned_badges';

export class MissionService {
  private static instance: MissionService;

  private constructor() {}

  static getInstance(): MissionService {
    if (!MissionService.instance) {
      MissionService.instance = new MissionService();
    }
    return MissionService.instance;
  }

  /**
   * Get all missions
   */
  getAllMissions(): Mission[] {
    return MISSIONS;
  }

  /**
   * Get mission by ID
   */
  getMissionById(id: string): Mission | undefined {
    return MISSIONS.find(mission => mission.id === id);
  }

  /**
   * Get missions by category
   */
  getMissionsByCategory(category: string): Mission[] {
    return MISSIONS.filter(mission => mission.category === category);
  }

  /**
   * Get available missions (not completed)
   */
  async getAvailableMissions(): Promise<Mission[]> {
    const completed = await this.getCompletedMissionIds();
    return MISSIONS.filter(mission => !completed.includes(mission.id));
  }

  /**
   * Get completed missions
   */
  async getCompletedMissions(): Promise<Mission[]> {
    const completed = await this.getCompletedMissionIds();
    return MISSIONS.filter(mission => completed.includes(mission.id));
  }

  /**
   * Score quiz answers
   */
  scoreQuiz(quizzes: Quiz[], userAnswers: number[]): {
    score: number;
    total: number;
    passed: boolean;
    results: Array<{ correct: boolean; explanation: string }>;
  } {
    const results = quizzes.map((quiz, index) => ({
      correct: userAnswers[index] === quiz.correctAnswer,
      explanation: quiz.explanation,
    }));

    const score = results.filter(r => r.correct).length;
    const total = quizzes.length;
    const passed = score >= (total * 0.7); // 70% passing rate

    return { score, total, passed, results };
  }

  /**
   * Complete a mission
   */
  async completeMission(
    missionId: string,
    score: number
  ): Promise<{ success: boolean; badge?: Badge; pointsEarned: number }> {
    try {
      const mission = this.getMissionById(missionId);
      if (!mission) {
        return { success: false, pointsEarned: 0 };
      }

      // Check if user passed
      if (score < mission.requiredScore) {
        return { success: false, pointsEarned: 0 };
      }

      // Mark mission as completed
      const completedMissions = await this.getCompletedMissionIds();
      if (!completedMissions.includes(missionId)) {
        completedMissions.push(missionId);
        await AsyncStorage.setItem(
          COMPLETED_MISSIONS_KEY,
          JSON.stringify(completedMissions)
        );
      }

      // Award badge
      const badge = await this.awardBadge(missionId);

      // Update user progress
      await this.addPoints(mission.pointsReward);

      return {
        success: true,
        badge,
        pointsEarned: mission.pointsReward,
      };
    } catch (error) {
      console.error('Error completing mission:', error);
      return { success: false, pointsEarned: 0 };
    }
  }

  /**
   * Award badge for completed mission
   */
  private async awardBadge(missionId: string): Promise<Badge | undefined> {
    try {
      const badge = BADGES.find(b => b.missionId === missionId);
      if (!badge) return undefined;

      const earnedBadges = await this.getEarnedBadgeIds();
      if (!earnedBadges.includes(badge.id)) {
        earnedBadges.push(badge.id);
        await AsyncStorage.setItem(
          EARNED_BADGES_KEY,
          JSON.stringify(earnedBadges)
        );
      }

      return { ...badge, isEarned: true };
    } catch (error) {
      console.error('Error awarding badge:', error);
      return undefined;
    }
  }

  /**
   * Get all badges
   */
  async getAllBadges(): Promise<Badge[]> {
    const earnedIds = await this.getEarnedBadgeIds();
    return BADGES.map(badge => ({
      ...badge,
      isEarned: earnedIds.includes(badge.id),
    }));
  }

  /**
   * Get earned badges
   */
  async getEarnedBadges(): Promise<Badge[]> {
    const earnedIds = await this.getEarnedBadgeIds();
    return BADGES.filter(badge => earnedIds.includes(badge.id)).map(badge => ({
      ...badge,
      isEarned: true,
    }));
  }

  /**
   * Get user progress
   */
  async getUserProgress(): Promise<UserProgress> {
    try {
      const stored = await AsyncStorage.getItem(USER_PROGRESS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return INITIAL_USER_PROGRESS;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return INITIAL_USER_PROGRESS;
    }
  }

  /**
   * Add points to user progress
   */
  private async addPoints(points: number): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      const completedMissions = await this.getCompletedMissionIds();
      const earnedBadges = await this.getEarnedBadgeIds();

      const newTotalPoints = progress.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1; // Level up every 100 points

      const updatedProgress: UserProgress = {
        totalPoints: newTotalPoints,
        completedMissions: completedMissions.length,
        earnedBadges: earnedBadges.length,
        level: newLevel,
      };

      await AsyncStorage.setItem(
        USER_PROGRESS_KEY,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Error adding points:', error);
    }
  }

  /**
   * Get completed mission IDs
   */
  private async getCompletedMissionIds(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(COMPLETED_MISSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting completed missions:', error);
      return [];
    }
  }

  /**
   * Get earned badge IDs
   */
  private async getEarnedBadgeIds(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(EARNED_BADGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting earned badges:', error);
      return [];
    }
  }

  /**
   * Reset user progress (for testing)
   */
  async resetProgress(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        USER_PROGRESS_KEY,
        COMPLETED_MISSIONS_KEY,
        EARNED_BADGES_KEY,
      ]);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }

  /**
   * Get progress percentage
   */
  async getProgressPercentage(): Promise<number> {
    const completed = await this.getCompletedMissionIds();
    return Math.round((completed.length / MISSIONS.length) * 100);
  }
}

export const missionService = MissionService.getInstance();
