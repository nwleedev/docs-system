# 에이전트 지침 책임 분리 적용 계획

이 계획은 [`requirements.md`](./requirements.md)의 "목표", "유지할 전역 원칙"과 "완료 조건"을 기준으로, 사용자가 수정할 수 있는 Skill 참고 구현과 Compound Skills가 없는 실행 환경을 함께 지원한다. 자동 설치기, Plugin 패키지와 별도의 Git workflow Skill은 추가하지 않는다.

## 설계 기록을 현재 결정에 맞춘다

먼저 [`decisions/cross-project-agent-policies.md`](./decisions/cross-project-agent-policies.md)와 [`references/instruction-layering-research.md`](./references/instruction-layering-research.md)를 갱신한다.

- `skills/`를 완성된 Plugin이나 설치 제품이 아니라 프로젝트별 수정이 가능한 참고 구현으로 확정한다.
- 두 `use-*` Skill의 `_README.md`는 Skill 디렉터리와 함께 설치되는 시작 자료이며, 저장소 기준 README가 없을 때 승인받아 새 README를 만드는 데 사용한다고 기록한다. 생성 뒤에는 저장소 README가 현재 규칙을 관리한다.
- 각 `_README.md`의 한 줄 관리용 주석은 대응하는 `docs/*/README.md`와 공통 규칙을 비교하고 기본본을 교체할 시점을 알려 주며, 저장소 기준 README를 만들 때에는 제외한다고 기록한다.
- Compound Skills는 선택 사항이며 두 `src` 예시의 Git 규칙이 특정 Compound Skill을 요구하지 않는다고 기록한다.
- 두 `src` 예시가 Compound 관리 본문을 포함한다는 오래된 설명과 이미 해결된 미결정 사항을 제거한다.
- 새 worktree 브랜치는 사용자가 명시적으로 요청한 뒤 AGENTS.md의 위치와 이름 규칙에 따라 생성한다고 기록한다.

**검증:** 결정 문서가 요구사항 작성자의 승인 내용만 결정으로 기록하고, 조사 문서의 현재 상태 설명이 두 `src` 파일과 일치하는지 확인한다.

## 참고 구현의 적용 방법을 설명한다

[`README.md`](../../../README.md)와 [`README.ko.md`](../../../README.ko.md)를 같은 의미로 정리한다.

- `skills/`의 파일은 사용자가 선택하고 수정하는 참고 구현이며 자동으로 발견되거나 완전한 Plugin으로 설치되지 않는다고 설명한다.
- `skills/use-design-docs` 또는 `skills/use-dev-guidance` 디렉터리 전체를 설치 위치로 옮기면 각 `references/_README.md`도 함께 설치된다고 설명한다.
- 저장소 기준 README가 없고 사용자가 생성을 승인하면 설치된 설계용 `_README.md`의 내용으로 `docs/designs/README.md`를, 개발용 `_README.md`의 내용으로 `docs/dev/README.md`를 만든다고 설명한다.
- 각 `use-*` Skill을 채택할 때 기존 저장소 README를 우선하며, `_README.md`는 기존 파일을 덮어쓰거나 자동으로 맞추는 자료가 아니라고 설명한다.
- `_README.md`의 관리용 주석은 참고 구현 관리에만 사용하고 새 저장소 기준 README에서는 제외한다고 설명한다.
- `$use-*` 호출문을 채택하지 않는 프로젝트에는 해당 Skill을 필수 조건으로 만들지 않는다.
- Compound가 없어도 Git의 worktree와 commit 기능을 직접 사용할 수 있으며, Compound가 있더라도 Plugin 관리 본문을 이 저장소의 예시에 복제하지 않는다고 설명한다.

**검증:** 두 README가 `skills/`를 배포가 끝난 제품으로 표현하지 않고, 지원하지 않는 설치 또는 업그레이드 기능을 약속하지 않는지 대조한다.

## 저장소 기준 README 생성을 지원한다

[`skills/use-design-docs/SKILL.md`](../../../skills/use-design-docs/SKILL.md)와 [`skills/use-dev-guidance/SKILL.md`](../../../skills/use-dev-guidance/SKILL.md)의 기준 문서 확인 절차를 같은 원칙으로 바꾼다.

- Skill을 호출하면 저장소 루트와 해당 `docs/*/README.md`의 존재 여부를 먼저 확인한다.
- README가 있으면 전체를 읽고 저장소의 유일한 현재 기준으로 사용한다. 같은 Skill의 `_README.md`는 읽거나 비교하지 않는다.
- README가 없으면 현재 요청을 완료하는 데 저장소별 설계 문서 또는 개발 지침 기준이 필요한지 확인한다.
- 기준이 필요하면 사용할 `_README.md`와 새 README의 위치를 밝히고 사용자에게 생성을 요청한다.
- 사용자가 승인하면 대상 디렉터리를 만들고 설치된 `_README.md`의 내용으로 정해진 위치의 README를 생성한 뒤, 새 README 전체를 다시 읽고 작업을 계속한다.
- README를 생성할 때에는 `_README.md`의 한 줄 관리용 HTML 주석을 제외한다.
- 사용자가 거절하면 저장소 지침, 기존 문서 위치와 폴더 구조를 확인하여 요청한 파일을 근거가 있는 위치에 작성한다. 적절한 위치를 저장소 근거로 정할 수 없으면 위치를 사용자에게 확인한다.
- 기존 README를 `_README.md`로 덮어쓰거나, 생성 뒤 두 파일을 자동으로 동기화하지 않는다.

두 `_README.md`의 시작 부분에 관리용 HTML 주석을 한 줄씩 추가한다.

- 설계용 주석은 `docs/designs/README.md`와 비교하고 공통 내용이 바뀌었으면 기본본을 교체하도록 안내한다.
- 개발용 주석은 `docs/dev/README.md`와 비교하되 현재 저장소에만 적용되는 문서 링크와 지침을 제외하고 공통 내용을 교체하도록 안내한다.
- 주석의 경로와 교체 조건은 Skill의 저장소 기준 README 생성 절차 및 README 사용 안내와 같은 의미를 가져야 한다.

**검증:** Skill 디렉터리 전체를 설치했을 때 `_README.md`도 함께 설치되는지 확인한다. 각 `_README.md`의 문서 시작 부분에 대응하는 저장소 README와 교체 조건을 적은 관리용 HTML 주석이 정확히 한 줄 있는지 확인한다. 설계용 `_README.md`는 주석을 제외한 전체 내용이 `docs/designs/README.md`와 일치하는지 확인한다. 개발용 `_README.md`는 `docs/dev/README.md`에서 현재 저장소 전용 문서 링크와 지침을 제외한 공통 내용 전체와 일치하는지 확인한다. 새로 생성한 저장소 README에 관리용 주석이 남지 않는지 확인하고, README 존재, 생성 승인, 생성 거절과 위치 근거 부족의 네 경우에서 Skill이 정해진 절차를 선택하는지 검토한다.

## Git 규칙을 Compound 설치 여부와 분리한다

[`src/AGENTS.en.md`](../../../src/AGENTS.en.md)와 [`src/AGENTS.ko.md`](../../../src/AGENTS.ko.md)의 Git 절을 조정한다.

- 새 worktree 브랜치는 사용자가 생성을 명시적으로 요청한 경우에만 만든다고 적는다.
- 생성 요청 뒤에는 현재 저장소의 보호 브랜치, 이름과 수동 worktree 위치 규칙을 적용한다.
- Compound Skills가 없으면 Git 기능을 직접 사용하고, 설치돼 있어도 특정 Compound Skill을 필수 조건으로 만들지 않는다.
- Plugin이 관리하는 도구 매핑 본문을 두 `src` 예시에 추가하지 않는다.

**검증:** Compound 관련 Skill이 없는 환경에서도 두 `src` 예시만으로 요청된 worktree와 commit 작업의 조건을 확인할 수 있고, 새 Git workflow Skill이 필요하지 않은지 검토한다.

## 개발 작업의 호출 조건과 절차를 보완한다

[`src/AGENTS.en.md`](../../../src/AGENTS.en.md), [`src/AGENTS.ko.md`](../../../src/AGENTS.ko.md), [`skills/use-dev-guidance/SKILL.md`](../../../skills/use-dev-guidance/SKILL.md)와 [`docs/dev/README.md`](../../dev/README.md)를 순서대로 조정한다. 적용할 `docs/dev` 지침은 `docs/dev/README.md` 하나이며 새 주제 문서는 만들지 않는다.

- 두 `src` 예시의 `$use-dev-guidance` 호출 조건에 소스 코드, 테스트, CLI, 라이브러리, 스크립트, 빌드, CI와 설정 변경을 포함한다.
- `use-dev-guidance`가 변경 전 유지할 동작, API, 데이터, 오류 처리와 호출 지점을 확인하도록 한다.
- 기존 코드의 반복 여부만으로 패턴을 선택하지 않고 현재 버전의 공식 자료, 저장소 지침과 검사 결과를 근거로 선택하게 한다.
- UI 변경에는 필요한 브라우저 검사를, CLI, 서비스와 백그라운드 작업에는 실행 환경 또는 통합 검사를 선택하게 한다.
- 저장소에 실행 명령이 없으면 추론한 명령을 현재 명령처럼 쓰지 않고 제안과 실행 승인을 구분한다. 직접 시작한 프로세스는 검증 뒤 종료한다.
- 외부 의존성의 통합 구조와 적용 가능한 디자인 패턴을 조사하되, 패턴이 없으면 이름을 만들지 않는다. 실제 의존성 변경 뒤에는 manifest, lockfile 또는 저장소가 사용하는 해석된 의존성 그래프의 변경을 다시 확인한다.

**검증:** 각 호출 조건과 절차가 한 파일에서 관리되는지 확인하고, `docs/dev/README.md`의 현재 포함 조건과 검사 원칙을 만족하는지 검토한다.

## 기존 문구 검토 자산을 보존한다

`skills/use-design-docs`는 저장소 기준 README 생성 절차만 변경한다. `skills/use-words-review`의 현재 실행 절차와 `skills/use-words-review/scripts/`의 검사 스크립트는 수정하거나 다른 위치에 복제하지 않는다.

**검증:** 변경 파일 목록에 기존 문구 검사 스크립트가 없고, 두 `src` 예시의 `$use-design-docs`, `$use-dev-guidance`와 `$use-words-review` 호출명이 실제 Skill 이름과 일치하는지 확인한다.

## 전체 결과를 확인한다

마지막으로 두 언어의 전역 예시와 변경한 문서를 함께 검사한다.

- 한국어와 영어 예시의 변경 권한, 검사 무력화 금지, Skill 호출, Git worktree 및 commit 규칙이 같은 행동을 요구하는지 확인한다.
- 두 `src` 예시에 `$ce-worktree`, `$ce-commit`과 Compound 관리 본문이 없는지 확인한다.
- 새 worktree 생성은 사용자 요청으로 시작하고, Compound 유무는 Git 규칙 적용 여부를 바꾸지 않는지 확인한다.
- Markdown 링크, 개인 절대 경로, 비공개 식별자와 미해결 표시를 검사한다.
- `use-words-review`의 기존 자체 검사를 실행하고, 변경한 한국어 문서를 저장하기 전에 문구 검토를 수행한다.

문서가 요구사항과 절차를 설명한다는 사실만으로 실제 실행 준수를 주장하지 않는다. 변경한 파일과 검사 결과를 담당 검수자가 확인한 뒤 완료로 판정한다.

## 중단 조건

- 완성된 Plugin, 자동 설치 또는 새 Git workflow Skill이 필요해지면 현재 요구사항을 넘어가므로 작업을 멈추고 요구사항 작성자에게 확인한다.
- Compound가 없는 환경에서만 적용할 별도 Git 규칙이 필요해지면 공통 Git 규칙으로 해결할 수 있는지 먼저 검토하고, 행동이 달라지면 승인을 받는다.
- 두 언어 예시가 서로 다른 변경 권한이나 안전 규칙을 요구하게 되면 배포하지 않고 차이를 보고한다.
- `_README.md`를 기존 저장소 README에 덮어쓰거나, 사용자가 생성을 거절한 뒤 저장소 근거 없이 새 문서 위치를 정해야 하면 작업을 멈춘다.
- 관리용 주석을 새 저장소 README에 남겨야만 생성할 수 있거나, 개발용 기본본에 현재 저장소 전용 지침을 포함해야 하면 작업을 멈춘다.
- 기존 `use-words-review` 스크립트를 변경하거나 제거해야 한다면 작업을 중단한다.
