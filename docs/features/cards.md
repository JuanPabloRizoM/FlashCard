# Cards Feature

## Purpose

The Cards feature introduces the core study entity that belongs to a deck.

It currently supports:
- creating a card inside a selected deck from the Cards tab workspace
- editing a card inside a selected deck from the Cards tab workspace
- importing multiple cards from pasted text with preview-before-save
- listing cards for a single deck
- loading persisted cards from SQLite

---

## Data Model

### Card
- `id`: SQLite primary key
- `deckId`: required parent deck reference
- `title`: required card title
- `translation`: optional field
- `definition`: optional field
- `example`: optional field
- `application`: optional field
- `imageUri`: optional field
- `createdAt`: persistence timestamp
- `updatedAt`: persistence timestamp

Cards are structured data, not a simple front/back pair.

---

## Storage

Card data is stored in the `cards` table.

Current schema:
- integer primary key `id`
- required foreign key `deck_id`
- required `title`
- optional `translation`
- optional `definition`
- optional `example`
- optional `application`
- optional `image_uri`
- `created_at` timestamp
- `updated_at` timestamp

The `cards` table uses a foreign key to `decks(id)` and cascades on deck deletion.

---

## Repository Contract

Current repository methods:
- `listCardsByDeck(deckId)`
- `createCard({ deckId, title, translation?, definition?, example?, application?, imageUri? })`
- `createCardsBatch([...])`
- `updateCard({ id, deckId, title, translation?, definition?, example?, application?, imageUri? })`

The repository is responsible for:
- validating the target `deckId`
- preventing orphan card creation
- enforcing parameterized SQLite queries
- batching confirmed bulk imports inside a transaction
- mapping card rows to the Card model
- ordering cards by `created_at DESC, id DESC`

---

## UI Flow

The Cards tab is now the primary card workspace:
- the user opens the `Cards` tab directly or enters it from a deck overview
- the workspace selects a deck and loads cards for that deck only
- the user can create a card with a required title and optional supporting fields
- the user can edit an existing card without leaving the workspace
- the user can paste structured multiline text and preview valid/invalid rows before importing
- the same study-guidance preview updates in real time for both create and edit flows
- deck detail remains a read-only overview with a clear entry point into the Cards workspace
- empty and loading states render safely when a deck has no cards

Import v1 format:
- one card per line
- fields separated by `|`
- supported:
  - `title | translation`
  - `title | translation | definition`
  - `title | translation | definition | application`
- empty trailing optional fields are allowed if the line still matches the supported field order
- invalid rows are previewed with per-line reasons and are not written until the user confirms import

---

## Validation Rules

- `deckId` must be a positive integer
- `title` is required
- `title` must be 120 characters or fewer
- optional `translation` must be 240 characters or fewer
- optional `definition`, `example`, and `application` must be 600 characters or fewer
- optional `imageUri` must be 2048 characters or fewer

---

## Current Limitations

Not included yet:
- card deletion
- file-picker import
- OCR or image import
- advanced card search/filtering
- prompt mode generation
- study behavior
