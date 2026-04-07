import { useEffect, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { StudySessionStartResult, StudyQueueItem } from '../../../core/models/StudySession';
import type { StudySessionDetail } from '../../../core/models/StudySessionRecord';
import type { StudySessionMode, StudySessionSize, StudyAnswer } from '../../../core/types/study';
import type { SessionSummary } from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { StudySessionBanner } from './StudySessionBanner';
import { StudySessionCard } from './StudySessionCard';
import { StudySessionCompleteModal } from './StudySessionCompleteModal';
import { StudySessionLeaveDialog } from './StudySessionLeaveDialog';
import { StudySessionPauseDialog } from './StudySessionPauseDialog';

type StudySessionScreenProps = {
  deckName: string | null;
  sessionMode: StudySessionMode;
  sessionSize: StudySessionSize;
  techniqueLabel: string;
  sessionStartResult: StudySessionStartResult | null;
  currentItem: StudyQueueItem | null;
  sessionSummary: SessionSummary | null;
  completedSessionDetail: StudySessionDetail | null;
  answeredCount: number;
  totalCount: number;
  remainingCount: number;
  revealAnswer: boolean;
  isStartingSession: boolean;
  isSubmittingAnswer: boolean;
  isSavingSessionStats: boolean;
  lastAnswer: StudyAnswer | null;
  screenError: string | null;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => void;
  onLeaveSession: () => void;
  onContinueAfterSummary: () => void;
  onViewSessionStatistics: () => void;
};

export function StudySessionScreen({
  deckName,
  sessionMode,
  sessionSize,
  techniqueLabel,
  sessionStartResult,
  currentItem,
  sessionSummary,
  completedSessionDetail,
  answeredCount,
  totalCount,
  remainingCount,
  revealAnswer,
  isStartingSession,
  isSubmittingAnswer,
  isSavingSessionStats,
  lastAnswer,
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
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" onPress={handleBackPress} style={styles.iconButton}>
            <Text style={styles.iconLabel}>←</Text>
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{strings.screens.study.sessionEyebrow}</Text>
            <Text numberOfLines={1} style={styles.title}>
              {deckName ?? strings.screens.study.title}
            </Text>
            <Text style={styles.support}>{techniqueLabel}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (isSessionFinished) {
                onContinueAfterSummary();
                return;
              }

              setIsPauseDialogVisible(true);
            }}
            style={styles.pauseButton}
          >
            <Text style={styles.pauseButtonLabel}>
              {isSessionFinished ? strings.screens.study.returnToStudy : strings.screens.study.pauseSession}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {screenError != null ? <Text style={styles.errorText}>{screenError}</Text> : null}

          {isStartingSession ? (
            <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} />
          ) : null}

          {!isStartingSession && sessionStartResult?.status === 'empty' ? (
            <CardWorkspaceFeedbackState
              message={sessionStartResult.reason}
              title={strings.screens.study.sessionUnavailable}
            />
          ) : null}

          {deckName != null && (currentItem != null || sessionSummary != null) ? (
            <StudySessionBanner
              deckName={deckName}
              sessionMode={sessionMode}
              sessionSize={sessionSize}
              techniqueLabel={techniqueLabel}
            />
          ) : null}

          {currentItem != null ? (
            <StudySessionCard
              answeredCount={answeredCount}
              currentItem={currentItem}
              isSubmittingAnswer={isSubmittingAnswer}
              lastAnswer={lastAnswer}
              onRevealAnswer={onRevealAnswer}
              onSubmitAnswer={onSubmitAnswer}
              remainingCount={remainingCount}
              revealAnswer={revealAnswer}
              techniqueLabel={techniqueLabel}
              totalCount={totalCount}
            />
          ) : null}

          {sessionSummary != null ? (
            <CardWorkspaceFeedbackState
              isLoading={isSavingSessionStats}
              message={
                isSavingSessionStats
                  ? strings.studyStats.savingSession
                  : strings.studyStats.summaryReadySupport
              }
              title={strings.studySummary.title}
            />
          ) : null}
        </ScrollView>
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
      gap: spacing.m,
      paddingBottom: spacing.m,
      paddingHorizontal: spacing.l,
      paddingTop: spacing.s
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.m
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 42,
      justifyContent: 'center',
      width: 42
    },
    iconLabel: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700'
    },
    headerCopy: {
      flex: 1,
      gap: spacing.xs
    },
    eyebrow: {
      color: colors.primary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    pauseButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    pauseButtonLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption
    }
  });
