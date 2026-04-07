import type { CreateCardInput } from '../../core/types/card';
import {
  buildCardImportPreviewFromRows,
  buildCardImportPreviewRow,
  type CardImportPreview,
  type CardImportPreviewFieldValues,
  type CardImportPreviewRow
} from './cardImport';
import { getRuntimeStrings } from '../../ui/strings';

export type CsvImportField = 'front' | 'back' | 'description' | 'application' | 'imageUri';

export type CsvImportMapping = Record<CsvImportField, string | null>;

export type CsvImportFileData = {
  fileName: string;
  headers: string[];
  rows: string[][];
};

export type CsvImportPreview = CardImportPreview & {
  hasFile: boolean;
  fileName: string;
  headers: string[];
  mappingErrors: string[];
  parseError: string | null;
  canImport: boolean;
};

const CSV_FIELDS: CsvImportField[] = ['front', 'back', 'description', 'application', 'imageUri'];

function decodeCsvBase64(base64: string): string {
  if (typeof atob === 'function') {
    return atob(base64);
  }

  throw new Error('Base64 decoding is not available in this environment.');
}

function normalizeHeaderToken(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function makeUniqueHeaders(headers: string[]): string[] {
  const counts = new Map<string, number>();

  return headers.map((header, index) => {
    const baseHeader = header.trim().length > 0 ? header.trim() : `Column ${index + 1}`;
    const nextCount = (counts.get(baseHeader) ?? 0) + 1;
    counts.set(baseHeader, nextCount);

    return nextCount === 1 ? baseHeader : `${baseHeader} (${nextCount})`;
  });
}

function isRowEmpty(row: string[]): boolean {
  return row.every((cell) => cell.trim().length === 0);
}

function buildEmptyPreview(): CsvImportPreview {
  return {
    ...buildCardImportPreviewFromRows([], false),
    hasFile: false,
    fileName: '',
    headers: [],
    mappingErrors: [],
    parseError: null,
    canImport: false
  };
}

function getHeaderSuggestions(): Record<CsvImportField, string[]> {
  return {
    front: ['front', 'frente', 'question', 'prompt', 'term'],
    back: ['back', 'reverso', 'answer', 'response'],
    description: ['description', 'descripcion', 'definition', 'details'],
    application: ['application', 'aplicacion', 'notes', 'notas', 'context', 'usage', 'example'],
    imageUri: ['imageuri', 'image', 'imageurl', 'imagen', 'imagenurl', 'photo']
  };
}

export function getDefaultCsvImportMapping(headers: string[]): CsvImportMapping {
  const mapping: CsvImportMapping = {
    front: null,
    back: null,
    description: null,
    application: null,
    imageUri: null
  };
  const suggestions = getHeaderSuggestions();

  CSV_FIELDS.forEach((field) => {
    const match = headers.find((header) => suggestions[field].includes(normalizeHeaderToken(header)));

    if (match != null) {
      mapping[field] = match;
    }
  });

  return mapping;
}

function getMappedCell(
  row: string[],
  headerIndexes: Map<string, number>,
  selectedHeader: string | null
): string | null {
  if (selectedHeader == null) {
    return null;
  }

  const index = headerIndexes.get(selectedHeader);

  if (index == null) {
    return null;
  }

  return row[index] ?? null;
}

function buildMappingErrors(mapping: CsvImportMapping): string[] {
  const strings = getRuntimeStrings();
  const errors: string[] = [];

  if (mapping.front == null) {
    errors.push(strings.importValidation.frontColumnRequired);
  }

  if (mapping.back == null) {
    errors.push(strings.importValidation.backColumnRequired);
  }

  return errors;
}

function buildCsvPreviewRow(
  row: string[],
  rowIndex: number,
  headerIndexes: Map<string, number>,
  mapping: CsvImportMapping,
  deckId: number | null
): CardImportPreviewRow {
  const values: CardImportPreviewFieldValues = {
    lineNumber: rowIndex + 2,
    rawLine: row.join(', '),
    front: getMappedCell(row, headerIndexes, mapping.front)?.trim() ?? '',
    back: getMappedCell(row, headerIndexes, mapping.back)?.trim() ?? null,
    description: getMappedCell(row, headerIndexes, mapping.description)?.trim() ?? null,
    application: getMappedCell(row, headerIndexes, mapping.application)?.trim() ?? null,
    imageUri: getMappedCell(row, headerIndexes, mapping.imageUri)?.trim() ?? null
  };

  return buildCardImportPreviewRow(values, deckId);
}

export function buildCsvImportPreview(
  fileData: CsvImportFileData | null,
  mapping: CsvImportMapping,
  deckId: number | null,
  parseError: string | null = null
): CsvImportPreview {
  if (fileData == null) {
    return buildEmptyPreview();
  }

  const mappingErrors = buildMappingErrors(mapping);
  const headerIndexes = new Map(fileData.headers.map((header, index) => [header, index]));
  const rows = mappingErrors.length > 0 || parseError != null
    ? fileData.rows.map((row, rowIndex) =>
        buildCardImportPreviewRow(
          {
            lineNumber: rowIndex + 2,
            rawLine: row.join(', '),
            front: getMappedCell(row, headerIndexes, mapping.front)?.trim() ?? '',
            back: getMappedCell(row, headerIndexes, mapping.back)?.trim() ?? null,
            description: getMappedCell(row, headerIndexes, mapping.description)?.trim() ?? null,
            application: getMappedCell(row, headerIndexes, mapping.application)?.trim() ?? null,
            imageUri: getMappedCell(row, headerIndexes, mapping.imageUri)?.trim() ?? null
          },
          deckId,
          mappingErrors[0] ?? parseError
        )
      )
    : fileData.rows.map((row, rowIndex) => buildCsvPreviewRow(row, rowIndex, headerIndexes, mapping, deckId));

  const preview = buildCardImportPreviewFromRows(rows, fileData.rows.length > 0);

  return {
    ...preview,
    hasFile: true,
    fileName: fileData.fileName,
    headers: fileData.headers,
    mappingErrors,
    parseError,
    canImport: parseError == null && mappingErrors.length === 0 && preview.validCount > 0 && deckId != null
  };
}

export function getCsvImportInputs(preview: CsvImportPreview): CreateCardInput[] {
  return preview.validRows.reduce<CreateCardInput[]>((inputs, row) => {
    if (row.input != null) {
      inputs.push(row.input);
    }

    return inputs;
  }, []);
}

export function parseCsvFile(source: string, fileName: string): CsvImportFileData {
  const strings = getRuntimeStrings();
  const normalizedSource = source.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let index = 0; index < normalizedSource.length; index += 1) {
    const character = normalizedSource[index];
    const nextCharacter = normalizedSource[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        currentField += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        currentField += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }

    if (character === ',') {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if (character === '\n') {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
      continue;
    }

    if (character === '\r') {
      if (nextCharacter === '\n') {
        continue;
      }

      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += character;
  }

  if (inQuotes) {
    throw new Error(strings.importValidation.csvQuoteError);
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const nonEmptyRows = rows.filter((row) => !isRowEmpty(row));

  if (nonEmptyRows.length === 0) {
    throw new Error(strings.importValidation.csvEmpty);
  }

  const headerRow = nonEmptyRows[0];
  const dataRows = nonEmptyRows.slice(1);

  if (headerRow == null || headerRow.length === 0) {
    throw new Error(strings.importValidation.csvHeaderRequired);
  }

  if (dataRows.length === 0) {
    throw new Error(strings.importValidation.csvDataRequired);
  }

  const headers = makeUniqueHeaders(headerRow);

  return {
    fileName,
    headers,
    rows: dataRows
  };
}

export function getCsvTextFromBase64(base64: string): string {
  return decodeCsvBase64(base64);
}
