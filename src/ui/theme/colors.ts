export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  text: string;
  muted: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  border: string;
  borderStrong: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1F7',
  textPrimary: '#162033',
  textSecondary: '#5B6780',
  textMuted: '#8A94A6',
  text: '#162033',
  muted: '#5B6780',
  primary: '#4F7CFF',
  primaryPressed: '#3E68E8',
  primarySoft: '#E8F0FF',
  success: '#35B67A',
  successSoft: '#E7F8EF',
  warning: '#F0A54A',
  warningSoft: '#FFF3E3',
  error: '#E35D6A',
  errorSoft: '#FDECEF',
  border: '#D8DFEA',
  borderStrong: '#C4CEDD',
  shadow: 'rgba(22, 32, 51, 0.08)'
};

export const darkColors: ThemeColors = {
  background: '#0F1521',
  surface: '#161E2C',
  surfaceMuted: '#1D2738',
  textPrimary: '#F3F6FF',
  textSecondary: '#B7C1D4',
  textMuted: '#8B96AA',
  text: '#F3F6FF',
  muted: '#B7C1D4',
  primary: '#7D9EFF',
  primaryPressed: '#6B8EF5',
  primarySoft: '#223152',
  success: '#4FD093',
  successSoft: '#1C3A2B',
  warning: '#F3B868',
  warningSoft: '#3A2D1D',
  error: '#F07A86',
  errorSoft: '#3B2027',
  border: '#2A364A',
  borderStrong: '#394963',
  shadow: 'rgba(0, 0, 0, 0.28)'
};

export type ResolvedTheme = 'light' | 'dark';

export const colors = lightColors;

export function getThemeColors(theme: ResolvedTheme): ThemeColors {
  return theme === 'dark' ? darkColors : lightColors;
}
