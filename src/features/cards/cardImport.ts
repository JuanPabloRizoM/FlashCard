import type { CreateCardInput } from '../../core/types/card';
import {
  getFirstCardValidationError,
  normalizeCreateCardInput,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { getRuntimeStrings } from '../../ui/strings';

export type CardImportPreviewRow = {
  lineNumber: number;
  rawLine: string;
  front: string;
  back: string | null;
  description: string | null;
  application: string | null;
  imageUri: string | null;
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

export type CardImportPreviewFieldValues = {
  lineNumber: number;
  rawLine: string;
  front: string;
  back: string | null;
  description: string | null;
  application: string | null;
  imageUri?: string | null;
};

function buildImportError(fields: string[]): string | null {
  const strings = getRuntimeStrings();

  if (fields.length < MIN_IMPORT_FIELDS || fields.length > MAX_IMPORT_FIELDS) {
    return strings.importValidation.useFormat;
  }

  if (fields[0]?.trim().length === 0) {
    return strings.importValidation.frontRequired;
  }

  if (fields[1]?.trim().length === 0) {
    return strings.importValidation.backRequired;
  }

  return null;
}

export function buildCardImportPreviewRow(
  values: CardImportPreviewFieldValues,
  deckId: number | null,
  initialError?: string | null
): CardImportPreviewRow {
  const strings = getRuntimeStrings();
  const imageUri = values.imageUri ?? null;

  if ((initialError == null && values.rawLine.trim().length === 0) || (values.rawLine.length === 0 && values.front.trim().length === 0 && (values.back ?? '').trim().length === 0)) {
    return {
      lineNumber: values.lineNumber,
      rawLine: values.rawLine,
      front: '',
      back: null,
      description: null,
      application: null,
      imageUri: null,
      isValid: false,
      error: strings.importValidation.lineEmpty,
      input: null
    };
  }

  const importError =
    initialError ??
    (values.front.trim().length === 0
      ? strings.importValidation.frontRequired
      : (values.back ?? '').trim().length === 0
        ? strings.importValidation.backRequired
        : null);

  if (importError != null) {
    return {
      lineNumber: values.lineNumber,
      rawLine: values.rawLine,
      front: values.front,
      back: values.back,
      description: values.description,
      application: values.application,
      imageUri,
      isValid: false,
      error: importError,
      input: null
    };
  }

  if (deckId == null) {
    return {
      lineNumber: values.lineNumber,
      rawLine: values.rawLine,
      front: values.front,
      back: values.back,
      description: values.description,
      application: values.application,
      imageUri,
      isValid: false,
      error: strings.featureMessages.chooseDeckBeforeImportingCards,
      input: null
    };
  }

  const input: CreateCardInput = {
    deckId,
    front: values.front,
    back: values.back ?? '',
    description: values.description ?? '',
    application: values.application ?? '',
    imageUri: imageUri ?? ''
  };
  const normalizedInput = normalizeCreateCardInput(input);
  const validationError = getFirstCardValidationError(validateCreateCardInput(input));

  return {
    lineNumber: values.lineNumber,
    rawLine: values.rawLine,
    front: normalizedInput.front,
    back: normalizedInput.back,
    description: normalizedInput.description,
    application: normalizedInput.application,
    imageUri: normalizedInput.imageUri,
    isValid: validationError == null,
    error: validationError,
    input: validationError == null ? normalizedInput : null
  };
}

function buildPreviewRow(rawLine: string, lineNumber: number, deckId: number | null): CardImportPreviewRow {
  const fields = rawLine.split(FIELD_SEPARATOR).map((field) => field.trim());
  const importError = buildImportError(fields);

  return buildCardImportPreviewRow(
    {
      lineNumber,
      rawLine,
      front: fields[0] ?? '',
      back: fields[1] ?? null,
      description: fields[2] ?? null,
      application: fields[3] ?? null,
      imageUri: null
    },
    deckId,
    importError
  );
}

export function buildCardImportPreviewFromRows(rows: CardImportPreviewRow[], hasContent: boolean): CardImportPreview {
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

export function buildCardImportPreview(source: string, deckId: number | null): CardImportPreview {
  const rows = source.split(/\r?\n/).map((line, index) => buildPreviewRow(line, index + 1, deckId));
  const hasContent = source.trim().length > 0;
  return buildCardImportPreviewFromRows(rows, hasContent);
}
