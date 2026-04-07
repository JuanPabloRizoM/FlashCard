import { ScrollView, StyleSheet } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { useAppStrings } from '../../strings';
import { spacing } from '../../theme';
import { CardWorkspaceFeedbackState } from './CardWorkspaceFeedbackState';
import { ImportHubPanel } from './ImportHubPanel';

type CardWorkspaceNoDecksProps = {
  cardImportText: string;
  cardImportPreview: CardImportPreview;
  cardImportResultMessage: string | null;
  isCardImportSubmitting: boolean;
  onCardImportTextChange: (value: string) => void;
  onImportCards: () => Promise<void>;
  onClearCardImport: () => void;
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isDeckImportSubmitting: boolean;
  onDeckImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearDeckImport: () => void;
};

export function CardWorkspaceNoDecks({
  cardImportText,
  cardImportPreview,
  cardImportResultMessage,
  isCardImportSubmitting,
  onCardImportTextChange,
  onImportCards,
  onClearCardImport,
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isDeckImportSubmitting,
  onDeckImportTextChange,
  onImportDeck,
  onClearDeckImport
}: CardWorkspaceNoDecksProps) {
  const strings = useAppStrings();
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CardWorkspaceFeedbackState
        message={strings.cardsWorkspace.importNoDecksMessage}
        title={strings.cardsWorkspace.importNoDecksTitle}
      />
      <ImportHubPanel
        canImportCards={false}
        cardImportPreview={cardImportPreview}
        cardImportResultMessage={cardImportResultMessage}
        cardImportText={cardImportText}
        deckImportPreview={deckImportPreview}
        deckImportResultMessage={deckImportResultMessage}
        deckImportText={deckImportText}
        defaultSource="import_deck"
        isCardImportSubmitting={isCardImportSubmitting}
        isDeckImportSubmitting={isDeckImportSubmitting}
        isLocked={isCardImportSubmitting || isDeckImportSubmitting}
        onCardImportTextChange={onCardImportTextChange}
        onClearCardImport={onClearCardImport}
        onClearDeckImport={onClearDeckImport}
        onDeckImportTextChange={onDeckImportTextChange}
        onImportCards={onImportCards}
        onImportDeck={onImportDeck}
        selectedDeckName={null}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.m,
    paddingBottom: spacing.xl
  }
});
