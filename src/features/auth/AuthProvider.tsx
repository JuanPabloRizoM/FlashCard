import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import {
  type AuthEntryDestination,
  DEFAULT_AUTH_SESSION,
  normalizeAuthSession,
  type AuthActionResult,
  type AuthProfile,
  type AuthResetPasswordResult,
  type AuthSession
} from '../../core/types/auth';
import { getRuntimeStrings } from '../../ui/strings';
import { loadAuthSession, saveAuthSession } from '../../storage/authSessionStorage';
import { normalizeEmail } from './authValidation';
import {
  getSupabaseRedirectUrl,
  isSupabaseConfigured,
  mapSupabaseSessionToAuthProfile,
  supabase
} from '../../services/supabase/supabaseClient';

type AuthContextValue = {
  session: AuthSession;
  hasAccess: boolean;
  pendingAuthEntry: AuthEntryDestination | null;
  continueAsGuest: () => Promise<void>;
  beginAuthEntry: (destination: AuthEntryDestination) => Promise<void>;
  consumePendingAuthEntry: () => void;
  signOut: () => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<AuthActionResult>;
  signUp: (input: { name?: string | null; email: string; password: string }) => Promise<AuthActionResult>;
  signInWithGoogle: () => Promise<AuthActionResult>;
  resetPassword: (email: string) => Promise<AuthResetPasswordResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

function buildTimestamp(): string {
  return new Date().toISOString();
}

function buildAuthenticatedSession(profile: AuthProfile): AuthSession {
  return {
    status: 'authenticated',
    provider: profile.provider,
    email: profile.email,
    displayName: profile.displayName,
    updatedAt: buildTimestamp()
  };
}

function keepGuestOrSignOut(currentSession: AuthSession): AuthSession {
  if (currentSession.status === 'guest') {
    return currentSession;
  }

  return {
    ...DEFAULT_AUTH_SESSION,
    updatedAt: buildTimestamp()
  };
}

function createConfigError(): AuthActionResult {
  return {
    status: 'error',
    message: getRuntimeStrings().auth.common.configMissing
  };
}

function createErrorResult(error: unknown, action: 'google' | 'sign_in' | 'sign_up' | 'reset_password'): AuthActionResult {
  const strings = getRuntimeStrings();

  if (!isSupabaseConfigured || supabase == null) {
    return createConfigError();
  }

  if (error instanceof Error) {
    const normalizedMessage = error.message.toLowerCase();

    if (action === 'sign_in') {
      if (normalizedMessage.includes('invalid login credentials')) {
        return { status: 'error', message: strings.auth.signIn.invalidCredentials };
      }

      if (normalizedMessage.includes('email not confirmed')) {
        return { status: 'error', message: strings.auth.signIn.emailNotConfirmed };
      }
    }

    if (action === 'sign_up') {
      if (normalizedMessage.includes('already registered')) {
        return { status: 'error', message: strings.auth.createAccount.emailInUse };
      }

      if (normalizedMessage.includes('password should be at least')) {
        return { status: 'error', message: strings.auth.createAccount.weakPassword };
      }
    }

    if (action === 'google' && normalizedMessage.includes('provider is not enabled')) {
      return { status: 'error', message: strings.auth.landing.googleNotAvailable };
    }

    return {
      status: 'error',
      message: strings.auth.common.genericError
    };
  }

  return {
    status: 'error',
    message: strings.auth.common.genericError
  };
}

function createResetError(error: unknown): AuthResetPasswordResult {
  const result = createErrorResult(error, 'reset_password');

  if (result.status !== 'error') {
    return {
      status: 'error',
      message: getRuntimeStrings().auth.common.genericError
    };
  }

  return {
    status: 'error',
    message: result.message
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession>(DEFAULT_AUTH_SESSION);
  const [pendingAuthEntry, setPendingAuthEntry] = useState<AuthEntryDestination | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    let subscription: { unsubscribe: () => void } | null = null;

    async function hydrateAuthSession() {
      const storedSession = await loadAuthSession();
      let nextSession =
        storedSession.status === 'guest'
          ? storedSession
          : {
              ...DEFAULT_AUTH_SESSION,
              updatedAt: storedSession.updatedAt
            };

      if (isSupabaseConfigured && supabase != null) {
        const {
          data: { session: supabaseSession }
        } = await supabase.auth.getSession();

        if (supabaseSession != null) {
          nextSession = buildAuthenticatedSession(mapSupabaseSessionToAuthProfile(supabaseSession));
          await saveAuthSession(nextSession);
        }

        const {
          data: { subscription: authSubscription }
        } = supabase.auth.onAuthStateChange((_event, nextSupabaseSession) => {
          if (!isMounted) {
            return;
          }

          setSession((currentSession) => {
            const resolvedSession =
              nextSupabaseSession != null
                ? buildAuthenticatedSession(mapSupabaseSessionToAuthProfile(nextSupabaseSession))
                : keepGuestOrSignOut(currentSession);

            void saveAuthSession(resolvedSession).catch(() => {
              // Keep the app shell usable even if persistence fails.
            });

            return resolvedSession;
          });
        });

        subscription = authSubscription;
      }

      if (!isMounted) {
        subscription?.unsubscribe();
        return;
      }

      setSession(nextSession);
      setIsHydrated(true);
    }

    void hydrateAuthSession();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
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
      pendingAuthEntry,
      continueAsGuest: async () => {
        applySession({
          status: 'guest',
          provider: 'guest',
          email: null,
          displayName: null,
          updatedAt: buildTimestamp()
        });
      },
      beginAuthEntry: async (destination) => {
        setPendingAuthEntry(destination);
        applySession({
          ...DEFAULT_AUTH_SESSION,
          updatedAt: buildTimestamp()
        });
      },
      consumePendingAuthEntry: () => {
        setPendingAuthEntry(null);
      },
      signOut: async () => {
        if (session.status === 'authenticated' && isSupabaseConfigured && supabase != null) {
          const { error } = await supabase.auth.signOut({ scope: 'local' });

          if (error != null) {
            throw error;
          }
        }

        setPendingAuthEntry(null);
        applySession({
          ...DEFAULT_AUTH_SESSION,
          updatedAt: buildTimestamp()
        });
      },
      signIn: async ({ email, password }) => {
        if (!isSupabaseConfigured || supabase == null) {
          return createConfigError();
        }

        const normalizedEmail = normalizeEmail(email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

        if (error != null) {
          return createErrorResult(error, 'sign_in');
        }

        if (data.session != null) {
          applySession(buildAuthenticatedSession(mapSupabaseSessionToAuthProfile(data.session)));
        }

        return { status: 'success' };
      },
      signUp: async ({ name, email, password }) => {
        if (!isSupabaseConfigured || supabase == null) {
          return createConfigError();
        }

        const normalizedEmail = normalizeEmail(email);
        const normalizedName = name?.trim() ?? '';
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: normalizedName.length > 0 ? { name: normalizedName, full_name: normalizedName } : undefined,
            emailRedirectTo: getSupabaseRedirectUrl()
          }
        });

        if (error != null) {
          return createErrorResult(error, 'sign_up');
        }

        if (data.session != null) {
          applySession(buildAuthenticatedSession(mapSupabaseSessionToAuthProfile(data.session)));
          return { status: 'success' };
        }

        return {
          status: 'info',
          message: getRuntimeStrings().auth.createAccount.confirmEmailNotice(normalizedEmail)
        };
      },
      signInWithGoogle: async () => {
        if (!isSupabaseConfigured || supabase == null) {
          return createConfigError();
        }

        const redirectTo = getSupabaseRedirectUrl();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: Platform.OS !== 'web'
          }
        });

        if (error != null) {
          return createErrorResult(error, 'google');
        }

        if (Platform.OS === 'web') {
          return {
            status: 'redirecting',
            message: getRuntimeStrings().auth.landing.googleRedirecting
          };
        }

        if (data.url == null) {
          return {
            status: 'error',
            message: getRuntimeStrings().auth.landing.googleNotAvailable
          };
        }

        const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        if (browserResult.type !== 'success' || browserResult.url == null) {
          return {
            status: 'info',
            message: getRuntimeStrings().auth.landing.googleCancelled
          };
        }

        const hashFragment = browserResult.url.split('#')[1] ?? '';
        const fragmentParams = new URLSearchParams(hashFragment);
        const accessToken = fragmentParams.get('access_token');
        const refreshToken = fragmentParams.get('refresh_token');

        if (accessToken == null || refreshToken == null) {
          return {
            status: 'error',
            message: getRuntimeStrings().auth.landing.googleCallbackFailed
          };
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError != null) {
          return createErrorResult(sessionError, 'google');
        }

        if (sessionData.session != null) {
          applySession(buildAuthenticatedSession(mapSupabaseSessionToAuthProfile(sessionData.session)));
        }

        return { status: 'success' };
      },
      resetPassword: async (email) => {
        if (!isSupabaseConfigured || supabase == null) {
          return {
            status: 'error',
            message: getRuntimeStrings().auth.common.configMissing
          };
        }

        const normalizedEmail = normalizeEmail(email);
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: getSupabaseRedirectUrl()
        });

        if (error != null) {
          return createResetError(error);
        }

        return {
          status: 'success',
          email: normalizedEmail,
          message: getRuntimeStrings().auth.forgotPassword.confirmationMessage(normalizedEmail)
        };
      }
    }),
    [applySession, pendingAuthEntry, session]
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
