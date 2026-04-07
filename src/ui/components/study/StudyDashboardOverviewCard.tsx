import { StyleSheet, Text, View } from 'react-native';

import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { DeckReadinessBadge } from '../deck/DeckReadinessBadge';

type StudyDashboardOverviewCardProps = {
  deckName: string;
  insights: DeckStudyInsights | null;
  reviewCount: number;
  lastStudiedAt: string | null;
};

function formatLastStudiedLabel(lastStudiedAt: string | null, locale: string, fallbackLabel: string): string {
  if (lastStudiedAt == null) {
    return fallbackLabel;
  }

  const date = new Date(lastStudiedAt);

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  return date.toLocaleDateString(locale);
}

export function StudyDashboardOverviewCard({
  deckName,
  insights,
  reviewCount,
  lastStudiedAt
}: StudyDashboardOverviewCardProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  if (insights == null) {
    return null;
  }

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{strings.screens.study.overviewEyebrow}</Text>
          <Text style={styles.title}>{deckName}</Text>
          <Text style={styles.supportText}>{strings.screens.study.overviewSupport}</Text>
        </View>
        <DeckReadinessBadge label={insights.readinessLabel} readiness={insights.readiness} />
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.deckInsights.cards}</Text>
          <Text style={styles.metricValue}>{insights.totalCards}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.screens.study.studyableNow}</Text>
          <Text style={styles.metricValue}>{insights.studyableCards}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.screens.study.reviewCount}</Text>
          <Text style={styles.metricValue}>{reviewCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.screens.study.lastStudied}</Text>
          <Text style={styles.metricValueSmall}>
            {formatLastStudiedLabel(lastStudiedAt, strings.locale, strings.screens.study.neverStudied)}
          </Text>
        </View>
      </View>

      <Text style={styles.readinessText}>{insights.readinessMessage}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
    },
    headerCopy: {
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
    title: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    supportText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    metricCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexBasis: '48%',
      gap: spacing.xs,
      padding: spacing.m
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    metricValueSmall: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    readinessText: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    }
  });
