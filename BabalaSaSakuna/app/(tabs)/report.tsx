import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReportCategory, CommunityReport } from '../../src/types';
import { cacheService, localizationService } from '../../src/services';

interface CategoryOption {
  key: ReportCategory;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'flooding', label: 'report.categories.flooding', icon: 'water' },
  { key: 'road_blocked', label: 'report.categories.road_blocked', icon: 'road-variant' },
  { key: 'structural_damage', label: 'report.categories.structural_damage', icon: 'home-alert' },
  { key: 'landslide', label: 'report.categories.landslide', icon: 'terrain' },
  { key: 'power_outage', label: 'report.categories.power_outage', icon: 'flash-off' },
  { key: 'other', label: 'report.categories.other', icon: 'alert-circle' },
];

const MAX_DESCRIPTION = 500;

export default function ReportScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ category?: string; description?: string }>({});

  const validate = (): boolean => {
    const newErrors: { category?: string; description?: string } = {};
    if (!selectedCategory) {
      newErrors.category = localizationService.t('report.errors.selectCategory');
    }
    if (!description.trim()) {
      newErrors.description = localizationService.t('report.errors.descriptionRequired');
    } else if (description.trim().length < 10) {
      newErrors.description = localizationService.t('report.errors.descriptionTooShort');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const report: CommunityReport = {
      id: `report-${Date.now()}`,
      category: selectedCategory!,
      location: location.trim(),
      description: description.trim(),
      timestamp: new Date().toISOString(),
      status: 'submitted',
    };

    await cacheService.saveReport(report);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setLocation('');
    setDescription('');
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{localizationService.t('report.title')}</Text>
        </View>
        <View style={styles.successContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={72}
            color="#16A34A"
          />
          <Text style={styles.successTitle}>{localizationService.t('report.submitted')}</Text>
          <Text style={styles.successText}>
            {localizationService.t('report.thankYou')}
          </Text>
          <TouchableOpacity style={styles.newReportBtn} onPress={handleReset}>
            <Text style={styles.newReportBtnText}>{localizationService.t('report.submitAnother')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{localizationService.t('report.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {localizationService.t('report.subtitle')}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Selection */}
          <Text style={styles.sectionTitle}>{localizationService.t('report.reportType')} *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.key);
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={28}
                    color={isSelected ? '#1E3A5F' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                  >
                    {localizationService.t(cat.label)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

          {/* Location */}
          <Text style={styles.sectionTitle}>{localizationService.t('report.location')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={localizationService.t('report.locationPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
          />

          {/* Description */}
          <Text style={styles.sectionTitle}>{localizationService.t('report.description')} *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={localizationService.t('report.descriptionPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={(text) => {
              if (text.length <= MAX_DESCRIPTION) {
                setDescription(text);
                if (text.trim().length >= 10) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }
            }}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {description.length}/{MAX_DESCRIPTION}
          </Text>
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>{localizationService.t('report.guidelines')}</Text>
            {(localizationService.t('report.guidelineItems') as unknown as string[]).map((item: string, idx: number) => (
              <Text key={idx} style={styles.guidelineItem}>
                • {item}
              </Text>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!selectedCategory || !description.trim()) &&
                styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>{localizationService.t('report.submitReport')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryItemSelected: {
    borderColor: '#1E3A5F',
    backgroundColor: '#EFF6FF',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#1E3A5F',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  guidelines: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  guidelinesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  guidelineItem: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: 2,
  },
  submitBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  newReportBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 28,
  },
  newReportBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
