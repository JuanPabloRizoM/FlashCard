import type { StudySession } from '../../core/models/StudySession';
import { StudyEngine } from '../../engine/StudyEngine';

export type SessionSummary = {
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
};

export function getStudyStartErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not start the study session right now.';
}

export function buildSessionSummary(
  session: StudySession | null,
  studyEngine: StudyEngine
): SessionSummary | null {
  if (session == null || !studyEngine.isComplete(session)) {
    return null;
  }

  return {
    answeredCount: session.answeredCount,
    correctCount: session.correctCount,
    incorrectCount: session.incorrectCount,
    accuracyPercentage:
      session.answeredCount === 0
        ? 0
        : Math.round((session.correctCount / session.answeredCount) * 100)
  };
}
