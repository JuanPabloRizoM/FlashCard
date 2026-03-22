import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type { StudyAnswer } from '../../../core/types/study';
import { colors, spacing, typography } from '../../theme';

type StudySessionProgressProps = {
  answeredCount: number;
  totalCount: number;
  remainingCount: number;
  revealAnswer: boolean;
  isSubmittingAnswer: boolean;
  lastAnswer: StudyAnswer | null;
};

function getStageLabel(revealAnswer: boolean, isSubmittingAnswer: boolean): string {
  if (isSubmittingAnswer) {
    return 'Saving answer';
  }

  return revealAnswer ? 'Answer revealed' : 'Question';
}

function getRemainingLabel(remainingCount: number): string {
  if (remainingCount <= 0) {
    return 'Session complete';
  }

  if (remainingCount === 1) {
    return 'Last prompt';
  }

  return `${remainingCount} remaining`;
}

function getFeedbackMessage(lastAnswer: StudyAnswer): string {
  return lastAnswer.isCorrect
    ? 'Correct answer recorded. Moving with a clean streak.'
    : 'Marked for review. This prompt stays visible in your progress history.';
}

export function StudySessionProgress({
  answeredCount,
  totalCount,
  remainingCount,
  revealAnswer,
  isSubmittingAnswer,
  lastAnswer
}: StudySessionProgressProps) {
  const progressPercentage = totalCount === 0 ? 0 : (answeredCount / totalCount) * 100;
  const activePromptNumber = totalCount === 0 ? 0 : Math.min(answeredCount + 1, totalCount);
  const animatedProgress = useRef(new Animated.Value(progressPercentage)).current;
  const feedbackOpacity = useRef(new Animated.Value(lastAnswer != null ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      duration: 220,
      toValue: progressPercentage,
      useNativeDriver: false
    }).start();
  }, [animatedProgress, progressPercentage]);

  useEffect(() => {
    Animated.timing(feedbackOpacity, {
      duration: 180,
      toValue: lastAnswer != null && !revealAnswer && !isSubmittingAnswer ? 1 : 0,
      useNativeDriver: true
    }).start();
  }, [feedbackOpacity, isSubmittingAnswer, lastAnswer, revealAnswer]);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={styles.counterWrap}>
          <Text style={styles.counterText}>{`${answeredCount} / ${totalCount}`}</Text>
          <Text style={styles.helperText}>{`${getRemainingLabel(remainingCount)}${totalCount > 0 ? ` · Prompt ${activePromptNumber}` : ''}`}</Text>
        </View>
        <View style={styles.stageBadge}>
          <Text style={styles.stageLabel}>{getStageLabel(revealAnswer, isSubmittingAnswer)}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>Current</Text>
          <Text style={styles.metaValue}>{`${activePromptNumber} of ${totalCount}`}</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>Remaining</Text>
          <Text style={styles.metaValue}>{Math.max(remainingCount, 0)}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: animatedProgress.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%']
        }) }]} />
      </View>

      {lastAnswer != null && !revealAnswer && !isSubmittingAnswer ? (
        <Animated.View
          style={[
            styles.feedbackBanner,
            lastAnswer.isCorrect ? styles.feedbackSuccess : styles.feedbackError,
            {
              opacity: feedbackOpacity,
              transform: [
                {
                  translateY: feedbackOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-6, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.feedbackLabel}>Last result</Text>
          <Text style={styles.feedbackText}>{getFeedbackMessage(lastAnswer)}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.s
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  counterWrap: {
    gap: spacing.xs
  },
  counterText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  helperText: {
    color: colors.muted,
    fontSize: typography.caption
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.s
  },
  metaPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  metaValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  stageBadge: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  stageLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: colors.primary,
    height: '100%'
  },
  feedbackBanner: {
    borderRadius: 12,
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  feedbackSuccess: {
    backgroundColor: '#dcfce7'
  },
  feedbackError: {
    backgroundColor: '#fee2e2'
  },
  feedbackText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  feedbackLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  }
});
