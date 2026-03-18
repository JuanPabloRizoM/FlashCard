import type { CreateDeckInput } from '../../core/types/deck';
import {
  DEFAULT_DECK_TYPE,
  DECK_TYPES,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_NAME_LENGTH,
  type DeckType
} from '../../core/types/deck';

const DECK_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const DECK_DUPLICATE_NAME_MESSAGE = 'A deck with that name already exists.';
export const INVALID_DECK_NAME_MESSAGE = 'Enter a deck name.';
export const INVALID_DECK_TYPE_MESSAGE = 'Choose a valid deck type.';
export const INVALID_DECK_COLOR_MESSAGE = 'Choose a valid deck color.';

export type DeckValidationErrors = {
  name: string | null;
  description: string | null;
  type: string | null;
  color: string | null;
};

export type NormalizedCreateDeckInput = {
  name: string;
  description: string | null;
  type: DeckType;
  color: string | null;
};

export function normalizeDeckName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

export function normalizeDeckDescription(description?: string | null): string | null {
  if (description == null) {
    return null;
  }

  const normalizedDescription = description.replace(/\s+/g, ' ').trim();

  return normalizedDescription.length > 0 ? normalizedDescription : null;
}

export function normalizeDeckColor(color?: string | null): string | null {
  if (color == null) {
    return null;
  }

  const normalizedColor = color.trim();

  return normalizedColor.length > 0 ? normalizedColor.toUpperCase() : null;
}

export function normalizeCreateDeckInput(input: CreateDeckInput): NormalizedCreateDeckInput {
  return {
    name: normalizeDeckName(input.name),
    description: normalizeDeckDescription(input.description),
    type: input.type ?? DEFAULT_DECK_TYPE,
    color: normalizeDeckColor(input.color)
  };
}

export function isDeckType(value: string): value is DeckType {
  return DECK_TYPES.includes(value as DeckType);
}

export function validateCreateDeckInput(input: CreateDeckInput): DeckValidationErrors {
  const normalizedInput = normalizeCreateDeckInput(input);

  return {
    name:
      normalizedInput.name.length === 0
        ? INVALID_DECK_NAME_MESSAGE
        : normalizedInput.name.length > MAX_DECK_NAME_LENGTH
          ? `Deck names must be ${MAX_DECK_NAME_LENGTH} characters or fewer.`
          : null,
    description:
      normalizedInput.description != null &&
      normalizedInput.description.length > MAX_DECK_DESCRIPTION_LENGTH
        ? `Deck descriptions must be ${MAX_DECK_DESCRIPTION_LENGTH} characters or fewer.`
        : null,
    type: isDeckType(normalizedInput.type) ? null : INVALID_DECK_TYPE_MESSAGE,
    color:
      normalizedInput.color != null && !DECK_COLOR_PATTERN.test(normalizedInput.color)
        ? INVALID_DECK_COLOR_MESSAGE
        : null
  };
}

export function getFirstDeckValidationError(errors: DeckValidationErrors): string | null {
  return errors.name ?? errors.description ?? errors.type ?? errors.color;
}
