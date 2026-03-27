import type { CreateCardInput, UpdateCardInput } from '../../core/types/card';
import {
  MAX_CARD_IMAGE_URI_LENGTH,
  MAX_CARD_LONG_TEXT_LENGTH,
  MAX_CARD_SHORT_TEXT_LENGTH,
  MAX_CARD_TITLE_LENGTH
} from '../../core/types/card';

export const INVALID_CARD_DECK_MESSAGE = 'Choose a valid deck before creating cards.';
export const INVALID_CARD_ID_MESSAGE = 'Choose a valid card before saving changes.';
export const INVALID_CARD_FRONT_MESSAGE = 'Enter the front of the card.';
export const INVALID_CARD_BACK_MESSAGE = 'Enter the back of the card.';

export type CardValidationErrors = {
  deckId: string | null;
  front: string | null;
  back: string | null;
  description: string | null;
  application: string | null;
  imageUri: string | null;
};

export type NormalizedCreateCardInput = {
  deckId: number;
  front: string;
  back: string;
  description: string | null;
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

export function normalizeCardFront(front: string): string {
  return front.replace(/\s+/g, ' ').trim();
}

function normalizeRequiredText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function normalizeCreateCardInput(input: CreateCardInput): NormalizedCreateCardInput {
  return {
    deckId: input.deckId,
    front: normalizeCardFront(input.front),
    back: normalizeRequiredText(input.back),
    description: normalizeOptionalText(input.description),
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
    front:
      normalizedInput.front.length === 0
        ? INVALID_CARD_FRONT_MESSAGE
        : normalizedInput.front.length > MAX_CARD_TITLE_LENGTH
          ? `Front values must be ${MAX_CARD_TITLE_LENGTH} characters or fewer.`
          : null,
    back:
      normalizedInput.back.length === 0
        ? INVALID_CARD_BACK_MESSAGE
        : normalizedInput.back.length > MAX_CARD_SHORT_TEXT_LENGTH
          ? `Back values must be ${MAX_CARD_SHORT_TEXT_LENGTH} characters or fewer.`
          : null,
    description:
      normalizedInput.description != null &&
      normalizedInput.description.length > MAX_CARD_LONG_TEXT_LENGTH
        ? `Descriptions must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
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
    errors.front ??
    errors.back ??
    errors.description ??
    errors.application ??
    errors.imageUri
  );
}

export function validateCardId(id: UpdateCardInput['id']): string | null {
  return Number.isInteger(id) && id > 0 ? null : INVALID_CARD_ID_MESSAGE;
}
