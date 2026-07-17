# 작업 지시가 문서의 제목과 결정 단위를 대신하지 않게 하는 방법

## 조사 질문과 소유 범위

이 문서는 [요구사항 문서](../requirements.md)의 다음 오류를 조사한다.

> 작업 지시 문구가 문서의 제목, 파일명이나 소제목을 대신한다.

> 한 프롬프트에 함께 적힌 서로 다른 요구가 하나의 문서나 결정으로 묶인다.

> 작업 지시가 결정의 근거, 현재 규칙이나 저장소에 관한 사실을 대신한다.

이 문서는 의사결정 기록과 설계 문서의 제목, 파일명, 책임 범위를 정하는 방법만 맡는다. 작업 지시를 원하는 결과로 해석하는 방법은 [작업 의도와 산출물 출처 조사](./prompt-intent-and-artifact-provenance-research.md)가, 실제 독자와 사용자 문구는 [독자 혼동 조사](./public-output-audience-research.md)가 맡는다. 원문과 개인정보의 보존 조건은 [민감한 입력과 원문 보존 조사](./sensitive-input-preservation-research.md)에서 다룬다.

조사는 2026년 7월 17일에 수행했다. 의사결정 기록 지침과 템플릿, 요구사항 작성 지침, 공개 저장소의 기록 사례, 의사결정 기록 생성 연구를 원문과 소스 코드에서 확인했다. 이 문서는 조사 결과와 적용 제안을 기록하며, 어떤 결정을 승인하거나 문서 분할 방식을 의무화하지 않는다.

## 결론

프롬프트의 문장이나 프롬프트에 함께 적힌 항목 수는 문서 단위를 정하는 근거가 아니다. 의사결정 기록은 나중에 독립적으로 승인·거절·대체할 수 있는 한 선택과 그 이유를 맡아야 한다. 제목과 파일명은 작업을 시작할 때 받은 문구가 아니라 결정 질문, 선택한 결과, 적용 범위를 확인한 뒤 정한다.

작업 지시는 조사할 문제를 가리키는 입력으로 쓸 수 있지만 다음 사실을 입증하지 못한다.

- 저장소가 현재 그렇게 동작한다.
- 해당 규칙이 이미 승인됐다.
- 여러 요구를 한 결정으로 묶어야 한다.
- 작업 지시의 표현이 문서 제목으로 적합하다.

따라서 요구사항, 저장소 상태, 승인 기록을 각각 확인하고, 제목은 마지막에 작성하는 절차가 필요하다.

## 한 기록이 맡을 결정 단위

ADR 사이트는 아키텍처 의사결정 기록을 한 결정과 그 이유를 담는 문서로 정의한다. MADR 템플릿도 제목을 해결한 문제와 선택한 해법을 나타내도록 하고, 상황·결정 요인·고려한 선택지·결과를 나눠 기록한다. 두 자료 모두 프롬프트 한 건이나 작업 세션 한 건을 문서 단위로 삼지 않는다. [ADR GitHub 조직](https://adr.github.io/), [MADR 템플릿 `835fc94`](https://github.com/adr/madr/blob/835fc94baa37887774b1cddddb2ae874881e703b/template/adr-template.md)

NASA의 요구사항 작성 지침은 한 요구가 한 가지 생각만 표현하고 개별적으로 식별·검증·추적될 수 있어야 한다고 설명한다. 또 서로 다른 요구의 결합을 줄이고 인력이나 절차 같은 구현 지시를 요구사항에 섞지 않도록 한다. 의사결정 기록과 요구사항은 같은 문서가 아니지만, 서로 독립적으로 추적해야 할 내용이 한 문장이나 한 기록에 묶이지 않아야 한다는 기준은 공통으로 적용할 수 있다. [NASA, Appendix C: How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)

다음 질문 가운데 하나라도 `예`라면 별도 기록 후보로 본다.

- 한 부분만 승인하거나 거절해도 다른 부분의 결론이 유지되는가.
- 한 부분만 나중에 대체할 수 있는가.
- 비교할 선택지와 결정 요인이 서로 다른가.
- 적용 범위, 독자, 검증 방법이 서로 다른가.
- 한 부분을 제거해도 다른 기록을 이해하고 사용할 수 있는가.

관련성이 있다는 이유만으로 무조건 나눌 필요는 없다. 하나의 선택을 설명하는 데 함께 바뀌어야 하고 같은 승인·대체 시점을 갖는 내용은 한 기록 안에 둘 수 있다. 분할 기준은 문장 수가 아니라 결정의 독립성이다.

## 공개 저장소에서 확인한 분리 사례

Backstage의 공식 저장소는 같은 플러그인 등록 문제를 다루면서도 플러그인을 식별하는 파일 이름과 플러그인을 등록하는 방법을 별도 ADR로 기록했다. 한 기록은 등록 방법을 명시적으로 적용 범위에서 제외하고, 다른 기록이 그 선택을 맡는다. 관련 주제를 두 기록으로 나눠 각각의 선택지와 결과를 유지한 실제 사례다. [Backstage ADR 002](https://github.com/backstage/backstage/blob/836fec8c68d08f9cf253260908d39fa250863beb/docs/architecture-decisions/adr002-default-catalog-file-format.md), [Backstage ADR 008](https://github.com/backstage/backstage/blob/836fec8c68d08f9cf253260908d39fa250863beb/docs/architecture-decisions/adr008-plugin-package-structure.md)

AWS와 Microsoft의 ADR 지침도 중요하고 되돌리기 어려운 선택을 기록하고, 상황·선택지·결과·상태를 남기라고 한다. AWS는 각 ADR이 한 선택과 그 상황·결과를 설명하고, 새 선택이 기존 기록을 대체할 때 새 ADR을 만들도록 한다. Microsoft는 기록을 짧고 사실에 맞게 한 주제에 집중하며, 여러 단계의 선택은 각각 기록하라고 한다. 두 자료는 제목을 프롬프트에서 가져오라고 하지 않는다. [AWS Prescriptive Guidance, ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), [Microsoft Azure Architecture Center, ADR](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)

반대로 자동화 도구가 입력받은 `DecisionTitle`을 문서 제목과 파일명에 직접 넣는 공개 skill도 확인했다. 입력값이 사람이 검토한 결정명이라면 편리하지만, 작업 지시 문구가 그대로 전달되면 제목과 파일명으로 확산되는 지점이다. 이는 실제 누출률을 측정한 사례가 아니라, 입력 검증 없이 제목을 재사용하는 구현이 만드는 위험 경로다. [GitHub Awesome Copilot ADR skill `38ab136`](https://github.com/github/awesome-copilot/blob/38ab136c6961ba841513ee8f8ef109015d61c4e2/skills/architecture-decision-record/SKILL.md)

## 제목과 파일명은 결정 뒤에 정한다

MADR은 제목이 해결한 문제와 해법을 나타내야 한다고 설명한다. 이를 요구사항에 적용하면 다음 순서가 알맞다.

1. 사람이 승인한 요구사항과 저장소에서 확인한 현재 상태를 분리한다.
2. 결정해야 하는 질문 한 가지와 적용하지 않을 범위를 적는다.
3. 실제로 고려할 선택지와 결정 요인을 비교한다.
4. 사람이 승인한 결과와 이유를 기록한다.
5. 결정 질문과 승인 결과를 가장 짧게 구분하는 제목을 쓴다.
6. 저장소의 파일명 규칙에 맞춰 제목을 축약하되 작업 지시나 개인 식별자를 넣지 않는다.

제목을 먼저 고정하면 이후 조사와 결론이 그 표현에 끌릴 수 있다. `무엇을 하라`는 명령형 문구보다 `어떤 조건에서 무엇을 선택했는가`가 드러나는 이름이 기록을 찾고 대체하기 쉽다.

Dhar 외는 95개 ADR 생성 결과를 비교해 ADR 형식 지시가 형식 준수를 개선했지만, 제목을 추가로 제공한 조건이 품질을 분명히 높이지는 않았다고 보고했다. 모델 출력은 사람의 아키텍처 결정과 같은 수준으로 볼 수 없었다. 이 연구는 제목 복사를 직접 측정하지 않았지만, 제목을 프롬프트에 넣는 것만으로 좋은 결정 기록이 되지 않는다는 제한된 실험 근거다. [Dhar 외, Using Large Language Models to Generate Architectural Decision Records, 2024](https://arxiv.org/abs/2403.01709)

## 검토 대상 저장소에서 확인한 위험

검토 대상 저장소의 현재 개정에서는 서로 독립적으로 재검토할 수 있는 주제가 한 결정 기록에 묶인 사례와, 여러 개발 규칙을 한 결정으로 다룬 사례를 확인했다. 한 기록의 제목에는 작업 지시의 표현이 결정명처럼 들어갔다. 이 관찰은 특정 저장소의 문서 구조를 확인한 결과이며, 같은 작성 방식이 모든 AI 도구에서 반복된다는 통계 근거는 아니다.

문서에는 해당 저장소의 이름, 로컬 위치, 파일명, 원문을 남기지 않았다. 이 사례가 보여 주는 것은 프롬프트의 항목 구성이 문서 단위를 대신할 수 있다는 위험뿐이다. 실제 개선 여부는 기록을 독립적으로 승인·대체·검증할 수 있는지로 판단해야 한다.

## 적용 제안

후속 설계가 승인된다면 문서 생성 전에 다음 중간 산출물을 비공개 작업 자료로 만들 수 있다.

- 결정 후보: 승인이나 대체 시점이 같은 선택 묶음
- 근거: 정확한 요구사항 인용, 현재 저장소 증거, 승인 기록
- 제외 범위: 관련돼 보이지만 다른 결정이 맡을 내용
- 검증: 각 결정 결과를 확인할 관찰 가능한 증거

그 뒤 각 후보를 `하나만 승인·거절할 수 있는가`와 `하나만 대체할 수 있는가`로 검토한다. 공개 문서에는 작업 지시나 이 분류 과정이 아니라 승인된 결정과 독자가 필요한 근거만 기록한다. 제목·파일명 후보에 프롬프트의 긴 일치 구절, 작업 명령, 개인 경로가 있는지는 공개 전 검사할 수 있지만, 문자열 검사만으로 결정의 단위가 알맞은지는 판정할 수 없다.

## 한계와 남은 질문

- 공개 자료에서 AI가 프롬프트를 ADR 제목으로 복사한 발생률이나 이를 줄인 통제의 효과 수치는 찾지 못했다.
- ADR 지침은 주로 소프트웨어 아키텍처를 대상으로 한다. 조사 보고서와 자료 수집 문서는 승인·대체 대신 조사 질문과 독립된 근거 범위로 문서 단위를 다시 정해야 한다.
- 서로 강하게 결합된 결정을 지나치게 나누면 맥락을 반복하고 연결 관계를 찾기 어려워진다. 분리 여부는 사람의 판단이 필요하다.
- 제목을 결정 뒤에 쓰는 절차의 효과는 대상 저장소의 실제 사례로 비교해야 한다.

## 조사 반복과 중단 근거

네 차례 검색과 원문 대조를 수행했다.

1. ADR의 정의, 제목, 기록 단위에 관한 공식 지침을 확인했다.
2. 요구사항의 독립성·추적성 기준과 공개 저장소의 분리 사례를 대조했다.
3. AI가 ADR을 만드는 공개 skill과 생성 연구에서 제목 입력의 역할을 확인했다.
4. 프롬프트 제목 복사와 여러 결정을 한 기록에 묶는 직접 사례를 추가 검색했다.

마지막 검색에서는 `한 결정의 독립성`, `근거와 작업 지시 분리`, `결정 뒤 제목 작성`, `연결된 기록 사이의 명시적 범위 분리` 외의 새 예방 범주가 나오지 않았다. 직접 발생률 연구도 찾지 못해 이 조사 범위는 포화 상태로 판단했다.

## 검토한 출처와 시점

- ADR GitHub 조직, [Architectural Decision Records](https://adr.github.io/), 2026-07-17 확인.
- MADR, [ADR template](https://github.com/adr/madr/blob/835fc94baa37887774b1cddddb2ae874881e703b/template/adr-template.md), 커밋 `835fc94baa37887774b1cddddb2ae874881e703b`, 2026-07-17 확인.
- NASA, [Appendix C: How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/), 2026-07-17 확인.
- AWS, [ADR process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), 2026-07-17 확인.
- Microsoft, [Architectural decision records](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record), 2026-07-17 확인.
- Backstage, [ADR 002와 ADR 008](https://github.com/backstage/backstage/tree/836fec8c68d08f9cf253260908d39fa250863beb/docs/architecture-decisions), 커밋 `836fec8c68d08f9cf253260908d39fa250863beb`, 2026-07-17 확인.
- GitHub Awesome Copilot, [Architecture decision record skill](https://github.com/github/awesome-copilot/blob/38ab136c6961ba841513ee8f8ef109015d61c4e2/skills/architecture-decision-record/SKILL.md), 커밋 `38ab136c6961ba841513ee8f8ef109015d61c4e2`, 2026-07-17 확인.
- Dhar 외, [Using Large Language Models to Generate Architectural Decision Records](https://arxiv.org/abs/2403.01709), 2024-03-04 제출본, 2026-07-17 확인.
