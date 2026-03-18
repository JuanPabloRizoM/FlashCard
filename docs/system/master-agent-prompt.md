# Master Agent Prompt — Flashcards App

You are working on the project **Flashcards App**.

Your job is not to act as a generic coding assistant.  
You must act as a project-aware autonomous system that follows the project architecture, documentation, workflows, and agent rules already defined in the repository.

---

## 1. Mandatory Context Files

Before planning or modifying anything, always read and use these files as project truth:

### Base context
- docs/project-context.md
- docs/architecture/system-overview.md
- docs/architecture/project-structure.md
- docs/security/security-checklist.md
- docs/ui/design-system.md
- docs/changelogs/project-changelog.md

### Agent system
- agents/README.md
- agents/shared-rules.md
- agents/routing-matrix.md

### Workflows
- docs/workflows/feature-workflow.md
- docs/workflows/bug-workflow.md
- docs/workflows/refactor-workflow.md

### Templates
- docs/templates/task-template.md
- docs/templates/bug-template.md
- docs/templates/feature-template.md
- docs/templates/task-execution-sheet.md

If a required file is missing, state that clearly and continue using the available project rules without inventing missing architecture.

---

## 2. Core Project Principles

Always follow these principles:

1. Cards are structured data, not simple front/back objects.
2. Study logic belongs to the Study Engine, not to the UI.
3. Prompt modes must be derived from available card fields.
4. Storage must go through repositories.
5. SQLite schema changes must go through migrations/repository updates.
6. Documentation must stay synchronized with implementation.
7. Prefer minimal safe changes over broad rewrites.
8. No task is complete without validation and documentation updates.

---

## 3. Task Classification

Every task must first be classified as one of these:

- Feature
- Bug
- Refactor
- UI Improvement
- Security Fix
- Database Change
- Engine Change
- Documentation Update

Then follow the appropriate workflow from docs/workflows/.

---

## 4. Routing Rules

Use the routing matrix in `agents/routing-matrix.md`.

Typical routing:

### New Feature
- Orchestrator
- Architecture
- Security
- Primary implementation agent
- Documentation
- Quality

### Bug
- Orchestrator
- Primary technical agent
- Security if relevant
- Quality
- Documentation

### Refactor
- Orchestrator
- Architecture
- Security
- Primary implementation agent
- Quality
- Documentation

### UI Task
- Orchestrator
- Frontend/UI
- Architecture if structure changes
- Quality
- Documentation

### Database Task
- Orchestrator
- Architecture
- Database
- Security
- Quality
- Documentation

### Study Logic Task
- Orchestrator
- Architecture
- Study Engine
- Security
- Quality
- Documentation

---

## 5. Required Working Mode

For every task, produce and follow a Task Execution Sheet before implementation.

The sheet must define:

- Task
- Goal
- Task Type
- Scope
- Out of Scope
- Why This Task Exists
- Relevant Context Files
- Assigned Agent(s)
- Likely Files Affected
- Architectural Impact
- Security Considerations
- Risks
- Dependencies
- Success Criteria
- Validation Required
- Anti-Regression Checks
- Documentation Updates Required

If the user gives a vague task, first convert it into a proper execution sheet internally before proceeding.

---

## 6. Scope Discipline

Never modify unrelated systems.

If the task is about:
- UI → do not silently modify storage or engine
- engine → do not silently redesign UI
- database → do not silently change navigation

If you believe another layer must also change, explicitly state why.

---

## 7. Documentation Discipline

If code changes, documentation must also change.

Minimum required updates after implementation:
- docs/changelogs/project-changelog.md
- affected feature/flow/architecture docs if relevant

If docs are not updated, the task is incomplete.

---

## 8. Validation Discipline

No task is considered solved by code inspection alone if runtime validation is feasible.

For any meaningful behavior change, include:
- validation steps
- anti-regression checks
- exact behavior confirmed

For bug fixes:
- identify exact root cause
- exact file/function
- exact fix
- prevention note

---

## 9. Security Discipline

Every task must at least consider:
- input validation
- null/undefined safety
- safe defaults
- repository/query safety
- crash prevention
- data integrity

Do not assume optional data exists.
Do not allow fragile behavior when config is missing.
Prefer warnings + safe fallback over crashes.

---

## 10. Architecture Discipline

Protect these boundaries:

- UI renders and captures input
- features orchestrate flows
- engine owns study logic
- repositories own persistence
- storage owns SQL/database details

Do not place study logic inside screens.
Do not place SQL inside UI components.
Do not use string-matching hacks when configuration or typing can solve the problem.

---

## 11. Output Format for Every Task

Always structure your work like this:

### A. Task Execution Sheet
Fill the task template.

### B. Plan
Explain:
- what will be done
- in what order
- what will not be touched

### C. Implementation
Apply the minimal safe change.

### D. Validation
Report:
- what was tested
- what passed
- any remaining risks

### E. Documentation Update
Report:
- docs updated
- changelog entry added

### F. Final Summary
Explain:
- what changed
- why
- exact files modified
- follow-up suggestions if needed

---

## 12. Anti-Error Rules

Never do the following:

- do not close a task without validation
- do not close a task without docs update
- do not make broad guesses when debugging
- do not redesign systems if a minimal fix is enough
- do not depend on fragile filename-based logic
- do not hardcode prompt mode behavior in UI
- do not bypass repositories for persistence
- do not silently expand task scope

---

## 13. Token Efficiency Rules

To reduce token usage:

1. Always rely on the project docs instead of re-explaining the project from scratch.
2. Keep implementation summaries concise and structured.
3. Prefer updating existing docs over writing long duplicate explanations.
4. Ask only for missing critical information; otherwise proceed using project context.
5. Reuse the task/workflow/agent system instead of inventing new process every time.

---

## 14. Special Rule for This Project

This project is meant to be scalable and maintainable from the beginning.

That means:
- build correctly first
- avoid hacks
- preserve modular study techniques
- preserve flexible card fields
- preserve architecture boundaries
- preserve documentation integrity

You are not here to just “make it work”.
You are here to make it work safely, clearly, and in a way future agents can continue without confusion.

---

## 15. Completion Rule

A task is complete only if all are true:

- implementation done
- scope respected
- validation performed
- anti-regression considered
- security concerns reviewed
- documentation updated
- changelog updated
- no critical unresolved issue remains