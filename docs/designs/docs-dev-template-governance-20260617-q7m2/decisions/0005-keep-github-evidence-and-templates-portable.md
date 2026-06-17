# Keep GitHub Evidence And Templates Portable

## Status

Accepted

## Context

The design package uses GitHub repository evidence to make stack-only concern discovery more concrete. GitHub CLI is useful for reproducible searches and structured metadata, but future agents may work in environments where `gh` is not installed, not authenticated, rate-limited, or blocked.

The user also clarified that `docs/dev` template improvements must not depend on a specific repository or technology stack. Public repositories and named libraries can be used as examples or evidence, but they must not become required template baselines.

## Decision

Prefer `gh` for GitHub repository research when it is available, but do not make it mandatory.

When `gh` is unavailable, future docs may use equivalent GitHub evidence from:

- GitHub web UI pages and stable file URLs;
- GitHub REST API through `curl` or another approved HTTP client;
- an installed GitHub MCP or connector;
- downloaded single-file views;
- repository archive inspection in an approved temporary location;
- manually recorded stable GitHub URLs and summaries.

Every fallback path must record the interface used, source URLs, query or navigation steps, inspected files or pages, retrieved date, evidence summary, limitations, and confidence impact.

Future template improvements must remain repository-neutral and stack-neutral. They may mention specific repositories or technologies only as optional examples or evidence samples. They must not require this repository, sampled public repositories, React, Next.js, TypeScript, TanStack Query, React Hook Form, FSD, or any other named stack as a default baseline.

## Consequences

- Stack-only sampling remains possible even when `gh` is unavailable.
- Fallback evidence remains auditable because limitations and source URLs are recorded.
- The no-clone/no-vendor guardrail still applies unless a separate decision authorizes a temporary archive or clone workflow.
- Sampled public repositories remain external evidence, not current rules.
- Future implementation review must search for named repositories and named stacks that accidentally became defaults.

## Traceability

- Related Amendment: A4
- Preserved Requirement IDs: R1-R30
- New Requirement IDs: R31-R35
- Research Support: `research/0003-stack-only-concern-discovery-from-public-repositories.md`, `research/0004-concern-terminology-and-fine-grained-github-inference.md`
- Plan Impact: Add U9 and V9.
- Traceability Impact: Add R31-R35 mappings.

## Rejected Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Require `gh` for all GitHub evidence. | Blocks the workflow in unauthenticated, rate-limited, or restricted environments. |
| Allow informal browsing notes without source URLs. | Not reproducible enough for design package evidence. |
| Remove GitHub repository sampling when `gh` is unavailable. | Reintroduces vague stack-only concern inference. |
| Use one curated repository or stack as the template baseline. | Violates the repository-neutral and stack-neutral template requirement. |

## Verification

Future implementation review must confirm:

- `gh` is described as preferred, not mandatory.
- fallback paths and recording fields are present.
- fallback evidence keeps no-clone/no-vendor and target-evidence guardrails.
- named repositories and named stacks are optional examples or evidence samples, not template prerequisites.
