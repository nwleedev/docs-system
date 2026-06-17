# Classify Missing Guidance Without Stack Coupling

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Related Amendment: A0
- Supersedes: None
- Superseded By: None
- Preserves: R4-R9
- Replaces: None

## Context

The documentation system must help agents avoid known anti-patterns before code exists, but the portable `docs/dev` root README and templates must not become a React, TypeScript, Zustand, React Hook Form, or any other stack-specific template system. The current governance already separates repository evidence from current rules, so the missing piece is a stack-neutral way to detect and classify guidance gaps.

## Requirement Change Classification

- Related Amendment: A0
- Change Type: Initial
- Preserved Requirement IDs: R4-R9
- New Requirement IDs: R1-R11
- Modified Requirement IDs: None
- Superseded Requirement IDs: None
- Preserved Requirement Scope: Portable governance, repository evidence separation, and current-rule evidence requirements remain active.
- Superseded Requirement Scope: None.
- Plan Impact: U1-U4 must preserve stack-neutrality and add a guidance gap mechanism.
- Traceability Impact: Requirements must map to local evidence, external research, and future verification.
- Completion Audit Impact: Audit must prove no stack-specific dependency is introduced by this design package.
- Migration Required: Future implementation must update `docs/dev/README.md` and `docs/dev/_templates/**`; this package does not implement those changes.

## Decision Drivers

- Portable governance must work across repositories with different stacks.
- Missing guidance should be visible before implementation starts.
- Current rules must still require target repository evidence.
- Official library documentation can support recommended future patterns, but cannot become universal current guidance.
- Automation may be useful later, but adding scripts, CI, or dependencies is outside this package.

## Considered Options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| A | Keep templates unchanged and manage repeated prompts outside the repository. | No repository changes. | Does not prevent mistaken assumptions or make missing guidance visible. |
| B | Add stack-specific template packs for known stacks. | Strong guidance for known stacks. | Violates the stack-neutral requirement and creates maintenance burden. |
| C | Add a stack-neutral concern inventory and classification model. | Makes gaps visible, preserves target evidence rules, supports pre-code recommended patterns. | Requires more careful template wording and audit discipline. |

## Decision

Choose Option C. Future implementation should add a stack-neutral concern inventory and classification model to root governance and templates. It should describe concern categories, evidence sources, and classification states instead of hard-coding specific technologies as required defaults.

## Consequences

- Missing guidance can be recorded before code is written.
- Similar repositories can be compared by concern coverage without assuming identical stacks.
- Current rules remain evidence-based and target-repository-specific.
- Stack-specific examples must be optional and clearly marked as examples.
- Automated scorecards or static checks require a later decision.

## Confirmation

The implementation plan and completion audit must check that future edits to `docs/dev/README.md` and `docs/dev/_templates/**` use stack-neutral concern categories and do not require any named stack to function.

## Revisit Trigger

- A future request asks for shared template packs for a named stack.
- A future implementation proposes scripts, CI checks, scorecards, or dependencies.
- A consumer repository audit shows that stack-neutral categories are too broad to guide implementation.

## Sources

- `docs/dev/README.md`: repository evidence separation and portable governance baseline.
- `docs/dev/_templates/README.md`: current evidence classification baseline.
- `docs/dev/_templates/engineering/README.md`: current stack-specific wording to generalize.
- `docs/designs/README.md`: decision record and traceability requirements.
- Spotify Engineering Golden Paths article: supported path and fragmentation-reduction model.
- Cortex scorecard examples: visible missing-practice checks.
