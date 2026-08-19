import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { execFile, spawnSync } from "node:child_process";
import { constants } from "node:fs";
import { access, lstat, mkdir, mkdtemp, open, readFile, realpath, rm, writeFile } from "node:fs/promises";
import {
  delimiter as pathDelimiter,
  isAbsolute,
  join,
  relative,
  resolve,
  sep as pathSeparator,
} from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs, TextDecoder } from "node:util";
import { scanExpressions } from "./korean-expressions.mjs";
import { scanParagraphs } from "./long-paragraphs.mjs";

/**
 * @typedef {{
 *   id: string,
 *   path?: string,
 *   text: string,
 *   bytes: number
 * }} Source
 */

/**
 * @typedef {{kind: "changed", repository: string} |
 *   {kind: "files", files: ReadonlyArray<string>} |
 *   {kind: "stdin", sourceName: string} |
 *   {kind: "self-test"}} InputMode
 */

/**
 * @typedef {{
 *   id: string,
 *   path?: string
 * }} SourceMetadata
 */

/**
 * @typedef {{
 *   id: string,
 *   catalog: ReadonlyArray<Readonly<Record<string, unknown>>>,
 *   rules: ReadonlyArray<Readonly<Record<string, unknown>>>,
 *   warnings: ReadonlyArray<Readonly<Record<string, unknown>>>,
 *   summary: {total: number, shown: number, omitted: number}
 * }} Check
 */

/**
 * @typedef {{
 *   stdout: Buffer
 * }} ChildResult
 */

/**
 * @typedef {{
 *   cwd: string,
 *   env: Readonly<Record<string, string>>,
 *   timeout: number,
 *   maxBuffer: number
 * }} ChildOptions
 */

/** @typedef {() => Promise<ReadonlyArray<Source>>} SourceProvider */

/** @type {number} */
const MAX_SOURCES = 512;
/** @type {number} */
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
/** @type {number} */
const MAX_TOTAL_BYTES = 32 * 1024 * 1024;
/** @type {number} */
const MAX_CHECK_BYTES = 32 * 1024 * 1024;
/** @type {number} */
const READ_CHUNK_BYTES = 64 * 1024;
/** @type {number} */
const GIT_TIMEOUT_MS = 30_000;
/** @type {number} */
const GIT_OUTPUT_BYTES = 8 * 1024 * 1024;
/** @type {number} */
const SELF_TEST_TIMEOUT_MS = 10_000;
/** @type {number} */
const SELF_TEST_OUTPUT_BYTES = 1024 * 1024;
/** @type {ReadonlySet<string>} */
const SUPPORTED_GIT_STATUSES = new Set([
  " M",
  " T",
  " A",
  " D",
  "M ",
  "MM",
  "MT",
  "MD",
  "T ",
  "TM",
  "TT",
  "TD",
  "A ",
  "AM",
  "AT",
  "AD",
  "D ",
  "DD",
  "AU",
  "UD",
  "UA",
  "DU",
  "AA",
  "UU",
  "??",
]);

/**
 * 공개 오류 code를 가진 Error를 만든다.
 *
 * @param {string} code 표준 오류로 내보내도 원문이나 개인 위치를 드러내지 않는 code
 * @param {Error} [cause] 내부 원인을 보존하되 출력하지 않을 오류
 * @returns {Error} 최상위 진입점까지 전달할 오류
 */
function scannerError(code, cause) {
  return cause === undefined ? new Error(code) : new Error(code, { cause });
}

/**
 * CLI option의 실제 출현 횟수와 조합을 검사해 하나의 입력 mode로 바꾼다.
 *
 * @param {ReadonlyArray<string>} args Node.js 실행 파일과 스크립트 위치를 제외한 인수
 * @returns {InputMode} 배타성이 확인된 입력 mode와 필요한 값
 */
function parseCommandLine(args) {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      options: {
        changed: { type: "string" },
        file: { type: "string", multiple: true },
        stdin: { type: "boolean" },
        "source-name": { type: "string" },
        "self-test": { type: "boolean" },
      },
      strict: true,
      allowPositionals: false,
      tokens: true,
    });
  } catch (error) {
    throw scannerError("usage:invalid-arguments", error instanceof Error ? error : undefined);
  }

  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const token of parsed.tokens) {
    if (token.kind === "option") {
      counts.set(token.name, (counts.get(token.name) ?? 0) + 1);
    }
  }

  for (const name of ["changed", "stdin", "source-name", "self-test"]) {
    if ((counts.get(name) ?? 0) > 1) {
      throw scannerError("usage:option-repeated");
    }
  }

  const changed = parsed.values.changed;
  const files = parsed.values.file ?? [];
  const stdin = parsed.values.stdin === true;
  const sourceName = parsed.values["source-name"];
  const selfTest = parsed.values["self-test"] === true;

  for (const value of [changed, ...files, sourceName]) {
    if (value !== undefined && !isValidInputName(value)) {
      throw scannerError("usage:invalid-input-name");
    }
  }
  if (files.length > MAX_SOURCES) {
    throw scannerError("usage:too-many-sources");
  }

  const selected =
    Number(changed !== undefined) + Number(files.length > 0) + Number(stdin) + Number(selfTest);
  if (selected !== 1) {
    throw scannerError("usage:invalid-input-mode");
  }
  if (stdin && sourceName === undefined) {
    throw scannerError("usage:source-name-required");
  }
  if (!stdin && sourceName !== undefined) {
    throw scannerError("usage:source-name-without-stdin");
  }

  if (changed !== undefined) {
    return { kind: "changed", repository: changed };
  }
  if (files.length > 0) {
    return { kind: "files", files };
  }
  if (stdin && sourceName !== undefined) {
    return { kind: "stdin", sourceName };
  }
  return { kind: "self-test" };
}

/**
 * 출력 식별자나 파일 위치로 사용할 인수가 비어 있지 않은 정상 Unicode 문자열인지 확인한다.
 *
 * @param {string} value 검사할 인수
 * @returns {boolean} NUL과 고립 surrogate가 없으면 true
 */
function isValidInputName(value) {
  return value.length > 0 && !value.includes("\0") && value.isWellFormed();
}

/**
 * source 제공 함수 하나만 호출하고 두 고정 탐지기를 항상 실행한다.
 *
 * @param {Readonly<{provideSources: SourceProvider}>} dependencies source를 읽는 I/O 기능
 * @returns {Promise<{
 *   sources: ReadonlyArray<SourceMetadata>,
 *   checks: ReadonlyArray<Check>
 * }>} 공통 source metadata와 표현 및 문단 검사 결과
 * @remarks 탐지 함수는 주입받지 않고 정적 import한 함수를 직접 호출한다.
 */
async function scanSources({ provideSources }) {
  const sources = await provideSources();
  const sourceMetadata = validateSources(sources);
  const checks = [
    limitCheckByBytes(scanExpressions(sources), MAX_CHECK_BYTES),
    limitCheckByBytes(scanParagraphs(sources), MAX_CHECK_BYTES),
  ];
  return { sources: sourceMetadata, checks };
}

/**
 * source 개수, byte와 Unicode를 탐지 전에 한 번 확인한다.
 *
 * @param {ReadonlyArray<Source>} sources 입력 어댑터가 만든 source
 * @returns {ReadonlyArray<SourceMetadata>} 공개 결과에 넣을 안전한 식별 정보
 */
function validateSources(sources) {
  if (sources.length > MAX_SOURCES) {
    throw scannerError("input:too-many-sources");
  }
  let totalBytes = 0;
  for (const source of sources) {
    if (
      source.bytes < 0 ||
      source.bytes > MAX_SOURCE_BYTES ||
      !Number.isSafeInteger(source.bytes) ||
      !source.text.isWellFormed()
    ) {
      throw scannerError("input:invalid-source");
    }
    totalBytes += source.bytes;
    if (totalBytes > MAX_TOTAL_BYTES) {
      throw scannerError("input:total-too-large");
    }
  }
  return sources.map((source) =>
    source.path === undefined ? { id: source.id } : { id: source.id, path: source.path },
  );
}

/**
 * 한 검사 결과를 byte 상한 안의 가장 긴 결정적 경고 앞부분으로 줄인다.
 *
 * @param {Check} check 탐지 모듈이 모든 source를 검사한 결과
 * @param {number} maxBytes 직렬화한 검사 결과의 최대 UTF-8 byte
 * @returns {Check} 전체 집계와 byte 상한 안의 상세 경고
 */
function limitCheckByBytes(check, maxBytes) {
  /**
   * @param {number} shown 포함할 상세 경고 수
   * @returns {Check} 표시 및 생략 수를 다시 계산한 검사 결과
   */
  const select = (shown) => ({
    id: check.id,
    catalog: check.catalog,
    rules: check.rules,
    warnings: check.warnings.slice(0, shown),
    summary: {
      total: check.summary.total,
      shown,
      omitted: check.summary.total - shown,
    },
  });

  if (Buffer.byteLength(JSON.stringify(select(0)), "utf8") > maxBytes) {
    throw scannerError("output:too-large");
  }

  const complete = select(check.warnings.length);
  if (Buffer.byteLength(JSON.stringify(complete), "utf8") <= maxBytes) {
    return complete;
  }

  let lower = 0;
  let upper = check.warnings.length;
  while (lower < upper) {
    const middle = Math.ceil((lower + upper) / 2);
    if (Buffer.byteLength(JSON.stringify(select(middle)), "utf8") <= maxBytes) {
      lower = middle;
    } else {
      upper = middle - 1;
    }
  }
  return select(lower);
}
/**
 * UTF-8 byte chunk를 source별 decoder로 해석하면서 입력 상한을 적용한다.
 *
 * @param {AsyncIterable<Uint8Array | string>} chunks 한 source에서 순서대로 읽은 byte chunk
 * @param {number} committedTotalBytes 앞서 완결된 source의 byte 합계
 * @returns {Promise<{text: string, bytes: number}>} 엄격하게 해석한 원문과 실제 byte 수
 */
async function decodeChunks(chunks, committedTotalBytes) {
  const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: false });
  /** @type {Array<string>} */
  const parts = [];
  let bytes = 0;

  try {
    for await (const chunk of chunks) {
      const buffer = Buffer.from(chunk);
      bytes += buffer.byteLength;
      if (bytes > MAX_SOURCE_BYTES) {
        throw scannerError("input:source-too-large");
      }
      if (committedTotalBytes + bytes > MAX_TOTAL_BYTES) {
        throw scannerError("input:total-too-large");
      }
      if (buffer.includes(0)) {
        throw scannerError("input:nul-byte");
      }
      parts.push(decoder.decode(buffer, { stream: true }));
    }
    parts.push(decoder.decode());
  } catch (error) {
    if (error instanceof Error && /^(input|usage|git|output|rules):/u.test(error.message)) {
      throw error;
    }
    throw scannerError("input:invalid-utf8", error instanceof Error ? error : undefined);
  }

  return { text: parts.join(""), bytes };
}

/**
 * 열린 파일의 같은 handle에서 고정 크기 chunk를 끝까지 읽는다.
 *
 * @param {import("node:fs/promises").FileHandle} handle 이미 file type을 확인한 handle
 * @returns {AsyncGenerator<Uint8Array, void, void>} 파일 순서를 유지하는 byte chunk
 */
async function* readHandleChunks(handle) {
  while (true) {
    const buffer = Buffer.allocUnsafe(READ_CHUNK_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
    if (bytesRead === 0) {
      return;
    }
    yield buffer.subarray(0, bytesRead);
  }
}

/**
 * 후보 위치를 symlink와 특수 파일 여부부터 검사하고 같은 handle에서 원문을 읽는다.
 *
 * @param {string} candidate 호출자 또는 Git이 선택한 위치
 * @param {"changed" | "file"} mode 누락 및 비정규 파일 처리 방식
 * @param {number} committedTotalBytes 앞서 읽은 source의 byte 합계
 * @returns {Promise<null | {realPath: string, text: string, bytes: number}>} 제외할 변경 항목 또는 읽은 파일
 */
async function readCandidateFile(candidate, mode, committedTotalBytes) {
  let lexicalStats;
  try {
    lexicalStats = await lstat(candidate);
  } catch (error) {
    const code = error instanceof Error ? Reflect.get(error, "code") : undefined;
    if (mode === "changed" && (code === "ENOENT" || code === "ENOTDIR")) {
      return null;
    }
    throw scannerError("input:file-unavailable", error instanceof Error ? error : undefined);
  }

  if (lexicalStats.isSymbolicLink() || !lexicalStats.isFile()) {
    if (mode === "changed") {
      return null;
    }
    throw scannerError("input:regular-file-required");
  }

  let realPath;
  let handle;
  try {
    realPath = await realpath(candidate);
    handle = await open(
      candidate,
      constants.O_RDONLY |
        (constants.O_NOFOLLOW ?? 0) |
        (constants.O_NONBLOCK ?? 0),
    );
    const openedStats = await handle.stat();
    if (!openedStats.isFile()) {
      throw scannerError("input:regular-file-required");
    }
    const decoded = await decodeChunks(readHandleChunks(handle), committedTotalBytes);
    return { realPath, text: decoded.text, bytes: decoded.bytes };
  } catch (error) {
    if (error instanceof Error && /^(input|usage|git|output|rules):/u.test(error.message)) {
      throw error;
    }
    throw scannerError("input:file-unavailable", error instanceof Error ? error : undefined);
  } finally {
    if (handle !== undefined) {
      await handle.close();
    }
  }
}

/**
 * 반복된 `--file` 입력을 호출 순서대로 읽고 개인 절대 위치는 순번 식별자로 바꾼다.
 *
 * @param {ReadonlyArray<string>} files 호출자가 전달한 파일 위치
 * @returns {Promise<ReadonlyArray<Source>>} 중복 실제 위치가 없고 표시 위치가 정규화된 source
 */
async function provideFileSources(files) {
  const cwdReal = await realpath(process.cwd());
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {Array<Source>} */
  const sources = [];
  let totalBytes = 0;

  for (const [index, file] of files.entries()) {
    const candidate = resolve(process.cwd(), file);
    const result = await readCandidateFile(candidate, "file", totalBytes);
    assert.notEqual(result, null);
    if (seen.has(result.realPath)) {
      throw scannerError("usage:duplicate-file");
    }
    seen.add(result.realPath);

    const relativePath = relative(cwdReal, result.realPath);
    const insideCwd = isInsideDirectory(relativePath);
    const canShowPath = !isAbsolute(file) && insideCwd;
    const id = canShowPath ? toPortablePath(relativePath) : `file:${index + 1}`;
    sources.push(
      canShowPath
        ? { id, path: id, text: result.text, bytes: result.bytes }
        : { id, text: result.text, bytes: result.bytes },
    );
    totalBytes += result.bytes;
  }
  return sources;
}

/**
 * `--stdin`의 byte stream 하나를 source 이름으로 식별하고 파일 위치는 만들지 않는다.
 *
 * @param {string} sourceName 호출자가 정한 표시 이름
 * @returns {Promise<ReadonlyArray<Source>>} 빈 입력도 포함하는 source 한 건
 */
async function provideStdinSource(sourceName) {
  const decoded = await decodeChunks(process.stdin, 0);
  return [{ id: sourceName, text: decoded.text, bytes: decoded.bytes }];
}

/**
 * 저장소 위치 안에 머무는 상대 위치인지 path 구성 요소로 판정한다.
 *
 * @param {string} relativePath 기준 디렉터리에서 후보 실제 위치까지의 상대 위치
 * @returns {boolean} 기준 디렉터리 자체가 아니며 부모로 나가지 않으면 true
 */
function isInsideDirectory(relativePath) {
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${pathSeparator}`) &&
    !isAbsolute(relativePath)
  );
}

/**
 * 운영체제 path 구분자를 JSON에서 일정한 슬래시로 바꾼다.
 *
 * @param {string} pathValue 정규화할 상대 위치
 * @returns {string} 플랫폼과 무관한 표시 위치
 */
function toPortablePath(pathValue) {
  return pathValue.split(pathSeparator).join("/");
}

/**
 * 현재 process 환경에서 Git 동작을 바꾸는 변수와 locale을 제거한다.
 *
 * @param {Readonly<Record<string, string | undefined>>} environment 현재 process 환경
 * @param {NodeJS.Platform} platform 실행 플랫폼
 * @returns {Readonly<Record<string, string>>} Git 자식 process에 전달할 제한된 환경
 */
function sanitizeEnvironment(environment, platform) {
  /** @type {Record<string, string>} */
  const sanitized = {};
  let windowsPath;

  for (const [name, value] of Object.entries(environment)) {
    if (value === undefined) {
      continue;
    }
    const upperName = name.toUpperCase();
    if (upperName.startsWith("GIT_") || upperName === "LC_ALL" || upperName === "LANG") {
      continue;
    }
    if (platform === "win32" && upperName === "PATH") {
      if (windowsPath !== undefined && windowsPath !== value) {
        throw scannerError("git:ambiguous-path");
      }
      windowsPath = value;
      continue;
    }
    sanitized[name] = value;
  }

  if (platform === "win32" && windowsPath !== undefined) {
    sanitized.PATH = windowsPath;
  }
  sanitized.LC_ALL = "C";
  sanitized.LANG = "C";
  return sanitized;
}

/**
 * 저장소 cwd를 적용하기 전에 신뢰하는 절대 PATH 항목에서 Git 실행 파일을 찾는다.
 *
 * @param {string | undefined} pathValue 정리된 실행 파일 검색 경로
 * @param {NodeJS.Platform} platform 실행 플랫폼
 * @returns {Promise<string>} 실행 권한이 확인된 Git 절대 위치
 */
async function findGitExecutable(pathValue, platform) {
  if (pathValue === undefined || pathValue.length === 0) {
    throw scannerError("git:not-found");
  }
  const executableName = platform === "win32" ? "git.exe" : "git";
  for (const entry of pathValue.split(pathDelimiter)) {
    if (entry.length === 0 || !isAbsolute(entry)) {
      continue;
    }
    const candidate = join(entry, executableName);
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      continue;
    }
  }
  throw scannerError("git:not-found");
}

/**
 * shell 없이 자식 process를 실행하고 stdout과 stderr byte를 분리한다.
 *
 * @param {string} executable 신뢰 경로에서 찾은 실행 파일
 * @param {ReadonlyArray<string>} args 자식 process 인수
 * @param {ChildOptions} options cwd, 환경, 시간과 stream 상한
 * @returns {Promise<ChildResult>} stderr가 비어 있는 성공 상태의 stdout
 */
function runChildFile(executable, args, options) {
  return new Promise((resolveResult, rejectResult) => {
    execFile(
      executable,
      args,
      {
        cwd: options.cwd,
        env: options.env,
        encoding: "buffer",
        timeout: options.timeout,
        maxBuffer: options.maxBuffer,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error !== null) {
          rejectResult(scannerError("git:command-failed", error));
          return;
        }
        const stderrBuffer = Buffer.from(stderr);
        if (stderrBuffer.byteLength !== 0) {
          rejectResult(scannerError("git:warning"));
          return;
        }
        resolveResult({ stdout: Buffer.from(stdout) });
      },
    );
  });
}

/**
 * `--no-renames`가 적용된 Git NUL 구분 status에서 허용한 위치만 모은다.
 *
 * @param {Buffer} stdout `git status --porcelain=v1 -z`의 원시 stdout
 * @returns {ReadonlyArray<string>} 중복을 제거한 현재 작업 트리 위치
 * @throws {Error} 허용 목록 밖 status, rename 또는 copy record, 잘못된 byte 형식, 빈 위치, 절대 위치, 정확히 `..`이거나 `../`로 시작하는 상대 위치
 */
function parseGitStatus(stdout) {
  const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  /** @type {Set<string>} */
  const paths = new Set();
  let cursor = 0;

  try {
    while (cursor < stdout.length) {
      const end = stdout.indexOf(0, cursor);
      if (end < 0) {
        throw scannerError("git:invalid-status");
      }
      const record = stdout.subarray(cursor, end);
      cursor = end + 1;
      if (record.length < 4 || record[2] !== 32) {
        throw scannerError("git:invalid-status");
      }
      const status = record.subarray(0, 2).toString("ascii");
      if (!SUPPORTED_GIT_STATUSES.has(status)) {
        throw scannerError("git:invalid-status");
      }
      const path = decoder.decode(record.subarray(3));
      if (!isValidGitRelativePath(path)) {
        throw scannerError("git:invalid-path");
      }
      paths.add(path);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("git:")) {
      throw error;
    }
    throw scannerError("git:invalid-status", error instanceof Error ? error : undefined);
  }

  return [...paths]
    .map((path) => ({ path, bytes: Buffer.from(path) }))
    .sort((left, right) => Buffer.compare(left.bytes, right.bytes))
    .map(({ path }) => path);
}

/**
 * Git이 반환한 위치가 저장소 상대 위치이며 부모 디렉터리로 나가지 않는지 확인한다.
 *
 * @param {string} pathValue Git status의 현재 위치
 * @returns {boolean} 저장소 내부 후보로 안전하게 결합할 수 있으면 true
 */
function isValidGitRelativePath(pathValue) {
  if (!isValidInputName(pathValue) || isAbsolute(pathValue)) {
    return false;
  }
  const normalized = toPortablePath(pathValue);
  return normalized !== ".." && !normalized.startsWith("../");
}

/**
 * rev-parse stdout의 마지막 LF 하나만 제거하고 개인 위치를 출력하지 않은 채 저장소 루트를 얻는다.
 *
 * @param {Buffer} stdout `git rev-parse --show-toplevel`의 stdout
 * @returns {string} CR과 LF가 없는 저장소 루트
 */
function parseRepositoryRoot(stdout) {
  let decoded;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(stdout);
  } catch (error) {
    throw scannerError("git:invalid-root", error instanceof Error ? error : undefined);
  }
  const root = decoded.endsWith("\n") ? decoded.slice(0, -1) : decoded;
  if (root.length === 0 || root.includes("\n") || root.includes("\r")) {
    throw scannerError("git:invalid-root");
  }
  return root;
}

/**
 * Git status가 선택한 현재 파일을 byte 순서로 읽고 삭제, symlink와 submodule을 제외한다.
 *
 * @param {string} repository `--changed`로 받은 저장소 또는 하위 디렉터리
 * @returns {Promise<ReadonlyArray<Source>>} 저장소 상대 위치로 식별한 현재 원문 source
 */
async function provideChangedSources(repository) {
  const requestedCwd = resolve(process.cwd(), repository);
  let requestedStats;
  try {
    requestedStats = await lstat(requestedCwd);
  } catch (error) {
    throw scannerError("git:repository-unavailable", error instanceof Error ? error : undefined);
  }
  if (!requestedStats.isDirectory()) {
    throw scannerError("git:repository-required");
  }

  const environment = sanitizeEnvironment(process.env, process.platform);
  const git = await findGitExecutable(environment.PATH, process.platform);
  const rootResult = await runChildFile(
    git,
    ["--no-optional-locks", "rev-parse", "--show-toplevel"],
    {
      cwd: requestedCwd,
      env: environment,
      timeout: GIT_TIMEOUT_MS,
      maxBuffer: GIT_OUTPUT_BYTES,
    },
  );
  const root = await realpath(parseRepositoryRoot(rootResult.stdout));
  const statusResult = await runChildFile(
    git,
    [
      "--no-optional-locks",
      "-c",
      "core.fsmonitor=",
      "-c",
      "core.untrackedCache=false",
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
      "--ignore-submodules=all",
      "--no-renames",
    ],
    {
      cwd: root,
      env: environment,
      timeout: GIT_TIMEOUT_MS,
      maxBuffer: GIT_OUTPUT_BYTES,
    },
  );

  const paths = parseGitStatus(statusResult.stdout);
  /** @type {Array<Source>} */
  const sources = [];
  let totalBytes = 0;
  for (const pathValue of paths) {
    const candidate = resolve(root, pathValue);
    const result = await readCandidateFile(candidate, "changed", totalBytes);
    if (result === null) {
      continue;
    }
    const relativeRealPath = relative(root, result.realPath);
    if (!isInsideDirectory(relativeRealPath)) {
      throw scannerError("input:outside-repository");
    }
    if (sources.length === MAX_SOURCES) {
      throw scannerError("input:too-many-sources");
    }
    const sourcePath = toPortablePath(relativeRealPath);
    sources.push({
      id: sourcePath,
      path: sourcePath,
      text: result.text,
      bytes: result.bytes,
    });
    totalBytes += result.bytes;
  }
  return sources;
}

/**
 * stream write callback이 끝날 때까지 기다려 즉시 종료로 JSON이 잘리지 않게 한다.
 *
 * @param {NodeJS.WritableStream} stream stdout 또는 stderr
 * @param {string} text 기록할 온전한 문자열
 * @returns {Promise<void>} stream이 문자열을 처리하면 끝나는 Promise
 */
function writeText(stream, text) {
  return new Promise((resolveWrite, rejectWrite) => {
    const onError = (error) => rejectWrite(error);
    stream.once("error", onError);
    stream.write(text, (error) => {
      if (error === null || error === undefined) {
        stream.off("error", onError);
        resolveWrite();
      } else {
        rejectWrite(error);
      }
    });
  });
}

/**
 * 내부 원인, stack trace와 입력 원문을 제외하고 승인된 오류 code만 선택한다.
 *
 * @param {unknown} error 최상위에서 잡은 값
 * @returns {string} 표준 오류에 기록할 한 줄 code
 */
function publicErrorCode(error) {
  if (
    error instanceof Error &&
    /^(usage|input|git|output|rules|self-test):[a-z0-9-]+$/u.test(error.message)
  ) {
    return error.message;
  }
  return "internal:unexpected";
}

/**
 * 운영 parser와 탐색 함수, 입력 상한 및 실제 자식 process 종료 상태를 검사한다.
 *
 * @returns {Promise<void>} 모든 assertion이 통과하면 끝나는 Promise
 */
async function runSelfTest() {
  assert.deepEqual(parseCommandLine(["--stdin", "--source-name", "sample"]), {
    kind: "stdin",
    sourceName: "sample",
  });
  assert.deepEqual(parseCommandLine(["--changed", "."]), { kind: "changed", repository: "." });
  assert.deepEqual(parseCommandLine(["--file", "first", "--file", "second"]), {
    kind: "files",
    files: ["first", "second"],
  });
  assert.deepEqual(parseCommandLine(["--self-test"]), { kind: "self-test" });
  for (const invalid of [
    [],
    ["--stdin"],
    ["--source-name", "sample"],
    ["--file", "a", "--stdin", "--source-name", "sample"],
    ["--self-test", "--file", "a"],
  ]) {
    assert.throws(() => parseCommandLine(invalid), /usage:/u);
  }

  const expressionSource = makeTestSource("expressions", "😀 경계 경계\n출력을 확인합니다.");
  const expressionCheck = scanExpressions([expressionSource]);
  assert.equal(expressionCheck.id, "expressions");
  assert.equal(expressionCheck.catalog.length, 47);
  assert.deepEqual(
    expressionCheck.warnings
      .filter((warning) => warning.ruleId === "ko.boundary")
      .map((warning) => [warning.line, warning.startUtf16, warning.endUtf16]),
    [
      [1, 4, 6],
      [1, 7, 9],
    ],
  );
  assert.equal(expressionCheck.rules.some((rule) => rule.id === "ko.boundary"), true);
  assert.equal(expressionCheck.rules.some((rule) => rule.id === "ko.output"), true);

  const conjugationSource = makeTestSource(
    "conjugation",
    "대상을 좁힘으로 정리한다.\n기준을 좁힐 계획이다. 좁힌 기준과 좁힙니다와 좁혔다.",
  );
  const conjugationCheck = scanExpressions([conjugationSource]);
  assert.deepEqual(
    conjugationCheck.warnings
      .filter((warning) => warning.ruleId === "ko.narrow")
      .map((warning) => [
        warning.expression,
        warning.line,
        warning.startUtf16,
        warning.endUtf16,
      ]),
    [
      ["좁히", 1, 5, 7],
      ["좁히", 2, 5, 7],
      ["좁히", 2, 14, 16],
      ["좁히", 2, 21, 23],
      ["좁혀", 2, 27, 29],
    ],
  );

  const closeSource = makeTestSource(
    "close",
    "이슈를 닫힘 상태로 바꾼다. 검토를 닫는다.",
  );
  const closeCheck = scanExpressions([closeSource]);
  assert.deepEqual(
    closeCheck.warnings
      .filter((warning) => warning.ruleId === "ko.close")
      .map((warning) => [warning.line, warning.startUtf16, warning.endUtf16]),
    [
      [1, 5, 6],
      [1, 21, 22],
    ],
  );

  const sixSentences =
    "변환기는 날짜를 검사한다. 값이 비었는지 확인한다. 형식을 비교한다. 오류를 기록한다. 오류가 있으면 파일을 만들지 않는다. 모든 값이 맞으면 저장한다.";
  const sevenSentences =
    `${sixSentences} 저장이 끝나면 처리한 행 수를 기록한다.`;
  const multiTopic =
    "확인할 사항을 기록한다. 서버 권한은 목록을 받은 뒤 정한다. 그전에는 설정을 바꾸지 않는다. 로그 보관 기간은 지침을 확인한 뒤 정한다. 미확정 기간은 쓰지 않는다. 배포 승인자는 절차에서 확인한다. 승인 역할을 확인하기 전에는 배포를 시작하지 않는다.";
  assert.equal(scanParagraphs([makeTestSource("six", sixSentences)]).summary.total, 0);
  assert.equal(scanParagraphs([makeTestSource("seven", sevenSentences)]).summary.total, 1);
  assert.equal(scanParagraphs([makeTestSource("multi", multiTopic)]).summary.total, 1);

  const excludedMarkdown = [
    "---",
    "title: 예시",
    "---",
    "# 제목. 둘. 셋. 넷. 다섯. 여섯. 일곱.",
    "",
    "- 목록. 둘. 셋. 넷. 다섯. 여섯. 일곱.",
    "",
    "> 인용. 둘. 셋. 넷. 다섯. 여섯. 일곱.",
    "",
    "<div>HTML. 둘. 셋. 넷. 다섯. 여섯. 일곱.</div>",
    "",
    "```text",
    "코드. 둘. 셋. 넷. 다섯. 여섯. 일곱.",
    "```",
    "",
    "    들여쓴 코드. 둘. 셋. 넷. 다섯. 여섯. 일곱.",
    "",
    "| 표 | 값 |",
    "| --- | --- |",
    "| 하나. 둘. 셋. 넷. 다섯. 여섯. 일곱. | 값 |",
  ].join("\n");
  assert.equal(scanParagraphs([makeTestSource("excluded", excludedMarkdown)]).summary.total, 0);

  const headingThenParagraph = `# 제목\n${sevenSentences}`;
  assert.equal(
    scanParagraphs([makeTestSource("heading-paragraph", headingThenParagraph)]).summary.total,
    1,
  );
  const thematicBreakThenParagraph = `---\n${sevenSentences}`;
  assert.equal(
    scanParagraphs([
      makeTestSource("thematic-break-paragraph", thematicBreakThenParagraph),
    ]).summary.total,
    1,
  );
  const frontMatterThenParagraph = `---\ntitle: 예시\n---\n${sevenSentences}`;
  assert.equal(
    scanParagraphs([makeTestSource("front-matter-paragraph", frontMatterThenParagraph)]).summary
      .total,
    1,
  );
  const indentedThematicBreak = `   ---\n${sevenSentences}\n...`;
  const indentedThematicResult = scanParagraphs([
    makeTestSource("indented-thematic-break", indentedThematicBreak),
  ]);
  assert.deepEqual(
    [indentedThematicResult.summary.total, indentedThematicResult.warnings[0].count],
    [1, 7],
  );
  assert.equal(
    scanParagraphs([makeTestSource("punctuation-only", `${sixSentences}\n...`)]).summary.total,
    0,
  );
  const excludedBlockThenHeading = `- 목록\n# 제목\n${sevenSentences}`;
  assert.equal(
    scanParagraphs([makeTestSource("excluded-heading", excludedBlockThenHeading)]).summary.total,
    1,
  );
  const htmlBlockWithMarkdown = `<div>\n# HTML 내부\n---\n${sevenSentences}\n</div>`;
  assert.equal(
    scanParagraphs([makeTestSource("html-markdown", htmlBlockWithMarkdown)]).summary.total,
    0,
  );
  assert.equal(
    scanParagraphs([
      makeTestSource("html-then-paragraph", `${htmlBlockWithMarkdown}\n\n${sevenSentences}`),
    ]).summary.total,
    1,
  );

  const positionedParagraph = scanParagraphs([
    makeTestSource("positioned", "\n\n  하나. 둘. 셋. 넷. 다섯. 여섯. 일곱."),
  ]);
  assert.deepEqual(
    [
      positionedParagraph.warnings[0].line,
      positionedParagraph.warnings[0].startUtf16,
      positionedParagraph.warnings[0].count,
    ],
    [3, 3, 7],
  );

  const repeatedExpressions = "경계".repeat(20_001);
  const cappedExpressions = scanExpressions([
    makeTestSource("expression-cap", repeatedExpressions),
  ]);
  assert.deepEqual(cappedExpressions.summary, {
    total: 20_001,
    shown: 20_000,
    omitted: 1,
  });

  const repeatedParagraphs = Array.from(
    { length: 20_001 },
    () => "가. 나. 다. 라. 마. 바. 사.",
  ).join("\n\n");
  const cappedParagraphs = scanParagraphs([
    makeTestSource("paragraph-cap", repeatedParagraphs),
  ]);
  assert.deepEqual(cappedParagraphs.summary, {
    total: 20_001,
    shown: 20_000,
    omitted: 1,
  });

  const byteLimitedExpressions = limitCheckByBytes(cappedExpressions, 8 * 1024);
  assert.equal(byteLimitedExpressions.summary.total, 20_001);
  assert.equal(byteLimitedExpressions.summary.shown < 20_000, true);
  assert.equal(
    Buffer.byteLength(JSON.stringify(byteLimitedExpressions), "utf8") <= 8 * 1024,
    true,
  );
  assert.throws(() => limitCheckByBytes(cappedExpressions, 1), /output:too-large/u);
  assert.equal(MAX_CHECK_BYTES, 32 * 1024 * 1024);

  let providerCalls = 0;
  const assembled = await scanSources({
    provideSources: async () => {
      providerCalls += 1;
      return [expressionSource, makeTestSource("paragraph", sevenSentences)];
    },
  });
  assert.equal(providerCalls, 1);
  assert.deepEqual(
    assembled.checks.map((check) => check.id),
    ["expressions", "paragraphs"],
  );
  assert.deepEqual(assembled.sources, [{ id: "expressions" }, { id: "paragraph" }]);
  assert.equal(assembled.checks[1].summary.total, 1);

  const empty = await scanSources({
    provideSources: async () => [makeTestSource("empty", "")],
  });
  assert.deepEqual(
    empty.checks.map((check) => check.summary.total),
    [0, 0],
  );
  await assert.rejects(
    () =>
      scanSources({
        provideSources: async () =>
          Array.from({ length: MAX_SOURCES + 1 }, (_, index) =>
            makeTestSource(`source-${index}`, ""),
          ),
      }),
    /input:too-many-sources/u,
  );
  await assert.rejects(
    () => decodeChunks([Buffer.from([0xc3, 0x28])], 0),
    /input:invalid-utf8/u,
  );
  await assert.rejects(
    () =>
      runChildFile(process.execPath, ["-e", "process.stderr.write('warning')"], {
        cwd: process.cwd(),
        env: {},
        timeout: SELF_TEST_TIMEOUT_MS,
        maxBuffer: SELF_TEST_OUTPUT_BYTES,
      }),
    /git:warning/u,
  );
  for (const options of [
    { code: "setInterval(() => {}, 1_000)", timeout: 10, maxBuffer: SELF_TEST_OUTPUT_BYTES },
    {
      code: "process.stdout.write('x'.repeat(100))",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: 10,
    },
    {
      code: "process.stderr.write('x'.repeat(100))",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: 10,
    },
  ]) {
    await assert.rejects(
      () =>
        runChildFile(process.execPath, ["-e", options.code], {
          cwd: process.cwd(),
          env: {},
          timeout: options.timeout,
          maxBuffer: options.maxBuffer,
        }),
      /git:command-failed/u,
    );
  }

  const scriptPath = fileURLToPath(import.meta.url);
  const scriptInput = await readFile(scriptPath);
  const fileChild = runScannerProcess(["--file", scriptPath]);
  const stdinChild = runScannerProcess(
    ["--stdin", "--source-name", "same-script"],
    scriptInput,
  );
  for (const successfulChild of [fileChild, stdinChild]) {
    assert.equal(successfulChild.error, undefined);
    assert.equal(successfulChild.signal, null);
    assert.equal(successfulChild.status, 0);
    assert.equal(successfulChild.stderr, "");
  }
  const fileOutput = JSON.parse(fileChild.stdout);
  const stdinOutput = JSON.parse(stdinChild.stdout);
  const normalizeSourceIds = (checks) =>
    checks.map((check) => ({
      ...check,
      warnings: check.warnings.map((warning) => ({ ...warning, sourceId: "source" })),
    }));
  assert.deepEqual(normalizeSourceIds(fileOutput.checks), normalizeSourceIds(stdinOutput.checks));
  assert.deepEqual(fileOutput.checks.map((check) => check.id), [
    "expressions",
    "paragraphs",
  ]);

  const invalidChild = runScannerProcess(["--invalid-self-test-argument"]);
  assert.equal(invalidChild.status, 2);
  assert.equal(invalidChild.stdout, "");
  assert.match(invalidChild.stderr, /^usage:[a-z0-9-]+\n$/u);

  for (const [args, input, expectedError] of [
    [
      ["--stdin", "--source-name", "invalid-utf8"],
      Buffer.from([0xc3, 0x28]),
      "input:invalid-utf8\n",
    ],
    [["--stdin", "--source-name", "nul"], Buffer.from([0]), "input:nul-byte\n"],
    [
      ["--stdin", "--source-name", "too-large"],
      Buffer.alloc(MAX_SOURCE_BYTES + 1, 0x61),
      "input:source-too-large\n",
    ],
    [["--file", "missing-self-test-file"], undefined, "input:file-unavailable\n"],
    [["--changed", scriptPath], undefined, "git:repository-required\n"],
  ]) {
    const failedChild = runScannerProcess(args, input);
    assert.equal(failedChild.error, undefined);
    assert.equal(failedChild.signal, null);
    assert.equal(failedChild.status, 2);
    assert.equal(failedChild.stdout, "");
    assert.equal(failedChild.stderr, expectedError);
  }

  await new Promise((resolveClosedPipe, rejectClosedPipe) => {
    const closedPipeChild = execFile(
      process.execPath,
      [scriptPath, "--stdin", "--source-name", "closed-pipe"],
      {
        encoding: "buffer",
        timeout: SELF_TEST_TIMEOUT_MS,
        maxBuffer: SELF_TEST_OUTPUT_BYTES,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        try {
          assert.equal(error?.code, 2);
          assert.equal(stdout.byteLength > 0, true);
          assert.equal(stderr.toString("utf8"), "internal:unexpected\n");
          resolveClosedPipe();
        } catch (assertionError) {
          rejectClosedPipe(assertionError);
        }
      },
    );
    closedPipeChild.stdout?.once("data", () => closedPipeChild.stdout?.destroy());
    closedPipeChild.stdin?.end("경계".repeat(5_000));
  });

  const tempParent = join(process.cwd(), "temps");
  await mkdir(tempParent, { recursive: true });
  const repository = await mkdtemp(join(tempParent, "words-review-self-test-"));
  try {
    const init = spawnSync("git", ["init", "--quiet"], {
      cwd: repository,
      encoding: "utf8",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: SELF_TEST_OUTPUT_BYTES,
      windowsHide: true,
    });
    assert.equal(init.status, 0);
    await writeFile(join(repository, "sample.md"), sevenSentences, "utf8");
    const add = spawnSync("git", ["add", "sample.md"], {
      cwd: repository,
      encoding: "utf8",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: SELF_TEST_OUTPUT_BYTES,
      windowsHide: true,
    });
    assert.equal(add.status, 0);
    const changedChild = runScannerProcess(["--changed", repository]);
    assert.equal(changedChild.status, 0);
    const changedOutput = JSON.parse(changedChild.stdout);
    assert.equal(changedOutput.sources.length, 1);
    assert.equal(changedOutput.checks[1].summary.total, 1);
  } finally {
    await rm(repository, { recursive: true, force: true });
  }
}

/**
 * self-test가 현재 진입점을 실제 자식 process로 실행한다.
 *
 * @param {ReadonlyArray<string>} args 검사기 인수
 * @param {string | Buffer} [input] 표준 입력으로 전달할 원문
 * @returns {{status: number | null, stdout: string, stderr: string}} 실제 종료 상태와 stream
 */
function runScannerProcess(args, input) {
  return spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...args], {
    input,
    encoding: "utf8",
    timeout: SELF_TEST_TIMEOUT_MS,
    maxBuffer: SELF_TEST_OUTPUT_BYTES,
    windowsHide: true,
  });
}

/**
 * self-test source에 실제 UTF-8 byte 수를 붙인다.
 *
 * @param {string} id source 식별자
 * @param {string} text source 원문
 * @returns {Source} 운영 탐지 함수에 전달할 source
 */
function makeTestSource(id, text) {
  return { id, text, bytes: Buffer.byteLength(text, "utf8") };
}

async function main(args) {
  const mode = parseCommandLine(args);
  if (mode.kind === "self-test") {
    try {
      await runSelfTest();
      return;
    } catch (error) {
      throw scannerError("self-test:failed", error instanceof Error ? error : undefined);
    }
  }

  /** @type {SourceProvider} */
  let provideSources;
  if (mode.kind === "changed") {
    provideSources = () => provideChangedSources(mode.repository);
  } else if (mode.kind === "files") {
    provideSources = () => provideFileSources(mode.files);
  } else {
    provideSources = () => provideStdinSource(mode.sourceName);
  }

  const scan = await scanSources({ provideSources });
  let json;
  try {
    json = JSON.stringify(scan);
  } catch (error) {
    throw scannerError("output:serialization", error instanceof Error ? error : undefined);
  }
  await writeText(process.stdout, `${json}\n`);
}

process.exitCode = 2;

try {
  await main(process.argv.slice(2));
  process.exitCode = 0;
} catch (error) {
  try {
    await writeText(process.stderr, `${publicErrorCode(error)}\n`);
  } catch {
    // stderr가 실패한 뒤에는 원문과 개인 위치를 드러내지 않는 추가 출력 수단이 없다.
  }
}
