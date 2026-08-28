---
name: use-design-docs
description: Repository workflow adapter for docs/designs/README.md that selects and orders every applicable design-document operation needed for a request. In the use-* skill family, use marks a reusable procedure bound to a repository-local authority; it does not mean generic document usage. Apply when learning how to design or refine requirements, reviewing requirements, researching requirement questions, recording references or human decisions, creating or reviewing plans, using docs/designs as implementation input, validating a docs/designs package, or assessing requirement changes.
---

# Use Design Docs

Use the current repository's `docs/designs/README.md` as the authority for design-document structure, writing permissions, required information, prohibited content, presentation, and validation. This skill selects and orders work; it does not replace the repository README or authorize implementation.

## Establish the authority

1. Resolve the repository root and check for `<repo-root>/docs/designs/README.md`.
2. If it exists, read it completely. Do not compare it with this skill's `references/_README.md` or synchronize the files.
3. If it is missing, decide whether the request needs durable repository-specific design-document rules. Do not create the README merely because this skill was invoked.
4. When durable rules are needed, identify the bundled `references/_README.md` and exact target path, then ask the user whether to create the repository README.
5. If approved, copy the bundled content without its first-line maintenance comment and read the created README completely. Never overwrite an existing README.
6. If creation is declined, inspect repository instructions, existing document locations, and the directory structure. For an authorized writing request, use a location supported by that evidence; ask the user when no location is established. Keep read-only requests read-only.
7. Follow the user's request and applicable repository instructions. Report a material conflict with the repository README instead of choosing silently.

## Select the required operations

Choose every operation needed for the requested outcome, including read-only prerequisites and final validation. Omit unrelated work, run dependent operations in order, and add work later only when new evidence makes it necessary within the original scope.

- **Discover:** clarify outcomes and behavior-changing questions while keeping AI proposals separate from requirements and human decisions.
- **Review:** grade an existing document without editing it and use the README's status vocabulary.
- **Research:** investigate factual questions from the requirements or explicit work context.
- **Record:** create or update a durable reference or human-approved decision when its README creation condition is met.
- **Plan:** create or revise execution planning after behavior-changing questions and required decisions are resolved.
- **Validate:** check the package, trace requirement coverage, or assess a requirement change.

Review and rewriting are separate operations. Read-only prerequisites do not authorize file changes.

## Establish the requirement baseline

1. Inspect the target design package and `requirements.md` before assuming they exist.
2. If `requirements.md` exists, read it completely and treat it as the baseline controlled by the requirements owner.
3. If no durable package is needed, use the user's explicit request as the work context without creating a package.
4. If a durable package is needed, creation is authorized, and the file is absent, create the package and a minimal initial `requirements.md` under the repository README. Include only explicitly stated outcomes, conditions, completion evidence, and unresolved questions. Omit placeholders and inferred requirements.
5. Review a new initial file immediately. Pause only work that depends on behavior-changing missing information.
6. After initial creation, change `requirements.md` only when the requirements owner requests the change or approves the exact wording.

## Execute in dependency order

1. Read only the requirements, decisions, references, repository evidence, and plan needed by the selected operations.
2. Separate requirements and approved decisions from sourced facts, analysis, AI proposals, and unresolved questions.
3. Before research or planning, distinguish blocking questions, optional suggestions, factual questions, and decisions requiring human judgment. Do not plan past unresolved matters that would change the outcome.
4. Apply the repository README's creation conditions, required information, prohibited content, and validation rules to each selected operation. Update the document responsible for existing information instead of duplicating it.
5. When requirements change, compare them with the recorded baseline, identify affected and unaffected material, pause affected work, and request human judgment when the impact is uncertain.
6. When design documents are implementation input, read the complete applicable requirements and only the decisions, plan, and development guidance needed for the baseline. Ask when those sources do not establish the required meaning. Pass the baseline to the applicable development workflow; do not implement through this skill.

## Finish

Run the applicable README checks once after the work. Report changed files, validation evidence, unresolved blockers, and questions requiring human judgment. Never claim implementation compliance from documentation alone.
