# 한국어 활용형 탐지의 실제 구현 방식

## 결론

현실의 한국어 형태 분석기와 맞춤법 검사기는 `좁다`와 `좁히다`를 하나의 어간으로 합치지 않는다. `좁다`는 형용사 표제어, `좁히다`는 동사 표제어로 따로 분석하고 각 품사에 맞는 활용 규칙을 적용한다. 다만 두 표현을 발견했을 때 같은 검토 질문, 심각도와 안내 문구를 보여 준다면 Vale 같은 문장 검사기 구조를 따라 하나의 사용자 진단 아래 두 matcher를 둘 수 있다. 따라서 이 스캐너에는 **판정 단위는 분리하고 진단 단위는 문구와 검토 목적이 같을 때만 묶는 방식**이 적합하다.

`박다`는 `박`이라는 부분 문자열 하나로 찾거나 가능한 표면형을 계속 열거하는 두 극단을 피해야 한다. 실제 도구는 표제어와 품사, 허용하는 어미 분류, 융합된 표면형, 단어 사전과 문맥을 함께 사용한다. 외부 package를 사용할 수 없는 이 저장소에서는 `박다`와 `박히다` matcher를 나누고, 각 matcher가 검증된 어미 분류만 허용하며, 원문 위치를 보존한 앞뒤 형태 조건과 완전 단어 예외를 적용하는 작은 규칙 체계가 현실적인 대안이다. 표면형 목록은 matcher 본체가 아니라 동작을 확인하는 사례 모음으로 사용해야 한다.

이 결론은 구현 승인이 아니라 조사에서 도출한 권고다. 이 문서는 [표현 탐지 요구사항](../requirements.md#표현-탐지)과 [현재 누락 분석](korean-expression-coverage.md)을 구체화하는 참고 자료다. 조사일은 2026년 8월 28일이다.

## 실제 한국어 분석기가 나누는 단위

### Kiwi

[Kiwi 0.23.2의 형태소 자료](https://github.com/bab2min/Kiwi/blob/693d6f2e029cd7635853ae32d917c315c5efa3f41/ModelGenerator/morphemes.txt)는 `좁/VA-R`과 `좁히/VV`, `박/VV`와 `박히/VV`를 별도 항목으로 둔다. `VA-R`은 규칙 활용 형용사, `VV`는 동사 분석이다. 같은 글자 접두부를 공유해도 표제어와 품사를 합치지 않는다는 직접 증거다.

[Kiwi 공식 demo](https://kiwi.bab2min.pe.kr/)가 2026년 8월 28일에 표시한 0.23.1의 기본 형태소 분석 화면에서 별도 option을 바꾸지 않고 다음 문장을 확인했다.

- `코드를 박지`: `박/VV + 지/EF`
- `목표를 박음`: `박/VV + 음/ETN`
- `못이 박혔다`: `박히/VV + 었/EP + 다/EF`

`박물관`, `압박`, `호박`과 `대박`은 명사 사전 항목으로 분석되어 `박/VV`와 구별됐다. `박지.`는 동사와 종결 어미로 분석됐다. demo 화면은 입력 뒤 문맥에 따라 `박지` 분석이 달라지는 결과도 표시했다. 마지막 사례는 앞뒤 문자 조건만으로 모든 중의성을 제거할 수 없고 사전과 문맥 점수가 필요하다는 한계를 보여 준다. demo 화면은 model 식별자와 고정 실행 기록을 제공하지 않으므로 이 결과는 보충 관찰로만 사용한다. 표제어와 품사를 분리한다는 결론은 앞의 고정 revision 자료를 근거로 한다.

### Open Korean Text

[Open Korean Text 2.3.1의 형용사 사전](https://github.com/open-korean-text/open-korean-text/blob/97b89f1e96880542ebf694796f7c81a63326b1152/src/main/resources/org/openkoreantext/processor/util/adjective/adjective.txt#L2031)은 `좁`을, [동사 사전](https://github.com/open-korean-text/open-korean-text/blob/97b89f1e96880542ebf694796f7c81a63326b1152/src/main/resources/org/openkoreantext/processor/util/verb/verb.txt#L2336)은 `좁히`, `박`과 `박히`를 서로 다른 품사 사전에 둔다. [사전 공급자 구현](https://github.com/open-korean-text/open-korean-text/blob/97b89f1e96880542ebf694796f7c81a63326b1152/src/main/scala/org/openkoreantext/processor/util/KoreanDictionaryProvider.scala)은 동사와 형용사의 활용형 집합을 만들고 표면형을 `-다` 표제어로 되돌리는 자료를 생성한다.

이 구조의 핵심은 모든 활용형을 독립 규칙으로 사람이 나열하지 않는다는 점이다. 표제어와 품사별 활용 규칙에서 표면형을 만들고, 분석 결과는 다시 표제어에 연결한다.

### MeCab-ko-dic

[MeCab-ko-dic의 고정 revision](https://bitbucket.org/eunjeon/mecab-ko-dic/src/f0e76b67ca2eeca45732c909b587d797f2cc70a7/)은 `VV.csv`에 `박`, `박히`와 `좁히`를, `VA.csv`에 `좁`을 별도 항목으로 둔다. `Inflect.csv`에는 `박혀`를 `박히/VV + 어/EC`, `박힌`을 `박히/VV + ㄴ/ETM`, `좁혔`을 `좁히/VV + 었/EP`, `좁힘`을 `좁히/VV + ㅁ/ETN`처럼 미리 분석한 형태로 기록한다.

규칙적으로 분리되는 어간과 어미는 분석 경로에서 조합하고, 음절 결합이나 축약으로 표면 문자열만 보고 나누기 어려운 형태는 검증된 분석 항목으로 보완하는 혼합 방식이다. `박음`과 `좁힘`처럼 결합 결과가 다른 명사형을 동일한 접두 문자열 전략으로 처리하지 않는 이유도 여기서 드러난다.

### 국립국어원 사전

[한국어기초사전의 `좁다`](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=75801)는 형용사와 `좁은`, `좁아`, `좁으니`, `좁습니다`를, [`좁히다`](https://krdict.korean.go.kr/vie/dicSearch/SearchView?ParaWordNo=24628)는 동사와 `좁히어`, `좁혀`, `좁히니`를 제시한다. [`박다`](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=15823)는 `박는`, `박아`, `박으니`, `박습니다`를 제시하고 파생어 `박히다`를 별도로 연결한다. 사전 자료도 네 표제어를 하나의 문자열 규칙으로 합칠 근거를 제공하지 않는다.

## 맞춤법 검사기와 문장 검사기가 규칙을 구성하는 방식

### Hunspell과 한국어 사전

[Hunspell 1.7.3 manual](https://github.com/hunspell/hunspell/blob/f143a42a0b95578c39f8657101624ed44dea6514/man/hunspell.5)은 사전의 각 표제어에 affix flag를 붙이고, affix 규칙에서 제거할 문자열, 붙일 문자열, 적용 조건과 다음 규칙을 정의한다. bare stem을 문서 어디에서나 부분 문자열로 찾는 구조가 아니라, 해당 표제어에 허용된 규칙만 적용하는 구조다.

[한국어 Hunspell 사전 0.7.94의 `조` 항목](https://github.com/spellcheck-ko/hunspell-dict-ko/blob/606164264399ca037325bd41750f9c108ed4c290/data/entries/%EC%A1%B0.yaml)은 `좁다`와 `좁히다`를 별도 품사 항목으로, [`바` 항목](https://github.com/spellcheck-ko/hunspell-dict-ko/blob/606164264399ca037325bd41750f9c108ed4c290/data/entries/%EB%B0%94.yaml)은 `박다`를 동사 항목으로 둔다. [`suffix.py`](https://github.com/spellcheck-ko/hunspell-dict-ko/blob/606164264399ca037325bd41750f9c108ed4c290/suffix.py)와 [`suffixdata.py`](https://github.com/spellcheck-ko/hunspell-dict-ko/blob/606164264399ca037325bd41750f9c108ed4c290/suffixdata.py)는 품사, 불규칙 속성과 어미 분류를 조합해 Hunspell suffix 규칙을 만든다. 표면형 전수 열거 대신 표제어별로 허용된 활용 분류를 재사용하는 실제 사례다.

### Vale과 prh

[Vale의 Substitution 구현](https://github.com/errata-ai/vale/blob/6d22b96f86e2613766c7d565b938ba6ed6c57a58/internal/check/substitution.go)과 [공식 설명](https://github.com/errata-ai/vale.sh/blob/686b38fa3bd01ee9707b92254d64f2d2c5d3fede/docs/checks/substitution.md)은 하나의 message, level, scope와 예외 아래 여러 matcher를 둘 수 있게 한다. 사용자에게 같은 문제와 같은 조치를 설명할 수 있으면 여러 표현을 한 진단에 묶고, message나 적용 범위가 달라지면 규칙을 나누는 구조다.

[prh 6.0.6의 rule 구현](https://github.com/prh/prh/blob/8ebcfca6de65ad1ce8c2e4c154ba906e9e59c874/lib/rule.ts)도 하나의 기대 결과에 여러 pattern을 연결한다. 그러나 [ChangeSet 구현](https://github.com/prh/prh/blob/8ebcfca6de65ad1ce8c2e4c154ba906e9e59c874/lib/changeset/changeset.ts)은 겹치는 일치를 제거하고 같은 시작 위치에서는 긴 일치를 남긴다. 현재 스캐너는 겹치는 일치를 보존해야 하므로 prh의 진단 묶음 개념은 참고할 수 있지만 일치 충돌 정책을 그대로 적용할 수는 없다.

### codespell과 typos

[codespell 2.4.3](https://github.com/codespell-project/codespell/blob/3478d2378e412223d46c08b63d28712a5cb740d4/codespell_lib/_codespell.py)과 [typos 1.49.1](https://github.com/crate-ci/typos/blob/a8168dc2984a9e2352f183ffe788f0f23a300389/crates/typos/src/check.rs)은 원문 모든 위치에서 사전 key를 부분 문자열로 찾지 않는다. 먼저 token이나 식별자를 추출한 뒤 사전을 조회하고 ignore word, 정규식과 특수 token 제외를 별도 단계로 적용한다. [typos의 token 구현](https://github.com/crate-ci/typos/blob/a8168dc2984a9e2352f183ffe788f0f23a300389/crates/typos/src/tokens.rs)은 원문 byte 위치를 보존해 사전 판정 뒤에도 정확한 범위를 보고한다.

한국어 어절 경계가 곧 표제어 경계는 아니지만, 이 구조는 원문 위치 추적, 형태 판정과 예외 처리를 서로 다른 책임으로 두어야 한다는 근거가 된다.

## `좁다`와 `좁히다`에 적용할 판단

matcher는 두 개로 나누는 편이 타당하다.

- 형용사 matcher는 표제어 `좁다`, 품사 형용사와 `좁-`의 활용만 책임진다.
- 동사 matcher는 표제어 `좁히다`, 품사 동사와 `좁히-`, 축약형 `좁혀-`의 활용만 책임진다.
- 두 matcher는 서로 다른 허용 어미와 융합형 사례를 가진다.

사용자에게 보이는 rule ID는 판정 단위가 아니라 진단 책임에 따라 정한다. 두 표제어가 모두 같은 부정확한 표현을 찾고 같은 검토 질문과 안내를 제공한다면 기존 `ko.narrow` 아래 두 matcher를 둘 수 있다. 형용사에는 “범위가 제한적이다”, 동사에는 “대상을 줄였다”처럼 서로 다른 질문이나 대체 표현을 안내해야 한다면 rule ID도 나눠야 한다.

이 구분은 한 rule이 한 어간이어야 한다는 뜻이 아니다. Vale의 사례처럼 한 진단이 여러 matcher를 가질 수 있지만, 내부 matcher 자료와 검증 사례에서는 어느 matcher가 일치했는지 확인할 수 있어야 한다. 공개 JSON은 기존 `ruleId`와 실제로 일치한 `expression`을 유지한다. 새 matcher 식별 필드를 공개 JSON에 추가하려면 결과 형식 변경을 별도로 승인받아야 한다. 이 조건에서 `좁은`, `좁았습니다`의 회귀와 `좁혔다`의 기존 동작을 matcher별 검증 사례로 나눌 수 있다.

## `박다` 계열에 적용할 판단

### bare stem 하나는 부적합하다

`박`만 부분 문자열로 찾으면 `박물관`, `박사`, `박수`, `호박`, `압박`, `대박` 같은 명사까지 후보가 된다. 앞쪽 단어 시작만 요구해도 `박물관`, `박사`, `박수`와 `박지 씨`는 남는다. 뒤쪽에서 몇 글자를 제외하는 방식은 새 단어와 문맥이 나타날 때마다 예외가 늘어난다.

### 표면형 전수 열거도 matcher 본체로는 부적합하다

`박다`, `박아`, `박은`, `박힌`, `박혀`를 추가해 온 현재 방식은 `박지`, `박음`, `박는`, `박을`, `박았습니다`, `박혔다`처럼 다른 어미가 붙을 때마다 같은 누락을 만든다. 반대로 모든 한국어 어미 조합을 표면 문자열로 미리 넣으면 자료 크기와 검토 책임이 커지고, 축약 및 음운 결합이 빠지기 쉽다.

표면형 목록은 대표 활용, 융합형과 오탐 방지 사례를 고정하는 fixture로는 필요하다. 그러나 목록에 있는 문자열만 찾는 것이 규칙의 정의가 되어서는 안 된다.

### 현실적인 matcher 구조

외부 형태 분석기를 넣지 않는다면 다음 책임을 순서대로 나누는 방식이 적합하다.

1. `박다/VV`와 `박히다/VV`를 별도 matcher로 선택한다.
2. 각 matcher가 허용하는 어미 분류와 융합형만 판정한다.
3. 원문에서 어절 또는 한국어 token의 시작 조건을 확인하고 정확한 UTF-16 범위를 보존한다.
4. 완전 단어 사전과 검증된 예외를 적용한다.
5. 남은 중의성은 자동 오류나 자동 수정이 아니라 검토 후보로 보고한다.

어미 분류는 `-고`, `-지`, `-는`, `-을`, `-으니`, `-으면`, `-기`, `-음`, `-습니다` 같은 규칙적 결합과 `박아`, `박았-`, `박혀`, `박혔-` 같은 융합 표면형을 구분할 수 있어야 한다. 구체적인 전체 목록은 한국어 형태 규칙을 승인할 담당자가 정해야 하며, 이 조사 문서가 임의로 완전성을 주장하지 않는다.

이 구조는 `박` 뒤의 임의 문자열을 허용하는 정규식과 다르다. 표제어 matcher가 승인한 경로만 받아들이며, 새 어미 분류를 추가할 때 영향을 받는 표제어와 사례를 확인할 수 있다.

## 외부 분석기 도입과 작은 내부 규칙의 선택

Kiwi, Open Korean Text, MeCab-ko-dic 같은 분석기를 runtime에 사용하면 사전, 품사, 연결 비용과 문맥을 함께 활용할 수 있어 가장 넓은 형태 범위를 제공한다. 그러나 Kiwi는 native library와 model, Open Korean Text는 JVM과 Scala package, MeCab은 native engine과 별도 사전을 필요로 한다. [Rouzeta의 FST 구성 사례](https://github.com/dsindex/rouzeta/blob/580e2eafc5e4b1bf3f82fa8f867fd9263190878c/README.md)는 lexicon과 형태 규칙을 합성한 분석용 FST가 43 MB, 127,416 states와 2,806,708 arcs이고 여러 native 도구가 필요하다고 기록한다.

분산되는 Skill이 외부 package에 의존하면 안 된다는 현재 저장소 조건에서는 이 도구들을 그대로 넣을 수 없다. 구현한다면 실제 분석기의 구조에서 다음 부분만 작은 내부 자료로 가져오는 안을 검토할 수 있다.

- 표제어와 품사를 분리한 matcher descriptor
- 여러 표제어가 재사용하는 제한된 어미 분류
- NFD 정규화와 검증된 융합 표면형
- 앞뒤 형태 조건과 완전 단어 예외
- 원문 위치 및 겹치는 일치 보존

이 방식은 완전한 한국어 형태 분석기가 아니다. 문맥 중의성을 해결하지 못하고 승인한 표제어와 어미만 다룬다. catalog에는 기존 공개 형식을 유지하면서 대표 expression과 진단 규칙을 싣고, matcher의 전체 허용 형태는 내부 자료와 검증 사례에서 확인할 수 있게 해야 한다. 발견 결과는 사람이 문맥을 확인할 후보로 유지한다.

## 검증 사례의 구성

구현 입력으로 승인할 경우 표제어별로 정상 탐지, 기존 동작, 오탐 방지와 애매한 문맥을 나눠 확인해야 한다.

`좁다` matcher에는 `좁다`, `좁은 변경이다`, `범위가 좁았습니다`, `좁고`, `좁으면`, `좁음`을 포함할 수 있다. `좁쌀`과 다른 완전 단어는 오탐 방지 사례가 된다.

`좁히다` matcher에는 기존에 탐지되는 `좁혔다`와 `좁힌`, `좁힐`, `좁힙니다`, `좁혀서`를 포함할 수 있다. 이 사례는 형용사 matcher를 추가하면서 기존 동사 탐지가 약해지지 않았는지 확인한다.

`박다` matcher에는 `코드를 박지`, `목표를 박음`, `값을 박았다`, `설정에 박는`을 포함할 수 있다. `박히다` matcher에는 `코드에 박힌`, `값이 박혔다`를 별도로 둔다. `박물관`, `박사`, `박수`, `호박`, `압박`, `대박`과 `박지 씨`는 오탐 방지 또는 중의성 사례가 된다.

literal 용례인 `못을 박다`도 형태상 `박다/VV`이므로 형태 판정만으로 비유적 기술 표현과 구별되지 않는다. 현재 검사가 문제 후보를 찾는 용도라면 이 한계를 문맥 검토에 남길 수 있다. literal 용례를 반드시 제외해야 한다면 목적어와 주변 문맥을 판정하는 별도 요구사항이 필요하다.

## 남은 결정

다음 사항을 승인할 역할은 현재 저장소 근거에서 확인되지 않았다.

- `좁다`와 `좁히다`가 같은 검토 질문, 심각도와 안내 문구를 공유하는지
- `박히다`를 `박다`와 같은 사용자 진단으로 묶을지
- 허용할 어미 분류와 융합형의 범위
- 인명과 완전 단어 예외를 어디까지 내장할지
- literal `박다`까지 후보로 허용할지, 주변 명사나 문맥으로 제외할지
- 호환 자모, zero-width 문자와 Markdown 구문으로 나뉜 어절을 지원할지

이 결정을 내리기 전에도 matcher를 표제어별로 나누고 원문 위치를 보존하는 내부 구조는 유지할 수 있다. 사용자 진단의 묶음과 세부 문구는 정책 결정 뒤에 연결하며, 공개 JSON 형식은 별도 승인 없이 바꾸지 않는다.
