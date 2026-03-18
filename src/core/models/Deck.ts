import type { DeckType } from '../types/deck';

export type Deck = {
  id: number;
  name: string;
  description: string | null;
  type: DeckType;
  color: string | null;
  createdAt: string;
  updatedAt: string;
};
