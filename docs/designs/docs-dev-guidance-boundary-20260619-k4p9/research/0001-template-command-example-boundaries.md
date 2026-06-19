# Template, Command, And Example Prompt Boundaries

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R1-R5
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

`docs/dev/_templates`, `docs/dev/_commands`, `examples/`, and `docs/dev/README.md`는 여러 기술스택의 개발 컨벤션·개발 지침 문서를 관리할 때 각각 어떤 책임을 가져야 하며, 현재 구조에서 어떤 리스크가 있는가?

## Context

이 레포는 여러 기술스택의 설계 문서와 개발 컨벤션 문서 관리 방법을 리서치+교차검증하는 저장소다. 지금까지 `_templates`와 `_commands`는 여러 레포에 재사용 가능한 파일로 구성되었지만, `_commands`가 실제 레포에서 작동하지 않았고 `_templates`는 템플릿 이상으로 실제 문서 작성 책임을 일부 포함하면서 복잡해졌다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User constraint | User request on 2026-06-19 | 2026-06-19 | `_templates`는 템플릿 본연의 역할로 되돌리고, 실제 개발 관심사는 `examples/` 프롬프트가 책임져야 한다. | High; direct requirement. |
| S2 | Local docs | `docs/dev/README.md` | 2026-06-19 | 루트 README는 portable governance, owner folder, repository evidence, `_templates`, `_commands`의 책임을 정의한다. | High; current local source of truth. |
| S3 | Local docs | `docs/dev/_templates/README.md` and `docs/dev/_templates/*/_template.md` | 2026-06-19 | 템플릿은 folder-specific authoring router라고 말하지만, 각 템플릿은 evidence, scenario coverage, best/anti pattern, verification, traceability까지 요구한다. | High; current tracked files. |
| S4 | Local docs | `docs/dev/_commands/README.md`, `research-source-pack.md`, `write-owner-guidance.md`, `audit-source-pack-coverage.md` | 2026-06-19 | `_commands`는 optional prompt/runbook이며 current rule, repository facts, source packs를 소유하지 않는다고 정의한다. | High; current tracked files. |
| S5 | Local docs | `examples/nextjs-frontend.md` | 2026-06-19 | Next.js, TanStack Query, React Hook Form, Zustand, FSD, 테스트, TypeScript, Tailwind 같은 구체 관심사가 예시 프롬프트에 들어 있다. | High; demonstrates stack-specific prompt ownership. |
| S6 | Documentation framework | Diátaxis, `https://diataxis.fr/` | 2026-06-19 | 문서는 tutorial, how-to, reference, explanation처럼 사용자 필요가 다른 유형으로 나뉜다. | High; documentation framework surfaced by SearXNG and checked by direct access. |
| S7 | Docs-as-code official docs | Backstage TechDocs, `https://backstage.io/docs/features/techdocs/creating-and-publishing/` | 2026-06-19 | docs-like-code는 문서를 코드 가까이에 두고 템플릿을 활용하지만, 문서 내용은 대상 컴포넌트/레포 맥락에서 작성된다. | High; official docs. |
| S8 | Decision record reference | ADR, `https://adr.github.io/` and Martin Fowler ADR search result | 2026-06-19 | 중요한 구조·소스오브트루스 결정은 맥락과 결과를 남기는 결정 기록으로 관리하는 것이 적합하다. | Medium; ADR community source plus established practitioner reference from SearXNG. |
| S9 | Prompt engineering official docs | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | 프롬프트는 명확한 지시, 참고 자료, 작업 분해, 반복 검증이 필요하다. | High; official docs surfaced by SearXNG and checked by direct access. |
| S10 | Developer documentation style guide | Google Developer Documentation Style Guide, `https://developers.google.com/style` | 2026-06-19 | 개발자 문서는 명확하고 일관된 작성 지침을 제공해야 한다. | High; official docs. |

## Local Findings

| Area | Observation | Risk |
| --- | --- | --- |
| `docs/dev/README.md` | 루트 README가 portable governance, target decomposition, stack-only sampling, GitHub fallback, template usage, command usage까지 한 파일에 많이 담고 있다. | 새 레포에 복사할 때 핵심 부트스트랩 흐름보다 운영 정책이 먼저 보이며, 사용자가 `_commands`를 실행 도구로 오해할 수 있다. |
| `docs/dev/_templates/**` | 템플릿 파일 7개가 총 764줄이고, 각 `_template.md`는 실제 가이드 문서의 evidence, classification, examples, verification까지 요구한다. | 템플릿이 스키마와 작성 절차를 모두 떠안아 새 레포 세팅용 템플릿으로는 무겁다. |
| `docs/dev/_commands/**` | 3개 명령 파일은 모두 Markdown 프롬프트 런북이며 실행 가능한 CLI나 에이전트 명령이 아니다. | `_commands`라는 이름이 소비 레포에서 "작동해야 하는 명령"으로 해석될 수 있다. |
| `examples/nextjs-frontend.md` | 실제 관심사 목록과 스택별 조사 범위가 예시 프롬프트에 집중되어 있다. | 책임 방향은 맞지만, 현재 README와 템플릿에도 broad target decomposition이 많이 남아 있어 중복 책임이 생긴다. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| 템플릿은 구조와 필수 필드에 집중하고, 스택별 관심사 목록은 별도 예시/입력으로 분리하는 편이 안전하다. | S1, S5 | S6, S10 | Confirmed | 템플릿에는 최소한의 routing/audit 필드는 남아야 한다. |
| `_commands`가 실제 레포에서 작동하지 않는 문제는 기능 부족보다 이름과 기대치 문제일 가능성이 크다. | S4 | S9 | Confirmed | 실제 실패 로그가 없으므로 원인 확정은 보류한다. |
| `docs/dev/README.md`는 portable governance로 유효하지만, 현재 범위가 넓어 bootstrap guide와 governance reference가 섞일 리스크가 있다. | S2 | S6, S10 | Confirmed | 한 파일 유지 자체가 문제는 아니며, 읽기 순서와 요약 구조로 완화할 수 있다. |
| 소스오브트루스 변경은 단순 템플릿 수정이 아니라 결정 기록 대상이다. | S2 | S8 | Confirmed | 구현 단계에서 실제 이동/삭제가 발생할 때 결정 기록이 필요하다. |
| docs-as-code 관점에서는 문서가 레포 가까이에 있어야 하지만, portable template이 레포별 내용을 기본값으로 품으면 안 된다. | S7 | S2, S3 | Confirmed | target repository evidence 섹션은 유지하되 실제 관심사 목록은 외부 입력이어야 한다. |

## README Risk Assessment

| Risk ID | Risk | Evidence | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| RR1 | 루트 README가 governance, process, command routing, sampling policy를 모두 담아 첫 진입 비용이 높다. | S2 | 새 레포에 복사한 사용자가 최소 세팅 순서를 놓칠 수 있다. | README 상단을 bootstrap quick path와 reference sections로 분리한다. |
| RR2 | `_commands`를 "optional commands"라고 부르지만 실제 실행 가능한 명령이 아니라 프롬프트 파일이다. | S2, S4 | 소비 레포에서 작동하지 않는다는 기대 불일치가 반복될 수 있다. | 이름을 prompt/runbook으로 바꾸거나 README에서 "not executable"을 명시한다. |
| RR3 | README가 broad target decomposition을 자세히 설명하면서 `examples/`와 책임이 겹친다. | S2, S5 | 템플릿/README가 다시 스택별 관심사 작성 책임을 흡수할 수 있다. | README에는 원칙과 routing만 남기고 실제 관심사 프롬프트는 `examples/`로 둔다. |
| RR4 | Stack-only sampling과 GitHub fallback 정책이 portable template bootstrap에는 과하다. | S2 | 간단한 레포 세팅에도 과도한 리서치 절차가 기본처럼 보일 수 있다. | 고급 리서치 절차는 examples 또는 research workflow 문서로 분리한다. |
| RR5 | Current rule 승격 기준은 강하지만, "template output"과 "final guidance output"의 구분이 약하다. | S2, S3 | 템플릿이 실제 가이드 문서 작성 책임까지 계속 비대해질 수 있다. | `_templates`는 skeleton과 checklist, `examples`는 prompt, `docs/dev/architecture` 같은 owner folder는 작성 결과로 경계를 고정한다. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. 현재 구조 유지 | `_templates`, `_commands`, README를 유지하고 문구만 보강한다. | 변경량이 가장 작고 기존 링크가 깨지지 않는다. | `_commands` 기대 불일치와 템플릿 비대화가 남는다. | 단기 hotfix로만 적합하다. |
| B. `_commands`를 실행 가능하게 만든다 | Markdown 런북을 실제 CLI/script/agent command로 바꾼다. | "작동하지 않음" 문제를 직접 해결할 수 있다. | 여러 레포와 도구 환경을 지원해야 해서 복잡도가 급증한다. 이 레포의 주목적인 리서치 문서 관리보다 도구 구현으로 무게가 이동한다. | 현재 요구에는 과하다. |
| C. `_commands`를 prompt/runbook으로 명확히 격하하고 `examples/`에 스택별 프롬프트를 둔다 | `_templates`는 구조 템플릿, README는 governance, `examples`는 실제 관심사 프롬프트, `_commands`는 비실행 런북으로 정리한다. | 기존 철학을 유지하면서 실패 원인을 줄인다. 링크도 비교적 덜 깨진다. | `_commands`라는 폴더명은 여전히 오해를 만들 수 있다. | 최소 변경 권장안. |
| D. `_commands`를 `examples/` 또는 `prompts/`로 흡수한다 | 실행되지 않는 명령 파일을 예시 프롬프트 계층으로 이동한다. | 책임 경계가 가장 선명해진다. | 기존 참조 링크와 사용 습관을 바꿔야 하며 결정 기록이 필요하다. | 중기 정리안으로 적합하다. |
| E. `_templates`를 최소 skeleton으로 축소하고 작성 지침은 examples/workflows로 분리한다 | 템플릿은 필수 heading/checklist만 남기고 작성 세부는 예시 프롬프트가 담당한다. | 템플릿 본연의 역할에 가장 가깝다. | 기존 템플릿이 제공하던 품질 게이트를 잃지 않도록 별도 checklist가 필요하다. | C와 함께 점진 적용 권장. |

## Recommendation

권장 방향은 C를 먼저 적용하고, E를 점진 적용하는 것이다.

1. `docs/dev/_templates`는 새 레포 세팅에 필요한 folder skeleton, required fields, lightweight checklist만 소유한다.
2. 실제 어떤 기술스택 관심사를 조사할지는 `examples/*.md`의 프롬프트가 소유한다.
3. `_commands`는 유지한다면 "executable command"가 아니라 "prompt/runbook"임을 README와 파일명에서 명확히 한다.
4. `docs/dev/README.md`는 portable governance로 유지하되, 상단에 짧은 bootstrap path를 두고 고급 리서치 절차는 별도 섹션 또는 예시로 밀어낸다.
5. `_commands` 이동, 삭제, 이름 변경처럼 소스오브트루스가 바뀌는 작업은 별도 decision record를 먼저 만든다.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | `_templates`가 모든 기술스택 관심사를 포함하면 템플릿이 아니라 스택별 작성 프롬프트가 되어 비대해진다. | S1, S3, S5, S6 | High | R1, R2 |
| F2 | `_commands` 실패는 현재 파일 내용상 실행 기능 문제가 아니라 기대치와 명명 문제로 다루는 편이 우선이다. | S4, S9 | Medium | R1, R3 |
| F3 | `examples/`가 실제 개발 관심사 프롬프트를 소유하도록 하는 방향은 문서 유형 분리 원칙과 맞다. | S1, S5, S6, S9 | High | R2, R4 |
| F4 | `docs/dev/README.md`는 방향 자체는 타당하지만, bootstrap guide와 governance reference가 섞인 점이 주요 리스크다. | S2, S6, S10 | High | R3 |
| F5 | 구조 변경이 실제 파일 이동이나 삭제를 포함하면 decision record가 필요하다. | S2, S8 | High | R4 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `docs/dev/README.md` | Clarifies | Bootstrap path와 advanced research policy를 분리하는 설계가 필요하다. |
| `docs/dev/_templates/**` | Clarifies | 템플릿은 skeleton/checklist 중심으로 줄이고 스택별 관심사 작성 책임을 제거하는 설계가 필요하다. |
| `docs/dev/_commands/**` | Decision needed | 유지, 이름 변경, 이동, 삭제 중 하나를 결정해야 한다. |
| `examples/**` | Supports | 스택별 관심사 프롬프트의 소유 위치로 유지하거나 확장할 수 있다. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| 실제 소비 레포에서 `_commands`가 어떻게 실패했는지 로그가 없다. | `_commands`의 결함인지 기대치 문제인지 확정할 수 없다. | 실패한 레포의 사용 경로, 에러, 사용자가 기대한 실행 방식을 수집한다. |
| 이번 문서는 구조 변경을 구현하지 않는다. | README와 템플릿 리스크는 아직 코드베이스에 남아 있다. | 별도 구현 요청에서 decision record와 파일 변경을 진행한다. |

## Sources

- Diátaxis: `https://diataxis.fr/`
- Backstage TechDocs creating and publishing docs: `https://backstage.io/docs/features/techdocs/creating-and-publishing/`
- ADR references: `https://adr.github.io/`
- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- Google Developer Documentation Style Guide: `https://developers.google.com/style`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/*/_template.md`
- `docs/dev/_commands/README.md`
- `docs/dev/_commands/research-source-pack.md`
- `docs/dev/_commands/write-owner-guidance.md`
- `docs/dev/_commands/audit-source-pack-coverage.md`
- `examples/nextjs-frontend.md`
