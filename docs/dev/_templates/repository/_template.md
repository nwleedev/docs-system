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

## Broad Input And Target Decomposition

Use this section when a broad technology-stack request, explicit concern list, issue, meeting note, external document, or restricted source shaped this repository evidence. Skip only when the document is a narrow repository evidence update.

| Field | Value |
| --- | --- |
| Input shape | <explicit concern list / stack request / target repository evidence / external source / restricted source / mixed> |
| Source location | <repo-relative path, external reference, user request summary, or not applicable> |
| Persistence state | <Tracked / Ignored Local / External / Restricted / Reconstructed In This File / Design Package / Derived From Stack Evidence> |
| Item count | <number if explicit and useful / not applicable> |
| Stable target IDs or clusters | <C00-Cnn / T00-Tnn / cluster labels / not assigned yet> |
| Coverage rule | <all explicit items / all derived targets / selected by accepted decision / backlog excluded with traceability> |
| Reconstruction location | <this section / docs/designs/<package>/requirements.md / repository/<topic>.md / not applicable> |

| Source Item Or Target ID | Claim Or Target | Target Stack Evidence | Owner Folder | Classification | Pattern Obligation | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- |
| <C00 or T00> | <reconstructed source claim or derived target> | <manifest/config/official docs/GitHub evidence> | <architecture/engineering/domain/evolution/ai/decisions/repository> | <Current Rule / Recommended Future Pattern / Open Question / Local Constraint / Not Applicable> | <best/anti examples, scenario coverage, verification needed> | <next docs/dev file, decision, evidence, or gap> |

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

## External Repository Cross-Validation Evidence

Use this section for technology-stack guidance, architecture conventions, coding rules, testing practices, or best/anti patterns. Use it even when local code exists, because local code is current-state evidence, not best-practice authority. Prefer at least five public repositories; use at least three only when the reason is recorded.

| Repository | Role | Selection Evidence | Inspected Evidence | Candidate Targets | Do Patterns | Don't / Anti-Patterns | Grouping | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <owner/name or stable URL> | <product/library/example/platform/docs/etc.> | <query, non-archived/non-fork/activity/adoption/stack relevance> | <manifest/scripts/workflows/source/docs/releases/source files> | <candidate targets> | <recommended practice observed> | <failure-prone practice or avoided pattern> | <Shared Stack / Stack Plus Domain / Repository Specific> | <missing evidence/conflicts/confidence impact> |

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

## Target Coverage Audit

Use this table when `Broad Input And Target Decomposition` is present.

| Target Range Or Cluster | Expected Coverage | Actual Coverage | Verdict | Follow-Up |
| --- | --- | --- | --- | --- |
| <C00-Cnn / T00-Tnn / cluster> | <all explicit items or derived targets mapped to owner, classification, evidence, pattern obligation, and target output> | <summary> | <Pass / Partial / Unverified / Not Applicable> | <remaining work> |

## Open Questions

| Question | Missing Evidence | Follow-Up |
| --- | --- | --- |
| <question> | <paths checked> | <next step> |

## Completion Check

- [ ] Repository-specific evidence is separated from portable root governance.
- [ ] Current rules remain in top-level `architecture`, `engineering`, `domain`, `ai`, or `decisions`.
- [ ] Future proposals remain in `evolution`.
- [ ] Development guidance targets are classified and routed to owner folders.
- [ ] Broad technology-stack requests are decomposed into sufficiently granular targets before current rules are written.
- [ ] Local code was not treated as best-practice authority without external repository cross-validation.
- [ ] Explicit source items or derived targets, when present, are mapped without silent omission.
- [ ] Target pattern coverage maps every target to a best example, anti-pattern example, verification method, or explicit open question/no-example rationale.
- [ ] External repository practices are not promoted to current rules without target repository evidence.
- [ ] Non-`gh` fallback evidence records limitations and confidence impact when used.
- [ ] Every local evidence row links to a current rule, proposal, AI rule, decision, or open question.
- [ ] No same-named `profile/{architecture,engineering,domain,evolution,ai,decisions}` evidence taxonomy is required.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
