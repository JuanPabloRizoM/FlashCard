import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

import type { Card } from '../../core/models/Card';
import type { CreateCardInput } from '../../core/types/card';
import { createCardsBatch } from '../../storage/repositories/cardRepository';
import { buildCardImportPreview } from './cardImport';

type UseCardImportParams = {
  deckId: number | null;
  setCards: Dispatch<SetStateAction<Card[]>>;
  setScreenError: Dispatch<SetStateAction<string | null>>;
};

type UseCardImportResult = {
  importText: string;
  importPreview: ReturnType<typeof buildCardImportPreview>;
  importResultMessage: string | null;
  isImportSubmitting: boolean;
  onImportTextChange: (value: string) => void;
  onImportCards: () => Promise<void>;
  onClearImport: () => void;
};

export function useCardImport({
  deckId,
  setCards,
  setScreenError
}: UseCardImportParams): UseCardImportResult {
  const [importText, setImportText] = useState('');
  const [importResultMessage, setImportResultMessage] = useState<string | null>(null);
  const [isImportSubmitting, setIsImportSubmitting] = useState(false);
  const importPreview = useMemo(() => buildCardImportPreview(importText, deckId), [deckId, importText]);

  useEffect(() => {
    setImportText('');
    setImportResultMessage(null);
  }, [deckId]);

  async function onImportCards() {
    const validInputs = importPreview.validRows.reduce<CreateCardInput[]>((inputs, row) => {
      if (row.input != null) {
        inputs.push(row.input);
      }

      return inputs;
    }, []);

    if (deckId == null) {
      setImportResultMessage('Choose a deck before importing cards.');
      return;
    }

    if (validInputs.length === 0) {
      setImportResultMessage('No valid lines are ready to import yet.');
      return;
    }

    try {
      setIsImportSubmitting(true);
      const createdCards = await createCardsBatch(validInputs);

      setCards((currentCards) => [...createdCards, ...currentCards]);
      setImportResultMessage(
        `Imported ${createdCards.length} card${createdCards.length === 1 ? '' : 's'}. Skipped ${importPreview.invalidCount} invalid line${importPreview.invalidCount === 1 ? '' : 's'}.`
      );
      setImportText('');
      setScreenError(null);
    } catch (error) {
      setImportResultMessage(
        error instanceof Error
          ? error.message
          : 'Could not import cards right now. Please try again.'
      );
    } finally {
      setIsImportSubmitting(false);
    }
  }

  return {
    importText,
    importPreview,
    importResultMessage,
    isImportSubmitting,
    onImportTextChange: (value) => {
      setImportText(value);
      setImportResultMessage(null);
    },
    onImportCards,
    onClearImport: () => {
      setImportText('');
      setImportResultMessage(null);
    }
  };
}
