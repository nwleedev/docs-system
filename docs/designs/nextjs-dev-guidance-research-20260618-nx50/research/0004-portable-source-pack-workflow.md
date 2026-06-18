# Portable Concern Source Pack Workflow

## Metadata

- Status: Draft
- Date: 2026-06-18
- Supports: R25-R30

## Research Question

Next.js가 예시일 뿐이라면, `docs/dev` 템플릿 시스템은 다른 레포와 기술스택도 특정 파일명이나 항목 수에 의존하지 않고 충분히 세밀한 development guidance target으로 분해해 리서치하고 문서화할 수 있어야 하는가?

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S26 | Local governance | `docs/dev/README.md` | 2026-06-18 | `development guidance target`은 dependency나 기능 이름이 아니라 구체적인 개발 판단 지점이다. | High; repo governance. |
| S27 | Local template router | `docs/dev/_templates/README.md` | 2026-06-18 | templates route targets to repository evidence, architecture, engineering, domain, evolution, ai, decisions. | High; repo template source. |
| S28 | Local repository template | `docs/dev/_templates/repository/_template.md` | 2026-06-18 | repository evidence owns stack, source layout, generated code, verification commands, constraints, and target inventory. | High; existing local template source used as design input. |
| S29 | Local bootstrap audit | `docs/dev/_templates/_bootstrap-audit.md` | 2026-06-18 | bootstrap must prove output is grounded in target repository evidence and not copied from one stack or skill. | High; existing local audit source used as design input. |
| S30 | Design package | `docs/designs/docs-dev-template-governance-20260617-q7m2/requirements.md` | 2026-06-18 | stack-neutral governance requires repository sampling, fallback GitHub evidence, current-rule promotion guards, and open-question classification. | High; prior accepted design evidence in this repo. |
| S31 | Worked example | `docs/designs/nextjs-dev-guidance-research-20260618-nx50/requirements.md` | 2026-06-18 | C00-C48 show one worked example of granular target reconstruction and routing without making the example stack, file name, or item count the portable baseline. | High; current package. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Broad technology-stack requests must be decomposed into concrete targets before summarization. | S31 | S29 | Confirmed | If a source list is tracked and stable, reconstruction can be a linked inventory instead of copying every word. If no list exists, derive targets from stack evidence and official docs. |
| Target evidence belongs in repository evidence or design package, not portable root rules. | S26 | S28 | Confirmed | Root README may define the process but not own target-specific facts. |
| Current rules need target repository evidence even when official docs support a better pattern. | S26 | S30 | Confirmed | Before target evidence exists, use `Recommended Future Pattern` or `Open Question`. |
| Grouping is allowed only after stable target coverage exists. | S27 | S31 | Confirmed | Grouped docs still need traceability back to every explicit source item or derived development guidance target. |

## Portable Workflow

| Step | Required Action | Output | Failure Mode Prevented |
| --- | --- | --- | --- |
| 1. Classify input | Determine whether there is an explicit concern list, broad stack request, tracked docs, ignored local source, external note, restricted source, or only stack evidence. | Input handling note. | Treating ephemeral files as durable completion evidence or assuming an absent file must exist. |
| 2. Derive granular targets | Assign stable IDs to explicit source items or derived development guidance targets. Preserve requirement-relevant obligations without optimizing for item count. | Target inventory with `C00-Cnn`, `T00-Tnn`, clusters, or equivalent. | Dropping unfamiliar/hard targets or counting items instead of analyzing the stack. |
| 3. Collect stack evidence | Inspect manifests, lockfiles, configs, source layout, docs, scripts, tests, generated outputs. | `repository/README.md` evidence lanes. | Inferring rules from stack name alone. |
| 4. Cross-check externally | Use official docs, standards, public repository sampling, or GitHub fallback evidence. | Research records with source claims. | Writing memory-based best practices. |
| 5. Route ownership | Assign owner folder and classification to every item. | Development guidance target inventory. | Mixing architecture, engineering, domain, and decisions. |
| 6. Define pattern obligation | Record scenario coverage, best/anti examples, verification, and open questions. | Pattern obligation field per target. | Producing vague "do/don't" guidance. |
| 7. Build pattern coverage | Map every target or target group to best pattern, anti-pattern, verification method, and target output. | Target pattern coverage table. | Stopping at inventory without teachable examples. |
| 8. Author grouped docs | Group related targets into owner-folder documents only after target and pattern coverage exists. | `docs/dev/<folder>/<topic>.md` docs. | Creating one doc per counted item or one unreadable mega-doc. |
| 9. Audit coverage | Verify every explicit source item or derived target maps to evidence, doc section, decision, or open question. | Bootstrap audit/target coverage audit. | Claiming completion from partial samples. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | The portable system should treat broad technology-stack guidance work as granular target decomposition with coverage obligations, not as a prompt to write a few familiar best practices. | S26-S31 | High | R25-R30 |
| F2 | Next.js examples can remain useful only when they are labeled as worked examples and excluded from portable template baselines. | S30, S31 | High | R25 |
| F3 | Other stacks can use the same structure by replacing source evidence and official docs while keeping owner folders, classification, pattern obligations, and audit gates. | S26-S29 | High | R26-R30 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Implemented | R25-R30 describe granular target decomposition and R48-R51 cover the implemented docs/dev template/command upgrade. |
| `plan.md` | Implemented | U8/U10 preserve the design and U13 implements the docs/dev template and command changes. |
| `docs/dev/README.md` | Implemented | Root governance now describes target decomposition and `_commands` ownership. |
| `docs/dev/_templates/**` | Implemented | Templates now include broad input routing, target coverage fields, and bootstrap audit checks. |
| `traceability.md` | Supports | R25-R30 and R48-R51 source coverage maps to RS4 and implemented docs/dev artifacts. |
| `completion-audit.md` | Supports | Completion evidence distinguishes implemented portable template/runbook changes from stack-specific current-rule promotion. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| This package has not applied the workflow to a second non-Next.js stack. | Cross-stack support is specified and templated, but not demonstrated with another worked example. | Create a second source pack package when a concrete target stack is selected. |

## Sources

- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/repository/_template.md`
- `docs/dev/_templates/_bootstrap-audit.md`
- `docs/designs/docs-dev-template-governance-20260617-q7m2/requirements.md`
- `docs/designs/nextjs-dev-guidance-research-20260618-nx50/requirements.md`
