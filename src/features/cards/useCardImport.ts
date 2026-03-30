import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

import type { Card } from '../../core/models/Card';
import type { CreateCardInput } from '../../core/types/card';
import { createCardsBatch } from '../../storage/repositories/cardRepository';
import { getRuntimeStrings } from '../../ui/strings';
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
  const strings = getRuntimeStrings();
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
      setImportResultMessage(strings.featureMessages.chooseDeckBeforeImportingCards);
      return;
    }

    if (validInputs.length === 0) {
      setImportResultMessage(strings.featureMessages.noValidCardLines);
      return;
    }

    try {
      setIsImportSubmitting(true);
      const createdCards = await createCardsBatch(validInputs);

      setCards((currentCards) => [...createdCards, ...currentCards]);
      setImportResultMessage(strings.featureMessages.importedCards(createdCards.length, importPreview.invalidCount));
      setImportText('');
      setScreenError(null);
    } catch (error) {
      setImportResultMessage(
        error instanceof Error
          ? error.message
          : strings.featureMessages.couldNotImportCards
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
