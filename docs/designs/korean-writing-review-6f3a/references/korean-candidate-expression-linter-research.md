# 한국어 후보 표현 검사기 소스 조사

## 결론

현재 구현된 `scan-korean-expressions.mjs`는 literal 후보를 원문 전체에서 찾는 표현 검사기다. 긴 플레인 텍스트 문단 검사는 Markdown block 판별과 한국어 문장 분리가 필요하므로 별도 탐지 모듈로 나누는 편이 책임과 결과 구조를 분명하게 만든다. 요구사항 소유자는 `scan.mjs`가 원문을 한 번 읽고 `korean-expressions.mjs`와 `long-paragraphs.mjs`를 호출하는 구성을 승인했다.

`scan.mjs`만 두 탐지 모듈의 정확한 상대 위치를 정적 import한다. 표현 검사와 긴 문단 검사는 각각 상세 경고 20,000개와 직렬화 결과 32 MiB를 상한으로 사용하고, 각 결과에 전체, 표시 및 생략 수를 제공한다. textlint, Vale와 reviewdog는 실행 의존성으로 넣지 않고 Node.js 표준 기능만 사용하며, 후보는 확정 오류가 아니라 AI가 문맥을 읽을 검토 위치로 제공한다. 승인된 결정과 다시 검토할 조건은 [한국어 검사기의 모듈과 출력 상한](../decisions/scanner-modules-and-output-limits.md)에 기록했다.

규칙의 `reference` 필드는 제거하는 편이 맞다. 스킬은 사용자 홈, 저장소 내부, 관리 환경 또는 다른 호스트에 설치될 수 있다. 실행 결과를 이해할 때마다 별도 파일을 찾아 읽게 하면 설치 위치 해석과 추가 문맥 사용이 필요하다. literal로 찾을 규칙은 `id`, `expressions`, `message`, `queries`, `negatives`, `positives`를 스크립트 상수 하나에 둔다. 출력은 일치한 규칙의 설명과 사례를 규칙마다 한 번만 싣고, 출현별 위치와 원문 일부를 별도 배열에 둔다.

`reference` 제거와 `korean.md` 제거는 같은 결정이 아니다. `korean.md`에는 literal 검색으로 만들 수 없는 문장 판정 절차가 있다. 영어식 무생물 주어, 행동 주체가 빠진 피동문, 명사 나열, 지칭 대상 변화, 근거 없이 이어받은 표현과 반복되는 문단 구조는 내장 후보 목록만으로 전수 탐색할 수 없다. 따라서 `korean.md`를 없애지 않고 이러한 의미 검토 기준만 남긴다. literal 후보, 판정 질문과 대조 사례는 스크립트로 옮겨 두 파일이 같은 자료를 중복 관리하지 않게 한다.

입력은 `--changed <repo>`, 반복 가능한 `--file <path>`, `--stdin --source-name <name>` 가운데 정확히 하나만 사용한다. 각 입력 어댑터가 `Source`를 만들고 같은 `scanSources` 함수가 원문을 검사한다. `scan.mjs`가 파일 선택과 입력 정규화를 맡고 같은 source를 두 탐지 모듈에 전달한다. 원문 문자열을 명령행 인수로 직접 받는 `--text`는 shell quoting과 인수 길이 문제 때문에 두지 않는다.

정상 결과는 표준 출력에 JSON 객체 하나로 쓴다. 후보가 있거나 없어도 종료 상태는 `0`이다. Git 실행, 인수, 파일 읽기, 인코딩, 크기 또는 직렬화가 실패하면 예외를 최상위에서 한 번 잡아 짧은 메시지를 표준 오류에 쓰고 종료 상태를 `2`로 정한다. 후보를 `throw new Error`로 전달하면 모든 출현을 모으지 못하고 실행 실패와 검토 대상을 구분할 수 없으므로 사용하지 않는다.

이 안은 [요구사항의 목표](../requirements.md#목표)에 있는 `korean.md` 유지 여부, 모든 후보 출현의 경고 방식과 스크립트 설계를 구체화한다. 요구사항 소유자는 세 파일을 한 배포 단위로 사용하고, literal 후보 자료와 의미 검토 기준의 책임을 나누는 방안을 승인했다.

## 조사 질문과 확인 범위

이번 조사는 다음 질문을 다뤘다.

- 기존 한국어 판정 자료 중 스크립트가 보관할 정보와 AI 절차로 남길 정보는 무엇인가.
- 스킬 설치 위치에 의존하지 않고 규칙 설명과 사례를 한 실행에서 전달할 수 있는가.
- Git 변경 파일, 지정 파일과 문자열을 같은 탐색 본체에 안전하게 전달할 수 있는가.
- 결과 파일을 만들지 않고 후보, 정상 사례와 실행 실패를 구분할 수 있는가.
- 긴 문단을 확정 오류로 만들지 않고 의미 검토 후보로 빠짐없이 알릴 수 있는가.
- 표현 검사와 문단 검사의 탐지 코드를 나누면서 입력, 상한, 오류와 JSON 출력을 한 실행에서 공유할 수 있는가.
- 배포 위치에 의존하지 않고도 역할을 알 수 있는 짧은 `.mjs` 파일명은 무엇인가.
- textlint 15.8.0, Vale 3.17.1과 reviewdog 0.21.0의 실제 구현에서 재사용할 구조와 피해야 할 동작은 무엇인가.

2026년 8월 5일부터 8월 7일까지 공식 문서와 공식 저장소의 tag 소스를 함께 확인했다. textlint는 v15.8.0, Vale는 v3.17.1, reviewdog는 v0.21.0을 기준으로 삼았다. OpenAI와 Agent Skills의 공식 문서에서 현재 스킬 검색 위치와 `scripts/`, `references/`의 역할도 다시 대조했다.

## 기존 도구에서 가져올 구조

### textlint는 입력을 나누고 검사 본체를 공유한다

textlint의 CLI는 파일 입력과 `text` 및 `stdinFilename` 입력을 서로 다른 실행 자료로 구분한다. `lintFiles`는 glob, ignore와 확장자 판정을 거치고, `lintText`는 호출자가 준 문자열과 표시할 파일 위치를 바로 검사하지만 두 경로는 같은 kernel의 문자열 검사로 모인다. 이 구조는 입력별 선택 규칙을 숨기지 않으면서 원문 탐색을 한 함수에서 유지할 수 있다는 근거다. [textlint CLI 입력 분기](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/cli.ts)와 [createLinter 구현](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/createLinter.ts)을 확인했다.

textlint의 공개 규칙 형식에는 문제 사례, 정상 사례와 도움말 위치를 담는 공통 metadata가 없다. 규칙 module은 실행 함수와 option을 중심으로 정의되고 결과 message의 `data`도 의미가 정해지지 않은 값이다. 따라서 이 조사에서 제안하는 구조화된 사례는 textlint schema를 복사한 것이 아니라 현재 AI 소비자에 필요한 자체 규약이다. [TextlintRuleModule](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/types/src/Rule/TextlintRuleModule.ts)과 [TextlintResult](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/types/src/Message/TextlintResult.ts)가 실제 공개 형식을 보여 준다.

textlint JSON formatter는 결과 전체를 한 번에 직렬화한다. 파일 출력 option은 상위 디렉터리를 만들고 기존 파일을 덮어쓰며, 지정하지 않으면 같은 문자열을 표준 출력에 쓴다. 결과 파일은 textlint를 쓰기 위한 필수 구조가 아니다. [JSON formatter](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/linter-formatter/src/formatters/json.ts)와 [출력 처리](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/cli-util.ts)를 확인했다.

### Vale는 명시적 입력 구분과 자체 규칙 형식의 필요성을 보여 준다

Vale는 여러 파일, 표준 입력과 문자열을 받을 수 있지만, 위치 인수 하나가 실제 파일이 아니면 그 인수 자체를 검사 문자열로 해석한다. 파일 이름 오타나 검사 중 사라진 파일을 원문으로 오인할 수 있으므로 이 자동 판별은 가져오지 않는다. `--changed`, `--file`, `--stdin`을 명시적으로 구분하면 입력 의도를 추정할 필요가 없다. [Vale CLI 입력 처리](https://github.com/vale-cli/vale/blob/v3.17.1/cmd/vale/main.go)가 이 분기를 보여 준다.

Vale 규칙은 `Message`, `Description`, `Link`와 `Action`을 제공하지만 구조화된 문제 사례와 정상 사례 필드는 없다. 정의에 없는 YAML 필드는 규칙 로드 오류가 된다. 여러 token에 서로 다른 설명과 사례를 연결하려면 규칙을 나누거나 문자열에 합쳐야 하므로 현재 필요한 자료 구조를 Vale YAML로 대신할 수 없다. [Vale Definition](https://github.com/vale-cli/vale/blob/v3.17.1/internal/check/definition.go)과 [existence 규칙](https://github.com/vale-cli/vale/blob/v3.17.1/internal/check/existence.go)을 확인했다.

Vale의 `scope: raw`도 원본 byte를 그대로 검사하지 않는다. markup parser 전의 내용을 쓰지만 CRLF 및 단독 CR과 일부 entity를 먼저 바꾼 문자열을 검사한다. 원문에서 찾은 위치를 AI에게 보여 줄 때 이 동작을 복사하면 열 위치가 달라질 수 있다. [입력 정리](https://github.com/vale-cli/vale/blob/v3.17.1/internal/core/util.go)와 [raw 검사 경로](https://github.com/vale-cli/vale/blob/v3.17.1/internal/lint/lint.go)를 확인했다.

Vale의 정상 JSON 결과는 표준 출력으로 가고 실행 오류는 표준 오류와 종료 상태 `2`로 분리된다. 이는 결과 파일 없이도 기계 자료와 실행 실패를 나눌 수 있다는 실제 사례다. 다만 Vale JSON은 경고가 없는 입력 파일과 실행한 규칙 전체를 보존하지 않으므로 현재 schema를 그대로 쓰지는 않는다. [Vale JSON 출력](https://github.com/vale-cli/vale/blob/v3.17.1/cmd/vale/json.go)과 [오류 출력](https://github.com/vale-cli/vale/blob/v3.17.1/cmd/vale/error.go)을 확인했다.

### reviewdog는 Git 파일 선정기나 내부 정본이 아니다

reviewdog는 표현을 찾거나 변경 파일을 스스로 정하지 않는다. 외부 `DiffService`가 준 unified diff와 선행 검사기의 진단을 대조한다. `file` mode는 제공된 diff에 나온 파일의 모든 진단을 통과시킨다는 뜻이지 staged, unstaged와 untracked 파일을 수집한다는 뜻이 아니다. 따라서 `--changed`의 파일 선정은 Git porcelain으로 별도 정의해야 한다. [reviewdog 실행 구성](https://github.com/reviewdog/reviewdog/blob/v0.21.0/reviewdog.go)과 [filter mode](https://github.com/reviewdog/reviewdog/blob/v0.21.0/README.md#filter-mode)를 확인했다.

reviewdog의 parser, diff provider와 writer 주입은 각 종류가 여러 개이기 때문에 필요하다. 이번 검사기는 입력 선택기 세 개가 같은 `Source` 값을 만들고 JSON 출력은 하나뿐이다. class, DI container, formatter interface와 plugin registry를 만들지 않고 함수 인수로 공급자 하나를 넘기면 충분하다.

RDJSON parser는 알 수 없는 필드를 버린다. 여기에 검사 파일 목록이나 후보별 사례를 확장 필드로 넣어도 reviewdog를 거친 뒤에는 보존되지 않는다. RDJSONL parser는 긴 한 줄이나 읽기 오류를 확인하지 못할 수 있고, 진단마다 metadata를 반복한다. 따라서 reviewdog 형식은 내부 결과 schema가 아니라 실제 Pull Request 연결 요구가 생겼을 때 변환할 대상으로만 검토한다. [RDJSON parser](https://github.com/reviewdog/reviewdog/blob/v0.21.0/parser/rdjson.go)와 [RDJSONL parser](https://github.com/reviewdog/reviewdog/blob/v0.21.0/parser/rdjsonl.go)를 확인했다.

## 스킬 안의 자료 배치

### 설치 위치는 실행 계약에 넣지 않는다

OpenAI 문서는 Codex가 현재 디렉터리부터 저장소 루트까지의 `.agents/skills`, 사용자 `$HOME/.agents/skills`, 관리 위치와 system 위치에서 스킬을 읽을 수 있다고 설명한다. Claude Code는 저장소 `.claude/skills`, 사용자 `$HOME/.claude/skills`와 plugin 위치를 사용한다. Agent Skills 명세는 다른 호스트도 지원하고, 스킬 디렉터리에 `SKILL.md`와 선택적인 `scripts/`, `references/`를 둘 수 있게 한다. 따라서 홈이나 저장소의 한 절대 위치를 스크립트 입력으로 고정하면 안 된다. [OpenAI 스킬 문서](https://developers.openai.com/codex/skills), [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)와 [Agent Skills 명세](https://agentskills.io/specification)를 확인했다.

스크립트는 활성화된 `SKILL.md`와 같은 스킬 디렉터리의 `scripts/`에 둔다. `SKILL.md`가 자신의 위치를 기준으로 스크립트를 실행하게 하되, 스크립트가 규칙을 다른 스킬 파일에서 다시 찾지는 않는다. 이렇게 하면 설치 위치 차이는 호출 경로에만 영향을 주고 규칙 결과에는 영향을 주지 않는다.

```text
use-words-review/
├── SKILL.md
├── references/
│   ├── examples.md
│   └── korean.md
└── scripts/
    ├── scan.mjs
    ├── korean-expressions.mjs
    └── long-paragraphs.mjs
```

`package.json`, lock 파일, `node_modules`, `assets/`, `agents/openai.yaml`과 설정 파일은 표준 기능만 쓰는 세 스크립트의 실행에 필요하지 않다. `.mjs`는 가까운 `package.json`의 `type` 값과 무관하게 ES module로 해석된다. [Node.js package 문서](https://nodejs.org/api/packages.html#packagejson-and-file-extensions)가 이 동작을 정의한다.

### `korean.md`는 의미 검토 자료로 유지한다

`korean.md`에 모든 사례를 그대로 유지하면 AI가 후보마다 파일과 소제목을 다시 읽어야 하고 스크립트의 literal과 문서 사례가 어긋날 수 있다. 파일을 통째로 스크립트 상수에 넣으면 literal로 찾을 수 없는 의미 검토 절차까지 JavaScript 문자열에 묻힌다. 승인된 구성은 두 책임을 나눈다.

권장안은 다음처럼 책임을 나누는 것이다.

- 스크립트는 기계적으로 찾을 표현, 경고 설명, 문맥 판정 질문, 문제 사례와 정상 사례를 한 규칙 상수에 둔다.
- `SKILL.md`는 스크립트를 실행할 시점, 결과를 읽는 순서와 `korean.md`의 의미 검토를 수행할 조건을 둔다.
- `korean.md`는 literal 검색으로 찾을 수 없는 문장 구조와 문단 관계의 의미 검토 기준을 둔다.
- 언어 공통 사례가 계속 필요하면 기존 `references/examples.md`를 유지한다.

이 구분은 deterministic file processing에는 `scripts/`, 실행 순서와 중단 조건에는 `SKILL.md`, 필요할 때만 읽는 상세 자료에는 `references/`를 쓰라는 공식 역할과 맞는다. 모든 상세 자료를 반드시 `references/`에 두라는 뜻은 아니다. 스크립트가 반환해야 할 규칙 metadata는 실행 코드와 같은 정본에 있어야 한다. [Agent Skills 스크립트 안내](https://agentskills.io/skill-creation/using-scripts)와 [OpenAI 스킬 작성 지침](https://developers.openai.com/codex/skills)을 확인했다.

### 실행 기준은 Node.js 22와 Git 2.18이다

최저 실행 버전은 Node.js 22.0.0과 Git 2.18.0으로 정한다. 2026년 8월 6일 기준 Node.js 22는 유지보수 중인 가장 오래된 LTS 계열이고 Node.js 20은 지원이 끝났다. Node.js는 프로덕션에서 Active LTS 또는 Maintenance LTS를 사용하라고 안내한다. [Node.js 릴리스 현황](https://nodejs.org/en/about/previous-releases)을 확인했다.

Git 프로젝트는 LTS 계열을 지정하지 않는다. 따라서 Git 최저 버전은 LTS라는 이름이 아니라 실제 명령 기능으로 정한다. `git status --porcelain=v1 -z --no-renames --untracked-files=all`에 필요한 `--no-renames`와 `status.renames`는 Git 2.18.0에서 추가됐다. porcelain v1은 버전 간 출력 안정성을 약속하고 `-z`는 경로를 NUL로 구분한다. [Git 2.18.0 릴리스 기록](https://raw.githubusercontent.com/git/git/v2.18.0/Documentation/RelNotes/2.18.0.txt)과 [git-status 문서](https://git-scm.com/docs/git-status)를 대조했다.

현재 구현과 대표 실행은 macOS에서만 확인한다. Linux와 Windows 동작은 이번 완료 증거에 포함하지 않는다. 구현은 shell을 거치지 않고 Git을 실행하며 경로를 줄바꿈이 아닌 NUL byte로 구분하지만, 이 작성 방식만으로 확인하지 않은 운영체제의 동작을 주장하지 않는다. Node.js가 공개한 platform 목록은 실행 환경을 조사하는 자료이며 이번 검증 범위를 넓히는 근거로 사용하지 않는다. [Node.js 22 지원 platform 목록](https://github.com/nodejs/node/blob/v22.x/BUILDING.md#platform-list)과 저장소 루트 판정에 쓰는 [git-rev-parse 문서](https://git-scm.com/docs/git-rev-parse)를 확인했다.

## 실행 진입점과 탐지 모듈 분리 검토

표현 검사와 문단 검사는 탐지 단위와 경고 속성이 다르지만 입력, 오류 및 출력 처리는 같다. 따라서 탐지 코드는 파일로 나누고 AI가 실행할 명령은 하나로 유지한다. 이 구성과 검사별 출력 상한은 [승인된 결정](../decisions/scanner-modules-and-output-limits.md)을 따른다.

### 현재 파일은 literal 표현 검사에 맞춰져 있다

이전 `scan-korean-expressions.mjs`는 각 규칙에 `expressions`를 요구하고, 첫 UTF-16 code unit으로 만든 색인에서 모든 substring 출현을 찾았다. 공개 결과도 `catalog`에 규칙별 `expressions`를 넣고 각 경고에 `expression`, `startUtf16`과 `endUtf16`을 제공했다. Markdown node 종류를 구분하지 않아 code fence, 표와 제목의 literal도 같은 방식으로 찾았다.

문단 검사는 빈 줄과 Markdown block marker 및 fence 상태로 최상위 플레인 텍스트 문단을 구분하고, 각 문단을 `Intl.Segmenter`로 나눠 문장 수를 센다. 경고에는 일치 표현과 끝 열이 아니라 문장 수와 문단 시작 위치가 필요하다. 이 차이를 기존 규칙의 `kind` 분기로 흡수하면 규칙 검증, 탐색, 직렬화와 자체 검사마다 서로 사용하지 않는 속성을 조건부로 처리해야 한다.

### 한 파일에 두 탐지기를 넣는 방법은 이전 기준이었다

이전 기준은 한 번 읽은 source와 JSON 출력을 그대로 활용하며 추가 파일을 만들지 않았다. 반면 `scan-korean-expressions.mjs`라는 이름이 문단 검사까지 설명하지 못하고, literal 규칙과 paragraph 규칙의 서로 다른 속성이 한 배열에 섞인다. 요구사항 소유자는 이 문제를 확인한 뒤 세 파일 구성을 승인했다.

### 독립 실행 파일 두 개는 공통 처리를 복제한다

`scan-korean-expressions.mjs`와 별도 문단 명령을 각각 완결된 실행 파일로 만들면 각 결과 구조는 단순해진다. 그러나 두 파일이 명령행 인수, Git 변경 파일 수집, 엄격한 UTF-8, 개인 위치 제거, 입력과 출력 상한, 종료 상태 및 자체 검사 실행 코드를 되풀이한다. `--changed`를 두 번 실행하는 사이에 원문이 바뀌면 두 결과가 같은 source를 검사했다고 단정할 수도 없다.

### 실행 진입점 하나와 탐지 모듈 두 개를 권장한다

권장안은 진입점이 source를 한 번 만들고 두 탐지 모듈에 같은 값을 전달하는 방식이다. 표현 모듈은 literal 규칙과 위치 탐색만 내보내고, 문단 모듈은 문단 정책과 문장 수 탐색만 내보낸다. 두 모듈은 파일, Git, 표준 입출력과 `process.exitCode`를 직접 다루지 않는다.

```text
use-words-review/
├── SKILL.md
├── references/
│   ├── examples.md
│   └── korean.md
└── scripts/
    ├── scan.mjs
    ├── korean-expressions.mjs
    └── long-paragraphs.mjs
```

```text
입력 mode 해석 및 source 읽기
    ↓
동일한 Source 배열
    ├── literal 표현 탐지
    └── Markdown 문단 탐지
    ↓
검사별 결과 조립, 검사별 상한 적용 및 JSON 한 건 출력
```

이 구조는 개별 규칙 또는 탐지기가 source를 받고 공통 실행기가 결과를 모으는 기존 린터 구조와도 맞는다.

- [textlint 규칙 작성 문서](https://textlint.org/docs/rule/)는 한 규칙이 `Str`, `Paragraph`와 같은 서로 다른 AST node에 반응하고 공통 context로 결과를 보고하는 형식을 설명한다. 2026년 8월 7일에 확인했다.
- [ESLint plugin 문서](https://eslint.org/docs/latest/extend/plugins)는 plugin이 서로 다른 rule 구현을 `rules` map으로 내보내고 공통 실행기가 선택한 규칙을 호출하는 구조를 설명한다. 2026년 8월 7일에 확인했다.
- [Vale styles 문서](https://vale.sh/docs/styles)는 목적별 YAML rule 파일을 style 아래에 두고 Vale가 함께 실행하는 구성을 설명한다. 2026년 8월 7일에 확인했다.

### `.mjs`는 다른 `.mjs`를 가져올 수 있다

Node.js는 `.mjs` 파일을 가까운 `package.json`의 `type` 값과 관계없이 ES module로 읽는다. 진입점은 정적 `import`로 두 탐지 모듈의 named export를 가져올 수 있으며, 상대 import에는 파일 확장자를 생략하지 않는다. 상대 위치는 터미널의 현재 디렉터리가 아니라 import하는 모듈 URL을 기준으로 해석되므로 세 파일의 배치만 유지하면 스킬 설치 위치가 달라도 같은 모듈을 읽는다.

- [Node.js package 문서](https://nodejs.org/api/packages.html#packagejson-and-file-extensions)는 `.mjs`가 항상 ES module로 해석되는 조건을 설명한다. 2026년 8월 7일에 확인했다.
- [Node.js 22 ESM 문서](https://nodejs.org/docs/latest-v22.x/api/esm.html#mandatory-file-extensions)는 상대 import에 전체 파일명과 확장자가 필요하다고 설명한다. 2026년 8월 7일에 확인했다.
- [JavaScript `import` 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)는 다른 module이 내보낸 binding을 정적 import로 가져오는 언어 동작을 설명한다. 2026년 8월 7일에 확인했다.

내부 모듈은 exported function과 상수만 선언하고 최상위 입출력을 수행하지 않는다. 진입점만 `main()`을 호출하므로 내부 모듈에 직접 실행 여부를 판별할 조건도 필요하지 않다. `import.meta.main`은 Node.js 22.18.0에 추가됐으므로 현재 최저 버전인 22.0.0을 유지하는 동안 이를 진입점 판별에 사용하지 않는다. [Node.js `import.meta.main`](https://nodejs.org/api/esm.html#importmetamain)을 확인했다.

Agent Skills는 `scripts/`에 여러 실행 자료를 둘 수 있고 스킬 루트 기준의 상대 위치로 참조하도록 정한다. 세 파일은 별도 npm package가 아니라 한 스킬에 함께 배치할 내부 자료이므로 `package.json`, lock 파일, bundle과 외부 package가 필요하지 않다. 진입점만 복사하면 import가 실패하므로 설치 및 검증은 세 파일을 하나의 배포 단위로 취급해야 한다.

- [Agent Skills 명세](https://agentskills.io/specification)는 `scripts/`와 다른 추가 파일을 스킬 디렉터리에 둘 수 있게 한다. 2026년 8월 7일에 확인했다.
- [Agent Skills의 스크립트 안내](https://agentskills.io/skill-creation/using-scripts)는 여러 스크립트를 `SKILL.md`에서 상대 위치로 가리키고 구조화된 출력을 사용하도록 안내한다. 2026년 8월 7일에 확인했다.

### 모든 파일을 `.mjs`로 통일한다

파일명은 역할을 찾을 수 있을 만큼 설명적이되 스킬 경로가 이미 제공하는 말을 되풀이하지 않는 편이 낫다. 다음 세 선택지를 검토했다.

#### 긴 이름을 유지한다

`scan-korean-writing.mjs`, `korean-expression-scanner.mjs`, `korean-paragraph-scanner.mjs`는 각 파일만 보아도 역할을 알 수 있다. 그러나 세 파일이 같은 `use-words-review/scripts/`에 있고 진입점과 내부 모듈을 코드에서도 확인할 수 있으므로 `korean`, `scanner`와 `writing`이 일부 중복된다.

#### 진입점만 줄인다

`scan.mjs`와 `korean-expressions.mjs`는 실행 명령과 표현 검사 책임을 짧게 드러낸다. `korean-paragraphs.mjs`도 문법적으로 가능하지만 한국어 문단 전체를 처리하는 것처럼 보인다. 실제 책임은 길이 기준에 해당하는 Markdown 플레인 텍스트 문단 탐지이므로 `long-paragraphs.mjs`가 더 정확하다. 다른 스킬에도 `scan.mjs`가 있을 수 있지만 실행할 때에는 항상 스킬 루트를 기준으로 위치를 해석하므로 충돌하지 않는다.

#### 모든 이름을 가장 짧게 만든다

`scan.mjs`, `expressions.mjs`, `paragraphs.mjs`는 중복 단어가 가장 적다. 반면 오류 stack이나 파일 검색 결과만 보았을 때 두 내부 모듈이 한국어 규칙을 맡는다는 정보를 잃는다. 이후 언어별 탐지기가 생기면 같은 이름을 유지하기도 어렵다.

`.js`와 `.mjs`를 섞는 안은 채택하지 않는다. 스킬 배포본에는 module type을 정할 `package.json`이 없고 Node.js 22.0.0부터 같은 해석을 유지해야 한다. 세 파일을 `.mjs`로 통일하면 `type` 탐색이나 최신 Node.js의 모호한 `.js` syntax 판별에 의존하지 않는다.

### 결과는 한 JSON 안에서 검사별로 구분한다

진입점은 `sources`를 한 번만 제공하고 표현과 문단 결과를 `checks` 배열에서 구분한다. 배열 순서는 표현 검사와 긴 문단 검사로 고정한다. 각 결과는 실제로 순회한 규칙 또는 정책을 담은 `catalog`, 발견된 규칙 자료인 `rules`, 상세 경고와 독립된 집계를 제공한다.

```json
{
  "sources": [],
  "checks": [
    {
      "id": "expressions",
      "catalog": [],
      "rules": [],
      "warnings": [],
      "summary": { "total": 0, "shown": 0, "omitted": 0 }
    },
    {
      "id": "paragraphs",
      "catalog": [],
      "rules": [],
      "warnings": [],
      "summary": { "total": 0, "shown": 0, "omitted": 0 }
    }
  ]
}
```

source 상한은 진입점이 한 번 적용한다. 각 검사는 모든 후보를 끝까지 세고 상세 경고를 최대 20,000개까지 제공한다. `id`, `catalog`, `rules`, `warnings`와 `summary`를 합친 검사 결과의 직렬화 크기는 각각 32 MiB를 넘지 않는다. 한도에 닿으면 해당 검사의 결정적 순서 앞부분만 남기고 `summary.total`, `summary.shown`과 `summary.omitted`를 정확히 계산한다.

### 승인된 구성을 구현 기준으로 사용한다

요구사항 소유자는 실행 진입점 하나와 탐지 모듈 두 개를 같은 배포 단위로 두고, `scan.mjs`, `korean-expressions.mjs`와 `long-paragraphs.mjs`를 사용하며, 검사별 경고 수와 byte 상한을 적용하는 방안을 승인했다. 구현은 [요구사항](../requirements.md)과 [결정 기록](../decisions/scanner-modules-and-output-limits.md)을 함께 기준으로 삼는다.

## import, 의존 기능 전달과 모듈 책임 조사

승인된 세 파일 구성에서 진입점은 두 탐지 모듈을 정적으로 가져오고, 의존 기능 전달은 source를 제공하는 I/O 접점에만 사용한다. 탐지 모듈은 각각 표현 규칙과 문단 정책을 내부에서 관리하며 같은 source 값을 받는다. 현재 구성에는 공용 파일을 추가하지 않는다. 두 탐지기에서 입력, 반환 의미와 변경 이유가 모두 같은 계산이 실제로 중복돼 추가 파일이 필요해지면 설계 결정과 import 제한을 먼저 다시 검토한다. 적용 코드와 오류 사례는 [Node.js MJS 명령줄 검사기](../../../dev/node/mjs-cli.md#고정된-두-탐지-모듈을-정적으로-가져온다)에 기록했다.

### 고정된 두 탐지기에는 정적 import가 맞다

정적 import는 module graph를 연결하면서 요청한 module과 named export를 확인한다. 동적 import는 표현식을 실행할 때 specifier를 평가하고 Promise를 반환한다. 사용자가 탐지기를 선택하지 않고 모든 내장 검사를 항상 실행해야 하므로 실행 중 선택, 지연 적재와 선택 설치가 필요한 상황이 아니다. 따라서 `scan.mjs`가 `./korean-expressions.mjs`와 `./long-paragraphs.mjs`를 정적으로 가져오는 구성이 요구사항과 오류 시점을 모두 명확하게 한다.

- [ECMAScript module 명세](https://tc39.es/ecma262/2026/multipage/ecmascript-language-scripts-and-modules.html)는 import entry를 module graph의 연결과 binding 초기화에 사용한다. 2026년 8월 7일에 확인했다.
- [ECMAScript import call 명세](https://tc39.es/ecma262/2025/multipage/ecmascript-language-expressions.html#sec-import-calls)는 동적 import가 실행 시점에 specifier를 평가하고 Promise로 완료된다고 정의한다. 2026년 8월 7일에 확인했다.
- [Node.js 22 ESM 문서](https://nodejs.org/download/release/v22.18.0/docs/api/esm.html)는 ES module의 정적 import와 동적 import를 지원하며 상대 specifier에 확장자를 요구한다. 2026년 8월 7일에 확인했다.

동적 import를 금지하는 이유는 문법 자체가 나빠서가 아니다. 사용자 선택 plugin, 선택 설치 module 또는 실제로 실행하지 않을 큰 기능처럼 module을 실행 중에 정해야 하는 요구가 생기면 다시 검토할 수 있다. 현재 검사기는 이 조건이 없으며 동적 import가 규칙 선택 입력과 추가 비동기 실패만 만든다.

### 의존 기능은 I/O 접점에만 좁게 전달한다

현재 구현의 `scanSources({ provideSources })`는 Git, 파일 또는 stdin에서 source를 만드는 부수 효과를 함수 하나로 전달한다. 이 경계는 self-test가 실제 파일을 만들지 않고도 같은 탐색을 실행하게 하며, 계산 함수에는 source 값만 보낸다. 모듈 분리 뒤에도 두 탐지 함수를 다시 주입하지 않고 정적으로 가져와 호출한다. 탐지기를 주입하면 테스트나 호출자가 내장 검사를 빼거나 다른 구현으로 바꿀 수 있어 모든 규칙을 실행한다는 조건을 약화한다.

module 전체를 바꾸는 test double도 필요하지 않다. Node.js의 module mock은 22.3.0에 추가되어 최저 지원 버전인 22.0.0부터 22.2.x까지 사용할 수 없고, 22.18.0에서도 `--experimental-test-module-mocks` flag가 필요하다. 현재 self-test는 별도 test runner 없이 실행한다. source 제공 함수 하나를 전달하고 순수 탐지 함수에 값을 직접 넣는 현재 방식이 실행 환경과 배포 파일을 늘리지 않는다. [Node.js 22 test runner의 module mock 문서](https://nodejs.org/download/release/v22.18.0/docs/api/test.html#mockmodulespecifier-options)를 확인했다.

textlint와 ESLint도 개별 규칙에 실행기 전체를 주지 않고 source 조회, 보고와 AST 방문에 필요한 context를 전달한다. 이 사례는 이 검사기에 framework나 공용 container를 도입하라는 근거가 아니라, 함수가 실제로 쓰는 기능만 보이게 전달하는 설계의 대조 자료다.

- [textlint 규칙 문서](https://textlint.org/docs/rule/)는 규칙이 `getSource`, `report`와 syntax 정보를 가진 context를 받는 구조를 설명한다. 2026년 8월 7일에 확인했다.
- [ESLint custom rule 문서](https://eslint.org/docs/latest/extend/custom-rules)는 규칙의 `create(context)`가 AST visitor를 반환하는 구조를 설명한다. 2026년 8월 7일에 확인했다.

### 파일은 실행 조정, 표현 탐지와 문단 탐지로만 나눈다

`scan.mjs`는 CLI, 입력, 전체 실행, 표준 오류 메시지, JSON과 stream을 맡는다. `korean-expressions.mjs`는 외부에 공개하지 않는 `rules` 상수와 literal 탐색을 맡고, `long-paragraphs.mjs`는 Markdown 문단 및 문장 수 탐색을 맡는다. 탐지 모듈은 process, 파일, Git과 표준 stream을 읽지 않는다. 이 방향은 실행기가 rule과 processor를 조립하고 각 module이 자기 탐색을 맡는 textlint와 ESLint의 구조에서도 확인된다. [ESLint plugin 문서](https://eslint.org/docs/latest/extend/plugins)와 [textlint 15.8.0 kernel task 소스](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/kernel/src/task/linter-task.ts)를 확인했다.

현재 배포 단위에는 `common.mjs`, `utils.mjs`, barrel `index.mjs`와 leaf module을 추가하지 않는다. 한 탐지기에만 필요한 계산은 해당 파일의 비공개 함수로 둔다. 두 탐지기에서 입력, 반환 의미와 변경 이유가 모두 같은 계산을 실제로 공유해야 하는 상황이 생기면 설계 결정과 import 제한을 먼저 다시 검토한다. Agent Skills가 여러 스크립트를 상대 위치로 배치할 수 있다는 사실만으로 파일을 추가하지 않는다. [Agent Skills의 스크립트 안내](https://agentskills.io/skill-creation/using-scripts)를 확인했다.

### ESLint 설정은 진입점의 두 정적 import만 허용한다

`eslint.config.mjs`는 공통 설정에서 허용한 Node.js built-in 이외의 정적 import와 모든 `ImportExpression`을 거부한다. `scan.mjs`의 정확한 위치에만 뒤쪽 설정을 적용해 `./korean-expressions.mjs`와 `./long-paragraphs.mjs`의 정적 import를 추가로 허용한다.

진입점의 두 정적 import는 상태 `0`으로 통과하고, 같은 import를 다른 스크립트에서 사용하거나 진입점에서 승인되지 않은 로컬 위치, 외부 package 또는 동적 import를 사용하면 상태 `1`로 끝나야 한다. `no-restricted-imports`는 동적 import에 적용되지 않으므로 `ImportExpression` 제한도 유지한다. [ESLint `no-restricted-imports` 문서](https://eslint.org/docs/latest/rules/no-restricted-imports)와 [`no-restricted-syntax` 문서](https://eslint.org/docs/latest/rules/no-restricted-syntax)를 대조했다.

### 연속 두 관점에서 새 정보가 없어 조사를 끝냈다

첫째, ECMAScript와 Node.js 실행 관점에서 정적 연결과 동적 import의 비동기 실패 차이를 확인했다. 둘째, 현재 ESLint와 Node.js test runner 관점에서 로컬 import 제한과 실험적인 module mock 조건을 새로 확인했다. 셋째, textlint와 ESLint 규칙 실행 관점에서 필요한 context만 규칙에 전달하는 구조를 확인했다.

넷째, Agent Skills 배포 관점은 여러 script를 상대 위치로 둘 수 있다는 기존 결론을 확인했지만 import 선택, 의존 기능 전달과 책임 분리에 새 제약을 추가하지 않았다. 다섯째, 현재 검사기와 기존 개발 지침을 다시 대조한 관점도 `provideSources` 함수만 전달하고, 공용 파일이 필요해지면 설계 결정과 import 제한을 먼저 다시 검토해야 한다는 결론을 바꾸지 않았다. 서로 다른 관점에서 새 설계 정보가 없는 상황이 두 번 연속 발생했으므로 조사를 종료했다.

## 긴 문단은 비차단 검토 후보로 알린다

길이 검사는 문단의 의미 오류를 판정하지 못하지만 검토할 위치를 찾는 첫 단계로 사용할 수 있다. 검사기는 기준을 넘은 문단마다 경고를 만들고 정상 종료하며, AI가 전체 문단을 읽어 중심 내용과 문장 사이의 관계를 판정한다. 경고 자체를 `needs revision`으로 바꾸거나 문단을 자동 분리하지 않는다.

- **자연어 검사 도구는 경고와 실행 실패를 구분한다.** textlint는 `warning`과 `info`를 종료 상태 `0`으로 처리하고, Vale는 `suggestion`, `warning`, `error`를 나누며 오류만 비정상 종료의 원인이 된다. ESLint도 오탐 가능성이 있어 수동 검토가 필요한 규칙에는 종료 상태에 영향을 주지 않는 `warn`을 사용하라고 설명한다.
  - [textlint의 규칙별 severity](https://textlint.org/docs/configuring/#severity-config-of-rules)는 경고가 결과를 보고하되 실행을 실패시키지 않는 동작을 설명한다. 2026년 8월 7일에 확인했다.
  - [Vale 규칙 구조](https://vale.sh/docs/styles)는 규칙의 기본 수준을 `suggestion`으로 두고 세 수준을 구분한다. 2026년 8월 7일에 확인했다.
  - [ESLint 규칙 severity](https://eslint.org/docs/latest/use/configure/rules)는 불확실하거나 수동 검토가 필요한 진단에 `warn`을 사용하는 이유를 직접 설명한다. 2026년 8월 7일에 확인했다.
- **탐지와 판정은 서로 다른 상태다.** SARIF의 `kind: review`는 사람이 결과의 적합성을 판정해야 하는 상태이며, 심각도를 나타내는 `level`과 구분된다. 현재 검사기는 모든 `warnings`를 검토 후보로 정의하므로 SARIF 필드나 같은 뜻의 `severity`, `kind`, `requiresReview`를 경고마다 반복하지 않는다.
  - [SARIF 2.1.0 Plus Errata 01의 result kind](https://docs.oasis-open.org/sarif/sarif/v2.1.0/os/sarif-v2.1.0-os.html#_Toc34317699)는 `review`와 `fail`을 별도 값으로 정의한다. 2023년 8월 28일 정오표를 2026년 8월 7일에 확인했다.

### 일곱 문장은 초기 경고 기준이다

긴 문단의 첫 경고 기준은 한 문단에 일곱 문장 이상으로 정한다. Google은 다섯 문장이나 여섯 문장을 넘으면 너무 많은 정보를 담았는지 확인하라고 안내하고, 호주 정부는 보고서와 같은 장문에서 보통 여섯 문장까지를 제시한다. 따라서 일곱 번째 문장은 검사 대상인 모든 Markdown 산문 문단에서 의미 검토를 시작할 보수적인 지점이며 합격선이 아니다. 한 가지 생각을 설명하고 관계가 분명하면 경고가 발생해도 `pass`다.

- [Google 문단 구성](https://developers.google.com/style/paragraph-structure)은 다섯 문장이나 여섯 문장을 넘는 문단을 검토 신호로 보면서도 한 가지 생각을 설명한다면 더 길 수 있다고 명시한다. 2024년 10월 15일 갱신본을 2026년 8월 7일에 확인했다.
- [호주 정부 문단 지침](https://www.stylemanual.gov.au/structuring-content/paragraphs)은 문서 유형별 길이를 구분하고 장문 보고서에는 보통 여섯 문장까지를 제시한다. 2025년 4월 1일 갱신본을 2026년 8월 7일에 확인했다.
- [캐나다 정부 콘텐츠 지침](https://design.canada.ca/style-guide/)은 가독성 도구가 긴 문장처럼 고칠 후보를 찾는 첫 단계에는 유용하지만 독자의 실제 이해 여부를 판정할 수 없다고 설명한다. 2026년 3월 9일 갱신본을 2026년 8월 7일에 확인했다.
- [W3C G153](https://www.w3.org/WAI/WCAG22/Techniques/general/G153)은 한 문단에서 하나의 주제나 하위 주제를 전개하고 문단 사이의 논리 관계를 밝히도록 안내한다. 2026년 8월 7일에 확인했다.

영어 단어 수를 한국어 글자 수로 바꿀 공식 근거는 찾지 못했다. Digital.gov의 150단어 권고, Vale Microsoft 스타일의 문장당 30단어와 textlint 일본어 규칙의 100자는 각각 다른 언어와 문서 환경에서 정한 값이다. 첫 구현은 한국어 글자 수나 단어 수를 함께 적용하지 않는다. 한 문장에 여러 생각을 압축한 사례는 이 문단 경고가 아니라 `korean.md`의 문장 의미 검토가 계속 찾는다.

문장 수는 Node.js 22가 제공하는 `Intl.Segmenter("ko", { granularity: "sentence" })`로 센다. 별도 자연어 처리 package를 추가하지 않고 한국어 locale을 명시할 수 있다. 실행 환경의 국제화 자료에 따라 약어, 인용문과 코드가 나뉘는 방식이 달라질 수 있으므로 여섯 문장과 일곱 문장의 대표 한국어 사례를 macOS의 승인된 Node 버전에서 고정해 검증한다. [ECMAScript Internationalization API의 Segmenter 명세](https://tc39.es/ecma402/#segmenter-objects)는 `sentence` 단위 분리를 표준 기능으로 정의한다. 2026년 8월 7일에 확인했다.

### Markdown의 플레인 텍스트 문단만 센다

물리적인 줄 길이는 문단 길이가 아니다. 같은 문단은 여러 줄로 쓸 수 있고 단순 줄바꿈으로 나누어도 Markdown에서는 하나의 문단으로 해석된다. 반면 제목, 목록, 표, 인용문, HTML과 코드는 문장부호가 있어도 플레인 텍스트 문단이 아니다.

- [CommonMark 문단 명세](https://spec.commonmark.org/current/#paragraphs)는 다른 블록으로 해석되지 않는 연속된 비어 있지 않은 줄을 문단으로 정의한다. 현재 명세를 2026년 8월 7일에 확인했다.
- [textlint의 TxtAST](https://textlint.org/docs/txtnode/)는 parser가 `Paragraph` node와 위치를 제공해 규칙이 문단 범위에 작동하는 선례를 보여 준다. 2026년 8월 7일에 확인했다.
- [Vale scope](https://vale.sh/docs/scopes)는 `paragraph`, `sentence`, `heading`과 `table.cell`을 별도 범위로 구분한다. 2026년 8월 7일에 확인했다.

외부 parser를 넣지 않는 현재 배포 조건에서는 CommonMark 전체를 재구현하지 않는다. 빈 줄과 Markdown block marker 및 fence 상태로 최상위 플레인 텍스트 문단을 구분한다. 중첩된 목록이나 인용문 안의 문단처럼 완전한 parser가 필요한 구조는 자동 경고의 대상에서 제외하고 AI 의미 검토에 남긴다. 이는 모든 CommonMark 문단을 찾았다는 주장이 아니라, 외부 의존성 없이 재현 가능한 산문 후보 범위다.

### 조사 루프는 새 설계 정보가 없는 두 관점에서 끝냈다

조사는 관점을 바꿔 여섯 차례 진행했다.

1. 공공언어와 기술문서 관점에서 길이가 검토 신호이고 중심 내용이 최종 판정 기준임을 확인했다.
2. textlint, Vale, markdownlint와 ESLint 관점에서 비차단 경고, 조정 가능한 기준과 구조별 제외를 확인했다.
3. CommonMark와 자연어 parser 관점에서 물리적 줄이 아니라 문단 block을 식별해야 함을 확인했다.
4. 한국어 및 다국어 관점에서 글자 수 합격선을 뒷받침할 공식 근거가 없음을 확인하고 장문 문서의 문장 수 기준을 선택했다.
5. 진단 교환 관점에서 SARIF의 review 상태와 다른 도구의 severity를 다시 비교했지만, 현재 `warnings`와 종료 상태 `0`을 나눠 둔 설계에 추가할 정보는 나오지 않았다.
6. 린터 운영 관점에서 confidence, 자동 수정과 오류 승격 사례를 추가로 확인했지만, 비차단 경고 뒤 의미 검토라는 결론을 바꿀 정보는 나오지 않았다.

서로 다른 두 관점에서 새 설계 정보가 연속해서 나오지 않아 조사를 종료했다. 새 기준은 [요구사항의 긴 문단 경고](../requirements.md#목표), [대표 평가 사례](./korean-review-evaluation-cases.md)와 [계획의 긴 문단 작업](../plan.md#12-긴-문단을-경고하고-의미-단위별-분리-여부를-판정한다)에 반영한다.

## 규칙 schema

표현 규칙과 긴 문단 정책은 각 탐지 모듈의 상수로 둔다. 별도 JSON이나 YAML을 읽으면 설치 산출물, loader, schema 버전과 파일 누락 검사가 늘어난다. 현재 규칙을 독립적으로 편집하거나 여러 실행기가 공유해야 한다는 요구는 없다.

```js
// korean-expressions.mjs
const rules = [
  {
    id: "ko.boundary",
    kind: "literal",
    expressions: ["경계"],
    message:
      "이 표현이 실제 구분 기준이나 책임이 바뀌는 지점을 뜻하는지 확인합니다.",
    queries: [
      "무엇과 무엇을 나누는지 문장에서 알 수 있습니까?",
      "정확한 분야 용어라면 그대로 유지할 근거가 있습니까?",
    ],
    negatives: ["조사와 구현의 경계를 정리합니다."],
    positives: ["두 시스템의 보안 경계에서 요청을 다시 인증합니다."],
  },
];

// long-paragraphs.mjs
const policy = {
  id: "ko.long-paragraph",
  kind: "paragraph",
  min: 7,
  message: "이 문단에 서로 다른 중심 내용이나 후속 행동이 섞였는지 확인합니다.",
  queries: ["모든 문장이 하나의 중심 내용을 설명합니까?"],
  negatives: ["서로 독립된 확인 사항 세 가지를 한 문단에서 설명합니다."],
  positives: ["일곱 문장이 하나의 변환 절차를 순서대로 설명합니다."],
};
```

예시는 자료 모양만 보여 주며 표현, 문장과 `id`의 승인을 대신하지 않는다. 각 필드는 다음 책임을 가진다.

- `id`는 출력의 경고와 규칙 자료를 연결하는 안정된 식별자다.
- `kind`는 표현 규칙의 literal 출현과 긴 문단 정책을 구분한다. 현재 허용값은 `literal`과 `paragraph`뿐이다.
- `expressions`는 `literal` 규칙이 원문에서 그대로 찾을 비어 있지 않은 문자열이다. 활용형이 달라져 공통 substring이 안전하지 않으면 승인된 형태를 각각 둔다.
- `min`은 `paragraph` 규칙이 경고를 시작할 최소 문장 수다. 첫 구현에서는 `7` 하나만 사용한다.
- `message`는 후보를 다시 봐야 하는 이유를 한 문장으로 설명한다. 자동 오류나 일괄 치환을 선언하지 않는다.
- `queries`는 현재 문맥에서 유지, 수정 또는 정보 요청을 판단하는 질문이다.
- `negatives`와 `positives`는 같은 표현이 잘못 쓰인 경우와 정확히 쓰인 경우를 함께 보여 준다.

`reference`, `severity`, `replacement`, 도움말 URL과 자동 수정 자료는 넣지 않는다. literal 후보와 긴 문단은 정상 용례일 수 있어 고정 치환값과 오류 등급이 없다. AI는 규칙 질문과 원문을 함께 읽어 `pass`, `needs revision`, `needs human input`을 판단한다.

진입점의 self-test는 표현 규칙과 긴 문단 정책을 검사한다. `id` 중복, 알 수 없는 `kind`, literal 규칙의 비어 있거나 공백뿐인 표현, 고립 surrogate, 같은 규칙 안의 중복 표현, 문단 정책의 유효하지 않은 `min`과 모든 필수 설명 및 사례의 빈 배열을 실패로 처리한다. 서로 다른 literal 규칙의 같은 표현은 원칙적으로 금지한다. 허용하면 한 출현이 어떤 판정 기준에 속하는지 중복 경고가 생기므로 실제 필요가 확인된 뒤 명시적인 정책을 추가한다.

초기 후보 목록은 현재 `korean.md`에서 literal로 찾을 수 있는 후보를 빠짐없이 포함한다. 일반 산문의 U+00B7, 번역체 형태, 문맥 확인 용어, 행동을 감추기 쉬운 표현, 정보를 더하지 않을 수 있는 표현과 지칭 대상을 확인해야 하는 표현이 대상이다. 정상 사례에 나온 제품명, 판정 상태, 영문 원어와 설명 문장을 자동으로 규칙으로 만들지 않는다. 후보가 없다는 결과는 문장 구조와 목록 밖 표현의 의미 검토가 끝났다는 뜻이 아니다.

`id`는 철자나 활용형이 아니라 하나의 의미 판정 기준을 나타낸다. 같은 판정 기준에 속하지만 글자가 달라지는 활용형은 그 규칙의 `expressions`에 명시한다. 예를 들어 `좁히`와 `좁혀`는 같은 규칙에 둘 수 있지만, 다른 단어에서도 흔히 나타나는 짧은 어간은 넣지 않고 실제 검토 가치가 확인된 형태만 둔다.

### 실행 대상은 내장 규칙 전체로 고정한다

정상 실행에서 검사할 literal 표현은 `korean-expressions.mjs`의 `rules`, 문단 길이 기준은 `long-paragraphs.mjs`의 `policy`가 결정한다. CLI와 스킬 호출자는 규칙 ID, 표현, 길이 기준, 일부 규칙을 고르는 filter 또는 외부 규칙 자료를 전달할 수 없다. 진입점은 같은 source로 두 탐지 모듈을 항상 호출한다. AI는 실행 대상을 고르지 않고, 스크립트가 보고한 각 후보의 원문과 규칙 자료를 읽어 유지할지, 고칠지 또는 추가 확인을 요청할지만 판단한다.

`catalog`도 호출자가 제공하지 않는다. 표현 검사는 `rules` 전체를 순회해 표현 검사 결과의 `catalog`를 만들고, 긴 문단 검사는 `policy`를 적용해 문단 검사 결과의 `catalog`를 만든다. 규칙 또는 정책의 검증과 순회를 마치지 못하면 정상 JSON을 출력하지 않고 실행 실패로 끝낸다. 따라서 각 `catalog`는 AI가 선택한 목록이 아니라 해당 검사가 사용한 내장 기준을 확인하는 자료다. 다만 내장 목록에 없는 표현과 길이 기준에 닿지 않은 의미 문제까지 찾았다는 증거는 아니므로 `korean.md`의 의미 검토를 계속 수행한다.

## 입력 schema와 함수 경계

### 공통 `Source`

모든 입력 어댑터는 다음 최소 값을 만든다.

```js
// 개념을 설명하기 위한 형식이며 구현 문법을 확정하지 않는다.
Source = {
  id: "docs/example.md",
  text: "검사할 원문",
  path: "docs/example.md", // 실제 파일이 있는 입력에서만 사용
}

SourceProvider = () => AsyncIterable<Source>
```

`id`는 출력에서 원문을 구분하는 값이다. `text`는 검사할 문자열이고, `path`는 Git 또는 파일 어댑터가 실제 파일을 확인할 때만 제공한다. 탐색 본체는 파일 시스템과 Git을 알지 않고 `Source`의 문자열만 검사한다.

```js
scanSources({ provideSources });
```

`provideSources`만 함수 인수로 넘긴다. `scanSources`는 `scan.mjs`가 정적으로 가져온 두 탐지 함수를 직접 호출하며 탐지 함수는 주입받지 않는다. class, DI framework, 공용 interface 파일, factory와 registry는 만들지 않는다. 어댑터가 세 개라는 사실만으로 확장 framework가 필요하지 않으며, source 제공 함수와 탐지 함수의 분리만으로 입력 방식과 검사 책임을 확인할 수 있다.

textlint에서 확인한 것처럼 입력 차이를 `Source` 뒤에 숨겨서는 안 된다. Git 어댑터는 변경 파일 선정과 저장소 상대 위치를, 파일 어댑터는 호출자가 정한 순서와 표시 위치를, 표준 입력 어댑터는 `source-name`과 byte 상한을 각각 책임진다. 공통 값은 탐색에 필요한 최소 부분뿐이다.

### 변경 파일 입력

```text
node <skill-root>/scripts/scan.mjs --changed <repo>
```

`--changed`의 저장소 위치는 절대 위치 또는 현재 디렉터리 기준 상대 위치로 받는다. 저장소 전체를 순회하지 않고, 지정한 Git 작업 트리에서 staged, unstaged와 untracked 상태로 보고된 파일을 합친다. 삭제되지 않은 일반 파일의 현재 작업 트리 내용을 한 번씩 검사한다. 변경 hunk만 검사하지 않고 선택된 파일의 현재 원문 전체를 검사한다. 파일에 새로 추가되지 않은 `경계`도 같은 파일의 문맥 검토 대상이기 때문이다. 변경 파일이 없으면 빈 `sources`와 `warnings`를 가진 정상 JSON을 출력한다.

`git diff` 하나로는 staged와 untracked 파일을 모두 얻을 수 없다. porcelain v1 `-z` 출력은 상태와 저장소 상대 경로를 NUL로 구분하므로 공백과 newline이 있는 경로를 줄 단위 parser 없이 처리할 수 있다. rename을 끄고 추가와 삭제로 받으면 두 경로 record 분기를 피할 수 있다. [Git status porcelain v1](https://git-scm.com/docs/git-status#_porcelain_format_version_1)과 [Git diff](https://git-scm.com/docs/git-diff)를 확인했다.

모든 Git 명령은 `--changed`로 받은 위치에서 shell 없이 실행한다. `git rev-parse --show-toplevel`이 반환한 루트를 파일 확인과 출력 ID에 같이 사용한다. 자식 프로세스 환경에서는 `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`처럼 `GIT_`로 시작하는 변수를 대소문자와 관계없이 제거해 다른 저장소나 index를 가리키지 못하게 한다. 경로는 NUL 구분 byte를 엄격한 UTF-8로 decode하고 저장소 루트 밖 실제 위치, symbolic link, submodule과 특수 파일은 읽지 않는다.

index와 작업 트리가 모두 바뀐 파일도 현재 작업 트리 내용을 검사한다. AI가 실제로 읽고 고칠 원문과 검사 결과를 맞추기 위해서다.

### 지정 파일 입력

```text
node <skill-root>/scripts/scan.mjs \
  --file docs/guide.md \
  --file docs/reference.md
```

`--file`은 한 번 이상 사용할 수 있고 전달 순서를 유지한다. 현재 디렉터리 안의 파일을 상대 위치로 전달하면 정규화한 상대 위치를 `sourceId`와 `path`에 사용한다. 절대 위치로 전달했거나 현재 디렉터리 밖에 있는 파일은 입력 순서에 따라 `file:1`, `file:2`를 `sourceId`로 사용하고 `path`를 출력하지 않는다. 같은 실제 파일을 두 번 넘기면 중복 경고를 만들지 않고 인수 오류로 끝낸다. 파일 mode에 별도 `--repo`나 source 이름 option을 추가하지 않는다.

각 파일은 같은 file handle에서 일반 파일 여부와 byte 크기를 확인하고 끝까지 읽는다. 존재 여부를 먼저 확인한 뒤 별도 읽기를 하면 두 동작 사이에 파일이 바뀔 수 있다. 읽기 실패를 빈 문자열로 바꾸거나 경로 문자열을 원문으로 검사하지 않는다.

### 문자열 입력

```text
printf '%s' '<review-text>' | \
  node <skill-root>/scripts/scan.mjs \
  --stdin --source-name draft.md
```

`--stdin`은 하나의 문자열 source를 만든다. `--source-name`은 실제 파일 위치가 아니라 결과에서 원문을 구분할 표시 이름이며 필수로 둔다. 입력을 여러 파일처럼 합치지 않으며 byte 상한을 넘으면 실패한다.

`--text <value>`는 두지 않는다. command shell, newline, 따옴표, NUL과 운영체제의 인수 길이 제한을 호출자가 별도로 처리해야 하기 때문이다. 프로그램에서 직접 호출할 요구가 생기면 CLI option을 늘리기보다 같은 파일의 순수 `scanText` 함수를 사용하거나 표준 입력을 연결한다.

### 배타적인 실행 mode

한 실행에서는 `--changed`, 하나 이상의 `--file`, `--stdin` 가운데 하나만 허용한다. mode가 없거나 둘 이상이면 파일을 읽기 전에 실패한다. `--source-name`은 `--stdin`에서만 허용한다. `--help`와 규칙 및 순수 탐색 self-test는 입력 mode와 함께 사용하지 않는다.

## 탐색과 위치 계산

후보는 정규식이 아니라 literal substring으로 찾는다. `경계`는 `경계`, `경계를`과 `보안경계` 안에서 모두 후보가 된다. JavaScript의 `\b`는 한글 조사에 맞는 단어 구분을 제공하지 않고, 사용자 정규식은 빈 일치, escaping과 과도한 실행 시간을 새로 처리하게 한다.

각 표현은 `indexOf`를 반복해 모든 출현을 찾는다. 다음 검색 위치는 일치 시작점에서 UTF-16 code unit 하나 뒤로 정해 겹치는 출현도 보존한다. 서로 다른 규칙이나 표현에서 같은 위치가 생기면 `ruleId`, `sourceId`, 시작과 끝 위치 및 실제 표현이 모두 같은 항목만 중복으로 본다. textlint처럼 `ruleId`를 제외한 message 중복 제거를 복사하면 서로 다른 판정 기준의 경고가 사라질 수 있다.

줄은 1부터 시작한다. `startUtf16`은 줄의 시작부터 일치 시작까지 UTF-16 code unit 수에 1을 더한 값이다. `endUtf16`은 일치 뒤 첫 열이다. LF, CRLF와 단독 CR은 줄바꿈 하나로 계산하되 원문 자체를 바꾸지 않는다. 이 단위는 Node 문자열 slice와 바로 맞고 보조평면 문자 앞에서도 결과를 다시 찾을 수 있다.

입력은 `TextDecoder("utf-8", { fatal: true })`로 decode한다. 잘못된 UTF-8을 대체 문자로 바꾸면 위치와 원문이 달라지므로 textlint와 Vale보다 의도적으로 엄격한 정책이다. 선두 BOM은 표시 문자에서 제외하고 NUL이 있으면 binary 입력으로 실패한다. 한 실행은 source 512개, 파일 하나 2 MiB와 전체 입력 32 MiB까지 받는다.

각 경고에는 일치한 줄을 중심으로 최대 480 UTF-16 code unit의 `quote`를 넣는다. AI가 파일을 다시 열 수 없는 표준 입력도 문맥을 판단할 수 있고, 파일 입력에서도 경고 위치를 직관적으로 확인할 수 있기 때문이다. 원문 전체나 제한 없는 주변 문단은 출력하지 않는다. 줄이 상한보다 길면 일치 부분을 보존하면서 앞뒤를 잘라 낸다.

## 표준 출력 JSON

### 결과 구조

정상 실행은 다음 구조의 JSON 객체 하나를 표준 출력에 쓴다.

```json
{
  "sources": [
    {
      "id": "docs/example.md",
      "path": "docs/example.md"
    }
  ],
  "checks": [
    {
      "id": "expressions",
      "catalog": [{ "id": "ko.boundary", "kind": "literal", "expressions": ["경계"] }],
      "rules": [{ "id": "ko.boundary", "kind": "literal" }],
      "warnings": [
        {
          "ruleId": "ko.boundary",
          "expression": "경계",
          "sourceId": "docs/example.md",
          "line": 3,
          "startUtf16": 9,
          "endUtf16": 11,
          "quote": "조사와 구현의 경계를 정리합니다."
        }
      ],
      "summary": { "total": 1, "shown": 1, "omitted": 0 }
    },
    {
      "id": "paragraphs",
      "catalog": [{ "id": "ko.long-paragraph", "kind": "paragraph", "min": 7 }],
      "rules": [{ "id": "ko.long-paragraph", "kind": "paragraph" }],
      "warnings": [
        {
          "ruleId": "ko.long-paragraph",
          "count": 7,
          "sourceId": "docs/example.md",
          "line": 8,
          "startUtf16": 1,
          "quote": "변환기는 입력 행을 검사합니다. 먼저 입력값이 비어 있는지 확인합니다."
        }
      ],
      "summary": { "total": 1, "shown": 1, "omitted": 0 }
    }
  ]
}
```

각 검사 결과의 `catalog`에는 해당 탐지 모듈이 실제로 순회한 규칙 또는 정책의 `id`, `kind`와 탐지 조건을 선언 순서대로 넣는다. literal 규칙은 `expressions`, paragraph 규칙은 `min`을 사용한다. 호출자나 AI가 이 배열을 입력하거나 일부 항목을 고를 수 없다. AI는 빈 `warnings`가 해당 검사를 실행한 결과인지 확인할 수 있다. `rules`에는 해당 검사에서 실제로 발견된 규칙의 설명, 질문과 사례만 한 번씩 넣어 결과 크기를 줄인다. 상세 경고가 생략된 출현에서만 발견된 규칙도 `rules`에 포함한다. `sources`에는 실제로 검사한 source를 후보가 없어도 모두 넣어 빈 `warnings`가 검사 누락을 뜻하지 않게 한다. 표준 입력 source에는 `path`를 넣지 않는다.

literal 경고는 지금처럼 `expression`과 같은 줄의 시작 및 끝 열을 제공한다. paragraph 경고는 `expression`과 `endUtf16` 대신 관찰한 문장 수인 `count`와 문단 첫 글자의 `line` 및 `startUtf16`을 제공한다. `quote`는 문단 앞부분을 현재 상한 안에서 보여 주며, AI는 검토 대상 파일이나 표준 입력 원문에서 문단 전체를 읽는다. 파일이나 입력 원문 없이 JSON만 전달하는 호출은 문단 의미 판정을 완료할 자료가 없으므로 지원하지 않는다.

각 `summary.total`은 해당 검사가 모든 source와 규칙 또는 정책을 끝까지 검사해 발견한 전체 출현 수다. `summary.shown`은 같은 검사 결과의 `warnings` 배열 길이이고 `summary.omitted`는 두 값의 차이다. `omitted`가 0보다 크면 `SKILL.md`는 AI 검토 결과 마지막에 검사 종류와 생략 수를 표시한다. `truncated`와 같은 계산 가능한 boolean 및 같은 내용을 되풀이하는 message 문자열은 JSON에 넣지 않는다.

`catalogs`는 사용하지 않는다. 검사별 결과는 하나의 `catalog`를 가지며, `rules`는 이 목록 전체를 반복하지 않고 경고가 생긴 규칙의 상세 자료만 담는다. 이 구분은 SARIF의 필드 구성을 복사한 것이 아니라 현재 출력의 중복을 줄이기 위한 자체 규약이다. SARIF는 도구 구성 요소의 전체 규칙을 `rules`에 두고 결과가 `ruleId`로 이를 참조한다. [SARIF 2.1.0의 `rules`와 `ruleId`](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)를 확인했다.

literal 경고의 위치는 `startUtf16`과 `endUtf16`으로 시작과 끝을 같은 방식으로 이름 붙인다. 두 값이 원문 전체 offset이 아니라 `line` 안의 열이라는 점과 1부터 시작하는 계산 방식은 앞 절의 규칙으로 고정한다. paragraph 경고는 문단 첫 글자의 `line`과 `startUtf16`만 사용한다. ESLint와 Language Server Protocol도 위치 범위를 `start`와 `end` 쌍으로 표현하지만, 현재 문단 경고 소비자는 전체 범위가 아니라 문단을 다시 찾을 시작 위치만 필요하다. [ESLint의 `loc`](https://eslint.org/docs/latest/extend/custom-rules#reporting-problems)와 [Language Server Protocol의 `Range`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.18/specification/#range)를 확인했다.

배열 순서는 같은 입력에서 같은 결과가 나오도록 고정한다. `checks`는 표현 검사와 긴 문단 검사 순서를 유지한다. `sources`는 Git이 반환한 위치를 byte 순서로 정렬하거나 `--file` 전달 순서와 표준 입력 한 건의 순서를 유지한다. 각 `warnings`는 source 순서, 시작 offset, 규칙 선언 순서와 literal 규칙의 표현 선언 순서로 정렬한다. `catalog`와 `rules`는 규칙 선언 순서대로 둔다. 정렬 방식은 자연어 locale이나 사용자 환경에 의존하지 않는다.

이 구조는 외부 표준이 아니라 현재 AI 소비자에게 필요한 최소 자료다. RFC 8259는 JSON 문법을 정하지만 후보 검사의 필드 의미는 정하지 않는다. [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)을 확인했다.

### 결과 파일을 기본 동작으로 만들지 않는다

정상 JSON은 표준 출력으로만 보낸다. 호출자가 보관할 이유가 있을 때 자신의 도구로 redirect할 수 있지만 스크립트는 출력 위치, 기존 파일 덮어쓰기와 정리 책임을 갖지 않는다. 반복 실행으로 임시 결과 파일이 쌓이지 않고, 스킬은 명령 결과를 바로 읽을 수 있다.

표현 검사와 긴 문단 검사의 `warnings`는 각각 최대 20,000개까지 담고, 직렬화한 각 검사 결과는 최대 32 MiB로 제한한다. 경고 수 상한에 닿기 전에 검사 결과의 byte 상한에 닿으면 해당 검사의 결정적 순서 앞부분만 남긴다. 상세 경고 보관을 멈춘 뒤에도 해당 검사는 모든 source와 규칙 또는 정책을 끝까지 확인해 `summary.total`과 `summary.omitted`를 정확히 계산한다. 입력이나 내부 오류로 전체 검사를 마치지 못하면 정상 JSON을 출력하지 않는다.

결과가 많다는 이유만으로 JSONL을 사용하지 않는다. JSONL은 record별 처리에는 유리하지만 전체 byte와 AI 입력 token을 줄이지 않으며, `catalog`, `rules`, `sources`와 마지막 집계 record의 순서 및 중간 실패 규약을 새로 만들어야 한다. 단일 JSON의 메모리 사용량이나 첫 출력 지연이 실제 실행에서 문제가 되거나, 검사가 끝나기 전에 record를 소비해야 할 때 다시 검토한다.

### 많은 결과를 처리하는 실제 사례

2026년 8월 6일에 각 공식 문서와 표시한 release 또는 commit의 소스를 확인했다. 전체 결과를 센 뒤 상세 표시만 줄이는 방식이 이번 검사기의 요구와 가장 가깝다. golangci-lint v2.12.2는 수집된 issue 전체를 순회하면서 상세 결과만 제한하고 숨긴 수와 전체 수를 계산한다. 이 숫자는 verbose log에만 기록되므로 현재 검사기는 같은 집계를 JSON의 `summary`에 직접 넣는다. [golangci-lint의 linter별 제한 구현](https://github.com/golangci/golangci-lint/blob/c0d3ddc9cf3faa61a4e378e879ece580256d76e5/pkg/result/processors/max_from_linter.go#L32-L49)을 확인했다.

reviewdog v0.21.0의 GitHub Check reporter는 summary 본문을 65,535 bytes로 제한하면서도 그룹 제목에는 전체 발견 수를 표시한다. 본문 한도에 닿으면 일부 결과가 빠졌다고 알리지만 정확한 생략 수는 별도 필드에 넣지 않는다. 현재 검사기는 소비자가 차이를 계산하게 두지 않고 `total`, `shown`과 `omitted`를 함께 제공한다. [reviewdog의 GitHub Check summary 구현](https://github.com/reviewdog/reviewdog/blob/df70ed74df59de7ebfd9276afabd62ea2de4d7dd/service/github/check.go#L340-L388)을 확인했다.

GitHub code scanning은 SARIF 실행에서 최대 25,000개를 처리하고 중요도 순 상위 5,000개를 저장해 표시한다. [GitHub의 SARIF 결과 제한](https://docs.github.com/code-security/code-scanning/troubleshooting-sarif-uploads/results-exceed-limit)을 확인했다.

SARIF 2.1.0 schema는 실행별 생략 수를 담는 표준 필드를 정하지 않는다. 현재 규칙에는 severity가 없으므로 상세 경고는 source 순서, 시작 offset, 규칙 선언 순서와 표현 선언 순서로 남긴다. [SARIF 2.1.0 schema](https://github.com/oasis-tcs/sarif-spec/blob/ed71d4f62db866ce3698a08a5ec3f7f2e775545d/sarif-2.1/schema/sarif-schema-2.1.0.json)를 확인했다.

ripgrep 15.2.0의 `--max-count`와 GCC 16.1의 `-fmax-errors`는 정한 수에 도달하면 검색 또는 source 처리를 중단한다. 실행 뒤에 남은 실제 결과 수를 알 수 없으므로 정확한 `omitted`가 필요한 현재 검사기에 적용하지 않는다.

- [ripgrep의 `--max-count`와 JSON 설명](https://github.com/BurntSushi/ripgrep/blob/e89fff89ac9af12e8d4ce9d5fd07beb408ca730f/crates/core/flags/defs.rs#L3872-L3920)은 선택된 결과 수에 도달한 뒤 파일 검색을 멈추는 동작을 확인하는 근거다.
- [GCC의 `-fmax-errors`](https://gcc.gnu.org/onlinedocs/gcc-16.1.0/gcc/Warning-Options.html#index-fmax-errors)는 정한 오류 수에 도달하면 source 처리를 중단하는 동작을 확인하는 근거다.

Vale v3.17.1의 규칙별 `Limit`는 초과 alert를 버리지만 전체 수나 생략 수를 유지하지 않는다. 초과 결과를 알리지 않는 동작은 모든 출현을 세어 AI에게 생략 사실을 알려야 하는 현재 요구와 맞지 않는다. [Vale의 alert 제한 구현](https://github.com/errata-ai/vale/blob/fe71481c95665a2343d81874489f8b012442a377/internal/core/file.go#L420-L437)을 확인했다.

여러 경고를 `throw new Error`로 하나씩 전달하지 않는다. 첫 예외에서 실행이 멈추고, stack trace와 자유 형식 문자열은 기계적으로 읽을 결과가 아니며, 후보와 실행 실패도 구분하지 못한다. 예외는 입력을 완전히 검사할 수 없는 경우에만 사용한다.

### 종료 상태와 오류

- **종료 상태 `0`.** JSON 객체를 온전히 출력했다. `warnings`가 비어 있거나 하나 이상인 경우 모두 포함한다.
- **종료 상태 `2`.** 인수, Git, 파일, 인코딩, 크기, 규칙 자료, 직렬화 또는 stdout 쓰기 때문에 실행을 완결하지 못했다.
- **signal 종료.** SIGINT와 SIGTERM에는 handler를 두지 않고 운영체제 종료 상태를 유지한다.

최상위 실행 함수는 예상한 실패를 `Error`로 올리고 진입점이 한 번 잡는다. 표준 오류에는 오류 종류와 사용자가 줄일 수 있는 입력만 적고 원문 전체, 개인 절대 위치와 stack trace를 넣지 않는다. `process.exitCode = 2`를 설정해 표준 오류가 쓰인 뒤 자연스럽게 종료한다. Node.js는 `process.exit()`가 비동기 표준 출력을 끝내기 전에 프로세스를 종료할 수 있다고 설명한다. [Node.js process 종료 문서](https://nodejs.org/api/process.html#processexitcode)를 확인했다.

stdout 쓰기 중 실패하면 일부 출력이 남을 수 있으므로 호출자는 종료 상태 `0`인 실행만 JSON으로 사용해야 한다. 첫 구현에서 임시 파일, atomic rename과 writer abstraction을 추가하지 않는다. 표준 출력의 원자성을 일반 파일과 pipe 모두에서 보장할 수 없으므로 종료 상태 확인이 가장 작은 공통 규약이다.

## 포함하지 않을 기능

다음 항목은 현재 결과를 만드는 데 필요하지 않다.

- 완전한 Markdown AST와 HTML 변환
- 정규식 사용자 규칙, glob과 디렉터리 순회
- 자동 수정, 고정 replacement와 suppression 주석
- 별도 규칙 JSON 또는 YAML과 loader
- class 기반 DI, formatter interface와 plugin system
- 결과 파일 생성, pagination과 JSON sequence
- RDJSON, SARIF, reviewdog reporter와 Pull Request comment
- pre-commit hook, CI, Codex hook와 MCP server
- Unicode normalization과 자동 대소문자 변환

SARIF는 결과, 규칙과 artifact를 표준 구조로 표현할 수 있지만 현재 소비자가 요구하지 않는다. 필수 최상위 요소가 적더라도 실제 위치와 규칙 설명을 표현하려면 wrapper와 호환 규칙이 늘어난다. GitHub code scanning, IDE 또는 SARIF viewer가 실제 소비자로 정해질 때 현재 JSON에서 변환하는 편이 작다. [OASIS SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)을 확인했다.

MCP는 실시간 자료, 인증, 권한과 외부 시스템 작업에 맞고, 이 검사는 스킬과 함께 배포한 로컬 파일을 같은 규칙으로 반복 처리한다. OpenAI 문서도 로컬 파일 처리에는 스크립트를, 외부 시스템 연결에는 MCP를 제안한다. 현재 기능에 MCP server를 두면 배포, 도구 입출력 형식과 연결 실패 처리가 추가될 뿐이다.

## 최소 검증

`scan.mjs`의 self-test는 두 탐지 모듈이 export한 실제 함수와 운영 조립 함수를 호출한다. Git 저장소와 파일 I/O 검증은 구현 작업에서 별도 명령으로 실행한다. 외부 test framework와 fixture 파일은 필요하지 않다.

### 규칙과 탐색

- 알 수 없는 `kind`, 빈 표현, 공백뿐인 표현, 고립 surrogate, 유효하지 않은 `min`과 중복 `id`를 거부한다.
- 문제 사례와 정상 사례 및 판정 질문이 비어 있으면 거부한다.
- 정상 실행 경로가 규칙 또는 표현 filter를 받지 않고 내장 `rules` 전체를 검사하는지 확인한다.
- 처음, 중간과 마지막 규칙에만 각각 일치하는 원문에서도 모든 규칙을 순회하고 모든 출현을 센다. 상세 경고 상한 안에서는 각 출현을 모두 남긴다.
- 같은 줄과 여러 줄의 반복 및 겹치는 출현을 모두 찾는다.
- `경계`, `경계를`과 `보안경계`의 substring 출현을 모두 찾는다.
- 같은 위치에서 규칙이 다른 경고를 임의로 합치지 않는다.
- literal 규칙은 code fence, inline code, link, image, HTML comment와 front matter 안의 출현도 남긴다.
- paragraph 규칙은 빈 줄이 아닌 단순 줄바꿈을 같은 문단으로 세고 일곱 문장째에 경고 하나를 만든다. 제목, 표, 목록, 인용문, HTML, front matter, fenced 및 들여쓴 코드에서는 문단 경고를 만들지 않는다.
- 여섯 문장과 일곱 문장의 경계, 여러 줄 문단, LF, CRLF와 단독 CR에서 문장 수와 문단 시작 위치가 같다.
- 일곱 문장인 단일 주제 문단과 여러 주제 문단은 똑같이 경고하고 의미 판정을 스크립트에 넣지 않는다.
- LF, CRLF, 단독 CR, BOM과 보조평면 문자 앞의 줄 및 UTF-16 열을 확인한다.
- `quote`를 잘라도 일치 표현과 위치를 유지한다.

### 입력 어댑터

- 세 입력 mode 가운데 정확히 하나만 허용한다.
- 동일한 원문을 `--file`과 `--stdin`으로 검사하면 source 식별 정보 외의 규칙과 경고가 같다.
- 반복한 `--file`의 순서를 유지하고 같은 정규화 위치의 중복 지정을 거부한다.
- `--changed`는 staged, unstaged와 untracked 파일을 한 번씩 읽고 삭제 파일과 submodule을 source로 만들지 않는다.
- `--changed`는 변경 hunk가 아니라 선정된 파일의 현재 원문 전체를 검사한다.
- 공백과 newline이 있는 경로, rename, 충돌, unborn branch와 Git 실행 실패를 처리한다.
- 잘못된 UTF-8, NUL, symbolic link, 루트 밖 실제 위치, 특수 파일, 파일별 및 전체 byte 상한을 실패로 처리한다.

### 출력과 실패

- 후보가 없어도 검사한 모든 source와 두 `checks`를 가진 RFC 8259 JSON을 출력하고 `0`으로 끝난다. 각 검사 결과는 실제로 순회한 규칙 또는 정책의 `catalog`, 빈 `rules`와 `warnings` 및 0인 `summary`를 가진다.
- 후보가 있으면 각 검사 결과에 실행한 전체 규칙 또는 정책의 `catalog`, 발견된 규칙의 metadata를 각각 한 번, 출력 한도 안의 상세 경고와 전체, 표시 및 생략 수를 담고 `0`으로 끝난다.
- 호출자가 `catalog`, 규칙 ID나 표현 목록을 입력하는 실행 방법이 없는지 확인한다.
- `sources`, `checks`, 각 `catalog`, `rules`와 `warnings`의 참조가 모두 연결되는지 확인한다.
- literal 경고에는 `expression`과 같은 줄의 시작 및 끝 열이 있고, paragraph 경고에는 `count`와 문단 시작 위치가 있으며 서로의 전용 필드를 섞지 않는지 확인한다.
- 표준 입력 source에는 실제 파일 `path`를 만들지 않는다.
- 상대 위치 파일은 정규화한 상대 위치를 출력하고, 절대 위치 또는 현재 디렉터리 밖의 파일은 순번 ID만 출력해 개인 절대 위치를 남기지 않는다.
- 한 검사의 경고가 20,000개를 넘거나 직렬화한 검사 결과가 32 MiB에 닿아도 해당 검사를 끝까지 수행하고, 결정적 순서의 상세 경고와 정확한 `summary`를 가진 온전한 JSON을 출력한다.
- `summary.shown`이 `warnings` 길이와 같고 `summary.omitted`가 `summary.total - summary.shown`과 같은지 확인한다.
- 입력 또는 내부 실패는 stdout에 정상 JSON을 남기지 않고 짧은 stderr와 `2`로 끝난다.
- 같은 입력을 네트워크가 없는 환경에서 실행해 같은 결과를 얻는다.

대표 평가에서는 스크립트가 정상 전문용어와 일곱 문장의 단일 주제 문단도 후보로 찾고 AI가 그대로 유지하는지, 문제 표현과 여러 주제를 담은 긴 문단은 질문과 사례를 근거로 고치는지, 길이 기준에 닿지 않은 의미 문제를 `korean.md`의 기준으로 계속 찾는지를 함께 확인한다.

## 현재 승인된 구현 기준

요구사항 소유자는 다음 내용을 승인했다.

- `skills/use-words-review/scripts/scan.mjs`, `korean-expressions.mjs`와 `long-paragraphs.mjs`를 같은 배포 단위로 만든다.
- literal 후보의 탐지 조건, 설명, 판정 질문과 대조 사례는 `korean-expressions.mjs`의 `rules`가 맡고, 긴 문단 후보의 기준과 사례는 `long-paragraphs.mjs`의 `policy`가 맡는다.
- `korean.md`는 literal 검색으로 찾을 수 없는 문장과 문단의 의미 검토 기준을 맡는다.
- 정상 실행은 외부 입력으로 검사를 고르지 않고 두 탐지 모듈을 항상 호출한다. 각 `catalog`는 해당 검사가 실제로 순회한 규칙 또는 정책에서 만든다.
- 긴 플레인 텍스트 문단은 오류가 아니라 의미 검토 후보로 경고하고 후보가 있어도 `0`으로 끝난다.
- 현재 `korean.md`에서 literal로 찾을 수 있는 모든 후보를 의미 단위 `id`와 명시적인 `expressions` 배열로 옮긴다.
- `--changed`는 staged, unstaged와 untracked 일반 파일의 현재 작업 트리 원문 전체를 검사하고 삭제 파일과 submodule을 제외한다.
- 저장소 안과 현재 디렉터리 안의 파일은 상대 위치로 식별한다. 절대 위치 또는 현재 디렉터리 밖의 파일은 순번 ID만 출력하며 `path`를 생략한다. 표준 입력은 `--source-name`을 사용한다.
- 한 실행의 입력 상한은 source 512개, 파일 하나 2 MiB와 전체 32 MiB다. 상세 경고와 직렬화 결과의 상한은 검사마다 20,000개와 32 MiB이며 `quote`는 480 UTF-16 code unit까지 제공한다.
- JSON은 공통 `sources`와 검사별 결과를 담은 `checks`를 사용한다. 각 검사 결과는 `id`, `catalog`, `rules`, `warnings`와 `summary`를 가진다. literal 위치는 1부터 시작하는 `line`과 `startUtf16`, 일치 뒤 첫 열인 `endUtf16`으로 나타내고 paragraph 위치는 문단 시작의 `line`과 `startUtf16`으로 나타낸다.
- 각 검사는 모든 출현을 끝까지 세되 상세 경고는 해당 검사의 개수와 byte 한도 안의 결정적 앞부분만 담는다. 각 `summary`는 `total`, `shown`과 `omitted`를 제공하고, AI는 생략된 경고가 있으면 검토 결과 마지막에 검사 종류와 생략 수를 표시한다.
- 현재 출력은 단일 JSON 객체를 유지한다. JSONL은 메모리나 첫 출력 지연 문제가 실제로 측정되거나 완료 전 record 소비자가 생겼을 때 다시 검토한다.
- 최저 버전은 Node.js 22.0.0과 Git 2.18.0이다. 현재 구현과 대표 실행은 macOS에서만 확인한다.

`scan.mjs`만 `./korean-expressions.mjs`와 `./long-paragraphs.mjs`를 정적 import한다. 다른 로컬 위치, 외부 package와 동적 import는 허용하지 않는다. ESLint 예외는 진입점의 정확한 위치에만 적용한다.

## 조사 한계

완성된 기존 도구가 없다는 판단은 2026년 8월 5일부터 8월 7일까지 확인한 공식 문서와 tag 소스에 한정된다. 조사한 도구의 전체 기능을 재현하는 목적이 아니므로 editor, CI와 Pull Request 연결 기능은 비교하지 않았다.

일곱 문장은 장문 기술 문서 지침에서 선택해 모든 검사 대상 Markdown 산문 문단에 적용하는 초기 경고값이며 한국어 문단의 품질 기준이 아니다. 중첩된 Markdown 문단과 한 문장에 여러 생각을 압축한 글은 자동 경고로 찾지 못하며 AI 의미 검토가 맡는다. 현재 구현과 제안 모두 표준 출력 결과를 한 번에 메모리에 직렬화하므로 승인된 출력 상한 안에서만 사용한다. 실제 결과가 반복해서 상한을 넘거나 다른 소비자가 생기면 측정 결과를 근거로 출력 방식과 변환기를 다시 검토해야 한다.
