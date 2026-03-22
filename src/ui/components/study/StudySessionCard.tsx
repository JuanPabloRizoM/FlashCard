import { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { StudyAnswer } from '../../../core/types/study';
import type { StudyQueueItem } from '../../../core/models/StudySession';
import { colors, spacing, typography } from '../../theme';
import { StudySessionAnswerActions } from './StudySessionAnswerActions';
import { StudySessionProgress } from './StudySessionProgress';

type StudySessionCardProps = {
  currentItem: StudyQueueItem;
  techniqueLabel: string;
  answeredCount: number;
  totalCount: number;
  remainingCount: number;
  revealAnswer: boolean;
  isSubmittingAnswer: boolean;
  lastAnswer: StudyAnswer | null;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => void | Promise<void>;
};

export function StudySessionCard({
  currentItem,
  techniqueLabel,
  answeredCount,
  totalCount,
  remainingCount,
  revealAnswer,
  isSubmittingAnswer,
  lastAnswer,
  onRevealAnswer,
  onSubmitAnswer
}: StudySessionCardProps) {
  const itemKey = useMemo(
    () => `${currentItem.card.id}:${currentItem.promptMode}`,
    [currentItem.card.id, currentItem.promptMode]
  );
  const cardEnter = useRef(new Animated.Value(0)).current;
  const answerReveal = useRef(new Animated.Value(revealAnswer ? 1 : 0)).current;

  useEffect(() => {
    cardEnter.setValue(0);
    Animated.timing(cardEnter, {
      duration: 220,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [cardEnter, itemKey]);

  useEffect(() => {
    Animated.timing(answerReveal, {
      duration: 180,
      toValue: revealAnswer ? 1 : 0,
      useNativeDriver: true
    }).start();
  }, [answerReveal, revealAnswer]);

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{techniqueLabel}</Text>

      <StudySessionProgress
        answeredCount={answeredCount}
        isSubmittingAnswer={isSubmittingAnswer}
        lastAnswer={lastAnswer}
        remainingCount={remainingCount}
        revealAnswer={revealAnswer}
        totalCount={totalCount}
      />

      <Animated.View
        style={[
          styles.studyCard,
          {
            opacity: cardEnter,
            transform: [
              {
                translateY: cardEnter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.promptHeader}>
          <Text style={styles.promptLabel}>{currentItem.prompt.label}</Text>
          <Text style={styles.promptMeta}>{`Prompt ${Math.min(answeredCount + 1, totalCount)} of ${totalCount}`}</Text>
        </View>

        {currentItem.prompt.kind === 'image' ? (
          <View style={styles.imagePromptWrap}>
            <Image source={{ uri: currentItem.prompt.value }} style={styles.imagePrompt} />
            <Text style={styles.imageHint}>Image prompt</Text>
          </View>
        ) : (
          <Text style={styles.promptValue}>{currentItem.prompt.value}</Text>
        )}

        {revealAnswer ? (
          <Animated.View
            style={[
              styles.answerWrap,
              {
                opacity: answerReveal,
                transform: [
                  {
                    translateY: answerReveal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.answerLabel}>{currentItem.response.label}</Text>
            <Text style={styles.answerValue}>{currentItem.response.value}</Text>
            <Text style={styles.answerHint}>
              {isSubmittingAnswer
                ? 'Saving your result and loading the next prompt...'
                : 'Choose the result that best matches how confidently you answered.'}
            </Text>
          </Animated.View>
        ) : (
          <Pressable
            disabled={isSubmittingAnswer}
            onPress={onRevealAnswer}
            style={[styles.secondaryButton, isSubmittingAnswer ? styles.buttonDisabled : null]}
          >
            <Text style={styles.secondaryButtonLabel}>Reveal answer</Text>
          </Pressable>
        )}
      </Animated.View>

      {revealAnswer ? (
        <StudySessionAnswerActions
          isSubmittingAnswer={isSubmittingAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      ) : null}
    </View>
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
  studyCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    gap: spacing.m,
    padding: spacing.m
  },
  promptHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.s
  },
  promptLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  promptMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600'
  },
  promptValue: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700'
  },
  imagePromptWrap: {
    gap: spacing.s
  },
  imagePrompt: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    height: 180,
    width: '100%'
  },
  imageHint: {
    color: colors.muted,
    fontSize: typography.caption
  },
  answerWrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.m
  },
  answerLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  answerValue: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 24
  },
  answerHint: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18
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
  }
});
