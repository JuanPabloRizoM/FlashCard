# Main User Flows

## Enter As Guest

1. On first boot with no saved auth shell state, the app opens the auth landing flow instead of the main tabs.
2. The user taps `Continuar como invitado` / `Continue as guest`.
3. The auth shell persists a local guest session.
4. The app switches into the main tab shell without requiring a backend login.
5. On a later app launch, that guest session is restored before the main app shell renders.

---

## Move Through The Auth Shell

1. On the auth landing screen, the user can choose Google, email sign-in, account creation, or guest entry.
2. `Continue with Google` starts the Supabase OAuth flow.
3. `Sign in with email` validates the form locally, then signs in through Supabase.
4. `Create account` validates the form locally, then creates the account through Supabase.
5. `Forgot password` sends a real Supabase reset email and shows a confirmation state.
6. On a successful authenticated session, the auth shell restores into the main app on later launches.

---

## Create A Deck

1. The user opens the `Decks` tab.
2. The app loads persisted decks from the SQLite repository.
3. The user enters a deck name and submits the form.
4. The name is normalized and validated before save.
5. Optional deck fields are omitted safely and the repository applies Deck V1 defaults.
6. The repository inserts the deck into SQLite with a parameterized query.
7. The saved deck appears immediately in the Decks list.

---

## Return To Saved Decks

1. The user reloads or reopens the app.
2. The Decks screen requests stored decks from the repository.
3. SQLite returns persisted deck rows.
4. The repository maps full Deck V1 models, including `type`, optional metadata, `createdAt`, and `updatedAt`.
5. The screen renders the stored deck list without recreating the data.

---

## Create A Card In A Deck

1. The user opens the `Decks` tab.
2. The user selects a saved deck.
3. The deck detail view loads cards that belong only to that deck and shows study readiness plus card feedback.
4. The user taps `Create cards` to open the `Cards` tab with the same deck preselected.
5. The Cards workspace loads cards for that deck and opens the card editor for create or edit work.
6. The user enters required `front` and `back` fields plus any optional supporting fields.
7. The card editor previews supported prompt modes and missing-field guidance in real time without blocking save.
8. Card input is normalized and validated before save.
9. The repository verifies the `deckId`, inserts or updates the card in SQLite, and reload-safe persistence is maintained through the deck relation.
10. The saved card appears immediately in the Cards workspace, and the deck detail card list refreshes when the user returns to the `Decks` tab.

---

## Import Cards In Bulk

1. The user opens the `Cards` tab and selects a deck.
2. The user switches the workspace to `Import` and chooses `Paste text` inside the Import Hub.
3. The user pastes multiline text into the shared input area.
4. The app parses one line at a time using the supported `|`-separated format.
5. The shared import preview marks each line as valid or invalid and shows a reason for invalid lines.
6. Nothing is written until the user confirms import.
7. On confirmation, only valid lines are sent to the repository batch-create path for the selected deck.
8. Confirmed imports are created in one batch, the Cards workspace list updates immediately, and the pasted import draft is cleared.

---

## Export A Deck

1. The user opens the `Decks` tab and selects a saved deck.
2. Deck detail loads the deck overview, study insights, and card list.
3. The user opens the `Export deck` panel.
4. The app generates structured text with a `# Deck: Deck name` header plus one card per line using the existing card import format.
5. The user copies that export text from the panel and can paste it elsewhere for backup or sharing.

---

## Import A Deck

1. The user opens the `Cards` tab.
2. The user switches the workspace to `Import` and chooses `Import deck` inside the Import Hub.
3. If the app has no decks yet, the Import Hub still remains available.
4. The user pastes exported deck text beginning with `# Deck: Deck name`.
5. The app validates the deck header and previews each following card line with the existing card import parser.
6. Duplicate deck names and malformed card lines are surfaced before any write happens.
7. When the user confirms import, the repository creates a new deck and its valid cards in one transaction.
8. The newly imported deck becomes selected in the Cards workspace, and it appears in the Decks tab on the next focus refresh.

---

## Start A Study Session

1. The user opens the `Study` tab.
2. The Study tab stays in dashboard mode, where the user selects a deck, reviews high-level readiness/history context, and adjusts technique, mode, and size.
3. The app loads available decks from the repository.
4. The user selects a deck, one of the supported techniques, a study mode, and a session size.
5. The feature layer loads cards and persisted study progress for the selected deck.
6. The selected technique uses the `PromptModeResolver` to build only valid study items for each card.
7. If the user chose `Weak Focus` or `Fresh Focus`, the feature layer narrows that valid queue before session start with safe fallback behavior that can still fill larger sessions when the preferred pool is small.
8. The `StudyEngine` reorders the configured prompt items so recent failures and weaker prompt items appear before stronger ones, while fresh prompt items still remain represented.
9. The engine shapes the ranked items into the requested session size, reduces same-card clustering when alternatives exist, and balances weak/fresh/strong composition.
10. When the user starts study, the app navigates from the Study dashboard route into a dedicated full-screen Study Session route instead of keeping the live review embedded in the dashboard.
11. Once session assembly starts, setup selectors stay locked until the session is idle again so the visible UI matches the active Study state.
12. The session screen renders the current prompt together with an active session banner, animated progress indicators, remaining count, and stage feedback without hardcoded study logic.
13. The user taps or clicks the card to reveal the answer, and on web can also press `Space`.
14. After reveal, the user grades mainly through swipe gestures: up for correct, down for incorrect, with button fallbacks still available.
15. The feature layer persists the answer result by `(cardId, promptMode)` before the session advances.
16. The next prompt appears with updated progress state, fresh reveal state, and UI-only transition feedback derived from session state.
17. The engine advances the session and tracks session counts until completion.
18. If the user pauses or tries to leave early, the dedicated session route shows a confirmation path before abandoning the unfinished session.
19. When the session completes, the app saves a session record plus answer snapshots for later review.
20. The user sees a completion modal with summary metrics and can either return to the Study dashboard or open the detailed statistics view.
21. The Study dashboard later shows recent saved sessions and high-level deck study metrics based on those persisted session records.


---

## Choose App Appearance

1. The user opens the `Settings` tab.
2. The user chooses `System`, `Light`, or `Dark` in the `Appearance` section.
3. The app stores that preference in lightweight local device storage.
4. On a later app launch, settings hydrate safely before the main app shell renders.
5. The app resolves the active theme from the saved preference and applies it across navigation and shared UI surfaces.

---

## Choose App Language

1. On first load, the app defaults to `Español` if no saved language exists.
2. The user opens the `Settings` tab.
3. The user chooses `Español` or `English` in the `Language` section.
4. The app saves that language through the same lightweight settings persistence path used by appearance.
5. Visible copy across Decks, Deck detail, Cards, Study, Settings, and shared helper states updates to the selected language.
6. On a later app launch, settings hydrate before the main app shell renders, so the saved language is restored without a fake selector or screen-by-screen drift.
