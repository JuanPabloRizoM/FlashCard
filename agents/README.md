# Agents System — Flashcards App

## Purpose
This folder defines the autonomous agent system used to build and maintain the Flashcards App project.

The system is designed to:
- reduce token consumption
- avoid repeated project explanations
- prevent fragile changes
- keep documentation synchronized with code
- ensure anti-regression and security checks happen consistently

## Entry Rule
Any agent working on the project must first read:

1. `docs/project-context.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/project-structure.md`
4. `docs/security/security-checklist.md`
5. `docs/ui/design-system.md`
6. `docs/changelogs/project-changelog.md`
7. `agents/shared-rules.md`
8. `agents/routing-matrix.md`

## Active Agents
- Orchestrator Agent
- Documentation Agent
- Architecture Agent
- Security Agent
- Study Engine Agent
- Database Agent
- Frontend/UI Agent
- Quality Agent

## Mandatory Rule
No task is considered complete until:
- scope was respected
- validation was performed
- documentation was updated
- anti-regression checks were applied where relevant