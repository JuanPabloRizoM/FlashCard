import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import type { StudyAnswer } from '../../../core/types/study';
import { getRuntimeStrings } from '../../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type StudySessionProgressProps = {
  answeredCount: number;
  totalCount: number;
  remainingCount: number;
  revealAnswer: boolean;
  isSubmittingAnswer: boolean;
  lastAnswer: StudyAnswer | null;
};

const SHOULD_USE_NATIVE_DRIVER = Platform.OS !== 'web';

function getStageLabel(revealAnswer: boolean, isSubmittingAnswer: boolean): string {
  const strings = getRuntimeStrings();

  if (isSubmittingAnswer) {
    return strings.locale.startsWith('es') ? 'Guardando respuesta' : 'Saving answer';
  }

  return revealAnswer
    ? strings.locale.startsWith('es') ? 'Respuesta mostrada' : 'Answer revealed'
    : strings.locale.startsWith('es') ? 'Pregunta' : 'Question';
}

function getRemainingLabel(remainingCount: number): string {
  const strings = getRuntimeStrings();

  if (remainingCount <= 0) {
    return strings.studySummary.title;
  }

  if (remainingCount === 1) {
    return strings.locale.startsWith('es') ? 'Último prompt' : 'Last prompt';
  }

  return strings.studyProgress.remaining(remainingCount);
}

function getFeedbackMessage(lastAnswer: StudyAnswer): string {
  const strings = getRuntimeStrings();

  return lastAnswer.isCorrect
    ? strings.locale.startsWith('es')
      ? 'Respuesta correcta registrada. Sigue con buen ritmo.'
      : 'Correct answer recorded. Moving with a clean streak.'
    : strings.locale.startsWith('es')
      ? 'Marcada para repaso. Este prompt queda en tu historial.'
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
  const colors = useThemeColors();
  const strings = getRuntimeStrings();
  const styles = useThemedStyles(createStyles);
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
      useNativeDriver: SHOULD_USE_NATIVE_DRIVER
    }).start();
  }, [feedbackOpacity, isSubmittingAnswer, lastAnswer, revealAnswer]);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={styles.counterWrap}>
          <Text style={styles.counterText}>{`${answeredCount} / ${totalCount}`}</Text>
          <Text style={styles.helperText}>
            {`${getRemainingLabel(remainingCount)}${
              totalCount > 0 ? ` · ${strings.studyProgress.promptOfTotal(activePromptNumber, totalCount)}` : ''
            }`}
          </Text>
        </View>
        <View style={styles.stageBadge}>
          <Text style={styles.stageLabel}>{getStageLabel(revealAnswer, isSubmittingAnswer)}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>{strings.studyProgress.current}</Text>
          <Text style={styles.metaValue}>{strings.studyProgress.promptOfTotal(activePromptNumber, totalCount)}</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>{strings.studyProgress.remainingLabel}</Text>
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
          <Text style={styles.feedbackLabel}>{strings.studyProgress.lastResult}</Text>
          <Text style={styles.feedbackText}>{getFeedbackMessage(lastAnswer)}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: typography.caption
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.s
  },
  metaPill: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  stageBadge: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs
  },
  stageLabel: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  progressTrack: {
    backgroundColor: colors.primarySoft,
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
    backgroundColor: colors.successSoft
  },
  feedbackError: {
    backgroundColor: colors.errorSoft
  },
  feedbackText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  feedbackLabel: {
    color: colors.textPrimary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  }
});
