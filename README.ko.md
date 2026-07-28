# Docs System

[English](./README.md)

`Docs System`는 코딩 에이전트와 함께 일하는 팀이 작업 지침과 개발 문서를 어떻게 관리할지 연구하는 저장소입니다. 애플리케이션도 아니고, 어느 프로젝트에나 그대로 적용할 수 있는 통합 템플릿도 아닙니다.

이 저장소의 파일은 대상 저장소용 문서를 만들 때 참고하는 출발점입니다. 필요한 부분만 고르고, 실제 도구와 위험 요소에 맞춰 고쳐 씁니다. 코드, 설정 또는 팀의 결정으로 뒷받침할 수 없는 규칙은 가져가지 않습니다.

## 파일 안내

- [`AGENTS.md`](./AGENTS.md)는 이 저장소에서 실제로 사용하는 예시입니다. 영어로 작성되어 있으며, 에이전트가 한국어로 소통하고 프로젝트 문서를 쓰도록 안내합니다.
- [`src/AGENTS.en.md`](./src/AGENTS.en.md)는 영어 사용자를 위한 참고 문서입니다.
- [`src/AGENTS.ko.md`](./src/AGENTS.ko.md)는 한국어 사용자를 위한 참고 문서입니다.
- [`docs/designs/README.md`](./docs/designs/README.md)는 모든 프로젝트에 같은 문서 틀을 강요하지 않으면서 요구사항, 조사 결과, 결정 사항, 계획과 검증 결과를 관리하는 방법을 설명합니다.
- [`docs/dev/README.md`](./docs/dev/README.md)는 개발 지침을 조사하고 정리한 뒤 실제 작업에 적용하고 확인하는 방법을 설명합니다.
- [`skills/use-design-docs`](./skills/use-design-docs/SKILL.md)와 [`skills/use-dev-guidance`](./skills/use-dev-guidance/SKILL.md)는 Codex와 호환되는 Skill 실행 환경에서 선택해 쓸 수 있는 어댑터입니다. Skill은 작업 순서를 안내하며, 실제 규칙은 각 README에서 관리합니다.
- [`skills/use-words-review`](./skills/use-words-review/SKILL.md)는 커밋하거나 공유할 글과 이름을 읽기 전용으로 검토하는 스킬입니다.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md)는 특정 기술 구성에 맞춘 조사 프롬프트 예시입니다. 다른 프로젝트의 기본값으로 사용하지 않습니다.

`src/`의 두 언어 문서는 따로 관리하며 같은 규칙을 번역한 문서라고 보장하지 않습니다. 필요한 항목을 가져오기 전에 두 파일의 해당 내용을 비교하세요.

## 참고 문서 활용 방법

1. 대상 저장소의 코드, 설정, 테스트, 기존 문서와 승인된 결정 사항을 먼저 확인합니다.
2. [`src/AGENTS.en.md`](./src/AGENTS.en.md) 또는 [`src/AGENTS.ko.md`](./src/AGENTS.ko.md)에서 시작합니다.
3. 대상 저장소에서 실제로 수행하는 작업에 필요한 부분만 가져옵니다.
4. 도구, 브랜치 운영 방식, 실행 명령과 특정 기술에 관한 규칙은 대상 저장소에서 확인한 내용으로 바꿉니다.
5. 완성한 파일을 대상 저장소의 `AGENTS.md`로 저장합니다. 사용하는 에이전트가 폴더별 지침을 지원하고 탐색 방법을 확인했으며 해당 폴더에 다른 지침이 필요할 때만 파일을 더 둡니다.
6. 루트 파일은 짧게 유지합니다. 자세한 내용은 관리할 수 있는 별도 문서로 옮기고 링크로 연결합니다.

`src/`에 있는 파일명과 경로는 Codex를 비롯한 여러 도구가 기본으로 찾는 지침 위치가 아닙니다. 필요한 내용을 도구가 인식하는 파일로 옮기거나 별도 설정을 해야 합니다. 이 저장소는 `AGENTS.md`를 자동으로 만들거나 합치지 않습니다. 모든 부분을 한꺼번에 합치지 마세요. 관련 있고 확인할 수 있는 규칙만 담은 짧은 지침이, 근거 없는 규칙으로 채운 완성형 문서보다 쓸모 있습니다.

## use-words-review 설치와 제거

`skills/use-words-review/` 디렉터리 전체를 사용하는 도구가 지원하는 스킬 위치에 복사합니다.

- Codex 저장소: `.agents/skills/use-words-review/`
- Codex 사용자: `$HOME/.agents/skills/use-words-review/`
- Claude Code 저장소: `.claude/skills/use-words-review/`
- Claude Code 사용자: `$HOME/.claude/skills/use-words-review/`
- 플러그인: `<plugin-root>/skills/use-words-review/`

현재 탐색 위치는 [Codex 스킬 문서](https://developers.openai.com/codex/skills) 또는 [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)에서 확인합니다. 이 저장소의 `skills/use-words-review/`는 배포 원본이며, 이 경로에 있다는 이유만으로 자동 탐색되지는 않습니다.

스킬을 설치한 뒤 [`src/AGENTS.en.md`](./src/AGENTS.en.md) 또는 [`src/AGENTS.ko.md`](./src/AGENTS.ko.md)에서 `BEGIN USE WORDS REVIEW`와 `END USE WORDS REVIEW` 표시를 포함한 구간 전체를 도구가 읽는 지침 파일에 합칩니다. Codex에서는 해당 `AGENTS.md`에 추가합니다. Claude Code에서는 `CLAUDE.md`에 추가하거나, `AGENTS.md`에 둔 뒤 `CLAUDE.md`에서 `@AGENTS.md`로 불러옵니다. 대상 저장소의 기존 소제목 구성을 유지하고 실제로 적용할 규칙만 추가합니다.

스킬을 제거할 때에는 설치한 스킬 디렉터리와 지침 파일에 추가한 표시 구간 전체를 삭제합니다. 다른 규칙을 불러오는 데 필요한 `@AGENTS.md`와 표시 밖의 지침은 그대로 둡니다.

## 운영 원칙

- 현재 프로젝트 규칙은 해당 저장소에서 찾은 근거를 토대로 정합니다. 외부 자료는 제안의 근거가 될 수 있지만, 그 규칙이 특정 프로젝트에 적용된다는 사실까지 증명하지는 않습니다.
- 요구사항 작성자와 결정권자가 판단한 내용은 AI가 추론한 내용과 구분합니다. 요구사항은 작성자가 확인하고, 제품 결정은 해당 결정권자가 승인해야 합니다.
- 한 규칙은 한 문서에서 관리합니다. 같은 규칙을 여러 파일에 복사하지 않고 관리 문서로 연결합니다.
- 린트, 타입 검사, 스키마 검사, 테스트, CI와 실행 결과처럼 규칙을 확인할 수 있는 수단을 사용하고, 자동 검사로 판단할 수 없는 내용은 담당 검수자가 확인합니다. 문서에 적었다는 사실만으로 준수 여부를 판단하지 않습니다.

## 저장소 상태

다른 저장소에 적용해 본 결과에 따라 지침은 계속 바뀔 수 있습니다. 파일을 가져가기 전에 Git 이력을 확인하고, 선택한 규칙이 대상 저장소에 맞는지 다시 검토하세요.

## 설계 참고 자료

이 저장소의 운영 방향을 정할 때 다음 1차 자료를 참고했습니다.

- [AGENTS.md 형식 안내](https://agents.md/)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [GitHub: 저장소별 Copilot 지침 추가](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Visual Studio Code: 사용자 지정 지침 사용](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [GitHub: 저장소 README 안내](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
