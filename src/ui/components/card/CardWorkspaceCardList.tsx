import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import type { Card } from '../../../core/models/Card';
import { buildCardStudyFeedback } from '../../../features/study/cardStudyPreview';
import { colors, spacing, typography } from '../../theme';
import { DeckCardListItem } from './DeckCardListItem';

type CardWorkspaceCardListProps = {
  cards: Card[];
  isLoading: boolean;
  onEditCard: (card: Card) => void;
};

function formatCardTimestampLabel(createdAt: string, updatedAt: string): string {
  const sourceDate = updatedAt !== createdAt ? updatedAt : createdAt;
  const date = new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return 'Saved locally';
  }

  return `${updatedAt !== createdAt ? 'Updated' : 'Created'} ${date.toLocaleDateString()}`;
}

export function CardWorkspaceCardList({
  cards,
  isLoading,
  onEditCard
}: CardWorkspaceCardListProps) {
  if (isLoading) {
    return (
      <View style={styles.feedbackState}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.feedbackText}>Loading cards...</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={cards.length === 0 ? styles.emptyListContent : styles.listContent}
      data={cards}
      keyExtractor={(card) => card.id.toString()}
      renderItem={({ item }) => (
        <DeckCardListItem
          actionLabel="Edit card"
          card={item}
          feedback={buildCardStudyFeedback(item)}
          onActionPress={() => {
            onEditCard(item);
          }}
          timestampLabel={formatCardTimestampLabel(item.createdAt, item.updatedAt)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.feedbackState}>
          <Text style={styles.feedbackTitle}>No cards yet</Text>
          <Text style={styles.feedbackText}>
            Add the first card for this deck from the editor above or paste cards into the import panel.
          </Text>
        </View>
      }
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.s
  },
  emptyListContent: {
    flexGrow: 1
  },
  feedbackState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.s,
    justifyContent: 'center',
    minHeight: 160,
    padding: spacing.l
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700'
  },
  feedbackText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center'
  }
});
