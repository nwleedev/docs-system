---
name: use-design-docs
description: Repository workflow adapter for docs/designs/README.md that selects and orders every applicable design-document operation needed for a request. In the use-* skill family, use marks a reusable procedure bound to a repository-local authority; it does not mean generic document usage. Apply when learning how to design or refine requirements, reviewing requirements, researching requirement questions, recording references or human decisions, creating or reviewing plans, using docs/designs as implementation input, validating a docs/designs package, or assessing requirement changes.
---

# Use Design Docs

In this skill family, `use-` means binding a reusable execution procedure to a repository-local authority. It does not mean generic use of the named subject or broaden this skill beyond its README-defined scope.

Use the current repository's `docs/designs/README.md` as the sole authority for design-document structure, ownership, required information, prohibited content, presentation, and validation. This skill supplies only the reusable execution procedure.

## Establish the authority

1. Resolve the repository root and check for `<repo-root>/docs/designs/README.md`.
2. If the README exists, read it completely before reviewing, researching, creating, editing, planning, or validating any design document. Treat it as the repository's sole current authority and do not read or compare this skill's `references/_README.md`.
3. If the README is missing, determine whether the requested work needs durable repository-specific design-document rules. Do not create the README merely because the skill was invoked.
4. When those rules are needed, identify this installed skill's `references/_README.md` and the exact target `<repo-root>/docs/designs/README.md`, then ask the user whether to create it.
5. If the user approves, create the target directory as needed and copy the bundled README content to the target without its first-line maintenance HTML comment. Re-read the new README completely before continuing.
6. If the user declines, inspect applicable repository instructions, existing documentation locations, and the directory structure. When the request authorizes writing the originally requested document, write it only in a location supported by that evidence; ask the user when no suitable location can be established. Keep read-only requests read-only.
7. Never overwrite an existing repository README with the bundled file or synchronize the two automatically.
8. Follow applicable project instructions and the user's explicit request. Report a material conflict with the repository README instead of silently choosing one source.

## Select the operations required for the request

Select every operation needed to complete the user's requested outcome, not only the first matching operation. Include necessary read-only prerequisites and verification, omit operations that do not contribute to the outcome, and run the selected operations in dependency order. Add another operation after work begins only when new evidence shows that it is both necessary and within the original scope.

- **Review:** inspect and grade an existing document without editing it.
- **Discover:** help the user learn, decide, and express requirements without treating AI proposals as approved requirements.
- **Research:** investigate factual questions required by the requirements or explicit work context.
- **Record:** create or update a reference document or record a human-approved decision.
- **Plan:** create or revise execution planning from resolved requirements and decisions.
- **Validate:** check a package, trace requirement coverage, or assess the effect of a requirement change.

Treat review and rewriting as separate operations. Necessary read-only work does not imply permission to create or change files; do not perform a mutating operation unless the user explicitly requests creation, editing, application, or documentation.

## Establish or create the requirement baseline

1. Inspect the repository for the target design package and `requirements.md` before assuming they exist.
2. If `requirements.md` exists, read it completely and use it as the baseline.
3. If no durable package is needed, use the user's explicit request as the work context. Do not reject the task or create a package only because `requirements.md` is absent.
4. If a durable package is needed, file creation is authorized, and `requirements.md` is absent, follow the repository's Git policy and create the package with a minimal initial `requirements.md` under the README rules.
5. Include only outcomes, must-remain-true conditions, completion evidence, and unresolved questions explicitly stated by the user. Exclude unrelated process instructions and never infer missing requirements or decisions.
6. Omit unsupported sections instead of adding empty headings or placeholders. Review the initial file immediately and pause only operations that depend on behavior-changing missing information.
7. After initial creation, do not revise `requirements.md` unless the user requests the change or approves the exact wording.

## Load the minimum project context

1. Read only the derived documents and repository evidence needed for the requested operation.
2. Keep the human's requirement wording separate from AI findings, sourced facts, proposals, and approved decisions.
3. Before research or planning, separate blocking questions, optional suggestions, factual research questions, and decisions that require human judgment.
4. When `docs/designs/**` is implementation input, read the authority README, the complete applicable `requirements.md`, and only the decisions and plan needed to establish the implementation baseline. This skill does not authorize or perform implementation; pass that baseline to the applicable development workflow.

## Execute the selected operations

### Discover

Use this operation when the user wants to learn how to design requirements, does not yet know which questions matter, or wants guided clarification before reviewing, researching, or planning.

#### Select the coaching procedure

1. Check the skills exposed in the current session for `compound-engineering:ce-brainstorm`. Do not inspect personal plugin directories or assume an installation from a filesystem path.
2. When it is available, use its collaborative questioning, unfamiliar-territory mapping, approach comparison, and scope-synthesis procedure. The repository README remains authoritative: do not create its default artifact, replace the repository document model, or let it write human requirements without the approval required here.
3. When it is unavailable, continue with the built-in procedure below. Do not reject the request, require installation, or silently substitute another optional plugin.
4. Mention the fallback briefly only when it materially reduces the depth of the requested coaching. Suggest installing the optional plugin only if the user asks for its richer workflow.

#### Built-in procedure

1. Identify the user outcome, the current evidence, and the decisions that would materially change behavior, scope, protected behavior, or completion evidence.
2. For territory the user cannot evaluate, inspect repository evidence and research current primary sources before asking for a decision. Separate facts already settled by evidence from choices that still require judgment.
3. Present only realistic choices. For each choice, explain the consequence that matters here and recommend a default with its reason. Do not ask the user to choose among options they have not been given enough information to evaluate.
4. Ask one decision question at a time. Record unanswered choices as unresolved questions or explicit AI proposals, never as human requirements.
5. Before proposing document changes, summarize the intended outcome, conditions that must remain true, allowed and prohibited scope when relevant, observable completion evidence, approved decisions, AI proposals, and unresolved questions. Ask the user to correct the interpretation.
6. Propose exact requirement wording and its intended location separately from the document. Apply only wording the user explicitly requests or approves; preserve all unapproved wording and ordering.
7. After an approved edit, run Review and any applicable Validate operation as separate steps. Report remaining assumptions and questions instead of filling them to make the document appear complete.

### Review

- Apply every relevant README criterion and cite a short quotation or file location as evidence.
- Report the status vocabulary required by the README.
- Leave the document unchanged and propose exact edits separately when useful.

### Research

- Derive research questions from exact requirement excerpts or the explicit work context.
- Prefer current primary sources and repository evidence, cross-check material claims, and preserve uncertainty.
- Create a durable reference document only when the user requests documentation or the README's creation condition is met and file creation is authorized.

### Record

- Inspect existing files first and update the owning document instead of duplicating information.
- Connect the new material to exact requirement excerpts and distinguish sourced facts, analysis, proposals, and human decisions.
- Never present an AI recommendation as human approval.

### Plan

- Do not plan past unresolved questions or decisions that would materially change the requested outcome.
- Use the requirement baseline, work units, dependencies, stop conditions, and verification evidence required by the README.
- Do not invent behavior to make implementation convenient.

### Validate or handle changes

- Compare the current requirements with the recorded baseline.
- Identify affected and unaffected references, decisions, work units, and verification methods.
- Pause affected work, allow unaffected work to continue only when that conclusion is supported, and request human judgment when impact is uncertain.

## Provide design-document context when delegating

Follow the applicable project delegation policy. Delegate independent review, research questions, repository evidence collection, and read-only validation when doing so is useful. Keep requirements ownership, human decisions, final reconciliation, and shared-document changes with the main agent or one designated writer. Do not run record or plan operations concurrently when they depend on the same findings or may change the same files.

Give each delegated task the `docs/designs/README.md` path, requirements baseline, target paths, exact operation, mutation boundary, stop condition, and expected return. Do not paste the README into prompts. The main agent remains responsible for reading the actual files, reconciling results, and verifying any changes.

Do not automatically chain another planning or review skill merely because it is installed. The optional Discover integration above is the only availability-based skill handoff. Follow an explicitly requested or already active skill when it does not conflict with the repository README, and avoid duplicate reviews.

## Finish

Re-read the applicable README checks after the work. Report changed files, validation evidence, unresolved blockers, and items requiring human judgment. Never claim implementation compliance from documentation alone.
