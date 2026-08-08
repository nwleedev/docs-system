# AGENTS.md

## Language

- **Lead every response and document with its conclusion.** When a conclusion-first structure is inappropriate, explain why in one line when the file format permits comments.
- Write code and file names in English.
- Follow the Git instructions below for commit messages.
- Unless the repository specifies another language, write design documents, work descriptions, and explanatory code comments in English.
- Communicate with the user in English.

## Basic Principles

**Responses**

- Write direct, natural English. Do not preserve the structure of another language when it hides the actor, action, condition, or result.
- Treat polished but vague abstractions as signals to inspect the context, not as automatically acceptable wording. Keep precise technical terms; otherwise state the actual rule or action and ask the user when the evidence is insufficient.

**Context compaction**

- After context compaction, reread the applicable AGENTS.md files, especially the **Basic Principles**, before continuing.
- Maintain appropriate Git commits so the work can be recovered after context compaction. Inspect the Git history first when resuming.

**Prohibited actions**

- Do not implement code unless the user explicitly requests code implementation.
- Do not write test code unless the user explicitly requests test-code authoring.
- Do not perform TDD unless the user explicitly requests TDD.
- Do not change the requested scope on your own.
- Do not use emoji.
- Do not remove or overwrite changes or run similarly irreversible commands without the user's approval.
- Avoid comments when the code can express the role directly. Write code whose parts can be understood without explanatory narration.
- After writing code, inspect similar code and consider shared implementation only when the responsibility and verification are genuinely the same.
- Do not disable type checking to resolve an error.
- Do not disable a requirement or feature specified by the design.
- Do not delete or weaken tests to hide a failure.
- Do not write generic prose that could be pasted into any project. Reflect the current readers, repository, and decisions.
- Remove formulaic phrases and inflated modifiers that add no meaning.
- Do not force equal-length sections, divide content into three items without evidence, or repeat the same transition. Let the content determine the structure.
- Do not translate word by word. Identify the source's subject, action, conditions, and responsible actor, then write natural English.
- Do not replace established technical terms merely to avoid their original language. Keep terms that are precise in the field; otherwise describe the actual action or condition.

**Existing behavior and code**

- Do not remove or weaken existing behavior unless the user requests that change. Determine what must remain from user-visible results, externally used APIs, stored data, error handling, current tests, and runtime evidence.
- Use existing code only to understand current behavior. Do not copy a pattern merely because it appears in several files or near the code being changed.
- Before writing new code, inspect current official guidance for the technology and version, the development guidance that applies in this repository, configuration, and check results. Choose the approach that fits the current work and do not repeat anti-patterns found in existing code.
- Apply the selected approach while preserving existing behavior, externally used APIs, data formats, and required compatibility. When older code requires conversion, keep that conversion at the connection point instead of spreading the older pattern through new code.
- If the selected approach requires changing existing behavior or repository-wide structure, explain the behavior that must remain and the expected impact, then obtain the user's approval before proceeding.
- Tests must verify user-observable behavior and approved compatibility conditions, not whether new code reproduces the previous implementation's shape.

**Research**

- For every prompt, research internet sources through multiple methods and cross-check them for accuracy and currency.
- Try to obtain at least five primary sources, such as official documentation, standards, original documents, and actual source code, instead of blogs or curated articles.
- Check the latest information first and include trustworthy sources in every response.
- Use MCP when visual research or cross-checking is needed.
- Use the `gh` CLI when researching repository files and issues on GitHub.
- Prefer an official source repository over a personal repository when researching source code.
- Provide sources and short quotations within permitted limits so the user can verify the research.
- Apply the research rules to the agent's investigation and response. Do not copy citations, research notes, recommendations, or source wording into a target file unless the user requested them in that artifact and its intended readers need them.
- Finding that a repository lacks a license, policy, check, document, or decision does not authorize adding one. Do not put placeholders, warnings, or maintainer tasks into the target artifact. Report the gap separately and obtain approval when it would change the requested result.

## Subagent Use

- Do not use subagents for simple work, work that fits in one context, or work whose coordination cost is greater than the expected time saved.
- When work can be divided into at least two independent units and the expected time saved is greater than the cost of assignment and reconciliation, the main agent delegates those units to subagents.
- Give each subagent the applicable requirements, exact task, paths to inspect, allowed file-change scope, stop conditions, and expected result.
- If the user names a specific Skill or the active Skill defines how to use subagents, follow that Skill. Do not duplicate the same role or add a separate review step outside the Skill.
- The main agent is responsible for requirements, task allocation, dependencies, result reconciliation, conflict resolution, stop decisions, and final verification.
- Do not treat a subagent's report as completion evidence. The main agent must inspect the actual files, changes, and check results.

### Parallel Execution

- Independent research questions, read-only reviews from different perspectives, and unrelated log or test-result analyses may run in parallel.
- Run implementation work in parallel only when the tasks do not overlap in modified files, public interfaces, schemas, generated files, lockfiles, configuration, development servers, databases, or test data.
- Do not run work in parallel when one result becomes another task's input or when the affected scope is uncertain.
- Stay within the environment's concurrency limit and queue remaining work.

### Sequential Execution

- Resolve questions that can change requirement behavior before finalizing the plan, then start implementation against the reviewed plan.
- Run tasks sequentially when they modify the same file or shared state, or when one task depends on another task's result.
- Apply review findings and run the follow-up review only after the original review is complete.
- After an independent work unit produces a stable change or commit, implementation of the next independent unit may overlap with read-only review of the completed unit.

### Requirement Changes

- When requirements change, pause new task assignments and assess the effect on work in progress.
- Continue only unaffected work. Stop affected work or revalidate it against the changed requirements.
- Stop all related work and ask the requirements owner when the effect is uncertain or when shared assumptions and completion criteria have changed.

## Skill Use and Work Environment

**If a required Skill or one of its required references cannot be read, do not infer replacement rules. Stop and report the missing prerequisite. When only the repository authority README is absent, follow the creation-approval and alternative-location procedure defined by `use-design-docs` or `use-dev-guidance`.**

<!-- BEGIN USE WORDS REVIEW -->

### Text and Names

- Before drafting Korean text or names that will be stored, committed, published, or shared outside the conversation, read the pre-draft reference required by `$use-words-review`.
- Group text and names in any language by publication unit and run `$use-words-review` once immediately before storing or sharing them.
- When the user explicitly requests review of wording or a public output, review the complete requested unit even when no file changed.
- Do not run `$use-words-review` merely because routine chat or a progress update is sent.
- Base every reader-facing statement on verified repository evidence, an approved decision, or approved wording. Do not use a user prompt, agent instruction, internal task description, work note, review criterion, rubric, output format, or workflow commentary as publishable source text.
- Keep internal identifiers, private document references, implementation-only names, maintainer notes, unresolved decisions, review notes, and pre-publication checklists out of reader-facing content. Do not insert `TODO`, `TBD`, or similar placeholders unless the status itself is approved information that readers need.
<!-- END USE WORDS REVIEW -->

### Research, Cross-checking, Design, and Documentation

- Run `$use-design-docs` when clarifying requirements; researching, creating, reviewing, planning, or validating `docs/designs/**`; or using a document under `docs/designs/**` as implementation input.
- Keep requirements and approved decisions separate from AI research and proposals.
- Use the repository's `docs/designs/README.md` as the authority for design-document structure, recording locations, and validation criteria.

### Development Guidance, Technology Stack, and Checks

- Run `$use-dev-guidance` when planning, implementing, reviewing, refactoring, testing, or documenting changes to source code, tests, CLIs, libraries, scripts, builds, CI, or configuration, and when changing dependencies or checks.
- Follow the repository's `docs/dev/README.md` and the topic guidance it selects for development methods, stack-specific rules, execution commands, and verification.
- Before selecting, adding, replacing, removing, or changing the version of an external dependency, research its officially recommended integration and applicable design patterns.
- Research every direct and transitive external dependency. For each dependency, confirm its name, version, capabilities, potential issues, and applicable design patterns.
- Compare external dependencies with already installed dependencies, platform capabilities, and an internal implementation.
- Research does not authorize applying a dependency change. Confirm the user's change request and the repository's approval process separately.

## Environment Variables and Sensitive Information

- Do not commit personal information, security keys, internal URLs, tokens, or credentials to Git. Do not commit absolute paths that may expose a personal computer account.
- Manage data that must not be committed with environment files such as `.env`.
- Do not hardcode sensitive mock values in tests. Use test-only environment variables or fixtures defined in the tests.
- Before committing, check for environment files, credentials, tokens, personal information, internal URLs, private repository references, and absolute paths that expose a personal account.

## Temporary Files

- Do not use a system-level directory such as `/tmp`.
- Store temporary files under `temps/<scope>-<nonce>/` at the project root.
- Use `scope` for the work area and a short collision-resistant identifier for `nonce`.
- Store screenshots created by MCP under the same file-location rule.

## Gitignore

- Do not commit files matched by `.gitignore`.
- Before committing, check for sensitive information and credentials.
- Recheck the applicable rules in the "Environment Variables and Sensitive Information" section of AGENTS.md.

## Git Branches

- Check the current Git branch before starting work.
- Create a new worktree branch only when the user explicitly requests one. After the request, inspect the current branch and repository rules, and place a manually created worktree under `.worktrees/` at the repository root.
- For worktree branches that are no longer in use, cross-check whether they can be removed and propose removal.
- The user may ask to continue in an existing worktree branch or create a new one.
- Use the same branch for design and implementation so worktrees do not multiply unnecessarily. Choose a type that matches the work instead of defaulting to `docs`.
- Do not modify `main`, `master`, `develop`, `dev`, or `release/*` directly. Create a work branch first.
- Work on agent environment settings under `.codex` or `.claude` may proceed without changing branches.
- Name branches `<type>/<short-description>`. Reflect the branch name in the worktree path as `.worktrees/<type>/<short-description>`.
- Compound Skills are optional. When they are absent, use Git's worktree and commit features directly under this section and do not stop Git work merely because those skills are unavailable.

Allowed `<type>` values: `feature`, `fix`, `hotfix` (only for an actual hotfix), `refactor`, `test`, `docs`, `chore`

## Git Commits

- Decide whether a work unit is worth a commit and commit it when appropriate.
- Apply these rules to the commit subject, body, and footers. Describe the actual repository change and why it was needed. Do not mention the user prompt, agent instructions, internal task wording, review criteria, private references, or the agent's work process.
- Use a subject, body, and optional footers.
- Format the subject as `<type>(<scope>): <subject>`.
- Use one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, or `build` for `type`.
- Write `scope` in English and name the affected module or component.
- Write `subject` as a lowercase English imperative without a final period.
- Write the body in English and explain why the change was necessary. Let the diff show what changed.
- Use `BREAKING CHANGE:`, `Fixes #N`, or `Closes #N` footers when applicable.
