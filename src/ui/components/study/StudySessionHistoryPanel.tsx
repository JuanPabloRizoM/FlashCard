import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { StudySessionRecord } from '../../../core/models/StudySessionRecord';
import {
  formatDurationLabel,
  formatSessionDateTime,
  type StudySessionOverview
} from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionHistoryPanelProps = {
  recentSessions: StudySessionRecord[];
  sessionOverview: StudySessionOverview;
  isLoading: boolean;
  onOpenSessionDetail: (sessionId: number) => void;
};

export function StudySessionHistoryPanel({
  recentSessions,
  sessionOverview,
  isLoading,
  onOpenSessionDetail
}: StudySessionHistoryPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.panel}>
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>{strings.studyStats.historyEyebrow}</Text>
        <Text style={styles.title}>{strings.studyStats.historyTitle}</Text>
        <Text style={styles.support}>{strings.studyStats.historySupport}</Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.studyStats.sessions}</Text>
          <Text style={styles.metricValue}>{sessionOverview.sessionCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.studySummary.accuracy}</Text>
          <Text style={styles.metricValue}>{`${sessionOverview.averageAccuracy}%`}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{strings.studyStats.totalReviewed}</Text>
          <Text style={styles.metricValue}>{sessionOverview.totalReviewed}</Text>
        </View>
      </View>

      {isLoading ? (
        <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} />
      ) : recentSessions.length === 0 ? (
        <CardWorkspaceFeedbackState
          message={strings.studyStats.emptyHistorySupport}
          title={strings.studyStats.emptyHistoryTitle}
        />
      ) : (
        <View style={styles.list}>
          {recentSessions.map((session) => (
            <Pressable
              key={session.id}
              onPress={() => {
                onOpenSessionDetail(session.id);
              }}
              style={styles.row}
            >
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{formatSessionDateTime(session.completedAt, strings.locale)}</Text>
                <Text style={styles.rowSupport}>
                  {strings.studyStats.sessionRowSupport(
                    session.answeredCount,
                    session.accuracyPercentage,
                    formatDurationLabel(session.durationSeconds, strings)
                  )}
                </Text>
              </View>
              <Text style={styles.rowAction}>{strings.studyStats.viewStatisticsShort}</Text>
            </Pressable>
          ))}
        </View>
      )}
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
    headerCopy: {
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
    support: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    },
    metricGrid: {
      flexDirection: 'row',
      gap: spacing.s
    },
    metricCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flex: 1,
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
    list: {
      gap: spacing.s
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between',
      padding: spacing.m
    },
    rowCopy: {
      flex: 1,
      gap: spacing.xs
    },
    rowTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    rowSupport: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    rowAction: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700'
    }
  });
