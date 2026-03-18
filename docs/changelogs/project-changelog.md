# Project Changelog

## Format

[DATE]
- Change:
- Reason:
- Files affected:
- Risk:
- Notes:

---

## Example

[2026-03-18]
- Change: Added StudyEngine base structure
- Reason: Core system required for study flow
- Files: StudyEngine.ts, PromptModeResolver.ts
- Risk: Low
- Notes: Initial implementation

---

[2026-03-18]
- Change: Initialized Expo + React Native TypeScript app scaffold with layered `src/` structure, typed bottom-tab navigation shell, and placeholder MVP screens.
- Reason: Establish a stable foundation before implementing decks, cards, study logic, and storage features.
- Files: App.tsx, index.ts, app.json, package.json, tsconfig.json, src/bootstrap/AppRoot.tsx, src/navigation/AppNavigator.tsx, src/navigation/types.ts, src/ui/components/layout/ScreenContainer.tsx, src/ui/screens/*, src/ui/theme/*, docs/architecture/project-structure.md
- Risk: Low
- Notes: Web runtime dependencies were added for Expo startup validation; business logic remains out of UI and feature placeholders are isolated.

---

[2026-03-18]
- Change: Added the initial Deck domain foundation with Deck model, SQLite migration, deck repository, and create/list deck flow in the Decks screen.
- Reason: Deck persistence is required before cards and study sessions can be attached to user-owned data.
- Files: src/core/models/Deck.ts, src/storage/database.ts, src/storage/migrations.ts, src/storage/repositories/deckRepository.ts, src/features/decks/useDecks.ts, src/ui/screens/DecksScreen.tsx, src/bootstrap/AppRoot.tsx, src/ui/theme/colors.ts, metro.config.js, docs/architecture/project-structure.md, docs/features/decks.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: Deck names are normalized, empty names are blocked, and duplicate names are rejected case-insensitively through validation plus SQLite constraints.

---

[2026-03-18]
- Change: Refined Deck V1 into the intended domain contract with optional description/color, required type, updated timestamps, separate validation helpers, and a safe deck-table V2 migration.
- Reason: The first persisted entity needed to be structurally correct before cards and later domain features build on top of it.
- Files: src/core/models/Deck.ts, src/core/types/deck.ts, src/services/validation/deckValidation.ts, src/storage/migrations.ts, src/storage/repositories/deckRepository.ts, src/features/decks/useDecks.ts, src/ui/screens/DecksScreen.tsx, docs/features/decks.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md, docs/adr/0001-deck-id-v1.md
- Risk: Medium
- Notes: Existing V1 deck rows are migrated forward with safe defaults and deck ordering now uses `created_at` rather than numeric IDs.
