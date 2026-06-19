# Traceability

## Metadata

- Status: active
- Last Updated: 2026-06-19

## Requirement Amendment Trace

| Amendment ID | Change Type | Preserved Requirements | New / Modified / Superseded Requirements | Decision Record | Preserved Plan Units | New / Modified Units | Verification Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A0 | Initial | None | R1-R16 | None | None | U1-U5 | V1-V5 |
| A1 | Supersedes | R1-R16 | R17-R19 | `decisions/0001-remove-commands-keep-examples.md` | U1-U7 | U8-U10, U12 | V8-V10, V12 |
| A2 | Clarifies | R1-R19 | R20-R23 | `decisions/0001-remove-commands-keep-examples.md` | U1-U10 | U11, U12 | V11-V12 |

## Requirement To Research

| Requirement | Research Record | Coverage |
| --- | --- | --- |
| R1-R5 | `research/0001-template-command-example-boundaries.md` | Full |
| R6-R8 | `research/0002-pattern-example-coverage.md` | Full |
| R9-R11 | `research/0003-readme-template-system-improvements.md` | Full |
| R12-R13 | `research/0004-readme-authoring-guardrails.md` | Full |
| R14-R16 | `research/0005-external-repository-cross-validation.md` | Full |
| R17-R19 | `research/0006-remove-commands-decision.md` | Full |
| R20-R23 | `research/0007-examples-vs-prohibitions-naming.md` | Full |

## Requirement To Decision

| Requirement | Decision | Status | Preserves / Supersedes |
| --- | --- | --- | --- |
| R17-R19 | `decisions/0001-remove-commands-keep-examples.md` | Accepted | Supersedes live `_commands` layer |
| R20-R23 | `decisions/0001-remove-commands-keep-examples.md` | Accepted | Preserves `examples/` name and free-form prompt bodies |

## Requirement To Plan Unit

| Requirement | Plan Unit | Unit Status | Coverage |
| --- | --- | --- | --- |
| R1-R5 | U1 | Completed | Full |
| R6-R8 | U2, U11 | Completed | Full |
| R9-R11 | U3, U9 | Completed | Full |
| R12-R13 | U4, U8 | Completed | Full |
| R14-R16 | U5, U8, U9, U11 | Completed | Full |
| R17-R19 | U6, U8, U9, U10, U12 | Completed | Full |
| R20-R23 | U7, U11 | Completed | Full |

## Requirement To Artifact Persistence

| Requirement | Artifact | Expected Persistence | Actual Persistence | Decision Record |
| --- | --- | --- | --- | --- |
| R1-R23 | `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/**` | Tracked | Tracked in worktree | `decisions/0001-remove-commands-keep-examples.md` |
| R14-R19 | `docs/dev/README.md`, `docs/dev/_templates/**`, `docs/dev/repository/README.md` | Tracked | Tracked modified files | `decisions/0001-remove-commands-keep-examples.md` |
| R17-R19 | `docs/dev/_commands/**` | Tracked deletion | Deleted tracked files | `decisions/0001-remove-commands-keep-examples.md` |
| R20-R23 | `examples/nextjs-frontend.md` | Tracked | Tracked modified file | `decisions/0001-remove-commands-keep-examples.md` |

## Requirement To Verification

| Requirement | Verification | Method | Scope Match |
| --- | --- | --- | --- |
| R1-R7 | V1-V7 | Research record review and index check | Full |
| R8-R11 | V8-V9 | README/template review and live reference search | Full |
| R12-R19 | V8-V10 | `_commands`, stack-only, and external validation searches | Full |
| R20-R23 | V11 | Example prompt review and top-guidance search | Full |
| R1-R23 | V12 | Placeholder/internal marker search and completion audit review | Full |

## Requirement To Completion Evidence

| Requirement | Completion Evidence | Verdict |
| --- | --- | --- |
| R1-R23 | `completion-audit.md` | Pass |

## Coverage Gaps

| Gap | Affected Requirements | Impact | Required Follow-Up |
| --- | --- | --- | --- |
| No second stack example prompt exists yet. | R20-R23 | Does not block current migration; limits cross-stack demonstration maturity. | Add another stack example when a concrete target stack is selected. |
