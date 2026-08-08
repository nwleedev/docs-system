---
name: use-dev-guidance
description: Repository workflow adapter for docs/dev/README.md that selects and orders every applicable development-guidance operation needed for a request. In the use-* skill family, use marks a reusable procedure bound to a repository-local authority; it does not mean generic use of development patterns. Apply when researching stack-specific code cases, best practices or anti-patterns, reviewing or writing development guidance, selecting or applying checks, handling dependency changes, or validating code against docs/dev guidance.
---

# Use Dev Guidance

In this skill family, `use-` means binding a reusable execution procedure to a repository-local authority. It does not mean generic use of the named subject or broaden this skill beyond its README-defined scope.

Use the current repository's `docs/dev/README.md` as the sole authority for what development guidance belongs in the repository, how it is supported, and how it is checked. This skill supplies only the reusable execution procedure.

## Establish the authority

1. Resolve the repository root and check for `<repo-root>/docs/dev/README.md`.
2. If the README exists, read it completely before researching, applying, documenting, or validating development guidance. Treat it as the repository's sole current authority and do not read or compare this skill's `references/_README.md`.
3. If the README is missing, determine whether the requested work needs durable repository-specific development-guidance rules. Do not create the README merely because the skill was invoked.
4. When those rules are needed, identify this installed skill's `references/_README.md` and the exact target `<repo-root>/docs/dev/README.md`, then ask the user whether to create it.
5. If the user approves, create the target directory as needed and copy the bundled README content to the target without its first-line maintenance HTML comment. Re-read the new README completely before continuing.
6. If the user declines, inspect applicable repository instructions, existing documentation locations, and the directory structure. When the request authorizes writing the originally requested guidance or development file, write it only in a location supported by that evidence; ask the user when no suitable location can be established. Keep read-only requests read-only.
7. Never overwrite an existing repository README with the bundled file or synchronize the two automatically.
8. Follow applicable project instructions and the user's explicit request. Report a material conflict with the repository README instead of silently choosing one source.

## Select the operations required for the request

Select every operation needed to complete the user's requested outcome, not only the first matching operation. Include necessary read-only prerequisites and verification, omit operations that do not contribute to the outcome, and run the selected operations in dependency order. Add another operation after work begins only when new evidence shows that it is both necessary and within the original scope.

**Inventory**

Identify the current stack, versions, existing guidance, checks, and repository evidence.

**Research**

Investigate relevant code cases, recommended patterns, anti-patterns, dependencies, and verification methods.

**Guide**

Create, update, or review durable repository guidance.

**Tool**

Compare or propose static analysis, type or schema checks, tests, hooks, CI, or human review.

**Apply**

Make an explicitly requested code, dependency, configuration, or tooling change.

**Validate**

Verify guidance, a check, or an implementation against current evidence.

Necessary read-only work does not authorize dependency, configuration, code, or guidance changes. Treat words such as `apply`, `set up`, `configure`, `implement`, or an equally explicit instruction as mutation authorization only within the requested scope. Stop for human judgment when materially different options would change repository-wide policy, cost, compatibility, or behavior.

## Establish the current repository state

1. Inspect applicable manifests, lockfiles, configuration, scripts, CI, tests, generated artifacts, code, accepted decisions, and existing `docs/dev` files.
2. Select only the guidance relevant to the current work; do not read or reorganize the entire directory without need.
3. Treat existing code and documentation as evidence that may be stale, not automatic proof of the correct approach.
4. Record exact technology and dependency versions when external guidance depends on them.
5. Before changing behavior, record the observable behavior, public API, persisted data, error handling, affected callers, and connection points that the request does not authorize changing.
6. Choose a pattern from current official guidance for the installed version, applicable repository guidance, and check results. Repetition or proximity in existing code does not make that pattern correct.

## Research relevant risks and practices

1. Bound research to code cases that the current stack and requested work can actually reach. Do not attempt to enumerate every theoretical anti-pattern.
2. Prefer current official documentation, standards, and source repositories; cross-check material recommendations and note conflicts with the current repository.
3. State the failure to prevent, affected scope, observable consequence, applicable exceptions, and available verification methods.
4. Separate current repository practice, external recommendations, proposals, and accepted human decisions.

## Select the smallest reliable check

1. Reuse current compiler, formatter, linter, type or schema checker, tests, hooks, and CI before adding a dependency or custom rule.
2. Prefer a mechanical check only when it detects the intended failure with acceptable precision and cost.
3. Use an observable test, runtime or browser check, or explicit human review when static analysis cannot establish the property reliably.
4. Treat code examples as explanation or rule test cases, not proof that the repository complies.
5. For user-visible UI behavior, use a browser check when that is the smallest reliable observation. For CLIs, services, and background jobs, use an applicable runtime or integration check.
6. Use repository-defined commands. If none exists, label an inferred command as a proposal and obtain approval before running it. Stop every process that this task starts after verification.

## Research dependency integration

1. Before selecting or changing an external dependency, verify its purpose, exact version, official integration structure, and design patterns that materially affect the intended use. Do not invent a pattern name when official sources do not establish one.
2. Compare the dependency with installed dependencies, platform capabilities, and an internal implementation. Check runtime and peer compatibility, maintenance, security, and licensing when relevant.
3. After an authorized dependency change, inspect the actual additions, removals, and updates in the manifest, lockfile, and any resolved dependency-graph artifact used by the repository. Recheck unexpected transitive changes before completion.
4. Research does not authorize changing a dependency, configuration, or check.

## Apply authorized changes

- Keep changes limited to the selected risk and preserve unrelated user work and legacy guidance.
- For a new or changed static rule, verify at least one violating case and one valid case, or provide equivalent executable evidence.
- Run the affected checks and any repository baseline needed to detect regressions.
- Add or update durable guidance only when the README's inclusion conditions are met and the request authorizes documentation changes.
- Give each rule one owner and link to it instead of copying it across files.

## Provide development-guidance context when delegating

Follow the applicable project delegation policy. Delegate independent stack inspection, code-case research, repository exploration, and read-only validation when doing so is useful. Keep changes to shared guidance, dependencies, lockfiles, lint configuration, CI, and application code with one designated writer unless the work units share no files or state.

Give each delegated task the `docs/dev/README.md` path, relevant repository paths, exact operation, dependency versions, mutation boundary, stop condition, and expected return. Do not paste the README into prompts. The main agent remains responsible for selecting applicable findings, verifying repository state, and validating changes.

Do not automatically chain another planning, review, or implementation skill merely because it is installed. Follow an explicitly requested or already active skill when it does not conflict with the repository README, and avoid duplicate work.

## Finish

Re-read the applicable README checks after the work. Report what was inspected, sources and versions used, changed files, commands and results, unresolved uncertainty, and items requiring human judgment. Do not present prose guidance or an agent report as implementation proof.
