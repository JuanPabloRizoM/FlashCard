import { initializeWebAppStore } from './webAppStore';

export const DATABASE_NAME = 'flashcards-web-fallback';

export async function getDatabase(): Promise<never> {
  throw new Error('SQLite database access is disabled on web. Use the web storage repositories instead.');
}

export async function initializeDatabase(): Promise<void> {
  await initializeWebAppStore();
}
