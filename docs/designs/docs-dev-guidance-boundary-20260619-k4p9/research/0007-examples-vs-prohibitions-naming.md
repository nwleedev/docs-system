# Examples Versus Prohibitions Naming

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R20-R23
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

`examples/` 폴더를 `prohibitions/`로 이름 변경하면, AI가 각 기술스택 레포에서 무엇을 하면 안 되는지 더 명확히 이해하는 데 도움이 되는가? 아니면 현재 폴더가 맡는 스택별 관심사, best pattern, anti-pattern, 외부 레포 교차검증 프롬프트 책임을 너무 좁히는가?

## Context

현재 `examples/nextjs-frontend.md`는 금지사항 목록이 아니다. 이 파일은 Next.js 기반 애플리케이션에서 조사해야 할 세부 개발 관심사를 나열하고, 각 관심사마다 올바른 코드 작성 방법, 디자인 패턴, 모듈 아키텍처, best-practice code pattern, anti-pattern example을 리서치+교차검증해 `docs/dev`에 문서화하라고 요구한다.

따라서 `prohibitions/`는 AI에게 "하지 말아야 할 것"을 강하게 전달하는 장점이 있지만, 폴더가 실제로 소유해야 하는 positive guidance, external repository research, best pattern examples, verification, ESLint enforcement 요구를 가릴 수 있다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User proposal | User request on 2026-06-19 | 2026-06-19 | `examples`를 `prohibitions`로 바꾸면 AI에게 각 기술스택 레포에서 하면 안 되는 것을 명확히 전달할 수 있다. 이후 `examples` 네이밍 유지와 자유 형식 작성, 최상단 공통 지침 배치를 선택했다. | High; direct proposal and later clarification. |
| S2 | Local prompt | `examples/nextjs-frontend.md` | 2026-06-19 | 현재 파일은 금지사항뿐 아니라 올바른 코드 작성법, 패턴, 아키텍처, best/anti 예시, ESLint 설정을 요구한다. | High; current tracked file. |
| S3 | Local research | `research/0002-pattern-example-coverage.md` | 2026-06-19 | 세부 관심사별 best/anti pair는 같은 시나리오에서 비교되어야 하며, anti-pattern만으로는 작성 방향이 부족하다. | High; same-package research. |
| S4 | Local research | `research/0004-readme-authoring-guardrails.md` | 2026-06-19 | 금지사항은 `Do Not / Instead` 형태가 실용적이며, 부정형만 나열하면 대체 행동이 불명확할 수 있다. | High; same-package research. |
| S5 | Local research | `research/0005-external-repository-cross-validation.md` | 2026-06-19 | 개발 지침은 do/don't guidance, verification signals, tooling constraints, migration risks를 함께 추출해야 한다. | High; same-package research. |
| S6 | Prompt engineering official docs | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | 좋은 결과에는 명확한 지시, 참고 자료, 작업 분해, 검증이 필요하다. | High; official docs found by SearXNG. |
| S7 | Prompting official docs | Anthropic prompting best practices, `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` | 2026-06-19 | 복잡한 프롬프트는 instructions, context, examples, inputs를 구분해야 한다. | High; official docs found by SearXNG. |
| S8 | Developer documentation style | Google Developer Documentation Style Guide word list, `https://developers.google.com/style/word-list` | 2026-06-19 | "anti-pattern" 같은 명명보다 피해야 할 practice를 구체적으로 설명하는 표현이 권장될 수 있다. | Medium; official style guide search result. |
| S9 | Official anti-pattern docs | Google Cloud Apigee anti-patterns introduction, `https://docs.cloud.google.com/apigee/docs/api-platform/antipatterns/intro` | 2026-06-19 | anti-pattern은 best practice의 반대 개념이며, 잘못된 practice를 설명할 때 유효하다. | Medium; official docs search result. |

## Current Responsibility Fit

| Candidate Name | Fits Current Content | Misleading Part |
| --- | --- | --- |
| `examples/` | 현재 파일이 스택별 프롬프트 예시이고 best/anti code example 요구도 담고 있다는 점과 맞다. | "예시"라는 이름만 보면 AI가 금지사항보다 sample prompt 정도로 약하게 볼 수 있다. |
| `prohibitions/` | AI에게 "하지 말아야 할 것"을 강하게 신호한다. | 현재 파일의 research, best pattern, architecture, ESLint, external validation 책임을 가린다. |
| `guardrails/` | 금지와 대체 행동을 함께 담을 수 있다. | 스택별 상세 관심사 prompt라는 성격이 약해질 수 있다. |
| `prompt-packs/` | 실제 목적이 스택별 실행 프롬프트임을 드러낸다. | "하지 말아야 할 것" 신호는 약하다. |
| `stack-guidance-prompts/` | 기술스택별 개발 지침 작성 프롬프트임을 가장 직접적으로 드러낸다. | 폴더명이 길다. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| `prohibitions`는 "하지 말아야 할 것"을 강조하는 데 효과적이다. | S1 | S4, S9 | Confirmed | 이름만 바꾸면 대체 행동과 best pattern이 약해질 수 있다. |
| 현재 `examples` 파일의 실제 책임은 prohibition보다 넓다. | S2 | S3, S5 | Confirmed | 파일 내용을 금지사항 중심으로 재작성한다면 `prohibitions`도 가능하다. |
| AI 지시 품질은 부정형 금지사항만이 아니라 명확한 지시, 참고 자료, 작업 분해, 검증으로 올라간다. | S6 | S7 | Confirmed | 금지 섹션은 중요하지만 전체 프롬프트 구조의 일부여야 한다. |
| best/anti 비교가 목표라면 폴더명은 anti만 강조하기보다 pair 또는 guidance를 드러내는 편이 안전하다. | S3 | S5, S8 | Confirmed | "anti-pattern catalog" 같은 별도 산출물이 필요하면 하위 섹션으로 둘 수 있다. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. Rename `examples/` to `prohibitions/` | 폴더 전체를 금지 중심으로 바꾼다. | AI에게 금지 의도가 강하게 전달된다. | 현재 positive guidance와 external research 책임을 좁히고, best pattern 작성을 약화할 수 있다. | 비권장. |
| B. Keep `examples/` and add common top guidance only | 폴더명은 유지하고 각 파일 최상단에 공통 요구만 둔 뒤 나머지는 자유 형식으로 작성한다. | 기존 의미를 보존하고, 스택마다 다른 프롬프트 형태를 허용하면서 "하지 말 것"과 "대신 할 것"을 상단에서 환기한다. | 폴더명만 보고는 금지 의도가 약할 수 있고, 작성자가 공통 지침을 본문에서 충분히 반영하지 않을 수 있다. | 권장. |
| C. Rename to `guardrails/` | 금지와 대체 행동을 함께 표현한다. | prohibition보다 덜 좁고 AI 지시로 자연스럽다. | 실제 "스택별 프롬프트 예시"라는 성격은 약해진다. | 중간안. |
| D. Rename to `stack-guidance-prompts/` | 폴더 목적을 명확히 드러낸다. | research, guidance, examples, prohibitions를 모두 포괄한다. | 이름이 길고 다소 설명적이다. | 구조 명확성 우선이면 권장. |
| E. Split into `examples/` and `prohibitions/` | 예시 프롬프트와 금지 카탈로그를 분리한다. | 책임 경계는 선명하다. | 파일 수와 동기화 비용이 늘고, 금지/대체 행동이 분리될 수 있다. | 지금은 과함. |

## Recommendation

권장안은 B다. 폴더명을 `prohibitions/`로 바꾸지 말고, 각 스택별 프롬프트 파일 최상단에 공통 지침을 둔 뒤 나머지는 자유 형식으로 작성한다.

이유는 간단하다.

1. 현재 파일은 prohibition이 아니라 스택별 개발 지침 작성 프롬프트다.
2. AI에게 필요한 것은 "하지 말라"뿐 아니라 "대신 무엇을 해야 하는가"다.
3. best/anti 예시는 pair로 비교되어야 하므로 anti만 폴더명으로 올리면 positive pattern 산출이 약해진다.
4. `_commands` 삭제 이후 이 폴더는 command replacement responsibility도 일부 받으므로, 너무 좁은 이름은 위험하다.

`prohibitions`라는 단어는 폴더명이 아니라 최상단 공통 지침 안에서 "하지 말아야 할 것과 대체 행동을 반드시 도출하라"는 요구로 쓰는 편이 맞다. 모든 파일에 같은 상세 heading 구조를 강제하지 않는다.

## Proposed Top Guidance

각 스택별 프롬프트는 자유 형식으로 작성하되, 최상단에는 다음 공통 지침을 둔다.

```md
이 파일은 특정 기술스택 레포에 적용할 개발 지침 작성 예시 프롬프트입니다.
아래 관심사를 자유 형식으로 확장하되, 각 관심사마다 외부 레포 교차검증,
공식 문서 근거, 하면 안 되는 코드/설계 습관, 필요한 대체 패턴,
best/anti 예시, 검증 방법을 함께 도출해 docs/dev에 문서화합니다.
```

## Implementation Impact If Renaming Is Still Chosen

`prohibitions/`로 실제 rename을 선택한다면 다음 보완이 필요하다.

| File | Required Update |
| --- | --- |
| `examples/nextjs-frontend.md` | 파일 내용을 금지 중심 카탈로그로 재작성하거나, 이름과 내용 불일치를 감수하지 않도록 `Do Not / Required Alternative` 표를 추가한다. |
| `docs/dev/README.md` | `examples` 참조를 `prohibitions`로 바꾸되, best pattern과 external validation 책임이 사라지지 않는다고 명시한다. |
| `docs/dev/_templates/README.md` | broad stack prompt owner를 새 폴더명으로 갱신한다. |
| `docs/dev/_templates/_bootstrap-audit.md` | prohibition만 있고 required alternative가 없는 prompt를 실패로 본다. |
| `research/0006-remove-commands-decision.md` | `_commands` replacement owner를 새 폴더명으로 갱신한다. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | `prohibitions`는 금지 신호는 강하지만 현재 `examples`의 실제 책임보다 좁다. | S1, S2, S3, S5 | High | R20-R21 |
| F2 | AI에게 효과적인 금지 지시는 `Do Not`만이 아니라 required alternative와 evidence를 함께 요구해야 한다. | S4, S6, S7 | High | R21-R23 |
| F3 | best/anti pattern 비교가 목표라면 anti-pattern만 폴더명으로 승격하는 것보다 최상단 공통 지침으로 요구하는 편이 안전하다. | S3, S5, S8, S9 | High | R20-R23 |
| F4 | `_commands` 삭제 후 이 폴더는 broad stack prompt responsibility를 일부 받으므로 너무 좁은 이름은 중복 제거 효과를 약화할 수 있다. | S5, `research/0006-remove-commands-decision.md` | High | R21 |
| F5 | rename을 강행한다면 live references와 command replacement map을 함께 갱신해야 한다. | S2, `research/0006-remove-commands-decision.md` | High | R22 |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| 실제 AI가 `examples`와 `prohibitions` 이름에서 어떤 행동 차이를 보이는지 측정한 실험은 없다. | 네이밍 효과는 추론과 문서 원칙 기반이다. | 구현 후 같은 prompt를 두 이름으로 실행해 누락률을 비교할 수 있다. |
| 현재 `examples`가 한 파일뿐이다. | 여러 스택에서 이름의 일반성을 검증하지 못했다. | 두 번째 스택 prompt가 생길 때 naming fit을 재검토한다. |
| `prohibitions`가 팀 문화상 더 강한 운영 언어로 선호될 수 있다. | 문서 원칙상 비권장이어도 팀 합의로 선택할 수 있다. | 선택 시 `Required Alternatives`를 반드시 함께 두도록 한다. |

## Sources

- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- Anthropic prompting best practices: `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices`
- Google Developer Documentation Style Guide word list: `https://developers.google.com/style/word-list`
- Google Cloud Apigee anti-patterns introduction: `https://docs.cloud.google.com/apigee/docs/api-platform/antipatterns/intro`
- `examples/nextjs-frontend.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0002-pattern-example-coverage.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0004-readme-authoring-guardrails.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0005-external-repository-cross-validation.md`
- `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0006-remove-commands-decision.md`
