import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { STUDY_TECHNIQUE_LABELS } from '../../core/types/study';
import { useStudyFlow } from '../../features/study/StudyFlowProvider';
import type { StudyStackParamList } from '../../navigation/types';
import { StudySessionScreen } from '../components/study/StudySessionScreen';

type StudySessionRouteScreenProps = NativeStackScreenProps<StudyStackParamList, 'StudySession'>;

export function StudySessionRouteScreen({ navigation }: StudySessionRouteScreenProps) {
  const {
    selectedDeck,
    completedSessionDetail,
    isSavingSessionStats,
    selectedTechniqueId,
    selectedSessionMode,
    selectedSessionSize,
    session,
    sessionStartResult,
    currentItem,
    sessionSummary,
    isStartingSession,
    isSubmittingAnswer,
    revealAnswer,
    screenError,
    onRevealAnswer,
    onSubmitAnswer,
    onResetSession,
    clearPendingAutoStart
  } = useStudyFlow();

  useEffect(() => {
    if (currentItem != null || sessionSummary != null || isStartingSession) {
      return;
    }

    navigation.replace('StudyDashboard');
  }, [currentItem, isStartingSession, navigation, sessionSummary]);

  function handleLeaveSession() {
    onResetSession();
    clearPendingAutoStart();
    navigation.popToTop();
  }

  return (
    <StudySessionScreen
      answeredCount={session?.answeredCount ?? 0}
      completedSessionDetail={completedSessionDetail}
      currentItem={currentItem}
      deckName={selectedDeck?.name ?? null}
      isSavingSessionStats={isSavingSessionStats}
      isStartingSession={isStartingSession}
      isSubmittingAnswer={isSubmittingAnswer}
      onContinueAfterSummary={handleLeaveSession}
      onLeaveSession={handleLeaveSession}
      onRevealAnswer={onRevealAnswer}
      onSubmitAnswer={(isCorrect) => {
        void onSubmitAnswer(isCorrect);
      }}
      onViewSessionStatistics={() => {
        if (completedSessionDetail != null) {
          navigation.navigate('StudySessionStats', { sessionId: completedSessionDetail.session.id });
        }
      }}
      revealAnswer={revealAnswer}
      screenError={screenError}
      sessionStartResult={sessionStartResult}
      sessionSummary={sessionSummary}
      techniqueLabel={STUDY_TECHNIQUE_LABELS[selectedTechniqueId]}
      totalCount={session?.items.length ?? 0}
    />
  );
}
