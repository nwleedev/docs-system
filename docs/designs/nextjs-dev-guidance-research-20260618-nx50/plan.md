---
title: Next.js Development Guidance Research Plan
type: docs
status: active
date: 2026-06-18
origin: docs/designs/nextjs-dev-guidance-research-20260618-nx50/requirements.md
---

# Next.js Development Guidance Research Plan

## Summary

This plan turns the worked Next.js frontend concerns into a durable research package and a proposed portable `docs/dev` writing workflow. Next.js is a worked example; the design must also handle other repositories and technology stacks by decomposing them into sufficiently granular development guidance targets, without treating `data.txt`, Next.js, or any fixed item count as the portable baseline.

## Requirements

- R1-R3. Create tracked research package and reconstruct C00-C48 from the local ephemeral source.
- R4-R6. Use official/primary sources and cross-validation for Next.js, React, TanStack Query, RHF, Zustand, Testing Library, TypeScript/ESLint, Tailwind, FSD, UI/UX.
- R7-R10. Define a pattern documentation contract for best/anti examples.
- R11-R24. Cover Next.js, state/form/data, React, testing, TypeScript, styling, UI/UX, and software engineering concerns.
- R25-R30. Keep Next.js as an example and define a proposed portable `docs/dev` target decomposition workflow so other technology stacks can be analyzed in sufficient detail without omission or stack coupling.
- R31-R36. Research whether templates alone are enough or whether a non-normative prompt/runbook folder is needed for reliable broad source pack execution.
- R37-R40. Document the refined `docs/dev` management upgrade proposal, including `_commands`, repository evidence, owner folders, sequencing, and verification.
- R41-R43. Review whether this plan reflects all research findings, gaps, open questions, and implementation guidance from RS1-RS5, then record the review result in the plan and traceability artifacts.
- R44-R47. Record the prior no-direct-`docs/dev` constraint as superseded by the current explicit implementation request, while preserving no-baseline and granular target decomposition rules.
- R48-R51. Implement the portable `docs/dev` template and `_commands` upgrade without making Next.js, `data.txt`, source lists, or fixed item counts portable baselines.

## Implementation Units

| Unit | Status | Covers | Work Scope | Expected Artifact Persistence | Verification |
| --- | --- | --- | --- | --- | --- |
| U1 | Completed | R1-R3 | Create package and reconstruct C00-C48. | Tracked | V1 |
| U2 | Partial | R4-R6 | Record official source map for major libraries and identify gaps. | Tracked | V2 |
| U3 | Completed | R7-R10 | Define reusable best/anti pattern documentation contract. | Tracked | V3 |
| U4 | Completed | R11-R24 | Route all concerns to owner folders and example types. | Tracked | V4 |
| U5 | Completed | R4-R6, R19-R23 | Add deeper source evidence for Tailwind, UI/UX, MDN iteration/Promise docs, JSDoc/TSDoc, Playwright/jest-dom. | Tracked | V5 |
| U6 | Deferred | R7-R24 | Draft actual first-wave `docs/dev` guidance documents from the grouped concerns after target repository evidence exists. | Tracked | V6 |
| U7 | Planned | R6, R22 | Perform visual and UI component library research once product category and candidate libraries are known. | Tracked | V7 |
| U8 | Completed | R25-R30 | Define proposed portable `docs/dev` target decomposition workflow with concern intake, routing, and coverage audit rules in the design package only. | Tracked | V8 |
| U9 | Completed | R31-R36 | Research template-only, prompt/runbook-only, and hybrid approaches for broad prompt execution and record recommendation. | Tracked | V9 |
| U10 | Completed | R37-R40 | Add the `docs/dev` management upgrade plan as a plan amendment using `_commands` as the reusable prompt/runbook folder and repository/design packages as source pack owners. | Tracked | V10 |
| U11 | Completed | R41-R43 | Review the plan against RS1-RS5 findings, gaps, open questions, and implementation guidance, then record coverage and follow-up treatment in `plan.md`. | Tracked | V11 |
| U12 | Completed | R44-R47 | Record the prior no-direct-`docs/dev` constraint and its supersession by the current explicit implementation request. | Tracked | V12 |
| U13 | Completed | R48-R51 | Implement target decomposition, broad input routing, repository target coverage fields, bootstrap coverage audit, and non-normative `_commands` runbooks in `docs/dev/**`. | Tracked | V13 |

## Verification

| Verification | Covers | Command Or Review | Expected Evidence |
| --- | --- | --- | --- |
| V1 | R1-R3 | Review `requirements.md` and `git status --short --branch`. | Worktree branch exists and C00-C48 are present. |
| V2 | R4-R6 | Review `research/0001-source-map.md`. | Official sources and gaps are recorded. |
| V3 | R7-R10 | Review `requirements.md` and `research/0002-concern-inventory.md`. | Best/anti example contract and scenario coverage rules are present. |
| V4 | R11-R24 | Review C00-C48 and concern groups. | Every source item is routed to owner folder and expected example type. |
| V5 | R4-R6, R19-R23 | Add source rows and gap updates. | Supplemental official sources for styling, JavaScript, tests, doc comments, and UI/UX are present. |
| V6 | R7-R24 | Review future `docs/dev` documents. | Pending; no current guidance documents created yet. |
| V7 | R6, R22 | Browser/visual evidence review. | Pending product category and candidate sources. |
| V8 | R25-R30 | Review `research/0004-portable-source-pack-workflow.md` and `plan.md`. | Proposed target decomposition workflow exists and does not make Next.js, `data.txt`, or item count the baseline. |
| V9 | R31-R36 | Review `research/0005-template-vs-examples-prompt-pack.md`. | Options, external evidence, recommendation, ownership boundaries, and guardrails are recorded. |
| V10 | R37-R40 | Review `plan.md#Plan-Amendment-docsdev-Management-Upgrade`. | Plan covers `_commands`, repository source packs, owner folder rule promotion, implementation units, decision boundaries, and verification. |
| V11 | R41-R43 | Review `plan.md#Plan-Coverage-Review`. | RS1-RS5 findings, gaps, open questions, and implementation guidance are mapped to plan treatment or explicit follow-up. |
| V12 | R44-R47 | Review `requirements.md`, `plan.md`, `traceability.md`, and `completion-audit.md`. | Prior no-direct-`docs/dev` constraint is recorded as historical and superseded by the current explicit implementation request. |
| V13 | R48-R51 | Review `docs/dev/README.md`, `docs/dev/_templates/**`, and `docs/dev/_commands/**`; search for baseline leakage. | Implemented docs/dev guidance supports granular target decomposition and non-normative reusable commands without requiring Next.js, `data.txt`, source lists, or fixed item counts as baselines. |

## Plan Amendment: docs/dev Management Upgrade

### Problem Frame

The worked Next.js concern inventory showed the failure mode this system must prevent: a broad technology-stack request can be reduced to a few familiar framework notes unless the documentation system decomposes the stack into concrete development guidance targets, routes each target to the right owner, records evidence quality, and audits best/anti pattern coverage. The specific file name and item count from the worked example are not portable requirements.

The folder name for that reusable prompt layer should be `_commands`, not `_examples`. `_examples` suggests worked source material belongs there, while the intended content is closer to executable documentation prompts. Source packs and worked evidence should stay in `docs/dev/repository/**` or in a design/research package so they are not confused with reusable commands.

### Target Structure

```text
docs/dev/
  README.md
  _templates/
  _commands/
    README.md
    research-source-pack.md
    write-owner-guidance.md
    audit-source-pack-coverage.md
  repository/
  architecture/
  engineering/
  domain/
  evolution/
  ai/
  decisions/
```

| Path | Owns | Must Not Own |
| --- | --- | --- |
| `docs/dev/README.md` | Portable governance, reading order, promotion rules, folder ownership. | Stack-specific source pack contents. |
| `docs/dev/_templates/**` | Normative schemas, required fields, audit checklist shape. | Worked examples as current guidance. |
| `docs/dev/_commands/**` | Reusable prompts and runbooks for repeated documentation tasks. | Source packs, target evidence, current rules. |
| `docs/dev/repository/**` | Target repository evidence, source pack inventory, item coverage, local constraints. | Portable template policy. |
| `docs/dev/<owner>/**` | Current/future guidance for architecture, engineering, domain, evolution, AI, and decisions. | Raw prompt files or unverified source pack dumps. |

### Key Technical Decisions

- KTD1. Use `_commands` for prompt/runbook files: The underscore matches `_templates` as support material, and "commands" describes reusable execution prompts better than "examples".
- KTD2. Keep source packs out of `_commands`: Source packs are evidence inputs, not reusable commands. Placing them under `_commands` would blur whether a file is a prompt, a worked example, or a repository fact.
- KTD3. Keep templates normative: Templates define required fields and audits. Commands may reference templates, but they cannot weaken or replace template obligations.
- KTD4. Promote rules only through owner folders: A pattern becomes current guidance only after repository evidence and owner-folder classification support it.
- KTD5. Preserve design packages as research archives: Broad worked examples like the Next.js source pack can stay in `docs/designs/**` and be linked from `repository` evidence when relevant.

### Detailed Implementation Units

| Unit | Goal | Files | Verification |
| --- | --- | --- | --- |
| U10.1 | Add root governance language so `_commands` is a support folder with prompt/runbook ownership. | `docs/dev/README.md`, `plan.md` | Folder ownership distinguishes `_templates`, `_commands`, `repository`, and owner folders. |
| U10.2 | Add template-router language so templates can point to `_commands` without making commands normative. | `docs/dev/_templates/README.md`, `plan.md` | Template selection says commands are optional reusable runbooks and templates remain required document shape. |
| U10.3 | Add repository evidence fields for target inventories and per-target coverage. | `docs/dev/_templates/repository/_template.md`, `plan.md` | Template includes source location, persistence state, optional item count, stable target IDs or clusters, reconstruction location, target mapping, and pattern coverage. |
| U10.4 | Add checks that prevent target sampling, command-folder misuse, and stack baseline leakage. | `docs/dev/_templates/_bootstrap-audit.md`, `plan.md` | Audit requires every target to map to evidence, owner, classification, best/anti pattern obligation, or follow-up. |
| U10.5 | Add `_commands` documentation that defines prompt file format and ownership boundaries. | `docs/dev/_commands/README.md` | README states `_commands` is non-normative, reusable across repositories, and cannot own current rules or evidence. |
| U10.6 | Add reusable prompts for the three repeated source-pack workflows. | `docs/dev/_commands/research-source-pack.md`, `docs/dev/_commands/write-owner-guidance.md`, `docs/dev/_commands/audit-source-pack-coverage.md` | Each file includes purpose, inputs, required reading, output contract, coverage gate, prohibited shortcuts, and verification. |
| U10.7 | Migrate existing exploratory recommendation language from examples/source-packs to `_commands` plus repository/design-package source packs. | `research/0005-template-vs-examples-prompt-pack.md`, `traceability.md`, `completion-audit.md` | Live recommendation no longer asks for `docs/dev/examples/source-packs`; historical mentions are either removed or marked as rejected alternatives. |

### Verification Matrix

| Check | Command Or Review | Expected Result |
| --- | --- | --- |
| Path naming | `rtk rg -n "docs/dev/examples|docs/dev/_examples|examples/source-packs" docs/dev docs/designs/nextjs-dev-guidance-research-20260618-nx50` | No live target-structure recommendation uses examples or `_examples`; old research alternatives are marked historical or rejected. |
| Command ownership | Review `docs/dev/_commands/README.md` | Commands are prompts/runbooks only and cannot own evidence or current rules. |
| Source pack ownership | Review `docs/dev/repository/README.md` and repository template | Source pack inventory belongs to repository evidence, not commands. |
| Stack neutrality | Review `plan.md`, `requirements.md`, and RS4/RS5. | Stack names appear only as worked-example evidence or explicit non-baseline references. |
| Coverage audit | Review proposed audit language in `plan.md` and RS4/RS5. | Completion requires sufficiently granular targets to map to evidence, owner, classification, pattern obligation, or follow-up. |

### Migration Strategy

1. Treat `research/0005-template-vs-examples-prompt-pack.md` as the exploratory comparison that raised the need for a prompt layer.
2. Treat this amendment as the refined folder decision: use `_commands`, not `_examples` or `examples`, for reusable prompts.
3. Keep source packs in `docs/dev/repository/**` for target evidence or in `docs/designs/**` for research packages.
4. The current explicit implementation request authorizes the `docs/dev/**` template and `_commands` changes in this pass.
5. Apply the first command files to a second non-Next.js source pack before claiming cross-stack maturity.

### Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `_commands` becomes a second source of truth. | Current rules can drift from owner-folder guidance. | Add explicit README and bootstrap audit checks that commands are non-normative. |
| Source packs move into `_commands` because prompts reference them. | Evidence and reusable commands become hard to distinguish. | Keep source pack fields in repository template and audit that raw source packs are not stored under `_commands`. |
| Next.js worked research leaks into portable templates. | Other stacks inherit React-specific assumptions. | Keep stack names out of root/template defaults except as labeled examples. |
| Commands become too generic to execute. | Broad source pack prompts still produce partial summaries. | Require each command to define inputs, required reading, output contract, coverage gate, prohibited shortcuts, and verification. |

### Acceptance Criteria

- AC1. A reader can tell where to put a reusable prompt, a source pack, a repository fact, and a current engineering rule.
- AC2. Adding a new technology stack source pack has an explicit path from raw concerns to repository evidence, owner guidance, and audit.
- AC3. `_commands` improves repeatability without weakening templates or owner-folder rule promotion.
- AC4. No live docs/dev target structure recommends `docs/dev/examples/source-packs` or `_examples`.
- AC5. The system supports broad source packs incrementally while preserving every item until it is resolved, deferred, or rejected with evidence.
- AC6. This pass implements the accepted `docs/dev/**` template and `_commands` changes while preserving the design-package trace.
- AC7. The design states that `docs/dev` decomposes technology stacks into sufficiently granular development guidance targets instead of relying on `data.txt`, Next.js, or a fixed item count as the portable baseline.

## Plan Coverage Review

This review checks whether the active plan reflects the research package rather than only the latest `_commands` discussion. The result is that the plan covers the research scope, but it needed this explicit review section to make RS1-RS5 findings, gaps, and open questions visible to future implementers.

### Research Record Coverage

| Research Record | Required Content To Preserve | Plan Treatment | Review Result |
| --- | --- | --- | --- |
| RS1 `research/0001-source-map.md` | Next.js App Router, server/client boundaries, server-side security, state/form/client-state separation, behavior-first testing, TypeScript/ESLint, FSD caveats, and source gaps. | U2, U4, U6, U7 preserve source mapping, concern routing, future detailed guide writing, and visual/product follow-up. V2, V4, V6, V7 keep verification separate from current-rule promotion. | Covered with deferred follow-ups for public repository sampling, target evidence, and visual/product research. |
| RS2 `research/0002-concern-inventory.md` | C00-C48 grouping, pattern documentation contract, best/anti matrix, documentation sequencing, and open questions for FSD naming, UI library, visual research, and testing volume. | U1, U3, U4, U6 preserve reconstruction, pattern contract, owner routing, and future grouped guide writing. U10 keeps source packs out of commands. | Covered; plan now makes open-question handling explicit in this review. |
| RS3 `research/0003-supplemental-official-sources.md` | MDN async/array semantics, Tailwind tokens, JSDoc/TSDoc caller contract, Playwright/jest-dom behavior assertions, WCAG/WAI/NNG UI/UX evidence, and source-page/visual gaps. | U5 records supplemental evidence; U6 defers detailed guide writing until target evidence; U7 carries visual/product research. | Covered with follow-up to re-open exact pages before quoting or writing detailed examples. |
| RS4 `research/0004-portable-source-pack-workflow.md` | Nine-step portable target decomposition workflow, stack neutrality, repository evidence ownership, current-rule promotion guard, grouping after stable target coverage, and second-stack gap. | U8 and U10 encode proposed intake, repository ownership, audit gates, and `_commands` support. AC2 and migration strategy require future non-Next.js application. | Covered; second non-Next.js worked example remains a follow-up, not a completion blocker for this plan. |
| RS5 `research/0005-template-vs-examples-prompt-pack.md` | Template-only versus prompt/runbook comparison, hybrid recommendation, `_commands` ownership, prompt contract, source pack placement, and gaps for unimplemented commands and no second worked stack. | U9 captures the research; U10 converts the recommendation into a `docs/dev` management amendment; U10.5-U10.6 are implemented as command files. | Covered; `_commands` implementation is complete for the reusable runbook layer, while a second worked stack remains a maturity follow-up. |

### Finding And Gap Treatment

| Research Item | Plan Reflection | Status |
| --- | --- | --- |
| RS1 F1-F7: Next.js boundaries, React effect/memo/ref guidance, state ownership separation, behavior-first tests, TypeScript/ESLint, FSD caveats, server-side authorization. | U2, U4, U6, V2, V4, V6 retain these as researched guidance and future owner-folder documents rather than current rules. | Reflected. |
| RS1 gaps: public repository sampling, UI library/product visual research, browser screenshots. | U7 and V7 preserve visual/product research as planned follow-up; U6 prevents current-rule promotion without target evidence. | Reflected as deferred evidence. |
| RS2 F1-F4: group 49 items by ownership, prioritize first detailed docs, preserve open questions, allow pseudo-code future patterns before target repo exists. | U4 groups concerns, U6 schedules first-wave detailed guides, and V6 keeps final guidance pending target evidence. | Reflected. |
| RS2 open questions: FSD naming, UI library, commercial visual comparables, testing volume. | These remain decision or evidence follow-ups; the plan does not claim them as current rules. | Reflected as open follow-ups. |
| RS3 F1-F6: async semantics, array method intent, Tailwind tokens, JSDoc/TSDoc meaning, behavior/locator assertions, UI/UX evidence mix. | U5 records supplemental official evidence; U6 defers detailed guidance authoring. | Reflected. |
| RS3 gaps: some pages need full re-open before quoting; commercial visual research not performed. | V5 and V7 keep final guide writing and visual evidence pending. | Reflected as follow-up. |
| RS4 F1-F3: source packs need coverage obligations, Next.js must remain worked example, other stacks reuse structure with replaced evidence. | U8, U10, AC2, and migration strategy preserve stack neutrality and source pack ownership. | Reflected. |
| RS4 gap: no second non-Next.js source pack has applied the workflow. | Migration strategy requires second non-Next.js application before claiming cross-stack maturity. | Reflected as maturity follow-up. |
| RS5 F1-F4: templates are necessary but insufficient, `_commands` is justified, commands are non-normative, hybrid is safest. | U9 and U10 capture the hybrid design; KTD1-KTD5 define ownership and guardrails. | Reflected. |
| RS5 gaps: `_commands` was previously unimplemented and no second worked example exists. | U13 implements `_commands`; migration strategy carries the second-stack follow-up. | `_commands` implemented; second worked example remains a maturity follow-up. |

### Review Findings

| Review Finding | Evidence | Plan Adjustment |
| --- | --- | --- |
| RF1. The plan already preserved the major requirement ranges R1-R40, but the evidence was too coarse for RS1-RS5 finding-level review. | Earlier plan mapped broad R ranges to U1-U10 without a research-record coverage table. | Added this `Plan Coverage Review` section and U11/V11. |
| RF2. The `_commands` amendment reflected RS5 well, but RS1-RS4 gaps needed explicit carry-forward so future implementers do not treat the plan as only a command-folder plan. | RS1-RS4 include open questions and gaps for target evidence, visual research, source-page re-open, public repo sampling, and second-stack application. | Added research-record coverage and finding/gap treatment tables. |
| RF3. No research item currently requires changing the target structure from `_commands` plus repository/design-package source packs. | RS4 and RS5 both support repository/design evidence ownership and non-normative prompt/runbooks. | Kept U10 structure unchanged and recorded the review result. |
| RF4. Direct `docs/dev/**` edits were initially premature because implementation had not been requested. | The current explicit goal requests continuing from the updated design package, completing the plan, and committing the result. | Added U12/V12 as historical supersession tracking and U13/V13 for the implemented template and command changes. |

## Research And Sources

- `research/0001-source-map.md`
- `research/0002-concern-inventory.md`
- `research/0003-supplemental-official-sources.md`
- `research/0004-portable-source-pack-workflow.md`
- `research/0005-template-vs-examples-prompt-pack.md`
- `requirements.md#Concern Inventory`
