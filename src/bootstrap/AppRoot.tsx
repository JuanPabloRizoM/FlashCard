import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppNavigator } from '../navigation/AppNavigator';
import { initializeDatabase } from '../storage/database';

export function AppRoot() {
  useEffect(() => {
    void initializeDatabase().catch(() => {
      // Avoid crashing the shell on startup; feature screens surface storage issues locally.
    });
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
