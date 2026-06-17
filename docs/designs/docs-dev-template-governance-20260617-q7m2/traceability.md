# Traceability

## Metadata

- Status: draft
- Last Updated: 2026-06-17

## Requirement Amendment Trace

| Amendment ID | Change Type | Preserved Requirements | New / Modified / Superseded Requirements | Relationship To Previous Scope | Decision Record | Preserved Plan Units | New / Modified / Deferred / Superseded Units | Verification Impact | Audit Impact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A0 | Initial | None. | R1-R11 | Baseline | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | None. | U1-U5 | V1-V5 | Full package audit required. | Initial design package. |
| A1 | Adds | R1-R11 | R12-R16 | Extends baseline with concern discovery method. | `decisions/0002-use-evidence-first-concern-discovery.md` | U1-U5 | U6 | V6 added. | Audit rows added for R12-R16. | Adds stack, topic, and operational evidence lanes. |
| A2 | Adds | R1-R16 | R17-R22 | Extends baseline with stack-only public repository sampling. | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | U1-U6 | U7 | V7 added. | Audit rows added for R17-R22. | Adds GitHub CLI sampling method. |
| A3 | Adds | R1-R22 | R23-R30 | Extends baseline with explicit concern definition and fine-grained GitHub inference. | `decisions/0004-define-concern-as-development-guidance-target.md` | U1-U7 | U8 | V8 added. | Audit rows added for R23-R30. | Keeps `concern` term but narrows it to development guidance targets. |
| A4 | Adds | R1-R30 | R31-R35 | Extends baseline with GitHub evidence fallback and explicit repository/stack neutrality. | `decisions/0005-keep-github-evidence-and-templates-portable.md` | U1-U8 | U9 | V9 added. | Audit rows added for R31-R35. | Avoids making `gh`, a sampled repository, or a named stack mandatory. |

## Requirement To Research

| Requirement | Amendment | Research Record | Finding IDs | Coverage | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | A0 | `research/0001-cross-validated-guidance-management.md` | F3 | Full | Root governance baseline inspected. |
| R2 | A0 | `research/0001-cross-validated-guidance-management.md` | F1, F3, F4 | Full | Template routing and stack-specific wording inspected. |
| R3 | A0 | `research/0001-cross-validated-guidance-management.md` | F1, F3 | Full | Consumer repository auditing deferred. |
| R4 | A0 | `research/0001-cross-validated-guidance-management.md` | F3, F4 | Full | Stack-neutrality is a core finding. |
| R5 | A0 | `research/0001-cross-validated-guidance-management.md` | F2, F4 | Full | Official library docs support optional examples only. |
| R6 | A0 | `research/0001-cross-validated-guidance-management.md` | F4 | Full | Existing stack-specific wording identified. |
| R7 | A0 | `research/0001-cross-validated-guidance-management.md` | F1, F5 | Full | Gap inventory supported by scorecard and documentation failure evidence. |
| R8 | A0 | `research/0001-cross-validated-guidance-management.md` | F2 | Full | Pre-code recommended pattern classification supported. |
| R9 | A0 | `research/0001-cross-validated-guidance-management.md` | F3 | Full | Current rules still need target evidence. |
| R10 | A0 | `research/0001-cross-validated-guidance-management.md` | F1-F5 | Full | Cross-validation record created. |
| R11 | A0 | `research/0001-cross-validated-guidance-management.md` | F1-F5 | Full | Plan, traceability, and audit included. |
| R12 | A1 | `research/0002-concern-discovery-from-stack-and-topic.md` | F6, F7 | Full | Stack evidence collection method added. |
| R13 | A1 | `research/0002-concern-discovery-from-stack-and-topic.md` | F6, F8 | Full | Repository topic collection method added. |
| R14 | A1 | `research/0002-concern-discovery-from-stack-and-topic.md` | F6, F9 | Full | Operational quality concern method added. |
| R15 | A1 | `research/0002-concern-discovery-from-stack-and-topic.md` | F10 | Full | Structured concern record fields added. |
| R16 | A1 | `research/0002-concern-discovery-from-stack-and-topic.md` | F11 | Full | Cross-validation requirement added. |
| R17 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F12 | Full | Stack-only public repository sampling added. |
| R18 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F13 | Full | Explicit sample selection criteria added. |
| R19 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F14 | Full | Actual repository evidence inspection added. |
| R20 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F15 | Full | Concern grouping requirement added. |
| R21 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F16 | Full | Local applicability review requirement added. |
| R22 | A2 | `research/0003-stack-only-concern-discovery-from-public-repositories.md` | F17 | Full | Reproducible GitHub evidence and no-clone rule added. |
| R23 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F18 | Full | Explicit `concern` definition requirement added. |
| R24 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F19 | Full | Excludes product features, UI, dependency names, and broad technology categories by default. |
| R25 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F20 | Full | Representative concern shapes added. |
| R26 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F21 | Full | Detailed concern record fields added. |
| R27 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F22 | Full | GitHub evidence ladder added. |
| R28 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F23 | Full | Code search and README limitations added. |
| R29 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F24 | Full | Shared stack, stack-plus-domain, and repository-specific grouping added. |
| R30 | A3 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F25 | Full | Official docs cross-validation added. |
| R31 | A4 | `research/0003-stack-only-concern-discovery-from-public-repositories.md`, `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F17, F22 | Full | `gh` preference without mandatory dependency added. |
| R32 | A4 | `research/0003-stack-only-concern-discovery-from-public-repositories.md`, `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F17, F22 | Full | Equivalent GitHub evidence fallback paths added. |
| R33 | A4 | `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F21, F23 | Full | Fallback evidence recording fields added. |
| R34 | A4 | `research/0003-stack-only-concern-discovery-from-public-repositories.md`, `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F16, F17, F25 | Full | Fallback guardrails reuse no-clone and target-evidence rules. |
| R35 | A4 | `research/0001-cross-validated-guidance-management.md`, `research/0004-concern-terminology-and-fine-grained-github-inference.md` | F3, F4, F19 | Full | Repository-neutral and stack-neutral template improvement requirement added. |

## Requirement To Decision

| Requirement | Amendment | Decision | Decision Record | Status | Preserves / Supersedes |
| --- | --- | --- | --- | --- | --- |
| R4 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Preserves stack-neutral governance. |
| R5 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Preserves optional examples only. |
| R6 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Preserves portability by generalizing stack wording. |
| R7 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Adds gap classification without automation. |
| R8 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Adds non-current recommended pattern path. |
| R9 | A0 | Classify missing guidance without stack coupling | `decisions/0001-classify-missing-guidance-without-stack-coupling.md` | Accepted | Preserves evidence requirement for current rules. |
| R12 | A1 | Use evidence-first concern discovery | `decisions/0002-use-evidence-first-concern-discovery.md` | Accepted | Adds stack evidence lane. |
| R13 | A1 | Use evidence-first concern discovery | `decisions/0002-use-evidence-first-concern-discovery.md` | Accepted | Adds repository topic evidence lane. |
| R14 | A1 | Use evidence-first concern discovery | `decisions/0002-use-evidence-first-concern-discovery.md` | Accepted | Adds operational quality evidence lane. |
| R15 | A1 | Use evidence-first concern discovery | `decisions/0002-use-evidence-first-concern-discovery.md` | Accepted | Adds structured concern record contract. |
| R16 | A1 | Use evidence-first concern discovery | `decisions/0002-use-evidence-first-concern-discovery.md` | Accepted | Adds cross-validation rule. |
| R17 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Adds stack-only repository sampling. |
| R18 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Adds sample selection criteria. |
| R19 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Adds actual sample inspection. |
| R20 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Adds concern grouping. |
| R21 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Preserves local evidence requirement. |
| R22 | A2 | Sample real repositories before stack-only concern selection | `decisions/0003-sample-real-repositories-before-stack-only-concern-selection.md` | Accepted | Adds reproducible GitHub evidence and no-clone rule. |
| R23 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Keeps the term and requires definition before use. |
| R24 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Prevents feature/UI/dependency-name confusion. |
| R25 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Defines representative concern shapes. |
| R26 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Adds detailed concern record contract. |
| R27 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Adds GitHub evidence ladder. |
| R28 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Records weak search and README evidence handling. |
| R29 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Adds cross-repository concern grouping. |
| R30 | A3 | Define concern as a development guidance target | `decisions/0004-define-concern-as-development-guidance-target.md` | Accepted | Adds official docs cross-validation. |
| R31 | A4 | Keep GitHub evidence and templates portable | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Accepted | `gh` remains preferred but not mandatory. |
| R32 | A4 | Keep GitHub evidence and templates portable | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Accepted | Adds acceptable fallback evidence paths. |
| R33 | A4 | Keep GitHub evidence and templates portable | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Accepted | Adds fallback evidence recording contract. |
| R34 | A4 | Keep GitHub evidence and templates portable | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Accepted | Preserves no-clone and target-evidence guardrails. |
| R35 | A4 | Keep GitHub evidence and templates portable | `decisions/0005-keep-github-evidence-and-templates-portable.md` | Accepted | Prevents examples and sampled repositories from becoming defaults. |

## Requirement To Plan Unit

| Requirement | Amendment | Plan Unit | Unit Status | Coverage | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | A0 | U1 | Planned | Full | Future root README update. |
| R2 | A0 | U2, U3, U4 | Planned | Full | Future template updates. |
| R3 | A0 | U1, U2, U4 | Planned | Full | Process avoids mandatory consumer root access. |
| R4 | A0 | U1, U2, U3 | Planned | Full | Stack-neutrality across root and templates. |
| R5 | A0 | U3 | Planned | Full | Optional examples and evidence binding. |
| R6 | A0 | U3 | Planned | Full | Generalize named stack wording. |
| R7 | A0 | U1, U2, U4 | Planned | Full | Guidance inventory and audit fields. |
| R8 | A0 | U1, U2, U3, U4 | Planned | Full | Pre-code recommended patterns. |
| R9 | A0 | U1, U2, U3, U4 | Planned | Full | Rule promotion guardrails. |
| R10 | A0 | U5 | Planned | Full | Research record. |
| R11 | A0 | U5 | Planned | Full | Plan, traceability, and audit. |
| R12 | A1 | U6 | Planned | Full | Stack evidence fields and guidance. |
| R13 | A1 | U6 | Planned | Full | Repository topic fields and guidance. |
| R14 | A1 | U6 | Planned | Full | Operational quality fields and guidance. |
| R15 | A1 | U6 | Planned | Full | Concern record fields. |
| R16 | A1 | U6 | Planned | Full | Cross-validation rule. |
| R17 | A2 | U7 | Planned | Full | Stack-only sampling instructions. |
| R18 | A2 | U7 | Planned | Full | Selection criteria. |
| R19 | A2 | U7 | Planned | Full | Metadata, root file, script, workflow, docs, and release inspection. |
| R20 | A2 | U7 | Planned | Full | Common, divergent, and repository-specific grouping. |
| R21 | A2 | U7 | Planned | Full | Local applicability review. |
| R22 | A2 | U7 | Planned | Full | Reproducible GitHub evidence and no external clone. |
| R23 | A3 | U8 | Planned | Full | Define `concern` before inventory instructions. |
| R24 | A3 | U8 | Planned | Full | Distinguish concern from product features, UI, dependency names, and broad categories. |
| R25 | A3 | U8 | Planned | Full | Representative concern shapes. |
| R26 | A3 | U8 | Planned | Full | Detailed concern record fields. |
| R27 | A3 | U8 | Planned | Full | GitHub evidence ladder. |
| R28 | A3 | U8 | Planned | Full | Code search and README limitations. |
| R29 | A3 | U8 | Planned | Full | Shared stack, stack-plus-domain, repository-specific grouping. |
| R30 | A3 | U8 | Planned | Full | Official docs cross-validation before recommended patterns. |
| R31 | A4 | U9 | Planned | Full | `gh` preferred but optional. |
| R32 | A4 | U9 | Planned | Full | Fallback GitHub evidence methods. |
| R33 | A4 | U9 | Planned | Full | Fallback evidence recording fields. |
| R34 | A4 | U9 | Planned | Full | No-clone and target-evidence guardrails for fallback evidence. |
| R35 | A4 | U9 | Planned | Full | Repository-neutral and stack-neutral template improvements. |

## Requirement To Artifact Persistence

| Requirement | Artifact | Expected Persistence | Actual Persistence | Decision Record | Notes |
| --- | --- | --- | --- | --- | --- |
| R1-R35 | `docs/designs/docs-dev-template-governance-20260617-q7m2/**` | Tracked | Tracked-ready new files | None | Verified by completion audit. |
| R1 | `docs/dev/README.md` | Tracked | Unchanged in this package | None | Future implementation target. |
| R2 | `docs/dev/_templates/**` | Tracked | Unchanged in this package | None | Future implementation target. |
| R12-R16 | `docs/dev/_templates/repository/_template.md` | Tracked | Unchanged in this package | None | Future implementation target for concern discovery fields. |
| R17-R22 | `docs/dev/README.md` and `docs/dev/_templates/**` | Tracked | Unchanged in this package | None | Future implementation targets for stack-only sampling instructions. |
| R23-R30 | `docs/dev/README.md` and `docs/dev/_templates/**` | Tracked | Unchanged in this package | None | Future implementation targets for concern definition and fine-grained inference instructions. |
| R31-R35 | `docs/dev/README.md` and `docs/dev/_templates/**` | Tracked | Unchanged in this package | None | Future implementation targets for fallback evidence and portability instructions. |

## Requirement To Verification

| Requirement | Amendment | Verification | Method | Scope Match | Preserved Evidence Reused | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | A0 | V1 | Future diff review | Full | No | Applies during implementation. |
| R2 | A0 | V2-V4 | Future diff review and search | Full | No | Applies during implementation. |
| R3 | A0 | V1-V4 | Review for no mandatory consumer root access | Full | No | Applies during implementation. |
| R4 | A0 | V1-V3 | Manual review and named-stack search | Full | No | Applies during implementation. |
| R5 | A0 | V3 | Manual review | Full | No | Applies during implementation. |
| R6 | A0 | V3 | Named-stack search and manual review | Full | Yes | Existing `engineering/README.md` finding reused. |
| R7 | A0 | V1, V2, V4 | Manual review | Full | No | Applies during implementation. |
| R8 | A0 | V1-V4 | Manual review | Full | No | Applies during implementation. |
| R9 | A0 | V1-V4 | Manual review | Full | Yes | Existing evidence classification reused. |
| R10 | A0 | V5 | Design package review | Full | Yes | Completed in this package. |
| R11 | A0 | V5 | Design package review | Full | Yes | Completed in this package. |
| R12 | A1 | V6 | Future diff review | Full | Yes | Applies during implementation. |
| R13 | A1 | V6 | Future diff review | Full | Yes | Applies during implementation. |
| R14 | A1 | V6 | Future diff review | Full | Yes | Applies during implementation. |
| R15 | A1 | V6 | Future diff review | Full | Yes | Applies during implementation. |
| R16 | A1 | V6 | Future diff review | Full | Yes | Applies during implementation. |
| R17 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R18 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R19 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R20 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R21 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R22 | A2 | V7 | Future diff review | Full | Yes | Applies during implementation. |
| R23 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R24 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R25 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R26 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R27 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R28 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R29 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R30 | A3 | V8 | Future diff review | Full | Yes | Applies during implementation. |
| R31 | A4 | V9 | Future diff review | Full | Yes | Applies during implementation. |
| R32 | A4 | V9 | Future diff review | Full | Yes | Applies during implementation. |
| R33 | A4 | V9 | Future diff review | Full | Yes | Applies during implementation. |
| R34 | A4 | V9 | Future diff review | Full | Yes | Applies during implementation. |
| R35 | A4 | V9 | Future diff review | Full | Yes | Applies during implementation. |

## Requirement To Completion Evidence

| Requirement | Completion Evidence | Verdict | Notes |
| --- | --- | --- | --- |
| R1 | `completion-audit.md#requirement-audit` | Pass | Design covers future root README update. |
| R2 | `completion-audit.md#requirement-audit` | Pass | Design covers all current templates by path glob. |
| R3 | `completion-audit.md#requirement-audit` | Pass | Consumer root access deferred. |
| R4 | `completion-audit.md#requirement-audit` | Pass | Stack-neutrality requirement recorded. |
| R5 | `completion-audit.md#requirement-audit` | Pass | Optional example rule recorded. |
| R6 | `completion-audit.md#requirement-audit` | Pass | Existing named-stack wording identified. |
| R7 | `completion-audit.md#requirement-audit` | Pass | Guidance inventory requirement recorded. |
| R8 | `completion-audit.md#requirement-audit` | Pass | Pre-code recommended pattern requirement recorded. |
| R9 | `completion-audit.md#requirement-audit` | Pass | Current rule evidence guardrail recorded. |
| R10 | `completion-audit.md#requirement-audit` | Pass | Research record created. |
| R11 | `completion-audit.md#requirement-audit` | Pass | Plan, traceability, and audit created. |
| R12 | `completion-audit.md#requirement-audit` | Pass | Stack evidence collection requirement recorded. |
| R13 | `completion-audit.md#requirement-audit` | Pass | Repository topic collection requirement recorded. |
| R14 | `completion-audit.md#requirement-audit` | Pass | Operational quality concern requirement recorded. |
| R15 | `completion-audit.md#requirement-audit` | Pass | Structured concern record requirement recorded. |
| R16 | `completion-audit.md#requirement-audit` | Pass | Cross-validation requirement recorded. |
| R17 | `completion-audit.md#requirement-audit` | Pass | Stack-only sampling requirement recorded. |
| R18 | `completion-audit.md#requirement-audit` | Pass | Sample selection criteria recorded. |
| R19 | `completion-audit.md#requirement-audit` | Pass | Actual sample inspection requirement recorded. |
| R20 | `completion-audit.md#requirement-audit` | Pass | Concern grouping requirement recorded. |
| R21 | `completion-audit.md#requirement-audit` | Pass | Local applicability review requirement recorded. |
| R22 | `completion-audit.md#requirement-audit` | Pass | Reproducible GitHub evidence and no-clone requirement recorded. |
| R23 | `completion-audit.md#requirement-audit` | Pass | Explicit concern definition requirement recorded. |
| R24 | `completion-audit.md#requirement-audit` | Pass | Feature/UI/dependency-name distinction recorded. |
| R25 | `completion-audit.md#requirement-audit` | Pass | Representative concern shapes recorded. |
| R26 | `completion-audit.md#requirement-audit` | Pass | Detailed concern record fields recorded. |
| R27 | `completion-audit.md#requirement-audit` | Pass | GitHub evidence ladder recorded. |
| R28 | `completion-audit.md#requirement-audit` | Pass | Code search and README limitations recorded. |
| R29 | `completion-audit.md#requirement-audit` | Pass | Cross-repository concern grouping recorded. |
| R30 | `completion-audit.md#requirement-audit` | Pass | Official docs cross-validation recorded. |
| R31 | `completion-audit.md#requirement-audit` | Pass | `gh` preferred-but-optional requirement recorded. |
| R32 | `completion-audit.md#requirement-audit` | Pass | Fallback GitHub evidence paths recorded. |
| R33 | `completion-audit.md#requirement-audit` | Pass | Fallback evidence recording contract recorded. |
| R34 | `completion-audit.md#requirement-audit` | Pass | Fallback no-clone and target-evidence guardrails recorded. |
| R35 | `completion-audit.md#requirement-audit` | Pass | Repository-neutral and stack-neutral template improvement requirement recorded. |

## Coverage Gaps

| Gap | Affected Requirements | Impact | Required Follow-Up |
| --- | --- | --- | --- |
| Target implementation not performed in this package. | R1-R9 | Future docs are not updated yet. | Run the plan after review or explicit implementation request. |
| Consumer repositories not audited. | R7-R8 | Missing guidance for specific repositories is not known yet. | Select a consumer repository and run a separate docs/dev audit. |
| Automation not selected. | R7, R9 | Gap checks remain manual review guidance. | Create a new decision before adding tooling. |
| Exact concern inventory wording not implemented. | R12-R16 | Future templates still need concrete fields. | Implement U6 in the next docs/dev update. |
| Stack-only sampling instructions not implemented. | R17-R22 | Future templates do not yet guide this workflow. | Implement U7 in the next docs/dev update. |
| Concern definition and fine-grained inference instructions not implemented. | R23-R30 | Future docs do not yet define the term or detailed GitHub inference method. | Implement U8 in the next docs/dev update. |
| Fallback evidence and explicit portability instructions not implemented. | R31-R35 | Future docs do not yet describe non-`gh` GitHub evidence paths or portability checks. | Implement U9 in the next docs/dev update. |
