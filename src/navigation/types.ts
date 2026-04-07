import type { NavigatorScreenParams } from '@react-navigation/native';

export type StudyStackParamList = {
  StudyDashboard: { selectedDeckId?: number; autoStart?: boolean } | undefined;
  StudySession: undefined;
  StudySessionStats: { sessionId: number };
};

export type RootTabParamList = {
  Decks: undefined;
  Cards: { selectedDeckId?: number } | undefined;
  Study: NavigatorScreenParams<StudyStackParamList> | undefined;
  Settings: undefined;
};
