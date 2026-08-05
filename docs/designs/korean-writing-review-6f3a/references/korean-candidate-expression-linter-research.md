# 한국어 후보 표현 검사기 소스 조사

## 결론

`use-words-review`의 후보 검사기는 textlint, Vale와 reviewdog를 실행 의존성으로 넣지 않고 Node.js 표준 기능만 사용하는 `.mjs` 한 파일로 구성하는 안이 가장 작다. 스크립트는 표현을 확정 오류로 판정하지 않고, 내장 규칙에 해당하는 모든 출현과 AI가 판단할 때 필요한 설명 및 대조 사례를 표준 출력의 JSON 객체로 제공한다. Markdown parser, 외부 규칙 파일, 결과 파일, formatter 추상화와 MCP는 현재 결과에 필요하지 않다.

규칙의 `reference` 필드는 제거하는 편이 맞다. 스킬은 사용자 홈, 저장소 내부, 관리 환경 또는 다른 호스트에 설치될 수 있다. 실행 결과를 이해할 때마다 별도 파일을 찾아 읽게 하면 설치 위치 해석과 추가 문맥 사용이 필요하다. literal로 찾을 규칙은 `id`, `expressions`, `message`, `queries`, `negatives`, `positives`를 스크립트 상수 하나에 둔다. 출력은 일치한 규칙의 설명과 사례를 규칙마다 한 번만 싣고, 출현별 위치와 원문 일부를 별도 배열에 둔다.

`reference` 제거와 `korean.md` 제거는 같은 결정이 아니다. `korean.md`에는 literal 검색으로 만들 수 없는 문장 판정 절차가 있다. 영어식 무생물 주어, 행동 주체가 빠진 피동문, 명사 나열, 지칭 대상 변화, 근거 없이 이어받은 표현과 반복되는 문단 구조는 내장 후보 목록만으로 전수 탐색할 수 없다. `korean.md`를 없애려면 이러한 의미 검토 기준을 `SKILL.md`의 짧은 필수 절차로 옮겨야 한다. 이 이동 없이 파일만 지우면 기존 검토 동작이 약해진다.

입력은 `--changed <repo>`, 반복 가능한 `--file <path>`, `--stdin --source-name <name>` 가운데 정확히 하나만 사용한다. 각 입력 어댑터가 `Source`를 만들고 같은 `scanSources` 함수가 원문을 검사한다. 이는 여러 구현을 위한 framework가 아니라 파일 선택과 문자열 탐색을 분리하는 한 파일 내부의 함수 경계다. 원문 문자열을 명령행 인수로 직접 받는 `--text`는 shell quoting과 인수 길이 문제 때문에 두지 않는다.

정상 결과는 표준 출력에 JSON 객체 하나로 쓴다. 후보가 있거나 없어도 종료 상태는 `0`이다. Git 실행, 인수, 파일 읽기, 인코딩, 크기 또는 직렬화가 실패하면 예외를 최상위에서 한 번 잡아 짧은 메시지를 표준 오류에 쓰고 종료 상태를 `2`로 정한다. 후보를 `throw new Error`로 전달하면 모든 출현을 모으지 못하고 실행 실패와 검토 대상을 구분할 수 없으므로 사용하지 않는다.

이 안은 [요구사항의 목표](../requirements.md#목표)에 있는 `korean.md` 유지 여부, 모든 후보 출현의 경고 방식과 스크립트 설계를 구체화한 제안이다. 현재 요구사항은 후속 구현에서 새 파일을 금지하므로, 요구사항 소유자가 스크립트 한 파일 추가와 한국어 자료의 책임 이동을 승인하기 전에는 구현할 수 없다.

## 조사 질문과 확인 범위

이번 조사는 다음 질문을 다뤘다.

- 기존 한국어 판정 자료 중 스크립트가 보관할 정보와 AI 절차로 남길 정보는 무엇인가.
- 스킬 설치 위치에 의존하지 않고 규칙 설명과 사례를 한 실행에서 전달할 수 있는가.
- Git 변경 파일, 지정 파일과 문자열을 같은 탐색 본체에 안전하게 전달할 수 있는가.
- 결과 파일을 만들지 않고 후보, 정상 사례와 실행 실패를 구분할 수 있는가.
- textlint 15.8.0, Vale 3.17.0과 reviewdog 0.21.0의 실제 구현에서 재사용할 구조와 피해야 할 동작은 무엇인가.

2026년 8월 5일에 공식 문서와 세 공식 저장소의 tag 소스를 함께 확인했다. textlint는 v15.8.0, Vale는 v3.17.0, reviewdog는 v0.21.0을 기준으로 삼았다. OpenAI와 Agent Skills의 공식 문서에서 현재 스킬 검색 위치와 `scripts/`, `references/`의 역할도 다시 대조했다.

## 기존 도구에서 가져올 구조

### textlint는 입력을 나누고 검사 본체를 공유한다

textlint의 CLI는 파일 입력과 `text` 및 `stdinFilename` 입력을 서로 다른 실행 자료로 구분한다. `lintFiles`는 glob, ignore와 확장자 판정을 거치고, `lintText`는 호출자가 준 문자열과 표시할 파일 위치를 바로 검사하지만 두 경로는 같은 kernel의 문자열 검사로 모인다. 이 구조는 입력별 선택 규칙을 숨기지 않으면서 원문 탐색을 한 함수에서 유지할 수 있다는 근거다. [textlint CLI 입력 분기](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/cli.ts)와 [createLinter 구현](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/createLinter.ts)을 확인했다.

textlint의 공개 규칙 형식에는 문제 사례, 정상 사례와 도움말 위치를 담는 공통 metadata가 없다. 규칙 module은 실행 함수와 option을 중심으로 정의되고 결과 message의 `data`도 의미가 정해지지 않은 값이다. 따라서 이 조사에서 제안하는 구조화된 사례는 textlint schema를 복사한 것이 아니라 현재 AI 소비자에 필요한 자체 규약이다. [TextlintRuleModule](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/types/src/Rule/TextlintRuleModule.ts)과 [TextlintResult](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/types/src/Message/TextlintResult.ts)가 실제 공개 형식을 보여 준다.

textlint JSON formatter는 결과 전체를 한 번에 직렬화한다. 파일 출력 option은 상위 디렉터리를 만들고 기존 파일을 덮어쓰며, 지정하지 않으면 같은 문자열을 표준 출력에 쓴다. 결과 파일은 textlint를 쓰기 위한 필수 구조가 아니다. [JSON formatter](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/linter-formatter/src/formatters/json.ts)와 [출력 처리](https://github.com/textlint/textlint/blob/v15.8.0/packages/textlint/src/cli-util.ts)를 확인했다.

### Vale는 명시적 입력 구분과 자체 규칙 형식의 필요성을 보여 준다

Vale는 여러 파일, 표준 입력과 문자열을 받을 수 있지만, 위치 인수 하나가 실제 파일이 아니면 그 인수 자체를 검사 문자열로 해석한다. 파일 이름 오타나 검사 중 사라진 파일을 원문으로 오인할 수 있으므로 이 자동 판별은 가져오지 않는다. `--changed`, `--file`, `--stdin`을 명시적으로 구분하면 입력 의도를 추정할 필요가 없다. [Vale CLI 입력 처리](https://github.com/vale-cli/vale/blob/v3.17.0/cmd/vale/main.go)가 이 분기를 보여 준다.

Vale 규칙은 `Message`, `Description`, `Link`와 `Action`을 제공하지만 구조화된 문제 사례와 정상 사례 필드는 없다. 정의에 없는 YAML 필드는 규칙 로드 오류가 된다. 여러 token에 서로 다른 설명과 사례를 연결하려면 규칙을 나누거나 문자열에 합쳐야 하므로 현재 필요한 자료 구조를 Vale YAML로 대신할 수 없다. [Vale Definition](https://github.com/vale-cli/vale/blob/v3.17.0/internal/check/definition.go)과 [existence 규칙](https://github.com/vale-cli/vale/blob/v3.17.0/internal/check/existence.go)을 확인했다.

Vale의 `scope: raw`도 원본 byte를 그대로 검사하지 않는다. markup parser 전의 내용을 쓰지만 CRLF 및 단독 CR과 일부 entity를 먼저 바꾼 문자열을 검사한다. 원문에서 찾은 위치를 AI에게 보여 줄 때 이 동작을 복사하면 열 위치가 달라질 수 있다. [입력 정리](https://github.com/vale-cli/vale/blob/v3.17.0/internal/core/util.go)와 [raw 검사 경로](https://github.com/vale-cli/vale/blob/v3.17.0/internal/lint/lint.go)를 확인했다.

Vale의 정상 JSON 결과는 표준 출력으로 가고 실행 오류는 표준 오류와 종료 상태 `2`로 분리된다. 이는 결과 파일 없이도 기계 자료와 실행 실패를 나눌 수 있다는 실제 사례다. 다만 Vale JSON은 경고가 없는 입력 파일과 실행한 규칙 전체를 보존하지 않으므로 현재 schema를 그대로 쓰지는 않는다. [Vale JSON 출력](https://github.com/vale-cli/vale/blob/v3.17.0/cmd/vale/json.go)과 [오류 출력](https://github.com/vale-cli/vale/blob/v3.17.0/cmd/vale/error.go)을 확인했다.

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
│   └── examples.md
└── scripts/
    └── <candidate-scanner>.mjs
```

이 구조는 `korean.md` 제거안이 승인됐을 때의 목표 모습이다. 정확한 스크립트 이름과 `korean.md` 제거는 아직 결정되지 않았다. `package.json`, lock 파일, `node_modules`, `assets/`, `agents/openai.yaml`과 설정 파일은 표준 기능만 쓰는 한 파일의 실행 결과에 필요하지 않다. `.mjs`는 가까운 `package.json`의 `type` 값과 무관하게 ES module로 해석된다. [Node.js package 문서](https://nodejs.org/api/packages.html#packagejson-and-file-extensions)가 이 동작을 정의한다.

### `korean.md`를 없앨 때 자료를 나눈다

`korean.md`를 그대로 유지하는 안은 사례를 읽고 고치기 쉽지만, AI가 후보마다 파일과 소제목을 다시 읽어야 하고 스크립트의 literal과 문서 사례가 어긋날 수 있다. 파일을 통째로 스크립트 상수에 넣는 안은 한 실행으로 자료를 전달하지만, literal로 찾을 수 없는 의미 검토 절차까지 JavaScript 문자열에 묻힌다.

권장안은 다음처럼 책임을 나누는 것이다.

- 스크립트는 기계적으로 찾을 표현, 경고 설명, 문맥 판정 질문, 문제 사례와 정상 사례를 한 규칙 상수에 둔다.
- `SKILL.md`는 스크립트를 실행할 시점, 결과를 읽는 절차와 literal로 찾을 수 없는 의미 검토 기준을 둔다.
- 언어 공통 사례가 계속 필요하면 기존 `references/examples.md`를 유지한다.
- `korean.md`는 위 자료 이동과 대표 평가에서 동작이 유지됨을 확인한 뒤에만 제거한다.

이 구분은 deterministic file processing에는 `scripts/`, 실행 순서와 중단 조건에는 `SKILL.md`, 필요할 때만 읽는 상세 자료에는 `references/`를 쓰라는 공식 역할과 맞는다. 모든 상세 자료를 반드시 `references/`에 두라는 뜻은 아니다. 스크립트가 반환해야 할 규칙 metadata는 실행 코드와 같은 정본에 있어야 한다. [Agent Skills 스크립트 안내](https://agentskills.io/skill-creation/using-scripts)와 [OpenAI 스킬 작성 지침](https://developers.openai.com/codex/skills)을 확인했다.

## 규칙 schema

규칙은 별도 JSON이나 YAML을 읽지 않고 스크립트 상수로 둔다. 별도 파일을 두면 설치 산출물, loader, schema 버전과 파일 누락 검사가 늘어난다. 현재 규칙을 독립적으로 편집하거나 여러 실행기가 공유해야 한다는 요구는 없다.

```js
const rules = [
  {
    id: "ko.boundary",
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
```

예시는 자료 모양만 보여 주며 표현, 문장과 `id`의 승인을 대신하지 않는다. 각 필드는 다음 책임을 가진다.

- `id`는 출력의 경고와 규칙 자료를 연결하는 안정된 식별자다.
- `expressions`는 원문에서 그대로 찾을 비어 있지 않은 문자열이다. 활용형이 달라져 공통 substring이 안전하지 않으면 승인된 형태를 각각 둔다.
- `message`는 후보를 다시 봐야 하는 이유를 한 문장으로 설명한다. 자동 오류나 일괄 치환을 선언하지 않는다.
- `queries`는 현재 문맥에서 유지, 수정 또는 정보 요청을 판단하는 질문이다.
- `negatives`와 `positives`는 같은 표현이 잘못 쓰인 경우와 정확히 쓰인 경우를 함께 보여 준다.

`reference`, `severity`, `replacement`, 도움말 URL과 자동 수정 자료는 넣지 않는다. 후보 표현은 정상 전문용어일 수 있어 고정 치환값과 오류 등급이 없다. AI는 규칙 질문과 원문을 함께 읽어 `pass`, `needs revision`, `needs human input`을 판단한다.

스크립트가 시작할 때 규칙 상수를 검사한다. `id` 중복, 비어 있거나 공백뿐인 표현, 고립 surrogate, 같은 규칙 안의 중복 표현과 모든 필수 설명 및 사례의 빈 배열을 실패로 처리한다. 서로 다른 규칙의 같은 표현은 원칙적으로 금지한다. 허용하면 한 출현이 어떤 판정 기준에 속하는지 중복 경고가 생기므로 실제 필요가 확인된 뒤 명시적인 정책을 추가한다.

초기 후보 목록은 현재 `korean.md`와 저장소의 자연스러운 한국어 조사에서 직접 다시 살피도록 정한 literal 및 안전한 활용형만 포함한다. 정상 사례에 나온 제품명, 판정 상태, 영문 원어와 설명 문장을 자동으로 규칙으로 만들지 않는다. 후보가 없다는 결과는 문장 구조와 목록 밖 표현의 의미 검토가 끝났다는 뜻이 아니다.

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
scanSources({ provideSources, rules });
```

`provideSources`는 함수 인수로 넘긴다. class, DI framework, 공용 interface 파일, factory와 registry는 만들지 않는다. 어댑터가 세 개라는 사실만으로 확장 framework가 필요하지 않으며, 같은 파일의 순수 함수 경계면 테스트와 실행 경로 분리에 충분하다.

textlint에서 확인한 것처럼 입력 차이를 `Source` 뒤에 숨겨서는 안 된다. Git 어댑터는 변경 파일 선정과 저장소 상대 위치를, 파일 어댑터는 호출자가 정한 순서와 표시 위치를, 표준 입력 어댑터는 `source-name`과 byte 상한을 각각 책임진다. 공통 값은 탐색에 필요한 최소 부분뿐이다.

### 변경 파일 입력

```text
node <skill-root>/scripts/<candidate-scanner>.mjs --changed <repo>
```

`--changed`의 저장소 위치는 절대 위치 또는 현재 디렉터리 기준 상대 위치로 받는다. 저장소 전체를 순회하지 않고, 지정한 Git 작업 트리에서 staged, unstaged와 untracked 상태로 보고된 파일을 합친다. 삭제되지 않은 일반 파일의 현재 작업 트리 내용을 한 번씩 검사한다. 변경 hunk만 검사하지 않고 선택된 파일의 현재 원문 전체를 검사한다. 파일에 새로 추가되지 않은 `경계`도 같은 파일의 문맥 검토 대상이기 때문이다. 변경 파일이 없으면 빈 `sources`와 `warnings`를 가진 정상 JSON을 출력한다.

`git diff` 하나로는 staged와 untracked 파일을 모두 얻을 수 없다. porcelain v1 `-z` 출력은 상태와 저장소 상대 경로를 NUL로 구분하므로 공백과 newline이 있는 경로를 줄 단위 parser 없이 처리할 수 있다. rename을 끄고 추가와 삭제로 받으면 두 경로 record 분기를 피할 수 있다. [Git status porcelain v1](https://git-scm.com/docs/git-status#_porcelain_format_version_1)과 [Git diff](https://git-scm.com/docs/git-diff)를 확인했다.

모든 Git 명령은 `--changed`로 받은 위치에서 shell 없이 실행한다. `git rev-parse --show-toplevel`이 반환한 루트를 파일 확인과 출력 ID에 같이 사용한다. `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`처럼 다른 저장소나 index를 가리킬 수 있는 환경변수가 있으면 실행을 거부한다. 경로는 NUL 구분 byte를 엄격한 UTF-8로 decode하고 저장소 루트 밖 실제 위치, symbolic link, submodule과 특수 파일은 읽지 않는다.

index와 작업 트리가 모두 바뀐 파일도 현재 작업 트리 내용을 검사하는 안을 제안한다. AI가 실제로 읽고 고칠 원문과 결과를 맞출 수 있기 때문이다. 요구사항은 검사할 snapshot을 정하지 않았으므로 구현 전에 승인해야 한다.

### 지정 파일 입력

```text
node <skill-root>/scripts/<candidate-scanner>.mjs \
  --file docs/guide.md \
  --file docs/reference.md
```

`--file`은 한 번 이상 사용할 수 있고 전달 순서를 유지한다. 절대 위치 또는 현재 디렉터리 기준 상대 위치를 받으며, 출력 `sourceId`와 `path`에는 호출자가 넘긴 위치를 구분자가 일정한 문자열로 정규화해 사용한다. 같은 정규화 위치를 두 번 넘기면 중복 경고를 만들지 않고 인수 오류로 끝낸다. 파일 mode에 별도 `--repo`나 source 이름 option을 추가하지 않는다.

각 파일은 같은 file handle에서 일반 파일 여부와 byte 크기를 확인하고 끝까지 읽는다. 존재 여부를 먼저 확인한 뒤 별도 읽기를 하면 두 동작 사이에 파일이 바뀔 수 있다. 읽기 실패를 빈 문자열로 바꾸거나 경로 문자열을 원문으로 검사하지 않는다.

### 문자열 입력

```text
printf '%s' '<review-text>' | \
  node <skill-root>/scripts/<candidate-scanner>.mjs \
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

입력은 `TextDecoder("utf-8", { fatal: true })`로 decode한다. 잘못된 UTF-8을 대체 문자로 바꾸면 위치와 원문이 달라지므로 textlint와 Vale보다 의도적으로 엄격한 정책이다. 선두 BOM은 표시 문자에서 제외하고 NUL이 있으면 binary 입력으로 실패한다. 파일별 byte, 전체 입력 byte, source 수, 경고 수와 출력 byte 상한은 구현 전에 승인한다.

각 경고에는 일치한 줄을 중심으로 제한된 `quote`를 넣는다. AI가 파일을 다시 열 수 없는 표준 입력도 문맥을 판단할 수 있고, 파일 입력에서도 경고 위치를 직관적으로 확인할 수 있기 때문이다. 원문 전체나 제한 없는 주변 문단은 출력하지 않는다. 줄이 상한보다 길면 일치 부분을 보존하면서 앞뒤를 잘라 낸다.

## 표준 출력 JSON

### 결과 구조

정상 실행은 다음 구조의 JSON 객체 하나를 표준 출력에 쓴다.

```json
{
  "catalog": [
    {
      "id": "ko.boundary",
      "expressions": ["경계"]
    }
  ],
  "rules": [
    {
      "id": "ko.boundary",
      "message": "이 표현이 실제 구분 기준이나 책임이 바뀌는 지점을 뜻하는지 확인합니다.",
      "queries": [
        "무엇과 무엇을 나누는지 문장에서 알 수 있습니까?",
        "정확한 분야 용어라면 그대로 유지할 근거가 있습니까?"
      ],
      "negatives": ["조사와 구현의 경계를 정리합니다."],
      "positives": ["두 시스템의 보안 경계에서 요청을 다시 인증합니다."]
    }
  ],
  "sources": [
    {
      "id": "docs/example.md",
      "path": "docs/example.md"
    }
  ],
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
  ]
}
```

`catalog`에는 이번 실행에서 검사한 모든 규칙의 `id`와 `expressions`를 선언 순서대로 넣는다. AI는 빈 `warnings`가 빈 규칙 목록을 실행한 결과인지, 승인된 후보를 모두 검사한 결과인지 구분할 수 있다. `rules`에는 실제 경고가 생긴 규칙의 설명, 질문과 사례만 한 번씩 넣어 결과 크기를 줄인다. `sources`에는 실제로 검사한 source를 후보가 없어도 모두 넣어 빈 `warnings`가 검사 누락을 뜻하지 않게 한다. 표준 입력 source에는 `path`를 넣지 않는다. `warnings`는 출현 하나마다 항목 하나를 둔다.

`catalogs`는 사용하지 않는다. 정상 실행 한 건은 여러 catalog가 아니라 실행한 규칙의 간략 목록 하나를 만들기 때문이다. `rules`는 이 목록 전체를 반복하지 않고 경고가 생긴 규칙의 상세 자료만 담는다. 이 구분은 SARIF의 필드 구성을 복사한 것이 아니라 현재 출력의 중복을 줄이기 위한 자체 규약이다. SARIF는 도구 구성 요소의 전체 규칙을 `rules`에 두고 결과가 `ruleId`로 이를 참조한다. [SARIF 2.1.0의 `rules`와 `ruleId`](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)를 확인했다.

위치는 `startUtf16`과 `endUtf16`으로 시작과 끝을 같은 방식으로 이름 붙인다. 두 값이 원문 전체 offset이 아니라 `line` 안의 열이라는 점과 1부터 시작하는 계산 방식은 앞 절의 규칙으로 고정한다. ESLint와 Language Server Protocol도 위치 범위를 `start`와 `end` 쌍으로 표현한다. [ESLint의 `loc`](https://eslint.org/docs/latest/extend/custom-rules#reporting-problems)와 [Language Server Protocol의 `Range`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.18/specification/#range)를 확인했다.

배열 순서는 같은 입력에서 같은 결과가 나오도록 고정한다. `sources`는 Git이 반환한 위치를 byte 순서로 정렬하거나 `--file` 전달 순서와 표준 입력 한 건의 순서를 유지한다. `warnings`는 source 순서, 시작 offset, 규칙 선언 순서와 표현 선언 순서로 정렬한다. `catalog`와 `rules`는 규칙 선언 순서대로 둔다. 정렬 방식은 자연어 locale이나 사용자 환경에 의존하지 않는다.

이 구조는 외부 표준이 아니라 현재 AI 소비자에게 필요한 최소 자료다. RFC 8259는 JSON 문법을 정하지만 후보 검사의 필드 의미는 정하지 않는다. [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)을 확인했다.

### 결과 파일을 기본 동작으로 만들지 않는다

정상 JSON은 표준 출력으로만 보낸다. 호출자가 보관할 이유가 있을 때 자신의 도구로 redirect할 수 있지만 스크립트는 출력 위치, 기존 파일 덮어쓰기와 정리 책임을 갖지 않는다. 반복 실행으로 임시 결과 파일이 쌓이지 않고, 스킬은 명령 결과를 바로 읽을 수 있다.

표준 출력도 소비 환경의 길이 제한 때문에 잘릴 수 있다. 스크립트는 직렬화한 전체 JSON의 byte 수를 출력 전에 확인한다. 승인된 상한을 넘으면 일부 JSON을 쓰지 않고 실행 실패로 처리하며, 호출자에게 `--file`로 범위를 줄이라는 짧은 안내를 표준 오류에 쓴다. 실제 작업에서 상한 초과가 반복해서 측정될 때만 pagination, JSON sequence 또는 명시적인 출력 파일 option을 추가한다.

여러 경고를 `throw new Error`로 하나씩 전달하지 않는다. 첫 예외에서 실행이 멈추고, stack trace와 자유 형식 문자열은 기계적으로 읽을 결과가 아니며, 후보와 실행 실패도 구분하지 못한다. 예외는 입력을 완전히 검사할 수 없는 경우에만 사용한다.

### 종료 상태와 오류

- **종료 상태 `0`.** JSON 객체를 온전히 출력했다. `warnings`가 비어 있거나 하나 이상인 경우 모두 포함한다.
- **종료 상태 `2`.** 인수, Git, 파일, 인코딩, 크기, 규칙 자료, 직렬화 또는 stdout 쓰기 때문에 실행을 완결하지 못했다.
- **signal 종료.** SIGINT와 SIGTERM에는 handler를 두지 않고 운영체제 종료 상태를 유지한다.

최상위 실행 함수는 예상한 실패를 `Error`로 올리고 진입점이 한 번 잡는다. 표준 오류에는 오류 종류와 사용자가 줄일 수 있는 입력만 적고 원문 전체, 개인 절대 위치와 stack trace를 넣지 않는다. `process.exitCode = 2`를 설정해 표준 오류가 쓰인 뒤 자연스럽게 종료한다. Node.js는 `process.exit()`가 비동기 표준 출력을 끝내기 전에 프로세스를 종료할 수 있다고 설명한다. [Node.js process 종료 문서](https://nodejs.org/api/process.html#processexitcode)를 확인했다.

stdout 쓰기 중 실패하면 일부 출력이 남을 수 있으므로 호출자는 종료 상태 `0`인 실행만 JSON으로 사용해야 한다. 첫 구현에서 임시 파일, atomic rename과 writer abstraction을 추가하지 않는다. 표준 출력의 원자성을 일반 파일과 pipe 모두에서 보장할 수 없으므로 종료 상태 확인이 가장 작은 공통 규약이다.

## 포함하지 않을 기능

다음 항목은 현재 결과를 만드는 데 필요하지 않다.

- Markdown AST, HTML 변환과 code block 제외
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

같은 `.mjs` 파일의 self-test에는 규칙 상수와 순수 탐색만 넣는다. Git 저장소와 파일 I/O 검증은 구현 작업에서 별도 명령으로 실행한다. 외부 test framework와 fixture 파일은 필요하지 않다.

### 규칙과 탐색

- 빈 표현, 공백뿐인 표현, 고립 surrogate와 중복 `id`를 거부한다.
- 문제 사례와 정상 사례 및 판정 질문이 비어 있으면 거부한다.
- 같은 줄과 여러 줄의 반복 및 겹치는 출현을 모두 찾는다.
- `경계`, `경계를`과 `보안경계`의 substring 출현을 모두 찾는다.
- 같은 위치에서 규칙이 다른 경고를 임의로 합치지 않는다.
- code fence, inline code, link, image, HTML comment와 front matter 안의 출현도 남긴다.
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

- 후보가 없어도 실행한 모든 `id`와 `expressions`, 검사한 모든 source 및 빈 `rules`와 `warnings`를 가진 RFC 8259 JSON을 출력하고 `0`으로 끝난다.
- 후보가 있으면 실행한 전체 규칙 목록과 일치한 규칙의 metadata를 각각 한 번, 모든 출현을 각각 출력하고 `0`으로 끝난다.
- `catalog`, `rules`, `sources`와 `warnings`의 참조가 모두 연결되는지 확인한다.
- 표준 입력 source에는 실제 파일 `path`를 만들지 않는다.
- 직렬화 결과가 상한을 넘으면 JSON 일부를 출력하지 않고 `2`로 끝난다.
- 입력 또는 내부 실패는 stdout에 정상 JSON을 남기지 않고 짧은 stderr와 `2`로 끝난다.
- 같은 입력을 네트워크가 없는 환경에서 실행해 같은 결과를 얻는다.

대표 평가에서는 스크립트가 정상 전문용어도 후보로 찾고 AI가 그대로 유지하는지, 문제 표현은 질문과 사례를 근거로 고치는지, 목록에 없는 의미 문제를 `SKILL.md` 절차가 계속 찾는지를 함께 확인한다.

## 구현 전에 승인할 내용

다음 내용은 조사 결론이 아니라 요구사항 소유자 또는 정해진 검수자의 승인이 필요하다.

- 후속 구현의 새 파일 금지에서 `scripts/<candidate-scanner>.mjs` 한 파일을 예외로 둘지
- `korean.md`의 literal 규칙과 사례를 스크립트로, 의미 검토 절차를 `SKILL.md`로 옮긴 뒤 `korean.md`를 제거할지
- 정확한 스크립트 파일명과 Node.js 및 Git 최저 버전 및 운영체제
- 초기 규칙의 `id`, literal 및 활용형, 설명, 질문, 문제 사례와 정상 사례 전체
- `--file`의 정규화 위치를 `sourceId`와 `path`에 그대로 싣는 정책이 개인 위치를 다루는 현재 검토 입력에 맞는지
- `--changed`가 index가 아닌 현재 작업 트리 원문을 검사하는 안
- source 수, 파일별 byte, 전체 입력, 경고 수, `quote`와 직렬화 JSON byte 상한
- 제안한 JSON 필드명과 UTF-16 열 단위
- 규칙 자료와 의미 검토 절차 변경을 승인할 역할 및 대표 평가 판정자

이 결정이 나기 전에도 조사 문서는 구현의 선택지를 설명할 수 있지만, 계획에서 해당 구현을 시작하거나 `korean.md`를 삭제한 것으로 기록하면 안 된다.

## 조사 한계

완성된 기존 도구가 없다는 판단은 2026년 8월 5일에 확인한 공식 문서와 세 tag 소스에 한정된다. 세 도구의 전체 기능을 재현하는 목적이 아니므로 editor, CI와 Pull Request 연결 기능은 비교하지 않았다.

이번 작업은 스크립트, package file, bundle, 규칙 자료와 테스트를 만들지 않았다. 현재 제안은 표준 출력 결과를 한 번에 메모리에 직렬화하므로 승인된 출력 상한 안에서만 사용한다. 실제 결과가 반복해서 상한을 넘거나 다른 소비자가 생기면 측정 결과를 근거로 출력 방식과 변환기를 다시 검토해야 한다.
