---
name: use-flexible-design
description: Turn requests into requirements, investigate missing information, and connect research, decisions, and plans under the repository's design-document rules. Use for creating, extending, reviewing, or restructuring requirements and for planning or assessing design changes.
---

# Use Flexible Designs

Use `docs/designs/README.md` as the authority for structure, writing permissions, document contents, and validation. This skill coordinates design work; it does not authorize implementation.

## Establish the authority

1. Resolve the repository root. If its `docs/designs/README.md` exists, read it completely; do not compare or synchronize it with the bundled default.
2. If absent, determine whether durable repository-specific rules are necessary. If so, identify [the bundled default](references/_README.md) and target location, then request creation approval. On approval, create it without the first-line maintenance comment and read it completely; never overwrite an existing README.
3. If creation is declined or unnecessary, use existing instructions and document locations for authorized work. Ask only when those sources do not establish a location or meaning. Report conflicts with repository rules rather than choosing silently.

## Select the work

Perform only operations needed by the request, including their prerequisites:

- For requirement creation, supplementation, empty preparation, or restructuring, read [the requirements workflow](references/requirements/workflow.md).
- For review, read the complete target and assess ambiguity, contradiction, missing evidence, and unanswered questions without editing it.
- For research, separate factual questions, optional suggestions, blocking questions, and choices requiring confirmation. Save reusable findings only when the README's reference-creation condition is met.
- Record confirmed material decisions and their reasons under the README. Keep unresolved choices as questions or options, not approved decisions.
- Plan only when outcome-changing ambiguities are resolved. Connect the baseline requirements and relevant evidence to work and observable verification.

## Keep the work connected

Read only the relevant requirements, evidence, decisions, and guidance. Link to their files and descriptive headings instead of copying facts or assigning document or item IDs. Extend the existing package for the same work; shared evidence stays in its original file.

When requirements change, apply the README's baseline comparison, affected-work pause, and derived-document update procedure. Continue only unaffected work and ask when the effect is uncertain. Reflect confirmed decisions in the plan before resuming dependent work.

For implementation input, read the complete applicable requirements and the needed decisions, plan, and development guidance. Pass that baseline to the development workflow; do not implement through this skill or infer missing meaning.

## Finish

Run applicable README checks once at the end. Report changed files, verification evidence, unresolved blockers, and decisions still needed using its status vocabulary. Documents alone do not prove implementation compliance.
