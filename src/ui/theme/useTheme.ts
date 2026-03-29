import { useMemo } from 'react';

import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { getThemeColors, type ThemeColors } from './colors';

export function useThemeColors(): ThemeColors {
  const { resolvedTheme } = useAppSettings();

  return useMemo(() => getThemeColors(resolvedTheme), [resolvedTheme]);
}

export function useThemedStyles<T>(createStyles: (colors: ThemeColors) => T): T {
  const colors = useThemeColors();

  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
