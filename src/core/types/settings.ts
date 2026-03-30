import {
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZES,
  type StudySessionMode,
  type StudySessionSize
} from './study';

export const APP_THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export const APP_LANGUAGES = ['es', 'en'] as const;

export type AppThemePreference = (typeof APP_THEME_PREFERENCES)[number];
export type AppLanguage = (typeof APP_LANGUAGES)[number];

export type AppSettings = {
  defaultStudyMode: StudySessionMode;
  defaultSessionSize: StudySessionSize;
  themePreference: AppThemePreference;
  language: AppLanguage;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultStudyMode: 'mixed',
  defaultSessionSize: 10,
  themePreference: 'system',
  language: 'es'
};

export const APP_NAME = 'Flashcards App';
export const APP_VERSION_LABEL = 'v1.0.0';
export const APP_SETTINGS_STORAGE_KEY = 'flashcards_app_settings_v1';

function isStudySessionMode(value: unknown): value is StudySessionMode {
  return typeof value === 'string' && STUDY_SESSION_MODES.includes(value as StudySessionMode);
}

function isStudySessionSize(value: unknown): value is StudySessionSize {
  return STUDY_SESSION_SIZES.includes(value as StudySessionSize);
}

function isThemePreference(value: unknown): value is AppThemePreference {
  return typeof value === 'string' && APP_THEME_PREFERENCES.includes(value as AppThemePreference);
}

function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && APP_LANGUAGES.includes(value as AppLanguage);
}

export function normalizeAppSettings(value: unknown): AppSettings {
  if (value == null || typeof value !== 'object') {
    return DEFAULT_APP_SETTINGS;
  }

  const candidateSettings = value as Partial<AppSettings>;

  return {
    defaultStudyMode: isStudySessionMode(candidateSettings.defaultStudyMode)
      ? candidateSettings.defaultStudyMode
      : DEFAULT_APP_SETTINGS.defaultStudyMode,
    defaultSessionSize: isStudySessionSize(candidateSettings.defaultSessionSize)
      ? candidateSettings.defaultSessionSize
      : DEFAULT_APP_SETTINGS.defaultSessionSize,
    themePreference: isThemePreference(candidateSettings.themePreference)
      ? candidateSettings.themePreference
      : DEFAULT_APP_SETTINGS.themePreference,
    language: isAppLanguage(candidateSettings.language)
      ? candidateSettings.language
      : DEFAULT_APP_SETTINGS.language
  };
}
