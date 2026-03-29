import { StyleSheet, Text, View } from 'react-native';

import { PROMPT_MODE_LABELS } from '../../../core/types/study';
import type { CardStudyFeedback as CardStudyFeedbackType } from '../../../features/study/cardStudyPreview';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';

type CardStudyFeedbackProps = {
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

export function CardStudyFeedback({ feedback }: CardStudyFeedbackProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={[styles.readinessBadge, getReadinessTone(styles, feedback.readiness)]}>
          <Text style={styles.readinessLabel}>{feedback.readinessLabel}</Text>
        </View>
        <Text style={styles.promptCount}>{`${feedback.supportedPromptCount} prompt${feedback.supportedPromptCount === 1 ? '' : 's'} ready`}</Text>
      </View>

      <Text style={styles.message}>{feedback.readinessMessage}</Text>

      {feedback.supportedPromptModes.length > 0 ? (
        <Text style={styles.supportedModes}>
          {`Supports ${feedback.supportedPromptModes.map((mode) => PROMPT_MODE_LABELS[mode]).join(', ')}`}
        </Text>
      ) : null}

      {feedback.missingFieldBadges.length > 0 ? (
        <View style={styles.badgeRow}>
          {feedback.missingFieldBadges.map((badge) => (
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
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      gap: spacing.s,
      padding: spacing.m
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'space-between'
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
    promptCount: {
      color: colors.textSecondary,
      fontSize: typography.caption
    },
    message: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    supportedModes: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
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
