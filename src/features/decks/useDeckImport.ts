import { useMemo, useState } from 'react';

import type { Deck } from '../../core/models/Deck';
import { createDeckWithImportedCards } from '../../storage/repositories/deckRepository';
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
  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not import the deck right now. Please try again.';
}

export function useDeckImport({
  existingDeckNames,
  onImportSuccess
}: UseDeckImportParams): UseDeckImportResult {
  const [importText, setImportText] = useState('');
  const [importResultMessage, setImportResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const importPreview = useMemo(
    () => buildDeckImportPreview(importText, existingDeckNames),
    [existingDeckNames, importText]
  );

  async function onImportDeck() {
    if (!importPreview.hasContent) {
      setImportResultMessage('Paste an exported deck before importing.');
      return;
    }

    if (!importPreview.canImport) {
      setImportResultMessage(
        importPreview.blockingError ??
          importPreview.headerError ??
          'This deck import is not ready yet.'
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
        `Imported ${result.deck.name} with ${result.importedCardCount} card${result.importedCardCount === 1 ? '' : 's'}. Skipped ${importPreview.cardPreview.invalidCount} invalid line${importPreview.cardPreview.invalidCount === 1 ? '' : 's'}.`
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
