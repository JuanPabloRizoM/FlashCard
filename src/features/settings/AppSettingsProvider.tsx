import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useColorScheme } from 'react-native';

import {
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppLanguage,
  type AppSettings,
  type AppThemePreference
} from '../../core/types/settings';
import type { StudySessionMode, StudySessionSize } from '../../core/types/study';
import { getAppStrings, setRuntimeLanguage } from '../../ui/strings';
import type { ResolvedTheme } from '../../ui/theme';
import { loadAppSettings, saveAppSettings } from '../../storage/appSettingsStorage';

type AppSettingsContextValue = {
  settings: AppSettings;
  resolvedTheme: ResolvedTheme;
  saveError: string | null;
  setThemePreference: (themePreference: AppThemePreference) => void;
  setLanguage: (language: AppLanguage) => void;
  setDefaultStudyMode: (mode: StudySessionMode) => void;
  setDefaultSessionSize: (size: StudySessionSize) => void;
  resetStudyDefaults: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

type AppSettingsProviderProps = {
  children: ReactNode;
};

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const systemColorScheme = useColorScheme();
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

      setRuntimeLanguage(nextSettings.language);
      setSettings(nextSettings);
      setIsHydrated(true);
    }

    void hydrateSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setRuntimeLanguage(settings.language);
  }, [settings.language]);

  const persistSettings = useCallback(async (nextSettings: AppSettings) => {
    try {
      await saveAppSettings(nextSettings);
      setSaveError(null);
    } catch {
      const nextStrings = getAppStrings(nextSettings.language);
      setSaveError(
        nextSettings.language !== settings.language
          ? nextStrings.locale.startsWith('es')
            ? 'El idioma cambió por ahora, pero no se pudo guardar en este dispositivo.'
            : 'The language changed for now, but it could not be saved on this device.'
          : nextStrings.locale.startsWith('es')
            ? 'Los cambios se aplicaron por ahora, pero no se pudieron guardar en este dispositivo.'
            : 'The changes apply for now, but they could not be saved on this device.'
      );
    }
  }, [settings.language]);

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

  const resolvedTheme: ResolvedTheme =
    settings.themePreference === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : settings.themePreference;

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      resolvedTheme,
      saveError,
      setThemePreference: (themePreference) => {
        applySettings((currentSettings) => ({
          ...currentSettings,
          themePreference
        }));
      },
      setLanguage: (language) => {
        applySettings((currentSettings) => ({
          ...currentSettings,
          language
        }));
      },
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
        applySettings((currentSettings) => ({
          ...currentSettings,
          defaultStudyMode: DEFAULT_APP_SETTINGS.defaultStudyMode,
          defaultSessionSize: DEFAULT_APP_SETTINGS.defaultSessionSize
        }));
      }
    }),
    [applySettings, resolvedTheme, saveError, settings]
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
