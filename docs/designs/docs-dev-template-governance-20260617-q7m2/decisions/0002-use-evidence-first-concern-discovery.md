# Use Evidence-First Concern Discovery

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Related Amendment: A1
- Supersedes: None
- Superseded By: None
- Preserves: R12-R16
- Replaces: None

## Context

The design needs to explain how future `docs/dev` updates should collect concern areas from a repository's technology stack and topic. The collection method must avoid two failure modes: using dependency names as the whole concern inventory, and using README text as the whole repository topic. It also must avoid adding automation because the selected direction keeps manual documentation governance for now.

## Requirement Change Classification

- Related Amendment: A1
- Change Type: Adds
- Preserved Requirement IDs: R1-R11
- New Requirement IDs: R12-R16
- Modified Requirement IDs: None.
- Superseded Requirement IDs: None.
- Preserved Requirement Scope: Stack-neutral governance, target evidence requirements, and no-automation scope remain active.
- Superseded Requirement Scope: None.
- Plan Impact: Add U6 and V6.
- Traceability Impact: Add RS2, D2, R12-R16 mappings.
- Completion Audit Impact: Add audit rows for concern discovery.
- Migration Required: Future implementation must update root governance and templates with concern discovery fields.

## Decision Drivers

- Concern collection must work across different technology stacks.
- Concern collection must represent repository purpose and domain, not just package dependencies.
- Operational quality concerns should be visible without requiring scripts, CI, or external scorecard tooling.
- Missing or conflicting evidence should stay explicit as `Open Question`.

## Considered Options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| A | Infer concerns from dependency names only. | Fast and easy to automate later. | Misses product topic, domain, source layout, workflow, and operational concerns. |
| B | Infer concerns from README and user description only. | Captures intent and audience. | Misses actual stack, generated code, tests, configs, and dependency risks. |
| C | Use three evidence lanes: stack evidence, repository topic evidence, and operational quality evidence. | Balanced, stack-neutral, cross-validatable, and compatible with manual docs governance. | Requires templates to collect more structured evidence. |

## Decision

Choose Option C. Future implementation should define a three-lane concern discovery model:

- Stack evidence: manifests, lockfiles, dependency metadata, framework and tool config, build scripts, generated-code config, and verification commands.
- Repository topic evidence: README, product docs, package metadata, catalog-like metadata, source entrypoints, routes, APIs, ownership, lifecycle, and domain vocabulary.
- Operational quality evidence: tests, build, dependency update evidence, generated artifacts, security checks, maintenance, ownership, docs, packaging, and release signals.

Each collected concern must record evidence, category, proposed `docs/dev` owner folder, classification, confidence, and follow-up.

## Consequences

- Future templates can guide concern collection before code work starts.
- Technology-specific guides remain evidence-bound and optional.
- Repository topic and domain concerns become visible alongside stack concerns.
- Manual documentation governance remains sufficient for this phase.
- Automated ingestion can be added later only through a separate decision.

## Confirmation

The future implementation must add concern discovery fields to `docs/dev/README.md`, `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md`, and relevant folder templates without requiring named stacks or external automation.

## Revisit Trigger

- A future request asks for automated concern extraction.
- A target repository includes catalog metadata that should become a first-class source of truth.
- The manual concern inventory becomes too slow or inconsistent across repositories.

## Sources

- `research/0002-concern-discovery-from-stack-and-topic.md`: cross-validated evidence.
- GitHub dependency graph documentation: manifest and lockfile evidence.
- GitHub README documentation: repository purpose evidence.
- Backstage Software Catalog documentation: metadata and ownership evidence.
- OpenSSF Scorecard checks: operational quality evidence categories.
