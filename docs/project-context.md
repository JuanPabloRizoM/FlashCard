# Project Context — Flashcards App

## Overview
This project is a flashcards-based study application built with React Native + Expo, designed for both mobile and web (via Expo Web).

The system supports flexible knowledge cards, not limited to traditional front/back flashcards. Cards can contain multiple optional fields such as translation, definition, image, example, and application.

The goal is to provide a dynamic and adaptable study experience across different domains:
- Languages
- Medicine / Anatomy
- Programming
- Science
- General knowledge

---

## Core Principles

1. Cards are structured data, not simple Q/A
2. Study logic is handled by a central Study Engine
3. UI does NOT control business logic
4. Storage is handled via repositories (no direct SQL in UI)
5. Techniques are modular and extensible
6. Prompt modes depend on available card fields

---

## Tech Stack

- React Native
- Expo
- TypeScript
- SQLite (expo-sqlite)

---

## Core Entities

- Deck
- Card
- StudyProgress
- StudySession

---

## Study System

The Study Engine determines:
- which card to show
- how to show it (prompt mode)
- how to process the answer
- how to update progress

---

## Prompt Modes

Examples:
- title → translation
- translation → title
- image → title
- title → definition
- title → application

Prompt modes are selected dynamically based on card fields.

---

## Techniques (MVP)

- Basic Review
- Reverse Review
- Mixed Recall

---

## Constraints

- No AI features in MVP
- No cloud sync initially
- No overengineering
- One change at a time
- Every change must update documentation

---

## Golden Rule

If a feature or change is not documented, it is considered incomplete.