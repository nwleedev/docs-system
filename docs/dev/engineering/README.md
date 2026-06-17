# Engineering Guidance

This folder owns current code-writing and verification guidance for languages, frameworks, libraries, generated code, tests, lint, build, release tooling, and operational checks.

## Include

- Current engineering rules proven by manifests, config, source, tests, verification commands, or official documentation.
- Development guidance targets whose owner folder is `engineering`.
- Best/anti-pattern guidance with intent, failure mode, safer alternative, and verification.

## Exclude

- Module ownership, import direction, runtime flow, or public API boundaries. Use `architecture/`.
- Product vocabulary or business invariants. Use `domain/`.
- Future migrations or unaccepted alternatives. Use `evolution/`.
- Accepted trade-off records. Use `decisions/`.

## Current Index

No detailed engineering guidance document is present yet. Add one only when repository evidence supports a current rule or a classified target needs engineering-owned interpretation.

## Evidence

Repository-specific evidence belongs in [`../repository/README.md`](../repository/README.md). Named technologies must be evidence from the target repository, not defaults in portable guidance.
