# Design Documents

This directory stores durable context for work that must remain understandable beyond a single conversation or pull request. The requirements owner controls `requirements.md`. When the file does not yet exist, AI may create a minimal initial version from the requirements owner's explicit request. AI may review, research, record approved decisions, plan, and verify, but it must not invent or silently rewrite the requested outcome.

## Package Structure

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

Create a package only when its context must survive across sessions, contributors, or pull requests. `requirements.md` is required in every package. Create `references/`, `decisions/`, and `plan.md` only when their creation conditions below are met. Do not create empty directories or placeholder documents.

The short ID prevents name collisions. It does not replace a descriptive topic name.

## Document Model

Documents are prose-first and do not use fixed templates. Authors may choose headings, section order, paragraphs, lists, quotations, and code blocks that fit the subject. A document is acceptable when it contains the required information for its type, excludes prohibited content, and passes the applicable checks below.

For every document type, this README should define

- Why and when the document exists
- Information that must be present
- Information required only in applicable cases
- Content the document must not contain
- Checks performed by repository tools, AI, and responsible reviewers

## Presentation

- Use one descriptive title and a logical heading hierarchy. Do not create empty headings or skip heading levels for visual styling.
- Derive titles, filenames, and headings from the document's question, decision, subject, or result, not from the wording of the task that requested it.
- Put each section's conclusion or decision before its background detail. Keep each section focused on one question, decision, subject, or result.
- Do not use tables. Preserve reading order with descriptive headings, short paragraphs, and lists.
- Use bullets for unordered items and numbered lists only for sequence or priority. Present paired names and descriptions as bold run-in labels followed by prose.
- When readers must compare options or repeated items, give each one its own subsection and describe the applicable attributes in the same order. Do not add empty fields merely to force uniformity.
- Separate sourced facts, analysis, approved decisions, proposals, and unresolved uncertainty so readers can distinguish them.
- Link to the owning document instead of copying the same requirement, decision, evidence, or guidance into multiple files.
- Do not add IDs to requirements or derived documents. Add YAML, status fields, or other metadata only when a current tool or review process consumes them.

## Source and Audience

Before writing, identify the document type, its intended readers, and the decision or action those readers need to take. A design document explains requirements, evidence, decisions, or executable work to those readers; it is not a report to the work requester.

When the requirements owner, intended readers, decision owner, and reviewer are different, name the applicable role instead of referring to all of them as a person or human. If the repository and approved decisions do not identify the responsible role, report `needs human input` instead of assigning responsibility.

One task may contain multiple requirements, research questions, decisions, or work units. Assign each part to the document that owns that kind of information. Do not combine unrelated parts into one document or decision merely because they appeared in the same prompt.

Treat user prompts, agent instructions, internal task descriptions, review criteria, requested output formats, tool conditions, progress reports, and untracked notes as work inputs, not as publishable sources. Except where exact text is part of the document's purpose, do not quote, lightly rewrite, or use those inputs as titles, filenames, headings, repository facts, decision reasons, or current rules. Write needed content from verified repository evidence, sourced research, approved decisions, or previously approved public wording.

Exact source text may be retained only when the document's purpose requires it: requirements whose wording belongs to the requirements owner, approved user-visible wording or quotations, prompt-processing evaluation data, a minimal reproduction input, or an access-controlled log that is not committed. Keep only the necessary portion. Do not carry credentials, personal absolute paths, local attachment locations, private project identifiers, or internal paths into a tracked document when a safe placeholder or a repository-relative path is sufficient. Report unsafe text in a requirement to its owner separately instead of silently rewriting it.

Write in language natural to the intended readers. Do not preserve literal translations, awkward terminology, emoji, or uncommon symbols merely because they appeared in a prompt or source note.

## `requirements.md`

### Purpose and ownership

`requirements.md` states the requirements owner's requested outcome. The requirements owner controls its wording and ordering and may create or rewrite the file at any time.

Because the requirements owner controls the wording, `requirements.md` may preserve exact request text when that wording is itself part of the requirement. This exception does not make the same text suitable for references, decisions, plans, implementation documentation, or other public outputs.

When a design package is needed and `requirements.md` does not exist, AI may create a minimal initial version from the current request. Include only the explicitly stated intended outcome, conditions that must remain true, observable completion evidence, and user-stated unresolved questions. Exclude instructions about tools or workflow unless they constrain the requested result. Do not infer features, constraints, evidence, or decisions.

Keep the initial version easy to revise. Omit unsupported sections instead of adding empty headings, placeholders, or guessed content. Review missing required information immediately after creation. Missing information blocks only the research, planning, or implementation that depends on it. Continue unaffected work when the explicit request provides a sufficient baseline.

After the initial version exists, AI may identify gaps and propose exact changes, but it may edit the file only when the requirements owner explicitly requests a change or approves the wording to apply.

### Required information

- The intended outcome
- Conditions that must be true
- Observable evidence that will show the work is complete
- Unresolved questions that would change the requested behavior, if any.

Include protected behavior, exclusions, inputs, environment, or product constraints only when they affect the work. The requirements owner may express this information in plain sentences without YAML, tables, IDs, formal scenarios, or technical terminology.

An AI-created initial version may be incomplete because the request did not state every required item. Mark the missing criteria as `needs revision` or `needs human input`. Do not fill them by inference merely to make the document pass review.

### Prohibited content

- AI-inferred requirements presented as requirements approved by their owner
- Unverifiable completion language without observable evidence
- Implementation choices presented as required outcomes when the requirements owner did not require that implementation
- Instructions added only to make an existing implementation appear compliant.

Derived documents refer to the relevant requirement by its owning file and descriptive heading instead of copying request text for traceability. Do not add requirement IDs. If the existing headings do not identify the relevant requirement clearly enough, report the ambiguity to the requirements owner instead of rewriting the requirement or inventing metadata.

### Review

AI reads the entire file and checks for ambiguity, contradiction, missing completion evidence, unverifiable wording, and unanswered behavior-changing questions. Findings stay in the conversation unless preserving them serves a durable need. AI must not validate the requirements owner's intent on that owner's behalf.

Before research or planning continues, AI separates findings into blocking questions, optional suggestions, factual research questions, and decisions that require the decision owner's judgment.

## `references/*.md`

### Creation condition

Create a reference document when factual research or repository evidence will be reused after the current conversation. Keep a small fact check in the conversation when no durable handoff is needed.

### Required information

- The question being investigated
- The requirement area or work context that made the research necessary, identified without copying internal task text
- Sources and the dates or revisions reviewed
- Facts supported directly by those sources
- Conclusions derived from comparing the evidence
- Limitations, conflicts, and unresolved uncertainty
- The effect on requirements, decisions, or planning.

When external claims materially affect the work, prefer current official documents, standards, and source repositories, and cross-check the claims with independent primary sources. When external guidance differs from the current repository, describe the difference instead of presenting either one as automatically correct.

### Prohibited content

- Unsupported claims presented as sourced facts
- Analysis presented as an approved decision
- New requirements that the requirements owner did not approve
- Source lists that do not show which claims they support
- Prompt wording, progress reports, review instructions, or private environment details presented as research findings.

## `decisions/*.md`

### Creation condition

Create a decision record only for a choice that materially affects the work and must remain understandable later. The decision owner decides. AI may prepare options and record the approved result.

### Required information

- The question that required a decision
- The requirement area and outcome the decision must satisfy
- The material options actually considered
- The approved decision and its reasoning
- Expected consequences and plan impact
- Conditions that would justify revisiting or superseding the decision.

A proposed option is not an accepted decision. If a decision changes the requested outcome, the requirements owner updates `requirements.md` before affected work resumes.

### Prohibited content

- AI recommendations presented as the decision owner's approval
- Invented approval evidence
- A broader or narrower decision than the wording the decision owner approved
- A decision that silently overrides `requirements.md`
- Task wording or an agent's implementation report presented as the decision question, reason, or result.

## `plan.md`

### Creation condition

Create `plan.md` after behavior-changing ambiguities and required decisions are resolved and the work needs an execution plan. Small research-only packages do not need a plan.

### Required information

- The path and applicable headings of the baseline `requirements.md`
- Requirement areas and outcomes mapped to work units without copying internal task text
- Dependencies and execution order where order matters
- Observable verification for each work unit
- Unresolved blockers and explicit stop conditions
- The specific applicable files under `docs/dev/` when later changes could alter execution.

Do not record Git object IDs or timestamps as baseline identifiers. Before the plan's first commit, the current reviewed files are the provisional baseline. After the plan is committed, the versions of those files in the commit that last changed `plan.md` are the baseline. Changing and committing the plan confirms that the requirements and listed development guidance were reviewed again.

The plan may choose implementation steps, but it must not invent product behavior. Every required outcome and protected behavior must be covered by work and verification or identified as blocked.

### Prohibited content

- New requirements disguised as implementation work
- Assumptions presented as resolved facts
- Vague completion statements such as "test it" or "review it" without naming the evidence
- A completion claim based only on documents rather than the actual implementation and verification results
- Prompt wording, tool instructions, progress commentary, review formats, or private environment details used as plan content.

## Validation

Use the cheapest reliable check for each property.

- Repository checks, when implemented, verify file placement, required files, empty files or directories, unresolved placeholders, and repository-relative links.
- AI checks required information, ambiguity, contradictions, evidence support, requirement coverage, and readability.
- Requirements owners confirm intended requirements and answer behavior-changing questions. Decision owners approve decisions, and responsible reviewers judge product meaning or trade-offs that tools cannot decide.

AI reports each applicable criterion as `pass`, `needs revision`, `needs human input`, or `not applicable`. Every result includes a short quotation or file location as evidence. If evidence cannot be found, AI says so instead of inferring missing content. Review and rewriting are separate actions. AI does not silently repair a document while grading it.

For every new or changed reference, decision, or plan, AI also reviews the final form as its intended reader. It checks that each factual claim and decision reason has an allowed source, rejects text derived from internal work inputs, scans for personal or private paths and identifiers, and confirms that the title and structure describe the document rather than the task that produced it. The responsible reviewer decides whether the language and meaning fit the intended audience.

Documentation explains intent and evidence. It does not prove that an implementation complies. Use lint, type or schema checks, tests, runtime or browser checks, and review by the responsible reviewer for implementation verification.

## Requirement Changes During Work

1. The requirements owner changes `requirements.md`. Chat-only changes are not durable requirements.
2. AI compares the updated file with the version included in the commit that last changed `plan.md`.
3. AI rereads the changed requirement areas and identifies affected references, decisions, work units, and verification methods without copying the changed text into those documents.
4. Affected work pauses. unaffected work may continue when it still satisfies the updated wording.
5. AI updates the affected derived documents and commits the reviewed plan before affected work resumes.

Do not restart all work automatically, and do not rewrite requirements to match work already completed.

## When to Add More Structure

- Ask the requirements owner or document owner to clarify ambiguous headings or ownership before references become unreliable.
- Add a references or decisions index when the directory is no longer easy to scan.
- Add machine-readable metadata only when an active tool needs it.
- Add a separate coverage or completion audit only when `plan.md` and the actual change cannot be reviewed reliably together.

Do not add these artifacts in advance for every package.

## Repository Integration

- Link the design package from issues and pull requests instead of copying its contents.
- Keep secrets, credentials, personal data, private URLs, and raw sensitive logs out of tracked documents.
- Prefer repository-relative paths and stable public URLs.
- Recheck a document when its requirements, sources, decisions, dependencies, or implementation evidence change.

## Design Basis

- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) supports short entry points, repository-local knowledge, progressive loading, and mechanical checks for document structure and freshness.
- [OpenAI: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recommends task-specific criteria, automated scoring where possible, and calibration with reviewer judgment.
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) recommends deterministic checks where possible, model review where necessary, and reviewer calibration for subjective judgments.
- [Anthropic: Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) recommends progressive disclosure and adding instructions from observed failures instead of anticipating every case.
- [NASA: How to write a good requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/) recommends necessary, consistent, implementation-free, and verifiable requirements.
- [W3C: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/), [Google: Lists](https://developers.google.com/style/lists), [Google: Paragraph structure](https://developers.google.com/style/paragraph-structure), [Microsoft: Lists](https://learn.microsoft.com/en-us/style-guide/scannable-content/lists), [Digital.gov: Headings](https://digital.gov/guides/plain-language/design/headings), and [GOV.UK: Publishing accessible documents](https://www.gov.uk/guidance/publishing-accessible-documents) support descriptive headings, concise paragraphs, and list formats chosen for the information's order and relationships.
