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
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlowLarge} />
            <View style={styles.heroGlowSmall} />
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
        </View>
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
      paddingHorizontal: spacing.l,
      paddingTop: spacing.m,
      paddingBottom: spacing.xl
    },
    shell: {
      alignSelf: 'center',
      gap: spacing.m,
      maxWidth: 560,
      width: '100%'
    },
    heroCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: spacing.m,
      overflow: 'hidden',
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.xl,
      position: 'relative',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 24
    },
    heroGlowLarge: {
      backgroundColor: colors.primarySoft,
      borderRadius: 999,
      height: 160,
      position: 'absolute',
      right: -48,
      top: -52,
      width: 160
    },
    heroGlowSmall: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 999,
      height: 84,
      left: -24,
      position: 'absolute',
      top: 40,
      width: 84
    },
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderRadius: 999,
      borderWidth: 1,
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
      fontWeight: '800',
      letterSpacing: -0.4
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.body,
      lineHeight: 24,
      maxWidth: 420
    },
    formCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 24,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20
    },
    backButton: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    backButtonLabel: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    footerWrap: {
      paddingHorizontal: spacing.s,
      paddingBottom: spacing.s
    }
  });
