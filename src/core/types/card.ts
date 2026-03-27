export const MAX_CARD_TITLE_LENGTH = 120;
export const MAX_CARD_SHORT_TEXT_LENGTH = 240;
export const MAX_CARD_LONG_TEXT_LENGTH = 600;
export const MAX_CARD_IMAGE_URI_LENGTH = 2048;

export type CreateCardInput = {
  deckId: number;
  front: string;
  back: string;
  description?: string | null;
  application?: string | null;
  imageUri?: string | null;
};

export type UpdateCardInput = CreateCardInput & {
  id: number;
};
