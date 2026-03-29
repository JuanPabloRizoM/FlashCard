import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Deck } from '../../../core/models/Deck';
import type { DeckStudyInsights } from '../../../features/study/studyInsights';
import { DECK_TYPE_LABELS } from '../../../core/types/deck';
import { DeckReadinessBadge } from './DeckReadinessBadge';
import { spacing, typography, useThemeColors, useThemedStyles, type ThemeColors } from '../../theme';

type DeckListItemProps = {
  deck: Deck;
  insights: DeckStudyInsights | null;
  timestampLabel: string;
  onPress: () => void;
};

export function DeckListItem({ deck, insights, timestampLabel, onPress }: DeckListItemProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  deckCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.s,
    padding: spacing.m
  },
  deckCardPressed: {
    borderColor: colors.borderStrong,
    opacity: 0.96
  },
  deckCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deckType: {
    color: colors.primary,
    fontSize: typography.overline,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  deckName: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700'
  },
  deckDescription: {
    color: colors.textSecondary,
    fontSize: typography.bodySmall,
    lineHeight: 22
  },
  deckInsightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s
  },
  deckInsightText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '600'
  },
  deckMeta: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});
