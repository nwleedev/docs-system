# Pattern Example Coverage For Detailed Development Guidance

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R6-R8
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

실제 개발 지침 문서를 작성할 때 각 세부 관심사마다 여러 코드 예시를 포함하고, Codex가 best pattern과 anti-pattern을 직관적으로 비교해 어떤 코드를 작성해야 하는지 판단하게 하려면 어떤 문서 계약이 필요한가?

## Context

코드 예시는 시간이 지나면 낡을 수 있다. 하지만 확인 가능한 예시가 없으면 AI와 사람이 추상 규칙만 보고 임의 구현을 만들 가능성이 커진다. 따라서 목표는 예시를 제거하는 것이 아니라, 예시를 세부 관심사와 시나리오에 묶고 검증·갱신 조건을 함께 기록하는 것이다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User constraint | User request on 2026-06-19 | 2026-06-19 | 세부 관심사마다 여러 예시를 작성하고, best pattern과 anti-pattern을 비교해 어떤 코드를 써야 하는지 직관적으로 보여줘야 한다. | High; direct requirement. |
| S2 | Local docs | `docs/dev/README.md` | 2026-06-19 | 문서 예시는 intent, failure mode, impact, alternatives, verification을 설명하는 teaching artifact여야 한다. | High; current governance. |
| S3 | Local templates | `docs/dev/_templates/engineering/_template.md`, `docs/dev/_templates/architecture/_template.md` | 2026-06-19 | 현재 템플릿은 Scenario Coverage 뒤에 Best Pattern과 Anti-Pattern 섹션을 둔다. | High; current tracked files. |
| S4 | Local command runbook | `docs/dev/_commands/write-owner-guidance.md` | 2026-06-19 | owner guidance는 scenario coverage, best patterns, anti-patterns, traceability, verification을 포함해야 한다. | High; current tracked file. |
| S5 | Official documentation style guide | Google Developer Documentation Style Guide code samples, `https://developers.google.com/style/code-samples` | 2026-06-19 | 코드 샘플은 언어별 스타일과 형식 규칙을 따라야 하며, 읽기 쉬운 형태로 작성되어야 한다. | High; official docs found through SearXNG and checked by direct access. |
| S6 | Official documentation style guide | Microsoft Style Guide code examples, `https://learn.microsoft.com/en-us/style-guide/developer-content/code-examples` | 2026-06-19 | 코드 예시는 특정 기능을 구현하는 방법을 보여주는 개발자 문서 수단이다. | High; official docs found through SearXNG and checked by direct access. |
| S7 | Documentation framework | Diátaxis how-to guides, `https://diataxis.fr/how-to-guides/` | 2026-06-19 | how-to 문서는 사용자가 실제 작업을 수행하도록 돕는 문제 해결형 문서다. | High; documentation framework. |
| S8 | Prompt engineering official docs | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | 좋은 결과를 얻으려면 명확한 지시, 참고 자료, 작업 분해, 검증이 필요하다. | High; official docs. |
| S9 | Documentation best practices | Google documentation best practices, `https://google.github.io/styleguide/docguide/best_practices.html` | 2026-06-19 | 프로젝트 문서는 찾기 쉽고 유지 가능한 위치에 두어야 하며, 관련 위치에서 연결되어야 한다. | Medium; Google open style guide. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| 코드 예시는 낡을 수 있어도 개발 지침에서 제거하면 구현 판단이 약해진다. | S1 | S6, S7 | Confirmed | 예시는 버전, 적용 조건, 검증 방법을 함께 가져야 한다. |
| best/anti 예시는 단순 샘플이 아니라 비교 가능한 teaching artifact여야 한다. | S2, S3 | S5, S8 | Confirmed | 나란히 비교할 수 있는 형식이 없으면 Codex가 추상 설명만 따르게 된다. |
| 세부 관심사별 "여러 예시"는 고정 개수보다 scenario coverage matrix로 관리하는 편이 안전하다. | S3, S4 | S7, S8 | Confirmed | 최소 권장 개수는 둘 수 있지만, 실제 완료 기준은 위험 시나리오 커버리지여야 한다. |
| stale risk는 예시 금지가 아니라 evidence date, version, verification, refresh trigger로 완화해야 한다. | S5, S6 | S9 | Confirmed | 검증할 수 없는 예시는 pseudo-code 또는 future pattern으로 낮춰야 한다. |

## Example Coverage Contract

실제 owner guidance 문서가 세부 관심사를 다룰 때는 다음 계약을 요구하는 것이 좋다.

| Contract Item | Required Rule | Why It Matters |
| --- | --- | --- |
| 세부 관심사 ID | 각 관심사는 target ID, decision point, risk를 가진다. | 예시가 넓은 주제 속에 묻히지 않는다. |
| Scenario Coverage | 관심사마다 주요 작성 시나리오를 먼저 나열한다. | 예시 수가 아니라 위험 커버리지로 완료를 판단한다. |
| Pattern Pair | 각 시나리오는 best pattern과 anti-pattern을 한 쌍으로 가진다. | Codex가 작성할 코드와 피할 코드를 즉시 비교할 수 있다. |
| Side-by-side Comparison | 각 pair는 같은 문제, 같은 입력 조건, 같은 검증 관점으로 비교한다. | 서로 다른 맥락의 코드를 억지로 비교하는 오류를 줄인다. |
| Explanation Fields | best는 intent/applicability/impact/verification, anti는 failure mode/impact/safer alternative/detection을 포함한다. | 예시가 복붙 샘플이 아니라 판단 기준이 된다. |
| Stale Guard | 예시마다 source, version/date, target repo constraint, refresh trigger를 기록한다. | 낡은 예시가 current rule처럼 굳는 문제를 줄인다. |
| Verification Hook | 가능한 경우 lint, typecheck, test, code search, review checklist 중 하나와 연결한다. | 예시가 실제 확인 가능한 규칙으로 남는다. |

## Recommended Authoring Shape

세부 관심사 하나가 여러 시나리오를 가진다면, 문서 본문은 다음 순서를 따른다.

1. `Concern`: 세부 관심사, decision point, risk, owner folder, classification을 기록한다.
2. `Scenario Coverage`: 최소 2개 이상의 실제 작성 시나리오를 기록한다. 단일 시나리오만 있으면 이유를 적는다.
3. `Pattern Comparison`: 각 시나리오마다 best/anti pair를 같은 형식으로 나란히 둔다.
4. `Why The Difference Matters`: 두 코드의 차이가 runtime, review, maintainability, security, accessibility, performance, testability 중 무엇에 영향을 주는지 적는다.
5. `Verification`: 사람이 리뷰할 체크와 자동화 가능한 체크를 분리한다.
6. `Stale Example Management`: 예시가 언제 재검토되어야 하는지 기록한다.

## Example Comparison Matrix

| Field | Best Pattern | Anti-Pattern |
| --- | --- | --- |
| Scenario | 같은 시나리오 이름을 사용한다. | 같은 시나리오 이름을 사용한다. |
| Code | target repository evidence 또는 공식 문서에 맞춘 최소 코드. | 실제로 발생 가능한 잘못된 코드. |
| Why | 왜 이 코드가 의도를 드러내고 리스크를 줄이는지 설명한다. | 어떤 버그, 결합, 오해, 유지보수 비용이 생기는지 설명한다. |
| Detection | 리뷰어가 확인할 코드 모양이나 자동 체크. | grep/lint/test/review smell 같은 탐지 신호. |
| Safer Alternative | 필요하면 더 작은 대안도 적는다. | best pattern으로 연결한다. |
| Stale Trigger | 관련 API, framework version, repository boundary가 바뀔 때. | anti-pattern도 더 이상 현실적이지 않으면 제거하거나 교체한다. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. 코드 예시를 최소화한다 | 설명 중심 문서로 두고 예시는 필요한 경우만 둔다. | stale risk와 문서 유지비가 작다. | 사용자가 지적한 "아무렇게나 작성" 문제를 해결하지 못한다. | 부적합. |
| B. 관심사마다 고정 개수의 예시를 요구한다 | 모든 세부 관심사에 best 2개, anti 2개처럼 숫자를 강제한다. | 완료 여부가 단순하다. | 중요하지 않은 예시를 양산하거나 복잡한 관심사에는 부족할 수 있다. | 보조 규칙으로만 사용. |
| C. scenario coverage 기반 best/anti pair를 요구한다 | 세부 관심사의 주요 시나리오마다 비교 가능한 예시 쌍을 둔다. | 직관적 비교와 커버리지, 유지보수성을 균형 있게 잡는다. | 작성자가 시나리오를 대충 잡으면 품질이 떨어진다. | 권장. |
| D. 실행 가능한 샘플 테스트까지 요구한다 | 예시마다 runnable snippet 또는 test를 둔다. | stale risk를 가장 강하게 줄인다. | 모든 문서에 적용하면 비용이 크고, architecture/domain 문서에는 과할 수 있다. | 고위험 API/보안/테스트 지침에 선택 적용. |

## Recommendation

권장안은 C를 기본으로 하고, D를 고위험 관심사에만 적용하는 것이다.

- 각 세부 관심사는 `Scenario Coverage`를 먼저 가진다.
- 각 시나리오는 최소 하나의 best/anti pair를 가진다.
- 중요한 관심사는 최소 2개 이상의 시나리오를 요구한다.
- 단일 예시만 가능한 경우에는 `single-scenario rationale`을 기록한다.
- 예시는 target repository evidence, 공식 문서, 또는 명시적 pseudo-code 분류 중 하나에 근거해야 한다.
- 예시마다 stale trigger와 verification hook을 둔다.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | 코드 예시는 stale risk가 있지만, 직접 비교 가능한 예시가 없으면 개발 지침이 추상 규칙으로만 남는다. | S1, S6, S8 | High | R6, R7 |
| F2 | best/anti pattern은 같은 시나리오와 같은 검증 관점에서 비교해야 Codex가 작성 방향을 직관적으로 선택할 수 있다. | S2, S3, S8 | High | R6, R8 |
| F3 | 예시 개수 강제보다 scenario coverage matrix가 더 근본적인 완료 기준이다. | S3, S4, S7 | High | R6 |
| F4 | stale risk는 source/version/date/verification/refresh trigger를 예시 메타데이터로 요구해 줄이는 편이 안전하다. | S5, S6, S9 | High | R7 |
| F5 | 실행 가능한 샘플 또는 테스트는 모든 문서에 강제하지 말고, API contract, security, testing guidance 같은 고위험 세부 관심사에 우선 적용해야 한다. | S4, S6, S8 | Medium | R8 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `docs/dev/README.md` | Clarifies | "Document examples" 규칙에 scenario-based multiple example coverage와 stale guard를 추가하는 설계가 필요하다. |
| `docs/dev/_templates/*/_template.md` | Clarifies | `Pattern Pairs`를 단일 pair가 아니라 scenario별 반복 가능한 comparison matrix로 바꾸는 설계가 필요하다. |
| `docs/dev/_commands/write-owner-guidance.md` | Clarifies | target ID별 scenario count, best/anti pair coverage, stale trigger 검사를 output contract에 추가하는 설계가 필요하다. |
| `examples/*.md` | Supports | 스택별 프롬프트가 "각 세부 관심사마다 여러 비교 예시"를 명시하도록 확장할 수 있다. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| 실제 소비 레포의 잘못 작성된 코드 사례가 아직 수집되지 않았다. | anti-pattern 예시가 일반화될 위험이 있다. | 구현 단계에서 target repository evidence 또는 PR review 사례를 evidence로 연결한다. |
| 공식 문서 예시는 보통 positive sample 중심이다. | anti-pattern은 로컬 실패 사례와 리뷰 경험을 더 많이 필요로 한다. | anti-pattern은 failure mode, detection signal, safer alternative를 필수 필드로 둔다. |
| 모든 예시를 runnable하게 만들면 문서 비용이 커진다. | 지침 작성이 느려지고 템플릿이 다시 비대해질 수 있다. | runnable check는 고위험 관심사에만 적용한다. |

## Sources

- Google Developer Documentation Style Guide, Code samples: `https://developers.google.com/style/code-samples`
- Microsoft Style Guide, Code examples: `https://learn.microsoft.com/en-us/style-guide/developer-content/code-examples`
- Diátaxis How-to guides: `https://diataxis.fr/how-to-guides/`
- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- Google Documentation Best Practices: `https://google.github.io/styleguide/docguide/best_practices.html`
- `docs/dev/README.md`
- `docs/dev/_templates/engineering/_template.md`
- `docs/dev/_templates/architecture/_template.md`
- `docs/dev/_commands/write-owner-guidance.md`
