import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { DeckReadinessBadge } from './DeckReadinessBadge';
import { DeckSummaryMetaPill, DeckSummaryStat } from './DeckSummaryPieces';

type DeckSummaryModalProps = {
  deck: Deck | null;
  insights: DeckStudyInsights | null;
  visible: boolean;
  onClose: () => void;
  onOpenCards: () => void;
  onStudy: () => void;
};

export function DeckSummaryModal({
  deck,
  insights,
  visible,
  onClose,
  onOpenCards,
  onStudy
}: DeckSummaryModalProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  if (!visible || deck == null) {
    return null;
  }

  const totalCards = insights?.totalCards ?? 0;
  const studyableCards = insights?.studyableCards ?? 0;
  const readiness = insights?.readiness ?? 'empty';
  const readinessLabel = insights?.readinessLabel ?? strings.deckInsights.readinessEmpty;
  const readinessMessage = insights?.readinessMessage ?? strings.deckInsights.readinessMessageEmpty;

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel={strings.screens.deckDetail.closeSummary}
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{strings.screens.deckDetail.summaryEyebrow}</Text>
              <Text style={styles.title}>{deck.name}</Text>
              <Text style={styles.subtitle}>
                {strings.screens.deckDetail.deckSuffix(strings.deckTypeLabels[deck.type])}
              </Text>
              <View style={styles.metaRow}>
                <DeckSummaryMetaPill label={strings.deckTypeLabels[deck.type]} />
              </View>
            </View>

            <Pressable
              accessibilityLabel={strings.screens.deckDetail.closeSummary}
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed ? styles.closeButtonPressed : null]}
            >
              <Text style={styles.closeButtonLabel}>×</Text>
            </Pressable>
          </View>

          <View style={styles.metricsRow}>
            <DeckSummaryStat label={strings.deckInsights.cards} value={totalCards.toString()} />
            <DeckSummaryStat label={strings.deckInsights.studyable} value={studyableCards.toString()} />
          </View>

          <View style={styles.readinessCard}>
            <View style={styles.readinessHeader}>
              <Text style={styles.readinessTitle}>{strings.deckInsights.title}</Text>
              <DeckReadinessBadge label={readinessLabel} readiness={readiness} />
            </View>
            <Text style={styles.readinessMessage}>{readinessMessage}</Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onStudy}
              style={({ pressed }) => [styles.primaryAction, pressed ? styles.primaryActionPressed : null]}
            >
              <Text style={styles.primaryActionLabel}>{strings.screens.deckDetail.studyDeck}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onOpenCards}
              style={({ pressed }) => [styles.secondaryAction, pressed ? styles.secondaryActionPressed : null]}
            >
              <Text style={styles.secondaryActionLabel}>{strings.screens.deckDetail.openCards}</Text>
            </Pressable>
          </View>

          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeAction}>
            <Text style={styles.closeActionLabel}>{strings.screens.deckDetail.closeSummary}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(7, 12, 21, 0.7)',
      flex: 1,
      justifyContent: 'center',
      padding: spacing.l
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 28,
      borderWidth: 1,
      gap: spacing.m,
      maxWidth: 520,
      padding: spacing.l,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 22 },
      shadowOpacity: 0.34,
      shadowRadius: 34,
      width: '100%'
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
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      lineHeight: 20
    },
    closeButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 36,
      justifyContent: 'center',
      width: 36
    },
    closeButtonPressed: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary
    },
    closeButtonLabel: {
      color: colors.textPrimary,
      fontSize: 22,
      lineHeight: 24
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.s,
      paddingTop: spacing.xs
    },
    metricsRow: {
      flexDirection: 'row',
      gap: spacing.s
    },
    readinessCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    readinessHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'space-between'
    },
    readinessTitle: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: typography.body,
      fontWeight: '600'
    },
    readinessMessage: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    actionsRow: {
      gap: spacing.s
    },
    primaryAction: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: spacing.m,
      paddingVertical: 15
    },
    primaryActionPressed: {
      backgroundColor: colors.primaryPressed
    },
    primaryActionLabel: {
      color: colors.surface,
      fontSize: typography.body,
      fontWeight: '700'
    },
    secondaryAction: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.borderStrong,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: spacing.m,
      paddingVertical: 15
    },
    secondaryActionPressed: {
      borderColor: colors.primary
    },
    secondaryActionLabel: {
      color: colors.textPrimary,
      fontSize: typography.body,
      fontWeight: '700'
    },
    closeAction: {
      alignSelf: 'center',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs
    },
    closeActionLabel: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      fontWeight: '600'
    }
  });
