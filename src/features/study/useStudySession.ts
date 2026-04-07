import { useEffect, useMemo, useRef, useState } from 'react';

import type { Card } from '../../core/models/Card';
import type { StudySession, StudySessionStartResult } from '../../core/models/StudySession';
import type { Deck } from '../../core/models/Deck';
import type { StudySessionDetail, StudySessionRecord } from '../../core/models/StudySessionRecord';
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
import { buildDeckStudyInsights, type DeckStudyInsights } from './studyInsights';
import {
  listByDeckId as listStudyProgressByDeckId,
  upsertResult
} from '../../storage/repositories/studyProgressRepository';
import {
  createSession as createStudySessionRecord,
  getDetailById as getStudySessionDetailById,
  listByDeckId as listStudySessionRecordsByDeckId
} from '../../storage/repositories/studySessionRepository';
import { useAppSettings } from '../settings/AppSettingsProvider';
import { getRuntimeStrings } from '../../ui/strings';
import { resolveSelectedDeckId } from '../../ui/components/card/cardWorkspaceUtils';
import {
  buildLiveSessionAnswer,
  buildSessionSummary,
  buildStudySessionOverview,
  buildStudySessionPersistenceInput,
  type LiveSessionAnswer,
  type SessionSummary,
  type StudySessionOverview
} from './studySessionStats';

export type UseStudySessionResult = {
  decks: Deck[];
  selectedDeck: Deck | null;
  selectedDeckId: number | null;
  selectedDeckInsights: DeckStudyInsights | null;
  selectedDeckReviewCount: number;
  selectedDeckLastStudiedAt: string | null;
  isLoadingSelectedDeckDetails: boolean;
  recentSessions: StudySessionRecord[];
  sessionOverview: StudySessionOverview;
  isLoadingRecentSessions: boolean;
  selectedSessionDetail: StudySessionDetail | null;
  isLoadingSessionDetail: boolean;
  completedSessionDetail: StudySessionDetail | null;
  isSavingSessionStats: boolean;
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
  onStartSession: () => Promise<StudySessionStartResult | null>;
  onRevealAnswer: () => void;
  onSubmitAnswer: (isCorrect: boolean) => Promise<void>;
  onRestartSession: () => Promise<StudySessionStartResult | null>;
  onRetryIncorrectAnswers: () => void;
  onOpenSessionDetail: (sessionId: number) => Promise<void>;
  onCloseSessionDetail: () => void;
  onResetSession: () => void;
};

const studyEngine = new StudyEngine();

type UseStudySessionOptions = {
  requestedDeckId?: number | null;
  initialTechniqueId?: StudyTechniqueId;
  initialSessionMode?: StudySessionMode;
  initialSessionSize?: StudySessionSize;
};

export function useStudySession({
  requestedDeckId = null,
  initialTechniqueId,
  initialSessionMode,
  initialSessionSize
}: UseStudySessionOptions = {}): UseStudySessionResult {
  const { settings } = useAppSettings();
  const strings = getRuntimeStrings();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedDeckInsights, setSelectedDeckInsights] = useState<DeckStudyInsights | null>(null);
  const [selectedDeckReviewCount, setSelectedDeckReviewCount] = useState(0);
  const [selectedDeckLastStudiedAt, setSelectedDeckLastStudiedAt] = useState<string | null>(null);
  const [isLoadingSelectedDeckDetails, setIsLoadingSelectedDeckDetails] = useState(false);
  const [recentSessions, setRecentSessions] = useState<StudySessionRecord[]>([]);
  const [isLoadingRecentSessions, setIsLoadingRecentSessions] = useState(false);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<StudySessionDetail | null>(null);
  const [isLoadingSessionDetail, setIsLoadingSessionDetail] = useState(false);
  const [completedSessionDetail, setCompletedSessionDetail] = useState<StudySessionDetail | null>(null);
  const [isSavingSessionStats, setIsSavingSessionStats] = useState(false);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<StudyTechniqueId>(
    initialTechniqueId ?? STUDY_TECHNIQUE_IDS[0]
  );
  const [selectedSessionMode, setSelectedSessionMode] = useState<StudySessionMode>(
    initialSessionMode ?? settings.defaultStudyMode
  );
  const [selectedSessionSize, setSelectedSessionSize] = useState<StudySessionSize>(
    initialSessionSize ?? settings.defaultSessionSize
  );
  const [session, setSession] = useState<StudySession | null>(null);
  const [sessionStartResult, setSessionStartResult] = useState<StudySessionStartResult | null>(null);
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [incorrectItems, setIncorrectItems] = useState<StudySession['items']>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [sessionCompletedAt, setSessionCompletedAt] = useState<string | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<LiveSessionAnswer[]>([]);
  const isSubmittingAnswerRef = useRef(false);
  const isStartingSessionRef = useRef(false);
  const sessionAnswersRef = useRef<LiveSessionAnswer[]>([]);
  const selectedDeck = useMemo(() => decks.find((deck) => deck.id === selectedDeckId) ?? null, [decks, selectedDeckId]);
  const isSessionActive = session != null && studyEngine.getCurrentItem(session) != null;
  const sessionOverview = useMemo(() => buildStudySessionOverview(recentSessions), [recentSessions]);

  useEffect(() => {
    let isMounted = true;

    async function loadDeckCollection() {
      try {
        const storedDecks = await listDecks();

        if (!isMounted) {
          return;
        }

        setDecks(storedDecks);
        setSelectedDeckId((currentDeckId) => resolveSelectedDeckId(storedDecks, currentDeckId, requestedDeckId));
        setScreenError(null);
      } catch {
        if (isMounted) {
          setScreenError(strings.featureMessages.couldNotLoadStudyDecks);
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

  useEffect(() => {
    if (requestedDeckId == null || decks.length === 0) {
      return;
    }

    setSelectedDeckId((currentDeckId) => resolveSelectedDeckId(decks, currentDeckId, requestedDeckId));
  }, [decks, requestedDeckId]);

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedDeckDetails() {
      if (selectedDeckId == null) {
        if (!isMounted) {
          return;
        }

        setSelectedDeckInsights(null);
        setSelectedDeckReviewCount(0);
        setSelectedDeckLastStudiedAt(null);
        setRecentSessions([]);
        setSelectedSessionDetail(null);
        setIsLoadingSelectedDeckDetails(false);
        setIsLoadingRecentSessions(false);
        return;
      }

      try {
        if (isMounted) {
          setIsLoadingSelectedDeckDetails(true);
          setIsLoadingRecentSessions(true);
        }

        const [cards, progressRecords, sessionRecords] = await Promise.all([
          listCardsByDeck(selectedDeckId),
          listStudyProgressByDeckId(selectedDeckId),
          listStudySessionRecordsByDeckId(selectedDeckId)
        ]);

        if (!isMounted) {
          return;
        }

        const mostRecentStudy = progressRecords.reduce<string | null>((latest, progress) => {
          if (progress.lastStudiedAt == null) {
            return latest;
          }

          if (latest == null) {
            return progress.lastStudiedAt;
          }

          return new Date(progress.lastStudiedAt).getTime() > new Date(latest).getTime()
            ? progress.lastStudiedAt
            : latest;
        }, null);

        setSelectedDeckInsights(buildDeckStudyInsights(cards));
        setSelectedDeckReviewCount(progressRecords.reduce((total, progress) => total + progress.timesSeen, 0));
        setSelectedDeckLastStudiedAt(sessionRecords[0]?.completedAt ?? mostRecentStudy);
        setRecentSessions(sessionRecords);
      } catch {
        if (!isMounted) {
          return;
        }

        setSelectedDeckInsights(null);
        setSelectedDeckReviewCount(0);
        setSelectedDeckLastStudiedAt(null);
        setRecentSessions([]);
      } finally {
        if (isMounted) {
          setIsLoadingSelectedDeckDetails(false);
          setIsLoadingRecentSessions(false);
        }
      }
    }

    void loadSelectedDeckDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedDeckId]);

  function applySessionStart(nextSession: StudySessionStartResult, cards: Card[], startedAt: string | null) {
    setSession(nextSession.status === 'ready' ? nextSession.session : null);
    setSessionStartResult(nextSession);
    setSessionCards(cards);
    setIncorrectItems([]);
    setRevealAnswer(false);
    setSessionStartedAt(nextSession.status === 'ready' ? startedAt : null);
    setSessionCompletedAt(null);
    setSessionAnswers([]);
    sessionAnswersRef.current = [];
    setCompletedSessionDetail(null);
    setSelectedSessionDetail(null);
  }

  async function startSelectedDeckSession(): Promise<StudySessionStartResult | null> {
    if (isStartingSessionRef.current) {
      return null;
    }

    if (selectedDeckId == null) {
      setScreenError(strings.featureMessages.createDeckBeforeStudy);
      setSession(null);
      setSessionStartResult(null);
      setSessionCards([]);
      setIncorrectItems([]);
      return null;
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
      applySessionStart(nextSession, cards, referenceTime);
      setScreenError(null);
      return nextSession;
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : strings.featureMessages.couldNotStartStudySession);
      setSession(null);
      setSessionStartResult(null);
      setSessionCards([]);
      setIncorrectItems([]);
      setRevealAnswer(false);
      setSessionStartedAt(null);
      setSessionCompletedAt(null);
      setSessionAnswers([]);
      sessionAnswersRef.current = [];
      setCompletedSessionDetail(null);
      return null;
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
    setScreenError(null);
    setSessionStartedAt(null);
    setSessionCompletedAt(null);
    setSessionAnswers([]);
    setCompletedSessionDetail(null);
    isSubmittingAnswerRef.current = false;
    isStartingSessionRef.current = false;
    sessionAnswersRef.current = [];
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
      const answeredAt = new Date().toISOString();
      await upsertResult({
        cardId: currentItem.card.id,
        promptMode: currentItem.promptMode,
        result: isCorrect ? 'correct' : 'incorrect',
        studiedAt: answeredAt
      });

      const answerRecord = buildLiveSessionAnswer(currentItem, isCorrect, answeredAt, session.answeredCount + 1);
      const nextAnswers = [...sessionAnswersRef.current, answerRecord];
      sessionAnswersRef.current = nextAnswers;
      setSessionAnswers(nextAnswers);

      const updatedSession = studyEngine.processAnswer(session, { isCorrect });
      setSession(updatedSession);
      setIncorrectItems((currentIncorrectItems) =>
        isCorrect ? currentIncorrectItems : [...currentIncorrectItems, currentItem]
      );
      setRevealAnswer(false);
      setScreenError(null);

      if (studyEngine.isComplete(updatedSession)) {
        setSessionCompletedAt(answeredAt);
      }
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : strings.featureMessages.couldNotSaveStudyProgress);
    } finally {
      isSubmittingAnswerRef.current = false;
      setIsSubmittingAnswer(false);
    }
  }

  function onRetryIncorrectAnswers() {
    const retrySession = studyEngine.startSessionFromItems(
      incorrectItems,
      selectedTechniqueId,
      strings.featureMessages.noIncorrectAnswersToRetry
    );
    applySessionStart(retrySession, sessionCards, new Date().toISOString());
    setScreenError(null);
  }

  async function onOpenSessionDetail(sessionId: number) {
    if (completedSessionDetail?.session.id === sessionId) {
      setSelectedSessionDetail(completedSessionDetail);
      return;
    }

    try {
      setIsLoadingSessionDetail(true);
      const detail = await getStudySessionDetailById(sessionId);

      if (detail == null) {
        setScreenError(strings.featureMessages.couldNotLoadStudySessionDetail);
        return;
      }

      setSelectedSessionDetail(detail);
      setScreenError(null);
    } catch {
      setScreenError(strings.featureMessages.couldNotLoadStudySessionDetail);
    } finally {
      setIsLoadingSessionDetail(false);
    }
  }

  const sessionSummary = buildSessionSummary(
    session,
    studyEngine,
    sessionAnswers,
    sessionStartedAt,
    sessionCompletedAt
  );

  useEffect(() => {
    let isMounted = true;

    async function persistCompletedSession() {
      if (
        sessionSummary == null ||
        selectedDeck == null ||
        sessionStartedAt == null ||
        sessionCompletedAt == null ||
        isSavingSessionStats ||
        completedSessionDetail != null
      ) {
        return;
      }

      try {
        if (isMounted) {
          setIsSavingSessionStats(true);
        }

        const detail = await createStudySessionRecord(
          buildStudySessionPersistenceInput({
            deckId: selectedDeck.id,
            deckName: selectedDeck.name,
            techniqueId: selectedTechniqueId,
            sessionMode: selectedSessionMode,
            sessionSize: selectedSessionSize,
            summary: sessionSummary,
            startedAt: sessionStartedAt,
            completedAt: sessionCompletedAt,
            answers: sessionAnswersRef.current
          })
        );

        if (!isMounted) {
          return;
        }

        setCompletedSessionDetail(detail);
        setRecentSessions((currentSessions) => {
          const withoutCurrent = currentSessions.filter((sessionRecord) => sessionRecord.id !== detail.session.id);
          return [detail.session, ...withoutCurrent].slice(0, 8);
        });
        setSelectedDeckLastStudiedAt(detail.session.completedAt);
      } catch {
        if (isMounted) {
          setScreenError(strings.featureMessages.couldNotSaveStudySession);
        }
      } finally {
        if (isMounted) {
          setIsSavingSessionStats(false);
        }
      }
    }

    void persistCompletedSession();

    return () => {
      isMounted = false;
    };
  }, [
    completedSessionDetail,
    isSavingSessionStats,
    selectedDeck,
    selectedSessionMode,
    selectedSessionSize,
    selectedTechniqueId,
    sessionCompletedAt,
    sessionStartedAt,
    sessionSummary
  ]);

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
    selectedDeckInsights,
    selectedDeckReviewCount,
    selectedDeckLastStudiedAt,
    isLoadingSelectedDeckDetails,
    recentSessions,
    sessionOverview,
    isLoadingRecentSessions,
    selectedSessionDetail,
    isLoadingSessionDetail,
    completedSessionDetail,
    isSavingSessionStats,
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
      setSelectedSessionDetail(null);
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
    onOpenSessionDetail,
    onCloseSessionDetail: () => setSelectedSessionDetail(null),
    onResetSession: resetSessionState
  };
}
