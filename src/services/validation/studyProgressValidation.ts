import { PROMPT_MODES, type PromptMode } from '../../core/types/study';
import {
  STUDY_PROGRESS_RESULTS,
  type StudyProgressKey,
  type StudyProgressResult,
  type UpsertStudyProgressResultInput
} from '../../core/types/studyProgress';
import { getRuntimeStrings } from '../../ui/strings';

export function getInvalidStudyProgressCardMessage(): string {
  return getRuntimeStrings().validation.invalidStudyProgressCard;
}

export function getInvalidStudyProgressDeckMessage(): string {
  return getRuntimeStrings().validation.invalidStudyProgressDeck;
}

function getInvalidStudyProgressPromptModeMessage(): string {
  return getRuntimeStrings().validation.invalidStudyProgressPromptMode;
}

function getInvalidStudyProgressResultMessage(): string {
  return getRuntimeStrings().validation.invalidStudyProgressResult;
}

function getInvalidStudyProgressStudiedAtMessage(): string {
  return getRuntimeStrings().validation.invalidStudyProgressTimestamp;
}

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
  return isValidPositiveInteger(cardId) ? null : getInvalidStudyProgressCardMessage();
}

export function validateStudyProgressKey(input: StudyProgressKey): StudyProgressKeyValidationErrors {
  return {
    cardId: validateStudyProgressCardId(input.cardId),
    promptMode: isValidPromptMode(input.promptMode)
      ? null
      : getInvalidStudyProgressPromptModeMessage()
  };
}

export function validateStudyProgressDeckId(deckId: number): string | null {
  return isValidPositiveInteger(deckId) ? null : getInvalidStudyProgressDeckMessage();
}

export function validateUpsertStudyProgressResultInput(
  input: UpsertStudyProgressResultInput
): StudyProgressUpsertValidationErrors {
  const keyErrors = validateStudyProgressKey(input);

  return {
    ...keyErrors,
    result: isValidStudyProgressResult(input.result) ? null : getInvalidStudyProgressResultMessage(),
    studiedAt: isValidTimestamp(input.studiedAt) ? null : getInvalidStudyProgressStudiedAtMessage()
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
