import type { Card } from '../core/models/Card';
import type { StudyProgress } from '../core/models/StudyProgress';
import type { StudyQueueItem } from '../core/models/StudySession';
import type { StudyTechniqueId } from '../core/types/study';
import type { PromptModeResolver } from './PromptModeResolver';

export type StudySessionBuildOptions = {
  progressRecords?: StudyProgress[];
  referenceTime?: string;
  maxSessionItems?: number;
  queueItems?: StudyQueueItem[];
};

export interface StudyTechnique {
  readonly id: StudyTechniqueId;
  readonly label: string;
  buildQueue(cards: Card[], resolver: PromptModeResolver): StudyQueueItem[];
  getEligibleCardCount(cards: Card[], resolver: PromptModeResolver): number;
}
