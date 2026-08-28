# `scan.mjs --help`의 출력과 인수 처리 조사

## 결론

`--help`를 정상 정보 조회로 정의해 호출 설명을 stdout에 쓰고 상태 `0`으로 끝내는 관례는 GNU, Codex CLI, Git, ripgrep, curl, GitHub CLI, Cargo, Node.js, clap과 Python argparse에서 일치한다. 실제 도구들은 짧은 도움말과 긴 도움말을 나누는지, 잘못된 option과 함께 썼을 때 무엇을 우선하는지에는 서로 다른 선택을 한다. 이 스캐너에는 정확한 `--help`만 먼저 지원하고, 실제 네 입력 mode를 여러 usage 줄로 보여 주며, 긴 option 축약은 허용하지 않는 안이 가장 설명하기 쉽다. 이 안은 조사에서 도출한 제안이며 승인된 요구사항은 아니다.

이 문서는 [명령줄 도움말 요구사항](../requirements.md#명령줄-도움말)을 구현할 담당자가 출력 문안과 인수 조합을 결정할 때 사용하는 근거다. 조사일은 2026년 8월 28일이며 저장소의 최저 지원 버전인 Node.js 22.0.0 문서와 로컬 `codex-cli 0.141.0`, 2026년 8월 27일 공개된 Codex `rust-v0.150.1` 소스를 확인했다.

## 현재 스캐너 동작

[실행 진입점](../../../../skills/use-better-terms/scripts/scan.mjs)은 `--changed`, 반복 가능한 `--file`, `--stdin`, `--source-name`과 `--self-test`만 `parseArgs()`에 등록한다. `strict: true`와 `allowPositionals: false`를 사용하므로 등록하지 않은 `--help`는 parser 오류가 된다.

현재 유효한 입력은 다음 네 형태 가운데 하나다.

```text
node skills/use-better-terms/scripts/scan.mjs --changed <repo>
node skills/use-better-terms/scripts/scan.mjs --file <path> [--file <path> ...]
node skills/use-better-terms/scripts/scan.mjs --stdin --source-name <name>
node skills/use-better-terms/scripts/scan.mjs --self-test
```

`--help`를 직접 실행하면 stdout은 비어 있고 stderr에 `usage:invalid-arguments`가 기록되며 종료 상태는 `2`다. `--self-test --file a`도 mode 충돌로 상태 `2`가 되고, `--self-test` 단독은 상태 `0`과 빈 출력으로 끝난다.

[현재 개발 지침](../../../dev/node/mjs-cli.md)은 정상 실행 상태 `0`, 사용 및 실행 실패 상태 `2`, 실패 시 stderr의 공개 오류 코드 한 줄을 정한다. 인수 검사는 네 mode의 배타성, `--file` 이외 option의 반복 금지와 `--source-name`의 `--stdin` 종속성을 self-test에서 확인한다. 도움말 mode와 문안은 아직 다루지 않는다.

## 표준과 공식 도구의 공통점

[GNU Coding Standards의 `--help`](https://www.gnu.org/prep/standards/html_node/_002d_002dhelp.html)는 호출 방법의 짧은 문서를 stdout에 쓰고 성공 종료하며 정상 기능은 수행하지 않는다고 정한다. `--help` 뒤의 다른 option과 argument는 무시하는 동작도 정하지만, 이 순서 규칙을 모든 비 GNU CLI에 그대로 적용할 근거는 아니다.

[Node.js 22.0.0의 `util.parseArgs()`](https://nodejs.org/download/release/v22.0.0/docs/api/util.html#utilparseargsconfig)는 option에 `type`, `multiple`, `short`와 `default`를 정의하고 `tokens: true`로 실제 출현 순서를 돌려준다. 설명문이나 usage를 만들지는 않는다. 따라서 boolean `help` option을 등록하는 것만으로 도움말이 생기지 않으며, 출력 문안과 다른 인수보다 먼저 처리할지는 스캐너가 직접 정해야 한다.

로컬 `codex --help`는 상태 `0`, stdout의 도움말과 빈 stderr를 반환했다. 출력은 명령 설명, 두 `Usage:` 호출형, `Commands:`, `Arguments:`와 `Options:` 순서다. `codex -h`도 상태 `0`이지만 long help보다 짧은 설명을 제공한다. 설치된 버전과 같은 [Codex 0.141.0의 고정 소스](https://github.com/openai/codex/blob/3fb81667d30d9d24297216ea61fbfcc4351b2aa9/codex-rs/cli/src/main.rs#L90-L103)와 [최신 공개 release의 고정 소스](https://github.com/openai/codex/blob/90854393966b21e9ebfd21b122334eb09a20c93d/codex-rs/cli/src/main.rs#L99-L113)는 두 줄 usage와 clap `Parser` 구성을 유지한다.

Codex가 사용하는 clap 4.5.58의 [오류 stream과 상태 소스](https://github.com/clap-rs/clap/blob/05bac738ebc886143cceb80dd6905a41b42952bf/clap_builder/src/error/mod.rs#L216-L248)는 help와 version을 stdout 및 상태 `0`으로, 다른 parser 오류를 stderr 및 상태 `2`로 구분한다. [Python 3.14 argparse](https://docs.python.org/3/library/argparse.html)도 기본 `-h/--help`와 잘못된 argument list의 stderr 오류 및 상태 `2`를 구분한다. 구현 언어와 parser가 달라도 도움말은 정상 정보 출력, 잘못된 인수는 실패 진단이라는 구분이 같다.

## usage 구조와 option 배열

[POSIX.1-2024 Utility Argument Syntax](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap12.html)는 여러 synopsis 줄을 서로 다른 호출형에 사용할 수 있고, 대괄호로 선택 사항을, 세로줄로 상호 배타 항목을 나타낼 수 있다고 설명한다. option은 보통 알파벳 순서를 따르지만 그 순서가 설명을 더 어렵게 하면 다른 배열을 허용한다.

스캐너는 입력 mode가 서로 배타적이므로 한 줄에 모두 결합하기보다 유효한 호출형을 여러 줄로 보여 주는 편이 실제 parser 조건을 정확히 나타낸다. `--stdin`과 필수 보조 option인 `--source-name`은 함께 보여 주고, `--file`은 반복 가능하다는 사실을 usage 또는 설명에 표시해야 한다. option 설명은 입력 mode, 결합되는 보조 option, 유지보수 또는 정보 option처럼 사용 관계에 따라 묶을 수 있다.

POSIX는 단문자 option을 주로 다루며 GNU식 `--help`의 stream과 상태를 직접 정하지 않는다. 상호 배타 option이 충돌할 때 utility가 결과를 따로 정하지 않으면 결과가 정의되지 않을 수 있으므로, 도움말과 입력 option의 조합을 스캐너가 명시해야 한다.

## 도움말과 다른 인수의 우선순위

로컬 Codex CLI는 왼쪽에서 먼저 만난 terminal option이나 오류의 결과를 사용했다.

- `codex --help --version`, `codex --help unexpected`와 `codex --help --bogus`는 도움말과 상태 `0`을 반환했다.
- `codex --version --help`는 version만 반환했다.
- `codex --bogus --help`는 알 수 없는 option 오류와 상태 `2`를 반환했다.

GNU 지침과 Codex의 이 동작은 `--help`가 먼저 나타난 뒤의 인수를 무시하는 선택을 뒷받침한다. 반면 현재 스캐너는 모든 token을 해석한 뒤 정확히 하나의 mode인지 판정한다. `--help`를 단독 mode로만 허용하면 기존 parser 구조와 배타성 규칙을 가장 적게 바꾸지만 Codex와는 조합 동작이 달라진다. 두 방식 모두 설명할 수 있으므로 조사만으로 승인된 동작을 정하지 않는다.

## 실제 CLI의 출력 구성

2026년 8월 28일에 로컬에 설치된 CLI를 자식 process로 실행해 종료 상태, stdout과 stderr를 각각 확인했다. 버전은 Codex CLI 0.141.0, Git 2.40.0, ripgrep 15.2.0, Node.js 24.19.0, curl 8.7.1, GitHub CLI 2.27.0, Cargo 1.92.0과 pnpm 10.14.0이다. 이 관찰은 각 도구의 현재 최신 버전을 대표하지 않으며, 이 스캐너의 동작을 자동으로 정하는 표준도 아니다.

Codex는 `codex --help`에 설명, 여러 `Usage:` 줄, command, argument와 option을 순서대로 보여 준다. `codex -h`도 성공하지만 설명을 줄인 별도 출력을 쓴다. 설치된 Codex에서 `--help`가 먼저 오면 뒤의 알 수 없는 option을 보지 않고 도움말로 끝났고, 알 수 없는 option이 먼저 오면 상태 `2`의 오류로 끝났다. 이는 token 순서대로 terminal action을 처리하는 실제 사례다.

ripgrep은 `rg -h`에 자주 쓰는 option을 한 줄씩 정리한 약 7.7 KiB 출력을, `rg --help`에 manual에 가까운 약 73 KiB 출력을 썼다. [ripgrep 15.2.0의 공식 가이드](https://github.com/BurntSushi/ripgrep/blob/15.2.0/GUIDE.md#common-options)도 이 차이를 명시한다. option 수가 매우 많은 도구가 짧은 도움말과 참고 문서를 분리한 사례다. 이 스캐너의 공개 option은 현재 수가 적으므로 같은 이중 구조가 필요하다는 근거는 없다.

curl은 `curl --help`에 중요한 option과 도움말 category 안내만 보여 주고, `curl --help all`로 전체 option을 보여 준다. [curl 공식 manual의 `--help`](https://curl.se/docs/manpage.html#-h)는 category 이름이나 option 이름을 subject로 받을 수 있다고 정한다. 이 구조 역시 방대한 option 집합을 찾기 쉽게 만든 선택이며, 단순한 스캐너가 그대로 가져올 이유는 없다.

GitHub CLI는 `gh --help`, `gh -h`와 `gh help`가 같은 root 도움말을 출력했다. Cargo도 `cargo --help`, `cargo -h`와 `cargo help`를 제공하고, [Cargo 공식 문서](https://doc.rust-lang.org/cargo/commands/cargo-help.html)는 `cargo help <subcommand>`와 `<subcommand> --help`를 함께 안내한다. 두 도구는 하위 명령이 많기 때문에 `help` subcommand가 탐색 수단이 된다. 하위 명령이 없는 현재 스캐너에는 `help` positional을 추가할 필요가 없다.

Node.js는 `node --help`와 `node -h`가 같은 전체 도움말을 출력했다. Git은 설치된 버전에서 `git --help`와 `git -h`가 같은 간결한 root usage를 출력하며, 특정 하위 명령의 자세한 설명은 `git help <command>`로 연결한다. [현재 Git 공식 문서](https://git-scm.com/docs/git)는 root `-h`와 `--help`의 의미 및 help와 version을 함께 줄 때의 우선순위를 설명하지만, 설치된 Git 2.40.0에서 token 조합의 결과가 현재 문서와 모두 같지는 않았다. 특정 도구 하나의 조합 규칙을 버전 독립적인 관례로 간주하면 안 된다.

실행 결과를 종합하면 작은 단일 명령 CLI가 참고할 공통 부분은 다음과 같다.

- 도움말은 성공 결과이며 stdout과 상태 `0`을 사용한다.
- synopsis는 parser가 실제로 허용하는 호출형과 값의 관계를 나타낸다.
- option 설명은 이름만 나열하지 않고 반복 가능 여부, 필수 결합 option과 기본 동작을 밝힌다.
- 잘못된 인수는 도움말과 구분해 stderr와 실패 상태를 사용한다.

짧은 도움말을 별도로 두거나 `help` 하위 명령, category 탐색과 pager를 붙이는 것은 option 또는 하위 명령이 많은 도구의 선택이다. 현재 스캐너에는 호출형 네 개와 소수 option을 한 화면에 온전히 보여 주는 편이 낫다.

## 긴 option 축약

사용자가 입력한 정확한 이름 `--help`와 접두부 `--he`는 별도 입력이다. 로컬 Codex, Git, ripgrep, Node.js, curl, GitHub CLI와 Cargo는 `--he`를 도움말로 받아들이지 않았다. pnpm 10.14.0과 Python argparse 기본 설정은 이 입력을 받아들였지만, 이는 모든 CLI의 공통 관례가 아니다.

[Python 3.14 argparse의 `allow_abbrev`](https://docs.python.org/3/library/argparse.html#allow-abbrev)는 모호하지 않은 긴 option 접두부를 기본 허용하며 `allow_abbrev=False`로 끌 수 있다고 명시한다. 반면 현재 스캐너가 사용하는 [Node.js `util.parseArgs()`](https://nodejs.org/download/release/v22.0.0/docs/api/util.html#utilparseargsconfig)는 선언한 option 이름을 token과 연결하며 긴 option 축약 기능을 문서화하지 않는다.

축약을 허용하면 현재 `--he`가 유일하더라도 나중에 `--headers` 같은 option을 추가할 때 기존 입력이 모호해지거나 의미가 바뀔 수 있다. 사용 설명과 자동화에서 안정적인 interface를 유지하려면 정확한 `--help`만 허용하고 `--he`는 기존의 잘못된 인수 처리로 보내는 안이 타당하다. `-h`는 축약이 아니라 별도로 선언하는 단문자 별칭이므로 독립적으로 결정할 수 있다.

## 요구사항과 검증에 사용할 제안

다음 내용은 조사에서 도출한 제안이며 승인된 결정이 아니다.

- `--help`는 입력, Git, 파일, stdin과 두 탐지기를 실행하지 않고 설명만 stdout에 기록한 뒤 상태 `0`으로 끝낸다.
- 정상 도움말은 stderr를 비우고 마지막 LF가 있는 온전한 UTF-8 텍스트를 기록한다.
- 도움말에는 실제로 허용하는 모든 호출형, option 값, `--file` 반복과 `--source-name` 종속성을 표시한다.
- 기존의 잘못된 인수와 mode 충돌은 상태 `2`, 빈 stdout과 공개 오류 한 줄 stderr를 유지한다.
- 실제 자식 process로 상태, 두 stream, 정상 스캔 미실행과 기존 오류 동작을 확인한다.

`--self-test`는 parser의 유효 mode이고 요구사항이 도움말에 포함하도록 정했다. [Skill 실행 지침](../../../../skills/use-better-terms/SKILL.md)은 이를 일반 사용자 입력으로 안내하지 않으므로, 도움말에서는 다른 네 호출형과 함께 빠짐없이 설명하되 유지보수용 검사라는 용도를 구분해 표시할 수 있다.

## 결정이 필요한 사항과 한계

다음 선택을 승인할 역할은 현재 저장소 근거에서 확인되지 않았다.

- `--help`를 단독 mode로만 허용할지, 먼저 나타난 뒤의 인수를 무시할지
- `--help` 앞의 잘못된 option이나 값 누락을 먼저 오류로 처리할지
- 정확한 `--help` 외에 `-h`를 별칭으로 제공하고 같은 내용 또는 짧은 내용을 쓸지
- 실행 이름을 저장소 상대 명령으로 표시할지, Skill 설치 위치를 나타내는 placeholder를 쓸지
- 잘못된 인수에서 현재 오류 코드만 쓸지, 짧은 usage나 `--help` 안내도 함께 쓸지

Codex 실행 관찰은 macOS의 설치된 0.141.0에서 수행했다. 최신 0.150.1은 공개 release와 고정 소스를 확인했지만 새 binary를 설치해 실행하지 않았다. 스캐너는 현재 Node.js 24.19.0에서 재현했으며 최저 지원 Node.js 22.0.0 binary, Windows와 Linux의 줄바꿈 및 terminal 폭은 실행하지 않았다.
