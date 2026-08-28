# Docs System

[English](./README.md)

`Docs System`는 코딩 에이전트와 함께 일하는 팀의 작업 지침과 문서 관리 방식을 연구하는 저장소입니다. 애플리케이션이나 모든 프로젝트에 적용하는 통합 템플릿이 아닙니다. 대상 저장소의 코드, 설정, 문서와 승인된 결정으로 뒷받침할 수 있는 규칙만 선택합니다.

## 저장소 파일

- [`AGENTS.md`](./AGENTS.md)는 이 저장소에서 사용하는 예시입니다. [`src/AGENTS.en.md`](./src/AGENTS.en.md)와 [`src/AGENTS.ko.md`](./src/AGENTS.ko.md)는 다른 저장소에서 수정해 쓰는 참고 문서입니다.
- [`docs/designs/README.md`](./docs/designs/README.md)는 이 저장소의 설계 문서 규칙을 정합니다. [`use-design-docs`](./skills/use-design-docs/SKILL.md)는 각 저장소의 기준 README에 따라 요구사항, 조사, 결정, 계획과 검증 작업을 진행합니다.
- [`docs/dev/README.md`](./docs/dev/README.md)는 이 저장소의 개발 지침 규칙을 정합니다. [`use-dev-guidance`](./skills/use-dev-guidance/SKILL.md)는 각 저장소의 기준 README에 따라 기술 조사, 검사, 의존성 작업, 지침과 구현 검증을 진행합니다.
- [`use-better-terms`](./skills/use-better-terms/SKILL.md)는 저장하거나 공유할 글과 이름에 근거로 뜻을 보존하는 대체 표현을 먼저 적용하고, 새 뜻이 필요한 변경은 사람의 판단을 요청합니다.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md)는 특정 기술 구성을 조사하는 프롬프트 예시이며 다른 프로젝트의 기본값이 아닙니다.

`src/`의 두 언어 문서는 따로 관리합니다. 필요한 절을 가져오기 전에 두 파일의 내용을 비교합니다.

## AGENTS 참고 문서 적용

1. 대상 저장소의 코드, 설정, 테스트, 문서와 승인된 결정을 확인합니다.
2. `src/`의 언어별 파일 하나에서 시작해 대상 저장소가 실제로 수행하는 작업에 필요한 절만 가져옵니다.
3. 도구, 브랜치 운영 방식, 명령과 기술별 규칙은 대상 저장소에서 확인한 내용으로 바꿉니다.
4. 완성한 내용을 Codex용 루트 `AGENTS.md`처럼 에이전트가 읽는 지침 파일에 저장합니다.

이 저장소는 지침 파일을 자동으로 만들거나 합치지 않습니다. 가져간 파일은 짧게 유지하고 자세한 내용은 관리할 수 있는 저장소 문서에 연결합니다.

## Skill 설치와 제거

선택한 Skill 디렉터리를 참고 자료와 스크립트까지 모두 복사해 도구가 찾는 위치에 둡니다.

- Codex 저장소: `.agents/skills/<skill-name>/`
- Codex 사용자: `$HOME/.agents/skills/<skill-name>/`
- Claude Code 저장소: `.claude/skills/<skill-name>/`
- Claude Code 사용자: `$HOME/.claude/skills/<skill-name>/`
- Plugin: `<plugin-root>/skills/<skill-name>/`

현재 위치는 [Codex Skill 문서](https://developers.openai.com/codex/skills) 또는 [Claude Code Skill 문서](https://code.claude.com/docs/en/skills)에서 확인합니다. 이 저장소의 `skills/`는 조사 자료이므로 그 아래에 있다는 이유만으로 자동 탐색되지 않습니다.

[`src/AGENTS.en.md`](./src/AGENTS.en.md) 또는 [`src/AGENTS.ko.md`](./src/AGENTS.ko.md)에서 설치한 Skill의 호출 절을 골라 도구가 읽는 지침 파일에 추가합니다. `use-better-terms` 절은 `BEGIN USE BETTER TERMS`와 `END USE BETTER TERMS`로 구분되며, 설계 및 개발 Skill의 절은 각 책임을 제목으로 사용합니다. Claude Code에서는 `CLAUDE.md`에 추가하거나 필요한 `AGENTS.md`를 `@AGENTS.md`로 불러옵니다.

Skill을 제거할 때에는 복사한 Skill 디렉터리와 호출 절을 삭제합니다. Skill이 만들었거나 사용한 저장소 기준 README, 다른 지침과 다른 규칙에 필요한 import는 그대로 둡니다.
