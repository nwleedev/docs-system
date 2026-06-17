# AI Template

Use this template for repo-tracked AI working rules: reading order, uncertainty handling, legacy handling, generic snippet prevention, and agent-specific application boundaries.

## Target Output

- `docs/dev/ai/<topic>.md` for detailed AI rules.
- `docs/dev/ai/README.md` for concise read-order or index updates.

## Use When

- AI repeatedly misapplies current rules, future proposals, or legacy cleanup scope.
- The repository needs a stable instruction for evidence gathering or uncertainty handling.
- A rule describes agent behavior rather than application code.

## Do Not Use For

- Code pattern examples where the primary audience is human code authors. Use `engineering/`.
- Module boundaries. Use `architecture/`.
- Accepted technical decisions. Use `decisions/`.
- Future implementation proposals. Use `evolution/`.

## Cross-Check

Confirm the target repository's `docs/dev/ai/README.md` and any root AI instruction files. This template must not require a specific skill, session state, local path, or model-specific workflow.

Check `docs/dev/repository/README.md` for development guidance targets that affect AI behavior, uncertainty handling, fallback evidence, or rule promotion.

## Completion Check

- Reading order and uncertainty behavior are explicit.
- Any linked development guidance target records decision point, risk, evidence, owner folder, classification, confidence, and follow-up.
- Future proposals are not applied as current rules.
- Legacy cleanup remains scoped to user instructions.
- Missing examples require local evidence and official or primary documentation instead of generic snippets.
