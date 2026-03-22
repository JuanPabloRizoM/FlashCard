import type { PromptMode } from './study';

export const STUDY_PROGRESS_RESULTS = ['correct', 'incorrect'] as const;

export type StudyProgressResult = (typeof STUDY_PROGRESS_RESULTS)[number];

export type StudyProgressKey = {
  cardId: number;
  promptMode: PromptMode;
};

export type UpsertStudyProgressResultInput = StudyProgressKey & {
  result: StudyProgressResult;
  studiedAt: string;
};
