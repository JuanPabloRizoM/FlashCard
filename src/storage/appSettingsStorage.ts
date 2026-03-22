import AsyncStorage from 'expo-sqlite/kv-store';

import {
  APP_SETTINGS_STORAGE_KEY,
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppSettings
} from '../core/types/settings';

export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const storedValue = await AsyncStorage.getItem(APP_SETTINGS_STORAGE_KEY);

    if (storedValue == null) {
      return DEFAULT_APP_SETTINGS;
    }

    return normalizeAppSettings(JSON.parse(storedValue));
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  const normalizedSettings = normalizeAppSettings(settings);
  await AsyncStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(normalizedSettings));
}
