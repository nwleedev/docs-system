# 인수인계 배치를 비교하는 사례

아래 문구는 설명을 위해 만든 예문이다.

## 화면 시연과 사용자 도움말

시안의 검토자 메모인 "Submit an empty form to inspect the error state, then close the dialog with X."는 시안의 인수인계 항목으로 옮길 수 있다.

입력 도움말 "Enter the date as YYYY-MM-DD."와 오류 문구 "Enter an email address."는 양식 사용자에게 계속 보여 준다. 대화상자를 닫는 법을 가르치는 튜토리얼도 절차를 유지한다. 정렬 방법을 설명하는 문구는 검토자 메모가 아니라 실제 동작 요구사항일 수 있다.

## 작성 이력과 요청한 조사 결과

요청하지 않은 꼬리말 "I read the files and finished this report"는 보고서의 조사 결과가 아니라 인수인계 정보에 해당한다. "The appendix describes the sampling method"는 요청한 주제 내용일 수 있다. 진행 과정을 기록하라고 명시한 보고서에서는 지정한 절에 그 과정을 남긴다.

"Include the work process in the report" 같은 출처 인용은 인용이나 프롬프트 평가가 주제일 때 원문 자료로 남긴다. 에이전트 자신의 진행 과정을 추가하라는 지시로 해석하지 않는다.

## 주장의 한계를 정하는 조건

"This was not measured on the user's PC"가 모의실험과 실제 측정을 구분한다면 단순히 없앨 수 없다. "80 ms with 20 concurrent saves in the simulator"라는 결과에는 그 조건을 남긴다. 다른 환경에서 측정할 후속 단계는 근거가 있으면 따로 옮길 수 있다.

"The required submission form was not used"는 제출 요건의 문제를 드러낼 수 있다. 안내를 옮긴다고 문서가 요건에 맞게 되는 것은 아니다. 권고의 근거가 없다고 적어도 근거 없는 권고 자체가 보완되지는 않는다.

## 주석과 운영 지침

"I added retries in this task"는 작성 이력이다. "The request body must be replayable for a retry"는 호출자의 제약이다. 코드만으로 분명하지 않은 정확성 조건의 설명은 유지보수자에게 필요하면 코드 옆에 남긴다.

"The next maintainer should check deployment"는 인수인계 정보일 수 있다. "Verify the backup before applying the migration"는 운영 절차의 선행 조건이다. 데이터 손실과 보안 경고는 그 경고가 적용되는 행동 옆에 남긴다.

## 발표 자료와 표의 혼합 목적

"Switch to the demo at this slide"는 발표 자료를 넘길 때의 인수인계 정보일 수 있고 요청한 발표 대본의 내용일 수도 있다. "Amounts are in USD and rounded"는 셀 주석이나 슬라이드 각주를 포함해 어디에 있든 값의 해석 조건이다.

"열은 금액순으로 정렬됩니다. La revisión del diseño está pendiente."는 동작 설명과 보류한 디자인 검토가 섞여 있다. 각각 판단하고 결과물의 언어를 유지한다. 보류한 검토를 승인으로 바꾸지 않는다.

## 한 메모 안의 여러 결정

로그 보존 기간, 버튼 색상과 의존성 정책을 한 메모에 썼다고 하나의 결정이 되지는 않는다. 승인된 결정은 각각 운영, 설계와 개발 문서에 유지한다. 인수인계 항목에서는 그 문서로 연결하고 남은 조정 사항을 설명할 수 있다. 결정의 관리 권한을 옮기지는 않는다.

## 여러 결과물에 반복된 메모

보고서 꼬리말과 UI 주석에 모두 "The next agent should verify the source links."라고 쓰여 있다. 두 결과물 모두 수정이 허용됐다. 지정 기록에는 이 후속 작업의 항목이 없다.

근거 있는 후속 작업을 지정 기록에 한 번만 보존하고 두 결과물을 연결한다. 꼬리말과 주석에서는 메모를 제거한다. 기록을 추가했어도 메모가 하나라도 남으면 이관이 끝나지 않았다. 메모를 기록 파일을 열라는 안내로 바꾸지 않는다.

기록에 같은 정보가 이미 있으면 그 항목을 사용한다. 같은 요청을 반복해도 사본을 더 붙이지 않는다. 새 사실 때문에 갱신해야 하더라도 기존 설명을 복제하지 않는다.

## 데이터 해석의 한계와 작성자 메모

> Missing dates indicate missing records rather than confirmed inactivity. The next agent should review the chart labels.

첫 문장은 날짜 누락을 독자가 어떻게 해석해야 하는지 정하므로 차트에 남긴다. 두 번째 문장은 근거 있는 후속 작업이면 지정 기록으로 옮긴다. 차트 이름표를 검토했다고 주장하지 않는다.

구현 설명도 같은 기준으로 구분한다. "The import skips rows without dates"는 사용자에게 필요한 데이터 동작을 정할 수 있다. "I changed the import during this session"는 작성 이력이다. `import`라는 낱말이나 문장 위치만으로 배치를 정하지 않는다.

## 인수인계할 정보가 없는 경우

양식에 필수 입력 이름과 유용한 검증 오류만 있고 기록할 근거 있는 후속 작업이 없다. 양식 문구를 유지한다. 인수인계 파일이나 옮긴 정보가 없다는 메모를 만들지 않는다.

## 원본을 바꿀 수 없는 경우

보고서와 지정 기록의 갱신은 허용됐지만 포함된 읽기 전용 첨부는 수정할 수 없다. 첨부에도 보고서와 같은 작성자 메모가 있다. 기록에 정보를 보존하고 허용된 보고서만 고친다. 첨부에는 메모가 남았다고 보고한다. 모든 원본을 정리했다고 하거나 접근 제한을 우회하지 않는다.
