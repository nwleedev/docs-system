---
title: docs/dev Stack-Neutral Template Governance
date: 2026-06-17
status: draft
---

# docs/dev Stack-Neutral Template Governance

## Summary

`docs/dev/README.md` and `docs/dev/_templates/**` must be updated through a design that lets agents and contributors create repository-specific development guidance before code work starts, without depending on any one technology stack. The design must preserve the current separation between portable governance, repository evidence, current rules, future proposals, AI working rules, and decisions.

The template improvements must stay portable. This design package must not make any one repository, sampled public repository, product category, organization, framework, language, package manager, or technology stack a required baseline for future `docs/dev` templates.

## Problem Frame

The current `docs/dev` system already separates portable governance from repository-specific evidence, but it still relies heavily on target repository evidence before a code pattern becomes current guidance. That protects against copying unsupported rules, but it leaves a gap when a repository has an installed or expected technology stack and no written guidance yet. In that gap, a user or agent can incorrectly assume that another similar repository's guidance exists in this repository, then write code with avoidable anti-patterns.

A smaller update that only stores reusable prompts would not solve the problem. The durable system must make missing guidance visible, classify stack-specific concerns before implementation, and provide a way to record recommended future patterns without promoting unsupported guidance to current rules.

When only a technology stack is known, concern collection is especially likely to become vague or misleading. A stack name does not explain whether a repository is a dashboard, platform, plugin ecosystem, design system, documentation site, data pipeline, or scheduling product. The design therefore needs a sampling step that researches several real public repositories with similar stack signals and extracts concern candidates from their actual files, scripts, workflows, topics, and product descriptions before applying those candidates locally.

The term `concern` will remain in the future `docs/dev` documentation, but it must be defined narrowly enough that Codex does not confuse it with user-facing features, UI screens, or generic product ideas. In this package, a concern means a concrete development guidance target: a recurring technical decision point, module boundary, library-composition pattern, state ownership problem, validation contract, generated-code rule, verification obligation, or operational risk that should be documented before code work depends on it.

GitHub CLI is the preferred command-line evidence collector when it is available, but the workflow cannot depend on it as the only possible mechanism. If `gh` is unavailable, unauthenticated, rate-limited, or blocked by environment policy, the future templates must allow equivalent GitHub evidence from documented alternatives while preserving reproducibility, source URLs, evidence summaries, limitations, and the no-clone/no-vendor guardrail.

## Scope Preservation

| Request Phrase | Coverage Obligation | Forbidden Narrowing | Completion Proof |
| --- | --- | --- | --- |
| `docs/dev/_templates` files and `docs/dev/README.md` files | Cover the root development guide governance and every template file under `docs/dev/_templates/**`. | Updating only one template or only root governance. | Traceability rows and plan units that enumerate both target surfaces. |
| `specific technology stack` must not be required | The future update must not hard-code React, TypeScript, Zustand, React Hook Form, or any other named stack as a prerequisite for the template system to work. | Replacing the current examples with a different hard-coded stack, or making stack-specific concerns mandatory for all repositories. | Requirements, plan, and audit checks for stack-neutral wording and optional stack-specific concern records. |
| `based on collected research and cross-validation` | Requirements must cite local template evidence and external examples that confirm the problem and solution pattern. | Relying only on the user's anecdote or only on one external article. | Research record with local evidence plus multiple external sources. |
| `write design package documentation` | Create durable docs under `docs/designs/docs-dev-template-governance-20260617-q7m2/` that can guide a later implementation. | Directly editing `docs/dev/README.md` or templates without the design baseline. | Git-tracked design package files with no changes to target implementation files. |
| `technology stack and repository topic concerns` | Define how to collect and interpret concern areas from stack evidence, repository topic evidence, and operational quality evidence. | Treating dependency names alone as a complete concern inventory, or treating README text alone as repository topic truth. | A1 requirements, research record, decision, plan units, traceability, and audit rows. |
| `only technology stack is known` | Define how to research multiple real public repositories with similar stack signals before collecting concern candidates. | Guessing concern areas directly from a stack name, or copying one repository's practices as universal guidance. | A2 requirements, GitHub CLI research evidence, decision, plan, traceability, and audit rows. |
| `use the term concern but define it clearly` | Require future `docs/dev/README.md` and templates to define `concern` as a development guidance target, not a user-facing feature or UI surface by default. | Replacing the term with another vocabulary, leaving the term ambiguous, or treating every product feature as a docs/dev concern. | A3 requirements, terminology decision, plan, traceability, and audit rows. |
| `research concrete concerns from GitHub repositories` | Define a fine-grained GitHub research method that moves from repository sampling to manifests, scripts, workflows, file trees, direct code reads, official API contracts, and confidence-scored concern records. | Inferring concerns from repository descriptions alone, using one code search hit as proof, or ignoring weak and conflicting GitHub search evidence. | A3 research record, decision, plan, traceability, and audit rows. |
| `gh cli unavailable alternative` | Define acceptable fallback methods for GitHub repository research when `gh` cannot be used. | Treating `gh` availability as mandatory, skipping repository sampling when `gh` fails, or using non-reproducible browsing notes as evidence. | A4 requirements, plan, traceability, and audit rows. |
| `do not depend on a specific repo or stack` | Make the design package explicitly require stack-neutral and repository-neutral template improvements. | Encoding sampled repositories, this repository, or one stack as the default template baseline. | A4 requirements, plan, traceability, and audit rows. |

## Existing Package Inventory

Not applicable - initial requirements.

## Requirement Amendments

| Amendment ID | Date | Request Source | Change Type | Preserved Requirement IDs | New Requirement IDs | Modified Requirement IDs | Superseded Requirement IDs | Affected Sections | Decision Record | Plan Impact | Traceability Impact | Audit Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A0 | 2026-06-17 | Initial user request. | Initial | None. | R1-R11 | None. | None. | All sections. | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Initial plan required. | Initial traceability required. | Initial completion audit required. |
| A1 | 2026-06-17 | User request to add research on collecting concerns from technology stack and repository topic. | Adds | R1-R11 | R12-R16 | None. | None. | Scope Preservation, Requirements, Acceptance Examples, Research Requirements, Sources. | `decisions/0002-use-evidence-first-concern-discovery.md` | Add concern discovery implementation unit. | Add research and verification mappings. | Add audit rows for concern discovery requirements. |
| A2 | 2026-06-17 | User request to research using real GitHub repositories when only a technology stack is known. | Adds | R1-R16 | R17-R22 | None. | None. | Problem Frame, Requirements, Acceptance Examples, Research Requirements, Sources. | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Add repository sampling implementation unit. | Add GitHub CLI research and verification mappings. | Add audit rows for repository sampling requirements. |
| A3 | 2026-06-17 | User request to keep the term `concern`, define it clearly, and add research on fine-grained GitHub repository concern inference. | Adds | R1-R22 | R23-R30 | None. | None. | Problem Frame, Scope Preservation, Requirements, Acceptance Examples, Research Requirements, Sources. | `decisions/0004-define-concern-as-development-guidance-target.md` | Add terminology and fine-grained inference implementation unit. | Add terminology and GitHub code-evidence mappings. | Add audit rows for concern definition and detailed inference requirements. |
| A4 | 2026-06-17 | User request to add alternatives when `gh` is unavailable and to make repository/stack non-dependence explicit. | Adds | R1-R30 | R31-R35 | None. | None. | Summary, Problem Frame, Scope Preservation, Requirements, Acceptance Examples, Research Requirements, Sources. | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Add fallback evidence and portability implementation unit. | Add fallback and portability mappings. | Add audit rows for fallback and portability requirements. |

## Key Decisions

- **Classify missing guidance before promoting rules:** Missing stack-specific guidance should be represented as `Open Question`, `Local Constraint`, `Recommended Future Pattern`, or a current rule only after target evidence exists.
- **Keep templates stack-neutral:** The root README and templates may explain how to discover stack-specific concerns, but they must not require any named technology stack.
- **Add a guidance gap mechanism:** Future implementation should add a stack-agnostic concern inventory or scorecard-like audit so similar repositories can reveal missing guidance without relying on user memory.
- **Use evidence-first concern discovery:** Future implementation should collect concerns from manifests and lockfiles, repository purpose and metadata, source layout, verification commands, documentation, and operational quality signals before deciding which `docs/dev` guides are missing.
- **Sample real repositories for stack-only inputs:** When a user provides only a technology stack, future implementation should use GitHub CLI or equivalent GitHub evidence to inspect multiple active, non-fork, non-archived public repositories before proposing concern candidates.
- **Keep `concern`, but define it precisely:** Future implementation should explicitly define `concern` as a development guidance target and require GitHub-derived concerns to be backed by direct evidence, confidence, and local applicability review.
- **Do not depend on `gh`, one repository, or one stack:** Future implementation should prefer `gh` when available, but must define equivalent GitHub evidence fallbacks and keep all templates repository-neutral and stack-neutral.

## Requirements

**Target Surface**

- R1. The design must cover future updates to `docs/dev/README.md`.
- R2. The design must cover future updates to every file currently under `docs/dev/_templates/**`.
- R3. The design must not require direct access to consumer repository root folders; it must describe a reusable process that can be applied when a target repository is explicitly selected later.

**Stack-Neutral Governance**

- R4. `docs/dev/README.md` and `docs/dev/_templates/**` must remain technology-stack neutral: they may describe categories such as state management, form handling, routing, rendering, build, test, generated code, or API integration, but they must not depend on any named stack to function.
- R5. Any future stack-specific example must be optional, labeled as an example, and paired with guidance that equivalent concerns should be identified from the target repository's own manifests, configuration, source layout, official documentation, and decisions.
- R6. The future update must remove or generalize any existing wording that makes this repository's current stack appear to be the default for other repositories.

**Guidance Gap Management**

- R7. The design must require a repository guidance inventory that maps detected or expected concern areas to existing `docs/dev` documents, missing documents, and classification status.
- R8. The design must support guidance before new code exists by allowing `Recommended Future Pattern` or equivalent non-current guidance when the target stack is confirmed by manifests/configuration and external official documentation, but local code evidence is not yet present.
- R9. The design must prevent unsupported rules from being promoted to current guidance; current rules still require target repository evidence and cross-validation.

**Concern Discovery**

- R12. The future update must define a stack evidence collection flow that inspects manifests, lockfiles, dependency metadata, build scripts, framework configuration, generated-code configuration, and verification commands before proposing technology-related guidance concerns.
- R13. The future update must define a repository topic collection flow that inspects README or product documentation, package metadata, catalog-like metadata when present, source entrypoints, route or API surfaces, ownership, lifecycle, and domain vocabulary before proposing product or domain concerns.
- R14. The future update must define an operational quality concern flow that inspects testing, build, dependency update, generated artifact, security, maintenance, ownership, documentation, and release evidence as candidate guidance areas.
- R15. The future update must require every collected concern to record source evidence, concern category, proposed `docs/dev` owner folder, classification, confidence, and follow-up.
- R16. The future update must require cross-validation before treating a concern as actionable: at least two evidence types should support the concern when practical, and conflicting evidence must be recorded as an `Open Question` rather than silently resolved.

**Stack-Only Repository Sampling**

- R17. When only a technology stack is known, the future update must require sampling multiple real public repositories before collecting concern candidates.
- R18. Repository sampling must use explicit selection criteria, including activity, non-archived status, non-fork status, sufficient repository size or adoption signal, and relevance to the stack query.
- R19. Repository sampling must inspect more than repository descriptions: it must inspect metadata, root files, manifest or lock evidence, scripts, workflow names, source layout, documentation, and release or maintenance signals when available.
- R20. The future update must require concern candidates from sampled repositories to be grouped into common concerns, divergent concerns, and repository-specific concerns.
- R21. The future update must require local applicability review before sampled concerns affect the target repository; a concern found in external repositories must not become a current rule without target repository evidence.
- R22. The future update must record GitHub research commands or equivalent reproducible evidence for sampled repositories, while avoiding cloning or storing external repositories inside this repository.

**Concern Terminology And Fine-Grained Inference**

- R23. The future update must continue using the term `concern` and define it in `docs/dev/README.md` and relevant templates before any concern inventory or concern discovery instructions appear.
- R24. The future definition must state that a `concern` is a concrete development guidance target, not merely a user-facing feature, UI screen, product idea, dependency name, or broad technology category.
- R25. The future definition must include representative concern shapes: library-composition patterns, client/server or layer boundaries, state ownership, validation contracts, generated artifacts, verification obligations, operational risks, and documentation ownership.
- R26. The future update must require every detailed concern to record the concrete decision point, risk if mishandled, source evidence, affected code or docs surface, guidance status, confidence, and local applicability state.
- R27. The future GitHub research method must use an evidence ladder: repository role labeling, metadata, manifests, scripts, workflows, file tree, direct file reads, code search, official library/framework documentation, and target applicability review.
- R28. The future GitHub research method must treat `gh search code` and repository descriptions as discovery aids, not proof; failed searches, weak hits, stale README claims, and dependency-description conflicts must be recorded as low confidence or `Open Question`.
- R29. The future GitHub research method must support fine-grained concerns that apply across multiple repositories using the same technology stack by comparing actual usage sites and grouping them as shared stack concerns, stack-plus-domain concerns, or repository-specific concerns.
- R30. The future GitHub research method must require official API or framework documentation cross-validation before a library-specific or framework-boundary concern becomes a `Recommended Future Pattern`.

**Fallback Evidence And Portability**

- R31. The future update must state that `gh` is preferred for GitHub repository evidence when available, but not mandatory for using the `docs/dev` templates.
- R32. If `gh` is unavailable, unauthenticated, rate-limited, or blocked, the future update must allow equivalent GitHub evidence from alternatives such as the GitHub web UI, GitHub REST API through `curl` or another approved HTTP client, an installed GitHub MCP or connector, downloaded single-file views, repository archive inspection in an approved temporary location, or manually recorded stable GitHub URLs.
- R33. Every fallback evidence path must record the tool or interface used, source URLs, query or navigation steps, inspected files or pages, retrieved date, evidence summary, limitations, and confidence impact.
- R34. Fallback evidence must preserve the same guardrails as `gh` evidence: no sampled external repository may be cloned or vendored into this repository without a separate decision, and sampled evidence must not become a current rule without target repository evidence.
- R35. Future `docs/dev` template improvements must remain repository-neutral and stack-neutral: they may include optional examples and sampled evidence, but must not require this repository, a sampled public repository, React, Next.js, TypeScript, TanStack Query, React Hook Form, FSD, or any other named stack as a default baseline.

**Evidence, Traceability, And Audit**

- R10. The design package must record cross-validated research using at least local repository evidence and external public examples for documentation management, golden paths, scorecards/conformance, and library-level anti-pattern prevention.
- R11. The design package must include an implementation plan, traceability matrix, and completion audit that a future implementation can use without narrowing the scope.

## Acceptance Examples

- AE1. **Given** a repository uses a state management library and has no state management guide, **when** a contributor audits `docs/dev`, **then** the missing guide is recorded as a gap or recommended future pattern instead of being silently assumed from another repository.
- AE2. **Given** no local code exists yet for a form library, **when** official library documentation describes a safer context-based pattern, **then** a non-current recommended pattern can be documented without claiming it is already a current rule.
- AE3. **Given** `docs/dev/_templates/engineering/README.md` mentions a specific stack list, **when** the future implementation updates templates, **then** that wording is generalized so the template remains portable across stacks.
- AE4. **Given** a future agent only reads the design package, **when** it plans implementation, **then** it can identify all target files, required classifications, and verification checks without opening the original user prompt.
- AE5. **Given** a repository has a lockfile, framework configuration, and build script, **when** concerns are collected, **then** those files are used to infer stack concern categories before any technology-specific guide is proposed.
- AE6. **Given** a repository README says it is a dashboard and the source routes show admin workflows, **when** concerns are collected, **then** the inventory records product-surface and workflow concerns separately from framework concerns.
- AE7. **Given** a repository has CI tests but no dependency update or security guidance, **when** operational concerns are collected, **then** the gap is classified without adding automation or CI requirements to this package.
- AE8. **Given** the only input is a web framework name, **when** concern discovery starts, **then** the agent samples multiple active public repositories and separates framework concerns from product concerns such as scheduling, database platform, design system, observability, or documentation.
- AE9. **Given** sampled repositories show `e2e`, `i18n`, `codegen`, and release workflows, **when** concern candidates are recorded, **then** those candidates remain external research until target repository evidence confirms applicability.
- AE10. **Given** a GitHub search result includes framework source repositories, examples, libraries, and products, **when** repositories are selected, **then** the agent filters and labels sample roles instead of treating all search results as equivalent product references.
- AE11. **Given** `docs/dev/README.md` introduces concern discovery, **when** Codex reads the guide later, **then** it sees that `concern` means a development guidance target and not a user-facing feature or UI by default.
- AE12. **Given** several repositories use React Hook Form and TanStack Query, **when** GitHub research inspects actual files, **then** it can record fine-grained concerns such as form default value ownership, mutation success invalidation, reset timing, query key scope, and API client placement instead of only recording `forms` or `server state`.
- AE13. **Given** a README claims a technology is used but the manifest does not show the dependency, **when** the concern is evaluated, **then** the conflict is recorded as low confidence or `Open Question`.
- AE14. **Given** GitHub code search returns no results for an expected usage pattern, **when** file tree and direct file reads reveal relevant files, **then** the research records code search as incomplete and uses direct evidence instead of dropping the concern.
- AE15. **Given** `gh` is not installed or cannot authenticate, **when** stack-only repository sampling is needed, **then** the agent uses an approved fallback such as GitHub web pages, GitHub REST API, a GitHub connector, or stable file URLs and records the fallback method and limitations.
- AE16. **Given** sampled fallback evidence comes from a specific public repository, **when** future templates are updated, **then** the repository remains an example or evidence source and does not become the required template baseline.
- AE17. **Given** a future template mentions React, Next.js, TypeScript, TanStack Query, React Hook Form, or FSD, **when** a reviewer checks portability, **then** the mention is clearly optional/example-labeled or removed.

## Success Criteria

- A future planner can update `docs/dev/README.md` and `docs/dev/_templates/**` without inventing scope.
- A reviewer can detect if a future implementation hard-codes a technology stack into portable governance.
- A future agent can distinguish current rules, recommended future patterns, missing evidence, and target repository constraints.
- A future agent can collect concerns from stack, topic, source layout, verification, and operational evidence without using dependency names as the only signal.
- A future agent can handle stack-only inputs by researching representative public repositories before proposing concern candidates.
- A future agent can use the word `concern` consistently as a development guidance target and can distinguish it from product features, UI, and broad technology labels.
- A future agent can infer fine-grained concerns from GitHub repositories by tracing evidence from stack signals to actual usage sites, official API contracts, confidence, and local applicability.
- A future agent can continue repository sampling when `gh` is unavailable by using documented equivalent GitHub evidence with recorded limitations.
- A future reviewer can verify that docs/dev template improvements do not depend on any specific repository, sampled repository, organization, or named technology stack.
- The design package itself is tracked, self-contained, and does not depend on session memory.

## Required Artifacts And Persistence

| Artifact | Required For | Expected Persistence | Completion Proof | Decision Needed |
| --- | --- | --- | --- | --- |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/requirements.md` | R1-R35 | Tracked | `git status --porcelain` shows the package as normal tracked-ready files. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/research/README.md` | R10, R12-R35 | Tracked | File exists and indexes research records. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0001-cross-validated-guidance-management.md` | R10 | Tracked | Research record contains local and external evidence. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0002-concern-discovery-from-stack-and-topic.md` | R12-R16 | Tracked | Research record contains stack, topic, and operational concern discovery evidence. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0003-stack-only-concern-discovery-from-public-repositories.md` | R17-R22 | Tracked | Research record contains GitHub CLI and public repository sampling evidence. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0004-concern-terminology-and-fine-grained-github-inference.md` | R23-R30 | Tracked | Research record contains concern terminology and detailed GitHub inference evidence. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/plan.md` | R1-R35 | Tracked | Plan maps requirements to implementation units. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/traceability.md` | R1-R35 | Tracked | Traceability maps requirements to research, decision, plan, verification, and audit. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/completion-audit.md` | R1-R35 | Tracked | Audit records requirement-level evidence for this design package. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/README.md` | R4-R9, R12-R35 | Tracked | Decision index links all accepted decisions. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/0001-classify-missing-guidance-without-stack-coupling.md` | R4-R9 | Tracked | Decision record explains classification and stack-neutrality. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/0002-use-evidence-first-concern-discovery.md` | R12-R16 | Tracked | Decision record explains how concerns are collected without stack coupling. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | R17-R22 | Tracked | Decision record explains repository sampling before stack-only concern selection. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/0004-define-concern-as-development-guidance-target.md` | R23-R30 | Tracked | Decision record explains retaining and defining `concern` plus detailed inference guardrails. | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/decisions/0005-keep-github-evidence-and-templates-portable.md` | R31-R35 | Tracked | Decision record explains `gh` fallback evidence paths and repository/stack-neutral template guardrails. | None |

## Scope Boundaries

**Deferred**

- Implementing changes to `docs/dev/README.md`.
- Implementing changes to `docs/dev/_templates/**`.
- Adding automated scorecard scripts, CI checks, or new dependencies.
- Auditing the named consumer repositories.
- Cloning sampled public repositories into this repository.
- Treating sampled repository practices as accepted current rules for this repository.
- Implementing the `concern` definition directly in `docs/dev/README.md`.
- Implementing fine-grained GitHub concern inference instructions directly in `docs/dev/_templates/**`.
- Implementing fallback GitHub evidence instructions directly in `docs/dev/README.md` or templates.

**Out Of Scope**

- Writing stack-specific guides for any consumer repository in this package.
- Accessing consumer repository root folders.
- Creating code examples for a specific library as current guidance.
- Changing runtime application code or tests.

## Dependencies And Assumptions

- The target implementation will happen in this repository after this design package is reviewed or accepted.
- Existing `docs/dev` governance remains the baseline unless a future decision supersedes it.
- Public external sources remain recoverable enough to re-check the claims used here.

## Research Requirements

- Research must use local evidence from `docs/dev/README.md`, `docs/dev/_templates/**`, and `docs/designs/README.md`.
- Research must use external examples for documentation quality, discoverability, golden paths, scorecards/conformance, and library anti-pattern prevention.
- Research must use external examples for stack evidence, repository metadata, repository purpose, and operational quality concern discovery.
- Research must use GitHub CLI or equivalent GitHub evidence when the claim depends on real public repository sampling.
- Research must use direct repository evidence and official library or framework documentation when the claim depends on fine-grained technical concern inference.
- Research must record tool availability and fallback limitations when `gh` is not used for GitHub evidence.
- Library-specific examples may support the need for a concern inventory, but they must not become required stack defaults.

## Traceability Requirements

Create `traceability.md` because the request spans multiple artifacts, includes cross-validation, and must preserve a stack-neutral constraint across future implementation.

## Completion Audit Requirements

Create `completion-audit.md` and audit the design package itself. The target implementation files should remain unchanged in this package.

## Sources

- `docs/designs/README.md`: package governance, artifact persistence, research, traceability, and completion audit rules.
- `docs/dev/README.md`: current portable development guide governance and repository evidence separation.
- `docs/dev/_templates/README.md`: current template routing, target repository evidence, and common completion rules.
- `docs/dev/_templates/engineering/README.md`: current stack-specific wording that should be generalized.
- Microsoft Engineering Fundamentals Playbook documentation page: documentation gaps include non-existent, hidden, incomplete, inaccurate, obsolete, duplicate, and afterthought documentation.
- Backstage TechDocs documentation: docs-as-code and discoverable service documentation pattern.
- Spotify Engineering Golden Paths article: opinionated supported paths and golden state checks reduce fragmentation.
- Cortex scorecard examples: scorecards can make missing development maturity and operational readiness practices visible.
- Nx module boundary documentation: conformance-like static checks can enforce architectural constraints.
- React, React Hook Form, and Zustand official documentation: library-level official docs can support prevention patterns without making them universal template defaults.
- GitHub dependency graph documentation: manifest and lock files identify package ecosystems, dependencies, versions, licenses, and vulnerability context.
- GitHub README documentation: README files communicate project purpose, usefulness, getting-started information, help channels, and maintainers.
- Backstage Software Catalog documentation: software metadata can include ownership, software type, lifecycle, system, tags, and links.
- OpenSSF Scorecard documentation: source, build, dependency, testing, maintenance, packaging, generated artifact, and security checks can inform operational quality concerns.
- GitHub CLI `gh search repos` documentation: repository search can filter by archived state, forks, language, stars, owner, and JSON fields.
- GitHub CLI `gh repo view` and `gh api` evidence: public repositories can be inspected for topics, languages, root files, package scripts, workflows, releases, and maintenance signals without cloning.
- Public repository samples inspected with `gh`: `calcom/cal.com`, `supabase/supabase`, and `grafana/grafana` show that similar TypeScript or web stack signals can map to different product and operational concerns.
- ISO/IEC/IEEE 42010 and architecture documentation examples: `concern` is a recognized architecture-description concept, but this package narrows the term for `docs/dev` as a development guidance target.
- arc42 Crosscutting Concepts and Quality Requirements: technical rules, implementation rules, quality scenarios, risks, and glossary terms can be documented separately from product features.
- GitHub code search documentation and `gh search code` manual: code search supports file/path scoped discovery but has indexing and syntax limitations, so direct file reads are required for confirmation.
- GitHub web UI, GitHub REST API, approved HTTP clients, GitHub MCP or connector tooling, and stable GitHub file URLs are acceptable fallback evidence paths when `gh` is unavailable, as long as limitations and source URLs are recorded.
- Context7-backed React Hook Form, TanStack Query, and Next.js documentation: official APIs confirm detailed concern shapes such as async default values and reset behavior, query invalidation and query keys, and server/client module boundaries.
- Public repository samples inspected with `gh`: `Oluwashina/NextJs-TanstackQuery`, `Onddrej/inqool-interview-app`, and `rafahbrito/pizza-shop-dashboard` show how dependency coexistence, code usage, and conflicting README or manifest evidence affect concern confidence.
