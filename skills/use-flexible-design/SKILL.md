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

Establish the intended outcome, actual use situations, stated constraints, and current task from the conversation and relevant documents. Treat a project name or analogy as a lead for investigation, not approval of the features associated with it. Keep established intent across turns; do not ask again for an answer already available. Select only operations needed for that outcome, including their prerequisites:

- For requirement creation, supplementation, empty preparation, or restructuring, read [the requirements workflow](references/requirements/workflow.md).
- For review, read the complete target and assess ambiguity, contradiction, missing evidence, and unanswered questions without editing it.
- For research, separate factual questions, optional suggestions, blocking questions, and choices requiring confirmation. Save reusable findings only when the README's reference-creation condition is met.
- Record confirmed material decisions and their reasons under the README. Keep unresolved choices as questions or options, not approved decisions.
- Plan only when outcome-changing ambiguities are resolved. Connect the baseline requirements and relevant evidence to work and observable verification.

## Investigate what the current goal needs

For requirement writing, supplementation, review, or planning, investigate missing conditions without waiting for a follow-up. Trace representative use situations through inputs, actions, results, and the preservation or failure handling those situations require. Determine whether the requirements establish the expected behavior and how it could be checked. Read relevant repository evidence and research answerable facts first.

For suspected ambiguity, identify the passage and the interpretations still possible after reading its context; explain how the observable behavior or required work would differ. Several implementation methods that satisfy the same behavior do not by themselves make a requirement ambiguous. Distinguish a missing choice from a fact that research can establish.

For each proposed addition, name the agreed outcome or condition that would fail without it and consider other ways to satisfy that outcome. Separate defects in promised behavior, unclear intent, technical constraints, and optional capabilities. A feature offered by a comparable service is not automatically required here. Excluding an optional capability must not remove the processing needed to make an agreed behavior work. Keep proposals outside approved requirements; leave future capabilities out of the current plan. If the requirements suffice, explain why instead of inventing gaps.

Ask for unresolved preferences, priorities, or choices that change behavior, compatibility, or the work to be done; explain their consequences and a supported recommendation. Resolve routine implementation choices from evidence within the authorized outcome rather than sending every choice to the user. Pause only dependent work. Deepen research while an unanswered fact could change the decision or next action; state that fact and its effect. Stop when the evidence supports that decision, honoring any requested research limits. Empty-file preparation and meaning-preserving structural edits do not require a full implementation assessment.

## Keep the work connected

Read only the relevant requirements, evidence, decisions, and guidance. Link to their files and descriptive headings instead of copying facts or assigning document or item IDs. Extend the existing package for the same work; shared evidence stays in its original file.

When an issue or new fact appears, separate observation from inference, identify its nature and affected work, and assess whether existing assumptions still hold. Apply the README's change and replanning procedure when requirements change or evidence alters feasibility, effort, dependencies, or completion expectations. Do not turn every issue into a requirement change. Continue unaffected work and resolve uncertainty about affected work before resuming it.

For implementation input, read the complete applicable requirements and the needed decisions, plan, and development guidance. Pass that baseline to the development workflow; do not implement through this skill or infer missing meaning.

## Finish

In the first substantive answer after investigation, connect the goal to missing information or evidence of sufficiency, the necessary work and its reasons, and the next action. State whether implementation can start, only independent work can start, or a named unanswered question prevents it. Explain a prerequisite through what the next task cannot do or establish without it; distinguish starting a task from satisfying the final acceptance criteria. Support the judgment with feasibility evidence and observable checks. Identify material risks and effects on the overall plan; use stated deadlines and resource limits without inventing completion dates. Do not confuse readiness with implementation permission. Keep the answer proportional, without mandatory headings or item counts.

Run applicable README checks once at the end. Report changed files, verification evidence, unresolved blockers, and decisions still needed using its status vocabulary. Separate proposed checks, source inspection, simulated responses, and observed behavior; explain what remains between an individual task's completion and the intended outcome. Documents alone do not prove implementation compliance.
