# Development Guide Governance

이 문서는 여러 레포에 복제할 수 있는 `docs/dev` 개발 지침 거버넌스의 정본이다. 특정 레포의 기술스택, source list, baseline evidence, 외부 checkout, 로컬 제약은 이 문서에 기본 규칙처럼 넣지 않고 [repository](repository/README.md)에 둔다.

`docs/dev`는 `AGENTS.md`나 workflow skill을 대체하지 않는다. 이 폴더는 사람이 검토 가능한 장기 개발 지침, 현재 코드 작성 규칙, 근거, 미래 제안, AI 적용 규칙, 결정 이력을 Git 추적 문서로 보존한다. 관련 스킬은 선택적 보조 도구이며 source of truth가 아니다.

## Purpose

- 새 코드 작성 전에 적용할 current rule과 근거를 찾을 수 있게 한다.
- current guidance, future proposal, local evidence, AI rule, decision record를 물리적으로 분리한다.
- 대상 레포에 `docs/dev`가 없거나 부분적으로만 있을 때 bootstrap 순서를 제공한다.
- best/anti-pattern 예시를 단순 코드 샘플이 아니라 의도, 실패 모드, 영향, 대안, 검증 방법을 설명하는 teaching artifact로 관리한다.
- implementation 전에 누락된 development guidance target을 드러내고, current rule과 future proposal을 섞지 않게 한다.

## Development Guidance Targets

`development guidance target`은 `docs/dev`에 current rule, future proposal, local constraint, open question으로 기록할 수 있는 구체적인 개발 판단 지점이다. 짧게 `concern`이라고 부를 수 있지만, 사용자 기능, UI 화면, 제품 아이디어, dependency 이름, 넓은 기술 카테고리 그 자체를 뜻하지 않는다.

대표적인 target은 다음과 같다.

- library composition, state ownership, validation contract, generated artifact rule
- client/server boundary, module boundary, import direction, public API ownership
- verification obligation, release or maintenance risk, documentation ownership
- domain vocabulary, state meaning, business invariant interpretation

대상 레포의 evidence가 부족하면 current rule로 쓰지 않는다. 대신 `Open Question`, `Local Constraint`, `Recommended Future Pattern`, `Not Applicable` 중 하나로 분류하고, 필요한 follow-up을 남긴다.

## Folder Ownership

| Path            | Owns                                                                                                 | Does Not Own                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `architecture/` | 현재 적용할 모듈 경계, public API, import direction, ownership, 런타임 흐름                          | 기술스택별 API 사용법, 테스트 작성법, 미래 아키텍처 제안 |
| `engineering/`  | 현재 기술스택으로 코드를 작성하고 검증하는 규칙, 테스트, lint, generated-code rule                   | feature ownership, 업무 용어, 장기 migration proposal    |
| `domain/`       | 제품/업무 용어, 상태 의미, 불변조건, 비즈니스 해석                                                   | UI/라이브러리 사용법, 모듈 import 규칙                   |
| `evolution/`    | 현재 규칙이 아닌 개선 후보, 대안, migration 조건, technical debt                                     | 즉시 적용할 current rule                                 |
| `ai/`           | AI가 `docs/dev`를 읽고 적용하는 순서, 불확실성 처리, legacy handling                                 | 사람이 검토해야 하는 current engineering rule 자체       |
| `decisions/`    | accepted/deferred/superseded decision, rationale, consequences, revisit trigger                      | 단순 README index나 일회성 작업 메모                     |
| `_templates/`   | 새 `docs/dev` 문서 작성용 folder-specific template과 bootstrap audit                                 | root governance, target repo의 current rule              |
| `repository/`   | target-repository-specific stack, source layout, baseline evidence, audit history, local constraints | 여러 레포에 복제할 portable governance나 current rule    |

## Reading Order

### Before Implementation

1. 이 README에서 folder ownership과 repository evidence 위치를 확인한다.
2. 대상 레포의 [repository](repository/README.md)를 읽고 기술스택, source layout, generated code, verification commands, local constraints를 확인한다.
3. `Development Guidance Target Inventory`가 있으면 작업 대상 target의 classification과 owner folder를 확인한다.
4. 구조 변경이나 import boundary가 있으면 [architecture](architecture/README.md)를 읽는다.
5. 언어, framework, API, test, lint, build, generated-code 작업이면 [engineering](engineering/README.md)을 읽는다.
6. 업무 용어와 상태 의미가 애매하면 [domain](domain/README.md)을 확인한다.
7. 대안이나 migration 후보는 [evolution](evolution/README.md)에서 확인하되 current rule로 적용하지 않는다.
8. AI와 함께 작업하면 [ai](ai/README.md)의 적용 순서와 불확실성 처리 기준을 따른다.
9. 기존 결정과 충돌하거나 source-of-truth ownership이 바뀌면 [decisions](decisions/README.md)를 확인한다.

### Before Creating Or Updating docs/dev

1. 이 README에서 target output folder를 고른다.
2. [repository](repository/README.md)에서 target repository evidence를 확인한다.
3. [\_templates](./_templates/README.md)에서 folder-specific template을 고른다.
4. 대상 `docs/dev/<folder>/README.md`의 Include, Exclude, Dynamic File Policy로 최종 배치를 확인한다.
5. 새 구조를 만들거나 큰 갱신을 하면 [\_bootstrap-audit](./_templates/_bootstrap-audit.md) 또는 동등한 audit에 evidence와 unresolved gaps를 기록한다.

## Development Guidance Target Inventory

각 레포는 `repository/README.md` 또는 `repository/<topic>.md`에 target inventory를 둘 수 있다. 이 inventory는 current rule을 소유하지 않고, evidence와 classification을 top-level owner folder로 연결한다.

| Field | Required Meaning |
| --- | --- |
| Target | 구체적인 development guidance target. Dependency 이름이나 기능 이름만 쓰지 않는다. |
| Decision point | 구현자가 실제로 선택해야 하는 boundary, ownership, API, validation, verification, migration, documentation 판단. |
| Risk | 잘못 처리했을 때 생기는 bug, coupling, review blind spot, user impact, maintenance cost. |
| Evidence | repo-relative source/config/test/doc paths, official docs, stable public URLs, or recorded GitHub evidence. |
| Owner folder | `architecture`, `engineering`, `domain`, `evolution`, `ai`, `decisions`, or `repository` evidence. |
| Classification | `Current Rule`, `Recommended Future Pattern`, `Open Question`, `Local Constraint`, or `Not Applicable`. |
| Confidence | `High`, `Medium`, or `Low`, with conflict and limitation notes. |
| Follow-up | next evidence, decision, docs update, or verification needed. |

`Recommended Future Pattern`은 target repository evidence가 아직 current rule 승격에 부족하지만, stack/config evidence와 official documentation 또는 public repository evidence가 future direction을 지지할 때 사용한다. Evidence와 classification은 `repository/`에 두고, 해석과 적용 방향은 해당 owner folder의 문서에 둔다.

## Stack-Only Repository Sampling

기술스택만 주어진 상태에서 target을 추정하지 않는다. 먼저 실제 public repositories를 여러 개 조사해 common, divergent, repository-specific target 후보를 분리한다.

| Step | Rule |
| --- | --- |
| Select samples | active, non-archived, non-fork repositories를 우선하고, stack relevance와 adoption signal을 기록한다. 기본값은 5개이며 근거가 있으면 3개까지 줄일 수 있다. |
| Inspect evidence | description만 보지 말고 manifests, lockfiles, scripts, workflows, source layout, docs, releases, maintenance signals를 확인한다. |
| Group targets | `Shared Stack`, `Stack Plus Domain`, `Repository Specific`으로 분류한다. |
| Review local applicability | sampled evidence는 discovery aid다. Target repository evidence 없이 current rule이 될 수 없다. |
| Preserve evidence | commands, URLs, inspected paths, retrieved date, limitations, confidence impact를 기록한다. |

## GitHub Evidence Fallbacks

GitHub evidence 수집에는 `gh`를 선호하지만 필수로 만들지 않는다. `gh`가 없거나 인증, rate limit, 환경 정책 때문에 사용할 수 없으면 다음 fallback을 사용할 수 있다.

| Preferred Path | Accepted Fallback | Required Recording |
| --- | --- | --- |
| `gh search repos`, `gh repo view`, `gh api`, `gh search code` | GitHub Web UI, GitHub REST API through an approved HTTP client, installed GitHub MCP or connector output, stable GitHub file URLs | tool/interface, source URLs, query or navigation steps, inspected files/pages, retrieved date, evidence summary, limitations, confidence impact |
| Direct repository content reads | Stable blob/raw URLs, GitHub Web file view, REST API file endpoint | exact path, branch or commit context when available, relevant code/config summary, limitations |
| Structured JSON output | Manual evidence table or connector summary | field names used, missing fields, confidence impact |

Temporary archive or clone inspection is not a normal fallback. Use it only after a separate decision or explicit implementation note records the temporary location, cleanup rule, and no-vendor boundary.

## Target Repository Evidence

각 레포는 `docs/dev/repository/` 아래에 portable governance와 분리된 local evidence를 보존한다.

| Repository Path        | Required Content                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `repository/README.md` | repository purpose, technology stack, source layout, generated code, verification commands, external checkouts, local constraints, baseline evidence, audit history, linked current-rule folders |

`repository/` 아래 문서는 current rule을 소유하지 않는다. current rule은 top-level `architecture/`, `engineering/`, `domain/`, `ai/`, `decisions/`가 소유하고, `repository/`는 그 규칙을 대상 레포에 적용할 근거와 제약을 보존한다.

`docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` 같은 same-named evidence taxonomy는 기본 생성하지 않는다. 폴더별 local evidence가 필요하면 `repository/README.md`의 evidence table에서 top-level current-rule folder로 링크한다.

`docs/dev/application/` 같은 추가 scope axis는 기본 생성하지 않는다. 다중 앱, 다중 패키지, repository-wide evidence와 application-specific evidence 분리가 실제로 필요할 때에만 decision record로 ownership과 target output을 정한 뒤 추가한다.

## Bootstrap Flow

### Repository Without docs/dev

1. 이 README를 `docs/dev/README.md`의 canonical governance base로 사용한다.
2. target repository evidence를 수집해 `docs/dev/repository/README.md`를 만든다.
3. 현재 근거가 있는 folder README만 만든다. 빈 상세 문서나 TODO 문서는 만들지 않는다.
4. [\_templates](./_templates/README.md)에서 필요한 folder-specific template을 사용한다.
5. `_bootstrap-audit.md` 또는 동등한 audit에 생성한 문서, source evidence, current rule 승격 근거, open question, leaked repo-specific assumption 여부를 기록한다.

### Repository With Existing Development Docs

1. 기존 `docs/dev`, README, ADR, contributing docs, AGENTS-style guidance를 inventory한다.
2. 기존 내용을 current rule, local evidence, future proposal, AI rule, decision, open question으로 분류한다.
3. 제거하거나 대체하기 전에 accepted decision이나 명시적 사용자 지시가 필요한지 확인한다.
4. portable root governance는 이 README에 정렬하고, repo-specific evidence는 `repository/`로 이동한다.
5. 기존 링크와 reading flow가 깨지지 않았는지 감사한다.

## Existing Docs Inventory

큰 갱신을 시작할 때에는 다음 항목을 확인한다.

| Source                            | What To Extract                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `docs/dev/**`                     | current rules, folder contracts, existing decisions, AI rules                                 |
| `docs/designs/**`                 | accepted requirements, research, plans, traceability, completion audit                        |
| `AGENTS.md` or equivalent         | immediate working rules that should not be duplicated as long-form guidance without rewriting |
| source/config/test files          | local evidence for stack, architecture, generated output, verification commands               |
| Git history                       | why a rule or split was added, especially for docs/dev refinements                            |
| public official docs or standards | external support for best/anti-pattern guidance                                               |

## Source Evidence Policy

- Current rules need target repository evidence. Repeated local code alone is not enough if it conflicts with official guidance.
- External evidence needs a specific claim used, not a broad link dump.
- Local or restricted evidence must be summarized enough for a future reviewer to understand the obligation without private context.
- Repo-specific paths, stacks, generated output names, and external checkout constraints belong in `repository/`, not in this portable README.
- If evidence is missing, record `Open Question`, `Local Constraint`, or `Recommended Future Pattern` instead of inventing a current rule.
- Code search and repository descriptions are discovery aids, not proof. Confirm important claims through manifests, direct file reads, workflows, tests, official docs, or target repository evidence.

## Portability Checks

Before committing a `docs/dev` template or root governance update, verify that portable docs still work without this repository, a sampled public repository, an organization, or a named technology stack.

| Check | Fails If |
| --- | --- |
| Repository neutrality | A local or sampled repository becomes the required baseline. |
| Stack neutrality | A named stack is required for the template system to work instead of being optional evidence or an example. |
| Evidence ownership | `repository/` starts owning current rules, or top-level folders duplicate evidence tables. |
| Rule promotion | External or sampled evidence becomes `Current Rule` without target repository evidence. |
| Tool portability | GitHub evidence instructions have only one required tool path and no equivalent fallback. |

## Template Usage

새 `docs/dev` 문서를 만들거나 크게 갱신할 때에는 [\_templates](./_templates/README.md)를 사용한다. `_templates`는 folder-specific authoring router이며 root README governance를 소유하지 않는다.

문서 예시는 다음 기준을 만족해야 한다.

- `Scenario Coverage`가 예시보다 먼저 나온다.
- best pattern은 intent, applicability, impact, verification을 설명한다.
- anti-pattern은 failure mode, user or maintenance impact, safer alternative, target-repository constraint를 설명한다.
- code example이 필요 없는 AI rule이나 decision은 behavior example 또는 decision case로 대체할 수 있다.

## Repository Evidence

현재 레포의 repository evidence는 [repository](repository/README.md)에 있다. 다른 레포로 이 `docs/dev` 구조를 복제할 때에는 `repository/` 내용을 그대로 복사하지 말고 대상 레포의 source, config, test, existing docs, decisions로 다시 작성한다.

## Decision Records

다음 경우에는 [decisions](decisions/README.md)에 decision record가 필요하다.

- source-of-truth ownership이 바뀐다.
- accepted guidance를 삭제, 이동, supersede한다.
- `docs/dev/application/` scope axis를 추가한다.
- 기존 current rule과 충돌하는 새 규칙을 도입한다.
- 새 dependency, script, CI, security exception, public API change가 docs/dev guidance에 영향을 준다.

## Completion Audit

`docs/dev` bootstrap 또는 major update는 다음을 검증해야 한다.

- root README가 repo-neutral governance로 남아 있다.
- repo-specific stack, source list, baseline evidence, local constraints는 `repository/`에 있다.
- current rules, future proposals, AI rules, decisions, repository evidence가 물리적으로 분리되어 있다.
- `_templates/README.md`가 folder-specific authoring router로만 작동한다.
- `docs/dev/_templates/root-readme.md`가 생성되지 않았다.
- `docs/dev/application/`이 decision 없이 생성되지 않았다.
- `docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` 같은 same-named evidence taxonomy가 기본 구조에 남아 있지 않다.
- all links are repo-relative and valid.
