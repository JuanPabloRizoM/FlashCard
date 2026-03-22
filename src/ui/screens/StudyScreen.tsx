import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { STUDY_TECHNIQUE_LABELS } from '../../core/types/study';
import { useStudySession } from '../../features/study/useStudySession';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { StudySessionBanner } from '../components/study/StudySessionBanner';
import { StudySessionCard } from '../components/study/StudySessionCard';
import { StudySessionSetupPanel } from '../components/study/StudySessionSetupPanel';
import { StudySessionSummary } from '../components/study/StudySessionSummary';
import { colors, spacing, typography } from '../theme';

export function StudyScreen() {
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
  } = useStudySession();
  const hasStudyContent = currentItem != null || sessionSummary != null;
  const isSessionActive = currentItem != null;
  const isSetupLocked = isSubmittingAnswer || isStartingSession || isSessionActive;

  return (
    <ScreenContainer
      title="Study"
      subtitle="Study sessions run through the engine layer. Prompt modes depend on the fields each card actually has, and saved defaults can be tuned from Settings."
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Choose a deck</Text>
          {isLoadingDecks ? (
            <Text style={styles.supportText}>Loading decks...</Text>
          ) : decks.length === 0 ? (
            <Text style={styles.supportText}>Create a deck and cards before starting a study session.</Text>
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
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Empty study state</Text>
            <Text style={styles.supportText}>{sessionStartResult.reason}</Text>
          </View>
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

const styles = StyleSheet.create({
  content: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  },
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
  supportText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  choiceChip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  choiceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  choiceChipDisabled: {
    opacity: 0.5
  },
  choiceLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  choiceLabelActive: {
    color: colors.surface
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption
  },
});
