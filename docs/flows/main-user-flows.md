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
