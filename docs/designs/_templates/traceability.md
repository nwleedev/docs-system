# Traceability

## Metadata

- Status: draft
- Last Updated: <YYYY-MM-DD>

## Requirement Amendment Trace

Use this table when `requirements.md` contains `Requirement Amendments`. It records how the current plan preserves earlier scope while adding, superseding, or deferring later scope.

| Amendment ID | Change Type                                           | Preserved Requirements | New / Modified / Superseded Requirements | Relationship To Previous Scope          | Decision Record                | Preserved Plan Units | New / Modified / Deferred / Superseded Units | Verification Impact              | Audit Impact           | Notes   |
| ------------ | ----------------------------------------------------- | ---------------------- | ---------------------------------------- | --------------------------------------- | ------------------------------ | -------------------- | -------------------------------------------- | -------------------------------- | ---------------------- | ------- |
| A0           | Initial                                               | <None / baseline.>     | R1-Rn                                    | Baseline                                | <None / decisions/<record>.md> | <Initial units.>     | <Initial units.>                             | <Initial verification coverage.> | <Initial audit scope.> | <Notes> |
| A1           | <Adds / Clarifies / Supersedes / Conflicts / Backlog> | <R IDs preserved.>     | <R IDs added/changed/replaced.>          | <Preserves / extends / replaces / none> | <None / decisions/<record>.md> | <U IDs preserved.>   | <U IDs added/changed/deferred/replaced.>     | <Rows added, changed, deferred.> | <Rows added/reopened.> | <Notes> |

## Requirement To Research

| Requirement | Amendment | Research Record        | Finding IDs | Coverage                   | Notes   |
| ----------- | --------- | ---------------------- | ----------- | -------------------------- | ------- |
| R1          | A0        | `research/<record>.md` | F1, F2      | <Full / Partial / Missing> | <Notes> |

## Requirement To Decision

| Requirement | Amendment | Decision        | Decision Record         | Status                           | Preserves / Supersedes |
| ----------- | --------- | --------------- | ----------------------- | -------------------------------- | ---------------------- |
| R1          | A0        | <Decision name> | `decisions/<record>.md` | <Accepted / Proposed / Deferred> | <Scope relationship.>  |

## Requirement To Plan Unit

| Requirement           | Amendment | Plan Unit         | Unit Status                                            | Coverage                   | Notes                                        |
| --------------------- | --------- | ----------------- | ------------------------------------------------------ | -------------------------- | -------------------------------------------- |
| R1                    | A0        | U1                | <Planned / Active / Completed / Deferred / Superseded> | <Full / Partial / Missing> | <Notes>                                      |
| <Backlog requirement> | A1        | <Deferred / none> | <Deferred>                                             | <Not Applicable>           | <Explain why it is outside the active plan.> |

## Requirement To Artifact Persistence

| Requirement | Artifact             | Expected Persistence                             | Actual Persistence                                         | Decision Record                | Notes   |
| ----------- | -------------------- | ------------------------------------------------ | ---------------------------------------------------------- | ------------------------------ | ------- |
| R1          | `<path or artifact>` | <Tracked / Ignored Local / Generated / External> | <Tracked / Ignored Local / Generated / External / Missing> | <None / decisions/<record>.md> | <Notes> |

## Requirement To Verification

| Requirement | Amendment | Verification | Method                                            | Scope Match                | Preserved Evidence Reused   | Notes   |
| ----------- | --------- | ------------ | ------------------------------------------------- | -------------------------- | --------------------------- | ------- |
| R1          | A0        | V1           | <Test / lint / review / runtime / document audit> | <Full / Partial / Missing> | <Yes / No / Not Applicable> | <Notes> |

## Requirement To Completion Evidence

| Requirement | Completion Evidence             | Verdict                                               | Notes   |
| ----------- | ------------------------------- | ----------------------------------------------------- | ------- |
| R1          | `completion-audit.md#<section>` | <Pass / Fail / Partial / Unverified / Not Applicable> | <Notes> |

## Coverage Gaps

| Gap   | Affected Requirements | Impact   | Required Follow-Up |
| ----- | --------------------- | -------- | ------------------ |
| <Gap> | R1                    | <Impact> | <Follow-up>        |
