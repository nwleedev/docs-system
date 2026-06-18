# Development Guide Governance

This document is the canonical `docs/dev` development-guidance governance base that can be reused across repositories. Repository-specific technology stacks, source lists, baseline evidence, external checkouts, and local constraints belong in [repository](repository/README.md), not in this document as default rules.

`docs/dev` does not replace `AGENTS.md` or workflow skills. This folder preserves long-lived development guidance, current coding rules, evidence, future proposals, AI application rules, and decision history as human-reviewable, Git-tracked documents. Related skills are optional aids, not the source of truth.

## Purpose

- Make applicable current rules and evidence discoverable before writing new code.
- Physically separate current guidance, future proposals, local evidence, AI rules, and decision records.
- Provide a bootstrap sequence when a target repository has no `docs/dev` folder or only a partial one.
- Treat best/anti-pattern examples as teaching artifacts that explain intent, failure mode, impact, alternatives, and verification, not as simple code samples.
- Surface missing development guidance targets before implementation and prevent current rules from being mixed with future proposals.

## Development Guidance Targets

`development guidance target` means a concrete development decision point that can be recorded in `docs/dev` as a current rule, future proposal, local constraint, or open question. It may be called a `concern` for short, but it does not mean a user feature, UI screen, product idea, dependency name, or broad technology category by itself.

Representative targets include:

- library composition, state ownership, validation contract, generated artifact rule
- client/server boundary, module boundary, import direction, public API ownership
- verification obligation, release or maintenance risk, documentation ownership
- domain vocabulary, state meaning, business invariant interpretation

If target repository evidence is insufficient, do not write a current rule. Classify the item as `Open Question`, `Local Constraint`, `Recommended Future Pattern`, or `Not Applicable`, and record the required follow-up.

## Folder Ownership

| Path            | Owns                                                                                                 | Does Not Own                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `architecture/` | Module boundaries, public APIs, import direction, ownership, and runtime flow that apply now | Stack-specific API usage, test authoring, future architecture proposals |
| `engineering/`  | Rules for writing and verifying code with the current stack, tests, lint, and generated-code rules | Feature ownership, business vocabulary, long-term migration proposals |
| `domain/`       | Product/business vocabulary, state meaning, invariants, and business interpretation | UI/library usage, module import rules |
| `evolution/`    | Improvement candidates, alternatives, migration conditions, and technical debt that are not current rules | Current rules to apply immediately |
| `ai/`           | How AI reads and applies `docs/dev`, uncertainty handling, and legacy handling | Current engineering rules that humans must review |
| `decisions/`    | Accepted/deferred/superseded decisions, rationale, consequences, and revisit triggers | Simple README indexes or one-off work notes |
| `_templates/`   | Folder-specific templates and bootstrap audits for authoring new `docs/dev` documents | Root governance or current rules for a target repository |
| `_commands/`    | Prompt/runbook commands reusable across repositories | Current rules, target repository evidence, or source packs |
| `repository/`   | Target-repository-specific stack, source layout, baseline evidence, audit history, and local constraints | Portable governance or current rules to copy across repositories |

## Target Decomposition

`docs/dev` is not a system for documenting technology-stack names. It is a system for decomposing a technology stack into sufficiently granular `development guidance target`s and documenting them with evidence. `Next.js`, a specific file name, a specific source list, or a specific item count cannot be a portable baseline.

When a technology stack or broad research request is provided, derive targets in this order first.

| Step | Rule |
| --- | --- |
| Input classify | Identify whether the input is an explicit concern list, issue, meeting note, external document, existing docs, technology-stack name, or target repository evidence. |
| Target derive | Do not stop at dependency names or broad categories; decompose the work into boundary, ownership, API, validation, state, verification, migration, and documentation decisions. |
| Evidence attach | Attach applicable evidence to each target, such as repository evidence, official docs, public repository sampling, standards, or existing decisions. |
| Route owner | Route each target to `repository` evidence or to the applicable owner document among `architecture`, `engineering`, `domain`, `evolution`, `ai`, and `decisions`. |
| Classify | Classify the target as `Current Rule`, `Recommended Future Pattern`, `Open Question`, `Local Constraint`, or `Not Applicable`. |
| Pattern obligation | Record best pattern, anti-pattern, scenario coverage, verification, and follow-up obligations per target. |

When an explicit concern list exists, track every source item. When there is no explicit list, derive targets from stack evidence and official documentation. In both cases, the goal is not to match an item count; the goal is to expose the decision points that implementers actually need to judge with enough granularity.

## Reading Order

### Before Implementation

1. Use this README to confirm folder ownership and repository evidence locations.
2. Read the target repository's [repository](repository/README.md) document to confirm the technology stack, source layout, generated code, verification commands, and local constraints.
3. If a `Development Guidance Target Inventory` exists, check the classification and owner folder for the target you are working on.
4. If the work changes structure or import boundaries, read [architecture](architecture/README.md).
5. If the work involves language, framework, API, test, lint, build, or generated-code rules, read [engineering](engineering/README.md).
6. If business vocabulary or state meaning is ambiguous, check [domain](domain/README.md).
7. Check alternatives or migration candidates in [evolution](evolution/README.md), but do not apply them as current rules.
8. When working with AI, follow the reading order and uncertainty-handling rules in [ai](ai/README.md).
9. If the work conflicts with an existing decision or changes source-of-truth ownership, check [decisions](decisions/README.md).

### Before Creating Or Updating docs/dev

1. Choose the target output folder from this README.
2. Confirm target repository evidence in [repository](repository/README.md).
3. Choose the folder-specific template from [\_templates](./_templates/README.md).
4. Confirm final placement using the Include, Exclude, and Dynamic File Policy sections in the target `docs/dev/<folder>/README.md`.
5. When creating a new structure or making a major update, record evidence and unresolved gaps in [\_bootstrap-audit](./_templates/_bootstrap-audit.md) or an equivalent audit.
6. For a whole technology stack or broad prevention-pattern request, first create a target inventory through the `Target Decomposition` process, then route each target to evidence, owner folder, classification, and pattern obligation.

## Development Guidance Target Inventory

Each repository may keep a target inventory in `repository/README.md` or `repository/<topic>.md`. This inventory does not own current rules; it links evidence and classification to top-level owner folders.

| Field | Required Meaning |
| --- | --- |
| Target | A concrete development guidance target. Do not use only a dependency name or feature name. |
| Decision point | The boundary, ownership, API, validation, verification, migration, or documentation decision the implementer must actually make. |
| Risk | The bug, coupling, review blind spot, user impact, or maintenance cost that appears when the target is handled incorrectly. |
| Evidence | repo-relative source/config/test/doc paths, official docs, stable public URLs, or recorded GitHub evidence. |
| Owner folder | `architecture`, `engineering`, `domain`, `evolution`, `ai`, `decisions`, or `repository` evidence. |
| Classification | `Current Rule`, `Recommended Future Pattern`, `Open Question`, `Local Constraint`, or `Not Applicable`. |
| Confidence | `High`, `Medium`, or `Low`, with conflict and limitation notes. |
| Follow-up | next evidence, decision, docs update, or verification needed. |

Use `Recommended Future Pattern` when target repository evidence is not yet sufficient for promotion to a current rule, but stack/config evidence plus official documentation or public repository evidence supports a future direction. Keep evidence and classification in `repository/`, and keep interpretation and application direction in the relevant owner-folder document.

## Stack-Only Repository Sampling

Do not infer targets from a technology-stack name alone. First inspect multiple real public repositories and separate common, divergent, and repository-specific target candidates.

| Step | Rule |
| --- | --- |
| Select samples | Prefer active, non-archived, non-fork repositories, and record stack relevance plus adoption signals. The default is five repositories; this can be reduced to three when justified. |
| Inspect evidence | Do not rely on descriptions alone; inspect manifests, lockfiles, scripts, workflows, source layout, docs, releases, and maintenance signals. |
| Group targets | Classify candidates as `Shared Stack`, `Stack Plus Domain`, or `Repository Specific`. |
| Review local applicability | Sampled evidence is a discovery aid. It cannot become a current rule without target repository evidence. |
| Preserve evidence | Record commands, URLs, inspected paths, retrieved date, limitations, and confidence impact. |

## GitHub Evidence Fallbacks

Prefer `gh` for collecting GitHub evidence, but do not make it mandatory. If `gh` is unavailable because of installation, authentication, rate limits, or environment policy, the following fallbacks are acceptable.

| Preferred Path | Accepted Fallback | Required Recording |
| --- | --- | --- |
| `gh search repos`, `gh repo view`, `gh api`, `gh search code` | GitHub Web UI, GitHub REST API through an approved HTTP client, installed GitHub MCP or connector output, stable GitHub file URLs | tool/interface, source URLs, query or navigation steps, inspected files/pages, retrieved date, evidence summary, limitations, confidence impact |
| Direct repository content reads | Stable blob/raw URLs, GitHub Web file view, REST API file endpoint | exact path, branch or commit context when available, relevant code/config summary, limitations |
| Structured JSON output | Manual evidence table or connector summary | field names used, missing fields, confidence impact |

Temporary archive or clone inspection is not a normal fallback. Use it only after a separate decision or explicit implementation note records the temporary location, cleanup rule, and no-vendor boundary.

## Target Repository Evidence

Each repository preserves local evidence under `docs/dev/repository/`, separate from portable governance.

| Repository Path        | Required Content                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `repository/README.md` | repository purpose, technology stack, source layout, generated code, verification commands, external checkouts, local constraints, baseline evidence, audit history, linked current-rule folders |

Documents under `repository/` do not own current rules. Current rules are owned by top-level `architecture/`, `engineering/`, `domain/`, `ai/`, and `decisions`; `repository/` preserves the evidence and constraints needed to apply those rules to the target repository.

Do not create a same-named evidence taxonomy such as `docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` by default. If folder-specific local evidence is needed, link from the evidence table in `repository/README.md` to the top-level current-rule folder.

Do not create an additional scope axis such as `docs/dev/application/` by default. Add one only when multiple apps, multiple packages, or a real need to separate repository-wide evidence from application-specific evidence has been established through a decision record that defines ownership and target output.

## Bootstrap Flow

### Repository Without docs/dev

1. Use this README as the canonical governance base for `docs/dev/README.md`.
2. Collect target repository evidence and create `docs/dev/repository/README.md`.
3. Create only the folder READMEs that current evidence supports. Do not create empty detailed documents or TODO documents.
4. Use the required folder-specific templates from [\_templates](./_templates/README.md).
5. Record created documents, source evidence, current-rule promotion evidence, open questions, and leaked repository-specific assumptions in `_bootstrap-audit.md` or an equivalent audit.

### Repository With Existing Development Docs

1. Inventory existing `docs/dev`, README, ADRs, contributing docs, and AGENTS-style guidance.
2. Classify existing content as current rule, local evidence, future proposal, AI rule, decision, or open question.
3. Before removing or replacing anything, check whether an accepted decision or explicit user instruction is required.
4. Align portable root governance with this README and move repository-specific evidence to `repository/`.
5. Audit that existing links and reading flow remain intact.

## Existing Docs Inventory

Before starting a major update, inspect the following sources.

| Source                            | What To Extract                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `docs/dev/**`                     | current rules, folder contracts, existing decisions, AI rules                                 |
| `docs/designs/**`                 | accepted requirements, research, plans, traceability, completion audit                        |
| `AGENTS.md` or equivalent         | immediate working rules that should not be duplicated as long-form guidance without rewriting |
| source/config/test files          | local evidence for stack, architecture, generated output, verification commands               |
| Git history                       | why a rule or split was added, especially for docs/dev refinements                            |
| public official docs or standards | external support for best/anti-pattern guidance                                               |

## Source Evidence Policy

- Current rules need target repository evidence. Repeated local code alone is not enough if it conflicts with official guidance.
- External evidence needs a specific claim used, not a broad link dump.
- Local or restricted evidence must be summarized enough for a future reviewer to understand the obligation without private context.
- Repo-specific paths, stacks, generated output names, and external checkout constraints belong in `repository/`, not in this portable README.
- If evidence is missing, record `Open Question`, `Local Constraint`, or `Recommended Future Pattern` instead of inventing a current rule.
- Code search and repository descriptions are discovery aids, not proof. Confirm important claims through manifests, direct file reads, workflows, tests, official docs, or target repository evidence.

## Portability Checks

Before committing a `docs/dev` template or root governance update, verify that portable docs still work without this repository, a sampled public repository, an organization, or a named technology stack.

| Check | Fails If |
| --- | --- |
| Repository neutrality | A local or sampled repository becomes the required baseline. |
| Stack neutrality | A named stack is required for the template system to work instead of being optional evidence or an example. |
| Evidence ownership | `repository/` starts owning current rules, or top-level folders duplicate evidence tables. |
| Rule promotion | External or sampled evidence becomes `Current Rule` without target repository evidence. |
| Tool portability | GitHub evidence instructions have only one required tool path and no equivalent fallback. |

## Template Usage

When creating a new `docs/dev` document or making a major update, use [\_templates](./_templates/README.md). `_templates` is a folder-specific authoring router and does not own root README governance.

For broad target-decomposition work that needs repeatable execution, use [\_commands](./_commands/README.md). `_commands` owns only prompts/runbooks and does not own current rules or repository evidence.

Document examples must meet the following criteria.

- `Scenario Coverage` appears before examples.
- best patterns explain intent, applicability, impact, and verification.
- anti-patterns explain failure mode, user or maintenance impact, safer alternative, and target-repository constraints.
- AI rules or decisions that do not require code examples may use behavior examples or decision cases instead.

When writing detailed documents for a large or granular target set, do not force a one-to-one match between target count and document count. Group targets by owner folder and scenario coverage first, and preserve traceability showing which best/anti pattern, verification, or open question handles each target ID even when one document covers multiple targets.

## Repository Evidence

The current repository evidence is in [repository](repository/README.md). When copying this `docs/dev` structure to another repository, do not copy the contents of `repository/` as-is; rewrite it from the target repository's source, config, tests, existing docs, and decisions.

## Decision Records

Create a decision record in [decisions](decisions/README.md) in the following cases.

- Source-of-truth ownership changes.
- Accepted guidance is deleted, moved, or superseded.
- A `docs/dev/application/` scope axis is added.
- A new rule conflicts with an existing current rule.
- A new dependency, script, CI change, security exception, or public API change affects docs/dev guidance.

## Completion Audit

Every `docs/dev` bootstrap or major update must verify the following.

- The root README remains repository-neutral governance.
- Repository-specific stack, source list, baseline evidence, and local constraints are in `repository/`.
- Current rules, future proposals, AI rules, decisions, and repository evidence are physically separated.
- `_templates/README.md` works only as a folder-specific authoring router.
- `docs/dev/_templates/root-readme.md` was not created.
- `docs/dev/application/` was not created without a decision.
- A same-named evidence taxonomy such as `docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` is not left in the default structure.
- named stack, file name, source list, item count, sampled repository, or worked example is not required as a portable baseline.
- broad technology-stack work is decomposed into evidence-backed development guidance targets before current rules are written.
- all links are repo-relative and valid.
