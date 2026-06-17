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

## Development Guidance Target Inventory

| Target | Decision Point | Risk | Evidence | Owner Folder | Classification | Confidence | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <concrete development guidance target> | <boundary/API/ownership/validation/verification choice> | <bug/coupling/review/maintenance risk> | <repo paths, official docs, or GitHub evidence> | <architecture/engineering/domain/evolution/ai/decisions/repository> | <Current Rule / Recommended Future Pattern / Open Question / Local Constraint / Not Applicable> | <High / Medium / Low with limitation> | <next evidence, docs update, or decision> |

## Evidence Collection Lanes

| Lane | Evidence Checked | Candidate Targets | Conflicts Or Gaps |
| --- | --- | --- | --- |
| Stack evidence | <manifests, lockfiles, dependency metadata, config, generated-code config, scripts, verification commands> | <candidate targets> | <conflicts or not found> |
| Repository topic evidence | <README, product docs, metadata, entrypoints, route/API surfaces, ownership, lifecycle, domain vocabulary> | <candidate targets> | <conflicts or not found> |
| Operational quality evidence | <tests, build, dependency update, generated artifact, security, maintenance, docs, packaging, release evidence> | <candidate targets> | <conflicts or not found> |

## Stack-Only Public Repository Sampling

Use this section only when the target repository is not known yet or only the technology stack is known. Prefer at least five public repositories; use at least three only when the reason is recorded.

| Repository | Role | Selection Evidence | Inspected Evidence | Candidate Targets | Grouping | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| <owner/name or stable URL> | <product/library/example/platform/docs/etc.> | <query, non-archived/non-fork/activity/adoption/stack relevance> | <manifest/scripts/workflows/source/docs/releases> | <candidate targets> | <Shared Stack / Stack Plus Domain / Repository Specific> | <missing evidence/conflicts/confidence impact> |

## GitHub Evidence Fallbacks

| Preferred Tool | Fallback Used | Source URLs | Steps Or Query | Inspected Files Or Pages | Retrieved Date | Limitations | Confidence Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <gh command or not available> | <GitHub Web UI / REST API / GitHub MCP or connector / stable file URL> | <URLs> | <query or navigation steps> | <paths/pages> | <YYYY-MM-DD> | <rate limit, auth, missing files, stale docs> | <High / Medium / Low impact> |

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
- [ ] Development guidance targets are classified and routed to owner folders.
- [ ] Sampled public repository practices are not promoted to current rules without target repository evidence.
- [ ] Non-`gh` fallback evidence records limitations and confidence impact when used.
- [ ] Every local evidence row links to a current rule, proposal, AI rule, decision, or open question.
- [ ] No same-named `profile/{architecture,engineering,domain,evolution,ai,decisions}` evidence taxonomy is required.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
