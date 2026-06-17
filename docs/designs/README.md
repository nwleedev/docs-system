# Design Document Governance

This directory stores durable requirements, research, plans, decisions, traceability, and completion evidence for product and engineering work. Its purpose is to keep future work from silently shrinking the original request, losing research evidence, or claiming completion without requirement-level proof.

## Core Rules

- Preserve the user's requested scope until a documented decision changes it.
- Do not replace "all", "each", "minimum", "must", or "cross-validated" with a narrower interpretation.
- Separate requirements, research, decisions, plans, traceability, and completion evidence.
- Use repo-relative paths in all documents.
- Keep sensitive values, private URLs, and unsanitized logs out of committed documents.
- Prefer the smallest artifact set that still proves the requirement can be planned, implemented, reviewed, and audited.
- Distinguish a local draft from a committed deliverable. A file that is ignored, generated-only, external-only, or not reproducible is not completion evidence unless an accepted decision defines that delivery mechanism.
- Treat an existing design package as a baseline. New requests amend, clarify, supersede, conflict with, or defer parts of that baseline; they do not replace it silently.

## Recommended Package Layout

Use this layout for new design packages when the work needs durable documentation.

```text
docs/designs/
  README.md
  _templates/
  <topic>-<yyyymmdd>-<short-random>/
    requirements.md
    research/
      README.md
      0001-record-research-topic.md
    plan.md
    traceability.md
    completion-audit.md
    decisions/
      README.md
      0001-record-important-decision.md
```

The package does not need every file for every task. Add files when they carry evidence that another artifact should not own.

| Artifact              | Owns                                                                                              | Does Not Own                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `requirements.md`     | What must be true, scope boundaries, success criteria, acceptance examples.                       | Implementation order, exhaustive source notes, completion claims. |
| `research/README.md`  | Research index, statuses, supported requirements, links to research records.                      | Detailed evidence or final completion status.                     |
| `research/*.md`       | One research question, evidence set, cross-validation result, finding, impact, and gaps.          | Multiple unrelated research questions.                            |
| `plan.md`             | How requirements become implementation units and verification steps.                              | New product scope, unapproved scope cuts.                         |
| `traceability.md`     | Links from requirements to sources, decisions, plan units, verification, and completion evidence. | Long explanations or raw logs.                                    |
| `completion-audit.md` | Final requirement-by-requirement evidence and remaining gaps.                                     | Future plans or speculative improvements.                         |
| `decisions/README.md` | Decision index, statuses, links, revisit triggers.                                                | Full rationale for large decisions.                               |
| `decisions/*.md`      | One significant decision, its context, options, outcome, consequences, and supersession history.  | Multiple unrelated decisions.                                     |

## Package Naming And Creation

Create application or product requirements under `docs/designs/<topic>-<yyyymmdd>-<short-random>/`. This README is the durable package governance source when an agent, contributor, or repository does not provide a separate `AGENTS.md` or equivalent instruction file.

Use this naming policy for every new design package:

- `<topic>` is a short, repo-neutral, kebab-case description of the product area or workstream. It should be specific enough to identify the requested scope without embedding private task IDs or implementation-only details.
- `<yyyymmdd>` is the package creation date. Do not change it later to make a package look newer.
- `<short-random>` is a short collision-avoidance suffix. Keep it stable once the package exists.
- The full folder name is the package identifier. Do not rename or recreate a reviewed package silently; use amendments, supersession, or decision records when the scope changes.

Start from `requirements.md` for new requirements work. Do not use package naming, a smaller template, or an external source reference as a reason to shrink the request. If the request is broad, create the supporting artifacts needed to preserve and audit the scope instead of compressing the requirements.

Do not attempt to complete a requirements package in one unreviewed pass when the request contains unresolved product, technical, security, data, dependency, API, or existing-behavior choices. Classify such choices before continuing:

- `Deferred Decision`: The choice does not change requirement meaning and is easy to revisit. Record the context, chosen default, alternatives, risk, and revisit trigger in the package.
- `Blocking Decision`: The choice affects product behavior, security or permissions, data retention, public API, dependencies, technology stack, existing feature removal or replacement, or an accepted design. Stop before implementation and ask for an accepted direction.

Keep requirement-specific decisions inside the same design package, normally in `decisions/README.md` and `decisions/*.md`. Do not move those records into shared development guidance such as `docs/dev`, because the rationale belongs to the requirement baseline that created it.

When a requirements package is created or materially changed, make it ready for normal Git review. A package that only exists as an ignored local draft, generated output, external document, or private note is not durable completion evidence unless an accepted decision defines that delivery mechanism.

## Artifact Persistence

Requirements and plans must say how important artifacts survive after the session. Do not treat "the file exists locally" as enough when the requested outcome depends on future agents, reviewers, CI, or another repository seeing the artifact.

Use these persistence states when planning and auditing artifacts:

| State               | Meaning                                                                     | Completion Rule                                                                  |
| ------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Tracked`           | The artifact is committed or ready to commit through normal Git tracking.   | Can prove completion when the content and verification match the requirement.    |
| `Ignored Local`     | The artifact exists under a gitignored path.                                | Cannot prove completion unless an accepted decision defines a non-Git handoff.   |
| `Generated`         | The artifact is produced from committed source or a documented command.     | Completion requires the source, command, and expected output contract.           |
| `External`          | The artifact lives outside the repository, such as a service, package, doc. | Completion requires a stable reference, access expectation, and ownership model. |
| `Not Created`       | The artifact is planned or required but absent.                             | Completion is missing or blocked.                                                |
| `Decision Required` | The persistence state changes requirement meaning or repository policy.     | Stop implementation and create or update a decision record before proceeding.    |

For any required artifact, record the expected persistence state in `requirements.md` or `plan.md`. Verify the actual state with current repository evidence such as `git status --porcelain`, `git status --porcelain --ignored`, `git check-ignore -v <path>`, generated-output commands, or external references.

## Source Material Handling

When source material shapes requirements, classify how future reviewers can recover it before writing the requirements body. Do not let a requirement depend only on a source that may disappear, be ignored by Git, require private access, or be too broad to re-check quickly.

Use these source material classes:

| Source Class             | Examples                                                       | Required Handling                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tracked Source`         | Repo-tracked Markdown, fixtures, specs, exported evidence.     | Link the repo-relative path, summarize the claim used, and map source segments to requirements when the source creates coverage obligations.                                           |
| `Local/Ephemeral Source` | Local PDFs, uploaded files, generated extracts, ignored files. | Reconstruct the requirement-relevant content in `requirements.md` or `research/`, record coverage by page/section/segment, and audit that the package works without the original file. |
| `Restricted Source`      | Private docs, access-controlled systems, private tickets.      | Sanitize sensitive details, record the claim used and access expectation, and make the requirement self-contained enough for authorized reviewers to proceed.                          |
| `Recoverable Web Source` | Public web URLs, official docs, public standards pages.        | Keep URL, publisher, accessed date, claim used, and quality notes. Do not copy full web pages into requirements; summarize only the claim needed for traceability.                     |

For `Local/Ephemeral Source` and `Restricted Source`, the design package must be self-contained enough that a planner can understand the requirement and a reviewer can audit source coverage without reopening the original source. This does not require copying every word; it requires reconstructing every requirement-relevant obligation, screen, flow, rule, data expectation, constraint, and exception that the source contributed.

For `Recoverable Web Source`, the source can remain external when the URL is public and reasonably stable. Still record the specific claim used, because web content can move, change, or become hard to preserve. If a web source is unstable, access-controlled, or used as the only evidence for a broad requirement, treat it like `Restricted Source` or record a decision explaining the handoff.

## Implementation-Time Decision Boundaries

Implementation can reveal conflicts that were not visible during brainstorming or planning. Treat these as decision boundaries, not as ordinary audit gaps.

Stop and create or update a decision record before continuing when any of these is true:

- A planned artifact path is ignored, generated-only, outside the repository, or otherwise not commit-ready.
- Satisfying the plan requires force-adding ignored files, changing `.gitignore`, adding a Git ignore exception, moving the source of truth, or creating a new delivery mechanism.
- A verification command proves only a local draft, but the requirement asks for a durable or reusable deliverable.
- The implementation needs a new dependency, script, hook, CI job, deployment step, security exception, or public API change that the requirements did not accept.
- A completion claim would depend on a `Partial`, `Unverified`, local-only, or non-reproducible artifact.

Record the decision as `Proposed` when no option has been accepted yet. Do not change the requirement, plan, or final verdict to make the unresolved option look accepted.

## Artifact Selection

Start every durable requirements package from the same `requirements.md` template. Do not choose a reduced requirements template, because the label can become a reason to omit scope preservation.

Add supporting artifacts when the request needs them.

| Condition                                                                                                   | Add                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Sources shaped the requirement or need cross-validation.                                                    | `research/README.md` and one or more research records                                       |
| Research evidence spans several source types.                                                               | Keep the evidence in the same research record and classify each source with a `Type` column |
| The work needs implementation sequencing.                                                                   | `plan.md`                                                                                   |
| Completion cannot be proven by reading one small diff.                                                      | `traceability.md`                                                                           |
| The request contains "all", "each", "minimum N", "cross-validate", "audit", or "do not shrink" constraints. | `traceability.md` and `completion-audit.md`                                                 |
| The work makes or changes a durable decision.                                                               | `decisions/README.md` and a decision record when needed                                     |
| Required artifacts may be ignored, generated, external, or delivered outside normal Git tracking.           | `decisions/README.md`, a decision record, `traceability.md`, and `completion-audit.md`      |

## Scope Preservation

Before writing or changing a requirements document, identify the phrases that create coverage obligations. Examples include:

- "all documents"
- "each API"
- "minimum five examples"
- "research and cross-validate"
- "do not arbitrarily narrow"
- "new files only"
- "existing behavior must remain"

For each phrase, write a matching requirement and decide how completion will be proven. If the proof requires more than a simple review, create `traceability.md` and `completion-audit.md`.

## Plan Organization

Use `docs/designs/<topic>-<yyyymmdd>-<short-random>/plan.md` as the default and preferred home for implementation planning tied to a design package. Do not create a separate `docs/plans` entry for work that belongs to an existing design package.

When planning grows, keep it in the same `plan.md` by using:

- `Plan Amendments` to record new, modified, deferred, superseded, or removed plan scope.
- `Implementation Units` to split work into independently reviewable units.
- `Verification` rows to keep each unit tied to observable evidence.
- `traceability.md` to connect requirements, plan units, verification, and completion evidence.

Use a separate plan location only when the plan is repo-wide, operational, or not owned by a specific design package. If a design package appears to require multiple independent plan files, first record why a single `plan.md` would lose traceability or become unreviewable, then add or update a decision record before creating a new plan structure.

## Existing Package Updates

When updating an existing design package, do not start by rewriting the document body. First inspect the current package inventory and record how the new request affects the existing baseline.

Check these artifacts when they exist:

- `requirements.md`: original scope, stable requirement IDs, amendments, deferred items, out-of-scope items, and required artifacts.
- `plan.md`: active, completed, deferred, superseded, or removed plan units and their verification coverage.
- `decisions/README.md` and `decisions/*.md`: accepted, proposed, deferred, superseded, partially superseded, and partially restored decisions.
- `traceability.md`: requirement-to-research, requirement-to-decision, requirement-to-plan, requirement-to-verification, and requirement-to-audit mappings.
- `completion-audit.md`: current verdicts, known gaps, and evidence that should remain valid after the update.
- `research/` records: external documents, local evidence, runtime observations, standards, user constraints, and gaps that support the current scope.

Classify the new request before changing requirements, plans, decisions, or audit claims:

| Change Type  | Meaning                                                                                   | Required Handling                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Adds`       | Introduces new scope without changing earlier meaning.                                    | Add new requirement IDs, plan units, verification rows, and traceability rows while preserving existing IDs.        |
| `Clarifies`  | Makes existing meaning more precise without changing obligation or behavior.              | Update wording carefully, record affected IDs, and verify that acceptance examples and audit evidence still match.  |
| `Supersedes` | Replaces an earlier requirement, decision, plan unit, or verification expectation.        | Keep the earlier item visible, add or update a decision record, and link old and new items through traceability.    |
| `Conflicts`  | Cannot coexist with accepted scope, decisions, persistence policy, or verification gates. | Stop before implementation, mark the decision as `Proposed`, and keep affected completion claims unresolved.        |
| `Backlog`    | Captures valid future scope that is not part of the active plan.                          | Keep it visible in requirements and traceability, but exclude it from active completion gates with a recorded note. |

Do not delete, renumber, or rewrite existing requirement IDs, plan units, decisions, research findings, or audit rows just because a newer request is easier to describe from scratch. If an item is no longer valid, mark it as superseded, deferred, rejected, or removed by decision and link the replacement.

## Requirement Amendments

When a user adds requirements after a package already has a `requirements.md`, treat the update as an amendment, not as a silent rewrite. The purpose is to preserve earlier scope while making the new scope visible.

Use this flow before editing the requirements body:

1. Identify the preserved requirements, decisions, plan units, verification rows, research records, and audit rows that must remain true.
2. Classify the new request as `Adds`, `Clarifies`, `Supersedes`, `Conflicts`, or `Backlog`.
3. Add a `Requirement Amendments` entry that records preserved IDs, new IDs, modified IDs, superseded IDs, affected sections, decision needs, plan impact, traceability impact, and audit impact.
4. Update or add requirements without changing the historical meaning of reviewed text. If meaning changes, record a superseding decision instead of making the old text look as if it always meant the new thing.
5. Update `plan.md` so existing plan units are preserved, modified, deferred, superseded, or removed by decision before adding new units.
6. Update `traceability.md` so the new requirement set and preserved requirement set both map to research, decisions, plan units, verification, artifact persistence, and completion evidence.
7. Update `completion-audit.md` so the audit covers preserved requirements and amendments, not only the latest request.

Use a decision record when an amendment changes product behavior, security, data retention, public API, dependencies, testing strategy, documentation governance, or the meaning of an accepted requirement.

Do not use a reusable skill, script, or template update as the owner of this rule. The durable rule lives here and in `_templates`; tools may consume it but must not replace it.

## Research And Evidence Management

Use `research/` records as the default home for collected evidence. A research record answers one primary question and can include external documents, local code, Git history, runtime evidence, standards, and user constraints in the same file.

```text
research/
  README.md
  0001-record-research-topic.md
  0002-record-research-topic.md
```

Record source entries with enough detail for another person or agent to re-check the claim.

| Source Type               | Record In                                    | Required Details                                                                                              |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| External web document     | `research/<record>.md`                       | URL, publisher, accessed date, claim used, quality notes, recoverability caveat when relevant.                |
| Official library/API docs | `research/<record>.md`                       | Version or date when available, API or rule verified, migration caveat.                                       |
| Local or ignored document | `requirements.md` and `research/<record>.md` | Repo-relative or described location, page/section coverage, claim used, and self-contained reconstruction.    |
| Restricted source         | `requirements.md` and `research/<record>.md` | Sanitized source description, access expectation, claim used, and self-contained reconstruction.              |
| Local code                | `research/<record>.md`                       | Repo-relative file path, symbol or behavior inspected, command used.                                          |
| Git history               | `research/<record>.md`                       | Commit hash or range, command used, decision or pattern inferred.                                             |
| Runtime evidence          | `research/<record>.md`                       | Environment, command, URL or route, observed behavior, screenshot/log location if sanitized.                  |
| Test or lint output       | `completion-audit.md`                        | Command, result, scope covered, caveats. Link to research records when the test informed a finding.           |
| User constraint           | `requirements.md` or `research/<record>.md`  | Source request, affected IDs, preserved scope, and whether the constraint is active, superseded, or deferred. |

Do not use raw terminal dumps as proof when a concise observation is enough. Summarize the evidence and include the reproducible command.

## Cross-Validation Standard

Research-backed requirements should use at least two independent evidence types when practical.

- External official documentation plus local code confirms whether a recommended pattern fits this project.
- External standard guidance plus runtime evidence confirms whether a UX or accessibility requirement is measurable.
- Local code plus tests confirms whether a behavior is already present before planning changes.
- Decision records explain why a chosen path won over credible alternatives.

When sources disagree, record the disagreement instead of silently choosing the convenient source.

## Decisions

Use `decisions/README.md` as the decision log for a package. Add a separate decision record when any of these is true:

- The choice changes architecture, dependencies, security, data retention, public API, testing strategy, or documentation governance.
- The choice changes artifact persistence, source of truth, commitability, generated-output ownership, or delivery mechanism.
- The choice supersedes an earlier decision.
- The choice resolves a blocking decision or a user-approved trade-off.
- Future contributors will need the rationale, not just the outcome.

Decision records are append-or-supersede artifacts. Do not rewrite an accepted decision to hide previous reasoning. Create a new record or mark the old one as superseded.

Decision statuses must show the current relationship to the baseline:

- `Proposed`: likely direction, not yet accepted.
- `Accepted`: current source of truth.
- `Deferred`: intentionally left for a later phase.
- `Rejected`: considered and not selected.
- `Superseded`: fully replaced by a later decision.
- `Partially Superseded`: some scope was replaced, but preserved scope remains active.
- `Partially Restored`: a later decision restored part of a previously superseded scope.

## Traceability

Create `traceability.md` when completion cannot be proven by reading one small diff. Traceability should map:

- requirement to source evidence
- requirement to decision
- requirement to plan unit
- requirement to artifact persistence
- requirement to verification
- requirement to completion evidence

Traceability is not a substitute for good requirements. It is the table that prevents broad requirements from being satisfied by narrow checks.

When an existing package is updated, traceability should show both sides of the change: what the new request adds or changes, and which earlier requirements, decisions, plan units, verification rows, and audit evidence remain valid.

## Completion Audit

Create `completion-audit.md` when the work has broad coverage, cross-validation, or explicit auditability needs. The audit must inspect current evidence, not intent or memory.

For each requirement, record:

- the exact requirement
- expected evidence
- inspected evidence
- whether required artifacts are tracked, ignored, generated, external, missing, or covered by an accepted decision
- verdict: `Pass`, `Fail`, `Partial`, `Unverified`, or `Not Applicable`
- gaps and follow-up

Only mark a package complete when every required item is `Pass` or a justified `Not Applicable`.

## Template Selection

Use the templates in `docs/designs/_templates/` as starting points.

| Need                            | Template                            |
| ------------------------------- | ----------------------------------- |
| Requirements document           | `_templates/requirements.md`        |
| Implementation plan             | `_templates/plan.md`                |
| Research index                  | `_templates/research/README.md`     |
| Research record                 | `_templates/research/_template.md`  |
| Requirement traceability matrix | `_templates/traceability.md`        |
| Completion evidence             | `_templates/completion-audit.md`    |
| Decision index                  | `_templates/decisions/README.md`    |
| Individual decision record      | `_templates/decisions/_template.md` |

## Sources

- Atlassian describes user stories as carrying the user perspective and acceptance criteria, which makes requirements testable: https://www.atlassian.com/agile/project-management/user-stories
- Atlassian describes Definition of Done as a shared completion standard for product increments: https://www.atlassian.com/agile/project-management/definition-of-done
- GitHub documents README files as a way to communicate important project information and expectations: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub documents issue and pull request templates as a way to standardize information contributors provide: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates
- ADR guidance defines decision records and decision logs for recording context and consequences: https://github.com/architecture-decision-record/architecture-decision-record
- Diataxis separates documentation by user need, supporting the separation of requirements, guides, reference, and explanation: https://diataxis.fr/
- Jama describes traceability as following requirements, design, code, tests, and defects across the lifecycle: https://www.jamasoftware.com/requirements-management-guide/requirements-traceability/what-is-traceability/
- NASA describes requirements management as managing requirement baseline changes across the lifecycle while maintaining bidirectional traceability: https://www.nasa.gov/reference/6-2-requirements-management/
- ISO/IEC/IEEE 29148:2018 is the requirements engineering standard for systems and software lifecycle processes: https://www.iso.org/standard/72089.html
- Microsoft Architecture Center recommends append-only ADR history where changed decisions supersede earlier records instead of rewriting them: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record
- Microsoft Engineering Fundamentals Playbook describes common documentation failures such as hidden, incomplete, obsolete, and unrecorded decisions: https://microsoft.github.io/code-with-engineering-playbook/documentation/
