# <Engineering Guidance Title>

## Target Repository Evidence

| Field | Evidence |
| --- | --- |
| Technology stack | <package manifests, lockfiles, config files> |
| Source layout | <source paths checked> |
| Existing engineering docs | <paths or not found after checking paths> |
| Verification commands | <test/typecheck/lint/build commands actually present> |
| Constraints | <legacy/generated/external/security constraints> |

## Purpose

Explain the coding or verification rule and the concrete review problem it prevents.

## Applies To

- <code, test, config, generated output, or tooling scope>

## Does Not Apply To

- <cases that should use architecture, domain, evolution, or decisions instead>

## Repository Baseline

| Evidence | Finding | Classification |
| --- | --- | --- |
| <repo-relative path> | <observed code/config/test pattern> | <Current Rule / Local Constraint / Open Question> |

## Source Evidence

| Source | Claim Used | Local Applicability | Recoverability Caveat |
| --- | --- | --- | --- |
| <repo path or official URL> | <claim> | <why this applies to the target repository> | <tracked / recoverable / volatile> |

## Classification

- Current guidance status: <Current Rule / Local Constraint / Open Question>
- Reason: <why this classification is justified by target-repository evidence>

## Scenario Coverage

| Scenario | Risk | Required Example |
| --- | --- | --- |
| <scenario> | <bug/review/maintainability risk> | <best/anti pair or no-example rationale> |

## Pattern Pairs

### Best Pattern: <name>

```ts
// Replace with target-repository code or concise pseudo-code grounded in target evidence.
```

- Why this is best: <explain the technical reason, not just that it is preferred.>
- Applies when: <inputs, lifecycle, ownership, runtime, or test conditions.>
- Impact: <correctness, readability, performance, testability, or maintainability impact.>
- Target-repository constraints: <stack/version/generated/legacy constraints.>
- Verification: <test, lint, typecheck, build, or review check.>

### Anti-Pattern: <name>

```ts
// Replace with target-repository code or concise pseudo-code grounded in target evidence.
```

- Why this is an anti-pattern: <explain the bug, ambiguity, coupling, or review blind spot.>
- Failure mode: <what fails in runtime, tests, build, review, or maintenance.>
- Impact: <who or what is affected.>
- Safer alternative: <link or describe the best pattern.>
- Target-repository constraints: <why this repository makes the anti-pattern risky.>
- Verification: <how to detect and prevent it.>

## Detection Signals

- <grep, lint, test, review, or code-shape signal>

## Open Questions

| Question | Missing Evidence | Follow-Up |
| --- | --- | --- |
| <question> | <paths checked> | <next step> |

## Verification

- <test, lint, typecheck, build, browser check, or manual review>

## Completion Check

- [ ] Target Repository Evidence is complete or missing evidence is explicitly classified.
- [ ] Scenario Coverage appears before examples.
- [ ] Every scenario maps to an example pair or no-example rationale.
- [ ] Best and anti-pattern explanations are understandable to a first-time reader.
- [ ] External claims use official or primary sources where relevant.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
