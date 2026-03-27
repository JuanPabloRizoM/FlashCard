import { Platform } from 'react-native';
import type { StudyProgress } from '../../core/models/StudyProgress';
import type { PromptMode } from '../../core/types/study';
import type {
  StudyProgressKey,
  StudyProgressResult,
  UpsertStudyProgressResultInput
} from '../../core/types/studyProgress';
import {
  getFirstStudyProgressKeyValidationError,
  getFirstStudyProgressUpsertValidationError,
  INVALID_STUDY_PROGRESS_CARD_MESSAGE,
  INVALID_STUDY_PROGRESS_DECK_MESSAGE,
  validateStudyProgressCardId,
  validateStudyProgressDeckId,
  validateStudyProgressKey,
  validateUpsertStudyProgressResultInput
} from '../../services/validation/studyProgressValidation';
import { getDatabase } from '../database';
import {
  getByCardAndPrompt as getWebStudyProgressByCardAndPrompt,
  listByCardId as listWebStudyProgressByCardId,
  listByDeckId as listWebStudyProgressByDeckId,
  upsertResult as upsertWebStudyProgressResult
} from './webStudyProgressRepository';

type StudyProgressRow = {
  id: number;
  card_id: number;
  prompt_mode: PromptMode;
  times_seen: number;
  correct_count: number;
  incorrect_count: number;
  current_streak: number;
  last_result: StudyProgressResult | null;
  last_studied_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapStudyProgressRow(row: StudyProgressRow): StudyProgress {
  return {
    id: row.id,
    cardId: row.card_id,
    promptMode: row.prompt_mode,
    timesSeen: row.times_seen,
    correctCount: row.correct_count,
    incorrectCount: row.incorrect_count,
    currentStreak: row.current_streak,
    lastResult: row.last_result,
    lastStudiedAt: row.last_studied_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureCardExists(cardId: number): Promise<void> {
  const db = await getDatabase();
  const card = await db.getFirstAsync<{ id: number }>('SELECT id FROM cards WHERE id = ?', cardId);

  if (card == null) {
    throw new Error(INVALID_STUDY_PROGRESS_CARD_MESSAGE);
  }
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const db = await getDatabase();
  const deck = await db.getFirstAsync<{ id: number }>('SELECT id FROM decks WHERE id = ?', deckId);

  if (deck == null) {
    throw new Error(INVALID_STUDY_PROGRESS_DECK_MESSAGE);
  }
}

async function loadStudyProgress(cardId: number, promptMode: PromptMode): Promise<StudyProgress> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<StudyProgressRow>(
    `
      SELECT
        id,
        card_id,
        prompt_mode,
        times_seen,
        correct_count,
        incorrect_count,
        current_streak,
        last_result,
        last_studied_at,
        created_at,
        updated_at
      FROM study_progress
      WHERE card_id = ? AND prompt_mode = ?
    `,
    cardId,
    promptMode
  );

  if (row == null) {
    throw new Error('Study progress upsert succeeded but the saved progress could not be loaded.');
  }

  return mapStudyProgressRow(row);
}

export async function getByCardAndPrompt(input: StudyProgressKey): Promise<StudyProgress | null> {
  if (Platform.OS === 'web') {
    return getWebStudyProgressByCardAndPrompt(input);
  }

  const validationError = getFirstStudyProgressKeyValidationError(validateStudyProgressKey(input));

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(input.cardId);

  const db = await getDatabase();
  const row = await db.getFirstAsync<StudyProgressRow>(
    `
      SELECT
        id,
        card_id,
        prompt_mode,
        times_seen,
        correct_count,
        incorrect_count,
        current_streak,
        last_result,
        last_studied_at,
        created_at,
        updated_at
      FROM study_progress
      WHERE card_id = ? AND prompt_mode = ?
    `,
    input.cardId,
    input.promptMode
  );

  return row != null ? mapStudyProgressRow(row) : null;
}

export async function upsertResult(
  input: UpsertStudyProgressResultInput
): Promise<StudyProgress> {
  if (Platform.OS === 'web') {
    return upsertWebStudyProgressResult(input);
  }

  const validationError = getFirstStudyProgressUpsertValidationError(
    validateUpsertStudyProgressResultInput(input)
  );

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(input.cardId);

  const db = await getDatabase();
  const correctIncrement = input.result === 'correct' ? 1 : 0;
  const incorrectIncrement = input.result === 'incorrect' ? 1 : 0;
  const initialStreak = input.result === 'correct' ? 1 : 0;

  await db.runAsync(
    `
      INSERT INTO study_progress (
        card_id,
        prompt_mode,
        times_seen,
        correct_count,
        incorrect_count,
        current_streak,
        last_result,
        last_studied_at,
        created_at,
        updated_at
      )
      VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(card_id, prompt_mode) DO UPDATE SET
        times_seen = study_progress.times_seen + 1,
        correct_count = study_progress.correct_count + excluded.correct_count,
        incorrect_count = study_progress.incorrect_count + excluded.incorrect_count,
        current_streak = CASE
          WHEN excluded.last_result = 'correct' THEN study_progress.current_streak + 1
          ELSE 0
        END,
        last_result = excluded.last_result,
        last_studied_at = excluded.last_studied_at,
        updated_at = excluded.updated_at
    `,
    input.cardId,
    input.promptMode,
    correctIncrement,
    incorrectIncrement,
    initialStreak,
    input.result,
    input.studiedAt,
    input.studiedAt,
    input.studiedAt
  );

  return loadStudyProgress(input.cardId, input.promptMode);
}

export async function listByCardId(cardId: number): Promise<StudyProgress[]> {
  if (Platform.OS === 'web') {
    return listWebStudyProgressByCardId(cardId);
  }

  const validationError = validateStudyProgressCardId(cardId);

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(cardId);

  const db = await getDatabase();
  const rows = await db.getAllAsync<StudyProgressRow>(
    `
      SELECT
        id,
        card_id,
        prompt_mode,
        times_seen,
        correct_count,
        incorrect_count,
        current_streak,
        last_result,
        last_studied_at,
        created_at,
        updated_at
      FROM study_progress
      WHERE card_id = ?
      ORDER BY updated_at DESC, id DESC
    `,
    cardId
  );

  return rows.map(mapStudyProgressRow);
}

export async function listByDeckId(deckId: number): Promise<StudyProgress[]> {
  if (Platform.OS === 'web') {
    return listWebStudyProgressByDeckId(deckId);
  }

  const validationError = validateStudyProgressDeckId(deckId);

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureDeckExists(deckId);

  const db = await getDatabase();
  const rows = await db.getAllAsync<StudyProgressRow>(
    `
      SELECT
        sp.id,
        sp.card_id,
        sp.prompt_mode,
        sp.times_seen,
        sp.correct_count,
        sp.incorrect_count,
        sp.current_streak,
        sp.last_result,
        sp.last_studied_at,
        sp.created_at,
        sp.updated_at
      FROM study_progress sp
      INNER JOIN cards c ON c.id = sp.card_id
      WHERE c.deck_id = ?
      ORDER BY sp.updated_at DESC, sp.id DESC
    `,
    deckId
  );

  return rows.map(mapStudyProgressRow);
}
