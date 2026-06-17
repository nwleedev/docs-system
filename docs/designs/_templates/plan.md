---
title: <Plan Title>
type: <feat|fix|refactor|docs|test|chore>
status: active
date: <YYYY-MM-DD>
origin: <repo-relative path to requirements.md>
---

# <Plan Title>

## Summary

State the implementation direction in one to three sentences.

## Problem Frame

Summarize why the work is being done. Do not rewrite the requirements.

## Requirements

Copy the stable requirement IDs from `requirements.md`.

- R1. <Requirement copied or summarized without changing meaning.>

## Plan Amendments

Use this section when `requirements.md` receives a new amendment after this plan was created. For an initial plan, write `Not applicable - initial plan`.

| Amendment ID | Requirement IDs | Preserved Units | New Units | Modified Units | Deferred Units | Superseded Units | Removed Units | Decision Record                | Verification Impact                 |
| ------------ | --------------- | --------------- | --------- | -------------- | -------------- | ---------------- | ------------- | ------------------------------ | ----------------------------------- |
| A1           | <R IDs.>        | <U IDs.>        | <U IDs.>  | <U IDs.>       | <U IDs.>       | <U IDs.>         | <U IDs.>      | <None / decisions/<record>.md> | <V rows to add, update, or reopen.> |

Rules:

- Do not delete an existing plan unit silently.
- If a plan unit no longer applies, mark it as `Deferred`, `Superseded`, or `Removed by decision`.
- A removed or superseded accepted plan unit requires a decision record unless it was never part of accepted scope.
- New or changed requirements must map to implementation units and verification rows before implementation starts.

## Key Technical Decisions

- <Decision>: <Rationale and linked decision record if one exists.>

## Artifact Persistence Plan

Map required artifacts from `requirements.md` before implementation. If any artifact is ignored, generated-only, external-only, or not reproducible, add or link a decision record before starting the affected unit.

| Artifact             | Covers | Expected Persistence                                                 | Commitability Check                                                  | Decision Record                |
| -------------------- | ------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------ |
| `<path or artifact>` | R1     | <Tracked / Ignored Local / Generated / External / Decision Required> | `<git status --porcelain --ignored>` or `<git check-ignore -v path>` | <None / decisions/<record>.md> |

## Implementation Units

Use stable unit IDs. Preserve existing IDs after review; add new IDs for additive work.

| Unit | Status                                                                       | Covers | Work Scope                                                      | Expected Artifact Persistence                        | Verification |
| ---- | ---------------------------------------------------------------------------- | ------ | --------------------------------------------------------------- | ---------------------------------------------------- | ------------ |
| U1   | <Planned / Active / Completed / Deferred / Superseded / Removed by decision> | R1     | <Independently reviewable unit of work, files, and boundaries.> | <Tracked / Generated / External / Decision Required> | V1           |
| U2   | <Planned / Active / Completed / Deferred / Superseded / Removed by decision> | R2     | <Independently reviewable unit of work, files, and boundaries.> | <Tracked / Generated / External / Decision Required> | V2           |

## Implementation-Time Decision Boundaries

Stop implementation and create or update a decision record when:

- a planned artifact is ignored, generated-only, external-only, or not commit-ready;
- satisfying the plan requires force add, `.gitignore` changes, a new source-of-truth path, new dependencies, hooks, CI, scripts, security exceptions, or public API changes;
- verification proves only a local draft while the requirement expects a durable deliverable;
- the plan's artifact persistence differs from current repository evidence.

## Verification

| Verification | Covers | Command Or Review            | Expected Evidence   |
| ------------ | ------ | ---------------------------- | ------------------- |
| V1           | R1, U1 | `<command or review method>` | <Observable proof.> |

## Risks And Dependencies

- <Risk or dependency that affects execution.>

## Research And Sources

- <Research record, decision record, or source link that orients the implementer.>
