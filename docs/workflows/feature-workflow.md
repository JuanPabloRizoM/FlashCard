# Feature Workflow

## Step 1 — Task Definition
Orchestrator defines:
- goal
- scope
- out of scope
- validation required
- docs to update

## Step 2 — Architectural Review
Architecture Agent reviews:
- structure impact
- data model impact
- engine impact
- repository impact

## Step 3 — Security Review
Security Agent reviews:
- input risks
- storage risks
- fallback safety

## Step 4 — Implementation
Primary implementation agent applies the feature.

## Step 5 — Validation
Quality Agent verifies:
- expected flow works
- no regression in core loop
- runtime behavior is correct

## Step 6 — Documentation Update
Documentation Agent updates:
- feature docs
- changelog
- notes about future risks or follow-ups

## Completion Rule
Feature is complete only when implementation + validation + docs are all done.