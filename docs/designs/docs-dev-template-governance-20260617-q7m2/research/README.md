# Research

This folder records cross-validated evidence for updating `docs/dev/README.md` and `docs/dev/_templates/**` so they can support pre-code development guidance without becoming tied to a specific technology stack.

## Research Index

| ID | Topic | Status | Supports | Related Amendment | Record |
| --- | --- | --- | --- | --- | --- |
| RS1 | Cross-validated guidance management patterns | Accepted | R4-R10, D1, U1-U4 | A0 | `./0001-cross-validated-guidance-management.md` |
| RS2 | Concern discovery from technology stack and repository topic | Accepted | R12-R16, D2, U6 | A1 | `./0002-concern-discovery-from-stack-and-topic.md` |
| RS3 | Stack-only concern discovery from public repositories | Accepted | R17-R22, D3, U7 | A2 | `./0003-stack-only-concern-discovery-from-public-repositories.md` |
| RS4 | Concern terminology and fine-grained GitHub inference | Accepted | R23-R30, D4, U8 | A3 | `./0004-concern-terminology-and-fine-grained-github-inference.md` |

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
