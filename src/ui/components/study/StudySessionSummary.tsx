import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type StudySessionSummaryProps = {
  deckName: string;
  techniqueLabel: string;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  canRetryIncorrectAnswers: boolean;
  isRestarting: boolean;
  onRestartSession: () => void;
  onRetryIncorrectAnswers: () => void;
};

export function StudySessionSummary({
  deckName,
  techniqueLabel,
  answeredCount,
  correctCount,
  incorrectCount,
  accuracyPercentage,
  canRetryIncorrectAnswers,
  isRestarting,
  onRestartSession,
  onRetryIncorrectAnswers
}: StudySessionSummaryProps) {
  const entryAnimation = useRef(new Animated.Value(0)).current;
  const accuracyTone = useMemo(() => {
    if (accuracyPercentage >= 80) {
      return styles.accuracySuccess;
    }

    if (accuracyPercentage >= 50) {
      return styles.accuracySteady;
    }

    return styles.accuracyNeedsReview;
  }, [accuracyPercentage]);

  useEffect(() => {
    entryAnimation.setValue(0);
    Animated.timing(entryAnimation, {
      duration: 240,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [entryAnimation, accuracyPercentage, answeredCount, correctCount, incorrectCount]);

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          opacity: entryAnimation,
          transform: [
            {
              translateY: entryAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Session complete</Text>
        <View style={styles.completionBadge}>
          <Text style={styles.completionBadgeLabel}>Ready for review</Text>
        </View>
      </View>
      <Text style={styles.supportText}>{deckName}</Text>
      <Text style={styles.supportText}>{techniqueLabel}</Text>
      <Text style={styles.summaryNote}>
        {incorrectCount === 0
          ? 'Every answered prompt landed correctly in this run.'
          : 'Use the summary below to restart the full session or retry only the missed prompts.'}
      </Text>

      <View style={styles.summaryTrack}>
        <View style={styles.summaryTrackFill} />
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Answered</Text>
          <Text style={styles.metricValue}>{answeredCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Correct</Text>
          <Text style={styles.metricValue}>{correctCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Incorrect</Text>
          <Text style={styles.metricValue}>{incorrectCount}</Text>
        </View>
        <View style={[styles.metricCard, accuracyTone]}>
          <Text style={styles.metricLabel}>Accuracy</Text>
          <Text style={styles.metricValue}>{`${accuracyPercentage}%`}</Text>
        </View>
      </View>

      <Pressable
        disabled={isRestarting}
        onPress={onRestartSession}
        style={[styles.primaryButton, isRestarting ? styles.buttonDisabled : null]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isRestarting ? 'Restarting...' : 'Restart session'}
        </Text>
      </Pressable>

      <Pressable
        disabled={!canRetryIncorrectAnswers || isRestarting}
        onPress={onRetryIncorrectAnswers}
        style={[
          styles.secondaryButton,
          !canRetryIncorrectAnswers || isRestarting ? styles.buttonDisabled : null
        ]}
      >
        <Text style={styles.secondaryButtonLabel}>Retry incorrect answers</Text>
      </Pressable>

      {!canRetryIncorrectAnswers ? (
        <Text style={styles.actionHint}>
          No incorrect prompts were recorded in this session.
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  completionBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  completionBadgeLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  supportText: {
    color: colors.muted,
    fontSize: typography.body
  },
  summaryNote: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  },
  summaryTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden'
  },
  summaryTrackFill: {
    backgroundColor: colors.success,
    height: '100%',
    width: '100%'
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  metricCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    flexBasis: '48%',
    gap: spacing.xs,
    padding: spacing.m
  },
  metricLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700'
  },
  accuracySuccess: {
    borderColor: '#86efac',
    borderWidth: 1
  },
  accuracySteady: {
    borderColor: '#fde68a',
    borderWidth: 1
  },
  accuracyNeedsReview: {
    borderColor: '#fca5a5',
    borderWidth: 1
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  primaryButtonLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700'
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  secondaryButtonLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  actionHint: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
  }
});
