# Development Guidance

This directory contains repository-specific development guidance that remains useful across multiple changes. It is a navigation layer for current rules and approved engineering decisions, not a replacement for tests, tooling, framework documentation, or task-specific design documents.

## Structure

Create topic directories from the repository's real responsibilities. Do not copy a fixed taxonomy into every project.

```text
docs/dev/
  README.md
  <topic>/
    <guidance>.md
```

Topic names are repository-specific. Prefer terms already used by the repository's code, user-facing interfaces, domain language, operations, and existing documentation. Do not create empty topic directories or rename existing topics to match another repository.

Create a topic-level `README.md` only when readers cannot reliably find the right file from names and links alone. Do not move, rename, merge, split, or rewrite existing guidance solely to make the directory match this example.

## What Belongs Here

Add guidance only when all of the following are true:

- It applies to more than one change
- A future contributor would not reliably infer it from code or standard tooling
- Current repository evidence or an approved decision supports it
- There is a practical way to verify or review it.

Do not place the following here:

- Task-specific requirements, research, decisions, or implementation plans
- Generic framework documentation that can be linked from its official source
- Speculative rules for technology the repository does not use
- Generated facts that can be read directly from manifests, schemas, or tooling
- Mandatory behavior that exists only as prose when it can be enforced mechanically.

## Find Applicable Guidance

Inspect the existing directories and files under `docs/dev/` before assuming which topics exist. Read the smallest set of documents whose stated scope matches the current work. Follow repository-local indexes and links when present, but do not require every repository to use the same topic names or nesting.

Before applying guidance, compare it with current code, configuration, tests, generated artifacts, approved decisions, and dependency versions. Treat a document as evidence to review, not as proof that its claims are still current.

Prefer an existing topic when its responsibility and intended readers match the guidance. Create a new topic only when the guidance meets the inclusion rules above and no existing topic can own it without becoming ambiguous.

## Existing Guidance

Existing documents may predate this README or use a different structure. AI and contributors still use them when their scope is relevant.

- [Node.js MJS command-line scanners](./node/mjs-cli.md) defines the repository's current runtime, input, Git, literal scan, output, self-test, and ESLint rules for standalone `.mjs` scanners.

- Do not ignore a document because its path or headings differ from this README.
- Do not reorganize or rewrite existing documents while only reviewing or applying their guidance.
- Report stale claims, contradictions, unclear ownership, and missing evidence separately from the work that uses the documents.
- Ask the responsible decision owner before a finding would change an approved decision, document owner, or repository-wide rule.
- Change existing guidance only when the requested work includes that documentation change.

## Source and Audience

Development guidance is written for future contributors who must decide whether and how a rule applies. It is not a completion report to the work requester. Before writing, identify the affected repository area, the intended readers, and the action or judgment the guidance must support.

When the rule author, developer applying the guidance, reviewer, and approval owner are different, identify the applicable role. Do not assign an unverified role or responsibility; report `needs human input` when current evidence and approved decisions do not identify the owner.

Do not combine unrelated rules in one guidance document merely because they were requested or reviewed together. Give each rule the owner whose repository area, intended readers, and verification method match it; keep task-specific requirements, research, decisions, and plans under `docs/designs/`.

Treat task prompts, agent instructions, progress reports, requested output formats, tool conditions, review wording, and untracked notes as leads for investigation, not as evidence of current repository practice. Do not quote, lightly rewrite, or use them as titles, headings, rules, exceptions, or examples. Verify the underlying concern against current code, configuration, tests, generated artifacts, accepted decisions, and relevant external sources, then write only what that evidence supports.

Derive titles and headings from the repository area and the rule a contributor must understand. Write in language natural to the intended readers; do not retain literal translations, awkward terminology, emoji, or uncommon symbols merely because they appeared in a task or review comment.

Do not include credentials, personal absolute paths, local attachment locations, private project identifiers, or internal paths that readers do not need. Use a verified repository-relative path when a path is necessary. Keep exact text only when it is approved wording or a cited quotation that the guidance itself needs; task-specific evaluation data and reproduction inputs belong with the applicable design package instead.

## Guidance Document Model

Guidance documents are prose-first and do not use fixed templates. Authors may choose headings, section order, paragraphs, lists, quotations, diagrams, and code examples that fit the subject. Every guidance document must satisfy the requirements below.

### Required information

- The work and repository area to which the guidance applies
- Current repository evidence supporting the guidance
- The rule, recommendation, or limitation a contributor must understand
- Exceptions or conditions that change its application
- An automated check or an explicit review method assigned to the responsible reviewer
- External sources and relevant versions when external claims materially affect the guidance
- Whether the guidance is current, proposed, or deprecated.

Use examples only when they clarify a repository-specific rule that prose alone does not make clear. Keep examples consistent with the current stack and name the evidence they illustrate.

### Prohibited content

- Generic framework instructions copied from official documentation
- Proposals presented as current repository practice
- Repository claims that were not checked against current code, configuration, tests, or generated artifacts
- Copied rules that already have an owning document
- Vague instructions such as "follow best practices" without saying what to do and how to check it
- Task prompts, progress reports, tool instructions, or review wording presented as durable guidance
- Personal environment details, private identifiers, or paths that contributors do not need.

## Presentation

- Use one descriptive title and a logical heading hierarchy. Do not create empty headings or skip levels for visual styling.
- Put the most important rule or conclusion before background detail.
- Do not use tables. Preserve reading order with descriptive headings, short paragraphs, and lists.
- Use bullets for unordered items and numbered lists only for sequence or priority. Present paired names and descriptions as bold run-in labels followed by prose.
- When readers must compare options, rules, or repeated items, give each one its own subsection and describe the applicable attributes in the same order. Do not add empty fields merely to force uniformity.
- Separate current evidence, external recommendations, proposals, accepted decisions, exceptions, and unresolved uncertainty.
- Do not add IDs. Add YAML, repeated metadata, or fixed sections only when a current tool or review process consumes them.

## Guidance Status

- `current` guidance is supported by present repository evidence or an approved decision and applies now.
- `proposed` guidance is a researched recommendation that has not been approved or adopted.
- `deprecated` guidance no longer applies and points to its replacement or explains why it was retired.

Never present a proposed pattern as a current repository rule. Record a durable project-wide choice as accepted only after the decision owner explicitly approves it. Keep task-specific decisions under the applicable `docs/designs/` package.

## One Rule, One Owner

Each rule has one owning document. Other documents link to it instead of copying it. When two files appear to own the same rule, choose one owner and replace duplicate text with a link, or merge the files when they serve the same audience and purpose.

## Validation

Use the cheapest reliable method for each property.

- Static analysis checks syntax, imports, dependency direction, naming, and detectable code shapes.
- Type or schema checks verify data shapes, interfaces, and compatibility.
- Automated tests verify observable behavior, failure handling, and integration.
- Runtime or browser checks verify user workflows, rendering, performance, and operational signals.
- The responsible reviewer confirms intended behavior, usability, visual quality, and trade-offs. The approval owner approves the result.

Repository checks, when implemented, verify document placement, empty files, unresolved placeholders, and repository-relative links. AI reviews required information, evidence support, contradictions, applicability, and readability. Decision owners approve decisions and resolve questions that change intended behavior or engineering policy.

AI reports each applicable criterion as `pass`, `needs revision`, `needs human input`, or `not applicable`, with a short quotation or file location as evidence. If the document does not provide enough evidence, AI says so instead of inventing a current rule. Review and rewriting are separate actions.

For every new or changed guidance document, AI also reviews the final form as a future contributor. It traces each rule to repository evidence, an approved decision, or a necessary external source; rejects text derived only from internal work inputs; scans for personal or private paths and identifiers; and confirms that the title, examples, and prose explain the repository rule rather than the task that produced the document. The responsible reviewer decides whether the wording and terminology are natural for the intended readers.

Documentation explains a rule. Tooling and review determine whether a change follows it.

## Turn Repository Risks into Checks

Run this process at each of the following points:

- After the primary language, framework, runtime, and major libraries are selected and before application code is written
- Whenever a dependency is added, removed, replaced, or updated
- When development-guidance research, validation setup, or a major guidance update is requested
- When repeated review findings, incidents, or new high-impact surfaces reveal a risk that current checks do not cover.

Apply the depth of review in proportion to the change, but do not skip the applicable checks.

### Before writing application code

Inspect existing manifests, configuration, scripts, tests, CI, development guidance, and accepted decisions without reorganizing them. Review current official guidance for the selected versions and establish the smallest applicable baseline for build or syntax checks, type or schema validation, recommended static analysis, dependency and security checks, and observable behavior testing.

Provide runnable commands for the selected baseline and run them once before writing application code. Do not start writing application code until the applicable checks pass or unresolved items that require judgment have been reported and explicitly accepted by the responsible decision owner. Do not attempt to prohibit every theoretical anti-pattern before development begins.

Before changing behavior, identify the observable behavior, public API, persisted data, error handling, affected callers, and connection points that the request does not authorize changing. Select implementation patterns from current official guidance for the installed version, applicable repository guidance, and check results. Do not treat repetition or proximity in existing code as proof that a pattern should be reused.

Use repository-defined commands for verification. When none exists, label an inferred command as a proposal and obtain approval before running it. Use browser checks for affected user-visible UI behavior when needed, and runtime or integration checks for affected CLIs, services, and background jobs. Stop processes started for verification when the check finishes.

### When dependencies change

Before selecting or changing a dependency, verify its purpose, selected version, current official integration structure, and design patterns that materially affect the intended use. Inventory every direct and transitive external dependency in the resolved graph. For each one, record its name, resolved version, capabilities, potential issues, and an applicable design pattern. When no pattern applies, record `not applicable` separately from the cited facts that support that conclusion. Do not invent a pattern name when official sources do not establish one. Compare the dependency with installed dependencies, platform capabilities, and an internal implementation, then check runtime and peer compatibility, maintenance and security status, and license when relevant.

After an authorized dependency change, inspect the actual additions, removals, and updates in the manifest, lockfile, and any resolved dependency-graph artifact used by the repository. Recheck unexpected transitive changes. Inspect configuration, types, generated artifacts, tests, and affected imports or public APIs, update only the checks and guidance that the change actually affects, then run the applicable baseline and behavior checks.

### When risks are found

Inspect the current code, dependencies, configuration, tests, repeated review findings, and incident records for recurring failures and high-impact risks. Focus on cases relevant to the repository and current work. Do not attempt to enumerate every theoretical code case.

For each candidate:

- State the failure to prevent, the affected scope, and where the failure can be observed
- Reuse existing compiler, type, schema, lint, test, and CI capabilities before proposing another tool
- During authorized implementation, add or tighten a static rule only when it detects the intended violation with acceptable precision, has been checked with valid and invalid cases or equivalent evidence, and has proportionate execution and maintenance costs
- When static analysis cannot prove the property reliably, use a type or schema check, automated test, runtime or browser check, or explicit review by the responsible reviewer that observes the relevant failure
- Use code examples to explain a rule or test an automated rule, but do not treat non-executable examples as proof of compliance.

Research and review do not by themselves authorize dependency, tool, or configuration changes. Keep repository-specific cases, selected rules, commands, exceptions, and evidence in the applicable topic document or tool configuration rather than this root README.

## Add or Update Guidance

Using or reviewing guidance does not by itself authorize edits. When an update is explicitly requested:

1. Use the task description only to identify what to inspect, then inspect current code, configuration, tests, generated artifacts, related design decisions, and existing guidance for publishable evidence.
2. Decide whether the finding is a current rule, a local limitation, a proposal, or a task-specific concern that belongs under `docs/designs/`.
3. Check material external claims against current official sources and the versions used by this repository.
4. Give the rule one owning document and connect it to an automated check or explicit review by the responsible reviewer.
5. Validate required information, evidence, links, applicability, and readability without silently rewriting the document.
6. Remove copied framework material, task wording, progress commentary, private environment details, placeholders, duplicate rules, and stale claims.

## Maintenance

- Recheck guidance when the relevant dependency, architecture, observable behavior, or repository evidence changes.
- Mark uncertain or unapproved guidance as proposed rather than current.
- Promote frequently violated, mechanically detectable rules into lint, tests, schemas, hooks, or CI.
- Delete guidance that only repeats code or official documentation without adding repository-specific meaning.

## Design Basis

- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) supports short routing documents, repository-local knowledge, and mechanical checks instead of relying on prose alone.
- [OpenAI: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recommends task-specific criteria, automated checks where possible, and calibration with reviewer judgment.
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) recommends deterministic checks where possible, model review for open-ended results, and reviewer calibration.
- [Anthropic: Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) recommends progressive disclosure, deterministic code for repeatable operations, and adding guidance from observed failures.
- [ESLint: Configure Rules](https://eslint.org/docs/latest/use/configure/rules) and [typescript-eslint: Custom Rules](https://typescript-eslint.io/developers/custom-rules/) support scoped rule configuration, explicit severity, and valid and invalid rule tests rather than enabling every available rule.
- [typescript-eslint: Typed linting performance](https://typescript-eslint.io/troubleshooting/typed-linting/performance/) documents the execution cost of type-aware linting, which must be weighed against the value of the check.
- [TypeScript: `strict`](https://www.typescriptlang.org/tsconfig/#strict) illustrates starting from the selected language's supported correctness checks instead of inventing repository rules first.
- [GitHub: Code scanning default setup](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning) and [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review) support starting with an applicable baseline and reviewing dependency changes against repository evidence.
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices) supports testing user-visible behavior instead of relying on implementation details.
- [W3C: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/), [Google: Lists](https://developers.google.com/style/lists), [Google: Paragraph structure](https://developers.google.com/style/paragraph-structure), [Microsoft: Lists](https://learn.microsoft.com/en-us/style-guide/scannable-content/lists), [Digital.gov: Headings](https://digital.gov/guides/plain-language/design/headings), and [GOV.UK: Publishing accessible documents](https://www.gov.uk/guidance/publishing-accessible-documents) support descriptive headings, concise paragraphs, and list formats chosen for the information's order and relationships.
