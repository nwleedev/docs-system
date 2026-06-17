# Research

This folder records research as traceable records. Each record answers one primary research question and may include external documents, local code, Git history, runtime evidence, user constraints, and standards in the same file.

## Research Index

| ID  | Topic            | Status                                     | Supports                                     | Related Amendment | Record                     |
| --- | ---------------- | ------------------------------------------ | -------------------------------------------- | ----------------- | -------------------------- |
| RS1 | <Research topic> | <Draft / Accepted / Superseded / Deferred> | <R1, decision, plan unit, traceability item> | <None / A1>       | `./0001-research-topic.md` |

## Status Meanings

- `Draft`: evidence is still being collected or cross-validated.
- `Accepted`: the finding can be used by requirements, decisions, plans, traceability, or completion audit.
- `Deferred`: the question is known but does not block the current package.
- `Superseded`: a later research record replaced this one.

## Rules

- Keep this index current when adding or superseding research records.
- Use one record per primary research question or finding.
- Classify evidence with the `Type` column inside each record instead of creating separate files for source types.
- Cross-check load-bearing claims with at least two evidence types when practical.
- Record conflicting or weak evidence as a gap instead of hiding it.
- Link research to the amendment, decision, requirement, plan unit, or audit row it supports.
- When newer research changes an accepted finding, mark the older record as `Superseded` instead of rewriting it to hide the earlier evidence.
- Prefer concise observations and reproducible commands over raw logs.
