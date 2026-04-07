import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  APP_LANGUAGES,
  APP_NAME,
  APP_THEME_PREFERENCES,
  APP_VERSION_LABEL,
  type AppLanguage,
  type AppThemePreference
} from '../../core/types/settings';
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
        <View style={styles.sectionCard}>
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

        <View style={styles.sectionCard}>
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

        <SettingsAccountSection session={session} />

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.eyebrow}>{strings.screens.settings.billingEyebrow}</Text>
              <Text style={styles.sectionTitle}>{strings.screens.settings.billingTitle}</Text>
            </View>
            <View style={styles.mutedBadge}>
              <Text style={styles.mutedBadgeLabel}>{strings.screens.settings.unavailableBadge}</Text>
            </View>
          </View>
          <Text style={styles.supportText}>{strings.screens.settings.billingSupport}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.aboutEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.aboutTitle}</Text>
          <View style={styles.metaCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{strings.screens.settings.appLabel}</Text>
              <Text style={styles.infoValue}>{APP_NAME}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{strings.screens.settings.versionLabel}</Text>
              <Text style={styles.infoValue}>{APP_VERSION_LABEL}</Text>
            </View>
          </View>
          <Text style={styles.supportText}>{strings.common.appInfoScope}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    sectionHeaderRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
    },
    sectionHeaderCopy: {
      flex: 1,
      gap: spacing.xs
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
    mutedBadge: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    mutedBadgeLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    metaCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    infoRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    infoValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '600'
    },
  });
