import { useEffect, useMemo, useRef, useState } from 'react';

import type { Card } from '../../core/models/Card';
import type { StudySession, StudySessionStartResult } from '../../core/models/StudySession';
import type { Deck } from '../../core/models/Deck';
import {
  type StudySessionMode,
  type StudySessionSize,
  STUDY_TECHNIQUE_IDS,
  type StudyTechniqueId
} from '../../core/types/study';
import { StudyEngine } from '../../engine/StudyEngine';
import { buildStudySessionConfiguration } from './sessionConfiguration';
import { listDecks } from '../../storage/repositories/deckRepository';
import { listCardsByDeck } from '../../storage/repositories/cardRepository';
import {
  listByDeckId as listStudyProgressByDeckId,
  upsertResult
} from '../../storage/repositories/studyProgressRepository';
import {
  buildSessionSummary,
  getStudyStartErrorMessage,
  type SessionSummary
} from './sessionSummary';
import { useAppSettings } from '../settings/AppSettingsProvider';

type UseStudySessionResult = {
  decks: Deck[];
  selectedDeck: Deck | null;
  selectedDeckId: number | null;
  selectedTechniqueId: StudyTechniqueId;
  selectedSessionMode: StudySessionMode;
  selectedSessionSize: StudySessionSize;
  session: StudySession | null;
  sessionStartResult: StudySessionStartResult | null;
  currentItem: ReturnType<StudyEngine['getCurrentItem']>;
  sessionSummary: SessionSummary | null;
  canRetryIncorrectAnswers: boolean;
  isLoadingDecks: boolean;
  isStartingSession: boolean;
  isSubmittingAnswer: boolean;
  revealAnswer: boolean;
  screenError: string | null;
  onSelectDeck: (deckId: number) => void;
  onSelectTechnique: (techniqueId: StudyTechniqueId) => void;
  onSelectSessionMode: (mode: StudySessionMode) => void;
  onSelectSessionSize: (size: StudySessionSize) => void;
  onStartSession: () => Promise<void>;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => Promise<void>;
  onRestartSession: () => Promise<void>;
  onRetryIncorrectAnswers: () => void;
  onResetSession: () => void;
};

const studyEngine = new StudyEngine();

export function useStudySession(): UseStudySessionResult {
  const { settings } = useAppSettings();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<StudyTechniqueId>(STUDY_TECHNIQUE_IDS[0]);
  const [selectedSessionMode, setSelectedSessionMode] = useState<StudySessionMode>(settings.defaultStudyMode);
  const [selectedSessionSize, setSelectedSessionSize] = useState<StudySessionSize>(settings.defaultSessionSize);
  const [session, setSession] = useState<StudySession | null>(null);
  const [sessionStartResult, setSessionStartResult] = useState<StudySessionStartResult | null>(null);
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [incorrectItems, setIncorrectItems] = useState<StudySession['items']>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);
  const isSubmittingAnswerRef = useRef(false);
  const isStartingSessionRef = useRef(false);
  const selectedDeck = useMemo(() => decks.find((deck) => deck.id === selectedDeckId) ?? null, [decks, selectedDeckId]);
  const isSessionActive = session != null && studyEngine.getCurrentItem(session) != null;

  useEffect(() => {
    let isMounted = true;

    async function loadDeckCollection() {
      try {
        const storedDecks = await listDecks();

        if (!isMounted) {
          return;
        }

        setDecks(storedDecks);
        setSelectedDeckId((currentDeckId) => currentDeckId ?? storedDecks[0]?.id ?? null);
        setScreenError(null);
      } catch {
        if (isMounted) {
          setScreenError('Could not load decks for study right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingDecks(false);
        }
      }
    }

    void loadDeckCollection();

    return () => {
      isMounted = false;
    };
  }, []);

  function applySessionStart(nextSession: StudySessionStartResult, cards: Card[]) {
    setSession(nextSession.status === 'ready' ? nextSession.session : null);
    setSessionStartResult(nextSession);
    setSessionCards(cards);
    setIncorrectItems([]);
    setRevealAnswer(false);
  }

  async function startSelectedDeckSession() {
    if (isStartingSessionRef.current) {
      return;
    }
    if (selectedDeckId == null) {
      setScreenError('Create a deck before starting a study session.');
      setSession(null);
      setSessionStartResult(null);
      setSessionCards([]);
      setIncorrectItems([]);
      return;
    }

    try {
      isStartingSessionRef.current = true;
      setIsStartingSession(true);
      const referenceTime = new Date().toISOString();
      const [cards, progressRecords] = await Promise.all([
        listCardsByDeck(selectedDeckId),
        listStudyProgressByDeckId(selectedDeckId)
      ]);
      const sessionConfiguration = buildStudySessionConfiguration({
        cards,
        techniqueId: selectedTechniqueId,
        progressRecords,
        mode: selectedSessionMode,
        size: selectedSessionSize
      });
      const nextSession = studyEngine.startSession(cards, selectedTechniqueId, {
        progressRecords,
        referenceTime,
        maxSessionItems: sessionConfiguration.maxSessionItems,
        queueItems: sessionConfiguration.queueItems
      });
      applySessionStart(nextSession, cards);
      setScreenError(null);
    } catch (error) {
      setScreenError(getStudyStartErrorMessage(error));
      setSession(null);
      setSessionStartResult(null);
      setSessionCards([]);
      setIncorrectItems([]);
      setRevealAnswer(false);
    } finally {
      isStartingSessionRef.current = false;
      setIsStartingSession(false);
    }
  }

  function resetSessionState() {
    setSession(null);
    setSessionStartResult(null);
    setSessionCards([]);
    setIncorrectItems([]);
    setRevealAnswer(false);
    setIsSubmittingAnswer(false);
    isSubmittingAnswerRef.current = false;
    isStartingSessionRef.current = false;
  }

  async function onSubmitAnswer(isCorrect: boolean) {
    if (session == null || isSubmittingAnswerRef.current) {
      return;
    }
    const currentItem = studyEngine.getCurrentItem(session);
    if (currentItem == null) {
      return;
    }

    try {
      isSubmittingAnswerRef.current = true;
      setIsSubmittingAnswer(true);
      await upsertResult({
        cardId: currentItem.card.id,
        promptMode: currentItem.promptMode,
        result: isCorrect ? 'correct' : 'incorrect',
        studiedAt: new Date().toISOString()
      });
      const updatedSession = studyEngine.processAnswer(session, { isCorrect });
      setSession(updatedSession);
      setIncorrectItems((currentIncorrectItems) =>
        isCorrect ? currentIncorrectItems : [...currentIncorrectItems, currentItem]
      );
      setRevealAnswer(false);
      setScreenError(null);
    } catch (error) {
      setScreenError(
        error instanceof Error
          ? error.message
          : 'Could not save study progress right now. Try that answer again.'
      );
    } finally {
      isSubmittingAnswerRef.current = false;
      setIsSubmittingAnswer(false);
    }
  }

  function onRetryIncorrectAnswers() {
    const retrySession = studyEngine.startSessionFromItems(
      incorrectItems,
      selectedTechniqueId,
      'There are no incorrect answers to retry in this session.'
    );
    applySessionStart(retrySession, sessionCards);
    setScreenError(null);
  }

  const sessionSummary = buildSessionSummary(session, studyEngine);

  useEffect(() => {
    if (
      isSessionActive ||
      sessionSummary != null ||
      isStartingSessionRef.current ||
      isSubmittingAnswerRef.current
    ) {
      return;
    }

    setSelectedSessionMode(settings.defaultStudyMode);
    setSelectedSessionSize(settings.defaultSessionSize);
  }, [isSessionActive, sessionSummary, settings.defaultSessionSize, settings.defaultStudyMode]);

  return {
    decks,
    selectedDeck,
    selectedDeckId,
    selectedTechniqueId,
    selectedSessionMode,
    selectedSessionSize,
    session,
    sessionStartResult,
    currentItem: session != null ? studyEngine.getCurrentItem(session) : null,
    sessionSummary,
    canRetryIncorrectAnswers: incorrectItems.length > 0,
    isLoadingDecks,
    isStartingSession,
    isSubmittingAnswer,
    revealAnswer,
    screenError,
    onSelectDeck: (deckId) => {
      if (isSubmittingAnswerRef.current || isStartingSessionRef.current || isSessionActive) {
        return;
      }

      setSelectedDeckId(deckId);
      resetSessionState();
    },
    onSelectTechnique: (techniqueId) => {
      if (isSubmittingAnswerRef.current || isStartingSessionRef.current || isSessionActive) {
        return;
      }

      setSelectedTechniqueId(techniqueId);
      resetSessionState();
    },
    onSelectSessionMode: (mode) => {
      if (isSubmittingAnswerRef.current || isStartingSessionRef.current || isSessionActive) {
        return;
      }

      setSelectedSessionMode(mode);
      resetSessionState();
    },
    onSelectSessionSize: (size) => {
      if (isSubmittingAnswerRef.current || isStartingSessionRef.current || isSessionActive) {
        return;
      }

      setSelectedSessionSize(size);
      resetSessionState();
    },
    onStartSession: startSelectedDeckSession,
    onRevealAnswer: () => setRevealAnswer(true),
    onSubmitAnswer,
    onRestartSession: startSelectedDeckSession,
    onRetryIncorrectAnswers,
    onResetSession: resetSessionState
  };
}
