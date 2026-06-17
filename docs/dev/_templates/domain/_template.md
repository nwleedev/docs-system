# <Domain Guidance Title>

## Target Repository Evidence

| Field | Evidence |
| --- | --- |
| Product or domain area | <README/product/source paths checked> |
| Source layout | <features/API/tests checked> |
| Existing domain docs | <paths or not found after checking paths> |
| Verification commands | <tests or checks that exercise the domain behavior> |
| Constraints | <legacy naming/API/external constraints> |

## Purpose

Explain the vocabulary, state meaning, business rule, or invariant this document stabilizes.

## Applies To

- <features, API models, tests, user flows, or states>

## Does Not Apply To

- <technical implementation details or unaccepted redesigns>

## Repository Baseline

| Evidence | Finding | Classification |
| --- | --- | --- |
| <repo-relative path> | <term/state/rule observed> | <Current Rule / Local Constraint / Open Question> |

## Source Evidence

| Source | Claim Used | Local Applicability | Recoverability Caveat |
| --- | --- | --- | --- |
| <repo path, product doc, test, or stable URL> | <claim> | <why this applies to the target repository> | <tracked / recoverable / volatile> |

## Classification

- Current guidance status: <Current Rule / Local Constraint / Open Question>
- Reason: <why this classification is justified by target-repository evidence>

## Scenario Coverage

| Scenario | Interpretation Risk | Required Example |
| --- | --- | --- |
| <scenario> | <wrong meaning or invariant risk> | <positive/negative example or no-code rationale> |

## Positive And Negative Examples

### Positive Example: <name>

```ts
// Optional. Use target-repository code only when it clarifies the domain rule.
```

- Why this is correct: <explain the domain meaning or invariant.>
- Applies when: <state/user/API conditions.>
- Impact: <user-visible or business impact.>
- Target-repository constraints: <API, legacy, naming, or workflow constraints.>
- Verification: <test, fixture, UI behavior, or review check.>

### Negative Example: <name>

```ts
// Optional. Use target-repository code only when it clarifies the domain rule.
```

- Why this is incorrect: <explain the mistaken interpretation.>
- Failure mode: <bug, inconsistent UI, bad state transition, or data loss risk.>
- Impact: <user-visible or business impact.>
- Safer alternative: <correct interpretation.>
- Verification: <how to detect the mistaken interpretation.>

## Open Questions

| Question | Why It Is Not A Current Rule Yet | Follow-Up |
| --- | --- | --- |
| <question> | <missing evidence> | <next step> |

## Verification

- <test, fixture, UI behavior check, product review, or manual audit>

## Completion Check

- [ ] Target Repository Evidence is complete or missing evidence is explicitly classified.
- [ ] Scenario Coverage appears before examples.
- [ ] Every scenario maps to a positive/negative example or no-code rationale.
- [ ] Domain explanations are understandable without knowing the existing codebase.
- [ ] Placeholder text has been removed.

## Sources

- <source>: <claim used>
