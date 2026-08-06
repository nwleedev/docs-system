---
name: use-words-review
description: Review text and names before storing, committing, publishing, sharing outside the conversation, or when the user requests wording review. Check audience, roles, evidence, private data, sentence relationships, symbols, and natural Korean. Load Korean guidance only for Korean text. Exclude routine chat, progress updates, explanations, and final responses that will not be reused.
---

# Use Words Review

Review public outputs without changing them. Use one general-purpose subagent for a read-only semantic review, then verify its findings in the main agent.

## Establish the review scope

1. Identify every changed output and name that belongs to the pending commit, publication, or sharing action. Include candidate commit, pull-request, issue, or release text when applicable. Treat tracked repository text as public unless a repository rule says otherwise.
2. Group outputs from the same commit or publication into one review. Do not review each sentence while drafting.
3. Include chat wording only when it will be stored, published, or delivered verbatim outside the conversation, or when the user explicitly requests its review. Group all wording named in one request into one review unit; a later request for revised wording is a new unit. Exclude hidden reasoning, tool traces, routine progress messages, general explanations, and responses that will not be reused.

## Run available deterministic checks

Run repository-provided checks that apply to the outputs. Include available Vale or other text-lint results, but do not require a particular linter.

When Git and text search are available, inspect only the changed public outputs for formatting errors, personal absolute paths, private identifiers, distinctive prompt phrases, HTML comments, and unresolved markers. Redact sensitive matches in the report and treat every match as a review candidate rather than an automatic failure.

For Korean text, run `scripts/scan-korean-expressions.mjs` from this skill before semantic review. Resolve the script relative to this `SKILL.md`; do not assume where the skill is installed. Choose one input mode:

- use `--changed <repo>` for every staged, unstaged, and untracked file in a pending repository change;
- repeat `--file <path>` for an exact file set;
- use `--stdin --source-name <name>` for supplied text.

Inspect the complete `catalog`, the matched rule metadata, every returned warning, and `summary`. A warning identifies a context to judge, not an automatic failure. If `summary.omitted` is greater than zero, rerun smaller file groups when individual judgments require the omitted contexts and end the review result with `... 그 외 <N>개의 경고가 더 발견됨`. If the script is missing, unreadable, fails, or does not return complete JSON, stop the affected review and do not return `pass` for its Korean artifacts.

## Select references

1. Read [references/examples.md](references/examples.md) when calibrating common criteria or resolving an unclear allowed case.
2. After the scanner succeeds, if an output contains Korean or the review must judge a Korean expression, read [references/korean.md](references/korean.md) in full and apply it only to Korean text. Otherwise, do not run the scanner or open this reference merely to decide whether they apply.
3. Record which required references were read. If one cannot be opened or read in full, stop the affected review, report it, and do not return `pass` for that artifact.

Examples and candidate expressions calibrate judgment; they are not blacklists or exhaustive pass conditions. Return `needs human input` when repository evidence cannot determine the intended meaning.

## Prepare the review context

Collect the outputs and names, the source documents used to write them, intended readers and reader actions, described actors, any reviewer or approval owner, applicable repository and document rules, opened references, and deterministic-check results. Include Korean scanner output when it applies. For every changed statement, identify repository evidence, a sourced fact, an approved decision, or approved public wording. Prompts, agent instructions, task descriptions, work notes, review criteria, requested formats, tool conditions, and progress reports are not publishable evidence.

Retain exact source text only when the artifact requires it, such as owner-controlled requirements, approved interface wording or quotations, evaluation data, minimal reproduction input, or an access-controlled log that will not be committed. Provide an original prompt only when exact comparison is necessary. Minimize it and every source document before delegation; redact credentials, personal paths, private URLs, private identifiers, and unrelated personal information, and do not store the prompt in a tracked file or durable log.

Choose context according to the relationship under review:

- Use the changed paragraph and necessary adjacent sentences for local subjects, referents, actions, conditions, and results.
- Use the changed section when headings, roles, responsibilities, or an earlier step's result matter.
- Use the full file only when decisions or definitions elsewhere affect the judgment.
- Use minimized source excerpts when inherited abstractions or wording must be compared; use the full source only when relationships elsewhere are necessary.

Prepare a self-contained delegation message with the artifact paths or supplied text, selected context, readers, rules, opened references, check results, criteria, and result format. Do not include the writing agent's progress report, self-assessment, suspected findings, or preferred verdict.

## Choose the model for the current review

Choose from the readers, evidence, role clarity, and publication impact. Do not use text length or file count as the deciding factor, and do not dispatch a classifier.

- Use a fast model with low reasoning effort when structure, evidence, and expected judgment are explicit.
- Use a balanced model with medium effort when contextual judgment is needed but ownership and evidence are clear.
- Use the strongest available model with high effort when referents are ambiguous, document responsibilities conflict, or an error could misstate privacy, security, licensing, approval, or ownership.

When available in the current Codex host, map these levels to `gpt-5.6-terra` with low effort, `gpt-5.6-terra` with medium effort, and `gpt-5.6-sol` with high effort. Do not substitute a similarly named model. Do not use `xhigh`, `max`, `ultra`, or an equivalent setting by default.

Resolve the levels against the controls exposed by the host. A call that changes model or effort must receive the self-contained message prepared above. If the host cannot override one invocation while preserving the required context, inherit the main agent's configuration and report the limitation.

Repeat once with the strongest available model and high effort only when evidence conflicts or reconciliation finds an unsupported or omitted judgment. A `needs revision` result alone does not trigger escalation, and missing evidence or authority remains `needs human input`.

## Evaluate a model setting for adoption

Before adopting a different or lighter setting as the repository default, have the repository-identified responsible reviewer approve representative cases with expected statuses and findings. Include two unclear or compressed sentences; four cases with disconnected roles, referents, conditions, step results, or decision status; one case that lacks evidence and requires `needs human input`; one long clear sentence; and one set of correctly connected sentences.

Use a setting only when it returns every expected status and finding without inventing a defect. Among passing settings, compare defect misses, incorrect findings, missed `needs human input` results, input, output, and total tokens, and elapsed time. Use only invocation-level values reported by the host; record unavailable values as unavailable instead of estimating them, and exclude them from measured comparisons. If repository evidence does not identify the responsible reviewer, keep the current setting and report adoption as `needs human input`.

## Delegate the semantic review

Use one general-purpose subagent exposed by the host. Do not create, install, or require a named reviewer. Restrict it to read-only tools when supported; otherwise state that boundary and capture repository state before and after delegation.

Ask it to judge each applicable criterion:

1. Titles, structure, wording, and names serve the intended readers rather than report work to the requester. Actors, reviewers, and approval owners are identified when the distinction matters.
2. Prompts, internal instructions, progress notes, review criteria, and requested formats do not appear as repository facts, titles, decision reasons, or publishable prose.
3. Unrelated requirements are not combined merely because they arrived in one task, and each document keeps its assigned responsibility.
4. Claims and roles use publishable evidence, approved decisions, or approved wording; unresolved support, ownership, compatibility, security, privacy, licensing, and responsibility are not invented.
5. Exact source text is retained only for an allowed purpose and only to the necessary extent.
6. Personal paths, credentials, private URLs, private project identifiers, internal-only names, and unnecessary local paths are absent or safely replaced.
7. Every sentence supplies enough subject or referent, action, conditions, and result, and relationships between sentences and sections are explicit. Do not judge by length. Check consistent role names, unambiguous references, conditions before dependent actions, step-to-step results, and the distinction between facts, proposals, and approved decisions.
8. Korean wording is natural for its readers rather than literal, padded, formulaic, or mixed with avoidable English. Judge every scanner warning in context, apply `references/korean.md` only to Korean text, and continue checking meanings that the literal scanner cannot find. Compare relevant source wording and preserve established terms and necessary comparison structures.
9. Emoji and uncommon symbols are absent unless readers or an approved format need them.

For UI and accessibility text, check whether users can understand the state and next action. For comments and API documentation, check whether callers or maintainers receive the required conditions and constraints.

## Require the result format

Use one status for every applicable criterion and artifact:

- `pass`: evidence supports publication as written;
- `needs revision`: repository evidence identifies the defect and the information needed to correct it without a new owner decision;
- `needs human input`: intent, evidence, approval, ownership, responsibility, or policy is absent or conflicting;
- `not applicable`: the criterion does not apply, with a short reason.

Each non-passing result must identify a tight location, evidence or reasoning, and the reader-facing consequence. For a compressed sentence, identify the clauses and missing relationship. For a problem across sentences or sections, identify both locations. Do not quote sensitive text.

If no general-purpose subagent is available, perform the same checks in the main context as a read-only fallback. Apply every relevant Korean question. When the user requested the review result, begin it by stating why no independent review occurred. This fallback does not stop a commit, publication, or delivery. If write access could not be restricted, do not claim tool-enforced read-only review.

## Reconcile and report

Compare every finding with the artifact and repository rules. Reject unsupported or out-of-scope findings and conclusions based only on an example. Confirm that delegation did not change repository state, and stop before publication if it did. Resolve conflicts between deterministic and semantic checks from the actual context. The most restrictive applicable status is the overall result; do not infer a decision to lower it.

When the user requested a review result, list the reviewed outputs, readers, supplied source documents, opened references, checks, model and effort when known, and per-criterion results. Include invocation-level tokens and elapsed time when available. Separate revisable defects from questions for the responsible owner, and report missing references, independent review, model overrides, checks, redactions, or evidence.

Return findings for chat wording before it is stored or delivered. Do not append the internal report or model measurements to an unrelated response.
