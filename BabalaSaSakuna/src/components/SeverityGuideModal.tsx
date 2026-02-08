import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SEVERITY_COLORS } from '../types';
import { localizationService } from '../services/LocalizationService';

interface SeverityGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const SeverityGuideModal: React.FC<SeverityGuideModalProps> = ({
  visible,
  onClose,
}) => {
  const levels = [
    {
      key: 'critical',
      icon: 'alert-octagon',
      color: SEVERITY_COLORS.critical,
    },
    {
      key: 'high',
      icon: 'alert',
      color: SEVERITY_COLORS.high,
    },
    {
      key: 'medium',
      icon: 'alert-circle',
      color: SEVERITY_COLORS.medium,
    },
    {
      key: 'low',
      icon: 'information',
      color: SEVERITY_COLORS.low,
    },
  ] as const;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="school"
              size={32}
              color="#1E3A5F"
              style={styles.headerIcon}
            />
            <Text style={styles.title}>
              {localizationService.t('severityGuide.title')}
            </Text>
            <Text style={styles.subtitle}>
              {localizationService.t('severityGuide.subtitle')}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {levels.map((level) => (
              <View key={level.key} style={styles.levelCard}>
                <View style={styles.levelHeader}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: level.color }]}
                  >
                    <MaterialCommunityIcons
                      name={level.icon as any}
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.levelTitle}>
                    {localizationService.t(`severityGuide.levels.${level.key}.title`)}
                  </Text>
                </View>
                <Text style={styles.levelDescription}>
                  {localizationService.t(`severityGuide.levels.${level.key}.description`)}
                </Text>
              </View>
            ))}

            <View style={styles.footer}>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={18}
                color="#6B7280"
              />
              <Text style={styles.footerText}>
                {localizationService.t('severityGuide.dontShowAgain')}
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>
              {localizationService.t('severityGuide.gotIt')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: Dimensions.get('window').height * 0.85,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  levelCard: {
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  levelDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    paddingLeft: 52,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 12,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#1E3A5F',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SeverityGuideModal;
