---
title: docs/dev Guidance Boundary Plan
type: docs
status: active
date: 2026-06-19
origin: docs/designs/docs-dev-guidance-boundary-20260619-k4p9/requirements.md
---

# docs/dev Guidance Boundary Plan

## Summary

This plan turns the current research package into a focused `docs/dev` governance update. The implementation direction is to keep `docs/dev/_templates` as portable document structure, delete the non-executable `_commands` layer, keep `examples/` as repository-applicable example prompts, and strengthen README/template/example/audit responsibilities around external repository cross-validation and best/anti pattern coverage.

## Problem Frame

The current `docs/dev` package has three overlapping authoring entry points: README governance, `_templates` output contracts, and `_commands` prompt/runbooks. Research RS1-RS7 shows that `_commands` creates an expectation mismatch, while the same responsibilities can be moved into README policy, repository evidence templates, owner-folder templates, examples prompts, and bootstrap audit checks.

## Requirements

- R1-R5. Review current `docs/dev/README.md`, `_templates`, `_commands`, and `examples` boundaries with local and external evidence, and record options before implementation.
- R6-R8. Define how detailed guidance should require scenario-based best/anti pattern examples without letting stale examples become unverified current rules.
- R9-R11. Plan improvements for `docs/dev/README.md` and every `_templates` layer, including `_templates/README.md`, folder README files, `_template.md`, and `_bootstrap-audit.md`.
- R12-R13. Evaluate README-only guardrails instead of adding a separate prohibition file.
- R14-R16. Replace or expand stack-only sampling into external repository cross-validation, including the rule that local code is current-state evidence, not best-practice authority.
- R17-R19. Plan `_commands` deletion, supersession of prior `_commands` recommendations, replacement responsibility mapping, and live reference cleanup.
- R20-R23. Evaluate `examples/` versus `prohibitions/` naming and preserve the final direction that `examples/` remains the folder for repository-applicable example prompts with free-form bodies and common top guidance.

## Plan Amendments

| Amendment ID | Requirement IDs | Preserved Units | New Units | Modified Units | Deferred Units | Superseded Units | Removed Units | Decision Record | Verification Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | R17-R19 | U1-U7 | U8-U10 | U5-U7 | None | Prior `_commands` recommendation from `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md` | Future `_commands` live docs unit, if any | Needed before or during implementation | Add V8-V10 and command-reference cleanup checks. |
| A2 | R20-R23 | U1-U10 | U11 | U7 | None | Rename-to-`prohibitions` option and fixed detailed prompt section structure | None | None unless renaming is later selected | Add V11 and preserve `examples/` naming plus free-form prompt verification. |

## Key Technical Decisions

- Keep `examples/` as the folder name: `prohibitions/` is too narrow because the files must ask for research scope, positive guidance, anti-patterns, external validation, examples, and verification. Keep example files free-form, and put only common requirements at the top of each prompt.
- Delete `_commands` in the implementation phase: the folder contains Markdown prompt/runbooks, not executable commands, and its three workflows can be represented by README, templates, examples, repository evidence, and bootstrap audit checks.
- Treat `_commands` deletion as a source-of-truth change: prior research recommended `_commands`, so implementation should preserve the old research as history and add a clear supersession note in the active design package or a decision record.
- Do not put stack-specific concern lists into `_templates`: templates define structure and required fields only; stack-specific prompt content belongs in `examples/`.

## Artifact Persistence Plan

| Artifact | Covers | Expected Persistence | Commitability Check | Decision Record |
| --- | --- | --- | --- | --- |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/requirements.md` | R1-R23 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/README.md` | R1-R23 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0001-template-command-example-boundaries.md` | R1-R5 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0002-pattern-example-coverage.md` | R6-R8 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0003-readme-template-system-improvements.md` | R9-R11 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0004-readme-authoring-guardrails.md` | R12-R13 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0005-external-repository-cross-validation.md` | R14-R16 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0006-remove-commands-decision.md` | R17-R19 | Tracked | `rtk git status --short --branch` | `decisions/0001-remove-commands-keep-examples.md` |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0007-examples-vs-prohibitions-naming.md` | R20-R23 | Tracked | `rtk git status --short --branch` | Needed only if `examples/` is later renamed |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/plan.md` | R1-R23 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/decisions/0001-remove-commands-keep-examples.md` | R17-R23 | Tracked | `rtk git status --short --branch` | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/traceability.md` | R1-R23 | Tracked | `rtk git status --short --branch` | `decisions/0001-remove-commands-keep-examples.md` |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/completion-audit.md` | R1-R23 | Tracked | `rtk git status --short --branch` | `decisions/0001-remove-commands-keep-examples.md` |

## Implementation Units

| Unit | Status | Covers | Work Scope | Expected Artifact Persistence | Verification |
| --- | --- | --- | --- | --- | --- |
| U1 | Completed | R1-R5 | Create the design package, inspect current README/templates/commands/examples boundaries, and document options for template, command, and example ownership. | Tracked | V1 |
| U2 | Completed | R6-R8 | Define scenario-based best/anti example coverage, stale-example guardrails, and verification hooks. | Tracked | V2 |
| U3 | Completed | R9-R11 | Research README and template layer responsibilities, including root README, template README, folder README, body templates, and bootstrap audit. | Tracked | V3 |
| U4 | Completed | R12-R13 | Research README-only authoring guardrails and reject a long separate prohibition file as the first step. | Tracked | V4 |
| U5 | Completed | R14-R16 | Research `External Repository Cross-Validation` as the replacement for narrow stack-only sampling. | Tracked | V5 |
| U6 | Completed | R17-R19 | Research `_commands` deletion, prior recommendation supersession, responsibility replacement, and implementation verification checks. | Tracked | V6 |
| U7 | Completed | R20-R23 | Research `examples/` versus `prohibitions/` naming and preserve `examples/` with free-form prompt bodies plus common top guidance. | Tracked | V7 |
| U8 | Completed | R14-R19 | Update `docs/dev/README.md`: remove `_commands` ownership, strengthen authoring guardrails, rename or replace stack-only sampling with `External Repository Cross-Validation`, and route broad prompt execution to README/templates/examples/repository evidence. | Tracked | V8 |
| U9 | Completed | R9-R11, R17-R19 | Update `docs/dev/_templates/**`: remove optional command references, keep templates stack-neutral, add external cross-validation fields, preserve scenario-based pattern coverage, and ensure bootstrap audit replaces command coverage checks. | Tracked | V9 |
| U10 | Completed | R17-R19 | Delete `docs/dev/_commands/**` after live references and replacement responsibilities are updated. | Tracked deletion | V10 |
| U11 | Completed | R6-R8, R20-R23 | Update `examples/nextjs-frontend.md` without renaming `examples/`: keep the body free-form, add common top guidance for external repository cross-validation, do-not/alternative extraction, scenario-based best/anti examples, and verification/ESLint enforcement. | Tracked | V11 |
| U12 | Completed | R1-R23 | Add traceability and completion audit if implementation proceeds beyond research package updates, because the scope contains cross-validation, source-of-truth movement, and deletion. | Tracked | V12 |

## Implementation-Time Decision Boundaries

Stop implementation and create or update a decision record when:

- deleting `_commands` would leave unresolved live references or unowned command responsibilities;
- `examples/` is renamed after the current decision to keep the name;
- a new folder such as `prohibitions/`, `prompt-packs/`, or `stack-guidance-prompts/` is introduced;
- README or templates start owning stack-specific concern lists instead of generic structure and governance;
- verification can only prove local draft changes rather than tracked files ready for review.

## Verification

| Verification | Covers | Command Or Review | Expected Evidence |
| --- | --- | --- | --- |
| V1 | R1-R5, U1 | Review `research/0001-template-command-example-boundaries.md`. | Local and external evidence, options, README risks, and command/template/example boundary findings are present. |
| V2 | R6-R8, U2 | Review `research/0002-pattern-example-coverage.md`. | Scenario coverage, best/anti pair contract, stale guard, and verification hook rules are present. |
| V3 | R9-R11, U3 | Review `research/0003-readme-template-system-improvements.md`. | README/template layer map and improvement checklist cover every `_templates` layer. |
| V4 | R12-R13, U4 | Review `research/0004-readme-authoring-guardrails.md`. | README-only guardrail option, trade-offs, and `Do Not / Instead` shape are present. |
| V5 | R14-R16, U5 | Review `research/0005-external-repository-cross-validation.md`. | Existing-code-is-not-authority rule and external repository cross-validation model are present. |
| V6 | R17-R19, U6 | Review `research/0006-remove-commands-decision.md`. | Replacement map, supersession handling, live reference impact, and deletion verification commands are present. |
| V7 | R20-R23, U7 | Review `research/0007-examples-vs-prohibitions-naming.md`. | `examples/` keep decision, `prohibitions` trade-off, free-form prompt body, and common top guidance are present. |
| V8 | R14-R19, U8 | `rtk rg -n "_commands|Optional Commands|Stack-Only Repository Sampling|External Repository Cross-Validation" docs/dev/README.md` | README no longer routes work to `_commands`; external repository cross-validation is the live guidance path. |
| V9 | R9-R11, R17-R19, U9 | `rtk rg -n "_commands|Optional Commands|Stack-Only Sampling|External Repository Cross-Validation|Scenario Coverage|best/anti" docs/dev/_templates` | Templates contain replacement obligations and no command dependency. |
| V10 | R17-R19, U10 | `rtk rg --files docs/dev/_commands` and `rtk rg -n "_commands|research-source-pack|write-owner-guidance|audit-source-pack-coverage" docs/dev examples` | `_commands` folder is gone and live docs/examples do not reference deleted command files. |
| V11 | R6-R8, R20-R23, U11 | Review `examples/nextjs-frontend.md` and search for common top guidance terms such as external repository cross-validation, do-not alternatives, best/anti examples, and ESLint. | The example prompt keeps the folder name, remains free-form after the top guidance, and preserves best/anti and verification responsibilities. |
| V12 | R1-R23, U12 | Review future `traceability.md` and `completion-audit.md`, then run the package placeholder/internal marker search used by this repository. | Requirement-to-plan-to-verification mappings exist and no placeholder/internal marker remains in changed docs. |

## Risks And Dependencies

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Deleting `_commands` before README/templates/examples are strengthened | Broad stack requests may again become shallow summaries. | Complete U8, U9, and U11 before or in the same commit as U10. |
| Historical design docs still recommend `_commands` | Search results may show conflicting guidance. | Keep old records as history and mark the new package as superseding the live recommendation. |
| `examples/` name may under-signal prohibitions | AI may miss "do not" guidance. | Put a concise common instruction at the top of every example prompt requiring do-not patterns and required alternatives. |
| `prohibitions/` rename may be reintroduced later | Best pattern and external research responsibilities may narrow. | Require a decision record before any rename and preserve R20-R23 evidence. |
| README grows too large | Bootstrap usability may degrade. | Replace duplicated workflow text with concise gates and point detailed shape to templates/examples. |

## Research And Sources

- `requirements.md`
- `research/README.md`
- `research/0001-template-command-example-boundaries.md`
- `research/0002-pattern-example-coverage.md`
- `research/0003-readme-template-system-improvements.md`
- `research/0004-readme-authoring-guardrails.md`
- `research/0005-external-repository-cross-validation.md`
- `research/0006-remove-commands-decision.md`
- `research/0007-examples-vs-prohibitions-naming.md`
- `docs/designs/README.md`
