import type { Deck } from '../../../core/models/Deck';

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
