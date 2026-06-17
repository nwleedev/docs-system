# Engineering Template

Use this template for current code-writing and verification rules tied to a target repository's technology stack.

## Target Output

- `docs/dev/engineering/<topic>.md`
- Update `docs/dev/engineering/README.md` when the new topic becomes a current engineering rule.

## Use When

- A language, framework, library, generated-code, test, lint, build, or tooling pattern repeats.
- A code review rule needs best/anti-pattern examples.
- The rule can be verified against source, config, tests, or official documentation.

## Do Not Use For

- Feature/module ownership and import boundaries. Use `architecture/`.
- Product vocabulary or business invariants. Use `domain/`.
- Future migrations or unaccepted alternatives. Use `evolution/`.
- Decision rationale for adopting or superseding a tool. Use `decisions/`.

## Cross-Check

Confirm the target repository's `docs/dev/engineering/README.md` Include, Exclude, and Dynamic File Policy. Do not assume this repository's named language, framework, library, code generation, or external checkout guidance applies to another repository without target evidence.

Check `docs/dev/repository/README.md` for stack evidence, public repository sampling, fallback evidence, and development guidance targets before writing current engineering rules.

## Completion Check

- The target technology stack is recorded from manifests/configs.
- Any linked development guidance target records decision point, risk, evidence, owner folder, classification, confidence, and follow-up.
- `Scenario Coverage` precedes pattern examples.
- Each best/anti-pattern explains why, when it applies, failure mode, impact, safer alternative, target constraints, and verification.
- External API/library claims are checked against official or primary sources when relevant.
- Generated output, legacy code, and test scope are not expanded without evidence.
