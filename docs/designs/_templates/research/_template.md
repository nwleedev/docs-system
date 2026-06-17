# <Research Topic>

## Metadata

- Status: <Draft / Accepted / Superseded / Deferred>
- Date: <YYYY-MM-DD>
- Supports: <R1, R2, decision, traceability item, or completion audit item>
- Related Amendment: <None / A1 / A2>
- Supersedes: <None or research record path>
- Superseded By: <None or research record path>

## Research Question

State the question this record answers. A record should answer one primary question.

## Context

Explain why this research was needed and what requirement, decision, or audit risk depends on it.

## Evidence

Use `Type` to classify evidence instead of creating separate files by source type.

| Source ID | Type                                                                                                      | Source                                                       | Accessed     | Claim Used                   | Quality Notes                                    |
| --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------ | ---------------------------- | ------------------------------------------------ |
| S1        | <Official docs / Standard / External web / Local code / Git history / Runtime evidence / User constraint> | <URL, repo-relative path, command, or user-provided context> | <YYYY-MM-DD> | <Claim this source supports> | <Freshness, version, caveat, or confidence note> |

## Cross-Validation

Describe how the evidence agrees, conflicts, or constrains the finding.

| Claim            | Evidence A | Evidence B | Result                                  | Caveat            |
| ---------------- | ---------- | ---------- | --------------------------------------- | ----------------- |
| <Claim checked.> | S1         | S2         | <Confirmed / Conflicted / Inconclusive> | <Caveat or none.> |

## Findings

| Finding ID | Finding    | Evidence | Confidence            | Applies To                            |
| ---------- | ---------- | -------- | --------------------- | ------------------------------------- |
| F1         | <Finding.> | S1, S2   | <High / Medium / Low> | <Requirement, decision, or plan unit> |

## Impact

Explain how the finding changes or supports `requirements.md`, `decisions/`, `plan.md`, `traceability.md`, or `completion-audit.md`.

| Artifact              | Impact Type                                                      | Required Update                    |
| --------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| `requirements.md`     | <Supports / Adds / Clarifies / Supersedes / Conflicts / Backlog> | <Requirement IDs or sections.>     |
| `decisions/`          | <Supports / Requires / Supersedes / Reopens>                     | <Decision record or index update.> |
| `plan.md`             | <Supports / Adds / Modifies / Defers / Supersedes>               | <Plan units or verification rows.> |
| `traceability.md`     | <Adds / Updates / Reopens / No change>                           | <Traceability rows.>               |
| `completion-audit.md` | <Adds evidence / Reopens audit / Records gap / No change>        | <Audit rows or verdict impact.>    |

## Gaps

| Gap                                | Impact                | Follow-Up                           |
| ---------------------------------- | --------------------- | ----------------------------------- |
| <Unknown or conflicting evidence.> | <Risk if unresolved.> | <How to resolve or where to defer.> |

## Sources

- <Source title or path>: <short reason this source was used>.
