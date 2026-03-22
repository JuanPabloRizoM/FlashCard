import {
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZES,
  type StudySessionMode,
  type StudySessionSize
} from './study';

export type AppSettings = {
  defaultStudyMode: StudySessionMode;
  defaultSessionSize: StudySessionSize;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultStudyMode: 'mixed',
  defaultSessionSize: 10
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
      : DEFAULT_APP_SETTINGS.defaultSessionSize
  };
}
