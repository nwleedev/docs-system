# README And Template System Improvements

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R9-R11
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

현재 이슈를 해결하려면 `docs/dev/README.md`와 `docs/dev/_templates` 시스템을 어떻게 개선해야 하는가? 특히 `_templates`에는 `_template.md`뿐 아니라 각 folder `README.md`와 `_templates/README.md`, `_bootstrap-audit.md`도 있으므로 각 파일 계층은 어떤 책임을 가져야 하는가?

## Context

현재 구조는 방향성은 맞지만 책임이 겹친다. `docs/dev/README.md`와 `docs/dev/_templates/README.md` 모두 target decomposition, repository evidence, stack-only sampling, GitHub fallback, pattern coverage를 설명한다. folder README들은 비교적 짧지만, `_template.md`는 실제 문서 작성의 많은 세부를 담고 있다. 이 상태에서 템플릿을 더 강화하면 여러 기술스택 관심사가 다시 템플릿에 들어와 비대해질 수 있다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User constraint | User request on 2026-06-19 | 2026-06-19 | `docs/dev/README.md`와 `_templates` 시스템을 함께 개선해야 하며, `_template.md`뿐 아니라 folder README도 검토해야 한다. | High; direct requirement. |
| S2 | Local docs | `docs/dev/README.md` | 2026-06-19 | 루트 README는 portable governance, folder ownership, reading order, target decomposition, sampling, fallback, completion audit를 모두 담고 있다. | High; current source of truth. |
| S3 | Local docs | `docs/dev/_templates/README.md` | 2026-06-19 | template root README도 placement router, target router, broad input router, evidence routing, sampling, fallback, completion rules를 담고 있다. | High; current tracked file. |
| S4 | Local docs | `docs/dev/_templates/*/README.md` | 2026-06-19 | folder README들은 target output, use when, do not use for, cross-check, completion check를 담고 있다. | High; current tracked files. |
| S5 | Local docs | `docs/dev/_templates/*/_template.md` | 2026-06-19 | body templates는 target evidence, repository baseline, linked targets, source evidence, scenario coverage, pattern pairs, verification, completion check를 담고 있다. | High; current tracked files. |
| S6 | Local docs | `docs/dev/_templates/_bootstrap-audit.md` | 2026-06-19 | bootstrap audit는 created structure, evidence promotion, target inventory, decomposition coverage, pattern coverage, stack sampling, fallback evidence, independence checks를 검증한다. | High; current tracked file. |
| S7 | Documentation framework | Diátaxis, `https://diataxis.fr/`, `https://diataxis.fr/reference/`, `https://diataxis.fr/how-to-guides/` | 2026-06-19 | 문서 유형은 목적에 따라 나뉘어야 하며, reference와 how-to는 서로 다른 사용자 요구를 처리한다. | High; established documentation framework, checked by direct access. |
| S8 | Documentation templates | The Good Docs Project templates, `https://www.thegooddocsproject.dev/template` | 2026-06-19 | 문서 템플릿은 콘텐츠 타입별로 기본 구조와 작성 안내를 제공한다. | High; documentation template project, checked by direct access. |
| S9 | README guidance | Make a README, `https://www.makeareadme.com/` | 2026-06-19 | README는 프로젝트를 소개하고 시작 방법을 알려주는 진입점 역할을 한다. | Medium; widely used README guidance, checked by direct access. |
| S10 | Docs-as-code | Write the Docs docs-as-code, `https://www.writethedocs.org/guide/docs-as-code/` | 2026-06-19 | 문서는 코드와 같은 저장소 흐름에서 관리될 수 있으며, 유지보수 가능한 구조와 리뷰 흐름이 중요하다. | Medium; community guidance, checked by direct access. |
| S11 | Official style guide | Google Developer Documentation Style Guide, `https://developers.google.com/style` | 2026-06-19 | 개발자 문서는 명확하고 일관된 지침이어야 한다. | High; official docs, previously checked. |

## Current Layer Map

| Layer | Current Files | Current Responsibility | Risk |
| --- | --- | --- | --- |
| Root governance | `docs/dev/README.md` | 전체 folder ownership, reading order, target decomposition, sampling/fallback, template usage, completion audit. | portable governance와 advanced workflow가 섞여 첫 진입 비용이 높다. |
| Template system router | `docs/dev/_templates/README.md` | template reading order, placement router, broad input router, evidence lanes, sampling/fallback, common completion rules. | root README와 중복되고, template router가 workflow guide까지 떠안는다. |
| Folder template guide | `docs/dev/_templates/*/README.md` | 해당 owner folder의 target output, use/do-not-use, cross-check, completion check. | 비교적 적절하지만 folder README가 실제 output folder README와 혼동될 수 있다. |
| Body skeleton | `docs/dev/_templates/*/_template.md` | 실제 guidance 문서의 전체 body skeleton과 예시 작성 필드. | 문서 작성 세부가 많아 템플릿이 복잡하고 스택별 관심사가 들어올 유혹이 크다. |
| Bootstrap audit | `docs/dev/_templates/_bootstrap-audit.md` | 새 레포 세팅 또는 큰 재구성의 검증표. | audit가 template folder 안에 있어 작성 템플릿인지 검증 템플릿인지 경계가 흐릴 수 있다. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| root README는 진입점과 governance를 맡고, 상세 작성 방법은 하위 문서로 내려야 한다. | S2, S9 | S7, S11 | Confirmed | 이 레포의 README는 governance 성격이 강하므로 완전히 짧게 만들 필요는 없다. |
| template README는 template catalog와 사용법 reference에 집중하고, broad workflow는 examples 또는 workflow 문서로 분리하는 편이 안전하다. | S3, S8 | S7, S10 | Confirmed | template README에는 최소 routing table은 남아야 한다. |
| folder README와 `_template.md`는 서로 다른 역할이어야 한다. | S4, S5 | S7, S8 | Confirmed | folder README는 선택 기준, `_template.md`는 작성 skeleton으로 제한한다. |
| `_template.md`가 세부 개발 관심사까지 포함하면 여러 기술스택용 템플릿으로서 실패할 가능성이 크다. | S1, S5 | S7, S8 | Confirmed | 세부 관심사 예시는 examples 프롬프트 또는 owner guidance 결과물에 있어야 한다. |
| bootstrap audit는 작성 템플릿과 분리된 quality gate로 유지해야 한다. | S6 | S10, S11 | Confirmed | 위치는 유지해도 제목과 README 설명에서 audit-only 성격을 명확히 해야 한다. |

## Layered Improvement Model

| Layer | Keep | Move Or Reduce | Add Or Clarify |
| --- | --- | --- | --- |
| `docs/dev/README.md` | folder ownership, source-of-truth rules, before-implementation reading order, current-rule promotion rule. | stack-only sampling, GitHub fallback, broad prompt execution 세부는 짧은 링크/요약으로 축소. | "Quick Bootstrap Path"와 "Advanced Research Workflows"를 분리한다. |
| `docs/dev/_templates/README.md` | template catalog, placement router, each file type responsibility. | broad input router, evidence lanes, sampling/fallback 세부는 examples/workflow로 이동하거나 요약. | README files and `_template.md` files have different roles를 명시한다. |
| `docs/dev/_templates/*/README.md` | target output, use when, do not use for, cross-check, completion check. | long evidence policy나 stack-specific guidance는 제거. | output folder README와 혼동되지 않도록 "template guide, not generated output"을 명시한다. |
| `docs/dev/_templates/*/_template.md` | minimal body skeleton, required tables, completion check. | verbose explanatory instructions와 broad target decomposition은 제거. | scenario-based pattern comparison placeholder를 반복 가능한 block으로 정리한다. |
| `docs/dev/_templates/_bootstrap-audit.md` | bootstrap/reorganization verification. | source pack inventory 세부가 너무 길면 별도 audit section으로 접는다. | audit-only, not authoring template임을 명시한다. |
| `examples/*.md` | stack-specific prompt, detailed concern list, example expectations. | portable governance나 current rule은 넣지 않는다. | "for each detailed concern, produce scenario-based best/anti pairs"를 프롬프트에 명시한다. |

## Recommended File Responsibilities

### `docs/dev/README.md`

역할은 portable governance다. 이 파일은 다른 레포에 복사되어도 이해되는 최상위 규칙만 가져야 한다.

- 유지: folder ownership, source-of-truth boundaries, reading order, rule promotion, repository evidence ownership, decision record triggers.
- 축소: GitHub fallback 세부 표, stack-only sampling 세부 절차, command/runbook 실행 세부.
- 추가: 빠른 세팅 흐름과 고급 리서치 흐름의 분리.

### `docs/dev/_templates/README.md`

역할은 template catalog와 authoring router다. 이 파일은 "어떤 템플릿 파일을 열어야 하는지"를 빠르게 알려줘야 한다.

- 유지: placement router, folder README와 body template 매핑.
- 축소: root README와 중복되는 governance 설명.
- 추가: `README.md`는 선택 기준이고 `_template.md`는 본문 skeleton이라는 구분.

### `docs/dev/_templates/*/README.md`

역할은 folder-specific template guide다. 생성될 `docs/dev/engineering/README.md` 같은 output folder README 자체가 아니다.

- 유지: target output, use when, do not use for, cross-check, completion check.
- 축소: stack-specific 또는 broad workflow 규칙.
- 추가: "이 파일은 template 사용 안내이며, output folder README로 복사하지 않는다"는 문장.

### `docs/dev/_templates/*/_template.md`

역할은 generated document skeleton이다. 실제 기술스택 관심사 목록은 포함하지 않는다.

- 유지: required sections, target repository evidence, linked targets, source evidence, scenario coverage, pattern comparison, verification, completion check.
- 축소: 긴 설명문, root/folder README와 중복되는 policy.
- 추가: multiple scenario best/anti pair block과 stale example metadata.

### `docs/dev/_templates/_bootstrap-audit.md`

역할은 quality gate다. authoring template와 분리된 완료 검증표로 유지한다.

- 유지: created structure, evidence promotion, independence checks, pattern coverage.
- 축소: root README나 repository template와 중복되는 설명.
- 추가: README/template layer responsibility check.

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. 문구만 보강 | 현재 파일 구조를 유지하고 각 README에 경계 문장만 추가한다. | 가장 작고 링크 안정성이 높다. | 중복 설명과 템플릿 비대화가 계속된다. | 단기 보완책. |
| B. root README 중심으로 통합 | `_templates/README.md`와 folder README를 줄이고 root README에 대부분 둔다. | source of truth가 하나라 단순하다. | root README가 더 커져 진입성이 나빠진다. | 비권장. |
| C. template catalog와 body skeleton 분리 | root README는 governance, `_templates/README.md`는 catalog, folder README는 선택 기준, `_template.md`는 skeleton으로 축소한다. | 책임 경계가 선명하고 기존 구조를 보존한다. | 중복 제거 작업이 필요하다. | 권장. |
| D. `_templates`를 `_templates`와 `_audits`로 분리 | authoring template와 bootstrap audit를 물리적으로 나눈다. | audit-only 성격이 명확해진다. | 링크와 기존 습관을 바꾸며 decision record가 필요하다. | 중기 검토안. |
| E. examples 중심으로 재편 | broad workflows와 stack-specific guidance prompt를 모두 `examples/`로 이동한다. | 템플릿 비대화를 강하게 막는다. | examples가 workflow와 prompt를 모두 떠안아 다시 커질 수 있다. | C 이후 필요한 만큼만 적용. |

## Recommendation

권장안은 C다. 구현은 큰 이동 없이도 가능하다.

1. `docs/dev/README.md` 상단에 "quick bootstrap"을 두고, 고급 리서치 절차는 짧은 링크형 요약으로 내린다.
2. `docs/dev/_templates/README.md`는 template catalog와 layer responsibility map 중심으로 줄인다.
3. `docs/dev/_templates/*/README.md`는 "template usage guide"로 고정하고 output folder README와 혼동되지 않게 한다.
4. `docs/dev/_templates/*/_template.md`는 skeleton과 required fields만 남기고, 세부 관심사 목록은 `examples/` prompt에서 받도록 한다.
5. `_bootstrap-audit.md`는 유지하되 audit-only quality gate임을 명확히 하고, README/template layer responsibility check를 추가한다.
6. `_commands`는 실행 명령이 아니므로 별도 구현 단계에서 `prompt/runbook` 명칭을 강화하거나 이동 결정을 검토한다.

## Proposed Improvement Checklist

| Check | Expected Result |
| --- | --- |
| Root README entry path | 새 레포 세팅에 필요한 최소 순서가 7단계 이하로 보인다. |
| Template root README | 어떤 folder README와 `_template.md`를 써야 하는지 빠르게 고를 수 있다. |
| Folder README | "Use when / Do not use for / Target output / Completion check"만으로 선택 기준을 제공한다. |
| Body template | 실제 문서 skeleton이며, 특정 스택 관심사 목록을 포함하지 않는다. |
| Example ownership | 세부 관심사와 여러 best/anti 예시 요구는 `examples/*.md` 또는 사용자 프롬프트가 제공한다. |
| Audit | 레포 세팅 결과가 template 경계, pattern coverage, stack neutrality를 통과했는지 확인한다. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | 현재 root README와 `_templates/README.md`는 모두 workflow와 governance를 설명해 중복이 있다. | S2, S3 | High | R9 |
| F2 | folder README는 유지 가치가 있다. 단, output README가 아니라 template 선택 안내라는 점을 더 명확히 해야 한다. | S4, S7, S8 | High | R10 |
| F3 | `_template.md`는 실제 문서 skeleton으로 제한해야 하며, 기술스택별 관심사 목록을 포함하면 템플릿 본연의 역할을 잃는다. | S1, S5, S8 | High | R10, R11 |
| F4 | `_bootstrap-audit.md`는 작성 템플릿이 아니라 quality gate로 유지하되, template layer responsibility 검사를 추가해야 한다. | S6, S10, S11 | High | R10 |
| F5 | 가장 안전한 개선은 기존 파일 위치를 유지하면서 각 계층의 책임과 중복을 줄이는 점진 개편이다. | S2-S11 | High | R9-R11 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `docs/dev/README.md` | Clarifies | quick bootstrap, governance reference, advanced research workflow를 분리하는 설계가 필요하다. |
| `docs/dev/_templates/README.md` | Simplifies | placement catalog와 layer responsibility map 중심으로 축소하는 설계가 필요하다. |
| `docs/dev/_templates/*/README.md` | Clarifies | template usage guide임을 명시하고 output README와 혼동되지 않게 한다. |
| `docs/dev/_templates/*/_template.md` | Simplifies | skeleton과 반복 가능한 pattern comparison block 중심으로 줄인다. |
| `docs/dev/_templates/_bootstrap-audit.md` | Clarifies | audit-only quality gate와 layer responsibility check를 추가한다. |
| `examples/*.md` | Supports | stack-specific concern lists와 multiple example requirements를 계속 소유한다. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| 실제 소비 레포에서 어떤 template file을 가장 자주 잘못 복사하는지 근거가 없다. | folder README와 output README 혼동 정도를 확정하기 어렵다. | 다음 구현 전에 실패한 레포 사례나 사용 로그를 수집한다. |
| 현재 문서는 개선 방향만 제시하고 직접 수정하지 않는다. | 중복과 비대화 리스크는 아직 남아 있다. | 별도 구현 요청에서 README와 template diff를 작성한다. |
| `_commands` 위치 변경은 기존 링크를 깨뜨릴 수 있다. | 단순 리네임도 decision record가 필요하다. | 구현 단계에서 유지, alias, 이동 중 하나를 결정한다. |

## Sources

- Diátaxis: `https://diataxis.fr/`
- Diátaxis Reference: `https://diataxis.fr/reference/`
- Diátaxis How-to guides: `https://diataxis.fr/how-to-guides/`
- The Good Docs Project templates: `https://www.thegooddocsproject.dev/template`
- Make a README: `https://www.makeareadme.com/`
- Write the Docs, Docs as Code: `https://www.writethedocs.org/guide/docs-as-code/`
- Google Developer Documentation Style Guide: `https://developers.google.com/style`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/*/README.md`
- `docs/dev/_templates/*/_template.md`
- `docs/dev/_templates/_bootstrap-audit.md`
