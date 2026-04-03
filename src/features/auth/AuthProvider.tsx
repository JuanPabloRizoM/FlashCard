import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

import {
  DEFAULT_AUTH_SESSION,
  normalizeAuthSession,
  type AuthPlaceholderResult,
  type AuthResetPasswordResult,
  type AuthSession
} from '../../core/types/auth';
import { loadAuthSession, saveAuthSession } from '../../storage/authSessionStorage';
import { normalizeEmail } from './authValidation';

type AuthContextValue = {
  session: AuthSession;
  hasAccess: boolean;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<AuthPlaceholderResult>;
  signUp: (input: { name?: string | null; email: string; password: string }) => Promise<AuthPlaceholderResult>;
  signInWithGoogle: () => Promise<AuthPlaceholderResult>;
  resetPassword: (email: string) => Promise<AuthResetPasswordResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

function buildTimestamp(): string {
  return new Date().toISOString();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>(DEFAULT_AUTH_SESSION);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateAuthSession() {
      const storedSession = await loadAuthSession();

      if (!isMounted) {
        return;
      }

      setSession(storedSession);
      setIsHydrated(true);
    }

    void hydrateAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const applySession = useCallback((value: AuthSession | ((currentSession: AuthSession) => AuthSession)) => {
    setSession((currentSession) => {
      const nextSession = normalizeAuthSession(
        typeof value === 'function' ? value(currentSession) : value
      );

      void saveAuthSession(nextSession).catch(() => {
        // Keep the local shell usable even if persistence fails.
      });

      return nextSession;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      hasAccess: session.status === 'guest' || session.status === 'authenticated',
      continueAsGuest: async () => {
        applySession({
          status: 'guest',
          provider: 'guest',
          email: null,
          displayName: null,
          updatedAt: buildTimestamp()
        });
      },
      signOut: async () => {
        applySession({
          ...DEFAULT_AUTH_SESSION,
          updatedAt: buildTimestamp()
        });
      },
      signIn: async () => ({ status: 'unavailable' }),
      signUp: async () => ({ status: 'unavailable' }),
      signInWithGoogle: async () => ({ status: 'unavailable' }),
      resetPassword: async (email) => ({
        status: 'preview',
        email: normalizeEmail(email)
      })
    }),
    [applySession, session]
  );

  if (!isHydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context == null) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
