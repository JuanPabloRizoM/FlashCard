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
- `models/Card.ts`
- `models/StudySession.ts`
- `models/StudyProgress.ts`
- `types/deck.ts`
- `types/card.ts`
- `types/study.ts`
- `types/studyProgress.ts`
- `types/settings.ts`

---

### engine/
- `StudyEngine.ts`
- `PromptModeResolver.ts`
- `TechniqueRegistry.ts`
- `types.ts`

---

### techniques/
- `BasicReviewTechnique.ts`
- `ReverseReviewTechnique.ts`
- `MixedRecallTechnique.ts`

---

### storage/
- `database.ts`
- `appSettingsStorage.ts`
- `migrations.ts`
- `repositories/deckRepository.ts`
- `repositories/cardRepository.ts`
- `repositories/studyProgressRepository.ts`

---

### features/
- decks/
- cards/
- settings/
- study/
- `decks/useDecks.ts`
- `decks/useDeckImport.ts`
- `decks/deckPortability.ts`
- `cards/useDeckCards.ts`
- `cards/useCardImport.ts`
- `cards/cardImport.ts`
- `settings/AppSettingsProvider.tsx`
- `study/useStudySession.ts`
- `study/studyInsights.ts`
- `study/cardStudyPreview.ts`
- `study/sessionConfiguration.ts`
- `study/sessionSummary.ts`

---

### ui/
- `components/layout/ScreenContainer.tsx`
- `components/deck/DeckReadinessBadge.tsx`
- `components/deck/DeckStudyInsightCard.tsx`
- `components/deck/DeckListItem.tsx`
- `components/deck/DeckExportPanel.tsx`
- `components/deck/DeckImportPanel.tsx`
- `components/card/CardStudyFeedback.tsx`
- `components/card/DeckCardListItem.tsx`
- `components/card/CardEditorPanel.tsx`
- `components/card/CardEditorStudyPreview.tsx`
- `components/card/CardImportPanel.tsx`
- `components/card/CardWorkspaceFeedbackState.tsx`
- `components/card/CardWorkspaceDeckSelector.tsx`
- `components/card/CardWorkspaceCardList.tsx`
- `screens/DecksScreen.tsx`
- `screens/DeckDetailScreen.tsx`
- `screens/CardsScreen.tsx`
- `screens/StudyScreen.tsx`
- `screens/SettingsScreen.tsx`
- `components/study/StudySessionCard.tsx`
- `components/study/StudySessionProgress.tsx`
- `components/study/StudySessionAnswerActions.tsx`
- `components/study/StudySessionBanner.tsx`
- `components/study/StudySessionSetupPanel.tsx`
- `components/study/StudySessionSummary.tsx`
- `theme/colors.ts`
- `theme/spacing.ts`
- `theme/typography.ts`
- `screens/DecksScreen.tsx` owns rendering only; deck persistence flows through feature + repository layers
- `screens/DeckDetailScreen.tsx` is a deck overview and routing entry point into the Cards workspace
- `screens/DeckDetailScreen.tsx` may expose reviewed deck-export UI, but export formatting must stay in the deck feature layer
- `screens/CardsScreen.tsx` is the primary card creation/editing workspace and may accept route params for deck handoff
- `screens/CardsScreen.tsx` may host reviewed bulk-import workflows, but parsing and validation must stay in the card feature layer
- `screens/CardsScreen.tsx` may host deck-import UI, but deck parsing and transactional write orchestration must stay in the deck feature + repository layers
- `screens/StudyScreen.tsx` renders engine output and delegates all study logic to the feature + engine layers
- `screens/SettingsScreen.tsx` owns app-level Study defaults and honest product information only; it must not expose fake toggles

---

### services/
- analytics/
- validation/
- security/
- `validation/deckValidation.ts`
- `validation/cardValidation.ts`
- `validation/studyProgressValidation.ts`

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
- Settings may control app-level defaults, but those defaults must be consumed through feature layers rather than screens reaching into engine internals
- Lightweight settings persistence belongs to the settings/storage boundary, not to Study screens or engine files
- Deck export/import formatting belongs to the deck/card feature layers, while confirmed writes still belong to repositories
- Study progress persistence belongs to repository + feature layers, not screens
- Study session setup, focused-mode filtering, and session-size selection belong to the feature layer, not the engine or UI
- Adaptive study ordering belongs to the engine/session layer and must consume persisted progress through feature-layer inputs
- Session shaping belongs to the engine/session layer and must not be implemented inside StudyScreen
- The `StudyEngine` may accept a prebuilt prompt queue as input, but it must not own Study mode selection rules
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
