import type { StudyTechniqueId, StudySessionMode, StudySessionSize, PromptMode } from '../types/study';
import type { StudyProgressResult } from '../types/studyProgress';

export type StudySessionRecord = {
  id: number;
  deckId: number;
  deckName: string;
  techniqueId: StudyTechniqueId;
  sessionMode: StudySessionMode;
  sessionSize: StudySessionSize;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  bestStreak: number;
  durationSeconds: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type StudySessionAnswerRecord = {
  id: number;
  sessionId: number;
  cardId: number;
  cardFront: string;
  cardBack: string;
  promptMode: PromptMode;
  promptKind: 'text' | 'image';
  promptLabel: string;
  promptValue: string;
  responseLabel: string;
  responseValue: string;
  result: StudyProgressResult;
  sequenceNumber: number;
  answeredAt: string;
  createdAt: string;
};

export type StudySessionDetail = {
  session: StudySessionRecord;
  answers: StudySessionAnswerRecord[];
};
