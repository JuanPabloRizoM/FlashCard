import { PROMPT_MODES, type PromptMode } from '../../core/types/study';
import {
  STUDY_PROGRESS_RESULTS,
  type StudyProgressKey,
  type StudyProgressResult,
  type UpsertStudyProgressResultInput
} from '../../core/types/studyProgress';

export const INVALID_STUDY_PROGRESS_CARD_MESSAGE = 'Study progress requires a valid card.';
export const INVALID_STUDY_PROGRESS_DECK_MESSAGE = 'Study progress requires a valid deck.';
export const INVALID_STUDY_PROGRESS_PROMPT_MODE_MESSAGE =
  'Study progress requires a supported prompt mode.';
export const INVALID_STUDY_PROGRESS_RESULT_MESSAGE =
  'Study progress requires a supported study result.';
export const INVALID_STUDY_PROGRESS_STUDIED_AT_MESSAGE =
  'Study progress requires a valid study timestamp.';

export type StudyProgressKeyValidationErrors = {
  cardId: string | null;
  promptMode: string | null;
};

export type StudyProgressUpsertValidationErrors = StudyProgressKeyValidationErrors & {
  result: string | null;
  studiedAt: string | null;
};

function isValidPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isValidPromptMode(value: string): value is PromptMode {
  return PROMPT_MODES.includes(value as PromptMode);
}

function isValidStudyProgressResult(value: string): value is StudyProgressResult {
  return STUDY_PROGRESS_RESULTS.includes(value as StudyProgressResult);
}

function isValidTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

export function validateStudyProgressCardId(cardId: number): string | null {
  return isValidPositiveInteger(cardId) ? null : INVALID_STUDY_PROGRESS_CARD_MESSAGE;
}

export function validateStudyProgressKey(input: StudyProgressKey): StudyProgressKeyValidationErrors {
  return {
    cardId: validateStudyProgressCardId(input.cardId),
    promptMode: isValidPromptMode(input.promptMode)
      ? null
      : INVALID_STUDY_PROGRESS_PROMPT_MODE_MESSAGE
  };
}

export function validateStudyProgressDeckId(deckId: number): string | null {
  return isValidPositiveInteger(deckId) ? null : INVALID_STUDY_PROGRESS_DECK_MESSAGE;
}

export function validateUpsertStudyProgressResultInput(
  input: UpsertStudyProgressResultInput
): StudyProgressUpsertValidationErrors {
  const keyErrors = validateStudyProgressKey(input);

  return {
    ...keyErrors,
    result: isValidStudyProgressResult(input.result) ? null : INVALID_STUDY_PROGRESS_RESULT_MESSAGE,
    studiedAt: isValidTimestamp(input.studiedAt) ? null : INVALID_STUDY_PROGRESS_STUDIED_AT_MESSAGE
  };
}

export function getFirstStudyProgressKeyValidationError(
  errors: StudyProgressKeyValidationErrors
): string | null {
  return errors.cardId ?? errors.promptMode;
}

export function getFirstStudyProgressUpsertValidationError(
  errors: StudyProgressUpsertValidationErrors
): string | null {
  return errors.cardId ?? errors.promptMode ?? errors.result ?? errors.studiedAt;
}
