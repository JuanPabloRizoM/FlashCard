# Study Feature

## Purpose

The Study feature is powered by the engine layer.

It currently supports:
- deriving valid prompt modes from card fields
- selecting one of the first three study techniques
- selecting a study mode and session size before session start
- building a study session from real deck cards
- processing a basic correct / needs-review answer flow
- persisting study progress per `(cardId, promptMode)`
- adaptively ordering study items using persisted progress signals
- shaping study sessions with a practical size cap and balanced item composition
- showing session progress indicators and answer feedback in the Study UI
- showing a completion summary with restart and retry actions
- showing deck readiness, prompt coverage, and card-level study feedback outside the Study screen

---

## Engine Modules

Core engine files:
- `PromptModeResolver.ts`
- `TechniqueRegistry.ts`
- `StudyEngine.ts`

Technique files:
- `BasicReviewTechnique.ts`
- `ReverseReviewTechnique.ts`
- `MixedRecallTechnique.ts`

UI screens do not decide prompt modes or study behavior directly.

The Study feature also includes:
- `studyProgressRepository.ts` for persistence
- `useStudySession.ts` for flow orchestration
- `AppSettingsProvider.tsx` for app-level Study defaults
- `appSettingsStorage.ts` for lightweight persisted settings storage
- `studyInsights.ts` for lightweight readiness and coverage aggregation
- `sessionConfiguration.ts` for pre-session mode and size configuration
- `sessionSummary.ts` for session summary helpers
- `cardStudyPreview.ts` for draft-card support previews
- `StudySessionBanner.tsx`, `StudySessionCard.tsx`, `StudySessionProgress.tsx`, `StudySessionAnswerActions.tsx`, and `StudySessionSummary.tsx` for lean screen rendering

Current boundary:
- the feature layer owns session setup, focused-mode filtering, session-size choice, persistence writes, and retry/restart orchestration
- the app settings layer owns default Study mode and default session size plus their safe hydration/persistence
- the engine owns prompt-item ranking, same-card repetition protection, bucket shaping, and session advancement
- the engine interface only accepts an optional prebuilt queue plus a session-size cap; focused-mode logic does not live inside `StudyEngine`

---

## Prompt Modes

Current prompt modes:
- `title_to_translation`
- `translation_to_title`
- `image_to_title`
- `title_to_definition`
- `title_to_application`

Prompt modes are only available when the required card fields exist.

Examples:
- `title_to_translation` requires `front` and `back`
- `translation_to_title` requires `back` and `front`
- `image_to_title` requires `imageUri` and `front`
- `title_to_definition` requires `front` and `description`
- `title_to_application` requires `front` and `application`

Cards without a valid prompt mode for the selected technique are skipped safely.

---

## Techniques

### Basic Review

Focuses on forward recall.

Priority order:
1. `title_to_translation`
2. `title_to_definition`
3. `title_to_application`

### Reverse Review

Focuses on reverse recall.

Priority order:
1. `translation_to_title`
2. `image_to_title`

### Mixed Recall

Uses every valid prompt mode the resolver can derive for each card.

---

## Session Flow

The Study feature hook:
- loads decks from repositories
- lets the user choose a deck and technique
- lets the user choose a study mode and session size
- applies Settings-provided default mode and size whenever the Study screen is idle
- loads cards for the selected deck
- loads persisted study progress for the selected deck
- filters or narrows the valid technique queue in the feature layer before session start when a focused mode is selected
- asks the engine to build an adaptively ordered session from that configured queue
- renders the current study item
- persists the answer result through the study progress repository
- sends `isCorrect` answers back into the engine after persistence succeeds
- locks deck/setup selection while a session is starting or actively running so transient state cannot be reset accidentally
- receives hydrated app settings only after the provider has loaded them, so setup defaults do not flicker on cold start

The Study UI now shows:
- an active session banner with the current deck and technique
- mode and size selectors before the session starts
- a progress bar based on answered versus total prompts
- a clear session count such as `5 / 12`
- a remaining count
- a current stage badge (`Question`, `Answer revealed`, `Saving answer`)
- answer feedback after each saved result
- animated prompt and summary transitions so the session advances more clearly

Outside the Study screen, the app now also shows:
- deck-level readiness indicators
- prompt-mode coverage counts and percentages
- technique availability hints
- soft card warnings for missing study fields
- real-time card editor guidance for prompt support

In the current card editor flow, the app now previews:
- which prompt modes the draft card already supports
- which fields are still missing for stronger coverage

Current answer processing tracks:
- current item index
- answered count
- correct count
- incorrect count

Persisted progress tracks:
- `timesSeen`
- `correctCount`
- `incorrectCount`
- `currentStreak`
- `lastResult`
- `lastStudiedAt`

Progress is scoped to `(cardId, promptMode)`, so one card can build separate history for forward and reverse prompts.

---

## Session Modes

Available study modes:
- `Mixed`: current behavior, with no pre-session filtering
- `Weak Focus`: keeps weak prompt items first, keeps some fresh items visible, and falls back to the broader valid queue when the preferred pool is too small
- `Fresh Focus`: keeps fresh prompt items first, then falls back to weak items and the broader valid queue when needed

Mode behavior is implemented in the feature layer before session start:
- the selected technique still creates the valid prompt queue
- the feature layer narrows or rebalances that queue
- the engine still applies adaptive ordering and session shaping afterward

Defaults:
- mode: `Mixed`
- size: `10`

Current Settings behavior:
- defaults can be changed from the Settings tab
- defaults are saved locally and restored after app restart
- malformed or partial stored settings fall back safely to the recommended defaults
- defaults do not interrupt an active or completed session already on screen

---

## Session Sizes

Available session sizes:
- `10`
- `20`
- `All`

Size handling:
- `10` and `20` pass an explicit cap into the engine after the queue is configured
- `All` passes the full configured queue length so the usual session cap is not applied
- retry-incorrect sessions remain exact prompt-item replays and ignore these selectors

---

## Adaptive Ordering

Adaptive ordering is intentionally simple and explainable.

The engine always starts from the valid queue built by the selected technique, then reorders those prompt items using persisted `StudyProgress`.

Priority signals:
- recent incorrect result: moves the prompt item earlier
- higher incorrect ratio: moves the prompt item earlier
- low exposure: keeps newer prompt items represented
- high current streak: moves strong prompt items later
- high correct ratio: moves strong prompt items later

Fallback behavior:
- if no progress exists for a prompt item, it is treated as a fresh item
- if no progress exists for the whole deck, the original technique order is preserved through stable tie-breaking
- retry-incorrect sessions replay the exact incorrect prompt items from the completed session rather than re-running adaptive ordering across the full deck
- focused setup modes do not change ranking internals; they only change which valid prompt items are handed to the engine

---

## Session Shaping

Session shaping runs after adaptive ordering.

Current shaping rules:
- session size is capped to a practical maximum
- weak prompt items are favored most often
- fresh prompt items stay represented
- strong prompt items are still included when space allows
- back-to-back prompt items from the same card are reduced when another valid option exists

The shaping layer uses a simple bucket cycle:
- weak
- fresh
- weak
- strong

Within each bucket, adaptive priority still determines which item is taken first.

Fallback behavior:
- if the deck is small, the engine uses whatever valid items are available
- if all remaining items belong to the same card, the engine allows them rather than failing
- retry-incorrect sessions remain exact failed-prompt replays and do not apply main-session shaping

---

## Completion Behavior

When a session finishes, the screen shows:
- deck name
- technique name
- answered count
- correct count
- incorrect count
- accuracy percentage

Available actions:
- `Restart session`: reloads the selected deck and rebuilds the session through the engine
- `Retry incorrect answers`: starts a new session from the exact incorrect prompt items in the completed run

The transition from active session to summary is still driven by session state, with no UI-owned study logic.
The active card, answer reveal panel, progress fill, and summary now animate from state changes only; no additional study logic was introduced for presentation.

---

## Safety Rules

- empty decks do not crash the session flow
- cards with missing optional fields are skipped safely when needed
- unsupported prompt modes are never forced
- if no valid study item exists, the screen renders an empty study state
- answer persistence uses parameterized queries
- duplicate answer taps are ignored while a result is being saved
- duplicate session starts are ignored while a new session is being assembled
- reveal state resets safely when the session advances
- adaptive ordering only reorders already valid technique output; it does not invent prompt modes or duplicate items
- progress indicators and feedback are derived from session state only; they do not change study logic
- UI transitions are derived from rendered session state only and do not control session advancement
- deck readiness insights are advisory only and do not block deck or card actions
- setup selectors stay disabled while a session is starting or active so the visible UI matches the feature-layer safety guards

---

## Current Limitations

Not included yet:
- spaced repetition scheduling
- advanced scoring
- analytics
- weak-area targeting
