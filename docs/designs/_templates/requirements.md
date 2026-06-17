---
title: <Requirement Title>
date: <YYYY-MM-DD>
status: draft
---

# <Requirement Title>

## Summary

State the durable outcome, not the implementation plan. Do not describe a smaller version unless a documented decision has narrowed the scope.

## Problem Frame

Explain the situation, risk, current workaround, and why this work is needed. If a smaller interpretation would fail the request, say so here.

## Scope Preservation

Record every phrase that creates a coverage obligation before writing detailed requirements.

| Request Phrase                                 | Coverage Obligation    | Forbidden Narrowing                 | Completion Proof    |
| ---------------------------------------------- | ---------------------- | ----------------------------------- | ------------------- |
| <all / each / minimum / cross-validate / must> | <what must be covered> | <what would be an invalid shortcut> | <evidence required> |

If no explicit coverage phrase exists, write `No broad coverage phrase found` and still define the observable scope in Requirements.

## Existing Package Inventory

Use this section when updating an existing design package. For a new package, write `Not applicable - initial requirements`.

| Artifact              | Current State                                  | Must Preserve                         | Update Needed                              |
| --------------------- | ---------------------------------------------- | ------------------------------------- | ------------------------------------------ |
| `requirements.md`     | <Original scope, IDs, amendments, boundaries.> | <Requirement IDs and accepted scope.> | <New IDs, clarifications, supersessions.>  |
| `plan.md`             | <Active, completed, deferred plan units.>      | <Plan units that remain valid.>       | <Plan amendments or new units.>            |
| `decisions/`          | <Accepted, proposed, superseded decisions.>    | <Decisions or rationale still valid.> | <New, superseding, or restoring decision.> |
| `traceability.md`     | <Existing mappings or missing file.>           | <Mappings that remain valid.>         | <Rows to add, modify, defer, or audit.>    |
| `completion-audit.md` | <Verdicts and gaps.>                           | <Evidence that remains valid.>        | <Audit rows to add or reopen.>             |
| `research/`           | <Evidence records and gaps.>                   | <Findings that remain valid.>         | <New research or supersession.>            |

## Requirement Amendments

Use this section whenever this document is updated after the initial requirements draft. For a new document, keep the initial row so future updates can distinguish original scope from later scope.

| Amendment ID | Date         | Request Source        | Change Type                                           | Preserved Requirement IDs | New Requirement IDs | Modified Requirement IDs | Superseded Requirement IDs  | Affected Sections | Decision Record                           | Plan Impact                            | Traceability Impact                  | Audit Impact           |
| ------------ | ------------ | --------------------- | ----------------------------------------------------- | ------------------------- | ------------------- | ------------------------ | --------------------------- | ----------------- | ----------------------------------------- | -------------------------------------- | ------------------------------------ | ---------------------- |
| A0           | <YYYY-MM-DD> | Initial requirements. | Initial                                               | <None / baseline.>        | R1-Rn               | <None>                   | <None>                      | <Sections.>       | <None / decisions/<record>.md>            | <Initial plan expectations.>           | <Initial traceability expectations.> | <Initial audit scope.> |
| A1           | <YYYY-MM-DD> | <User request/source> | <Adds / Clarifies / Supersedes / Conflicts / Backlog> | <Existing IDs preserved.> | <New IDs.>          | <IDs clarified/changed.> | <IDs replaced by decision.> | <Sections.>       | <None / blocking / decisions/<record>.md> | <Units to add/update/defer/supersede.> | <Rows to add/update.>                | <Rows to add/reopen.>  |

Rules:

- Do not remove or rewrite earlier requirements to make a new request look like the original request.
- If an amendment supersedes earlier meaning, keep the older requirement visible and add a decision record or supersession note.
- If an amendment conflicts with accepted scope, classify it as a blocking decision before planning implementation.
- If an amendment is deferred, keep it in requirements as backlog and exclude it from the active plan's completion gates.
- Keep reviewed requirement IDs stable. Do not renumber existing requirements unless a separate migration note maps old IDs to new IDs.
- Add new requirement IDs for additive scope. Do not reuse an old ID for a new obligation.
- Update Summary, Key Decisions, Requirements, Acceptance Examples, Success Criteria, Required Artifacts, Scope Boundaries, Traceability Requirements, Completion Audit Requirements, and Sources when the amendment affects them.

## Key Decisions

List decisions already made during requirements discovery. Move significant decisions to `decisions/`.

- **<Decision>:** <Outcome and reason.>

## Requirements

Group by concern when more than one concern exists. Keep IDs stable after review.

When updating an existing package:

- preserve existing requirement IDs and wording unless the amendment is a clarification or a recorded supersession;
- add new IDs for new obligations;
- keep superseded requirements visible until a decision record or migration note explains the replacement;
- keep backlog requirements visible but excluded from active completion gates through traceability.

**<Concern Name>**

- R1. <One observable requirement.>
- R2. <One observable requirement.>

**Evidence And Data Management**

- R3. <Requirement for external sources, local code evidence, runtime evidence, or logs when research is part of the request.>
- R4. <Requirement for source quality and cross-validation when claims must be verified.>

**Traceability And Audit**

- R5. <Requirement for traceability coverage when completion cannot be proven by a narrow check.>
- R6. <Requirement for completion audit coverage when the work contains broad coverage, cross-validation, or explicit audit needs.>

## Acceptance Examples

Use examples to remove ambiguity from conditional or broad requirements.

- AE1. **Given** <scope phrase such as "each document">, **when** <the work is audited>, **then** <the audit checks every target and records missing evidence instead of sampling silently>.

## Success Criteria

- <A planner can act without inventing scope.>
- <A reviewer can detect scope shrinkage from the document alone.>
- <A future agent can find source evidence and completion proof.>

## Required Artifacts And Persistence

List every required deliverable that must survive the session. Do not treat an ignored local file as a committed deliverable unless an accepted decision defines that delivery mechanism.

| Artifact                      | Required For | Expected Persistence                                                               | Completion Proof                                                          | Decision Needed                           |
| ----------------------------- | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| `<path or external artifact>` | R1           | <Tracked / Ignored Local / Generated / External / Not Created / Decision Required> | <git status, generated command, external reference, or accepted decision> | <None / blocking / decisions/<record>.md> |

Rules:

- If an artifact path is ignored, generated-only, external-only, or not reproducible, record the expected delivery mechanism before planning implementation.
- If the required persistence conflicts with `.gitignore`, repository policy, security policy, deployment policy, or user constraints, classify it as a blocking decision before planning implementation.
- If a local draft is useful but not a committed deliverable, say so explicitly and do not count it as completion proof.

## Scope Boundaries

**Deferred**

- <May happen later, but not in this package.>

**Out Of Scope**

- <Not part of this requirement's identity.>

## Dependencies And Assumptions

- <Load-bearing dependency or assumption.>

## Research Requirements

- Research must be recorded in `research/README.md` and one or more research records when external sources, local code, runtime evidence, standards, or user constraints shape the requirement.
- Each load-bearing claim must identify the source type and the claim it supports.
- External library, framework, standard, or API claims must be checked against official documentation when available.
- Local behavior claims must be checked against current repo files, commands, runtime observation, or Git history.
- Conflicting evidence must be recorded as a gap or decision, not hidden.

## Traceability Requirements

Create `traceability.md` when the request contains broad coverage language, spans multiple artifacts, requires cross-validation, or needs evidence beyond one narrow review.

When created, map:

- each requirement to source evidence
- each requirement to relevant decisions
- each requirement to plan units
- each requirement to verification commands or review methods
- each requirement to completion audit evidence

## Completion Audit Requirements

Create `completion-audit.md` when completion must be proven requirement by requirement. Before declaring completion, inspect current-state evidence for every requirement and record a verdict.

Allowed verdicts are `Pass`, `Fail`, `Partial`, `Unverified`, and `Not Applicable`.

## Sources

- <Source title or path>: <claim used>.
