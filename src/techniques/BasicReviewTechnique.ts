import type { Card } from '../core/models/Card';
import type { StudyQueueItem } from '../core/models/StudySession';
import { STUDY_TECHNIQUE_LABELS, type PromptMode } from '../core/types/study';
import type { PromptModeResolver } from '../engine/PromptModeResolver';
import type { StudyTechnique } from '../engine/types';

const BASIC_REVIEW_MODES: PromptMode[] = [
  'title_to_translation',
  'title_to_definition',
  'title_to_application'
];

export class BasicReviewTechnique implements StudyTechnique {
  readonly id = 'basic_review' as const;
  readonly label = STUDY_TECHNIQUE_LABELS.basic_review;

  buildQueue(cards: Card[], resolver: PromptModeResolver): StudyQueueItem[] {
    return cards.flatMap((card) => {
      const selectedMode = BASIC_REVIEW_MODES.find((mode) =>
        resolver.resolveSupportedPromptModes(card).includes(mode)
      );
      const queueItem = selectedMode != null ? resolver.resolveQueueItem(card, selectedMode) : null;

      return queueItem != null ? [queueItem] : [];
    });
  }

  getEligibleCardCount(cards: Card[], resolver: PromptModeResolver): number {
    return cards.filter((card) =>
      BASIC_REVIEW_MODES.some((mode) => resolver.resolveSupportedPromptModes(card).includes(mode))
    ).length;
  }
}
