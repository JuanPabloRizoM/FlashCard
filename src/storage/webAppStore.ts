import type { Card } from '../core/models/Card';
import type { Deck } from '../core/models/Deck';
import type { StudyProgress } from '../core/models/StudyProgress';
import type { StudySessionAnswerRecord, StudySessionRecord } from '../core/models/StudySessionRecord';
import { DEFAULT_DECK_TYPE, DECK_TYPES, type DeckType } from '../core/types/deck';
import {
  PROMPT_MODES,
  STUDY_SESSION_MODES,
  STUDY_SESSION_SIZES,
  STUDY_TECHNIQUE_IDS,
  type PromptMode,
  type StudySessionMode,
  type StudySessionSize,
  type StudyTechniqueId
} from '../core/types/study';
import {
  STUDY_PROGRESS_RESULTS,
  type StudyProgressResult
} from '../core/types/studyProgress';
import {
  getWebStorageItem,
  getWebStorageMode,
  setWebStorageItem,
  type WebStorageMode
} from './webStorage';

const WEB_APP_STATE_STORAGE_KEY = 'flashcards_web_app_state_v1';

type WebAppState = {
  decks: Deck[];
  cards: Card[];
  studyProgress: StudyProgress[];
  studySessions: StudySessionRecord[];
  studySessionAnswers: StudySessionAnswerRecord[];
  nextDeckId: number;
  nextCardId: number;
  nextStudyProgressId: number;
  nextStudySessionId: number;
  nextStudySessionAnswerId: number;
  storageMode: WebStorageMode;
};

const EMPTY_WEB_APP_STATE: WebAppState = {
  decks: [],
  cards: [],
  studyProgress: [],
  studySessions: [],
  studySessionAnswers: [],
  nextDeckId: 1,
  nextCardId: 1,
  nextStudyProgressId: 1,
  nextStudySessionId: 1,
  nextStudySessionAnswerId: 1,
  storageMode: 'memory'
};

function isDeckType(value: unknown): value is DeckType {
  return typeof value === 'string' && DECK_TYPES.includes(value as DeckType);
}

function isPromptMode(value: unknown): value is PromptMode {
  return typeof value === 'string' && PROMPT_MODES.includes(value as PromptMode);
}

function isStudyTechniqueId(value: unknown): value is StudyTechniqueId {
  return typeof value === 'string' && STUDY_TECHNIQUE_IDS.includes(value as StudyTechniqueId);
}

function isStudySessionMode(value: unknown): value is StudySessionMode {
  return typeof value === 'string' && STUDY_SESSION_MODES.includes(value as StudySessionMode);
}

function isStudySessionSize(value: unknown): value is StudySessionSize {
  return (
    value === 'all' ||
    (typeof value === 'number' && STUDY_SESSION_SIZES.includes(value as StudySessionSize))
  );
}

function isStudyProgressResult(value: unknown): value is StudyProgressResult {
  return typeof value === 'string' && STUDY_PROGRESS_RESULTS.includes(value as StudyProgressResult);
}

function normalizeTimestamp(value: unknown): string {
  if (typeof value !== 'string') {
    return new Date().toISOString();
  }

  const timestamp = new Date(value);

  return Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : value;
}

function normalizePositiveInteger(value: unknown, fallback: number): number {
  return Number.isInteger(value) && (value as number) > 0 ? (value as number) : fallback;
}

function getNextIdentifier(currentValue: unknown, usedIdentifiers: number[]): number {
  return Math.max(normalizePositiveInteger(currentValue, 1), ...usedIdentifiers.map((id) => id + 1), 1);
}

function normalizeDeck(candidate: unknown): Deck | null {
  if (candidate == null || typeof candidate !== 'object') {
    return null;
  }

  const deck = candidate as Partial<Deck>;
  const id = normalizePositiveInteger(deck.id, 0);

  if (id === 0 || typeof deck.name !== 'string' || deck.name.trim().length === 0) {
    return null;
  }

  return {
    id,
    name: deck.name,
    description: typeof deck.description === 'string' ? deck.description : null,
    type: isDeckType(deck.type) ? deck.type : DEFAULT_DECK_TYPE,
    color: typeof deck.color === 'string' ? deck.color : null,
    createdAt: normalizeTimestamp(deck.createdAt),
    updatedAt: normalizeTimestamp(deck.updatedAt)
  };
}

function normalizeCard(candidate: unknown): Card | null {
  if (candidate == null || typeof candidate !== 'object') {
    return null;
  }

  const card = candidate as Partial<Card> & {
    title?: string;
    translation?: string | null;
    definition?: string | null;
    example?: string | null;
  };
  const id = normalizePositiveInteger(card.id, 0);
  const deckId = normalizePositiveInteger(card.deckId, 0);
  const front =
    typeof card.front === 'string'
      ? card.front
      : typeof card.title === 'string'
        ? card.title
        : '';
  const back =
    typeof card.back === 'string'
      ? card.back
      : typeof card.translation === 'string'
        ? card.translation
        : typeof card.definition === 'string'
          ? card.definition
          : typeof card.application === 'string'
            ? card.application
            : front;
  const description =
    typeof card.description === 'string'
      ? card.description
      : typeof card.definition === 'string'
        ? card.definition
        : null;

  if (id === 0 || deckId === 0 || front.trim().length === 0 || back.trim().length === 0) {
    return null;
  }

  return {
    id,
    deckId,
    front,
    back,
    description,
    application: typeof card.application === 'string' ? card.application : null,
    imageUri: typeof card.imageUri === 'string' ? card.imageUri : null,
    createdAt: normalizeTimestamp(card.createdAt),
    updatedAt: normalizeTimestamp(card.updatedAt)
  };
}

function normalizeStudyProgress(candidate: unknown): StudyProgress | null {
  if (candidate == null || typeof candidate !== 'object') {
    return null;
  }

  const progress = candidate as Partial<StudyProgress>;
  const id = normalizePositiveInteger(progress.id, 0);
  const cardId = normalizePositiveInteger(progress.cardId, 0);

  if (id === 0 || cardId === 0 || !isPromptMode(progress.promptMode)) {
    return null;
  }

  return {
    id,
    cardId,
    promptMode: progress.promptMode,
    timesSeen:
      Number.isInteger(progress.timesSeen) && (progress.timesSeen as number) >= 0
        ? (progress.timesSeen as number)
        : 0,
    correctCount:
      Number.isInteger(progress.correctCount) && (progress.correctCount as number) >= 0
        ? (progress.correctCount as number)
        : 0,
    incorrectCount:
      Number.isInteger(progress.incorrectCount) && (progress.incorrectCount as number) >= 0
        ? (progress.incorrectCount as number)
        : 0,
    currentStreak:
      Number.isInteger(progress.currentStreak) && (progress.currentStreak as number) >= 0
        ? (progress.currentStreak as number)
        : 0,
    lastResult: isStudyProgressResult(progress.lastResult) ? progress.lastResult : null,
    lastStudiedAt: typeof progress.lastStudiedAt === 'string' ? progress.lastStudiedAt : null,
    createdAt: normalizeTimestamp(progress.createdAt),
    updatedAt: normalizeTimestamp(progress.updatedAt)
  };
}

function normalizeStudySession(candidate: unknown): StudySessionRecord | null {
  if (candidate == null || typeof candidate !== 'object') {
    return null;
  }

  const session = candidate as Partial<StudySessionRecord>;
  const id = normalizePositiveInteger(session.id, 0);
  const deckId = normalizePositiveInteger(session.deckId, 0);

  if (
    id === 0 ||
    deckId === 0 ||
    typeof session.deckName !== 'string' ||
    session.deckName.trim().length === 0 ||
    !isStudyTechniqueId(session.techniqueId) ||
    !isStudySessionMode(session.sessionMode) ||
    !isStudySessionSize(session.sessionSize)
  ) {
    return null;
  }

  return {
    id,
    deckId,
    deckName: session.deckName,
    techniqueId: session.techniqueId,
    sessionMode: session.sessionMode,
    sessionSize: session.sessionSize,
    answeredCount:
      Number.isInteger(session.answeredCount) && (session.answeredCount as number) >= 0
        ? (session.answeredCount as number)
        : 0,
    correctCount:
      Number.isInteger(session.correctCount) && (session.correctCount as number) >= 0
        ? (session.correctCount as number)
        : 0,
    incorrectCount:
      Number.isInteger(session.incorrectCount) && (session.incorrectCount as number) >= 0
        ? (session.incorrectCount as number)
        : 0,
    accuracyPercentage:
      Number.isInteger(session.accuracyPercentage) && (session.accuracyPercentage as number) >= 0
        ? Math.min(100, session.accuracyPercentage as number)
        : 0,
    bestStreak:
      Number.isInteger(session.bestStreak) && (session.bestStreak as number) >= 0
        ? (session.bestStreak as number)
        : 0,
    durationSeconds:
      Number.isInteger(session.durationSeconds) && (session.durationSeconds as number) >= 0
        ? (session.durationSeconds as number)
        : 0,
    startedAt: normalizeTimestamp(session.startedAt),
    completedAt: normalizeTimestamp(session.completedAt),
    createdAt: normalizeTimestamp(session.createdAt),
    updatedAt: normalizeTimestamp(session.updatedAt)
  };
}

function normalizeStudySessionAnswer(candidate: unknown): StudySessionAnswerRecord | null {
  if (candidate == null || typeof candidate !== 'object') {
    return null;
  }

  const answer = candidate as Partial<StudySessionAnswerRecord>;
  const id = normalizePositiveInteger(answer.id, 0);
  const sessionId = normalizePositiveInteger(answer.sessionId, 0);
  const cardId = normalizePositiveInteger(answer.cardId, 0);

  if (
    id === 0 ||
    sessionId === 0 ||
    cardId === 0 ||
    typeof answer.cardFront !== 'string' ||
    typeof answer.cardBack !== 'string' ||
    !isPromptMode(answer.promptMode) ||
    (answer.promptKind !== 'text' && answer.promptKind !== 'image') ||
    typeof answer.promptLabel !== 'string' ||
    typeof answer.promptValue !== 'string' ||
    typeof answer.responseLabel !== 'string' ||
    typeof answer.responseValue !== 'string' ||
    !isStudyProgressResult(answer.result)
  ) {
    return null;
  }

  return {
    id,
    sessionId,
    cardId,
    cardFront: answer.cardFront,
    cardBack: answer.cardBack,
    promptMode: answer.promptMode,
    promptKind: answer.promptKind,
    promptLabel: answer.promptLabel,
    promptValue: answer.promptValue,
    responseLabel: answer.responseLabel,
    responseValue: answer.responseValue,
    result: answer.result,
    sequenceNumber:
      Number.isInteger(answer.sequenceNumber) && (answer.sequenceNumber as number) > 0
        ? (answer.sequenceNumber as number)
        : 1,
    answeredAt: normalizeTimestamp(answer.answeredAt),
    createdAt: normalizeTimestamp(answer.createdAt)
  };
}

function normalizeWebAppState(value: unknown): WebAppState {
  if (value == null || typeof value !== 'object') {
    return {
      ...EMPTY_WEB_APP_STATE,
      storageMode: getWebStorageMode()
    };
  }

  const candidate = value as Partial<WebAppState>;
  const decks = Array.isArray(candidate.decks)
    ? candidate.decks.map(normalizeDeck).filter((deck): deck is Deck => deck != null)
    : [];
  const cards = Array.isArray(candidate.cards)
    ? candidate.cards.map(normalizeCard).filter((card): card is Card => card != null)
    : [];
  const studyProgress = Array.isArray(candidate.studyProgress)
    ? candidate.studyProgress
        .map(normalizeStudyProgress)
        .filter((progress): progress is StudyProgress => progress != null)
    : [];
  const studySessions = Array.isArray(candidate.studySessions)
    ? candidate.studySessions
        .map(normalizeStudySession)
        .filter((session): session is StudySessionRecord => session != null)
    : [];
  const studySessionAnswers = Array.isArray(candidate.studySessionAnswers)
    ? candidate.studySessionAnswers
        .map(normalizeStudySessionAnswer)
        .filter((answer): answer is StudySessionAnswerRecord => answer != null)
    : [];
  const nextDeckId = getNextIdentifier(candidate.nextDeckId, decks.map((deck) => deck.id));
  const nextCardId = getNextIdentifier(candidate.nextCardId, cards.map((card) => card.id));
  const nextStudyProgressId = getNextIdentifier(
    candidate.nextStudyProgressId,
    studyProgress.map((progress) => progress.id)
  );
  const nextStudySessionId = getNextIdentifier(
    candidate.nextStudySessionId,
    studySessions.map((session) => session.id)
  );
  const nextStudySessionAnswerId = getNextIdentifier(
    candidate.nextStudySessionAnswerId,
    studySessionAnswers.map((answer) => answer.id)
  );

  return {
    decks,
    cards,
    studyProgress,
    studySessions,
    studySessionAnswers,
    nextDeckId,
    nextCardId,
    nextStudyProgressId,
    nextStudySessionId,
    nextStudySessionAnswerId,
    storageMode: getWebStorageMode()
  };
}

function persistWebAppState(state: WebAppState): void {
  setWebStorageItem(
    WEB_APP_STATE_STORAGE_KEY,
    JSON.stringify({
      ...state,
      storageMode: getWebStorageMode()
    })
  );
}

export async function initializeWebAppStore(): Promise<void> {
  await readWebAppState();
}

export async function readWebAppState(): Promise<WebAppState> {
  const storedValue = getWebStorageItem(WEB_APP_STATE_STORAGE_KEY);
  let normalizedState: WebAppState;

  try {
    normalizedState =
      storedValue == null ? normalizeWebAppState(null) : normalizeWebAppState(JSON.parse(storedValue));
  } catch {
    normalizedState = normalizeWebAppState(null);
  }

  persistWebAppState(normalizedState);
  return normalizedState;
}

export async function writeWebAppState(
  updater: (currentState: WebAppState) => WebAppState
): Promise<WebAppState> {
  const currentState = await readWebAppState();
  const nextState = normalizeWebAppState(updater(currentState));

  persistWebAppState(nextState);
  return nextState;
}
