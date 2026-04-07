import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { StudySessionRecord } from '../../../core/models/StudySessionRecord';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import type { StudySessionOverview } from '../../../features/study/studySessionStats';
import { CardWorkspaceFeedbackState } from '../card/CardWorkspaceFeedbackState';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { StudyDashboardOverviewCard } from './StudyDashboardOverviewCard';
import { StudySessionHistoryPanel } from './StudySessionHistoryPanel';
import { StudySessionSetupPanel } from './StudySessionSetupPanel';
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
                disabled={isStartingSession}
                key={deck.id}
                onPress={() => {
                  onSelectDeck(deck.id);
                }}
                style={[
                  styles.choiceChip,
                  deck.id === selectedDeckId ? styles.choiceChipActive : null,
                  isStartingSession ? styles.choiceChipDisabled : null
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

      {selectedDeck != null && isLoadingSelectedDeckDetails ? (
        <CardWorkspaceFeedbackState isLoading message={strings.common.loadingStudy} />
      ) : null}

      {selectedDeck != null && !isLoadingSelectedDeckDetails ? (
        <StudyDashboardOverviewCard
          deckName={selectedDeck.name}
          insights={selectedDeckInsights}
          lastStudiedAt={selectedDeckLastStudiedAt}
          reviewCount={selectedDeckReviewCount}
        />
      ) : null}

      {selectedDeck != null ? (
        <StudySessionHistoryPanel
          isLoading={isLoadingRecentSessions}
          onOpenSessionDetail={onOpenSessionDetail}
          recentSessions={recentSessions}
          sessionOverview={sessionOverview}
        />
      ) : null}

      <StudySessionSetupPanel
        canStartSession={selectedDeckId != null}
        isDisabled={isStartingSession}
        isSessionActive={false}
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
