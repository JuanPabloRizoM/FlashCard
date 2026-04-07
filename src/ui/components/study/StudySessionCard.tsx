import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import type { StudyAnswer } from '../../../core/types/study';
import type { StudyQueueItem } from '../../../core/models/StudySession';
import { getLocalizedStudyFieldLabel } from '../../../features/study/studySessionStats';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
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

const SWIPE_THRESHOLD = 72;

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
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const itemKey = useMemo(
    () => `${currentItem.card.id}:${currentItem.promptMode}`,
    [currentItem.card.id, currentItem.promptMode]
  );
  const cardEnter = useRef(new Animated.Value(0)).current;
  const answerReveal = useRef(new Animated.Value(revealAnswer ? 1 : 0)).current;
  const swipeTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    cardEnter.setValue(0);
    swipeTranslateY.setValue(0);
    Animated.timing(cardEnter, {
      duration: 220,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [cardEnter, itemKey, swipeTranslateY]);

  useEffect(() => {
    Animated.timing(answerReveal, {
      duration: 180,
      toValue: revealAnswer ? 1 : 0,
      useNativeDriver: true
    }).start();
  }, [answerReveal, revealAnswer]);

  useEffect(() => {
    if (Platform.OS !== 'web' || revealAnswer || isSubmittingAnswer || typeof document === 'undefined') {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') {
        return;
      }

      event.preventDefault();
      onRevealAnswer();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmittingAnswer, onRevealAnswer, revealAnswer]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          revealAnswer && !isSubmittingAnswer && Math.abs(gestureState.dy) > 8,
        onPanResponderMove: (_event, gestureState) => {
          swipeTranslateY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (gestureState.dy <= -SWIPE_THRESHOLD) {
            Animated.timing(swipeTranslateY, {
              duration: 120,
              toValue: -140,
              useNativeDriver: true
            }).start(() => {
              swipeTranslateY.setValue(0);
              void onSubmitAnswer(true);
            });
            return;
          }

          if (gestureState.dy >= SWIPE_THRESHOLD) {
            Animated.timing(swipeTranslateY, {
              duration: 120,
              toValue: 140,
              useNativeDriver: true
            }).start(() => {
              swipeTranslateY.setValue(0);
              void onSubmitAnswer(false);
            });
            return;
          }

          Animated.spring(swipeTranslateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(swipeTranslateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }),
    [isSubmittingAnswer, onSubmitAnswer, revealAnswer, swipeTranslateY]
  );

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
        {...(revealAnswer ? panResponder.panHandlers : {})}
        style={[
          styles.studyCard,
          {
            opacity: cardEnter,
            transform: [
              {
                translateY: Animated.add(
                  cardEnter.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0]
                  }),
                  swipeTranslateY
                )
              }
            ]
          }
        ]}
      >
        <View style={styles.promptHeader}>
          <Text style={styles.promptLabel}>{getLocalizedStudyFieldLabel(currentItem.prompt.label, strings.locale)}</Text>
          <Text style={styles.promptMeta}>
            {strings.studyProgress.promptOfTotal(Math.min(answeredCount + 1, totalCount), totalCount)}
          </Text>
        </View>

        {!revealAnswer ? (
          <Pressable
            disabled={isSubmittingAnswer}
            onPress={onRevealAnswer}
            style={[styles.promptSurface, isSubmittingAnswer ? styles.buttonDisabled : null]}
          >
            {currentItem.prompt.kind === 'image' ? (
              <View style={styles.imagePromptWrap}>
                <Image source={{ uri: currentItem.prompt.value }} style={styles.imagePrompt} />
                <Text style={styles.imageHint}>{strings.studyCard.imagePrompt}</Text>
              </View>
            ) : (
              <Text style={styles.promptValue}>{currentItem.prompt.value}</Text>
            )}
            <Text style={styles.revealHint}>{strings.studyCard.tapToReveal}</Text>
            {Platform.OS === 'web' ? <Text style={styles.secondaryHint}>{strings.studyCard.spaceToReveal}</Text> : null}
          </Pressable>
        ) : (
          <>
            {currentItem.prompt.kind === 'image' ? (
              <View style={styles.imagePromptWrap}>
                <Image source={{ uri: currentItem.prompt.value }} style={styles.imagePrompt} />
                <Text style={styles.imageHint}>{strings.studyCard.imagePrompt}</Text>
              </View>
            ) : (
              <Text style={styles.promptValue}>{currentItem.prompt.value}</Text>
            )}

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
              <Text style={styles.answerLabel}>
                {getLocalizedStudyFieldLabel(currentItem.response.label, strings.locale)}
              </Text>
              <Text style={styles.answerValue}>{currentItem.response.value}</Text>
              <Text style={styles.answerHint}>
                {isSubmittingAnswer ? strings.studyStats.savingSessionAnswer : strings.studyCard.answerHint}
              </Text>
              <View style={styles.swipeHintsRow}>
                <Text style={styles.swipeHintMuted}>{strings.studyCard.swipeDownIncorrect}</Text>
                <Text style={styles.swipeHintSuccess}>{strings.studyCard.swipeUpCorrect}</Text>
              </View>
            </Animated.View>
          </>
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    studyCard: {
      backgroundColor: colors.background,
      borderRadius: 20,
      gap: spacing.m,
      padding: spacing.m
    },
    promptHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'space-between'
    },
    promptLabel: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    promptMeta: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '600'
    },
    promptSurface: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    promptValue: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: '700'
    },
    revealHint: {
      color: colors.primary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    secondaryHint: {
      color: colors.textSecondary,
      fontSize: typography.caption
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
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    answerWrap: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    answerLabel: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    answerValue: {
      color: colors.textPrimary,
      fontSize: typography.body,
      lineHeight: 24
    },
    answerHint: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    swipeHintsRow: {
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'space-between'
    },
    swipeHintMuted: {
      color: colors.warning,
      flex: 1,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    swipeHintSuccess: {
      color: colors.success,
      flex: 1,
      fontSize: typography.caption,
      fontWeight: '700',
      textAlign: 'right'
    },
    buttonDisabled: {
      opacity: 0.5
    }
  });
