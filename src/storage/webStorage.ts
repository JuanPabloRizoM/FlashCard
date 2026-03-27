export type WebStorageMode = 'localStorage' | 'memory';

const memoryStorage = new Map<string, string>();
const STORAGE_TEST_KEY = '__flashcards_storage_test__';

function getBrowserStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  try {
    const storage = globalThis.localStorage;
    storage.setItem(STORAGE_TEST_KEY, '1');
    storage.removeItem(STORAGE_TEST_KEY);
    return storage;
  } catch {
    return null;
  }
}

export function getWebStorageMode(): WebStorageMode {
  return getBrowserStorage() != null ? 'localStorage' : 'memory';
}

export function getWebStorageItem(key: string): string | null {
  const browserStorage = getBrowserStorage();

  if (browserStorage != null) {
    try {
      return browserStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  return memoryStorage.get(key) ?? null;
}

export function setWebStorageItem(key: string, value: string): void {
  const browserStorage = getBrowserStorage();

  if (browserStorage != null) {
    try {
      browserStorage.setItem(key, value);
      return;
    } catch {
      memoryStorage.set(key, value);
      return;
    }
  }

  memoryStorage.set(key, value);
}

export function removeWebStorageItem(key: string): void {
  const browserStorage = getBrowserStorage();

  if (browserStorage != null) {
    try {
      browserStorage.removeItem(key);
      return;
    } catch {
      memoryStorage.delete(key);
      return;
    }
  }

  memoryStorage.delete(key);
}
