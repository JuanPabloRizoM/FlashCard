import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStudyFlow } from '../../features/study/StudyFlowProvider';
import type { StudyStackParamList } from '../../navigation/types';
import { StudyDashboardPanel } from '../components/study/StudyDashboardPanel';
import { useAppStrings } from '../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../theme';

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{strings.screens.study.homeEyebrow}</Text>
          <Text style={styles.title}>{strings.screens.study.title}</Text>
          <Text style={styles.subtitle}>{strings.screens.study.subtitle}</Text>
        </View>

        {selectedDeck != null ? (
          <Text style={styles.contextLine}>{strings.screens.study.contextLine(selectedDeck.name)}</Text>
        ) : null}

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
      </View>
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
    header: {
      gap: spacing.xs,
      paddingTop: spacing.s
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
      fontSize: typography.title,
      fontWeight: '700'
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22,
      maxWidth: 420
    },
    contextLine: {
      color: colors.textMuted,
      fontSize: typography.caption,
      fontWeight: '600'
    },
    content: {
      gap: spacing.m,
      paddingBottom: spacing.xl
    }
  });
