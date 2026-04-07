import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { STUDY_TECHNIQUE_LABELS } from '../../core/types/study';
import { useStudySession } from '../../features/study/useStudySession';
import type { RootTabParamList } from '../../navigation/types';
import { CardWorkspaceFeedbackState } from '../components/card/CardWorkspaceFeedbackState';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { StudySessionBanner } from '../components/study/StudySessionBanner';
import { StudySessionCard } from '../components/study/StudySessionCard';
import { StudySessionSetupPanel } from '../components/study/StudySessionSetupPanel';
import { StudySessionSummary } from '../components/study/StudySessionSummary';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../theme';

type StudyScreenProps = BottomTabScreenProps<RootTabParamList, 'Study'>;

export function StudyScreen({ navigation, route }: StudyScreenProps) {
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const routeSelectedDeckId = route.params?.selectedDeckId ?? null;
  const [handoffDeckId, setHandoffDeckId] = useState<number | null>(routeSelectedDeckId);
  const {
    decks,
    selectedDeck,
    selectedDeckId,
    selectedTechniqueId,
    selectedSessionMode,
    selectedSessionSize,
    session,
    sessionStartResult,
    currentItem,
    sessionSummary,
    canRetryIncorrectAnswers,
    isLoadingDecks,
    isStartingSession,
    isSubmittingAnswer,
    revealAnswer,
    screenError,
    onSelectDeck,
    onSelectTechnique,
    onSelectSessionMode,
    onSelectSessionSize,
    onStartSession,
    onRevealAnswer,
    onSubmitAnswer,
    onRestartSession,
    onRetryIncorrectAnswers
  } = useStudySession(handoffDeckId);

  useEffect(() => {
    if (routeSelectedDeckId == null) {
      return;
    }

    setHandoffDeckId(routeSelectedDeckId);
    navigation.setParams({ selectedDeckId: undefined });
  }, [navigation, routeSelectedDeckId]);

  useEffect(() => {
    if (handoffDeckId == null) {
      return;
    }

    if (selectedDeckId === handoffDeckId) {
      setHandoffDeckId(null);
      return;
    }

    if (decks.length > 0 && !decks.some((deck) => deck.id === handoffDeckId)) {
      setHandoffDeckId(null);
    }
  }, [decks, handoffDeckId, selectedDeckId]);

  const hasStudyContent = currentItem != null || sessionSummary != null;
  const isSessionActive = currentItem != null;
  const isSetupLocked = isSubmittingAnswer || isStartingSession || isSessionActive;

  return (
    <ScreenContainer
      title={strings.screens.study.title}
      subtitle={strings.screens.study.subtitle}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.panel}>
          <Text style={styles.eyebrow}>{strings.screens.study.setupEyebrow}</Text>
          <Text style={styles.sectionTitle}>{strings.screens.study.chooseDeckTitle}</Text>
          <Text style={styles.supportText}>{strings.screens.study.chooseDeckSupport}</Text>

          {isLoadingDecks ? (
            <CardWorkspaceFeedbackState isLoading message={strings.common.loadingDecks} />
          ) : decks.length === 0 ? (
            <CardWorkspaceFeedbackState
              message={strings.screens.study.noStudyMessage}
              title={strings.screens.study.noStudyTitle}
            />
          ) : (
            <View style={styles.choiceRow}>
              {decks.map((deck) => (
                <Pressable
                  disabled={isSetupLocked}
                  key={deck.id}
                  onPress={() => {
                    onSelectDeck(deck.id);
                  }}
                  style={[
                    styles.choiceChip,
                    deck.id === selectedDeckId ? styles.choiceChipActive : null,
                    isSetupLocked ? styles.choiceChipDisabled : null
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      deck.id === selectedDeckId ? styles.choiceLabelActive : null
                    ]}
                  >
                    {deck.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <StudySessionSetupPanel
          canStartSession={selectedDeckId != null}
          isDisabled={isSetupLocked}
          isSessionActive={isSessionActive}
          isStartingSession={isStartingSession}
          onSelectSessionMode={onSelectSessionMode}
          onSelectSessionSize={onSelectSessionSize}
          onSelectTechnique={onSelectTechnique}
          onStartSession={onStartSession}
          selectedSessionMode={selectedSessionMode}
          selectedSessionSize={selectedSessionSize}
          selectedTechniqueId={selectedTechniqueId}
        />

        {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}

        {sessionStartResult?.status === 'empty' ? (
          <CardWorkspaceFeedbackState
            message={sessionStartResult.reason}
            title={strings.screens.study.sessionUnavailable}
          />
        ) : null}

        {hasStudyContent && selectedDeck != null ? (
          <StudySessionBanner
            deckName={selectedDeck.name}
            sessionMode={selectedSessionMode}
            sessionSize={selectedSessionSize}
            techniqueLabel={STUDY_TECHNIQUE_LABELS[selectedTechniqueId]}
          />
        ) : null}

        {currentItem != null ? (
          <StudySessionCard
            answeredCount={session?.answeredCount ?? 0}
            currentItem={currentItem}
            isSubmittingAnswer={isSubmittingAnswer}
            lastAnswer={session?.lastAnswer ?? null}
            onRevealAnswer={onRevealAnswer}
            onSubmitAnswer={(isCorrect) => {
              void onSubmitAnswer(isCorrect);
            }}
            remainingCount={(session?.items.length ?? 0) - (session?.answeredCount ?? 0)}
            revealAnswer={revealAnswer}
            techniqueLabel={STUDY_TECHNIQUE_LABELS[selectedTechniqueId]}
            totalCount={session?.items.length ?? 0}
          />
        ) : null}

        {sessionSummary != null && selectedDeck != null ? (
          <StudySessionSummary
            accuracyPercentage={sessionSummary.accuracyPercentage}
            answeredCount={sessionSummary.answeredCount}
            canRetryIncorrectAnswers={canRetryIncorrectAnswers}
            correctCount={sessionSummary.correctCount}
            deckName={selectedDeck.name}
            incorrectCount={sessionSummary.incorrectCount}
            isRestarting={isStartingSession}
            onRestartSession={() => {
              void onRestartSession();
            }}
            onRetryIncorrectAnswers={onRetryIncorrectAnswers}
            techniqueLabel={STUDY_TECHNIQUE_LABELS[selectedTechniqueId]}
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  content: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.l
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 22
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  choiceChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  choiceChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  choiceChipDisabled: {
    opacity: 0.5
  },
  choiceLabel: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  choiceLabelActive: {
    color: colors.primary
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption
  }
});
