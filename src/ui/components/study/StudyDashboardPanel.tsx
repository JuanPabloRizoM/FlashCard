import { StyleSheet, Text } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { StudySessionRecord } from '../../../core/models/StudySessionRecord';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import type { StudySessionOverview } from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { StudyHomeStatsStrip } from './StudyHomeStatsStrip';
import { StudyLaunchCard } from './StudyLaunchCard';
import { StudySessionHistoryPanel } from './StudySessionHistoryPanel';
import { StudySetupCompactPanel } from './StudySetupCompactPanel';
import type { StudySessionMode, StudySessionSize, StudyTechniqueId } from '../../../core/types/study';

type StudyDashboardPanelProps = {
  decks: Deck[];
  selectedDeckId: number | null;
  selectedDeck: Deck | null;
  selectedDeckInsights: DeckStudyInsights | null;
  selectedDeckReviewCount: number;
  selectedDeckLastStudiedAt: string | null;
  recentSessions: StudySessionRecord[];
  sessionOverview: StudySessionOverview;
  isLoadingDecks: boolean;
  isLoadingSelectedDeckDetails: boolean;
  isLoadingRecentSessions: boolean;
  isStartingSession: boolean;
  screenError: string | null;
  sessionUnavailableReason: string | null;
  selectedTechniqueId: StudyTechniqueId;
  selectedSessionMode: StudySessionMode;
  selectedSessionSize: StudySessionSize;
  onSelectDeck: (deckId: number) => void;
  onSelectTechnique: (techniqueId: StudyTechniqueId) => void;
  onSelectSessionMode: (mode: StudySessionMode) => void;
  onSelectSessionSize: (size: StudySessionSize) => void;
  onOpenSessionDetail: (sessionId: number) => void;
  onStartSession: () => Promise<void>;
};

export function StudyDashboardPanel({
  decks,
  selectedDeckId,
  selectedDeck,
  selectedDeckInsights,
  selectedDeckReviewCount,
  selectedDeckLastStudiedAt,
  recentSessions,
  sessionOverview,
  isLoadingDecks,
  isLoadingSelectedDeckDetails,
  isLoadingRecentSessions,
  isStartingSession,
  screenError,
  sessionUnavailableReason,
  selectedTechniqueId,
  selectedSessionMode,
  selectedSessionSize,
  onSelectDeck,
  onSelectTechnique,
  onSelectSessionMode,
  onSelectSessionSize,
  onOpenSessionDetail,
  onStartSession
}: StudyDashboardPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <>
      {isLoadingDecks ? (
        <CardWorkspaceFeedbackState isLoading message={strings.common.loadingDecks} />
      ) : decks.length === 0 ? (
        <CardWorkspaceFeedbackState
          message={strings.screens.study.noStudyMessage}
          title={strings.screens.study.noStudyTitle}
        />
      ) : null}

      {decks.length > 0 ? (
        <StudyLaunchCard
          canStartSession={selectedDeckId != null}
          isStartingSession={isStartingSession}
          onStartSession={onStartSession}
          selectedDeck={selectedDeck}
          selectedDeckInsights={selectedDeckInsights}
          selectedDeckLastStudiedAt={selectedDeckLastStudiedAt}
          selectedSessionMode={selectedSessionMode}
          selectedSessionSize={selectedSessionSize}
          selectedTechniqueId={selectedTechniqueId}
          sessionOverview={sessionOverview}
        />
      ) : null}

      {selectedDeck != null && isLoadingSelectedDeckDetails ? (
        <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} />
      ) : null}

      {decks.length > 0 ? (
        <StudySetupCompactPanel
          decks={decks}
          isDisabled={isStartingSession}
          onSelectDeck={onSelectDeck}
          onSelectSessionMode={onSelectSessionMode}
          onSelectSessionSize={onSelectSessionSize}
          onSelectTechnique={onSelectTechnique}
          selectedDeckId={selectedDeckId}
          selectedSessionMode={selectedSessionMode}
          selectedSessionSize={selectedSessionSize}
          selectedTechniqueId={selectedTechniqueId}
        />
      ) : null}

      {selectedDeck != null && !isLoadingSelectedDeckDetails ? (
        <StudyHomeStatsStrip
          reviewCount={selectedDeckReviewCount}
          selectedDeckInsights={selectedDeckInsights}
          sessionOverview={sessionOverview}
        />
      ) : null}

      {selectedDeck != null ? (
        <StudySessionHistoryPanel
          isLoading={isLoadingRecentSessions}
          onOpenSessionDetail={onOpenSessionDetail}
          recentSessions={recentSessions}
        />
      ) : null}

      {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}

      {sessionUnavailableReason != null ? (
        <CardWorkspaceFeedbackState
          message={sessionUnavailableReason}
          title={strings.screens.study.sessionUnavailable}
        />
      ) : null}
    </>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    }
  });
