# <AI Working Rule Title>

## Target Repository Evidence

| Field | Evidence |
| --- | --- |
| Existing AI instructions | <AGENTS/docs/dev/ai/README or not found after checking paths> |
| Development guidance docs | <docs paths checked> |
| Source and test evidence | <paths checked> |
| Verification commands | <commands relevant to this rule> |
| Constraints | <legacy/generated/external/security constraints> |

## Purpose

Explain the AI behavior this document standardizes.

## Applies To

- <agent task, document update, code-writing, review, or uncertainty situation>

## Does Not Apply To

- <cases that belong in architecture, engineering, domain, evolution, or decisions>

## Required Reading Order

1. <repo-tracked file>
2. <repo-tracked file>
3. <condition-specific file>

## Repository Evidence

| Evidence | Finding | AI Rule Impact |
| --- | --- | --- |
| <repo-relative path> | <finding> | <how the agent should behave> |

## Linked Development Guidance Targets

| Target | Decision Point | Risk | Repository Evidence | Classification | Confidence |
| --- | --- | --- | --- | --- | --- |
| <development guidance target> | <AI behavior or uncertainty choice> | <risk> | <repository evidence path or row> | <Current AI Rule / Recommended Future Pattern / Open Question / Local Constraint / Not Applicable> | <High / Medium / Low> |

## Source Evidence

| Source | Claim Used | Local Applicability | Recoverability Caveat |
| --- | --- | --- | --- |
| <repo path, official doc, or stable URL> | <claim> | <why this applies to target-repository AI behavior> | <tracked / recoverable / volatile> |

## Classification

- Current guidance status: <Current AI Rule / Local Constraint / Open Question>
- Reason: <why this classification is justified by target-repository evidence>

## Scenario Coverage

| Scenario | Agent Risk | Required Behavior |
| --- | --- | --- |
| <scenario> | <misapplication or hallucination risk> | <behavior rule> |

## Behavior Examples

### Correct Behavior: <name>

- Why this is correct: <explain how the behavior preserves scope, evidence, or source of truth.>
- Applies when: <task or uncertainty condition.>
- Impact: <how it prevents incorrect docs or code.>
- Verification: <how a reviewer can check the agent followed the rule.>

### Incorrect Behavior: <name>

- Why this is incorrect: <explain the unsupported inference or scope expansion.>
- Failure mode: <what could be wrongly changed or documented.>
- Safer alternative: <correct behavior.>
- Verification: <how to detect the incorrect behavior.>

## Uncertainty Handling

- If evidence is missing, classify the item as `Open Question`, `Local Constraint`, or `Recommended Future Pattern`.
- Do not create generic snippets when the target repository has no supporting code or official source evidence.
- Do not apply `evolution/` proposals as current rules without a decision or updated requirement.

## Verification

- <documentation audit, review check, code review evidence, or task replay check>

## Completion Check

- [ ] The rule works from repo-tracked files without a specific skill.
- [ ] Linked development guidance targets are classified and grounded in repository evidence.
- [ ] No skill-local path, absolute user path, worktree name, or session state is required.
- [ ] Scenario Coverage appears before behavior examples.
- [ ] Incorrect behavior examples explain the failure mode and safer alternative.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
