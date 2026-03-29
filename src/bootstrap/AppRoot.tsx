import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppSettingsProvider, useAppSettings } from '../features/settings/AppSettingsProvider';
import { AppNavigator } from '../navigation/AppNavigator';
import { initializeDatabase } from '../storage/database';

function AppShell() {
  const { resolvedTheme } = useAppSettings();

  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
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
    <AppSettingsProvider>
      <AppShell />
    </AppSettingsProvider>
  );
}
