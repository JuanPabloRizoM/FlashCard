# Shared Rules for All Agents

## Project Context Rule
Before doing any work, every agent must read the base project context and architecture documents.

## Scope Rule
Every task must explicitly define:
- goal
- scope
- out of scope
- likely files affected
- validation steps
- documentation updates required

## Isolation Rule
Do not modify unrelated systems.
Prefer minimal safe changes.

## Architecture Rule
- UI must not own business logic
- storage must be accessed through repositories
- study logic must live in the engine layer
- prompt modes must be derived from card fields
- techniques must remain modular

## Documentation Rule
Any code change requires documentation updates.
If docs are not updated, the task is incomplete.

## Validation Rule
Code inspection alone is not enough if runtime validation is feasible.

## Security Rule
Every task affecting input, storage, or navigation must consider:
- validation
- null safety
- safe defaults
- data integrity
- crash prevention

## Anti-Regression Rule
Every behavior change must include a regression checklist.

## Completion Rule
A task may only be considered complete if:
1. implementation is done
2. validation is done
3. docs are updated
4. regressions were checked