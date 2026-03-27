import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Card } from '../../../core/models/Card';
import type { CardStudyFeedback as CardStudyFeedbackType } from '../../../features/study/cardStudyPreview';
import { CardStudyFeedback } from './CardStudyFeedback';
import { colors, spacing, typography } from '../../theme';

type DeckCardListItemProps = {
  card: Card;
  feedback: CardStudyFeedbackType;
  timestampLabel: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function DeckCardListItem({
  card,
  feedback,
  timestampLabel,
  actionLabel,
  onActionPress
}: DeckCardListItemProps) {
  return (
    <View style={styles.cardItem}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardMeta}>{timestampLabel}</Text>
        </View>
        {actionLabel != null && onActionPress != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={onActionPress}
            style={({ pressed }) => [styles.actionButton, pressed ? styles.actionButtonPressed : null]}
          >
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {card.translation != null ? <Text style={styles.cardTranslation}>{card.translation}</Text> : null}
      {card.definition != null ? <Text style={styles.cardDefinition}>{card.definition}</Text> : null}
      <CardStudyFeedback feedback={feedback} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  cardHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.s,
    justifyContent: 'space-between'
  },
  cardHeader: {
    flex: 1,
    gap: spacing.xs
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700'
  },
  cardTranslation: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600'
  },
  cardDefinition: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 22
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: typography.caption
  },
  actionButton: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s
  },
  actionButtonPressed: {
    opacity: 0.75
  },
  actionLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700'
  }
});
