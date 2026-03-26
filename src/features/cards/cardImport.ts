import type { CreateCardInput } from '../../core/types/card';
import {
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCreateCardInput
} from '../../services/validation/cardValidation';

export type CardImportPreviewRow = {
  lineNumber: number;
  rawLine: string;
  title: string;
  translation: string | null;
  definition: string | null;
  application: string | null;
  isValid: boolean;
  error: string | null;
  input: CreateCardInput | null;
};

export type CardImportPreview = {
  rows: CardImportPreviewRow[];
  validRows: CardImportPreviewRow[];
  invalidRows: CardImportPreviewRow[];
  totalCount: number;
  validCount: number;
  invalidCount: number;
  hasContent: boolean;
};

const FIELD_SEPARATOR = '|';
const MIN_IMPORT_FIELDS = 2;
const MAX_IMPORT_FIELDS = 4;

function buildImportError(fields: string[]): string | null {
  if (fields.length < MIN_IMPORT_FIELDS || fields.length > MAX_IMPORT_FIELDS) {
    return 'Use `title | translation`, with optional `definition | application`, keeping empty fields in order when needed.';
  }

  if (fields[0]?.trim().length === 0) {
    return 'Title is required.';
  }

  return null;
}

function buildPreviewRow(rawLine: string, lineNumber: number, deckId: number | null): CardImportPreviewRow {
  if (rawLine.trim().length === 0) {
    return {
      lineNumber,
      rawLine,
      title: '',
      translation: null,
      definition: null,
      application: null,
      isValid: false,
      error: 'Line is empty.',
      input: null
    };
  }

  const fields = rawLine.split(FIELD_SEPARATOR).map((field) => field.trim());
  const importError = buildImportError(fields);

  if (importError != null) {
    return {
      lineNumber,
      rawLine,
      title: fields[0] ?? '',
      translation: fields[1] ?? null,
      definition: fields[2] ?? null,
      application: fields[3] ?? null,
      isValid: false,
      error: importError,
      input: null
    };
  }

  if (deckId == null) {
    return {
      lineNumber,
      rawLine,
      title: fields[0] ?? '',
      translation: fields[1] ?? null,
      definition: fields[2] ?? null,
      application: fields[3] ?? null,
      isValid: false,
      error: 'Choose a deck before importing cards.',
      input: null
    };
  }

  const input: CreateCardInput = {
    deckId,
    title: fields[0] ?? '',
    translation: fields[1] ?? '',
    definition: fields[2] ?? '',
    application: fields[3] ?? ''
  };
  const normalizedInput = normalizeCreateCardInput(input);
  const validationError = getFirstCardValidationError(validateCreateCardInput(input));

  return {
    lineNumber,
    rawLine,
    title: normalizedInput.title,
    translation: normalizedInput.translation,
    definition: normalizedInput.definition,
    application: normalizedInput.application,
    isValid: validationError == null,
    error: validationError,
    input: validationError == null ? normalizedInput : null
  };
}

export function buildCardImportPreview(source: string, deckId: number | null): CardImportPreview {
  const rows = source.split(/\r?\n/).map((line, index) => buildPreviewRow(line, index + 1, deckId));
  const hasContent = source.trim().length > 0;
  const validRows = rows.filter((row) => row.isValid);
  const invalidRows = rows.filter((row) => !row.isValid);

  return {
    rows,
    validRows,
    invalidRows,
    totalCount: rows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    hasContent
  };
}
