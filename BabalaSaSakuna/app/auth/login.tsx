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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(localizationService.t('auth.error'), localizationService.t('auth.fillAllFields'));
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(localizationService.t('auth.loginFailed'), result.error || localizationService.t('auth.unableSignIn'));
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/reset-password');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield-alert" size={80} color="#2563eb" />
          <Text style={styles.title}>Babala sa Sakuna</Text>
          <Text style={styles.subtitle}>{localizationService.t('auth.stayInformed')}</Text>
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
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder={localizationService.t('auth.password')}
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

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>{localizationService.t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>{localizationService.t('auth.signIn')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{localizationService.t('auth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>{localizationService.t('auth.createAccount')}</Text>
          </TouchableOpacity>

          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>{localizationService.t('auth.continueAs')}</Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.guestLink}>{localizationService.t('auth.guest')}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
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
  forgotPassword: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 16,
  },
  signupButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  guestContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  guestText: {
    fontSize: 14,
    color: '#64748b',
  },
  guestLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
