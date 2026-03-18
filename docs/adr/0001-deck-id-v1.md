# ADR 0001: Deck IDs Are Numeric In V1

## Status

Accepted

## Date

2026-03-18

## Context

The Deck entity is the first persisted domain model in the Flashcards App.

For V1, deck data is stored only in local SQLite and there is no sync layer, remote API, or cross-device merge requirement.

## Decision

Deck IDs remain SQLite integer primary keys in V1.

This means:
- `Deck.id` is a `number`
- repositories treat the database row ID as the domain ID in V1
- future sync work may introduce an external identifier later if product requirements change

## Reasoning

- It matches the current local-first architecture
- It avoids premature identifier complexity before sync exists
- It keeps repository and migration logic simple for the first persisted entity

## Consequences

Positive:
- simpler schema
- simpler repository mapping
- predictable local ordering and lookups

Trade-off:
- a later sync or export/import system may require an additional stable external ID rather than replacing the numeric ID in-place
