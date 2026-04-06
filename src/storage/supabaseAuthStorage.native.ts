import AsyncStorage from 'expo-sqlite/kv-store';

export const supabaseAuthStorage = {
  getItem(key: string) {
    return AsyncStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  },
  removeItem(key: string) {
    return AsyncStorage.removeItem(key);
  }
};
