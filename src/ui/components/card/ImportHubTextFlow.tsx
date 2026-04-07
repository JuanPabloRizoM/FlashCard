import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { useAppStrings } from '../../strings';
import { ImportHubInfoCard } from './ImportHubInfoCard';
import { ImportHubPreviewContent } from './ImportHubPreviewContent';
import { TextImportWorkspace } from './TextImportWorkspace';

type ImportHubTextFlowProps = {
  isDeckFlow: boolean;
  source: 'paste_text' | 'notebooklm';
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
  deckImportText: string;
  deckImportPreview: DeckImportPreview;
  deckImportResultMessage: string | null;
  isDeckImportSubmitting: boolean;
  onDeckImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearDeckImport: () => void;
};

export function ImportHubTextFlow({
  isDeckFlow,
  source,
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
  deckImportText,
  deckImportPreview,
  deckImportResultMessage,
  isDeckImportSubmitting,
  onDeckImportTextChange,
  onImportDeck,
  onClearDeckImport
}: ImportHubTextFlowProps) {
  const strings = useAppStrings();
  const isNotebookLmSource = source === 'notebooklm';

  const title = isDeckFlow
    ? isNotebookLmSource
      ? strings.importHub.notebookLm.deckTitle
      : strings.deckImport.title
    : isNotebookLmSource
      ? strings.importHub.notebookLm.cardsTitle
      : strings.cardImport.title;
  const subtitle = isDeckFlow
    ? isNotebookLmSource
      ? strings.importHub.notebookLm.deckSubtitle
      : strings.deckImport.subtitle
    : isNotebookLmSource
      ? selectedDeckName != null
        ? strings.importHub.notebookLm.cardsSubtitleForDeck(selectedDeckName)
        : strings.cardImport.subtitleNoDeck
      : selectedDeckName != null
        ? strings.cardImport.subtitleForDeck(selectedDeckName)
        : strings.cardImport.subtitleNoDeck;
  const exampleText = isDeckFlow
    ? isNotebookLmSource
      ? strings.importHub.notebookLm.deckExample
      : strings.deckImport.exampleText
    : isNotebookLmSource
      ? strings.importHub.notebookLm.cardsExample
      : strings.cardImport.exampleText;
  const introSlot = isNotebookLmSource ? (
    <ImportHubInfoCard
      bullets={[
        strings.importHub.notebookLm.tipQa,
        strings.importHub.notebookLm.tipNotes,
        strings.importHub.notebookLm.tipCsv
      ]}
      support={isDeckFlow ? strings.importHub.notebookLm.deckSupport : strings.importHub.notebookLm.cardsSupport}
      title={strings.importHub.notebookLm.guideTitle}
    />
  ) : undefined;

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

  return (
    <TextImportWorkspace
      introSlot={introSlot}
      actionLabel={
        isDeckFlow
          ? isDeckImportSubmitting
            ? strings.deckImport.importing
            : strings.deckImport.actionLabel
          : isCardImportSubmitting
            ? strings.cardImport.importing
            : strings.cardImport.actionLabel
      }
      exampleText={exampleText}
      importText={isDeckFlow ? deckImportText : cardImportText}
      isActionDisabled={
        isDeckFlow
          ? isLocked || !deckImportPreview.canImport || isDeckImportSubmitting
          : isLocked || !canImportCards || cardImportPreview.validCount === 0 || isCardImportSubmitting
      }
      isEmbedded
      isSubmitting={isDeckFlow ? isDeckImportSubmitting : isCardImportSubmitting}
      onAction={() => {
        if (isDeckFlow) {
          void onImportDeck();
          return;
        }

        void onImportCards();
      }}
      onClearImport={isDeckFlow ? onClearDeckImport : onClearCardImport}
      onImportTextChange={isDeckFlow ? onDeckImportTextChange : onCardImportTextChange}
      subtitle={subtitle}
      title={title}
    >
      <ImportHubPreviewContent
        emptyValidDetailLabel={isDeckFlow ? strings.deckImport.frontBackOnly : undefined}
        errorMessages={
          isDeckFlow
            ? [deckImportPreview.blockingError, deckImportPreview.headerError].filter(
                (message): message is string => message != null
              )
            : []
        }
        resultMessage={isDeckFlow ? deckImportResultMessage : cardImportResultMessage}
        rows={isDeckFlow ? deckImportPreview.cardPreview.rows : cardImportPreview.rows}
        statusText={isDeckFlow ? getDeckStatusText() : getCardStatusText()}
        summaryItems={
          isDeckFlow
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
              : []
        }
      />
    </TextImportWorkspace>
  );
}
