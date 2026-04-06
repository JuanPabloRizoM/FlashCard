import { getWebStorageItem, removeWebStorageItem, setWebStorageItem } from './webStorage';

export const supabaseAuthStorage = {
  async getItem(key: string) {
    return getWebStorageItem(key);
  },
  async setItem(key: string, value: string) {
    setWebStorageItem(key, value);
  },
  async removeItem(key: string) {
    removeWebStorageItem(key);
  }
};
