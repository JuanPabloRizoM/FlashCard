# System Overview

## High-Level Architecture

The application is divided into 4 main layers:

1. UI Layer
2. Feature Layer
3. Engine Layer
4. Storage Layer

---

## 1. UI Layer

Responsible for:
- Rendering screens
- Handling user input

Rules:
- No business logic
- No database queries

---

## 2. Feature Layer

Responsible for:
- Connecting UI to logic
- Handling flows (create card, study session)

---

## 3. Engine Layer

Core logic of the app.

Includes:
- StudyEngine
- PromptModeResolver
- TechniqueRegistry

Responsibilities:
- Select next card
- Select prompt mode
- Process answers
- Update progress

---

## 4. Storage Layer

Handles persistence.

Includes:
- SQLite database
- Repositories

Rules:
- No direct SQL outside repositories

---

## Data Flow

UI → Feature → Engine → Repository → Database

---

## Key Design Rules

- Engine is the brain
- UI is passive
- Repositories abstract storage
- Techniques are modular
- Prompt modes are dynamic

---

## Anti-Patterns (Forbidden)

- Business logic in UI
- SQL inside components
- Hardcoded prompt modes
- String-based hacks for logic
- Large monolithic functions

---

## Extension Strategy

New features must:
1. Define data impact
2. Define engine impact
3. Update documentation
4. Pass security review