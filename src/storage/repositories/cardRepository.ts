import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Card } from '../../core/models/Card';
import type { CreateCardInput, UpdateCardInput } from '../../core/types/card';
import {
  INVALID_CARD_DECK_MESSAGE,
  validateCardId,
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { getDatabase } from '../database';
import {
  createCard as createWebCard,
  createCardsBatch as createWebCardsBatch,
  listAllCards as listAllWebCards,
  listCardsByDeck as listWebCardsByDeck,
  updateCard as updateWebCard
} from './webCardRepository';

type CardRow = {
  id: number;
  deck_id: number;
  title: string;
  translation: string | null;
  definition: string | null;
  example: string | null;
  application: string | null;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
};

function mapCardRow(row: CardRow): Card {
  return {
    id: row.id,
    deckId: row.deck_id,
    title: row.title,
    translation: row.translation,
    definition: row.definition,
    example: row.example,
    application: row.application,
    imageUri: row.image_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const db = await getDatabase();
  const deck = await db.getFirstAsync<{ id: number }>('SELECT id FROM decks WHERE id = ?', deckId);

  if (deck == null) {
    throw new Error(INVALID_CARD_DECK_MESSAGE);
  }
}

export async function listCardsByDeck(deckId: number): Promise<Card[]> {
  if (Platform.OS === 'web') {
    return listWebCardsByDeck(deckId);
  }

  if (!Number.isInteger(deckId) || deckId <= 0) {
    throw new Error(INVALID_CARD_DECK_MESSAGE);
  }

  await ensureDeckExists(deckId);

  const db = await getDatabase();
  const rows = await db.getAllAsync<CardRow>(
    `
      SELECT id, deck_id, title, translation, definition, example, application, image_uri, created_at, updated_at
      FROM cards
      WHERE deck_id = ?
      ORDER BY created_at DESC, id DESC
    `,
    deckId
  );

  return rows.map(mapCardRow);
}

export async function listAllCards(): Promise<Card[]> {
  if (Platform.OS === 'web') {
    return listAllWebCards();
  }

  const db = await getDatabase();
  const rows = await db.getAllAsync<CardRow>(
    `
      SELECT id, deck_id, title, translation, definition, example, application, image_uri, created_at, updated_at
      FROM cards
      ORDER BY created_at DESC, id DESC
    `
  );

  return rows.map(mapCardRow);
}

export async function createCard(input: CreateCardInput): Promise<Card> {
  if (Platform.OS === 'web') {
    return createWebCard(input);
  }

  const normalizedInput = normalizeCreateCardInput(input);
  const validationError = getFirstCardValidationError(validateCreateCardInput(normalizedInput));

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureDeckExists(normalizedInput.deckId);

  const db = await getDatabase();
  const timestamp = new Date().toISOString();
  const result = await db.runAsync(
    `
      INSERT INTO cards (
        deck_id,
        title,
        translation,
        definition,
        example,
        application,
        image_uri,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    normalizedInput.deckId,
    normalizedInput.title,
    normalizedInput.translation,
    normalizedInput.definition,
    normalizedInput.example,
    normalizedInput.application,
    normalizedInput.imageUri,
    timestamp,
    timestamp
  );

  const insertedCard = await db.getFirstAsync<CardRow>(
    `
      SELECT id, deck_id, title, translation, definition, example, application, image_uri, created_at, updated_at
      FROM cards
      WHERE id = ?
    `,
    result.lastInsertRowId
  );

  if (insertedCard == null) {
    throw new Error('Card creation succeeded but the saved card could not be loaded.');
  }

  return mapCardRow(insertedCard);
}

export async function createCardsBatch(inputs: CreateCardInput[]): Promise<Card[]> {
  if (Platform.OS === 'web') {
    return createWebCardsBatch(inputs);
  }

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

  const db = await getDatabase();
  const timestamp = new Date().toISOString();
  const insertedIds: number[] = [];

  await db.withExclusiveTransactionAsync(async (tx: SQLiteDatabase) => {
    for (const input of normalizedInputs) {
      const result = await tx.runAsync(
        `
          INSERT INTO cards (
            deck_id,
            title,
            translation,
            definition,
            example,
            application,
            image_uri,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        input.deckId,
        input.title,
        input.translation,
        input.definition,
        input.example,
        input.application,
        input.imageUri,
        timestamp,
        timestamp
      );

      insertedIds.push(result.lastInsertRowId);
    }
  });

  const placeholders = insertedIds.map(() => '?').join(', ');
  const rows = await db.getAllAsync<CardRow>(
    `
      SELECT id, deck_id, title, translation, definition, example, application, image_uri, created_at, updated_at
      FROM cards
      WHERE id IN (${placeholders})
      ORDER BY created_at DESC, id DESC
    `,
    ...insertedIds
  );

  return rows.map(mapCardRow);
}

export async function updateCard(input: UpdateCardInput): Promise<Card> {
  if (Platform.OS === 'web') {
    return updateWebCard(input);
  }

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

  const db = await getDatabase();
  const timestamp = new Date().toISOString();
  const result = await db.runAsync(
    `
      UPDATE cards
      SET
        deck_id = ?,
        title = ?,
        translation = ?,
        definition = ?,
        example = ?,
        application = ?,
        image_uri = ?,
        updated_at = ?
      WHERE id = ?
    `,
    normalizedInput.deckId,
    normalizedInput.title,
    normalizedInput.translation,
    normalizedInput.definition,
    normalizedInput.example,
    normalizedInput.application,
    normalizedInput.imageUri,
    timestamp,
    input.id
  );

  if (result.changes === 0) {
    throw new Error(INVALID_CARD_DECK_MESSAGE);
  }

  const updatedCard = await db.getFirstAsync<CardRow>(
    `
      SELECT id, deck_id, title, translation, definition, example, application, image_uri, created_at, updated_at
      FROM cards
      WHERE id = ?
    `,
    input.id
  );

  if (updatedCard == null) {
    throw new Error('Card update succeeded but the saved card could not be loaded.');
  }

  return mapCardRow(updatedCard);
}
