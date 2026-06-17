---
title: docs/dev Stack-Neutral Template Governance Plan
type: docs
status: active
date: 2026-06-17
origin: docs/designs/docs-dev-template-governance-20260617-q7m2/requirements.md
---

# docs/dev Stack-Neutral Template Governance Plan

## Summary

Future implementation should update `docs/dev/README.md` and `docs/dev/_templates/**` to add a stack-neutral guidance gap workflow. The implementation must preserve the current evidence-based rule promotion model while adding a way to record missing or recommended guidance before code exists.

This plan is now aligned to the full design package through A5 / R40. The next implementation should keep the existing template-based system, then add a concern discovery layer, stack-only repository sampling instructions, `gh` fallback evidence paths, repository-neutral / stack-neutral portability checks, and a pre-implementation open-question checkpoint.

## Problem Frame

The current templates distinguish current rules from future proposals, but they do not yet require a concern-level inventory that reveals missing guidance across similar repositories. This plan describes how to update the documentation system without hard-coding any technology stack.

The implementation should not rewrite the `docs/dev` architecture from scratch. It should extend the current root governance, folder ownership model, repository evidence model, folder-specific templates, and bootstrap audit so the new concern workflow fits the existing system.

## Requirements

- R1. Cover future updates to `docs/dev/README.md`.
- R2. Cover future updates to every file currently under `docs/dev/_templates/**`.
- R3. Avoid requiring direct access to consumer repository root folders.
- R4. Keep root governance and templates technology-stack neutral.
- R5. Make stack-specific examples optional and target-evidence-bound.
- R6. Generalize wording that makes this repository's stack appear default.
- R7. Require a repository guidance inventory.
- R8. Support pre-code `Recommended Future Pattern` guidance.
- R9. Prevent unsupported rules from becoming current guidance.
- R10. Record cross-validated research.
- R11. Include plan, traceability, and completion audit.
- R12. Define stack evidence collection from manifests, lockfiles, dependency metadata, configuration, generated-code configuration, build scripts, and verification commands.
- R13. Define repository topic collection from README, product docs, package metadata, catalog-like metadata, source entrypoints, APIs, ownership, lifecycle, and domain vocabulary.
- R14. Define operational quality concern collection from tests, build, dependency updates, generated artifacts, security, maintenance, ownership, documentation, packaging, and releases.
- R15. Require each concern to record evidence, category, owner folder, classification, confidence, and follow-up.
- R16. Require cross-validation before a concern becomes actionable, with conflicts recorded as `Open Question`.
- R17. Require public repository sampling when only a technology stack is known.
- R18. Define sample selection criteria for activity, non-archived status, non-fork status, adoption signal, and stack relevance.
- R19. Require sampled repository inspection beyond descriptions.
- R20. Group sampled concern candidates as common, divergent, or repository-specific.
- R21. Require local applicability review before sampled concerns affect the target repository.
- R22. Record reproducible GitHub evidence without cloning or storing external repositories in this repository.
- R23. Continue using `concern` and define it in future root and template docs.
- R24. Define `concern` as a concrete development guidance target, not a feature, UI, product idea, dependency name, or broad technology category.
- R25. Include representative concern shapes such as library composition, boundaries, state ownership, validation, generated artifacts, verification, operational risk, and documentation ownership.
- R26. Require detailed concerns to record decision point, risk, evidence, affected surface, status, confidence, and local applicability.
- R27. Require a GitHub evidence ladder for fine-grained concern inference.
- R28. Treat code search and repository descriptions as discovery aids, not proof.
- R29. Group fine-grained concerns across repositories as shared stack, stack-plus-domain, or repository-specific concerns.
- R30. Require official API or framework documentation cross-validation before recommending library-specific or framework-boundary concerns.
- R31. State that `gh` is preferred for GitHub repository evidence but not mandatory.
- R32. Define fallback GitHub evidence paths when `gh` is unavailable.
- R33. Require fallback evidence to record tool/interface, source URLs, steps, inspected pages/files, date, summary, limitations, and confidence impact.
- R34. Preserve no-clone/no-vendor and target-evidence guardrails for fallback evidence.
- R35. Make future docs/dev template improvements explicitly repository-neutral and stack-neutral, with named technologies only as optional examples.
- R36. Confirm the global English display phrase for `concern`; recommended default is `development guidance target` with optional `concern` parenthetical.
- R37. Confirm default stack-only public repository sample count; recommended default is at least five, reducible to at least three with recorded justification.
- R38. Confirm official non-`gh` fallback evidence scope; recommended default is GitHub Web UI, REST API through an approved HTTP client, and installed GitHub MCP or connector output, with archive or clone inspection requiring a separate decision.
- R39. Confirm `Recommended Future Pattern` ownership; recommended default is evidence and classification in `repository`, interpretation and application guidance in the topical owner folder.
- R40. Confirm named stack example placement; recommended default is minimal stack-neutral core templates with longer examples in separate example or research sections.

## Plan Amendments

| Amendment ID | Requirement IDs | Preserved Units | New Units | Modified Units | Deferred Units | Superseded Units | Removed Units | Decision Record | Verification Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | R12-R16 | U1-U5 | U6 | None | None | None | None | `decisions/0002-use-evidence-first-concern-discovery.md` | Add V6. |
| A2 | R17-R22 | U1-U6 | U7 | None | None | None | None | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Add V7. |
| A3 | R23-R30 | U1-U7 | U8 | None | None | None | None | `decisions/0004-define-concern-as-development-guidance-target.md` | Add V8. |
| A4 | R31-R35 | U1-U8 | U9 | None | None | None | None | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Add V9. |
| A5 | R36-R40 | U1-U9 | U10 | None | None | None | None | None; open questions only. | Add V10. |

## Key Technical Decisions

- Missing guidance will be handled through classification, not through stack-specific global defaults. See `decisions/0001-classify-missing-guidance-without-stack-coupling.md`.
- Concern discovery will use stack evidence, repository topic evidence, and operational quality evidence before proposing missing guidance. See `decisions/0002-use-evidence-first-concern-discovery.md`.
- Stack-only inputs will trigger public repository sampling before concern candidate selection. See `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md`.
- `Concern` will remain the term, but future docs must define it as a development guidance target and require fine-grained GitHub evidence before recommending library or framework patterns. See `decisions/0004-define-concern-as-development-guidance-target.md`.
- GitHub evidence collection will prefer `gh`, but future docs must define equivalent fallback paths and keep all template improvements independent of any specific repository or named stack. See `decisions/0005-keep-github-evidence-and-templates-portable.md`.
- Five implementation choices remain open by design: global English display phrase, repository sample count, fallback evidence scope, future-pattern ownership, and named-stack example placement. See `open-questions.md`.
- Automation is deferred. The plan may describe scorecard-like review checks, but must not add scripts, CI, dependencies, or generated outputs without a new decision.

## Current Package State

| Area | Current State | Implementation Meaning |
| --- | --- | --- |
| Design package | R1-R40, A0-A5, RS1-RS4, D1-D5, U1-U10, V1-V10 are recorded. | Future implementation can start from this package without reopening the original conversation. |
| Open questions | `open-questions.md` records five unresolved choices with options, trade-offs, and recommended defaults. | Implementation can proceed with recommended defaults only if no explicit user/team choice is available, and should record any non-default choice. |
| `docs/dev/README.md` | Unchanged in this design package. | Root governance still needs concern definition, concern inventory reading flow, stack-only sampling summary, fallback evidence summary, and portability guardrails. |
| `docs/dev/_templates/**` | Unchanged in this design package. | Templates still need concern inventory fields, evidence ladder instructions, fallback evidence fields, and stack-neutral wording cleanup. |
| Automation | Deferred. | Do not add scripts, CI, dependencies, or generated outputs unless a new decision record is accepted. |
| External repositories | Used only as research samples. | Do not clone, vendor, or convert sampled practices into current rules without target repository evidence. |

## Artifact Persistence Plan

| Artifact | Covers | Expected Persistence | Commitability Check | Decision Record |
| --- | --- | --- | --- | --- |
| `docs/dev/README.md` | R1, R4, R7-R9 | Tracked | `git status --porcelain --ignored docs/dev/README.md` | None |
| `docs/dev/_templates/README.md` | R2, R4-R9 | Tracked | `git status --porcelain --ignored docs/dev/_templates/README.md` | None |
| `docs/dev/_templates/*/README.md` | R2, R4-R9 | Tracked | `git status --porcelain --ignored docs/dev/_templates` | None |
| `docs/dev/_templates/*/_template.md` | R2, R4-R9 | Tracked | `git status --porcelain --ignored docs/dev/_templates` | None |
| `docs/dev/_templates/_bootstrap-audit.md` | R2, R7-R9 | Tracked | `git status --porcelain --ignored docs/dev/_templates/_bootstrap-audit.md` | None |
| `docs/dev/_templates/repository/_template.md` | R12-R16 | Tracked | `git status --porcelain --ignored docs/dev/_templates/repository/_template.md` | None |
| `docs/dev/README.md` and `docs/dev/_templates/repository/_template.md` stack-only sampling sections | R17-R22 | Tracked | `git status --porcelain --ignored docs/dev/README.md docs/dev/_templates/repository/_template.md` | None |
| `docs/dev/README.md` and relevant `docs/dev/_templates/**` concern definition and detailed inference sections | R23-R30 | Tracked | `git status --porcelain --ignored docs/dev/README.md docs/dev/_templates` | None |
| `docs/dev/README.md` and relevant `docs/dev/_templates/**` fallback evidence and portability sections | R31-R35 | Tracked | `git status --porcelain --ignored docs/dev/README.md docs/dev/_templates` | None |
| `docs/designs/docs-dev-template-governance-20260617-q7m2/open-questions.md` | R36-R40 | Tracked | `git status --porcelain --ignored docs/designs/docs-dev-template-governance-20260617-q7m2/open-questions.md` | None unless closing or overriding a recommended default. |

## Recommended Implementation Sequence

| Phase | Units | Goal | Primary Files | Exit Criteria |
| --- | --- | --- | --- | --- |
| P0. Baseline audit and open-question checkpoint | U5, U10 | Reconfirm the target docs/dev state, keep this design package as implementation source of truth, and review unresolved choices before editing templates. | `docs/designs/docs-dev-template-governance-20260617-q7m2/**`, `docs/dev/**` | Current docs/dev files are inventoried; open questions are answered, deferred with recommended defaults, or escalated to a decision record. |
| P1. Root governance | U1, U8, U9 | Add the portable root concepts: `concern` definition, classification states, reading flow, GitHub evidence fallback summary, and repository/stack neutrality rules. | `docs/dev/README.md` | Root README defines concerns before using concern inventory language and does not require any named stack or repository. |
| P2. Template router | U2, U3 | Make `_templates/README.md` route concern categories to existing folder ownership without replacing the template system. | `docs/dev/_templates/README.md`, folder README files under `_templates/**` | Router explains where concern records, current rules, future patterns, and local evidence belong. |
| P3. Repository evidence template | U4, U6, U7, U8, U9 | Add concern inventory, evidence lanes, stack-only sampling, detailed inference, fallback evidence, and confidence/applicability fields. | `docs/dev/_templates/repository/_template.md`, `docs/dev/_templates/_bootstrap-audit.md` | A new repo can record stack/topic/operational evidence, sampled GitHub evidence, fallback limitations, and concern status without inventing current rules. |
| P4. Folder body templates | U3, U6, U8 | Ensure architecture, engineering, domain, evolution, ai, and decisions templates consume concern records consistently. | `docs/dev/_templates/*/_template.md`, `docs/dev/_templates/*/README.md` | Each folder template keeps its ownership boundary and links current rules to evidence-backed concerns. |
| P5. Verification and cleanup | U1-U10 | Prove the implementation is portable, evidence-bound, and complete. | `docs/dev/README.md`, `docs/dev/_templates/**`, design package audit files if updated | V1-V10 pass; no named repository or named stack is required; template markers are removed. |

## Implementation Order Detail

1. Review `open-questions.md` before editing implementation templates; if no explicit answer is available, use the recommended default and record that choice in implementation notes.
2. Update `docs/dev/README.md` because every template depends on the portable definitions for `concern`, classification, rule promotion, and fallback evidence.
3. Update `docs/dev/_templates/README.md` so authors can route concern records to existing folders before editing individual templates.
4. Update `docs/dev/_templates/repository/_template.md` and `_bootstrap-audit.md` because they capture stack evidence, repository topic evidence, operational evidence, GitHub sampling, fallback evidence, confidence, and unresolved gaps.
5. Update folder-specific README and body templates after the repository evidence flow is stable; these should consume concern records, not duplicate repository evidence ownership.
6. Run the full verification table after all docs/dev template changes are complete; do not mark current rules as implemented unless target repository evidence exists.

## Open-Question Defaults To Apply

| Question | Recommended Default | Applies To |
| --- | --- | --- |
| Global English display phrase for `concern` | Use `development guidance target` and optionally write `concern` in parentheses on first use. | R23-R25, R36, U8, U10 |
| Stack-only sample count | Sample at least five public repositories; reduce to at least three only with recorded justification. | R17-R22, R37, U7, U10 |
| Non-`gh` fallback scope | Allow GitHub Web UI, GitHub REST API through approved HTTP clients, and installed GitHub MCP or connector output; require separate decision for archive or clone inspection. | R31-R34, R38, U9, U10 |
| `Recommended Future Pattern` ownership | Keep evidence and classification in `repository`; put interpretation and application guidance in the topical owner folder. | R7-R9, R15, R39, U2, U4, U6, U10 |
| Named stack examples | Keep core templates minimal and stack-neutral; place longer examples in separate example or research sections. | R4-R6, R35, R40, U3, U9, U10 |

## Concern Workflow To Implement

| Step | Purpose | Required Fields Or Rules | Related Requirements |
| --- | --- | --- | --- |
| Define concern | Prevent confusion with product features and UI. | `concern` equals concrete development guidance target; include examples and non-examples. | R23-R25 |
| Collect local evidence | Ground concern discovery in target repository facts. | Stack manifests, lockfiles, config, source layout, docs, verification commands, generated outputs, local constraints. | R12-R16 |
| Sample public repositories when stack-only | Avoid vague stack-only inference. | Multiple active non-fork/non-archived repositories, role labels, explicit selection criteria, inspected files/scripts/workflows. | R17-R22 |
| Use fallback evidence when needed | Keep workflow usable without `gh`. | Tool/interface, URLs, navigation/query steps, inspected pages/files, date, limitations, confidence impact. | R31-R34 |
| Classify concern | Prevent unsupported rules from becoming current guidance. | `Current Rule`, `Recommended Future Pattern`, `Open Question`, `Local Constraint`, `Not Applicable`. | R7-R9, R15-R16, R21 |
| Route concern | Preserve existing folder ownership. | Owner folder: `architecture`, `engineering`, `domain`, `evolution`, `ai`, `decisions`, or `repository` evidence. | R1-R2, R7 |
| Verify portability | Keep templates reusable across repositories. | Named repositories and named stacks appear only as optional examples or evidence samples. | R4-R6, R35 |

## Fallback Evidence Plan

| Preferred Path | Fallback When Unavailable | Required Recording |
| --- | --- | --- |
| `gh search repos`, `gh repo view`, `gh api`, `gh search code` | GitHub web UI, GitHub REST API via approved HTTP client, GitHub MCP/connector, stable GitHub file URLs, approved temporary archive inspection | Tool/interface, source URL, query or navigation steps, inspected files/pages, retrieval date, evidence summary, limitations, confidence impact |
| Direct `gh api contents` reads | Stable blob/raw URLs, GitHub web file view, REST API file endpoint through approved HTTP client | Exact path, commit or branch context when available, summary of relevant code/config, limitations |
| Structured JSON output | Manual evidence table or connector output summary | Field names used, any missing fields, confidence impact |

Fallback evidence must still obey the no-clone/no-vendor rule unless a separate decision record authorizes temporary archive or clone inspection. It also must not promote sampled repository practices to current rules without target repository evidence.

## Portability Checks

| Check | Method | Fails If |
| --- | --- | --- |
| Repository neutrality | Search for this repository name, sampled public repository names, organization names, and local machine paths in future `docs/dev` diffs. | A sampled or local repository becomes the required template baseline. |
| Stack neutrality | Search for named stacks and libraries such as React, Next.js, TypeScript, TanStack Query, React Hook Form, FSD, Zustand, Vue, Angular, Svelte. | A named stack is required for the template system to work instead of being optional evidence or an example. |
| Evidence ownership | Review `repository/` versus top-level folders. | `repository/` starts owning current rules, or top-level current-rule folders duplicate local evidence tables. |
| Rule promotion | Review concern status fields. | External or sampled evidence becomes `Current Rule` without target repository evidence. |
| Tool portability | Review GitHub evidence instructions. | `gh` is mandatory with no equivalent fallback path. |

## Implementation Units

| Unit | Status | Covers | Work Scope | Expected Artifact Persistence | Verification |
| --- | --- | --- | --- | --- | --- |
| U1 | Planned | R1, R4, R7-R9 | Update `docs/dev/README.md` to define stack-neutral concern inventory, guidance classification states, and reading flow before implementation. | Tracked | V1 |
| U2 | Planned | R2, R4, R7-R9 | Update `docs/dev/_templates/README.md` to route guidance inventory and gap classification across architecture, engineering, domain, evolution, AI, decisions, and repository evidence. | Tracked | V2 |
| U3 | Planned | R2, R4-R6, R8-R9 | Update folder README and body templates under `docs/dev/_templates/**` so stack-specific examples are optional, generalized, and evidence-bound. | Tracked | V3 |
| U4 | Planned | R2, R7-R9 | Update `_bootstrap-audit.md` and repository template fields so bootstrapping records concern coverage, missing guidance, and classification. | Tracked | V4 |
| U5 | Planned | R10-R11 | Preserve research, traceability, and completion evidence in this design package for future reviewers. | Tracked | V5 |
| U6 | Planned | R12-R16 | Add concern discovery fields and guidance for stack evidence, repository topic evidence, operational quality evidence, cross-validation, confidence, classification, owner folder, and follow-up. | Tracked | V6 |
| U7 | Planned | R17-R22 | Add stack-only sampling guidance that uses GitHub CLI or equivalent evidence to select, inspect, summarize, and classify multiple real public repositories before applying concern candidates locally. | Tracked | V7 |
| U8 | Planned | R23-R30 | Add an explicit `concern` definition and fine-grained GitHub inference guidance covering evidence ladder, direct file reads, official docs cross-validation, code-search limitations, confidence, grouping, and local applicability. | Tracked | V8 |
| U9 | Planned | R31-R35 | Add `gh` fallback evidence guidance and explicit repository-neutral, stack-neutral portability checks for future docs/dev template updates. | Tracked | V9 |
| U10 | Planned | R36-R40 | Preserve unresolved implementation choices, options, trade-offs, and recommended defaults before future docs/dev edits. | Tracked | V10 |

## Implementation-Time Decision Boundaries

Stop implementation and create or update a decision record when:

- a future change introduces scripts, CI, dependencies, scorecard tooling, or generated outputs;
- a future change creates stack-specific shared template packs;
- a future change requires accessing consumer repository root folders as part of this repository's portable template update;
- a future change promotes a stack-specific recommendation to current guidance without target repository evidence;
- a future change treats dependency names or README prose as sufficient concern evidence without cross-validation;
- a future change copies sampled repository practices into current guidance without target repository evidence;
- a future change clones or vendors sampled external repositories into this repository;
- a future change renames `concern` instead of defining it, unless a new decision supersedes D4;
- a future change treats a user feature, UI screen, or broad product area as a `docs/dev` concern without a concrete development decision point and risk;
- a future change treats `gh search code` absence as proof that a pattern does not exist without direct file or tree inspection;
- a future change makes `gh` mandatory instead of allowing equivalent GitHub evidence fallbacks;
- a future change encodes this repository, sampled public repositories, an organization, or a named technology stack as the portable template baseline;
- a future change removes existing `docs/dev` ownership boundaries instead of extending them.
- a future change chooses a non-recommended answer for an open question without recording the reason in implementation notes or a decision record.

## Verification

| Verification | Covers | Command Or Review | Expected Evidence |
| --- | --- | --- | --- |
| V1 | R1, R4, R7-R9, U1 | Review `docs/dev/README.md` diff. | Root governance defines guidance inventory and classification without named stack dependency. |
| V2 | R2, R4-R9, U2 | Review `docs/dev/_templates/README.md` diff. | Template router describes concern categories and missing guidance classification. |
| V3 | R2, R4-R6, R8-R9, U3 | `rg -n "React|TypeScript|TanStack|Tailwind|Orval|Rust|rhwp|Zustand|React Hook Form|Next|Vue|Angular|Svelte" docs/dev/README.md docs/dev/_templates` plus manual review. | Named stacks appear only as optional examples or not at all; no template requires them. |
| V4 | R2, R7-R9, U4 | Review `_bootstrap-audit.md` and `repository/_template.md`. | Bootstrapping captures concern coverage, missing guidance, and classification. |
| V5 | R10-R11, U5 | Review this design package and run `git status --porcelain`. | Design package files are tracked-ready and map requirements to research, plan, traceability, and audit. |
| V6 | R12-R16, U6 | Review future `docs/dev/README.md`, `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md`, and relevant folder templates. | Concern collection covers stack evidence, repository topic evidence, operational quality evidence, structured concern records, and cross-validation without automation or stack coupling. |
| V7 | R17-R22, U7 | Review future stack-only sampling instructions and sample evidence table. | Instructions require multiple active public repositories, explicit selection filters, actual file/script/workflow inspection, common/divergent/repository-specific grouping, local applicability review, and reproducible GitHub evidence without cloning. |
| V8 | R23-R30, U8 | Review future `docs/dev/README.md` and relevant template diffs plus sample concern records. | Docs define `concern` as a development guidance target, distinguish it from features/UI/dependency names, and require evidence ladder, direct file reads, official docs cross-validation, confidence, grouping, and local applicability. |
| V9 | R31-R35, U9 | Review future fallback evidence instructions and named-repo/named-stack search results. | Docs state `gh` is preferred but optional, define fallback evidence fields, preserve no-clone/current-rule guardrails, and avoid making any specific repository or named stack the template baseline. |
| V10 | R36-R40, U10 | Review `open-questions.md` and future implementation notes. | Five unresolved choices are visible with options, trade-offs, and recommended defaults; any non-default implementation choice records a reason. |

## Risks And Dependencies

- If concern categories are too generic, future agents may still miss library-specific risks. Mitigation: require target manifest/config evidence and official documentation links for specific concerns.
- If templates include too many examples, they may become stack-biased. Mitigation: keep examples optional and require equivalent concern discovery for other stacks.
- If automation is added too early, the governance update may become a tooling project. Mitigation: defer scripts and CI to a separate decision.
- If concern discovery relies only on package names, future agents may miss repository topic and operational risks. Mitigation: require three evidence lanes and cross-validation.
- If sampling relies on one popular repository, future guidance may overfit. Mitigation: require multiple samples, role labels, and concern grouping.
- If `concern` remains undefined, future agents may collect product features or UI screens instead of development guidance targets. Mitigation: define the term before inventory instructions.
- If code search is treated as complete, future agents may miss relevant patterns. Mitigation: require file tree narrowing and direct file reads before using absence as evidence.
- If `gh` is unavailable and no fallback is documented, future agents may skip repository sampling or invent concerns. Mitigation: define equivalent GitHub evidence fallbacks and require limitation notes.
- If sampled repositories or named stacks leak into portable templates, future agents may treat examples as defaults. Mitigation: require repository-neutral and stack-neutral wording checks.

## Research And Sources

- `research/0001-cross-validated-guidance-management.md`
- `research/0002-concern-discovery-from-stack-and-topic.md`
- `research/0003-stack-only-concern-discovery-from-public-repositories.md`
- `research/0004-concern-terminology-and-fine-grained-github-inference.md`
- `decisions/0001-classify-missing-guidance-without-stack-coupling.md`
- `decisions/0002-use-evidence-first-concern-discovery.md`
- `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md`
- `decisions/0004-define-concern-as-development-guidance-target.md`
- `decisions/0005-keep-github-evidence-and-templates-portable.md`
- `open-questions.md`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/designs/README.md`
