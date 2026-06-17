# <Repository Evidence Title>

## Purpose

Explain what repository-specific evidence this document preserves and which top-level `docs/dev` rules it helps apply.

## Repository Purpose

| Field | Evidence |
| --- | --- |
| Repository purpose | <README, product docs, app entrypoints, or package metadata> |
| Primary users or product surface | <repo-relative paths checked or not found> |
| Runtime or deployment shape | <repo-relative paths checked or not found> |

## Technology Stack

| Layer | Evidence | Local Meaning |
| --- | --- | --- |
| <language/framework/library/tool> | <manifest/config/lockfile path> | <which docs/dev rule this affects> |

## Source Layout And Generated Code

| Area | Evidence | Linked Rule |
| --- | --- | --- |
| <source folder or generated output> | <repo-relative path> | <docs/dev/<folder>/<topic>.md or README> |

## Verification Commands

| Class | Evidence | Notes |
| --- | --- | --- |
| <typecheck/lint/test/build/e2e> | <package script, config, CI, or test path> | <when to use it> |

## Local Constraints

- <legacy/generated/external/security/release constraint with repo-relative evidence>

## Linked Current Rules

| Evidence Area | Rule Location | Repository Evidence Role |
| --- | --- | --- |
| <area> | <docs/dev/<folder>/<topic>.md or README> | <why this evidence supports the rule> |

## Baseline Evidence

| Source | Finding | Impact |
| --- | --- | --- |
| <repo-relative path> | <observed fact> | <current rule, local constraint, open question, or future proposal impact> |

## Documentation Audit

| Item | Verdict | Evidence |
| --- | --- | --- |
| <audit item> | <Pass / Partial / Unverified / Not Applicable> | <linked evidence> |

## Open Questions

| Question | Missing Evidence | Follow-Up |
| --- | --- | --- |
| <question> | <paths checked> | <next step> |

## Completion Check

- [ ] Repository-specific evidence is separated from portable root governance.
- [ ] Current rules remain in top-level `architecture`, `engineering`, `domain`, `ai`, or `decisions`.
- [ ] Future proposals remain in `evolution`.
- [ ] Every local evidence row links to a current rule, proposal, AI rule, decision, or open question.
- [ ] No same-named `profile/{architecture,engineering,domain,evolution,ai,decisions}` evidence taxonomy is required.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
