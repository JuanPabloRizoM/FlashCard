# Cards Feature

## Purpose

The Cards feature introduces the core study entity that belongs to a deck.

It currently supports:
- creating a card inside a selected deck from the Cards tab workspace
- editing a card inside a selected deck from the Cards tab workspace
- importing multiple cards from one unified Import Hub with preview-before-save
- exporting a full deck as structured text from deck detail
- importing a full deck from the same Import Hub with preview-before-save
- listing cards for a single deck
- loading persisted cards from SQLite

---

## Data Model

### Card
- `id`: SQLite primary key
- `deckId`: required parent deck reference
- `front`: required prompt/question side
- `back`: required answer side
- `description`: optional supporting field
- `application`: optional field
- `imageUri`: optional field
- `createdAt`: persistence timestamp
- `updatedAt`: persistence timestamp

Cards use a universal flashcard model with required `front` and `back` fields plus optional supporting details.

---

## Storage

Card data is stored in the `cards` table.

Current schema:
- integer primary key `id`
- required foreign key `deck_id`
- required `front`
- required `back`
- optional `description`
- optional `application`
- optional `image_uri`
- `created_at` timestamp
- `updated_at` timestamp

The `cards` table uses a foreign key to `decks(id)` and cascades on deck deletion.

---

## Repository Contract

Current repository methods:
- `listCardsByDeck(deckId)`
- `createCard({ deckId, front, back, description?, application?, imageUri? })`
- `createCardsBatch([...])`
- `updateCard({ id, deckId, front, back, description?, application?, imageUri? })`
- `createDeckWithImportedCards({ name, ...deckFields }, cards[])`

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
- the user can create a card with one unified editor using required `front` and `back` plus optional supporting fields
- the create-card editor keeps all fields in one continuous authoring surface and keeps the current deck context visible above the form
- the optional image area supports upload from device, paste from clipboard, image preview, replace/remove, and manual image URL entry
- the user can edit an existing card without leaving the workspace
- the user can switch the workspace between `Create` and `Import`
- the Import Hub now uses one guided flow with three primary entry paths: `NotebookLM`, `Quick cards`, and `File`
- the user sees only one primary path choice, one source-specific input area, then one shared preview/confirm step instead of multiple stacked import modes
- `Structured deck text` remains available as a quiet advanced path for creating a full deck without competing with the main guided choices
- the user can paste structured multiline text and preview valid/invalid rows before importing
- the user can paste a full exported deck into the same Import Hub through the structured-deck/new-deck path, preview the parsed deck plus card lines, and confirm deck import
- the editor keeps optional details secondary instead of splitting creation into separate modes
- deck overview remains a lightweight summary with a clear entry point into the Cards workspace
- empty and loading states render safely when a deck has no cards
- the Import Hub keeps one shared preview, validation, and confirm pattern across supported sources

Import v1 format:
- one card per line
- fields separated by `|`
- supported:
  - `front | back`
  - `front | back | description`
  - `front | back | description | application`
- empty trailing optional fields are allowed if the line still matches the supported field order
- invalid rows are previewed with per-line reasons and are not written until the user confirms import

Deck Export/Import v1 format:
- first non-empty line must be `# Deck: Deck name`
- following lines reuse the Card Import v1 card format
- deck import creates a new deck only
- duplicate deck names are rejected before write
- valid card lines are inserted into the new deck in the same confirmed import operation
- invalid card lines stay visible in preview and are skipped until the user fixes or removes them

Import Hub v1:
- primary visible paths:
  - `NotebookLM`
  - `Quick cards`
  - `File`
- `File` is the real CSV path and reuses the same preview and confirm flow
- `Structured deck text` remains as a lower-noise advanced route
- the shared import experience always follows:
  - choose path
  - provide input
  - review preview
  - confirm import

---

## Validation Rules

- `deckId` must be a positive integer
- `front` is required
- `back` is required
- `front` must be 120 characters or fewer
- `back` must be 240 characters or fewer
- optional `description` and `application` must be 600 characters or fewer
- optional `imageUri` must be 2048 characters or fewer

---

## Current Limitations

Not included yet:
- card deletion
- deck export file download
- OCR or image import
- advanced card search/filtering
- prompt mode generation
- study behavior
