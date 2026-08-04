# 한국어 후보 표현 검사기 소스 조사

## 결론

`use-words-review`에 후보 검사기를 추가한다면, textlint, Vale와 reviewdog를 실행 의존성으로 넣지 않고 **Node.js 표준 기능만 사용하는 단일 스크립트**가 가장 단순하다. 이 안은 현재 요구사항의 새 파일 금지와 충돌하므로 요구사항 소유자가 예외를 승인한 뒤에만 구현할 수 있다. 스크립트는 Git에서 바뀐 파일 전체의 원문을 읽고, `경계`를 포함한 모든 후보 표현을 literal substring으로 전수 탐색한다. 완결된 결과에는 표현별 검토 이유, 문제 사례, 정상 사례와 모든 출현 위치를 JSON으로 담는다. 출력 상한 때문에 위치를 모두 담지 못하면 검사를 실패로 끝내 완결된 결과로 오인하지 않게 한다. AI가 각 문맥을 읽어 유지, 수정 또는 추가 확인 필요 여부를 판단하며 스크립트는 자동 수정하지 않는다.

세 도구를 대체 구현할 필요는 없다. textlint와 Vale에서는 모든 일치와 위치를 잃지 않는 규칙만, reviewdog에서는 변경 파일 전체를 뜻하는 `file` 방식과 진단 자료 구조만 참고한다. Markdown parser, 사용자 규칙 engine, diff hunk parser, reporter, MCP, formatter와 suppression은 이번 검사기에 필요하지 않다.

이 결론은 [요구사항의 목표](../requirements.md#목표)에 적힌 기계 검사와 의미 검토의 분담을 구체화한다. 현재 작업은 조사와 설계 근거를 기록하며 스크립트는 구현하지 않는다.

## 결정 근거

### 완성된 기존 도구는 없다

2026년 8월 4일 기준으로 Vale 3.17.0, textlint 15.8.0과 reviewdog 0.21.0의 공식 저장소를 확인했다. 세 도구 가운데 후보 표현, 문제 사례, 정상 사례, 변경 파일 전체와 AI 판정을 한 실행 규약으로 제공하는 도구는 없다.

- **textlint**는 Markdown AST, 사용자 규칙, 위치 계산, JSON formatter와 MCP를 제공한다. 그러나 Node.js 20 이상과 npm 패키지 설치가 필요하고, 후보 자료를 읽는 사용자 규칙도 별도로 작성해야 한다. [textlint 규칙 문서](https://textlint.org/docs/rule/)와 [15.8.0 소스](https://github.com/textlint/textlint/tree/v15.8.0)를 확인했다.
- **Vale**는 단일 실행 파일이며 Markdown scope, existence 규칙, 설명과 링크가 있는 alert를 제공한다. 그러나 YAML 규칙과 설정을 함께 배포해야 하고, 문제 사례와 정상 사례를 독립 필드로 제공하지 않는다. [Vale scope 문서](https://vale.sh/docs/scopes), [existence 규칙](https://vale.sh/docs/checks/existence)과 [3.17.0 소스](https://github.com/errata-ai/vale/tree/v3.17.0)를 확인했다.
- **reviewdog**는 표현을 찾지 않는다. 선행 검사기의 진단을 Git diff와 대조하고 Pull Request에 전달한다. 현재 목적에는 `file` mode의 의미와 RDFormat 필드만 참고할 수 있다. [filter mode 설명](https://github.com/reviewdog/reviewdog/blob/v0.21.0/README.md#filter-mode)과 [0.21.0 소스](https://github.com/reviewdog/reviewdog/tree/v0.21.0)를 확인했다.

따라서 textlint를 `npx`로 매번 받거나 Vale와 reviewdog 실행 파일을 스킬에 포함해도 사용자 규칙이나 변환 코드가 사라지지 않는다. 네트워크, 버전 고정, 설치 실패, 플랫폼별 실행 파일과 라이선스 갱신 책임만 추가된다.

### 원문 전수 탐색에는 Markdown parser가 필요하지 않다

textlint는 Markdown을 `Str`, `Code`, `Link`, `Image`, `Html`, `Yaml` 같은 node로 나눈다. Vale는 Markdown을 HTML token으로 바꾸고 code, link 목적지와 일부 metadata를 가리거나 별도 scope로 처리한다. 두 구현 모두 parser가 만든 문구를 원문 위치로 되돌리는 보정 코드와 예외를 갖는다.

- textlint의 parser는 GFM, 각주와 여러 front matter 형식을 조합하고, position이 없는 table node에는 주변 node를 이용한 복구 절차를 적용한다. [parse-markdown.ts](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/markdown-to-ast/src/parse-markdown.ts)와 [index.ts](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/markdown-to-ast/src/index.ts)가 이를 보여 준다.
- Vale는 fence 정보, link reference와 목록 marker를 같은 길이로 가린 뒤 Markdown을 HTML로 변환한다. [md.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/lint/md.go)와 [ast.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/lint/ast.go)에 이 처리가 있다.

Vale의 `scope: raw`는 형식 변환 전 원문을 다시 합쳐 검사하므로 원문 전수 탐색 자체는 할 수 있다. 그러나 [lint.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/lint/lint.go)에서 형식별 Markdown 처리가 성공한 뒤에만 raw 규칙을 실행한다. 따라서 raw scope도 parser, Vale 설정과 실행 파일 의존성을 제거하지 못한다.

Vale `existence` 규칙은 기본적으로 token pattern에 ASCII `\b`를 붙이므로 한글 substring 후보에는 `nonword: true`가 필요하다. [existence.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/check/existence.go)는 `nonword`일 때 boundary wrapper뿐 아니라 accepted vocabulary 예외 결합도 끈다. 따라서 기존 단어 규칙을 그대로 재사용하지 못하고 한글 후보 전용 규칙과 예외를 별도로 관리해야 한다.

textlint 사용자 규칙도 `Syntax.Document`에서 `context.getSource()`를 호출하면 node별 순회 없이 문서 전체 문자열을 검사할 수 있다. 그러나 [textlint-kernel.ts](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/kernel/src/textlint-kernel.ts)는 plugin의 `preProcess`가 성공한 뒤 규칙을 실행하고, [TextlintSourceCodeImpl.ts](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/kernel/src/context/TextlintSourceCodeImpl.ts)는 첫 BOM을 제거한다. 이 통로도 textlint 설치와 Markdown parser를 우회하지 않으며 실제 파일 문자열과 offset이 달라질 수 있다.

이번 검사의 목표는 산문으로 판정된 부분만 찾는 것이 아니라 문제가 될 수 있는 표현을 먼저 빠짐없이 제시하는 것이다. 코드 예시, inline code, 링크 주소, 이미지 alt와 title, HTML 주석, front matter와 인용문도 후보 목록에는 남아야 AI가 정확한 원문인지 판단할 수 있다. 부분적인 Markdown parser나 제외 규칙은 거짓 양성을 줄이는 대신 검토 기회를 없앤다.

검사기는 Markdown을 해석하지 않고 원문을 한 번만 다룬다. 이 선택은 parser를 잘못 축소한 구현보다 파일 수와 누락 위험을 함께 줄인다.

## 단일 스크립트의 책임

### 포함할 기능

스크립트 한 파일은 다음 기능만 맡는다.

1. 실행 기준 Git 저장소를 확인한다.
2. staged, unstaged와 untracked 파일의 합집합을 구한다.
3. 읽을 수 있는 일반 UTF-8 파일인지 확인한다.
4. 내장된 후보 목록의 literal 문자열을 원문에서 모두 찾는다.
5. 저장소 상대 위치, 범위, 주변 문맥과 후보별 설명을 JSON 한 개로 출력한다.
6. 실행이 완결됐는지, 건너뛴 입력이 있는지와 출력이 잘렸는지를 명시한다.

이 구조에는 외부 npm package, bundle, `package.json`, lock 파일, `node_modules`, 설정 파일과 별도 formatter가 없다. 실행 환경에는 Node.js와 Git이 있어야 한다. 여기서 외부 의존성이 없다는 말은 실행 중 내려받거나 별도 설치할 third-party package가 없다는 뜻이다.

### 포함하지 않을 기능

다음 기능은 현재 결과를 만들지 않으므로 넣지 않는다.

- Markdown AST와 HTML 변환
- 코드 블록, 링크, front matter와 인용문 제외
- 정규식 사용자 규칙과 word boundary
- 자동 수정과 replacement 제안
- suppression 주석과 ignore 파일
- 디렉터리 순회, glob과 사용자 홈 설정 탐색
- unified diff hunk parser와 변경 줄 filtering
- RDJSONL, SARIF, Pull Request reporter와 MCP server
- plugin system, rule loader와 여러 출력 formatter
- Unicode normalization과 대소문자 자동 변환

필요성이 확인되지 않은 기능을 제외하면 textlint, Vale 또는 reviewdog의 작은 복제품을 만들지 않아도 된다.

## 후보 자료

단일 실행 파일만 배포하려면 후보별 자료를 스크립트 안의 상수로 둔다. 각 항목에는 다음 값이 필요하다.

- 안정된 `ruleId`
- 비어 있지 않은 literal `expression`
- 다시 살펴야 하는 이유
- 잘못 쓰기 쉬운 사례와 그 이유
- 유지할 수 있는 정상 사례
- `korean.md`의 해당 소제목

`korean.md`는 사람이 판정 기준을 읽는 자료로 계속 유지한다. 일반 산문을 실행 시점에 파싱해 후보 목록을 만들면 Markdown 구조와 문장 형식이 곧 비공개 API가 된다. 별도 JSON이나 YAML을 두면 파일 수가 늘어난다. 따라서 후속 구현에서는 스크립트에 실행용 목록을 넣고 `--self-test`가 빈 표현, 공백만 있는 표현, 고립 surrogate, 중복 `ruleId`, 중복 표현, 빠진 설명과 유효하지 않은 참고 위치를 검사하는 편이 가장 작다.

이 방식은 `korean.md`와 실행용 목록의 중복을 완전히 없애지는 못한다. 후보를 변경할 때 두 내용을 함께 검토해야 한다. 이 책임까지 자동 생성으로 없애려면 source file, generator와 생성 결과가 추가되므로 현재 요구보다 큰 구조가 된다.

### 초기 후보 목록의 적용 범위

"모든 후보 표현"은 `korean.md`의 모든 code span이나 예시 문자열을 뜻하지 않는다. 정상 사례의 제품명, API 이름, 판정 상태와 영문 원어까지 넣으면 후보 자료가 판정 자료 자체를 무차별 복사하게 된다. 초기 실행 목록은 `korean.md`가 직접 다시 살피도록 지시한 다음 literal 묶음으로 제한한다.

- **문자와 번역체:** `expression: "\u00B7"`, `에 대해서`, `에 의해서`, `에 있어서`, `와의`, `하지 않으면 안`, `회의를 가지다`, `사용자-facing`
- **문맥에 따라 뜻이 달라지는 용어:** `계약`, `경로`, `공개`, `좁히다`, `박다`, `제품`, `포화`, `경계`, `소유`, `반증`, `범위`, `루브릭`, `유효성`, `정합성`, `가시성`
- **행동을 감추기 쉬운 동사:** `지원`, `보장`, `대응`, `다루다`, `노출`, `포착`, `정렬`, `표면화`
- **근거 없는 평가 표현:** `핵심`, `효과적`, `원활`, `강력`, `견고`, `포괄적`, `다양한`, `본질적`
- **지칭 대상이 불분명하기 쉬운 표현:** `해당`, `관련`, `이 내용`, `결과`, `출력`, `데이터`, `기능`

U+00B7의 실행 값은 문자 이름인 ASCII 문자열이 아니라 escape가 나타내는 실제 code point다. `하지 않으면 안`처럼 안전한 공통 substring이 있는 구성은 종결형을 떼고 찾는다. `회의를 가지다`는 `가진다`, `가집니다`, `가졌다`처럼 어간 표면형이 바뀌므로 승인된 활용형을 별도로 열거해야 한다. `좁히다`, `다루다`와 `박다`도 어떤 literal variant로 펼칠지 승인해야 한다. 짧은 stem인 `박`을 그대로 찾으면 일반 단어까지 과도하게 일치한다. `값을 박`, `규칙을 박`, `문구를 박`처럼 자료가 직접 제시한 결합만 넣는 안과 활용형 목록을 넓히는 안을 실행 평가로 비교한다.

영어식 무생물 주어, 명사 나열, 후보 목록에 없는 피동문, 영어 보통명사, 목록에 없는 번역어와 뜻을 압축한 표현, 기존 문서에서 근거 없이 이어받은 표현, 같은 길이의 항목 반복과 상투적인 도입 및 결론은 유한한 literal 목록으로 전수 검사할 수 없다. 이 기준은 스크립트가 아니라 AI 의미 검토에 남긴다. 후보가 없다는 결과는 행동 주체, 문장 구조와 목록 밖 표현의 검토가 끝났다는 뜻이 아니다. 후보 목록과 기계화하지 않는 기준을 함께 승인해야 구현자가 모든 code span을 임의로 규칙으로 만들지 않는다.

## 탐색과 위치 규칙

### literal substring

후보는 정규식이 아니라 literal substring이다. `경계`는 `경계`, `경계를`과 `보안경계` 안에서도 모두 후보가 된다. JavaScript의 `\b`는 한글 조사와 기대한 방식으로 동작하지 않으며, 정규식은 빈 일치, escaping, catastrophic backtracking과 pattern별 검증을 새 책임으로 만든다.

각 후보는 `indexOf(expression, from)`을 반복해 찾는다. 다음 검색은 일치 시작점에서 UTF-16 code unit 하나만 전진한다. Vale의 alert 위치 보조 함수도 겹칠 수 있는 literal 후보를 찾을 때 한 rune씩 전진하지만, Vale existence 규칙 자체가 겹치는 진단을 모두 생성한다는 뜻은 아니다. [location.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/core/location.go)와 [existence.go](https://github.com/errata-ai/vale/blob/v3.17.0/internal/check/existence.go)에서 두 역할의 차이를 확인할 수 있다. 서로 다른 후보는 독립적으로 검색하므로 같은 원문 범위에 둘 이상의 후보가 겹쳐도 모두 남는다.

빈 문자열, 공백만 있는 표현과 고립 surrogate가 있는 표현은 설정 오류다. 후보 원문과 대상 파일을 자동 normalize하지 않는다. 분해형까지 찾아야 하는 표현은 별도 literal variant로 명시해야 원문 위치를 잃지 않는다.

### 범위와 줄바꿈

내부 범위는 JavaScript 문자열과 같은 UTF-16 code unit 기준의 0-based, end-exclusive `[start, end)`로 고정한다. textlint도 source range가 code unit 기준임을 [source-code-fixer.ts](https://github.com/textlint/textlint/blob/v15.8.0/packages/%40textlint/source-code-fixer/src/source-code-fixer.ts)에서 명시한다.

표시용 줄과 열은 1부터 시작하며 열도 UTF-16 code unit로 계산한다. UTF-8 byte 열을 사용하는 reviewdog RDFormat과 바로 호환되는 형식은 아니다. 한 형식 안에서 byte, code point와 UTF-16을 섞는 것보다 Node의 검색, slice와 범위를 같은 단위로 유지하는 편이 오류가 적다. reviewdog adapter와 결과 재사용은 현재 스킬 절차에 필요하지 않으므로 구현하지 않는다. [reviewdog Position 정의](https://github.com/reviewdog/reviewdog/blob/v0.21.0/proto/rdf/reviewdog.proto)는 해당 열이 1-based UTF-8 byte count임을 명시한다.

`TextDecoder("utf-8", { fatal: true, ignoreBOM: true })`로 첫 U+FEFF BOM을 문자열에 보존하고 범위는 실제 파일 문자열 기준으로 유지한다. 보존한 문자열 전체를 검색해도 한글 후보는 BOM과 일치하지 않으므로 별도 건너뛰기 분기가 필요 없다. 기본 `TextDecoder`처럼 BOM을 제거하면 실제 파일에서 한 code unit 앞을 가리킨다. 원문 줄바꿈은 바꾸지 않는다. 줄 시작 위치를 한 번 계산하면서 CRLF를 한 줄바꿈으로, 단독 CR과 LF도 각각 한 줄바꿈으로 처리한다. textlint와 Vale의 내부 line 처리가 단독 CR을 같은 방식으로 다루지 않으므로 세 줄바꿈 형식을 직접 검사해야 한다. 원문을 먼저 LF로 바꾸면 이후 범위가 실제 파일과 달라지므로 정규화하지 않는다.

### 결과 크기

파일마다 줄 시작 위치를 한 번 계산하고 후보별 native `indexOf`를 사용한다. trie, Aho-Corasick과 worker thread는 측정된 병목이 생길 때만 검토한다.

출력 상한에 도달해도 끝까지 검색해 실제 출현 수는 센다. 전체 요약과 각 후보에는 `totalOccurrences`, `reportedOccurrences`와 `truncated`를 넣는다. 하나라도 잘리면 `runStatus`는 `incomplete`, 종료 상태는 `2`로 두고 모든 위치를 전달했다는 주장을 하지 않는다. 설명과 사례는 후보별로 한 번만 기록하고 출현 위치를 그 아래 묶어 AI 입력의 반복을 줄인다. `context`는 Markdown 문장 추출 결과가 아니라 후보 앞뒤의 고정 길이 원문 창이며, 잘렸는지를 별도 값으로 표시한다. 창 길이는 UTF-16 code unit로 계산하되 시작과 끝이 surrogate pair 사이에 놓이면 온전한 code point가 남는 방향으로 경계를 옮긴다. `contextRangeUtf16`도 함께 출력해 원문 slice와 context가 같은지 확인할 수 있게 한다. 파일 수, 파일별 byte, 전체 입력 byte, Git 출력 byte, context 길이와 최종 JSON byte 상한의 실제 값은 구현 전에 이 저장소와 적용 대상 저장소의 문서 크기를 측정해 정해야 한다.

## 변경 파일 선택

reviewdog의 `file` mode는 바뀐 파일 안의 모든 진단을 남기고 `added` mode는 추가하거나 수정한 줄만 남긴다. [diff_filter.go](https://github.com/reviewdog/reviewdog/blob/v0.21.0/filter/diff_filter.go)의 `ShouldReport`가 이 차이를 구현한다. 현재 요구는 업데이트된 파일에 남아 있는 후보를 모두 보여 주는 것이므로 변경 파일 전체를 읽는다. diff line parser는 필요하지 않다.

Git 명령은 shell 없이 실행 파일과 인수 배열로 호출한다. 처음에 `git rev-parse --show-toplevel`로 저장소 루트를 구한다. 이 stdout은 Buffer로 받아 마지막 LF 한 byte만 제거하고 나머지를 엄격한 UTF-8로 decode한다. `.trim()`이나 줄 분할을 쓰면 실제 저장소 이름의 newline이나 끝 공백이 사라진다. LF terminator가 없거나 decode한 값이 비면 종료 상태 `2`로 끝낸다.

모든 Git 명령은 처음 호출한 작업 위치에서 실행한다. `GIT_DIR`, `GIT_WORK_TREE`, `--git-dir`와 `--work-tree`는 상대 경로일 수 있으므로 저장소 루트로 cwd를 바꾸면 다른 위치로 다시 해석될 수 있다. `ls-files`에는 `--full-name`과 repository-root pathspec `:/`를 넘겨 처음 호출한 위치와 무관하게 전체 index를 루트 상대 경로로 받는다. child environment에서는 `GIT_LITERAL_PATHSPECS`, `GIT_GLOB_PATHSPECS`, `GIT_NOGLOB_PATHSPECS`와 `GIT_ICASE_PATHSPECS`를 제거해 `:/`의 의미가 inherited 설정에 따라 바뀌지 않게 한다. porcelain v1 `-z` status도 루트 상대 경로를 보장한다. 실제 파일만 `rev-parse`가 반환한 절대 루트와 결합한다.

```text
git --no-optional-locks -c core.fsmonitor=false ls-files --full-name --sparse -v -z -- :/
git --no-optional-locks -c core.fsmonitor=false -c core.untrackedCache=false status --porcelain=v1 -z --untracked-files=all --ignore-submodules=none --no-renames
```

[porcelain v1 문서](https://git-scm.com/docs/git-status#_porcelain_format_version_1)는 버전과 사용자 설정에 따라 바뀌지 않는 `XY` 상태, 저장소 루트 상대 경로와 NUL 구분 출력을 정의한다. 한 상태 목록으로 staged, unstaged, untracked, 삭제, 충돌과 예상하지 못한 상태를 함께 결산하면 여러 diff 목록을 합칠 때 생기는 누락과 중복 분기를 없앨 수 있다. `--no-renames`는 rename을 삭제와 추가로 받아 두 경로 record parser를 피한다. 새 경로는 추가 또는 untracked 상태로 검사하고 이전 경로는 삭제로 결산한다.

status를 읽기 전에 `git ls-files --full-name --sparse -v -z -- :/`를 확인한다. lowercase tag는 `assume-unchanged`, `S` tag는 `skip-worktree` 때문에 Git이 작업 트리 검사를 생략할 수 있다는 뜻이므로 한 건이라도 있으면 종료 상태 `2`로 끝낸다. `--sparse`는 sparse directory를 `S` entry로 남겨 같은 실패 조건으로 처리하면서 full index 확장을 피한다. `XY` 가운데 검사 가능한 추가, 복사, 수정과 type change의 현재 일반 파일 및 `??` file을 읽는다. 삭제와 submodule은 `outOfScope`로 결산한다. unmerged 조합, Git이 예외 상태로 정한 `X`와 broken pairing인 `B`, 알 수 없는 상태는 종료 상태 `2`로 끝낸다. `--ignore-submodules=none`으로 사용자 설정이 submodule 변경을 숨기지 않게 하고, `--no-optional-locks`로 read-only 검사 중 선택적인 index 갱신을 막는다. `-c core.fsmonitor=false`는 fsmonitor가 변경 목록을 줄이지 않게 하고 `-c core.untrackedCache=false`는 저장된 directory cache에 의존하지 않고 untracked 파일을 열거하게 한다. fsmonitor boolean 동작을 전제로 할 때 최저 Git 버전은 2.36 이상이어야 한다. HEAD가 없는 저장소도 status로 판정하므로 저장소 확인에 HEAD 존재를 요구하지 않는다.

fsmonitor를 끄더라도 저장소의 `.gitattributes`와 로컬 Git 설정이 지정한 clean 또는 process filter는 status가 작업 트리와 index를 비교할 때 실행될 수 있다. 모든 filter 이름을 일반 option 하나로 끄는 규약은 확인되지 않았다. 검사기는 신뢰하는 로컬 저장소에서만 실행하고 Git filter 실패를 종료 상태 `2`로 전달한다. 신뢰하지 않는 저장소에서 외부 명령 실행을 완전히 막는 것은 이 한 파일 검사기의 범위 밖이다.

status의 untracked 범위는 Git 표준 ignore 규칙을 따른다. ignored untracked 파일은 공개 또는 추적할 글의 범위에 포함하지 않는다. 이 범위에는 저장소 ignore 외에 `.git/info/exclude`와 사용자 전역 exclude도 영향을 주므로 사용자 환경과 무관한 untracked 범위까지 요구되면 별도 정책을 승인해야 한다.

완결성은 위에서 고정한 porcelain status가 보고한 변경 파일을 뜻한다. Git은 index의 stat 정보가 같으면 항상 worktree byte를 다시 hash하지 않으며 `core.trustctime`과 `core.checkStat` 설정도 비교할 metadata에 영향을 준다. stat 정보를 인위적으로 보존한 채 바꾼 tracked 파일까지 전수 판정하려면 모든 tracked file을 index와 별도로 비교해야 하므로 현재 범위에 넣지 않는다.

Git stdout은 문자열이 아니라 Buffer로 받고 NUL byte로 record를 나눈다. 각 record의 ASCII `XY`와 separator를 먼저 검증한 뒤 경로 byte를 엄격한 UTF-8로 decode한다. UTF-8이 아닌 경로는 JSON 상대 경로로 안전하게 표현할 수 없으므로 종료 상태 `2`로 끝낸다. Git 호출에는 best-effort timeout, stdout과 stderr byte 상한을 명시한다. Node.js timeout은 signal을 보낼 뿐 Git이 실행한 process tree가 정해진 시간 안에 모두 끝난다고 보장하지 않는다. 엄격한 운영체제 공통 wall-clock 상한은 이 한 파일의 범위 밖이다. NUL 구분을 줄 단위로 나누거나 셸 명령 문자열에 경로를 합치지 않는다.

`XY`의 index와 작업 트리 위치가 모두 변경 상태인 일반 파일은 두 snapshot의 내용이 다를 수 있다. 작업 트리만 읽으면 다음 commit에 들어갈 후보를 놓칠 수 있으므로 초기 구현은 이 부분 staging 상태를 종료 상태 `2`로 막는다. index와 작업 트리를 함께 검사해야 한다는 요구가 생기면 각 occurrence에 `source: "index" | "worktree"`를 추가하고 두 snapshot을 별도로 읽는 방식으로 확장한다.

## 입력 안전성과 실패 규약

각 파일은 다음 순서로 확인한다. 이 검사는 사용자가 제어하는 로컬 작업 트리를 신뢰하며, 악의적인 프로세스가 검사 도중 파일이나 link를 바꾸는 상황은 신뢰 범위 밖이다. 정상적인 동시 변경에서 확인한 대상과 읽은 대상이 달라지는 일을 줄이기 위해 같은 file handle에서 종류와 크기를 확인하고 내용을 읽는다.

1. 저장소 루트와 대상의 실제 경로를 구한다.
2. 대상이 루트 밖이면 실패한다.
3. symbolic link, 디렉터리, submodule, FIFO와 device가 아닌 일반 파일인지 확인한다.
4. 같은 file handle에서 파일별 byte와 전체 입력 byte 제한을 확인하고, 허용량보다 한 byte 더 읽는 bounded loop로 상한 초과를 확인한다.
5. `TextDecoder("utf-8", { fatal: true, ignoreBOM: true })`로 엄격하게 decode하면서 BOM을 보존한다.
6. NUL 문자가 있으면 binary 입력으로 보고 실패한다.

[Node.js `realpath`](https://nodejs.org/api/fs.html#fspromisesrealpathpath-options)는 symbolic link를 해석한 실제 위치를 돌려 주고, [`TextDecoder`](https://nodejs.org/api/util.html#class-utiltextdecoder)는 잘못된 UTF-8에서 예외를 낼 수 있다. 저장소 안의 link가 개인 파일을 읽거나 잘못된 byte를 대체 문자로 바꿔 위치가 틀어지는 일을 막으려면 두 검사가 필요하다.

명시한 입력은 모두 `scanned`, `outOfScope` 또는 `error`로 결산한다. 삭제와 submodule은 `outOfScope`의 이유를 기록한다. 일부 검사 대상만 읽은 실행은 완전한 결과가 아니다. stdout에는 실행이 끝난 뒤 JSON 한 개만 쓰고, 진행 안내와 짧은 오류는 stderr에 쓴다. 절대 경로와 원문 전체는 출력하지 않는다. `context`는 대상 파일에서 온 신뢰하지 않는 인용 자료이며 AI 명령이나 검사기 메시지로 취급하지 않는다.

- 종료 상태 `0`: 검사가 완결됨. 후보 유무와 관계없다.
- 종료 상태 `2`: Git, 입력, 경로, 인코딩, 크기, 출력 잘림 또는 내부 처리 실패로 검사가 완결되지 않음.

후보는 확정 오류가 아니므로 종료 상태 `1`로 만들지 않는다. CI에서 후보를 실패로 바꾸는 option은 실제 연결 요구가 생긴 뒤 추가한다. 소비자는 종료 상태 `0`일 때만 stdout을 완결된 JSON으로 취급한다. 성공 경로는 최종 JSON write의 callback이 끝난 뒤 자연스럽게 종료하며 `process.exit(0)`을 호출하지 않는다. 제어 가능한 실패는 `process.exitCode = 2`로 표시해 stderr 쓰기가 끝나게 한다. stdout의 write callback과 `error` event를 모두 처리하며 EPIPE는 완결된 결과가 아니다. SIGINT와 SIGTERM에는 handler를 두지 않으므로 운영체제가 정한 signal 종료 상태가 나오며 `0` 또는 `2` 규약에 포함되지 않는다.

## AI에 전달할 JSON

reviewdog RDFormat의 location, severity와 code 구조를 참고하되 임의의 사례 자료를 억지로 message 한 필드에 합치지 않는다. 기본 출력은 JSONL이 아니라 실행 요약과 빈 결과도 표현할 수 있는 JSON 한 개다.

```json
{
  "schemaVersion": 1,
  "runStatus": "complete",
  "summary": {
    "scannedFiles": 1,
    "evaluatedCandidates": 1,
    "totalOccurrences": 1,
    "reportedOccurrences": 1,
    "truncated": false
  },
  "files": [
    {
      "path": "docs/example.md",
      "status": "scanned"
    }
  ],
  "candidates": [
    {
      "ruleId": "ko.boundary",
      "expression": "경계",
      "status": "candidate",
      "reason": "검토 범위, 제외 대상, 역할 분담 또는 연결 지점 중 무엇을 뜻하는지 확인한다.",
      "problemExample": "이 문서는 조사와 실행의 경계를 다룬다.",
      "acceptedExamples": [
        "외부 요청은 보안 경계를 통과하기 전에 인증 서비스가 서명을 검증한다.",
        "도형의 경계에 포함된 점을 별도로 표시한다."
      ],
      "reference": "skills/use-words-review/references/korean.md#구분-기준이나-접점을-가리키는-경계",
      "totalOccurrences": 1,
      "reportedOccurrences": 1,
      "truncated": false,
      "occurrences": [
        {
          "path": "docs/example.md",
          "rangeUtf16": [48, 50],
          "line": 3,
          "columnUtf16": 15,
          "contextRangeUtf16": [34, 56],
          "context": "이 문서는 조사와 실행의 경계를 다룬다.",
          "contextTruncated": false
        }
      ]
    }
  ],
  "errors": []
}
```

`candidates` 배열에는 일치한 후보만 넣지 않고 실행 목록의 모든 후보를 넣는다. 일치가 없으면 `occurrences`는 빈 배열이고 후보별 count는 `0`이다. `evaluatedCandidates`는 배열 길이와 같아야 하므로 빈 목록이나 일부 규칙만 실행한 결과를 완결된 검사로 오인하지 않는다.

`files` 배열은 Git에서 발견한 각 상대 경로와 `scanned`, `outOfScope` 또는 `error` 상태를 기록한다. 후보가 없던 변경 파일도 남겨 `scannedFiles` count와 실제 결산 대상을 함께 검증할 수 있게 한다. `outOfScope`와 `error`에는 원문을 넣지 않고 짧은 reason code만 추가한다.

후보의 설명은 판정을 대신하지 않는다. 주 에이전트와 독립 검수자는 각 occurrence의 주변 문장과 저장소 근거를 읽고 `pass`, `needs revision` 또는 `needs human input`을 정한다.

## 최소 검증 사례

별도 test framework와 fixture 묶음 대신 같은 파일의 `--self-test`는 순수한 후보 자료, 탐색과 위치 계산만 검사한다. Git 저장소와 신호를 만드는 통합 검증까지 self-test에 넣으면 배포 코드가 커지므로 구현 작업에서 별도로 실행한다.

- 같은 줄과 여러 줄의 반복 출현
- `aaa`에서 `aa`처럼 겹치는 출현
- `경계`, `경계를`, `보안경계`의 substring 출현
- code fence, inline code, link, image, HTML comment와 front matter 안의 출현
- 첫 BOM, LF, CRLF와 단독 CR
- 후보 앞의 한글과 보조평면 Unicode 문자
- context 경계에 걸친 보조평면 Unicode 문자
- 빈 후보, 고립 surrogate, 중복 식별자와 빠진 사례
- 결과 상한을 넘긴 뒤의 후보별 전체 개수, `truncated`와 불완전 종료

구현 작업의 통합 검증에서는 공백과 newline이 있는 파일명, staged, unstaged, untracked, rename, 삭제, 충돌, submodule, unborn branch, 비 UTF-8 경로, 잘못된 UTF-8 본문, NUL byte, symlink, 루트 밖 실제 경로, Git timeout, 일부 파일 읽기 실패, 사용자 중단과 느린 stdout 소비자에게 보낸 JSON의 byte 완결성을 확인한다.

실행 시점에 네트워크가 없어도 같은 결과가 나오는지 네트워크를 차단한 깨끗한 환경에서 확인해야 한다. Node.js와 Git의 지원 범위는 구현 전에 확정한다.

## 구현 전에 승인할 값

단일 파일 구조를 채택하려면 다음 값도 실제 저장소 자료를 측정하거나 실행 정책을 정한 뒤 승인해야 한다.

현재 [요구사항](../requirements.md#목표)은 후속 구현에서 새 파일을 만들지 않도록 정하지만 `skills/use-words-review`에는 대체할 기존 스크립트가 없다. 단일 검사기를 구현하려면 요구사항 소유자가 스크립트 한 파일 추가를 예외로 승인하거나 이번 후속 구현에서 검사기 도입을 제외해야 한다. 기존 Markdown 참고 자료를 실행 파일로 바꾸거나 그 안에 JavaScript를 넣으면 현재 자료의 역할과 설치 방식을 훼손하므로 대안이 아니다. 이 조사 문서는 요구사항 문구를 임의로 바꾸지 않는다.

- 지원할 Node.js와 Git의 최저 버전 및 운영체제
- 입력 파일 수, 파일 byte, stdin byte와 출력 후보 수 상한
- 활용형을 포함한 초기 `ruleId`, literal과 기계화하지 않을 기준의 전체 목록
- 표준 입력을 첫 구현에 포함할지 여부
- 후보 목록을 바꿀 때 `korean.md`와 스크립트 내용을 함께 승인할 책임자

## 조사 범위와 한계

공식 문서와 Vale 3.17.0, textlint 15.8.0, reviewdog 0.21.0의 실제 소스를 확인했다. 완성된 기존 도구가 없다는 판단은 이 공개 범위와 조사 시점에 한정된다.

이번 작업은 스크립트, package file, bundle과 테스트를 만들거나 외부 의존성을 설치하지 않았다. 후속 구현은 이 문서의 단일 파일 구조와 [요구사항](../requirements.md)을 먼저 승인한 뒤 진행해야 한다.
