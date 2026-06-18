# docs/dev Bootstrap Audit

Use this checklist when an AI agent or contributor creates or substantially reorganizes a `docs/dev` system from these templates. The audit proves that the output is grounded in the target repository, not copied from this repository or from a specific skill.

## Target Repository

| Field | Value |
| --- | --- |
| Repository name | <name> |
| Repository purpose | <summary with source path> |
| Existing `docs/dev` status | <absent / partial / present> |
| Existing development guidance | <repo-relative paths checked> |
| Technology stack evidence | <manifest/config paths checked> |
| Source layout evidence | <source paths checked> |
| Verification command evidence | <scripts/config/test paths checked> |
| Constraints | <legacy/generated/external/security/release constraints> |
| Broad input / target decomposition | <none / explicit source / stack-only / mixed / reconstructed path / target range> |
| Open-question defaults applied | <global display phrase / sample count / fallback scope / future-pattern ownership / example placement choices> |

## Created Or Updated Structure

| Path | Action | Evidence Used | Current / Future / Decision / AI Rule |
| --- | --- | --- | --- |
| `docs/dev/README.md` | <created/updated/unchanged> | <paths> | <classification> |
| `docs/dev/repository/README.md` | <created/updated/unchanged/not needed> | <paths> | <repository evidence> |
| `docs/dev/architecture/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/engineering/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/domain/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/evolution/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/ai/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/decisions/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |

## Evidence Promotion

| Claim | Evidence | Classification | Why This Is Safe |
| --- | --- | --- | --- |
| <claim> | <repo-relative source/config/test/doc paths> | <Current Rule / Local Constraint / Recommended Future Pattern / Open Question> | <reason> |

## Development Guidance Target Inventory

| Target | Decision Point | Risk | Evidence | Owner Folder | Classification | Confidence | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <target> | <choice> | <risk> | <paths/URLs> | <folder> | <Current Rule / Recommended Future Pattern / Open Question / Local Constraint / Not Applicable> | <High / Medium / Low> | <next step> |

## Target Decomposition Coverage

Use this section when broad technology-stack work, explicit source items, or derived target clusters shaped the bootstrap.

| Source Item Or Target ID | Claim Or Target | Owner Folder | Classification | Evidence | Best / Anti Pattern Coverage | Verification Or Follow-Up |
| --- | --- | --- | --- | --- | --- | --- |
| <C00 or T00> | <reconstructed source claim or derived target> | <folder> | <classification> | <paths/URLs> | <covered / planned / open question / no-example rationale> | <verification or next docs update> |

## Pattern Coverage

| Source Items Or Target IDs | Scenario Coverage | Best Pattern Example Status | Anti-Pattern Example Status | Verification Method | Target Output | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| <C00-Cnn / T00-Tnn / cluster> | <scenarios covered by target docs> | <covered / planned / not applicable> | <covered / planned / not applicable> | <test/lint/typecheck/build/browser/review> | <docs/dev path / decision / open question> | <gap or none> |

## Stack-Only Sampling Evidence

| Repository | Selection Criteria | Inspected Evidence | Candidate Targets | Grouping | Local Applicability | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| <owner/name or URL> | <activity/non-archived/non-fork/adoption/stack relevance> | <manifests/scripts/workflows/source/docs/releases> | <targets> | <Shared Stack / Stack Plus Domain / Repository Specific> | <applies/does not apply/unknown> | <limitations> |

## GitHub Evidence Fallbacks

| Preferred `gh` Evidence | Fallback Used | Source URLs | Steps | Inspected Files Or Pages | Retrieved Date | Limitations | Confidence Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <gh command or unavailable reason> | <GitHub Web UI / REST API / GitHub MCP or connector / stable file URL> | <URLs> | <query/navigation steps> | <paths/pages> | <YYYY-MM-DD> | <limitations> | <impact> |

## Missing Evidence

| Missing Evidence | Checked Paths | Classification | Follow-Up |
| --- | --- | --- | --- |
| <item> | <paths> | <Open Question / Local Constraint / Recommended Future Pattern> | <next step> |

## Independence Checks

| Check | Pass / Fail | Evidence |
| --- | --- | --- |
| No template output assumes this repository's stack as the target stack. | <Pass/Fail> | <paths> |
| No template output requires `maintain-dev-docs` or another specific skill. | <Pass/Fail> | <paths> |
| No skill-local path, absolute user path, worktree name, or session state is required. | <Pass/Fail> | <paths> |
| Existing target docs were inventoried before replacement or deletion. | <Pass/Fail> | <paths> |
| Current rules, future proposals, AI rules, and decisions are physically separated. | <Pass/Fail> | <paths> |
| Repository evidence is under `docs/dev/repository/`, not same-named `profile/<folder>` folders. | <Pass/Fail> | <paths> |
| `docs/dev/application/` was not created without a decision record. | <Pass/Fail> | <paths> |
| GitHub evidence can use `gh` or an equivalent recorded fallback path. | <Pass/Fail> | <paths> |
| Named stacks or sampled repositories are optional evidence/examples, not portable template baselines. | <Pass/Fail> | <paths> |
| Named file names, source lists, item counts, or worked examples are optional evidence/examples, not portable template baselines. | <Pass/Fail> | <paths> |
| Broad technology-stack work was decomposed into evidence-backed development guidance targets before current rules were written. | <Pass/Fail/Not Applicable> | <paths> |
| Every explicit source item or derived target is mapped or explicitly deferred; no broad target set was summarized by sampling only. | <Pass/Fail/Not Applicable> | <paths> |
| Every explicit source item or derived target maps to best/anti pattern coverage or an explicit no-example rationale/open question. | <Pass/Fail/Not Applicable> | <paths> |
| `Recommended Future Pattern` evidence remains separate from current rules until target evidence exists. | <Pass/Fail> | <paths> |

## Completion Decision

- Verdict: <Pass / Pass With Follow-Up / Fail>
- Remaining gaps: <open questions or follow-up docs>
- Reviewer: <name or role>
- Date: <YYYY-MM-DD>
