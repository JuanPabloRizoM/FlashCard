import type { AppStrings } from '../../ui/strings/translations';
import type { StudyQueueItem, StudySession } from '../../core/models/StudySession';
import type { StudySessionAnswerRecord, StudySessionDetail, StudySessionRecord } from '../../core/models/StudySessionRecord';
import type { CreateStudySessionAnswerInput, CreateStudySessionInput } from '../../core/types/studySession';
import type { StudyProgressResult } from '../../core/types/studyProgress';
import type { StudyEngine } from '../../engine/StudyEngine';

export type LiveSessionAnswer = CreateStudySessionAnswerInput;

export type SessionSummary = {
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  bestStreak: number;
  durationSeconds: number;
};

export type StudySessionOverview = {
  sessionCount: number;
  totalReviewed: number;
  averageAccuracy: number;
  bestAccuracy: number;
  totalCorrect: number;
  totalIncorrect: number;
  lastCompletedAt: string | null;
};

export type PromptDistributionMetric = {
  label: string;
  count: number;
};

export function getLocalizedStudyFieldLabel(label: string, locale: string): string {
  if (!locale.startsWith('es')) {
    return label;
  }

  switch (label) {
    case 'Front':
      return 'Frente';
    case 'Back':
      return 'Reverso';
    case 'Image':
      return 'Imagen';
    case 'Description':
      return 'Descripción';
    case 'Application':
      return 'Aplicación';
    default:
      return label;
  }
}

function isValidTimestamp(value: string | null): value is string {
  return value != null && !Number.isNaN(Date.parse(value));
}

export function buildLiveSessionAnswer(
  item: StudyQueueItem,
  isCorrect: boolean,
  answeredAt: string,
  sequenceNumber: number
): LiveSessionAnswer {
  return {
    cardId: item.card.id,
    cardFront: item.card.front,
    cardBack: item.card.back,
    promptMode: item.promptMode,
    promptKind: item.prompt.kind,
    promptLabel: item.prompt.label,
    promptValue: item.prompt.value,
    responseLabel: item.response.label,
    responseValue: item.response.value,
    result: isCorrect ? 'correct' : 'incorrect',
    sequenceNumber,
    answeredAt
  };
}

export function calculateBestStreak(results: Array<Pick<LiveSessionAnswer, 'result'>>): number {
  let currentStreak = 0;
  let bestStreak = 0;

  results.forEach((answer) => {
    if (answer.result === 'correct') {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
      return;
    }

    currentStreak = 0;
  });

  return bestStreak;
}

export function calculateDurationSeconds(startedAt: string | null, completedAt: string | null): number {
  if (!isValidTimestamp(startedAt) || !isValidTimestamp(completedAt)) {
    return 0;
  }

  const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime();

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(durationMs / 1000));
}

export function buildSessionSummary(
  session: StudySession | null,
  studyEngine: StudyEngine,
  answers: LiveSessionAnswer[],
  startedAt: string | null,
  completedAt: string | null
): SessionSummary | null {
  if (session == null || !studyEngine.isComplete(session)) {
    return null;
  }

  return {
    answeredCount: session.answeredCount,
    correctCount: session.correctCount,
    incorrectCount: session.incorrectCount,
    accuracyPercentage:
      session.answeredCount === 0 ? 0 : Math.round((session.correctCount / session.answeredCount) * 100),
    bestStreak: calculateBestStreak(answers),
    durationSeconds: calculateDurationSeconds(startedAt, completedAt)
  };
}

export function buildStudySessionPersistenceInput(params: {
  deckId: number;
  deckName: string;
  techniqueId: CreateStudySessionInput['techniqueId'];
  sessionMode: CreateStudySessionInput['sessionMode'];
  sessionSize: CreateStudySessionInput['sessionSize'];
  summary: SessionSummary;
  startedAt: string;
  completedAt: string;
  answers: LiveSessionAnswer[];
}): CreateStudySessionInput {
  const {
    deckId,
    deckName,
    techniqueId,
    sessionMode,
    sessionSize,
    summary,
    startedAt,
    completedAt,
    answers
  } = params;

  return {
    deckId,
    deckName,
    techniqueId,
    sessionMode,
    sessionSize,
    answeredCount: summary.answeredCount,
    correctCount: summary.correctCount,
    incorrectCount: summary.incorrectCount,
    accuracyPercentage: summary.accuracyPercentage,
    bestStreak: summary.bestStreak,
    durationSeconds: summary.durationSeconds,
    startedAt,
    completedAt,
    answers
  };
}

export function buildStudySessionOverview(records: StudySessionRecord[]): StudySessionOverview {
  if (records.length === 0) {
    return {
      sessionCount: 0,
      totalReviewed: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      lastCompletedAt: null
    };
  }

  const totalReviewed = records.reduce((total, record) => total + record.answeredCount, 0);
  const totalCorrect = records.reduce((total, record) => total + record.correctCount, 0);
  const totalIncorrect = records.reduce((total, record) => total + record.incorrectCount, 0);
  const totalAccuracy = records.reduce((total, record) => total + record.accuracyPercentage, 0);

  return {
    sessionCount: records.length,
    totalReviewed,
    averageAccuracy: Math.round(totalAccuracy / records.length),
    bestAccuracy: Math.max(...records.map((record) => record.accuracyPercentage), 0),
    totalCorrect,
    totalIncorrect,
    lastCompletedAt: records[0]?.completedAt ?? null
  };
}

export function buildPromptDistribution(
  answers: Array<Pick<StudySessionAnswerRecord, 'promptLabel' | 'result'>>
): PromptDistributionMetric[] {
  const counts = new Map<string, number>();

  answers.forEach((answer) => {
    counts.set(answer.promptLabel, (counts.get(answer.promptLabel) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export function filterSessionAnswersByResult(
  answers: StudySessionAnswerRecord[],
  result: StudyProgressResult
): StudySessionAnswerRecord[] {
  return answers.filter((answer) => answer.result === result);
}

export function formatDurationLabel(durationSeconds: number, strings: AppStrings): string {
  if (durationSeconds < 60) {
    return strings.studyStats.durationSeconds(durationSeconds);
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  if (seconds === 0) {
    return strings.studyStats.durationMinutes(minutes);
  }

  return strings.studyStats.durationMinutesSeconds(minutes, seconds);
}

export function formatSessionDateTime(timestamp: string, locale: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export function buildStudySessionShareMessage(detail: StudySessionDetail, strings: AppStrings): string {
  const failedAnswers = filterSessionAnswersByResult(detail.answers, 'incorrect');
  const durationLabel = formatDurationLabel(detail.session.durationSeconds, strings);

  return [
    `${strings.studyStats.shareTitle}: ${detail.session.deckName}`,
    `${strings.studySummary.answered}: ${detail.session.answeredCount}`,
    `${strings.studySummary.correct}: ${detail.session.correctCount}`,
    `${strings.studySummary.incorrect}: ${detail.session.incorrectCount}`,
    `${strings.studySummary.accuracy}: ${detail.session.accuracyPercentage}%`,
    `${strings.studyStats.bestStreak}: ${detail.session.bestStreak}`,
    `${strings.studyStats.sessionTime}: ${durationLabel}`,
    failedAnswers.length > 0
      ? `${strings.studyStats.failedCards}: ${failedAnswers.slice(0, 5).map((answer) => answer.cardFront).join(', ')}`
      : strings.studySummary.noMissedPrompts
  ].join('\n');
}
