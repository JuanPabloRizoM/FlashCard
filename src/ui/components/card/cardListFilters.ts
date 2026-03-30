import type { Card } from '../../../core/models/Card';
import { buildCardStudyFeedback } from '../../../features/study/cardStudyPreview';
import { getRuntimeStrings } from '../../strings';

export type CardListFilter = 'all' | 'needs_details' | 'ready';

export function getCardCompletenessLevel(card: Card): 'basic' | 'expanded' | 'detailed' {
  const detailCount = [card.description, card.application, card.imageUri].filter(
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
  const strings = getRuntimeStrings();

  switch (filter) {
    case 'needs_details':
      return {
        title: strings.locale.startsWith('es') ? 'Nada por refinar' : 'Nothing to refine',
        message:
          strings.locale.startsWith('es')
            ? 'Aquí aparecerán las tarjetas que necesitan más detalle.'
            : 'Cards needing more detail will show here.'
      };
    case 'ready':
      return {
        title: strings.locale.startsWith('es') ? 'No hay tarjetas listas' : 'No ready cards',
        message:
          strings.locale.startsWith('es')
            ? 'Aquí aparecerán las tarjetas listas para estudiar.'
            : 'Cards that are ready for study will show here.'
      };
    default:
      return {
        title: strings.cardsWorkspace.listEmptyTitle,
        message: strings.cardsWorkspace.listEmptyMessage
      };
  }
}
