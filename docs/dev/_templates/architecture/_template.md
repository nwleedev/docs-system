# <Architecture Guidance Title>

## Target Repository Evidence

| Field | Evidence |
| --- | --- |
| Repository purpose | <repo-relative paths checked> |
| Source layout | <folders and module boundaries checked> |
| Existing architecture docs | <paths or not found after checking paths> |
| Tests or verification commands | <commands and source paths> |
| Constraints | <legacy/generated/external constraints> |

## Purpose

Explain the structural rule this document teaches and why it is needed in this target repository.

## Applies To

- <feature/module/runtime boundary this rule governs>

## Does Not Apply To

- <cases that should use engineering, domain, evolution, or decisions instead>

## Repository Baseline

| Evidence | Finding | Classification |
| --- | --- | --- |
| <repo-relative path> | <observed structure> | <Current Rule / Local Constraint / Open Question> |

## Source Evidence

| Source | Claim Used | Local Applicability | Recoverability Caveat |
| --- | --- | --- | --- |
| <repo path or stable URL> | <claim> | <why this applies to the target repository> | <tracked / recoverable / volatile> |

## Classification

- Current guidance status: <Current Rule / Local Constraint / Open Question>
- Reason: <why this classification is justified by target-repository evidence>

## Scenario Coverage

| Scenario | Boundary Risk | Required Example |
| --- | --- | --- |
| <scenario> | <ownership/import/runtime risk> | <best/anti pair or no-example rationale> |

## Pattern Pairs

### Best Pattern: <name>

```ts
// Replace with target-repository code or concise pseudo-code grounded in target evidence.
```

- Why this is best: <explain ownership, dependency direction, and review surface.>
- Applies when: <conditions that make this pattern valid.>
- Impact: <maintenance, runtime, or review impact.>
- Target-repository constraints: <constraints from repository evidence.>
- Verification: <test, static check, or review check.>

### Anti-Pattern: <name>

```ts
// Replace with target-repository code or concise pseudo-code grounded in target evidence.
```

- Why this is an anti-pattern: <explain the boundary violation or hidden coupling.>
- Failure mode: <what breaks or becomes harder to review.>
- Impact: <user-visible, runtime, maintenance, or migration impact.>
- Safer alternative: <link or describe the best pattern.>
- Target-repository constraints: <why the target repository makes this risky.>
- Verification: <how a reviewer detects this problem.>

## Open Questions

| Question | Why It Is Not A Current Rule Yet | Follow-Up |
| --- | --- | --- |
| <question> | <missing evidence> | <next step> |

## Verification

- <test, static check, architecture review, dependency graph check, or manual audit>

## Completion Check

- [ ] Target Repository Evidence is complete or missing evidence is explicitly classified.
- [ ] Scenario Coverage appears before examples.
- [ ] Every scenario maps to an example pair or no-example rationale.
- [ ] Best and anti-pattern explanations are understandable to a first-time reader.
- [ ] Sources use repo-relative paths or stable URLs.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
