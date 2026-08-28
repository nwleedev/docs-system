---
name: use-dev-guidance
description: Repository workflow adapter for docs/dev/README.md that selects and orders every applicable development-guidance operation needed for a request. In the use-* skill family, use marks a reusable procedure bound to a repository-local authority; it does not mean generic use of development patterns. Apply when researching stack-specific code cases, best practices or anti-patterns, reviewing or writing development guidance, selecting or applying checks, handling dependency changes, or validating code against docs/dev guidance.
---

# Use Dev Guidance

Use the current repository's `docs/dev/README.md` as the authority for durable development guidance, supporting evidence, and verification. This skill selects and orders work; it does not replace the README or authorize code, dependency, configuration, tooling, or documentation changes.

## Establish the authority

1. Resolve the repository root and check for `<repo-root>/docs/dev/README.md`.
2. If it exists, read it completely. Do not compare it with this skill's `references/_README.md` or synchronize the files.
3. If it is missing, decide whether the request needs durable repository-specific development rules. Do not create the README merely because this skill was invoked.
4. When durable rules are needed, identify the bundled `references/_README.md` and exact target path, then ask the user whether to create the repository README.
5. If approved, copy the bundled content without its first-line maintenance comment and read the created README completely. Never overwrite an existing README.
6. If creation is declined, inspect repository instructions, existing documentation locations, and the directory structure. For an authorized writing request, use a location supported by that evidence; ask when none is established. Keep read-only requests read-only.
7. Follow the user's request and applicable repository instructions. Report a material conflict with the repository README instead of choosing silently.

## Select the required operations

Choose every operation needed for the requested outcome, including read-only prerequisites and final validation. Omit unrelated work, run dependent operations in order, and add work later only when new evidence makes it necessary within the original scope.

- **Inventory:** identify the stack, exact versions, current behavior, existing guidance, checks, and repository evidence.
- **Research:** investigate applicable patterns, anti-patterns, dependencies, risks, and verification methods.
- **Guide:** create, update, or review durable repository guidance under the README's inclusion rules.
- **Tool:** compare or propose static analysis, type or schema checks, tests, hooks, CI, runtime checks, or responsible review.
- **Apply:** make an explicitly requested code, dependency, configuration, or tooling change.
- **Validate:** verify guidance, a check, or an implementation against current evidence.

Read-only work does not authorize changes. Stop for human judgment when materially different options would change repository-wide policy, cost, compatibility, data, or behavior.

## Inspect current and external evidence

1. Inspect only applicable manifests, lockfiles, configuration, scripts, CI, tests, generated artifacts, code, decisions, and `docs/dev` files. Treat existing code and prose as evidence that may be stale, not as proof of the correct pattern.
2. Record exact technology and dependency versions when external guidance depends on them. Prefer current official documentation, standards, and source repositories, and note conflicts with repository evidence.
3. When researching pattern examples, use public open-source applications at fixed revisions together with confirmed failure or change reasons. Do not use the working application's code as the source of an anti-pattern or recommended example; use it only to establish the current stack, behavior, and connection points.
4. Apply the repository README's required anti-pattern fields. Do not classify a code shape from appearance alone or attempt to enumerate every theoretical anti-pattern.
5. Before behavior changes, identify observable behavior, external APIs, persisted data, error handling, affected callers, and connection points that the request does not authorize changing.

## Choose the least expensive reliable check

1. Reuse current compiler, formatter, linter, type or schema checker, tests, hooks, and CI before adding a dependency or custom rule.
2. Use a mechanical check only when it detects the intended failure with acceptable precision and cost. Check new static rules with a violating and valid case or equivalent executable evidence.
3. When static analysis cannot establish the property, use an observable test, runtime or browser check, or responsible review that can observe the failure.
4. Use repository-defined commands. If none exists, present an inferred command as a proposal and obtain approval before running it. Stop processes started by the task after verification.
5. Do not continue into a dependent change when an applicable required check fails or an unresolved result needs a decision that has not been approved.

## Handle dependencies and authorized changes

1. Before selecting or changing an external dependency, inspect the resolved direct and transitive graph, official integration for the selected version, applicable patterns, compatibility, maintenance, security, licensing, installed alternatives, platform capabilities, and an internal implementation.
2. Research does not authorize a dependency, configuration, check, guidance, or code change. Apply only changes explicitly requested within scope and preserve unrelated behavior and user work.
3. After an authorized dependency change, inspect actual manifest, lockfile, and resolved-graph changes and investigate unexpected transitive updates.
4. Add durable guidance only when the README's inclusion conditions are met and documentation changes are authorized. Give each rule one owning document.

## Finish

Run the applicable README and repository checks once after the work. Report inspected evidence and versions, sources, changed files, commands and results, unresolved uncertainty, and questions requiring human judgment. Do not present prose guidance or a work report as implementation proof.
