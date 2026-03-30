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
  getInvalidStudyProgressCardMessage,
  getInvalidStudyProgressDeckMessage,
  validateStudyProgressCardId,
  validateStudyProgressDeckId,
  validateStudyProgressKey,
  validateUpsertStudyProgressResultInput
} from '../../services/validation/studyProgressValidation';
import { readWebAppState, writeWebAppState } from '../webAppStore';

function sortStudyProgress(progressItems: StudyProgress[]): StudyProgress[] {
  return [...progressItems].sort((leftItem, rightItem) => {
    const leftTimestamp = new Date(leftItem.updatedAt).getTime();
    const rightTimestamp = new Date(rightItem.updatedAt).getTime();

    if (leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return rightItem.id - leftItem.id;
  });
}

async function ensureCardExists(cardId: number): Promise<void> {
  const state = await readWebAppState();
  const card = state.cards.find((candidateCard) => candidateCard.id === cardId);

  if (card == null) {
    throw new Error(getInvalidStudyProgressCardMessage());
  }
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const state = await readWebAppState();
  const deck = state.decks.find((candidateDeck) => candidateDeck.id === deckId);

  if (deck == null) {
    throw new Error(getInvalidStudyProgressDeckMessage());
  }
}

function findStudyProgress(
  progressItems: StudyProgress[],
  cardId: number,
  promptMode: PromptMode
): StudyProgress | null {
  return (
    progressItems.find(
      (progressItem) => progressItem.cardId === cardId && progressItem.promptMode === promptMode
    ) ?? null
  );
}

export async function getByCardAndPrompt(input: StudyProgressKey): Promise<StudyProgress | null> {
  const validationError = getFirstStudyProgressKeyValidationError(validateStudyProgressKey(input));

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(input.cardId);

  const state = await readWebAppState();
  return findStudyProgress(state.studyProgress, input.cardId, input.promptMode);
}

export async function upsertResult(
  input: UpsertStudyProgressResultInput
): Promise<StudyProgress> {
  const validationError = getFirstStudyProgressUpsertValidationError(
    validateUpsertStudyProgressResultInput(input)
  );

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(input.cardId);

  let savedProgress: StudyProgress | null = null;

  await writeWebAppState((currentState) => {
    const existingProgress = findStudyProgress(
      currentState.studyProgress,
      input.cardId,
      input.promptMode
    );

    if (existingProgress == null) {
      const nextProgress: StudyProgress = {
        id: currentState.nextStudyProgressId,
        cardId: input.cardId,
        promptMode: input.promptMode,
        timesSeen: 1,
        correctCount: input.result === 'correct' ? 1 : 0,
        incorrectCount: input.result === 'incorrect' ? 1 : 0,
        currentStreak: input.result === 'correct' ? 1 : 0,
        lastResult: input.result,
        lastStudiedAt: input.studiedAt,
        createdAt: input.studiedAt,
        updatedAt: input.studiedAt
      };
      savedProgress = nextProgress;

      return {
        ...currentState,
        studyProgress: sortStudyProgress([nextProgress, ...currentState.studyProgress]),
        nextStudyProgressId: currentState.nextStudyProgressId + 1
      };
    }

    const nextProgress: StudyProgress = {
      ...existingProgress,
      timesSeen: existingProgress.timesSeen + 1,
      correctCount: existingProgress.correctCount + (input.result === 'correct' ? 1 : 0),
      incorrectCount: existingProgress.incorrectCount + (input.result === 'incorrect' ? 1 : 0),
      currentStreak: input.result === 'correct' ? existingProgress.currentStreak + 1 : 0,
      lastResult: input.result,
      lastStudiedAt: input.studiedAt,
      updatedAt: input.studiedAt
    };
    savedProgress = nextProgress;

    return {
      ...currentState,
      studyProgress: sortStudyProgress(
        currentState.studyProgress.map((progressItem) =>
          progressItem.id === nextProgress.id ? nextProgress : progressItem
        )
      )
    };
  });

  if (savedProgress == null) {
    throw new Error('Study progress upsert succeeded but the saved progress could not be loaded.');
  }

  return savedProgress;
}

export async function listByCardId(cardId: number): Promise<StudyProgress[]> {
  const validationError = validateStudyProgressCardId(cardId);

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureCardExists(cardId);

  const state = await readWebAppState();
  return sortStudyProgress(state.studyProgress.filter((progressItem) => progressItem.cardId === cardId));
}

export async function listByDeckId(deckId: number): Promise<StudyProgress[]> {
  const validationError = validateStudyProgressDeckId(deckId);

  if (validationError != null) {
    throw new Error(validationError);
  }

  await ensureDeckExists(deckId);

  const state = await readWebAppState();
  const cardIds = new Set(
    state.cards.filter((card) => card.deckId === deckId).map((card) => card.id)
  );

  return sortStudyProgress(
    state.studyProgress.filter((progressItem) => cardIds.has(progressItem.cardId))
  );
}
