# Concern Discovery From Technology Stack And Repository Topic

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Supports: R12-R16, D2, U6
- Related Amendment: A1
- Supersedes: None
- Superseded By: None

## Research Question

How should a stack-neutral `docs/dev` template system collect and interpret concern areas from a repository's technology stack and repository topic before deciding which development guidance is missing?

## Context

The first research record established that missing guidance should be visible and classified without coupling portable templates to a named technology stack. This record adds the method for collecting the concern inventory itself: what evidence to inspect, how to separate technology concerns from product or domain concerns, and how to include operational quality signals without introducing automation.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | Local governance | `docs/dev/README.md` | 2026-06-17 | Target repository evidence already includes repository purpose, technology stack, source layout, generated code, verification commands, local constraints, and baseline evidence. | Current repo-tracked source; establishes local baseline. |
| S2 | Local template | `docs/dev/_templates/repository/_template.md` | 2026-06-17 | Repository evidence template already asks for repository purpose, technology stack, source layout, generated code, verification commands, local constraints, linked current rules, baseline evidence, and open questions. | Current repo-tracked source; target for future extension. |
| S3 | Official docs | https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-graph | 2026-06-17 | GitHub dependency graph summarizes repository manifest and lock files and shows dependencies, ecosystems, packages, versions, licenses, manifest source, and vulnerability context. | Official GitHub documentation; supports stack evidence collection. |
| S4 | Official docs | https://docs.github.com/en/code-security/reference/supply-chain-security/dependency-graph-supported-package-ecosystems | 2026-06-17 | Supported ecosystem documentation identifies recommended dependency files and package ecosystem coverage. | Official GitHub documentation; supports manifest and lockfile inspection. |
| S5 | Official docs | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes | 2026-06-17 | README files communicate project purpose, usefulness, getting started, help channels, and maintainers. | Official GitHub documentation; supports repository topic evidence. |
| S6 | Official docs | https://backstage.io/docs/features/software-catalog/ | 2026-06-17 | A software catalog tracks ownership and metadata for services, websites, libraries, data pipelines, and related software types. | Official Backstage documentation; supports topic and ownership metadata. |
| S7 | Official docs | https://backstage.io/docs/features/software-catalog/descriptor-format/ | 2026-06-17 | Catalog descriptors include metadata such as description, tags, links, and spec fields such as type, lifecycle, owner, system, and domain depending on entity kind. | Official Backstage documentation; supports metadata fields for topic collection. |
| S8 | Primary project docs | https://github.com/ossf/scorecard/blob/main/docs/checks.md | 2026-06-17 | Scorecard checks model operational concerns such as maintained status, branch protection, generated binaries, lockfiles, SAST, packaging, SBOM, and releases. | Primary project documentation; used as concern taxonomy evidence, not as a tooling mandate. |
| S9 | External case study | https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem | 2026-06-17 | Golden Paths and Golden State checks reduce fragmentation by defining supported paths and checks per engineering discipline. | First-party engineering article; validates discipline-oriented concern discovery. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Technology stack concerns should start from manifest, lockfile, dependency, config, and build evidence, not dependency names alone. | S3, S4 | S1, S2 | Confirmed | The future template should still allow repositories with incomplete manifests to record open questions. |
| Repository topic concerns should use purpose, maintainer, ownership, lifecycle, software type, tags, links, entrypoints, and domain vocabulary. | S5 | S6, S7 | Confirmed | Catalog metadata may not exist in every repository, so README and local docs remain fallback evidence. |
| Operational quality concerns should be collected separately from stack concerns. | S8 | S1, S2 | Confirmed | This package does not require OpenSSF Scorecard adoption or automation. |
| Concern collection should be discipline- or concern-oriented rather than tied to a single library. | S9 | S6, S8 | Confirmed | Portable templates should define categories and evidence rules, not a fixed taxonomy of all possible technologies. |
| Cross-validation should classify conflicting or missing evidence as an open question. | S1, S2 | S3-S8 | Confirmed | A single source can seed a concern, but should not promote it to current guidance by itself. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F6 | The future template update should define a three-lane concern discovery model: stack evidence, repository topic evidence, and operational quality evidence. | S1-S8 | High | R12-R14, U6 |
| F7 | Stack concern collection should inspect manifests, lockfiles, dependency metadata, framework/tool config, build scripts, generated-code config, and verification commands. | S1-S4 | High | R12 |
| F8 | Repository topic collection should inspect README, product docs, package metadata, catalog-like metadata, entrypoints, routes, APIs, ownership, lifecycle, and domain vocabulary. | S1, S2, S5-S7 | High | R13 |
| F9 | Operational concern collection should inspect tests, build, dependency update evidence, generated artifacts, security checks, maintenance, ownership, docs, packaging, and release signals. | S1, S2, S8 | High | R14 |
| F10 | Each collected concern needs a structured record with source evidence, concern category, target `docs/dev` owner folder, classification, confidence, and follow-up. | S1, S2, S6-S8 | High | R15 |
| F11 | A concern should become actionable only after cross-validation where practical; unresolved conflicts should remain `Open Question`. | S1-S9 | High | R16 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Adds | A1 and R12-R16 define concern discovery requirements. |
| `decisions/` | Adds | D2 records the evidence-first concern discovery decision. |
| `plan.md` | Adds | U6 and V6 guide future implementation of concern collection fields. |
| `traceability.md` | Updates | A1 rows map R12-R16 to RS2, D2, U6, V6, and audit evidence. |
| `completion-audit.md` | Updates | Audit rows prove concern discovery requirements are present in the design package. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| The exact final concern inventory table columns are not implemented yet. | Future implementation must choose wording that fits `docs/dev/README.md` and templates. | Use R15 as the minimum column contract. |
| Repository-specific topic vocabularies were not audited. | The package cannot list actual concerns for `assiworks`, `nrf-ai`, `design-docs`, or `aif-dashboard`. | Run a separate target-repository audit if requested. |
| No automatic dependency graph or Scorecard integration is selected. | Concern collection remains manual and evidence-based. | Create a separate decision before adding tooling. |

## Sources

- `docs/dev/README.md`: local repository evidence baseline.
- `docs/dev/_templates/repository/_template.md`: current repository evidence template.
- GitHub dependency graph documentation: manifest, lockfile, dependency, ecosystem, version, license, and vulnerability evidence.
- GitHub dependency graph supported ecosystems documentation: package ecosystem and recommended file evidence.
- GitHub README documentation: repository purpose, usefulness, getting started, help, and maintainer evidence.
- Backstage Software Catalog documentation: ownership and metadata model.
- Backstage descriptor format documentation: description, tags, links, owner, lifecycle, type, system, and domain metadata.
- OpenSSF Scorecard checks: operational quality concern categories.
- Spotify Golden Paths article: discipline-oriented supported-path model.
