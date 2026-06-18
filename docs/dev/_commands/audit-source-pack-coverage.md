# Audit Source Pack Coverage Command

## Purpose

Use this command to verify that a broad request, explicit source list, or derived target inventory was not reduced to a partial sample.

The command audits coverage before a research package, repository evidence record, or owner-folder guidance is treated as complete.

## Inputs

- Source item list or derived target inventory.
- Repository evidence record or design package.
- Owner-folder guidance documents produced from the inventory.
- Decision records and open-question lists.
- Search results or command output used as verification evidence.

## Required Reading

- `docs/dev/README.md`
- `docs/dev/_templates/_bootstrap-audit.md`
- `docs/dev/_templates/repository/_template.md`
- Relevant owner-folder templates.
- The source-pack research record or repository evidence file being audited.

## Output Contract

Produce an audit table with:

| Field | Required Content |
| --- | --- |
| Source or target ID | Stable source item ID or derived target ID. |
| Evidence status | Present, missing, weak, conflicting, or not applicable. |
| Owner | Target `docs/dev/<owner>` folder or decision record. |
| Classification | Current rule, future pattern, local constraint, open question, rejected, or not applicable. |
| Pattern coverage | Best/anti pair, behavior example, decision case, or no-example rationale. |
| Verification | Search, review, command, runtime check, or source review proving the status. |
| Follow-up | Required action when coverage is partial or blocked. |

## Coverage Gate

Every explicit source item or derived target must have:

- Evidence or a missing-evidence classification.
- Owner routing.
- Classification.
- Pattern coverage or a no-example rationale.
- Verification, decision need, open question, or follow-up.

Completion fails if any target is absent from the audit table.

## Prohibited Shortcuts

- Claiming completion because the most familiar targets are covered.
- Treating item count as the goal instead of target coverage.
- Treating the absence of a source file as permission to ignore reconstructed obligations.
- Accepting a command output as proof without checking that it covers the requirement.
- Storing the audited source pack under `_commands`.

## Verification

- Compare source IDs or target IDs in the audit against the inventory.
- Search owner-folder documents for target IDs or explicit traceability.
- Confirm unresolved targets are marked as open questions, decision needs, or follow-ups.
- Confirm no raw source pack content was moved into `_commands`.
