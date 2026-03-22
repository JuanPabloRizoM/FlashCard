import type { Card } from '../../core/models/Card';
import type { StudyProgress } from '../../core/models/StudyProgress';
import type { StudyQueueItem } from '../../core/models/StudySession';
import type {
  PromptMode,
  StudySessionMode,
  StudySessionSize,
  StudyTechniqueId
} from '../../core/types/study';
import { PromptModeResolver } from '../../engine/PromptModeResolver';
import { TechniqueRegistry } from '../../engine/TechniqueRegistry';

type BuildStudySessionConfigParams = {
  cards: Card[];
  techniqueId: StudyTechniqueId;
  progressRecords: StudyProgress[];
  mode: StudySessionMode;
  size: StudySessionSize;
};

type StudySessionConfiguration = {
  queueItems: StudyQueueItem[];
  maxSessionItems: number;
};

type StudyItemStrength = 'fresh' | 'weak' | 'other';

const promptModeResolver = new PromptModeResolver();
const techniqueRegistry = new TechniqueRegistry();
const MINIMUM_FOCUSED_POOL_SIZE = 3;

function getProgressLookupKey(cardId: number, promptMode: PromptMode): string {
  return `${cardId}:${promptMode}`;
}

function buildProgressLookup(progressRecords: StudyProgress[]): Map<string, StudyProgress> {
  return new Map(
    progressRecords.map((progress) => [
      getProgressLookupKey(progress.cardId, progress.promptMode),
      progress
    ])
  );
}

function getTargetSessionSize(size: StudySessionSize, queueLength: number): number {
  if (size === 'all') {
    return Math.max(queueLength, 1);
  }

  return size;
}

function getItemStrength(
  item: StudyQueueItem,
  progressLookup: Map<string, StudyProgress>
): StudyItemStrength {
  const progress = progressLookup.get(getProgressLookupKey(item.card.id, item.promptMode));

  if (progress == null || progress.timesSeen <= 0) {
    return 'fresh';
  }

  const attempts = Math.max(progress.timesSeen, progress.correctCount + progress.incorrectCount, 1);
  const accuracy = progress.correctCount / attempts;
  const hasWeakAccuracy = accuracy < 0.6;
  const hasRecentFailure = progress.lastResult === 'incorrect';
  const hasLowStreak = progress.currentStreak <= 1 && progress.incorrectCount > 0;

  return hasRecentFailure || hasWeakAccuracy || hasLowStreak ? 'weak' : 'other';
}

function buildFocusedQueue(
  queueItems: StudyQueueItem[],
  progressRecords: StudyProgress[],
  mode: Exclude<StudySessionMode, 'mixed'>,
  size: StudySessionSize
): StudyQueueItem[] {
  if (queueItems.length <= MINIMUM_FOCUSED_POOL_SIZE) {
    return queueItems;
  }

  const progressLookup = buildProgressLookup(progressRecords);
  const freshItems: StudyQueueItem[] = [];
  const weakItems: StudyQueueItem[] = [];
  const otherItems: StudyQueueItem[] = [];

  queueItems.forEach((item) => {
    const itemStrength = getItemStrength(item, progressLookup);

    if (itemStrength === 'fresh') {
      freshItems.push(item);
      return;
    }

    if (itemStrength === 'weak') {
      weakItems.push(item);
      return;
    }

    otherItems.push(item);
  });

  const primaryItems = mode === 'weak_focus' ? weakItems : freshItems;
  const secondaryItems = mode === 'weak_focus' ? freshItems : weakItems;
  const configuredQueue = [...primaryItems, ...secondaryItems];
  const fallbackFillTarget =
    size === 'all' ? queueItems.length : Math.min(queueItems.length, size);

  if (configuredQueue.length >= fallbackFillTarget) {
    return configuredQueue;
  }

  const minimumRequiredCount = Math.max(
    MINIMUM_FOCUSED_POOL_SIZE,
    Math.min(queueItems.length, fallbackFillTarget)
  );

  if (configuredQueue.length === 0) {
    return queueItems.slice(0, fallbackFillTarget === 0 ? minimumRequiredCount : fallbackFillTarget);
  }

  return [...configuredQueue, ...otherItems].slice(
    0,
    Math.max(minimumRequiredCount, fallbackFillTarget)
  );
}

export function buildStudySessionConfiguration({
  cards,
  techniqueId,
  progressRecords,
  mode,
  size
}: BuildStudySessionConfigParams): StudySessionConfiguration {
  const technique = techniqueRegistry.getTechnique(techniqueId);
  const fullQueue = technique.buildQueue(cards, promptModeResolver);

  return {
    queueItems:
      mode === 'mixed'
        ? fullQueue
        : buildFocusedQueue(fullQueue, progressRecords, mode, size),
    maxSessionItems: getTargetSessionSize(size, fullQueue.length)
  };
}
