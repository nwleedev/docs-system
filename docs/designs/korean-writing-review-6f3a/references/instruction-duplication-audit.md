# 배포 지침과 한국어 검토 자료의 중복 감사

## 결론

감사를 시작할 때 `skills/use-words-review`, `src`와 `docs`에서 Git이 추적하던 Markdown 파일 25개를 모두 확인했다. 감사 결과를 기록한 이 문서도 별도로 검토해 최종 범위는 26개다. 최종 판정은 `pass` 13개, `needs revision` 11개, `needs human input` 2개다. 검사 대상에서 빠진 파일은 없다.

줄여야 할 내용은 네 묶음이다. 두 배포용 AGENTS 문서 안에서 일반 글쓰기 규칙과 한국어 채팅 규칙이 같은 작성 원칙을 되풀이한다. AGENTS의 스킬 호출 구간도 `SKILL.md`의 입력, 위임, 판정과 보고 절차를 다시 설명한다. 현재 한국어 설계 패키지의 일부 조사 문서는 승인된 결정과 계획의 파일별 작업을 다시 적는다. 이전 공개 결과물 설계 패키지의 일부 파생 문서는 요구사항 원문과 본문에 이미 연결한 출처 목록을 다시 싣는다.

파일 여러 곳에 같은 취지가 있다는 이유만으로 모두 합치면 안 된다. 요구사항, 결정 기록, 계획, 회귀 입력과 실행 규칙은 읽는 시점과 쓰임이 다르다. `docs/designs/README.md`와 `docs/dev/README.md`도 서로 다른 문서 작업에서 독립적으로 읽히므로 공통 표시 규칙을 각각 유지해야 한다. `examples.md`와 `korean.md`의 반복 구조는 여러 후보를 같은 질문으로 비교하기 위한 자료다.

이번 감사는 수정 위치와 남길 파일을 정리한 참고 자료다. 감사 대상이었던 원본 25개 파일은 바꾸지 않는다. 이 문서는 [요구사항의 적용 조건](../requirements.md#적용-조건)이 정한 후속 구현과 새 파일 금지 범위를 완료한 뒤 별도로 수행한 문서 검토 결과이며, 해당 구현의 파일 변경으로 소급해 포함하지 않는다. 두 AGENTS 문서에서 서로 다르게 적힌 작업, 브랜치와 커밋 규칙은 중복 감축만으로 어느 쪽을 채택할 수 없으므로 요구사항 작성자의 판단이 필요하다.

## 범위와 판정 방법

검사 범위는 다음 명령으로 얻는 추적 파일 전체를 기준으로 고정했다.

```text
git ls-files skills/use-words-review src docs
```

원본 25개 파일은 모두 Markdown이었고 전체 길이는 5,095줄이었다. 파일별 의미 검토 뒤 전 범위 교차 검토로 묶음 사이의 겹침과 필요한 반복을 구분했다. 정규화한 긴 문장과 공통 구간 검색은 검토 후보를 찾는 데만 사용하고 사람이 문서의 책임과 읽는 시점을 확인해 최종 판정을 내렸다. 이 문서는 작성 뒤 한국어 문구, 내부 일관성과 제안의 실행 가능성을 별도로 검토했다.

판정 상태는 [설계 문서 검토 상태](../../README.md#validation)를 따른다. 같은 문장이나 단어가 나온 사실만으로 `needs revision`으로 정하지 않았다. 다음 질문에 답할 수 있을 때만 감축 대상으로 판정했다.

- 두 내용이 같은 실행 시점에 항상 함께 읽히는가?
- 한쪽이 정책이나 승인 결과를 정하고 다른 쪽은 그 내용을 다시 선언하는가?
- 연결만 남겨도 해당 파일의 독자가 행동과 완료 조건을 이해할 수 있는가?
- 반복을 지우면 배포본, 사례 또는 문서 종류가 독립적으로 쓰이지 못하는가?

기계 검사는 후보를 찾는 보조 수단으로만 사용했다. 정확히 같은 문장이 없어도 같은 책임을 여러 절이 맡으면 중복이며, 문장이 같아도 서로 독립적으로 배포되거나 다른 단계의 증거라면 필요한 반복이다.

## 감축해야 할 중복

### AGENTS는 상시 정책과 호출 조건만 맡아야 한다

두 배포본의 일반 글쓰기 절과 한국어 채팅 절은 문장의 지칭 대상, 주체, 행동, 조건과 결과, 형식적인 도입과 결론, 임의로 만든 세 항목, 기존 문체 재사용을 함께 설명한다. [한국어 배포본의 일반 글쓰기와 채팅 규칙](../../../../src/AGENTS.ko.md)과 [영어 배포본의 일반 글쓰기와 채팅 규칙](../../../../src/AGENTS.en.md)에서 이 두 절은 해당 배포본을 적용한 실행이 함께 읽는다. 따라서 한국어 채팅 절에는 일반 규칙을 적용한다는 연결과 한국어에만 필요한 예외만 남기는 편이 맞다.

AGENTS의 저장 결과물 검토 구간은 공유 단위 묶기, 검토 입력, 범용 서브에이전트, 대체 절차, 네 가지 판정 상태와 수정 분리까지 설명한다. 같은 절차는 [use-words-review 실행 지침](../../../../skills/use-words-review/SKILL.md)이 다시 정한다. AGENTS에는 호출 대상, 일반 채팅 예외, 공유 단위당 한 번이라는 조건과 스킬 또는 필수 참조 파일을 읽지 못했을 때 완료를 주장하지 않는 조건만 남긴다. 입력 구성, 위임, 판정과 보고 순서는 `SKILL.md`가 맡아야 한다.

공개 가능한 근거와 민감정보 정책은 AGENTS에 남긴다. `SKILL.md`는 이 정책을 새로 선언하지 않고 검토 입력으로 전달하는 방법만 설명한다. 다만 서브에이전트가 원본 지침을 읽지 못하는 실행에서도 판정할 수 있도록 핵심 질문을 검토 요청에 포함하는 반복은 필요하다.

### 조사 문서는 승인 결과와 구현 계획을 다시 쓰지 않아야 한다

[한국어 검토 시스템 조사](./korean-review-system-research.md#파일별-개선-제안)는 AGENTS, 스킬, 한국어 참조 자료와 설계 README의 변경 방향을 파일별로 적는다. 이 내용은 [구현 계획](../plan.md)이 맡는 작업 단위와 겹친다. 조사 문서에는 외부 자료, 저장소 관찰, 선택지와 선택이 계획에 미친 영향만 남기고 파일별 수정과 검증은 계획으로 연결한다.

[채팅 답변의 한국어 품질 조사](./conversational-korean-output-research.md)는 일반 채팅과 저장 결과물의 구분, AGENTS 작성 규칙과 스킬 호출 조건을 여러 절에서 다시 설명한다. 승인 결과는 [채팅과 저장 결과물의 검토 범위 결정](../decisions/chat-and-stored-output-review-boundary.md)이, 실제 작업은 계획이 맡는다. 조사 문서는 실행 비용, 확인된 한계와 선택지 비교만 남겨도 근거 역할을 수행할 수 있다.

[한국어 용어와 에이전트 예시 조사](./korean-terms-and-agent-examples-research.md)의 용어별 전체 사례 일부는 최종 [한국어 판정 자료](../../../../skills/use-words-review/references/korean.md)와 [평가 사례](./korean-review-evaluation-cases.md)에 그대로 반영됐다. 조사 문서에는 용어를 고른 근거, 전문 분야에서 유지할 조건과 사례 설계 원칙을 남기고, 최종 입력과 기대 판정은 운영 자료로 연결한다.

[비교 사례와 저장소 근거](./comparable-cases-and-repository-evidence.md)는 조사 결과가 적용될 방향을 끝에서 다시 요약한다. 다른 조사 문서와 계획을 되풀이하는 설명은 줄이고, 비교 사례에서 직접 확인한 사실과 이 저장소에 적용할 때의 제한만 남긴다.

### 이전 설계 패키지는 요구사항 인용과 출처 재목록을 줄여야 한다

이전 공개 결과물 설계 패키지의 일부 조사 문서는 [요구사항](../../public-output-audience-4d2c/requirements.md)을 연결한 뒤 해당 문장을 다시 인용한다. 다음 문서는 요구사항 원문 대신 설명적인 요구사항 소제목으로 연결해야 한다.

- [결정 기록 범위 조사](../../public-output-audience-4d2c/references/decision-record-scope-and-title-research.md)
- [작업 의도와 산출물 출처 조사](../../public-output-audience-4d2c/references/prompt-intent-and-artifact-provenance-research.md)
- [민감한 입력과 원문 보존 조사](../../public-output-audience-4d2c/references/sensitive-input-preservation-research.md)

여섯 조사 문서는 본문 주장 가까이에 출처를 연결한 뒤 끝의 `검토한 출처와 시점` 절에서 같은 링크를 다시 열거한다. [외부 출처 표시 조사](../../public-output-audience-4d2c/references/external-source-presentation-research.md)가 제시한 방식처럼 확인 시점과 개정 정보는 해당 주장의 링크 가까이에 두고 끝 목록은 제거할 수 있다. 해당되는 문서는 결정 기록 범위, 한국어 문체, 작업 의도와 출처, 독자, 재사용 검사와 민감한 입력 조사다.

[이전 구현 계획](../../public-output-audience-4d2c/plan.md)은 각 작업의 완료 증거를 적은 뒤 최종 검증에서 같은 파일별 검사를 다시 나열한다. 각 작업의 검증은 그대로 두고 최종 검증에는 작업 단위를 함께 적용해야만 확인할 수 있는 연결, 배포본 일치와 실제 실행 결과만 남긴다. 계획 끝의 외부 출처 목록도 본문이 연결한 조사 문서와 직접 근거를 다시 모으므로 같은 기준으로 줄일 수 있다.

## 유지해야 할 반복

### 배포본과 문서 종류의 독립성

`src/AGENTS.en.md`와 `src/AGENTS.ko.md`가 같은 동작을 각 언어로 모두 설명하는 것은 복사 설치되는 배포본의 독립성을 위해 필요하다. 문제는 두 언어 파일 사이의 반복이 아니라 각 파일 안에서 상시 작성 규칙과 스킬 실행 절차가 겹치는 부분이다.

`docs/designs/README.md`와 `docs/dev/README.md`의 표 금지, 상태 판정과 최종 독자 검토 문장은 유지한다. 각 파일은 서로 다른 문서 작업의 단일 진입점이며 한쪽만 복사되는 저장소에서도 기준을 이해할 수 있어야 한다. 공통 문장을 세 번째 파일로 옮기면 읽어야 할 파일이 늘고 배포 조합에 따라 기준이 빠질 수 있다.

### 요구사항, 결정, 계획과 평가의 추적

요구사항이 결과와 조건을 정하고, 결정 기록이 승인된 선택을 남기며, 계획이 파일별 작업과 검증으로 바꾸고, 평가 자료가 입력과 기대값을 보존하는 반복은 필요하다. 따라서 현재 한국어 패키지의 [요구사항](../requirements.md), [채팅과 저장 결과물 결정](../decisions/chat-and-stored-output-review-boundary.md), [일반 산문과 문맥별 용어 결정](../decisions/general-prose-and-contextual-wording.md), [구현 계획](../plan.md)과 [평가 사례](./korean-review-evaluation-cases.md)는 역할이 겹치지 않는다. 조사 문서가 이들 문서의 내용을 대신 설명할 때만 줄인다.

일반 산문의 U+00B7과 문맥에 따른 용어 판정도 요구사항, 결정, AGENTS의 상시 작성 규칙, `SKILL.md`의 검사 절차, `korean.md`의 상세 기준과 평가 입력에서 각각 필요하다. 조사 문서가 승인 문구와 최종 운영 사례를 다시 길게 설명하는 부분만 감축 대상이다.

### 사례의 비교 구조

`korean.md`의 공통 판정 순서와 용어별 판정 질문은 같은 모양이지만 각 후보의 정상 전문용례와 독자 영향이 다르다. `examples.md`도 언어 공통 사례를 독립된 입력으로 제공한다. 이 구조를 줄이면 검토자가 한 사례만 읽고 판정을 추측하거나 서로 다른 기준으로 후보를 비교할 수 있다.

민감정보 검사는 저장소 정책, 설계와 개발 문서의 추가 제한, 스킬의 검사 절차와 대조 사례에서 각각 유지한다. Git에 저장하면 안 되는 값과 공개 독자에게 불필요한 경로는 판정 이유가 다르므로 AGENTS 안의 두 절도 단순 중복으로 합치지 않는다.

## 요구사항 작성자가 정해야 할 차이

두 AGENTS 배포본은 번역본의 표현 차이를 넘어 동작이 다른 부분이 있다. 어느 쪽이 현재 정책인지 확인할 근거가 없으므로 중복 감축 작업에서 함께 고치면 안 된다.

- 영어 배포본은 근본 문제를 남기는 피상적인 수정을 금지하지만 한국어 배포본은 작은 변경 자체를 금지한다.
- 영어 배포본은 필요한 해결을 피하지 말되 파괴적이거나 영향이 큰 행동 전에 승인을 받도록 한다. 한국어 배포본은 안전한 작업을 하지 말라고만 적는다.
- 프로젝트에 실행 명령이 없을 때 영어 배포본은 추론한 명령임을 밝히고 실행 전에 묻는다. 한국어 배포본은 답변에 포함하라고 한다.
- 외부 의존성과 내부 구현을 비교할 때 영어 배포본은 요구사항을 만족하는 선택 중 복잡성과 유지 비용이 낮은 쪽을 고른다. 한국어 배포본은 더 근본적인 선택지를 고른다.
- 영어 배포본은 저장소의 기존 브랜치와 커밋 규칙을 먼저 적용하고 기본값을 제공한다. 한국어 배포본은 이 저장소의 형식과 한국어 커밋 문구를 고정 규칙으로 제시한다.

요구사항 작성자가 공통 동작과 언어별 표현 예외를 정한 뒤 두 파일을 같은 변경 단위로 고쳐야 한다. 이 결정 전에도 각 파일 안의 일반 글쓰기와 한국어 채팅 규칙, AGENTS와 `SKILL.md` 사이의 실행 절차 중복은 별도로 줄일 수 있다.

## 파일별 판정

### 공통 문서 지침

- [설계 문서 지침](../../README.md) — `pass`. 설계 문서의 진입점이며 개발 지침과의 공통 표시 규칙은 독립 적용에 필요하다.
- [개발 문서 지침](../../../dev/README.md) — `pass`. 개발 작업의 진입점이며 설계 문서 지침으로 옮기면 단독 배포에서 기준이 빠진다.

### 현재 한국어 검토 설계 패키지

- [중복 감사 결과](./instruction-duplication-audit.md) — `pass`. 원본 규칙을 새로 선언하지 않고 감사 판정, 근거와 다음 판단 위치를 한곳에서 연결한다.
- [요구사항](../requirements.md) — `pass`. 결과와 적용 조건을 정하는 원문이다.
- [채팅과 저장 결과물 결정](../decisions/chat-and-stored-output-review-boundary.md) — `pass`. 스킬 호출 범위에 관한 승인 결과를 기록한다.
- [일반 산문과 문맥별 용어 결정](../decisions/general-prose-and-contextual-wording.md) — `pass`. U+00B7과 후보 용어 판정 원칙에 관한 승인 결과를 기록한다.
- [구현 계획](../plan.md) — `pass`. 결정 사항을 파일별 작업과 검증으로 바꾸는 반복은 계획의 책임이다.
- [비교 사례와 저장소 근거](./comparable-cases-and-repository-evidence.md) — `needs revision`. 끝의 적용 방향이 다른 조사와 계획을 다시 요약한다.
- [채팅 답변 조사](./conversational-korean-output-research.md) — `needs revision`. AGENTS 작성 조건과 스킬 호출 구분을 여러 절에서 되풀이한다.
- [평가 사례](./korean-review-evaluation-cases.md) — `pass`. 기준과 같은 문장이 회귀 입력과 기대 판정으로 쓰인다.
- [검토 시스템 조사](./korean-review-system-research.md) — `needs revision`. 일반 한국어 원칙을 다시 설명하고 파일별 변경 제안이 계획과 겹친다.
- [한국어 용어와 예시 조사](./korean-terms-and-agent-examples-research.md) — `needs revision`. 최종 운영 자료에 반영된 전체 사례를 조사 문서에도 유지한다.

### 이전 공개 결과물 설계 패키지

- [요구사항](../../public-output-audience-4d2c/requirements.md) — `pass`. 파생 문서가 연결해야 할 요구사항 원문이다.
- [구현 계획](../../public-output-audience-4d2c/plan.md) — `needs revision`. 작업별 완료 증거, 최종 검증과 끝 출처 목록이 일부 겹친다.
- [결정 기록 범위 조사](../../public-output-audience-4d2c/references/decision-record-scope-and-title-research.md) — `needs revision`. 요구사항 직접 인용과 끝 출처 목록을 줄여야 한다.
- [외부 출처 표시 조사](../../public-output-audience-4d2c/references/external-source-presentation-research.md) — `pass`. 출처 배치 원칙의 근거를 맡고 본문 링크를 끝에서 다시 열거하지 않는다.
- [한국어 문체 조사](../../public-output-audience-4d2c/references/natural-korean-and-ai-writing-research.md) — `needs revision`. 일반 판정 근거는 고유하지만 끝 출처 목록이 본문 링크를 반복한다.
- [작업 의도와 출처 조사](../../public-output-audience-4d2c/references/prompt-intent-and-artifact-provenance-research.md) — `needs revision`. 요구사항 직접 인용과 끝 출처 목록을 줄여야 한다.
- [독자 조사](../../public-output-audience-4d2c/references/public-output-audience-research.md) — `needs revision`. 조사 결과는 고유하지만 끝 출처 목록이 본문 링크를 반복한다.
- [재사용 검사 조사](../../public-output-audience-4d2c/references/reusable-output-checks-research.md) — `needs revision`. 파일별 책임과 적용 제안이 계획 및 스킬과 겹치고 끝 출처 목록도 반복한다.
- [민감한 입력 조사](../../public-output-audience-4d2c/references/sensitive-input-preservation-research.md) — `needs revision`. 근거는 고유하지만 요구사항 직접 인용과 끝 출처 목록을 줄여야 한다.

### 배포 지침과 스킬

- [use-words-review 실행 지침](../../../../skills/use-words-review/SKILL.md) — `pass`. 공통 검토 절차와 독립 검토에 필요한 입력을 정하는 파일이다. AGENTS 쪽의 절차 반복을 줄여야 한다.
- [언어 공통 사례](../../../../skills/use-words-review/references/examples.md) — `pass`. 공통 판정의 독립된 대조 입력이다.
- [한국어 판정 자료](../../../../skills/use-words-review/references/korean.md) — `pass`. 후보별 반복은 같은 질문으로 정상 용례와 문제 사례를 비교하는 데 필요하다.
- [영어 AGENTS 배포본](../../../../src/AGENTS.en.md) — `needs human input`. 파일 안의 중복은 줄여야 하지만 한국어 배포본과 다른 동작 중 어느 쪽을 유지할지 정해지지 않았다.
- [한국어 AGENTS 배포본](../../../../src/AGENTS.ko.md) — `needs human input`. 파일 안의 중복은 줄여야 하지만 영어 배포본과 다른 동작 중 어느 쪽을 유지할지 정해지지 않았다.

## 외부 자료와 저장소 판단의 관계

다음 외부 문서는 2026년 8월 2일에 다시 확인했다. 각 웹 문서는 별도 개정 번호를 제공하지 않아 확인 당시 게시본을 사용했다.

[Agent Skills 명세](https://agentskills.io/specification#progressive-disclosure)는 `SKILL.md`를 활성화할 때 전체를 읽고 세부 참조 파일은 필요할 때 읽는 구조를 권한다. [OpenAI 스킬 문서](https://learn.chatgpt.com/docs/build-skills), [OpenAI AGENTS 문서](https://learn.chatgpt.com/docs/agent-configuration/agents-md)와 [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)도 상시 지침과 작업별 절차 및 참조 자료를 나누는 현재 설계의 근거가 된다. 따라서 AGENTS, `SKILL.md`, 언어별 참조 자료를 하나로 합치는 방향이 아니라 각 파일이 맡을 실행 시점을 분명히 하는 방향으로 판정했다.

[Google의 교차 참조 지침](https://developers.google.com/style/cross-references)은 같은 대상을 한 문서에서 여러 번 연결하지 말고 가장 도움이 되는 위치에 한 번 연결하도록 권한다. 이는 이전 조사 문서의 끝 출처 목록과 요구사항 직접 인용을 줄이되 독자가 현재 판단을 이해하는 데 필요한 짧은 설명은 남겨야 한다는 판정과 맞는다.

## 한계와 다음 작업

이 감사는 중복의 위치와 각 내용을 남길 파일을 정했지만 삭제할 문장과 대체 문구를 확정하지 않았다. 실제 감축 작업에서는 요구사항, 결정과 운영 사례의 추적이 끊기지 않는지 파일별로 다시 확인해야 한다. 특히 조사 문서의 끝 출처 목록을 지울 때 확인 날짜나 커밋이 근거 범위를 정한다면 해당 본문 주장 가까이 옮겨야 한다.

정규화 문장과 공통 구간 검색은 의미가 같은 문장을 모두 찾지 못하며, 필요한 반복도 후보로 올린다. 최종 판정은 각 파일의 내용과 저장소 문서가 맡는 책임을 근거로 내렸다. 이후 원본이 바뀌면 이 문서의 판정도 다시 확인해야 한다.

다음 작업은 감축 자체와 AGENTS 의미 통일을 분리해야 한다. 권위 파일이 분명한 중복은 별도 승인된 변경에서 줄일 수 있다. 두 AGENTS의 동작 차이는 요구사항 작성자가 공통 규칙과 언어별 예외를 정한 뒤에만 수정한다.
