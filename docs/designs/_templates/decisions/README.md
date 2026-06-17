# Decisions

This folder records decisions for this design package. This file is the decision index. Each large or durable decision gets one separate record.

## Decision Index

| ID  | Decision        | Status                                                                                               | Record                                | Related Amendment | Supersedes  | Superseded By | Preserves                                    | Revisit Trigger   |
| --- | --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------- | ----------- | ------------- | -------------------------------------------- | ----------------- |
| D1  | <Decision name> | <Proposed / Accepted / Deferred / Superseded / Rejected / Partially Superseded / Partially Restored> | `./0001-record-important-decision.md` | <None / A1>       | <None / D0> | <None / D2>   | <Requirement or decision scope still valid.> | <When to revisit> |

## Status Meanings

- `Proposed`: likely direction, not yet final.
- `Accepted`: current source of truth.
- `Deferred`: intentionally left for a later phase.
- `Rejected`: considered and not selected.
- `Superseded`: replaced by a later decision record.
- `Partially Superseded`: part of the decision was replaced, but some preserved scope remains active.
- `Partially Restored`: a later decision restored part of a previously superseded scope.

## Rules

- Keep this index current when adding or superseding decision records.
- Do not rewrite accepted decision history to hide previous reasoning.
- Use a separate record for decisions that affect architecture, dependencies, security, data retention, public APIs, testing strategy, or documentation governance.
- Record `Supersedes`, `Superseded By`, and `Preserves` when a new requirement changes an existing decision.
- Use `Partially Superseded` instead of `Superseded` when any part of the older decision remains valid.
- Copy `_template.md` to `0001-record-important-decision.md` when creating a decision record.
