# README-Only Authoring Guardrails

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R12-R13
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

별도 `PROHIBITION.md` 또는 `PROHIBITIONS.md` 파일을 추가하지 않고 `docs/dev/README.md`를 강화하는 방식으로, Codex가 `docs/dev` 파일을 작성·관리할 때의 금지사항과 작성 guardrail을 충분히 전달할 수 있는가?

## Context

이전 검토에서는 별도 prohibition 파일이 "빠른 금지 체크리스트"로는 유용할 수 있지만, `docs/dev/ai/README.md`와 책임이 겹칠 수 있다고 보았다. 이번 검토는 새 파일을 만들지 않고 README 안에 금지·주의 규칙을 배치하는 선택지를 평가한다.

현재 `docs/dev/README.md`는 231줄이며 이미 folder ownership, target decomposition, reading order, source evidence policy, portability checks, template usage, completion audit를 포함한다. 따라서 README 강화는 발견 가능성이 높지만, 무작정 내용을 더하면 진입성이 나빠진다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User constraint | User request on 2026-06-19 | 2026-06-19 | 별도 파일이 아니라 README를 강화하는 방안도 교차검증해야 한다. | High; direct requirement. |
| S2 | Local docs | `docs/dev/README.md` | 2026-06-19 | 현재 README는 이미 portable governance의 canonical base이며 여러 금지성 규칙을 포함한다. | High; current source of truth. |
| S3 | Local docs | `docs/dev/ai/README.md` | 2026-06-19 | AI working rules는 `docs/dev/ai`가 소유하며, 세부 AI 규칙은 repo evidence가 있을 때 추가한다. | High; current owner boundary. |
| S4 | Local research | `research/0001-template-command-example-boundaries.md` | 2026-06-19 | README는 유효하지만 bootstrap guide와 governance reference가 섞이는 리스크가 있다. | High; prior local research. |
| S5 | Local research | `research/0003-readme-template-system-improvements.md` | 2026-06-19 | README는 quick bootstrap과 governance reference를 분리하는 방향이 권장된다. | High; prior local research. |
| S6 | Contributor guidelines | GitHub Docs, `https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors` | 2026-06-19 | 기여자가 좋은 작업을 하도록 별도 guideline 파일을 둘 수 있다. | High; official docs checked by direct access. |
| S7 | Prompt engineering | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | 명확한 지시, 참고 자료, 작업 분해, 검증이 모델 출력 품질에 중요하다. | High; official docs checked by direct access. |
| S8 | Prompt engineering | Anthropic prompting best practices, `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` | 2026-06-19 | 명확성, 예시, 구조화된 맥락은 agentic workflow에서 중요하다. | High; official docs checked by direct access. |
| S9 | Developer documentation style | Google Developer Documentation Style Guide, `https://developers.google.com/style` | 2026-06-19 | 개발자 문서는 명확하고 일관되어야 한다. | High; official docs checked previously. |
| S10 | Documentation framework | Diátaxis, `https://diataxis.fr/` | 2026-06-19 | 문서 유형은 사용자 필요에 따라 나누는 것이 좋다. | High; official framework page found through SearXNG and checked previously. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| README 강화는 별도 파일보다 발견 가능성이 높다. | S2 | S6 | Confirmed | README가 이미 길어서 상단 배치가 아니면 묻힐 수 있다. |
| 금지사항은 README에 둘 수 있지만, 세부 AI behavior rule까지 README가 소유하면 `docs/dev/ai`와 충돌한다. | S2, S3 | S10 | Confirmed | README는 summary guardrail, `ai/`는 detailed AI rule로 분리해야 한다. |
| Codex에게 금지사항을 전달하려면 추상 원칙보다 짧고 명확한 checklist가 효과적이다. | S7, S8 | S9 | Confirmed | 부정형만 나열하면 대체 행동이 불명확할 수 있으므로 "Do not / Instead" 형태가 좋다. |
| 새 파일을 만들지 않는 README-only 방식은 링크·소유권 변경을 줄인다. | S2, S5 | S6 | Confirmed | README 비대화가 주요 trade-off다. |

## README-Only Option

별도 prohibition 파일을 만들지 않는다면, `docs/dev/README.md`에는 긴 금지 문서가 아니라 상단 근처의 짧은 `Authoring Guardrails` 섹션을 둔다.

권장 위치는 `Purpose` 다음, `Development Guidance Targets` 전이다. 이유는 이 섹션이 모든 작성·수정 작업 전에 읽혀야 하기 때문이다.

권장 형식은 다음과 같다.

| Do Not | Instead |
| --- | --- |
| 특정 기술스택, source list, item count, worked example을 portable baseline으로 만들지 않는다. | target repository evidence와 examples prompt를 분리한다. |
| repository evidence 없이 current rule을 쓰지 않는다. | `Open Question`, `Local Constraint`, `Recommended Future Pattern`, `Not Applicable`로 분류한다. |
| `repository/`에 current rule을 작성하지 않는다. | current rule은 owner folder에 두고 `repository/`는 evidence만 소유한다. |
| `_templates`에 실제 기술스택 관심사 목록을 넣지 않는다. | 세부 관심사 목록은 `examples/` 프롬프트나 target inventory가 제공한다. |
| `_commands`를 실행 가능한 명령처럼 설명하지 않는다. | prompt/runbook이라고 명시한다. |
| code example을 source, applicability, verification 없이 current guidance처럼 쓰지 않는다. | scenario-based best/anti pair와 stale trigger를 기록한다. |
| 기존 docs/dev guidance를 삭제·이동·대체하면서 decision record를 생략하지 않는다. | source-of-truth 변경은 `decisions/`에 기록한다. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. README만 강화하지 않음 | 기존 README와 `ai/` 구조 유지 | 변경 없음 | 금지사항이 여러 섹션에 흩어져 Codex가 놓칠 수 있다. | 부족함. |
| B. README 상단에 짧은 guardrail table 추가 | 별도 파일 없이 5-7개 금지/대체 행동만 추가 | 발견 가능성 높고 새 소스오브트루스가 생기지 않는다. | README가 조금 더 길어진다. | 권장. |
| C. README에 긴 prohibition section 추가 | 별도 파일 없이 모든 금지사항을 README에 상세히 기록 | 한 파일에서 모두 확인 가능 | README 비대화가 심하고 `ai/`와 중복된다. | 비권장. |
| D. README에는 요약, `ai/`에는 상세 규칙 | README guardrail은 짧게 두고 상세 AI behavior는 `docs/dev/ai`에 둔다 | 현재 소유권과 일관되고 확장 가능 | 상세 규칙은 한 번 더 들어가야 한다. | B와 함께 권장. |

## Recommendation

README 강화는 별도 prohibition 파일보다 먼저 시도할 가치가 있다. 단, 강화 범위는 짧아야 한다.

권장안은 B+D다.

1. `docs/dev/README.md` 상단에 `Authoring Guardrails` 섹션을 추가한다.
2. 섹션은 5-7개 `Do Not / Instead` 행으로 제한한다.
3. 세부 AI behavior 규칙은 `docs/dev/ai/`가 계속 소유한다.
4. README guardrail에는 `docs/dev` 작성·관리의 금지사항만 넣고, 기술스택별 coding rule은 넣지 않는다.
5. 이후 같은 금지사항이 늘어나 10개를 넘거나 사례 기반 설명이 필요해지면 그때 별도 `docs/dev/ai/prohibitions.md` 또는 `docs/dev/PROHIBITIONS.md`를 재검토한다.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | README-only 강화는 단일 진입점 장점을 살리며, 별도 파일 추가보다 링크와 소유권 변경이 작다. | S2, S5, S6 | High | R12 |
| F2 | README가 이미 길기 때문에 긴 prohibition 본문을 추가하면 기존 리스크를 키운다. | S2, S4, S5 | High | R13 |
| F3 | 금지사항은 "Do Not / Instead" 형태의 짧은 표가 Codex에게 가장 실용적이다. | S7, S8, S9 | Medium | R12-R13 |
| F4 | 상세 AI 규칙은 `docs/dev/ai`가 소유해야 하며 README는 guardrail summary만 소유해야 한다. | S2, S3, S10 | High | R13 |
| F5 | README guardrail이 10개 이상으로 늘어나면 별도 prohibition 파일을 다시 검토해야 한다. | S2, S6, S10 | Medium | R13 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `docs/dev/README.md` | Clarifies | `Purpose` 다음에 짧은 `Authoring Guardrails` 표를 추가하는 설계가 필요하다. |
| `docs/dev/ai/README.md` | No change initially | README guardrail이 상세 AI behavior를 대체하지 않는다는 경계를 유지한다. |
| `docs/dev/_templates/README.md` | No change initially | template catalog 역할을 유지한다. |
| `docs/dev/_templates/_bootstrap-audit.md` | Future optional | guardrail 준수 여부를 audit check로 추가할 수 있다. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| 실제 Codex가 어떤 README 섹션을 자주 놓치는지 측정 자료가 없다. | 상단 배치가 충분한지 확정하기 어렵다. | 구현 후 반복 사용에서 누락 사례를 수집한다. |
| 금지사항 수가 증가할 가능성이 있다. | README-only 방식이 장기적으로 다시 비대해질 수 있다. | guardrail이 10개를 넘으면 별도 파일 또는 `docs/dev/ai` 상세 문서로 분리한다. |

## Sources

- GitHub Docs, contributor guidelines: `https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors`
- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- Anthropic prompting best practices: `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices`
- Google Developer Documentation Style Guide: `https://developers.google.com/style`
- Diátaxis: `https://diataxis.fr/`
- `docs/dev/README.md`
- `docs/dev/ai/README.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0001-template-command-example-boundaries.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0003-readme-template-system-improvements.md`
