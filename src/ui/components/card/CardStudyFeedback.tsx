import { StyleSheet, Text, View } from 'react-native';

import type { CardStudyFeedback as CardStudyFeedbackType } from '../../../features/study/cardStudyPreview';
import { PROMPT_MODE_LABELS } from '../../../core/types/study';
import { colors, spacing, typography } from '../../theme';

type CardStudyFeedbackProps = {
  feedback: CardStudyFeedbackType;
};

function getReadinessTone(readiness: CardStudyFeedbackType['readiness']) {
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
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={[styles.readinessBadge, getReadinessTone(feedback.readiness)]}>
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

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    borderRadius: 12,
    gap: spacing.s,
    padding: spacing.s
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
    backgroundColor: '#dcfce7'
  },
  readinessLimited: {
    backgroundColor: '#fef3c7'
  },
  readinessPoor: {
    backgroundColor: '#fee2e2'
  },
  readinessLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  promptCount: {
    color: colors.muted,
    fontSize: typography.caption
  },
  message: {
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 18
  },
  supportedModes: {
    color: colors.muted,
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
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600'
  }
});
