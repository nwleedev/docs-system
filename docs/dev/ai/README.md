# AI Working Guidance

This folder owns repo-tracked AI working rules: reading order, uncertainty handling, evidence gathering, legacy handling, generic snippet prevention, and agent-specific application boundaries.

## Include

- Current AI rules backed by repo-tracked docs, source evidence, or repeated review issues.
- Development guidance targets whose owner folder is `ai`.
- Behavior examples that explain correct and incorrect agent actions.

## Exclude

- Human code-authoring pattern guidance. Use `engineering/`.
- Module boundaries and ownership. Use `architecture/`.
- Accepted technical decisions. Use `decisions/`.
- Future implementation proposals. Use `evolution/`.

## Current Index

No detailed AI working rule is present yet. Add one only when repository evidence supports a stable AI behavior rule.

## Evidence

AI rules must work from repo-tracked files. They must not require skill-local paths, absolute user paths, worktree names, session state, or a specific model workflow.
