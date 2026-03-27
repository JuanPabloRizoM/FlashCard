import type { Card } from '../../../core/models/Card';
import { buildCardStudyFeedback } from '../../../features/study/cardStudyPreview';

export type CardListFilter = 'all' | 'needs_details' | 'ready';

export const CARD_LIST_FILTER_LABELS: Record<CardListFilter, string> = {
  all: 'All',
  needs_details: 'Needs details',
  ready: 'Ready'
};

export function getCardCompletenessLevel(card: Card): 'basic' | 'expanded' | 'detailed' {
  const detailCount = [card.definition, card.application, card.imageUri].filter(
    (value) => value != null && value.trim().length > 0
  ).length;

  if (detailCount >= 2) {
    return 'detailed';
  }

  if (detailCount === 1) {
    return 'expanded';
  }

  return 'basic';
}

export function matchesCardListFilter(card: Card, filter: CardListFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  const feedback = buildCardStudyFeedback(card);

  if (filter === 'ready') {
    return feedback.readiness === 'good';
  }

  return feedback.readiness !== 'good';
}

export function getCardListEmptyState(filter: CardListFilter): { title: string; message: string } {
  switch (filter) {
    case 'needs_details':
      return {
        title: 'Nothing to refine',
        message: 'Cards needing more detail will show here.'
      };
    case 'ready':
      return {
        title: 'No ready cards',
        message: 'Cards that are ready for study will show here.'
      };
    default:
      return {
        title: 'No cards yet',
        message: 'Add a card or import a few.'
      };
  }
}
