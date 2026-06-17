# Architecture Template

Use this template for current structural rules: feature boundaries, public APIs, import direction, ownership, generated output placement, and runtime flow.

## Target Output

- `docs/dev/architecture/<topic>.md`
- Update `docs/dev/architecture/README.md` only when the new document becomes part of the current index.

## Use When

- A structural decision repeats across features or modules.
- A page, feature, shared layer, generated output, or external integration boundary needs a stable rule.
- Reviewers need a current rule for import direction or public entrypoints.

## Do Not Use For

- Framework API usage, testing, linting, or build configuration. Use `engineering/`.
- Product vocabulary, state meaning, or invariants. Use `domain/`.
- Migration candidates or alternative architectures that are not accepted current rules. Use `evolution/`.
- Long-lived accepted decisions with trade-offs. Use `decisions/`.

## Cross-Check

Before writing, confirm the target repository's `docs/dev/architecture/README.md` Include, Exclude, and Dynamic File Policy. If the target repository has no architecture README yet, create a minimal one from the evidence instead of copying this repository's current rules.

Check `docs/dev/repository/README.md` for development guidance targets first. Architecture owns interpretation and current structural rules; repository evidence owns target discovery, confidence, and local applicability.

## Completion Check

- The target repository evidence is filled in.
- The rule is classified as current guidance, local constraint, or open question.
- Any linked development guidance target records decision point, risk, evidence, owner folder, classification, confidence, and follow-up.
- `Scenario Coverage` describes structural cases before examples.
- Best/anti-pattern examples explain ownership, dependency direction, impact, safer alternative, and verification.
- No example is promoted from this repository unless the target repository has matching evidence.
