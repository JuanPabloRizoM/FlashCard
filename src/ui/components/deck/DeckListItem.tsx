import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { DECK_TYPE_LABELS } from '../../../core/types/deck';
import { DeckReadinessBadge } from './DeckReadinessBadge';
import { colors, spacing, typography } from '../../theme';

type DeckListItemProps = {
  deck: Deck;
  insights: DeckStudyInsights | null;
  timestampLabel: string;
  onPress: () => void;
};

export function DeckListItem({ deck, insights, timestampLabel, onPress }: DeckListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.deckCard, pressed ? styles.deckCardPressed : null]}
    >
      <View style={styles.deckCardHeader}>
        <Text style={styles.deckType}>{DECK_TYPE_LABELS[deck.type]}</Text>
        {insights != null ? (
          <DeckReadinessBadge label={insights.readinessLabel} readiness={insights.readiness} />
        ) : null}
      </View>
      <Text style={styles.deckName}>{deck.name}</Text>
      {deck.description != null ? <Text style={styles.deckDescription}>{deck.description}</Text> : null}
      {insights != null ? (
        <View style={styles.deckInsightRow}>
          <Text style={styles.deckInsightText}>
            {`${insights.studyableCards} / ${insights.totalCards} studyable cards`}
          </Text>
          <Text style={styles.deckInsightText}>{`${insights.validPromptItemCount} prompt items`}</Text>
        </View>
      ) : null}
      <Text style={styles.deckMeta}>{timestampLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deckCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.m
  },
  deckCardPressed: {
    opacity: 0.9
  },
  deckCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deckType: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  deckName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  deckDescription: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22
  },
  deckInsightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  deckInsightText: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  deckMeta: {
    color: colors.muted,
    fontSize: typography.caption
  }
});
