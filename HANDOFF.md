# 설계 스킬 전환 인수인계

`use-flexible-designs` 전환을 위한 요구사항과 구현 계획을 작성했다. 설계 기준, 요구사항 보완 절차와 이름 전환을 반영했다. 생성 스크립트와 최종 검증은 진행 전이다.

- [요구사항](./docs/designs/flexible-designs-4f8c/requirements.md)은 최소 작성과 보완을 기본으로 하고 빈 문서 준비, 상세 작성과 구조 정리를 구분한다.
- [계획](./docs/designs/flexible-designs-4f8c/plan.md)은 기준 규칙 변경, 탐색과 보완 순서, 이름 전환, 생성 스크립트 추가와 마지막 검증 순서다. 0바이트 파일, 입력 옵션과 Node.js 최소 버전은 요구사항에서 파생한 구현 선택이며 구현 결과가 아니다.
- [조사 자료](./docs/designs/flexible-designs-4f8c/references/creation-and-decision-research.md)는 현재 규칙과 외부 1차 자료를 비교한다.
- [스킬 구성 조사](./docs/designs/flexible-designs-4f8c/references/request-routing-and-skill-structure.md)는 스킬 분리 여부, 자료를 읽는 시점, 의미 보존과 빠지기 쉬운 상황을 비교한다.
- [최소 작성 결정](./docs/designs/flexible-designs-4f8c/decisions/minimal-writing-default.md)은 기본 작성 방식의 선택 이유와 계획 영향을 기록한다.

기존 계획의 빈 문서 기본 생성은 최소 작성과 보완으로 변경했다. 빈 파일 생성 스크립트는 내용 작성을 맡지 않으며 별도로 빈 문서를 준비할 때 사용한다. 기존 문서를 다시 만들거나 삭제하는 작업은 포함하지 않는다.

기존 설계 폴더 배치와 폴더 이름의 짧은 식별자를 유지한다. 금지하는 별도 ID는 요구사항, 플랜, 리서치와 결정 문서 및 그 안의 항목에 붙이는 번호다. 기존 폴더의 문서 보완과 자료 추가는 새 설계 묶음 생성과 구분하며 원래 파일과 절 이름으로 연결한다.

이번 문서의 검토 대상은 의미 보존, 요구사항과 계획의 연결, 링크, 민감정보와 한국어 표현이다. 설계 문서는 `main`에서 작성했고 구현은 `chore/flexible-designs`에서 진행한다. 단계별 변경은 계획의 진행 상태로 이어간다. 문서와 계획에는 인물이나 역할 명칭을 넣지 않았으며 생성 스크립트 실행 검증은 구현 이후에 남아 있다.
