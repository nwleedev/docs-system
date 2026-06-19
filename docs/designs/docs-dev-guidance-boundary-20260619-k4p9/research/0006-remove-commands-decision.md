# Remove docs/dev Commands Decision Research

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R17-R19
- Related Amendment: None
- Supersedes: `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md` recommendation to keep `_commands`
- Superseded By: None

## Research Question

`docs/dev/README.md`를 `External Repository Cross-Validation` 중심으로 강화하고 `examples/*.md`가 세부 개발 관심사와 여러 best/anti 예시 요구를 책임지는 구조로 갈 때, `docs/dev/_commands`를 지금 삭제해도 되는가? 삭제한다면 어떤 정보, 대체 책임, 검증 기준이 필요한다?

## Context

이전 설계 패키지는 `_commands`를 non-normative prompt/runbook layer로 추가하는 hybrid 구조를 권장했다. 그러나 현재 결정은 다르다. README가 외부 레포 교차검증과 완료 기준을 직접 설명하고, `_templates`가 출력 schema와 audit gate를 맡으며, `examples`가 실제 스택별 프롬프트를 담당한다면 `_commands`는 같은 절차를 반복하는 중복 계층이 된다.

삭제는 단순 파일 정리가 아니다. 기존 설계 기록이 `_commands`를 권장했고 현재 `docs/dev/README.md`와 `docs/dev/_templates/README.md`가 `_commands`를 live support folder로 참조하므로, 삭제 구현 전 source-of-truth 변경으로 취급해야 한다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User decision | User request on 2026-06-19 | 2026-06-19 | `_commands`를 지금 삭제하는 방향으로 결정했다. 필요한 추가 정보를 리서치+교차검증해야 한다. | High; direct decision input. |
| S2 | Local current docs | `docs/dev/_commands/README.md`, `research-source-pack.md`, `write-owner-guidance.md`, `audit-source-pack-coverage.md` | 2026-06-19 | `_commands`는 실행 명령이 아니라 reusable prompt/runbook이며 current rule, evidence, source pack을 소유하지 않는다. | High; current tracked files. |
| S3 | Local current docs | `docs/dev/README.md` | 2026-06-19 | live folder ownership table과 template usage section이 `_commands`를 참조한다. | High; current live reference. |
| S4 | Local current docs | `docs/dev/_templates/README.md` | 2026-06-19 | `Optional Commands` 섹션이 `_commands`를 템플릿 옆 보조 runbook으로 설명한다. | High; current live reference. |
| S5 | Current design package | `research/0003-readme-template-system-improvements.md`, `research/0005-external-repository-cross-validation.md` | 2026-06-19 | README/templates/examples 책임을 강화하면 `_commands`의 workflow 책임은 줄어든다. | High; same-package research. |
| S6 | Prior design package | `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md` | 2026-06-19 | 이전에는 templates alone이 broad prompt decomposition에 약하므로 hybrid templates + `_commands`를 권장했다. | High; conflicting local decision record. |
| S7 | Documentation framework | Diátaxis, `https://diataxis.fr/` | 2026-06-19 | 서로 다른 사용자 필요와 문서 유형을 한 artifact가 모두 떠안지 않는 것이 안전하다. | High; established documentation framework. |
| S8 | Prompt engineering official docs | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | 좋은 결과에는 명확한 지시, 참고 자료, 작업 분해, 검증이 필요하다. | High; official docs. |
| S9 | ADR guidance | Microsoft Azure Well-Architected ADR guidance, `https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record` | 2026-06-19 | 중요한 결정은 대안, 결과, 영향과 함께 기록하는 것이 적합하다. | High; official docs surfaced by SearXNG. |

## Local Reference Impact

| Reference Area | Current Reference | Required Deletion Update |
| --- | --- | --- |
| `docs/dev/README.md` folder ownership | `_commands/` owns prompt/runbook commands | Remove row and route broad workflow to README, `_templates`, `examples`, and `repository` evidence. |
| `docs/dev/README.md` template usage | "For broad target-decomposition work... use `_commands`" | Replace with "use External Repository Cross-Validation plus stack-specific `examples` prompt when available." |
| `docs/dev/_templates/README.md` reading order | Template reading order references stack-only sampling and broad input router; optional commands section references `_commands`. | Remove optional commands section; keep output contract and point broad stack details to `examples`. |
| `docs/dev/_templates/_bootstrap-audit.md` | Audit currently checks commands indirectly by checking prompt/runbook misuse and stack baseline leakage. | Keep audit checks, but phrase them as README/template/example responsibility checks. |
| Historical design docs | Older package recommends `_commands`. | Do not rewrite history. Add new decision/research record that supersedes live recommendation. |

## Responsibility Replacement Map

| Deleted Command | Former Responsibility | Replacement Owner | Required Rule |
| --- | --- | --- | --- |
| `research-source-pack.md` | Broad input classification, target inventory, evidence routing, classification, pattern obligation. | `docs/dev/README.md` target decomposition and `External Repository Cross-Validation`; `repository/_template.md` target inventory. | README must state that broad stack work starts with external repo cross-validation and repository evidence inventory. |
| `write-owner-guidance.md` | Turn target inventory into owner-folder guidance with scenario coverage and best/anti patterns. | owner-folder `_template.md` files plus `examples/*.md` stack prompt. | Templates must preserve scenario coverage, best/anti pairs, source evidence, verification, and traceability fields. |
| `audit-source-pack-coverage.md` | Check every source item or derived target for evidence, owner, classification, pattern coverage, verification, follow-up. | `_bootstrap-audit.md` plus README completion audit. | Bootstrap audit must fail if target coverage, external evidence, or best/anti extraction is missing. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| `_commands` can be deleted if README/templates/examples explicitly preserve task decomposition, output contract, and audit gate. | S2, S5 | S7, S8 | Confirmed | Deleting before strengthening README/templates/examples would reintroduce the old broad-prompt failure. |
| Deletion needs a supersession record because a prior package explicitly recommended `_commands`. | S6 | S9 | Confirmed | Historical files should remain as history, not be edited to pretend the old decision did not exist. |
| Keeping `_commands` after examples own detailed prompts creates redundant workflow entry points. | S2, S3, S4, S5 | S7 | Confirmed | If a future automation tool is built, it should be real automation rather than Markdown under `_commands`. |
| The three command responsibilities are not unique capabilities; each maps to existing or planned README/template/example/audit responsibilities. | S2, S3, S4, S5 | S8 | Confirmed | The replacement owners must be updated in the same implementation pass as deletion. |
| Current live references mean deleting only the folder is incomplete. | S3, S4 | S9 | Confirmed | Verification must search the live docs for `_commands` references after deletion. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. Delete `_commands` only | Remove the folder and leave other docs mostly unchanged. | Smallest file deletion. | Broken links and stale governance references remain. | Reject. |
| B. Delete `_commands` and update live references | Remove folder, update README and template README, keep historical design docs unchanged. | Solves current confusion with limited churn. | Requires careful responsibility replacement. | Recommended minimum. |
| C. Move `_commands` into `examples` | Preserve command text as example prompts. | Avoids losing text. | Keeps duplicated workflow text and makes `examples` heavier. | Not recommended unless specific command text is reused. |
| D. Keep `_commands` but rename to `_runbooks` | Reduces "executable command" confusion. | Less disruptive than deletion. | Still keeps a redundant prompt/runbook layer. | Rejected by current user decision. |
| E. Build real executable commands | Convert Markdown to CLI or agent commands. | Resolves "does not work" literally. | Overbuilds this repo and adds tool maintenance. | Reject. |

## Removal Readiness Checklist

Before implementing deletion, the docs package should satisfy all checks below.

| Check | Required Result |
| --- | --- |
| Source-of-truth decision | A research or decision record states that `_commands` is superseded by README + `_templates` + `examples` responsibility split. |
| Live reference cleanup | `docs/dev/README.md` and `docs/dev/_templates/README.md` no longer instruct users to open `_commands`. |
| Replacement coverage | The three deleted command workflows map to README, repository template, owner templates, examples, and bootstrap audit. |
| External validation gate | README uses `External Repository Cross-Validation`, not the narrower stack-only trigger. |
| Example ownership | `examples/*.md` requires stack-specific concerns and multiple best/anti examples when detailed guidance is requested. |
| Audit continuity | `_bootstrap-audit.md` still catches missing target coverage, missing external evidence, and local-code-as-authority mistakes. |
| Historical reference treatment | Old design packages may mention `_commands`, but current live docs and new design package mark the new direction. |

## Implementation Impact

| File | Required Implementation Update |
| --- | --- |
| `docs/dev/_commands/**` | Delete the folder. |
| `docs/dev/README.md` | Remove `_commands` ownership row and replace command usage with README/templates/examples workflow. |
| `docs/dev/_templates/README.md` | Remove `Optional Commands`; route broad stack prompt execution to `External Repository Cross-Validation` and `examples`. |
| `docs/dev/_templates/repository/_template.md` | Ensure target inventory and external validation fields replace `research-source-pack.md` obligations. |
| `docs/dev/_templates/_bootstrap-audit.md` | Ensure audit checks replace `audit-source-pack-coverage.md` obligations. |
| `examples/*.md` | Ensure detailed stack prompts require concern-by-concern external evidence and multiple best/anti examples. |

## Verification After Implementation

Run these checks after deletion.

```sh
rtk rg -n "_commands|Optional Commands|research-source-pack|write-owner-guidance|audit-source-pack-coverage" docs/dev examples
rtk rg -n "External Repository Cross-Validation|Scenario Coverage|best/anti|target inventory|completion audit" docs/dev examples
rtk git status --short --branch
```

Expected result:

- The first search returns no live `docs/dev` or `examples` references, except if a deliberate historical note is outside live docs.
- The second search proves replacement obligations still exist.
- Git status shows `_commands` deletion plus focused README/template/example updates.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | `_commands` deletion is reasonable only if implemented together with README/template/example replacement responsibilities. | S2-S5, S8 | High | R17-R19 |
| F2 | Prior `_commands` recommendation must be superseded, not silently ignored. | S6, S9 | High | R17 |
| F3 | The live docs currently contain direct `_commands` references, so folder deletion alone would leave broken guidance. | S3, S4 | High | R19 |
| F4 | The command texts do not own unique source-of-truth data; their workflows can be represented by README policy, templates, examples, and audit fields. | S2-S5 | High | R18 |
| F5 | Building real executable commands is unnecessary for the current goal because the user selected deletion and the repo's purpose is documentation governance research. | S1, S2, S5 | High | R17 |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| This record does not delete files. | Live docs still reference `_commands` until implementation starts. | Implement deletion and reference cleanup after this research is accepted. |
| No second stack example exists yet. | Examples ownership is directionally correct but not cross-stack demonstrated. | Add another stack example when a concrete target stack is selected. |
| Historical design docs still recommend `_commands`. | Search results may show conflicting old records. | Treat older records as superseded and avoid rewriting historical artifacts unless an index needs status labels. |

## Sources

- Diátaxis documentation framework: `https://diataxis.fr/`
- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- Microsoft Azure Well-Architected ADR guidance: `https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/repository/_template.md`
- `docs/dev/_templates/_bootstrap-audit.md`
- `docs/dev/_commands/README.md`
- `docs/dev/_commands/research-source-pack.md`
- `docs/dev/_commands/write-owner-guidance.md`
- `docs/dev/_commands/audit-source-pack-coverage.md`
- `examples/nextjs-frontend.md`
- `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md`
