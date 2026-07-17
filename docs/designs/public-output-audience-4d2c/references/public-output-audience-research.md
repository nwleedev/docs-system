# AI 작성 문구의 독자 혼동을 막는 방법

## 조사 질문과 범위

AI 코딩 에이전트가 작업 지시자에게 보낼 진행 보고를 애플리케이션 UI나 개발자용 README에 섞는 현상을 어떻게 예방할 수 있는지 조사했다. 여기서 구분해야 할 글은 다음 세 종류다.

- 작업 지시자용 보고: 무엇을 바꾸고 어떻게 확인했는지 전달한다.
- 애플리케이션 사용자용 문구: 사용자의 현재 상태, 가능한 행동, 행동 결과를 설명한다.
- 개발자용 문서: 설치, 사용, 개발, 운영에 필요한 사실과 절차를 설명한다.

조사는 2026년 7월 17일에 수행했다. 연구 논문, AI 도구 공급자의 공식 문서와 운영 보고, 공개 저장소의 실제 에이전트 규칙을 확인했다. 이 주제를 직접 다루면서 산출물 누출률까지 측정한 연구는 찾지 못했으므로, 직접 실험 결과와 인접한 운영 사례를 구분해 해석한다. [요구사항 문서](../requirements.md)는 요청에 따라 비어 있으며, 이 문서는 새 요구사항이나 승인된 결정을 대신하지 않는다.

## 결론

독자를 한 문장으로 지정하는 프롬프트만으로는 이 문제를 안정적으로 막기 어렵다. 가장 근거가 많은 접근은 다음 방어층을 함께 두는 것이다.

1. 작성 전에 산출물 종류와 독자를 분류한다.
2. UI, README, 작업 보고에 서로 다른 작성 규칙과 근거 자료를 적용한다.
3. 올바른 예와 잘못된 예를 함께 제공한다.
4. 공개 산출물을 작업 기록과 분리하고, 실제 렌더링 결과를 검토한다.
5. 과거 실패 사례로 회귀 평가를 만들고 정적 검사, 모델 평가, 사람 검토를 조합한다.

프롬프트 규칙은 첫 번째 방어선이지 판정 장치가 아니다. 사용자에게 직접 보이는 문구와 공개 문서는 사람의 최종 책임 범위를 남기는 편이 현재 근거에 맞다.

## 왜 독자 지정만으로 해결되지 않는가

### 모델의 독자 적응은 제한적이다

Rooein, Cercas Curry, Hovy는 네 개 언어 모델에 연령과 교육 수준이 다른 독자를 지정하고 과학 답변의 가독성을 비교했다. 독자를 지정하면 일부 차이는 생겼지만, 모델은 대부분의 세부 집단에 맞는 난이도를 안정적으로 만들지 못했다. 논문의 결론은 모델이 독자에 맞춰 “do not adapt well to different audiences, even when prompted”한다는 것이다. 이 실험은 코딩 에이전트나 UI 문구를 직접 평가하지 않았지만, `독자: 사용자` 같은 단일 지시를 충분한 통제로 볼 수 없다는 직접 근거다. [Rooein 외, 2023-12-04](https://arxiv.org/abs/2312.02065)

GitHub도 저장소 사용자 지정 지시를 응답에 자동으로 넣을 수 있다고 설명하면서, 비결정성 때문에 지시가 매번 같은 방식으로 적용되지는 않는다고 밝힌다. 지시 파일의 존재는 준수를 증명하지 않는다. [GitHub Copilot 응답 사용자 지정](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### 한 문맥에 목적이 다른 글이 함께 들어간다

코딩 에이전트는 요청, 계획, 변경 내역, 테스트 결과, 소스 코드, UI 문자열, README를 한 작업 문맥에서 읽는다. 작성 대상의 역할을 별도로 표시하지 않으면 바로 앞에서 반복된 작업 보고 문체가 공개 문자열의 예시처럼 작동할 수 있다. Anthropic의 프롬프트 지침도 예시와 프롬프트 형식이 출력 형식에 영향을 준다고 설명하며, “make your prompt style match the desired output style”을 권한다. 이는 작업 로그를 공개 문구의 작성 재료와 분리해야 한다는 근거다. [Anthropic Claude 프롬프트 지침](https://docs.anthropic.com/ko/docs/build-with-claude/prompt-engineering/claude-4-best-practices)

### 산출물 경계가 저장소에 없으면 모델이 추론해야 한다

OpenAI는 대규모 에이전트 중심 저장소에서 거대한 단일 `AGENTS.md`가 관련 지침을 밀어내고 검증하기 어렵게 만들었다고 보고했다. 이 팀은 짧은 진입 문서, 구조화된 저장소 문서, 점진적 로딩, 린터와 CI로 바꿨다. 그들이 요약한 원칙은 “give Codex a map, not a 1,000-page instruction manual”이다. 산출물별 규칙을 가까운 경로에 두고 검증 가능한 조건으로 바꾸는 방식과 맞닿아 있다. [OpenAI Harness engineering, 2026-02-11](https://openai.com/index/harness-engineering/)

## 사람들이 적용한 예방 장치

### 산출물 종류를 먼저 선언한다

OpenAI의 교육용 에이전트 작성 지침은 역할, 목표, 독자, 어조, 지식 출처, 절차, 제한, 출력 형식을 각각 명시하라고 권한다. 예시에서는 상담 준비 문서의 독자가 상담사이며, 별도 요청이 없으면 학생에게 직접 말하지 말라고 경계를 둔다. [OpenAI, 고등교육 에이전트 작성 안내](https://edunewsletter.openai.com/p/how-to-build-agents-for-higher-education)

이 문제에 적용할 때는 파일을 쓰기 전에 최소한 다음 정보를 확정하는 방식이 적합하다.

- 산출물 종류: 작업 보고, UI 문구, 개발자 문서, 변경 기록 중 무엇인가.
- 실제 독자: 작업 지시자, 제품 사용자, 저장소 기여자 중 누구인가.
- 독자가 해결하려는 일: 상태 이해, 다음 행동 선택, 설치, 개발 환경 구성 등 무엇인가.
- 허용 근거: 확인된 제품 동작, 공개된 정책, 저장소에서 검증한 명령 중 무엇을 쓸 수 있는가.
- 제외할 내용: 요청 문구, 에이전트 진행 상황, 테스트 통과 보고, 내부 경로와 검토 메모 중 무엇인가.

종류 이름만 붙이는 것보다 독자의 행동과 허용 근거를 함께 적어야 판정 기준이 생긴다.

### 전역 원칙과 경로별 규칙을 나눈다

GitHub Copilot은 저장소 전체 지시, 경로별 지시, 디렉터리에서 가장 가까운 `AGENTS.md`를 지원한다. 공식 문서는 “Path-specific custom instructions apply”라고 설명한다. UI 문자열 경로에는 제품 사용자 관점과 상태·행동 중심 규칙을, 문서 경로에는 개발자 과업과 검증된 명령 중심 규칙을 둘 수 있다. 서로 충돌하는 지시는 피해야 하며, GitHub는 여러 지시 집합이 동시에 제공될 수 있다고 경고한다. [GitHub 저장소 사용자 지정 지시](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

OpenAI의 운영 사례는 전역 파일을 목차로 두고 세부 지침을 저장소 문서로 이동한 뒤, 문서 구조와 최신성을 기계적으로 검사했다. 이 방식은 모든 글쓰기 규칙을 한 파일에 늘어놓기보다 공개 산출물의 공통 원칙만 전역에 두고 UI·README 규칙은 해당 위치에 가깝게 두는 쪽을 지지한다.

### 금지어보다 독자의 과업을 기준으로 쓴다

Google 개발자 문서 스타일 가이드는 문서에서 가리키는 `you`가 개발자인지 시스템 관리자인지 분명히 하고 끝까지 일관되게 유지하라고 한다. 짧은 원문은 “identify who the you is”이다. 문서 작성 규칙을 `보고체를 쓰지 말 것`으로 끝내지 않고 `개발자가 이 문서를 읽고 수행할 일`로 표현하는 근거가 된다. [Google, Second person and first person, 2025-04-10 개정](https://developers.google.com/style/person)

공개 저장소에는 같은 원칙을 더 구체화한 사례가 있다.

- Stirling PDF의 `AGENTS.md`는 명령 설명이 구현 방법이 아니라 명령이 하는 일을 말해야 하며, 내부 헬퍼나 리팩터링 이력을 적지 말라고 한다. 설명의 독자를 작업 목록에서 명령을 고르는 사용자로 지정한다. [Stirling PDF `AGENTS.md`, `d271b8f`](https://github.com/Stirling-Tools/Stirling-PDF/blob/d271b8f3573e52d89f691c3f8538c405d6e27d17/AGENTS.md#L9)
- Jetpack의 `AGENTS.md`는 변경 기록을 “from a user's perspective, not the implementation details”로 쓰도록 한다. 변경을 수행한 에이전트가 아니라 릴리스 독자의 관점으로 전환하는 규칙이다. [Jetpack `AGENTS.md`, `717dcfe`](https://github.com/Automattic/jetpack/blob/717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a/AGENTS.md#L220-L224)
- Cloudflare Workers SDK는 사용자 오류 문구와 텔레메트리 분류명을 구분한다. 텔레메트리는 안정적인 범주여야 하며, UI 문구가 바뀐다는 이유로 함께 바뀌면 안 된다고 명시한다. 같은 사건을 설명해도 소비자가 다르면 문자열을 공유하지 않는 사례다. [Workers SDK `AGENTS.md`, `028ce1f`](https://github.com/cloudflare/workers-sdk/blob/028ce1f8db7d5475ff61923616ad1e8029598c6d/packages/wrangler/AGENTS.md#L32-L34)
- PostHog의 `AGENTS.md`는 UI, 툴팁, 오류 상태, 알림, 문서, 지원 답변을 사람이 읽는 문구로 묶고 별도 규칙을 둔다. 확신이 없으면 사람에게 묻도록 하며, 공개 Git 기록에는 저장소만 읽는 외부 기여자가 이해할 수 있는 제품·코드 맥락만 쓰게 한다. [PostHog `AGENTS.md`, `1b7d6e0`](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md#L98-L102), [사용자 문구 규칙](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md#L167-L172)

이 사례들은 실제 운영 중인 규칙이라는 점은 확인되지만, 규칙 도입 전후의 독자 혼동 발생률은 공개하지 않았다.

### 올바른 예와 반례를 함께 둔다

독자와 어조 같은 추상 기준은 판정이 흔들리기 쉽다. UI 오류라면 `저장하지 못했습니다. 연결을 확인하고 다시 시도하세요.`처럼 상태와 다음 행동을 말하는 예를 두고, `요청하신 저장 오류 처리를 구현했습니다.`처럼 작업 지시자에게 보고하는 문장은 반례로 둔다. README라면 검증된 설치 명령과 예상 결과를 정답 예로, `요구사항에 따라 의존성을 추가했습니다.` 같은 작업 회고를 반례로 둔다.

예시는 실제 제품 용어와 문서 구조를 사용해야 한다. Anthropic은 모델이 예시의 세부 사항을 따르므로 피하려는 행동이 예시에 남지 않게 하라고 권한다. 반례는 명확히 `사용 금지`로 표시해 모방 대상과 구분해야 한다.

### 작성과 공개 판정을 분리한다

OpenAI의 AI 네이티브 엔지니어링 지침은 짧은 내부 요약은 에이전트에 맡기되, 공개 API·SDK 문서와 중요 문서는 엔지니어가 출판 전에 검토하고 외부 공개 또는 안전 관련 문서는 사람이 책임지도록 나눈다. 문서의 짧은 표현은 “Engineers review and edit important docs drafted by Codex”다. [OpenAI, Building an AI-native engineering team, 2026년 6월 확인본, 16쪽](https://cdn.openai.com/business-guides-and-resources/building-an-ai-native-engineering-team.pdf#page=16)

검토자는 소스 코드의 문자열만 보지 않고 실제 화면과 렌더링된 README를 독자의 입장에서 읽어야 한다. 작업 보고가 별도 응답이나 PR 설명에 정상적으로 존재하는지도 함께 보면, 필요한 보고를 삭제하는 대신 올바른 위치로 옮길 수 있다.

### 실제 실패를 회귀 평가로 바꾼다

Anthropic은 초기 평가 세트를 “20-50 simple tasks drawn from real failures”로 시작해도 된다고 설명한다. Descript는 제품 팀이 정한 기준으로 모델 평가자를 운영하고 정기적으로 사람 판단과 맞췄으며, Bolt는 정적 분석, 브라우저 에이전트, 지시 준수 모델 평가를 조합한 체계를 석 달 동안 구축했다. [Anthropic, Demystifying evals for AI agents, 2026-01-09](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

이 문제의 평가 세트에는 다음 두 방향이 모두 필요하다.

- 누출 사례: 작업 보고가 UI나 README에 들어가면 실패한다.
- 정상 사례: PR 설명, 변경 기록, 운영 로그처럼 구현·검증 설명이 필요한 위치에서는 해당 문구를 허용한다.

정적 검사는 `요청하신`, `구현했습니다`, `요구사항에 따라`, `테스트를 통과했습니다` 같은 후보를 빠르게 찾을 수 있지만, 단어만으로 실패를 확정하면 정상 변경 기록도 막는다. 파일 위치와 문장 기능을 함께 보는 모델 평가, 실제 화면을 보는 브라우저 검사, 표본 사람 검토가 필요하다. 고객이 매번 올바른 문구를 보아야 하는 경우에는 한 번이라도 성공하는 `pass@k`보다 반복 실행이 모두 성공하는 `pass^k`가 더 알맞다는 Anthropic의 설명도 참고할 수 있다.

## 근거의 강도와 효과가 확인된 범위

| 근거 | 확인된 효과 또는 관찰 | 이 문제에 적용할 때의 한계 |
| --- | --- | --- |
| 독자 적응 실험 | 독자 지정만으로 세부 대상에 맞춘 글을 안정적으로 만들지 못했다. | 교육 수준과 가독성을 측정했으며 작업 보고 누출은 측정하지 않았다. |
| OpenAI 에이전트 중심 저장소 | 짧은 진입 문서, 구조화된 지식, 린터와 CI를 사용해 약 5개월간 약 1,500개 PR과 약 100만 줄 규모의 제품을 운영했다고 보고했다. | 여러 장치를 함께 사용한 사례라서 산출물별 규칙 하나의 인과 효과를 분리할 수 없다. |
| Descript·Bolt 평가 사례 | 제품 기준, 정적 분석, 브라우저 검사, 모델 평가, 사람 보정을 조합해 품질·회귀 평가를 운영했다. | 독자 혼동 전용 평가는 아니며 공개된 정량 수치가 제한적이다. |
| 공개 저장소 규칙 | 산출물의 독자, 사용자 관점, 구현 세부 정보 제외, 사람 확인을 실제 `AGENTS.md`에 명시했다. | 규칙 도입 전후의 실패율을 공개하지 않았다. |
| OpenAI 문서 책임 분류 | 외부 공개 문서는 사람 검토·책임 대상으로 남기는 운영 기준을 제시한다. | 공급자의 실무 권고이며 통제 실험은 아니다. |

따라서 `특정 문구 규칙이 누출을 몇 퍼센트 줄인다`고 말할 근거는 없다. 다만 독자 지정 하나에 의존하지 않고 산출물 분류, 가까운 규칙, 예시, 분리된 검토, 회귀 평가를 겹치는 방향은 서로 독립된 자료에서 반복된다.

## 이 저장소에 적용할 수 있는 제안

현재 저장소의 [`AGENTS.md`](../../../../AGENTS.md#public-outputs)는 커밋되거나 공유되는 UI, README, 코드 주석, 커밋·PR 문구를 공개 산출물로 보고, 내부 작업 문구를 공개 산출물에 복사하지 않으며, 추가 문장의 근거를 확인하라는 규칙을 이미 갖고 있다. 조사 결과와 잘 맞지만, 규칙이 존재한다는 사실만으로 준수를 확인할 수는 없다.

후속 설계가 승인된다면 다음 순서로 작은 평가를 먼저 수행하는 편이 타당하다.

1. 저장소에서 발견된 독자 혼동 사례와 정상 대조군을 20~50개 모은다.
2. 현재 규칙만 적용한 기준 성능을 여러 번 측정한다.
3. UI와 README 경로에 산출물별 독자·목적·허용 근거·반례를 추가한 변형을 비교한다.
4. 정적 후보 탐지, 독립된 모델 판정, 브라우저 또는 렌더링 검토를 함께 실행한다.
5. 사람 판정과 모델 판정이 어긋난 사례로 기준을 보정하고 회귀 세트에 남긴다.

요구사항이 비어 있으므로 이 제안은 승인된 구현 범위가 아니다. 어떤 파일에 규칙을 둘지, 공개 전 사람 승인을 필수로 할지, 어떤 표현을 실패로 볼지는 사람의 결정이 필요하다.

## 한계와 남은 질문

- 공개 연구에서는 작업 지시자용 보고가 UI나 README에 섞이는 현상을 독립된 오류 유형으로 측정한 벤치마크를 찾지 못했다.
- 공개 저장소 규칙은 시도 사례를 보여주지만 도입 전후 수치가 없어 효과 크기를 비교할 수 없다.
- 언어와 문서 종류에 따라 보고체의 표지가 다르다. 한국어 휴리스틱을 영어 규칙에서 그대로 만들 수 없다.
- README에는 구현 설명이 필요할 때도 있다. 독자에게 필요한 구조 설명과 작업 지시자에게 보내는 변경 보고를 문맥으로 구분해야 한다.
- 사람 검토는 가장 강한 출판 경계지만 비용이 든다. 어떤 산출물을 필수 검토 대상으로 둘지는 위험도와 변경 빈도를 함께 보고 정해야 한다.

## 검토한 출처와 시점

- Rooein, Cercas Curry, Hovy, [Know Your Audience](https://arxiv.org/abs/2312.02065), 2023-12-04 제출본, 2026-07-17 확인.
- OpenAI, [Harness engineering](https://openai.com/index/harness-engineering/), 2026-02-11 게시본, 2026-07-17 확인.
- OpenAI, [Building an AI-native engineering team](https://cdn.openai.com/business-guides-and-resources/building-an-ai-native-engineering-team.pdf), 2026년 6월 공개 PDF, 2026-07-17 확인.
- Anthropic, [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), 2026-01-09 게시본, 2026-07-17 확인.
- Anthropic, [Claude 프롬프트 엔지니어링 모범 사례](https://docs.anthropic.com/ko/docs/build-with-claude/prompt-engineering/claude-4-best-practices), 2026-07-17 확인.
- GitHub, [저장소 사용자 지정 지시](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions), 2026-07-17 확인.
- Google, [Second person and first person](https://developers.google.com/style/person), 2025-04-10 개정본, 2026-07-17 확인.
- Stirling PDF [`AGENTS.md`](https://github.com/Stirling-Tools/Stirling-PDF/blob/d271b8f3573e52d89f691c3f8538c405d6e27d17/AGENTS.md), 커밋 `d271b8f3573e52d89f691c3f8538c405d6e27d17`, 2026-07-17 확인.
- PostHog [`AGENTS.md`](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md), 커밋 `1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221`, 2026-07-17 확인.
- Cloudflare Workers SDK [`AGENTS.md`](https://github.com/cloudflare/workers-sdk/blob/028ce1f8db7d5475ff61923616ad1e8029598c6d/packages/wrangler/AGENTS.md), 커밋 `028ce1f8db7d5475ff61923616ad1e8029598c6d`, 2026-07-17 확인.
- Automattic Jetpack [`AGENTS.md`](https://github.com/Automattic/jetpack/blob/717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a/AGENTS.md), 커밋 `717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a`, 2026-07-17 확인.
