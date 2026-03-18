# Decks Feature

## Purpose

The Decks feature introduces the first persisted user-owned entity in the Flashcards App.

It currently supports:
- creating a deck
- listing saved decks
- loading decks from local SQLite storage on app startup

---

## Data Model

### Deck
- `id`: SQLite primary key
- `name`: required deck name
- `description`: optional deck description
- `type`: required deck type
- `color`: optional accent color
- `createdAt`: persistence timestamp
- `updatedAt`: persistence timestamp for future edits

---

## Storage

Deck data is stored in the `decks` table.

Current schema:
- integer primary key `id`
- case-insensitive unique `name`
- optional `description`
- required `type`
- optional `color`
- `created_at` timestamp
- `updated_at` timestamp

The table is created through the storage migration layer, not from UI code.

For Expo web, `metro.config.js` enables the SQLite wasm worker and sets the development headers needed by `expo-sqlite`.

The V2 migration safely rebuilds the original V1 `decks` table so existing rows gain:
- `description = null`
- `type = general`
- `color = null`
- `updated_at = created_at`

---

## Repository Contract

Current repository methods:
- `listDecks()`
- `createDeck({ name, description?, type?, color? })`

The repository is responsible for:
- opening the shared SQLite database connection
- enforcing parameterized queries
- mapping SQLite rows to Deck models
- ordering deck lists by `created_at DESC, id DESC`

---

## UI Flow

The Decks screen:
- loads decks on mount
- shows loading, empty, and error states
- validates deck input before save
- creates a deck through the repository-backed feature flow
- defaults new decks to the `general` type when optional fields are omitted
- updates the visible list immediately after a successful save

---

## Validation Rules

- names are trimmed
- repeated whitespace is collapsed
- empty names are rejected
- names longer than 80 characters are rejected
- descriptions longer than 240 characters are rejected
- types must be one of `general`, `language`, `medicine`, `programming`, or `science`
- colors must use `#RRGGBB` format when provided
- duplicate names are blocked case-insensitively

---

## Current Limitations

Not included yet:
- deck editing
- deck deletion
- deck filtering
- deck color selection in the create flow
- card-to-deck creation flow
