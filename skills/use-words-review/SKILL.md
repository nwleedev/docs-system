---
name: use-words-review
description: Review changed public or tracked text and names with an independent general-purpose subagent for audience fit, clear roles, publishable provenance, prompt or work-note leakage, private paths and identifiers, unnatural Korean, and unnecessary symbols. Use after creating, renaming, or editing files and directories, documentation, README files, UI or accessibility text, code comments, commit or pull-request text, issue text, or release notes; before committing or sharing those outputs; and whenever the user requests a wording or public-output review.
---

# Use Words Review

Review public outputs without editing them. Delegate the semantic review to one general-purpose subagent available in the host, then verify its findings against the artifacts in the main agent.

## Establish the review scope

1. Identify every changed output that will be committed, published, or shared. Include changed file and directory names and the candidate commit, pull-request, issue, or release text when applicable.
2. Treat tracked repository text as public unless an applicable repository rule classifies it otherwise.
3. Record the intended readers, what each reader must understand or do, the actor described by the text, any reviewer or approval owner, and whether exact source text is part of the artifact's purpose.
4. Read the applicable AGENTS instructions and the owning document rules. When present and relevant, read repository-local design or development documentation indexes rather than assuming their structure.
5. Keep review and editing separate. Do not modify an artifact unless the user separately authorizes the edit.

## Collect publishable evidence

For every added or changed statement, identify support from repository evidence, a sourced fact, an approved decision, or approved public wording. Treat user prompts, agent instructions, task descriptions, work notes, review rubrics, requested formats, tool conditions, and progress reports as work inputs rather than publishable sources.

Retain exact source text only when the artifact requires it, such as a requirement whose wording belongs to the requirements owner, approved user-visible wording or quotation, prompt-processing evaluation data, a minimal reproduction input, or an access-controlled log that will not be committed. Use only the minimum text needed for the stated purpose.

Provide original prompt text to the reviewer only when the review explicitly requires an exact comparison. Minimize and redact it before delegation, and do not write it to a tracked file or durable log.

## Run available deterministic checks

Run repository-provided checks that apply to the changed outputs. Include available Vale or other text-lint results as evidence, but do not require a particular text linter.

When Git and text search are available, inspect only the changed public outputs for formatting errors, personal absolute paths, private identifiers, distinctive prompt phrases, HTML comments, and unresolved markers. Redact a sensitive match in the report instead of repeating it. Treat search matches as review candidates, not automatic failures.

## Prepare the independent review

Prefer the changed text and enough surrounding context to understand headings, claims, and reader actions. Include a full file only when the relationship between sections cannot be judged from the diff.

Read [references/examples.md](references/examples.md) when reviewing Korean wording or when the distinction between a prohibited and allowed case is unclear. Use the examples to calibrate judgment; do not turn example phrases into a word blacklist and do not pass text merely because no example matches it.

Prepare a delegation message containing only:

- the read-only review role and prohibition on editing;
- the artifact paths or supplied text and the intended readers;
- the relevant diff and necessary surrounding context;
- applicable repository instructions and document-owning rules;
- available deterministic-check results;
- the criteria and required result format below.

Do not include the writing agent's progress report, self-assessment, suspected findings, or preferred verdict.

## Choose the model and reasoning effort

Use the readers, evidence, role clarity, and publication impact already collected for the review. Do not dispatch another subagent to classify the task, and do not use text length or file count as the deciding factor.

- Use a fast, efficient model with low reasoning effort when the structure, evidence, and expected judgment are explicit.
- Use a balanced review model with medium reasoning effort when contextual judgment is needed but ownership and evidence are clear.
- Use the strongest available model with high reasoning effort when referents are ambiguous, document responsibilities conflict, or an error could misstate privacy, security, licensing, approval, or ownership.

A long repetitive document may use the first or second setting, while a short high-impact sentence may require the third. Do not use `xhigh`, `max`, `ultra`, or an equivalent setting by default. Use a higher setting only when representative, approved review cases show that it prevents omissions or incorrect judgments that remain at `high`.

Resolve these capability levels against the models and effort controls exposed by the current host. If the host does not support a per-invocation override, inherit the main agent's configuration and report the limitation. Do not create or require a named reviewer or classifier definition.

## Delegate to a general-purpose subagent

Use one general-purpose subagent exposed by the current host. Do not create, install, or require a named reviewer definition. Restrict the subagent to read-only tools when the host supports tool restrictions; otherwise state the read-only boundary explicitly and capture repository state before and after delegation.

Ask the subagent to judge each applicable criterion:

1. The title, structure, wording, and names serve the intended readers instead of reporting work to the work requester. Actors, reviewers, and approval owners are identified when the distinction matters, and broad labels do not hide a specific role.
2. Prompts, internal instructions, progress notes, review criteria, and requested formats do not appear as product or repository facts, titles, decision reasons, or publishable prose.
3. Unrelated requirements are not combined merely because they arrived in one task, and each document keeps its assigned responsibility.
4. Claims and assigned roles use publishable evidence, approved decisions, or approved wording; unresolved support, ownership, compatibility, security, privacy, licensing, and responsibility are not invented.
5. Exact source text is retained only for an allowed purpose and only to the necessary extent.
6. Personal paths, credentials, private URLs, private project identifiers, internal-only names, and unnecessary local paths are absent or safely replaced.
7. Korean wording is natural for the intended readers rather than literal, mechanically translated, padded with stock phrases, or mixed with avoidable English forms.
8. Emoji and uncommon symbols are absent unless readers or an approved format need them.

Require one of these statuses for every applicable criterion and artifact:

- `pass`: evidence supports publication as written;
- `needs revision`: a specific defect can be corrected without a new decision from the responsible owner;
- `needs human input`: publication depends on unresolved intent, approval, ownership, responsibility, or policy;
- `not applicable`: the criterion does not apply, with a short reason.

Require each non-passing result to identify a tight location, the evidence or reasoning, and the reader-facing consequence. Instruct the subagent not to rewrite the artifact and not to quote sensitive text in its report.

For UI and accessibility text, judge whether users can understand the relevant state and next action. For code comments and API documentation, judge whether callers or maintainers receive the conditions and constraints they need.

If no general-purpose subagent is available, perform the same checks in the main context but report that independent review was not performed. If write access cannot be restricted, do not claim that tool-enforced read-only review occurred.

Repeat the review with the strongest available model and high reasoning effort only when the reviewer cannot judge the artifact because evidence conflicts or the main agent finds an unsupported or omitted judgment during reconciliation. A `needs revision` result alone does not require a more capable model. Missing evidence or authority remains `needs human input` at every model setting.

## Reconcile the result

1. Compare every finding with the actual changed artifact and applicable repository rule.
2. Reject unsupported findings, findings outside the supplied scope, and conclusions based only on an example phrase.
3. Confirm that delegation did not change files or repository state. Report unexpected changes and stop before publication.
4. Resolve conflicts between deterministic checks and semantic review by inspecting the actual context. Do not let either source silently override the other.
5. Determine the overall result from the most restrictive applicable status. Do not convert `needs human input` into an inferred decision.

## Report

List the reviewed outputs, their intended readers, the checks performed, the model and reasoning setting when known, and the per-criterion results. Separate defects that can be revised from questions for the requirements owner, decision owner, reviewer, or approval owner. State any missing independent review, unavailable model override, unavailable check, redaction, or incomplete evidence.

End the review without editing files. If the user later authorizes fixes, make them as a separate task and run this review again on the revised outputs.
