# <Evolution Proposal Title>

> Status: Not Current Rule

## Target Repository Evidence

| Field | Evidence |
| --- | --- |
| Current docs checked | <paths or not found after checking paths> |
| Current code/config/test baseline | <repo-relative paths> |
| Existing decision records | <paths or not found after checking paths> |
| Verification commands | <commands available for migration proof> |
| Constraints | <legacy/generated/external/release constraints> |

## Purpose

Explain why this future proposal exists and what current limitation it addresses.

## Scope

- Applies to: <future migration, alternative, technical debt, or proposed pattern scope>
- Does not apply to: <current rules or code changes that should not use this proposal yet>

## Current Constraint

Describe what is true today and why it cannot be changed silently.

## Proposed Direction

Describe the future pattern, migration, or alternative.

## Does Not Apply Yet

- <where this proposal must not be applied as current guidance>

## Evidence

| Evidence | Finding | Classification |
| --- | --- | --- |
| <repo-relative path or stable URL> | <finding> | <Recommended Future Pattern / Deferred / Open Question> |

## Linked Development Guidance Targets

| Target | Decision Point | Risk | Repository Evidence | Classification | Confidence |
| --- | --- | --- | --- | --- | --- |
| <development guidance target> | <future choice or migration decision> | <risk> | <repository evidence path or row> | <Recommended Future Pattern / Deferred / Open Question / Local Constraint> | <High / Medium / Low> |

## Source Evidence

| Source | Claim Used | Local Applicability | Recoverability Caveat |
| --- | --- | --- | --- |
| <repo path or stable URL> | <claim> | <why this supports the future proposal for the target repository> | <tracked / recoverable / volatile> |

## Classification

- Current guidance status: Not Current Rule
- Proposal status: <Recommended Future Pattern / Deferred / Open Question>
- Reason: <why this is not current guidance yet>

## Scenario Coverage

| Scenario | Migration Risk | Proof Needed |
| --- | --- | --- |
| <scenario> | <risk> | <test/browser/review proof> |

## Proposed Pattern And Current Anti-Pattern

### Proposed Pattern: <name>

```ts
// Optional proposed code shape. Do not treat as current rule until promoted.
```

- Why this would be better: <explain the future benefit.>
- Applies after: <decision, migration, test coverage, or dependency condition.>
- Impact: <maintenance, correctness, performance, or user impact.>
- Verification needed: <proof before promotion.>

### Current Constraint Or Anti-Pattern: <name>

```ts
// Optional current code shape or pseudo-code.
```

- Why this remains constrained: <explain current risk and why immediate replacement is unsafe.>
- Failure mode if changed now: <what could break.>
- Safer migration step: <behavior-preserving step.>
- Rollback condition: <when to stop or revert the migration.>

## Promotion Criteria

- <decision, tests, browser proof, rollout condition, or migration completion needed>

## Revisit Trigger

- <specific condition that should reopen this proposal>

## Verification

- <migration test, behavior-preservation proof, browser check, rollback check, or manual audit>

## Completion Check

- [ ] The document visibly says it is not current rule.
- [ ] Linked development guidance targets are classified and grounded in repository evidence.
- [ ] Current constraint, proposed direction, migration risk, rollback, and promotion criteria are present.
- [ ] Unsupported claims are open questions, not current rules.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
