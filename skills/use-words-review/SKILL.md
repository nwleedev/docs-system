---
name: use-words-review
description: Review changed public or tracked text, names, and high-impact user-facing drafts in any language with an independent general-purpose subagent for audience fit, clear roles, publishable provenance, prompt or work-note leakage, private paths and identifiers, sentence meaning and relationships, and unnecessary symbols. Also review natural Korean when the output contains Korean. Use after creating, renaming, or editing files and directories, documentation, README files, UI or accessibility text, code comments, commit or pull-request text, issue text, or release notes; before committing or sharing those outputs; before sending Korean requirements, decisions, policies, security, privacy, licensing, ownership, or reusable wording; and whenever the user requests a wording or public-output review.
---

# Use Words Review

Review public outputs without editing them. Delegate the semantic review to one general-purpose subagent available in the host, then verify its findings against the artifacts in the main agent.

## Establish the review scope

1. Identify every changed output that will be committed, published, or shared. Include changed file and directory names and the candidate commit, pull-request, issue, or release text when applicable.
2. Group outputs that belong to the same commit or publication into one review. Do not call a reviewer for each sentence while drafting.
3. Treat tracked repository text as public unless an applicable repository rule classifies it otherwise.
4. Record the intended readers, what each reader must understand or do, the actor described by the text, any reviewer or approval owner, and whether exact source text is part of the artifact's purpose.
5. Read the applicable AGENTS instructions and the owning document rules. When present and relevant, read repository-local design or development documentation indexes rather than assuming their structure.
6. Keep review and editing separate. Do not modify an artifact unless the user separately authorizes the edit.
7. Identify which languages appear in the changed output. Apply the common review to every language. Apply the Korean reference only to Korean text, including the Korean portions of multilingual output.
8. When the scope is a user-facing response, review only the draft that the user would receive. Do not include hidden reasoning, tool traces, or routine progress messages unless those messages are themselves the requested wording.

## Collect publishable evidence

For every added or changed statement, identify support from repository evidence, a sourced fact, an approved decision, or approved public wording. Treat user prompts, agent instructions, task descriptions, work notes, review rubrics, requested formats, tool conditions, and progress reports as work inputs rather than publishable sources.

Retain exact source text only when the artifact requires it, such as a requirement whose wording belongs to the requirements owner, approved user-visible wording or quotation, prompt-processing evaluation data, a minimal reproduction input, or an access-controlled log that will not be committed. Use only the minimum text needed for the stated purpose.

Provide original prompt text to the reviewer only when the review explicitly requires an exact comparison. Minimize and redact it before delegation, and do not write it to a tracked file or durable log.

## Run available deterministic checks

Run repository-provided checks that apply to the changed outputs. Include available Vale or other text-lint results as evidence, but do not require a particular text linter.

When Git and text search are available, inspect only the changed public outputs for formatting errors, personal absolute paths, private identifiers, distinctive prompt phrases, HTML comments, and unresolved markers. Redact a sensitive match in the report instead of repeating it. Treat search matches as review candidates, not automatic failures.

For Korean text, search for U+00B7 before semantic review. Classify each match by its actual role. Report general-prose use as `needs revision`. Preserve the character when an exact quotation, approved name, code, regular expression, character test, code-point explanation, or evaluation input requires it. Do not replace matches automatically.

## Prepare the independent review

Prefer the changed text and enough surrounding context to understand headings, claims, and reader actions. Include a full file only when the relationship between sections cannot be judged from the diff.

Select reference files before opening either one:

1. Read [references/examples.md](references/examples.md) when calibrating the common criteria or when the distinction between a prohibited and allowed case is unclear. The examples cover audience, evidence, source preservation, private paths, sentence meaning, and relationships between sentences.
2. If the changed output has no Korean, do not open [references/korean.md](references/korean.md), even when a common criterion is unclear. Do not inspect this file merely to decide whether it applies.
3. If the changed output contains Korean or the review must judge a Korean expression, read [references/korean.md](references/korean.md) in full and apply it only to the Korean text. This reference is required for Korean; do not treat it as optional because the common criteria appear sufficient.

Use each selected reference to calibrate judgment. Do not turn an example or candidate expression into a blacklist, and do not pass text merely because no example matches it. When repository evidence cannot determine the intended meaning, return `needs human input` instead of choosing a replacement.

Choose the review context from the relationship that must be judged:

- Provide the changed paragraph and the necessary adjacent sentences when they are enough to identify each sentence's subject, referent, action, condition, and result.
- Provide the changed section when the review must connect a heading, an earlier step's result, a role, or the document's assigned responsibility.
- Provide the full file only when the changed section depends on decisions or definitions elsewhere in the document.

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

When the current Codex host provides these models, use `gpt-5.6-terra` with low effort for the first level, `gpt-5.6-terra` with medium effort for the second, and `gpt-5.6-sol` with high effort for the third. Do not substitute a similarly named model when one of these is unavailable. Use another setting only after it passes the approved review cases below.

Resolve these capability levels against the models and effort controls exposed by the current host. A call that changes the model or reasoning effort must receive a self-contained delegation message with the review scope, context, rules, check results, and result format. Do not depend on the full conversation being inherited by that call. If the host does not support a per-invocation override or cannot combine the required context with an override, inherit the main agent's configuration and report the limitation. Do not create or require a named reviewer or classifier definition.

Before adopting a different or lighter setting, have the responsible reviewer approve the expected status and findings for representative cases. The set must include:

- two sentences whose meaning is unclear because they omit or compress necessary information;
- four cases where roles, referents, conditions, step results, or decision status do not connect across sentences;
- a case that lacks evidence and must return `needs human input`;
- a long but clear sentence and correctly connected sentences that must return `pass`.

If repository evidence does not identify the responsible reviewer, keep the current setting and report adoption of a different or lighter setting as `needs human input`. Do not assign that approval role to the main agent or subagent by inference.

Use a setting only when it matches every required status and finding. Reject it if it misses one defect, invents one defect, or fails to return `needs human input` where required. Among settings that pass, compare defect misses, incorrect findings, missed `needs human input` results, input, output, and total tokens, and elapsed time.

Use token counts and elapsed time reported for the individual invocation. If the host does not expose an invocation-level value, record it as unavailable rather than estimating it, and exclude that run from measured token-cost comparisons.

## Delegate to a general-purpose subagent

Use one general-purpose subagent exposed by the current host. Do not create, install, or require a named reviewer definition. Restrict the subagent to read-only tools when the host supports tool restrictions; otherwise state the read-only boundary explicitly and capture repository state before and after delegation.

Ask the subagent to judge each applicable criterion:

1. The title, structure, wording, and names serve the intended readers instead of reporting work to the work requester. Actors, reviewers, and approval owners are identified when the distinction matters, and broad labels do not hide a specific role.
2. Prompts, internal instructions, progress notes, review criteria, and requested formats do not appear as product or repository facts, titles, decision reasons, or publishable prose.
3. Unrelated requirements are not combined merely because they arrived in one task, and each document keeps its assigned responsibility.
4. Claims and assigned roles use publishable evidence, approved decisions, or approved wording; unresolved support, ownership, compatibility, security, privacy, licensing, and responsibility are not invented.
5. Exact source text is retained only for an allowed purpose and only to the necessary extent.
6. Personal paths, credentials, private URLs, private project identifiers, internal-only names, and unnecessary local paths are absent or safely replaced.
7. Each sentence conveys enough information to understand its meaning, and relationships between sentences and sections remain explicit:
   - For each sentence, determine whether the text identifies its subject or referent, action, conditions, and result without requiring the reader to invent missing information.
   - Do not fail a sentence for length alone. Fail a short sentence when its subject, referent, premise, or necessary explanation is missing, and allow a long sentence when the relationships between its parts remain explicit.
   - Check that the same role name keeps the same responsibility. When adjacent text switches role names, require evidence that they name distinct roles or explain that they name the same role; do not infer the relationship from familiar titles.
   - Check that pronouns and phrases such as "this result" have one identifiable referent, conditions and assumptions appear before the action that relies on them, and one step's result explains why the next step can begin.
   - Distinguish verified facts, proposals under review, and approved decisions. Do not let a later sentence silently promote a proposal into an approved decision.
8. When the output contains Korean, its Korean wording is natural for the intended readers rather than literal, mechanically translated, padded with stock phrases, or mixed with avoidable English forms. Apply `references/korean.md` only to the Korean text. Check general-prose U+00B7, context-dependent terms beyond any fixed candidate list, repeated introductions and conclusions, arbitrary three-part structures, and repeated paragraph shapes.
9. Emoji and uncommon symbols are absent unless readers or an approved format need them.

Require one of these statuses for every applicable criterion and artifact:

- `pass`: evidence supports publication as written;
- `needs revision`: a specific defect can be corrected without a new decision from the responsible owner;
- `needs human input`: publication depends on unresolved intent, approval, ownership, responsibility, or policy;
- `not applicable`: the criterion does not apply, with a short reason.

Require each non-passing result to identify a tight location, the evidence or reasoning, and the reader-facing consequence. Instruct the subagent not to rewrite the artifact and not to quote sensitive text in its report.

When one sentence compresses several independent judgments or actions, require the finding to identify the clauses whose relationship is unclear and the information the reader cannot recover. When a problem spans sentences or sections, require both locations and describe the missing relationship between them.

Use `needs revision` only when repository evidence already identifies the exact referent, actor, relationship, or decision needed to correct the text. Use `needs human input` when that information is absent or conflicting; naming a plausible actor or relationship is not a correction.

For UI and accessibility text, judge whether users can understand the relevant state and next action. For code comments and API documentation, judge whether callers or maintainers receive the conditions and constraints they need.

If no general-purpose subagent is available, perform the same checks in the main context. For a Korean user-facing draft, apply every question in `references/korean.md`, rewrite each violation, and review the revised text once more. For a file or other stored artifact, keep the fallback read-only and report findings without editing. When the user requested a review result, put a warning at the beginning of that result that states independent review was not performed and why. For a pre-send review, apply the fallback without appending an internal review report to the response. This fallback alone does not stop a commit or publication. If write access cannot be restricted, do not claim that tool-enforced read-only review occurred.

Repeat the review with the strongest available model and high reasoning effort only when the reviewer cannot judge the artifact because evidence conflicts or the main agent finds an unsupported or omitted judgment during reconciliation. A `needs revision` result alone does not require a more capable model. Missing evidence or authority remains `needs human input` at every model setting.

## Reconcile the result

1. Compare every finding with the actual changed artifact and applicable repository rule.
2. Reject unsupported findings, findings outside the supplied scope, and conclusions based only on an example phrase.
3. Confirm that delegation did not change files or repository state. Report unexpected changes and stop before publication.
4. Resolve conflicts between deterministic checks and semantic review by inspecting the actual context. Do not let either source silently override the other.
5. Determine the overall result from the most restrictive applicable status. Do not convert `needs human input` into an inferred decision.

## Report

When the user requested a review result, list the reviewed outputs, their intended readers, the reference files opened, the checks performed, the model and reasoning setting when known, and the per-criterion results. Include invocation-level token counts and elapsed time when the host provides them; otherwise mark those values as unavailable. Separate defects that can be revised from questions for the requirements owner, decision owner, reviewer, or approval owner. State any missing independent review, unavailable model override, unavailable check, redaction, or incomplete evidence.

When this skill runs only as a pre-send check for a user-facing draft, return the findings to the main agent. The main agent revises the draft and sends only the resulting response. Do not add the internal review report, model setting, token counts, or elapsed time unless the user asked for the review itself.

End the review without editing files. If the user later authorizes fixes, make them as a separate task and run this review again on the revised outputs.
