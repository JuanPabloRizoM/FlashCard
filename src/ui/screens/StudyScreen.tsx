import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useStudyFlow } from '../../features/study/StudyFlowProvider';
import type { StudyStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { StudyDashboardPanel } from '../components/study/StudyDashboardPanel';
import { useAppStrings } from '../strings';
import { spacing, useThemedStyles, type ThemeColors } from '../theme';

type StudyScreenProps = NativeStackScreenProps<StudyStackParamList, 'StudyDashboard'>;

export function StudyScreen({ navigation, route }: StudyScreenProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
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
    selectedTechniqueId,
    selectedSessionMode,
    selectedSessionSize,
    sessionStartResult,
    isLoadingDecks,
    isStartingSession,
    screenError,
    requestedDeckId,
    pendingAutoStart,
    applyHandoff,
    clearPendingAutoStart,
    onSelectDeck,
    onSelectTechnique,
    onSelectSessionMode,
    onSelectSessionSize,
    onStartSession
  } = useStudyFlow();

  useEffect(() => {
    const selectedDeckId = route.params?.selectedDeckId;
    const autoStart = route.params?.autoStart ?? false;

    if (selectedDeckId == null && !autoStart) {
      return;
    }

    applyHandoff(selectedDeckId, autoStart);
    navigation.setParams({ autoStart: undefined, selectedDeckId: undefined });
  }, [applyHandoff, navigation, route.params?.autoStart, route.params?.selectedDeckId]);

  const handleStartSession = useCallback(async () => {
    const result = await onStartSession();

    if (result?.status === 'ready') {
      navigation.navigate('StudySession');
    }
  }, [navigation, onStartSession]);

  const handleOpenSessionDetail = useCallback(
    (sessionId: number) => {
      navigation.navigate('StudySessionStats', { sessionId });
    },
    [navigation]
  );

  useEffect(() => {
    if (!pendingAutoStart || isLoadingDecks || isStartingSession || selectedDeckId == null) {
      return;
    }

    if (requestedDeckId != null && requestedDeckId !== selectedDeckId) {
      return;
    }

    clearPendingAutoStart();
    void handleStartSession();
  }, [
    clearPendingAutoStart,
    handleStartSession,
    isLoadingDecks,
    isStartingSession,
    pendingAutoStart,
    requestedDeckId,
    selectedDeckId
  ]);

  return (
    <ScreenContainer title={strings.screens.study.title} subtitle={strings.screens.study.subtitle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StudyDashboardPanel
          decks={decks}
          isLoadingDecks={isLoadingDecks}
          isLoadingRecentSessions={isLoadingRecentSessions}
          isLoadingSelectedDeckDetails={isLoadingSelectedDeckDetails}
          isStartingSession={isStartingSession}
          onOpenSessionDetail={handleOpenSessionDetail}
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

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    }
  });
