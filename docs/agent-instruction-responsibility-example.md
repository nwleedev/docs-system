# 책임 재분배를 적용한 파일 예시

이 문서는 책임 재분배 작업이 끝난 뒤 사용할 파일 구성의 구현 후보를 보여준다. 요구사항 작성자가 책임 배분을 승인한 뒤에만 적용한다. AGENTS.md는 사용자 관리 영역의 최종 본문 전체를 제시하고, 기존 파일은 바뀌는 구간을 생략 없이 제시한다. Compound Engineering 관리 범위는 Plugin이 생성한 원문을 유지해야 하므로 예시에 포함하지 않는다.

설계 근거와 확정된 전역 원칙은 [여러 저장소에 공통으로 적용할 에이전트 작업 원칙](designs/agent-instruction-responsibilities-8c1e/decisions/cross-project-agent-policies.md)에서 확인할 수 있다.

## 작업 후 파일 구성

```text
AGENTS.md
skills/
  use-design-docs/
    SKILL.md                         # 기존 본문 유지
  use-dev-guidance/
    SKILL.md                         # 외부 의존성 조사 절 추가
  use-words-review/
    SKILL.md                         # 기존 본문 유지
docs/
  designs/
    README.md                        # 기존 본문 유지
  dev/
    README.md                        # 외부 의존성 기록 절 추가
```

`use-design-docs`, `use-words-review`와 `docs/designs/README.md`는 이미 새 책임을 수행하므로 본문을 바꾸지 않는다. 외부 의존성 조사 절을 추가한다는 이유만으로 이 세 파일을 다시 작성하지 않는다. Git 작업에는 Compound Engineering이 제공하는 Skills를 사용한다.

## `AGENTS.md`

아래 내용은 승인을 받은 뒤 여러 저장소에 배포할 AGENTS.md의 사용자 관리 영역 전체다. 대상 저장소가 기술, 명령, 보호 브랜치 또는 커밋 형식을 다르게 정하면 저장소 AGENTS.md가 그 값만 구체화한다.

```markdown
# AGENTS.md

## 언어와 답변

- 사용자와는 한국어로 소통하고 결론부터 작성한다.
- 코드와 파일 이름은 영어로 작성한다.
- 저장소가 다르게 정하지 않았다면 설계 문서와 코드 설명용 주석은 한국어로 작성한다.
- 최종 답변에는 판단을 뒷받침하는 외부 자료, 저장소 파일, 사용자 제공 자료 또는 검사 결과를 출처로 제시한다.

## 변경 권한과 안전

- 설명, 조사, 검토, 진단과 계획 요청은 파일, 설정, 의존성 또는 외부 상태의 변경을 허가하지 않는다.
- 변경 요청에서는 요청 범위의 로컬 파일만 수정하고 관련된 비파괴 검사를 실행한다.
- 외부 쓰기, 파괴적 작업, 비용이 드는 작업과 요청 범위의 확대는 사용자의 승인을 받는다.
- 사용자 변경사항을 되돌리거나 다른 작업의 변경사항을 커밋하지 않는다.
- 실패를 숨기기 위해 타입 검사나 기능을 비활성화하거나 테스트를 삭제하거나 약화하지 않는다.
- 비밀정보, 자격 증명, 비공개 URL, 개인정보와 개인 계정이 드러나는 절대 경로를 저장하거나 커밋하지 않는다.

## 조사와 출처

- 사실 판단이나 최신 정보가 필요한 일반 요청에서는 인터넷 자료를 조사한다.
- 블로그와 큐레이션보다 공식 문서, 표준, 원문과 공식 저장소 등 1차 자료를 우선한다.
- 서로 독립적인 공식 자료를 최소 다섯 개 확보하려고 시도한다.
- 다섯 개를 확보하지 못하면 관련성이 낮은 자료로 수를 채우지 않고 확인한 자료와 한계를 답변에 밝힌다.
- 저장소 파일이나 사용자가 제공한 자료만으로 답할 때에는 그 파일이나 자료를 출처로 제시하고 외부 자료를 확인하지 않았다고 밝힌다.
- 조사 결과가 라이선스, 정책, 검사, 문서 또는 변경을 추가할 권한을 만들지는 않는다.

## 한국어 글과 문구

- 저장, 커밋, 게시하거나 대화 밖에서 공유할 글과 이름을 작성하거나 고칠 때에는 `$use-words-review`의 작성 전 참고 자료를 읽는다.
- 같은 공유 단위의 글과 이름은 저장하거나 공유하기 직전에 `$use-words-review`로 한 번 검토한다.
- 일반 채팅과 진행 알림만을 이유로 `$use-words-review`를 실행하지 않는다.
- Skill이나 필수 참고 자료를 읽을 수 없으면 검토가 필요한 결과의 완료를 주장하지 않는다.

## 설계 문서

- 요구사항을 구체화하거나 `docs/designs/**`를 조사, 작성, 검토, 계획 또는 검증할 때에는 `$use-design-docs`를 실행한다.
- 요구사항과 승인된 결정은 AI의 조사 결과나 제안과 구분한다.
- 조사나 검토 중에 발견한 문제를 문서 수정 권한으로 해석하지 않는다.

## 개발 지침과 외부 의존성

- 애플리케이션 변경을 계획, 구현, 검토, 리팩터링, 테스트 또는 문서화하거나 의존성과 검사 설정을 변경할 때에는 `$use-dev-guidance`를 실행한다.
- 외부 의존성을 선택, 추가, 교체, 제거하거나 주요 버전을 변경하기 전에 공식 권장 통합 구조와 적용 가능한 디자인 패턴을 조사한다.
- 직접 의존성과 전이 의존성을 포함한 모든 외부 의존성을 조사한다.
- 의존성 조사 결과를 적용하려면 사용자의 변경 요청과 저장소의 승인 절차를 별도로 확인한다.

## Git 작업과 컨텍스트 압축

- Git 저장소의 파일을 변경하기 전에 Compound Engineering의 `$ce-worktree`를 실행하여 현재 작업이 격리되었는지 확인한다.
- 단일 변경에도 별도 작업 공간을 사용한다. 실행 환경이 worktree를 관리하면 그 위치를 사용하고, 수동 생성이 필요할 때에만 `.worktrees/<type>/<short-description>/`를 사용한다.
- 변경이 승인된 작업에서 하나의 작업 단위가 검증되면 `$ce-commit`으로 컨텍스트 압축에 대비한 커밋을 만든다.
- `$ce-work`를 실행 중이면 별도의 커밋 절차를 만들지 않고 그 Skill의 증분 커밋 기준을 따른다.
- 읽기와 검토만 요청받았거나 사용자 변경이 섞였거나 검사가 실패한 상태에서는 커밋하지 않는다.
- 컨텍스트가 압축되면 AGENTS.md, 현재 브랜치, Git 상태와 최근 작업 단위의 커밋을 다시 확인한다.
- 필요한 Compound Engineering Skill을 사용할 수 없으면 대체 절차를 추정하지 않고 중단 사유를 보고한다.
```

사용자 관리 영역 다음에는 Plugin이 생성한 Compound Codex Tool Mapping 원문과 관리 주석을 변경 없이 유지한다. 이 예시는 해당 원문을 재현하지 않는다.

## `skills/use-dev-guidance/SKILL.md`에 추가할 절

기존 Skill의 `Execute the selected operations` 아래에 다음 절을 추가한다. 기존 inventory, research, guide, apply와 validate 절은 그대로 유지한다.

```markdown
### Research external dependencies

Run this operation before selecting, adding, replacing, removing, or upgrading an external dependency. Include direct and transitive dependencies in the research inventory.

1. Build an inventory of direct and transitive external dependencies from manifests, lockfiles, generated dependency reports and the imports used by the repository.
2. Confirm the capability the repository needs and the exact dependency and version under consideration.
3. Compare the dependency with the current implementation, already installed dependencies, platform features and a small internal implementation when those are realistic alternatives.
4. Review current official documentation, release notes, compatibility information, maintenance status, security advisories and license terms that affect the repository.
5. Identify the dependency's officially recommended integration structure and every design pattern that applies to the repository's intended use. State when official sources do not name a pattern instead of inventing one.
6. Inspect lifecycle, initialization, resource cleanup, concurrency, error propagation, retries, serialization, security boundaries and framework integration when they are reachable in the intended use.
7. Inspect the manifest, lockfile, configuration, generated artifacts, imports, public APIs, tests and CI affected by the proposed change.
8. Record each dependency and version in the research result. Dependencies that share one upstream project or the same official integration guidance may share evidence, but none may be omitted from the inventory.
9. Record repository-specific findings in the owning `docs/dev/` topic. Record a choice that changes requirements or architecture in the applicable `docs/designs/` package after the decision owner approves it.
10. Research does not authorize dependency, configuration, guidance or check changes. Apply them only when the request includes those changes.
```

## `docs/dev/README.md`에 추가할 절

Skill이 조사 순서를 맡고 이 절은 조사 결과를 저장소 문서에 기록하는 조건을 정한다. `Turn Repository Risks into Checks`의 의존성 변경 기준 다음에 추가한다.

```markdown
### Record dependency integration guidance

Create or update a topic document only when a dependency rule applies to more than one change and future contributors cannot infer it from the manifest, code, tests or standard tooling.

The owning topic document records:

- The direct and transitive dependencies and the versions to which the guidance applies
- The repository capability that requires it
- The selected integration structure and applicable design patterns
- The official source that supports each external claim
- Initialization, lifecycle, cleanup, error, concurrency and security conditions that affect this repository
- Alternatives considered when they materially change maintenance or compatibility
- Repository files and public interfaces affected by the integration
- Static checks, tests, runtime checks or responsible review that verify the rule
- Exceptions and the evidence that makes each exception safe

Do not copy generic dependency documentation, list patterns that the repository does not use, or present an unapproved proposal as current guidance. A dependency choice that changes requirements or architecture belongs in the applicable `docs/designs/` package. The development topic links to that approved decision instead of copying it.
```

## 그대로 유지할 파일

### `skills/use-design-docs/SKILL.md`

이 Skill은 이미 `docs/designs/README.md`를 유일한 문서 구조 기준으로 사용하고 review, discover, research, record, plan과 validate 작업을 선택한다. AGENTS.md에서 설계 절차를 줄여도 Skill 본문을 바꿀 필요가 없다.

### `skills/use-words-review/SKILL.md`

이 Skill은 이미 저장하거나 외부에 전달할 글의 검사 범위, 한국어 검사기, 참고 자료, 독립 검토와 상태 판정을 관리한다. AGENTS.md에는 작성 전 참고 자료와 저장 직전 호출 조건만 남기므로 Skill 본문을 바꿀 필요가 없다.

### `docs/designs/README.md`

이 문서는 요구사항, 조사 자료, 승인된 결정과 계획의 구조 및 검증 기준을 이미 관리한다. AGENTS.md와 Skills의 실행 절차를 이 문서로 복사하지 않는다.

## 구현 뒤 확인할 결과

- AGENTS.md의 사용자 관리 영역에는 전역 정책, 변경 권한, Skill 호출 조건과 Compound 관리 범위만 남아 있다.
- Git의 분기와 worktree 절차는 Compound Engineering의 `ce-worktree`, 독립 커밋은 `ce-commit`, 구현 중 증분 커밋은 `ce-work`가 관리한다.
- 외부 의존성의 조사 순서는 `use-dev-guidance`, 재사용할 저장소 규칙은 `docs/dev`, 구조나 요구사항을 바꾸는 승인은 `docs/designs`가 관리한다.
- `use-design-docs`, `use-words-review`와 `docs/designs/README.md`에는 같은 규칙을 복사하지 않는다.
- Compound Engineering 관리 주석 사이의 내용은 구현 전후에 동일하거나 Plugin이 생성한 새 버전과 일치한다.
