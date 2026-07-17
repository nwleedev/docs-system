# 공개 산출물 검사를 여러 저장소에서 재사용하는 방법

## 조사 질문과 소유 범위

이 문서는 [요구사항 문서](../requirements.md)의 `요구사항`, `작업 지시 문구가 산출물의 내용과 구조를 대신하면 안 되는 경우`, `필요한 작업 및 변경사항`, `리뷰 에이전트`, `주의`에 해당하는 문제를 여러 저장소에서 반복해서 검사하는 데 필요한 사실을 조사한다. 번역체와 기계적인 표현, 작업 지시 원문의 혼입, 독자 부적합, 개인 경로와 비공개 식별자를 검사 대상으로 삼고, 검토 스킬과 Vale 설정을 배포하는 방법을 확인한다.

2026년 7월 17일을 기준으로 Vale, markdownlint, textlint를 비교하고, Git 커밋 전 검사와 범용 서브에이전트 검토를 결합하는 방법을 확인했다. 변경된 요구사항이 지정한 설계·개발 문서와 배포용 에이전트 지침의 현재 역할, 검토 스킬과 `src/vale` 구성의 필요성도 검토했다. 이 문서는 검사 체계의 구성과 운영만 맡는다. 문제 유형과 기존 사례는 [독자 혼동 조사](public-output-audience-research.md), [작업 지시와 산출물 출처 조사](prompt-intent-and-artifact-provenance-research.md), [한국어 문체 조사](natural-korean-and-ai-writing-research.md), [민감한 원문 조사](sensitive-input-preservation-research.md), [문서 제목과 결정 단위 조사](decision-record-scope-and-title-research.md)에 기록되어 있다.

아래의 구성은 조사 자료를 비교해 얻은 제안이며 사람이 승인한 설계 결정은 아니다.

## 결론

한 도구가 모든 문제를 판정하게 만들 수는 없다. 정규식으로 재현되는 표현과 문서 구조는 린터가 맡고, 독자에게 맞는 글인지와 작업 지시가 프로젝트 사실로 둔갑했는지는 범용 서브에이전트와 사람이 판단해야 한다. 원문과 절대 경로처럼 비교 기준이 분명한 항목은 Vale 규칙에 억지로 넣기보다 전용 결정적 검사로 처리하는 편이 낫다.

Vale는 공통 문장 규칙의 기본 엔진으로 적합하다. 단일 실행 파일로 여러 운영체제에서 실행할 수 있고, YAML 규칙 묶음을 패키지로 배포하며, Markdown의 제목·문단·목록과 코드 주석을 구분할 수 있다. 반면 markdownlint는 Markdown 구조, textlint는 Node.js 생태계의 문서 구문 트리 처리가 필요할 때 선택하는 보조 수단이다. 세 도구를 모든 저장소에 함께 설치할 근거는 없다.

재사용 단위는 특정 저장소의 CI 파일이 아니라 다음 네 부분이다.

1. 저장소가 검사 대상과 산출물 종류를 선언하는 얇은 설정
2. 공통 Vale 규칙과 결정적 검사를 배포하는 버전 고정 패키지
3. 의미 판단이 필요한 변경만 범용 서브에이전트에 맡기는 검토 스킬
4. 로컬, 커밋 전, CI, 정기 전체 검사에서 같은 명령을 호출하는 실행기

## 검사 책임을 나누는 기준

| 검사 대상 | 먼저 맡을 수단 | 자동 차단 가능성 |
| --- | --- | --- |
| 금지된 제어 문자, 개인 계정이 드러나는 절대 경로, 알려진 비밀 값 형식 | 결정적 검사 | 패턴의 의미와 예외가 명확할 때 차단 |
| 같은 작업 중 제공된 원문과 긴 문자열이 그대로 겹치는지 | 원문을 보관하지 않는 일시 비교 | 정확히 일치하고 보존 대상이 아닐 때 차단 후보 |
| 반복해서 발견된 기계적 표현, 잘못된 용어, 문장부호 | Vale | 오탐이 낮아진 규칙만 차단 |
| 제목 단계, 줄 길이, 잘못된 Markdown 구조 | markdownlint 선택 적용 | 구조 규칙이 합의된 저장소에서 차단 |
| 특정 파일 형식의 구문 트리나 기존 textlint 규칙 활용 | textlint 선택 적용 | 해당 규칙의 오탐을 검증한 뒤 차단 |
| 독자에게 맞는 글인지, 작업 보고가 섞였는지, 한 문서가 여러 결정을 묶었는지 | 범용 서브에이전트를 실행하는 검토 스킬 | 기본적으로 판정 근거를 제시하고 사람에게 넘김 |
| 공개해도 되는 인용인지, 문구의 제품 의미가 맞는지 | 사람 | 사람이 최종 결정 |

이 분리는 결정적 검사, 모델 평가, 사람 평가를 함께 사용하되 가능한 항목은 결정적으로 채점하라는 [Anthropic의 에이전트 평가 지침](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)과 맞는다. 같은 자료는 모델 평가가 사람 판단과 어긋나지 않는지 교정하고, 정보가 부족하면 판정을 보류할 수 있게 하라고 설명한다. 따라서 검토 에이전트의 결과를 린터 오류처럼 곧바로 차단 신호로 취급하면 안 된다.

## 텍스트 검사 도구 비교

### Vale

[Vale 공식 문서](https://vale.sh/docs/styles)는 규칙을 `.yml` 파일로 작성하고 `suggestion`, `warning`, `error` 심각도와 적용 대상을 지정한다고 설명한다. [패키지 문서](https://vale.sh/docs/keys/packages)는 스타일과 설정을 ZIP 또는 디렉터리로 배포하고 `vale sync`로 대상 저장소의 `StylesPath`에 설치하는 방법을 제공한다. 뒤에 읽은 패키지와 저장소 로컬 설정이 앞선 설정을 덮으므로, 공통 규칙 뒤에 프로젝트 예외를 두는 구성이 가능하다.

Vale가 문장의 의미를 이해하는 것은 아니다. `existence`와 `substitution` 같은 검사는 정규식으로 잡을 수 있는 후보를 찾는다. 그러므로 “이 문장은 작업 지시자에게 보내는 보고인가”처럼 앞뒤 맥락이 필요한 질문을 Vale 규칙 하나로 바꾸면 오탐이 늘어난다.

### markdownlint

[markdownlint 공식 저장소](https://github.com/DavidAnson/markdownlint)는 Markdown과 CommonMark 문법 및 문서 구조를 검사하는 도구라고 범위를 밝힌다. 제목 단계, 목록, 공백처럼 형식으로 판정되는 문제에는 적합하지만, 한국어 번역투나 독자 혼동을 판정하지 않는다. Vale와 검사 책임이 달라서 Markdown 구조 검사가 필요한 저장소만 추가하면 된다. GitLab도 편집기에서 Vale 다음에 markdownlint를 실행하는 예를 제공하지만, 두 도구를 하나의 규칙 엔진으로 취급하지 않는다.

### textlint

[textlint 시작 문서](https://textlint.org/docs/getting-started/)는 본체에 실질적인 문장 규칙이 포함되지 않으며 사용자가 규칙 패키지를 설치해야 한다고 설명한다. 최신 릴리스 `v15.7.1`의 [패키지 명세](https://github.com/textlint/textlint/blob/91ffc5947325f0a9d0500b889550a1b4d232f5f1/packages/textlint/package.json)는 Node.js 20 이상을 요구한다. Node.js를 사용하지 않는 저장소에도 실행 환경, 패키지 설치, 잠금 파일 또는 이를 감싼 별도 실행 수단이 필요해진다.

문서 구문 트리와 플러그인, JavaScript 또는 TypeScript로 만든 사용자 규칙이 필요한 경우에는 Vale보다 세밀하게 확장할 수 있다. 그 대가로 규칙 코드의 빌드·테스트와 textlint 규칙 API 호환성 관리가 따라온다. 다른 파일 형식을 추가하려면 원문을 textlint AST로 바꾸고 검사 결과의 파일 위치를 복원하는 처리 플러그인이 필요하다. [textlint 플러그인 문서](https://textlint.org/docs/plugin/)는 이 책임을 `preProcess`와 `postProcess`로 정의한다.

[textlint 설정 문서](https://textlint.org/docs/configuring/)는 공유 설정 모듈을 명령줄의 `--config`로 지정할 수 있지만 `.textlintrc` 안에서 다른 설정을 불러오는 방식은 아직 지원하지 않는다고 밝힌다. 공통 설정과 저장소별 예외를 합치려면 공통 규칙 프리셋을 별도 패키지로 만들거나 실행기가 설정 조합을 맡아야 한다. 규칙의 기본 심각도도 `error`이므로 후보 규칙을 점진적으로 도입할 때에는 `info`나 `warning`을 명시해야 한다.

[textlint 공식 규칙 모음](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule)은 영어·일본어·중국어·아랍어 규칙을 별도 분류하지만 한국어 분류를 제공하지 않는다. 이는 외부에 한국어 규칙이 전혀 없다는 증거는 아니지만, 이 요구사항에 바로 적용할 수 있는 공식 한국어 프리셋을 전제로 삼을 수 없다는 뜻이다. 기존 textlint 규칙을 재사용하거나 Vale로 읽기 어려운 형식을 처리해야 한다는 근거가 생기기 전에는 공통 기본 도구로 둘 이유가 부족하다.

### 한국어 처리 도구

[LanguageTool의 공식 지원 언어 목록](https://help.languagetool.org/hc/en-us/articles/39254526141463-What-languages-does-LanguageTool-support)에는 한국어가 포함되지 않는다. [Kiwi](https://github.com/bab2min/kiwi)와 [kiwipiepy](https://bab2min.github.io/kiwipiepy/)는 한국어 형태소 분석과 띄어쓰기·오타 교정 기능을 제공하지만, 문서의 독자나 작업 보고 여부를 판단하는 도구는 아니다. 형태소 정보가 있어야만 잡을 수 있는 반복 실패가 확인될 때 선택형 검사기로 검토할 수 있다.

## Vale 설정을 재사용하는 방법

### 공통 패키지와 저장소 설정을 분리한다

공통 저장소는 한 개의 스타일 폴더와 규칙 파일, 규칙 설명, 검증 자료를 담은 스타일 전용 패키지를 배포할 수 있다. 적용받는 저장소는 `.vale.ini`에 패키지 위치, `StylesPath`, 검사할 확장자, 활성화할 스타일을 기록한다. 공식 패키지 형식은 URL, 로컬 ZIP, 디렉터리를 모두 허용하므로 배포 방식은 특정 CI 서비스에 묶이지 않는다.

개념적인 소비자 설정은 다음 책임만 보여준다. 실제 이름, 배포 주소, 버전은 설계 결정 뒤에 정해야 한다.

```ini
StylesPath = .cache/vale/styles
Packages = <versioned-style-package>

[*.md]
BasedOnStyles = <shared-style>
```

`vale sync`가 받은 패키지는 다시 만들 수 있는 산출물이므로 버전 관리에서 제외하고, `.vale.ini`와 버전 고정 정보는 추적한다. Vale 공식 문서도 패키지에서 설치된 구성 요소를 버전 관리 제외 대상으로 권한다.

### 실행 파일과 규칙 패키지의 버전을 따로 고정한다

조사 시점의 Vale 최신 릴리스는 `v3.15.1`이며 태그가 가리키는 커밋은 `8c4ed0df90e45f93818ffed5ba587ff1e220a142`이다. 공식 릴리스는 Linux, macOS, Windows용 실행 파일과 체크섬을 제공한다. 재현 가능한 실행을 위해 Vale 실행 파일 버전과 공통 규칙 패키지 버전을 별도로 고정해야 한다. 규칙만 바뀐 실패와 엔진이 바뀐 실패를 구분할 수 있기 때문이다.

[Vale 공식 GitHub Action](https://github.com/vale-cli/vale-action/blob/85f9f7f2c5f449ac0ae5b66662961bae3f77ca6a/action.yml)의 `2.1.2` 설정은 Vale 버전의 기본값을 `latest`, 오류 발생 시 실패 여부의 기본값을 `false`로 둔다. 그대로 사용하면 실행 시점에 따라 엔진이 바뀌거나 오류가 있어도 작업이 성공할 수 있다. Action을 채택하는 저장소는 Action 커밋, Vale 버전, 검사 파일, 실패 조건을 명시해야 한다. 다른 CI에서는 같은 실행기 명령을 호출하면 된다.

### 로컬과 CI가 같은 설정을 읽게 한다

공통 실행기는 전역 Vale 설정의 영향을 배제하고 저장소의 `.vale.ini`를 명시해야 한다. 작성 중에는 `suggestion`까지 보여주되 종료 코드를 실패로 바꾸지 않고, CI에서는 승인된 `error`만 차단하는 방식으로 시작할 수 있다.

```sh
vale --config=.vale.ini --no-global --minAlertLevel=suggestion --no-exit README.md docs/
vale --config=.vale.ini --no-global --minAlertLevel=error README.md docs/
```

이 명령의 경로는 예시다. 각 저장소는 공개 산출물이 있는 경로와 확장자를 선언해야 한다. 코드에 들어 있는 UI 문자열이나 JSON 번역 파일이 `README.md`와 `docs/`에 있다는 가정을 공통 패키지가 해서는 안 된다.

### 한국어 규칙은 단어 경계를 직접 검증한다

Vale의 `tokens`는 기본적으로 단어 경계를 더한다. Vale가 기초로 삼는 [Go 정규식 문서](https://pkg.go.dev/regexp/syntax)는 `\b`와 `\w`를 ASCII 기준으로 정의한다. 한글 표현을 영어 단어와 같은 방식으로 감싸면 기대한 위치를 찾지 못할 수 있다. 한국어 규칙은 `nonword: true`를 사용하거나 `raw` 정규식을 명시하고, 조사한 실제 문장과 허용 문장으로 동작을 확인해야 한다.

### 검사할 수 없는 파일을 설정에서 드러낸다

[Vale 범위 문서](https://vale.sh/docs/scopes)는 Markdown 제목·문단·목록·대체 텍스트와 코드의 줄·블록 주석을 구분한다. Markdown 코드 블록, 코드 구간, URL 등은 일반 문장과 다르게 처리한다. 이 기능만으로 JSX나 TSX의 사용자 문구가 자동으로 문장 검사를 받는 것은 아니다. 구조화된 JSON·YAML은 [Vale Views](https://vale.sh/docs/views)로 필요한 값을 추출할 수 있고, 소스 코드 문자열은 별도 추출기 또는 해당 언어의 구문 트리 처리가 필요하다.

따라서 저장소별 설정은 “검사하는 경로”뿐 아니라 “아직 추출하지 못하는 공개 문자열”도 알려야 한다. 누락을 Vale 통과로 오해하지 않게 하기 위해서다.

## 문제 후보를 규칙으로 키우는 절차

문제 표현 목록을 처음부터 완성하려 하면 모든 프로젝트의 문체와 예외를 수집해야 한다. 대신 실제로 확인된 실패를 다음 순서로 규칙화할 수 있다.

1. 사람이 문제인 이유와 해당 산출물의 독자를 확인한다.
2. 정규식으로 안정적으로 판정되는지, 의미 검토가 필요한지 분류한다.
3. 원문과 민감한 경로를 제거한 최소 실패 예시를 만든다.
4. 문제가 없는 비슷한 문장과 허용해야 하는 예외를 함께 둔다.
5. 새 Vale 규칙을 `suggestion` 또는 결과만 수집하는 상태로 여러 종류의 저장소에서 실행한다.
6. 오탐과 놓친 사례를 확인하고 규칙을 줄이거나 고친다.
7. 수정 방법이 분명하고 기존 위반을 정리한 규칙만 `warning`, 이후 필요하면 `error`로 올린다.

[GitLab의 Vale 운영 문서](https://docs.gitlab.com/development/documentation/testing/vale/)는 오류 규칙을 추가하기 전에 기존 위반을 고치고, 한 번에 정리하기 어렵다면 경고로 먼저 도입한 뒤 오류로 승격한다고 설명한다. 문맥에 따라 자주 허용되는 주관적 규칙은 불필요한 경고를 만들 수 있다고도 지적한다. 이는 후보를 필요할 때마다 보충하되 곧바로 차단 규칙으로 만들지 말아야 한다는 실제 운영 근거다.

[Red Hat 문서 팀의 Vale 규칙 검증 스크립트](https://github.com/redhat-documentation/vale-at-red-hat/blob/bf4a628e07a9a9c4416760e96249d31e0134cba8/tools/validate-vale-rules.sh)는 정상 예시에서 경고가 없어야 하고 잘못된 예시의 예상 줄에서 규칙이 발생해야 한다고 검사한다. [Datadog의 Vale 기여 지침](https://github.com/DataDog/datadog-vale/blob/a6a543b8aadf2c2b09005207c560c061d3ff0bca/CONTRIBUTING.md)은 반복되는 문제와 널리 유용한 규칙을 받되 스타일 가이드의 모든 항목을 규칙으로 만들지는 않는다고 밝힌다. 두 사례 모두 “규칙 수”보다 실제 실패와 검증 예시를 규칙의 근거로 삼는다.

규칙 예시에 작업 지시 원문이나 개인 경로를 그대로 넣으면 검사 자료가 새로운 유출 경로가 된다. 재현에 필요한 구조만 남긴 가상 문장을 사용하고, 원문 보존이 필요한 평가 자료는 접근 권한과 보존 기간이 있는 별도 저장소에서 관리해야 한다.

## 원문, 경로, 커밋 메시지 검사는 Vale와 분리한다

작업 지시 원문과 산출물의 정확한 중복은 같은 작업 세션에서만 비교할 수 있다. CI가 원문을 받지 않는다면 사후에 정확한 복사를 판정할 기준이 없다. 이 검사를 위해 원문을 저장소나 CI 로그에 보관하면 막으려던 유출을 새로 만든다.

원문 비교가 필요한 작업에서는 원문을 디스크에 남기지 않는 실행기가 긴 연속 문자열이나 정규화한 조각의 정확한 일치를 검사할 수 있다. 짧은 공통 표현과 흐릿한 유사도는 증거가 약하므로 차단이 아니라 검토 후보로만 사용한다. 원문을 보존해야 하는 요구사항, 승인된 인용, 평가 자료에는 산출물 종류 표시를 통해 검사를 적용하지 않아야 한다.

절대 경로, 제어 문자, 비밀 값 형식, 커밋 제목 형식은 입력 원문이 없어도 결정적으로 검사할 수 있다. Git의 [훅 문서](https://git-scm.com/docs/githooks)는 `pre-commit`이 커밋 생성 전에 파일을 검사하고, `commit-msg`가 제안된 커밋 메시지 파일을 받아 거부할 수 있다고 설명한다. 두 훅은 `--no-verify`로 건너뛸 수 있으므로 로컬 훅만으로 공개를 막았다고 볼 수 없다. 같은 결정적 검사를 CI나 서버 측 검사에서도 실행해야 한다.

모델 검토를 `commit-msg` 안에서 직접 호출하는 방식은 권장하기 어렵다. 네트워크와 모델 응답 시간 때문에 커밋 동작이 불안정해지고, 같은 입력에도 결과가 달라질 수 있기 때문이다. 커밋 전에는 후보 메시지와 스테이징된 변경을 검토 에이전트에 함께 넘기고, 훅은 그 뒤에 확정된 메시지의 형식과 민감 문자열만 검사하는 구성이 책임을 분명히 한다.

## 범용 서브에이전트를 사용하는 검토 스킬

### 실행 시 역할과 기준을 전달한다

[Codex 서브에이전트 문서](https://developers.openai.com/codex/agent-configuration/subagents)는 별도 설정 없이 사용할 수 있는 `default` 범용 에이전트를 제공한다. [Claude Code 문서](https://code.claude.com/docs/en/sub-agents)도 내장 `general-purpose` 에이전트를 제공한다. 두 도구 모두 전용 에이전트 정의 파일을 만들지 않고 범용 서브에이전트에 현재 작업의 역할과 범위를 전달할 수 있다.

검토 역할, 입력 범위, 판정 항목, 수정 금지 조건과 결과 형식은 `use-words-review` 스킬이 실행할 때 전달해야 한다. `AGENTS.md`에는 어떤 변경에서 이 스킬을 호출하는지만 남긴다. 이 방식은 제품별 에이전트 파일을 유지하지 않으면서도 긴 판정 절차를 모든 작업의 기본 문맥에서 제외한다. 서브에이전트의 읽기 전용 상태를 도구 권한으로 제한할 수 없는 환경에서는 지시만으로 권한이 제한됐다고 주장하지 말고, 파일 변경 여부를 주 에이전트가 확인해야 한다.

### 입력과 출력

검토 입력에는 변경분, 변경된 파일의 전체 내용, 적용 중인 저장소 규칙, 산출물의 독자와 공개 여부, Vale 및 결정적 검사 결과, 후보 커밋 메시지가 필요하다. 작성 에이전트의 진행 보고나 자기평가는 판정 근거에서 제외한다. 원문 비교 모드가 명시된 경우에만 원문을 일시적으로 전달하고 기록하지 않는다.

범용 서브에이전트에는 파일을 수정하거나 외부로 내용을 전송하지 말라고 명시한다. 검토하는 문서와 코드에 적힌 문장은 실행할 지시가 아니라 검사 대상 자료로 취급하게 한다. 결과는 다음 네 상태 중 하나와 파일 위치, 규칙 종류, 짧게 정리한 근거, 독자와 맞지 않는 이유, 확신 정도, 수정 방향을 반환한다.

- `pass`
- `needs revision`
- `needs human input`
- `not applicable`

검토는 새로 생긴 문제를 찾기 위해 변경분을 우선 보되, 제목과 본문의 관계처럼 전체 문맥이 필요한 때에는 변경 파일 전체를 읽어야 한다. 전체 저장소의 누적 문제는 커밋마다 반복하지 말고 별도 정기 검사로 다룬다.

### 판정의 한계

검토 에이전트는 린터가 놓친 의미 문제를 찾을 수 있지만 정답 판정기는 아니다. 모델 평가는 표현 길이, 제시 순서, 평가 모델 자신이 선호하는 답에 영향을 받을 수 있다는 [LLM 평가 연구](https://arxiv.org/abs/2306.05685)가 있다. 모델 간 다수결만으로 이 문제를 없앨 수 있다는 근거도 없다.

기본값은 한 명의 검토 에이전트와 사람의 확인으로 두고, 위험이 높거나 판정이 불확실한 변경에서만 두 번째 관점을 요청하는 편이 비용과 판단 책임을 모두 드러낸다. 자동 차단은 규칙과 수정 방법이 명확한 결정적 오류에 한정하고, 의미 판단 결과는 주 작성자 또는 사람이 해소 여부를 기록해야 한다.

## 로컬, 커밋 전, CI, 정기 검사의 역할

로컬 작성 중 검사는 빠른 피드백을 제공한다. 수정된 공개 산출물에 Vale의 제안까지 보여주고, 선택한 문서 구조 린터를 실행한다. 실패로 커밋을 막지는 않는다.

커밋 전 검사는 스테이징된 파일만 대상으로 결정적 오류와 승격된 Vale 오류를 확인한다. 후보 커밋 메시지가 있으면 읽기 전용 검토를 커밋 명령 밖에서 먼저 실행한다. 훅은 선택적 편의 기능이며 유일한 통제 지점이 아니다.

CI는 같은 실행기를 깨끗한 환경에서 다시 호출한다. 패키지와 엔진 버전이 고정됐는지, 설정된 공개 산출물이 실제로 검사됐는지, 오류 규칙이 발생했는지를 확인한다. 변경분만 보는 빠른 검사와 전체 저장소 검사를 구분해야 기존 문제 때문에 새 변경을 영구히 막지 않는다.

정기 검사는 전체 저장소, 규칙 패키지 업데이트, 아직 추출하지 못한 파일 형식, 경고 누적을 확인한다. OpenAI의 [Harness engineering 사례](https://openai.com/index/harness-engineering/)도 반복되는 검토 의견을 전용 린터와 구조 검사로 바꾸고, 문서 상태를 정기적으로 점검하는 작업을 별도로 운영했다고 설명한다. 이는 검토 에이전트가 영구히 같은 지적을 반복하기보다 확인된 패턴을 결정적 검사로 옮기는 순환을 뒷받침한다.

## 대규모 평가 자료 없이 검증하는 방법

모든 프로젝트 유형을 대표하는 거대한 평가 자료가 없어도 첫 규칙을 검증할 수 있다. 각 규칙마다 최소 실패 예시, 비슷하지만 허용되는 예시, 필요한 예외 하나를 두고 실제로 다시 발생한 사례를 회귀 자료에 추가한다. 규칙 식별자, 심각도, 발생 위치도 함께 확인해야 다른 규칙이 우연히 같은 문장을 잡은 것을 성공으로 세지 않는다.

새 규칙 묶음은 문서 중심 저장소, 애플리케이션 코드와 문서가 함께 있는 저장소, 자료 수집 결과를 보관하는 저장소처럼 성격이 다른 소수의 대상에서 차단 없이 실행할 수 있다. 사람이 오탐과 놓친 문제를 표본 검토한 뒤에만 심각도를 올린다. 몇 개 저장소와 몇 건의 표본이면 충분한지는 예상 사용처와 허용 가능한 오탐 비용에 따라 달라지므로 사람이 정해야 한다.

검토 에이전트도 같은 자료로 교정하되 Vale와 같은 정확 일치 결과만 기대해서는 안 된다. 각 항목의 판정 이유와 `needs human input` 사용 여부를 사람이 비교하고, 평가표가 너무 넓으면 독자 적합성·원문 혼입·민감정보처럼 항목별로 나눠 평가한다.

## 지정된 저장소 파일에 미치는 영향

요구사항의 `필요한 작업 및 변경사항`이 지정한 파일을 현재 브랜치에서 다시 확인했다. 아래 내용은 현재 역할과 조사 결과를 비교한 분석이다.

| 검토 대상 | 현재 저장소에서 맡는 역할 | 변경 필요성에 관한 분석 |
| --- | --- | --- |
| `skills/use-design-docs/SKILL.md` | `docs/designs/README.md`를 설계 문서의 단일 기준으로 사용하고 Review·Research·Record·Plan·Validate 순서를 조정한다. | 지금 바로 고칠 근거는 부족하다. 공개 산출물의 출처 규칙은 이 스킬에 복사하지 말고 먼저 `docs/designs/README.md`가 소유해야 한다. README가 새 검사를 정의한 뒤에도 스킬의 기존 Validate·Finish 절차로 호출되지 않는 검사가 있을 때만 어댑터를 바꾼다. |
| `skills/use-dev-guidance/SKILL.md` | `docs/dev/README.md`를 기준으로 저장소 증거, 외부 조사, 검사 선택과 개발 지침 작업을 연결한다. | 지금 바로 고칠 근거는 부족하다. 개발 지침에서 작업 지시를 근거로 쓰지 않는 규칙은 `docs/dev/README.md`가 먼저 소유해야 한다. 스킬에는 그 규칙을 되풀이하지 않는다. |
| `docs/designs/README.md` | 사람이 소유하는 요구사항과 파생된 참고 자료·결정·계획의 책임, 근거, 검증 방법을 정한다. | 원문 보존 예외와 파생 문서의 출처·독자 검사를 포함한다. 후속 스킬은 이 규칙을 복사하지 말고 현재 저장소의 README를 검사 입력으로 사용해야 한다. |
| `docs/dev/README.md` | 반복해서 사용할 저장소별 개발 지침의 근거, 상태, 소유 문서와 검사 방법을 정한다. | 작업 지시를 현재 규칙의 근거로 사용하지 않는 조건과 공개 전 검사를 포함한다. 후속 스킬은 개발 지침을 검토할 때 이 README를 적용해야 한다. |

현재 요구사항은 `src/AGENTS.en.md`와 `src/AGENTS.ko.md`를 검토·변경 대상으로 지정하지 않는다. 대상 저장소의 AGENTS에 스킬을 연결하는 방법은 `skills/use-words-review/README.md`가 소유하므로, 같은 안내를 두 참고 문서에 복사할 필요가 없다.

## 스킬 실행 파일과 사람용 안내 문서를 구분한다

[OpenAI의 스킬 문서](https://developers.openai.com/codex/skills)와 [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)는 작업에 맞을 때 불러오는 전용 지침과 필요한 자료·스크립트를 스킬에 묶을 수 있다고 설명한다. Anthropic의 [Agent Skills 설계 사례](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)는 처음부터 모든 지침을 문맥에 넣지 않고 작업에 필요한 자료를 단계적으로 읽는 방식을 제시한다. 공개 산출물 검사는 설계 문서, 개발 지침, 코드, UI 문구, 커밋 메시지를 함께 다루므로 기존 두 문서 어댑터 중 하나에 넣으면 적용 대상이 어긋난다.

별도 스킬은 다음 작업을 실제로 연결할 때 가치가 있다.

- 변경된 공개 산출물과 산출물별 독자 정보를 수집한다.
- 결정적 검사와 선택한 텍스트 린터를 같은 입력에 실행한다.
- 의미 검토가 필요한 변경만 범용 서브에이전트에 전달한다.
- 검사 결과와 사람이 판단해야 할 항목을 정해진 상태로 반환한다.

반대로 기존 AGENTS의 공개 전 검사 목록을 스킬 실행 절차에 그대로 옮기면 같은 규칙의 소유 문서가 늘어난다. 대상 저장소의 `AGENTS.md`에는 상시 적용할 작성·공개 원칙과 채택된 스킬의 호출 조건을 두고, 스킬 README는 사용자가 해당 지침을 자신의 AGENTS에 적용할 수 있는 기본 문구와 병합 방법을 안내하는 구성이 [AGENTS.md 공개 형식](https://agents.md/)의 저장소 지침 역할과 OpenAI의 [짧은 진입 문서 사례](https://openai.com/index/harness-engineering/)에 맞는다.

[Agent Skills 명세](https://agentskills.io/specification), [Codex 스킬 문서](https://developers.openai.com/codex/skills), [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)는 모두 `SKILL.md`를 실행 진입점으로 사용한다. 자동 호출은 `SKILL.md`의 `description`을 기준으로 판단하며, 보조 자료는 `SKILL.md`가 필요할 때 읽도록 연결한다. 따라서 요구사항에 추가된 `README.md`는 스킬의 실행 절차가 아니라 사람을 위한 설치와 저장소 통합을 맡는다. 사용자가 별도 참고 문서를 찾아 조합하지 않아도 되도록 `Writing Natural Korean`, 공개 산출물의 독자·출처, 작업 지시 문구와 개인 경로의 제외, 공개 전 스킬 호출에 관한 완성된 AGENTS 기본안을 제공해야 한다. `SKILL.md`는 README를 먼저 읽지 않아도 실행 가능해야 한다.

Superpowers 리비전 `d884ae0`과 Compound Engineering 리비전 `32fae6c`의 `skills/` 트리를 확인한 결과, 두 프로젝트는 각 스킬의 `SKILL.md`와 필요한 참고 자료를 실행 단위로 관리하며 스킬마다 README를 두지 않는다. 이는 이번 README가 실행 형식의 관례가 아니라 이 저장소가 여러 프로젝트에 배포하는 방법을 설명하기 위한 요구사항임을 뒷받침한다.

`AGENTS.md`의 상세한 한국어 표현 예시를 전부 옮기는 것은 아직 근거가 부족하다. AGENTS 지침은 모든 작업에서 읽히지만 스킬 본문과 `examples.md`는 스킬이 호출된 뒤에만 읽힌다. 작성 단계에서도 필요한 독자·근거·자연스러운 문장 원칙은 AGENTS에 남기고, 긴 표현 대응표와 실패·허용 예시는 `examples.md`로 옮길 수 있는지 항목별로 검토해야 한다. 예시를 옮긴 뒤 스킬이 호출되지 않은 작성 작업에서 기존 예방 효과가 사라진다면 이동하지 않는다.

## `src/vale`에 저장할 수 있는 내용

Vale를 공통 문장 규칙 엔진으로 선택한다면 요구사항이 지정한 `src/vale`에는 배포 전 원본 규칙, 검증 자료, 설정 방법을 설명하는 README를 둘 수 있다. Vale 공식 패키지는 ZIP뿐 아니라 로컬 디렉터리와 외부 URL도 받을 수 있으므로 저장소에 ZIP 파일을 추적할 필요는 없다. ZIP이 배포에 필요해지더라도 추적하는 원본이 아니라 버전이 붙은 릴리스 산출물로 만들 수 있다.

`src/vale/README.md`는 최소한 다음 정보를 설명해야 한다.

- 지원하는 Vale 버전과 규칙 묶음의 버전
- 원본 규칙을 대상 저장소의 `StylesPath`에 설치하거나 `Packages`로 불러오는 방법
- 대상 저장소가 활성화할 스타일과 검사 경로를 설정하는 방법
- 정상 예시와 실패 예시를 검사하는 명령
- 생성된 패키지와 동기화된 캐시를 버전 관리에서 제외하는 방법

정확한 하위 디렉터리와 규칙 이름은 첫 규칙 후보와 검증 방식을 정한 뒤 결정해야 한다. Vale와 textlint 가운데 공통 기본 도구를 승인하지 않은 상태에서 `src/vale`을 먼저 만들면 도구 선택을 문서 구조가 대신하게 된다.

## 적용 제안

조사 자료를 바탕으로 한 첫 단계 제안은 다음과 같다. 아직 승인된 설계가 아니며 실제 파일 구조와 명령 이름은 별도 결정이 필요하다.

1. 공통 실행기, 선택한 텍스트 규칙 묶음, 결정적 검사 모듈, 검토 항목 원본을 이 저장소가 소유한다.
2. 대상 저장소는 공개 산출물 경로, 제외 경로, 원문 보존 산출물, 사용할 선택형 어댑터만 선언한다.
3. Vale를 선택한다면 실제로 확인된 소수의 규칙을 제안 수준으로 배포하고, 개인 절대 경로와 명백한 제어 문자처럼 판정이 분명한 검사만 오류로 둔다.
4. `AGENTS.md`에는 검토 호출 조건만 두고, `use-words-review`가 실행할 때 범용 서브에이전트에 수정 금지 조건과 판정 형식을 전달한다.
5. 로컬 훅과 CI는 공통 실행기를 호출하고, CI 공급자별 파일에는 실행기 설치와 호출만 남긴다.
6. 사람이 확인한 반복 지적은 익명화한 검증 자료와 함께 결정적 규칙 후보로 되돌린다.

이 구성은 특정 언어, 패키지 관리자, CI 공급자를 모든 저장소에 강요하지 않는다. Vale를 기본으로 정한다면 Vale가 읽을 수 없는 공개 문자열이 있는 저장소만 추출기나 textlint 어댑터를 추가하고, Markdown 구조 규칙이 필요한 저장소만 markdownlint를 선택한다. textlint를 기본으로 정한다면 Node.js 20 이상과 규칙 패키지 설치를 공통 실행기 내부에서 관리하고, 대상 저장소의 애플리케이션 의존성과 분리해야 한다.

## 한계와 사람이 결정해야 하는 질문

- 공통 문장 규칙의 기본 엔진을 Vale로 정할지, Node.js와 구문 트리 처리 비용을 감수하고 textlint로 정할지 결정되지 않았다.
- 공통 패키지가 처음 지원할 운영체제와 설치 방식은 정해지지 않았다.
- 첫 적용 저장소와 공개 산출물 경로 선언 형식은 정해지지 않았다.
- 어떤 원문 보존 산출물을 표시하고 누가 예외를 승인할지 정해지지 않았다.
- 경고를 오류로 올릴 오탐 기준과 표본 수는 정해지지 않았다.
- UI 문자열, 번역 파일, 코드 주석 가운데 첫 버전이 어디까지 추출할지 정해지지 않았다.
- Codex와 Claude Code 외 도구에서 범용 서브에이전트를 선택하고 역할을 전달하는 방법은 정해지지 않았다.
- 검토 에이전트 호출 비용과 지연을 허용할 변경 범위는 정해지지 않았다.
- 자동 호출의 상세 범위와 비용이 큰 변경에서 적용할 예외는 실제 스킬 검증을 거쳐야 한다.

이 질문들은 요구사항을 바꾸지는 않지만 구현 범위와 운영 비용을 바꾼다. 사람이 선택하기 전에는 `plan.md`나 결정 기록에 확정된 내용으로 옮기면 안 된다.

## 요구사항과 후속 설계에 미치는 영향

이번 조사로 `requirements.md`를 수정할 필요는 없다. 조사 결과는 하나의 만능 린터를 요구사항으로 추가하기보다, 기계적으로 판정할 수 있는 문제와 의미 판단이 필요한 문제를 나누는 설계가 필요하다는 근거를 제공한다.

후속 작업은 먼저 `use-words-review`의 호출 조건, 범용 서브에이전트 입력, 판정 형식과 사람용 설치 안내를 구현해야 한다. 그 뒤 공통 텍스트 검사 도구, 공통 패키지의 첫 지원 범위, 대상 저장소 선언 방식과 규칙 승격 기준을 결정하고 `src/vale` 작업을 구체화할 수 있다.

## 조사 반복과 중단 근거

Vale와 textlint의 설치·규칙·패키지·적용 범위 공식 문서, Git 훅 공식 문서, Codex와 Claude Code의 스킬 및 검토 에이전트 문서, 실제 텍스트 규칙을 운영하는 조직의 설정과 소스, 에이전트 평가 자료를 교차 확인했다. 지정된 저장소 파일의 현재 역할도 같은 리비전에서 비교했다. 도구마다 맡을 수 있는 검사, 규칙 배포 방법, 오탐을 줄이는 승격 절차, 모델 검토의 한계가 반복해서 같은 방향을 가리켰다.

추가 검색은 개별 규칙 후보와 특정 대상 저장소의 파일 형식을 정할 때 필요하다. 현재 질문인 “어떤 검사 층을 어떤 순서로 재사용할 수 있는가”에는 새 출처가 구조를 바꿀 가능성이 낮아 조사를 중단했다.

## 검토한 출처와 시점

- Vale 공식 문서: [설치](https://vale.sh/docs/install), [CLI](https://vale.sh/docs/cli), [스타일](https://vale.sh/docs/styles), [적용 범위](https://vale.sh/docs/scopes), [패키지](https://vale.sh/docs/keys/packages), [출력 형식](https://vale.sh/docs/templates), [Views](https://vale.sh/docs/views). 2026년 7월 17일 확인.
- Vale `v3.15.1`: [공식 릴리스](https://github.com/vale-cli/vale/releases/tag/v3.15.1), 태그 커밋 `8c4ed0df90e45f93818ffed5ba587ff1e220a142`. 2026년 7월 17일 확인.
- Vale Action `2.1.2`: [action.yml](https://github.com/vale-cli/vale-action/blob/85f9f7f2c5f449ac0ae5b66662961bae3f77ca6a/action.yml), 커밋 `85f9f7f2c5f449ac0ae5b66662961bae3f77ca6a`. 2026년 7월 17일 확인.
- textlint `v15.7.1`: [공식 릴리스](https://github.com/textlint/textlint/releases/tag/v15.7.1), 태그 커밋 `91ffc5947325f0a9d0500b889550a1b4d232f5f1`. 2026년 7월 17일 확인.
- textlint 공식 문서: [설치](https://textlint.org/docs/getting-started/), [설정](https://textlint.org/docs/configuring/), [규칙 작성](https://textlint.org/docs/rule/), [플러그인 작성](https://textlint.org/docs/plugin/), [CI 연결](https://textlint.org/docs/integrations/), [공식 규칙 모음](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule). 2026년 7월 17일 확인.
- GitLab: [Vale documentation tests](https://docs.gitlab.com/development/documentation/testing/vale/). 2026년 7월 17일 확인.
- Red Hat Documentation: [Vale 규칙 검증 스크립트](https://github.com/redhat-documentation/vale-at-red-hat/blob/bf4a628e07a9a9c4416760e96249d31e0134cba8/tools/validate-vale-rules.sh), 커밋 `bf4a628e07a9a9c4416760e96249d31e0134cba8`. 2026년 7월 17일 확인.
- Datadog: [Vale 기여 지침](https://github.com/DataDog/datadog-vale/blob/a6a543b8aadf2c2b09005207c560c061d3ff0bca/CONTRIBUTING.md), 커밋 `a6a543b8aadf2c2b09005207c560c061d3ff0bca`. 2026년 7월 17일 확인.
- Git: [githooks](https://git-scm.com/docs/githooks). 2026년 7월 17일 확인.
- Codex: [Subagents](https://developers.openai.com/codex/agent-configuration/subagents), [Code review](https://developers.openai.com/codex/code-review). 2026년 7월 17일 확인.
- Codex: [Build skills](https://developers.openai.com/codex/skills). 2026년 7월 17일 확인.
- Claude Code: [Create custom subagents](https://code.claude.com/docs/en/sub-agents). 2026년 7월 17일 확인.
- Claude Code: [Extend Claude with skills](https://code.claude.com/docs/en/skills). 2026년 7월 17일 확인.
- Anthropic: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). 2026년 7월 17일 확인.
- Anthropic: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills). 2026년 7월 17일 확인.
- OpenAI: [Harness engineering](https://openai.com/index/harness-engineering/). 2026년 7월 17일 확인.
- Agentic AI Foundation: [AGENTS.md 공개 형식](https://agents.md/). 2026년 7월 17일 확인.
- Zheng 외: [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685), arXiv `2306.05685`. 2026년 7월 17일 확인.
- markdownlint: [공식 저장소](https://github.com/DavidAnson/markdownlint). 2026년 7월 17일 확인.
- 저장소 자료: [`README.md`](../../../../README.md), [`skills/use-design-docs/SKILL.md`](../../../../skills/use-design-docs/SKILL.md), [`skills/use-dev-guidance/SKILL.md`](../../../../skills/use-dev-guidance/SKILL.md), [`docs/designs/README.md`](../../README.md), [`docs/dev/README.md`](../../../dev/README.md), [`src/AGENTS.en.md`](../../../../src/AGENTS.en.md), [`src/AGENTS.ko.md`](../../../../src/AGENTS.ko.md). 2026년 7월 17일 확인.
- Superpowers: [`skills/` 트리](https://github.com/obra/superpowers/tree/d884ae04edebef577e82ff7c4e143debd0bbec99/skills), 리비전 `d884ae04edebef577e82ff7c4e143debd0bbec99`. 2026년 7월 17일 확인.
- Compound Engineering: [`skills/` 트리](https://github.com/EveryInc/compound-engineering-plugin/tree/32fae6c546704b3befb7e5eba30fc6bed931fba9/skills), 리비전 `32fae6c546704b3befb7e5eba30fc6bed931fba9`. 2026년 7월 17일 확인.
- LanguageTool: [지원 언어](https://help.languagetool.org/hc/en-us/articles/39254526141463-What-languages-does-LanguageTool-support). 2026년 7월 17일 확인.
- Kiwi: [공식 저장소](https://github.com/bab2min/kiwi), [kiwipiepy 문서](https://bab2min.github.io/kiwipiepy/). 2026년 7월 17일 확인.
- Go: [regexp/syntax](https://pkg.go.dev/regexp/syntax). 2026년 7월 17일 확인.
