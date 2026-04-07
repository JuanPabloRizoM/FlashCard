import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useStudySession, type UseStudySessionResult } from './useStudySession';

type StudyFlowContextValue = UseStudySessionResult & {
  requestedDeckId: number | null;
  pendingAutoStart: boolean;
  applyHandoff: (selectedDeckId?: number | null, autoStart?: boolean) => void;
  clearPendingAutoStart: () => void;
};

const StudyFlowContext = createContext<StudyFlowContextValue | null>(null);

type StudyFlowProviderProps = {
  children: ReactNode;
};

export function StudyFlowProvider({ children }: StudyFlowProviderProps) {
  const [requestedDeckId, setRequestedDeckId] = useState<number | null>(null);
  const [pendingAutoStart, setPendingAutoStart] = useState(false);
  const study = useStudySession({ requestedDeckId });

  useEffect(() => {
    if (requestedDeckId == null) {
      return;
    }

    if (study.selectedDeckId === requestedDeckId) {
      setRequestedDeckId(null);
      return;
    }

    if (study.decks.length > 0 && !study.decks.some((deck) => deck.id === requestedDeckId)) {
      setRequestedDeckId(null);
    }
  }, [requestedDeckId, study.decks, study.selectedDeckId]);

  const value = useMemo<StudyFlowContextValue>(
    () => ({
      ...study,
      requestedDeckId,
      pendingAutoStart,
      applyHandoff: (selectedDeckId = null, autoStart = false) => {
        if (selectedDeckId != null) {
          setRequestedDeckId(selectedDeckId);
        }

        if (autoStart) {
          setPendingAutoStart(true);
        }
      },
      clearPendingAutoStart: () => {
        setPendingAutoStart(false);
      }
    }),
    [pendingAutoStart, requestedDeckId, study]
  );

  return <StudyFlowContext.Provider value={value}>{children}</StudyFlowContext.Provider>;
}

export function useStudyFlow(): StudyFlowContextValue {
  const context = useContext(StudyFlowContext);

  if (context == null) {
    throw new Error('useStudyFlow must be used inside StudyFlowProvider.');
  }

  return context;
}
