import {
  AUTH_SESSION_STORAGE_KEY,
  DEFAULT_AUTH_SESSION,
  normalizeAuthSession,
  type AuthSession
} from '../core/types/auth';
import { getWebStorageItem, setWebStorageItem } from './webStorage';

export async function loadAuthSession(): Promise<AuthSession> {
  try {
    const storedValue = getWebStorageItem(AUTH_SESSION_STORAGE_KEY);

    if (storedValue == null) {
      return DEFAULT_AUTH_SESSION;
    }

    return normalizeAuthSession(JSON.parse(storedValue));
  } catch {
    return DEFAULT_AUTH_SESSION;
  }
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  const normalizedSession = normalizeAuthSession(session);
  setWebStorageItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(normalizedSession));
}
