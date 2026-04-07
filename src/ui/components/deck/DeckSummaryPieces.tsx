import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type LabelProps = {
  label: string;
};

type StatProps = LabelProps & {
  value: string;
};

export function DeckSummaryStat({ label, value }: StatProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function DeckSummaryMetaPill({ label }: LabelProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaPillLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    statCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      flex: 1,
      gap: spacing.xs,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m
    },
    statValue: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    metaPill: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    metaPillLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    }
  });
