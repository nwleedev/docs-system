# Node.js MJS 명령줄 검사기

이 문서는 저장소에서 배포할 단독 `.mjs` 검사기의 현재 개발 지침이다. 후속 `scan-korean-expressions.mjs`는 Node.js 22.0.0 이상에서 외부 패키지와 네트워크 없이 실행한다. 저장소의 ESLint는 개발할 때만 사용하며 Node.js `^20.19.0 || ^22.13.0 || >=24`, ESLint 10.8.0과 `@eslint/js` 10.0.1을 요구한다. 실행 파일을 스킬에 복사할 때 `package.json`, lock 파일, ESLint와 `node_modules`는 함께 배포하지 않는다.

이 지침은 [검사기 설계 계획](../../designs/korean-writing-review-6f3a/plan.md)과 현재 `eslint.config.mjs`를 근거로 한다. `.mjs`는 가까운 `package.json`의 `type`과 무관하게 ES module로 해석된다. Node.js API 동작은 22.x 공식 문서와 소스, Git 입력은 Git 2.18.0 이상에서 사용할 수 있는 공식 명령과 형식을 기준으로 확인했다.

## 단독 CLI는 파일 끝에서 한 번 실행한다

**막을 실패.** `import.meta.main`은 Node.js 22.18.0에 추가됐다. 이를 진입 조건으로 사용하면 Node.js 22.0.0부터 22.17.x까지 본문을 실행하지 않고 상태 `0`으로 끝난다. 처리하지 않은 top-level rejection은 상태 `1`과 stack trace를 남길 수 있고, 완료되지 않은 top-level await는 의도한 상태 `2`가 아닌 값으로 끝날 수 있다.

**적용 조건과 관찰 결과.** 검사기는 다른 module이 import하는 library가 아니라 직접 실행하는 단독 CLI다. `main()`을 파일 끝의 top-level `await` 한 곳에서 호출하고, 성공할 때만 종료 상태를 `0`으로 바꾼다. 후보가 발견된 것은 실행 실패가 아니므로 경고 수와 무관하게 상태 `0`을 반환한다. SIGINT와 SIGTERM handler는 추가하지 않아 운영체제가 정한 signal 종료 의미를 유지한다.

**권장 코드.** 실패 상태를 먼저 정하면 끝나지 않은 Promise도 성공으로 보고하지 않는다.

```mjs
import process from "node:process";

process.exitCode = 2;

try {
  await main(process.argv.slice(2));
  process.exitCode = 0;
} catch (error) {
  try {
    await writePublicError(error);
  } catch {
    // stderr가 실패한 뒤에는 추가로 쓸 출력 수단이 없다.
  }
}
```

**피해야 할 코드.** 최소 지원 버전인 Node.js 22.0.0에서 `import.meta.main`은 `undefined`이며, `process.exit()`는 쓰는 중인 stdout을 자를 수 있다.

```mjs
if (import.meta.main) {
  main().catch(console.error);
}

process.exit(0);
```

**검증.** ESLint는 지침에서 정한 `process` import를 사용한 `process.exit()`, 전역 `console.*`과 `import.meta.main`을 거부한다. Node.js 22.0.0에서 정상 입력, 잘못된 인수, rejected Promise와 끝나지 않는 Promise를 직접 실행해 각각 의도한 상태와 stream을 확인한다.

## 인수 해석은 반복 option까지 검사한다

**막을 실패.** `parseArgs()`의 단일 option을 반복하면 기본 동작은 오류가 아니라 마지막 값을 선택하는 것이다. `--changed a --changed b`, 두 번의 `--stdin`과 같은 입력을 값만 보고 검사하면 앞선 입력이 사라진다. `--changed`, `--file`, `--stdin` 가운데 여러 방식을 함께 받거나 `--source-name`을 단독으로 받는 경우에도 처리 범위가 달라질 수 있다.

**적용 조건과 관찰 결과.** `--file`만 반복할 수 있다. `--changed`, `--stdin`, `--source-name`과 `--self-test`는 각각 한 번만 받을 수 있다. 유효한 실행은 `--changed <repo>`, 하나 이상의 `--file <path>`, `--stdin --source-name <name>`, `--self-test` 가운데 하나다. `--source-name`은 `--stdin`에만 붙인다. option 문자열과 source 이름은 고립 surrogate를 허용하지 않는다.

**권장 코드.** `tokens: true`로 실제 출현 횟수를 확인한 뒤 입력 방식의 조합을 판정한다.

```mjs
import { parseArgs } from "node:util";

const parsed = parseArgs({
  args,
  options,
  strict: true,
  allowPositionals: false,
  tokens: true,
});

const counts = new Map();
for (const token of parsed.tokens) {
  if (token.kind === "option") {
    counts.set(token.name, (counts.get(token.name) ?? 0) + 1);
  }
}

for (const name of ["changed", "stdin", "source-name", "self-test"]) {
  if ((counts.get(name) ?? 0) > 1) {
    throw new UsageError("option-repeated");
  }
}

const inputNames = [
  parsed.values.changed,
  ...(parsed.values.file ?? []),
  parsed.values["source-name"],
].filter((value) => value !== undefined);

for (const value of inputNames) {
  if (value.length === 0) {
    throw new UsageError("invalid-input-name");
  }
  if (!value.isWellFormed()) {
    throw new UsageError("invalid-input-name");
  }
}

if ((parsed.values.file?.length ?? 0) > maxSources) {
  throw new UsageError("too-many-sources");
}

const changedMode = parsed.values.changed !== undefined;
const fileMode = (parsed.values.file?.length ?? 0) > 0;
const stdinMode = parsed.values.stdin === true;
const selfTestMode = parsed.values["self-test"] === true;
const sourceName = parsed.values["source-name"];

const selectedModes = [];
if (changedMode) {
  selectedModes.push("changed");
}
if (fileMode) {
  selectedModes.push("file");
}
if (stdinMode) {
  selectedModes.push("stdin");
}
if (selfTestMode) {
  selectedModes.push("self-test");
}

if (selectedModes.length !== 1) {
  throw new UsageError("invalid-input-mode");
}

const selectedMode = selectedModes[0];
const hasSourceName = sourceName !== undefined;
if (selectedMode === "stdin") {
  if (!hasSourceName) {
    throw new UsageError("source-name-required");
  }
} else if (hasSourceName) {
  throw new UsageError("source-name-without-stdin");
}
```

**피해야 할 코드.** 최종 `values`만 세면 반복한 option을 찾지 못한다.

```mjs
const { values } = parseArgs({ args, options });
const modes = Number(Boolean(values.changed)) + Number(Boolean(values.stdin));
```

**검증.** 입력 방식의 모든 조합, source 수 상한, 반복 가능한 `--file`, 반복하면 안 되는 option, 빈 option 값과 고립 high 및 low surrogate를 self-test에서 실행한다. `filter(Boolean)`은 빈 값을 검사 전에 없애므로 사용하지 않는다. ESLint는 실제 argv의 출현 횟수와 문자열 구성을 판정하지 못한다.

## 입력 제한은 source별 실제 byte로 적용한다

**막을 실패.** `String.length`는 UTF-16 code unit 수이며 UTF-8 byte 수가 아니다. 파일의 사전 `stat.size`만 믿으면 검사와 읽기 사이에 커진 내용을 놓칠 수 있다. stdin을 모두 모은 뒤 검사하면 메모리 제한을 이미 넘긴다. 서로 다른 파일의 byte를 합친 뒤 decode하면 한 파일 끝의 불완전한 UTF-8과 다음 파일 시작 byte가 하나의 정상 문자로 결합할 수도 있다.

**적용 조건과 관찰 결과.** `--file` 인수와 Git status 결과는 파일을 열기 전에 같은 source 수 상한을 적용한다. 파일과 stdin은 chunk를 받을 때마다 실제 byte를 더한다. source마다 제한과 엄격한 UTF-8 decode를 마친 뒤 `Source`를 만들고, 전체 제한은 source별 byte 수를 별도로 누적한다. 빈 source는 정상 입력이다. 한 stdin source의 chunk는 같은 decoder 입력이므로 source가 바뀐 것으로 보지 않는다. 각 source 맨 앞의 UTF-8 BOM은 3 byte로 상한에 포함하지만 기본 decoder가 결과 문자열에서 제거한다. 따라서 다음 문자는 `startUtf16` 1에서 시작하고 BOM만 있는 source는 byte 수가 3인 빈 문자열이 된다. source 중간의 같은 byte sequence는 U+FEFF로 유지한다. NUL byte가 있으면 텍스트 입력으로 처리하지 않지만, NUL 하나만으로 모든 binary 형식을 식별했다고 설명하지 않는다.

**권장 코드.** source마다 새 decoder를 쓰면 각 source의 BOM도 같은 방식으로 처리된다.

```mjs
import { Buffer } from "node:buffer";
import { TextDecoder } from "node:util";

async function decodeSource(
  chunks,
  { committedTotalBytes, maxSourceBytes, maxTotalBytes },
) {
  const buffers = [];
  let sourceBytes = 0;

  for await (const chunk of chunks) {
    sourceBytes += chunk.byteLength;
    if (sourceBytes > maxSourceBytes) {
      throw new InputError("source-too-large");
    }
    if (committedTotalBytes + sourceBytes > maxTotalBytes) {
      throw new InputError("total-too-large");
    }
    buffers.push(chunk);
  }

  const input = Buffer.concat(buffers, sourceBytes);
  if (input.includes(0)) {
    throw new InputError("nul-byte");
  }

  return {
    bytes: sourceBytes,
    text: new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: false,
    }).decode(input),
  };
}
```

**피해야 할 코드.** 문자열 길이와 여러 source를 합친 decoder는 제한 및 source 구분을 훼손한다.

```mjs
const text = Buffer.concat(allFiles).toString("utf8");
if (text.length > maxSourceBytes) {
  throw new Error("too large");
}
await decodeSource(chunks, Math.min(maxSourceBytes, remainingTotalBytes));
new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(input);
```

`decodeSource()` 호출 코드는 디코딩에 성공한 뒤 반환된 `bytes`를 전체 합계에 한 번 더한다. 남은 전체 byte가 `0`이어도 빈 source는 허용한다.

**검증.** source 및 전체 byte 제한 직전과 직후, source별 제한은 넘지 않지만 합계는 넘는 입력, 두 제한을 동시에 넘는 입력, 남은 전체 byte가 `0`인 빈 source, 잘못된 UTF-8, source 둘로 나눈 불완전 sequence, stdin chunk 둘로 나눈 정상 sequence, source 맨 앞과 중간의 BOM, BOM만 있는 source 및 NUL을 self-test로 확인한다. ESLint는 입력값과 chunk 생명주기를 판정하지 못한다.

## 파일은 표시 위치와 열린 대상 모두 검사한다

**막을 실패.** `realpath()`를 먼저 호출한 뒤 결과에 `lstat()`을 적용하면 마지막 symlink가 이미 대상 파일로 바뀌어 symlink 여부를 잃는다. 문자열 `startsWith()`로 저장소 안인지 확인하면 이름 접두사가 같은 다른 디렉터리도 통과할 수 있다. 검사 뒤 파일을 다시 열면 확인한 대상과 읽은 대상이 달라질 수 있다.

**적용 조건과 관찰 결과.** 호출자가 준 위치를 `lstat()`으로 먼저 검사한다. `--file`은 마지막 symlink와 비정규 파일을 입력 실패로 처리하고, `--changed`는 Git가 보고한 현재 위치가 처음부터 symlink 또는 비정규 파일이면 검사 대상에서 제외한다. 처음 확인한 일반 파일이 open 전에 바뀌어 생긴 오류는 실행 실패로 처리한다. `--changed`는 실제 저장소 루트와 후보의 `realpath()`를 구하고 `path.relative()` 결과로 저장소 안인지 확인한다. `--file`은 저장소 밖의 절대 또는 현재 디렉터리 기준 상대 위치도 받을 수 있으므로 저장소 포함 검사를 적용하지 않는다. 반복한 `--file`은 realpath를 Set에 넣어 같은 실제 위치의 중복을 거부하되 호출 순서는 유지한다. Windows 위치를 임의로 소문자로 바꾸지 않는다. 원래 후보를 `O_NOFOLLOW` 및 제공되는 환경의 `O_NONBLOCK`과 함께 한 번 열고 같은 file handle로 file type, byte 제한과 내용을 확인한다. `O_NOFOLLOW`가 없는 환경과 악의적인 동시 위치 교체까지 모든 운영체제에서 막는다고 주장하지 않는다.

**권장 코드.** 검사 순서가 바뀌면 symlink 거부 조건도 바뀌므로 한 흐름으로 유지한다.

```mjs
import { constants } from "node:fs";
import { lstat, open, realpath } from "node:fs/promises";
import { isAbsolute, relative, sep as pathSeparator } from "node:path";

const lexicalStats = await lstat(candidate);
if (lexicalStats.isSymbolicLink() || !lexicalStats.isFile()) {
  if (mode === "changed") {
    return null;
  }
  throw new InputError("regular-file-required");
}

const realCandidate = await realpath(candidate);
if (mode === "changed") {
  const relativePath = relative(realRoot, realCandidate);
  const isRepositoryRoot = relativePath === "";
  const isParent = relativePath === "..";
  const isNestedParent = relativePath.startsWith(`..${pathSeparator}`);
  if (isRepositoryRoot || isParent) {
    throw new InputError("outside-repository");
  }
  if (isNestedParent || isAbsolute(relativePath)) {
    throw new InputError("outside-repository");
  }
}
if (seenRealPaths.has(realCandidate)) {
  throw new InputError("duplicate-file");
}
seenRealPaths.add(realCandidate);

const handle = await open(
  candidate,
  constants.O_RDONLY |
    (constants.O_NOFOLLOW ?? 0) |
    (constants.O_NONBLOCK ?? 0),
);
try {
  const openedStats = await handle.stat();
  if (!openedStats.isFile()) {
    throw new InputError("regular-file-required");
  }
  return await readBounded(handle, maxBytes);
} finally {
  await handle.close();
}
```

**피해야 할 코드.** 다음 순서는 symlink를 일반 파일로 잘못 본다.

```mjs
const resolved = await realpath(candidate);
const stats = await lstat(resolved);
if (resolved.startsWith(realRoot) && stats.isFile()) {
  return readFile(resolved);
}
```

`--file`에서 위치가 없으면 입력 실패다. `--changed`에서는 최초 `lstat()` 자체가 `ENOENT` 또는 `ENOTDIR`로 끝난 경우만 검사 대상에서 제외한다. 최초 `lstat()`이 성공한 뒤 `realpath()`, `open()`, `FileHandle.stat()` 또는 읽기에서 생긴 오류는 모두 실행 실패로 올린다. `EACCES`, `EPERM`, `ELOOP`, `EMFILE`도 어느 단계에서든 실행 실패다. `--file` 결과에 내보낼 위치 형태는 2단계의 schema 승인에서 정하며 개인 절대 위치를 임의로 출력하지 않는다.

**검증.** 일반 파일, 같은 실제 위치를 가리키는 서로 다른 표기, 마지막 symlink, 저장소 밖을 가리키는 symlink, 이름 접두사가 같은 이웃 디렉터리, 디렉터리, FIFO 및 특수 파일을 운영체제별 실행 검사로 확인한다. ESLint는 file system 결과와 동시 교체를 판정하지 못한다.

## Git은 shell 없이 제한된 환경에서 실행한다

**막을 실패.** command 문자열을 shell로 실행하면 저장소 위치나 인수가 명령으로 해석될 수 있다. 저장소가 설정한 fsmonitor 또는 untracked cache는 현재 파일을 놓칠 수 있고, 선택적 index 갱신은 읽기 작업 중 lock을 만들 수 있다. Git 관련 환경변수는 config와 실행 대상을 바꿀 수 있다. Windows에서는 신뢰하지 않는 `cwd`에서 실행 파일 이름만 넘길 때 해당 디렉터리의 가짜 실행 파일을 먼저 찾을 수 있다.

**적용 조건과 관찰 결과.** 신뢰하는 PATH에서 절대 Git 실행 파일을 저장소 `cwd`를 적용하기 전에 구한다. 상대 또는 빈 PATH 항목은 후보에서 제외한다. Windows에서는 shell 없이 직접 실행할 수 있는 `git.exe`만 선택하고 `.cmd`와 `.bat` 후보는 건너뛴다. 대소문자를 구분하지 않고 모든 `GIT_*` 환경변수를 제거하고 locale을 고정한다. Windows의 `PATH`, `Path` 같은 표기는 하나의 `PATH` key로 합치고 중복 key를 child environment에 남기지 않는다. 서로 다른 값의 PATH 표기가 둘 이상이면 어느 값을 실행과 자식 process에 쓸지 임의로 고르지 않고 실패시킨다. resolver와 child process에는 정리한 같은 `PATH` 값을 쓴다. 같은 환경에서 `git rev-parse --show-toplevel`을 먼저 실행해 저장소 루트를 구하고 그 realpath를 status의 `cwd`와 파일 포함 검사의 기준으로 쓴다. 이 저장소는 이름에 CR이나 LF가 든 루트를 허용하지 않으며, rev-parse 결과를 임의로 `trim()`하지 않고 마지막 LF 하나만 제거한 뒤 나머지 CR 및 LF를 거부한다. `execFile()`의 기본값이 shell을 사용하지 않으므로 `shell` option 자체를 전달하지 않는다. `timeout`, `maxBuffer`와 `windowsHide`를 명시한다. `maxBuffer`는 stdout과 stderr에 각각 적용되므로 총 메모리 예산을 한 stream의 값으로 설명하지 않는다.

**권장 코드.** status가 보고할 범위를 명령 인수로 고정한다.

```mjs
import { execFile } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";
import { promisify } from "node:util";

function sanitizeEnvironment(environment, platform) {
  const sanitized = {};
  let windowsPath;
  const isWindows = platform === "win32";

  for (const [name, value] of Object.entries(environment)) {
    const upperName = name.toUpperCase();
    const isGitVariable = upperName.startsWith("GIT_");
    const isLcAllVariable = upperName === "LC_ALL";
    const isLangVariable = upperName === "LANG";
    const isLocaleVariable = isLcAllVariable || isLangVariable;
    if (isGitVariable || isLocaleVariable) {
      continue;
    }
    const isWindowsPath = isWindows && upperName === "PATH";
    if (isWindowsPath) {
      if (windowsPath === undefined) {
        windowsPath = value;
        continue;
      }
      if (windowsPath !== value) {
        throw new GitInputError("ambiguous-path");
      }
      continue;
    }
    sanitized[name] = value;
  }

  if (isWindows && windowsPath !== undefined) {
    sanitized.PATH = windowsPath;
  }
  sanitized.LC_ALL = "C";
  sanitized.LANG = "C";
  return sanitized;
}

const sanitizedEnvironment = sanitizeEnvironment(process.env, process.platform);
const gitName = process.platform === "win32" ? "git.exe" : "git";
const gitExecutable = await findExecutableOnTrustedPath(
  gitName,
  sanitizedEnvironment.PATH,
);
const runFile = promisify(execFile);
const repositoryCandidate = resolve(process.cwd(), repositoryArgument);
const rootResult = await runFile(
  gitExecutable,
  ["--no-pager", "--no-optional-locks", "rev-parse", "--show-toplevel"],
  {
    cwd: repositoryCandidate,
    encoding: "buffer",
    env: sanitizedEnvironment,
    maxBuffer: gitRootOutputLimit,
    timeout: gitTimeoutMs,
    windowsHide: true,
  },
);
const realRoot = await validateRepositoryRoot(rootResult);

const gitArgs = [
  "--no-pager",
  "--no-optional-locks",
  "-c", "core.fsmonitor=",
  "-c", "core.untrackedCache=false",
  "-c", "advice.statusUoption=false",
  "status",
  "--porcelain=v1",
  "-z",
  "--untracked-files=all",
  "--ignore-submodules=all",
  "--no-renames",
];

const { stdout, stderr } = await runFile(gitExecutable, gitArgs, {
  cwd: realRoot,
  encoding: "buffer",
  env: sanitizedEnvironment,
  maxBuffer: gitOutputLimit,
  timeout: gitTimeoutMs,
  windowsHide: true,
});

if (stderr.byteLength !== 0) {
  throw new GitInputError("git-warning");
}
```

**피해야 할 코드.** `exec()`는 shell을 사용하고 현재 환경을 그대로 물려준다.

```mjs
import { exec, execFile } from "node:child_process";

const childEnvironment = { ...process.env };
delete childEnvironment.GIT_DIR;
exec(`git -C ${repo} status --porcelain`, { env: childEnvironment });
execFile("git.cmd", ["status"]);
```

**검증.** ESLint는 `execFile`과 `spawnSync` 이외의 `node:child_process` import, 허용 목록 밖의 import, dynamic import, 두 허용 함수의 import 별칭, 직접 호출에 전달한 `shell` 속성과 option object의 계산된 속성을 거부한다. 함수에 다시 대입한 별칭, 변수 또는 spread에 숨은 shell option과 실제 네트워크 요청 여부는 구현 검토와 후속 실행 검사에서 확인한다. 대소문자를 바꾼 Git 환경변수, Windows의 `Path` 및 `PATH` 단일 표기와 값이 같은 중복 및 값이 다른 중복, resolver와 child process가 받은 PATH, fsmonitor, untracked cache, stderr warning, timeout, stdout과 stderr 상한 및 Windows에서 `git.exe`만 고르는 실행 파일 검색도 실행 결과로 확인한다.

## Git status의 결과 범위를 과장하지 않는다

**막을 실패.** Git 2.18은 읽을 수 없는 디렉터리를 warning으로 알리고 상태 `0`으로 계속할 수 있다. 이 stderr를 무시하면 일부 untracked 파일이 빠진 성공 결과가 된다. index의 `assume-unchanged` 또는 `skip-worktree` bit가 있는 tracked file은 실제 내용이 바뀌어도 status에서 빠질 수 있다. Git 2.18은 이후 도입된 repository ownership 검사도 제공하지 않는다.

**적용 조건과 관찰 결과.** `--changed`는 파일 시스템의 모든 차이를 독자적으로 찾는 기능이 아니라, 제한된 설정으로 실행한 Git status가 보고한 staged, unstaged와 untracked 위치를 읽는다. 성공 상태에서도 stderr가 있으면 결과를 버린다. Git 2.18을 유지하는 동안 `--changed`는 현재 사용자가 소유하고 신뢰하는 worktree에만 적용한다. `assume-unchanged` 또는 `skip-worktree`까지 검사해야 한다는 요구가 생기면 `git ls-files -v -z` 검사를 별도로 승인받는다.

**권장 코드.** 범위를 status 결과로 한정하고 현재 파일이 존재하는지 다시 확인한다. 삭제 상태만 보고 무조건 제외하면 삭제 뒤 같은 위치에 다시 만든 파일을 놓칠 수 있다.

```mjs
for (const record of parseStatus(stdout)) {
  const source = await readChangedPath(realRoot, record.path);
  if (source !== null) {
    sources.push(source);
  }
}
```

**피해야 할 코드.** status가 성공했다는 이유만으로 stderr와 누락 가능성을 무시하지 않는다.

```mjs
const { stdout } = await runGitStatus(repo);
process.chdir(realRoot);
return parseStatus(stdout);
```

`readChangedPath()`는 `resolve(realRoot, record.path)`로 파일 API에 넘길 후보를 만든 뒤 앞 절의 `lstat()`, `realpath()`와 저장소 포함 검사를 적용한다. process 전체의 현재 디렉터리를 바꾸지 않는다.

**검증.** 저장소 안과 밖에서 실행한 staged, unstaged, untracked, 삭제 후 재생성, conflict, unborn branch, `assume-unchanged`, `skip-worktree`, 읽을 수 없는 디렉터리와 신뢰하지 않는 저장소를 실행 검사로 확인한다. Git 설정과 file system 상태는 ESLint가 판정하지 못한다.

## porcelain 결과는 byte 상태에서 분리한다

**막을 실패.** 줄바꿈으로 결과를 나누면 파일 이름의 줄바꿈을 record 끝으로 오해한다. 전체 stdout을 먼저 문자열로 바꾸면 잘못된 UTF-8의 위치를 잃고 대체 문자가 들어갈 수 있다. 마지막 NUL이 없거나 예상하지 않은 rename 또는 copy record를 조용히 허용하면 불완전한 결과를 정상 처리한다.

**적용 조건과 관찰 결과.** stdout을 Buffer로 받고 NUL byte로 먼저 나눈다. 비어 있지 않은 출력은 NUL로 끝나야 한다. 각 record의 고정 `XY`와 구분 byte를 확인한 뒤 위치 부분만 fatal UTF-8로 decode한다. source 본문과 달리 파일 이름 맨 앞의 U+FEFF는 실제 이름이므로 pathname decoder에 `ignoreBOM: true`를 주어 보존한다. `--no-renames`를 썼으므로 rename 및 copy 상태가 나오면 실패한다. Git가 표시한 저장소 상대 위치는 `/`를 유지한다.

**권장 코드.** 형식이 다르면 빈 결과로 바꾸지 말고 실패시킨다.

```mjs
const ordinaryStatuses = new Set([
  " M", " T", " A", " D",
  "M ", "MM", "MT", "MD",
  "T ", "TM", "TT", "TD",
  "A ", "AM", "AT", "AD",
  "D ",
]);
const unmergedStatuses = new Set(["DD", "AU", "UD", "UA", "DU", "AA", "UU"]);

function validateStatus(x, y) {
  const status = String.fromCharCode(x, y);
  if (status === "??") {
    return;
  }
  if (ordinaryStatuses.has(status)) {
    return;
  }
  if (unmergedStatuses.has(status)) {
    return;
  }
  throw new GitInputError("invalid-status");
}

function splitNulRecords(output) {
  if (output.length === 0) {
    return [];
  }
  if (output.at(-1) !== 0) {
    throw new GitInputError("truncated-status");
  }

  const records = [];
  let start = 0;
  for (let end = output.indexOf(0); end !== -1; end = output.indexOf(0, start)) {
    records.push(output.subarray(start, end));
    start = end + 1;
    if (start === output.length) {
      break;
    }
  }
  return records;
}
```

각 record는 Buffer 상태에서 `XY`, space와 위치 byte를 각각 검사한 뒤 위치만 `TextDecoder`로 해석한다.

```mjs
const path = new TextDecoder("utf-8", {
  fatal: true,
  ignoreBOM: true,
}).decode(pathBytes);
```

**피해야 할 코드.** 파일 이름에는 줄바꿈과 일반 공백이 들어갈 수 있다.

```mjs
for (const line of stdout.toString("utf8").split("\n")) {
  paths.push(line.slice(3));
}
const allowed = new Set([0x20, 0x41, 0x44, 0x4d, 0x54, 0x55]);
if (!allowed.has(x) || !allowed.has(y)) {
  throw new GitInputError("invalid-status");
}
new TextDecoder("utf-8", { fatal: true }).decode(pathBytes);
```

`R`과 `C`는 `--no-renames` 조건과 어긋나므로 거부한다. `T`는 일반 파일과 symlink 사이처럼 file type이 바뀔 때 나오는 정상 상태다. parser는 이를 받아들인 뒤 현재 대상이 symlink 또는 비정규 파일이면 앞 절의 `readChangedPath()` 조건에 따라 제외한다.

**검증.** ` T`, `T `, `MT`, `TT`, ` A`, 일곱 unmerged 조합과 `??`의 통과를 확인한다. 알 수 없는 상태, ` U`, `U `, `MU`, `UT`, `MA`, `DM`, `DT`, `R`, `C`, 맨 앞의 U+FEFF, 공백, 탭, 줄바꿈과 비 ASCII 문자가 있는 위치, 잘못된 UTF-8, 마지막 NUL 누락 및 빈 출력도 parser self-test로 확인한다. U+FEFF로 시작하는 파일 이름과 type change는 Linux, macOS와 Windows의 Git 2.18 이상 실제 출력과도 대조한다. ESLint는 Git record의 byte 형식을 판정하지 못한다.

## literal 탐색은 빈 표현을 거부하고 겹침을 보존한다

**막을 실패.** 일치 길이만큼 다음 시작점을 옮기면 겹치는 후보를 놓친다. 빈 표현은 `indexOf()`가 계속 같은 범위에서 일치해 반복이 끝나지 않을 수 있다. 정규식으로 바꾸면 escaping, 빈 일치와 실행 비용을 새로 처리해야 한다.

**적용 조건과 관찰 결과.** 내장 `rules`의 expression, message, 판정 질문과 사례를 포함한 모든 문자열에 `isWellFormed()`을 적용한다. expression은 빈 문자열과 CR 또는 LF를 포함한 여러 줄 값을 추가로 거부한다. 각 일치 뒤에는 시작점에서 UTF-16 code unit 하나만 전진한다. 규칙과 표현의 선언 순서를 보존하며, 외부 입력으로 규칙을 선택하거나 정규식을 받지 않는다.

**권장 코드.** `from = start + 1`이 겹치는 literal을 보존한다.

```mjs
function findAll(text, expression) {
  if (!expression.isWellFormed()) {
    throw new RuleDataError("invalid-expression");
  }
  if (expression.length === 0) {
    throw new RuleDataError("invalid-expression");
  }
  if (/[\r\n]/u.test(expression)) {
    throw new RuleDataError("invalid-expression");
  }

  const starts = [];
  for (let from = 0; from <= text.length;) {
    const start = text.indexOf(expression, from);
    if (start === -1) {
      break;
    }
    starts.push(start);
    from = start + 1;
  }
  return starts;
}
```

**피해야 할 코드.** 다음 구현은 `aaa`에서 `aa`의 두 번째 출현을 놓친다.

```mjs
from = start + expression.length;
```

**검증.** 모든 규칙 문자열의 고립 surrogate, 빈 표현, 여러 줄 표현, `aaa` 안의 `aa`, 같은 위치에서 서로 다른 규칙이 일치하는 경우와 모든 규칙 순회를 self-test로 확인한다. ESLint는 cursor가 실제로 전진하는지와 결과의 완전성을 증명하지 못한다.

## 위치와 quote는 원문 문자를 보존한다

**막을 실패.** JavaScript 문자열의 offset은 UTF-16 code unit 기준이다. code point나 UTF-8 byte를 섞으면 emoji 뒤의 열이 달라진다. CRLF를 두 줄로 세거나 원문을 LF로 바꾸면 위치가 실제 파일과 맞지 않는다. quote를 단순 `slice()`하면 surrogate pair 사이를 잘라 원문에 없던 고립 surrogate를 만들 수 있다.

**적용 조건과 관찰 결과.** `line`은 1부터 시작한다. `startUtf16`은 현재 줄 시작부터 일치 시작까지의 code unit 수에 1을 더한 값이고, `endUtf16`은 같은 줄에서 일치 뒤 첫 열이다. LF, CRLF와 단독 CR만 줄바꿈으로 센다. U+2028과 U+2029는 현재 승인된 줄바꿈 목록에 없으므로 줄을 늘리지 않는다. 규칙을 초기화할 때 가장 긴 expression이 quote 상한 이하인지 확인한다. quote는 일치 전체를 먼저 배정하고 남은 길이만 앞뒤 문맥에 나누며, 절단점이 surrogate pair를 나누면 문맥 쪽 code unit을 안으로 줄인다.

**권장 코드.** 일치 전체를 보존한 뒤 절단점 양쪽의 code unit을 확인한다.

```mjs
if (maxExpressionLength > maxQuoteUtf16) {
  throw new RuleDataError("quote-too-short");
}

const remaining = maxQuoteUtf16 - (matchEnd - matchStart);
let start = Math.max(lineStart, matchStart - Math.floor(remaining / 2));
let end = Math.min(lineEnd, matchEnd + Math.ceil(remaining / 2));

if (isLowSurrogate(text.charCodeAt(start)) &&
    isHighSurrogate(text.charCodeAt(start - 1))) {
  start += 1;
}

if (isHighSurrogate(text.charCodeAt(end - 1)) &&
    isLowSurrogate(text.charCodeAt(end))) {
  end -= 1;
}

const quote = text.slice(start, end);
```

**피해야 할 코드.** code point 배열은 원문의 UTF-16 offset과 다른 단위를 만든다.

```mjs
const column = [...lineText.slice(0, matchStart)].length + 1;
const quote = lineText.slice(matchStart - context, matchEnd + context);
```

**검증.** LF, CRLF, 단독 CR, U+2028, U+2029, tab, BMP 문자, emoji 앞뒤 일치, expression 길이가 quote 상한과 같은 경우 및 한 code unit 긴 경우를 self-test로 확인한다. ESLint는 계산된 위치가 원문과 일치하는지 판정하지 못한다.

## 결과 순서는 locale에 의존하지 않는다

**막을 실패.** `localeCompare()` 결과는 locale과 ICU 자료에 따라 달라질 수 있다. object의 key 순서를 결과 의미로 사용하면 integer 모양 key와 생략 가능한 값 때문에 의도한 순서가 바뀔 수 있다. `--file` 입력까지 정렬하면 호출자가 지정한 순서를 잃는다.

**적용 조건과 관찰 결과.** `--file`은 입력 순서를 유지한다. Git 위치는 strict UTF-8로 해석한 뒤 원래 UTF-8 byte의 `Buffer.compare()`로 정렬한다. 규칙과 표현은 선언 순서, 출현은 숫자 offset 순서를 쓴다. 순서가 의미 있는 집합은 배열로 표현하며 Unicode normalization은 적용하지 않는다.

**권장 코드.** 호출자가 전달한 배열은 바꾸지 않고 byte 비교로 새 배열을 만든다.

```mjs
const orderedGitSources = gitSources.toSorted(
  (left, right) => Buffer.compare(left.pathBytes, right.pathBytes),
);
```

**피해야 할 코드.** 다음 결과는 실행 환경에 따라 달라질 수 있다.

```mjs
sources.sort((left, right) => left.path.localeCompare(right.path));
```

**검증.** ASCII, 비 ASCII, 정규화 형태가 다른 위치와 입력 순서를 self-test에서 반복 실행해 byte가 같은 JSON을 확인한다. 정렬 전후의 입력 배열이 같고 반환값은 새 배열인지도 확인한다. 지역에서 새로 만들었고 아직 외부에 전달하지 않은 배열의 `sort()`는 허용하므로 method 자체를 정적 규칙으로 막지 않는다. `sort-keys` 같은 ESLint 규칙은 검사 결과에 필요한 순서를 증명하지 못하므로 사용하지 않는다.

## JSON은 전체 크기를 확인한 뒤 한 번 쓴다

**막을 실패.** `JSON.stringify()`는 BigInt와 순환 참조에서 예외를 던지고, `undefined`는 위치에 따라 조용히 생략하거나 `null`로 바꾼다. 문자열 길이만 확인하면 UTF-8 출력 제한과 맞지 않는다. stdout callback에서 오류 listener를 즉시 제거하면 callback 뒤에 발생하는 `error` event를 놓쳐 상태 `1`로 끝날 수 있다. 제한에 맞춰 JSON 문자열을 잘라 쓰면 구문이 깨진다.

**적용 조건과 관찰 결과.** 결과 schema를 먼저 검사하고 전체 JSON과 마지막 newline을 만든다. `Buffer.byteLength()`로 출력 전에 상한을 확인한다. 상한을 넘으면 아무 JSON도 쓰지 않는다. stdout의 write callback과 `error` event를 모두 처리한 뒤 성공 상태로 바꾼다. 호출자는 종료 상태 `0`인 stdout만 결과로 사용해야 하며, pipe가 중간에 닫히면 일부 byte가 전달될 수 있다는 stream의 한계는 남는다.

**권장 코드.** write callback에서 오류가 있으면 listener를 남겨 뒤따르는 event를 소비한다.

```mjs
function writeText(stream, text) {
  return new Promise((resolve, reject) => {
    const onError = (error) => reject(error);

    stream.once("error", onError);
    stream.write(text, (error) => {
      if (error) {
        reject(error);
      } else {
        stream.off("error", onError);
        resolve();
      }
    });
  });
}

function serializeResult(result, maxBytes) {
  const json = JSON.stringify(result);
  if (typeof json !== "string") {
    throw new OutputError("serialization-failed");
  }
  const output = `${json}\n`;
  if (Buffer.byteLength(output, "utf8") > maxBytes) {
    throw new OutputError("output-too-large");
  }
  return output;
}
```

**피해야 할 코드.** `process.exit()`와 문자열 절단은 온전한 JSON을 보장하지 않는다.

```mjs
const json = JSON.stringify(result).slice(0, maxBytes);
process.stdout.write(json);
process.exit(0);
```

**검증.** 정상 객체, 최상위 `undefined`, BigInt, 순환 참조, 한글을 포함한 상한 직전과 직후, 닫힌 pipe와 write 실패를 self-test 또는 자식 프로세스 검사로 확인한다. ESLint는 지침에서 정한 import 이름을 사용하는 `process.exit()`은 찾지만 stream event 순서와 직렬화 결과를 판정하지 못한다.

## 실패 메시지는 원문과 개인 위치를 내보내지 않는다

**막을 실패.** `console.error(error)`는 stack, 절대 파일 위치, Git stderr와 입력 원문을 그대로 표시할 수 있다. 내부 오류를 빈 변경 목록으로 바꾸면 실패와 실제 변경 없음이 구분되지 않는다.

**적용 조건과 관찰 결과.** 입력 처리 지점은 공개 가능한 오류 종류로 바꾸되 원인이 필요한 내부 검사에서는 `cause`를 유지한다. 최상위는 정해진 한 줄만 stderr에 쓰고 상태 `2`를 유지한다. stderr 쓰기마저 실패하면 추가 출력 수단이 없으므로 같은 상태로 끝낸다. 오류를 `sources: []`로 바꾸지 않는다.

**권장 코드.** 외부 메시지는 오류 종류와 사용자가 바꿀 수 있는 조건만 담는다.

```mjs
try {
  return await readGitSources(repo);
} catch (error) {
  if (error instanceof InputError) {
    throw error;
  }
  throw new InputError("changed-input-failed", { cause: error });
}
```

**피해야 할 코드.** 다음 코드는 정보가 새고 실패를 성공으로 바꾼다.

```mjs
try {
  return await readGitSources(repo);
} catch (error) {
  console.error(error);
  return [];
}
```

**검증.** 인수, Git, 파일, UTF-8, 제한과 직렬화 실패마다 상태 `2`, 빈 stdout, 한 줄 stderr 및 원문과 절대 위치 부재를 자식 프로세스로 확인한다. 이미 분류한 `InputError`는 상위 조정 함수를 지나도 같은 오류 객체와 오류 코드를 유지하고, 원시 오류만 가장 가까운 I/O 접점에서 한 번 바뀌어야 한다. ESLint의 `no-console`, `no-unused-vars`와 `preserve-caught-error`는 일부 코드 형태만 검사한다. `preserve-caught-error`의 기본 설정은 기본 제공 오류만 인식하므로 사용자 정의 오류의 변환 횟수와 `cause`는 구현 검토와 실행 검사에서도 확인한다.

## 계산 함수는 입력과 실행 환경을 바꾸지 않는다

**막을 실패.** literal 탐색이나 위치 계산이 전달받은 객체, module 범위 배열 또는 global 및 sticky 정규식의 상태를 바꾸면 같은 입력을 다시 검사한 결과가 달라질 수 있다. 의존 함수를 인수로 받는다는 사실만으로 함수가 순수해지지는 않는다. 전달받은 함수가 파일, Git 또는 stream을 읽으면 해당 호출은 부수 효과를 가진다.

**적용 조건과 관찰 결과.** 규칙 검증, literal 탐색, 위치와 quote 계산 및 결과 조립은 같은 문자열과 규칙 자료에 같은 계산 결과를 반환한다. 이 함수들은 호출자의 입력, module 상태, process, 파일과 stream을 바꾸지 않는다. 함수 안에서 새로 만든 지역 배열에 값을 추가하는 것은 호출 밖에서 관찰할 상태를 남기지 않으므로 허용한다. 파일, Git, stdin, stdout과 stderr를 사용하는 함수는 이름과 인수에서 그 부수 효과를 드러낸다. `main()`과 source 제공 함수를 호출하는 조정 함수는 순수 함수로 분류하지 않는다.

**권장 코드.** `findAll()`이 빈 표현과 줄바꿈을 검사하므로 같은 탐색 반복을 다시 작성하지 않는다. 한 규칙의 모든 표현을 순회하고 호출마다 새 결과를 만든다.

```mjs
function scanRule(source, rule) {
  return rule.expressions.flatMap((expression) =>
    findAll(source.text, expression).map((offsetUtf16) => ({
      expression,
      offsetUtf16,
      ruleId: rule.id,
    })),
  );
}
```

**피해야 할 코드.** `const`는 배열과 정규식의 내부 상태를 고정하지 않는다. `sort()`는 전달받은 배열을 바꾸고 global 정규식의 `lastIndex`는 실행 사이에 남는다.

```mjs
const candidatePattern = /candidate/g;
const findings = [];

function scanSource(source, rules) {
  rules.sort(compareRules);
  if (candidatePattern.test(source.text)) {
    findings.push(source.name);
  }
  return findings;
}

class SharedFindings {
  static values = [];

  static add(value) {
    this.values.push(value);
  }
}
```

**검증.** 같은 입력을 두 번 호출해 결과가 같고 서로 다른 결과 배열을 반환하는지 확인한다. 호출 전후의 입력도 `assert.deepEqual()`로 대조한다. 실행 순서를 A, B, A로 바꿔도 두 A 결과가 같아야 한다. ESLint의 `no-param-reassign`, `no-var`와 module `let` 제한은 인수의 별칭, 변경 함수로 전달한 인수, `rules.sort()`, 외부 Map, 정규식 상태, class의 static field와 I/O를 판정하지 못하므로 self-test와 구현 검토를 함께 사용한다.

## 함수는 한 결과나 한 부수 효과 접점을 맡는다

**막을 실패.** 한 함수가 인수 해석, Git 실행, 파일 읽기, literal 탐색, 위치 계산과 JSON 출력을 직접 수행하면 한 정책만 바뀌어도 같은 함수를 수정해야 한다. 반대로 문장 수나 줄 수만 줄이려고 한 번 쓰는 표현식을 helper로 옮기면 이름과 호출부만 늘어난다. `processData()`나 `handleItem()`처럼 넓은 이름은 입력, 반환값과 부수 효과를 드러내지 않는다.

**적용 조건과 관찰 결과.** 함수는 한 계산 결과를 만들거나 한 종류의 I/O 접점을 맡는다. CLI 한 번을 조정하는 `main()`은 여러 함수를 순서대로 호출할 수 있지만 각 단계의 내부 규칙을 다시 구현하지 않는다. 함수 이름은 `parseCliRequest()`, `readChangedSources()`, `findAll()`, `serializeResult()`와 `writeText()`처럼 행동과 대상을 드러낸다. 주석은 이름과 코드를 되풀이하지 않고 운영체제 차이, 보안 제한과 UTF-16 같은 이유를 설명할 때만 사용한다.

**권장 코드.** 각 변경 원인과 실패 종류를 해당 단계에 둔다.

```mjs
async function main(args) {
  const request = parseCliRequest(args);
  const result = await scanSources({
    provideSources: () => provideSources(request),
  });

  await writeText(
    process.stdout,
    serializeResult(result, maxOutputBytes),
  );
}
```

**피해야 할 코드.** 다음 함수는 이름이 역할을 설명하지 않고 서로 다른 실패 규칙을 한곳에 모은다.

```mjs
async function processData(args) {
  const values = parseArgs({ args, options });
  const gitOutput = await runGit(values.changed);
  const findings = await readAndScan(gitOutput);
  process.stdout.write(JSON.stringify(findings));
}
```

**검증.** 함수 이름과 호출부만 읽고 입력, 반환 결과와 부수 효과를 설명할 수 있는지 검토한다. 인수 규칙, Git 형식, 탐색 방식 또는 출력 schema 중 하나를 바꿀 때 무관한 함수도 함께 바꿔야 하면 분리 대상을 다시 찾는다. `max-lines-per-function`, `max-statements`, `complexity`와 `max-depth`는 줄, 문장, 실행 경로와 중첩만 세므로 하나의 기능을 증명하지 않는다. 구현 분포와 승인된 상한이 없으므로 이 규칙들은 활성화하지 않는다. `no-shadow`는 같은 이름으로 바깥 값을 가리는 코드만 보조적으로 거부한다.

## 비동기 반복은 작업의 독립성과 자원 상한으로 고른다

**막을 실패.** `for await...of`는 병렬 반복이 아니다. 일반 `for...of` 또는 `for await...of`로 미리 시작한 Promise 배열을 차례로 기다리면 앞 Promise를 기다리는 동안 뒤 Promise의 rejection이 처리되지 않을 수 있다. 반대로 `paths.map()`에서 파일 읽기를 전부 시작한 뒤 `Promise.all()`로 결과를 기다리면 동시에 열린 파일과 메모리 사용량이 source 수에 비례해 늘 수 있다. 최악에는 source 수만큼 파일을 함께 열 수 있다. 한 작업이 먼저 실패해도 이미 시작된 나머지 작업은 취소되지 않는다. `Promise.allSettled()`의 rejected 결과를 확인하지 않으면 실패를 정상 결과처럼 넘길 수 있다.

**적용 조건과 관찰 결과.** stdin과 Readable의 chunk는 순서, backpressure와 중단 시 stream 정리가 필요하므로 `for await...of`로 소비한다. 여러 파일은 입력 순서, 누적 byte 예산, 한 번에 여는 파일 수와 첫 실패를 함께 통제하므로 현재는 한 파일씩 읽는다. `Promise.all()`과 `Promise.allSettled()`는 작업을 시작하지 않고 iterable에서 받은 Promise를 관찰한다. `Promise.all()`은 시작 수가 작게 제한되고 서로 독립적이며 하나라도 실패하면 전체가 실패해야 하는 작업에만 사용한다. `Promise.allSettled()`는 모든 독립 작업의 성공과 실패를 끝까지 수집해야 한다는 요구가 있을 때만 사용하고 rejected 결과를 전부 검사한다. 두 method의 결과 배열은 입력 순서를 유지한다. `Promise.all()`은 등록한 rejection handler가 먼저 실행된 이유로 reject하며 이미 시작한 다른 작업을 취소하지 않는다. 서로 다른 실패를 공개 결과에서 구분해야 하면 순차 실행하거나 `allSettled()` 결과에서 입력 순서로 실패를 선택한다.

**권장 코드.** 순차 처리가 필요하면 Promise를 미리 만들지 않고 반복 안에서 작업을 시작한다.

```mjs
async function readSources(paths, limits) {
  const sources = [];
  let committedTotalBytes = 0;

  for (const sourcePath of paths) {
    const source = await readSource(sourcePath, {
      committedTotalBytes,
      maxSourceBytes: limits.maxSourceBytes,
      maxTotalBytes: limits.maxTotalBytes,
    });
    committedTotalBytes += source.bytes;
    sources.push(source);
  }

  return sources;
}

```

stdin과 Readable은 앞의 `decodeSource()`처럼 `for await...of`로 소비한다. 일반 배열이 값을 공급하고 본문도 동기식이면 일반 반복을 사용한다.

```mjs
for (const sourcePath of paths) {
  validateSourcePath(sourcePath);
}
```

작업이 서로 독립적이고 호출 수가 승인된 상한 안이면 호출을 모두 시작한 직후 `Promise.all()`로 관찰한다.

```mjs
const pending = checks.map(
  (check) => Promise.resolve().then(check),
);
const results = await Promise.all(pending);
```

`Promise.resolve().then(check)`는 일반 함수의 동기 예외를 rejection으로 바꾸고, 모든 Promise를 만든 뒤 집계 handler가 연결되도록 callback 실행을 미룬다. 모든 callback이 `async function`이며 호출 중 예외도 rejected Promise가 된다는 조건을 확인했다면 직접 호출해도 된다.

모든 독립 실패를 모아야 한다는 요구가 생기면 다음처럼 rejected 결과를 명시적으로 처리한다.

```mjs
async function runIndependentChecks(checks) {
  const pending = checks.map(
    (check) => Promise.resolve().then(check),
  );
  const outcomes = await Promise.allSettled(pending);
  const failures = outcomes.filter(
    (outcome) => outcome.status === "rejected",
  );
  if (failures.length > 0) {
    const reasons = failures.map((failure) => failure.reason);
    throw new AggregateError(reasons);
  }
}
```

**피해야 할 코드.** 다음 코드는 작업을 모두 시작하거나 rejected 결과를 버린다.

```mjs
const sources = await Promise.all(
  paths.map((sourcePath) => readSource(sourcePath, budget)),
);

const pending = paths.map((sourcePath) => readSource(sourcePath, budget));
for (const promise of pending) {
  sources.push(await promise);
}

for await (const source of pending) {
  sources.push(source);
}

for await (const sourcePath of paths) {
  validateSourcePath(sourcePath);
}

const outcomes = await Promise.allSettled(tasks);
return outcomes
  .filter((outcome) => outcome.status === "fulfilled")
  .map((outcome) => outcome.value);
```

**검증.** stream은 chunk 순서, UTF-8 sequence 분할, byte 상한과 중단 뒤 종료를 검사한다. 병렬 처리를 승인한 경우에는 시간 차이 대신 최대 동시 실행 수, 입력 순서의 성공 결과, 먼저 관찰된 실패와 여러 실패 및 부분 출력 부재를 검사한다. 여러 작업의 실패 순서를 바꿔도 외부 오류 코드와 stderr가 같아야 한다. 취소가 요구되면 같은 `AbortSignal`을 전달하는 것만으로 끝내지 않고 시작된 작업의 정리까지 별도로 설계한다. 현재 self-test는 process와 stream 상태를 사용하므로 사례를 순서대로 실행한다. ESLint의 `no-await-in-loop`는 올바른 순차 파일 처리를 거부하면서 `for await...of`와 그 본문의 `await`는 보고하지 않는다. `no-restricted-syntax`로 async 반복이나 Promise combinator를 일괄 거부해도 정상 사례를 함께 막는다. 작업 독립성, 자원 상한과 실패 정책은 정적 규칙이 판정하지 못하므로 해당 규칙을 활성화하지 않는다.

## 복합 판단식은 이름이 있는 단계로 나눈다

**막을 실패.** 여러 mode boolean, 부정, 비교와 `sourceName` 조건을 한 표현식에 넣으면 어떤 조합이 통과하는지 직접 확인하기 어렵다. 모든 JavaScript 연산자를 같은 상한으로 세면 단순한 byte 계산과 index 이동까지 불필요하게 나뉘므로 이 지침은 복합 판단식의 논리, 비교와 부정 연산에 제한을 적용한다.

**적용 조건과 관찰 결과.** 한 판단식에는 `&&`, `||`, `??`, 비교 연산자와 `!`를 합쳐 두 개까지만 둔다. 조건이 더 많으면 각 사실에 이름을 붙이거나 guard clause로 나눈다. 네 mode boolean을 다른 함수로 전달하지 않고 인수 해석 단계에서 하나의 `kind`로 바꾼다. 산술, byte 합계, index 증가와 bit flag 조합은 각 계산 규칙이 설명하며 이 상한만을 이유로 나누지 않는다.

**권장 코드.** 먼저 선택된 mode 수를 검사한 뒤 `sourceName` 조건을 별도 guard로 확인한다.

```mjs
function resolveMode(values) {
  const selectedModes = [];

  if (values.changed !== undefined) {
    selectedModes.push("changed");
  }
  if ((values.file?.length ?? 0) > 0) {
    selectedModes.push("file");
  }
  if (values.stdin === true) {
    selectedModes.push("stdin");
  }
  if (values["self-test"] === true) {
    selectedModes.push("self-test");
  }

  if (selectedModes.length !== 1) {
    throw new UsageError("invalid-input-mode");
  }

  const kind = selectedModes[0];
  const hasSourceName = values.sourceName !== undefined;
  if (kind === "stdin") {
    if (!hasSourceName) {
      throw new UsageError("source-name-required");
    }
  } else if (hasSourceName) {
    throw new UsageError("source-name-without-stdin");
  }

  return { kind, sourceName: values.sourceName };
}
```

**피해야 할 코드.** 다음 식은 서로 다른 유효 상태를 한꺼번에 열거한다.

```mjs
const validMode =
  (changedMode && !fileMode && !stdinMode && sourceName === undefined) ||
  (!changedMode && fileMode && !stdinMode && sourceName === undefined) ||
  (!changedMode && !fileMode && stdinMode && sourceName !== undefined);
```

**검증.** 네 mode의 모든 조합과 `sourceName` 유무는 self-test로 실행해 승인된 상태만 통과하는지 확인한다. 연산자 개수는 JavaScript source의 AST를 읽어야 하므로 구현 검토가 맡는다. ESLint core에는 임의 표현식의 연산자 총수를 세는 규칙이 없다. `complexity`는 함수 전체의 분기와 logical expression을 함께 세고 top-level 및 산술 연산을 같은 방식으로 검사하지 않으므로 이 상한과 동치가 아니다. `no-restricted-syntax` selector도 연산자가 양쪽 subtree에 나뉜 경우를 정확히 집계하지 못한다.

## 의존 기능은 필요한 함수만 전달한다

**막을 실패.** 기능 수가 늘었다는 이유로 class나 공용 dependency container를 만들면 순수 계산 함수도 파일을 읽고 Git을 실행하거나 process 객체에 접근할 수 있으며 실제 의존 관계가 인수에서 보이지 않는다. 상태가 없는 class는 표준 함수 호출을 한 단계 감쌀 뿐이다. 상태가 있는 class의 method를 함수 값으로 떼어 전달하면 receiver를 잃어 private field 접근이 실패할 수 있다.

**적용 조건과 관찰 결과.** 현재 `scanSources({ provideSources })`처럼 필요한 기능 하나를 함수로 전달하는 방식은 유지한다. 기능이 늘어나도 파일이나 Git을 읽는 함수에는 실제로 호출할 함수만 이름으로 전달하고, 순수 함수에는 계산할 값만 전달한다. class는 여러 호출에서 같은 상태나 자원을 유지하거나, 여러 method가 같은 조건, 호출 순서 또는 `close()` 같은 종료 절차를 함께 지켜야 하며 함수나 기존 Node.js 객체로 해결할 수 없을 때 다시 검토한다. 기능 또는 method 수만 늘어난 것은 전환 근거가 아니다. Node.js `FileHandle`처럼 이미 상태와 종료 동작을 제공하는 객체는 별도 객체로 감싸지 않고 사용한다.

**권장 코드.** 함수가 실제로 사용하는 두 기능만 전달한다.

```mjs
async function readChangedSources(
  { repository },
  { runGit, readFileSource },
) {
  const paths = await runGit(repository);
  return readSourcesInOrder(paths, readFileSource);
}
```

**피해야 할 코드.** 다음 class는 상태, 불변 조건과 수명주기 없이 호출을 전달하고, 큰 container는 숨은 I/O를 허용한다.

```mjs
class ScannerDependencies {
  readFile(path) {
    return readFileSource(path);
  }

  runGit(repository) {
    return runGitStatus(repository);
  }
}

async function scanSources(context) {
  const paths = await context.git.run();
  return context.fs.read(paths);
}
```

class를 승인한 뒤 method를 callback으로 전달해야 한다면 receiver를 보존한다.

```mjs
const provideSources = () => provider.provideSources();
```

`provideSources: provider.provideSources`처럼 method만 떼어 전달하면 `this`가 필요한 구현은 실패한다.

**검증.** 새 class 제안에는 여러 호출에서 유지할 상태나 자원, 여러 method가 함께 지킬 조건, 호출 순서 또는 수명주기 가운데 필요한 항목과 기존 함수 또는 Node.js 객체로 해결할 수 없는 이유를 제시한다. 근거가 없으면 함수나 필요한 함수만 담은 작은 객체를 유지한다. class가 승인되면 method를 분리해 전달하는 사례도 실행해 호출 대상 객체가 유지되는지 확인한다. ESLint core는 class가 필요한 시점, 여러 의존 기능을 묶은 객체의 범위와 분리된 method의 호출 대상 객체를 판정하지 못하므로 class 관련 규칙은 추가하지 않는다.

## self-test는 순수 검사와 실제 프로세스를 나눈다

**막을 실패.** `assert.throws()`에 async 함수를 넘기면 Promise rejection을 검사하지 못한다. 같은 process의 `exitCode`를 직접 바꾸는 검사는 CLI가 실제로 그 상태로 종료됐다는 증거가 아니다. 현재 파일 위치를 URL pathname으로 직접 바꾸면 공백, percent encoding과 Windows 위치가 깨질 수 있다. 자식 process에 timeout이 없으면 종료 회귀를 검사하는 self-test 자체가 멈출 수 있다.

**적용 조건과 관찰 결과.** 순수 함수의 동기 실패는 `assert.throws()`, 비동기 실패는 `assert.rejects()`를 쓴다. 인수, stream과 종료 상태는 현재 파일을 자식 process로 실행해 확인한다. self-test용 동기 process 실행은 허용하지만 정상 CLI의 파일 및 Git 처리는 비동기로 유지한다.

**권장 코드.** `fileURLToPath()`로 현재 module URL을 운영체제 위치로 바꾼다.

```mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

await assert.rejects(() => readInvalidUtf8(), InputError);
assert.deepEqual(parseStatus(Buffer.from(" M file.md\0")), [
  { status: " M", path: "file.md" },
]);

const child = spawnSync(
  process.execPath,
  [fileURLToPath(import.meta.url), "--invalid-self-test-argument"],
  {
    encoding: "utf8",
    timeout: selfTestTimeoutMs,
    maxBuffer: selfTestOutputLimit,
    windowsHide: true,
  },
);
assert.equal(child.error, undefined);
assert.equal(child.signal, null);
assert.equal(child.status, 2);
assert.equal(child.stdout, "");
```

**피해야 할 코드.** async 실패와 URL pathname을 직접 사용하지 않는다. 운영 parser와 같은 분기 및 offset 계산을 self-test용 helper에 다시 구현해도 실제 parser의 회귀를 찾지 못한다.

```mjs
assert.throws(() => readInvalidUtf8());
spawnSync(process.execPath, [new URL(import.meta.url).pathname, "--invalid"]);
```

**검증.** `--self-test`가 parser, literal 탐색, 위치 계산과 직렬화에 사용하는 운영 함수를 직접 호출하는지 확인한다. process와 stream 상태를 사용하는 사례는 순서대로 실행한다. `--self-test` 자체가 상태 `0`으로 끝나는지 직접 실행한다. Node.js 22.0.0의 Linux, macOS와 Windows에서 같은 검사와 대표 입력을 실행하기 전에는 세 운영체제에서 확인했다고 기록하지 않는다.

## ESLint가 맡는 코드 형태를 제한한다

`eslint.config.mjs`는 코드를 실행하지 않고도 정확히 찾을 수 있으며 현재 한 파일 설계에 해당하는 형태만 거부한다. 현재 규칙은 다음 항목을 맡는다.

ESLint 10.8.0과 `@eslint/js` 10.0.1은 MIT license를 사용한다. `@eslint/js`에는 runtime dependency가 없으며, 현재 lock 파일을 대상으로 한 audit에서는 알려진 취약점이 보고되지 않았다. 의존성을 갱신할 때 engine, peer dependency, license, audit와 아래 code-path 문제를 다시 확인한다.

- `@eslint/js` recommended는 parser 오류, 미정의 및 미사용 이름, 잘못된 반복 방향, switch의 block 누락과 fallthrough, 도달하지 않는 코드 및 ESLint 10의 원인 없는 재던지기를 검사한다.
- `array-callback-return`, `eqeqeq`, `no-duplicate-imports`, `no-throw-literal`과 `no-unreachable-loop`는 callback 반환 누락, 느슨한 비교, 중복 import, Error가 아닌 throw와 한 번만 실행되는 loop를 거부한다.
- `no-param-reassign`은 인수와 인수 속성의 직접 변경을 거부한다. `no-shadow`는 바깥 scope의 이름과 JavaScript 기본 전역 이름을 더 안쪽 scope에서 다시 선언하는 코드를 거부한다. 두 규칙은 순수 함수나 한 가지 기능을 증명하지 않고, 입력 변경과 이름 혼동의 일부 형태만 찾는다.
- `no-var`는 모든 `var` 선언을 거부한다. `no-restricted-syntax`는 module의 직접 `let` 선언과 `export let`을 거부한다. 함수 내부의 지역 `let`은 허용하며 `const` 객체, 배열, Map, Set과 정규식의 내부 상태는 이 규칙으로 찾지 못한다.
- `no-eval`, `no-implied-eval`, `no-new-func`와 `globalThis.Function` 제한은 입력 문자열을 코드로 실행하는 직접 형태를 거부한다.
- `no-restricted-imports`와 `no-restricted-syntax`는 승인된 Node.js built-in 목록 밖의 static import, dynamic import, `node:module`, `execFile` 및 `spawnSync` 이외의 child process import, default가 아닌 `node:process` import, 이름을 바꾼 `node:process` 기본 import, 두 허용 함수의 import 별칭, 직접 표기한 `import.meta.main`, `import.meta`의 변수 할당과 구조분해, 직접 호출에 전달한 `shell` 속성과 계산된 option 속성을 거부한다.
- `no-restricted-properties`는 식별자 이름을 유지한 `process.abort()`, `process.execve()`, `process.exit()`, `process.getBuiltinModule()`과 `process.kill()`을 거부한다. `node:process`는 default import만 허용하므로 같은 API를 named import로 가져올 수 없다.
- 같은 규칙은 `globalThis.process`, `globalThis.Function`, `globalThis.fetch`, `globalThis.WebSocket`과 `globalThis.console` 직접 접근도 거부한다.
- `no-console`은 전역 `console`을 직접 사용하는 출력을 거부한다.
- 사용하지 않는 inline 설정과 disable 주석은 오류로 처리한다.

허용한 built-in은 `node:assert/strict`, `node:buffer`, `node:child_process`, `node:fs`, `node:fs/promises`, `node:path`, `node:process`, `node:url`과 `node:util`이다. 구현에서 다른 built-in이 실제로 필요해지면 사용 이유와 실행 조건을 확인한 뒤 허용 목록을 함께 바꾼다. 계산식 또는 assignment에 숨긴 `import.meta.main`, 계산식으로 만든 `globalThis` 속성, `Reflect.get()`, process, 함수 및 option object의 별칭이나 구조분해, sequence나 conditional expression, spread와 허용된 child process로 다른 실행 파일을 호출하는 동작까지 ESLint가 증명하지는 않는다. 네트워크 없음, 제한된 Git 실행과 온전한 종료는 self-test와 구현 검토에서도 확인해야 한다.

### 정상 및 오류 사례를 stdin으로 다시 검사한다

준비 범위 밖의 fixture 파일은 추가하지 않는다. 다음 명령을 실행하고 해당 사례를 표준 입력에 붙여 넣은 뒤 입력을 끝내면 다른 검수자도 같은 설정을 다시 확인할 수 있다. 가상 파일 이름은 검사기용 ESLint 범위와 일치해야 한다.

```sh
pnpm exec eslint --stdin --stdin-filename skills/use-words-review/scripts/static-case.mjs
```

다음 정상 사례는 출력 없이 상태 `0`이어야 한다. 허용한 built-in과 child process 함수만 정적인 이름으로 가져오고, process 출력도 정의된 stream을 직접 쓴다.

```mjs
import assert from "node:assert/strict";
import { execFile, spawnSync } from "node:child_process";
import process from "node:process";

export const scannerVersion = 1;

assert.equal(typeof execFile, "function");
assert.equal(typeof spawnSync, "function");
assert.equal(scannerVersion, 1);
process.stdout.write("");

function copySource(source) {
  return { ...source, text: "" };
}

function renameSources(source) {
  return [source].map((candidate) => candidate.name);
}

function classify(length) {
  if (length === 0) {
    return "empty";
  }
  if (length === 1) {
    return "single";
  }
  return "multiple";
}

function increment(value) {
  let result = value;
  result += 1;
  return result;
}

const source = { name: "input.md", text: "candidate" };
assert.deepEqual(copySource(source), { name: "input.md", text: "" });
assert.deepEqual(renameSources(source), ["input.md"]);
assert.equal(classify(source.text.length), "multiple");
assert.equal(increment(1), 2);
```

다음 오류 사례는 상태 `1`이어야 한다. 결과에는 `no-restricted-imports`, `no-restricted-syntax`와 `no-restricted-properties`가 모두 있어야 한다.

```mjs
import childProcess, { exec, execFile, spawnSync } from "node:child_process";
import process, { abort, execve, kill } from "node:process";
import * as processNamespace from "node:process";
import "node:https";

await import("node:path");
const { main } = import.meta;
if (import.meta[`main`]) {
  processNamespace.exit(0);
}
if (main) {
  processNamespace.exit(0);
}
exec("git status");
childProcess.exec("git status");
process.abort();
process.execve("/trusted/executable", []);
process.kill(process.pid, "SIGTERM");
abort();
execve("/trusted/executable", []);
kill(process.pid, "SIGTERM");
execFile("git", ["status"], { ["she" + "ll"]: true });
spawnSync("git", ["status"], { [String.raw`shell`]: true });
new globalThis.Function("return process")();
globalThis.fetch("https://example.invalid");
```

다음 오류 사례도 상태 `1`이어야 한다. 결과에는 `array-callback-return`, `eqeqeq`, `no-console`, `no-duplicate-imports`, `no-eval`, `no-implied-eval`, `no-new-func`, `no-throw-literal`, `no-unreachable-loop`와 `no-unused-vars`가 모두 있어야 한다.

```mjs
import path from "node:path";
import { sep } from "node:path";

const mapped = [1].map((value) => {
  value + 1;
});

if (mapped.length == "1") {
  console.log(path, sep);
}

eval("mapped.length");
globalThis.setTimeout("mapped.length", 0);
new Function("return mapped")();

for (const value of mapped) {
  throw "invalid";
}
```

다음 오류 사례도 상태 `1`이어야 한다. 결과에는 `no-param-reassign`, `no-shadow`, `no-var`와 module 가변 binding을 찾은 `no-restricted-syntax`가 모두 있어야 한다.

```mjs
import process from "node:process";

let mutableTotal = 0;
export let exportedTotal = 0;

function countOnce() {
  var count = 0;
  count += 1;
  return count;
}

function clearSource(source) {
  source.text = "";
  return source;
}

function renameSources(source) {
  return [source].map((source) => source.name);
}

const source = { name: "input.md", text: "candidate" };
mutableTotal += source.text.length;
exportedTotal += countOnce();

clearSource(source);
renameSources(source);
process.stdout.write(String(mutableTotal + exportedTotal));
```

`consistent-return`, `no-await-in-loop`, `no-else-return`, `no-nested-ternary`, `complexity`, `max-depth`, `max-lines-per-function`, `max-params`, `max-statements`, `sort-keys`, `eslint-plugin-n`, `eslint-plugin-security`와 custom rule은 사용하지 않는다. error-first callback의 조기 `return`, source의 순차 처리와 검사 결과의 순서는 정상 코드일 수 있다. `else`와 삼항 연산자를 사용했다는 사실만으로 판단식이 복잡하거나 함수 역할이 섞였다고 판정할 수도 없다. 줄, 문장, 인수와 실행 경로 수는 함수가 한 기능만 맡는지 또는 판단식에 연산자가 몇 개 있는지 증명하지 않는다. 현재 정적으로 판정할 사례는 ESLint core 규칙이 맡고, 실행해야 확인할 조건은 self-test와 실행 검사가 맡으므로 추가 plugin을 도입하지 않는다.

ESLint가 받아들인 [`no-useless-assignment`의 try-catch 오탐 보고](https://github.com/eslint/eslint/issues/19245)는 `try` 안의 `return` 때문에 `catch`의 사용 지점이 이어지지 않는 code-path 사례를 설명한다. 같은 구조에서 경고가 나오면 최소 재현으로 오탐인지 확인하고 control flow를 먼저 단순화한다. 규칙을 미리 끄거나 전체 파일에서 disable하지 않는다.

정적 검사는 다음 명령으로 실행한다.

```sh
pnpm install --frozen-lockfile
pnpm lint
```

## 근거 자료

- [Node.js 22 package 문서](https://nodejs.org/download/release/v22.18.0/docs/api/packages.html)는 `.mjs`를 명시적인 ES module 표식으로 정의한다.
- [Node.js 22 ESM 문서](https://nodejs.org/download/release/v22.18.0/docs/api/esm.html)와 [Node.js 22.18.0 릴리스](https://nodejs.org/en/blog/release/v22.18.0)는 `import.meta.main`의 도입 시점을 확인하는 근거다.
- [Node.js `parseArgs()` 문서](https://nodejs.org/download/release/v22.20.0/docs/api/util.html#utilparseargsconfig)는 strict option과 token 반환 형식을 정의한다.
- [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#interface-textdecoder)는 fatal decode, streaming과 BOM 처리를 정의한다.
- [ECMAScript String 명세](https://tc39.es/ecma262/2026/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type)는 문자열을 UTF-16 code unit sequence로 정의한다.
- [Node.js file system 문서](https://nodejs.org/download/release/v22.18.0/docs/api/fs.html), [path 문서](https://nodejs.org/download/release/v22.18.0/docs/api/path.html)와 [URL 문서](https://nodejs.org/docs/latest-v22.x/api/url.html#urlfileurltopathurl-options)는 file handle, 상대 위치 및 file URL 변환의 근거다.
- [Node.js child process 문서](https://nodejs.org/download/release/v22.18.0/docs/api/child_process.html), [process 환경 변수 문서](https://nodejs.org/download/release/v22.18.0/docs/api/process.html#processenv), [process 종료 상태 문서](https://nodejs.org/download/release/v22.18.0/docs/api/process.html#processexitcode), [`abort()`](https://nodejs.org/download/release/v22.18.0/docs/api/process.html#processabort), [`execve()`](https://nodejs.org/download/release/v22.18.0/docs/api/process.html#processexecvefile-args-env), [`kill()`](https://nodejs.org/download/release/v22.18.0/docs/api/process.html#processkillpid-signal)과 [stream 문서](https://nodejs.org/download/release/v22.18.0/docs/api/stream.html#writablewritechunk-encoding-callback)는 환경 key, shell, 출력 상한, 즉시 종료 및 process 교체, signal과 stream 완료 동작을 정의한다.
- [Git 2.18 status 문서](https://git-scm.com/docs/git-status/2.18.0), [Git 2.18 `diff.h`](https://github.com/git/git/blob/v2.18.0/diff.h#L381-L388), [Git 2.18 `wt-status.c`](https://github.com/git/git/blob/v2.18.0/wt-status.c#L1737-L1752), [Git 2.18 config 문서](https://git-scm.com/docs/git-config/2.18.0), [Git 2.18 update-index 문서](https://git-scm.com/docs/git-update-index/2.18.0), [Git 2.18 ls-files 문서](https://git-scm.com/docs/git-ls-files/2.18.0)와 [Git 2.18 rev-parse 문서](https://git-scm.com/docs/git-rev-parse/2.18.0)는 porcelain status, type change, untracked cache, `assume-unchanged`, `skip-worktree`와 저장소 루트 판정의 근거다.
- [ESLint flat config 문서](https://eslint.org/docs/latest/use/configure/configuration-files), [recommended 규칙 소스](https://github.com/eslint/eslint/blob/v10.8.0/packages/js/src/configs/eslint-recommended.js), [`no-restricted-imports`](https://eslint.org/docs/latest/rules/no-restricted-imports)와 [`no-restricted-properties`](https://eslint.org/docs/latest/rules/no-restricted-properties)는 현재 정적 검사 구성의 근거다.
- [ECMAScript `for await...of`](https://tc39.es/ecma262/2026/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements), [`Promise.all()`](https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html#sec-promise.all)과 [`Promise.allSettled()`](https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html#sec-promise.allsettled)는 비동기 반복과 Promise 결과 수집의 실행 규칙을 정의한다. [Node.js stream async iterator 문서](https://nodejs.org/download/release/v22.18.0/docs/api/stream.html#readablesymbolasynciterator)는 Readable의 반복 중단 시 stream 정리를 정의한다.
- [ESLint `no-await-in-loop`](https://eslint.org/docs/latest/rules/no-await-in-loop), [`complexity`](https://eslint.org/docs/latest/rules/complexity), [`no-param-reassign`](https://eslint.org/docs/latest/rules/no-param-reassign), [`no-shadow`](https://eslint.org/docs/latest/rules/no-shadow)와 [`no-nested-ternary`](https://eslint.org/docs/latest/rules/no-nested-ternary)는 각 규칙이 검사하는 syntax와 예외를 확인하는 근거다.
- [ESLint 10.8.0 package](https://github.com/eslint/eslint/blob/v10.8.0/package.json)와 [`@eslint/js` 10.0.1 package](https://github.com/eslint/eslint/blob/v10.8.0/packages/js/package.json)는 engine, peer dependency, license와 package dependency를 확인하는 근거다.
