<!-- Compare this default with docs/designs/README.md and replace it when the shared rules change; omit this comment when creating a repository README. -->
# Design Documents

This directory stores requirements, evidence, decisions, and plans that must remain understandable beyond one conversation or pull request. The requirements owner controls `requirements.md`. AI may review, research, record approved decisions, plan, and validate, but it must not invent or silently rewrite the requested outcome.

## Package and Document Model

```text
docs/designs/
  README.md
  <topic>-<short-id>/
    requirements.md
    references/
      <research-topic>.md
    decisions/
      <decision-topic>.md
    plan.md
```

Create a package only when its context must survive across sessions, contributors, or pull requests. Every package has `requirements.md`. Create reference, decision, and plan files only under their conditions below; do not create empty directories or placeholders. Use a descriptive topic and a short collision-resistant ID.

Documents are prose-first and have no fixed template. Their headings and order may vary when they preserve the required information, exclude prohibited content, and pass the applicable checks.

## Rules for Every Document

- Identify the document type, intended readers, and the decision or action those readers need to take before writing. Name distinct requirements, decision, review, and execution roles when their responsibilities differ. If evidence does not identify a responsible role, report `needs human input` instead of assigning one.
- Keep requirements, sourced facts, analysis, proposals, approved decisions, and unresolved questions visibly distinct. Put unrelated subjects in the documents responsible for them even when they came from one request.
- Use verified repository evidence, sourced research, approved decisions, or approved wording for reader-facing claims. Treat prompts, agent instructions, task notes, requested formats, tool conditions, progress reports, and untracked notes as work inputs rather than publishable evidence.
- Retain exact source text only when the document requires it, such as owner-controlled requirements, approved interface wording, a quotation, prompt-processing evaluation data, minimal reproduction input, or an access-controlled untracked log. Keep only the necessary part.
- Use one descriptive title and a logical heading hierarchy. Put each section's conclusion or decision before background details and keep the section focused on one subject.
- Do not use tables. Use bullets for unordered items and numbers only for sequence or priority. When readers compare repeated items, give each item a subsection and present the applicable attributes in the same order without empty fields or repeated conclusions.
- Put descriptive external links next to the claims they support. When several sources support one claim, state the compared conclusion and list the fact confirmed by each source. Separate sources that support different claims. Do not leave an unrelated link list at the end.
- Link to the authoritative requirement, decision, evidence, or guidance instead of copying it into several files. Refer to requirements by file and descriptive heading; do not add requirement IDs. Add metadata only when an active tool or review process consumes it.
- Use language natural to the intended readers. Remove literal translations, unsupported praise, decorative symbols, and uncommon notation unless the reader or approved format needs the exact form.
- Keep credentials, personal locations, private URLs, private project identifiers, and raw sensitive logs out of tracked documents. Prefer repository-relative locations and stable public URLs. Report unsafe requirement text to the requirements owner instead of silently rewriting it.

## `requirements.md`

### Authority and creation

`requirements.md` states the requirements owner's requested outcome, and that owner controls its wording and ordering. When a durable package is needed and the file does not exist, AI may create a minimal initial version from the owner's explicit request. After initial creation, AI may propose exact changes but may edit the file only when the owner requests the change or approves the wording.

An initial version contains only stated outcomes, conditions that must remain true, observable completion evidence, and owner-stated unresolved questions. Include protected behavior, exclusions, inputs, environment, or domain constraints only when they affect the work. Exclude workflow instructions unless they constrain the requested result. Do not infer missing requirements, constraints, evidence, or decisions.

Omit unsupported sections instead of adding empty headings, placeholders, or guesses. Missing information blocks only work that depends on it; unaffected work may continue when the request supplies a sufficient baseline.

### Required information

- The intended outcome
- Conditions that must be true
- Observable evidence that will show completion
- Unresolved questions that would change the requested behavior, when present

### Prohibited content

- AI-inferred requirements presented as owner-approved requirements
- Completion language without observable evidence
- Implementation choices presented as required outcomes without owner approval
- Instructions added only to make an existing implementation appear compliant

### Review

Read the complete file and check ambiguity, contradiction, missing completion evidence, unverifiable wording, and unanswered behavior-changing questions. Separate blocking questions, optional suggestions, factual research questions, and decisions requiring the decision owner's judgment. Do not validate the requirements owner's intent on that owner's behalf or silently edit while grading.

## `references/*.md`

Create a reference when factual research or repository evidence will be reused after the current conversation. Keep a small fact check in the conversation when no durable handoff is needed.

### Required information

- The investigated question and the requirement area or explicit work context that made it necessary
- Sources and the dates or revisions reviewed
- Each source's descriptive link beside the fact it supports
- Facts supported directly by the sources
- Conclusions derived from comparing the evidence
- Limitations, conflicts, unresolved uncertainty, and effects on requirements, decisions, or planning

Prefer current official documents, standards, and source repositories for material claims and cross-check them with independent primary sources. When external guidance differs from the repository, describe the difference instead of declaring either source automatically correct.

### Prohibited content

- Unsupported claims presented as sourced facts
- Analysis presented as an approved decision
- Unapproved new requirements
- Sources whose supported claims cannot be identified
- Task wording, progress reports, review instructions, or private environment details presented as findings

## `decisions/*.md`

Create a decision record only for an approved choice that materially affects the work and must remain understandable later. AI may prepare options; the decision owner approves the result. If the choice changes the requested outcome, the requirements owner updates `requirements.md` before affected work resumes.

### Required information

- The question requiring a decision
- The requirement area and outcome the decision must satisfy
- Material options actually considered
- The approved decision and its reasoning
- Expected consequences, plan impact, and conditions for revisiting the decision

### Prohibited content

- An AI recommendation presented as approval
- Invented approval evidence
- A broader or narrower decision than the approved wording
- A decision that silently overrides `requirements.md`
- Task wording or an implementation report presented as the decision question, reason, or result

## `plan.md`

Create `plan.md` only when work needs an execution plan and behavior-changing ambiguities and required decisions are resolved. A small research-only package does not need a plan.

### Required information

- The path and applicable headings of the baseline `requirements.md`
- Requirement areas and outcomes mapped to work units
- Dependencies and execution order where order matters
- Observable verification for each work unit
- Unresolved blockers and explicit stop conditions
- Applicable files under `docs/dev/` when later changes could alter execution

Before the plan's first commit, the reviewed files are the provisional baseline. Afterward, the versions in the commit that last changed `plan.md` are the baseline. Do not record Git object IDs or timestamps as baseline identifiers. Changing and committing the plan confirms that its requirements and listed development guidance were reviewed again.

The plan may choose implementation steps, but every required outcome and protected behavior must be covered by work and verification or identified as blocked.

### Prohibited content

- New requirements disguised as implementation work
- Assumptions presented as resolved facts
- Vague checks that do not name observable evidence
- Completion claims based only on documents instead of implementation evidence
- Task wording, tool instructions, progress commentary, review formats, or private environment details used as plan content

## Validation

Use the least expensive check that can reliably decide each property.

- Repository tools check placement, required files, empty files or directories, unresolved placeholders, and repository-relative links when such checks exist.
- AI checks required information, ambiguity, contradictions, evidence support, requirement coverage, and readability.
- Requirements owners confirm requirements and answer behavior-changing questions. Decision owners approve decisions. Responsible reviewers judge intended behavior and trade-offs that tools cannot decide.

Report every applicable criterion as `pass`, `needs revision`, `needs human input`, or `not applicable`, with a short quotation or file location as evidence. Say when evidence is absent instead of inferring it. Review and rewriting are separate actions.

For each new or changed reference, decision, or plan, also read the final form as its intended reader. Check each factual claim and decision reason against an allowed source, scan for private information, and confirm that the title and structure describe the subject rather than the task that produced it.

Documentation records intent and evidence; it does not prove implementation compliance. Use the applicable lint, type or schema checks, tests, runtime checks, and responsible review for implementation evidence.

## Requirement Changes During Work

1. The requirements owner updates `requirements.md`; a chat-only statement is not a durable update.
2. Compare the updated file with the baseline recorded by the commit that last changed `plan.md`.
3. Identify affected and unaffected references, decisions, work units, and verification methods.
4. Pause affected work. Continue unaffected work only when it still satisfies the updated requirements.
5. Update affected derived documents and commit the reviewed plan before affected work resumes.

Do not restart all work automatically or rewrite requirements to match completed work.

## Add Structure Only When Needed

- Clarify ambiguous headings or responsibility before references become unreliable.
- Add a reference or decision index only when the directory is no longer easy to scan.
- Add machine-readable metadata only for an active tool.
- Add a separate coverage or completion audit only when `plan.md` and the actual change cannot be reviewed reliably together.

Link packages from issues and pull requests instead of copying their contents. Recheck a document when its requirements, sources, decisions, dependencies, or implementation evidence change.
