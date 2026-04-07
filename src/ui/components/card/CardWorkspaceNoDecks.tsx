import { ScrollView, StyleSheet } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { CsvImportField, CsvImportMapping, CsvImportPreview } from '../../../features/cards/csvImport';
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
  csvFileName: string | null;
  csvHeaders: string[];
  csvMapping: CsvImportMapping;
  csvPreview: CsvImportPreview;
  csvImportResultMessage: string | null;
  isCsvImportSubmitting: boolean;
  onPickCsvFile: () => Promise<void>;
  onChangeCsvMapping: (field: CsvImportField, header: string | null) => void;
  onImportCsv: () => Promise<void>;
  onClearCsvImport: () => void;
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
  csvFileName,
  csvHeaders,
  csvMapping,
  csvPreview,
  csvImportResultMessage,
  isCsvImportSubmitting,
  onPickCsvFile,
  onChangeCsvMapping,
  onImportCsv,
  onClearCsvImport,
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
        csvFileName={csvFileName}
        csvHeaders={csvHeaders}
        csvImportResultMessage={csvImportResultMessage}
        csvMapping={csvMapping}
        csvPreview={csvPreview}
        deckImportPreview={deckImportPreview}
        deckImportResultMessage={deckImportResultMessage}
        deckImportText={deckImportText}
        defaultSource="import_deck"
        isCardImportSubmitting={isCardImportSubmitting}
        isCsvImportSubmitting={isCsvImportSubmitting}
        isDeckImportSubmitting={isDeckImportSubmitting}
        onChangeCsvMapping={onChangeCsvMapping}
        isLocked={isCardImportSubmitting || isCsvImportSubmitting || isDeckImportSubmitting}
        onCardImportTextChange={onCardImportTextChange}
        onClearCardImport={onClearCardImport}
        onClearCsvImport={onClearCsvImport}
        onClearDeckImport={onClearDeckImport}
        onDeckImportTextChange={onDeckImportTextChange}
        onImportCards={onImportCards}
        onImportCsv={onImportCsv}
        onImportDeck={onImportDeck}
        onPickCsvFile={onPickCsvFile}
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
