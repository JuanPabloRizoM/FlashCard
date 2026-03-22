export type Card = {
  id: number;
  deckId: number;
  title: string;
  translation: string | null;
  definition: string | null;
  example: string | null;
  application: string | null;
  imageUri: string | null;
  createdAt: string;
  updatedAt: string;
};
