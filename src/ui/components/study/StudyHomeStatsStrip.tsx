import { StyleSheet, Text, View } from 'react-native';

import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import type { StudySessionOverview } from '../../../features/study/studySessionStats';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudyHomeStatsStripProps = {
  selectedDeckInsights: DeckStudyInsights | null;
  reviewCount: number;
  sessionOverview: StudySessionOverview;
};

export function StudyHomeStatsStrip({
  selectedDeckInsights,
  reviewCount,
  sessionOverview
}: StudyHomeStatsStripProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>{strings.screens.study.studyableNow}</Text>
        <Text style={styles.metricValue}>{selectedDeckInsights?.studyableCards ?? 0}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>{strings.screens.study.reviewCount}</Text>
        <Text style={styles.metricValue}>{reviewCount}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>{strings.studySummary.accuracy}</Text>
        <Text style={styles.metricValue}>{`${sessionOverview.averageAccuracy}%`}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      alignItems: 'stretch',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    metricItem: {
      flex: 1,
      gap: spacing.xxs,
      minWidth: 92
    },
    divider: {
      backgroundColor: colors.border,
      width: 1
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
