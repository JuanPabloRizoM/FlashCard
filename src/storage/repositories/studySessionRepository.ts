import { Platform } from 'react-native';

import type { StudySessionAnswerRecord, StudySessionDetail, StudySessionRecord } from '../../core/models/StudySessionRecord';
import {
  PROMPT_MODES,
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZES,
  STUDY_TECHNIQUE_IDS,
  type PromptMode,
  type StudySessionMode,
  type StudySessionSize,
  type StudyTechniqueId
} from '../../core/types/study';
import { STUDY_PROGRESS_RESULTS, type StudyProgressResult } from '../../core/types/studyProgress';
import type { CreateStudySessionInput } from '../../core/types/studySession';
import { getDatabase } from '../database';
import {
  createSession as createWebSession,
  getDetailById as getWebSessionDetailById,
  listByDeckId as listWebSessionsByDeckId
} from './webStudySessionRepository';

type StudySessionRow = {
  id: number;
  deck_id: number;
  deck_name: string;
  technique_id: string;
  session_mode: string;
  session_size: string;
  answered_count: number;
  correct_count: number;
  incorrect_count: number;
  accuracy_percentage: number;
  best_streak: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
};

type StudySessionAnswerRow = {
  id: number;
  session_id: number;
  card_id: number;
  card_front: string;
  card_back: string;
  prompt_mode: string;
  prompt_kind: 'text' | 'image';
  prompt_label: string;
  prompt_value: string;
  response_label: string;
  response_value: string;
  result: string;
  sequence_number: number;
  answered_at: string;
  created_at: string;
};

function parseStudyTechniqueId(value: string): StudyTechniqueId {
  return STUDY_TECHNIQUE_IDS.includes(value as StudyTechniqueId)
    ? (value as StudyTechniqueId)
    : STUDY_TECHNIQUE_IDS[0];
}

function parseStudySessionMode(value: string): StudySessionMode {
  return STUDY_SESSION_MODES.includes(value as StudySessionMode)
    ? (value as StudySessionMode)
    : STUDY_SESSION_MODES[0];
}

function parseStudySessionSize(value: string): StudySessionSize {
  if (value === 'all') {
    return 'all';
  }

  const parsedValue = Number(value);

  return STUDY_SESSION_SIZES.includes(parsedValue as StudySessionSize)
    ? (parsedValue as StudySessionSize)
    : 'all';
}

function parsePromptMode(value: string): PromptMode {
  return PROMPT_MODES.includes(value as PromptMode) ? (value as PromptMode) : PROMPT_MODES[0];
}

function parseStudyProgressResult(value: string): StudyProgressResult {
  return STUDY_PROGRESS_RESULTS.includes(value as StudyProgressResult)
    ? (value as StudyProgressResult)
    : 'incorrect';
}

function mapSessionRow(row: StudySessionRow): StudySessionRecord {
  return {
    id: row.id,
    deckId: row.deck_id,
    deckName: row.deck_name,
    techniqueId: parseStudyTechniqueId(row.technique_id),
    sessionMode: parseStudySessionMode(row.session_mode),
    sessionSize: parseStudySessionSize(row.session_size),
    answeredCount: row.answered_count,
    correctCount: row.correct_count,
    incorrectCount: row.incorrect_count,
    accuracyPercentage: row.accuracy_percentage,
    bestStreak: row.best_streak,
    durationSeconds: row.duration_seconds,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAnswerRow(row: StudySessionAnswerRow): StudySessionAnswerRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    cardId: row.card_id,
    cardFront: row.card_front,
    cardBack: row.card_back,
    promptMode: parsePromptMode(row.prompt_mode),
    promptKind: row.prompt_kind,
    promptLabel: row.prompt_label,
    promptValue: row.prompt_value,
    responseLabel: row.response_label,
    responseValue: row.response_value,
    result: parseStudyProgressResult(row.result),
    sequenceNumber: row.sequence_number,
    answeredAt: row.answered_at,
    createdAt: row.created_at
  };
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const db = await getDatabase();
  const deck = await db.getFirstAsync<{ id: number }>('SELECT id FROM decks WHERE id = ?', deckId);

  if (deck == null) {
    throw new Error('Choose a valid deck before saving study results.');
  }
}

export async function createSession(input: CreateStudySessionInput): Promise<StudySessionDetail> {
  if (Platform.OS === 'web') {
    return createWebSession(input);
  }

  await ensureDeckExists(input.deckId);

  const db = await getDatabase();
  let sessionId: number | null = null;

  await db.withExclusiveTransactionAsync(async (tx) => {
    const sessionResult = await tx.runAsync(
      `
        INSERT INTO study_sessions (
          deck_id,
          deck_name,
          technique_id,
          session_mode,
          session_size,
          answered_count,
          correct_count,
          incorrect_count,
          accuracy_percentage,
          best_streak,
          duration_seconds,
          started_at,
          completed_at,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      input.deckId,
      input.deckName,
      input.techniqueId,
      input.sessionMode,
      String(input.sessionSize),
      input.answeredCount,
      input.correctCount,
      input.incorrectCount,
      input.accuracyPercentage,
      input.bestStreak,
      input.durationSeconds,
      input.startedAt,
      input.completedAt,
      input.completedAt,
      input.completedAt
    );

    sessionId = sessionResult.lastInsertRowId;

    for (const answer of input.answers) {
      await tx.runAsync(
        `
          INSERT INTO study_session_answers (
            session_id,
            card_id,
            card_front,
            card_back,
            prompt_mode,
            prompt_kind,
            prompt_label,
            prompt_value,
            response_label,
            response_value,
            result,
            sequence_number,
            answered_at,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        sessionId,
        answer.cardId,
        answer.cardFront,
        answer.cardBack,
        answer.promptMode,
        answer.promptKind,
        answer.promptLabel,
        answer.promptValue,
        answer.responseLabel,
        answer.responseValue,
        answer.result,
        answer.sequenceNumber,
        answer.answeredAt,
        answer.answeredAt
      );
    }
  });

  if (sessionId == null) {
    throw new Error('Study session save succeeded but the saved session could not be loaded.');
  }

  const detail = await getDetailById(sessionId);

  if (detail == null) {
    throw new Error('Study session save succeeded but the saved session could not be loaded.');
  }

  return detail;
}

export async function listByDeckId(deckId: number, limit = 8): Promise<StudySessionRecord[]> {
  if (Platform.OS === 'web') {
    return listWebSessionsByDeckId(deckId, limit);
  }

  await ensureDeckExists(deckId);

  const db = await getDatabase();
  const rows = await db.getAllAsync<StudySessionRow>(
    `
      SELECT
        id,
        deck_id,
        deck_name,
        technique_id,
        session_mode,
        session_size,
        answered_count,
        correct_count,
        incorrect_count,
        accuracy_percentage,
        best_streak,
        duration_seconds,
        started_at,
        completed_at,
        created_at,
        updated_at
      FROM study_sessions
      WHERE deck_id = ?
      ORDER BY completed_at DESC, id DESC
      LIMIT ?
    `,
    deckId,
    limit
  );

  return rows.map(mapSessionRow);
}

export async function getDetailById(sessionId: number): Promise<StudySessionDetail | null> {
  if (Platform.OS === 'web') {
    return getWebSessionDetailById(sessionId);
  }

  const db = await getDatabase();
  const sessionRow = await db.getFirstAsync<StudySessionRow>(
    `
      SELECT
        id,
        deck_id,
        deck_name,
        technique_id,
        session_mode,
        session_size,
        answered_count,
        correct_count,
        incorrect_count,
        accuracy_percentage,
        best_streak,
        duration_seconds,
        started_at,
        completed_at,
        created_at,
        updated_at
      FROM study_sessions
      WHERE id = ?
    `,
    sessionId
  );

  if (sessionRow == null) {
    return null;
  }

  const answerRows = await db.getAllAsync<StudySessionAnswerRow>(
    `
      SELECT
        id,
        session_id,
        card_id,
        card_front,
        card_back,
        prompt_mode,
        prompt_kind,
        prompt_label,
        prompt_value,
        response_label,
        response_value,
        result,
        sequence_number,
        answered_at,
        created_at
      FROM study_session_answers
      WHERE session_id = ?
      ORDER BY sequence_number ASC, id ASC
    `,
    sessionId
  );

  return {
    session: mapSessionRow(sessionRow),
    answers: answerRows.map(mapAnswerRow)
  };
}
