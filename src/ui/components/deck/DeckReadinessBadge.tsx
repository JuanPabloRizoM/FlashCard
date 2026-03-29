import { StyleSheet, Text, View } from 'react-native';

import type { InsightReadiness } from '../../../features/study/studyInsights';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type DeckReadinessBadgeProps = {
  readiness: InsightReadiness;
  label: string;
};

function getReadinessColors(colors: ThemeColors, readiness: InsightReadiness) {
  switch (readiness) {
    case 'good':
      return { backgroundColor: colors.successSoft, borderColor: colors.success, textColor: colors.success };
    case 'needs_improvement':
      return { backgroundColor: colors.warningSoft, borderColor: colors.warning, textColor: colors.warning };
    case 'poor':
      return { backgroundColor: colors.errorSoft, borderColor: colors.error, textColor: colors.error };
    default:
      return {
        backgroundColor: colors.surfaceMuted,
        borderColor: colors.border,
        textColor: colors.textSecondary
      };
  }
}

export function DeckReadinessBadge({ readiness, label }: DeckReadinessBadgeProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const tone = getReadinessColors(colors, readiness);

  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }]}>
      <Text style={[styles.badgeLabel, { color: tone.textColor }]}>{label}</Text>
    </View>
  );
}

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    badgeLabel: {
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    }
  });
