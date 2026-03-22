import type { Card } from './Card';
import type { PromptMode, StudyAnswer, StudyTechniqueId } from '../types/study';

export type StudyPrompt = {
  kind: 'text' | 'image';
  label: string;
  value: string;
};

export type StudyResponse = {
  label: string;
  value: string;
};

export type StudyQueueItem = {
  card: Card;
  promptMode: PromptMode;
  prompt: StudyPrompt;
  response: StudyResponse;
};

export type StudySession = {
  techniqueId: StudyTechniqueId;
  items: StudyQueueItem[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  answeredCount: number;
  skippedCardCount: number;
  lastAnswer: StudyAnswer | null;
};

export type StudySessionStartResult =
  | {
      status: 'empty';
      reason: string;
      requestedCardCount: number;
      skippedCardCount: number;
    }
  | {
      status: 'ready';
      session: StudySession;
    };
