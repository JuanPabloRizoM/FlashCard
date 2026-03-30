import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { DEFAULT_APP_SETTINGS, type AppLanguage } from '../../core/types/settings';
import { appStrings, type AppStrings } from './translations';

let runtimeLanguage: AppLanguage = DEFAULT_APP_SETTINGS.language;

export function getAppStrings(language: AppLanguage): AppStrings {
  return appStrings[language];
}

export function setRuntimeLanguage(language: AppLanguage) {
  runtimeLanguage = language;
}

export function getRuntimeStrings(): AppStrings {
  return getAppStrings(runtimeLanguage);
}

export function useAppStrings(): AppStrings {
  const { settings } = useAppSettings();

  return getAppStrings(settings.language);
}
