import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import type { Card } from '../../core/models/Card';
import type { CardEditorStudyPreview } from '../study/cardStudyPreview';
import { buildCardEditorStudyPreview } from '../study/cardStudyPreview';
import {
  getFirstCardValidationError,
  normalizeCreateCardInput,
  normalizeCardTitle,
  validateCreateCardInput
} from '../../services/validation/cardValidation';
import { createCard, listCardsByDeck, updateCard } from '../../storage/repositories/cardRepository';
import { useCardImport } from './useCardImport';
import type { CardImportPreview } from './cardImport';

type UseDeckCardsResult = {
  cards: Card[];
  editingCardId: number | null;
  draftTitle: string;
  draftTranslation: string;
  draftDefinition: string;
  draftApplication: string;
  draftImageUri: string;
  draftStudyPreview: CardEditorStudyPreview;
  importText: string;
  importPreview: CardImportPreview;
  importResultMessage: string | null;
  formError: string | null;
  screenError: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isImportSubmitting: boolean;
  canSubmit: boolean;
  onDraftTitleChange: (value: string) => void;
  onDraftTranslationChange: (value: string) => void;
  onDraftDefinitionChange: (value: string) => void;
  onDraftApplicationChange: (value: string) => void;
  onDraftImageUriChange: (value: string) => void;
  onImportTextChange: (value: string) => void;
  onSaveCard: () => Promise<void>;
  onImportCards: () => Promise<void>;
  onClearImport: () => void;
  onEditCard: (card: Card) => void;
  onCancelEditing: () => void;
};

function getCardSaveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not save the card. Please try again.';
}

export function useDeckCards(deckId: number | null): UseDeckCardsResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftTranslation, setDraftTranslation] = useState('');
  const [draftDefinition, setDraftDefinition] = useState('');
  const [draftApplication, setDraftApplication] = useState('');
  const [draftImageUri, setDraftImageUri] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(deckId != null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const draftStudyPreview = useMemo(
    () =>
      buildCardEditorStudyPreview(
        normalizeCreateCardInput({
          deckId: deckId ?? 0,
          title: draftTitle,
          translation: draftTranslation,
          definition: draftDefinition,
          application: draftApplication,
          imageUri: draftImageUri
        })
      ),
    [deckId, draftApplication, draftDefinition, draftImageUri, draftTitle, draftTranslation]
  );
  const resetDraftState = useCallback(() => {
    setEditingCardId(null);
    setDraftTitle('');
    setDraftTranslation('');
    setDraftDefinition('');
    setDraftApplication('');
    setDraftImageUri('');
    setFormError(null);
  }, []);
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

  const loadCards = useCallback(async () => {
    if (deckId == null) {
      setCards([]);
      setScreenError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const storedCards = await listCardsByDeck(deckId);
      setCards(storedCards);
      setScreenError(null);
    } catch {
      setScreenError('Could not load cards right now.');
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    resetDraftState();
    setCards([]);
    setScreenError(null);
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
            setScreenError('Could not load cards right now.');
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
      setFormError('Choose a deck before creating cards.');
      return;
    }

    const validationError = getFirstCardValidationError(
      validateCreateCardInput({
        deckId,
        title: draftTitle,
        translation: draftTranslation,
        definition: draftDefinition,
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
          title: draftTitle,
          translation: draftTranslation,
          definition: draftDefinition,
          application: draftApplication,
          imageUri: draftImageUri
        });

        setCards((currentCards) => [newCard, ...currentCards]);
      } else {
        const updatedCard = await updateCard({
          id: editingCardId,
          deckId,
          title: draftTitle,
          translation: draftTranslation,
          definition: draftDefinition,
          application: draftApplication,
          imageUri: draftImageUri
        });

        setCards((currentCards) =>
          currentCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        );
      }

      resetDraftState();
      setScreenError(null);
    } catch (error) {
      setFormError(getCardSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFormError() {
    if (formError != null) {
      setFormError(null);
    }
  }

  return {
    cards,
    editingCardId,
    draftTitle,
    draftTranslation,
    draftDefinition,
    draftApplication,
    draftImageUri,
    draftStudyPreview,
    importText,
    importPreview,
    importResultMessage,
    formError,
    screenError,
    isLoading,
    isSubmitting,
    isImportSubmitting,
    canSubmit: deckId != null && normalizeCardTitle(draftTitle).length > 0 && !isSubmitting,
    onDraftTitleChange: (value) => {
      setDraftTitle(value);
      clearFormError();
    },
    onDraftTranslationChange: (value) => {
      setDraftTranslation(value);
      clearFormError();
    },
    onDraftDefinitionChange: (value) => {
      setDraftDefinition(value);
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
    onSaveCard,
    onImportCards,
    onClearImport,
    onEditCard: (card) => {
      setEditingCardId(card.id);
      setDraftTitle(card.title);
      setDraftTranslation(card.translation ?? '');
      setDraftDefinition(card.definition ?? '');
      setDraftApplication(card.application ?? '');
      setDraftImageUri(card.imageUri ?? '');
      setFormError(null);
    },
    onCancelEditing: resetDraftState
  };
}
