import { StyleSheet, Text, View } from 'react-native';

import type { Card } from '../../../core/models/Card';
import type { CardStudyFeedback as CardStudyFeedbackType } from '../../../features/study/cardStudyPreview';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { getCardCompletenessLevel } from './cardListFilters';

type CardListStatusProps = {
  card: Card;
  feedback: CardStudyFeedbackType;
};

function getReadinessTone(
  styles: ReturnType<typeof createStyles>,
  readiness: CardStudyFeedbackType['readiness']
) {
  switch (readiness) {
    case 'good':
      return styles.readinessGood;
    case 'needs_improvement':
      return styles.readinessLimited;
    default:
      return styles.readinessPoor;
  }
}

function getCompletenessLabel(card: Card, locale: string): string {
  switch (getCardCompletenessLevel(card)) {
    case 'detailed':
      return locale.startsWith('es') ? 'Detallada' : 'Detailed';
    case 'expanded':
      return locale.startsWith('es') ? 'Ampliada' : 'Expanded';
    default:
      return locale.startsWith('es') ? 'Básica' : 'Basic';
  }
}

export function CardListStatus({ card, feedback }: CardListStatusProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.summaryRow}>
        <View style={[styles.readinessBadge, getReadinessTone(styles, feedback.readiness)]}>
          <Text style={styles.readinessLabel}>{feedback.readinessLabel}</Text>
        </View>
        <View style={styles.completenessBadge}>
          <Text style={styles.completenessLabel}>{getCompletenessLabel(card, strings.locale)}</Text>
        </View>
      </View>

      <Text style={styles.summaryText}>{strings.cardFeedback.promptsReady(feedback.supportedPromptCount)}</Text>

      {feedback.missingFieldBadges.length > 0 ? (
        <View style={styles.badgeRow}>
          {feedback.missingFieldBadges.slice(0, 2).map((badge) => (
            <View key={badge} style={styles.missingBadge}>
              <Text style={styles.missingBadgeLabel}>{badge}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      gap: spacing.s
    },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.s
    },
    readinessBadge: {
      borderRadius: 999,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    readinessGood: {
      backgroundColor: colors.successSoft
    },
    readinessLimited: {
      backgroundColor: colors.warningSoft
    },
    readinessPoor: {
      backgroundColor: colors.errorSoft
    },
    readinessLabel: {
      color: colors.textPrimary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    completenessBadge: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    completenessLabel: {
      color: colors.textSecondary,
      fontSize: typography.overline,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase'
    },
    summaryText: {
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs
    },
    missingBadge: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.xs
    },
    missingBadgeLabel: {
      color: colors.textSecondary,
      fontSize: typography.overline,
      fontWeight: '600'
    }
  });
