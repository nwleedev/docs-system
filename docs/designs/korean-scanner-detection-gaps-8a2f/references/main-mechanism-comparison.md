# 한국어 표현 탐지 브랜치와 `main` 구현 비교

## 결론

`feature/korean-scanner-detection-gaps`는 표면 문자열 열거 때문에 생긴 네 가지 누락을 모두 어간 중심 NFD 매칭으로 해결하려고 했다. 그러나 브랜치 HEAD에는 이 설계가 구현되지 않았고, `좁히`, `좁혀` 두 표현만 NFD 접두로 찾는 기존 스크립트와 설계 문서 여섯 개가 있다.

현재 `main`은 이후의 별도 요구사항과 결정에 따라 `좁다`, `좁히다`, `박다`, `박히다` 네 표제어만 형태 matcher로 구현했다. 연속된 한글 token의 첫머리에서 NFD 표면형을 비교하고 token의 나머지가 허용 어미와 정확히 일치할 때 경고한다. 이 구현은 브랜치가 확인한 `좁다`와 `박다` 계열 누락을 해소하면서 명사와 일부 문맥의 오탐을 더 엄격하게 줄였지만, `다루다`, `회의를 가지다` 활용형과 일반 literal의 NFD 원문은 여전히 찾지 못한다.

따라서 브랜치의 [어간 NFD 매칭 구현 계획](../plan.md)을 현재 `main`에 그대로 실행해서는 안 된다. 네 표제어는 이미 적용 대상이 더 제한된 형태 matcher로 구현됐고, 남은 세 영역은 현재 구현과 중복되지 않는 후속 요구사항으로 다시 확인해야 한다. 이 문서는 두 구현의 상태를 구분하기 위한 참고 자료이며 새 요구사항이나 승인된 결정이 아니다.

이 비교는 스캐너를 고칠 구현 담당자와 설계 문서를 검토할 결정 담당자가 이미 해결된 누락과 남은 누락을 구분할 때 사용한다. 조사일은 2026년 9월 1일이다.

## 비교한 Git 상태

두 브랜치는 `80e1baf9963b9c488cc6e44df7d97f1899136e9e`에서 갈라졌다. 비교 시작 시점에 `feature/korean-scanner-detection-gaps`는 공통 조상보다 5개 커밋 앞서고 `main`보다 33개 커밋 뒤에 있었다.

브랜치의 고유 커밋은 다음 순서로 문제와 해결안을 구체화했다.

1. `83c329835b407561b6d2b30ea20a1823d7eb6874`는 `좁다`, `박다` 계열, `다루다`, `회의를 가지다` 활용형과 NFD 원문의 미탐지를 요구사항으로 기록했다.
2. `3d4f20134a1013987753642618af69da90175d6d`는 소스가 공개된 한국어 도구를 비교하고 어간 중심 NFD 매칭, 허용 어미 집합과 변이형 열거를 승인된 결정 및 계획으로 기록했다.
3. `1068da49d66878dd141660b000f96d83e5f53ce8`은 요구사항의 질문을 해결된 상태로 바꿨다.
4. `ea1c55fde5e74b6e08bb14580fa518a7a263891c`는 규칙 자료와 오탐을 평가했다. `박`은 조사와 어미가 겹쳐 승인된 연결 검사만으로는 `압박을`, `반박은` 같은 명사형을 거르지 못하므로 추가 판단이 필요하다고 기록했다.
5. `8fe1ad83035fd8cc209a8c4bf9bcb5478bd9cb34`는 제안한 추가 검사를 실제 동작에 맞춰 `앞 글자 및 어절 첫머리 검사`로 다시 이름 붙였다.

이 다섯 커밋은 `docs/designs/korean-scanner-detection-gaps-8a2f/`만 추가했다. `skills/use-words-review/scripts/`는 바꾸지 않았으므로 브랜치의 실제 실행 결과와 문서가 제안한 후속 메커니즘을 구분해야 한다.

`main`의 비교 기준은 `31831ecb5b73c82a78471545ec58e4e9c0da51e7`이다. 형태 matcher는 [`7ec32b404ed361cdaea3bde1025fbf861aea38a8`](https://github.com/nwleedev/docs-system/commit/7ec32b404ed361cdaea3bde1025fbf861aea38a8)에서 구현됐고, 이후 커밋은 명령줄 도움말만 보완해 표현 탐지기는 바꾸지 않았다.

## 브랜치가 해결하려던 문제와 제안한 방법

[요구사항](../requirements.md)은 네 탐지 공백을 한 원인으로 묶었다. 검토할 개념은 용언의 어간인데 당시 스캐너는 일부 표면 문자열만 나열했다. 그 결과 `좁은`, `박고`, `다룹니다`, `회의를 가집니다`처럼 나열하지 않은 활용형을 놓쳤고, 일반 literal은 NFC와 NFD 표기가 다르면 일치하지 않았다.

[어간 NFD 매칭 결정](../decisions/stem-nfd-matching.md)과 [규칙 자료 설계](rule-data-design.md)는 다음 메커니즘을 제안했다.

- 모든 일반 표현과 원문을 NFD 비교 평면에 놓는다. 일반 명사와 구는 NFD 완전 일치로 처리한다.
- 용언은 어간을 NFD 접두로 비교한다. 뒤에 종성 자모가 붙거나 공통 연결 목록의 항목으로 시작할 때 활용형으로 인정한다.
- 축약형과 불규칙 활용은 어간 변이형으로 열거한다. `다뤄`, `회의를 가져` 같은 이미 활용된 변이형은 뒤 연결 검사를 생략한다.
- `박`은 앞 글자가 한글이면 버리는 추가 검사를 제안했다. 이 검사는 `수박고`와 명사 뒤 조사를 줄이는 대신 `처박다`, `틀어박다` 같은 합성 용언을 놓친다.
- 외부 JSON의 필드와 원본 UTF-16 위치는 유지한다. 규칙 자료에는 어간 속성을 더하되 `catalog`에는 기존 문자열 배열만 내보낸다.
- 개발 저장소에는 `node:test` 시나리오 테스트를 새로 두고, 배포 스크립트의 `--self-test`는 최소 실행 확인으로 남긴다.

브랜치가 선택한 공통 연결 목록은 어미 전체가 아니라 네 규칙에서 확인한 접두 목록이다. `다`, `고`, `게`, `지`, `는`, `자`, `며`, `면`, `니`, `기`, `네`, `습`, `아`, `어`, `으`, `히`, `혀`가 포함된다. 뒤 문자열 전체가 아니라 이 목록의 접두만 확인하므로 구현하려면 각 표제어의 정상 활용과 다른 단어의 우연한 접두를 추가로 검증해야 한다.

## 브랜치 HEAD의 실제 스크립트

브랜치 HEAD의 `skills/use-words-review/scripts/korean-expressions.mjs`는 두 검색 경로를 사용한다.

**일반 literal 경로.** 표현을 첫 UTF-16 code unit으로 색인하고 원문의 각 위치에서 `startsWith()`로 비교한다. NFC 표현과 NFD 원문은 code unit이 다르므로 일반 literal은 정준 동등성을 고려하지 않는다.

**두 표현만 쓰는 NFD 경로.** `NFD_MATCHED_EXPRESSIONS`에는 `좁히`, `좁혀`만 있다. 원문 전체와 두 표현을 NFD로 바꿔 `indexOf()`로 겹치는 접두를 찾고, NFD 위치를 원본 UTF-16 범위로 되돌린다. 이 방식은 `좁힌`, `좁힐`, `좁힘`, `좁혔다`를 찾지만 어미를 검증하지 않고 한글 token의 첫머리도 요구하지 않는다.

두 경로의 일치는 원본 시작 위치, 규칙 선언 순서와 끝 위치로 정렬한다. 외부 JSON의 `sources`, 두 `checks`, `catalog`, `rules`, `warnings`, `summary`와 경고 위치 형식은 브랜치 설계가 유지하려던 기준과 같다.

## 현재 `main`의 실제 스크립트

[`skills/use-better-terms/scripts/korean-expressions.mjs`](https://github.com/nwleedev/docs-system/blob/31831ecb5b73c82a78471545ec58e4e9c0da51e7/skills/use-better-terms/scripts/korean-expressions.mjs)는 일반 literal 경로와 형태 matcher 경로를 분리한다.

**일반 literal 경로.** 형태 matcher와 연결되지 않은 규칙은 브랜치 HEAD와 같이 첫 UTF-16 code unit 색인과 `startsWith()`를 사용한다. 일반 literal 전체를 NFD로 바꾸지 않았으므로 NFD로 저장된 `경계` 같은 표현은 찾지 못한다.

**표제어별 형태 matcher 경로.** `morphologyMatchers`는 `좁다`, `좁히다`, `박다`, `박히다`를 형용사와 동사로 나눈다. 각 matcher는 표제어, 품사, 사용자 진단 rule, 표면 변이형과 어미 그룹을 가진다. `좁다`는 새 `ko.narrow-state` 진단을 사용하고, `좁히다`는 `ko.narrow`, `박다`와 `박히다`는 `ko.fix-in-place`를 공유한다. 이 구분은 `main`의 [네 표제어 탐지 범위 결정](https://github.com/nwleedev/docs-system/blob/31831ecb5b73c82a78471545ec58e4e9c0da51e7/docs/designs/better-terms-scanner-reliability-5063/decisions/korean-lexeme-review-purpose.md)과 [한국어 표제어 진단 규칙 구성 결정](https://github.com/nwleedev/docs-system/blob/31831ecb5b73c82a78471545ec58e4e9c0da51e7/docs/designs/better-terms-scanner-reliability-5063/decisions/korean-diagnostic-rule-grouping.md)에 따른다.

**token 전체 검증.** 스크립트는 현대 한글 음절과 정준 분해 자모가 연속된 구간을 하나의 token으로 읽는다. matcher는 token의 첫머리에서만 후보를 열고 표면 변이형 뒤의 나머지 NFD 문자열이 어미 그룹의 항목 하나와 정확히 같을 때만 일치로 인정한다. 이 때문에 `박지`, `박음`, `박혔다`는 찾고 `호박`, `압박`, `박물관`은 찾지 않는다. `박지 씨`는 당시 구현의 단일 문맥 조건으로 별도 제외했다.

**NFD의 제한된 책임.** 각 표면 변이형과 token을 NFD로 바꾸고 원본 위치를 되돌리므로 네 표제어는 NFC와 NFD 입력을 모두 처리한다. NFD는 어미 자체를 추론하지 않으며, 허용 여부는 사람이 기록한 어미 그룹이 결정한다. matcher가 없는 `다루다`, `회의를 가지다`와 일반 literal에는 이 경로가 적용되지 않는다.

**기존 외부 형식 유지.** matcher의 식별자, 표제어와 품사는 JSON에 추가하지 않는다. matcher가 가리키는 기존 `rules`의 ID와 expression만 `catalog`와 경고에 사용한다. `main`은 배포 스크립트의 `--self-test`를 형태 사례로 확장했지만 브랜치가 계획한 별도 `node:test` 파일은 추가하지 않았다.

## 같은 입력으로 확인한 차이

Node.js 22.18.0에서 두 브랜치의 `--self-test`는 모두 종료 상태 0으로 끝났다. 이어 같은 열 줄을 `--stdin`으로 검사하고 관심 규칙의 경고를 비교했다.

입력은 `좁다`, `좁은 변경이다`, `좁혔다`, `범위가 좁았습니다.`, `코드를 박지`, `목표를 박음`, `값이 박혔다.`, `이 절은 오류를 다룹니다.`, `회의를 가집니다.`, `좁쌀 박물관 박사 박수 호박 압박 대박 박지 씨`였다.

브랜치 HEAD는 `좁혔다`의 `좁혀`만 `ko.narrow`로 보고했다. `main`은 다음 일곱 경고를 추가 또는 유지했다.

- `좁다`와 `좁은`의 `좁`을 `ko.narrow-state`로 보고했다.
- `좁혔다`의 `좁혀`를 기존 `ko.narrow`로 보고했다.
- `좁았습니다`의 `좁았`을 `ko.narrow-state`로 보고했다.
- `박지`와 `박음`의 `박`, `박혔다`의 `박혔`을 `ko.fix-in-place`로 보고했다.
- 마지막 줄의 명사와 `박지 씨`에는 세 형태 rule의 경고가 없었다.

두 스크립트 모두 NFD로 저장한 `좁힌`은 `ko.narrow`로 찾았고, NFD로 저장한 일반 literal `경계`는 `ko.boundary`로 찾지 못했다. 두 스크립트 모두 `다룹니다`와 `회의를 가집니다`를 각각 `ko.cover-topic`과 `ko.hold-meeting`으로 찾지 못했다. 이 결과는 `main`이 브랜치 목표 전체를 구현한 것이 아니라 네 표제어에 한정한 다른 해결을 병합했음을 보여 준다.

## 외부 근거로 다시 확인한 전제

[Unicode Standard Annex #15 revision 57](https://www.unicode.org/reports/tr15/tr15-57.html)은 NFD를 정준 분해로 정의하고, 완성형 한글 음절과 결합 자모열을 정준 동등한 예로 든다. [Unicode 17.0의 한글 음절 분해 알고리즘](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/)은 완성형 음절을 초성, 중성과 선택적인 종성 자모로 분해한다. [ECMAScript 2026의 `String.prototype.normalize`](https://tc39.es/ecma262/2026/multipage/text-processing.html#sec-string.prototype.normalize)는 이 정규화 형식을 JavaScript 문자열 API로 제공한다. 따라서 두 구현이 NFD 비교로 `좁힌`의 NFC와 NFD 표기를 같은 자모열로 처리한다는 전제는 현재 표준과 일치한다.

NFD는 형태 분석을 제공하지 않는다. [UAX #29 revision 47](https://www.unicode.org/reports/tr29/tr29-47.html)은 문자, 단어와 문장 분할의 기본 규칙을 정의하고, [W3C Character Model 초안](https://www.w3.org/TR/2026/WD-charmod-norm-20260716/)은 정규화와 문자열 일치의 책임을 다룬다. 두 문서의 적용 대상을 비교하면 한국어 표제어, 품사와 허용 어미 판정은 정규화 또는 기본 단어 분할보다 높은 단계의 책임이라는 결론이 나온다. 이는 표면 변이형과 어미 목록을 따로 둔 `main`의 구조를 뒷받침하지만, 현재 목록이 모든 활용형을 처리한다는 뜻은 아니다.

[한국어기초사전의 `박다`](https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=15823)는 품사를 동사로 두고 `박는`, `박아`, `박으니`, `박습니다`를 활용으로 제시하며 `박히다`를 별도 파생어로 연결한다. [Kiwi](https://github.com/bab2min/Kiwi), [Open Korean Text](https://github.com/open-korean-text/open-korean-text)와 [hunspell-dict-ko의 고정 리비전](https://github.com/spellcheck-ko/hunspell-dict-ko/blob/606164264399ca037325bd41750f9c108ed4c290/suffix.py)도 표제어, 품사, 활용 자료와 문맥 또는 적용 조건을 나눠 관리한다. Kiwi `693d6f2e029cd7635853ae32d917c315c5efa3f41`, Open Korean Text `97b89f1e96880542ebf694796f7c81a63326b1152`와 hunspell-dict-ko `606164264399ca037325bd41750f9c108ed4c290`의 구체적인 비교는 `main`의 [한국어 활용형 탐지 구현 조사](https://github.com/nwleedev/docs-system/blob/31831ecb5b73c82a78471545ec58e4e9c0da51e7/docs/designs/better-terms-scanner-reliability-5063/references/korean-morphology-rule-practices.md)에 기록되어 있다.

## 현재 남은 공백과 문서 영향

`main`에 이미 적용된 네 표제어 matcher는 브랜치 설계의 같은 부분을 대체한다. 후속 작업에서 공통 NFD 어간 matcher로 다시 바꾸려면 현재의 표제어별 진단, token 전체 어미 검증, 기존 `warning.expression`과 위치 호환성을 유지하면서 후속 요구사항이 제거한 단일 문맥 조건을 되살리지 않아야 한다.

브랜치 요구사항 가운데 다음 항목은 아직 해결되지 않았다.

- `다룬다`, `다룹니다`, `다뤄` 같은 `다루다` 활용형 탐지
- `회의를 가집니다`, `회의를 가져` 같은 `회의를 가지다` 활용형 및 축약형 탐지
- 형태 matcher에 연결되지 않은 일반 literal의 NFC와 NFD 정준 동등 입력 처리

이 세 항목을 구현할지는 이 비교에서 결정하지 않는다. 현재 `main`의 요구사항은 네 표제어만 승인했고, 일반 literal 전체의 정규화는 기존 검색 의미와 비용을 바꿀 수 있다. `다루다`와 `회의를 가지다`는 기존 진단 문구가 활용형 전체에 맞는지와 token matcher로 옮겼을 때의 오탐 사례를 다시 확인해야 한다.

## 한계

- 실행 비교는 요구사항의 대표 입력과 확인된 오탐 사례에 한정했다. 허용 어미 그룹 전체를 전수 검사하거나 성능을 다시 측정하지 않았다.
- 브랜치의 어간 중심 메커니즘은 설계 문서만 존재하므로 실제 동작과 비용은 확인할 수 없다. 이 문서의 브랜치 메커니즘 평가는 승인된 결정과 계획에서 도출한 분석이다.
- W3C Character Model은 2026년 7월 16일 발행된 Working Draft다. 정규화의 규범적 정의에는 Unicode Standard Annex #15를 우선했다.
- `main`의 형태 matcher가 처리하지 않는 활용형이 더 있을 수 있다. 현재 어미 목록은 네 표제어의 확인된 사례를 위한 내부 자료이지 완전한 한국어 형태 분석기가 아니다.
