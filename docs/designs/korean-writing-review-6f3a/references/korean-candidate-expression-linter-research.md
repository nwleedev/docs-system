# 한국어 후보 표현 검사 도구 조사

## 결론

2026년 8월 4일 기준 권고안은 **구조화된 후보 자료를 textlint 사용자 규칙으로 검사하고, AI에는 JSON 진단을 전달하는 방식**이다. 여러 저장소에 복사해 유지할 `use-words-review` 스킬에는 `package.json`과 `package-lock.json`을 포함하고, 별도 준비 단계에서 스킬 루트에 `npm ci`를 실행하는 구성이 맞다. `npx` 방식은 설치 절차가 가장 짧지만 textlint의 하위 의존성까지 고정하지 않으므로 시제품과 일회성 평가에만 사용한다. 후보 표현, 검토 이유, 문제 사례와 정상 사례를 규칙별 자료로 관리하면 AI가 각 출현을 문맥에 따라 판정할 수 있다. textlint MCP와 reviewdog는 각각 대화형 도구 연결과 Pull Request 표시가 실제로 필요할 때만 추가한다.

Vale도 모든 출현과 위치, 설명, 링크를 출력할 수 있다. 다만 후보별 정보를 YAML 규칙의 문자열 필드에 넣어야 하며, AI가 호출할 MCP와 구조화된 추가 데이터 필드가 없다. 커스텀 스크립트는 출력 형식을 가장 자유롭게 정할 수 있지만 Markdown 구문, 위치 계산, 제외 규칙, Git 상태와 표준 입력 처리를 직접 유지해야 한다. reviewdog는 표현을 찾지 않으므로 단독 대안이 아니다.

현재 저장소에는 실행 가능한 검사기가 없다. 어느 선택지를 쓰더라도 산문으로 작성된 `korean.md`와 기계가 읽는 후보 자료의 관계를 먼저 정해야 한다. 스킬 디렉터리에 스크립트나 `package.json`을 두는 것만으로 npm 의존성이 설치되지는 않으므로, 실행할 때 내려받을지 별도 설치 단계에서 고정할지도 정해야 한다. 이 문서는 [한국어 문서 검토 재발 방지 요구사항의 목표](../requirements.md#목표) 가운데 기계 검사와 의미 검토의 분담을 후속 작업에서 판단할 수 있도록 네 선택지를 비교한다. 독자는 `use-words-review` 검사기를 설계하거나 승인할 담당자다. 이 문서는 구현이나 의존성 도입을 승인하지 않는다.

## 비교 기준

검사기는 `경계` 같은 표현의 출현을 실패로 단정하지 않고 검토 후보로 보고해야 한다. 수학의 경계와 보안 경계는 정확한 용어일 수 있다. `use-words-review`의 주 에이전트와 독립 검수자가 주변 문장, 저장소 근거와 정상 용례를 읽은 뒤 `pass`, `needs revision` 또는 `needs human input`을 정한다.

네 선택지를 다음 순서로 비교했다.

- **후보 탐색:** 한 줄의 반복을 포함한 모든 출현, 정확한 줄과 열, Markdown 구문 인식
- **AI 입력:** 발견한 표현, 검토 이유, 문제 사례, 정상 사례와 참고 위치를 기계가 읽는 형태로 전달할 수 있는지
- **입력 범위:** 파일, 저장하지 않은 문구, Git에서 바뀐 파일 또는 줄을 다룰 수 있는지
- **운영 비용:** 실행 환경, 설정, 사용자 규칙과 별도 연결 코드를 얼마나 유지해야 하는지
- **오판 방지:** 후보 경고와 확정 오류 또는 자동 수정을 구분할 수 있는지

목록 밖의 번역체, 문장 사이에서 끊긴 역할과 조건, 근거 없이 반복한 글의 짜임은 문자열 검사로 모두 찾을 수 없다. 후보 검사기가 성공해도 기존 문장 단위 의미 검토를 생략할 수 없다.

## AI에 전달할 진단 정보

AI가 문맥을 판단하려면 위치와 메시지만으로는 부족하다. 후보 자료는 적어도 다음 값을 표현별로 제공해야 한다.

- 규칙 식별자와 탐색 pattern
- 발견한 표현과 앞뒤 문장
- 저장소 상대 파일 위치, 줄, 열과 일치 범위
- 표현을 다시 살펴야 하는 이유
- 잘못 쓰기 쉬운 사례와 그 이유
- 유지할 수 있는 정상 사례와 적용 문맥
- `korean.md`의 해당 소제목
- 확정 오류가 아닌 검토 후보라는 상태

예를 들어 검사 결과는 다음처럼 구성할 수 있다. 예시 문장은 [구분 기준이나 접점을 가리키는 `경계`](../../../../skills/use-words-review/references/korean.md#구분-기준이나-접점을-가리키는-경계)의 판정 기준을 요약한 것이다.

```json
{
  "ruleId": "ko.boundary",
  "expression": "경계",
  "location": {
    "path": "docs/example.md",
    "line": 12,
    "column": 8
  },
  "reason": "검토 범위, 제외 대상, 역할 분담 또는 연결 지점 중 무엇을 뜻하는지 확인해야 한다.",
  "problemExample": "이 문서는 조사와 실행의 경계를 다룬다.",
  "acceptedExamples": [
    "외부 요청은 보안 경계를 통과하기 전에 인증 서비스가 서명을 검증한다.",
    "도형의 경계에 포함된 점을 별도로 표시한다."
  ],
  "reference": "skills/use-words-review/references/korean.md#구분-기준이나-접점을-가리키는-경계",
  "status": "candidate"
}
```

도구가 이 자료를 직접 저장하지 못하더라도 규칙 식별자를 출력하면 호출자가 후보 자료를 합칠 수 있다. 다만 진단 생성 뒤 별도 결합 단계가 필요하므로, 도구 자체가 사용자 규칙과 formatter를 함께 제공하는지가 중요하다.

## Vale

### 후보 탐색

2026년 7월 31일 공개된 [Vale v3.17.0](https://github.com/vale-cli/vale/releases/tag/v3.17.0)은 Markdown을 기본 형식으로 처리한다. [scope 문서](https://vale.sh/docs/scopes)는 제목, 문단, 목록처럼 검사할 Markdown 영역을 고를 수 있고 원문 전체에는 `raw` scope를 쓸 수 있다고 설명한다. `existence` 규칙은 문자열이나 정규식의 출현을 모두 찾고 `nonword`, 예외와 일치 문자열을 넣는 `%s` 메시지를 제공한다. 한국어 표현은 자동 단어 구분에 기대지 않고 pattern을 명시하는 편이 안전하다. [existence 규칙](https://vale.sh/docs/checks/existence)과 [정규식 안내](https://vale.sh/docs/guides/regex)를 함께 확인했다.

### AI 입력

Vale의 alert에는 규칙 이름, 설명, 링크, 메시지, 심각도, 일치 문자열, 줄과 span이 있다. 이는 [v3.17.0 Alert 소스](https://github.com/vale-cli/vale/blob/v3.17.0/internal/core/alert.go)에서 확인할 수 있다. 후보별 `Description`, `Link`와 `Message`에 판정 이유와 예시를 넣고 JSON 또는 사용자 출력 템플릿으로 전달할 수 있다. [출력 템플릿 문서](https://vale.sh/docs/templates)는 alert 필드와 RDJSONL 예시를 제공한다.

그러나 문제 사례와 정상 사례를 각각 담는 별도 필드는 없다. 긴 설명을 메시지에 넣거나 규칙 이름을 기준으로 별도 후보 자료를 다시 결합해야 한다. AI 전용 호출 방법도 제공하지 않는다.

### 입력 범위

Vale CLI는 파일과 표준 입력을 검사하고 JSON을 출력할 수 있다. [CLI 문서](https://vale.sh/docs/cli)는 `--output`, `--ext`와 표준 입력 사용법을 설명한다. Git에서 바뀐 파일이나 줄은 스스로 고르지 않으므로 호출자가 파일 목록을 넘기거나 reviewdog가 결과를 걸러야 한다.

### 운영 비용과 오판 방지

단일 실행 파일이지만 `.vale.ini`, StylesPath와 후보별 YAML 규칙을 관리해야 한다. [설치 문서](https://vale.sh/docs/install)는 실행 파일 설치 뒤 프로젝트 설정이 필요하다고 설명한다. `suggestion`이나 `warning`으로 보고하고 수정 action을 두지 않으면 후보와 확정 오류를 구분할 수 있다. `korean.md`를 고칠 때 YAML도 함께 바뀌었는지는 별도 검사가 필요하다.

### 적합한 경우

여러 저장소에서 이미 Vale를 배포하고 있고, AI가 긴 구조화 자료보다 규칙 메시지와 참고 링크를 받아도 충분할 때 적합하다. 이번 목적은 AI에 문제 사례와 정상 사례를 구분해 주는 것이므로 textlint보다 한 단계의 변환이나 결합이 더 필요하다.

## textlint

### 후보 탐색

2026년 8월 1일 공개된 [textlint v15.8.0](https://github.com/textlint/textlint/releases/tag/v15.8.0)은 Markdown과 일반 텍스트를 지원한다. 사용자 규칙은 Markdown AST의 문자열 노드를 방문하고 `matchAll`로 각 출현을 순회한 뒤 `locator.range()`로 정확한 범위를 보고할 수 있다. [사용자 규칙 문서](https://textlint.org/docs/rule/)는 여러 일치를 보고하는 예시와 Link, Image, BlockQuote 같은 parent node를 제외하는 방식을 제시한다.

### AI 입력

사용자 규칙은 후보 자료에서 `ruleId`, pattern, 판정 이유와 예시를 읽어 `RuleError`를 만들 수 있다. 기본 JSON formatter는 파일, 규칙 식별자, 줄, 열, 메시지와 심각도를 제공하고 사용자 formatter도 작성할 수 있다. [formatter 문서](https://textlint.org/docs/formatter/)는 결과 객체와 사용자 formatter API를 설명한다. 사용자 formatter도 같은 후보 자료를 읽고 결과의 `ruleId`와 결합하면 앞의 진단 형식을 출력할 수 있다.

textlint는 [MCP 서버](https://textlint.org/docs/mcp/)에서 `lintFile`과 `lintText`를 제공한다. AI는 저장된 파일과 대화 중 문구를 같은 규칙으로 직접 검사할 수 있다. 기본 MCP 결과로 전달할 때에는 판정 이유와 예시를 `RuleError` 메시지에 포함해야 한다. 앞의 JSON처럼 값을 분리한 결과가 필요하면 사용자 formatter를 직접 실행하거나 MCP wrapper를 추가해야 한다. MCP 서버에는 기본 규칙이 없으므로 프로젝트 설정과 사용자 규칙이 먼저 필요하다.

### 입력 범위

CLI와 MCP로 파일과 텍스트를 검사할 수 있다. Git 변경 파일이나 변경 줄을 스스로 선택하지 않으므로 파일 목록을 넘기는 얇은 호출 코드 또는 reviewdog가 필요하다. AST 검사에서는 코드 블록처럼 제외할 구문을 명시할 수 있고, 정확한 원문 사례까지 검사하려면 별도 raw-text pass를 추가해야 한다.

### 운영 비용과 오판 방지

textlint에는 기본 규칙이 없으며 현재 README는 Node.js 20 이상을 요구한다. [v15.8.0 README](https://github.com/textlint/textlint/blob/v15.8.0/README.md)는 로컬 설치와 별도 규칙 구성을 안내한다. 저장소에는 Node 패키지 관리 파일이 없으므로 runtime, textlint, Markdown 처리기와 사용자 규칙의 버전 관리가 새로 생긴다. 후보 규칙은 수정 기능을 구현하지 않고 warning만 보고하도록 만들 수 있다.

### 적합한 경우

AI가 파일과 저장하지 않은 문구를 직접 검사하고, 후보 자료를 메시지 또는 구조화된 결과로 받아야 할 때 가장 적합하다. 새 Node.js 의존성과 사용자 규칙을 운영하는 비용을 감수하는 대신 Markdown AST, 위치 계산, formatter와 MCP를 재사용한다.

## reviewdog

### 후보 탐색

reviewdog는 표현을 찾거나 Markdown을 해석하지 않는다. Vale, textlint 또는 커스텀 스크립트가 먼저 진단을 만들어야 하므로 단독 선택지가 아니다.

### AI 입력

[RDFormat 문서](https://github.com/reviewdog/reviewdog/blob/v0.21.0/proto/rdf/README.md)는 메시지, 파일과 범위, 심각도, 규칙 코드와 URL, 수정 제안을 전달하는 RDJSON과 RDJSONL을 정의한다. 후보 설명과 정상 사례를 메시지에 넣을 수 있지만 임의의 구조화 필드를 추가하는 형식은 아니다. AI 입력을 풍부하게 만드는 도구라기보다 기존 진단을 보존해 전달하는 도구다.

### 입력 범위

2025년 9월 3일 공개된 [reviewdog v0.21.0](https://github.com/reviewdog/reviewdog/releases/tag/v0.21.0)은 외부 검사기의 결과를 Git diff와 대조한다. [filter mode 문서](https://github.com/reviewdog/reviewdog#filter-mode)에 따르면 `added`는 추가되거나 바뀐 줄, `diff_context`는 그 주변, `file`은 바뀐 파일의 모든 진단, `nofilter`는 전체 진단을 남긴다. 검사 대상이 변경 파일 전체라면 `file`, 추가하거나 수정한 줄만이라면 `added`를 사용한다.

### 운영 비용과 오판 방지

선행 검사기와 reviewdog 실행 파일, 두 도구 사이의 출력 형식을 함께 관리해야 한다. Pull Request에 줄별 댓글이나 Check annotation을 남기는 목적에는 유용하지만, AI가 로컬에서 후보를 판정하는 흐름에는 불필요한 단계다. 후보가 실패인지 경고인지는 선행 검사기가 정한다.

### 적합한 경우

textlint 또는 Vale 결과를 Pull Request와 변경 줄에 표시해야 할 때만 추가한다. AI 검토만 필요하면 textlint MCP나 JSON 출력을 직접 쓰는 편이 정보 손실과 구성 요소를 줄인다.

## 커스텀 스크립트

### 후보 탐색

커스텀 스크립트는 모든 출현, 앞뒤 문장, 줄과 열 계산을 원하는 방식으로 구현할 수 있다. [Node.js file system 문서](https://nodejs.org/api/fs.html)는 파일과 표준 입력을 읽는 API를 제공하고, [Git diff 문서](https://git-scm.com/docs/git-diff.html)는 `--name-only`, `--name-status`, `--diff-filter`와 NUL 구분 출력으로 변경 파일을 고르는 방법을 제공한다.

Markdown AST를 쓰지 않는 단순 문자열 검사는 코드 블록, 링크와 front matter까지 모두 찾는다. Markdown parser를 넣으면 일반 산문과 정확한 원문 사례를 구분할 수 있지만 parser의 source position, 구문별 제외와 버전 호환을 스크립트가 책임져야 한다.

### AI 입력

앞에서 정한 진단 형식을 그대로 출력할 수 있으므로 네 선택지 중 자유도가 가장 높다. 표현별 예시를 한 번만 출력하고 모든 위치를 묶거나, 각 위치에 앞뒤 문장을 넣는 방식도 선택할 수 있다. 별도 프로토콜이 없으므로 AI가 실행할 CLI 규약이나 MCP wrapper는 직접 정해야 한다.

### 입력 범위

파일, 표준 입력, 바뀐 파일 전체와 바뀐 줄을 모두 구현할 수 있다. 다만 추적되지 않은 파일, 이름 변경, 공백과 잘못된 인코딩, CRLF, 한 줄의 반복 출현, Git 저장소 밖 입력을 직접 처리하고 검사해야 한다.

### 운영 비용과 오판 방지

외부 linter 설정은 없지만 검사 framework 자체를 유지한다. 현재 저장소의 [후속 백로그](../plan.md#문맥-검토-후보를-찾는-mjs-검사기)는 Node.js 표준 기능만 쓰는 MJS 검사기를 제안한다. 이 방식은 raw text의 모든 출현을 알리는 초기 구현에는 맞지만, Markdown AST, formatter, suppression과 AI 호출까지 요구하면 textlint가 이미 제공하는 기능을 다시 만들게 된다. 자동 수정 없이 `candidate` 상태만 출력하면 오판은 막을 수 있다.

### 적합한 경우

Node.js package를 배포할 수 없거나, Markdown 구문과 무관하게 원문의 모든 출현을 반드시 찾아야 하거나, 조직이 정한 AI 진단 형식을 다른 소비자도 함께 사용해야 할 때 적합하다. 현재 요구처럼 AI 입력의 품질이 우선이고 textlint 의존성을 허용한다면 첫 선택은 아니다.

## 권고 구성

권고 구성은 다음 네 부분이다.

1. 후보 표현, pattern, 판정 이유, 문제 사례, 정상 사례와 `korean.md` 참고 위치를 구조화된 자료로 관리한다.
2. textlint 사용자 규칙이 Markdown AST에서 모든 출현을 찾고 `candidate` 진단을 만든다.
3. AI는 textlint MCP의 `lintFile` 또는 `lintText`를 호출하거나 사용자 JSON formatter 결과를 받는다.
4. Pull Request 표시가 필요할 때만 같은 진단을 RDJSONL로 바꿔 reviewdog에 전달한다.

이 구성은 textlint를 후보 지식의 기준으로 삼는다는 뜻이 아니다. 기준 자료는 도구와 독립된 한 파일이어야 하며 `korean.md`는 사람이 읽는 판정 설명으로 남긴다. 두 자료의 후보 식별자와 참고 위치가 어긋나지 않는지는 실행 검사로 확인해야 한다. 구조화 자료의 파일 형식과 생성 방향은 후속 설계에서 정한다.

Vale는 이미 조직 표준으로 배포된 경우의 대안이다. 커스텀 스크립트는 raw text 전수 검사나 독자적인 진단 형식이 필요한 경우의 대안이다. reviewdog는 어느 선택에서도 선택적 전달 계층이다.

## 스킬 내부 스크립트 구성

이 절은 2026년 8월 4일에 OpenAI Skills 문서와 공개 저장소, Agent Skills 명세, Node.js와 npm 문서, textlint 15.8.0을 확인한 결과다. 확인한 OpenAI Codex와 Agent Skills 자료에는 스킬이 포함한 외부 패키지를 자동으로 설치하는 공통 절차가 없다.

### 스킬 폴더와 실행 환경의 책임

[OpenAI의 Skills 문서](https://learn.chatgpt.com/docs/build-skills)는 스킬을 `SKILL.md`와 선택적인 `scripts/`, `references/`, `assets/`로 구성할 수 있다고 설명한다. [Agent Skills 명세](https://agentskills.io/specification#scripts)는 스크립트가 자체 실행 가능해야 하거나 필요한 의존성을 명확히 밝혀야 한다고 정한다. 어느 문서도 `package.json`을 발견했을 때 자동으로 npm을 실행하는 설치 규약을 정의하지 않는다.

OpenAI Codex 소스 트리의 [`skill-installer` 표본](https://github.com/openai/codex/blob/5af85998c24fb3353ddd8164c3ed472057b03cb3/codex-rs/skills/src/assets/samples/skill-installer/scripts/install-skill-from-github.py#L164-L176)은 대상 디렉터리에 `SKILL.md`가 있는지 확인한 뒤 디렉터리를 복사한다. `npm install`, `npm ci`나 다른 패키지 설치 명령은 실행하지 않는다. `agents/openai.yaml`의 `dependencies`도 npm 패키지가 아니라 MCP 같은 도구 연결을 선언한다. 이 범위는 [OpenAI Skills 문서의 `dependencies.tools` 예제](https://learn.chatgpt.com/docs/build-skills#optional-metadata)와 [Codex의 `SkillDependencies` 자료형](https://github.com/openai/codex/blob/5af85998c24fb3353ddd8164c3ed472057b03cb3/codex-rs/skills/src/model.rs)에서 교차 확인했다.

따라서 `SKILL.md`는 다음 내용을 직접 정해야 한다.

- 에이전트가 실행할 정확한 명령
- 필요한 Node.js와 npm 버전
- 첫 실행에 네트워크가 필요한지
- 별도 설치 단계가 있다면 누가 언제 실행하는지
- 설치하지 못했을 때 검토를 중단하는 조건
- 스크립트의 입력, JSON 출력과 종료 코드

Agent Skills 명세에는 실행 환경 요구를 적는 `compatibility` frontmatter가 있지만, OpenAI의 현재 [`skill-creator`](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md)는 `name`과 `description`만 쓰도록 안내한다. 이 저장소에서 Codex용 스킬을 설계할 때에는 실행 조건을 `SKILL.md` 본문에 적고, `compatibility` 사용은 해당 Codex 배포 환경이 이 필드를 읽는지 확인한 뒤 결정해야 한다.

### 실행 순서

스크립트를 사용하는 스킬은 다음 순서로 동작한다.

1. Codex가 스킬 설명과 현재 작업을 비교해 `SKILL.md`를 불러온다.
2. `SKILL.md`가 에이전트에게 `node scripts/lint-candidates.mjs ...`처럼 정확한 실행 명령을 지시한다.
3. 실행 스크립트가 스킬 내부의 규칙과 후보 자료 위치를 계산한다.
4. 실행 스크립트가 textlint CLI를 실행하거나 설치된 textlint API를 직접 불러온다.
5. textlint 사용자 규칙이 후보 표현의 모든 출현을 보고한다.
6. 실행 스크립트가 textlint 결과와 후보별 이유 및 사례를 합쳐 JSON을 표준 출력에 기록한다.
7. 주 에이전트와 독립 검수자가 JSON과 주변 문장을 읽고 각 후보의 유지 또는 수정 필요성을 판정한다.

3단계에서 스킬 자료를 호출 저장소의 현재 작업 디렉터리 기준으로 찾으면 다른 저장소에서 스킬을 실행할 때 깨질 수 있다. [Node.js ESM 문서](https://nodejs.org/api/esm.html#importmetaurl)는 `import.meta.url`을 기준으로 현재 모듈 옆의 자료를 읽는 방식을 제시한다. 스킬 내부의 규칙과 후보 자료는 `import.meta.url`로 찾고, 검사 대상 파일만 명령 인수로 받은 저장소 상대 위치를 사용해야 한다.

### 방식 1: npm 패키지의 CLI만 실행

이 방식은 설치 구조를 만들기 전에 textlint 사용자 규칙을 평가할 때 가장 작다. 스킬의 실행 스크립트는 Node.js 표준 모듈만 사용하고 textlint를 import하지 않는다. 대신 버전을 고정한 textlint 실행 파일을 `npx`로 호출한다.

```text
skills/use-words-review/
├── SKILL.md
├── references/
│   ├── korean.md
│   ├── examples.md
│   └── candidate-expressions.json
└── scripts/
    ├── lint-candidates.mjs
    └── textlint-rules/
        └── candidate-expressions.js
```

이 구성에는 `package.json`, `package-lock.json`과 `node_modules`가 없다. `lint-candidates.mjs`가 내부에서 실행할 명령은 다음 형태다. 정확한 인수와 Windows 처리는 구현 검증으로 확정해야 한다.

```text
npx --yes textlint@15.8.0 --no-textlintrc --rulesdir <스킬의 규칙 디렉터리> --format json <검사 파일>
```

[Agent Skills의 스크립트 안내](https://agentskills.io/skill-creation/using-scripts#using-one-off-commands)는 `npx package@version`이 패키지를 필요할 때 내려받고 npm 캐시에 보관한다고 설명한다. [npm exec 문서](https://docs.npmjs.com/cli/v11/commands/npm-exec)는 로컬에 없는 패키지를 npm 캐시에 설치하고 실행 파일을 자식 프로세스의 `PATH`에 추가한다고 설명한다. `--yes`는 설치 여부를 묻는 npm 확인을 생략해 비대화형 실행을 가능하게 한다.

이 방식이 제공하는 것은 CLI 실행이다. npm 캐시에 textlint가 있다는 이유만으로 `lint-candidates.mjs`의 `import "textlint"`가 성공하지는 않는다. [Node.js의 패키지 해석 문서](https://nodejs.org/api/esm.html#import-specifiers)는 패키지 이름 형태의 import를 현재 모듈에서 접근할 수 있는 `node_modules`에서 찾는다. `npx`가 임시로 바꾸는 `PATH`는 JavaScript import 위치가 아니다.

첫 실행에는 Node.js 20.18 이상, npm과 npm registry에 연결할 네트워크 권한이 필요하다. 이 조건은 textlint 15.8.0의 [npm package 정보](https://www.npmjs.com/package/textlint/v/15.8.0)와 [공식 README](https://github.com/textlint/textlint/blob/v15.8.0/README.md#installation)에서 확인했다. 캐시에 패키지가 없고 네트워크를 사용할 수 없으면 검사를 중단하고 원인을 알려야 한다.

`textlint@15.8.0`처럼 직접 실행하는 패키지 버전을 고정해도 하위 의존성이 모두 고정되는 것은 아니다. [textlint 15.8.0의 npm registry 자료](https://registry.npmjs.org/textlint/15.8.0)는 일부 의존성을 `^` 범위로 선언한다. 새로운 환경에서 `npx`가 다시 설치하면 그 범위 안의 더 최근 버전을 선택할 수 있으므로, 같은 전체 의존성 구조가 필요할 때에는 잠금 파일 방식으로 바꿔야 한다.

### 방식 2: 스킬을 npm 프로젝트로 관리

여러 저장소에 같은 검사기를 배포하거나, `lint-candidates.mjs`가 `createLinter` 같은 textlint API를 직접 import하거나, 승인된 설치 이후에는 네트워크 없이 반복 실행해야 한다면 이 방식을 선택한다.

```text
skills/use-words-review/
├── SKILL.md
├── package.json
├── package-lock.json
├── references/
│   └── candidate-expressions.json
└── scripts/
    ├── lint-candidates.mjs
    └── textlint-rules/
        └── candidate-expressions.cjs
```

`package.json`은 다음 책임만 갖는다. 이 예시는 제안이며 승인된 구현이 아니다.

```json
{
  "private": true,
  "engines": {
    "node": ">=20.18.0"
  },
  "dependencies": {
    "textlint": "15.8.0"
  }
}
```

별도 준비 단계에서 스킬 루트에 `npm ci`를 한 번 실행한다. 이 명령을 실행하고 갱신할 역할은 구현 전에 정해야 한다. [npm ci 문서](https://docs.npmjs.com/cli/v11/commands/npm-ci)는 `package-lock.json`이 없거나 `package.json`과 일치하지 않으면 실패하고, 기존 `node_modules`를 지운 뒤 잠금 파일에 기록된 의존성을 설치한다고 설명한다. [package-lock 문서](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json)는 정확한 의존성 구조와 무결성 정보를 기록해 같은 설치 결과를 재현하는 역할을 설명한다.

설치가 성공하면 `scripts/lint-candidates.mjs`의 `import "textlint"`는 스킬 루트의 `node_modules`를 찾을 수 있다. Node.js가 import한 파일의 위치에서 상위 디렉터리로 `node_modules`를 찾기 때문이다. 이때도 스킬 설치기가 `npm ci`를 실행하지는 않는다. `SKILL.md`는 `node_modules`가 없을 때 검사 실행과 설치를 구분하고, 필요한 설치 명령과 네트워크 조건을 알려야 한다.

textlint API를 직접 불러올 필요가 없다면 설치된 로컬 CLI를 실행해도 된다. 두 실행 방법 모두 같은 `package-lock.json`과 `node_modules`를 사용하므로, API를 쓰지 않고도 전체 의존성 구조를 고정할 수 있다. 후보 위치와 JSON 결과를 얻는 데 CLI로 충분하면 CLI가 더 작은 구현이다.

`npm ci`는 패키지가 npm 캐시에 없으면 네트워크를 사용한다. 설치가 끝난 뒤의 검사 실행에만 네트워크가 필요하지 않다. `node_modules`를 스킬과 함께 커밋하면 파일 수, 운영체제별 네이티브 모듈, 라이선스와 갱신 책임이 커지며 공식 독립 스킬 설치기가 이를 관리한다는 근거도 없다. 따라서 소스에는 `package.json`과 `package-lock.json`만 두고 `node_modules`는 포함하지 않는 편이 맞다.

### 방식 3: 의존성을 파일 안에 선언하는 실행 환경

Agent Skills 문서는 Python의 PEP 723과 `uv run`, Deno의 `npm:` import, Bun의 자동 설치처럼 한 파일에 의존성을 선언하는 예시도 제공한다. [자체 실행 스크립트 안내](https://agentskills.io/skill-creation/using-scripts#self-contained-scripts)는 이 방식이 별도 패키지 설정 파일과 설치 단계를 줄인다고 설명한다.

그러나 이 방식은 해당 실행 환경이 설치되어 있어야 하며, textlint는 Node.js용 CLI와 API를 중심으로 배포된다. 현재 저장소에는 Deno, Bun이나 uv가 모든 대상 환경에 있다는 근거가 없다. textlint 하나를 실행하기 위해 실행 환경을 더 추가하는 방식은 기본안으로 삼지 않는다.

### 공개 스킬의 실제 사례

공식 공개 저장소도 하나의 의존성 관리 방식을 강제하지 않는다. 2026년 8월 4일에 `openai/skills`의 2026년 6월 24일 상태와 `anthropics/skills`의 2026년 7월 24일 상태를 확인했다.

- OpenAI의 [openai-docs 스크립트](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/openai-docs/scripts/fetch-codex-manual.mjs)는 Node.js 표준 모듈과 내장 `fetch`를 사용하며 별도 npm 패키지 설정 파일이 없다.
- OpenAI의 [Playwright 실행 스크립트](https://github.com/openai/skills/blob/a5119697b819090e00e5d11ee1d86834d7c1043a/skills/.curated/playwright/scripts/playwright_cli.sh)는 `npx --yes --package @playwright/cli`로 CLI를 실행하고 `package.json`을 두지 않는다. 이 사례는 CLI 실행 방식을 뒷받침하지만 패키지 버전을 고정하지 않으므로 검사 결과를 재현해야 하는 이번 용도에는 정확한 textlint 버전을 추가해야 한다.
- OpenAI의 [security-ownership-map 스킬](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-ownership-map/SKILL.md)은 외부 Python 패키지를 사용자가 별도로 설치하게 하고, [스크립트](https://github.com/openai/skills/blob/5c8f1e26803bcfaffeceef1e7accbcf7e388417a/skills/.curated/security-ownership-map/scripts/build_ownership_map.py#L828-L835)는 import 실패 시 설치 명령을 보여 준다.
- Anthropic의 [slack-gif-creator requirements](https://github.com/anthropics/skills/blob/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/slack-gif-creator/requirements.txt)는 Pillow, imageio와 numpy의 최저 버전을 기록한다. 잠금 파일이 없으므로 설치 편의 사례이지 같은 의존성 구조를 재현하는 사례는 아니다.

이 사례들은 스킬이 외부 의존성을 사용할 수 있다는 점은 확인하지만, 스킬 설치기가 의존성을 자동으로 준비한다는 근거는 제공하지 않는다. 또한 공개 `openai/skills`의 조사 시점 전체 트리에는 스킬 실행용 `package.json`, npm 잠금 파일과 `node_modules`가 없었다. 이 부재는 조사한 시점과 파일 이름에 한정되며 이후 추가되거나 다른 이름으로 관리되는 자료까지 부정하지 않는다.

### 스크립트를 작성할 때 지킬 조건

외부 의존성 방식과 관계없이 실행 스크립트에는 다음 조건이 필요하다.

- **경로 계산:** 스킬 내부 자료는 `import.meta.url`로 찾고 검사 대상은 명령 인수로 받는다. `process.cwd()` 하나로 두 위치를 모두 계산하지 않는다.
- **프로세스 실행:** [Node.js child process 문서](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options)가 설명하는 `spawn` 또는 `execFile`과 인수 배열을 사용한다. 사용자 입력을 셸 명령 문자열에 합치지 않는다.
- **비대화형 실행:** 입력은 명령 옵션, 환경 변수나 표준 입력으로 받고 `--help`에 사용법을 적는다. JSON만 표준 출력에 기록하고 진행 상태와 오류는 표준 오류에 기록한다. 이 구분은 [Agent Skills 스크립트 안내](https://agentskills.io/skill-creation/using-scripts#designing-scripts-for-agentic-use)에 따른다.
- **종료 상태:** 후보를 찾은 상태와 검사기를 실행하지 못한 상태를 구분한다. 자식 프로세스를 시작하지 못한 오류와 textlint가 반환한 종료 코드를 따로 처리하고, 비정상 종료를 성공으로 바꾸지 않는다.
- **설치 시점 스크립트:** npm은 `npm ci` 중에 의존 패키지의 설치 시점 스크립트를 실행할 수 있다. [npm scripts 문서](https://docs.npmjs.com/cli/v11/using-npm/scripts)는 `preinstall`, `install`, `postinstall`과 `prepare`의 실행 순서를 설명한다. `--ignore-scripts`는 위험을 줄일 수 있지만 네이티브 모듈 설치를 깨뜨릴 수 있으므로 실제 의존성으로 검증하기 전에는 기본값으로 확정하지 않는다. npm 11의 `allowScripts` 정책도 이전 npm에 같은 동작이 있다고 가정하면 안 된다.
- **출력 제한:** 같은 표현의 이유와 사례는 한 번만 기록하고 출현 위치를 묶는다. 후보 수가 많아도 에이전트 문맥 창을 소진하지 않도록 최대 결과 수와 잘림 상태를 JSON에 명시한다.

### 의존성 갱신과 검증

잠금 파일을 사용해도 의존성 갱신은 자동으로 안전해지지 않는다. textlint 버전을 바꾸는 변경에서는 다음 항목을 한 작업 단위로 확인해야 한다.

1. `package.json`의 textlint 버전을 의도한 정확한 버전으로 바꾸고 잠금 파일을 다시 만든다.
2. 잠금 파일의 새 패키지, 삭제된 패키지와 설치 시점 스크립트를 검토한다.
3. 비어 있는 설치 상태에서 `npm ci`가 성공하는지 확인하고 `npm ls`로 설치 구조의 오류를 검사한다.
4. `npm audit` 결과를 검토하되 `npm audit fix`로 잠금 파일을 자동 변경하지 않는다. [npm audit 문서](https://docs.npmjs.com/cli/v11/commands/npm-audit/)에 따르면 `audit fix`는 내부에서 전체 `npm install`을 실행하며, 일부 취약점은 사람이 변경 영향을 검토해야 한다.
5. 후보 표현을 찾는 실행 검사와 한국어 문맥 검토를 다시 수행한다.
6. textlint의 변경 기록과 [MIT 라이선스](https://github.com/textlint/textlint/blob/v15.8.0/LICENSE)를 확인한다. 새 하위 의존성이 생기면 그 라이선스와 배포 조건도 함께 확인한다.

`npm audit`은 알려진 취약점 자료를 확인하는 수단이지 의존성 승인을 대신하지 않는다. npm 문서도 잠금 파일 없이 실행하면 매번 의존성 구조를 다시 계산해 결과가 달라질 수 있다고 설명한다. 따라서 보안 검사 결과와 잠금 파일 변경 검토를 서로 다른 확인 항목으로 유지해야 한다.

### use-words-review에 적용할 권고

[요구사항의 목표](../requirements.md#목표)는 여러 애플리케이션 저장소에 복사하는 문서 체계에서 후보 표현과 정상 사례를 AI 검토에 연결하는 것이다. 따라서 지속적으로 배포할 구성에는 **방식 2**, 즉 `package.json`, `package-lock.json`과 명시적인 `npm ci` 준비 단계를 두는 편이 맞다. **방식 1**은 textlint 사용자 규칙의 시제품과 의존성 구조를 확정하기 전 평가에 사용한다.

다음 조건을 모두 충족할 때 방식 2의 구현을 시작할 수 있다.

- 스킬을 준비할 때 `npm ci`를 실행할 주체와 시점이 정해져 있다.
- 지원할 Node.js, npm과 운영체제 범위가 정해져 있다.
- 잠금 파일과 textlint 버전을 검토하고 갱신하는 절차가 정해져 있다.
- 설치 시점 스크립트를 허용할 조건과 의존성 검토 책임이 정해져 있다.

MCP는 두 방식의 의존성 설치를 대신하지 않는다. [textlint MCP 문서](https://textlint.org/docs/mcp/#configuration)는 textlint 설정과 설치된 규칙을 먼저 요구한다. 저장되지 않은 문구를 여러 도구가 같은 방식으로 호출해야 한다는 요구가 생길 때만 MCP를 추가한다.

## 구현 전에 정해야 할 사항

- **검사 단위:** 바뀐 파일 전체인지, 추가하거나 수정한 줄만인지 정해야 한다.
- **후보 자료의 기준:** `korean.md`에 기계 판독 구간을 둘지, 별도 구조화 자료를 둘지 정해야 한다.
- **정확한 원문도 경고할지:** 코드 블록, 인용문과 평가 입력에도 후보를 알릴지, 일반 산문만 검사할지 정해야 한다.
- **예시 반복 방식:** 모든 출현에 사례를 반복할지, 표현별 설명 한 건과 출현 위치 목록을 나눌지 정해야 한다.
- **실행 위치:** `use-words-review` 호출 중에만 실행할지, pre-commit이나 CI에도 연결할지 정해야 한다. 후보 발견을 실패로 바꾸는 동작은 별도 결정이 필요하다.
- **의존성 준비 방식:** 첫 실행의 네트워크 다운로드를 허용할지, 설치 단계에서 `npm ci`를 실행한 뒤 준비된 `node_modules`로 검사할지 정해야 한다.
- **배포 단위:** 개인 또는 저장소 스킬로만 둘지, 여러 환경에 같은 실행 환경과 MCP 설정을 함께 배포하는 플러그인으로 만들지 정해야 한다. OpenAI의 [플러그인 문서](https://learn.chatgpt.com/docs/build-skills#package-skills-with-plugins)는 플러그인이 스킬과 MCP 구성을 함께 묶을 수 있다고 설명하지만 npm 패키지를 자동 설치한다고 설명하지는 않는다.

## 조사 한계

공식 문서, 최신 릴리스와 공개 저장소 소스에서 Vale, textlint, reviewdog, Git과 Node.js API를 확인했다. GitHub 코드 검색에서 한국어 후보 목록과 정상 용례를 함께 제공하는 같은 목적의 완제품은 찾지 못했지만, 검색 결과가 없다는 사실만으로 모든 비공개 도구와 이름이 다른 공개 구현의 부재를 증명할 수는 없다.

이번 조사는 도구 기능과 현재 저장소의 차이를 비교했다. 구현과 외부 의존성 설치는 [요구사항의 목표](../requirements.md#목표)에 포함되지 않으므로 `npx`로 textlint를 내려받거나 제안한 실행 스크립트와 사용자 규칙을 실행하지 않았다. 정확한 `rulesdir` 명령, Windows의 `npx.cmd` 호출, 스킬 위치에 공백이 있을 때의 인수 전달, 깨끗한 환경에서 `npm ci`를 실행한 결과와 설치 시점 스크립트 목록은 구현이 승인된 뒤 검증해야 한다.

실제 한국어 문장, CRLF, 한 줄의 반복 출현, 이름 변경, 공백이 있는 파일명, 잘못된 인코딩과 표준 입력을 사용한 실행 평가도 같은 단계에서 수행해야 한다.
