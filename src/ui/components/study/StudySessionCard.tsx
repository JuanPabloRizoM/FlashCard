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

import type { StudyQueueItem } from '../../../core/models/StudySession';
import { getLocalizedStudyFieldLabel } from '../../../features/study/studySessionStats';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { StudySessionAnswerActions } from './StudySessionAnswerActions';

type StudySessionCardProps = {
  currentItem: StudyQueueItem;
  revealAnswer: boolean;
  isSubmittingAnswer: boolean;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => void | Promise<void>;
};

const SWIPE_THRESHOLD = 72;
const SHOULD_USE_NATIVE_DRIVER = Platform.OS !== 'web';

export function StudySessionCard({
  currentItem,
  revealAnswer,
  isSubmittingAnswer,
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
      useNativeDriver: SHOULD_USE_NATIVE_DRIVER
    }).start();
  }, [cardEnter, itemKey, swipeTranslateY]);

  useEffect(() => {
    Animated.timing(answerReveal, {
      duration: 180,
      toValue: revealAnswer ? 1 : 0,
      useNativeDriver: SHOULD_USE_NATIVE_DRIVER
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
              useNativeDriver: SHOULD_USE_NATIVE_DRIVER
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
              useNativeDriver: SHOULD_USE_NATIVE_DRIVER
            }).start(() => {
              swipeTranslateY.setValue(0);
              void onSubmitAnswer(false);
            });
            return;
          }

          Animated.spring(swipeTranslateY, {
            toValue: 0,
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(swipeTranslateY, {
            toValue: 0,
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER
          }).start();
        }
      }),
    [isSubmittingAnswer, onSubmitAnswer, revealAnswer, swipeTranslateY]
  );

  return (
    <View style={styles.panel}>
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
        <Text style={styles.promptLabel}>{getLocalizedStudyFieldLabel(currentItem.prompt.label, strings.locale)}</Text>

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
      flex: 1,
      gap: spacing.m
    },
    studyCard: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: 28,
      borderWidth: 1,
      flex: 1,
      gap: spacing.m,
      minHeight: 0,
      padding: spacing.l
    },
    promptLabel: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    promptSurface: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingVertical: spacing.l
    },
    promptValue: {
      color: colors.textPrimary,
      fontSize: typography.hero,
      fontWeight: '700'
    },
    imagePromptWrap: {
      alignItems: 'center',
      gap: spacing.s,
      width: '100%'
    },
    imagePrompt: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 20,
      height: 260,
      width: '100%'
    },
    imageHint: {
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    answerWrap: {
      borderTopColor: colors.border,
      borderTopWidth: 1,
      gap: spacing.s,
      paddingTop: spacing.m
    },
    answerLabel: {
      color: colors.primary,
      fontSize: typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    answerValue: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      lineHeight: 28
    },
    buttonDisabled: {
      opacity: 0.5
    }
  });
