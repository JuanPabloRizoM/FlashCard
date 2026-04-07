import type { StudySessionAnswerRecord, StudySessionDetail, StudySessionRecord } from '../../core/models/StudySessionRecord';
import type { CreateStudySessionInput } from '../../core/types/studySession';
import { readWebAppState, writeWebAppState } from '../webAppStore';

function sortSessions(records: StudySessionRecord[]): StudySessionRecord[] {
  return [...records].sort((leftRecord, rightRecord) => {
    const leftTimestamp = new Date(leftRecord.completedAt).getTime();
    const rightTimestamp = new Date(rightRecord.completedAt).getTime();

    if (leftTimestamp !== rightTimestamp) {
      return rightTimestamp - leftTimestamp;
    }

    return rightRecord.id - leftRecord.id;
  });
}

async function ensureDeckExists(deckId: number): Promise<void> {
  const state = await readWebAppState();
  const deck = state.decks.find((candidateDeck) => candidateDeck.id === deckId);

  if (deck == null) {
    throw new Error('Choose a valid deck before saving study results.');
  }
}

export async function createSession(input: CreateStudySessionInput): Promise<StudySessionDetail> {
  await ensureDeckExists(input.deckId);

  let savedSession: StudySessionRecord | null = null;
  let savedAnswers: StudySessionAnswerRecord[] = [];

  await writeWebAppState((currentState) => {
    const sessionId = currentState.nextStudySessionId;
    const createdAt = input.completedAt;
    const session: StudySessionRecord = {
      id: sessionId,
      deckId: input.deckId,
      deckName: input.deckName,
      techniqueId: input.techniqueId,
      sessionMode: input.sessionMode,
      sessionSize: input.sessionSize,
      answeredCount: input.answeredCount,
      correctCount: input.correctCount,
      incorrectCount: input.incorrectCount,
      accuracyPercentage: input.accuracyPercentage,
      bestStreak: input.bestStreak,
      durationSeconds: input.durationSeconds,
      startedAt: input.startedAt,
      completedAt: input.completedAt,
      createdAt,
      updatedAt: createdAt
    };

    const answerRecords = input.answers.map((answer, index) => ({
      id: currentState.nextStudySessionAnswerId + index,
      sessionId,
      cardId: answer.cardId,
      cardFront: answer.cardFront,
      cardBack: answer.cardBack,
      promptMode: answer.promptMode,
      promptKind: answer.promptKind,
      promptLabel: answer.promptLabel,
      promptValue: answer.promptValue,
      responseLabel: answer.responseLabel,
      responseValue: answer.responseValue,
      result: answer.result,
      sequenceNumber: answer.sequenceNumber,
      answeredAt: answer.answeredAt,
      createdAt: answer.answeredAt
    } satisfies StudySessionAnswerRecord));

    savedSession = session;
    savedAnswers = answerRecords;

    return {
      ...currentState,
      studySessions: sortSessions([session, ...currentState.studySessions]),
      studySessionAnswers: [...answerRecords, ...currentState.studySessionAnswers],
      nextStudySessionId: currentState.nextStudySessionId + 1,
      nextStudySessionAnswerId: currentState.nextStudySessionAnswerId + answerRecords.length
    };
  });

  if (savedSession == null) {
    throw new Error('Study session save succeeded but the saved session could not be loaded.');
  }

  return {
    session: savedSession,
    answers: [...savedAnswers].sort((leftAnswer, rightAnswer) => leftAnswer.sequenceNumber - rightAnswer.sequenceNumber)
  };
}

export async function listByDeckId(deckId: number, limit = 8): Promise<StudySessionRecord[]> {
  await ensureDeckExists(deckId);

  const state = await readWebAppState();
  const deckSessions = state.studySessions.filter((session) => session.deckId === deckId);

  return sortSessions(deckSessions).slice(0, limit);
}

export async function getDetailById(sessionId: number): Promise<StudySessionDetail | null> {
  const state = await readWebAppState();
  const session = state.studySessions.find((candidateSession) => candidateSession.id === sessionId) ?? null;

  if (session == null) {
    return null;
  }

  return {
    session,
    answers: [...state.studySessionAnswers]
      .filter((answer) => answer.sessionId === sessionId)
      .sort((leftAnswer, rightAnswer) => leftAnswer.sequenceNumber - rightAnswer.sequenceNumber)
  };
}
