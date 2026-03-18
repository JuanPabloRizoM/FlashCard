import type { SQLiteDatabase } from 'expo-sqlite';

import {
  DEFAULT_DECK_TYPE,
  DECK_TYPES,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_NAME_LENGTH
} from '../core/types/deck';

const DATABASE_VERSION = 2;
const DECK_COLOR_GLOB = '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]';
const DECK_TYPE_SQL = DECK_TYPES.map((type) => `'${type}'`).join(', ');

function getCreateDecksTableSql(tableName: string): string {
  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL COLLATE NOCASE UNIQUE
        CHECK(length(trim(name)) > 0 AND length(name) <= ${MAX_DECK_NAME_LENGTH}),
      description TEXT
        CHECK(description IS NULL OR length(description) <= ${MAX_DECK_DESCRIPTION_LENGTH}),
      type TEXT NOT NULL DEFAULT '${DEFAULT_DECK_TYPE}'
        CHECK(type IN (${DECK_TYPE_SQL})),
      color TEXT
        CHECK(color IS NULL OR color GLOB '${DECK_COLOR_GLOB}'),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `;
}

function getCreateDecksCreatedAtIndexSql(tableName: string): string {
  return `CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON ${tableName} (created_at DESC, id DESC);`;
}

function getLegacyTimestampToIsoSql(columnName: string): string {
  return `
    CASE
      WHEN ${columnName} IS NULL OR trim(${columnName}) = '' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHEN length(${columnName}) = 19 THEN replace(${columnName}, ' ', 'T') || '.000Z'
      ELSE ${columnName}
    END
  `;
}

async function migrateDecksV1ToV2(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      ${getCreateDecksTableSql('decks_v2')}
      INSERT INTO decks_v2 (id, name, description, type, color, created_at, updated_at)
      SELECT
        id,
        name,
        NULL,
        '${DEFAULT_DECK_TYPE}',
        NULL,
        ${getLegacyTimestampToIsoSql('created_at')},
        ${getLegacyTimestampToIsoSql('created_at')}
      FROM decks;
      DROP TABLE decks;
      ALTER TABLE decks_v2 RENAME TO decks;
      ${getCreateDecksCreatedAtIndexSql('decks')}
    `);
  });
}

export async function migrateDatabaseIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      ${getCreateDecksTableSql('decks')}
      ${getCreateDecksCreatedAtIndexSql('decks')}
    `);
  }

  if (currentVersion === 1) {
    await migrateDecksV1ToV2(db);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
