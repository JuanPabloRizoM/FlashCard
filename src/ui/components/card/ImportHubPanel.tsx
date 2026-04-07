import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { CsvImportField, CsvImportMapping, CsvImportPreview } from '../../../features/cards/csvImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { useAppStrings } from '../../strings';
import { spacing, typography, useThemedStyles, type ThemeColors } from '../../theme';
import { ImportHubPreviewContent } from './ImportHubPreviewContent';
import { ImportHubSourceSwitch } from './ImportHubSourceSwitch';
import { TextImportWorkspace } from './TextImportWorkspace';
import { CsvImportPanel } from './CsvImportPanel';

export type ImportHubSource = 'paste_text' | 'import_deck' | 'file';

type ImportHubPanelProps = {
  selectedDeckName: string | null;
  canImportCards: boolean;
  isLocked: boolean;
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
  defaultSource?: ImportHubSource;
};

export function ImportHubPanel({
  selectedDeckName,
  canImportCards,
  isLocked,
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
  onClearDeckImport,
  defaultSource = 'paste_text'
}: ImportHubPanelProps) {
  const strings = useAppStrings();
  const styles = useThemedStyles(createStyles);
  const [activeSource, setActiveSource] = useState<ImportHubSource>(defaultSource);

  useEffect(() => {
    setActiveSource(defaultSource);
  }, [defaultSource]);

  function getCardStatusText(): string | null {
    if (!cardImportPreview.hasContent) {
      return null;
    }

    if (cardImportPreview.validCount > 0) {
      return strings.cardImport.validReady(cardImportPreview.validCount);
    }

    if (cardImportPreview.invalidCount > 0) {
      return strings.cardImport.fixInvalidLines;
    }

    return null;
  }

  function getDeckStatusText(): string | null {
    if (!deckImportPreview.hasContent) {
      return null;
    }

    if (deckImportPreview.canImport) {
      if (deckImportPreview.cardPreview.validCount > 0) {
        return strings.deckImport.cardsReady(deckImportPreview.cardPreview.validCount);
      }

      return strings.deckImport.deckReady;
    }

    if (deckImportPreview.cardPreview.invalidCount > 0) {
      return strings.deckImport.fixInvalidLines;
    }

    return null;
  }

  const isFileSource = activeSource === 'file';
  const isDeckSource = activeSource === 'import_deck';
  const importText = isDeckSource ? deckImportText : cardImportText;
  const isSubmitting = isDeckSource ? isDeckImportSubmitting : isCardImportSubmitting;
  const actionLabel = isDeckSource
    ? isDeckImportSubmitting
      ? strings.deckImport.importing
      : strings.deckImport.actionLabel
    : isCardImportSubmitting
      ? strings.cardImport.importing
      : strings.cardImport.actionLabel;
  const title = isDeckSource ? strings.deckImport.title : strings.cardImport.title;
  const subtitle = isDeckSource
    ? strings.deckImport.subtitle
    : selectedDeckName != null
      ? strings.cardImport.subtitleForDeck(selectedDeckName)
      : strings.cardImport.subtitleNoDeck;
  const helperTarget = isDeckSource
    ? strings.importHub.targetNewDeck
    : selectedDeckName != null
      ? strings.importHub.targetDeck(selectedDeckName)
      : strings.importHub.targetDeckMissing;
  const exampleText = isDeckSource ? strings.deckImport.exampleText : strings.cardImport.exampleText;
  const isActionDisabled = isDeckSource
    ? isLocked || !deckImportPreview.canImport || isDeckImportSubmitting
    : isLocked || !canImportCards || cardImportPreview.validCount === 0 || isCardImportSubmitting;

  const summaryItems = isDeckSource
    ? [
        deckImportPreview.deckName.length > 0
          ? deckImportPreview.deckName
          : strings.deckImport.deckNameNotReady,
        strings.common.valid(deckImportPreview.cardPreview.validCount),
        strings.common.invalid(deckImportPreview.cardPreview.invalidCount)
      ]
    : cardImportPreview.hasContent
      ? [
          strings.common.valid(cardImportPreview.validCount),
          strings.common.invalid(cardImportPreview.invalidCount),
          strings.common.total(cardImportPreview.totalCount)
        ]
      : [];
  const errorMessages = isDeckSource
    ? [deckImportPreview.blockingError, deckImportPreview.headerError].filter(
        (message): message is string => message != null
      )
    : [];
  const resultMessage = isDeckSource ? deckImportResultMessage : cardImportResultMessage;
  const rows = isDeckSource ? deckImportPreview.cardPreview.rows : cardImportPreview.rows;
  const emptyValidDetailLabel = isDeckSource ? strings.deckImport.frontBackOnly : undefined;
  const statusText = isDeckSource ? getDeckStatusText() : getCardStatusText();
  const topSlot = (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.panelTitle}>{strings.importHub.title}</Text>
        <Text style={styles.panelSubtitle}>{strings.importHub.subtitle}</Text>
      </View>
      <ImportHubSourceSwitch
        activeSource={activeSource}
        isDisabled={isLocked}
        onChangeSource={setActiveSource}
      />
      <Text style={styles.targetLabel}>{helperTarget}</Text>
    </>
  );

  if (isFileSource) {
    return (
      <View style={styles.panel}>
        {topSlot}
        <CsvImportPanel
          fileName={csvFileName}
          headers={csvHeaders}
          importResultMessage={csvImportResultMessage}
          isDisabled={isLocked || selectedDeckName == null}
          isSubmitting={isCsvImportSubmitting}
          mapping={csvMapping}
          onChangeMapping={onChangeCsvMapping}
          onClearFile={onClearCsvImport}
          onImportCsv={onImportCsv}
          onPickFile={onPickCsvFile}
          preview={csvPreview}
        />
      </View>
    );
  }

  return (
    <TextImportWorkspace
      actionLabel={actionLabel}
      exampleText={exampleText}
      importText={importText}
      isActionDisabled={isActionDisabled}
      isSubmitting={isSubmitting}
      onAction={() => {
        if (isDeckSource) {
          void onImportDeck();
          return;
        }

        void onImportCards();
      }}
      onClearImport={isDeckSource ? onClearDeckImport : onClearCardImport}
      onImportTextChange={isDeckSource ? onDeckImportTextChange : onCardImportTextChange}
      subtitle={subtitle}
      title={title}
      topSlot={topSlot}
    >
      <ImportHubPreviewContent
        emptyValidDetailLabel={emptyValidDetailLabel}
        errorMessages={errorMessages}
        resultMessage={resultMessage}
        rows={rows}
        statusText={statusText}
        summaryItems={summaryItems}
      />
    </TextImportWorkspace>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      gap: spacing.m,
      padding: spacing.l
    },
    headerBlock: {
      gap: spacing.xs
    },
    panelTitle: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: '700'
    },
    panelSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      lineHeight: 18
    },
    targetLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: '600'
    }
  });
