import type { Deck } from '../../core/models/Deck';
import type { Card } from '../../core/models/Card';
import type { CreateCardInput } from '../../core/types/card';
import { DEFAULT_DECK_TYPE, type CreateDeckInput } from '../../core/types/deck';
import {
  getDeckDuplicateNameMessage,
  getFirstDeckValidationError,
  normalizeCreateDeckInput,
  normalizeDeckName,
  validateCreateDeckInput
} from '../../services/validation/deckValidation';
import {
  buildCardImportPreview,
  type CardImportPreview,
  type CardImportPreviewRow
} from '../cards/cardImport';
import { getRuntimeStrings } from '../../ui/strings';

export const DECK_EXPORT_HEADER_PREFIX = '# Deck:';
const CARD_IMPORT_PREVIEW_DECK_ID = 1;

function normalizeDeckKey(name: string): string {
  return normalizeDeckName(name).toLocaleLowerCase();
}

export type DeckImportPreview = {
  hasContent: boolean;
  deckName: string;
  headerLineNumber: number | null;
  headerError: string | null;
  blockingError: string | null;
  cardPreview: CardImportPreview;
  canImport: boolean;
};

export type ImportableDeckCardInput = Omit<CreateCardInput, 'deckId'>;

function buildEmptyCardPreview(): CardImportPreview {
  return {
    rows: [],
    validRows: [],
    invalidRows: [],
    totalCount: 0,
    validCount: 0,
    invalidCount: 0,
    hasContent: false
  };
}

function shiftPreviewRows(
  rows: CardImportPreviewRow[],
  lineOffset: number
): CardImportPreviewRow[] {
  return rows.map((row) => ({
    ...row,
    lineNumber: row.lineNumber + lineOffset
  }));
}

function buildShiftedPreview(preview: CardImportPreview, lineOffset: number): CardImportPreview {
  const rows = shiftPreviewRows(preview.rows, lineOffset);
  const validRows = rows.filter((row) => row.isValid);
  const invalidRows = rows.filter((row) => !row.isValid);

  return {
    ...preview,
    rows,
    validRows,
    invalidRows,
    totalCount: rows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length
  };
}

function normalizeDeckImportCards(rows: CardImportPreviewRow[]): ImportableDeckCardInput[] {
  return rows.reduce<ImportableDeckCardInput[]>((cards, row) => {
    if (row.input == null) {
      return cards;
    }

    cards.push({
      front: row.input.front,
      back: row.input.back,
      description: row.input.description,
      application: row.input.application,
      imageUri: row.input.imageUri
    });

    return cards;
  }, []);
}

function buildCardExportLine(card: Card): string {
  const fields = [card.front, card.back];

  if (card.description != null || card.application != null) {
    fields.push(card.description ?? '');
  }

  if (card.application != null) {
    fields.push(card.application);
  }

  return fields.join(' | ');
}

function sortCardsForExport(cards: Card[]): Card[] {
  return [...cards].sort((leftCard, rightCard) => {
    const leftTimestamp = new Date(leftCard.createdAt).getTime();
    const rightTimestamp = new Date(rightCard.createdAt).getTime();

    if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp) || leftTimestamp === rightTimestamp) {
      return leftCard.id - rightCard.id;
    }

    return leftTimestamp - rightTimestamp;
  });
}

export function buildDeckExportText(deck: Deck, cards: Card[]): string {
  const lines = [`${DECK_EXPORT_HEADER_PREFIX} ${deck.name}`];

  sortCardsForExport(cards).forEach((card) => {
    lines.push(buildCardExportLine(card));
  });

  return lines.join('\n');
}

export function buildDeckImportPreview(
  source: string,
  existingDeckNames: string[]
): DeckImportPreview {
  const strings = getRuntimeStrings();
  const hasContent = source.trim().length > 0;

  if (!hasContent) {
    return {
      hasContent: false,
      deckName: '',
      headerLineNumber: null,
      headerError: null,
      blockingError: null,
      cardPreview: buildEmptyCardPreview(),
      canImport: false
    };
  }

  const lines = source.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().length > 0);

  if (headerIndex === -1) {
    return {
      hasContent: false,
      deckName: '',
      headerLineNumber: null,
      headerError: null,
      blockingError: null,
      cardPreview: buildEmptyCardPreview(),
      canImport: false
    };
  }

  const headerLine = lines[headerIndex]?.trim() ?? '';
  const headerLineNumber = headerIndex + 1;

  if (!headerLine.startsWith(DECK_EXPORT_HEADER_PREFIX)) {
    return {
      hasContent: true,
      deckName: '',
      headerLineNumber,
      headerError: null,
      blockingError: strings.importValidation.deckHeaderRequired,
      cardPreview: buildEmptyCardPreview(),
      canImport: false
    };
  }

  const importedDeckName = normalizeDeckName(headerLine.slice(DECK_EXPORT_HEADER_PREFIX.length));
  const normalizedDeck = normalizeCreateDeckInput({
    name: importedDeckName,
    type: DEFAULT_DECK_TYPE
  } satisfies CreateDeckInput);
  const existingDeckNameSet = new Set(existingDeckNames.map(normalizeDeckKey));
  const validationError = getFirstDeckValidationError(validateCreateDeckInput(normalizedDeck));
  const headerError =
    validationError ??
    (existingDeckNameSet.has(normalizeDeckKey(normalizedDeck.name)) ? getDeckDuplicateNameMessage() : null);
  const cardSource = lines.slice(headerIndex + 1).join('\n');
  const cardPreview =
    cardSource.trim().length === 0
      ? buildEmptyCardPreview()
      : buildShiftedPreview(buildCardImportPreview(cardSource, CARD_IMPORT_PREVIEW_DECK_ID), headerIndex + 1);
  const canImport =
    headerError == null &&
    (cardPreview.validCount > 0 || cardPreview.totalCount === 0);

  return {
    hasContent: true,
    deckName: normalizedDeck.name,
    headerLineNumber,
    headerError,
    blockingError:
      headerError == null || cardPreview.validCount > 0 || cardPreview.totalCount === 0
        ? null
        : strings.importValidation.fixInvalidDeckLines,
    cardPreview,
    canImport
  };
}

export function getDeckImportCardInputs(preview: DeckImportPreview): ImportableDeckCardInput[] {
  return normalizeDeckImportCards(preview.cardPreview.validRows);
}
