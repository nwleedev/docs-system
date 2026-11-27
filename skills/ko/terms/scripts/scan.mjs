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
import { scanExpressions, selfTestExpressionRules } from "./korean-expressions.mjs";
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
 *   {kind: "help"} |
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

const MAX_SOURCES = 512;
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_BYTES = 32 * 1024 * 1024;
const MAX_CHECK_BYTES = 32 * 1024 * 1024;
const READ_CHUNK_BYTES = 64 * 1024;
const GIT_TIMEOUT_MS = 30_000;
const GIT_OUTPUT_BYTES = 8 * 1024 * 1024;
const SELF_TEST_TIMEOUT_MS = 10_000;
const SELF_TEST_OUTPUT_BYTES = 1024 * 1024;
const HELP_TEXT = [
  "한국어 텍스트에서 등록된 표현과 문장 수가 기준 이상인 문단의 위치를 출력합니다.",
  "경고 위치의 앞뒤 문장을 읽고 표현을 교정하거나 문단을 나눌지 판단합니다.",
  "",
  "아래 명령은 SKILL.md가 있는 terms 스킬 폴더에서 실행합니다.",
  "Usage:",
  "  node scripts/scan.mjs --changed <repo>",
  "  node scripts/scan.mjs --file <path> [--file <path> ...]",
  "  node scripts/scan.mjs --stdin --source-name <name>",
  "  node scripts/scan.mjs --self-test",
  "  node scripts/scan.mjs --help",
  "",
  "Options:",
  "  --changed <repo>      Git 저장소에서 변경되었거나 아직 추적되지 않는 텍스트 파일을 검사합니다.",
  "  --file <path>         지정한 파일을 검사합니다. 여러 파일은 --file을 파일마다 지정합니다.",
  "  --stdin               표준 입력에서 텍스트 한 건을 읽습니다. --source-name과 함께 사용합니다.",
  "  --source-name <name>  표준 입력에서 읽은 텍스트의 식별자를 지정합니다. --stdin에만 사용합니다.",
  "  --self-test           검사기에 포함된 자체 검사를 실행합니다.",
  "  --help                도움말을 표준 출력에 기록하고 종료합니다.",
  "",
  "위에 표시된 명령 형식 중 하나만 사용합니다. --source-name은 --stdin과 함께 사용합니다.",
  "",
].join("\n");
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
 * @param {string} code
 * @param {Error} [cause]
 * @returns {Error}
 */
function scannerError(code, cause) {
  return cause === undefined ? new Error(code) : new Error(code, { cause });
}

/**
 * @param {ReadonlyArray<string>} args
 * @returns {InputMode}
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
        help: { type: "boolean" },
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

  for (const name of ["changed", "stdin", "source-name", "self-test", "help"]) {
    if ((counts.get(name) ?? 0) > 1) {
      throw scannerError("usage:option-repeated");
    }
  }

  const changed = parsed.values.changed;
  const files = parsed.values.file ?? [];
  const stdin = parsed.values.stdin === true;
  const sourceName = parsed.values["source-name"];
  const selfTest = parsed.values["self-test"] === true;
  const help = parsed.values.help === true;

  for (const value of [changed, ...files, sourceName]) {
    if (value !== undefined && !isValidInputName(value)) {
      throw scannerError("usage:invalid-input-name");
    }
  }
  if (files.length > MAX_SOURCES) {
    throw scannerError("usage:too-many-sources");
  }

  const selected =
    Number(changed !== undefined) +
    Number(files.length > 0) +
    Number(stdin) +
    Number(selfTest) +
    Number(help);
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
  if (help) {
    return { kind: "help" };
  }
  return { kind: "self-test" };
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isValidInputName(value) {
  return value.length > 0 && !value.includes("\0") && value.isWellFormed();
}

/** @param {ReadonlyArray<Source>} sources */
function scanSources(sources) {
  validateSources(sources);
  const sourceMetadata = sources.map(({ id, path }) =>
    path === undefined ? { id } : { id, path },
  );
  const checks = [
    limitCheckByBytes(scanExpressions(sources), MAX_CHECK_BYTES),
    limitCheckByBytes(scanParagraphs(sources), MAX_CHECK_BYTES),
  ];
  return { sources: sourceMetadata, checks };
}

/** @param {ReadonlyArray<Source>} sources */
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
}

/**
 * @param {Check} check
 * @param {number} maxBytes
 * @returns {Check}
 */
function limitCheckByBytes(check, maxBytes) {
  /**
   * @param {number} count
   * @returns {Check}
   */
  const withFirstWarnings = (count) => ({
    id: check.id,
    catalog: check.catalog,
    rules: check.rules,
    warnings: check.warnings.slice(0, count),
    summary: {
      total: check.summary.total,
      shown: count,
      omitted: check.summary.total - count,
    },
  });

  if (Buffer.byteLength(JSON.stringify(withFirstWarnings(0)), "utf8") > maxBytes) {
    throw scannerError("output:too-large");
  }

  const complete = withFirstWarnings(check.warnings.length);
  if (Buffer.byteLength(JSON.stringify(complete), "utf8") <= maxBytes) {
    return complete;
  }

  let lower = 0;
  let upper = check.warnings.length;
  while (lower < upper) {
    const middle = Math.ceil((lower + upper) / 2);
    if (Buffer.byteLength(JSON.stringify(withFirstWarnings(middle)), "utf8") <= maxBytes) {
      lower = middle;
    } else {
      upper = middle - 1;
    }
  }
  return withFirstWarnings(lower);
}
/**
 * @param {AsyncIterable<Uint8Array | string>} chunks
 * @param {number} committedTotalBytes
 * @returns {Promise<{text: string, bytes: number}>}
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
 * @param {import("node:fs/promises").FileHandle} handle
 * @returns {AsyncGenerator<Uint8Array, void, void>}
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
 * @param {string} candidate
 * @param {"changed" | "file"} mode
 * @param {number} committedTotalBytes
 * @returns {Promise<null | {realPath: string, text: string, bytes: number}>}
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
 * @param {ReadonlyArray<string>} files
 * @returns {Promise<ReadonlyArray<Source>>}
 */
async function readFiles(files) {
  const cwdReal = await realpath(process.cwd());
  /** @type {Set<string>} */
  const seen = new Set();
  const sources = [];
  let totalBytes = 0;

  for (const [index, file] of files.entries()) {
    const candidate = resolve(process.cwd(), file);
    const result = await readCandidateFile(candidate, "file", totalBytes);
    assert.ok(result !== null);
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
 * @param {string} sourceName
 * @returns {Promise<ReadonlyArray<Source>>}
 */
async function readStdin(sourceName) {
  const decoded = await decodeChunks(process.stdin, 0);
  return [{ id: sourceName, text: decoded.text, bytes: decoded.bytes }];
}

/**
 * @param {string} relativePath
 * @returns {boolean}
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
 * @param {string} pathValue
 * @returns {string}
 */
function toPortablePath(pathValue) {
  return pathValue.split(pathSeparator).join("/");
}

/**
 * @param {Readonly<Record<string, string | undefined>>} environment
 * @param {NodeJS.Platform} platform
 * @returns {Readonly<Record<string, string>>}
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
 * @param {string | undefined} pathValue
 * @param {NodeJS.Platform} platform
 * @returns {Promise<string>}
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
 * @param {string} executable
 * @param {ReadonlyArray<string>} args
 * @param {ChildOptions} options
 * @returns {Promise<ChildResult>}
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
 * @param {Buffer} stdout
 * @returns {ReadonlyArray<string>}
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
 * @param {string} pathValue
 * @returns {boolean}
 */
function isValidGitRelativePath(pathValue) {
  if (!isValidInputName(pathValue) || isAbsolute(pathValue)) {
    return false;
  }
  const normalized = toPortablePath(pathValue);
  return normalized !== ".." && !normalized.startsWith("../");
}

/**
 * @param {Buffer} stdout
 * @returns {string}
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
 * @param {string} repository
 * @returns {Promise<ReadonlyArray<Source>>}
 */
async function readChangedFiles(repository) {
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
 * @param {NodeJS.WritableStream} stream
 * @param {string} text
 * @returns {Promise<void>}
 */
function writeText(stream, text) {
  return new Promise((resolveWrite, rejectWrite) => {
    /** @param {Error} error */
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
 * @param {unknown} error
 * @returns {string}
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

/** @returns {Promise<void>} */
async function runSelfTest() {
  selfTestExpressionRules();
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
  assert.deepEqual(parseCommandLine(["--help"]), { kind: "help" });
  for (const invalid of [
    [],
    ["--stdin"],
    ["--source-name", "sample"],
    ["--file", "a", "--stdin", "--source-name", "sample"],
    ["--self-test", "--file", "a"],
    ["--help", "--file", "a"],
    ["--file", "a", "--help"],
    ["--help", "--help"],
    ["-h"],
    ["--he"],
  ]) {
    assert.throws(() => parseCommandLine(invalid), /usage:/u);
  }

  const expressionSource = makeTestSource("expressions", "😀 경계 경계\n출력을 확인합니다.");
  const expressionCheck = scanExpressions([expressionSource]);
  assert.equal(expressionCheck.id, "expressions");
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

  const formsByRule = [
    ["ko.task", "일", "일 일을 일이 일하는"],
    ["ko.operation", "작업", "작업 작업으로 작업해서 작업만으로도 작업들에는"],
    ["ko.assignment", "과업", "과업 과업의 과업만"],
    ["ko.process", "처리", "처리 처리를 처리한다 처리해 처리됐습니다"],
    ["ko.details", "내역", "내역 내역에서 내역은"],
    ["ko.evidence", "근거", "근거 근거가 근거를 근거로 근거로는 근거만으로는"],
    ["ko.note", "적다", "적다 적는 적었다 적으면"],
    ["ko.write", "쓰다", "쓰다 쓴다 써 썼다 쓸"],
    ["ko.notify", "알리다", "알리다 알린다 알리는 알립니다 알리어 알려 알려서 알렸다 알렸습니다 알림을 알림들을 알려주세요 알려줘요 알려줬다 알려주셨습니다 알려줄게요 알려줄래요"],
    ["ko.read", "읽다", "읽다 읽는 읽었습니다 읽음 읽어주세요 읽을게요 읽을래요"],
    ["ko.see", "보다", "보다 본다 보아 봐 보았다 봤다"],
    ["ko.identify", "짚다", "짚다 짚는 짚었다 짚으세요 짚었을 짚기는 짚었음에도"],
    ["ko.call", "부르다", "부르다 부르는 불러 불렀다 불러준다"],
    ["ko.divide", "나누다", "나누다 나누어 나눠 나누었다 나눴다"],
    ["ko.keep", "두다", "두다 둔다 두어 둬 두었다 뒀다"],
    ["ko.reduce", "줄이다", "줄이다 줄이는 줄여 줄였다"],
    ["ko.compose", "짜다", "짜다 짠다 짜서 짰다"],
    ["ko.make", "만들다", "만들다 만드는 만듭니다 만들면 만든 만듦 만듦을"],
    ["ko.gather", "모으다", "모으다 모은 모아 모았다"],
    ["ko.fill", "채우다", "채우다 채워 채웠다 채우면"],
    ["ko.new", "새", "새"],
    ["ko.section", "절", "절 절에서는 제2절"],
    ["ko.until", "까지", "까지 끝까지 끝까지는 금요일까지다"],
    ["ko.connect", "연결", "연결 연결된 연결해 연결되어 연결됩니다"],
    ["ko.original-text", "원문", "원문 원문은 원문에서 원문으로 원문에서도"],
  ];
  const targets = new Set(formsByRule.map(([id]) => id));
  const catalogIds = new Set(expressionCheck.catalog.map(({ id }) => id));
  for (const id of [
    "ko.middle-dot", "ko.about", "ko.by-passive", "ko.in-context",
    "ko.with-relationship", "ko.must-double-negative", "ko.hold-meeting", "ko.user-facing",
    "ko.scope", "ko.small", "ko.boundary", "ko.contract",
    "ko.rubric", "ko.validity", "ko.consistency", "ko.visibility",
    "ko.path", "ko.flow", "ko.public", "ko.product",
    "ko.saturation", "ko.ownership", "ko.falsification", "ko.narrow-state",
    "ko.narrow", "ko.close", "ko.fix-in-place", "ko.support",
    "ko.guarantee", "ko.response", "ko.cover-topic", "ko.exposure",
    "ko.capture", "ko.alignment", "ko.surface", "ko.core",
    "ko.effective", "ko.smooth", "ko.strong", "ko.robust",
    "ko.comprehensive", "ko.various", "ko.essential", "ko.the-relevant",
    "ko.related", "ko.this-content", "ko.result", "ko.output",
    "ko.data", "ko.feature", "ko.work", "ko.status",
    "ko.consumption", "ko.task", "ko.operation", "ko.assignment",
    "ko.process", "ko.details", "ko.evidence", "ko.original-text",
    "ko.note", "ko.write", "ko.notify", "ko.read",
    "ko.see", "ko.identify", "ko.call", "ko.divide",
    "ko.keep", "ko.reduce", "ko.compose", "ko.make",
    "ko.gather", "ko.fill", "ko.new", "ko.section",
    "ko.until", "ko.connect",
  ]) {
    assert.ok(catalogIds.has(id), `Missing rule in catalog: ${id}`);
  }
  const forms = formsByRule.flatMap(([id, expression, words]) =>
    words.split(" ").map((word) => ({ id, expression, word })),
  );
  const excludedWords =
    "근거리 근거리에서 근거지 근거지를 " +
    "파일 일자 절차 적절한 새로고침 색상 작업자 내역서 처리량 연결망 결과보다 원문보기 지원문서 알림판 알림장 알리바이 " +
    "알린주세요 알려주머니 알려주세요청 알림들어가기 부르렀다 만들는 만들습니다 읽는이름 짚었다는말 x쓴다 쓴다2 tmp_연결해 𠮷새 새𠮷 𠮷읽는다 읽는다𠮷";
  const cases = forms.map(({ word }) => makeTestSource(word, word));
  const testedForms = scanExpressions([...cases, makeTestSource("exclusions", excludedWords)]);
  assert.deepEqual(
    testedForms.warnings.filter((warning) => targets.has(warning.ruleId))
      .map(({ sourceId, ruleId, expression }) => [sourceId, ruleId, expression]),
    forms.map(({ id, expression, word }) => [word, id, expression]),
  );

  for (const normalization of ["NFC", "NFD"]) {
    const line = "😀 제2절 작업까지도 30일까지".normalize(normalization);
    const overlap = scanExpressions([makeTestSource("overlap", `시작\n${line}`)]);
    assert.deepEqual(
      overlap.warnings.filter((warning) => targets.has(warning.ruleId))
        .map(({ ruleId, line: lineNumber, startUtf16, endUtf16, quote }) =>
          [ruleId, lineNumber, startUtf16, endUtf16, quote]),
      [
        ["ko.section", "절", "😀 제2"],
        ["ko.operation", "작업", "😀 제2절 "],
        ["ko.until", "까지", "😀 제2절 작업"],
        ["ko.until", "까지", "😀 제2절 작업까지도 30일"],
      ].map(([ruleId, surface, preceding]) => {
        const word = surface.normalize(normalization);
        const offset = preceding.normalize(normalization).length;
        return [ruleId, 2, offset + 1, offset + word.length + 1, line];
      }),
    );
  }

  const reviewCandidateCheck = scanExpressions([
    makeTestSource("review-candidates", "작은 변경. 작은 부품. 업무 흐름. 물의 흐름."),
  ]);
  assert.deepEqual(
    reviewCandidateCheck.warnings
      .filter((warning) => ["ko.small", "ko.flow"].includes(warning.ruleId))
      .map((warning) => [warning.ruleId, warning.expression]),
    [
      ["ko.small", "작은"],
      ["ko.small", "작은"],
      ["ko.flow", "흐름"],
      ["ko.flow", "흐름"],
    ],
  );
  assert.equal(
    scanExpressions([makeTestSource("exact-small", "작다 작습니다")]).warnings.some(
      (warning) => warning.ruleId === "ko.small",
    ),
    false,
  );

  for (const [ruleId, expression] of [
    ["ko.work", "업무"],
    ["ko.status", "지위"],
    ["ko.consumption", "소비"],
  ]) {
    const check = scanExpressions([makeTestSource("fixed-candidate", expression)]);
    assert.deepEqual(
      check.warnings
        .filter((warning) => warning.ruleId === ruleId)
        .map((warning) => [warning.expression, warning.startUtf16, warning.endUtf16]),
      [[expression, 1, expression.length + 1]],
    );
  }

  for (const [ruleId, expression] of [
    ["ko.boundary", "경계"],
    ["ko.small", "작은"],
    ["ko.flow", "흐름"],
  ]) {
    for (const form of [expression, expression.normalize("NFD")]) {
      const warning = scanExpressions([makeTestSource("canonical", form)]).warnings.find(
        (candidate) => candidate.ruleId === ruleId,
      );
      assert.deepEqual(
        [warning?.expression, warning?.startUtf16, warning?.endUtf16, warning?.quote],
        [expression, 1, form.length + 1, form],
      );
    }
  }

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

  const requiredMorphologySource = makeTestSource(
    "required-morphology",
    "좁다\n좁은 변경이다\n좁혔다\n범위가 좁았습니다.\n코드를 박지\n목표를 박음\n값이 박혔다.",
  );
  const morphologyRuleIds = new Set(["ko.narrow-state", "ko.narrow", "ko.fix-in-place"]);
  const requiredMorphologyCheck = scanExpressions([requiredMorphologySource]);
  assert.deepEqual(
    requiredMorphologyCheck.warnings
      .filter((warning) => morphologyRuleIds.has(warning.ruleId))
      .map((warning) => [
        warning.ruleId,
        warning.expression,
        warning.line,
        warning.startUtf16,
        warning.endUtf16,
      ]),
    [
      ["ko.narrow-state", "좁", 1, 1, 2],
      ["ko.narrow-state", "좁", 2, 1, 2],
      ["ko.narrow", "좁혀", 3, 1, 3],
      ["ko.narrow-state", "좁았", 4, 5, 7],
      ["ko.fix-in-place", "박", 5, 5, 6],
      ["ko.fix-in-place", "박", 6, 5, 6],
      ["ko.fix-in-place", "박혔", 7, 4, 6],
    ],
  );

  const morphologyForms =
    "좁고 좁으면 좁음 좁아지다 좁힌 좁힐 좁힙니다 좁혀서 박았다 박는 박을 박습니다 박아 두다 박힌 박힐 박힙니다 박혀 있다";
  const morphologyFormsCheck = scanExpressions([
    makeTestSource("morphology-forms", morphologyForms),
  ]);
  assert.deepEqual(
    morphologyFormsCheck.warnings
      .filter((warning) => morphologyRuleIds.has(warning.ruleId))
      .map((warning) => [
        warning.ruleId,
        warning.expression,
        morphologyForms.slice(warning.startUtf16 - 1, warning.endUtf16 - 1),
      ]),
    [
      ["ko.narrow-state", "좁", "좁"],
      ["ko.narrow-state", "좁", "좁"],
      ["ko.narrow-state", "좁", "좁"],
      ["ko.narrow-state", "좁아", "좁아"],
      ["ko.narrow", "좁히", "좁힌"],
      ["ko.narrow", "좁히", "좁힐"],
      ["ko.narrow", "좁히", "좁힙"],
      ["ko.narrow", "좁혀", "좁혀"],
      ["ko.fix-in-place", "박았", "박았"],
      ["ko.fix-in-place", "박", "박"],
      ["ko.fix-in-place", "박", "박"],
      ["ko.fix-in-place", "박", "박"],
      ["ko.fix-in-place", "박아", "박아"],
      ["ko.fix-in-place", "박힌", "박힌"],
      ["ko.fix-in-place", "박히", "박힐"],
      ["ko.fix-in-place", "박히", "박힙"],
      ["ko.fix-in-place", "박혀", "박혀"],
    ],
  );

  const morphologyExclusions = scanExpressions([
    makeTestSource("morphology-exclusions", "좁쌀 박물관 박사 박수 호박 압박 대박"),
  ]);
  assert.equal(
    morphologyExclusions.warnings.some((warning) => morphologyRuleIds.has(warning.ruleId)),
    false,
  );

  const ambiguousMorphology = scanExpressions([
    makeTestSource("ambiguous-morphology", "박지 씨. 박지. 못을 박다."),
  ]);
  assert.deepEqual(
    ambiguousMorphology.warnings
      .filter((warning) => warning.ruleId === "ko.fix-in-place")
      .map((warning) => warning.expression),
    ["박", "박", "박다"],
  );
  assert.equal(
    scanExpressions([makeTestSource("nfd-morphology", "좁힌".normalize("NFD"))]).warnings.some(
      (warning) => warning.ruleId === "ko.narrow",
    ),
    true,
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

  const generalizedMorphology =
    "닫습니다. 다룹니다. 다뤄. 회의를 가집니다. 회의를 가져.";
  const generalizedMorphologyCheck = scanExpressions([
    makeTestSource("generalized-morphology", generalizedMorphology),
  ]);
  assert.deepEqual(
    generalizedMorphologyCheck.warnings
      .filter((warning) =>
        ["ko.close", "ko.cover-topic", "ko.hold-meeting"].includes(warning.ruleId),
      )
      .map((warning) => [
        warning.ruleId,
        warning.expression,
        generalizedMorphology.slice(warning.startUtf16 - 1, warning.endUtf16 - 1),
      ]),
    [
      ["ko.close", "닫", "닫"],
      ["ko.cover-topic", "다루다", "다룹"],
      ["ko.cover-topic", "다루다", "다뤄"],
      ["ko.hold-meeting", "회의를 가지다", "회의를 가집"],
      ["ko.hold-meeting", "회의를 가지다", "회의를 가져"],
    ],
  );
  assert.equal(
    scanExpressions([makeTestSource("nfd-contraction", "다뤄".normalize("NFD"))]).warnings.some(
      (warning) => warning.ruleId === "ko.cover-topic",
    ),
    true,
  );
  assert.deepEqual(
    Object.keys(
      generalizedMorphologyCheck.rules.find((rule) => rule.id === "ko.cover-topic") ?? {},
    ),
    ["kind", "id", "expressions", "message", "queries", "negatives", "positives"],
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

  const repeatedExpressions = "경계".repeat(20_000);
  const cappedExpressions = scanExpressions([
    makeTestSource("expression-cap", repeatedExpressions),
    makeTestSource("after-cap", "좁다"),
  ]);
  assert.deepEqual(cappedExpressions.summary, {
    total: 20_001,
    shown: 20_000,
    omitted: 1,
  });

  assert.equal(cappedExpressions.warnings.at(-1)?.sourceId, "expression-cap");
  assert.ok(cappedExpressions.rules.some(({ id }) => id === "ko.narrow-state"));

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

  const assembled = scanSources([expressionSource, makeTestSource("paragraph", sevenSentences)]);
  assert.deepEqual(
    assembled.checks.map((check) => check.id),
    ["expressions", "paragraphs"],
  );
  assert.deepEqual(assembled.sources, [{ id: "expressions" }, { id: "paragraph" }]);
  assert.equal(assembled.checks[1].summary.total, 1);

  const empty = scanSources([makeTestSource("empty", "")]);
  assert.deepEqual(
    empty.checks.map((check) => check.summary.total),
    [0, 0],
  );

  const sources = Object.freeze([
    Object.freeze(expressionSource),
    Object.freeze(makeTestSource("paragraph", sevenSentences)),
  ]);
  assert.deepEqual(scanSources(sources), assembled);
  assert.throws(
    () =>
      scanSources(
        Array.from({ length: MAX_SOURCES + 1 }, (_, index) =>
          makeTestSource(`source-${index}`, ""),
        ),
      ),
    /input:too-many-sources/u,
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
  /** @type {ReturnType<typeof scanSources>} */
  const fileOutput = JSON.parse(fileChild.stdout);
  /** @type {ReturnType<typeof scanSources>} */
  const stdinOutput = JSON.parse(stdinChild.stdout);
  /** @param {ReturnType<typeof scanSources>["checks"]} checks */
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

  const helpChild = runScannerProcess(["--help"]);
  assert.equal(helpChild.error, undefined);
  assert.equal(helpChild.signal, null);
  assert.equal(helpChild.status, 0);
  assert.equal(helpChild.stderr, "");
  assert.equal(helpChild.stdout.endsWith("\n"), true);
  const helpLines = helpChild.stdout.split("\n");
  assert.ok(helpLines.includes("  node scripts/scan.mjs --file <path> [--file <path> ...]"));
  assert.ok(helpLines.includes("  node scripts/scan.mjs --stdin --source-name <name>"));
  for (const option of ["--changed <repo>", "--file <path>", "--stdin", "--source-name <name>", "--self-test", "--help"]) {
    assert.ok(
      helpLines.some((line) =>
        line.startsWith(`  ${option}  `) && line.slice(option.length + 2).trim().length > 0,
      ),
      `Missing help description: ${option}`,
    );
  }

  for (const invalidArgs of [
    ["--invalid-self-test-argument"],
    ["-h"],
    ["--he"],
    ["--help", "--file", scriptPath],
    ["--file", scriptPath, "--help"],
    ["--help", "--help"],
  ]) {
    const invalidChild = runScannerProcess(invalidArgs);
    assert.equal(invalidChild.status, 2);
    assert.equal(invalidChild.stdout, "");
    assert.match(invalidChild.stderr, /^usage:[a-z0-9-]+\n$/u);
  }

  /** @type {Array<[string[], Buffer | undefined, string]>} */
  const failureInputs = [
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
  ];
  for (const [args, input, expectedError] of failureInputs) {
    const failedChild = runScannerProcess(args, input);
    assert.equal(failedChild.error, undefined);
    assert.equal(failedChild.signal, null);
    assert.equal(failedChild.status, 2);
    assert.equal(failedChild.stdout, "");
    assert.equal(failedChild.stderr, expectedError);
  }

  /** @type {Promise<void>} */
  const closedPipe = new Promise((resolveClosedPipe, rejectClosedPipe) => {
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
  await closedPipe;

  const tempParent = join(process.cwd(), "temps");
  await mkdir(tempParent, { recursive: true });
  const repository = await mkdtemp(join(tempParent, "better-terms-self-test-"));
  try {
    /** @param {...string} args */
    function git(...args) {
      const child = spawnSync("git", [
        "-c", "user.name=Scanner Self-Test",
        "-c", "user.email=scanner@example.invalid",
        "-c", "commit.gpgSign=false",
        "-c", `core.hooksPath=${join(repository, "disabled-hooks")}`,
        ...args,
      ], {
        cwd: repository,
        encoding: "utf8",
        timeout: SELF_TEST_TIMEOUT_MS,
        maxBuffer: SELF_TEST_OUTPUT_BYTES,
        windowsHide: true,
      });
      assert.ifError(child.error);
      assert.equal(child.status, 0);
    }

    git("init", "--quiet");
    for (const name of ["staged.md", "staged-only.md", "unstaged.md", "unchanged.md"]) {
      await writeFile(join(repository, name), "", "utf8");
    }
    git("add", ".");
    git("commit", "--quiet", "-m", "Initialize scanner fixture");

    await writeFile(join(repository, "staged.md"), "경계", "utf8");
    await writeFile(join(repository, "staged-only.md"), "연결", "utf8");
    git("add", "staged.md", "staged-only.md");
    await writeFile(join(repository, "staged.md"), "근거", "utf8");
    await writeFile(join(repository, "unstaged.md"), "작업", "utf8");
    await writeFile(join(repository, "untracked.md"), sevenSentences, "utf8");

    const changedChild = runScannerProcess(["--changed", repository]);
    assert.equal(changedChild.status, 0);
    assert.equal(changedChild.stderr, "");
    /** @type {ReturnType<typeof scanSources>} */
    const changedOutput = JSON.parse(changedChild.stdout);
    assert.deepEqual(
      changedOutput.sources.map(({ id }) => id),
      ["staged-only.md", "staged.md", "unstaged.md", "untracked.md"],
    );
    assert.deepEqual(
      changedOutput.checks[0].warnings
        .filter(({ sourceId }) => sourceId === "staged.md")
        .map(({ ruleId }) => ruleId),
      ["ko.evidence"],
    );
    assert.deepEqual(
      changedOutput.checks[1].warnings.map(({ sourceId }) => sourceId),
      ["untracked.md"],
    );
  } finally {
    await rm(repository, { recursive: true, force: true });
  }
}

/**
 * @param {ReadonlyArray<string>} args
 * @param {string | Buffer} [input]
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
 * @param {string} id
 * @param {string} text
 * @returns {Source}
 */
function makeTestSource(id, text) {
  return { id, text, bytes: Buffer.byteLength(text, "utf8") };
}

/** @param {ReadonlyArray<string>} args */
async function main(args) {
  const mode = parseCommandLine(args);
  if (mode.kind === "help") {
    await writeText(process.stdout, HELP_TEXT);
    return;
  }
  if (mode.kind === "self-test") {
    try {
      await runSelfTest();
      return;
    } catch (error) {
      throw scannerError("self-test:failed", error instanceof Error ? error : undefined);
    }
  }

  let sources;
  if (mode.kind === "changed") {
    sources = await readChangedFiles(mode.repository);
  } else if (mode.kind === "files") {
    sources = await readFiles(mode.files);
  } else {
    sources = await readStdin(mode.sourceName);
  }

  const scan = scanSources(sources);
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
