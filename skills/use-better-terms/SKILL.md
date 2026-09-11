---
name: use-better-terms
description: Improve text and names before they are stored, committed, published, shared, or explicitly submitted for wording review. Apply evidence-backed replacements first, preserve exact terms only when needed, and leave unsupported meaning changes for human input. Exclude routine chat and responses that will not be reused.
---

# Use Better Terms

Improve one sharing unit in the current session. Prefer natural wording that preserves verified meaning. Keep required exact terms with a reason, and do not invent missing meaning, roles, or approval.

## Set the scope

1. Identify every changed output and name in the pending commit, publication, or sharing action. Include candidate commit, pull-request, issue, or release text when applicable. Treat tracked repository text as shared unless a repository rule says otherwise.
2. Group outputs from the same commit or sharing action and review the group once after drafting. Do not review each sentence while drafting.
3. Include chat wording only when it will be stored, published, delivered verbatim outside the conversation, or explicitly submitted for review. Exclude hidden reasoning, tool traces, routine progress messages, general explanations, and responses that will not be reused.

## Collect evidence and run checks

Collect the intended readers and their next action, applicable repository rules, verified facts, approved decisions and wording, responsible roles, and the context needed to resolve references between sentences. For document work, identify the decisions or actions the reader must make, then locate the source material for each relevant claim. Check the actors, actions, conditions, and timing in that material, and distinguish documentation, code, and runtime evidence when they differ. When evidence does not establish a claim, role, condition, or approval state, record the gap instead of supplying it from inference.

Run repository-provided formatting and text checks that apply to the outputs. When Git and text search are available, inspect only the changed shared outputs for formatting errors, personal absolute paths, private identifiers, HTML comments, and unresolved markers. Redact sensitive matches in reports and judge every match in context.

For Korean text, run `scripts/scan.mjs` relative to this `SKILL.md`. Choose one input mode:

- use `--changed <repo>` for every staged, unstaged, and untracked file in a pending repository change;
- repeat `--file <path>` for an exact file set;
- use `--stdin --source-name <name>` for supplied text.

Inspect the complete `sources` and both the expression and long-paragraph `checks`, including each `catalog`, matched `rules`, every warning, and `summary`. Review every warning from both checks in the current sharing unit, even when the expression is familiar, an earlier review assigned it a status, or its likely outcome appears obvious. For each warning, determine separately whether the text needs revision and whether the available text provides enough context to judge it. A warning starts this judgment; it neither proves a defect nor permits retaining the text without review. Read the complete original paragraph for a paragraph warning.

Do not complete the affected review until every warning in the current sharing unit has been judged from current evidence. If `summary.omitted` is greater than zero, use smaller input groups until every omitted warning that applies to the sharing unit has been judged, and report the omitted count from each run. If the script is missing, fails, does not return one complete JSON object with both checks, or leaves a warning unavailable for judgment, stop the affected review and do not return `pass` for its Korean outputs.

Read references only when their conditions apply:

- Read [references/korean.md](references/korean.md) in full after the scanner succeeds when an output contains Korean or a Korean expression needs judgment.
- Read [references/examples.md](references/examples.md) when a common criterion or allowed case remains unclear.

If a required reference cannot be read in full, stop the affected review and report it. Examples and scanner candidates guide judgment; they are not blacklists or exhaustive pass conditions.

## Improve and judge the outputs

Judge the complete prose even when the scanner emits no warning. Include expressions not present in the rule catalog, and compare their uses across contexts when particles or inflections vary; do not limit this judgment to a fixed list or a repetition threshold.

Preserve an exact technical term when it identifies a distinct concept, and replace a broad noun only when the evidence supports the concrete actor, action, condition, or timing it should name. For every warning, decide whether revision is needed and whether additional context is needed before assigning a result. Then write at least one natural alternative for the actual context, including warnings whose original text may remain.

Do not stop at a one-word substitution when it leaves the cause of the warning, obscures a relationship, or produces less natural prose. Use the applicable language reference to explore a clearer sentence structure, including a different subject and predicate, verbal wording instead of stacked nouns, splitting or joining sentences, and a change of voice when that language and context make it relevant.

Compare the alternatives with the original for meaning, responsibility, conditions, focus, and the reader's next action. Restore only information supported by the collected evidence.

If the evidence is missing or conflicting, ask a concrete question about the fact, policy, approval, or responsible role instead of inventing it. Put the current judgment, its limiting conditions, and the reader's next action where the reader can find them.

If verified evidence shows that an alternative preserves the meaning and the task authorizes editing, apply it in the same work unit. If the task requests review only, return the alternative without editing. Do not perform context-free string replacement.

After applying a replacement, rerun the formatting and text checks that can detect defects in the edited output. For Korean text, rerun the scanner on the final sharing unit and reconcile every final warning with the current text before returning a status. Judge a warning introduced by the edit or affected by changed context as new. An unchanged warning may keep evidence recorded during the current work unit, but never inherit a status from an earlier review without examining it again in the current sharing unit.

Retain the original expression only when it is an established term, approved name, code identifier, required notation, or the best accurate wording. Record the alternative considered and the reason for retaining it. If replacement would decide a missing meaning, actor, condition, responsibility, or approval state, do not edit the text; return `needs human input`.

Assign each scanner warning one current result: `pass`, `needs revision`, or `needs human input`. Use `not applicable` only for a criterion that does not apply to that warning or output; it does not replace the warning's result. After every warning has a result, judge each applicable criterion and output with the status definitions below. Managing these statuses means preserving their names and meanings, not reusing an earlier result or skipping a warning.

Judge these criteria once for each applicable output:

1. The title, structure, wording, and names help the intended readers act. Distinct subjects remain in the document responsible for them.
2. Claims and roles follow verified facts, approved decisions, or approved wording. Proposals, unresolved choices, and approved decisions remain distinct.
3. Personal paths, credentials, private URLs, private project identifiers, internal-only names, and unnecessary local paths are absent or safely replaced.
4. Each sentence identifies enough of its subject or referent, action, conditions, and result. Role names stay consistent, and conditions and earlier results connect to dependent actions.
5. Korean wording is natural for its readers instead of literal, padded, formulaic, or mixed with avoidable English. Apply the judgment order in `references/korean.md` to every Korean warning and continue checking meanings that the scanner cannot find.
6. Emoji and uncommon symbols appear only when the readers or an approved format need them.

For interface and accessibility text, ensure that users can understand the state and next action. For comments and API documentation, ensure that callers or maintainers receive the required conditions and constraints.

## Return the result

Use one status for every applicable criterion and output:

- `pass`: the output can be used as written, including any authorized replacements applied in this work unit;
- `needs revision`: evidence identifies the defect and a meaning-preserving correction, but the correction was not authorized or could not be applied;
- `needs human input`: intent, evidence, approval, responsibility, or policy is absent or conflicting;
- `not applicable`: the criterion does not apply, with a short reason.

For each non-passing result, give a tight location, the evidence or missing relationship, a replacement when one can be written without a new decision, and the consequence for readers. For each scanner warning retained as `pass`, give the alternative considered and the evidence for retaining the original wording. Do not quote sensitive text.

When the user requested the result, list the reviewed outputs, intended readers, evidence, references, checks, applied or proposed replacements, retained warnings, and questions requiring a decision. Report unavailable checks and omitted warnings. Do not append this report to an unrelated response.
