import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import type { Deck } from '../../core/models/Deck';
import type { Card } from '../../core/models/Card';
import type { DeckStudyInsights } from '../study/studyInsights';
import { buildDeckStudyInsights } from '../study/studyInsights';
import {
  getFirstDeckValidationError,
  normalizeDeckName,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import { createDeck, listDecks } from '../../storage/repositories/deckRepository';
import { listAllCards } from '../../storage/repositories/cardRepository';
import { getRuntimeStrings } from '../../ui/strings';

type UseDecksResult = {
  decks: Deck[];
  deckInsightsByDeckId: Record<number, DeckStudyInsights>;
  draftName: string;
  formError: string | null;
  screenError: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onDraftNameChange: (value: string) => void;
  onCreateDeck: () => Promise<void>;
  onRefreshDeckInsights: () => Promise<void>;
};

function getDeckSaveErrorMessage(error: unknown): string {
  const strings = getRuntimeStrings();

  if (error instanceof Error) {
    return error.message;
  }

  return strings.featureMessages.couldNotSaveDeck;
}

function buildDeckInsightMap(decks: Deck[], cards: Card[]): Record<number, DeckStudyInsights> {
  const cardsByDeckId = cards.reduce<Record<number, Card[]>>((groupedCards, card) => {
    const deckCards = groupedCards[card.deckId] ?? [];
    deckCards.push(card);
    groupedCards[card.deckId] = deckCards;
    return groupedCards;
  }, {});

  return decks.reduce<Record<number, DeckStudyInsights>>((insights, deck) => {
    insights[deck.id] = buildDeckStudyInsights(cardsByDeckId[deck.id] ?? []);
    return insights;
  }, {});
}

export function useDecks(): UseDecksResult {
  const strings = getRuntimeStrings();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckInsightsByDeckId, setDeckInsightsByDeckId] = useState<Record<number, DeckStudyInsights>>(
    {}
  );
  const [draftName, setDraftName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadDeckCollection(isMounted?: () => boolean) {
    try {
      const [deckResult, cardResult] = await Promise.allSettled([listDecks(), listAllCards()]);

      if (deckResult.status !== 'fulfilled') {
        throw new Error(strings.featureMessages.couldNotLoadDecks);
      }

      const storedDecks = deckResult.value;
      const storedCards = cardResult.status === 'fulfilled' ? cardResult.value : [];

      if (isMounted != null && !isMounted()) {
        return;
      }

      setDecks(storedDecks);
      setDeckInsightsByDeckId(buildDeckInsightMap(storedDecks, storedCards));

      if (cardResult.status === 'fulfilled') {
        setScreenError(null);
      } else {
        setScreenError(strings.common.decksLoadedButInsightsFailed);
      }
    } catch {
      if (isMounted == null || isMounted()) {
        setScreenError(strings.featureMessages.couldNotLoadDecks);
      }
    } finally {
      if (isMounted == null || isMounted()) {
        setIsLoading(false);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      void loadDeckCollection(() => isMounted);

      return () => {
        isMounted = false;
      };
    }, [])
  );

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
      setDeckInsightsByDeckId((currentInsights) => ({
        ...currentInsights,
        [newDeck.id]: buildDeckStudyInsights([])
      }));
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
    deckInsightsByDeckId,
    draftName,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    canSubmit: normalizeDeckName(draftName).length > 0 && !isSubmitting,
    onDraftNameChange,
    onCreateDeck,
    onRefreshDeckInsights: async () => {
      await loadDeckCollection();
    }
  };
}
