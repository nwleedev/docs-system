# Completion Audit

## Metadata

- Status: draft
- Last Updated: <YYYY-MM-DD>
- Audited Scope: <package, branch, commit, or file set>

## Audit Rules

- Audit the original requirements, not the work that happened to be completed.
- Audit preserved requirements and requirement amendments together. Do not audit only the newest request.
- Treat backlog requirements as `Not Applicable` only when the active plan explicitly excludes them and the exclusion is recorded in traceability.
- Treat missing, weak, indirect, or uncertain evidence as not complete.
- Match the evidence scope to the requirement scope.
- Do not use a narrow test to prove a broad requirement.
- Do not use an ignored local file, generated output without committed source, or external artifact without accepted ownership as completion evidence.
- Record gaps instead of silently narrowing the requirement.

## Requirement Set Coverage

Use this table when the package has requirement amendments.

| Requirement Set | Source In `requirements.md`       | Included In Active Plan | Audit Verdict Basis                                    | Notes   |
| --------------- | --------------------------------- | ----------------------- | ------------------------------------------------------ | ------- |
| Original scope  | <Summary / Requirements sections> | <Yes / No>              | <How preserved scope is audited.>                      | <Notes> |
| A1              | <Requirement Amendments row>      | <Yes / No / Backlog>    | <How added, superseded, or deferred scope is audited.> | <Notes> |

## Amendment Coverage

Use this table to prove the audit covers the original baseline and every amendment that affects active completion.

| Amendment ID | Change Type                                           | Preserved Requirement Evidence | New / Modified Requirement Evidence | Superseded By Decision | Active Plan Coverage | Audit Action                       |
| ------------ | ----------------------------------------------------- | ------------------------------ | ----------------------------------- | ---------------------- | -------------------- | ---------------------------------- |
| A0           | Initial                                               | <Evidence for original scope.> | <Initial evidence.>                 | <None>                 | <Yes / No>           | <Audit / Reopen / Not Applicable.> |
| A1           | <Adds / Clarifies / Supersedes / Conflicts / Backlog> | <Evidence still valid.>        | <Evidence to inspect.>              | <None / decision path> | <Yes / No / Backlog> | <Audit / Reopen / Defer / Gap.>    |

## Requirement Audit

| Requirement | Amendment | Expected Evidence                    | Inspected Evidence                  | Verdict                                               | Gap Or Follow-Up |
| ----------- | --------- | ------------------------------------ | ----------------------------------- | ----------------------------------------------------- | ---------------- |
| R1          | A0        | <What would prove this requirement.> | <Current-state evidence inspected.> | <Pass / Fail / Partial / Unverified / Not Applicable> | <Gap or none.>   |

## Command And Review Evidence

| Evidence ID | Command Or Review            | Scope Covered | Amendment Coverage | Result                   | Caveat   |
| ----------- | ---------------------------- | ------------- | ------------------ | ------------------------ | -------- |
| E1          | `<command or review method>` | R1            | A0                 | <Pass / Fail / Observed> | <Caveat> |

## Artifact Persistence Evidence

| Evidence ID | Artifact             | Expected Persistence                             | Inspected State                                       | Result                              | Decision Record                |
| ----------- | -------------------- | ------------------------------------------------ | ----------------------------------------------------- | ----------------------------------- | ------------------------------ |
| E2          | `<path or artifact>` | <Tracked / Ignored Local / Generated / External> | <git status, git check-ignore, command, or reference> | <Pass / Gap / Partial / Unverified> | <None / decisions/<record>.md> |

## Source And Artifact Evidence

| Evidence ID | Artifact               | Requirement Coverage | Notes   |
| ----------- | ---------------------- | -------------------- | ------- |
| E3          | `<repo-relative path>` | R1                   | <Notes> |

## Final Verdict

Use one verdict.

- `Complete`: every required item is `Pass` or justified `Not Applicable`.
- `Incomplete`: at least one required item is `Fail`, `Partial`, or `Unverified`.

Verdict: <Complete / Incomplete>

## Remaining Gaps

- <Gap and recommended next action.>
