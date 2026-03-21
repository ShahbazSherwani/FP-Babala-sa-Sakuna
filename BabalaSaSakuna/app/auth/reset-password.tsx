import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { localizationService } from '../../src/services';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(localizationService.t('auth.error'), localizationService.t('auth.enterEmail'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(localizationService.t('auth.error'), localizationService.t('auth.validEmail'));
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);

    if (result.success) {
      setEmailSent(true);
    } else {
      Alert.alert(localizationService.t('auth.error'), result.error || localizationService.t('auth.unableSendReset'));
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <MaterialCommunityIcons name="email-check" size={80} color="#10b981" />
          <Text style={styles.successTitle}>{localizationService.t('auth.checkEmail')}</Text>
          <Text style={styles.successText}>
            {localizationService.t('auth.sentInstructions')}
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.successSubtext}>
            {localizationService.t('auth.checkSpam')}
          </Text>

          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>{localizationService.t('auth.backToSignIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setEmailSent(false);
              setEmail('');
            }}
          >
            <Text style={styles.resendButtonText}>{localizationService.t('auth.tryDifferentEmail')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backLink}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#2563eb" />
          </TouchableOpacity>
          
          <MaterialCommunityIcons
            name="lock-reset"
            size={64}
            color="#2563eb"
            style={styles.icon}
          />
          <Text style={styles.title}>{localizationService.t('auth.resetPassword')}</Text>
          <Text style={styles.subtitle}>
            {localizationService.t('auth.resetSubtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder={localizationService.t('auth.email')}
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>{localizationService.t('auth.sendResetLink')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{localizationService.t('auth.rememberPassword')}</Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginLink}>{localizationService.t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  resetButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
  },
  successSubtext: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
