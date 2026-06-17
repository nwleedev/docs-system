# Cross-Validated Guidance Management Patterns

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Supports: R4-R10, D1, U1-U4
- Related Amendment: A0
- Supersedes: None
- Superseded By: None

## Research Question

How should `docs/dev/README.md` and `docs/dev/_templates/**` support missing development guidance before code exists while remaining portable across technology stacks?

## Context

The user described a recurring failure mode: similar repositories use similar stacks, one repository has a guide for a topic, another does not, and the missing guide is only discovered after code is written with an avoidable anti-pattern. The current templates protect against unsupported current rules, but they do not yet provide a strong gap inventory that reveals missing guidance across repositories.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | Local governance | `docs/dev/README.md` | 2026-06-17 | Portable root governance owns folder responsibilities and keeps repository-specific stack evidence under `docs/dev/repository/`. | Current repo-tracked source. |
| S2 | Local template | `docs/dev/_templates/README.md` | 2026-06-17 | Templates already require target repository evidence and classify missing evidence as `Open Question`, `Local Constraint`, or `Recommended Future Pattern`. | Current repo-tracked source. |
| S3 | Local template | `docs/dev/_templates/engineering/README.md` | 2026-06-17 | The cross-check currently names this repository's stack examples, which can make the portable template look stack-specific. | Current repo-tracked source; needs generalization. |
| S4 | Local governance | `docs/designs/README.md` | 2026-06-17 | Broad and cross-validated requirements need research, traceability, and completion audit artifacts. | Current repo-tracked source. |
| S5 | External web | https://microsoft.github.io/code-with-engineering-playbook/documentation/ | 2026-06-17 | Documentation problems include non-existent, hidden, incomplete, inaccurate, obsolete, duplicate, and afterthought documentation. | Public engineering guidance; useful for problem framing. |
| S6 | External official docs | https://backstage.io/docs/features/techdocs/ | 2026-06-17 | TechDocs keeps Markdown documentation with code and makes service documentation discoverable from the catalog. | Official Backstage documentation. |
| S7 | External engineering case study | https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem | 2026-06-17 | Golden Paths define opinionated supported paths and Golden State checks to reduce ecosystem fragmentation. | First-party engineering blog; case-study evidence. |
| S8 | External product docs | https://docs.cortex.io/standardize/scorecards/scorecard-examples | 2026-06-17 | Scorecards can make missing development maturity practices visible, including README, lockfiles, ownership, and CI checks. | Product documentation; not a mandate to adopt the product. |
| S9 | External official docs | https://nx.dev/docs/features/enforce-module-boundaries | 2026-06-17 | Module boundary rules show that some architectural guidance can be enforced through static checks. | Official Nx documentation; used as conformance pattern evidence. |
| S10 | External official docs | https://react.dev/learn/passing-data-deeply-with-context | 2026-06-17 | React context is an alternative when prop passing becomes deeply repetitive, but context should not be overused. | Official React documentation; stack-specific example only. |
| S11 | External official docs | https://react-hook-form.com/docs/useformcontext | 2026-06-17 | `useFormContext` is intended for deeply nested structures where passing form context as props becomes inconvenient. | Official library documentation; supports example concern. |
| S12 | External official docs | https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow | 2026-06-17 | Zustand recommends selectors and `useShallow` to prevent unnecessary rerenders for shallow-equal computed outputs. | Official library documentation; supports example concern. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Missing guidance must be made visible before it causes implementation drift. | S5 | S8 | Confirmed | Scorecards are an example pattern, not a required tool. |
| Docs should remain close to code and discoverable, not hidden in session memory. | S1 | S6 | Confirmed | Future implementation should stay repo-tracked; no portal adoption is required. |
| Similar-stack fragmentation is better addressed by supported paths plus checks than by repeated prompts alone. | S7 | S8 | Confirmed | The local design should implement lightweight docs governance first, not an external platform. |
| Current rules need target evidence, but future patterns can be recorded before code exists. | S2 | S10, S11, S12 | Confirmed | Library examples must remain optional and stack-specific, not portable defaults. |
| Portable templates should not name this repository's stack as a default. | S1 | S3 | Confirmed | Existing named stack examples should be generalized in a future implementation. |
| Some guidance can later be enforced with static or conformance checks. | S8 | S9 | Confirmed | Automation is deferred until a separate decision accepts scripts or CI changes. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | The future update should add a stack-neutral guidance inventory or gap matrix so missing docs are visible before implementation starts. | S1, S2, S5, S8 | High | R7, U2 |
| F2 | `Recommended Future Pattern` is the right classification for officially supported patterns when target stack evidence exists but local code does not. | S2, S10, S11, S12 | High | R8, D1 |
| F3 | Current guidance must still require target repository evidence and must not be inferred from another repository. | S1, S2, S4 | High | R9, U1-U4 |
| F4 | Template wording that lists a specific stack should be generalized to concern categories and optional examples. | S3, S10, S11, S12 | High | R4-R6, U3 |
| F5 | The design should defer automation while preserving a path to scorecard or static checks later. | S8, S9 | Medium | R11, U4 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Supports | R4-R10 define stack-neutrality, gap management, and evidence rules. |
| `decisions/` | Supports | D1 accepts missing-guidance classification without stack coupling. |
| `plan.md` | Adds | U1-U4 describe future update units for root governance, repository evidence, templates, and audit. |
| `traceability.md` | Adds | Research rows map findings to requirements and verification. |
| `completion-audit.md` | Adds evidence | Audit must prove design package completeness and no target implementation edits. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| Consumer repositories were not audited in this package. | The design cannot claim which specific guides are missing in those repositories. | Defer to a later target-repository audit after user explicitly selects a repository. |
| No automation tool is selected. | Scorecard or conformance checks remain design direction only. | Create a separate decision before adding scripts, CI, or dependencies. |
| Library-specific examples are React-family examples from the user prompt and research. | They demonstrate the failure mode but must not define the portable template's stack. | Keep examples optional and phrase portable docs around concern categories. |

## Sources

- `docs/dev/README.md`: local governance baseline.
- `docs/dev/_templates/README.md`: template routing and evidence classification baseline.
- `docs/dev/_templates/engineering/README.md`: local example of stack-specific wording to generalize.
- Microsoft Engineering Fundamentals Playbook documentation page: documentation failure taxonomy.
- Backstage TechDocs: docs-as-code discoverability pattern.
- Spotify Engineering Golden Paths: supported path and Golden State pattern.
- Cortex scorecard examples: visible maturity checks.
- Nx module boundaries: static enforcement pattern.
- React, React Hook Form, and Zustand official documentation: official library examples for pre-code concern guidance.
