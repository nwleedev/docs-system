# 외부 패키지 없는 스캐너의 TDD 시나리오 테스트 방법 조사

## 조사 질문

[어간 NFD 매칭 결정](../decisions/stem-nfd-matching.md)은 매칭 엔진 재작성과 테스트의 시나리오 단위 재구성을 예상 영향으로 남겼다. 배포본은 외부 패키지 없이 실행해야 하는 조건에서, 사용자 시나리오에 맞춘 TDD로 재작성을 진행할 방법을 조사했다. 조사일은 2026년 8월 20일이다.

## 확인한 사실

### Node.js 내장 test runner는 배포 조건과 양립한다

- [Node.js 22의 `node:test`](https://nodejs.org/docs/latest-v22.x/api/test.html)는 Stability 2(Stable)이며 `describe`, `it`, subtest와 훅을 지원한다. `node --test`는 `**/*.test.mjs` 같은 기본 패턴으로 테스트 파일을 찾아 외부 러너 없이 실행한다.
- snapshot 검증은 [v22.3.0에서 실험 도입되어 v22.13.0 LTS에서 stable이 됐고 v22.14.0에서 `t.assert.fileSnapshot()`이 추가됐다](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V22.md). 갱신은 `--test-update-snapshots` 플래그를 쓴다.
- 테스트 파일은 개발 저장소에만 두므로 배포되는 스크립트 3개에는 아무것도 추가되지 않는다. [현행 개발 지침](../../../dev/node/mjs-cli.md)이 정한 개발 도구 Node.js 요구(`^20.19.0 || ^22.13.0 || >=24`)는 snapshot이 stable인 버전을 이미 포함하고, 배포 실행 조건(Node.js 22.0.0 이상)은 self-test만 관여하므로 영향이 없다.

### CLI 시나리오는 자식 프로세스로 검증한다

- [`node:child_process`](https://nodejs.org/docs/latest-v22.x/api/child_process.html)는 Stability 2이고, `spawnSync`의 `input` 옵션으로 stdin을 넣어 `stdout`, `stderr`, `status`를 검사할 수 있다.
- Node.js 저장소 자체가 [`test/parallel/test-cli-eval.js`](https://github.com/nodejs/node/blob/main/test/parallel/test-cli-eval.js)에서 `process.execPath`를 자식 프로세스로 실행해 자기 CLI를 검증한다. 현행 self-test의 자식 프로세스 검사와 같은 방식이다.

### TDD 절차의 원전

- [Kent Beck의 Canon TDD](https://tidyfirst.substack.com/p/canon-tdd)는 다섯 단계를 정의한다. 검사할 시나리오 목록을 먼저 쓰고, 목록에서 정확히 하나를 실행 가능한 테스트로 바꾸고, 그 테스트와 기존 테스트를 통과시키고, 필요하면 리팩터링한 뒤, 목록이 빌 때까지 반복한다. 흔한 실수로 목록 전체를 한꺼번에 테스트로 바꾸는 것과 구현이 계산한 값을 기대값에 복사하는 것을 명시한다.
- [Martin Fowler의 Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)는 같은 절차를 Red-Green-Refactor로 요약하며 테스트 목록 선행 단계를 Beck 원전으로 연결한다.
- [Given-When-Then](https://martinfowler.com/bliki/GivenWhenThen.html)은 각 테스트를 입력 상태, 실행, 기대 결과로 표현하는 방식이다. 사용자 시나리오 테스트는 별도 방법론이 아니라 각 테스트를 이 구조(입력 텍스트, 검사 실행, 기대 경고 JSON)로 쓰는 것이다.

### 검사기 도구들의 테스트 관행

- [ESLint `RuleTester`](https://eslint.org/docs/latest/integrate/nodejs-api#ruletester)는 규칙 하나당 통과해야 할 `valid` 사례 배열과 실패해야 할 `invalid` 사례 배열(메시지, `line`, `column` 위치 assertion 포함)을 데이터로 선언한다.
- [textlint-tester](https://github.com/textlint/textlint/tree/master/packages/textlint-tester)도 같은 구조(`valid`/`invalid`와 `range` 또는 `loc` 위치 assertion)를 쓴다.
- [Vale는 `testdata/styles`](https://github.com/errata-ai/vale/tree/v3/testdata/styles)에 규칙별 통과와 실패 fixture 문서를 두는 통합 테스트 방식이다.

세 도구가 공유하는 패턴은 "규칙 하나 = 통과 사례 배열 + 위치까지 검증하는 실패 사례 배열"이다.

### 재작성 전의 특성화 테스트

[Michael Feathers의 characterization testing](https://michaelfeathers.silvrback.com/characterization-testing)은 기존 코드를 바꾸기 전에 실제 출력을 기대값으로 고정하는 테스트를 정의한다. 원문은 이 테스트가 "시스템이 가졌으면 하는 동작이 아니라 실제 동작을 기록한다"고 명시하며, 운영 중인 시스템은 그 자체가 명세이므로 기존 동작이 언제 바뀌는지 알아야 한다는 근거를 든다. 구현이 계산한 값을 기대값으로 복사하는 것은 Canon TDD가 금지하는 실수지만, 특성화 단계에서는 의도된 예외다.

## 결론

- 배포본에는 `--self-test`만 남기고 개발 저장소에 `node --test` 기반 시나리오 테스트를 두는 이중 구조는 Node.js 22 표준 기능만으로 성립한다.
- 재작성 순서는 원전 절차와 일치하게 구성할 수 있다. 먼저 현행 스캐너의 JSON 출력을 대표 입력에 대해 특성화 테스트로 고정하고, 다음으로 새 요구(활용형, NFD 원문)의 시나리오 목록을 작성하고, 목록에서 하나씩 실패 테스트를 만들어 통과시키며 진행한다. 의도된 동작 변화는 특성화 기대값을 그 항목만 갱신해 드러낸다.
- 규칙 단위 테스트는 ESLint와 textlint의 관행대로 규칙마다 통과 사례와 실패 사례(경고의 `ruleId`, `line`, `startUtf16` 위치까지)를 데이터 표로 두고 공용 실행 도우미가 순회하는 구조가 표준에 부합한다. CLI 수준 시나리오(stdin 입력, 파일 입력, 종료 상태, NFD 원문)는 자식 프로세스 실행으로 소수만 둔다.

## 한계

- snapshot 검증을 쓰려면 개발 환경 Node.js가 22.13.0 이상이어야 한다. 하위 버전 개발 환경을 지원하려면 `assert.deepStrictEqual` 기반 명시 기대값으로 대체한다.
- Vale의 fixture 방식은 저장소 구조에서 확인했고 규칙 스크립트 단독 단위 테스트 수단이 없다는 논의는 이슈에서 확인했으나, 공식 문서의 서술은 아니다.
