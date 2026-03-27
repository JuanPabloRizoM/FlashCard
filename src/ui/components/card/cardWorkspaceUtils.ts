import type { Deck } from '../../../core/models/Deck';
import type { CardWorkspaceMode } from './CardWorkspaceModeSwitch';

export function resolveSelectedDeckId(
  decks: Deck[],
  currentDeckId: number | null,
  requestedDeckId: number | null
): number | null {
  const requestedDeck = requestedDeckId != null ? decks.find((deck) => deck.id === requestedDeckId) : null;

  if (requestedDeck != null) {
    return requestedDeck.id;
  }

  const currentDeck = currentDeckId != null ? decks.find((deck) => deck.id === currentDeckId) : null;

  return currentDeck?.id ?? decks[0]?.id ?? null;
}

export function getWorkspaceTitle(mode: CardWorkspaceMode, isEditing: boolean): string {
  if (isEditing) {
    return 'Edit card';
  }

  switch (mode) {
    case 'import_cards':
      return 'Import cards';
    case 'import_deck':
      return 'Import deck';
    default:
      return 'Create card';
  }
}
