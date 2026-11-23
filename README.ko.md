# Docs System

[English](./README.md)

`Docs System`은 코딩 에이전트를 사용하는 팀을 위해 에이전트 지침과 문서 관리 방식을 연구하는 저장소입니다. 지침을 도입할 때는 대상 저장소의 코드, 설정, 문서와 승인된 결정에 부합하는 규칙을 선택합니다.

## 저장소 파일

- [`AGENTS.md`](./AGENTS.md)는 이 저장소의 에이전트 지침입니다. [`src/ko/AGENTS.md`](./src/ko/AGENTS.md)는 다른 저장소에 적용할 수 있는 한국어 참고 문서입니다.
- [`docs/designs/README.md`](./docs/designs/README.md)는 이 저장소에서 요구사항, 조사 자료, 결정 사항과 실행 계획을 관리하는 방법을 설명합니다.
- [`docs/dev/README.md`](./docs/dev/README.md)에서 이 저장소에 개발 규칙을 기록하는 기준과 Node.js 명령줄 검사기의 개발 지침을 확인할 수 있습니다.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md)는 Next.js 프로젝트의 프런트엔드 개발 지침에 필요한 조사를 요청하는 프롬프트 예시입니다.

### 스킬

- [`flexible`](./skills/ko/flexible/SKILL.md)은 현재 요구사항으로 계획할 수 있는 단계와 각 단계의 완료 기준을 제시합니다. 검토만 요청하면 파일을 생성하거나 수정하지 않습니다. 미결정 사항이 있으면 답변에서 어느 단계가 그 결정에 따라 달라지는지 설명합니다. 사용자가 실행을 요청하면 계획에 명시한 단계를 수행합니다.
- [`programming`](./skills/ko/programming/SKILL.md)은 기능 구현 방법이나 기존 코드의 문제를 해결할 방법을 비교합니다. 권장하는 방법이 적합한 이유, 변경할 코드와 검증 방법을 설명합니다. 실제 코드 수정은 사용자가 구현을 요청한 경우에만 진행합니다.
- [`handover`](./skills/ko/handover/SKILL.md)는 다음 에이전트가 참고할 내용을 지정한 인수인계 파일로 이전합니다. 독자에게 필요한 안내는 기존 문서에 유지합니다. 기존 인수인계 기록을 열람하거나 갱신할 때도 사용합니다.
- [`terms`](./skills/ko/terms/SKILL.md)는 이번 요청에서 작성하거나 수정한 각 파일의 텍스트 전체에서 일상 표현과 모호한 문구를 교정합니다. 파일명이나 화면 문구에도 적용합니다. 검토만 요청하면 지정한 파일이나 문구의 수정안을 답변에 제시합니다. 모든 언어의 텍스트를 검토하며 한국어가 포함된 경우 한국어 지침을 적용하고 검사기를 실행합니다.

한국어 참고 문서와 [영어 참고 문서](./src/en/AGENTS.md)는 개별적으로 관리합니다. 지침을 도입하기 전에 두 문서에서 적용하려는 항목을 비교합니다.

## AGENTS 참고 문서 적용

1. 대상 저장소의 코드, 설정, 테스트, 문서와 승인된 결정을 확인해 현재 적용하는 규칙을 식별합니다.
2. `src/`에서 영어판 또는 한국어판 `AGENTS.md`를 선택합니다. 팀이 대상 저장소에서 수행하는 활동에 필요한 지침만 복사합니다.
3. 복사한 지침의 도구, 브랜치 운영 방식, 명령과 기술별 규칙을 대상 저장소에서 확인한 내용에 맞게 수정합니다.
4. 도구가 대상 저장소에서 불러오는 지침 파일에 수정한 내용을 저장합니다. Codex에서는 저장소 최상위의 `AGENTS.md`를 사용할 수 있습니다.

이 저장소에는 지침 파일을 자동 생성하거나 병합하는 도구가 없으므로 필요한 지침을 직접 복사해 편집합니다. 지침은 간결하게 작성하고 세부 규칙을 설명하는 저장소 문서의 링크를 추가합니다.

프로젝트에서 사용하는 표현 규칙이 있을 때만 `AGENTS.md`에 표현 지침 항목을 추가합니다. 규칙을 직접 작성하거나 별도 지침 문서의 링크를 추가합니다.

## 스킬 설치와 제거

한국어판과 영어판은 같은 스킬 이름을 사용합니다. 언어판을 선택한 뒤 참고 자료, 스크립트와 에이전트 설정을 포함한 스킬 디렉터리 전체를 복사합니다. 예를 들어 Codex에서 한 저장소에 한국어 `terms`를 설치하려면 `skills/ko/terms/`를 대상 저장소의 `.agents/skills/terms/`로 복사합니다. 다음 목록에서 저장소, 사용자 계정 또는 플러그인에 맞는 설치 위치를 확인할 수 있습니다.

- Codex 저장소: `.agents/skills/<skill-name>/`
- Codex 사용자: `$HOME/.agents/skills/<skill-name>/`
- Claude Code 저장소: `.claude/skills/<skill-name>/`
- Claude Code 사용자: `$HOME/.claude/skills/<skill-name>/`
- Plugin: `<plugin-root>/skills/<skill-name>/`

Codex와 Claude Code는 지정된 설치 디렉터리에서 스킬을 탐색합니다. 이 저장소의 `skills/` 디렉터리는 연구 자료를 보관하는 위치입니다. 도구별 설치 위치는 [Codex Skill 문서](https://developers.openai.com/codex/skills)와 [Claude Code Skill 문서](https://code.claude.com/docs/en/skills)에서 확인합니다.

프로젝트에서 정한 상황에 에이전트가 스킬을 호출하도록 설정하려면 [`src/ko/AGENTS.md`](./src/ko/AGENTS.md)에서 설치한 스킬의 지침을 복사해 도구가 불러오는 지침 파일에 추가합니다. `handover`의 지침은 `BEGIN HANDOVER`와 `END HANDOVER` 사이에, `terms`의 지침은 `BEGIN TERMS`와 `END TERMS` 사이에 있습니다. 두 스킬을 사용하면 인수인계 정보를 지정 파일로 이전한 뒤 표현을 검토합니다.

조사와 설계 지침은 `flexible`을, 개발 지침은 `programming`을 호출하도록 정합니다. `ui`는 디자인을 요청할 때 직접 호출할 수 있습니다. Claude Code에서는 선택한 지침을 `CLAUDE.md`에 작성하거나 `CLAUDE.md`에 `@AGENTS.md`를 명시해 저장소의 지침 파일을 불러옵니다.

스킬을 제거하려면 설치한 스킬 디렉터리를 삭제하고 그 스킬을 위해 복사한 호출 지침을 제거합니다. 스킬이 생성하거나 참조한 저장소의 README, 다른 스킬의 지침과 그 지침에 필요한 import는 유지합니다.

## 설계 폴더 준비

요구사항 작성이나 보완을 요청하면 `flexible`은 같은 주제의 문서가 있는지 먼저 확인합니다. 기존 문서가 없거나 사용자가 별도 문서를 명시적으로 요청하면 신규 문서를 생성합니다. 그 밖의 경우에는 기존 문서에서 요청받은 부분만 수정합니다. 대상 저장소가 스킬의 문서 구성을 사용하고 `docs/designs/README.md`가 이미 있다면 다음 명령으로 신규 문서를 생성할 수 있습니다.

설치한 `flexible` 디렉터리에서 Node.js 22.0.0 이상으로 실행합니다. `<repository-root>`에는 대상 저장소의 최상위 디렉터리를, `<topic-slug>`에는 `book-search`와 같은 주제 식별자를 지정합니다.

```sh
node scripts/requirements/create.mjs --repo <repository-root> --topic <topic-slug>
```

스크립트는 외부 패키지 없이 주제 폴더와 빈 `requirements.md`를 생성합니다. 내용 작성도 요청받았으면 `requirements.md`에 요구사항을 작성합니다. 조사 자료, 결정 사항과 실행 계획을 같은 주제 폴더에 추가하는 기준은 [설계 문서 작성 안내](./skills/ko/flexible/references/_README.md)에서 확인할 수 있습니다.

## 한국어 텍스트 검사

설치한 `terms` 디렉터리에서 `node scripts/scan.mjs --file <path>`를 실행합니다. `<path>`에는 검사할 문서의 절대 경로나 `terms` 디렉터리를 기준으로 한 상대 경로를 지정합니다. 다른 입력 옵션은 `node scripts/scan.mjs --help`로 확인합니다. 검사기가 경고한 문구와 앞뒤 문장을 대조해 수정 여부를 판단합니다.
