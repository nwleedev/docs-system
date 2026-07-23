# AI 작성 문구의 독자 혼동을 막는 방법

## 조사 질문과 범위

AI가 작업 지시자에게 보낼 진행 보고를 애플리케이션 UI, 개발자용 README, 조사 결과처럼 다른 사람이 사용할 산출물에 섞는 현상을 어떻게 예방할 수 있는지 조사했다. Codex와 Claude Code뿐 아니라 애플리케이션 개발, 자료 수집, 문제 조사 등 요구사항에 적힌 프로젝트 유형을 포함한다. 이 문서가 소유하는 문제는 프로젝트 종류가 아니라 글의 실제 독자와 사용 목적을 잘못 정하는 현상이다. 여기서 구분해야 할 글은 다음 세 종류다.

- 작업 지시자용 보고: 무엇을 바꾸고 어떻게 확인했는지 전달한다.
- 애플리케이션 사용자용 문구: 사용자의 현재 상태, 가능한 행동, 행동 결과를 설명한다.
- 개발자용 문서: 설치, 사용, 개발, 운영에 필요한 사실과 절차를 설명한다.

공개 API도 사용자가 직접 읽는 화면은 아니지만 배포된 소비자용 산출물이다. 요구사항의 다음 오류를 UI와 함께 다룬다.

> 사용자에게 보이는 문구나 배포되는 API가 내부 구현 계획과 확인 목록을 전달한다.

조사는 2026년 7월 17일에 수행했다. 연구 논문, AI 도구 공급자의 공식 문서와 운영 보고, 공개 저장소의 실제 에이전트 규칙을 확인했다. 이 주제를 직접 다루면서 산출물 누출률까지 측정한 연구는 찾지 못했으므로, 직접 실험 결과와 인접한 운영 사례를 구분해 해석한다. 작업 지시 문구가 코드·문서·커밋에 들어가는 문제는 [작업 의도와 산출물 출처 조사](./prompt-intent-and-artifact-provenance-research.md)가, 번역투와 정형화된 문체는 [한국어 문체 조사](./natural-korean-and-ai-writing-research.md)가 맡는다. 이 문서는 [요구사항 문서](../requirements.md)의 문제 정의와 프로젝트 조건을 기준으로 삼으며, 새 요구사항이나 승인된 결정을 대신하지 않는다.

### 문제 범위와 재사용 범위

요구사항이 제시한 구체적인 문제는 작업 지시자에게 보고하는 문구가 웹 페이지 UI와 개발자용 README 같은 다른 독자의 산출물에 들어가는 현상이다. 적용 범위를 특정 AI 도구나 프로젝트 유형으로 제한하지 않는다. 다만 이번에 찾은 운영 자료는 코딩 에이전트와 디지털 서비스에 치우쳐 있으므로, 자료 수집이나 문제 조사에서 같은 방법의 효과를 주장하려면 해당 산출물과 실제 독자로 다시 검증해야 한다.

반면 해결 방법은 특정 애플리케이션에 종속되면 안 된다. 이 저장소의 [`README`](../../../../README.md)는 문서와 규칙을 범용 템플릿으로 배포하지 않고, 대상 저장소의 코드, 도구, 위험, 승인된 결정에 맞는 부분만 선택해 다시 쓰도록 규정한다. 따라서 이 문서는 UI와 README의 문제를 중심으로 조사하되, 제안은 다른 프로젝트가 필요한 부분을 선택하고 현지 사정에 맞춰 검증할 수 있는 형태로 정리한다.

## 결론

`독자: 사용자`처럼 단일 라벨을 지정하는 것만으로 세밀한 독자 적합성을 안정적으로 통제했다는 근거는 부족하다. 특정 가독성 축은 조절할 수 있고 실제 독자의 선호를 학습하거나 독자와 과업을 함께 제시하면 개선된 사례도 있다. 가장 근거가 많은 접근은 다음 방어층을 함께 두는 것이다.

1. 작성 전에 산출물 종류, 실제 독자, 독자가 수행할 과업을 분류한다.
2. UI, README, 작업 보고에 서로 다른 작성 규칙과 근거 자료를 적용한다.
3. 올바른 예와 잘못된 예를 함께 제공한다.
4. 독자에게 전달할 결과를 작업 기록과 분리하고, 실제 독자가 과업을 완수하는지 검토한다.
5. 과거 실패 사례로 회귀 평가를 만들고 정적 검사, 모델 평가, 사람 검토를 조합한다.

프롬프트 규칙은 첫 번째 방어선이지 판정 장치가 아니다. 사용자에게 직접 보이는 문구와 배포 문서는 사람의 최종 책임 범위를 남기는 편이 현재 근거에 맞다.

## 단일 독자 라벨의 한계와 개선 가능성

### 모델의 독자 적응은 제한적이다

Rooein, Cercas Curry, Hovy는 네 개 언어 모델에 연령과 교육 수준이 다른 독자를 지정하고 과학 답변의 가독성을 비교했다. 목표 가독성 범위에 들어온 답변은 평균 약 15%였고, 아동과 성인을 나누는 이진 분류 F1은 0.95였지만 세부 집단 분류 F1은 0.05보다 낮았다. 세밀한 독자 집단을 라벨 하나로 안정적으로 맞추지 못했다는 근거다. 이 실험은 영어권 교육 수준과 가독성을 평가했으며 UI 문구나 작업 보고 누출은 측정하지 않았다. [Rooein 외, 2023-12-04](https://arxiv.org/abs/2312.02065)

반대로 Trott와 Rivière의 사전등록 연구에서는 GPT-4 Turbo와 GPT-4o-mini가 목표 가독성 방향으로 문장을 이동시킬 수 있었고, 모델이 추정한 가독성과 사람 판단의 상관은 각각 0.76과 0.74였다. 독자 적응이 전혀 불가능하다고 일반화할 수는 없다. 세밀한 독자 적합성은 단일 라벨보다 측정할 속성과 사람 판단이 함께 필요하다는 쪽이 두 연구를 함께 설명한다. [Trott·Rivière, Controllable Text Generation for Large Language Models, TSAR 2024](https://aclanthology.org/2024.tsar-1.13/)

GitHub도 저장소 사용자 지정 지시를 응답에 자동으로 넣을 수 있다고 설명하면서, 비결정성 때문에 지시가 매번 같은 방식으로 적용되지는 않는다고 밝힌다. 지시 파일의 존재는 준수를 증명하지 않는다. [GitHub Copilot 응답 사용자 지정](https://docs.github.com/en/copilot/concepts/prompting/response-customization)

### 한 문맥에 목적이 다른 글이 함께 들어간다

코딩 에이전트는 요청, 계획, 변경 내역, 테스트 결과, 소스 코드, UI 문자열, README를 한 작업 문맥에서 읽는다. 자료 수집과 조사에서도 질문, 조사 메모, 최종 보고서가 같은 문맥에 들어간다. Anthropic의 프롬프트 지침은 예시와 프롬프트 형식이 출력 형식에 영향을 준다고 설명한다. 작업 보고 문체가 사용자에게 전달되는 문자열에 옮겨지는 직접 실험은 아니지만, 목적이 다른 작업 기록을 사용자 문구의 예시와 분리해야 한다는 가능한 메커니즘을 뒷받침한다. [Anthropic Claude 프롬프트 지침](https://docs.anthropic.com/ko/docs/build-with-claude/prompt-engineering/claude-4-best-practices)

### 산출물 경계가 저장소에 없으면 모델이 추론해야 한다

OpenAI는 대규모 에이전트 중심 저장소에서 거대한 단일 `AGENTS.md`가 관련 지침을 밀어내고 검증하기 어렵게 만들었다고 보고했다. 이 팀은 짧은 진입 문서, 구조화된 저장소 문서, 점진적 로딩, 린터와 CI로 바꿨다. 그들이 요약한 원칙은 “give Codex a map, not a 1,000-page instruction manual”이다. 산출물별 규칙을 가까운 경로에 두고 검증 가능한 조건으로 바꾸는 방식과 맞닿아 있다. [OpenAI Harness engineering, 2026-02-11](https://openai.com/index/harness-engineering/)

## 사람들이 적용한 예방 장치

### 독자와 독자가 수행할 일을 함께 정한다

OpenAI의 교육용 에이전트 작성 지침은 역할, 목표, 독자, 어조, 지식 출처, 절차, 제한, 출력 형식을 각각 명시하라고 권한다. 예시에서는 상담 준비 문서의 독자가 상담사이며, 별도 요청이 없으면 학생에게 직접 말하지 말라고 경계를 둔다. [OpenAI, 고등교육 에이전트 작성 안내](https://edunewsletter.openai.com/p/how-to-build-agents-for-higher-education)

Mondal 외는 독자의 전문성만이 아니라 발표 목적과 길이 조건을 함께 제공해 기술 슬라이드를 만들었다. 길이 조건 식별률은 사람 작성본 94.4%, 지도학습 변형 91.2%, 선호학습 변형 89.7%였고 요약을 추가한 변형은 사람이 평가한 일관성과 가독성이 높아졌다. 작은 슬라이드 평가이며 작업 보고 누출을 측정하지 않았지만, `개발자`라는 명칭보다 `처음 설치하는 개발자가 환경을 구성한다`처럼 독자와 과업을 함께 지정하는 근거다. [Mondal 외, Audience-Centric Natural Language Generation via Pretrained Language Models, EACL 2024](https://aclanthology.org/2024.eacl-long.163/)

이 문제에 적용할 때는 파일을 쓰기 전에 최소한 다음 정보를 확정하는 방식이 적합하다.

- 산출물 종류: 작업 보고, UI 문구, 개발자 문서, 변경 기록 중 무엇인가.
- 실제 독자: 작업 지시자, 제품 사용자, 저장소 기여자 중 누구인가.
- 독자가 해결하려는 일: 상태 이해, 다음 행동 선택, 설치, 개발 환경 구성 등 무엇인가.
- 허용 근거: 확인된 제품 동작, 이미 게시됐거나 전달을 승인받은 정책, 저장소에서 검증한 명령 중 무엇을 쓸 수 있는가.
- 제외할 내용: 요청 문구, 에이전트 진행 상황, 테스트 통과 보고, 내부 경로와 검토 메모 중 무엇인가.

종류 이름만 붙이는 것보다 독자의 행동과 허용 근거를 함께 적어야 판정 기준이 생긴다.

독자나 과업을 저장소에서 확인할 수 없고 선택에 따라 결과가 달라진다면 작성 전에 짧게 질문해야 한다. 일부 정보가 가려진 현실 과업을 평가한 연구에서는 필요한 정보를 먼저 묻도록 학습한 모델의 명료화 질문을 사람이 42%, 최종 개요를 28% 더 선호했다. 모든 작업에서 질문하라는 근거는 아니며, 저장소 근거로 해소되지 않는 선택에만 적용해야 한다. [Huang 외, Learning to Ask, Findings of EMNLP 2025](https://aclanthology.org/2025.findings-emnlp.843/)

### 전역 원칙과 경로별 규칙을 나눈다

GitHub Copilot은 저장소 전체 지시, 경로별 지시, 디렉터리에서 가장 가까운 `AGENTS.md`를 지원한다. 공식 문서는 “Path-specific custom instructions apply”라고 설명한다. UI 문자열 경로에는 제품 사용자 관점과 상태·행동 중심 규칙을, 문서 경로에는 개발자 과업과 검증된 명령 중심 규칙을 둘 수 있다. 서로 충돌하는 지시는 피해야 하며, GitHub는 여러 지시 집합이 동시에 제공될 수 있다고 경고한다. [GitHub 저장소 사용자 지정 지시](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)

OpenAI의 운영 사례는 전역 파일을 목차로 두고 세부 지침을 저장소 문서로 이동한 뒤, 문서 구조와 최신성을 기계적으로 검사했다. 이 방식은 모든 글쓰기 규칙을 한 파일에 늘어놓기보다 독자에게 전달할 글과 문구의 공통 원칙만 전역에 두고 UI·README 규칙은 해당 위치에 가깝게 두는 쪽을 지지한다.

### 금지어보다 독자의 과업을 기준으로 쓴다

Google 개발자 문서 스타일 가이드는 문서에서 가리키는 `you`가 개발자인지 시스템 관리자인지 분명히 하고 끝까지 일관되게 유지하라고 한다. 짧은 원문은 “identify who the you is”이다. 문서 작성 규칙을 `보고체를 쓰지 말 것`으로 끝내지 않고 `개발자가 이 문서를 읽고 수행할 일`로 표현하는 근거가 된다. [Google, Second person and first person, 2025-04-10 개정](https://developers.google.com/style/person)

공개 저장소에는 같은 원칙을 더 구체화한 사례가 있다.

- Stirling PDF의 `AGENTS.md`는 명령 설명이 구현 방법이 아니라 명령이 하는 일을 말해야 하며, 내부 헬퍼나 리팩터링 이력을 적지 말라고 한다. 설명의 독자를 작업 목록에서 명령을 고르는 사용자로 지정한다. [Stirling PDF `AGENTS.md`, `d271b8f`](https://github.com/Stirling-Tools/Stirling-PDF/blob/d271b8f3573e52d89f691c3f8538c405d6e27d17/AGENTS.md#L9)
- Jetpack의 `AGENTS.md`는 변경 기록을 “from a user's perspective, not the implementation details”로 쓰도록 한다. 변경을 수행한 에이전트가 아니라 릴리스 독자의 관점으로 전환하는 규칙이다. [Jetpack `AGENTS.md`, `717dcfe`](https://github.com/Automattic/jetpack/blob/717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a/AGENTS.md#L220-L224)
- Cloudflare Workers SDK는 사용자 오류 문구와 텔레메트리 분류명을 구분한다. 텔레메트리는 안정적인 범주여야 하며, UI 문구가 바뀐다는 이유로 함께 바뀌면 안 된다고 명시한다. 같은 사건을 설명해도 소비자가 다르면 문자열을 공유하지 않는 사례다. [Workers SDK `AGENTS.md`, `028ce1f`](https://github.com/cloudflare/workers-sdk/blob/028ce1f8db7d5475ff61923616ad1e8029598c6d/packages/wrangler/AGENTS.md#L32-L34)
- PostHog의 `AGENTS.md`는 UI, 툴팁, 오류 상태, 알림, 문서, 지원 답변을 사람이 읽는 문구로 묶고 별도 규칙을 둔다. 확신이 없으면 사람에게 묻도록 하며, 공개 저장소의 Git 기록에는 저장소만 읽는 외부 기여자가 이해할 수 있는 제품·코드 맥락만 쓰게 한다. [PostHog `AGENTS.md`, `1b7d6e0`](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md#L98-L102), [사용자 문구 규칙](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md#L167-L172)

이 사례들은 실제 운영 중인 규칙이라는 점은 확인되지만, 규칙 도입 전후의 독자 혼동 발생률은 발표하지 않았다.

### 내부 문구가 사용자 표면에 나온 실제 보고가 있다

요구사항과 똑같이 작업 보고가 README나 제품 UI에 섞인 발생률 연구는 찾지 못했다. 다만 내부용 문구와 사용자용 문구의 구분이 무너진 GitHub 이슈는 확인했다.

- Codex Desktop 이슈 #24162는 명령 이름, 로컬 명령 출력, 작업공간 지침 같은 XML 형태의 내부 제어 문구가 일반 대화 화면에 나타났다고 보고했다. 보고자는 진단 정보가 필요하면 별도 상세 화면에 두고 일반 대화와 섞지 말아야 한다고 설명했다. 모델이 쓴 UI 문자열이 아니라 렌더링 경로의 누출이라는 차이가 있다. [openai/codex #24162](https://github.com/openai/codex/issues/24162)
- Claude Code 이슈 #77572는 `__` 접두사가 붙은 내부 명령이 VS Code의 사용자용 명령 자동완성에 나타났다고 보고했다. 같은 명령 목록에서도 내부 항목은 사용자 선택지에서 걸러야 한다는 사례다. [anthropics/claude-code #77572](https://github.com/anthropics/claude-code/issues/77572)

두 사례는 작성 모델의 독자 판단 실패를 입증하지 않는다. 그러나 내부 상태와 사용자 표면을 별도 자료와 경로로 관리하고, 최종 화면을 확인해야 한다는 적용 방향은 같다.

Grafana 이슈 #119590은 프록시나 외부 서비스가 반환한 HTML 오류 페이지 전체가 UI 알림과 오류 로그에 나타난다고 보고했다. 병합된 PR #119595는 사용자에게 보이는 메시지를 상태 코드와 상태 문구로 제한하고 원 응답은 별도 필드에 유지했으며, HTML과 일반 텍스트 오류를 구분하는 회귀 검사를 추가했다. AI 작업 보고 사례는 아니지만 내부·외부 원자료를 사용자 메시지로 그대로 전달하지 않고, 사용자용 표현과 진단 자료를 다른 필드로 나눈 실제 수정이다. [Grafana 이슈 #119590](https://github.com/grafana/grafana/issues/119590), [PR #119595](https://github.com/grafana/grafana/pull/119595)

검토 대상 저장소의 현재 개정에서는 내부 준비 상태와 확인 항목을 담은 객체가 외부에 제공하는 API 형식에 그대로 재사용되고, 같은 값이 사용자 입력 화면의 설명과 목록으로 전달되는 경로를 확인했다. 이는 저장소의 실제 코드 경로에 관한 관찰이며, 다른 프로젝트의 발생률이나 AI가 직접 원인이라는 점을 입증하지 않는다. 저장소의 이름, 위치, 파일명과 원문은 기록하지 않았다.

### 사용자 상태와 내부 운영 상태를 분리한다

Google AIP-216은 상태 값을 API 소비자에게 유용한 상태로 제한하고, 내부 구현 상태는 혼란을 만들 수 있으므로 API에 제공하는 열거형에 넣지 말라고 한다. 처리 중 상태도 사용자가 관찰하거나 그에 따라 행동할 수 있을 때만 가치가 있다고 설명한다. Microsoft의 장기 실행 작업 지침도 API 소비자에게 제공하는 작업 상태와 최종 자원을 정의하지만, 내부 단계·재시도·작업자 로그 전체를 응답으로 보내지는 않는다. [Google AIP-216](https://google.aip.dev/216), [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/577874d3844942b7ca6ef9c6fef8b7e6017a3ce5/azure/Guidelines.md)

채널마다 필요한 상태는 다음처럼 다르다.

- UI는 사용자가 알아야 할 현재 결과, 기다려야 하는지, 진행 정도, 다음 행동을 말한다.
- 공개 API는 소비자가 분기할 안정적인 상태·오류 코드와 필요한 데이터만 제공한다. 지원에 필요하면 내부 의미가 없는 불투명 요청 식별자를 줄 수 있다.
- 내부 기록은 세부 실행 단계, 재시도, 확인 목록, 원 응답, 스택과 개발 메모를 맡는다.

WCAG 상태 메시지 지침도 성공·결과·대기·진행·오류처럼 사용자가 알아야 할 변화를 보조 기술이 인식할 수 있게 하라고 한다. 내부 작업 순서를 사용자에게 보여주라는 지침은 아니다. [W3C, Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)

### 공개 API는 내부 모델과 별도 출력 규칙을 사용한다

OWASP Web Security Testing Guide는 백엔드 객체나 내부 자료 구조 전체를 직렬화하고 프런트엔드에서 숨기는 방식이 과도한 데이터 노출을 만든다고 설명한다. UI가 표시하지 않아도 API 응답은 직접 읽을 수 있으므로 서버에서 목적별 출력 객체나 허용 목록을 정의해야 한다. 오류 응답과 중첩 객체도 같은 검토 대상이다. [OWASP WSTG, Testing for Excessive Data Exposure](https://github.com/OWASP/wstg/blob/master/document/4-Web_Application_Security_Testing/12-API_Testing/03-Testing_for_Excessive_Data_Exposure.md)

FastAPI의 공식 문서는 입력 모델과 출력 모델을 분리해 함수가 더 많은 데이터를 반환하더라도 선언한 응답 모델의 필드만 전송하는 예를 제공한다. 특정 프레임워크를 채택하라는 뜻이 아니라, API 응답을 내부 객체의 별칭으로 두지 않고 소비자용 필드 목록으로 검증할 수 있다는 구현 사례다. [FastAPI Response Model `afe4112`](https://github.com/fastapi/fastapi/blob/afe41126f624af30038cc8e17b2aaf60ebd4b838/docs/en/docs/tutorial/response-model.md)

RFC 9457도 클라이언트에 보내는 오류의 `detail`은 클라이언트가 문제를 바로잡도록 돕는 데 집중하고 디버깅 정보를 주지 말라고 한다. 문제 상세 형식은 구현의 디버깅 도구가 아니며 스택과 내부 구현 정보를 응답에 포함하면 시스템과 사용자의 개인정보를 위험하게 할 수 있다. [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html)

### 올바른 예와 반례를 함께 둔다

독자와 어조 같은 추상 기준은 판정이 흔들리기 쉽다. UI 오류라면 `저장하지 못했습니다. 연결을 확인하고 다시 시도하세요.`처럼 상태와 다음 행동을 말하는 예를 두고, `요청하신 저장 오류 처리를 구현했습니다.`처럼 작업 지시자에게 보고하는 문장은 반례로 둔다. README라면 검증된 설치 명령과 예상 결과를 정답 예로, `요구사항에 따라 의존성을 추가했습니다.` 같은 작업 회고를 반례로 둔다.

예시는 실제 제품 용어와 문서 구조를 사용해야 한다. Anthropic은 모델이 예시의 세부 사항을 따르므로 피하려는 행동이 예시에 남지 않게 하라고 권한다. 반례는 명확히 `사용 금지`로 표시해 모방 대상과 구분해야 한다.

예시를 작성자가 임의로 고르는 대신 실제 독자가 두 표현을 비교하게 할 수 있다. Moorjani 외는 실제 독자의 쌍대 비교를 사용해 설득 문장과 기억하기 쉬운 문장의 스타일 판별기를 학습했고, 새 주제 설득 문장의 판별 정확도 87%를 보고했다. UI나 README 연구는 아니지만 `독자에게 적합해 보인다`는 작성자 직감보다 실제 독자 비교로 예시와 평가 기준을 고르는 효과 근거다. [Moorjani 외, Learning to Generate Text in Arbitrary Writing Styles, Findings of EMNLP 2022](https://aclanthology.org/2022.findings-emnlp.138/)

### 작성과 배포 여부 판단을 분리한다

OpenAI의 AI 네이티브 엔지니어링 지침은 짧은 내부 요약은 에이전트에 맡기되, 외부 개발자가 사용하는 API와 SDK 문서와 중요 문서는 엔지니어가 출판 전에 검토하고 외부에 배포하거나 안전과 관련된 문서는 사람이 책임지도록 나눈다. 문서의 짧은 표현은 “Engineers review and edit important docs drafted by Codex”다. [OpenAI, Building an AI-native engineering team, 2026년 6월 확인본, 16쪽](https://cdn.openai.com/business-guides-and-resources/building-an-ai-native-engineering-team.pdf#page=16)

검토자는 소스 코드의 문자열만 보지 않고 실제 화면과 렌더링된 README를 독자의 입장에서 읽어야 한다. 렌더링 모양만 확인해서도 부족하다. UI는 실제 사용자의 과업 성공률, 소요 시간, 포기와 잘못된 성공 판단을 확인하고, README는 새 개발자가 설치·실행·이해 과업을 완료하는지 본다. GOV.UK는 실제 또는 가능성이 높은 사용자 30~60명에게 현실적인 과업과 명확한 정답을 주고 이 지표를 반복 측정하는 사용성 기준을 제시한다. [GOV.UK, Usability benchmarking](https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service)

작업 보고가 별도 응답이나 PR 설명에 정상적으로 존재하는지도 함께 보면, 필요한 보고를 삭제하는 대신 올바른 위치로 옮길 수 있다.

### 실제 실패를 회귀 평가로 바꾼다

Anthropic은 초기 평가 세트를 “20-50 simple tasks drawn from real failures”로 시작해도 된다고 설명한다. Descript는 제품 팀이 정한 기준으로 모델 평가자를 운영하고 정기적으로 사람 판단과 맞췄으며, Bolt는 정적 분석, 브라우저 에이전트, 지시 준수 모델 평가를 조합한 체계를 석 달 동안 구축했다. [Anthropic, Demystifying evals for AI agents, 2026-01-09](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

이 문제의 평가 세트에는 다음 두 방향이 모두 필요하다.

- 누출 사례: 작업 보고가 UI나 README에 들어가면 실패한다.
- 정상 사례: PR 설명, 변경 기록, 운영 로그처럼 구현·검증 설명이 필요한 위치에서는 해당 문구를 허용한다.

작업 지시 문구를 찾는 문자열 검사의 방법과 한계는 [작업 의도와 산출물 출처 조사](./prompt-intent-and-artifact-provenance-research.md)에 기록했다. 이 문서의 평가는 문구의 표시 위치와 기능에 집중한다. 파일 위치와 문장 기능을 함께 보는 모델 평가, 실제 화면을 보는 브라우저 검사, 표본 사람 검토가 필요하다. 고객이 매번 올바른 문구를 보아야 하는 경우에는 한 번이라도 성공하는 `pass@k`보다 반복 실행이 모두 성공하는 `pass^k`가 더 알맞다는 Anthropic의 설명도 참고할 수 있다.

평가자는 한 문장을 보고 막연히 `사용자용답다`고 판정하지 않는다. 다음 항목을 나누면 사실 오류와 독자 혼동을 구별할 수 있다.

- 문장이 확인된 제품 동작이나 문서 사실만 말하는가.
- 실제 독자가 상태를 이해하거나 다음 과업을 수행하는 데 필요한가.
- 독자에게 설명하는 대신 작업 지시자에게 변경 과정과 검증 결과를 보고하는가.
- 각 판단을 뒷받침하는 파일, 화면, 명령 결과를 찾을 수 있는가.

정적 검사는 첫 번째 후보를 좁히고, 모델 평가는 문장 기능을 분류하며, 브라우저·렌더링 검토는 실제 표시 위치를 확인한다. 근거가 충돌하거나 독자의 과업을 저장소에서 알 수 없으면 사람이 판정해야 한다.

## 근거의 강도와 효과가 확인된 범위

### 독자 적응 실험

- **확인된 효과 또는 관찰.** 단일 독자 라벨은 세부 집단 구분에 실패했지만, 별도 연구에서는 목표 가독성 방향을 조절하고 사람 판단과 0.74~0.76의 상관을 보였다.
- **적용 한계.** 교육 수준과 가독성을 측정했으며 작업 보고 누출은 측정하지 않았다.

### 독자와 과업을 함께 준 조건

- **확인된 효과 또는 관찰.** 발표 목적, 전문성, 길이를 함께 준 슬라이드 생성에서 사람이 평가한 일관성과 가독성이 개선된 변형이 있었다.
- **적용 한계.** 작은 기술 슬라이드 평가여서 UI와 README에 그대로 일반화할 수 없다.

### 실제 독자의 쌍대 비교

- **확인된 효과 또는 관찰.** 독자 비교로 학습한 스타일 판별기가 새 주제의 설득 문장을 87% 정확도로 구분했다.
- **적용 한계.** 설득과 기억 스타일 연구이며 제품 문구의 과업 성공을 측정하지 않았다.

### 사용성 기준

- **확인된 효과 또는 관찰.** 실제 또는 가능성이 높은 독자가 현실적인 과업을 수행하며 성공률, 시간, 포기, 잘못된 성공 판단을 반복 측정하는 절차가 운영되고 있다.
- **적용 한계.** AI 작성 문구 전용 실험이 아니며 충분한 참여자와 명확한 정답이 필요하다.

### OpenAI 에이전트 중심 저장소

- **확인된 효과 또는 관찰.** 짧은 진입 문서, 구조화된 지식, 린터와 CI를 사용해 약 5개월간 약 1,500개 PR과 약 100만 줄 규모의 제품을 운영했다고 보고했다.
- **적용 한계.** 여러 장치를 함께 사용한 사례라서 산출물별 규칙 하나의 인과 효과를 분리할 수 없다.

### Descript와 Bolt 평가 사례

- **확인된 효과 또는 관찰.** 제품 기준, 정적 분석, 브라우저 검사, 모델 평가, 사람 보정을 조합해 품질과 회귀 평가를 운영했다.
- **적용 한계.** 독자 혼동 전용 평가는 아니며 발표된 정량 수치가 제한적이다.

### 공개 저장소 규칙

- **확인된 효과 또는 관찰.** 산출물의 독자, 사용자 관점, 구현 세부 정보 제외, 사람 확인을 실제 `AGENTS.md`에 명시했다.
- **적용 한계.** 규칙 도입 전후의 실패율을 발표하지 않았다.

### 사용자에게 보이는 영역의 내부 항목 보고

- **확인된 효과 또는 관찰.** 내부 제어 문구와 명령이 일반 대화나 자동완성에 나타난 원 보고가 있다.
- **적용 한계.** 렌더링과 명령 필터 문제이며 모델이 작성한 UI 문구 사례는 아니다.

### API 응답과 내부 자료 분리

- **확인된 효과 또는 관찰.** OWASP와 FastAPI는 내부 객체 전체 직렬화 대신 목적별 출력 모델을 사용하고, RFC 9457은 클라이언트에 보내는 오류에서 디버깅 정보를 제외하도록 한다. Grafana는 원 HTML 응답과 사용자 메시지를 분리해 병합했다.
- **적용 한계.** AI가 만든 내부 확인 목록이 API 응답에 섞이는 비율을 직접 측정한 자료는 아니다.

### OpenAI 문서 책임 분류

- **확인된 효과 또는 관찰.** 외부에 배포할 문서는 사람 검토와 책임 대상으로 남기는 운영 기준을 제시한다.
- **적용 한계.** 공급자의 실무 권고이며 통제 실험은 아니다.

따라서 `특정 문구 규칙이 누출을 몇 퍼센트 줄인다`고 말할 근거는 없다. 다만 독자 지정 하나에 의존하지 않고 산출물 분류, 가까운 규칙, 예시, 분리된 검토, 회귀 평가를 겹치는 방향은 서로 독립된 자료에서 반복된다.

## 여러 프로젝트에서 선택해 적용할 수 있는 제안

현재 저장소가 독자에게 전달할 문구의 근거와 내부 작업 기록을 분리하는 방식은 [작업 의도와 산출물 출처 조사](./prompt-intent-and-artifact-provenance-research.md#입력과-산출물-근거를-분리한다)에 기록했다. 이 문서의 후속 제안은 같은 원칙을 반복하지 않고, 산출물별 실제 독자와 과업을 정하고 그 적합성을 평가하는 부분만 추가한다.

후속 설계가 승인된다면 대상 저장소마다 다음 순서로 작은 평가를 먼저 수행하는 편이 타당하다.

1. 해당 저장소에서 다른 사람이 읽는 글과 문구, 실제 독자, 독자가 수행할 과업을 목록으로 만든다.
2. 발견된 독자 혼동 사례와 정상 대조군을 20~50개 모으고, 실제 독자가 표현 쌍을 비교하게 해 기준 예시를 고른다.
3. 현재 규칙만 적용한 결과를 여러 번 측정한다. 독자가 두 변형에서 의미 있는 차이를 보이지 않으면 새 규칙을 추가하지 않는다.
4. UI와 README 또는 같은 역할을 하는 독자 대상 문구가 있는 경로에 독자·과업·허용 근거·반례를 추가한 변형을 비교한다.
5. 정적 후보 탐지, 독립된 모델 판정, 브라우저 또는 렌더링 검토, 독자의 과업 수행 평가를 함께 실행한다.
6. 사람 판정과 모델 판정이 어긋난 사례로 기준을 보정하고 회귀 세트에 남긴다.

이 절차를 모든 저장소에 그대로 복사하면 안 된다. 먼저 대상 저장소에서 다른 사람이 읽는 글과 문구와 독자를 확인하고, 적용할 규칙만 선택하며, 제품 용어와 실제 실패 사례로 예시와 평가 기준을 다시 작성해야 한다.

요구사항은 문제 조사와 리서치 문서 작성을 요청하지만 린터, 에이전트 지시, 평가 도구의 구현까지 승인하지는 않는다. 어떤 파일에 규칙을 둘지, 커밋하거나 공유하기 전 사람 승인을 필수로 할지, 어떤 표현을 실패로 볼지는 사람의 결정이 필요하다.

## 한계와 남은 질문

- 발표된 연구에서는 작업 지시자용 보고가 UI나 README에 섞이는 현상을 독립된 오류 유형으로 측정한 벤치마크를 찾지 못했다.
- 공개 저장소 규칙은 시도 사례를 보여주지만 도입 전후 수치가 없어 효과 크기를 비교할 수 없다.
- 언어와 문서 종류에 따라 보고체의 표지가 다르다. 한국어 휴리스틱을 영어 규칙에서 그대로 만들 수 없다.
- README에는 구현 설명이 필요할 때도 있다. 독자에게 필요한 구조 설명과 작업 지시자에게 보내는 변경 보고를 문맥으로 구분해야 한다.
- 사람 검토는 가장 강한 출판 경계지만 비용이 든다. 어떤 산출물을 필수 검토 대상으로 둘지는 위험도와 변경 빈도를 함께 보고 정해야 한다.
- 확인한 운영 사례는 코딩 에이전트와 디지털 서비스에 치우쳐 있다. 자료 수집 결과나 조사 보고서에는 해당 분야 독자와 과업으로 다시 평가해야 한다.
- 공개 API에 AI가 작성한 구현 계획이나 확인 목록이 들어가는 현상을 독립적으로 측정한 연구는 찾지 못했다. 검토 대상 저장소의 관찰과 인접한 과도한 데이터 노출 지침을 구분해야 한다.

## 조사 반복과 중단 근거

기존 여섯 차례에 공개 API와 내부 상태를 다룬 네 차례를 더해 모두 열 차례 검색과 원문 대조를 수행했다.

1. 독자 수준을 지정한 생성 연구와 가독성 조절 연구를 대조했다.
2. 독자의 전문성뿐 아니라 발표 목적과 길이를 함께 준 생성 연구를 확인했다.
3. 필요한 정보가 없을 때 질문하는 모델과 사람 선호 결과를 확인했다.
4. 실제 독자의 쌍대 비교와 사용성 과업으로 문구를 평가하는 방법을 찾았다.
5. 공개 저장소의 경로별 규칙과 사용자 표면에 내부 항목이 나타난 이슈를 확인했다.
6. 같은 현상을 직접 측정한 벤치마크와 규칙 도입 전후 수치를 다시 검색했다.
7. 공개 API의 내부 상태와 전체 객체 직렬화에 관한 표준·보안 지침을 확인했다.
8. 사용자 상태, 장기 실행 작업, 클라이언트에 전달하는 오류 형식에서 소비자에게 필요한 정보의 범위를 대조했다.
9. 사용자 메시지와 원 진단 자료를 분리한 GitHub 이슈와 병합된 수정을 확인했다.
10. AI 내부 확인 목록이 공개 API에 들어간 직접 측정 사례를 다시 검색했다.

마지막 검색에서는 `소비자에게 유용한 상태`, `목적별 출력 모델`, `사용자 메시지와 진단 자료 분리`, `최종 화면과 원 API 응답의 동시 검사` 외의 새 예방 범주가 나오지 않았다. 직접 벤치마크도 발견하지 못했다. 새 검색어가 기존 범주를 반복하고 근거의 직접성을 높이지 못해 이 조사 범위는 포화 상태로 판단했다.

## 검토한 출처와 시점

- Rooein, Cercas Curry, Hovy, [Know Your Audience](https://arxiv.org/abs/2312.02065), 2023-12-04 제출본, 2026-07-17 확인.
- Trott, Rivière, [Controllable Text Generation for Large Language Models](https://aclanthology.org/2024.tsar-1.13/), TSAR 2024, 2026-07-17 확인.
- Mondal 외, [Audience-Centric Natural Language Generation via Pretrained Language Models](https://aclanthology.org/2024.eacl-long.163/), EACL 2024, 2026-07-17 확인.
- Huang 외, [Learning to Ask](https://aclanthology.org/2025.findings-emnlp.843/), Findings of EMNLP 2025, 2026-07-17 확인.
- Moorjani 외, [Learning to Generate Text in Arbitrary Writing Styles](https://aclanthology.org/2022.findings-emnlp.138/), Findings of EMNLP 2022, 2026-07-17 확인.
- OpenAI, [Harness engineering](https://openai.com/index/harness-engineering/), 2026-02-11 게시본, 2026-07-17 확인.
- OpenAI, [Building an AI-native engineering team](https://cdn.openai.com/business-guides-and-resources/building-an-ai-native-engineering-team.pdf), 2026년 6월 발행 PDF, 2026-07-17 확인.
- Anthropic, [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), 2026-01-09 게시본, 2026-07-17 확인.
- Anthropic, [Claude 프롬프트 엔지니어링 모범 사례](https://docs.anthropic.com/ko/docs/build-with-claude/prompt-engineering/claude-4-best-practices), 2026-07-17 확인.
- GitHub, [저장소 사용자 지정 지시](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions), 2026-07-17 확인.
- Google, [Second person and first person](https://developers.google.com/style/person), 2025-04-10 개정본, 2026-07-17 확인.
- GOV.UK, [Usability benchmarking](https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service), 2026-07-17 확인.
- OpenAI Codex, [내부 제어 문구 표시 이슈 #24162](https://github.com/openai/codex/issues/24162), 2026-05-22 등록본, 2026-07-17 확인.
- Anthropic Claude Code, [내부 명령 자동완성 표시 이슈 #77572](https://github.com/anthropics/claude-code/issues/77572), 2026-07-14 등록본, 2026-07-17 확인.
- Stirling PDF [`AGENTS.md`](https://github.com/Stirling-Tools/Stirling-PDF/blob/d271b8f3573e52d89f691c3f8538c405d6e27d17/AGENTS.md), 커밋 `d271b8f3573e52d89f691c3f8538c405d6e27d17`, 2026-07-17 확인.
- PostHog [`AGENTS.md`](https://github.com/PostHog/posthog/blob/1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221/AGENTS.md), 커밋 `1b7d6e0ad4cdb5242c83ff1aa8dfd799b8bc7221`, 2026-07-17 확인.
- Cloudflare Workers SDK [`AGENTS.md`](https://github.com/cloudflare/workers-sdk/blob/028ce1f8db7d5475ff61923616ad1e8029598c6d/packages/wrangler/AGENTS.md), 커밋 `028ce1f8db7d5475ff61923616ad1e8029598c6d`, 2026-07-17 확인.
- Automattic Jetpack [`AGENTS.md`](https://github.com/Automattic/jetpack/blob/717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a/AGENTS.md), 커밋 `717dcfea741f0a3b1cd1c8fb6e51bbac8d2e3a7a`, 2026-07-17 확인.
- Google, [AIP-216: States](https://google.aip.dev/216), 2026-07-17 확인.
- Microsoft, [REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/577874d3844942b7ca6ef9c6fef8b7e6017a3ce5/azure/Guidelines.md), 커밋 `577874d3844942b7ca6ef9c6fef8b7e6017a3ce5`, 2026-07-17 확인.
- W3C, [Understanding Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html), 2026-07-17 확인.
- OWASP, [Testing for Excessive Data Exposure](https://github.com/OWASP/wstg/blob/master/document/4-Web_Application_Security_Testing/12-API_Testing/03-Testing_for_Excessive_Data_Exposure.md), 2026-07-17 확인.
- IETF, [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), 2023-07 게시본, 2026-07-17 확인.
- FastAPI, [Response Model](https://github.com/fastapi/fastapi/blob/afe41126f624af30038cc8e17b2aaf60ebd4b838/docs/en/docs/tutorial/response-model.md), 커밋 `afe41126f624af30038cc8e17b2aaf60ebd4b838`, 2026-07-17 확인.
- Grafana, [이슈 #119590](https://github.com/grafana/grafana/issues/119590)과 [PR #119595](https://github.com/grafana/grafana/pull/119595), 2026-03-05 병합본, 2026-07-17 확인.
