# Concern Terminology And Fine-Grained GitHub Inference

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Supports: R23-R30, D4, U8
- Related Amendment: A3
- Supersedes: None
- Superseded By: None

## Research Question

How should the design keep using the term `concern` while preventing Codex from confusing it with product features or UI, and how should GitHub repository evidence be used to infer fine-grained concerns from technology-stack samples?

## Context

The user clarified that `concern` can be mistaken for "features or UI provided to users." The user also gave examples of the intended granularity: React Hook Form and TanStack Query composition patterns, and Next.js App Router plus FSD-style server/client boundary problems. This research validates a definition and a GitHub evidence method that can capture those development guidance targets without turning a dependency name into a broad or vague concern.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | Standard / official summary | ISO/IEC/IEEE 42010:2022 summary and ISO architecture conceptual model search evidence | 2026-06-17 | `concern` is an architecture-description concept tied to stakeholder interests, but `docs/dev` needs a narrower operational definition. | ISO page confirms architecture-description scope; conceptual-model source was discoverable but not fully accessible through static fetch. |
| S2 | Architecture documentation | https://arc42.org/overview | 2026-06-17 | arc42 separates requirements, constraints, solution strategy, building blocks, runtime, deployment, crosscutting concepts, decisions, quality requirements, risks, and glossary. Crosscutting concepts include technical and implementation rules. | Public architecture documentation template. |
| S3 | Architecture method | https://www.sei.cmu.edu/library/quality-attribute-workshop-collection/ | 2026-06-17 | Quality Attribute Workshops identify architecture-critical attributes and architectural drivers before an architecture exists; scenarios expose assumptions and tradeoffs. | Official CMU SEI source. |
| S4 | GitHub docs | https://cli.github.com/manual/gh_search_code | 2026-06-17 | `gh search code` can search code and output `path`, `repository`, `sha`, `textMatches`, and `url`, with repository, language, filename, extension, and path-related filters. | Official GitHub CLI manual. |
| S5 | GitHub docs | https://docs.github.com/en/search-github/searching-on-github/searching-code | 2026-06-17 | Code search has restrictions: only default branch is indexed, archived repositories are not searchable, and results can omit matches because of file size, repository size, indexing, and syntax limits. | Official GitHub Docs. |
| S6 | Official library docs | Context7 query for React Hook Form documentation | 2026-06-17 | React Hook Form documents async `defaultValues`, reset behavior, `resetOptions`, dirty value retention, and resolver validation contracts. | High-reputation official docs via Context7. |
| S7 | Official library docs | Context7 query for TanStack Query documentation | 2026-06-17 | TanStack Query documents query keys, `useMutation`, `onSuccess`, `queryClient.invalidateQueries`, exact key invalidation, and refetch behavior. | High-reputation official docs via Context7. |
| S8 | Official framework docs | Context7 query for Next.js documentation | 2026-06-17 | Next.js documents `use client` as a client/server boundary and `server-only` as a build-time guard against importing server-only modules into Client Components. | High-reputation official docs via Context7. |
| S9 | Runtime evidence | `gh search repos "react-hook-form tanstack query" --limit 10 --json ...` | 2026-06-17 | Search returned repositories with mixed roles and low adoption signals, including examples, snippets, dashboards, interview tasks, and learning projects. | Demonstrates need for role and confidence labeling. |
| S10 | Runtime evidence | `gh repo view`, `gh api contents`, and `package.json` reads for `Oluwashina/NextJs-TanstackQuery` | 2026-06-17 | Manifest confirms React Hook Form, TanStack Query, Zod, Zustand, Next.js, Vitest; tree shows `QueryProvider`, `TodoForm`, `useTodos`, API route, and tests. Direct file reads show mutation invalidation and form reset after mutation. | Concrete code evidence from public repository. |
| S11 | Runtime evidence | `gh repo view`, `package.json`, tree, and direct file reads for `Onddrej/inqool-interview-app` | 2026-06-17 | Manifest confirms React Hook Form, TanStack Query, Zod, React Router, Axios, Mantine. Direct file reads show edit-form `defaultValues`, mutation success invalidation, reset, delete mutation, and API client placement. | Concrete code evidence from public repository. |
| S12 | Runtime evidence | `gh repo view`, root inventory, and `package.json` read for `rafahbrito/pizza-shop-dashboard` | 2026-06-17 | README description claims TanStack Query usage, but manifest evidence inspected in this session did not confirm `@tanstack/react-query`. | Conflicting evidence; should lower confidence or become `Open Question`. |
| S13 | Runtime evidence | `gh search code "useForm defaultValues useQuery"` and `gh search code "fetchQuery defaultValues useForm"` | 2026-06-17 | Direct phrase searches returned no results, while targeted file reads still found relevant form/query composition evidence. | Demonstrates code search is discovery aid, not proof of absence. |
| S14 | Runtime evidence | `gh search code "from 'server-only'" --language TypeScript --limit 10 --json ...` | 2026-06-17 | Code search found public examples of server-only marker usage and boundary-checking tools, but results were mixed by repository role. | Supports boundary concern discovery with role filtering. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| `Concern` can remain as the term if the docs define it as a development guidance target. | S1-S3 | User examples and existing R7-R16 | Confirmed | The definition must be in `docs/dev/README.md` before usage instructions. |
| Fine-grained concerns require direct usage evidence, not only dependency or README evidence. | S9-S13 | S4-S5 | Confirmed | Some repositories may still require deeper inspection or temporary clone under a separate decision. |
| Library-composition concerns can be inferred by combining manifests, direct file reads, and official docs. | S6-S7 | S10-S11 | Confirmed | External samples remain research until target repository evidence exists. |
| Client/server boundary concerns need both source evidence and framework documentation. | S8 | S14 | Confirmed | Search results must be filtered by repository role and relevance. |
| Conflicting GitHub evidence should become low confidence or `Open Question`. | S12 | Existing R16/R21 | Confirmed | README descriptions can drift from manifest and source reality. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F18 | The future docs should retain `concern`, but define it before use as a concrete development guidance target. | S1-S3 | High | R23 |
| F19 | A concern should exclude bare feature/UI/product labels, bare dependency names, and broad technology categories unless tied to a technical decision point and risk. | S2-S3, S9-S13 | High | R24 |
| F20 | Representative concern shapes should include library composition, module boundaries, state ownership, validation contracts, generated artifacts, verification, operational risk, and docs ownership. | S2-S8, S10-S14 | High | R25 |
| F21 | Detailed concern records need decision point, risk, evidence, affected surface, status, confidence, and applicability fields. | S3-S13 | High | R26 |
| F22 | Fine-grained GitHub inference should use an evidence ladder from sample role labels through manifests, scripts, workflows, file trees, direct files, code search, official docs, and local applicability. | S4-S14 | High | R27 |
| F23 | `gh search code` and README descriptions are useful discovery aids but not proof because search can miss matches and README or manifest evidence can conflict. | S5, S12-S13 | High | R28 |
| F24 | Shared stack concerns should be inferred by comparing actual usage sites across repositories and grouping them separately from stack-plus-domain or repository-specific concerns. | S9-S11 | Medium | R29 |
| F25 | Library-specific and framework-boundary concerns need official API or framework documentation before being recommended. | S6-S8, S10-S14 | High | R30 |

## Detailed Inference Method

| Step | Evidence To Collect | Purpose | Failure Mode To Record |
| --- | --- | --- | --- |
| 1. Label repository role | `gh search repos`, description, topics, stars, pushed date, archived/fork state | Separate product, platform, framework, library, example, interview task, and docs/content samples. | Low adoption, stale sample, mixed role, or irrelevant search result. |
| 2. Confirm stack evidence | `package.json`, lockfiles, config files, dependency graph-like manifests | Confirm technology coexistence before looking for composition concerns. | README claims a dependency that manifest evidence does not confirm. |
| 3. Inspect routines | scripts, workflows, test folders, release files | Identify recurring validation and operational concerns. | Script name exists but no matching source or workflow evidence. |
| 4. Inspect file tree | `gh api .../git/trees/HEAD?recursive=1`, root and source directories | Find likely usage sites for forms, queries, APIs, boundaries, generated code, and tests. | Tree is too large or search is too broad; narrow by path patterns. |
| 5. Read direct files | `gh api .../contents/PATH` | Confirm actual usage patterns and decision points. | Code search misses matches; direct reads supersede search absence. |
| 6. Cross-check official docs | Context7 or official documentation for the named library/framework | Verify API contracts before recommending a pattern. | Docs do not support the inferred concern, so keep as `Open Question`. |
| 7. Classify concern | Shared stack, stack-plus-domain, repository-specific; current/recommended/open/not applicable | Prevent overfitting and preserve local applicability review. | One repository drives a rule that should remain sample-specific. |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Adds | A3 and R23-R30 define terminology and fine-grained inference requirements. |
| `decisions/` | Adds | D4 records that `concern` remains the term but must be explicitly defined. |
| `plan.md` | Adds | U8 and V8 guide future implementation of concern definition and detailed GitHub inference instructions. |
| `traceability.md` | Updates | A3 rows map R23-R30 to RS4, D4, U8, V8, and audit evidence. |
| `completion-audit.md` | Updates | Audit rows prove concern definition and detailed inference requirements are present. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| Sample repositories for React Hook Form and TanStack Query had low adoption signals or learning/interview-task roles. | They validate the inference method but not a universal best practice. | Future audits should prefer higher-confidence product or platform samples when available. |
| FSD-specific public repository evidence was not strong in this session. | The method covers boundary inference, but not a dedicated FSD taxonomy. | Future stack-specific audits should search FSD, import-boundary, and layer-rule evidence separately. |
| Direct file reads are manual and can miss deep or generated files. | Fine-grained inference remains review-driven. | Automation requires a separate decision. |

## Sources

- ISO/IEC/IEEE 42010:2022 overview and ISO architecture conceptual model search evidence.
- arc42 Template Overview: crosscutting concepts, quality requirements, risks, and glossary.
- CMU SEI Quality Attribute Workshop collection.
- GitHub CLI `gh search code` manual.
- GitHub Docs for legacy code search restrictions and qualifiers.
- Context7-backed React Hook Form documentation.
- Context7-backed TanStack Query documentation.
- Context7-backed Next.js documentation.
- `gh` evidence from `Oluwashina/NextJs-TanstackQuery`, `Onddrej/inqool-interview-app`, and `rafahbrito/pizza-shop-dashboard`.
