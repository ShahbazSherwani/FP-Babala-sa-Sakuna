import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MissionCard, BadgeDisplay } from '../../src/components';
import { missionService } from '../../src/services';
import { Mission, Badge, UserProgress, Quiz } from '../../src/types';
import { localizationService } from '../../src/services/LocalizationService';

export default function MissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allMissions, allBadges, userProgress, completed] = await Promise.all([
      missionService.getAllMissions(),
      missionService.getAllBadges(),
      missionService.getUserProgress(),
      missionService['getCompletedMissionIds']?.() || Promise.resolve([]),
    ]);

    setMissions(allMissions);
    setBadges(allBadges);
    setProgress(userProgress);
    setCompletedIds(completed);
  };

  const startMission = (mission: Mission) => {
    setSelectedMission(mission);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setQuizResults(null);
  };

  const answerQuestion = (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (!selectedMission) return;

    if (currentQuestionIndex < selectedMission.quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete - show results
      const results = missionService.scoreQuiz(selectedMission.quizzes, newAnswers);
      setQuizResults(results);
      setShowResults(true);
    }
  };

  const completeMission = async () => {
    if (!selectedMission || !quizResults) return;

    const result = await missionService.completeMission(
      selectedMission.id,
      quizResults.score
    );

    if (result.success) {
      Alert.alert(
        localizationService.t('missions.missionComplete'),
        `${localizationService.t('missions.youEarned')} ${result.pointsEarned} ${localizationService.t('missions.pointsLabel')}${
          result.badge ? `\n\n${localizationService.t('missions.badgeUnlocked')}: ${result.badge.name}` : ''
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedMission(null);
              loadData();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        localizationService.t('missions.missionFailed'),
        `${localizationService.t('missions.needMore')} ${selectedMission.requiredScore} ${localizationService.t('missions.correctAnswers')}`,
        [
          {
            text: localizationService.t('missions.retry'),
            onPress: () => startMission(selectedMission),
          },
          {
            text: 'Cancel',
            onPress: () => setSelectedMission(null),
            style: 'cancel',
          },
        ]
      );
    }
  };

  const renderQuiz = () => {
    if (!selectedMission) return null;

    const currentQuestion = selectedMission.quizzes[currentQuestionIndex];

    if (showResults && quizResults) {
      return (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <MaterialCommunityIcons
              name={quizResults.passed ? 'check-circle' : 'close-circle'}
              size={64}
              color={quizResults.passed ? '#10b981' : '#ef4444'}
            />
            <Text style={styles.resultsTitle}>
              {quizResults.passed ? localizationService.t('missions.greatJob') : localizationService.t('missions.keepLearning')}
            </Text>
            <Text style={styles.resultsScore}>
              {localizationService.t('missions.score')}: {quizResults.score} / {quizResults.total}
            </Text>
          </View>

          <ScrollView style={styles.resultsDetails}>
            {selectedMission.quizzes.map((quiz, index) => (
              <View key={quiz.id} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <MaterialCommunityIcons
                    name={quizResults.results[index].correct ? 'check' : 'close'}
                    size={20}
                    color={quizResults.results[index].correct ? '#10b981' : '#ef4444'}
                  />
                  <Text style={styles.resultQuestion}>{localizationService.t('missions.question')} {index + 1}</Text>
                </View>
                <Text style={styles.resultExplanation}>
                  {quizResults.results[index].explanation}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.resultsActions}>
            {quizResults.passed ? (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={completeMission}
              >
                <Text style={styles.buttonText}>{localizationService.t('missions.completeMission')}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={() => setSelectedMission(null)}
                >
                  <Text style={styles.buttonTextSecondary}>{localizationService.t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={() => startMission(selectedMission)}
                >
                  <Text style={styles.buttonText}>{localizationService.t('missions.tryAgain')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.quizContainer}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizProgress}>
            {localizationService.t('missions.question')} {currentQuestionIndex + 1} {localizationService.t('missions.of')} {selectedMission.quizzes.length}
          </Text>
          <TouchableOpacity onPress={() => setSelectedMission(null)}>
            <MaterialCommunityIcons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <Text style={styles.question}>{currentQuestion.question}</Text>

        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => answerQuestion(index)}
            >
              <View style={styles.optionCircle}>
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="trophy" size={32} color="#f59e0b" />
          <Text style={styles.title}>{localizationService.t('missions.title')}</Text>
        </View>
        {progress && (
          <View style={styles.progressBar}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLevel}>{localizationService.t('missions.level')} {progress.level}</Text>
              <Text style={styles.progressPoints}>{progress.totalPoints} {localizationService.t('missions.points')}</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                <Text style={styles.statText}>{progress.completedMissions} {localizationService.t('missions.missionsLabel')}</Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="shield-star" size={16} color="#f59e0b" />
                <Text style={styles.statText}>{progress.earnedBadges} {localizationService.t('missions.badgesLabel')}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizationService.t('missions.yourBadges')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesContainer}
          >
            {badges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} size="medium" />
            ))}
          </ScrollView>
        </View>

        {/* Missions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizationService.t('missions.availableMissions')}</Text>
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onPress={() => startMission(mission)}
              isCompleted={completedIds.includes(mission.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Quiz Modal */}
      <Modal
        visible={selectedMission !== null}
        animationType="slide"
        onRequestClose={() => setSelectedMission(null)}
      >
        <View style={styles.modalContainer}>{renderQuiz()}</View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressBar: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
  },
  progressStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  badgesContainer: {
    paddingVertical: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  quizProgress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 32,
    lineHeight: 28,
  },
  options: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetter: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
  },
  resultsScore: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 8,
  },
  resultsDetails: {
    flex: 1,
    padding: 20,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  resultExplanation: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  resultsActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2563eb',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});
