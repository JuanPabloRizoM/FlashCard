import type { Card } from '../../core/models/Card';
import type { CreateCardInput, UpdateCardInput } from '../../core/types/card';
import {
  INVALID_CARD_DECK_MESSAGE,
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCardId,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { readWebAppState, writeWebAppState } from '../webAppStore';

function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((leftCard, rightCard) => {
    const leftTimestamp = new Date(leftCard.createdAt).getTime();
    const rightTimestamp = new Date(rightCard.createdAt).getTime();

    if (leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return rightCard.id - leftCard.id;
  });
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const state = await readWebAppState();
  const deck = state.decks.find((candidateDeck) => candidateDeck.id === deckId);

  if (deck == null) {
    throw new Error(INVALID_CARD_DECK_MESSAGE);
  }
}

export async function listCardsByDeck(deckId: number): Promise<Card[]> {
  if (!Number.isInteger(deckId) || deckId <= 0) {
    throw new Error(INVALID_CARD_DECK_MESSAGE);
  }

  await ensureDeckExists(deckId);

  const state = await readWebAppState();
  return sortCards(state.cards.filter((card) => card.deckId === deckId));
}

export async function listAllCards(): Promise<Card[]> {
  const state = await readWebAppState();
  return sortCards(state.cards);
}

export async function createCard(input: CreateCardInput): Promise<Card> {
  const normalizedInput = normalizeCreateCardInput(input);
  const validationError = getFirstCardValidationError(validateCreateCardInput(normalizedInput));

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureDeckExists(normalizedInput.deckId);

  const timestamp = new Date().toISOString();
  let createdCard: Card | null = null;

  await writeWebAppState((currentState) => {
    createdCard = {
      id: currentState.nextCardId,
      deckId: normalizedInput.deckId,
      front: normalizedInput.front,
      back: normalizedInput.back ?? '',
      description: normalizedInput.description,
      application: normalizedInput.application,
      imageUri: normalizedInput.imageUri,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return {
      ...currentState,
      cards: sortCards([createdCard, ...currentState.cards]),
      nextCardId: currentState.nextCardId + 1
    };
  });

  if (createdCard == null) {
    throw new Error('Card creation succeeded but the saved card could not be loaded.');
  }

  return createdCard;
}

export async function createCardsBatch(inputs: CreateCardInput[]): Promise<Card[]> {
  if (inputs.length === 0) {
    return [];
  }

  const normalizedInputs = inputs.map((input) => normalizeCreateCardInput(input));

  normalizedInputs.forEach((input) => {
    const validationError = getFirstCardValidationError(validateCreateCardInput(input));

    if (validationError != null) {
      throw new Error(validationError);
    }
  });

  await Promise.all([...new Set(normalizedInputs.map((input) => input.deckId))].map(ensureDeckExists));

  const timestamp = new Date().toISOString();
  let createdCards: Card[] = [];

  await writeWebAppState((currentState) => {
    createdCards = normalizedInputs.map((input, index) => ({
      id: currentState.nextCardId + index,
      deckId: input.deckId,
      front: input.front,
      back: input.back ?? '',
      description: input.description,
      application: input.application,
      imageUri: input.imageUri,
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    return {
      ...currentState,
      cards: sortCards([...createdCards, ...currentState.cards]),
      nextCardId: currentState.nextCardId + createdCards.length
    };
  });

  return createdCards;
}

export async function updateCard(input: UpdateCardInput): Promise<Card> {
  const cardIdError = validateCardId(input.id);

  if (cardIdError != null) {
    throw new Error(cardIdError);
  }

  const normalizedInput = normalizeCreateCardInput(input);
  const validationError = getFirstCardValidationError(validateCreateCardInput(normalizedInput));

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureDeckExists(normalizedInput.deckId);

  const timestamp = new Date().toISOString();
  let updatedCard: Card | null = null;

  await writeWebAppState((currentState) => {
    const existingCard = currentState.cards.find((card) => card.id === input.id);

    if (existingCard == null) {
      throw new Error(INVALID_CARD_DECK_MESSAGE);
    }

    const nextCard: Card = {
      ...existingCard,
      deckId: normalizedInput.deckId,
      front: normalizedInput.front,
      back: normalizedInput.back ?? '',
      description: normalizedInput.description,
      application: normalizedInput.application,
      imageUri: normalizedInput.imageUri,
      updatedAt: timestamp
    };
    updatedCard = nextCard;

    return {
      ...currentState,
      cards: sortCards(currentState.cards.map((card) => (card.id === nextCard.id ? nextCard : card)))
    };
  });

  if (updatedCard == null) {
    throw new Error('Card update succeeded but the saved card could not be loaded.');
  }

  return updatedCard;
}
