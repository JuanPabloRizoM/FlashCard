# Project Changelog

## Format

[DATE]
- Change:
- Reason:
- Files affected:
- Risk:
- Notes:

---

[2026-04-07]
- Change: Polished the Decks experience with a stronger collection overview, more intentional deck cards, and a lighter premium deck summary modal with a Study-first action hierarchy.
- Reason: Deck browsing and inspection were functionally correct, but the visual hierarchy still felt flatter and less intentional than the rest of the product.
- Files: src/ui/screens/DecksScreen.tsx, src/ui/components/deck/DeckCollectionOverview.tsx, src/ui/components/deck/DeckListItem.tsx, src/ui/components/deck/DeckSummaryModal.tsx, src/ui/components/deck/DeckSummaryPieces.tsx, src/ui/strings/translations.ts
- Risk: Low
- Notes: The modal remains the only deck-inspection path from Decks, and both `Study this deck` and `Open cards` continue to pass the selected deck context into their destination screens.

[2026-04-06]
- Change: Replaced the split card-import and deck-import panels in Cards with one Import Hub that shares one source selector, one preview-first flow, and one confirm-before-write import surface.
- Reason: Import was already useful, but it was structurally fragmented and would have duplicated UX and validation logic as more sources were added.
- Files: src/ui/screens/CardsScreen.tsx, src/ui/components/card/CardWorkspaceModeSwitch.tsx, src/ui/components/card/CardWorkspacePanel.tsx, src/ui/components/card/CardWorkspaceNoDecks.tsx, src/ui/components/card/ImportHubPanel.tsx, src/ui/components/card/TextImportWorkspace.tsx, src/ui/strings/translations.ts, docs/features/cards.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Import Hub v1 exposes `Paste text`, `Import deck`, and an honest `File` placeholder only; existing card/deck parsing and repository write behavior stay intact.

---

[2026-03-30]
- Change: Expanded Settings with real app language switching (`Español` default, `English` optional), added honest Account Settings and Billing placeholder sections, and routed app-wide UI copy through a lightweight centralized strings layer.
- Reason: Settings needed one more real product-level control beyond appearance, while future account/billing space needed to be present without pretending those systems already exist.
- Files: src/core/types/settings.ts, src/features/settings/AppSettingsProvider.tsx, src/ui/strings/index.ts, src/ui/strings/translations.ts, src/ui/screens/SettingsScreen.tsx, src/navigation/AppNavigator.tsx, src/ui/screens/DecksScreen.tsx, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/screens/StudyScreen.tsx, src/ui/components/card/*, src/ui/components/deck/*, src/ui/components/study/*, src/features/decks/useDecks.ts, src/features/cards/useDeckCards.ts, src/features/cards/useCardImport.ts, src/features/decks/useDeckImport.ts, src/features/study/useStudySession.ts, src/services/validation/*.ts, docs/architecture/project-structure.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: Language selection persists through the existing settings storage path, defaults safely to Spanish, and Account Settings/Billing remain explicitly non-interactive placeholders.

---

## Example

[2026-03-18]
- Change: Added StudyEngine base structure
- Reason: Core system required for study flow
- Files: StudyEngine.ts, PromptModeResolver.ts
- Risk: Low
- Notes: Initial implementation

---

[2026-03-27]
- Change: Flattened the Cards editor into one continuous form block and removed the last visible Basic/Optional section split and collapse behavior.
- Reason: Card authoring should read like one natural content form instead of stacked mini-modules.
- Files: src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardEditorBasicSection.tsx, src/ui/components/card/CardEditorDetailsSection.tsx, docs/features/cards.md
- Risk: Low
- Notes: Front and Back remain required, optional fields stay visible in the same form, and create/edit behavior is unchanged.

---

[2026-03-27]
- Change: Simplified Cards authoring into one unified editor, removed the remaining Card support block from the Cards workspace, and kept optional details grouped as secondary fields.
- Reason: Cards should feel like one focused content editor instead of a split create flow with study-oriented support UI.
- Files: src/ui/screens/CardsScreen.tsx, src/features/cards/useDeckCards.ts, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardEditorBasicSection.tsx, src/ui/components/card/CardEditorDetailsSection.tsx, src/ui/components/card/CardWorkspacePanel.tsx, docs/features/cards.md
- Risk: Low
- Notes: Create/edit behavior is unchanged, import modes are unchanged, and the removed support UI was not moved elsewhere in this pass.

---

[2026-03-27]
- Change: Refactored the real card model from `title/translation/definition/example` to `front/back/description`, migrated SQLite card storage safely, and aligned authoring/import/export flows to the new universal contract.
- Reason: FlashCards should use a general-purpose flashcard model instead of a language-specific translation model.
- Files: src/core/models/Card.ts, src/core/types/card.ts, src/services/validation/cardValidation.ts, src/storage/migrations.ts, src/storage/repositories/cardRepository.ts, src/storage/repositories/webCardRepository.ts, src/storage/webAppStore.ts, src/storage/repositories/deckRepository.ts, src/storage/repositories/webDeckRepository.ts, src/features/cards/useDeckCards.ts, src/features/cards/cardImport.ts, src/features/decks/deckPortability.ts, src/engine/PromptModeResolver.ts, src/features/study/cardStudyPreview.ts, src/core/types/study.ts, src/ui/components/card/*
- Risk: Medium
- Notes: Legacy cards migrate with an explicit compatibility bridge that derives `back` from existing `translation`, then `definition`, then `application`, then `title` if needed so old data remains usable under the new required front/back contract.

---

[2026-03-27]
- Change: Polished the Cards workspace for repeated use with a faster Quick Add loop, lightweight save feedback, and low-noise list filters for maintenance work.
- Reason: The card-building flow was structurally sound, but repeated entry and day-to-day list maintenance still had avoidable friction.
- Files: src/features/cards/useDeckCards.ts, src/ui/screens/CardsScreen.tsx, src/ui/components/card/CardQuickAddPanel.tsx, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardEditorBasicSection.tsx, src/ui/components/card/CardWorkspacePanel.tsx, src/ui/components/card/CardWorkspaceCardList.tsx, src/ui/components/card/CardListFilterBar.tsx, src/ui/components/card/cardListFilters.ts, src/ui/components/card/CardListStatus.tsx
- Risk: Low
- Notes: Quick Add stays active after save, edit flow stays intact, and filters are UI-only views over existing card readiness signals.

---

[2026-03-27]
- Change: Added a Quick Add path to the Cards workspace, kept the full editor available for richer cards, and tightened card-row status into a more compact workspace summary.
- Reason: Repeated card creation still had too much friction for simple cards, and the existing card list felt more like raw data than product content.
- Files: src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardQuickAddPanel.tsx, src/ui/components/card/CardEditorDetailsSection.tsx, src/ui/components/card/DeckCardListItem.tsx, src/ui/components/card/CardListStatus.tsx
- Risk: Low
- Notes: Quick Add is the default create flow, edit mode still opens the full editor, and repository/persistence behavior is unchanged.

---

[2026-03-27]
- Change: Replaced the placeholder-like bottom tab icons with purpose-built product icons and refined the Cards editor into a lighter Basic + More details flow.
- Reason: The app navigation and card workspace were still functional but visually rougher than the rest of the product.
- Files: src/navigation/AppNavigator.tsx, src/ui/components/navigation/TabBarIcon.tsx, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardEditorDetailsSection.tsx, src/ui/components/card/CardWorkspaceDeckSelector.tsx, src/ui/screens/CardsScreen.tsx
- Risk: Low
- Notes: The tab structure and card behavior remain unchanged; the update is strictly visual and interaction-level polish.

---

[2026-03-27]
- Change: Simplified the Cards workspace with a compact deck context bar, segmented workspace switch, and reduced import/create copy so only one primary workspace panel is visible at a time.
- Reason: The Cards tab had become too text-heavy and visually stacked, which made the main actions slower to scan.
- Files: src/ui/screens/CardsScreen.tsx, src/ui/components/card/CardWorkspaceModeSwitch.tsx, src/ui/components/card/CardWorkspaceDeckSelector.tsx, src/ui/components/card/CardWorkspacePanel.tsx, src/ui/components/card/CardWorkspaceNoDecks.tsx, src/ui/components/card/TextImportWorkspace.tsx, src/ui/components/card/CardImportPanel.tsx, src/ui/components/deck/DeckImportPanel.tsx
- Risk: Low
- Notes: Create Card remains the default mode; card import, deck import, deck selection, and the lower card list keep their previous behavior.

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

---

[2026-03-18]
- Change: Added the Card domain foundation with card model/types, cards table migration, card repository, and selected-deck create/list flow.
- Reason: Cards are the core study unit and needed to exist before study sessions or techniques can be implemented.
- Files: src/core/models/Card.ts, src/core/types/card.ts, src/services/validation/cardValidation.ts, src/storage/migrations.ts, src/storage/repositories/cardRepository.ts, src/features/cards/useDeckCards.ts, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/DecksScreen.tsx, src/ui/screens/CardsScreen.tsx, docs/features/cards.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Cards are scoped to a valid `deckId`, foreign keys prevent orphan rows, and cards are ordered per deck by `created_at`.

---

[2026-03-18]
- Change: Added the initial Study Engine foundation with a prompt resolver, technique registry, study engine, three modular techniques, and Study screen integration through a feature hook.
- Reason: The app needed its core study logic in the engine layer before real study sessions could exist.
- Files: src/core/models/StudySession.ts, src/core/types/study.ts, src/engine/StudyEngine.ts, src/engine/PromptModeResolver.ts, src/engine/TechniqueRegistry.ts, src/engine/types.ts, src/techniques/BasicReviewTechnique.ts, src/techniques/ReverseReviewTechnique.ts, src/techniques/MixedRecallTechnique.ts, src/features/study/useStudySession.ts, src/ui/screens/StudyScreen.tsx, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: High
- Notes: Prompt modes are derived strictly from available card fields, unsupported cards are skipped safely, and the UI only renders engine state plus answer actions.

---

[2026-03-20]
- Change: Added persistent study progress storage per `(cardId, promptMode)` plus study session completion summary, restart, and retry-incorrect flows.
- Reason: Study sessions needed durable answer history and a complete end-of-session flow before later scheduling or scoring features are layered on.
- Files: src/core/models/StudyProgress.ts, src/core/types/studyProgress.ts, src/services/validation/studyProgressValidation.ts, src/storage/migrations.ts, src/storage/repositories/studyProgressRepository.ts, src/engine/StudyEngine.ts, src/features/study/useStudySession.ts, src/ui/components/study/StudySessionCard.tsx, src/ui/components/study/StudySessionSummary.tsx, src/ui/screens/StudyScreen.tsx, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: High
- Notes: Answer results are saved before the session advances, duplicate taps are blocked during persistence, and retry mode replays the exact incorrect prompt items from the completed session.

---

[2026-03-20]
- Change: Added adaptive study ordering that prioritizes recently failed and weaker prompt items using persisted study progress while preserving technique-generated valid prompt items.
- Reason: Flat session ordering left study sessions too static even after progress persistence existed.
- Files: src/engine/StudyEngine.ts, src/engine/types.ts, src/features/study/useStudySession.ts, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: High
- Notes: Fresh prompt items remain represented, strong streak items are deprioritized rather than removed, and retry-incorrect flow still replays the exact failed prompt items.

---

[2026-03-20]
- Change: Added balanced session shaping on top of adaptive ordering, including a session size cap, same-card repetition protection, and weak/fresh/strong composition balancing.
- Reason: Adaptive ranking alone still allowed oversized or repetitive sessions, especially when many prompt items came from the same card.
- Files: src/engine/StudyEngine.ts, src/engine/types.ts, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: High
- Notes: Retry-incorrect flow remains exact prompt-item replay, while main sessions are capped and interleaved with safe fallbacks for small decks.

---

[2026-03-20]
- Change: Polished the Study UI with session progress indicators, remaining count, stage badges, and clearer answer feedback.
- Reason: The study logic was stable, but the active session UI still lacked enough feedback and progress visibility for a clear user experience.
- Files: src/ui/screens/StudyScreen.tsx, src/ui/components/study/StudySessionCard.tsx, src/ui/components/study/StudySessionProgress.tsx, docs/features/study.md, docs/flows/main-user-flows.md
- Risk: Low
- Notes: The polish is presentation-only; it reads existing session state and does not modify engine, persistence, or study logic behavior.

---

[2026-03-20]
- Change: Refined the Study UI polish pass with an active session banner, animated progress and card transitions, extracted answer-action/session-banner components, and clearer summary retry messaging.
- Reason: The first pass added the right state indicators, but the Study screen still needed clearer session framing and better transition feedback while staying strictly presentation-only.
- Files: src/ui/screens/StudyScreen.tsx, src/ui/components/study/StudySessionCard.tsx, src/ui/components/study/StudySessionProgress.tsx, src/ui/components/study/StudySessionSummary.tsx, src/ui/components/study/StudySessionAnswerActions.tsx, src/ui/components/study/StudySessionBanner.tsx, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Low
- Notes: The hook and engine contracts were left intact; the component split also keeps the UI files inside the project file-size rule.

---

[2026-03-20]
- Change: Added a lightweight study-readiness insight layer with deck-level readiness badges, prompt coverage metrics, technique availability hints, and soft card warnings for missing study fields.
- Reason: The study engine was already strong, but users still lacked visibility into whether their decks and cards were actually ready for useful study sessions.
- Files: src/features/study/studyInsights.ts, src/features/decks/useDecks.ts, src/storage/repositories/cardRepository.ts, src/ui/screens/DecksScreen.tsx, src/ui/screens/DeckDetailScreen.tsx, src/ui/components/deck/DeckReadinessBadge.tsx, src/ui/components/deck/DeckStudyInsightCard.tsx, src/ui/components/deck/DeckListItem.tsx, src/ui/components/card/CardStudyFeedback.tsx, src/ui/components/card/DeckCardListItem.tsx, docs/features/study.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: The insight layer only reads existing card data and prompt rules; it does not change study logic, persistence behavior, or card-creation blocking rules.

---

[2026-03-20]
- Change: Added real-time card editor guidance with prompt-mode support preview, technique usefulness hints, and optional application/image fields in the current card creation flow.
- Reason: Deck-level insight was not enough on its own; users also needed immediate feedback while drafting a card so they can improve study quality before saving.
- Files: src/features/study/cardStudyPreview.ts, src/features/cards/useDeckCards.ts, src/ui/screens/DeckDetailScreen.tsx, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardEditorStudyPreview.tsx, docs/features/study.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: The preview reuses the same prompt support rules as the study insight layer, stays non-blocking, and does not change engine or persistence behavior.

---

[2026-03-20]
- Change: Added study session modes (`Mixed`, `Weak Focus`, `Fresh Focus`) and session size options (`10`, `20`, `All`) to the Study flow using feature-layer queue configuration before engine start.
- Reason: Users needed direct control over session intent and length without changing the StudyEngine’s internal ranking or shaping behavior.
- Files: src/core/types/study.ts, src/engine/types.ts, src/engine/StudyEngine.ts, src/features/study/useStudySession.ts, src/features/study/sessionConfiguration.ts, src/features/study/sessionSummary.ts, src/ui/screens/StudyScreen.tsx, src/ui/components/study/StudySessionSetupPanel.tsx, src/ui/components/study/StudySessionBanner.tsx, docs/features/study.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: Retry-incorrect sessions remain exact prompt-item replays and do not use the new mode/size configuration layer.

---

[2026-03-20]
- Change: Performed a Study stabilization pass covering session setup locking, focused-mode fallback hardening, and a rollback of unnecessary Step 8 engine build-option fields.
- Reason: The Study feature had enough moving parts that it needed one pass focused on correctness, UX consistency, and boundary cleanup before adding more scope.
- Files: src/features/study/useStudySession.ts, src/features/study/sessionConfiguration.ts, src/ui/screens/StudyScreen.tsx, src/engine/StudyEngine.ts, src/engine/types.ts, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Low
- Notes: The minimal engine hook-up remains `queueItems` plus `maxSessionItems`; focused-mode rules stay in the feature layer, retry-incorrect remains exact prompt-item replay, and active session setup can no longer be reset accidentally from the UI.

---

[2026-03-20]
- Change: Moved card creation/editing into the Cards tab workspace, removed the embedded deck-detail editor, and added deck-to-cards handoff with the current deck preselected.
- Reason: Deck detail had become overloaded, while the Cards tab was underused and needed to become the primary workspace for card management.
- Files: src/navigation/types.ts, src/features/cards/useDeckCards.ts, src/storage/repositories/cardRepository.ts, src/services/validation/cardValidation.ts, src/core/types/card.ts, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardWorkspaceDeckSelector.tsx, src/ui/components/card/DeckCardListItem.tsx, docs/features/cards.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Deck-to-cards handoff uses a one-shot route param, card lists refresh on tab focus to avoid stale deck detail state, and the Cards workspace now supports both create and edit flows with the existing study-guidance preview.

---

[2026-03-20]
- Change: Added Settings v1 with Study default controls, app information, and an honest roadmap section, then wired those defaults into the Study setup flow.
- Reason: The main product loop was already functional, but the Settings tab was still empty and the app lacked a useful place to control current Study defaults.
- Files: src/core/types/settings.ts, src/features/settings/AppSettingsProvider.tsx, src/bootstrap/AppRoot.tsx, src/features/study/useStudySession.ts, src/ui/screens/SettingsScreen.tsx, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Low
- Notes: Settings are session-only for the current app run, they only expose behavior that already has a real effect, and they do not interrupt active or completed Study sessions already on screen.

---

[2026-03-21]
- Change: Persisted Study default settings across app restarts using a lightweight local key-value store, and polished Settings/Study copy to reflect saved defaults.
- Reason: Settings v1 already had a real effect, but users would reasonably expect their chosen Study defaults to survive an app restart.
- Files: src/core/types/settings.ts, src/storage/appSettingsStorage.ts, src/features/settings/AppSettingsProvider.tsx, src/features/study/useStudySession.ts, src/ui/screens/SettingsScreen.tsx, src/ui/screens/StudyScreen.tsx, docs/features/study.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Low
- Notes: Persisted values are validated on load, invalid or partial payloads fall back to recommended defaults, and app settings hydrate before the main shell renders so Study setup does not flicker on cold start.

---

[2026-03-22]
- Change: Added paste-based Card Import v1 in the Cards workspace with structured line parsing, preview-before-save, per-line validation feedback, and transactional batch creation for valid rows.
- Reason: Single-card creation worked, but the card workspace still needed a faster path for building decks from existing structured notes or vocabulary lists.
- Files: src/features/cards/cardImport.ts, src/features/cards/useCardImport.ts, src/features/cards/useDeckCards.ts, src/storage/repositories/cardRepository.ts, src/ui/screens/CardsScreen.tsx, src/ui/components/card/CardImportPanel.tsx, src/ui/components/card/CardWorkspaceCardList.tsx, docs/features/cards.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Import v1 is paste-only, requires user confirmation before writing anything, imports only valid preview rows, and keeps invalid lines visible with explicit reasons instead of guessing at ambiguous input.

---

[2026-03-22]
- Change: Added Deck Export/Import v1 with structured deck text export from deck detail, preview-first deck import in the Cards workspace, duplicate-deck protection, and atomic deck-plus-card creation.
- Reason: Users could already create and bulk-import cards, but they still lacked a safe way to move, share, or back up full decks.
- Files: src/features/decks/deckPortability.ts, src/features/decks/useDeckImport.ts, src/storage/repositories/deckRepository.ts, src/features/cards/cardImport.ts, src/features/decks/useDecks.ts, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/components/deck/DeckExportPanel.tsx, src/ui/components/deck/DeckImportPanel.tsx, src/ui/components/card/CardWorkspaceFeedbackState.tsx, docs/features/cards.md, docs/flows/main-user-flows.md, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Export/Import v1 is copy-paste only, reuses the card import line format, blocks deck-name collisions before write, and keeps the confirmed deck creation plus valid card inserts inside one repository transaction.

---

[2026-03-26]
- Change: Replaced the web runtime’s SQLite-dependent persistence path with a safe localStorage-backed fallback for decks, cards, study progress, and settings hydration.
- Reason: The deployed web app could render its shell but crashed or failed persistence with an `xFileControl` SQLite web runtime error.
- Files: src/storage/database.ts, src/storage/appSettingsStorage.ts, src/storage/webStorage.ts, src/storage/webAppStore.ts, src/storage/repositories/deckRepository.ts, src/storage/repositories/cardRepository.ts, src/storage/repositories/studyProgressRepository.ts, src/storage/repositories/webDeckRepository.ts, src/storage/repositories/webCardRepository.ts, src/storage/repositories/webStudyProgressRepository.ts, docs/architecture/project-structure.md
- Risk: Medium
- Notes: Native/mobile still uses SQLite, while web now avoids the unsupported SQLite code path entirely and falls back to memory if browser localStorage is unavailable.

---

[2026-03-26]
- Change: Split the database module into native and web entry points so the web bundle no longer imports the native `expo-sqlite` database module at all.
- Reason: The prior web fallback fix still left a top-level `expo-sqlite` import in the shared database module, which allowed deployed web builds to keep reaching the SQLite/open-database path.
- Files: src/storage/database.native.ts, src/storage/database.web.ts, docs/architecture/project-structure.md, docs/changelogs/project-changelog.md
- Risk: Low
- Notes: Web now initializes only the fallback web app store, while native/mobile continues using the SQLite-backed database module.

---

[2026-03-26]
- Change: Split app settings storage into native and web modules so the web bundle no longer includes the SQLite-backed settings implementation.
- Reason: Even after the database split, the shared settings storage module still caused a SQLite `kv-store` chunk to appear in the web export.
- Files: src/storage/appSettingsStorage.native.ts, src/storage/appSettingsStorage.web.ts, docs/architecture/project-structure.md, docs/changelogs/project-changelog.md
- Risk: Low
- Notes: Web settings now stay on the same browser-safe storage fallback path as the rest of the web app, while native/mobile keeps SQLite-backed settings persistence.

---

[2026-03-26]
- Change: Applied a UI/UX polish pass across the shared theme, Decks, Deck detail, Cards, Study, and Settings screens to make the app calmer, cleaner, and more consistent.
- Reason: The product flow was functional, but the visual system still felt too raw and uneven for longer study use.
- Files: src/ui/theme/colors.ts, src/ui/theme/spacing.ts, src/ui/theme/typography.ts, src/ui/components/layout/ScreenContainer.tsx, src/ui/components/card/*, src/ui/components/deck/*, src/ui/components/study/*, src/ui/screens/DecksScreen.tsx, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/screens/StudyScreen.tsx, src/ui/screens/SettingsScreen.tsx, docs/ui/design-system.md
- Risk: Low
- Notes: This pass changed hierarchy, spacing, tone, helper copy, and feedback states only. No study logic, repository behavior, persistence architecture, or navigation flow changed.

---

[2026-03-27]
- Change: Shortened subtitles, helper text, empty states, and action labels across Decks, Cards, Study, Settings, and related workspace panels.
- Reason: The UI was readable but still too explanatory, which made common actions feel slower than necessary.
- Files: src/ui/screens/DecksScreen.tsx, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/screens/StudyScreen.tsx, src/ui/screens/SettingsScreen.tsx, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardImportPanel.tsx, src/ui/components/card/CardWorkspaceDeckSelector.tsx, src/ui/components/card/CardWorkspaceCardList.tsx, src/ui/components/deck/DeckImportPanel.tsx, src/ui/components/deck/DeckExportPanel.tsx, src/ui/components/study/StudySessionSetupPanel.tsx, src/ui/components/study/StudySessionBanner.tsx, src/ui/components/study/StudySessionSummary.tsx
- Risk: Low
- Notes: Microcopy only. No app logic, persistence, navigation, or study behavior changed.

---

[2026-03-29]
- Change: Reworked Settings into a smaller Settings v2 screen and added persisted `System` / `Light` / `Dark` appearance support across navigation and shared UI surfaces.
- Reason: Settings still felt like a feature dump and lacked one of the few settings users expect to have a real app-wide effect.
- Files: src/core/types/settings.ts, src/features/settings/AppSettingsProvider.tsx, src/bootstrap/AppRoot.tsx, src/navigation/AppNavigator.tsx, src/ui/theme/colors.ts, src/ui/theme/useTheme.ts, src/ui/theme/index.ts, src/ui/screens/SettingsScreen.tsx, src/ui/screens/DecksScreen.tsx, src/ui/screens/DeckDetailScreen.tsx, src/ui/screens/CardsScreen.tsx, src/ui/screens/StudyScreen.tsx, src/ui/components/layout/ScreenContainer.tsx, src/ui/components/navigation/TabBarIcon.tsx, src/ui/components/deck/*, src/ui/components/card/*, src/ui/components/study/*, docs/architecture/project-structure.md, docs/flows/main-user-flows.md, docs/features/study.md, docs/ui/design-system.md
- Risk: Medium
- Notes: Settings now keeps only appearance and app information. Study defaults remain in the app settings layer for compatibility, but they are no longer exposed from the Settings screen.

---

[2026-04-01]
- Change: Added Auth v1 as a visual/auth shell with localized auth screens, guest entry, local auth-session persistence, and a real auth-vs-app boot boundary.
- Reason: The product needed a future-ready authentication structure before backend auth, Google OAuth, password reset delivery, or cloud sync are implemented.
- Files: src/core/types/auth.ts, src/features/auth/AuthProvider.tsx, src/features/auth/authValidation.ts, src/storage/authSessionStorage.native.ts, src/storage/authSessionStorage.web.ts, src/navigation/RootNavigator.tsx, src/navigation/AuthFlow.tsx, src/bootstrap/AppRoot.tsx, src/ui/components/auth/AuthScaffold.tsx, src/ui/screens/auth/AuthLandingScreen.tsx, src/ui/screens/auth/SignInScreen.tsx, src/ui/screens/auth/CreateAccountScreen.tsx, src/ui/screens/auth/ForgotPasswordScreen.tsx, src/ui/strings/translations.ts, docs/features/auth.md, docs/architecture/project-structure.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: Guest mode is the only path that currently enters the main app. Email sign-in, account creation, Google sign-in, and password reset remain honest placeholders with local validation only and no fake backend success.

---

[2026-04-03]
- Change: Polished the Auth v1 UI with a calmer scaffold, stronger welcome-screen hierarchy, softer form feedback states, and tighter bilingual auth microcopy.
- Reason: The auth shell structure worked, but it still felt too close to raw scaffolding instead of a deliberate front door to the product.
- Files: src/ui/components/auth/AuthScaffold.tsx, src/ui/screens/auth/AuthLandingScreen.tsx, src/ui/screens/auth/SignInScreen.tsx, src/ui/screens/auth/CreateAccountScreen.tsx, src/ui/screens/auth/ForgotPasswordScreen.tsx, src/ui/strings/translations.ts
- Risk: Low
- Notes: This pass did not change guest behavior, navigation flow, or placeholder-auth honesty. It only improved hierarchy, spacing, copy, and feedback presentation.

---

[2026-04-04]
- Change: Integrated real Supabase Auth into the existing auth shell with email/password sign-in, email/password sign-up, reset-email delivery, Google OAuth wiring, and session restore on app boot.
- Reason: The auth flow shell was already in place, and the next step was to replace placeholder actions with real authentication while preserving guest mode.
- Files: package.json, app.json, src/core/types/auth.ts, src/features/auth/AuthProvider.tsx, src/ui/screens/auth/AuthLandingScreen.tsx, src/ui/screens/auth/SignInScreen.tsx, src/ui/screens/auth/CreateAccountScreen.tsx, src/ui/screens/auth/ForgotPasswordScreen.tsx, src/ui/strings/translations.ts, src/services/supabase/supabaseClient.ts, src/storage/supabaseAuthStorage.native.ts, src/storage/supabaseAuthStorage.web.ts, docs/features/auth.md, docs/flows/main-user-flows.md
- Risk: Medium
- Notes: Guest mode still works locally. Real Supabase environment variables and dashboard redirect/provider configuration are still required before production auth can succeed.

---

[2026-04-06]
- Change: Replaced the URL-only card image field with a real optional image input area and turned Import Hub File into a real CSV import flow with shared preview, mapping, validation, and confirm behavior.
- Reason: Card authoring and import were still too constrained for practical repeated use; the app needed real image attachment and a real file-based import path.
- Files: app.json, package.json, package-lock.json, src/core/types/card.ts, src/services/validation/cardValidation.ts, src/features/cards/cardImport.ts, src/features/cards/csvImport.ts, src/features/cards/useCsvImport.ts, src/features/cards/useDeckCards.ts, src/ui/components/card/CardEditorPanel.tsx, src/ui/components/card/CardImageInput.tsx, src/ui/components/card/CsvImportPanel.tsx, src/ui/components/card/CsvImportMappingField.tsx, src/ui/components/card/ImportHubPanel.tsx, src/ui/components/card/TextImportPreviewList.tsx, src/ui/components/card/CardWorkspacePanel.tsx, src/ui/components/card/CardWorkspaceNoDecks.tsx, src/ui/screens/CardsScreen.tsx, src/ui/strings/translations.ts
- Risk: Medium
- Notes: Images can now be uploaded from the device, pasted from the clipboard, previewed, replaced, or removed. File import now supports real CSV parsing with header mapping into front, back, description, application, and image fields, and it reuses the shared Import Hub review path.

---

[2026-04-07]
- Change: Fixed the Decks-to-Study handoff so deck summary modal actions now pass the selected deck into Study the same way Cards already receives its deck handoff.
- Reason: Tapping Study from a deck summary could open Study with the first available deck instead of the deck the user selected, which broke navigation trust.
- Files: src/navigation/types.ts, src/ui/screens/DecksScreen.tsx, src/features/study/useStudySession.ts, src/ui/screens/StudyScreen.tsx
- Risk: Low
- Notes: Study now consumes an optional `selectedDeckId` route param once, honors it when valid, and preserves the normal first-deck fallback only when no intentional handoff exists.

---

[2026-04-07]
- Change: Refactored the Cards Import Hub from a source-first panel into a short guided flow that starts with import intent, then source, then input, preview, and confirm.
- Reason: The existing Import Hub worked technically, but it still felt too much like a tooling panel instead of a clear import path for normal users.
- Files: src/ui/components/card/ImportHubPanel.tsx, src/ui/components/card/ImportHubTextFlow.tsx, src/ui/components/card/ImportHubChoiceGrid.tsx, src/ui/components/card/ImportHubStepHeader.tsx, src/ui/components/card/CsvImportPanel.tsx, src/ui/components/card/TextImportWorkspace.tsx, src/ui/components/card/CardWorkspacePanel.tsx, src/ui/components/card/CardWorkspaceNoDecks.tsx, src/ui/screens/CardsScreen.tsx, src/ui/strings/translations.ts
- Risk: Low
- Notes: Working import behavior for pasted card text, deck text, and CSV files is unchanged. The refactor only changes the user path and presentation, with the shared preview, validation, and confirm logic preserved underneath.

---

[2026-04-07]
- Change: Added NotebookLM as a first-class Import Hub source profile with source-specific guidance and examples, and added an honest Notion future path note without fake integration behavior.
- Reason: The app needed a more memorable external-knowledge workflow, and the most practical near-term differentiator is helping users move NotebookLM output into cards with low friction.
- Files: src/ui/components/card/ImportHubPanel.tsx, src/ui/components/card/ImportHubTextFlow.tsx, src/ui/components/card/ImportHubInfoCard.tsx, src/ui/components/card/TextImportWorkspace.tsx, src/ui/strings/translations.ts
- Risk: Low
- Notes: NotebookLM still uses the shared text or CSV import pipeline. There is no direct NotebookLM API integration and no Notion sync yet.
