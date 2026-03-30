import type { CreateDeckInput } from '../../core/types/deck';
import {
  DEFAULT_DECK_TYPE,
  DECK_TYPES,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_NAME_LENGTH,
  type DeckType
} from '../../core/types/deck';
import { getRuntimeStrings } from '../../ui/strings';

const DECK_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function getDeckDuplicateNameMessage(): string {
  return getRuntimeStrings().validation.duplicateDeckName;
}

function getInvalidDeckNameMessage(): string {
  return getRuntimeStrings().validation.invalidDeckName;
}

function getInvalidDeckTypeMessage(): string {
  return getRuntimeStrings().validation.invalidDeckType;
}

function getInvalidDeckColorMessage(): string {
  return getRuntimeStrings().validation.invalidDeckColor;
}

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
  const strings = getRuntimeStrings();
  const normalizedInput = normalizeCreateDeckInput(input);

  return {
    name:
      normalizedInput.name.length === 0
        ? getInvalidDeckNameMessage()
        : normalizedInput.name.length > MAX_DECK_NAME_LENGTH
          ? strings.locale.startsWith('es')
            ? `Los nombres de mazo deben tener ${MAX_DECK_NAME_LENGTH} caracteres o menos.`
            : `Deck names must be ${MAX_DECK_NAME_LENGTH} characters or fewer.`
          : null,
    description:
      normalizedInput.description != null &&
      normalizedInput.description.length > MAX_DECK_DESCRIPTION_LENGTH
        ? strings.locale.startsWith('es')
          ? `Las descripciones de mazo deben tener ${MAX_DECK_DESCRIPTION_LENGTH} caracteres o menos.`
          : `Deck descriptions must be ${MAX_DECK_DESCRIPTION_LENGTH} characters or fewer.`
        : null,
    type: isDeckType(normalizedInput.type) ? null : getInvalidDeckTypeMessage(),
    color:
      normalizedInput.color != null && !DECK_COLOR_PATTERN.test(normalizedInput.color)
        ? getInvalidDeckColorMessage()
        : null
  };
}

export function getFirstDeckValidationError(errors: DeckValidationErrors): string | null {
  return errors.name ?? errors.description ?? errors.type ?? errors.color;
}
