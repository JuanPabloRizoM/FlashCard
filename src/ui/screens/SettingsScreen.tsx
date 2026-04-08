import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { APP_LANGUAGES, APP_THEME_PREFERENCES, type AppLanguage, type AppThemePreference } from '../../core/types/settings';
import { useAuth } from '../../features/auth/AuthProvider';
import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SettingsAccountSection } from '../components/settings/SettingsAccountSection';
import { SettingsChoiceGroup } from '../components/settings/SettingsChoiceGroup';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../theme';

export function SettingsScreen() {
  const { settings, saveError, setLanguage, setThemePreference } = useAppSettings();
  const { session } = useAuth();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  const themeLabels: Record<AppThemePreference, string> = strings.screens.settings.themeLabels;
  const languageLabels: Record<AppLanguage, string> = strings.screens.settings.languageLabels;
  const themeOptions = APP_THEME_PREFERENCES.map((themePreference) => ({
    id: themePreference,
    label: themeLabels[themePreference]
  }));
  const languageOptions = APP_LANGUAGES.map((language) => ({
    id: language,
    label: languageLabels[language]
  }));

  return (
    <ScreenContainer title={strings.screens.settings.title} subtitle={strings.screens.settings.subtitle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.eyebrow}>{strings.screens.settings.appearanceEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.appearanceTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.appearanceSupport}</Text>
          {saveError != null ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <SettingsChoiceGroup
            activeId={settings.themePreference}
            onChange={(value) => {
              setThemePreference(value as AppThemePreference);
            }}
            options={themeOptions}
          />
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.eyebrow}>{strings.screens.settings.languageEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.languageTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.languageSupport}</Text>

          <SettingsChoiceGroup
            activeId={settings.language}
            onChange={(value) => {
              setLanguage(value as AppLanguage);
            }}
            options={languageOptions}
          />
        </View>

        <View style={styles.sectionDivider} />

        <SettingsAccountSection session={session} />
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.xl,
      paddingBottom: spacing.xl
    },
    section: {
      gap: spacing.s
    },
    sectionDivider: {
      backgroundColor: colors.border,
      height: 1
    },
    eyebrow: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    },
  });
