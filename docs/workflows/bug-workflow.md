# Bug Workflow

## Step 1 — Bug Definition
Use docs/templates/bug-template.md

## Step 2 — Scope Isolation
Orchestrator defines:
- exact symptom
- exact scope
- out of scope
- evidence required

## Step 3 — Root Cause
Primary technical agent identifies:
- exact file
- exact function
- exact root cause

## Step 4 — Minimal Fix
Apply only the change required to solve the bug.

## Step 5 — Security Review
If the bug touches data, input, storage, or unsafe fallback behavior.

## Step 6 — Validation
Quality Agent verifies:
- bug is actually fixed
- related flows still work
- no regression appears

## Step 7 — Documentation
Documentation Agent updates:
- changelog
- bug prevention note