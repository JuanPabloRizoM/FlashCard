import type { SQLiteDatabase } from 'expo-sqlite';

import {
  DEFAULT_DECK_TYPE,
  DECK_TYPES,
  MAX_DECK_DESCRIPTION_LENGTH,
  MAX_DECK_NAME_LENGTH
} from '../core/types/deck';
import { PROMPT_MODES } from '../core/types/study';
import {
  MAX_CARD_IMAGE_URI_LENGTH,
  MAX_CARD_LONG_TEXT_LENGTH,
  MAX_CARD_SHORT_TEXT_LENGTH,
  MAX_CARD_TITLE_LENGTH
} from '../core/types/card';
import { STUDY_PROGRESS_RESULTS } from '../core/types/studyProgress';

const DATABASE_VERSION = 5;
const DECK_COLOR_GLOB = '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]';
const DECK_TYPE_SQL = DECK_TYPES.map((type) => `'${type}'`).join(', ');
const PROMPT_MODE_SQL = PROMPT_MODES.map((mode) => `'${mode}'`).join(', ');
const STUDY_PROGRESS_RESULT_SQL = STUDY_PROGRESS_RESULTS.map((result) => `'${result}'`).join(', ');

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

function getCreateCardsTableSql(): string {
  return `
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY NOT NULL,
      deck_id INTEGER NOT NULL,
      front TEXT NOT NULL
        CHECK(length(trim(front)) > 0 AND length(front) <= ${MAX_CARD_TITLE_LENGTH}),
      back TEXT NOT NULL
        CHECK(length(trim(back)) > 0 AND length(back) <= ${MAX_CARD_SHORT_TEXT_LENGTH}),
      description TEXT
        CHECK(description IS NULL OR length(description) <= ${MAX_CARD_LONG_TEXT_LENGTH}),
      application TEXT
        CHECK(application IS NULL OR length(application) <= ${MAX_CARD_LONG_TEXT_LENGTH}),
      image_uri TEXT
        CHECK(image_uri IS NULL OR length(image_uri) <= ${MAX_CARD_IMAGE_URI_LENGTH}),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
    );
  `;
}

function getCreateCardsDeckCreatedAtIndexSql(): string {
  return 'CREATE INDEX IF NOT EXISTS idx_cards_deck_created_at ON cards (deck_id, created_at DESC, id DESC);';
}

function getCreateStudyProgressTableSql(): string {
  return `
    CREATE TABLE IF NOT EXISTS study_progress (
      id INTEGER PRIMARY KEY NOT NULL,
      card_id INTEGER NOT NULL,
      prompt_mode TEXT NOT NULL
        CHECK(prompt_mode IN (${PROMPT_MODE_SQL})),
      times_seen INTEGER NOT NULL DEFAULT 0
        CHECK(times_seen >= 0),
      correct_count INTEGER NOT NULL DEFAULT 0
        CHECK(correct_count >= 0),
      incorrect_count INTEGER NOT NULL DEFAULT 0
        CHECK(incorrect_count >= 0),
      current_streak INTEGER NOT NULL DEFAULT 0
        CHECK(current_streak >= 0),
      last_result TEXT
        CHECK(last_result IS NULL OR last_result IN (${STUDY_PROGRESS_RESULT_SQL})),
      last_studied_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );
  `;
}

function getCreateStudyProgressCardPromptIndexSql(): string {
  return 'CREATE UNIQUE INDEX IF NOT EXISTS idx_study_progress_card_prompt ON study_progress (card_id, prompt_mode);';
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

async function migrateCardsV4ToV5(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.execAsync('PRAGMA foreign_keys = OFF;');
    await db.execAsync(`
      ${getCreateCardsTableSql().replace('CREATE TABLE IF NOT EXISTS cards', 'CREATE TABLE cards_v5')}
      INSERT INTO cards_v5 (
        id,
        deck_id,
        front,
        back,
        description,
        application,
        image_uri,
        created_at,
        updated_at
      )
      SELECT
        id,
        deck_id,
        title,
        COALESCE(
          NULLIF(trim(translation), ''),
          NULLIF(trim(definition), ''),
          NULLIF(trim(application), ''),
          title
        ),
        definition,
        application,
        image_uri,
        created_at,
        updated_at
      FROM cards;
      DROP TABLE cards;
      ALTER TABLE cards_v5 RENAME TO cards;
      ${getCreateCardsDeckCreatedAtIndexSql()}
      PRAGMA foreign_keys = ON;
    `);
  });
}

export async function migrateDatabaseIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      ${getCreateDecksTableSql('decks')}
      ${getCreateDecksCreatedAtIndexSql('decks')}
      ${getCreateCardsTableSql()}
      ${getCreateCardsDeckCreatedAtIndexSql()}
      ${getCreateStudyProgressTableSql()}
      ${getCreateStudyProgressCardPromptIndexSql()}
    `);
    currentVersion = DATABASE_VERSION;
  }

  if (currentVersion === 1) {
    await migrateDecksV1ToV2(db);
    currentVersion = 2;
  }

  if (currentVersion === 2) {
    await db.execAsync(`
      ${getCreateCardsTableSql()}
      ${getCreateCardsDeckCreatedAtIndexSql()}
    `);
    currentVersion = 3;
  }

  if (currentVersion === 3) {
    await db.execAsync(`
      ${getCreateStudyProgressTableSql()}
      ${getCreateStudyProgressCardPromptIndexSql()}
    `);
    currentVersion = 4;
  }

  if (currentVersion === 4) {
    await migrateCardsV4ToV5(db);
    currentVersion = 5;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
