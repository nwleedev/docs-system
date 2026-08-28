# Development Guidance

This directory contains repository-specific development guidance that remains useful across changes. It routes contributors to current rules and approved engineering decisions; it does not replace tests, tooling, official framework documentation, or task-specific design documents.

## Structure and Inclusion

```text
docs/dev/
  README.md
  <topic>/
    <guidance>.md
```

Choose topics from the repository's actual responsibilities and terminology. Do not copy another repository's taxonomy, create empty directories, or reorganize existing guidance to match this example. Add a topic-level README only when names and links no longer let readers find the right file.

### Repository Guidance

- [Node.js MJS command-line scanners](./node/mjs-cli.md) defines this repository's runtime, input, Git, literal scan, output, self-test, and ESLint rules for standalone `.mjs` scanners.

Add guidance only when all these conditions hold:

- It applies to more than one change.
- A future contributor cannot reliably infer it from code, generated artifacts, standard tooling, or official documentation alone.
- Current repository evidence or an approved decision supports it.
- An automated check or named review method can verify it.

Keep task-specific requirements, research, decisions, and plans under `docs/designs/`. Do not store generic framework documentation, speculative rules for unused technology, generated facts, or prose-only mandates that an existing tool can enforce.

## Rules for Every Guidance Document

Before writing, identify the repository area, intended contributors, and the action or judgment the guidance supports. Name distinct author, implementation, review, and approval roles when their responsibilities differ. If evidence does not identify a responsible role, report `needs human input` rather than assigning one.

Guidance is prose-first and has no fixed template. Use one descriptive title, a logical heading hierarchy, and the order that best explains the rule. Put the rule or conclusion before background details. Do not use tables or add IDs and metadata unless an active tool consumes them.

Separate repository evidence, external recommendations, proposals, approved decisions, exceptions, and unresolved uncertainty. Treat task prompts, agent instructions, requested formats, tool conditions, progress reports, review wording, and untracked notes as leads for investigation rather than evidence of repository practice.

Use natural language for the intended contributors. Keep credentials, personal locations, private URLs, private project identifiers, and unnecessary internal locations out of tracked guidance. Use verified repository-relative locations when readers need a file location.

### Required information

- The work and repository area to which the guidance applies
- Current repository evidence supporting it
- The rule, recommendation, or limitation contributors must understand
- Conditions and exceptions that change its application
- An automated check or explicit method assigned to the responsible reviewer
- External sources and exact versions when external claims materially affect the rule
- Whether the guidance is `current`, `proposed`, or `deprecated`

Use code examples only when they clarify a repository-specific rule. Keep them consistent with the documented stack and identify the evidence they illustrate.

### Prohibited content

- Generic framework instructions copied from official documentation
- Proposals presented as current repository practice
- Repository claims not checked against current code, configuration, tests, or generated artifacts
- Rules copied from another owning document
- Vague instructions that do not state the action and verification
- Task wording, progress reports, tool instructions, or review wording presented as guidance
- Private environment details, identifiers, or locations contributors do not need

## Status and Ownership

- `current` guidance has present repository evidence or an approved decision and applies now.
- `proposed` guidance is researched but has not been approved or adopted.
- `deprecated` guidance no longer applies and identifies its replacement or reason for retirement.

Each rule has one owning document. Other documents link to it. Merge or choose one owner only when documents serve the same readers and purpose. Record a project-wide choice as current only after its decision owner approves it.

## Find and Apply Guidance

Inspect existing `docs/dev` files before choosing a topic and read only documents whose stated applicability matches the work. Use relevant existing guidance even when it predates this README or has a different structure. Report stale claims, contradictions, unclear responsibility, and missing evidence; do not reorganize or rewrite documents during read-only work.

Before applying guidance, compare it with current manifests, lockfiles, configuration, scripts, CI, tests, generated artifacts, code, approved decisions, dependency versions, and observable behavior. Existing code and prose may be stale and do not prove that a pattern is recommended.

Before writing new application code, review current official guidance for the installed versions and establish the least expensive repository baseline for build or syntax checks, type or schema checks, applicable static analysis, dependency and security checks, and observable behavior tests. Run the applicable existing baseline before writing code. Do not continue into dependent code changes until required checks pass or the decision owner accepts an unresolved judgment. Use repository-defined commands, and present an inferred command as a proposal that requires approval before execution.

Before changing behavior, identify user-visible behavior, external APIs, persisted data, error handling, affected callers, and connection points that the request does not authorize changing. Select new patterns from current official guidance, applicable repository guidance, and check results rather than copying nearby code.

Using, researching, or reviewing guidance does not authorize code, dependency, configuration, tooling, or documentation changes. Apply only explicitly requested changes within scope, and ask the decision owner before changing an approved decision, document responsibility, or repository-wide rule.

## Research Patterns and Anti-patterns

Research only cases that the current stack and requested work can reach. Do not classify code from its shape alone or enumerate every theoretical anti-pattern. Use the working repository to establish technologies, versions, behavior, and connection points, but not as the source of an anti-pattern or recommended code example.

Base each pattern finding on current official material and a public open-source application at a fixed revision. Use an issue, pull request, change commit, failure report, or maintainer explanation to establish the observed failure or reason for the change. A public repository's current code alone is not enough.

Record each anti-pattern and corresponding recommendation with:

- The failure to prevent, affected scope, and observable consequence
- Public source revision and confirmed failure or change reason
- Current official guidance and applicable versions
- A minimal anti-pattern code example
- A minimal recommended-pattern code example that addresses the same behavior
- Why the recommended pattern avoids the failure
- Application conditions, exceptions, and trade-offs
- An applicable lint configuration example, when a rule can identify the violation precisely
- What lint cannot decide and the type, schema, test, runtime, browser, or responsible review evidence used instead

Reuse existing compiler, type, schema, lint, test, and CI capabilities before proposing another tool. Add or tighten a static rule only when it detects the intended violation with acceptable precision, has a violating and valid case or equivalent executable evidence, and has proportionate execution and maintenance cost. When no suitable lint rule exists, state that fact instead of using an imprecise proxy. Code examples explain a rule or exercise a checker; they do not prove repository compliance.

Keep external recommendations, current repository practice, proposals, and approved decisions distinct. Store repository-specific findings, selected rules, commands, exceptions, and evidence in the applicable topic document or tool configuration rather than this root README.

## Dependency Changes

Before selecting or changing an external dependency, verify its purpose, exact version, official integration structure, and applicable design patterns. Inventory every direct and transitive dependency in the resolved graph and record its name, resolved version, capabilities, potential issues, and applicable pattern. Record `not applicable` with supporting facts when no pattern applies; do not invent a pattern name.

Compare the dependency with installed dependencies, platform capabilities, and an internal implementation. Check runtime and peer compatibility, maintenance, security, and licensing when relevant. Research does not authorize a dependency or configuration change.

After an authorized change, inspect actual additions, removals, and updates in manifests, lockfiles, and resolved-graph artifacts. Investigate unexpected transitive changes, then inspect affected configuration, types, generated artifacts, tests, imports, and external APIs and run the applicable checks.

## Validation

Use the least expensive method that can reliably decide each property.

- Static analysis checks syntax, imports, dependency direction, naming, and detectable code shapes.
- Type or schema checks verify data shapes, interfaces, and compatibility.
- Automated tests verify observable behavior, failure handling, and integration.
- Runtime or browser checks verify workflows, rendering, performance, and operational signals.
- Responsible reviewers judge intended behavior, usability, visual quality, and trade-offs. Approval owners approve decisions.

Repository tools check document placement, empty files, unresolved placeholders, and repository-relative links when those checks exist. AI checks required information, evidence support, contradictions, applicability, and readability.

Report every applicable criterion as `pass`, `needs revision`, `needs human input`, or `not applicable`, with a short quotation or file location as evidence. Say when evidence is absent instead of inventing a current rule. Review and rewriting are separate actions.

For every changed guidance document, read the final form as a future contributor. Trace each rule to repository evidence, an approved decision, or a necessary external source; scan for private information; and confirm that the title, examples, and prose explain the repository rule rather than the task that produced it.

Documentation explains a rule. Tooling, execution evidence, and responsible review determine whether a change follows it.

## Update and Maintain Guidance

When a guidance update is authorized, inspect current evidence, decide whether the finding is current, proposed, deprecated, or task-specific, check material external claims against current official sources and repository versions, give the rule one owner, and connect it to a reliable check. Remove copied framework material, internal task wording, private details, placeholders, duplicate rules, and stale claims.

Recheck guidance when its dependency, architecture, observable behavior, or supporting evidence changes. Promote frequently violated and mechanically detectable rules into tooling. Delete guidance that only repeats code or official documentation without adding repository-specific meaning.
