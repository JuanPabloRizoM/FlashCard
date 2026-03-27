import {
  APP_SETTINGS_STORAGE_KEY,
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppSettings
} from '../core/types/settings';
import { getWebStorageItem, setWebStorageItem } from './webStorage';

export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const storedValue = getWebStorageItem(APP_SETTINGS_STORAGE_KEY);

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
  setWebStorageItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(normalizedSettings));
}
