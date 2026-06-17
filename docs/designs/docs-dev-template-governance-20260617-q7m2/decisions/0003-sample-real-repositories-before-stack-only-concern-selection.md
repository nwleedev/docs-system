# Sample Real Repositories Before Stack-Only Concern Selection

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Related Amendment: A2
- Supersedes: None
- Superseded By: None
- Preserves: R17-R22
- Replaces: None

## Context

When only a technology stack is provided, directly inventing concern areas produces vague output. Real repositories show which concerns actually appear around a stack: product workflow, source layout, generated code, testing, docs, release, ownership, security, plugin ecosystems, i18n, performance, and more. The design therefore needs an explicit repository sampling step.

## Requirement Change Classification

- Related Amendment: A2
- Change Type: Adds
- Preserved Requirement IDs: R1-R16
- New Requirement IDs: R17-R22
- Modified Requirement IDs: None.
- Superseded Requirement IDs: None.
- Preserved Requirement Scope: Stack-neutral governance, evidence-first concern discovery, and no-automation scope remain active.
- Superseded Requirement Scope: None.
- Plan Impact: Add U7 and V7.
- Traceability Impact: Add RS3, D3, R17-R22 mappings.
- Completion Audit Impact: Add audit rows for repository sampling.
- Migration Required: Future implementation must add stack-only sampling instructions to root governance and templates.

## Decision Drivers

- Stack names alone produce ambiguous concern lists.
- Real public repositories reveal concrete concerns through actual files, scripts, workflows, docs, and metadata.
- Sampled repository practices must not become local current rules without target repository evidence.
- External repositories should be inspected through GitHub CLI or equivalent API evidence, not cloned into this repository.

## Considered Options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| A | Infer concerns directly from the stack name. | Fast. | Produces generic and often misleading concerns. |
| B | Use one popular repository as the exemplar for a stack. | Concrete evidence. | Overfits one architecture, product type, or organization. |
| C | Sample multiple active public repositories, label their roles, inspect actual files, and group concerns before local applicability review. | Concrete, cross-validated, and less biased. | Takes more time and requires evidence discipline. |

## Decision

Choose Option C. Future implementation should require real repository sampling whenever only a technology stack is known. The sampling workflow should:

- use explicit `gh search repos` or equivalent filters;
- exclude archived repositories and forks by default;
- prefer active repositories with adoption or maintenance signals;
- inspect `gh repo view`, root files, manifests, scripts, workflows, docs, and release metadata;
- label sample role, such as framework source, product app, platform, design system, library, example, or docs site;
- group concern candidates into common, divergent, and repository-specific concerns;
- require target repository evidence before any sampled concern becomes current guidance.

## Consequences

- Concern discovery becomes more concrete than stack-name inference.
- Sampling can reveal product and operational concerns that dependency lists miss.
- The process remains stack-neutral because any stack can be sampled with the same evidence model.
- Future implementation needs clear limits to prevent slow or unbounded research.

## Confirmation

The future implementation must add stack-only sampling instructions and a minimum evidence table to `docs/dev/README.md`, `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md`, and bootstrap audit guidance.

## Revisit Trigger

- A future request asks to maintain a curated benchmark list per stack.
- A future implementation proposes automated GitHub sampling or local temporary clones.
- GitHub API or CLI limitations make manual sampling insufficient.

## Sources

- `research/0003-stack-only-concern-discovery-from-public-repositories.md`: cross-validated GitHub CLI and repository evidence.
- GitHub CLI `gh search repos` manual.
- GitHub CLI `gh repo view` manual.
- Public repository samples: `calcom/cal.com`, `supabase/supabase`, `grafana/grafana`.
