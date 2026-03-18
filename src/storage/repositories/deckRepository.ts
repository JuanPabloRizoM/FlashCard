import type { Deck } from '../../core/models/Deck';
import type { CreateDeckInput, DeckType } from '../../core/types/deck';
import {
  DECK_DUPLICATE_NAME_MESSAGE,
  getFirstDeckValidationError,
  normalizeCreateDeckInput,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import { getDatabase } from '../database';

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
      throw new Error(DECK_DUPLICATE_NAME_MESSAGE);
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
