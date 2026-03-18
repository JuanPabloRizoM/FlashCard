export const DECK_TYPES = [
  'general',
  'language',
  'medicine',
  'programming',
  'science'
] as const;

export type DeckType = (typeof DECK_TYPES)[number];

export const DECK_TYPE_LABELS: Record<DeckType, string> = {
  general: 'General',
  language: 'Language',
  medicine: 'Medicine',
  programming: 'Programming',
  science: 'Science'
};

export const DEFAULT_DECK_TYPE: DeckType = 'general';
export const MAX_DECK_NAME_LENGTH = 80;
export const MAX_DECK_DESCRIPTION_LENGTH = 240;

export type CreateDeckInput = {
  name: string;
  description?: string | null;
  type?: DeckType;
  color?: string | null;
};
