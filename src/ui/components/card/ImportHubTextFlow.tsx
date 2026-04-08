import type { CardImportPreview } from '../../../features/cards/cardImport';
import type { DeckImportPreview } from '../../../features/decks/deckPortability';
import { normalizeNotebookLmImportText } from '../../../features/cards/notebookLmImport';
import { useAppStrings } from '../../strings';
import { ImportHubReviewSection } from './ImportHubReviewSection';
import { TextImportWorkspace } from './TextImportWorkspace';
import type { ImportHubSource } from './importHubConfig';
import { getTextSourceProfile } from './importHubSourceProfiles';

type ImportHubTextFlowProps = {
  isDeckFlow: boolean;
  source: Exclude<ImportHubSource, 'csv_excel'>;
  reviewStepEyebrow: string;
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
  reviewStepEyebrow,
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
  const profile = getTextSourceProfile(strings, {
    isDeckFlow,
    selectedDeckName,
    source
  });
  const importText = isDeckFlow ? deckImportText : cardImportText;
  const onImportTextChange = isDeckFlow ? onDeckImportTextChange : onCardImportTextChange;

  function handleImportTextChange(value: string) {
    if (source === 'notebooklm') {
      onImportTextChange(normalizeNotebookLmImportText(value));
      return;
    }

    onImportTextChange(value);
  }

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
    <>
      <TextImportWorkspace
        introSlot={profile.introSlot}
        actionLabel=""
        exampleText={profile.exampleText}
        importText={importText}
        isActionDisabled
        isEmbedded
        isSubmitting={isDeckFlow ? isDeckImportSubmitting : isCardImportSubmitting}
        onAction={() => undefined}
        onClearImport={isDeckFlow ? onClearDeckImport : onClearCardImport}
        onImportTextChange={handleImportTextChange}
        showActionButton={false}
        subtitle={profile.subtitle}
        title={profile.title}
      />
      <ImportHubReviewSection
        actionLabel={
          isDeckFlow
            ? isDeckImportSubmitting
              ? strings.deckImport.importing
              : strings.deckImport.actionLabel
            : isCardImportSubmitting
              ? strings.cardImport.importing
              : strings.cardImport.actionLabel
        }
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
        isActionDisabled={
          isDeckFlow
            ? isLocked || !deckImportPreview.canImport || isDeckImportSubmitting
            : isLocked || !canImportCards || cardImportPreview.validCount === 0 || isCardImportSubmitting
        }
        onAction={() => {
          if (isDeckFlow) {
            void onImportDeck();
            return;
          }

          void onImportCards();
        }}
        stepEyebrow={reviewStepEyebrow}
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
        support={strings.importHub.reviewSupport}
        title={strings.importHub.reviewTitle}
      />
    </>
  );
}
