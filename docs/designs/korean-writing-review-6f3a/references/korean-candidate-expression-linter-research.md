# 한국어 후보 표현 검사 도구 조사

## 결론

2026년 8월 4일 기준 권고안은 **구조화된 후보 자료를 textlint 사용자 규칙으로 검사하고, AI에는 textlint MCP 또는 JSON formatter로 진단을 전달하는 방식**이다. 후보 표현, 검토 이유, 문제 사례와 정상 사례를 규칙별 자료로 관리하면 AI가 각 출현을 문맥에 따라 판정할 수 있다. Pull Request나 변경 줄에 결과를 표시해야 할 때만 reviewdog를 뒤에 연결한다.

Vale도 모든 출현과 위치, 설명, 링크를 출력할 수 있다. 다만 후보별 정보를 YAML 규칙의 문자열 필드에 넣어야 하며, AI가 호출할 MCP와 구조화된 추가 데이터 필드가 없다. 커스텀 스크립트는 출력 형식을 가장 자유롭게 정할 수 있지만 Markdown 구문, 위치 계산, 제외 규칙, Git 상태와 표준 입력 처리를 직접 유지해야 한다. reviewdog는 표현을 찾지 않으므로 단독 대안이 아니다.

현재 저장소에는 실행 가능한 검사기가 없다. 어느 선택지를 쓰더라도 산문으로 작성된 `korean.md`와 기계가 읽는 후보 자료의 관계를 먼저 정해야 한다. 이 문서는 [한국어 문서 검토 재발 방지 요구사항의 목표](../requirements.md#목표) 가운데 기계 검사와 의미 검토의 분담을 후속 작업에서 판단할 수 있도록 네 선택지를 비교한다. 독자는 `use-words-review` 검사기를 설계하거나 승인할 담당자다. 이 문서는 구현이나 의존성 도입을 승인하지 않는다.

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

Vale는 이미 조직 표준으로 배포된 경우의 대안이다. 커스텀 스크립트는 raw text 전수 검사나 독자적인 진단 protocol이 필요한 경우의 대안이다. reviewdog는 어느 선택에서도 선택적 전달 계층이다.

## 구현 전에 정해야 할 사항

- **검사 단위:** 바뀐 파일 전체인지, 추가하거나 수정한 줄만인지 정해야 한다.
- **후보 자료의 기준:** `korean.md`에 기계 판독 구간을 둘지, 별도 구조화 자료를 둘지 정해야 한다.
- **정확한 원문도 경고할지:** 코드 블록, 인용문과 평가 입력에도 후보를 알릴지, 일반 산문만 검사할지 정해야 한다.
- **예시 반복 방식:** 모든 출현에 사례를 반복할지, 표현별 설명 한 건과 출현 위치 목록을 나눌지 정해야 한다.
- **실행 위치:** `use-words-review` 호출 중에만 실행할지, pre-commit이나 CI에도 연결할지 정해야 한다. 후보 발견을 실패로 바꾸는 동작은 별도 결정이 필요하다.

## 조사 한계

공식 문서, 최신 릴리스와 공개 저장소 소스에서 Vale, textlint, reviewdog, Git과 Node.js API를 확인했다. GitHub 코드 검색에서 한국어 후보 목록과 정상 용례를 함께 제공하는 같은 목적의 완제품은 찾지 못했지만, 검색 결과가 없다는 사실만으로 모든 비공개 도구와 이름이 다른 공개 구현의 부재를 증명할 수는 없다.

이번 조사는 도구 기능과 현재 저장소의 차이를 비교했다. 실제 한국어 문장, CRLF, 한 줄의 반복 출현, 이름 변경, 공백이 있는 파일명, 잘못된 인코딩과 표준 입력을 사용한 실행 평가는 구현이 승인된 뒤 수행해야 한다.
