# Main User Flows

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
6. The user enters a required card title and optional supporting fields.
7. The card editor previews supported prompt modes, technique usefulness, and missing-field guidance in real time without blocking save.
8. Card input is normalized and validated before save.
9. The repository verifies the `deckId`, inserts or updates the card in SQLite, and reload-safe persistence is maintained through the deck relation.
10. The saved card appears immediately in the Cards workspace, and the deck detail card list refreshes when the user returns to the `Decks` tab.

---

## Import Cards In Bulk

1. The user opens the `Cards` tab and selects a deck.
2. The user pastes multiline text into the import panel.
3. The app parses one line at a time using the supported `|`-separated format.
4. The import preview marks each line as valid or invalid and shows a reason for invalid lines.
5. Nothing is written until the user confirms import.
6. On confirmation, only valid lines are sent to the repository batch-create path for the selected deck.
7. Confirmed imports are created in one batch, the Cards workspace list updates immediately, and the pasted import draft is cleared.

---

## Start A Study Session

1. The user opens the `Study` tab.
2. If the user changed Study defaults in `Settings`, the Study screen adopts those defaults when it is idle.
3. Before studying, the user can review deck readiness and prompt coverage from the deck screens to spot missing fields or weak prompt support.
4. The app loads available decks from the repository.
5. The user selects a deck, one of the supported techniques, a study mode, and a session size.
6. The feature layer loads cards and persisted study progress for the selected deck.
7. The selected technique uses the `PromptModeResolver` to build only valid study items for each card.
8. If the user chose `Weak Focus` or `Fresh Focus`, the feature layer narrows that valid queue before session start with safe fallback behavior that can still fill larger sessions when the preferred pool is small.
9. The `StudyEngine` reorders the configured prompt items so recent failures and weaker prompt items appear before stronger ones, while fresh prompt items still remain represented.
10. The engine shapes the ranked items into the requested session size, reduces same-card clustering when alternatives exist, and balances weak/fresh/strong composition.
11. Once session assembly starts, setup selectors stay locked until the session is idle again so the visible UI matches the active Study state.
12. The screen renders the current prompt together with an active session banner, animated progress indicators, remaining count, and stage feedback without hardcoded study logic.
13. The user reveals the answer and marks it correct or needs review.
14. The feature layer persists the answer result by `(cardId, promptMode)` before the session advances.
15. The next prompt appears with updated progress state, fresh reveal state, and UI-only transition feedback derived from session state.
16. The engine advances the session and tracks session counts until completion.
17. When the session is complete, the user sees a summary and can restart the full session or retry only the incorrect prompts.

---

## Adjust Study Defaults

1. The user opens the `Settings` tab.
2. The user changes the default Study mode and default session size.
3. The app stores those defaults in lightweight local device storage.
4. On a later app launch, settings hydrate safely before the main app shell renders.
5. When the Study screen is idle, it reflects those defaults automatically.
6. The user can reset defaults back to the recommended values from the same Settings section.
