# 표현 선택을 비교하는 사례

아래는 표현 선택을 비교하기 위해 만든 예문이다. 문구 자체를 잘못된 것으로 취급하지 말고 명시된 근거를 사용한다.

## 장식 제거와 필수 표기 보존

문제가 되는 표현:

> Quick setup · safe storage · easy sharing

다음 행동이 근거로 확인됐으면 이렇게 쓴다.

> Complete the setup. Save the content. Share it with your team.

수식과 승인된 이름의 정확한 기호는 보존한다. 코드와 문자 검사에도 정확한 기호가 필요할 수 있다. 접근성에 필요한 표기를 유지한다. 기호 유지 여부는 독자의 필요로 정한다.

## 개인 위치 대체

저장소 예시가 있으면 특정 사용자의 데스크톱 위치로 안내하지 않는다.

> See `examples/config.yml` for an example configuration.

로컬 재현 위치가 반드시 필요하면 적절한 접근 제한이 있는 추적하지 않는 기록에만 둔다. 검토 답변에 민감한 위치나 자격 증명을 인용하지 않는다.

## 기존 문구를 새 독자에 맞게 수정

이전 문서로 사실을 확인할 수 있어도 문구까지 현재 독자에게 적합한 것은 아니다. 확인한 사실과 승인된 결정은 유지한다. 현재 독자에게 필요한 주체와 행동을 설명한다. 같은 속성을 같은 순서로 비교할 때는 반복 구조를 유지한다.

## 명확화와 승인 구분

> Apply the review findings to clarify the approved scope and confirm that it can be released.

무엇을 배포하며 누가 배포를 승인하는지 알 수 없어 사람의 판단이 필요하다. 문서를 분명하게 고쳤다고 승인이 생기는 것은 아니다. 문장을 대체하기 전에 빠진 관계를 확인한다.

다음 두 문장도 승인 사실을 입증하지 않는다.

> The reviewer lists the changed items. Release only the approved items.

승인 책임자와 승인 항목은 출처로 확인할 수 있을 때만 명시한다. 검토자를 승인자로 바꾸지 않는다.

## 모호한 대상 확인

> Submission path

> Separate it from the configuration code path.

두 대상 모두 확인이 필요하다. 첫 표현은 등록소 주소나 결과물 디렉터리일 수 있다. 두 번째는 파일 위치나 실행 순서와 분기일 수 있다. 대체 표현을 고르기 전에 실제 대상을 확인한다.

다음에도 비슷한 모호함이 있다.

> Attach the review findings and release log to the report. Retain this record for seven days.

보존 대상이 보고서 전체라는 근거가 있으면 이렇게 쓴다.

> Retain the report with its attached findings and release log for seven days.

근거가 없으면 어떤 기록을 보존해야 하는지 묻는다.

## 분명한 조건 보존

> Replace a personal path with a repository-relative path if the document contains one. Confirm that the file remains accessible at the revised path before sharing the document.

조건과 필수 행동을 구분할 수 있다. 고쳐 쓰더라도 접근 확인과 그 시점을 보존해야 한다.

## 사실과 인과 주장 구분

팀이 대시보드를 추가했다는 근거와 같은 달에 실패가 줄었다는 별도 기록이 있다. 인과관계까지 입증하지는 않는다.

근거 없는 표현:

> The team added a dashboard thereby reducing failures.

근거 있는 표현:

> The team added a dashboard. Failures fell during the same month.

근거 없는 주장을 대시보드가 효과 없었다는 선언으로 바꾸지 않는다. 그 결론도 근거에 없다.

## 타당한 범위와 용어 보존

> The archive contains reports from 2020 to 2025.

보관 자료로 확인할 수 있으면 기간을 유지한다. `from A to B` 자체가 결함은 아니다.

> Set the retention period to seven days. Keep the retention period unchanged during export.

두 문장 모두 `retention period`를 유지한다. 다른 명사로 바꾸면 다른 설정을 뜻한다고 이해할 수 있다.

## 의무를 바꾸지 않고 행동을 간결하게 표현

> Perform an evaluation of the revised text.

같은 뜻의 표현:

> Evaluate the revised text.

허용은 의무와 다르다.

> You may attach a source excerpt.

이를 인용문 첨부 의무로 바꾸지 않는다.

## 수식어와 조건의 적용 범위 유지

> Only editors may publish the report.

`only`를 `publish` 앞으로 옮기지 않는다. 누가 게시할 수 있는지가 아니라 편집자가 할 수 있는 행동을 제한할 수 있다.

> If editing is authorized then revise the draft and save the revision.

문장을 나눠도 두 행동 모두 조건을 유지해야 한다. 같은 조건은 목록으로 반복 없이 표현할 수 있다.

편집이 허용되면:

- 초안을 수정한다.
- 수정본을 저장한다.

문장을 줄이려고 저장을 무조건 실행하는 지시로 바꾸지 않는다.
