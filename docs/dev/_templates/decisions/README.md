# Decisions Template

Use this template for long-lived technical, architectural, documentation, or process decisions that affect `docs/dev` guidance.

## Target Output

- `docs/dev/decisions/<number>-<topic>.md`
- Update `docs/dev/decisions/README.md` when a decision is accepted, superseded, or materially changes current guidance.

## Use When

- A new dependency, framework, codegen strategy, test strategy, or architecture rule is accepted.
- A future proposal from `evolution/` is promoted to current guidance.
- An accepted decision is superseded, partially restored, or rejected.
- The rationale and consequences need to remain discoverable after the implementation is complete.

## Do Not Use For

- Ordinary code pattern teaching. Use `engineering/`.
- Current import or module rules without a decision trade-off. Use `architecture/`.
- Future proposals that are not accepted. Use `evolution/`.
- AI behavior rules without a durable product or engineering decision. Use `ai/`.

## Cross-Check

Confirm the target repository's `docs/dev/decisions/README.md` and any existing decision records. Do not rewrite accepted decisions silently; create a new record or mark supersession explicitly.

## Completion Check

- Status, context, options, decision, consequences, and revisit trigger are present.
- Preserved and superseded scope are explicit when changing prior guidance.
- Decision consequences identify which `docs/dev` folders or templates need updates.
