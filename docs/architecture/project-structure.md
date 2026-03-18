# Project Structure

## Root
- `App.tsx`
- `index.ts`
- `app.json`
- `metro.config.js`
- `package.json`
- `tsconfig.json`

---

## /src

### bootstrap/
- `AppRoot.tsx` (base app shell that mounts status bar + navigator)

---

### navigation/
- `AppNavigator.tsx` (root navigation container + bottom tabs)
- `types.ts` (typed route contracts)

---

### core/
- `types/`
- `models/`
- `constants/`
- `models/Deck.ts`
- `types/deck.ts`

---

### engine/
- (reserved for Study Engine modules)

---

### techniques/
- (reserved for technique implementations)

---

### storage/
- `database.ts`
- `migrations.ts`
- `repositories/deckRepository.ts`

---

### features/
- decks/
- cards/
- study/
- `decks/useDecks.ts`

---

### ui/
- `components/layout/ScreenContainer.tsx`
- `screens/DecksScreen.tsx`
- `screens/CardsScreen.tsx`
- `screens/StudyScreen.tsx`
- `screens/SettingsScreen.tsx`
- `theme/colors.ts`
- `theme/spacing.ts`
- `theme/typography.ts`
- `screens/DecksScreen.tsx` owns rendering only; deck persistence flows through feature + repository layers

---

### services/
- analytics/
- validation/
- security/
- `validation/deckValidation.ts`

---

## /docs

### adr/
- `0001-deck-id-v1.md`

---

## Rules

- Each folder has a clear responsibility
- No cross-layer leaks
- No circular dependencies
- UI layer must remain free of study/business/storage logic
- Navigation contracts must be typed and validated through route params

---

## Naming Conventions

- camelCase for variables
- PascalCase for types and components
- kebab-case for files (optional consistency)

---

## File Size Rule

If a file exceeds ~300 lines:
→ must be split
