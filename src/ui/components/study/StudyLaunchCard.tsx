import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import type { StudySessionOverview } from '../../../features/study/studySessionStats';
import type { StudySessionMode, StudySessionSize, StudyTechniqueId } from '../../../core/types/study';
import { DeckReadinessBadge } from '../deck/DeckReadinessBadge';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type StudyLaunchCardProps = {
  selectedDeck: Deck | null;
  selectedDeckInsights: DeckStudyInsights | null;
  selectedDeckLastStudiedAt: string | null;
  sessionOverview: StudySessionOverview;
  selectedTechniqueId: StudyTechniqueId;
  selectedSessionMode: StudySessionMode;
  selectedSessionSize: StudySessionSize;
  canStartSession: boolean;
  isStartingSession: boolean;
  onStartSession: () => Promise<void>;
};

function formatLastStudied(lastStudiedAt: string | null, locale: string, fallbackLabel: string) {
  if (lastStudiedAt == null) {
    return fallbackLabel;
  }

  const date = new Date(lastStudiedAt);

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  return date.toLocaleDateString(locale);
}

export function StudyLaunchCard({
  selectedDeck,
  selectedDeckInsights,
  selectedDeckLastStudiedAt,
  sessionOverview,
  selectedTechniqueId,
  selectedSessionMode,
  selectedSessionSize,
  canStartSession,
  isStartingSession,
  onStartSession
}: StudyLaunchCardProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const lastStudiedLabel = formatLastStudied(
    selectedDeckLastStudiedAt,
    strings.locale,
    strings.screens.study.neverStudied
  );

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{strings.screens.study.launchEyebrow}</Text>
          <Text style={styles.title}>
            {selectedDeck != null
              ? strings.screens.study.launchTitleSelected(selectedDeck.name)
              : strings.screens.study.launchTitleEmpty}
          </Text>
          <Text style={styles.support}>
            {selectedDeckInsights != null
              ? selectedDeckInsights.readinessMessage
              : strings.screens.study.launchSupportEmpty}
          </Text>
        </View>
        {selectedDeckInsights != null ? (
          <DeckReadinessBadge
            label={selectedDeckInsights.readinessLabel}
            readiness={selectedDeckInsights.readiness}
          />
        ) : null}
      </View>

      <View style={styles.signalRow}>
        <View style={styles.signalPill}>
          <Text style={styles.signalLabel}>{strings.studyTechniqueLabels[selectedTechniqueId]}</Text>
        </View>
        <View style={styles.signalPill}>
          <Text style={styles.signalLabel}>{strings.studySessionModeLabels[selectedSessionMode]}</Text>
        </View>
        <View style={styles.signalPill}>
          <Text style={styles.signalLabel}>{strings.studySessionSizeLabels[selectedSessionSize]}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{strings.screens.study.studyableNow}</Text>
          <Text style={styles.metricValue}>{selectedDeckInsights?.studyableCards ?? 0}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{strings.studyStats.sessions}</Text>
          <Text style={styles.metricValue}>{sessionOverview.sessionCount}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>{strings.screens.study.lastStudied}</Text>
          <Text numberOfLines={1} style={styles.metricValueSmall}>
            {lastStudiedLabel}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!canStartSession || isStartingSession}
        onPress={() => {
          void onStartSession();
        }}
        style={[styles.primaryButton, !canStartSession || isStartingSession ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.primaryButtonLabel}>
          {isStartingSession ? strings.studySetup.startingSession : strings.studySetup.startSession}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: 28,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    headerRow: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.m,
      justifyContent: 'space-between'
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
      fontSize: typography.title,
      fontWeight: '700'
    },
    support: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 22
    },
    signalRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s
    },
    signalPill: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s
    },
    signalLabel: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: '700'
    },
    metricRow: {
      flexDirection: 'row',
      gap: spacing.s
    },
    metricBlock: {
      flex: 1,
      gap: spacing.xs
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    metricValueSmall: {
      color: colors.textPrimary,
      fontSize: typography.bodySmall,
      fontWeight: '700'
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m
    },
    primaryButtonDisabled: {
      backgroundColor: colors.borderStrong
    },
    primaryButtonLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    }
  });
