import { BasicReviewTechnique } from '../techniques/BasicReviewTechnique';
import { MixedRecallTechnique } from '../techniques/MixedRecallTechnique';
import { ReverseReviewTechnique } from '../techniques/ReverseReviewTechnique';
import type { StudyTechnique } from './types';
import type { StudyTechniqueId } from '../core/types/study';

const TECHNIQUES: Record<StudyTechniqueId, StudyTechnique> = {
  basic_review: new BasicReviewTechnique(),
  reverse_review: new ReverseReviewTechnique(),
  mixed_recall: new MixedRecallTechnique()
};

export class TechniqueRegistry {
  getTechnique(techniqueId: StudyTechniqueId): StudyTechnique {
    return TECHNIQUES[techniqueId];
  }

  listTechniques(): StudyTechnique[] {
    return Object.values(TECHNIQUES);
  }
}
