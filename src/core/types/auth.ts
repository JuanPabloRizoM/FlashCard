export const AUTH_SESSION_STATUSES = ['signed_out', 'guest', 'authenticated'] as const;
export const AUTH_PROVIDERS = ['guest', 'email', 'google'] as const;

export type AuthSessionStatus = (typeof AUTH_SESSION_STATUSES)[number];
export type AuthProviderId = (typeof AUTH_PROVIDERS)[number];

export type AuthSession = {
  status: AuthSessionStatus;
  provider: AuthProviderId | null;
  email: string | null;
  displayName: string | null;
  updatedAt: string | null;
};

export type AuthActionResult =
  | {
      status: 'success';
      message?: string;
    }
  | {
      status: 'info';
      message: string;
    }
  | {
      status: 'redirecting';
      message?: string;
    }
  | {
      status: 'error';
      message: string;
    };

export type AuthResetPasswordResult =
  | {
      status: 'success';
      email: string;
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };

export type AuthProfile = {
  provider: AuthProviderId;
  email: string | null;
  displayName: string | null;
};

export const DEFAULT_AUTH_SESSION: AuthSession = {
  status: 'signed_out',
  provider: null,
  email: null,
  displayName: null,
  updatedAt: null
};

export const AUTH_SESSION_STORAGE_KEY = 'flashcards_auth_session_v1';

function isAuthSessionStatus(value: unknown): value is AuthSessionStatus {
  return typeof value === 'string' && AUTH_SESSION_STATUSES.includes(value as AuthSessionStatus);
}

function isAuthProviderId(value: unknown): value is AuthProviderId {
  return typeof value === 'string' && AUTH_PROVIDERS.includes(value as AuthProviderId);
}

function normalizeNullableText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeAuthSession(value: unknown): AuthSession {
  if (value == null || typeof value !== 'object') {
    return DEFAULT_AUTH_SESSION;
  }

  const candidateSession = value as Partial<AuthSession>;

  return {
    status: isAuthSessionStatus(candidateSession.status)
      ? candidateSession.status
      : DEFAULT_AUTH_SESSION.status,
    provider: isAuthProviderId(candidateSession.provider) ? candidateSession.provider : null,
    email: normalizeNullableText(candidateSession.email),
    displayName: normalizeNullableText(candidateSession.displayName),
    updatedAt: normalizeNullableText(candidateSession.updatedAt)
  };
}
