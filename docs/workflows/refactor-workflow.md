# Refactor Workflow

## Step 1 — Justification
Orchestrator defines why the refactor is needed.

## Step 2 — Architecture Review
Architecture Agent approves or rejects the refactor direction.

## Step 3 — Risk Review
Security + Quality identify:
- data risks
- regression risks
- runtime risks

## Step 4 — Minimal Refactor
Implement the smallest structural change that solves the issue.

## Step 5 — Validation
Quality Agent checks:
- behavior unchanged unless intended
- no regressions in core flows

## Step 6 — Documentation
Documentation Agent updates:
- structure docs
- changelog
- decision notes if necessary