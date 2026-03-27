import { FlatList, StyleSheet } from 'react-native';

import type { Card } from '../../../core/models/Card';
import { buildCardStudyFeedback } from '../../../features/study/cardStudyPreview';
import { spacing } from '../../theme';
import { CardWorkspaceFeedbackState } from './CardWorkspaceFeedbackState';
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
    return <CardWorkspaceFeedbackState isLoading message="Loading cards..." />;
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
        <CardWorkspaceFeedbackState
          message="Add the first card for this deck from the editor above or paste cards into the import panel."
          title="No cards yet"
        />
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
  }
});
