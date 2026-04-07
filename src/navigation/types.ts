export type RootTabParamList = {
  Decks: undefined;
  Cards: { selectedDeckId?: number } | undefined;
  Study: { selectedDeckId?: number; autoStart?: boolean } | undefined;
  Settings: undefined;
};
