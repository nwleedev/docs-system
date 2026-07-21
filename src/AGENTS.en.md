# AGENTS.md

## Language

- Write code and file names in English.
- Write the Git commit `type` and `scope` in English, and write the title `subject` and body in English.
- Communicate with the user in English.
- Write design documents, work descriptions, and explanatory code comments in English.

## Core Principles

**Context Compaction**

After context compaction, reread AGENTS.md, especially **Core Principles**, and apply it to the work.

**Doing the Work Correctly**

- Do not implement code unless the user explicitly asks you to implement code.
- Do not write tests unless the user explicitly asks you to write tests.
- Do not use TDD unless the user explicitly asks you to use TDD.
- Do not reduce a requested change to a superficial patch that leaves the underlying problem unresolved.
- Do not alter the scope of the work on your own.
- Choose work that correctly addresses the request. Do not avoid a necessary fix merely because it is harder, but obtain approval before taking destructive or high-impact actions.
- The user may require a linked worktree so that work in different areas can proceed safely at the same time.
- Do not use emoji.
- When comments are used, their explanations may drift from the behavior of the code. Write code clearly enough that each part's role can be understood.
- Do not stop after writing code once. Check for similar code and consider whether the code can be modularized.
- Do not disable type checking to resolve an error.
- Do not disable requirements or features stated in the design.
- Do not delete or weaken tests to hide a test failure.

**Writing**

- Do not produce generic, formulaic text that could be reused unchanged for another project. Write for the actual reader, repository, and decision at hand.
- Make every sentence contribute evidence, a decision, an instruction, or necessary context. Remove introductions, conclusions, summaries, and transitions that only restate nearby text.
- Prefer specific nouns and strong verbs over abstract nouns, hidden verbs, inflated claims, and decorative adjectives or adverbs.
- Do not use words such as "pivotal," "crucial," "comprehensive," "seamless," "robust," or "delve" as decoration. Use them only when they express a precise, supported distinction.
- Do not force every section into the same paragraph shape, repeated transition pattern, or arbitrary three-part list. Let the content determine the structure.
- Use a natural, direct, and professional voice. Avoid promotional language, performative enthusiasm, fake quotations, and claims about what readers think or feel without evidence.
- Before publishing text, read it once for meaning and remove any sentence that sounds polished but adds no information.

**Legacy Code**

- Treat every file and document in the repository as potentially legacy. Always verify it.
- Do not remove existing behavior unless the user explicitly asks you to "remove" or "replace" it.
- Whenever you write code, continuously research and cross-check the best practices, architecture, and design patterns relevant to that code.
- Apply better practices without breaking existing behavior unless the user has approved that behavior change.
- Tests must verify observable behavior regardless of whether the code is legacy.

**Research**

- For every prompt, research internet sources through multiple methods and cross-check them to ensure accuracy and currency.
- Use at least five primary sources, such as official documentation, standards, original documents, and real source code, instead of blogs or curated articles.
- Check the latest information first and include trustworthy sources in every response.
- Use MCP when visual research or cross-checking is necessary.
- Use the `gh` CLI when researching repository files and issues on GitHub.
- Prefer an official source repository over a personal repository when researching source code.
- Provide sources and short quotations within permitted limits so that the user can verify the research.
- Research requirements govern the agent's analysis and response. Do not copy citations, research notes, recommendations, or source wording into a target file unless the user requested them in that artifact and its intended readers need them.
- Finding that the repository lacks a license, policy, check, document, or decision is not authorization to add one or to write a placeholder, warning, or maintainer instruction into the target artifact. Report the gap separately and obtain approval when it would change the requested result.

**Application Verification**

- Use a browser to verify how the actual application works.
- Run the application with commands defined by the project.
- If the project does not define a command, propose the command that best matches the project's conventions, identify it as an inference, and ask before running it.
- When running E2E tests or verifying actual application behavior, start the development server yourself and stop it when the work is complete.

## Subagent Use

- Do not use subagents for simple work, work that fits in one context, or work whose coordination cost is greater than the expected time saved.
- When work can be divided into at least two independent units and the expected time saved is greater than the cost of assigning and reconciling the work, the main agent delegates those units to subagents.
- Give each subagent the applicable requirements, the exact task, the paths to inspect, the allowed file-change scope, stop conditions, and the expected result.
- If the user names a specific Skill or the active Skill defines how to use subagents, follow that Skill. Do not duplicate the same role or add a separate review step outside the Skill.
- The main agent is responsible for requirements, task allocation, dependencies, result reconciliation, conflict resolution, stop decisions, and final verification.
- Do not treat a subagent's report as completion evidence. The main agent must inspect the actual files, changes, and check results.

### Parallel Execution

- Independent research questions, read-only reviews from different perspectives, and unrelated log or test-result analyses may run in parallel.
- Run implementation work in parallel only when the tasks do not overlap in modified files, public interfaces, schemas, generated files, lockfiles, configuration, development servers, databases, or test data.
- Do not run work in parallel when one result becomes another task's input or when the affected scope is uncertain.
- Stay within the environment's concurrency limit and queue the remaining work.

### Sequential Execution

- Resolve questions that can change requirement behavior before finalizing the plan, then start implementation against the reviewed plan.
- Run tasks sequentially when they modify the same file or shared state, or when one task depends on another task's result.
- Apply review findings and run the follow-up review only after the original review is complete.
- After an independent work unit produces a stable change or commit, implementation of the next independent unit may overlap with read-only review of the completed unit.

### Requirement Changes

- When requirements change, pause new task assignments and assess the effect on work in progress.
- Continue only unaffected work. Stop affected work or revalidate it against the changed requirements.
- Stop all related work and ask the requirements owner when the effect is uncertain or when shared assumptions and completion criteria have changed.

## Documentation Work

### Design Documents

- Read `docs/designs/README.md` before creating, reviewing, planning, implementing from, or validating documents under `docs/designs/**`.
- If the target work has a `requirements.md`, read it in full, then read only the references, decisions, plan, and repository evidence needed for the current question.
- If a design package is necessary but `requirements.md` does not exist, AI may create a small, easy-to-revise initial draft containing only the outcomes, conditions, completion evidence, and questions explicitly stated by the user. Do not infer unstated content or add empty headings and placeholders.
- The requirements owner controls the wording and order of `requirements.md`. After the initial draft, AI may edit it only when the requirements owner requests a change or approves the exact wording. Do not record unapproved inferences as requirements or decisions.
- For a conversation-only review or investigation that does not need a design package, use the current request as the work baseline. Do not stop or create a package solely because `requirements.md` is absent.
- Derived documents do not follow fixed templates. They must satisfy the required information, prohibited content, validation methods, and readability criteria defined in `docs/designs/README.md`.
- Connect references, decisions, work units, and verification results to exact requirement excerpts and their headings.
- When the work is complete, check the documents and actual results again against the criteria in `docs/designs/README.md`.

### Development Guidance

- Read `docs/dev/README.md` before planning, implementing, reviewing, refactoring, testing, or documenting an application change.
- Do not read all of `docs/dev`. Select only the guidance relevant to the current work and list those files in the plan or equivalent execution input. For a committed plan, treat the selected files in the commit that last changed the plan as the reviewed baseline. If a selected file changes later, compare it with that baseline before continuing affected work.
- Development guidance does not follow a fixed template. It must satisfy the inclusion conditions, required information, prohibited content, validation methods, and readability criteria defined in `docs/dev/README.md`.
- Check the current code, configuration, tests, generated artifacts, approved decisions, and dependency versions before treating existing guidance as a current rule.
- Verify mechanically checkable rules with lint, type or schema checks, tests, hooks, CI, or runtime evidence. Leave product meaning to the responsible reviewer and approval to the approval owner.
- When the work is complete, confirm that the actual changes match the selected development guidance.

### Review Principles

- Document titles and structure may fit their content, but check every required item separately and cite the supporting location.
- Report each result as `pass`, `needs revision`, `needs human input`, or `not applicable`. Do not infer what cannot be supported by evidence.
- Keep document review and document editing as separate tasks. Do not automatically rewrite requirements, decisions, or current guidance while reviewing them.
- Documentation alone does not prove implementation compliance. Use repository checks and explicit review by the responsible reviewer together.
- Treat research and review findings as findings, not as permission to edit the requested artifact. When a finding requires a new decision, policy, section, or change of scope, report it separately and obtain approval before editing.

## Environment Variables and Sensitive Information

- Do not commit personal information, security keys, internal URLs, tokens, or credentials to Git. Do not commit absolute paths that may expose a personal computer account.
- Manage data that must not be committed with environment files such as `.env`.
- Do not hardcode sensitive mock values in tests. Use test-only environment variables or fixtures defined in the tests.
- Before committing, check for environment files, credentials, tokens, personal information, internal URLs, private repository references, and absolute paths that expose a personal account.

## Temporary Files

- Do not use a system-level directory such as `/tmp`.
- Store temporary files under `temps/<scope>-<nonce>/` at the project root.
- Use `scope` for the work area and a short collision-resistant identifier for `nonce`.
- Store screenshots created by Playwright MCP or Chrome DevTools MCP under the same file-location rule.

## Public Outputs

- Treat repository content that is committed or shared, including file and directory names, README files, documentation, source code and comments, commit and pull-request text, issue text, release notes, user-visible and assistive text, as public outputs unless the repository explicitly classifies it otherwise.
- Before writing a public string or name, identify its intended readers, what they must understand or do, the actor described by the text, and any reviewer or approval owner. When those roles matter, name the verified role or describe the action directly instead of using a broad label such as `person` or `human`. If repository evidence does not identify the role, report the unresolved role instead of inventing it.
- Base every public statement on verified repository evidence, an approved decision, or previously approved public wording. Do not use a user prompt, agent instruction, internal task description, work note, review criterion, rubric, output format, or workflow commentary as publishable source text.
- Do not quote, copy, or lightly rewrite internal source text into a public output. When the underlying information is necessary, write it again as verified product behavior, usage guidance, or approved policy for the intended reader. If no public-safe source supports it, omit it and report the gap separately.
- Keep internal identifiers, private document references, implementation-only names, maintainer reminders, unresolved decisions, review notes, and publication checklists out of public outputs. Do not insert `TODO`, `TBD`, or similar placeholders unless the status itself is approved information that readers need.
- Do not infer unresolved ownership, support, security, compatibility, privacy, contribution, or licensing terms. Report the required decision separately and update the public output only after an approved source exists.
- Write commit messages from the actual change and its reason. Write user-visible and assistive text from the task the user is performing, the purpose of the element, and the state the user needs to understand.
- Keep public-output edits separate from repository-management work. Do not create an issue, planning item, policy file, or community file unless the user explicitly authorizes it.

### Pre-publication Check

1. List every changed public output, including changed file and directory names and the commit-message draft.
2. Trace every added sentence or string to repository evidence, an approved decision, or approved public wording.
3. Reject text derived from prompts, internal tasks, review criteria, output formats, or workflow commentary.
4. Search the changed outputs for internal identifiers, private paths, distinctive prompt phrases, HTML comments, and unresolved markers such as `TODO`, `TBD`, and `FIXME`.
5. Check claims about licensing, support, security, compatibility, ownership, and product behavior against their approved source.
6. Read the rendered or final form as the intended reader. Confirm that actors, reviewers, and approval owners are named only when repository evidence supports those roles. Do not publish or commit an output that still explains the agent's work rather than the project.

## Dependencies

- When researching a dependency, investigate its provided features, version, and potential issues as well as its name.
- Perform dependency research during the work-design phase.
- Compare the concrete tradeoffs of an external dependency and an internal implementation, then choose the option with the lowest complexity and maintenance cost that still meets the requirements.
- Before introducing an external dependency, research the applicable static-analysis tools, best practices, architecture, and design patterns, then reflect them in the design and harness documents.

## Comments

- Research the comment conventions for the project's technology stack and reflect them in the design.
- Use `/** ... */` JSDoc or TSDoc documentation comments for application functions, methods, and exported symbols. Use `//` line comments for implementation reasoning.
- Documentation comments must let a first-time reader understand how to call the code. For functions, include a summary, `@param`, and `@returns` by default. Use `@remarks` or `@throws` for side effects, SSR or client boundaries, security constraints, exception propagation, and other information callers must know.
- In TypeScript, do not repeat type names already present in the signature with forms such as `@param {Type}`. Explain the value's meaning, allowed range, default, unit, normalization rules, and the domain meaning of the return value instead.
- Do not add unnecessary documentation comments to private or local helpers when their names and types already explain them. Do document public APIs, shared utilities, Route Handler or BFF helpers, and chart, URL, parser, or threshold policy functions.
- If the user explicitly requests comments for every expression, write one or two lines for every expression and declaration so that a reader new to the code can understand it.

## Gitignore

- Do not commit files matched by `.gitignore`.
- Before committing, check for sensitive information and credentials.
- Check whether the "Environment Variables and Sensitive Information" section of AGENTS.md contains related rules, and consult it again if it does.

## Git Branches

- Check the current Git branch before starting work.
- Use linked worktrees so that multiple terminals can work in parallel. Place linked worktree directories under `.worktrees/` at the repository root.
- For linked worktrees that are no longer in use, cross-check whether they can be removed and propose removal.
- The user may ask to continue work in an existing linked worktree or to create a new one.
- To avoid creating unnecessary linked worktrees, use the same branch for both design and implementation. Choose a type that matches the work instead of defaulting to a `docs` branch.
- Do not modify the repository's default, integration, release, or protected branches directly unless the user explicitly asks you to work on the current branch. Create a new work branch first.
- Work on agent environment settings under `.codex` or `.claude` may proceed without changing branches.
- Follow the repository's existing branch-naming rules. If none exist, use `<type>/<short-description>`.

Default `<type>` values:

- `feature`
- `fix`
- `hotfix`
  - Use `hotfix` only for actual hotfix work, not for ordinary fixes.
- `refactor`
- `test`
- `docs`
- `chore`

## Git Commits

- Decide whether a work unit is worth a commit and commit it when appropriate.
- Apply the Public Outputs rules to the commit subject, body, and trailers. Describe the repository change and why it was needed. Do not mention the user prompt, agent instructions, internal task wording, review criteria, private references, or the agent's work process.
- Use a subject line, followed by an optional body and optional trailers.
- Follow the repository's existing commit convention. If none exists, format the subject as `<type>[optional scope][!]: <description>`.
- When the repository does not define commit types, use `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, or `build`.
- If a scope is useful, write it in English and name the affected module or component.
- Write the description as a short imperative phrase without a final period.
- When a body is needed, write it in English and explain why the change was necessary. Let the diff show what changed.
- Use `BREAKING CHANGE: <description>` for a breaking change under Conventional Commits.
- On GitHub, use `Fixes #N` or `Closes #N` only when the commit should close the issue after it reaches the default branch.
- Use `Co-authored-by: Name <email>` to credit another author on GitHub.

## Prohibited Actions

- Do not discard uncommitted changes, overwrite files, rewrite shared history, force-delete branches, or run similarly destructive commands without user approval.
- Do not revert user-created changes on your own.
