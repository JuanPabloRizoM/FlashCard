import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

import type { Card } from '../../core/models/Card';
import { createCardsBatch } from '../../storage/repositories/cardRepository';
import { getRuntimeStrings } from '../../ui/strings';
import {
  buildCsvImportPreview,
  getCsvImportInputs,
  getCsvTextFromBase64,
  getDefaultCsvImportMapping,
  parseCsvFile,
  type CsvImportField,
  type CsvImportFileData,
  type CsvImportMapping,
  type CsvImportPreview
} from './csvImport';

type UseCsvImportParams = {
  deckId: number | null;
  setCards: Dispatch<SetStateAction<Card[]>>;
  setScreenError: Dispatch<SetStateAction<string | null>>;
};

type UseCsvImportResult = {
  fileName: string | null;
  headers: string[];
  mapping: CsvImportMapping;
  preview: CsvImportPreview;
  importResultMessage: string | null;
  isSubmitting: boolean;
  onPickFile: () => Promise<void>;
  onChangeMapping: (field: CsvImportField, header: string | null) => void;
  onImportCsv: () => Promise<void>;
  onClearFile: () => void;
};

async function readCsvDocument(asset: DocumentPicker.DocumentPickerAsset): Promise<string> {
  if (asset.file != null) {
    return asset.file.text();
  }

  if (asset.base64 != null) {
    return getCsvTextFromBase64(asset.base64);
  }

  return FileSystem.readAsStringAsync(asset.uri);
}

function createEmptyMapping(): CsvImportMapping {
  return {
    front: null,
    back: null,
    description: null,
    application: null,
    imageUri: null
  };
}

export function useCsvImport({
  deckId,
  setCards,
  setScreenError
}: UseCsvImportParams): UseCsvImportResult {
  const strings = getRuntimeStrings();
  const [fileData, setFileData] = useState<CsvImportFileData | null>(null);
  const [mapping, setMapping] = useState<CsvImportMapping>(createEmptyMapping);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResultMessage, setImportResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(
    () => buildCsvImportPreview(fileData, mapping, deckId, parseError),
    [deckId, fileData, mapping, parseError]
  );

  async function onPickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'text/comma-separated-values', 'application/csv', 'public.comma-separated-values-text'],
      copyToCacheDirectory: true,
      multiple: false
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    try {
      const asset = result.assets[0];

      if (asset == null) {
        return;
      }

      const fileText = await readCsvDocument(asset);
      const nextFile = parseCsvFile(fileText, asset.name);

      setFileData(nextFile);
      setMapping(getDefaultCsvImportMapping(nextFile.headers));
      setParseError(null);
      setImportResultMessage(null);
      setScreenError(null);
    } catch (error) {
      setFileData(null);
      setMapping(createEmptyMapping());
      setParseError(error instanceof Error ? error.message : strings.featureMessages.couldNotReadCsvFile);
      setImportResultMessage(error instanceof Error ? error.message : strings.featureMessages.couldNotReadCsvFile);
    }
  }

  function onChangeMapping(field: CsvImportField, header: string | null) {
    setMapping((currentMapping) => {
      const nextMapping = { ...currentMapping };

      if (header != null) {
        (Object.keys(nextMapping) as CsvImportField[]).forEach((candidateField) => {
          if (candidateField !== field && nextMapping[candidateField] === header) {
            nextMapping[candidateField] = null;
          }
        });
      }

      nextMapping[field] = header;
      return nextMapping;
    });
    setImportResultMessage(null);
  }

  async function onImportCsv() {
    if (fileData == null) {
      setImportResultMessage(strings.featureMessages.chooseCsvFile);
      return;
    }

    if (deckId == null) {
      setImportResultMessage(strings.featureMessages.chooseDeckBeforeImportingCards);
      return;
    }

    if (!preview.canImport) {
      setImportResultMessage(
        preview.parseError ?? preview.mappingErrors[0] ?? strings.featureMessages.noValidCardLines
      );
      return;
    }

    const validInputs = getCsvImportInputs(preview);

    if (validInputs.length === 0) {
      setImportResultMessage(strings.featureMessages.noValidCardLines);
      return;
    }

    try {
      setIsSubmitting(true);
      const createdCards = await createCardsBatch(validInputs);

      setCards((currentCards) => [...createdCards, ...currentCards]);
      setImportResultMessage(strings.featureMessages.importedCards(createdCards.length, preview.invalidCount));
      setFileData(null);
      setMapping(createEmptyMapping());
      setParseError(null);
      setScreenError(null);
    } catch (error) {
      setImportResultMessage(
        error instanceof Error ? error.message : strings.featureMessages.couldNotImportCards
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fileName: fileData?.fileName ?? null,
    headers: fileData?.headers ?? [],
    mapping,
    preview,
    importResultMessage,
    isSubmitting,
    onPickFile,
    onChangeMapping,
    onImportCsv,
    onClearFile: () => {
      setFileData(null);
      setMapping(createEmptyMapping());
      setParseError(null);
      setImportResultMessage(null);
    }
  };
}
