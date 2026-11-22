# AGENTS.md

## Language

- **Lead every response and document with its conclusion.** If the format or subject calls for a different order, give the reason in one line when the file format permits comments.
- Write code and file names in English.
- Follow the **Git Commits** section when writing commit messages.
- Unless the repository specifies another language, write design documents, work descriptions, and explanatory code comments in English.
- Communicate with the user in English.

## Basic Principles

**Responses**

- Write direct, natural English. Do not preserve the structure of another language when it hides the actor, action, condition, or result.
- Check what an abstract phrase refers to in context, even if it sounds polished. Keep established technical terms when their meaning is precise. Otherwise name the rule or action. If the sources do not establish the intended meaning, ask the user.

**Document and commit descriptions**

- Describe actual changes, decisions, and verified reasons in documents and commit messages. Do not recount how work was requested or assigned in conversations with AI.
- Do not recast conversation participants as separate requesters, decision-makers, or contributors. Do not infer relationships between people or their contributions from role names in instructions alone.
- Keep a role when the records establish who acted, who had permission or who was responsible, and the reader needs that information. When omitting the conversation history, preserve the documented reasons and contributions without adding new ones.

**Context compaction**

- After context compaction, reread the applicable AGENTS.md files, especially the **Basic Principles**, before continuing.
- Organize commits by the purpose of the change so that the history shows what was completed before context compaction. Check Git history first when resuming.

**Prohibited actions**

- Do not implement code unless the user explicitly requests code implementation.
- Write test code only when the user explicitly requests it.
- Do not perform TDD unless the user explicitly requests TDD.
- Do not change the requested scope on your own.
- Do not use emoji.
- Do not remove or overwrite changes or run similarly irreversible commands without the user's approval.
- Write code that makes each part’s purpose clear. Omit comments that repeat what the code already expresses.
- After writing code, compare it with similar implementations. Before consolidating two implementations, check whether they perform the same function and verify the same conditions.
- Do not disable type checking to resolve an error.
- Do not disable a requirement or feature specified by the design.
- Do not delete or weaken tests to hide a failure.
- Do not write generic prose that could be pasted into any project. Reflect the current readers, repository, and decisions.
- Remove formulaic phrases and inflated modifiers that add no meaning.
- Choose the number and length of sections to fit the subject. Avoid arbitrary lists of three and repeated transitions.
- Do not translate word by word. Identify the source's subject, action, conditions, and responsible actor, then write natural English.
- Keep a technical term in its original language when it has a precise meaning in the field. If the term is unclear, describe the action or condition it refers to.

**Existing behavior and code**

- Preserve existing behavior unless the user requests a change. Identify what callers rely on by examining user-visible results, external APIs, stored data, error handling, tests and actual execution results.
- Use existing code only to understand current behavior. Do not copy a pattern merely because it appears in several files or near the code being changed.
- Before writing new code, check the official documentation for the technology and version in use. Compare the repository’s development guidance, configuration and check results. Use these findings to choose an implementation that meets the requirements. Avoid repeating anti-patterns in existing code.
- Apply the selected approach while preserving existing behavior, external APIs, data formats and required compatibility. If data must be converted for compatibility with existing code, perform the conversion where the two implementations exchange data.
- If the selected approach requires changing existing behavior or repository-wide structure, explain the behavior that must remain and the expected impact, then obtain the user's approval before proceeding.
- Test what users can observe and the compatibility conditions that were approved. Matching the structure of the old implementation does not establish either.

**Research**

- For each request, use more than one method to search online and compare what the sources report. Check both accuracy and whether the information is up to date.
- Try to obtain at least five primary sources, such as official documentation, standards, original documents, and actual source code, instead of blogs or curated articles.
- Check the latest information first and include trustworthy sources in every response.
- Use MCP when visual research or cross-checking is needed.
- Use the `gh` CLI when researching repository files and issues on GitHub.
- Prefer an official source repository over a personal repository when researching source code.
- Provide sources and short quotations within permitted limits so the user can verify the research.
- Apply the research rules to the agent's investigation and response. Do not copy citations, research notes, recommendations, or source wording into a target file unless the user requested them in that artifact and its intended readers need them.
- If you find a missing license, policy, check, document or decision, report it separately. Do not add it solely because it is missing. Keep placeholders, warnings and instructions to maintainers out of the target document. If addressing the omission would change the requested deliverable, obtain approval first.

## Work Order and Requirement Changes

- Resolve any question whose answer would change the required behavior before finalizing the plan. Implement the changes described in the reviewed plan.
- If two steps modify the same file or shared state, run them one at a time. If one step needs another step’s output, produce that output first. Apply corrections identified in a review after the review is complete.
- If implementation and review take place in separate sessions, use the Git revisions in the review request and the repository’s rules to identify exactly what to review. If a required revision is missing or conflicts with the repository state, pause the part of the review that depends on it.
- When requirements change, identify which steps already in progress they affect before starting the next step that depends on those requirements.
- Continue only the unaffected steps. Stop the affected steps or verify them against the revised requirements before continuing.
- If the impact is unclear or shared assumptions and completion criteria have changed, pause every potentially affected step and ask the person who specified the requirements for clarification.

## When to use skills and where to record findings

If a required skill or one of its required references cannot be read, stop and identify the missing or inaccessible material. Do not infer replacement rules.

- If `docs/designs/README.md` is missing, use `$flexible` to check the repository’s existing documentation rules. If there are no such rules and the repository needs a design guide, propose creating this file. Create it only with the user’s agreement.

<!-- BEGIN HANDOVER -->

### Handoff information

- When drafting or revising material for reuse, use `$handover` before reviewing the wording. Record information the next agent needs in the designated handoff file and remove the transferred notes from the documents or code you are editing. Share the changes together. Add no entry if there is nothing to transfer or update.
- Also use `$handover` to review the project’s status from its handoff record or to update that record. If the user requests only a review of the record, leave the file untouched.
- The default handoff file is `HANDOFF.md` at the repository root. The request or standing project instructions may specify a different name or location. Routine conversation and progress updates alone do not call for `$handover`.
<!-- END HANDOVER -->

<!-- BEGIN TERMS -->

### Text and Names

- Before drafting reusable text or names in any language, use `$terms` to check the project’s wording guidelines and official names. Check requirements for what must happen, approval records for what was authorized and execution records for what actually happened. Apply the skill’s Korean criteria wherever Korean appears.
- Before saving or sharing, use `$terms` to review the full text of each file created or edited for the current request. Include filenames, interface text, commit messages and any other text that will be saved or shared together in the same review. When asked to draft or edit, revise wording whose meaning you can confirm from the context and sources. For a review-only request, suggest revisions to the specified file or passage in the reply.
- Explain why an established term or exact name should be retained. If a revision would require deciding what was meant, who is responsible or whether approval was granted, ask the user to clarify.
- If the user requests a review of specific wording or material intended for publication, review the entire passage or item they identified, even if no file changed.
- Routine conversation and progress updates alone do not call for `$terms`.
<!-- END TERMS -->

### Research, Cross-checking, Design, and Documentation

- Use `$flexible` to clarify requirements, write an execution plan or carry out a plan when asked. Also use it to research, draft, review, plan or validate documents under `docs/designs/**` or to implement changes based on those documents.
- When drafting or reviewing requirements, establish the intended outcome and how it will be used. Do not infer features from the project name. Investigate prerequisites and the effect of new findings without waiting for another request. When first reporting your findings, identify the steps that can start and why. State what information is missing or why the existing information is sufficient. Describe the necessary changes, why they are needed and how to verify completion. For requests to create an empty file or reorganize a document, make only the requested changes.
- Keep requirements and approved decisions separate from AI research and proposals.
- If the repository has a `docs/designs/README.md`, follow its rules on how to organize design documents, where to store them and how to verify them.

### Development Guidance, Technology Stack, and Checks

- Run `$programming` when planning, implementing, reviewing, refactoring, testing, or documenting changes to source code, tests, CLIs, libraries, scripts, builds, CI, or configuration, and when changing dependencies or checks.
- Follow the development methods, technology-specific rules, commands and verification procedures in each repository.

### Comparing implementation options

- Also use `$programming` to investigate computer science principles, design patterns, module organization (including files and directories) or system architecture for the project. This includes requests to explain or document why an approach fits, its background and why the project adopted it, with examples.
- When comparing implementations, investigate how the issue arises and under what conditions, even before code exists. When first reporting your findings, explain how the underlying mechanism affects the options, what would change and why, the risks and what evidence the next decision requires. Select the design and programming skills independently according to the questions each can answer.
- Record technical findings in the file designated by the user. If no file is designated, propose suitable locations and continue the investigation and explanation in the conversation. Leave files untouched in that case. Changing source code or tests requires an explicit request for implementation or development.

## Environment Variables and Sensitive Information

- Do not commit personal information, security keys, internal URLs, tokens, or credentials to Git. Do not commit absolute paths that may expose a personal computer account.
- Manage data that must not be committed with environment files such as `.env`.
- Do not hardcode sensitive mock values in tests. Use test-only environment variables or fixtures defined in the tests.
- Before committing, check for environment files, credentials, tokens, personal information, internal URLs, private repository references, and absolute paths that expose a personal account.

## Temporary Files

- Do not use a system-level directory such as `/tmp`.
- Store temporary files under `temps/<scope>-<nonce>/` at the project root.
- Use a name that identifies the purpose of the temporary files for `scope`. Use a short identifier for `nonce` to prevent directory name collisions.
- Save screenshots created by MCP in the same temporary directory.

## Gitignore

- Do not commit files matched by `.gitignore`.
- Before committing, check for sensitive information and credentials.
- Recheck the applicable rules in the "Environment Variables and Sensitive Information" section of AGENTS.md.

## Git Branches

- Check the current Git branch before starting work.
- Create a new worktree branch only when the user explicitly requests one. After the request, inspect the current branch and repository rules, and place a manually created worktree under `.worktrees/` at the repository root.
- Before proposing removal of an unused worktree branch, check for commits unique to the branch and uncommitted changes in the worktree.
- The user may ask to continue in an existing worktree branch or create a new one.
- Use the same branch for design and implementation to avoid creating an extra worktree for the same change. Choose the branch type by the purpose of the change. Do not default to `docs`.
- Do not modify `main`, `master`, `develop`, `dev`, or `release/*` directly. Create a work branch first.
- Work on agent environment settings under `.codex` or `.claude` may proceed without changing branches.
- Name branches `<type>/<short-description>`. Reflect the branch name in the worktree path as `.worktrees/<type>/<short-description>`.

Allowed `<type>` values: `feature`, `fix`, `hotfix` (only for an actual hotfix), `refactor`, `test`, `docs`, `chore`

## Git Commits

- Consider whether the changes serve a single purpose and should be recorded as one commit. Commit that set of changes when appropriate.
- Apply these rules to the commit subject, body, and footers. Describe the actual repository change and why it was needed. Do not mention the user prompt, agent instructions, internal task wording, review criteria, private references, or the agent's work process.
- Use a subject, body, and optional footers.
- Format the subject as `<type>(<scope>): <subject>`.
- Use one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, or `build` for `type`.
- Write `scope` in English and name the affected module or component.
- Write `subject` as a lowercase English imperative without a final period.
- Write the body in English and explain why the change was necessary. Readers can inspect the Git diff for the changes themselves.
- Use `BREAKING CHANGE:`, `Fixes #N`, or `Closes #N` footers when applicable.
