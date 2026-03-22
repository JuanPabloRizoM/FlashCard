import type { PromptMode } from '../types/study';
import type { StudyProgressResult } from '../types/studyProgress';

export type StudyProgress = {
  id: number;
  cardId: number;
  promptMode: PromptMode;
  timesSeen: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  lastResult: StudyProgressResult | null;
  lastStudiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
