import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { StudySessionRecord } from '../../../core/models/StudySessionRecord';
import {
  formatDurationLabel,
  formatSessionDateTime
} from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionHistoryPanelProps = {
  recentSessions: StudySessionRecord[];
  isLoading: boolean;
  onOpenSessionDetail: (sessionId: number) => void;
};

export function StudySessionHistoryPanel({
  recentSessions,
  isLoading,
  onOpenSessionDetail
}: StudySessionHistoryPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.panel}>
      <View style={styles.headerCopy}>
        <Text style={styles.title}>{strings.studyStats.historyTitle}</Text>
        <Text style={styles.support}>{strings.studyStats.historySupport}</Text>
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
      gap: spacing.m,
      paddingTop: spacing.s
    },
    headerCopy: {
      gap: spacing.xs
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    list: {
      gap: spacing.s
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between',
      padding: spacing.s
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
