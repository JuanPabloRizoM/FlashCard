import { FlatList, StyleSheet } from 'react-native';

import type { Card } from '../../../core/models/Card';
import { buildCardStudyFeedback } from '../../../features/study/cardStudyPreview';
import { spacing } from '../../theme';
import { useAppStrings } from '../../strings';
import { CardWorkspaceFeedbackState } from './CardWorkspaceFeedbackState';
import { DeckCardListItem } from './DeckCardListItem';

type CardWorkspaceCardListProps = {
  cards: Card[];
  isLoading: boolean;
  onEditCard: (card: Card) => void;
  emptyTitle?: string;
  emptyMessage?: string;
};

function formatCardTimestampLabel(
  createdAt: string,
  updatedAt: string,
  createdLabel: string,
  updatedLabel: string,
  fallbackLabel: string
): string {
  const sourceDate = updatedAt !== createdAt ? updatedAt : createdAt;
  const date = new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  return `${updatedAt !== createdAt ? updatedLabel : createdLabel} ${date.toLocaleDateString()}`;
}

export function CardWorkspaceCardList({
  cards,
  isLoading,
  onEditCard,
  emptyTitle,
  emptyMessage
}: CardWorkspaceCardListProps) {
  const strings = useAppStrings();
  if (isLoading) {
    return <CardWorkspaceFeedbackState isLoading message={strings.common.loadingCards} />;
  }

  return (
    <FlatList
      contentContainerStyle={cards.length === 0 ? styles.emptyListContent : styles.listContent}
      data={cards}
      keyExtractor={(card) => card.id.toString()}
      renderItem={({ item }) => (
        <DeckCardListItem
          actionLabel={strings.cardsWorkspace.editCardAction}
          card={item}
          feedback={buildCardStudyFeedback(item)}
          onActionPress={() => {
            onEditCard(item);
          }}
          timestampLabel={formatCardTimestampLabel(
            item.createdAt,
            item.updatedAt,
            strings.common.created,
            strings.common.updated,
            strings.common.savedLocally
          )}
        />
      )}
      ListEmptyComponent={
        <CardWorkspaceFeedbackState
          message={emptyMessage ?? strings.cardsWorkspace.listEmptyMessage}
          title={emptyTitle ?? strings.cardsWorkspace.listEmptyTitle}
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
