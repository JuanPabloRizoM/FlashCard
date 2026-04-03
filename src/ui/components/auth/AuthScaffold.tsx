import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME } from '../../../core/types/settings';
import { useThemeColors, useThemedStyles, spacing, typography, type ThemeColors } from '../../theme';

type AuthScaffoldProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  footer?: ReactNode;
};

export function AuthScaffold({
  title,
  subtitle,
  children,
  onBack,
  backLabel,
  footer
}: AuthScaffoldProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeLabel}>{APP_NAME}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.formCard}>
          {onBack != null && backLabel != null ? (
            <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonLabel}>{backLabel}</Text>
            </Pressable>
          ) : null}
          {children}
        </View>

        {footer != null ? <View style={styles.footerWrap}>{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background
    },
    content: {
      gap: spacing.m,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl
    },
    heroCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: spacing.s,
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.xl
    },
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderRadius: 999,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    heroBadgeLabel: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.hero,
      fontWeight: '700'
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.body,
      lineHeight: 24
    },
    formCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 24,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    backButton: {
      alignSelf: 'flex-start'
    },
    backButtonLabel: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    footerWrap: {
      paddingHorizontal: spacing.s
    }
  });
