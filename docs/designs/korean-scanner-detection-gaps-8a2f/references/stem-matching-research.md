# 활용형 탐지 공백 재현과 공개 프로젝트의 어간 매칭 방식 조사

## 조사 질문

[요구사항의 목표](../requirements.md#목표)가 기록한 네 가지 탐지 공백을 검사 스크립트 실행으로 재현하고, GitHub에 공개된 프로젝트들이 같은 문제(활용형 매칭, 자음 어미, 정규화 형태가 다른 입력)를 어떻게 푸는지 비교했다. 조사일은 2026년 8월 20일이다.

## 공백 재현

검사 스크립트를 `--stdin` 모드로 실행했다.

**형용사 활용형.** 입력 `좁은 경계를 유지합니다. 경계가 좁아졌습니다. 이 작업이 너무 좁았습니다. 모듈을 불러오는 범위를 좁게 유지합니다. 검토 범위가 좁다.`에서 `ko.narrow` 경고는 0건이었다. 발생한 경고는 `ko.boundary` 2건과 `ko.scope` 2건뿐이며, 다른 신호 단어가 없는 세 번째 문장에는 경고가 없었다.

**`박다` 계열과 사전형 단일 표현.** 입력 `버전을 코드에 박고 배포한다. 값이 박히는 위치를 정한다. 설정이 코드에 박혔다. 상수를 박음 처리한다. 못을 박았다. 기본값을 박아 둔다. 주제를 다룬다. 이 절은 오류를 다룹니다. 회의를 가집니다.`에서 표현 경고는 `박아` 1건뿐이었다. `박고`, `박히는`, `박혔`, `박음`, `박았`, `다룬다`, `다룹니다`, `가집니다`는 경고가 없었다.

**NFD로 저장된 원문.** `검토 경계를 정리한다.`를 `normalize("NFD")`로 분해해 입력하면 표현 경고가 0건이었다. literal 규칙 전체가 자모 분해 상태의 한글과 일치하지 않는다.

두 번째 재현에서 자음 어미형(`박고`, `박는`)과 받침 추가형(`박았`, `박음`, `박힘`)은 원인이 다르다. 받침 추가형은 어간 마지막 음절의 code point가 달라져 literal이 실패하는 경우로, [선행 조사](../../korean-scanner-coverage-9b4e/references/hangul-conjugation-detection.md)가 확인한 NFD 자모 접두 성질(`좁힌`의 NFD는 `좁히`의 NFD에 종성 하나가 붙은 열)로 해결된다. 자음 어미형은 둘째 음절 자체가 달라 접두 관계가 성립하지 않는다.

## 공개 프로젝트의 처리 방식

### 형태소 분석기 없이 활용형을 다루는 사전: hunspell-dict-ko

[spellcheck-ko/hunspell-dict-ko](https://github.com/spellcheck-ko/hunspell-dict-ko)는 사전 내부 표현을 NFD 자모열로 통일한다. `config.py`에 `internal_encoding = 'NFD'`가 명시되어 있고, aff 파일의 `ICONV 11172` 항목이 완성형 음절 전체를 NFD로 변환한 뒤 매칭하며 `OCONV`로 제안 단어를 NFC로 되돌린다. 어미는 종성 자모로 시작하는 문자열로 저장해(관형사형 `-ㄴ`은 U+11AB 하나) 받침 추가형을 문자열 연결로 표현하고, 자음 어미는 어간 끝 자모 조건이 붙은 완성 음절 규칙으로 표현한다. ㄷ, ㅂ, ㅅ, ㅎ 불규칙은 별도 규칙 클래스가 어간 끝 자모를 바꿔 처리한다.

### 형태소 분석기의 어미 사전: Kiwi

[bab2min/Kiwi](https://github.com/bab2min/Kiwi)의 형태소 사전(`ModelGenerator/morphemes.txt`)은 받침 변화 어미를 종성 자모로 시작하는 항목(`ᆫ다`, `ᆫ`, `ᆯ`)에 모음 뒤 결합 조건을 붙여 저장하고, 자음 어미(`고`, `는`)는 일반 음절 항목으로 둔다. 축약과 불규칙 결합(`르+어`, `하+어`)은 `combiningRule.txt`에 항목별 규칙으로 열거한다. 오탐은 매칭이 아니라 토큰화가 막는다.

### 표면형 사전 생성: open-korean-text

[open-korean-text](https://github.com/open-korean-text/open-korean-text)의 `KoreanConjugation.scala`는 사전 로드 시 용언 어간의 마지막 음절을 분해한 뒤 가능한 활용 표면형을 미리 생성한다. 모음으로 끝나는 어간에는 종성 후보(`CODAS_COMMON`)를 재조합해 붙이고, 자음 어미는 음절 문자열 상수(`PRE_EOMI_COMMON`)를 그대로 붙인다. 매칭 시점에는 자모를 쓰지 않는다.

### 자모 또는 범위 기반 검색

- [bluewings/korean-regexp](https://github.com/bluewings/korean-regexp)는 자모 대신 완성형 범위로 받침 추가형을 잡는다. `개우` 입력에서 `/개[우-윟]/`처럼 마지막 글자를 "그 글자부터 모든 받침이 붙은 글자까지" 범위로 확장한다.
- [Hangul.js](https://github.com/e-/Hangul.js)의 `search`는 두 문자열의 자모 키열 포함 여부로 정의되어 `달걀`에서 `닭`이 일치한다. 음절 중간 일치를 오탐으로 거르지 않고 검색 기능의 정의로 둔다.
- [toss/es-hangul](https://github.com/toss/es-hangul)은 v2에서 부분 일치 함수(`hangulIncludes`)를 제거하고, 분해는 라이브러리가 제공하되 포함 검사는 표준 문자열 연산으로 하도록 안내한다.

NFD 부분 문자열 검색의 음절 중간 오탐은 code point 수준에서 확인됐다. `수박고르기`의 NFD는 `박고`의 NFD를 포함한다.

### 산문 린터

- [errata-ai/vale](https://github.com/errata-ai/vale)의 `existence`, `substitution` 규칙은 토큰들을 하나의 alternation 정규식으로 컴파일한다(`internal/check/definition.go`의 `wordTemplate`). 기본 단어 경계 `\b`는 [Go 정규식의 ASCII 경계](https://pkg.go.dev/regexp/syntax)라서 한글 사이에서 성립하지 않는다. 활용형 일반화 기능은 없다.
- Vale 기반 한국어 도구 [korean-prose-lint](https://github.com/YOOGOMJA/korean-prose-lint)는 검사할 표면형을 명시 열거하고 나머지를 미지원으로 문서화하며, 한글 경계를 `\p{Hangul}` lookaround로 직접 구현한다.
- [textlint-ja](https://github.com/textlint-ja/textlint-rule-morpheme-match)는 kuromoji.js 형태소 분석 토큰의 품사와 활용형 속성으로 판정하고, [RedPen](https://github.com/redpen-cc/redpen)은 일본어에만 형태소 토크나이저를 쓰며 한국어는 공백 분리만 한다(`Configuration.java`). 두 도구 모두 분석기가 틀리는 활용형을 표면형 하드코딩 예외로 보완한다.
  - [kuromoji.js issue #28](https://github.com/takuyaa/kuromoji.js/issues/28)이 textlint 규칙 소스의 예외 처리 근거로 인용된다.
  - [RedPen PR #880](https://github.com/redpen-cc/redpen/pull/880)은 형태소 기반 검증기의 오탐을 사례 추가로 고친 기록이다.

### 정규화 형태가 다른 입력의 처리

표준은 매칭 양쪽을 같은 정규화 형태로 두라고 요구한다.

- [UAX #15](https://unicode.org/reports/tr15/)는 비교를 수행하는 프로세스가 canonical equivalence를 존중해야 한다고 명시한다.
- [W3C Charmod-Norm](https://www.w3.org/TR/charmod-norm/)은 정규화가 필요한 매칭에 NFD 또는 NFC를 쓰고 NFKC, NFKD는 배제하라고 권고한다.

도구들의 실제 선택은 부류에 따라 갈린다.

- 검사기 부류는 한 형태로 통일한다. [cspell](https://github.com/streetsidesoftware/cspell)은 사전과 단어를 NFC로 정규화하고(`cspell-trie-lib`의 `normalizeWord.ts`), 한국어 hunspell 사전은 위에서 확인한 대로 NFD로 통일한다.
- 범용 검색기 [ripgrep은 정규화를 하지 않는다고 명시적으로 결정](https://github.com/BurntSushi/ripgrep/issues/845)했고, 비용과 패턴 의미 보존을 이유로 들었다.
- git은 NFD가 생기는 경계에서만 되돌린다. `core.precomposeUnicode`는 macOS가 분해한 파일 이름을 NFC로 재조합한다. macOS가 분해형을 만드는 배경은 [HFS+ 사양 TN1150](https://developer.apple.com/library/archive/technotes/tn/tn1150.html)의 "strings fully decomposed" 규정이다.

패턴을 NFC와 NFD 두 벌로 이중화하는 주요 프로젝트는 확인되지 않았다.

### 다중 literal 패턴의 매칭 알고리즘

약 50개 규모의 고정 패턴에는 전용 자료구조가 쓰이지 않는다.

- Vale는 규칙당 토큰을 alternation 정규식 하나로 컴파일한다(위 `definition.go`).
- [flashtext](https://github.com/vi3k6i5/flashtext)의 [논문](https://arxiv.org/abs/1711.00046)과 벤치마크는 키워드 약 500개부터 trie 기반이 컴파일된 정규식을 앞선다고 보고한다.
- rust [aho-corasick crate](https://docs.rs/aho-corasick/)는 128개 이하 패턴을 SIMD 프리필터로 처리하는 작은 규모로 취급한다(`src/packed/api.rs`의 `PATTERN_LIMIT`).

## 비교에서 도출한 결론

- 받침 추가형 활용은 NFD 자모 접두(또는 완성형 범위)로 일반화할 수 있고, hunspell-dict-ko와 Kiwi가 독립적으로 같은 성질에 의존한다.
- 자음 어미형은 어떤 프로젝트도 일반화하지 못하며 음절 데이터(허용 어미 집합 또는 표면형 생성)로 처리한다. 토큰화가 없는 도구에서 오탐을 막는 수단은 어미 집합 검사다.
- 축약형과 불규칙은 형태소 분석기를 쓰는 도구조차 항목별 데이터로 열거한다.
- 정규화는 검사기 부류의 관행대로 한 형태 통일이 원칙이고, 자모 수준 매칭이 목적이면 NFD 통일의 선례가 hunspell-dict-ko다.
- 현재 규칙 규모(표현 약 50개)에서는 alternation 또는 색인 기반 순회로 충분하며 전용 다중 패턴 자료구조의 근거가 없다.

## 한계

- 프로젝트별 사실 중 hunspell-dict-ko의 `internal_encoding = 'NFD'`와 Vale의 정규식 template 두 가지는 소스 파일에서 직접 재확인했고, 나머지는 각 링크의 문서와 소스 파일 확인 결과다.
- flashtext의 손익분기 수치는 저장소 README의 벤치마크 차트에 근거하며 독립 재현은 하지 않았다.
- textlint 생태계에서 한국어 형태소 기반 규칙은 발견하지 못했다. 부존재의 증명은 아니다.
