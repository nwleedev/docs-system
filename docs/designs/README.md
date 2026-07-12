# Design Documents

This directory stores durable context for work that must remain understandable beyond a single conversation or pull request. A human owns `requirements.md`. When the file does not yet exist, AI may create a minimal initial version from the human's explicit request. AI may review, research, record human decisions, plan, and verify, but it must not invent or silently rewrite the requested outcome.

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
- Checks performed by repository tools, AI, and humans

## Presentation

- Use one descriptive title and a logical heading hierarchy. Do not create empty headings or skip heading levels for visual styling.
- Prefer prose and short lists. Use numbered lists only when order matters.
- Use a table only when readers must compare genuinely two-dimensional data by rows and columns. Keep long explanations out of table cells.
- Separate sourced facts, analysis, human decisions, proposals, and unresolved uncertainty so readers can distinguish them.
- Link to the owning document instead of copying the same requirement, decision, evidence, or guidance into multiple files.
- Do not add YAML, IDs, status fields, or other metadata unless a current tool or review process consumes them.

## `requirements.md`

### Purpose and ownership

`requirements.md` states what the human wants. The human owns its wording and ordering and may create or rewrite the file at any time.

When a design package is needed and `requirements.md` does not exist, AI may create a minimal initial version from the current request. Include only the explicitly stated intended outcome, conditions that must remain true, observable completion evidence, and user-stated unresolved questions. Exclude instructions about tools or workflow unless they constrain the requested result. Do not infer features, constraints, evidence, or decisions.

Keep the initial version easy to revise. Omit unsupported sections instead of adding empty headings, placeholders, or guessed content. Review missing required information immediately after creation. Missing information blocks only the research, planning, or implementation that depends on it. Continue unaffected work when the explicit request provides a sufficient baseline.

After the initial version exists, AI may identify gaps and propose exact changes, but it may edit the file only when the human explicitly requests a change or approves the wording to apply.

### Required information

- The intended outcome
- Conditions that must be true
- Observable evidence that will show the work is complete
- Unresolved questions that would change the requested behavior, if any.

Include protected behavior, exclusions, inputs, environment, or product constraints only when they affect the work. A human may express this information in plain sentences without YAML, tables, IDs, formal scenarios, or technical terminology.

An AI-created initial version may be incomplete because the request did not state every required item. Mark the missing criteria as `needs revision` or `needs human input`. Do not fill them by inference merely to make the document pass review.

### Prohibited content

- AI-inferred requirements presented as human requirements
- Unverifiable completion language without observable evidence
- Implementation choices presented as required outcomes when the human did not require that implementation
- Instructions added only to make an existing implementation appear compliant.

Requirement IDs are optional. Add them only after repeated exact quotations become unclear or error-prone. Until then, derived documents identify requirements with an exact excerpt and its section.

### Review

AI reads the entire file and checks for ambiguity, contradiction, missing completion evidence, unverifiable wording, and unanswered behavior-changing questions. Findings stay in the conversation unless preserving them serves a durable need. AI must not mark human intent as valid on the human's behalf.

Before research or planning continues, AI separates findings into blocking questions, optional suggestions, factual research questions, and decisions that require human judgment.

## `references/*.md`

### Creation condition

Create a reference document when factual research or repository evidence will be reused after the current conversation. Keep a small fact check in the conversation when no durable handoff is needed.

### Required information

- The question being investigated
- The exact requirement excerpt or work context that made the research necessary
- Sources and the dates or revisions reviewed
- Facts supported directly by those sources
- Conclusions derived from comparing the evidence
- Limitations, conflicts, and unresolved uncertainty
- The effect on requirements, decisions, or planning.

When external claims materially affect the work, prefer current official documents, standards, and source repositories, and cross-check the claims with independent primary sources. When external guidance differs from the current repository, describe the difference instead of presenting either one as automatically correct.

### Prohibited content

- Unsupported claims presented as sourced facts
- Analysis presented as a human decision
- New requirements that the human did not approve
- Source lists that do not show which claims they support.

## `decisions/*.md`

### Creation condition

Create a decision record only for a choice that materially affects the work and must remain understandable later. A human decides. AI may prepare options and record the approved result.

### Required information

- The question that required a decision
- The requirement excerpts the decision must satisfy
- The material options actually considered
- The human-approved decision and its reasoning
- Expected consequences and plan impact
- Conditions that would justify revisiting or superseding the decision.

A proposed option is not an accepted decision. If a decision changes the requested outcome, the human updates `requirements.md` before affected work resumes.

### Prohibited content

- AI recommendations presented as human approval
- Invented approval evidence
- A broader or narrower decision than the wording the human approved
- A decision that silently overrides `requirements.md`.

## `plan.md`

### Creation condition

Create `plan.md` after behavior-changing ambiguities and required human decisions are resolved and the work needs an execution plan. Small research-only packages do not need a plan.

### Required information

- The `requirements.md` revision used as the baseline
- Exact requirement excerpts mapped to work units
- Dependencies and execution order where order matters
- Observable verification for each work unit
- Unresolved blockers and explicit stop conditions
- The specific applicable files under `docs/dev/` and the revision reviewed when later changes could alter execution.

The plan may choose implementation steps, but it must not invent product behavior. Every required outcome and protected behavior must be covered by work and verification or identified as blocked.

### Prohibited content

- New requirements disguised as implementation work
- Assumptions presented as resolved facts
- Vague completion statements such as "test it" or "review it" without naming the evidence
- A completion claim based only on documents rather than the actual implementation and verification results.

## Validation

Use the cheapest reliable check for each property.

- Repository checks, when implemented, verify file placement, required files, empty files or directories, unresolved placeholders, and repository-relative links.
- AI checks required information, ambiguity, contradictions, evidence support, requirement coverage, and readability.
- Humans confirm intended requirements, answer behavior-changing questions, approve decisions, and judge product meaning or trade-offs that tools cannot decide.

AI reports each applicable criterion as `pass`, `needs revision`, `needs human input`, or `not applicable`. Every result includes a short quotation or file location as evidence. If evidence cannot be found, AI says so instead of inferring missing content. Review and rewriting are separate actions. AI does not silently repair a document while grading it.

Documentation explains intent and evidence. It does not prove that an implementation complies. Use lint, type or schema checks, tests, runtime or browser checks, and human review for implementation verification.

## Requirement Changes During Work

1. The human changes `requirements.md`. Chat-only changes are not durable requirements.
2. AI compares the updated file with the baseline recorded in `plan.md`.
3. AI identifies affected references, decisions, work units, and verification methods using exact excerpts.
4. Affected work pauses. unaffected work may continue when it still satisfies the updated wording.
5. AI updates derived documents and the recorded baseline before affected work resumes.

Do not restart all work automatically, and do not rewrite requirements to match work already completed.

## When to Add More Structure

- Add requirement IDs when repeated exact quotations become unclear.
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
- [OpenAI: Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recommends task-specific criteria, automated scoring where possible, and calibration with human judgment.
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) recommends deterministic checks where possible, model review where necessary, and human calibration for subjective judgments.
- [Anthropic: Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) recommends progressive disclosure and adding instructions from observed failures instead of anticipating every case.
- [NASA: How to write a good requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/) recommends necessary, consistent, implementation-free, and verifiable requirements.
- [W3C: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/) and the [Google developer documentation style guide](https://developers.google.com/style/tables) support descriptive heading structure and reserving tables for genuinely tabular information.
