# Traceability

## Metadata

- Status: draft
- Last Updated: 2026-06-18

## Requirement To Source

| Requirement | Source Evidence | Coverage | Notes |
| --- | --- | --- | --- |
| R1-R3 | `requirements.md`, local `temps/frontend-concerns/data.txt` reconstruction | Full | C00-C48 present. |
| R4-R6 | `research/0001-source-map.md`, `research/0003-supplemental-official-sources.md` | Partial | Major official sources present; full public repository sampling and visual product evidence still pending. |
| R7-R10 | `requirements.md`, `research/0002-concern-inventory.md` | Full | Pattern documentation contract present. |
| R11-R14 | S1, S2, S9 | Partial | Next.js/FSD official evidence present; specific security docs need deeper read. |
| R15-R18 | S2-S5 | Partial | Major official evidence present; RHF async default integration remains open. |
| R19-R22 | S6-S8, S12-S25 | Partial | Testing, TypeScript, Tailwind, UI/UX source basis present; detailed final guides pending. |
| R23-R24 | `docs/dev/README.md`, `research/0002-concern-inventory.md`, S12-S18 | Full | Owner routing and software engineering source basis recorded. |
| R25-R30 | `research/0004-portable-source-pack-workflow.md`, `requirements.md`, `plan.md` | Full | Proposed portable target decomposition workflow recorded without making Next.js, `data.txt`, or item count the baseline. |
| R31-R36 | `research/0005-template-vs-examples-prompt-pack.md`, `plan.md` | Full | Template-only vs prompt/runbook strategy researched and refined to `_commands` ownership. |
| R37-R40 | `plan.md` | Full | Upgrade plan amendment records ownership boundaries, sequencing, guardrails, migration, and verification. |
| R41-R43 | `plan.md`, `research/0001-source-map.md`, `research/0002-concern-inventory.md`, `research/0003-supplemental-official-sources.md`, `research/0004-portable-source-pack-workflow.md`, `research/0005-template-vs-examples-prompt-pack.md` | Full | Plan coverage review maps RS1-RS5 findings, gaps, open questions, and implementation guidance to plan treatment. |
| R44-R47 | `requirements.md`, `plan.md`, `completion-audit.md` | Full | Prior no-direct-`docs/dev` constraint is recorded as historical and superseded by the current explicit implementation request. |
| R48-R51 | `docs/dev/README.md`, `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md`, `docs/dev/_templates/_bootstrap-audit.md`, `docs/dev/_commands/**` | Full | Portable target decomposition and non-normative command runbooks are implemented without making Next.js, `data.txt`, source lists, or fixed item counts baselines. |

## Concern To Plan Unit

| Concern Range | Plan Unit | Unit Status | Coverage |
| --- | --- | --- | --- |
| C00-C48 | U1 | Completed | Full reconstruction. |
| C01-C28, C31-C41, C44-C48 | U2, U4 | Partial | Official source map and routing present. |
| C29-C30, C43 | U5, U7 | Planned | Research method present; detailed evidence pending. |
| All concerns | U6 | Deferred | Actual docs/dev detailed guide writing requires target repository evidence. |
| Portable target decomposition system | U8 | Completed | Design package records target intake and coverage audit principles. |
| Template/prompt strategy | U9 | Completed | RS5 records comparison and recommendation. |
| docs/dev management upgrade | U10 | Completed | Plan records `_commands`, repository source packs, owner guidance, and audit boundaries. |
| Plan coverage review | U11 | Completed | Plan records research-record coverage and finding/gap treatment for RS1-RS5. |
| Prior no-direct docs/dev constraint | U12 | Completed | Design package records the historical constraint and supersession. |
| docs/dev template and command implementation | U13 | Completed | `docs/dev` root, templates, repository template, bootstrap audit, and `_commands` files implement the accepted management upgrade. |

## Requirement To Verification

| Requirement | Verification | Method | Scope Match | Notes |
| --- | --- | --- | --- | --- |
| R1-R3 | V1 | File review and git status | Full | Worktree branch and tracked package needed. |
| R4-R6 | V2, V5, V7 | Source map review and follow-up source reads | Partial | Some source gaps remain. |
| R7-R10 | V3 | Documentation contract review | Full | Contract present. |
| R11-R24 | V4, V6 | Concern routing and future docs/dev review | Partial | Routing done; final detailed guides deferred. |
| R25-R30 | V8 | Design package and docs/dev review | Full | Target decomposition fields, pattern coverage, and audit gates are recorded in design docs and implemented in templates. |
| R31-R36 | V9 | Research record review | Full | RS5 includes options and evidence; upgrade plan refines the live folder recommendation to `_commands`. |
| R37-R40 | V10 | Plan review | Full | Upgrade plan includes target structure, implementation units, verification matrix, risks, and acceptance criteria. |
| R41-R43 | V11 | Plan coverage review | Full | RS1-RS5 coverage is explicitly reviewed in `plan.md#Plan-Coverage-Review`. |
| R44-R47 | V12 | Design package review | Full | Prior no-direct-`docs/dev` constraint is recorded as superseded by the current explicit implementation request. |
| R48-R51 | V13 | docs/dev file review and baseline-leakage search | Full | `docs/dev/**` implements target decomposition, command ownership, and coverage audits without requiring a worked example baseline. |

## Coverage Gaps

| Gap | Affected Requirements | Impact | Required Follow-Up |
| --- | --- | --- | --- |
| Actual stack-specific `docs/dev` detailed guidance files are not created yet. | R7-R24 | Not a blocker for the design package, but required when applying the system to a real target repository. | Draft grouped owner-folder guides after target repository evidence exists and implementation is requested. |
| Visual commercial-service research needs product category and browser evidence. | R6, R22 | Cannot produce meaningful visual examples yet. | Collect product domain or sample competitors. |
| No second non-Next.js worked example has applied the command workflow. | R25-R36, R51 | Cross-stack support is implemented as a portable template/runbook system, but not demonstrated with another concrete stack. | Apply the workflow to a second concrete stack before claiming cross-stack maturity from examples. |
