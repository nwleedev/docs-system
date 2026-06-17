# Decisions

This folder records decisions for the `docs/dev` stack-neutral template governance design package.

## Decision Index

| ID | Decision | Status | Record | Related Amendment | Supersedes | Superseded By | Preserves | Revisit Trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | Classify missing guidance without stack coupling | Accepted | `./0001-classify-missing-guidance-without-stack-coupling.md` | A0 | None | None | R4-R9 | Revisit if future implementation introduces automation, CI checks, or a technology-specific shared template pack. |
| D2 | Use evidence-first concern discovery | Accepted | `./0002-use-evidence-first-concern-discovery.md` | A1 | None | None | R12-R16 | Revisit if a future implementation adds automated dependency graph, catalog, or scorecard ingestion. |
| D3 | Sample real repositories before stack-only concern selection | Accepted | `./0003-sample-real-repositories-before-stack-only-concern-selection.md` | A2 | None | None | R17-R22 | Revisit if future work chooses a curated repository benchmark set or automated GitHub sampling. |
| D4 | Define concern as a development guidance target | Accepted | `./0004-define-concern-as-development-guidance-target.md` | A3 | None | None | R23-R30 | Revisit if future docs/dev implementation chooses to rename `concern` or introduces automated concern extraction. |
| D5 | Keep GitHub evidence and templates portable | Accepted | `./0005-keep-github-evidence-and-templates-portable.md` | A4 | None | None | R31-R35 | Revisit if future implementation makes `gh` mandatory, adds automation, or adopts curated stack-specific template packs. |

## Status Meanings

- `Proposed`: likely direction, not yet final.
- `Accepted`: current source of truth.
- `Deferred`: intentionally left for a later phase.
- `Rejected`: considered and not selected.
- `Superseded`: replaced by a later decision record.
- `Partially Superseded`: part of the decision was replaced, but some preserved scope remains active.
- `Partially Restored`: a later decision restored part of a previously superseded scope.
