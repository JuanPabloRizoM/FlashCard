import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { STUDY_TECHNIQUE_LABELS } from '../../core/types/study';
import { useStudySession } from '../../features/study/useStudySession';
import type { RootTabParamList } from '../../navigation/types';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { StudyDashboardPanel } from '../components/study/StudyDashboardPanel';
import { StudySessionScreen } from '../components/study/StudySessionScreen';
import { StudySessionStatsScreen } from '../components/study/StudySessionStatsScreen';
import { useAppStrings } from '../strings';
import { spacing, useThemeColors, useThemedStyles, type ThemeColors } from '../theme';

type StudyScreenProps = BottomTabScreenProps<RootTabParamList, 'Study'>;
type StudyView = 'dashboard' | 'session' | 'stats';

export function StudyScreen({ navigation, route }: StudyScreenProps) {
  const colors = useThemeColors();
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const routeSelectedDeckId = route.params?.selectedDeckId ?? null;
  const routeAutoStart = route.params?.autoStart ?? false;
  const [handoffDeckId, setHandoffDeckId] = useState<number | null>(routeSelectedDeckId);
  const [pendingAutoStart, setPendingAutoStart] = useState(routeAutoStart);
  const [activeView, setActiveView] = useState<StudyView>('dashboard');
  const {
    decks,
    selectedDeck,
    selectedDeckId,
    selectedDeckInsights,
    selectedDeckReviewCount,
    selectedDeckLastStudiedAt,
    isLoadingSelectedDeckDetails,
    recentSessions,
    sessionOverview,
    isLoadingRecentSessions,
    selectedSessionDetail,
    isLoadingSessionDetail,
    completedSessionDetail,
    isSavingSessionStats,
    selectedTechniqueId,
    selectedSessionMode,
    selectedSessionSize,
    session,
    sessionStartResult,
    currentItem,
    sessionSummary,
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
    onOpenSessionDetail,
    onCloseSessionDetail,
    onResetSession
  } = useStudySession({ requestedDeckId: handoffDeckId });

  useEffect(() => {
    if (routeSelectedDeckId == null && !routeAutoStart) {
      return;
    }

    if (routeSelectedDeckId != null) {
      setHandoffDeckId(routeSelectedDeckId);
    }

    if (routeAutoStart) {
      setPendingAutoStart(true);
    }

    navigation.setParams({ autoStart: undefined, selectedDeckId: undefined });
  }, [navigation, routeAutoStart, routeSelectedDeckId]);

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

  useEffect(() => {
    navigation.setOptions({
      headerShown: activeView === 'dashboard',
      tabBarStyle:
        activeView === 'dashboard'
          ? {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 72,
              paddingTop: spacing.xs
            }
          : { display: 'none' }
    });
  }, [activeView, colors.border, colors.surface, navigation]);

  const handleLeaveSession = useCallback(() => {
    onResetSession();
    setPendingAutoStart(false);
    setActiveView('dashboard');
  }, [onResetSession]);

  const handleStartSession = useCallback(async () => {
    const result = await onStartSession();

    if (result?.status === 'ready') {
      setActiveView('session');
      return;
    }

    setActiveView('dashboard');
  }, [onStartSession]);

  const handleOpenSessionStatistics = useCallback(
    async (sessionId: number) => {
      await onOpenSessionDetail(sessionId);
      onResetSession();
      setPendingAutoStart(false);
      setActiveView('stats');
    },
    [onOpenSessionDetail, onResetSession]
  );

  useEffect(() => {
    if (!pendingAutoStart || isLoadingDecks || isStartingSession || selectedDeckId == null) {
      return;
    }

    if (handoffDeckId != null && selectedDeckId !== handoffDeckId) {
      return;
    }

    setPendingAutoStart(false);
    void handleStartSession();
  }, [handleStartSession, handoffDeckId, isLoadingDecks, isStartingSession, pendingAutoStart, selectedDeckId]);

  if (activeView === 'session') {
    return (
      <StudySessionScreen
        answeredCount={session?.answeredCount ?? 0}
        completedSessionDetail={completedSessionDetail}
        currentItem={currentItem}
        deckName={selectedDeck?.name ?? null}
        isSavingSessionStats={isSavingSessionStats}
        isStartingSession={isStartingSession}
        isSubmittingAnswer={isSubmittingAnswer}
        lastAnswer={session?.lastAnswer ?? null}
        onContinueAfterSummary={handleLeaveSession}
        onLeaveSession={handleLeaveSession}
        onRevealAnswer={onRevealAnswer}
        onSubmitAnswer={(isCorrect) => {
          void onSubmitAnswer(isCorrect);
        }}
        onViewSessionStatistics={() => {
          if (completedSessionDetail != null) {
            void handleOpenSessionStatistics(completedSessionDetail.session.id);
          }
        }}
        remainingCount={(session?.items.length ?? 0) - (session?.answeredCount ?? 0)}
        revealAnswer={revealAnswer}
        screenError={screenError}
        sessionMode={selectedSessionMode}
        sessionSize={selectedSessionSize}
        sessionStartResult={sessionStartResult}
        sessionSummary={sessionSummary}
        techniqueLabel={STUDY_TECHNIQUE_LABELS[selectedTechniqueId]}
        totalCount={session?.items.length ?? 0}
      />
    );
  }

  if (activeView === 'stats') {
    return (
      <StudySessionStatsScreen
        detail={selectedSessionDetail}
        isLoading={isLoadingSessionDetail}
        onBack={() => {
          onCloseSessionDetail();
          setActiveView('dashboard');
        }}
      />
    );
  }

  return (
    <ScreenContainer title={strings.screens.study.title} subtitle={strings.screens.study.subtitle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StudyDashboardPanel
          decks={decks}
          isLoadingDecks={isLoadingDecks}
          isLoadingRecentSessions={isLoadingRecentSessions}
          isLoadingSelectedDeckDetails={isLoadingSelectedDeckDetails}
          isStartingSession={isStartingSession}
          onOpenSessionDetail={(sessionId) => {
            void handleOpenSessionStatistics(sessionId);
          }}
          onSelectDeck={onSelectDeck}
          onSelectSessionMode={onSelectSessionMode}
          onSelectSessionSize={onSelectSessionSize}
          onSelectTechnique={onSelectTechnique}
          onStartSession={handleStartSession}
          recentSessions={recentSessions}
          screenError={screenError}
          selectedDeck={selectedDeck}
          selectedDeckId={selectedDeckId}
          selectedDeckInsights={selectedDeckInsights}
          selectedDeckLastStudiedAt={selectedDeckLastStudiedAt}
          selectedDeckReviewCount={selectedDeckReviewCount}
          selectedSessionMode={selectedSessionMode}
          selectedSessionSize={selectedSessionSize}
          selectedTechniqueId={selectedTechniqueId}
          sessionOverview={sessionOverview}
          sessionUnavailableReason={sessionStartResult?.status === 'empty' ? sessionStartResult.reason : null}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    }
  });
