import type { CreateCardInput, UpdateCardInput } from '../../core/types/card';
import {
  MAX_CARD_IMAGE_URI_LENGTH,
  MAX_CARD_LONG_TEXT_LENGTH,
  MAX_CARD_SHORT_TEXT_LENGTH,
  MAX_CARD_TITLE_LENGTH
} from '../../core/types/card';
import { getRuntimeStrings } from '../../ui/strings';

export function getInvalidCardDeckMessage(): string {
  return getRuntimeStrings().validation.invalidCardDeck;
}

export function getInvalidCardIdMessage(): string {
  return getRuntimeStrings().validation.invalidCardId;
}

function getInvalidCardFrontMessage(): string {
  return getRuntimeStrings().validation.invalidCardFront;
}

function getInvalidCardBackMessage(): string {
  return getRuntimeStrings().validation.invalidCardBack;
}

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
  const strings = getRuntimeStrings();
  const normalizedInput = normalizeCreateCardInput(input);

  return {
    deckId:
      Number.isInteger(normalizedInput.deckId) && normalizedInput.deckId > 0
        ? null
        : getInvalidCardDeckMessage(),
    front:
      normalizedInput.front.length === 0
        ? getInvalidCardFrontMessage()
        : normalizedInput.front.length > MAX_CARD_TITLE_LENGTH
          ? strings.locale.startsWith('es')
            ? `Los valores de frente deben tener ${MAX_CARD_TITLE_LENGTH} caracteres o menos.`
            : `Front values must be ${MAX_CARD_TITLE_LENGTH} characters or fewer.`
          : null,
    back:
      normalizedInput.back.length === 0
        ? getInvalidCardBackMessage()
        : normalizedInput.back.length > MAX_CARD_SHORT_TEXT_LENGTH
          ? strings.locale.startsWith('es')
            ? `Los valores de reverso deben tener ${MAX_CARD_SHORT_TEXT_LENGTH} caracteres o menos.`
            : `Back values must be ${MAX_CARD_SHORT_TEXT_LENGTH} characters or fewer.`
          : null,
    description:
      normalizedInput.description != null &&
      normalizedInput.description.length > MAX_CARD_LONG_TEXT_LENGTH
        ? strings.locale.startsWith('es')
          ? `Las descripciones deben tener ${MAX_CARD_LONG_TEXT_LENGTH} caracteres o menos.`
          : `Descriptions must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
        : null,
    application:
      normalizedInput.application != null &&
      normalizedInput.application.length > MAX_CARD_LONG_TEXT_LENGTH
        ? strings.locale.startsWith('es')
          ? `Las aplicaciones deben tener ${MAX_CARD_LONG_TEXT_LENGTH} caracteres o menos.`
          : `Applications must be ${MAX_CARD_LONG_TEXT_LENGTH} characters or fewer.`
        : null,
    imageUri:
      normalizedInput.imageUri != null &&
      normalizedInput.imageUri.length > MAX_CARD_IMAGE_URI_LENGTH
        ? strings.locale.startsWith('es')
          ? `Los valores de imagen deben tener ${MAX_CARD_IMAGE_URI_LENGTH} caracteres o menos.`
          : `Image values must be ${MAX_CARD_IMAGE_URI_LENGTH} characters or fewer.`
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
  return Number.isInteger(id) && id > 0 ? null : getInvalidCardIdMessage();
}
