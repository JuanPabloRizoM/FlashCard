import type { Card } from '../core/models/Card';
import type { Deck } from '../core/models/Deck';
import type { StudyProgress } from '../core/models/StudyProgress';
import { DEFAULT_DECK_TYPE, DECK_TYPES, type DeckType } from '../core/types/deck';
import { PROMPT_MODES, type PromptMode } from '../core/types/study';
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
  nextDeckId: number;
  nextCardId: number;
  nextStudyProgressId: number;
  storageMode: WebStorageMode;
};

const EMPTY_WEB_APP_STATE: WebAppState = {
  decks: [],
  cards: [],
  studyProgress: [],
  nextDeckId: 1,
  nextCardId: 1,
  nextStudyProgressId: 1,
  storageMode: 'memory'
};

function isDeckType(value: unknown): value is DeckType {
  return typeof value === 'string' && DECK_TYPES.includes(value as DeckType);
}

function isPromptMode(value: unknown): value is PromptMode {
  return typeof value === 'string' && PROMPT_MODES.includes(value as PromptMode);
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

  const card = candidate as Partial<Card>;
  const id = normalizePositiveInteger(card.id, 0);
  const deckId = normalizePositiveInteger(card.deckId, 0);

  if (id === 0 || deckId === 0 || typeof card.title !== 'string' || card.title.trim().length === 0) {
    return null;
  }

  return {
    id,
    deckId,
    title: card.title,
    translation: typeof card.translation === 'string' ? card.translation : null,
    definition: typeof card.definition === 'string' ? card.definition : null,
    example: typeof card.example === 'string' ? card.example : null,
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
  const nextDeckId = getNextIdentifier(candidate.nextDeckId, decks.map((deck) => deck.id));
  const nextCardId = getNextIdentifier(candidate.nextCardId, cards.map((card) => card.id));
  const nextStudyProgressId = getNextIdentifier(
    candidate.nextStudyProgressId,
    studyProgress.map((progress) => progress.id)
  );

  return {
    decks,
    cards,
    studyProgress,
    nextDeckId,
    nextCardId,
    nextStudyProgressId,
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
