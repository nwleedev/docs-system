---
name: use-flexible-design
description: Develop or review requirements, investigate what the current goal needs, assess implementation readiness, and connect research, decisions, and plans under repository design-document rules. Use for requirements, design research, and planning; not implementation.
---

# Use Flexible Design

Use `docs/designs/README.md` as the authority for structure, writing permissions, document contents, and validation. This skill coordinates design work; it does not authorize implementation.

## Establish the authority

1. Resolve the repository root. If its `docs/designs/README.md` exists, read it completely; do not compare or synchronize it with the bundled default.
2. If absent, determine whether durable repository-specific rules are necessary. If so, identify [the bundled default](references/_README.md) and target location, then request creation approval. On approval, create it without the first-line maintenance comment and read it completely; never overwrite an existing README.
3. If creation is declined or unnecessary, use existing instructions and document locations for authorized work. Ask only when those sources do not establish a location or meaning. Report conflicts with repository rules rather than choosing silently.

## Select the work

Establish the user's intended outcome, stated constraints, and current task from the conversation and relevant documents. Keep that intent across turns; do not ask again for an answer already available. Select only operations needed for that outcome, including their prerequisites:

- For requirement creation, supplementation, empty preparation, or restructuring, read [the requirements workflow](references/requirements/workflow.md).
- For review, read the complete target and assess ambiguity, contradiction, missing evidence, and unanswered questions without editing it.
- For research, separate factual questions, optional suggestions, blocking questions, and choices requiring confirmation. Save reusable findings only when the README's reference-creation condition is met.
- Record confirmed material decisions and their reasons under the README. Keep unresolved choices as questions or options, not approved decisions.
- Plan only when outcome-changing ambiguities are resolved. Connect the baseline requirements and relevant evidence to work and observable verification.

## Investigate what the current goal needs

For requirement writing, supplementation, review, or planning, investigate missing conditions without waiting for a follow-up asking what else is needed. Work through representative successful and plausible failure situations: can the required behavior and completion evidence be determined from the stated requirements? Read relevant repository evidence and research answerable facts before asking for a choice.

For each proposed addition, explain which current outcome cannot be achieved or determined without it. Separate that condition from an implementation choice, a risk to investigate, and a future capability. Keep proposals outside approved requirements; do not turn every risk into another feature. Leave future capabilities out of the current plan rather than building a speculative backlog. If the requirements are sufficient, say why instead of inventing gaps.

Ask only for unresolved choices that affect behavior, compatibility, or the work to be done. Explain the consequence and a supported recommendation; pause only dependent work. Technical unknowns need applicable development research, not guessed answers or automatic approval of new requirements. Empty-file preparation and meaning-preserving structural edits do not require a full implementation assessment.

## Keep the work connected

Read only the relevant requirements, evidence, decisions, and guidance. Link to their files and descriptive headings instead of copying facts or assigning document or item IDs. Extend the existing package for the same work; shared evidence stays in its original file.

When requirements change, apply the README's baseline comparison, affected-work pause, and derived-document update procedure. Continue only unaffected work and ask when the effect is uncertain. Reflect confirmed decisions in the plan before resuming dependent work.

For implementation input, read the complete applicable requirements and the needed decisions, plan, and development guidance. Pass that baseline to the development workflow; do not implement through this skill or infer missing meaning.

## Finish

In the first substantive answer after the necessary investigation, explain the current goal, missing information or evidence of sufficiency, and the next work. For content assessments, state whether implementation can start, only independent work can start, or a named unanswered question prevents it. Support the judgment with the required choices, feasibility evidence, and observable checks; identify remaining risks, their consequences, and how to check or reduce them. Do not claim readiness from document existence alone or confuse it with implementation permission. Keep the answer proportional to the request, without mandatory headings or item counts.

Run applicable README checks once at the end. Report changed files, verification evidence, unresolved blockers, and decisions still needed using its status vocabulary. Documents alone do not prove implementation compliance.
