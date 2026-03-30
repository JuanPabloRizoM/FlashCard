import { ScrollView, StyleSheet } from 'react-native';

import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { DeckImportPanel } from '../deck/DeckImportPanel';
import { useAppStrings } from '../../strings';
import { spacing } from '../../theme';
import { CardWorkspaceFeedbackState } from './CardWorkspaceFeedbackState';

type CardWorkspaceNoDecksProps = {
  importText: string;
  preview: DeckImportPreview;
  importResultMessage: string | null;
  isSubmitting: boolean;
  onImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearImport: () => void;
};

export function CardWorkspaceNoDecks({
  importText,
  preview,
  importResultMessage,
  isSubmitting,
  onImportTextChange,
  onImportDeck,
  onClearImport
}: CardWorkspaceNoDecksProps) {
  const strings = useAppStrings();
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CardWorkspaceFeedbackState
        message={strings.cardsWorkspace.importNoDecksMessage}
        title={strings.cardsWorkspace.importNoDecksTitle}
      />
      <DeckImportPanel
        importResultMessage={importResultMessage}
        importText={importText}
        isDisabled={isSubmitting}
        isSubmitting={isSubmitting}
        onClearImport={onClearImport}
        onImportDeck={onImportDeck}
        onImportTextChange={onImportTextChange}
        preview={preview}
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
