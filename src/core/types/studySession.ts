import type { PromptMode, StudySessionMode, StudySessionSize, StudyTechniqueId } from './study';
import type { StudyProgressResult } from './studyProgress';

export type CreateStudySessionAnswerInput = {
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
};

export type CreateStudySessionInput = {
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
  answers: CreateStudySessionAnswerInput[];
};
