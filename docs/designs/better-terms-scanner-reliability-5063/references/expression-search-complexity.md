# 표현 검색의 복잡도와 최적화 판단 근거

## 결론

현재 표현 검색기는 고정된 52개 표현과 입력 길이만을 변수로 보면 제곱 시간 구조가 아니다. 일반 literal은 첫 UTF-16 단위로 색인되어 입력을 한 번 순회하고, NFD 후보는 현재 두 개뿐이다. 현재 구현에서 확인되는 비선형 항은 source별 모든 일치를 모은 뒤 수행하는 `O(M log M)` 정렬이며, 큰 메모리 사용 가능성은 `O(M)` 일치 배열과 NFD 위치 대응 배열 및 반복 JSON 직렬화에서 생긴다.

중첩 반복문의 모양만으로 Aho-Corasick과 같은 다중 패턴 알고리즘을 도입하면 현재 규모에서는 구현과 검증 책임이 이득보다 커질 수 있다. 먼저 Node.js 22에서 전체 CLI의 시간, peak memory와 결과 동일성을 측정하고, 문제가 확인되면 전체 일치 정렬과 보관을 줄이는 국소 변경부터 비교하는 것이 근거에 맞다.

이 문서는 [실행 비용 요구사항](../requirements.md#실행-비용)을 구현할 담당자가 병목과 대안을 판정할 때 사용하는 근거다. 조사일은 2026년 8월 28일이며 현재 코드, 원 논문, ECMAScript 및 Node.js 공식 자료를 확인했다.

## 현재 탐색 구조

[표현 탐지 모듈](../../../../skills/use-better-terms/scripts/korean-expressions.mjs)은 매 실행에서 규칙을 검증하고 색인을 만든 뒤 source를 순서대로 처리한다. 현재 규칙은 47개, 표현은 52개이며 표현 길이의 합은 146 UTF-16 단위, 최장 길이는 11, 평균은 약 2.81이다.

일반 literal 50개는 첫 UTF-16 단위별 `Map`에 들어간다. 가장 큰 묶음은 `박`으로 시작하는 5개다. 원문의 각 위치에서는 같은 첫 단위를 가진 표현만 `startsWith()`로 비교하므로 매 위치에서 50개 전체를 검사하지 않는다.

NFD 표현은 `좁히`와 `좁혀` 두 개다. 원문을 code point별로 NFD 문자열에 이어 붙이고 원본 UTF-16 위치 대응 배열을 만든 뒤, 각 NFD 표현을 `indexOf()`로 반복 검색한다. 모든 일반 및 NFD 일치를 하나의 `matches` 배열에 넣고 시작 위치와 표현 선언 순서로 정렬한다. 상세 경고는 전체 실행에서 20,000개까지만 보존하지만 source의 `matches`는 이 상한 전에 모두 모은다.

[실행 진입점](../../../../skills/use-better-terms/scripts/scan.mjs)은 source 하나를 2 MiB, 전체 입력을 32 MiB, source 수를 512개로 제한한다. 각 검사 결과를 완전히 만든 뒤 32 MiB의 JSON byte 상한을 적용하며, 상한을 넘으면 남길 경고 수를 이분 탐색하면서 여러 prefix를 다시 직렬화한다.

## 변수별 시간 복잡도

source마다 다음 변수를 사용한다.

- `N`: 원문의 UTF-16 단위 수
- `U`: 원문의 Unicode code point 수
- `Z`: NFD 원문의 UTF-16 단위 수
- `P`: 일반 literal 수, 현재 50
- `D`: NFD 표현 수, 현재 2
- `B(c)`: 첫 단위가 `c`인 일반 literal 묶음
- `L(p)`: 표현 `p`의 UTF-16 길이
- `M`: source에서 발견한 전체 일치 수
- `M_nfd`: NFD 일치 수
- `W`: 보존한 상세 경고 수, 최대 20,000

규칙 자료의 전체 문자 수를 `K`라 하면 규칙 검증과 색인은 시간과 추가 공간 모두 `O(K)`다. catalog가 내장 상수인 현재 실행에서는 입력 길이와 무관한 고정 비용이다.

일반 literal 탐색의 비교량은 `O(N + Σ_i Σ_{p ∈ B(text[i])} L(p))`로 나타낼 수 있다. 보수적인 상한은 `O(N × B_max × L_max)`다. 현재 `B_max`는 5, `L_max`는 11이므로 입력 길이에 대해서는 선형이다. 표현 수와 길이가 입력과 함께 증가하는 별도 모델에서는 비용이 커질 수 있지만, 그 모델을 현재 고정 catalog의 입력 증가와 섞어 `N²`이라고 부르면 원인을 잘못 설명하게 된다.

NFD 위치 대응을 만드는 시간과 공간은 `O(U + Z)`다. ECMAScript의 개념적 문자열 검색 절차를 보수적으로 적용하면 NFD 검색 시간은 `O(Σ_d Z × L(d))`로 둘 수 있다. 각 NFD 일치를 원본 위치로 바꿀 때 두 번 이분 탐색하므로 `O(M_nfd log U)`가 더해진다. 실제 `indexOf()` 알고리즘과 상수는 V8 구현에 따르며 ECMAScript 명세는 특정 실행 시간을 보증하지 않는다.

모든 일치를 보관하는 공간은 `O(M)`이고 정렬은 `O(M log M)`이다. 고정 catalog에서도 조밀한 입력은 `M = Θ(N)`을 만들 수 있으므로 이 구간은 `O(N log N)`이 될 수 있다. 정렬 뒤 원문과 일치를 함께 순회하고 줄 위치를 계산하는 비용은 합계 `O(N + M)`이다.

표현 탐지기의 source별 추가 공간은 `O(U + Z + M + W × Q)`로 나타낼 수 있다. `Q`는 최대 480 UTF-16 단위인 quote 길이다. CLI는 이 공간 외에도 검사 전 모든 source 본문을 배열에 보관한다. 출력이 byte 상한을 넘으면 최대 `O(log W)`개의 경고 prefix를 직렬화하지만, 실제 시간은 반복 횟수보다 각 단계에서 만든 JSON byte 총량에 좌우된다.

## 원문과 공식 구현에서 확인한 검색 특성

[Aho와 Corasick의 1975년 원 논문](https://cr.yp.to/bib/1975/aho.pdf)은 여러 keyword를 유한 상태 기계로 구성하고 text를 한 번 통과해 모든 출현을 찾는다. 패턴 수가 크게 늘어나는 다중 검색에서는 비교 기준이 되지만, 현재 결과 순서와 NFD 원본 위치 변환을 자동으로 해결하지는 않는다.

[ECMAScript 2026의 `StringIndexOf`](https://tc39.es/ecma262/2026/multipage/ecmascript-data-types-and-values.html#sec-stringindexof)는 주어진 시작 위치 이후 후보를 검사해 가장 이른 일치를 반환하는 의미를 정한다. [ECMAScript의 `startsWith`](https://tc39.es/ecma262/2024/multipage/text-processing.html#sec-string.prototype.startswith)는 지정 위치의 UTF-16 code unit 부분 문자열과 표현을 비교한다. 두 명세 모두 엔진이 사용할 검색 자료구조나 시간 상한을 정하지 않는다.

[V8의 현재 `string-search.h`](https://chromium.googlesource.com/v8/v8.git/+/refs/heads/main/src/strings/string-search.h)는 길이 1, 길이 7 미만과 긴 패턴에 서로 다른 검색 경로를 사용한다. 현재 NFD 표현은 짧은 패턴 경로에 해당하지만 이 main 소스를 최소 지원 Node.js의 성능 보증으로 사용할 수는 없다. [Node.js 22.0.0 release](https://nodejs.org/en/blog/release/v22.0.0)는 해당 버전이 V8 12.4.254.14를 포함한다고 밝힌다.

[UAX #15 revision 57](https://unicode.org/reports/tr15/)은 NFD가 정준 분해를 수행하고 한글 음절에 별도 완전 분해 규칙을 적용한다고 설명한다. NFD 검색에는 원본 UTF-16 위치로 되돌리는 자료가 필요하므로 원문 literal 검색과 같은 비용으로 취급할 수 없다.

## 로컬 측정

외부 파일을 만들지 않고 `scanExpressions()`를 직접 호출해 한 번 예열한 뒤 여러 번 실행했다. Node.js 24.19.0에서 입력 크기를 네 배로 늘릴 때 중앙 실행 시간도 대체로 네 배로 늘어 현재 입력에서는 제곱 증가가 관찰되지 않았다.

일치 없는 `가` 반복의 중앙값은 8,192 단위에서 약 1.6 ms, 32,768 단위에서 6.1 ms, 131,072 단위에서 24.8 ms였다. 첫 단위만 후보와 같은 `범` 반복은 같은 크기에서 약 1.6 ms, 6.3 ms, 27.1 ms였다.

매 위치에서 `ko.middle-dot`이 일치하는 U+00B7 반복은 약 1.6 ms, 4.2 ms, 16.3 ms였다. NFD 일치가 조밀한 `좁힌 ` 반복은 약 2.4 ms, 9.2 ms, 40.3 ms였다.

이 수치는 한 장비의 순수 표현 모듈 관찰값이다. Node.js 22, 파일과 Git 입력, 긴 문단 검사, JSON 출력, peak memory와 운영체제 차이를 포함하지 않으므로 성능 예산이나 배포 보증으로 사용할 수 없다.

## 대안 비교

### 현 구조를 유지하고 측정한다

현재 catalog가 작고 첫 단위 색인이 이미 적용되어 있으며 Node.js 내장 문자열 연산을 사용한다. 성능 문제가 확인되지 않은 상태에서 구현을 늘리지 않는 장점이 있다. 반면 모든 일치를 보관하고 정렬하며 일반 literal과 NFD 검색을 별도로 수행하는 비용은 남는다.

### 정렬과 일치 보관을 줄인다

일반 literal 일치는 이미 시작 위치 및 선언 순서로 생성되고, 각 NFD 표현 안의 일치도 시작 위치 순이다. 이 정렬된 실행들을 병합하면 정렬 비용을 `O(M log(D + 1))`로 줄일 수 있다. 현재 `D = 2`이므로 입력 증가에 대해서는 선형에 가깝다. 병합 결과를 위치 계산으로 바로 보내면 처음 20,000개 경고만 보관하고 나머지는 전체 수와 일치한 규칙만 갱신할 수 있다.

이 대안은 현재 출력 순서와 전체 count를 유지할 가능성이 있지만, 같은 위치에서 여러 표현이 일치할 때의 선언 순서와 NFD 원본 범위를 정확히 보존해야 한다. 성능 문제가 확인될 경우 Aho-Corasick보다 먼저 비교할 수 있는 국소 변경이다.

### 순수 JavaScript Aho-Corasick을 구현한다

원문 literal과 NFD 표현에 각각 automaton을 만들면 전체 패턴 길이에 비례해 구성하고 입력 및 일치 수에 비례해 검색하도록 설계할 수 있다. 규칙이 수백 또는 수천 개로 늘 때 장점이 커진다.

반면 failure 및 output link, UTF-16 단위 전이, 겹치는 일치, 같은 시작 위치의 선언 순서, NFD 위치 대응을 모두 직접 구현하고 검증해야 한다. automaton은 보통 끝 위치 순으로 일치를 내므로 현재 시작 위치 우선 결과를 유지하려면 병합이나 후속 정렬이 필요하다. 52개의 짧은 표현에서는 높은 상수와 유지 책임이 이득보다 클 수 있다.

### Trie, 표현별 `indexOf()`와 정규식

각 위치에서 다시 시작하는 Trie는 공통 prefix 비교를 공유하지만 최악 `O(N × L_max + M)`이며 현재 가장 큰 묶음이 5개라 개선 폭이 작을 수 있다. 표현별 `indexOf()`는 네이티브 검색의 실제 상수가 작을 수 있지만 규칙 수에 비례해 원문을 반복 검색하고 결과 병합이 필요하다.

정규식 alternation은 literal prefix를 내부 최적화할 수 있으나 일반 global 검색은 겹치는 일치를 소비한다. lookahead도 같은 시작 위치의 여러 대안을 현재 선언 순서대로 모두 반환하지 않는다. ECMAScript 정규식은 이 조합의 선형 시간을 보증하지 않으므로 현재 동작을 유지할 기본 대안으로 삼기 어렵다.

## 비교 측정 방법

측정은 순수 표현 모듈과 전체 CLI를 나눠야 한다. 전체 CLI 측정에는 decode, 두 탐지기, byte 제한과 최종 JSON 쓰기를 포함한다. 최소 지원 Node.js 22.0.0과 프로젝트가 실제로 검증할 현재 Node.js release를 별도로 실행하고, 예열 뒤 여러 번 측정한 중앙값과 분포를 기록해야 한다.

입력군은 다음 비용을 분리할 수 있어야 한다.

- 일치 없는 ASCII와 한글 입력
- 같은 첫 단위의 후보가 많지만 완전한 표현은 없는 입력
- 일반 literal과 NFD 일치가 조밀한 입력
- 같은 위치와 겹치는 출현이 많은 입력
- 한 줄 quote가 길고 경고 20,000개와 JSON byte 제한에 도달하는 입력
- 같은 총 byte를 source 하나, 여러 개와 최대 512개로 나눈 입력
- source 2 MiB 및 전체 32 MiB 상한 입력
- 개인 위치와 비공개 자료를 제외한 고정 revision의 현실적인 Markdown 묶음

[Node.js Performance Hooks](https://nodejs.org/download/release/v22.17.0/docs/api/perf_hooks.html)은 wall time 측정 API를 제공하고, [`process.memoryUsage()`](https://nodejs.org/download/release/v22.9.0/docs/api/process.html#processmemoryusage)는 `rss`, `heapUsed`, `external`과 `arrayBuffers`를 구분한다. 시간만 재면 `matches`와 JSON이 쓰는 메모리를 놓치므로 child process의 peak RSS와 CPU time도 함께 기록해야 한다.

각 실행에서는 `summary.total`, 경고 순서, UTF-16 위치, quote와 JSON byte 수를 같이 비교해야 한다. 입력을 네 배씩 늘려 경험적 증가 차수를 보되 한 쌍의 실행 시간만으로 복잡도를 판정하지 않는다. 절대 시간, peak RSS, 의미 있는 개선률과 허용할 퇴행률은 실행 환경과 사용 빈도를 근거로 결정 소유자가 정해야 한다.

## 남은 결정과 한계

현재 증거는 고정 catalog에서 입력 길이를 늘릴 때 제곱 증가가 없다는 결론을 뒷받침한다. 규칙 수가 늘어날 예상 규모, 최대 실행 시간과 peak RSS, 결과 순서의 완전한 호환 여부는 정해지지 않았다. 이 값들이 없으면 특정 알고리즘을 완료 조건으로 선택할 수 없다.

로컬 측정은 Node.js 24.19.0의 순수 표현 모듈만 대상으로 했다. Node.js 22.0.0, 전체 CLI, 세 운영체제와 peak RSS는 아직 측정하지 않았다.
