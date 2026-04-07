import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { Card } from '../../core/models/Card';
import {
  getFirstCardValidationError,
  normalizeCardFront,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { createCard, listCardsByDeck, updateCard } from '../../storage/repositories/cardRepository';
import { getRuntimeStrings } from '../../ui/strings';
import { useCardImport } from './useCardImport';
import type { CardImportPreview } from './cardImport';
import { useCsvImport } from './useCsvImport';
import type { CsvImportField, CsvImportMapping, CsvImportPreview } from './csvImport';

type UseDeckCardsResult = {
  cards: Card[];
  editingCardId: number | null;
  draftFront: string;
  draftBack: string;
  draftDescription: string;
  draftApplication: string;
  draftImageUri: string;
  importText: string;
  importPreview: CardImportPreview;
  importResultMessage: string | null;
  csvFileName: string | null;
  csvHeaders: string[];
  csvMapping: CsvImportMapping;
  csvPreview: CsvImportPreview;
  csvImportResultMessage: string | null;
  formError: string | null;
  screenError: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isImportSubmitting: boolean;
  isCsvImportSubmitting: boolean;
  saveFeedbackMessage: string | null;
  canSubmit: boolean;
  onDraftFrontChange: (value: string) => void;
  onDraftBackChange: (value: string) => void;
  onDraftDescriptionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
  onImportTextChange: (value: string) => void;
  onPickCsvFile: () => Promise<void>;
  onChangeCsvMapping: (field: CsvImportField, header: string | null) => void;
  onSaveCard: () => Promise<void>;
  onImportCards: () => Promise<void>;
  onImportCsv: () => Promise<void>;
  onClearImport: () => void;
  onClearCsvImport: () => void;
  onEditCard: (card: Card) => void;
  onCancelEditing: () => void;
};

export function useDeckCards(deckId: number | null): UseDeckCardsResult {
  const strings = getRuntimeStrings();
  const [cards, setCards] = useState<Card[]>([]);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [draftFront, setDraftFront] = useState('');
  const [draftBack, setDraftBack] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftApplication, setDraftApplication] = useState('');
  const [draftImageUri, setDraftImageUri] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(deckId != null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveFeedbackMessage, setSaveFeedbackMessage] = useState<string | null>(null);
  const resetDraftState = useCallback(() => {
    setEditingCardId(null);
    setDraftFront('');
    setDraftBack('');
    setDraftDescription('');
    setDraftApplication('');
    setDraftImageUri('');
    setFormError(null);
  }, []);
  useEffect(() => {
    if (saveFeedbackMessage == null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSaveFeedbackMessage(null);
    }, 1800);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [saveFeedbackMessage]);
  const {
    importText,
    importPreview,
    importResultMessage,
    isImportSubmitting,
    onImportTextChange,
    onImportCards,
    onClearImport
  } = useCardImport({
    deckId,
    setCards,
    setScreenError
  });
  const {
    fileName: csvFileName,
    headers: csvHeaders,
    mapping: csvMapping,
    preview: csvPreview,
    importResultMessage: csvImportResultMessage,
    isSubmitting: isCsvImportSubmitting,
    onPickFile: onPickCsvFile,
    onChangeMapping: onChangeCsvMapping,
    onImportCsv,
    onClearFile: onClearCsvImport
  } = useCsvImport({
    deckId,
    setCards,
    setScreenError
  });

  useEffect(() => {
    resetDraftState();
    setCards([]);
    setScreenError(null);
    setSaveFeedbackMessage(null);
    setIsLoading(deckId != null);
  }, [deckId, resetDraftState]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function syncCards() {
        if (deckId == null) {
          if (isActive) {
            setCards([]);
            setScreenError(null);
            setIsLoading(false);
          }

          return;
        }

        try {
          if (isActive) {
            setIsLoading(true);
          }

          const storedCards = await listCardsByDeck(deckId);

          if (!isActive) {
            return;
          }

          setCards(storedCards);
          setScreenError(null);
        } catch {
          if (isActive) {
            setScreenError(strings.featureMessages.couldNotLoadCards);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void syncCards();

      return () => {
        isActive = false;
      };
    }, [deckId])
  );

  async function onSaveCard() {
    if (deckId == null) {
      setFormError(strings.featureMessages.chooseDeckBeforeCreatingCards);
      return;
    }

    const validationError = getFirstCardValidationError(
      validateCreateCardInput({
        deckId,
        front: draftFront,
        back: draftBack,
        description: draftDescription,
        application: draftApplication,
        imageUri: draftImageUri
      })
    );

    if (validationError != null) {
      setFormError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCardId == null) {
        const newCard = await createCard({
          deckId,
          front: draftFront,
          back: draftBack,
          description: draftDescription,
          application: draftApplication,
          imageUri: draftImageUri
        });

        setCards((currentCards) => [newCard, ...currentCards]);
      } else {
        const updatedCard = await updateCard({
          id: editingCardId,
          deckId,
          front: draftFront,
          back: draftBack,
          description: draftDescription,
          application: draftApplication,
          imageUri: draftImageUri
        });

        setCards((currentCards) =>
          currentCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
      }

      setSaveFeedbackMessage(editingCardId == null ? strings.featureMessages.cardAdded : strings.featureMessages.cardUpdated);
      resetDraftState();
      setScreenError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : strings.featureMessages.couldNotSaveCard);
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFormError() {
    if (formError != null) {
      setFormError(null);
    }

    if (saveFeedbackMessage != null) {
      setSaveFeedbackMessage(null);
    }
  }

  return {
    cards,
    editingCardId,
    draftFront,
    draftBack,
    draftDescription,
    draftApplication,
    draftImageUri,
    importText,
    importPreview,
    importResultMessage,
    csvFileName,
    csvHeaders,
    csvMapping,
    csvPreview,
    csvImportResultMessage,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    isImportSubmitting,
    isCsvImportSubmitting,
    saveFeedbackMessage,
    canSubmit:
      deckId != null &&
      normalizeCardFront(draftFront).length > 0 &&
      draftBack.trim().length > 0 &&
      !isSubmitting,
    onDraftFrontChange: (value) => {
      setDraftFront(value);
      clearFormError();
    },
    onDraftBackChange: (value) => {
      setDraftBack(value);
      clearFormError();
    },
    onDraftDescriptionChange: (value) => {
      setDraftDescription(value);
      clearFormError();
    },
    onDraftApplicationChange: (value) => {
      setDraftApplication(value);
      clearFormError();
    },
    onDraftImageUriChange: (value) => {
      setDraftImageUri(value);
      clearFormError();
    },
    onImportTextChange,
    onPickCsvFile,
    onChangeCsvMapping,
    onSaveCard,
    onImportCards,
    onImportCsv,
    onClearImport,
    onClearCsvImport,
    onEditCard: (card) => {
      setEditingCardId(card.id);
      setDraftFront(card.front);
      setDraftBack(card.back);
      setDraftDescription(card.description ?? '');
      setDraftApplication(card.application ?? '');
      setDraftImageUri(card.imageUri ?? '');
      setFormError(null);
    },
    onCancelEditing: resetDraftState
  };
}
