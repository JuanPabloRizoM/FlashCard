import AsyncStorage from 'expo-sqlite/kv-store';

import {
  AUTH_SESSION_STORAGE_KEY,
  DEFAULT_AUTH_SESSION,
  normalizeAuthSession,
  type AuthSession
} from '../core/types/auth';

export async function loadAuthSession(): Promise<AuthSession> {
  try {
    const storedValue = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);

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
  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(normalizedSession));
}
