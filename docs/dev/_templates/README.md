# docs/dev Templates

This folder contains repo-tracked templates used by AI agents and team members when creating or substantially updating `docs/dev` development guidance. Even without a workflow skill such as `maintain-dev-docs`, this folder should be enough to decide placement, collect evidence, write documents, and complete an audit.

Templates do not copy the current repository's technology stack as the default for other repositories. When writing a new document, first inspect the target repository's source, config, tests, existing docs, and accepted decisions, then promote only evidence-backed items to current rules.

Root governance is owned by [`../README.md`](../README.md), not by this folder. This folder is a folder-specific authoring router; do not create `docs/dev/_templates/root-readme.md`.

`development guidance target` means a concrete development decision point that can be recorded as a current rule, future proposal, local constraint, or open question. Do not create a target from only a dependency name, user feature, UI screen, or broad product area.

Templates do not require `data.txt`, Next.js, a specific item count, or a specific source list. If an explicit concern list exists, preserve source items; otherwise derive targets from stack evidence and official documentation.

## Reading Order

1. Choose the document purpose and target folder from this README.
2. Check [`../README.md`](../README.md) for root governance, repository evidence location, and bootstrap flow.
3. Read `_templates/<folder>/README.md` for the target folder and confirm include/exclude rules plus target output.
4. Use the target folder's `_template.md` as the authoring baseline.
5. If the target repository already has `docs/dev/<folder>/README.md`, re-check Include, Exclude, and Dynamic File Policy.
6. If the target repository has no `docs/dev` folder or is setting up a new structure, record evidence and missing items in `_bootstrap-audit.md`.
7. If only a technology stack is provided, record public repository sampling or equivalent GitHub evidence first, and do not promote anything to a current rule without target repository evidence.
8. If a broad technology-stack request or prevention-pattern request is provided, fill the `Development Guidance Target Router` and the repository template's target inventory first, then write detailed documents after target coverage is confirmed.

## Placement Router

| Document Intent | Template README | Body Template | Target Output |
| --- | --- | --- | --- |
| feature/module boundary, import direction, public API, ownership | `architecture/README.md` | `architecture/_template.md` | `docs/dev/architecture/<topic>.md` |
| language, framework, library, test, lint, build, generated-code rule | `engineering/README.md` | `engineering/_template.md` | `docs/dev/engineering/<topic>.md` |
| product vocabulary, state meaning, invariant, business interpretation | `domain/README.md` | `domain/_template.md` | `docs/dev/domain/<topic>.md` |
| future migration, alternative, technical debt, non-current proposal | `evolution/README.md` | `evolution/_template.md` | `docs/dev/evolution/<topic>.md` |
| AI reading order, uncertainty handling, agent behavior rule | `ai/README.md` | `ai/_template.md` | `docs/dev/ai/<topic>.md` or `docs/dev/ai/README.md` |
| accepted/deferred/superseded long-lived decision | `decisions/README.md` | `decisions/_template.md` | `docs/dev/decisions/<number>-<topic>.md` |
| repository purpose, stack, source layout, verification commands, local constraints, baseline evidence | `repository/README.md` | `repository/_template.md` | `docs/dev/repository/README.md` or `docs/dev/repository/<topic>.md` |

## Development Guidance Target Router

| Target Shape | Evidence Owner | Guidance Owner | Classification Rule |
| --- | --- | --- | --- |
| Stack evidence, source layout, public repository sampling, fallback evidence, local constraints | `repository/` | Linked owner folder | Evidence only; never a current rule by itself |
| Module boundary, layer ownership, runtime flow, public API placement | `repository/` evidence table | `architecture/` | Current rule only with target repository evidence |
| Library composition, validation contract, generated code, tests, build, lint, release tooling | `repository/` evidence table | `engineering/` | Current rule only with target manifests/config/source/test evidence |
| Product vocabulary, state meaning, business invariant | `repository/` evidence table | `domain/` | Current rule only with repeated source/product/test evidence |
| Better pattern that is not accepted yet | `repository/` evidence table | `evolution/` | `Recommended Future Pattern`, `Deferred`, or `Open Question` |
| AI reading order, uncertainty behavior, generic snippet prevention | `repository/` evidence table | `ai/` | Current AI rule only with repo-tracked instruction evidence |
| Accepted trade-off, supersession, dependency or process choice | `repository/` evidence table | `decisions/` | Accepted only through a decision record |

## Broad Input Router

| Input Shape | First Output | Follow-Up Output | Rule |
| --- | --- | --- | --- |
| Explicit concern list, issue, meeting note, uploaded/external/restricted source | `repository/<topic>.md` or design package inventory | Owner-folder docs after classification | Preserve each requirement-relevant source item with stable IDs before summarizing. |
| Technology stack name only | `repository/README.md` stack evidence and sampling table | `evolution/` recommended patterns or owner-folder open questions | Derive targets from manifests, official docs, and sampled repositories before proposing current rules. |
| Target repository evidence exists | `repository/README.md` target inventory | `architecture/`, `engineering/`, `domain/`, `ai`, `decisions` | Promote only evidence-backed targets to current rules. |
| Product/UI visual research request | Research record or `repository/<topic>.md` evidence table | `domain/` guidance or `decisions/` record | Preserve URLs, screenshots, task context, accessibility notes, and limitations. |

Do not reduce broad technology-stack work to a few familiar library topics. Group targets for authoring efficiency, but preserve target coverage through traceability.

## Repository Evidence Routing

`docs/dev/repository/` preserves target-repository-specific evidence. This area does not own current rules; it links to top-level current-rule folders.

| Evidence Intent | Target Output | Rule |
| --- | --- | --- |
| repository purpose, stack, source layout, generated code, verification commands, local constraints | `docs/dev/repository/README.md` | Do not use as a current rule |
| local evidence for architecture guidance | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | Link to the top-level `docs/dev/architecture/` current rule |
| local evidence for engineering guidance | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | Link to the top-level `docs/dev/engineering/` current rule |
| local evidence for domain, evolution, AI, decisions | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | Do not replace the current rule, proposal, or decision body |

Do not create a same-named evidence taxonomy such as `docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` by default. Do not create a `docs/dev/application/` scope axis by default; if multiple apps or application-specific evidence are genuinely needed, first define ownership and target output through a decision record.

## Target Repository Evidence

Every `_template.md` fills in the following information before writing current guidance.

| Field | Required Evidence |
| --- | --- |
| Repository purpose | README, product docs, app entrypoints, or package metadata |
| Technology stack | package manifests, lockfiles, config files, build scripts |
| Source layout | top-level source folders, module boundaries, generated output locations |
| Existing docs | `docs/dev`, `docs/designs`, ADRs, README, contributing docs, AGENTS-style files |
| Verification commands | test, typecheck, lint, build, browser/e2e commands that are actually present |
| Constraints | legacy areas, external checkouts, generated files, security or release constraints |

If evidence is not found, write `Not found after checking <repo-relative paths>` and classify the missing item as `Open Question`, `Local Constraint`, or `Recommended Future Pattern`. Do not invent a current rule.

## Evidence Collection Lanes

| Lane | Inspect | Output |
| --- | --- | --- |
| Stack evidence | manifests, lockfiles, dependency metadata, framework config, generated-code config, build scripts, verification commands | Candidate engineering, architecture, generated artifact, verification, or release targets |
| Repository topic evidence | README, product docs, package metadata, catalog metadata, source entrypoints, route/API surfaces, ownership, lifecycle, domain vocabulary | Candidate domain, architecture, or product-surface targets |
| Operational quality evidence | tests, build, dependency updates, generated artifacts, security, maintenance, ownership, docs, packaging, release signals | Candidate verification, maintenance, release, or documentation targets |

Cross-check important targets with at least two evidence types when practical. Conflicts stay `Open Question` or low confidence.

When an explicit source list contains many requested concerns, record source location, persistence state, optional item count, stable target ID or cluster range, and any reconstructed text needed for reviewers to audit coverage without reopening ignored or private files.

## Stack-Only Sampling

When only a technology stack is known, sample public repositories before proposing targets.

| Step | Minimum Recording |
| --- | --- |
| Query and selection | search query, filters, activity, non-archived/non-fork status, adoption signal, stack relevance, sample role |
| Inspection | manifests, scripts, workflows, source layout, docs, releases, maintenance signals |
| Grouping | `Shared Stack`, `Stack Plus Domain`, `Repository Specific` |
| Local applicability | why this candidate does or does not apply to the target repository |
| Limitations | missing files, weak search results, stale docs, conflicts, confidence impact |

Prefer at least five repositories. If the ecosystem is small or search quality is poor, at least three is acceptable when the reason is recorded.

## GitHub Evidence Fallbacks

Prefer `gh` for GitHub evidence, but do not require it. Accepted fallbacks are GitHub Web UI, GitHub REST API through an approved HTTP client, installed GitHub MCP or connector output, and stable GitHub file URLs. Record tool/interface, source URLs, query or navigation steps, inspected files/pages, retrieval date, evidence summary, limitations, and confidence impact.

Temporary archive or clone inspection requires a separate decision or explicit implementation note and must not vendor sampled repositories into the target repository.

## Common Completion Rules

- `Scenario Coverage` appears before examples.
- Each scenario maps to at least one best/anti-pattern pair, positive/negative example, behavior case, or explicit no-example rationale.
- Best examples explain intent, applicability, impact, and verification.
- Anti-pattern examples explain failure mode, user or maintenance impact, safer alternative, and target-repository constraints.
- Sources are repo-relative paths or stable public URLs. Skill-local paths, machine-specific paths, session IDs, and worktree names are not valid sources.
- Placeholder text must be removed before a generated document is considered complete.
- Named technologies in generated documents must be optional evidence or examples, not template prerequisites.
- Broad technology-stack requests are complete only when explicit source items or derived targets map to evidence, owner folder, classification, pattern coverage, and either a detailed guidance section, an accepted decision, or an explicit open question/follow-up.

## Optional Commands

Reusable prompt/runbook commands live in `docs/dev/_commands`. Commands can decompose broad work, but templates remain the normative output contract. Commands must not own current rules, target repository facts, accepted decisions, or source-of-truth evidence.

## Bootstrap Path For Repositories Without docs/dev

1. Use [`../README.md`](../README.md) as the canonical portable governance base.
2. Create `docs/dev/repository/README.md` from target repository evidence.
3. Create only the folder READMEs needed by current evidence. Do not create empty detailed documents.
4. Use the relevant `_template.md` files to write current rules, future proposals, AI rules, and decisions separately.
5. Record the bootstrap proof in `_bootstrap-audit.md` or an equivalent tracked audit file.
6. Leave unsupported patterns as open questions or future proposals instead of current rules.

## Optional Skill Usage

Workflow skills can help scan, draft, or audit documents, but they are not the source of truth. The source of truth is the target repository's tracked `docs/dev` files plus the evidence recorded inside them.
