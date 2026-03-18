import { useEffect, useState } from 'react';

import type { Deck } from '../../core/models/Deck';
import {
  getFirstDeckValidationError,
  normalizeDeckName,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import { createDeck, listDecks } from '../../storage/repositories/deckRepository';

type UseDecksResult = {
  decks: Deck[];
  draftName: string;
  formError: string | null;
  screenError: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onDraftNameChange: (value: string) => void;
  onCreateDeck: () => Promise<void>;
};

function getDeckSaveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not save the deck. Please try again.';
}

export function useDecks(): UseDecksResult {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [draftName, setDraftName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDecks() {
      try {
        const storedDecks = await listDecks();

        if (!isMounted) {
          return;
        }

        setDecks(storedDecks);
        setScreenError(null);
      } catch {
        if (isMounted) {
          setScreenError('Could not load decks right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDecks();

    return () => {
      isMounted = false;
    };
  }, []);

  async function onCreateDeck() {
    const normalizedName = normalizeDeckName(draftName);
    const validationError = getFirstDeckValidationError(
      validateCreateDeckInput({ name: normalizedName })
    );

    if (validationError != null) {
      setFormError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      const newDeck = await createDeck({ name: normalizedName });

      setDecks((currentDecks) => [newDeck, ...currentDecks]);
      setDraftName('');
      setFormError(null);
      setScreenError(null);
    } catch (error) {
      setFormError(getDeckSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onDraftNameChange(value: string) {
    setDraftName(value);

    if (formError != null) {
      setFormError(null);
    }
  }

  return {
    decks,
    draftName,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    canSubmit: normalizeDeckName(draftName).length > 0 && !isSubmitting,
    onDraftNameChange,
    onCreateDeck
  };
}
