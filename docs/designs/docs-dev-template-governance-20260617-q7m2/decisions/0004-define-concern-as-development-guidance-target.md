# Define Concern As A Development Guidance Target

## Status

Accepted

## Context

The package already uses the term `concern` for repository guidance discovery. The user clarified that the Korean term can sound like user-facing features or UI. The goal is not to rename the term, but to define it precisely enough that Codex can distinguish `docs/dev` concern discovery from product feature discovery.

The user also asked for additional research on how GitHub repository evidence should be used to infer concrete, fine-grained concerns that can apply across multiple repositories using a technology stack. Examples include React Hook Form plus TanStack Query composition and Next.js App Router server/client boundaries.

## Decision

Keep the term `concern`, but define it in future `docs/dev/README.md` and relevant templates as a concrete development guidance target.

A `concern` must be tied to a development decision point or risk, such as:

- a library-composition pattern;
- a client/server, package, layer, or module boundary;
- state ownership and synchronization;
- validation, parsing, or API contract behavior;
- generated code or schema ownership;
- verification, test, build, release, security, or operational risk;
- documentation ownership for one of those decision points.

A concern is not sufficient when it is only:

- a user-facing feature or UI screen;
- a product idea;
- a dependency name;
- a broad technology category;
- a repository description without source evidence.

Fine-grained GitHub inference must use an evidence ladder: repository role labeling, metadata, manifests, scripts, workflows, file tree, direct file reads, code search, official library or framework documentation, and local applicability review. `gh search code` and README text are discovery aids, not proof.

## Consequences

- Future `docs/dev` implementation must define `concern` before concern inventory instructions.
- Future concern records must capture the concrete decision point, risk, evidence, affected surface, status, confidence, and applicability.
- Library-specific and framework-boundary concerns require official documentation before they become `Recommended Future Pattern`.
- GitHub-derived concerns stay external research until target repository evidence confirms applicability.
- Weak, conflicting, stale, or absent search evidence must be recorded as low confidence or `Open Question`.

## Traceability

- Related Amendment: A3
- Preserved Requirement IDs: R1-R22
- New Requirement IDs: R23-R30
- Research Support: `research/0004-concern-terminology-and-fine-grained-github-inference.md`
- Plan Impact: Add U8 and V8.
- Traceability Impact: Add RS4, D4, R23-R30 mappings.

## Rejected Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Rename `concern` to `Guidance Point`. | The user explicitly asked to continue using `concern`; a definition solves the ambiguity without vocabulary churn. |
| Leave `concern` undefined. | Codex could confuse development guidance targets with product features or UI surfaces. |
| Treat every GitHub code search hit as a concern. | Code search has indexing limits and mixed repository roles; direct file reads and official docs are required. |
| Treat dependency coexistence as proof of a pattern. | Dependencies can coexist without a meaningful composition pattern, and README claims can drift from manifests. |

## Verification

Future implementation review must confirm:

- `docs/dev/README.md` defines `concern` before using concern inventory language.
- relevant templates use the same definition and field names.
- examples distinguish product features/UI from development guidance targets.
- GitHub-derived concern instructions require evidence ladder, confidence, and local applicability.
- code search limitations and conflicting evidence are handled as low confidence or `Open Question`.
