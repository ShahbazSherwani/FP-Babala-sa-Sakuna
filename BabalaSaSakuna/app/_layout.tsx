import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { localizationService } from '../src/services';
import { notificationService } from '../src/services/NotificationService';

export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    const initServices = async () => {
      await localizationService.init();
      await notificationService.init();
    };

    initServices();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="alert/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
