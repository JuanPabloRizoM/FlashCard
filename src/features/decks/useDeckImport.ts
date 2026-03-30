import { useMemo, useState } from 'react';

import type { Deck } from '../../core/models/Deck';
import { createDeckWithImportedCards } from '../../storage/repositories/deckRepository';
import { getRuntimeStrings } from '../../ui/strings';
import { buildDeckImportPreview, getDeckImportCardInputs } from './deckPortability';

type UseDeckImportParams = {
  existingDeckNames: string[];
  onImportSuccess: (deck: Deck) => void;
};

type UseDeckImportResult = {
  importText: string;
  importPreview: ReturnType<typeof buildDeckImportPreview>;
  importResultMessage: string | null;
  isSubmitting: boolean;
  onImportTextChange: (value: string) => void;
  onImportDeck: () => Promise<void>;
  onClearImport: () => void;
};

function getDeckImportErrorMessage(error: unknown): string {
  const strings = getRuntimeStrings();

  if (error instanceof Error) {
    return error.message;
  }

  return strings.featureMessages.couldNotImportDeck;
}

export function useDeckImport({
  existingDeckNames,
  onImportSuccess
}: UseDeckImportParams): UseDeckImportResult {
  const strings = getRuntimeStrings();
  const [importText, setImportText] = useState('');
  const [importResultMessage, setImportResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const importPreview = useMemo(
    () => buildDeckImportPreview(importText, existingDeckNames),
    [existingDeckNames, importText]
  );

  async function onImportDeck() {
    if (!importPreview.hasContent) {
      setImportResultMessage(strings.featureMessages.pasteExportedDeck);
      return;
    }

    if (!importPreview.canImport) {
      setImportResultMessage(
        importPreview.blockingError ??
          importPreview.headerError ??
          strings.featureMessages.deckImportNotReady
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const cards = getDeckImportCardInputs(importPreview);
      const result = await createDeckWithImportedCards(
        { name: importPreview.deckName },
        cards
      );

      onImportSuccess(result.deck);
      setImportResultMessage(
        strings.featureMessages.importedDeck(
          result.deck.name,
          result.importedCardCount,
          importPreview.cardPreview.invalidCount
        )
      );
      setImportText('');
    } catch (error) {
      setImportResultMessage(getDeckImportErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    importText,
    importPreview,
    importResultMessage,
    isSubmitting,
    onImportTextChange: (value) => {
      setImportText(value);
      setImportResultMessage(null);
    },
    onImportDeck,
    onClearImport: () => {
      setImportText('');
      setImportResultMessage(null);
    }
  };
}
