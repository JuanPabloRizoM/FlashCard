import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  APP_NAME,
  APP_THEME_PREFERENCES,
  APP_VERSION_LABEL,
  type AppThemePreference
} from '../../core/types/settings';
import { useAppSettings } from '../../features/settings/AppSettingsProvider';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../theme';

const THEME_LABELS: Record<AppThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark'
};

export function SettingsScreen() {
  const { settings, saveError, setThemePreference } = useAppSettings();
  const styles = useThemedStyles(createStyles);

  return (
    <ScreenContainer title="Settings" subtitle="Choose how the app looks.">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>Appearance</Text>
          <Text style={styles.sectionTitle}>Theme</Text>
          <Text style={styles.supportText}>Saved on this device.</Text>
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
                  {THEME_LABELS[themePreference]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.eyebrow}>About</Text>
          <Text style={styles.sectionTitle}>App information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App</Text>
            <Text style={styles.infoValue}>{APP_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION_LABEL}</Text>
          </View>
          <Text style={styles.supportText}>Local-first decks, cards, and study sessions.</Text>
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
