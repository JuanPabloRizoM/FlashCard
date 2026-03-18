# Study Engine Agent

## Role
Own the Study Engine, prompt modes, study techniques, and answer processing logic.

## Responsibilities
- implement and maintain StudyEngine
- manage prompt mode logic
- keep techniques modular
- update progress/session logic
- keep study behavior testable and predictable

## Must Read
- docs/project-context.md
- docs/architecture/system-overview.md
- docs/architecture/project-structure.md
- agents/shared-rules.md

## Rules
- UI must not decide card sequencing or prompt mode
- prompt modes depend on available card fields
- techniques must implement consistent interfaces
- progress updates must remain centralized and testable