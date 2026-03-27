import type { Deck } from '../../core/models/Deck';
import type { CreateCardInput } from '../../core/types/card';
import type { CreateDeckInput } from '../../core/types/deck';
import {
  DECK_DUPLICATE_NAME_MESSAGE,
  getFirstDeckValidationError,
  normalizeCreateDeckInput,
  normalizeDeckName,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import {
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { readWebAppState, writeWebAppState } from '../webAppStore';

function sortDecks(decks: Deck[]): Deck[] {
  return [...decks].sort((leftDeck, rightDeck) => {
    const leftTimestamp = new Date(leftDeck.createdAt).getTime();
    const rightTimestamp = new Date(rightDeck.createdAt).getTime();

    if (leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return rightDeck.id - leftDeck.id;
  });
}

function hasDuplicateDeckName(decks: Deck[], deckName: string): boolean {
  const normalizedName = normalizeDeckName(deckName).toLocaleLowerCase();
  return decks.some((deck) => normalizeDeckName(deck.name).toLocaleLowerCase() === normalizedName);
}

export async function listDecks(): Promise<Deck[]> {
  const state = await readWebAppState();
  return sortDecks(state.decks);
}

export async function createDeck(input: CreateDeckInput): Promise<Deck> {
  const normalizedInput = normalizeCreateDeckInput(input);
  const validationError = getFirstDeckValidationError(validateCreateDeckInput(normalizedInput));

  if (validationError != null) {
    throw new Error(validationError);
  }

  const timestamp = new Date().toISOString();
  let createdDeck: Deck | null = null;

  await writeWebAppState((currentState) => {
    if (hasDuplicateDeckName(currentState.decks, normalizedInput.name)) {
      throw new Error(DECK_DUPLICATE_NAME_MESSAGE);
    }

    createdDeck = {
      id: currentState.nextDeckId,
      name: normalizedInput.name,
      description: normalizedInput.description,
      type: normalizedInput.type,
      color: normalizedInput.color,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return {
      ...currentState,
      decks: sortDecks([createdDeck, ...currentState.decks]),
      nextDeckId: currentState.nextDeckId + 1
    };
  });

  if (createdDeck == null) {
    throw new Error('Deck creation succeeded but the saved deck could not be loaded.');
  }

  return createdDeck;
}

export async function createDeckWithImportedCards(
  deckInput: CreateDeckInput,
  cardInputs: Omit<CreateCardInput, 'deckId'>[]
): Promise<{ deck: Deck; importedCardCount: number }> {
  const normalizedDeckInput = normalizeCreateDeckInput(deckInput);
  const deckValidationError = getFirstDeckValidationError(validateCreateDeckInput(normalizedDeckInput));

  if (deckValidationError != null) {
    throw new Error(deckValidationError);
  }

  const normalizedCardInputs = cardInputs.map((cardInput) =>
    normalizeCreateCardInput({
      deckId: 1,
      ...cardInput
    })
  );

  normalizedCardInputs.forEach((cardInput) => {
    const validationError = getFirstCardValidationError(validateCreateCardInput(cardInput));

    if (validationError != null) {
      throw new Error(validationError);
    }
  });

  const timestamp = new Date().toISOString();
  let importedDeck: Deck | null = null;

  await writeWebAppState((currentState) => {
    if (hasDuplicateDeckName(currentState.decks, normalizedDeckInput.name)) {
      throw new Error(DECK_DUPLICATE_NAME_MESSAGE);
    }

    const nextDeck: Deck = {
      id: currentState.nextDeckId,
      name: normalizedDeckInput.name,
      description: normalizedDeckInput.description,
      type: normalizedDeckInput.type,
      color: normalizedDeckInput.color,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    importedDeck = nextDeck;

    const importedCards = normalizedCardInputs.map((cardInput, index) => ({
      id: currentState.nextCardId + index,
      deckId: nextDeck.id,
      front: cardInput.front,
      back: cardInput.back ?? '',
      description: cardInput.description,
      application: cardInput.application,
      imageUri: cardInput.imageUri,
      createdAt: timestamp,
      updatedAt: timestamp
    }));

    return {
      ...currentState,
      decks: sortDecks([nextDeck, ...currentState.decks]),
      cards: [...importedCards, ...currentState.cards],
      nextDeckId: currentState.nextDeckId + 1,
      nextCardId: currentState.nextCardId + importedCards.length
    };
  });

  if (importedDeck == null) {
    throw new Error('Deck import succeeded but the saved deck could not be loaded.');
  }

  return {
    deck: importedDeck,
    importedCardCount: normalizedCardInputs.length
  };
}
