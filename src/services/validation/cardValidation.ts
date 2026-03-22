import type { CreateCardInput, UpdateCardInput } from '../../core/types/card';
import {
  MAX_CARD_IMAGE_URI_LENGTH,
  MAX_CARD_LONG_TEXT_LENGTH,
  MAX_CARD_SHORT_TEXT_LENGTH,
  MAX_CARD_TITLE_LENGTH
} from '../../core/types/card';

export const INVALID_CARD_DECK_MESSAGE = 'Choose a valid deck before creating cards.';
export const INVALID_CARD_ID_MESSAGE = 'Choose a valid card before saving changes.';
export const INVALID_CARD_TITLE_MESSAGE = 'Enter a card title.';

export type CardValidationErrors = {
  deckId: string | null;
  title: string | null;
  translation: string | null;
  definition: string | null;
  example: string | null;
  application: string | null;
  imageUri: string | null;
};

export type NormalizedCreateCardInput = {
  deckId: number;
  title: string;
  translation: string | null;
  definition: string | null;
  example: string | null;
  application: string | null;
  imageUri: string | null;
};

function normalizeOptionalText(value?: string | null): string | null {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.replace(/\s+/g, ' ').trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeCardTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim();
}

export function normalizeCreateCardInput(input: CreateCardInput): NormalizedCreateCardInput {
  return {
    deckId: input.deckId,
    title: normalizeCardTitle(input.title),
    translation: normalizeOptionalText(input.translation),
    definition: normalizeOptionalText(input.definition),
    example: normalizeOptionalText(input.example),
    application: normalizeOptionalText(input.application),
    imageUri: normalizeOptionalText(input.imageUri)
  };
}

export function validateCreateCardInput(input: CreateCardInput): CardValidationErrors {
  const normalizedInput = normalizeCreateCardInput(input);

  return {
    deckId:
      Number.isInteger(normalizedInput.deckId) && normalizedInput.deckId > 0
        ? null
        : INVALID_CARD_DECK_MESSAGE,
    title:
      normalizedInput.title.length === 0
        ? INVALID_CARD_TITLE_MESSAGE
        : normalizedInput.title.length > MAX_CARD_TITLE_LENGTH
          ? `Card titles must be ${MAX_CARD_TITLE_LENGTH} characters or fewer.`
          : null,
    translation:
      normalizedInput.translation != null &&
      normalizedInput.translation.length > MAX_CARD_SHORT_TEXT_LENGTH
        ? `Translations must be ${MAX_CARD_SHORT_TEXT_LENGTH} characters or fewer.`
        : null,
    definition:
      normalizedInput.definition != null &&
      normalizedInput.definition.length > MAX_CARD_LONG_TEXT_LENGTH
        ? `Definitions must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
        : null,
    example:
      normalizedInput.example != null &&
      normalizedInput.example.length > MAX_CARD_LONG_TEXT_LENGTH
        ? `Examples must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
        : null,
    application:
      normalizedInput.application != null &&
      normalizedInput.application.length > MAX_CARD_LONG_TEXT_LENGTH
        ? `Applications must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
        : null,
    imageUri:
      normalizedInput.imageUri != null &&
      normalizedInput.imageUri.length > MAX_CARD_IMAGE_URI_LENGTH
        ? `Image URLs must be ${MAX_CARD_IMAGE_URI_LENGTH} characters or fewer.`
        : null
  };
}

export function getFirstCardValidationError(errors: CardValidationErrors): string | null {
  return (
    errors.deckId ??
    errors.title ??
    errors.translation ??
    errors.definition ??
    errors.example ??
    errors.application ??
    errors.imageUri
  );
}

export function validateCardId(id: UpdateCardInput['id']): string | null {
  return Number.isInteger(id) && id > 0 ? null : INVALID_CARD_ID_MESSAGE;
}
