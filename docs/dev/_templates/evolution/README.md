# Evolution Template

Use this template for future proposals, migration candidates, alternatives, technical debt, or recommended future patterns. Documents created from this template are not current rules.

## Target Output

- `docs/dev/evolution/<topic>.md`
- Update `docs/dev/evolution/README.md` when the proposal should be discoverable from the current candidate index.

## Use When

- A better direction exists but is not accepted as current guidance.
- A legacy pattern should be reduced gradually while preserving behavior.
- A migration needs conditions, risks, rollback, or promotion criteria.

## Do Not Use For

- Rules that must apply to new code now. Use `architecture/`, `engineering/`, or `domain/`.
- Accepted long-lived decisions. Use `decisions/`.
- AI reading order or agent behavior. Use `ai/`.

## Cross-Check

Confirm the target repository's `docs/dev/evolution/README.md`. The output must visibly say it is not current guidance and must define what evidence or decision would promote it.

## Completion Check

- The proposal records the current constraint and why immediate application is not allowed.
- Migration risk, rollback, promotion criteria, and revisit trigger are present.
- Examples are framed as proposed direction, not current rule.
