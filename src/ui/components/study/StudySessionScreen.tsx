import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { StudySessionStartResult, StudyQueueItem } from '../../../core/models/StudySession';
import type { StudySessionDetail } from '../../../core/models/StudySessionRecord';
import type { SessionSummary } from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { StudySessionCard } from './StudySessionCard';
import { StudySessionCompleteModal } from './StudySessionCompleteModal';
import { StudySessionGuidance } from './StudySessionGuidance';
import { StudySessionLeaveDialog } from './StudySessionLeaveDialog';
import { StudySessionPauseDialog } from './StudySessionPauseDialog';
import { StudySessionShellHeader } from './StudySessionShellHeader';

type StudySessionScreenProps = {
  deckName: string | null;
  techniqueLabel: string;
  sessionStartResult: StudySessionStartResult | null;
  currentItem: StudyQueueItem | null;
  sessionSummary: SessionSummary | null;
  completedSessionDetail: StudySessionDetail | null;
  answeredCount: number;
  totalCount: number;
  revealAnswer: boolean;
  isStartingSession: boolean;
  isSubmittingAnswer: boolean;
  isSavingSessionStats: boolean;
  screenError: string | null;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => void;
  onLeaveSession: () => void;
  onContinueAfterSummary: () => void;
  onViewSessionStatistics: () => void;
};

export function StudySessionScreen({
  deckName,
  techniqueLabel,
  sessionStartResult,
  currentItem,
  sessionSummary,
  completedSessionDetail,
  answeredCount,
  totalCount,
  revealAnswer,
  isStartingSession,
  isSubmittingAnswer,
  isSavingSessionStats,
  screenError,
  onRevealAnswer,
  onSubmitAnswer,
  onLeaveSession,
  onContinueAfterSummary,
  onViewSessionStatistics
}: StudySessionScreenProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [isLeaveDialogVisible, setIsLeaveDialogVisible] = useState(false);
  const [isPauseDialogVisible, setIsPauseDialogVisible] = useState(false);
  const isSessionFinished = sessionSummary != null;
  const shouldConfirmLeave = currentItem != null && !isSessionFinished;
  const progressValue = totalCount === 0 ? 0 : answeredCount / totalCount;
  const progressLabel = totalCount === 0 ? '0 / 0' : `${Math.min(answeredCount + 1, totalCount)} / ${totalCount}`;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (shouldConfirmLeave) {
        setIsLeaveDialogVisible(true);
        return true;
      }

      if (isSessionFinished) {
        onContinueAfterSummary();
        return true;
      }

      onLeaveSession();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [isSessionFinished, onContinueAfterSummary, onLeaveSession, shouldConfirmLeave]);

  function handleBackPress() {
    if (shouldConfirmLeave) {
      setIsLeaveDialogVisible(true);
      return;
    }

    if (isSessionFinished) {
      onContinueAfterSummary();
      return;
    }

    onLeaveSession();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <StudySessionShellHeader
          deckName={deckName ?? strings.screens.study.title}
          isSessionFinished={isSessionFinished}
          onBackPress={handleBackPress}
          onPausePress={() => {
            if (isSessionFinished) {
              onContinueAfterSummary();
              return;
            }

            setIsPauseDialogVisible(true);
          }}
          pauseLabel={strings.screens.study.pauseSession}
          progressLabel={progressLabel}
          progressValue={progressValue}
          returnLabel={strings.screens.study.returnToStudy}
        />

        {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}

        <View style={styles.content}>
          {isStartingSession ? (
            <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} />
          ) : (
            <View style={styles.sessionStage}>
              {!isStartingSession && sessionStartResult?.status === 'empty' ? (
                <CardWorkspaceFeedbackState
                  message={sessionStartResult.reason}
                  title={strings.screens.study.sessionUnavailable}
                />
              ) : null}

              {currentItem != null ? (
                <View style={styles.cardStage}>
                  <StudySessionCard
                    currentItem={currentItem}
                    isSubmittingAnswer={isSubmittingAnswer}
                    onRevealAnswer={onRevealAnswer}
                    onSubmitAnswer={onSubmitAnswer}
                    revealAnswer={revealAnswer}
                  />
                </View>
              ) : null}

              {currentItem != null ? (
                <StudySessionGuidance revealAnswer={revealAnswer} />
              ) : null}
            </View>
          )}
        </View>
      </View>

      <StudySessionCompleteModal
        completedSessionDetail={completedSessionDetail}
        deckName={deckName ?? strings.screens.study.title}
        isSavingSessionStats={isSavingSessionStats}
        onContinue={onContinueAfterSummary}
        onViewStatistics={onViewSessionStatistics}
        sessionSummary={sessionSummary}
        visible={sessionSummary != null}
      />

      <StudySessionPauseDialog
        onLeave={() => {
          setIsPauseDialogVisible(false);
          setIsLeaveDialogVisible(true);
        }}
        onResume={() => {
          setIsPauseDialogVisible(false);
        }}
        visible={isPauseDialogVisible}
      />

      <StudySessionLeaveDialog
        onContinue={() => {
          setIsLeaveDialogVisible(false);
        }}
        onLeave={() => {
          setIsLeaveDialogVisible(false);
          onLeaveSession();
        }}
        visible={isLeaveDialogVisible}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      flex: 1
    },
    shell: {
      flex: 1,
      gap: spacing.s,
      paddingBottom: spacing.l,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.s
    },
    content: {
      flex: 1
    },
    sessionStage: {
      flex: 1,
      justifyContent: 'space-between'
    },
    cardStage: {
      flex: 1,
      minHeight: 0,
      paddingTop: spacing.s
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    }
  });
