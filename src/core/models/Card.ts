export type Card = {
  id: number;
  deckId: number;
  front: string;
  back: string;
  description: string | null;
  application: string | null;
  imageUri: string | null;
  createdAt: string;
  updatedAt: string;
};
