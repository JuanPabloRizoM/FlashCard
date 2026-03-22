import type { StudyProgress } from '../core/models/StudyProgress';
import type { StudySession, StudySessionStartResult, StudyQueueItem } from '../core/models/StudySession';
import type { Card } from '../core/models/Card';
import type { StudyAnswer, StudyTechniqueId } from '../core/types/study';
import { PromptModeResolver } from './PromptModeResolver';
import { TechniqueRegistry } from './TechniqueRegistry';
import type { StudySessionBuildOptions } from './types';

const FRESH_ITEM_PRIORITY = 55;
const BASE_PROGRESS_PRIORITY = 25;
const RECENT_FAILURE_WINDOW_HOURS = 72;
const DEFAULT_MAX_SESSION_ITEMS = 12;
const RECENT_CARD_REPEAT_WINDOW = 2;
const SHAPING_BUCKET_SEQUENCE = ['weak', 'fresh', 'weak', 'strong'] as const;

type StudyStrengthBucket = 'fresh' | 'weak' | 'strong';

type RankedStudyItem = {
  item: StudyQueueItem;
  index: number;
  priority: number;
  bucket: StudyStrengthBucket;
};

export class StudyEngine {
  constructor(
    private readonly promptModeResolver = new PromptModeResolver(),
    private readonly techniqueRegistry = new TechniqueRegistry()
  ) {}

  startSession(
    cards: Card[],
    techniqueId: StudyTechniqueId,
    options?: StudySessionBuildOptions
  ): StudySessionStartResult {
    const technique = this.techniqueRegistry.getTechnique(techniqueId);
    const queueItems = options?.queueItems ?? technique.buildQueue(cards, this.promptModeResolver);
    const rankedItems = this.rankItemsByAdaptivePriority(queueItems, options);
    const items = this.shapeRankedItemsIntoSession(
      rankedItems,
      options?.maxSessionItems ?? DEFAULT_MAX_SESSION_ITEMS
    );
    const skippedCardCount = Math.max(
      cards.length - technique.getEligibleCardCount(cards, this.promptModeResolver),
      0
    );

    if (items.length === 0) {
      return {
        status: 'empty',
        reason: 'No cards in this deck support the selected study technique yet.',
        requestedCardCount: cards.length,
        skippedCardCount
      };
    }

    return {
      status: 'ready',
      session: this.createSession(techniqueId, items, skippedCardCount)
    };
  }

  startSessionFromItems(
    items: StudyQueueItem[],
    techniqueId: StudyTechniqueId,
    emptyReason = 'No study items are available for this session.'
  ): StudySessionStartResult {
    if (items.length === 0) {
      return {
        status: 'empty',
        reason: emptyReason,
        requestedCardCount: 0,
        skippedCardCount: 0
      };
    }

    return {
      status: 'ready',
      session: this.createSession(techniqueId, items, 0)
    };
  }

  getCurrentItem(session: StudySession): StudyQueueItem | null {
    return session.items[session.currentIndex] ?? null;
  }

  processAnswer(session: StudySession, answer: StudyAnswer): StudySession {
    const currentItem = this.getCurrentItem(session);

    if (currentItem == null) {
      return session;
    }

    return {
      ...session,
      currentIndex: session.currentIndex + 1,
      correctCount: session.correctCount + (answer.isCorrect ? 1 : 0),
      incorrectCount: session.incorrectCount + (answer.isCorrect ? 0 : 1),
      answeredCount: session.answeredCount + 1,
      lastAnswer: answer
    };
  }

  isComplete(session: StudySession): boolean {
    return this.getCurrentItem(session) == null;
  }

  private createSession(
    techniqueId: StudyTechniqueId,
    items: StudyQueueItem[],
    skippedCardCount: number
  ): StudySession {
    return {
      techniqueId,
      items,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      answeredCount: 0,
      skippedCardCount,
      lastAnswer: null
    };
  }

  private rankItemsByAdaptivePriority(
    items: StudyQueueItem[],
    options?: StudySessionBuildOptions
  ): RankedStudyItem[] {
    if (items.length <= 1) {
      return items.map((item, index) => ({
        item,
        index,
        priority: FRESH_ITEM_PRIORITY,
        bucket: this.getStrengthBucket(item, undefined)
      }));
    }

    const progressByPromptKey = this.createProgressLookup(options?.progressRecords ?? []);
    const referenceTimestamp = Date.parse(options?.referenceTime ?? new Date().toISOString());

    return [...items]
      .map((item, index) => ({
        item,
        index,
        priority: this.getAdaptivePriority(item, progressByPromptKey, referenceTimestamp),
        bucket: this.getStrengthBucket(
          item,
          progressByPromptKey.get(this.getProgressLookupKey(item.card.id, item.promptMode))
        )
      }))
      .sort((left, right) => {
        if (right.priority !== left.priority) {
          return right.priority - left.priority;
        }

        return left.index - right.index;
      });
  }

  private shapeRankedItemsIntoSession(
    rankedItems: RankedStudyItem[],
    maxSessionItems: number
  ): StudyQueueItem[] {
    if (rankedItems.length <= 1) {
      return rankedItems.map((entry) => entry.item);
    }

    const targetSize = Math.min(Math.max(maxSessionItems, 1), rankedItems.length);
    const bucketQueues = this.createBucketQueues(rankedItems);
    const shapedItems: StudyQueueItem[] = [];
    const selectedCountByCardId = new Map<number, number>();
    let bucketCursor = 0;

    while (shapedItems.length < targetSize) {
      const recentCardIds = shapedItems
        .slice(-RECENT_CARD_REPEAT_WINDOW)
        .map((item) => item.card.id);
      const nextEntry = this.takeNextShapedEntry(
        bucketQueues,
        recentCardIds,
        selectedCountByCardId,
        bucketCursor
      );

      if (nextEntry == null) {
        break;
      }

      shapedItems.push(nextEntry.entry.item);
      selectedCountByCardId.set(
        nextEntry.entry.item.card.id,
        (selectedCountByCardId.get(nextEntry.entry.item.card.id) ?? 0) + 1
      );
      bucketCursor = nextEntry.nextBucketCursor;
    }

    return shapedItems;
  }

  private createBucketQueues(
    rankedItems: RankedStudyItem[]
  ): Record<StudyStrengthBucket, RankedStudyItem[]> {
    return rankedItems.reduce<Record<StudyStrengthBucket, RankedStudyItem[]>>(
      (queues, entry) => {
        queues[entry.bucket].push(entry);
        return queues;
      },
      {
        fresh: [],
        weak: [],
        strong: []
      }
    );
  }

  private takeNextShapedEntry(
    bucketQueues: Record<StudyStrengthBucket, RankedStudyItem[]>,
    recentCardIds: number[],
    selectedCountByCardId: Map<number, number>,
    startCursor: number
  ): { entry: RankedStudyItem; nextBucketCursor: number } | null {
    const mostRecentCardId = recentCardIds[recentCardIds.length - 1] ?? null;

    return (
      this.takeFromBuckets(
        bucketQueues,
        startCursor,
        selectedCountByCardId,
        (entry) => !recentCardIds.includes(entry.item.card.id)
      ) ??
      (mostRecentCardId != null
        ? this.takeFromBuckets(
            bucketQueues,
            startCursor,
            selectedCountByCardId,
            (entry) => entry.item.card.id !== mostRecentCardId
          )
        : null) ??
      this.takeFromBuckets(bucketQueues, startCursor, selectedCountByCardId, () => true)
    );
  }

  private takeFromBuckets(
    bucketQueues: Record<StudyStrengthBucket, RankedStudyItem[]>,
    startCursor: number,
    selectedCountByCardId: Map<number, number>,
    predicate: (entry: RankedStudyItem) => boolean
  ): { entry: RankedStudyItem; nextBucketCursor: number } | null {
    for (let offset = 0; offset < SHAPING_BUCKET_SEQUENCE.length; offset += 1) {
      const bucketCursor = (startCursor + offset) % SHAPING_BUCKET_SEQUENCE.length;
      const bucket = SHAPING_BUCKET_SEQUENCE[bucketCursor] as StudyStrengthBucket;
      const queue = bucketQueues[bucket];
      const candidateIndex = this.findBestQueueCandidateIndex(
        queue,
        selectedCountByCardId,
        predicate
      );

      if (candidateIndex >= 0) {
        const [entry] = queue.splice(candidateIndex, 1);

        if (entry == null) {
          continue;
        }

        return {
          entry,
          nextBucketCursor: (bucketCursor + 1) % SHAPING_BUCKET_SEQUENCE.length
        };
      }
    }

    return null;
  }

  private findBestQueueCandidateIndex(
    queue: RankedStudyItem[],
    selectedCountByCardId: Map<number, number>,
    predicate: (entry: RankedStudyItem) => boolean
  ): number {
    let bestIndex = -1;
    let bestSelectedCount = Number.POSITIVE_INFINITY;

    for (let index = 0; index < queue.length; index += 1) {
      const entry = queue[index];

      if (entry == null) {
        continue;
      }

      if (!predicate(entry)) {
        continue;
      }

      const selectedCount = selectedCountByCardId.get(entry.item.card.id) ?? 0;

      if (selectedCount < bestSelectedCount) {
        bestIndex = index;
        bestSelectedCount = selectedCount;
      }
    }

    return bestIndex;
  }

  private createProgressLookup(progressRecords: StudyProgress[]): Map<string, StudyProgress> {
    return new Map(
      progressRecords.map((progress) => [
        this.getProgressLookupKey(progress.cardId, progress.promptMode),
        progress
      ])
    );
  }

  private getAdaptivePriority(
    item: StudyQueueItem,
    progressByPromptKey: Map<string, StudyProgress>,
    referenceTimestamp: number
  ): number {
    const progress = progressByPromptKey.get(
      this.getProgressLookupKey(item.card.id, item.promptMode)
    );

    if (progress == null) {
      return FRESH_ITEM_PRIORITY;
    }

    const timesSeen = Math.max(progress.timesSeen, 0);
    const correctCount = Math.max(progress.correctCount, 0);
    const incorrectCount = Math.max(progress.incorrectCount, 0);
    const attempts = Math.max(timesSeen, correctCount + incorrectCount, 1);
    const correctRate = correctCount / attempts;
    const incorrectRate = incorrectCount / attempts;
    const lowExposureBonus = Math.max(0, 3 - Math.min(timesSeen, 3)) * 5;
    const weaknessBonus = incorrectRate * 35;
    const recentFailureBonus =
      progress.lastResult === 'incorrect'
        ? 25 + this.getRecentFailureBonus(progress.lastStudiedAt, referenceTimestamp)
        : 0;
    const confidencePenalty = correctRate * 16;
    const streakPenalty = Math.min(progress.currentStreak, 5) * 5;

    return (
      BASE_PROGRESS_PRIORITY +
      lowExposureBonus +
      weaknessBonus +
      recentFailureBonus -
      confidencePenalty -
      streakPenalty
    );
  }

  private getStrengthBucket(
    item: StudyQueueItem,
    progress?: StudyProgress
  ): StudyStrengthBucket {
    if (progress == null || progress.timesSeen <= 0) {
      return 'fresh';
    }

    const attempts = Math.max(progress.timesSeen, progress.correctCount + progress.incorrectCount, 1);
    const correctRate = progress.correctCount / attempts;
    const incorrectRate = progress.incorrectCount / attempts;

    if (
      progress.lastResult === 'incorrect' ||
      incorrectRate >= 0.34 ||
      (progress.incorrectCount > 0 && progress.currentStreak === 0)
    ) {
      return 'weak';
    }

    if (progress.currentStreak >= 3 || correctRate >= 0.75) {
      return 'strong';
    }

    return item.prompt.kind === 'image' ? 'fresh' : 'strong';
  }

  private getRecentFailureBonus(lastStudiedAt: string | null, referenceTimestamp: number): number {
    if (lastStudiedAt == null) {
      return 0;
    }

    const lastStudiedTimestamp = Date.parse(lastStudiedAt);

    if (Number.isNaN(lastStudiedTimestamp)) {
      return 0;
    }

    const hoursSinceFailure = Math.max((referenceTimestamp - lastStudiedTimestamp) / 3_600_000, 0);

    if (hoursSinceFailure >= RECENT_FAILURE_WINDOW_HOURS) {
      return 0;
    }

    return ((RECENT_FAILURE_WINDOW_HOURS - hoursSinceFailure) / RECENT_FAILURE_WINDOW_HOURS) * 20;
  }

  private getProgressLookupKey(cardId: number, promptMode: StudyQueueItem['promptMode']): string {
    return `${cardId}:${promptMode}`;
  }
}
