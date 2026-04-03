import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../features/auth/AuthProvider';
import { AppSettingsProvider, useAppSettings } from '../features/settings/AppSettingsProvider';
import { RootNavigator } from '../navigation/RootNavigator';
import { initializeDatabase } from '../storage/database';

function AppShell() {
  const { resolvedTheme } = useAppSettings();

  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </>
  );
}

export function AppRoot() {
  useEffect(() => {
    void initializeDatabase().catch(() => {
      // Avoid crashing the shell on startup; feature screens surface storage issues locally.
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppShell />
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}
