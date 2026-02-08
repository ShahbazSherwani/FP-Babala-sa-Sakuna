import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
