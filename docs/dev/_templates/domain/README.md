# Domain Template

Use this template for product vocabulary, state meaning, business rules, and invariants that must be interpreted consistently across code, tests, and docs.

## Target Output

- `docs/dev/domain/<topic>.md`
- Update `docs/dev/domain/README.md` when the term or invariant becomes part of the current domain index.

## Use When

- The same term or state appears in multiple features, API wrappers, tests, or user flows.
- Incorrect interpretation could create a bug or inconsistent UI behavior.
- A domain rule needs examples of correct and incorrect interpretation.

## Do Not Use For

- TypeScript type mechanics or validation library usage. Use `engineering/`.
- Feature import direction or module ownership. Use `architecture/`.
- Unaccepted domain-model redesign. Use `evolution/`.
- Long-lived decision rationale. Use `decisions/`.

## Cross-Check

Confirm the target repository's `docs/dev/domain/README.md` if it exists. If it does not exist, create only terms backed by repeated source, API, test, or product-document evidence.

## Completion Check

- The term or invariant is grounded in target-repository evidence.
- Ambiguous meanings are classified as open questions instead of current rules.
- Positive and negative examples explain user, state, or business impact.
- Code examples are optional; interpretation examples are required when code is not the clearest form.
