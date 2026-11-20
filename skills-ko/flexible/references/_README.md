# 설계 문서

이 디렉터리는 프로젝트 전반적으로 유지되어야 하는 요구사항, 근거, 결정과 플랜을 보관한다. AI는 검토, 조사, 승인된 결정 기록, 계획과 검증을 할 수 있지만 요청하지 않은 사항을 생성하거나 별도의 안내 없이 수정하지 않는다.

`requirements.md`는 임의로 변경해서는 안된다. 명시적인 지시가 있을 때에만 수정할 수 있다.

## 묶음과 문서 구성

```text
docs/designs/
  README.md
  <topic>-<short-id>/
    requirements.md
    references/
      <research-topic>.md
    decisions/
      <decision-topic>.md
    plan.md
```

각각의 주제마다 `requirements.md`가 존재한다.

참고, 결정과 플랜 파일은 아래의 생성 조건을 충족할 때만 만든다. 빈 디렉터리나 임시 내용을 만들지 않는다.

주어진 요구사항에 대해서 유사한 요구사항 파일이 있는지 파악한다. 새로운 요구사항 문서를 생성하라는 명시적인 지시가 있으면 문서를 생성하고, 그렇지 않으면 기존 요구사항 파일을 업데이트하는 방식으로 진행한다.

## `requirements.md`

## `references/*.md`

## `decisions/*.md`

## `plan.md`
