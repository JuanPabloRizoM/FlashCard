import type { Card } from '../core/models/Card';
import type { StudyQueueItem } from '../core/models/StudySession';
import { STUDY_TECHNIQUE_LABELS } from '../core/types/study';
import type { PromptModeResolver } from '../engine/PromptModeResolver';
import type { StudyTechnique } from '../engine/types';

export class MixedRecallTechnique implements StudyTechnique {
  readonly id = 'mixed_recall' as const;
  readonly label = STUDY_TECHNIQUE_LABELS.mixed_recall;

  buildQueue(cards: Card[], resolver: PromptModeResolver): StudyQueueItem[] {
    return cards.flatMap((card) =>
      resolver
        .resolveSupportedPromptModes(card)
        .map((mode) => resolver.resolveQueueItem(card, mode))
        .filter((item): item is StudyQueueItem => item != null)
    );
  }

  getEligibleCardCount(cards: Card[], resolver: PromptModeResolver): number {
    return cards.filter((card) => resolver.resolveSupportedPromptModes(card).length > 0).length;
  }
}
