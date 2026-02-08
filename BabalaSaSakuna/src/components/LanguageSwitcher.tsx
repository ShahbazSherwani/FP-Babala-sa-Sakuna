import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { localizationService } from '../services/LocalizationService';

interface LanguageSwitcherProps {
  onLanguageChange?: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onLanguageChange,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'tl'>('en');

  useEffect(() => {
    setCurrentLanguage(localizationService.getLanguage());
  }, []);

  const handleLanguageToggle = async () => {
    const newLanguage = currentLanguage === 'en' ? 'tl' : 'en';
    await localizationService.setLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    onLanguageChange?.();
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="translate" size={20} color="#6B7280" />
      <Text style={styles.label}>
        {localizationService.t('settings.language')}:
      </Text>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={handleLanguageToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.languageOption,
            currentLanguage === 'en' && styles.activeLanguage,
          ]}
        >
          EN
        </Text>
        <View style={styles.divider} />
        <Text
          style={[
            styles.languageOption,
            currentLanguage === 'tl' && styles.activeLanguage,
          ]}
        >
          TL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  switchButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  languageOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeLanguage: {
    backgroundColor: '#1E3A5F',
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    backgroundColor: '#D1D5DB',
  },
});

export default LanguageSwitcher;
