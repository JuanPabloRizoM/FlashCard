import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  APP_LANGUAGES,
  APP_NAME,
  APP_THEME_PREFERENCES,
  APP_VERSION_LABEL,
  type AppLanguage,
  type AppThemePreference
} from '../../core/types/settings';
import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../theme';

export function SettingsScreen() {
  const { settings, saveError, setLanguage, setThemePreference } = useAppSettings();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  const themeLabels: Record<AppThemePreference, string> = strings.screens.settings.themeLabels;
  const languageLabels: Record<AppLanguage, string> = strings.screens.settings.languageLabels;

  return (
    <ScreenContainer title={strings.screens.settings.title} subtitle={strings.screens.settings.subtitle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.appearanceEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.appearanceTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.appearanceSupport}</Text>
          {saveError != null ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <View style={styles.choiceRow}>
            {APP_THEME_PREFERENCES.map((themePreference) => (
              <Pressable
                key={themePreference}
                onPress={() => {
                  setThemePreference(themePreference);
                }}
                style={[
                  styles.choiceChip,
                  settings.themePreference === themePreference ? styles.choiceChipActive : null
                ]}
              >
                <Text
                  style={[
                    styles.choiceLabel,
                    settings.themePreference === themePreference ? styles.choiceLabelActive : null
                  ]}
                >
                  {themeLabels[themePreference]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.languageEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.languageTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.languageSupport}</Text>

          <View style={styles.choiceRow}>
            {APP_LANGUAGES.map((language) => (
              <Pressable
                key={language}
                onPress={() => {
                  setLanguage(language);
                }}
                style={[
                  styles.choiceChip,
                  settings.language === language ? styles.choiceChipActive : null
                ]}
              >
                <Text
                  style={[
                    styles.choiceLabel,
                    settings.language === language ? styles.choiceLabelActive : null
                  ]}
                >
                  {languageLabels[language]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.accountEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.accountTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.accountSupport}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.billingEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.billingTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.settings.billingSupport}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>{strings.screens.settings.aboutEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.settings.aboutTitle}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{strings.screens.settings.appLabel}</Text>
            <Text style={styles.infoValue}>{APP_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{strings.screens.settings.versionLabel}</Text>
            <Text style={styles.infoValue}>{APP_VERSION_LABEL}</Text>
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
    choiceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    choiceChip: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    choiceChipActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary
    },
    choiceLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    choiceLabelActive: {
      color: colors.primary
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
    }
  });
