# Architecture Guidance

This folder owns current structural guidance for module boundaries, public APIs, import direction, ownership, generated output placement, and runtime flow.

## Include

- Current architecture rules proven by target repository evidence.
- Development guidance targets whose owner folder is `architecture`.
- Boundary risks, dependency direction, and review checks that affect code structure.

## Exclude

- Framework API usage, tests, lint, build, and generated-code mechanics. Use `engineering/`.
- Product vocabulary, state meaning, and business invariants. Use `domain/`.
- Future architecture proposals that are not current rules. Use `evolution/`.
- Decision rationale and supersession history. Use `decisions/`.

## Current Index

No detailed architecture guidance document is present yet. Add one only when repository evidence supports a current rule or a classified target needs architecture-owned interpretation.

## Evidence

Repository-specific evidence belongs in [`../repository/README.md`](../repository/README.md). This folder consumes that evidence but does not duplicate the target inventory.
