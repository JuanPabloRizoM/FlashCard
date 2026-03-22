import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppSettings
} from '../../core/types/settings';
import type { StudySessionMode, StudySessionSize } from '../../core/types/study';
import { loadAppSettings, saveAppSettings } from '../../storage/appSettingsStorage';

type AppSettingsContextValue = {
  settings: AppSettings;
  saveError: string | null;
  setDefaultStudyMode: (mode: StudySessionMode) => void;
  setDefaultSessionSize: (size: StudySessionSize) => void;
  resetStudyDefaults: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

type AppSettingsProviderProps = {
  children: ReactNode;
};

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSettings() {
      const nextSettings = await loadAppSettings();

      if (!isMounted) {
        return;
      }

      setSettings(nextSettings);
      setIsHydrated(true);
    }

    void hydrateSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistSettings = useCallback(async (nextSettings: AppSettings) => {
    try {
      await saveAppSettings(nextSettings);
      setSaveError(null);
    } catch {
      setSaveError('Defaults changed for now, but could not be saved to this device.');
    }
  }, []);

  const applySettings = useCallback(
    (value: AppSettings | ((currentSettings: AppSettings) => AppSettings)) => {
      setSettings((currentSettings) => {
        const nextSettings = normalizeAppSettings(
          typeof value === 'function' ? value(currentSettings) : value
        );

        void persistSettings(nextSettings);
        return nextSettings;
      });
    },
    [persistSettings]
  );

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      saveError,
      setDefaultStudyMode: (mode) => {
        applySettings((currentSettings) => ({
          ...currentSettings,
          defaultStudyMode: mode
        }));
      },
      setDefaultSessionSize: (size) => {
        applySettings((currentSettings) => ({
          ...currentSettings,
          defaultSessionSize: size
        }));
      },
      resetStudyDefaults: () => {
        applySettings(DEFAULT_APP_SETTINGS);
      }
    }),
    [applySettings, saveError, settings]
  );

  if (!isHydrated) {
    return null;
  }

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);

  if (context == null) {
    throw new Error('useAppSettings must be used inside AppSettingsProvider.');
  }

  return context;
}
