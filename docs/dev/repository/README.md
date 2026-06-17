# Repository Evidence

This document records repository-specific evidence for this `docs/dev` governance repository. It is not portable root governance and does not own current rules for other repositories.

## Repository Purpose

| Field | Evidence |
| --- | --- |
| Repository purpose | `docs/dev/README.md`, `docs/designs/**` define a reusable development guidance documentation system. |
| Primary users or product surface | Contributors and AI agents maintaining `docs/dev` templates and design packages. |
| Runtime or deployment shape | No runtime application evidence found in this repository scope; this is documentation governance material. |

## Technology Stack

| Layer | Evidence | Local Meaning |
| --- | --- | --- |
| Markdown documentation | `docs/dev/**`, `docs/designs/**` | The main artifact type is tracked documentation. |
| Git history | `git log`, `docs/designs/docs-dev-template-governance-20260617-q7m2/**` | Design package commits preserve context for template governance changes. |
| RTK-assisted shell workflow | `AGENTS.md` project instruction, local command evidence during this work | Shell checks use `rtk` when available; this is a local working rule, not portable template governance. |

## Source Layout And Generated Code

| Area | Evidence | Linked Rule |
| --- | --- | --- |
| Portable root governance | `docs/dev/README.md` | `docs/dev/README.md` |
| Authoring templates | `docs/dev/_templates/**` | `docs/dev/_templates/README.md` |
| Design package evidence | `docs/designs/docs-dev-template-governance-20260617-q7m2/**` | Future implementation and audit reference |

## Verification Commands

| Class | Evidence | Notes |
| --- | --- | --- |
| File inventory | `rtk rg --files docs/dev docs/designs/docs-dev-template-governance-20260617-q7m2` | Confirms template and design-package scope. |
| Portability search | `rtk rg -n "React|TypeScript|TanStack|Tailwind|Orval|Rust|rhwp|Zustand|React Hook Form|Next|Vue|Angular|Svelte" docs/dev/README.md docs/dev/_templates` | Named stack mentions in portable docs must be optional examples or removed. |
| Placeholder review | `rtk rg -n "TODO|TBD|placeholder" docs/dev/README.md docs/dev/_templates` | Template placeholders can remain in template bodies; generated target docs must remove them. |

## Local Constraints

- This repository stores portable docs and templates, not product application code.
- `docs/dev/_templates/**` intentionally contains placeholder markers because those files are authoring templates.
- Design packages under `docs/designs/**` are the durable trace for why portable template rules change.

## Open-Question Defaults Applied

| Question | Applied Default | Evidence |
| --- | --- | --- |
| Global display phrase | Use `development guidance target` and keep `concern` only as an optional short label. | `docs/designs/docs-dev-template-governance-20260617-q7m2/open-questions.md` |
| Stack-only sample count | Use at least five public repositories by default; allow at least three only with recorded justification. | `docs/dev/README.md`, `docs/dev/_templates/README.md` |
| Non-`gh` fallback scope | Allow GitHub Web UI, REST API through an approved HTTP client, installed GitHub MCP or connector output, and stable file URLs. | `docs/dev/README.md`, `docs/dev/_templates/repository/_template.md` |
| `Recommended Future Pattern` ownership | Keep evidence and classification in `repository`; keep interpretation and application guidance in topical owner folders. | `docs/dev/README.md`, `docs/dev/_templates/README.md` |
| Named stack examples | Keep core templates stack-neutral; named technologies must be target evidence or optional examples. | `docs/dev/README.md`, `docs/dev/_templates/README.md` |

## Development Guidance Target Inventory

| Target | Decision Point | Risk | Evidence | Owner Folder | Classification | Confidence | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portable guidance target workflow | How templates record missing or future guidance before current rules exist. | Agents may invent stack-specific current rules from weak evidence. | `docs/designs/docs-dev-template-governance-20260617-q7m2/plan.md` | `repository`, `evolution`, owner folders as linked | Current Rule for templates | High | Keep template fields aligned with R1-R40. |
| GitHub evidence fallback | Whether `gh` is required for public repository research. | Environments without `gh` may skip sampling or invent concerns. | `docs/designs/docs-dev-template-governance-20260617-q7m2/open-questions.md`, `plan.md` | `repository` evidence | Current Rule for templates | High | Preserve fallback recording fields. |
| Named stack examples | Where concrete technology examples belong. | Portable templates may make one stack look like the default. | `docs/designs/docs-dev-template-governance-20260617-q7m2/open-questions.md` | `engineering`, `repository` | Current Rule for templates | High | Keep core templates stack-neutral. |

## Baseline Evidence

| Source | Finding | Impact |
| --- | --- | --- |
| `docs/dev/README.md` | Portable root governance already separates current rules, future proposals, repository evidence, AI rules, and decisions. | Extend instead of replacing root governance. |
| `docs/dev/_templates/README.md` | Router already maps document intent to folder ownership. | Add guidance target routing without changing folder ownership. |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/**` | R1-R40 describe the required stack-neutral workflow. | Use as implementation source of truth. |

## Open Questions

| Question | Missing Evidence | Follow-Up |
| --- | --- | --- |
| Should this repository later include rendered examples of filled templates? | No accepted decision for example packs yet. | Create a decision before adding stack-specific example packs. |

## Completion Check

- [x] Repository-specific evidence is separated from portable root governance.
- [x] Current rules remain in top-level `architecture`, `engineering`, `domain`, `ai`, or `decisions`.
- [x] Future proposals remain in `evolution`.
- [x] Every local evidence row links to a current rule, proposal, AI rule, decision, or open question.
- [x] No same-named `profile/{architecture,engineering,domain,evolution,ai,decisions}` evidence taxonomy is required.
- [x] No product repository stack is treated as the portable template baseline.

## Sources

- `docs/dev/README.md`: portable governance and folder ownership.
- `docs/dev/_templates/README.md`: template router.
- `docs/designs/docs-dev-template-governance-20260617-q7m2/plan.md`: implementation plan and verification requirements.
