# 에이전트 지침을 계층별로 나누는 근거

## 조사 질문

여러 저장소에 공통으로 적용할 조사, 출처, 의존성, 커밋과 워크트리 원칙을 유지하면서도 AGENTS.md가 모든 실행 절차를 떠안지 않게 하려면 각 규칙을 어느 계층에서 관리해야 하는가.

이 조사는 `requirements.md`의 전역 원칙과 별도 책임 분배 예시를 뒷받침한다. 자료는 2026년 8월 8일에 확인했다.

## 항상 적용할 규칙은 전역 AGENTS.md에서 시작한다

Codex는 작업 전에 전역 지침과 저장소 지침을 차례로 결합한다. Codex home의 AGENTS.md는 모든 저장소에 적용할 기본값을 제공하고, 저장소 루트와 현재 디렉터리에 가까운 파일은 더 구체적인 규칙으로 앞선 지침을 보완하거나 덮어쓴다. Codex home은 기본적으로 `~/.codex`다. 합친 지침은 기본적으로 32 KiB까지만 읽으므로, 전역 파일에는 모든 저장소에서 필요한 원칙과 다음 문서를 선택하는 조건을 우선해서 둬야 한다. [OpenAI의 AGENTS.md 안내](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

AGENTS.md 형식은 루트 파일에 프로젝트 전반의 지침을 두고 큰 저장소에서는 하위 AGENTS.md로 적용 대상을 좁히도록 안내한다. 이 구조는 개인의 공통 기본값과 저장소별 실행 명령을 서로 다른 계층에서 관리하는 방식과 맞는다. [AGENTS.md 형식 안내](https://agents.md/)

## 반복 절차는 Skill이 맡는다

Codex는 처음에는 Skill의 이름과 설명만 확인하고, 작업이 명시 호출이나 설명과 일치할 때 SKILL.md 전체를 읽는다. 따라서 AGENTS.md는 호출 조건을 유지하고, 조사 순서, 분기, 검사와 실패 처리는 해당 Skill이 맡을 수 있다. Skill이 많으면 초기 목록이 축약되거나 일부가 생략될 수 있으므로 전역 필수 절차는 AGENTS.md에서 명시적으로 호출해야 한다. [OpenAI의 Skills 안내](https://learn.chatgpt.com/docs/build-skills)

Agent Skills 명세도 SKILL.md에 핵심 절차를 두고 상세 자료와 실행 파일은 필요할 때 읽는 보조 파일로 분리하도록 권고한다. 이 방식은 개발 지침과 한국어 검토 기준을 AGENTS.md에 반복해서 싣지 않고도 재사용할 수 있게 한다. [Agent Skills 명세](https://agentskills.io/specification)

Plugin은 Skills, 연결 도구와 선택형 화면 구성을 함께 배포하는 단위다. [OpenAI의 Plugins 안내](https://learn.chatgpt.com/docs/plugins)

`requirements.md`는 Compound Engineering이 관리하는 Codex 도구 매핑을 사용자가 수정하지 않도록 정한다. 따라서 저장소 문서는 이 관리 범위를 다시 정의하지 않고 Plugin의 업데이트 결과를 그대로 유지해야 한다.

## 실행 환경 설정과 작업 규칙을 분리한다

Codex의 사용자 설정은 홈의 `config.toml`, 저장소 설정은 `.codex/config.toml`에 둘 수 있다. 검색 모드, 승인 정책, sandbox와 MCP 등록처럼 도구의 가용성과 권한을 정하는 값은 AGENTS.md의 작업 절차가 아니라 설정 파일이 관리한다. AGENTS.md는 인터넷을 조사해야 하는 조건을 정하고, 설정은 사용할 검색 방식과 권한을 제공한다. [OpenAI의 Codex 설정 안내](https://learn.chatgpt.com/docs/config-file/config-basic)

OpenAI의 모델 지침은 같은 지침을 한 번만 명시하고, 반복 설명과 예시는 줄이며, 중요한 승인 조건과 성공 기준은 유지하도록 권고한다. 전역 원칙을 AGENTS.md 한 곳에서 선언하고 세부 절차를 Skill과 문서로 연결하면 같은 규칙을 여러 파일에 복사하지 않아도 된다. [OpenAI의 모델 지침](https://developers.openai.com/api/docs/guides/latest-model)

## 워크트리 기본값에는 실행 환경에 따른 예외가 필요하다

Codex 데스크톱 앱의 Worktree 모드는 여러 작업을 별도 checkout에서 실행하지만 기본적으로 detached HEAD에서 시작한다. Git은 같은 브랜치를 두 checkout에서 동시에 사용할 수 없으므로, 수동으로 만드는 워크트리의 경로와 앱이 관리하는 워크트리의 위치를 같은 규칙으로 강제할 수 없다. 전역 지침은 격리와 브랜치 확인을 요구하고, 저장소 문서는 수동 워크트리의 경로와 이름을 정해야 한다. [OpenAI의 Worktrees 안내](https://learn.chatgpt.com/docs/environments/git-worktrees)

Git 공식 문서는 하나의 저장소에 여러 작업 트리를 연결해 서로 다른 브랜치를 동시에 checkout할 수 있다고 설명한다. 워크트리 규칙은 병렬 작업을 격리하는 수단이지만, 브랜치와 작업 디렉터리의 실제 이름은 저장소 관례와 충돌 여부를 확인한 뒤 정해야 한다. [Git의 git-worktree 문서](https://git-scm.com/docs/git-worktree)

## 조사 결과

- 모든 저장소에서 빠지면 안 되는 조사, 출처, 변경 권한과 Git 안전 원칙은 전역 AGENTS.md가 관리해야 한다.
- 작업 종류에 따라 달라지는 조사, 문서 작성, 의존성 검토와 문구 검수 절차는 해당 Skill이 관리해야 한다.
- 저장소의 기술, 명령, 보호 브랜치, 커밋 형식, 선택한 의존성 패턴과 예외는 저장소 AGENTS.md 또는 docs가 관리해야 한다.
- 검색 모드, sandbox, 승인 정책과 도구 등록은 Codex 설정이 관리해야 한다.
- Plugin이 생성하는 도구 매핑 범위는 Plugin의 관리 결과로 유지하고 다른 문서에서 복제하지 않아야 한다.
- 정확하게 판정할 수 있는 문서 구조, 비밀정보, 브랜치 보호와 정적 검사 규칙은 scripts, hooks 또는 CI로 확인해야 한다.

## 한계와 적용 영향

공식 문서는 사용자가 요구한 “모든 답변에 출처를 포함한다”거나 “공식 자료를 최소 다섯 개 조사한다”는 품질 기준을 정하지 않는다. 이 두 기준은 제품 제약이 아니라 사용자가 승인한 전역 작업 원칙이다. AGENTS.md에는 이 의무를 유지하되, 자료를 다섯 개 확보하지 못했을 때 저품질 자료로 숫자를 채우지 않고 확인 범위와 한계를 밝히는 실패 처리가 필요하다.

“모든 외부 의존성”의 범위를 전이 의존성까지 포함할지는 아직 정해지지 않았다. 책임 분배 예시는 직접 추가, 교체, 제거하거나 주요 버전을 변경하는 의존성을 기본 범위로 설명하고, 전이 의존성은 보안이나 호환성에 직접 영향을 줄 때 검토하도록 제안한다. 이 제안은 요구사항 작성자의 승인을 받기 전까지 현재 정책을 좁히지 않는다.
