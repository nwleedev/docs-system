# Domain Guidance

This folder owns current guidance for product vocabulary, state meaning, business rules, and invariants that must be interpreted consistently across code, tests, and docs.

## Include

- Current domain terms and invariants proven by source, API, product docs, tests, or repeated usage.
- Development guidance targets whose owner folder is `domain`.
- Positive and negative interpretation examples when code is not the clearest explanation.

## Exclude

- Technical validation library usage or static type mechanics. Use `engineering/`.
- Module ownership and import boundaries. Use `architecture/`.
- Unaccepted domain-model redesigns. Use `evolution/`.
- Long-lived decision rationale. Use `decisions/`.

## Current Index

No detailed domain guidance document is present yet. Add one only when repository evidence supports a current rule or a classified target needs domain-owned interpretation.

## Evidence

Repository-specific evidence belongs in [`../repository/README.md`](../repository/README.md). Ambiguous terms remain `Open Question` until target evidence is strong enough.
