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
          ? 'No missed prompts this round.'
          : 'Restart or retry missed prompts.'}
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
          {isRestarting ? 'Restarting...' : 'Restart'}
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
        <Text style={styles.secondaryButtonLabel}>Retry misses</Text>
      </Pressable>

      {!canRetryIncorrectAnswers ? (
        <Text style={styles.actionHint}>
          No missed prompts.
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.m,
    padding: spacing.l
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  completionBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  completionBadgeLabel: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.body
  },
  summaryNote: {
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
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
    fontSize: typography.title,
    fontWeight: '700'
  },
  accuracySuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderWidth: 1
  },
  accuracySteady: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    borderWidth: 1
  },
  accuracyNeedsReview: {
    backgroundColor: colors.errorSoft,
    borderColor: colors.error,
    borderWidth: 1
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
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
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: 14
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  actionHint: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18
  }
});
