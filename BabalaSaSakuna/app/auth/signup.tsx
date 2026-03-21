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

export default function SignUpScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const validateInputs = (): string | null => {
    if (!displayName || !email || !password || !confirmPassword) {
      return localizationService.t('auth.fillAllFields');
    }

    if (displayName.length < 2) {
      return localizationService.t('auth.nameTooShort');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return localizationService.t('auth.validEmail');
    }

    if (password.length < 6) {
      return localizationService.t('auth.passwordTooShort');
    }

    if (password !== confirmPassword) {
      return localizationService.t('auth.passwordsNoMatch');
    }

    return null;
  };

  const handleSignUp = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert(localizationService.t('auth.validationError'), error);
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert(
        localizationService.t('auth.welcome'),
        localizationService.t('auth.accountCreated'),
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert(localizationService.t('auth.signUpFailed'), result.error || localizationService.t('auth.unableCreateAccount'));
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text style={styles.title}>{localizationService.t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{localizationService.t('auth.joinCommunity')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder={localizationService.t('auth.fullName')}
              placeholderTextColor="#94a3b8"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

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
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder={localizationService.t('auth.passwordMin')}
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-check" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder={localizationService.t('auth.confirmPassword')}
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              {localizationService.t('auth.termsPrefix')}
              <Text style={styles.termsLink}>{localizationService.t('auth.termsOfService')}</Text>{localizationService.t('auth.and')}
              <Text style={styles.termsLink}>{localizationService.t('auth.privacyPolicy')}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>{localizationService.t('auth.createAccount')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{localizationService.t('auth.hasAccount')} </Text>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
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
});
