import type { Card } from '../core/models/Card';
import type { StudyQueueItem } from '../core/models/StudySession';
import { STUDY_TECHNIQUE_LABELS, type PromptMode } from '../core/types/study';
import type { PromptModeResolver } from '../engine/PromptModeResolver';
import type { StudyTechnique } from '../engine/types';

const REVERSE_REVIEW_MODES: PromptMode[] = ['translation_to_title', 'image_to_title'];

export class ReverseReviewTechnique implements StudyTechnique {
  readonly id = 'reverse_review' as const;
  readonly label = STUDY_TECHNIQUE_LABELS.reverse_review;

  buildQueue(cards: Card[], resolver: PromptModeResolver): StudyQueueItem[] {
    return cards.flatMap((card) => {
      const selectedMode = REVERSE_REVIEW_MODES.find((mode) =>
        resolver.resolveSupportedPromptModes(card).includes(mode)
      );
      const queueItem = selectedMode != null ? resolver.resolveQueueItem(card, selectedMode) : null;

      return queueItem != null ? [queueItem] : [];
    });
  }

  getEligibleCardCount(cards: Card[], resolver: PromptModeResolver): number {
    return cards.filter((card) =>
      REVERSE_REVIEW_MODES.some((mode) => resolver.resolveSupportedPromptModes(card).includes(mode))
    ).length;
  }
}
