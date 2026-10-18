---
name: use-better-terms
description: Improve wording and names in reusable text before storage or sharing, or when explicitly requested for wording review. Apply evidence-backed alternatives while preserving meaning. Exclude routine chat and content-placement work.
---

# Use Better Terms

## Set the scope

Group the outputs and names in the same storage, commit, publication, or sharing action for one final review. Include proposed commit, pull-request, issue, and release text when applicable. Treat repository text as shared unless instructed otherwise. Include chat only when it will be reused verbatim outside the conversation or was explicitly submitted for wording review.

## Collect evidence and run checks

Use established reader information and the reader's next action; their absence alone does not require an audience question. Collect applicable rules, verified facts, approved decisions and wording, and enough context to resolve actors, actions, references, conditions, and timing. Distinguish documentation, code, and runtime evidence. Read [references/korean.md](references/korean.md) in full before drafting Korean text or names and use it during their review.

Run existing formatting and text checks. Inspect changed shared text for personal locations, private identifiers, credentials, HTML comments, and unresolved markers; judge matches in context and redact sensitive evidence in reports.

For Korean text, run `scripts/scan.mjs` relative to this `SKILL.md` with one input mode:

- `--changed <repo>` includes staged, unstaged, and untracked files in the pending repository change;
- repeat `--file <path>` for an exact file set;
- `--stdin --source-name <name>` accepts supplied text.

Inspect the full JSON: `sources` and both expression and long-paragraph `checks`, each `catalog`, matched `rules`, every warning, and `summary`. If warnings are omitted, narrow the input groups until all applicable warnings are available and report each run's omitted count. Stop the affected Korean review if the script is absent, fails, returns incomplete JSON, or leaves a warning unavailable; do not return `pass` for those outputs.

After a successful scan, read the Korean reference in full if it has not been read for this work unit. Read [references/examples.md](references/examples.md) only when a language-common criterion or allowed case remains unclear. An unreadable required reference blocks the affected review. Examples and candidates are neither blacklists nor exhaustive checks.

## Improve and judge the outputs

Read the complete prose, including expressions outside the catalog and their inflected uses across contexts. A warning does not prove a defect. For each warning, separately decide whether revision is needed and whether more context is needed. Read the whole original paragraph for a paragraph warning.

Write at least one natural alternative for every warning, even when the original may remain. Explore another subject and predicate, verbal wording instead of noun stacks, sentence splitting or joining, and voice when relevant. Continue beyond a one-word substitution if it remains unclear or unnatural. Compare alternatives against verified meaning, responsibility, conditions, timing, focus, and the reader's next action.

Apply an evidence-backed, meaning-preserving alternative in the same work unit when editing is authorized. In review-only work, propose it without editing. Retain the original only for an established term, approved name, identifier, required notation, or more accurate and natural wording; record the alternative and reason. Never apply context-free substitutions.

If required meaning, an actor, a condition, responsibility, or approval is absent or conflicting, ask for that fact in the review response instead of guessing. Correct or omit an unsupported optional claim only when authorized. Return findings separately from the reviewed body unless a review artifact was requested.

After replacements, rerun checks that can detect defects in the edits. Rerun the Korean scanner on the final sharing unit and reconcile all final warnings with current text. A changed warning or context needs a new judgment. An unchanged warning may reuse evidence from this work unit, but not a prior review's status without examination.

Judge each applicable criterion once per output:

1. Title, structure, wording, and names suit the subject and established reader needs. Remove padding, literal translation, empty previews, arbitrary equal-length sections or item counts, repeated conclusions, and stock transitions; retain meaningful comparisons and required information.
2. Claims, roles, proposal and approval states follow verified evidence and remain distinct.
3. Sensitive locations, credentials, private URLs, identifiers, and unnecessary internal names are absent or safely replaced.
4. Referents, actors, actions, conditions, and sentence relationships are identifiable and consistent.
5. Language is natural for its readers. Apply the Korean reference when relevant, including meanings the scanner cannot identify.
6. Emoji and uncommon symbols appear only for an actual reader need or approved format.

Interface and accessibility text must convey the state and next action. Comments and API documentation must retain callers' and maintainers' necessary conditions and constraints.

## Return the result

Use these statuses for each applicable criterion and output:

- `pass`: usable as written, including authorized replacements applied now;
- `needs revision`: evidence supports a correction, but editing was unauthorized or could not be completed;
- `needs human input`: required meaning, evidence, responsibility, policy, or approval is absent or conflicting;
- `not applicable`: the criterion does not apply, with a reason. It cannot replace a warning's final status.

Assign every scanner warning one of the first three statuses before finishing. For non-passing items, give the location, evidence or missing relationship, an alternative when supported, and the consequence for readers. For retained warnings, give the considered alternative and retention evidence without quoting sensitive text.

When review results were requested, identify the reviewed outputs, intended readers when known, evidence, references, checks, replacements, retained warnings, unavailable checks, omitted counts, and unresolved decisions. Do not add a review report to an unrelated response or ask for reader information merely to fill one.
