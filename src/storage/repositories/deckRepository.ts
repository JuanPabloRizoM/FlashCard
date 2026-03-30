import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Deck } from '../../core/models/Deck';
import type { CreateCardInput } from '../../core/types/card';
import type { CreateDeckInput, DeckType } from '../../core/types/deck';
import {
  getDeckDuplicateNameMessage,
  getFirstDeckValidationError,
  normalizeCreateDeckInput,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import {
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { getDatabase } from '../database';
import {
  createDeck as createWebDeck,
  createDeckWithImportedCards as createWebDeckWithImportedCards,
  listDecks as listWebDecks
} from './webDeckRepository';

type DeckRow = {
  id: number;
  name: string;
  description: string | null;
  type: DeckType;
  color: string | null;
  created_at: string;
  updated_at: string;
};

function mapDeckRow(row: DeckRow): Deck {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listDecks(): Promise<Deck[]> {
  if (Platform.OS === 'web') {
    return listWebDecks();
  }

  const db = await getDatabase();
  const rows = await db.getAllAsync<DeckRow>(
    `
      SELECT id, name, description, type, color, created_at, updated_at
      FROM decks
      ORDER BY created_at DESC, id DESC
    `
  );

  return rows.map(mapDeckRow);
}

export async function createDeck(input: CreateDeckInput): Promise<Deck> {
  if (Platform.OS === 'web') {
    return createWebDeck(input);
  }

  const db = await getDatabase();
  const normalizedInput = normalizeCreateDeckInput(input);
  const validationError = getFirstDeckValidationError(validateCreateDeckInput(normalizedInput));

  if (validationError != null) {
    throw new Error(validationError);
  }

  const timestamp = new Date().toISOString();

  let result;

  try {
    result = await db.runAsync(
      `
        INSERT INTO decks (name, description, type, color, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      normalizedInput.name,
      normalizedInput.description,
      normalizedInput.type,
      normalizedInput.color,
      timestamp,
      timestamp
    );
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('unique')) {
      throw new Error(getDeckDuplicateNameMessage());
    }

    throw error;
  }

  const insertedDeck = await db.getFirstAsync<DeckRow>(
    `
      SELECT id, name, description, type, color, created_at, updated_at
      FROM decks
      WHERE id = ?
    `,
    result.lastInsertRowId
  );

  if (insertedDeck == null) {
    throw new Error('Deck creation succeeded but the saved deck could not be loaded.');
  }

  return mapDeckRow(insertedDeck);
}

export async function createDeckWithImportedCards(
  deckInput: CreateDeckInput,
  cardInputs: Omit<CreateCardInput, 'deckId'>[]
): Promise<{ deck: Deck; importedCardCount: number }> {
  if (Platform.OS === 'web') {
    return createWebDeckWithImportedCards(deckInput, cardInputs);
  }

  const db = await getDatabase();
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
  let deckId: number | null = null;

  try {
    await db.withExclusiveTransactionAsync(async (tx: SQLiteDatabase) => {
      const deckResult = await tx.runAsync(
        `
          INSERT INTO decks (name, description, type, color, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        normalizedDeckInput.name,
        normalizedDeckInput.description,
        normalizedDeckInput.type,
        normalizedDeckInput.color,
        timestamp,
        timestamp
      );

      deckId = deckResult.lastInsertRowId;

      for (const cardInput of normalizedCardInputs) {
        await tx.runAsync(
          `
            INSERT INTO cards (
              deck_id,
              front,
              back,
              description,
              application,
              image_uri,
              created_at,
              updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          deckId,
          cardInput.front,
          cardInput.back,
          cardInput.description,
          cardInput.application,
          cardInput.imageUri,
          timestamp,
          timestamp
        );
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('unique')) {
      throw new Error(getDeckDuplicateNameMessage());
    }

    throw error;
  }

  if (deckId == null) {
    throw new Error('Deck import succeeded but the saved deck could not be loaded.');
  }

  const importedDeck = await db.getFirstAsync<DeckRow>(
    `
      SELECT id, name, description, type, color, created_at, updated_at
      FROM decks
      WHERE id = ?
    `,
    deckId
  );

  if (importedDeck == null) {
    throw new Error('Deck import succeeded but the saved deck could not be loaded.');
  }

  return {
    deck: mapDeckRow(importedDeck),
    importedCardCount: normalizedCardInputs.length
  };
}
