import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { StudySessionDetail } from '../../../core/models/StudySessionRecord';
import type { SessionSummary } from '../../../features/study/studySessionStats';
import { formatDurationLabel } from '../../../features/study/studySessionStats';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionCompleteModalProps = {
  visible: boolean;
  deckName: string;
  sessionSummary: SessionSummary | null;
  completedSessionDetail: StudySessionDetail | null;
  isSavingSessionStats: boolean;
  onContinue: () => void;
  onViewStatistics: () => void;
};

export function StudySessionCompleteModal({
  visible,
  deckName,
  sessionSummary,
  completedSessionDetail,
  isSavingSessionStats,
  onContinue,
  onViewStatistics
}: StudySessionCompleteModalProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  if (!visible || sessionSummary == null) {
    return null;
  }

  const bestStreak = completedSessionDetail?.session.bestStreak ?? sessionSummary.bestStreak;
  const durationSeconds = completedSessionDetail?.session.durationSeconds ?? sessionSummary.durationSeconds;

  return (
    <Modal animationType="fade" onRequestClose={onContinue} transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{strings.studySummary.badge}</Text>
              <Text style={styles.title}>{strings.studySummary.title}</Text>
              <Text style={styles.support}>{deckName}</Text>
            </View>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyBadgeLabel}>{`${sessionSummary.accuracyPercentage}%`}</Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{strings.studySummary.answered}</Text>
              <Text style={styles.metricValue}>{sessionSummary.answeredCount}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{strings.studySummary.correct}</Text>
              <Text style={styles.metricValue}>{sessionSummary.correctCount}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{strings.studySummary.incorrect}</Text>
              <Text style={styles.metricValue}>{sessionSummary.incorrectCount}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>{strings.studyStats.bestStreak}</Text>
              <Text style={styles.metricValue}>{bestStreak}</Text>
            </View>
          </View>

          <View style={styles.summaryStrip}>
            <Text style={styles.summaryStripLabel}>{strings.studyStats.sessionTime}</Text>
            <Text style={styles.summaryStripValue}>{formatDurationLabel(durationSeconds, strings)}</Text>
          </View>

          <Text style={styles.note}>
            {isSavingSessionStats ? strings.studyStats.savingSession : strings.studyStats.summaryReadySupport}
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onContinue} style={styles.primaryButton}>
              <Text style={styles.primaryButtonLabel}>{strings.studyStats.continueToStudy}</Text>
            </Pressable>
            <Pressable
              disabled={completedSessionDetail == null || isSavingSessionStats}
              onPress={onViewStatistics}
              style={[styles.secondaryButton, completedSessionDetail == null || isSavingSessionStats ? styles.buttonDisabled : null]}
            >
              <Text style={styles.secondaryButtonLabel}>{strings.studyStats.viewDetailedStatistics}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(7, 12, 21, 0.76)',
      flex: 1,
      justifyContent: 'center',
      padding: spacing.l
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: spacing.m,
      maxWidth: 520,
      padding: spacing.l,
      width: '100%'
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
      fontSize: typography.title,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 20
    },
    accuracyBadge: {
      alignItems: 'center',
      backgroundColor: colors.successSoft,
      borderColor: colors.success,
      borderRadius: 999,
      borderWidth: 1,
      justifyContent: 'center',
      minWidth: 74,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.s
    },
    accuracyBadgeLabel: {
      color: colors.success,
      fontSize: typography.body,
      fontWeight: '700'
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
    summaryStrip: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m
    },
    summaryStripLabel: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    },
    summaryStripValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    note: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    actions: {
      gap: spacing.s
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 15
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 15
    },
    secondaryButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    buttonDisabled: {
      opacity: 0.5
    }
  });
