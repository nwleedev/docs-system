/**
 * @typedef {{id: string, text: string}} Source
 */

/**
 * @typedef {{
 *   id: string,
 *   kind: "paragraph",
 *   min: number,
 *   message: string,
 *   queries: ReadonlyArray<string>,
 *   negatives: ReadonlyArray<string>,
 *   positives: ReadonlyArray<string>
 * }} ParagraphPolicy
 */

/**
 * @typedef {{
 *   ruleId: string,
 *   count: number,
 *   sourceId: string,
 *   line: number,
 *   startUtf16: number,
 *   quote: string
 * }} ParagraphWarning
 */

/**
 * @typedef {{text: string, line: number, startUtf16: number}} Paragraph
 */

/** @type {number} */
const MAX_WARNINGS = 20_000;
/** @type {number} */
const MAX_QUOTE_UTF16 = 480;

/** @type {ParagraphPolicy} */
const policy = {
  id: "ko.long-paragraph",
  kind: "paragraph",
  min: 7,
  message:
    "긴 문단에 서로 다른 중심 내용, 근거, 조건, 결정 상태 또는 후속 행동이 함께 있는지 확인합니다.",
  queries: [
    "모든 문장이 하나의 중심 내용을 설명합니까?",
    "문단을 나눌 때 사실, 순서와 의존 관계를 그대로 유지할 수 있습니까?",
  ],
  negatives: [
    "서버 접근 권한, 로그 보관 기간과 배포 승인 역할을 한 문단에서 각각 설명합니다.",
  ],
  positives: [
    "일곱 문장이 날짜 검사와 저장 순서를 하나의 흐름으로 설명하면 경고가 있어도 유지합니다.",
  ],
};

/**
 * Markdown의 최상위 플레인 텍스트 문단에서 길이 검토 후보를 찾는다.
 *
 * @param {ReadonlyArray<Source>} sources 입력 순서가 고정된 Markdown 원문
 * @returns {{
 *   id: "paragraphs",
 *   catalog: ReadonlyArray<{id: string, kind: "paragraph", min: number}>,
 *   rules: ReadonlyArray<ParagraphPolicy>,
 *   warnings: ReadonlyArray<ParagraphWarning>,
 *   summary: {total: number, shown: number, omitted: number}
 * }} 전체 긴 문단 수와 제한된 상세 경고
 * @remarks 문장 수는 수정 명령이 아니라 의미 검토 후보를 찾는 기준이다.
 */
export function scanParagraphs(sources) {
  validatePolicy();
  const segmenter = new Intl.Segmenter("ko", { granularity: "sentence" });
  /** @type {Array<ParagraphWarning>} */
  const warnings = [];
  let total = 0;

  for (const source of sources) {
    if (!source.text.isWellFormed()) {
      throw new Error("rules:invalid-source");
    }
    for (const paragraph of collectPlainTextParagraphs(source.text)) {
      const count = countSentences(segmenter, paragraph.text);
      if (count >= policy.min) {
        total += 1;
        if (warnings.length < MAX_WARNINGS) {
          warnings.push({
            ruleId: policy.id,
            count,
            sourceId: source.id,
            line: paragraph.line,
            startUtf16: paragraph.startUtf16,
            quote: makeQuote(paragraph.text),
          });
        }
      }
    }
  }

  return {
    id: "paragraphs",
    catalog: [{ id: policy.id, kind: policy.kind, min: policy.min }],
    rules: total === 0 ? [] : [policy],
    warnings,
    summary: {
      total,
      shown: warnings.length,
      omitted: total - warnings.length,
    },
  };
}

/**
 * 문단 정책의 식별자, 문장 수와 판정 자료를 확인한다.
 *
 * @returns {void}
 */
function validatePolicy() {
  if (
    policy.kind !== "paragraph" ||
    !/^ko\.[a-z0-9-]+$/u.test(policy.id) ||
    !Number.isSafeInteger(policy.min) ||
    policy.min < 1 ||
    !isNonEmptyText(policy.message)
  ) {
    throw new Error("rules:invalid-paragraph-policy");
  }
  for (const values of [policy.queries, policy.negatives, policy.positives]) {
    if (values.length === 0 || values.some((value) => !isNonEmptyText(value))) {
      throw new Error("rules:invalid-paragraph-policy");
    }
  }
}

/**
 * Markdown block 중 최상위 플레인 텍스트만 빈 줄 단위로 모은다.
 *
 * @param {string} text Markdown 원문
 * @returns {ReadonlyArray<Paragraph>} 문장 수를 셀 플레인 텍스트 문단
 */
function collectPlainTextParagraphs(text) {
  const lines = splitLines(text);
  /** @type {Array<Paragraph>} */
  const paragraphs = [];
  /** @type {Array<{text: string, line: number}>} */
  let current = [];
  let fence = null;
  const frontMatterEnd =
    lines[0]?.text === "---"
      ? lines.findIndex(
          (entry, index) =>
            index > 0 && (entry.text === "---" || entry.text === "..."),
        )
      : -1;
  /** @type {"html" | "other" | null} */
  let excludedBlock = null;

  const flush = () => {
    if (current.length === 0) {
      return;
    }
    const leading = current[0].text.search(/\S/u);
    paragraphs.push({
      text: current.map((entry) => entry.text.trim()).join("\n"),
      line: current[0].line,
      startUtf16: (leading < 0 ? 0 : leading) + 1,
    });
    current = [];
  };

  for (const [index, entry] of lines.entries()) {
    const trimmed = entry.text.trim();

    if (index <= frontMatterEnd) {
      continue;
    }

    if (excludedBlock === "html") {
      if (trimmed.length === 0) {
        excludedBlock = null;
      }
      continue;
    }

    const fenceMarker = readFence(entry.text);
    if (fence !== null) {
      if (
        fenceMarker !== null &&
        fenceMarker.character === fence.character &&
        fenceMarker.length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }
    if (fenceMarker !== null) {
      flush();
      fence = fenceMarker;
      excludedBlock = null;
      continue;
    }

    if (trimmed.length === 0) {
      flush();
      excludedBlock = null;
      continue;
    }

    if (isSetextUnderline(entry.text) && current.length > 0) {
      current = [];
      excludedBlock = null;
      continue;
    }

    if (/^ {0,3}#{1,6}(?:\s|$)/u.test(entry.text)) {
      flush();
      excludedBlock = null;
      continue;
    }

    if (/^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u.test(entry.text)) {
      flush();
      excludedBlock = null;
      continue;
    }

    if (excludedBlock !== null || isExcludedBlockStart(entry.text)) {
      flush();
      excludedBlock = /^ {0,3}</u.test(entry.text) ? "html" : "other";
      continue;
    }

    current.push(entry);
  }

  flush();
  return paragraphs;
}

/**
 * 원문을 줄 내용과 1부터 시작하는 줄 번호로 나눈다.
 *
 * @param {string} text Markdown 원문
 * @returns {ReadonlyArray<{text: string, line: number}>} 줄 정보
 */
function splitLines(text) {
  return text.split(/\r\n|\r|\n/u).map((line, index) => ({ text: line, line: index + 1 }));
}

/**
 * 최대 세 칸 들여쓴 fenced code 시작 또는 종료 표시를 읽는다.
 *
 * @param {string} line Markdown 한 줄
 * @returns {{character: string, length: number} | null} fence 종류와 길이
 */
function readFence(line) {
  const match = /^ {0,3}(`{3,}|~{3,})/u.exec(line);
  if (match === null) {
    return null;
  }
  return { character: match[1][0], length: match[1].length };
}

/**
 * 최상위 플레인 텍스트가 아닌 Markdown block의 시작인지 확인한다.
 *
 * @param {string} line Markdown 한 줄
 * @returns {boolean} 빈 줄까지 제외할 block이면 true
 */
function isExcludedBlockStart(line) {
  return (
    /^(?: {4}|\t)/u.test(line) ||
    /^ {0,3}>/u.test(line) ||
    /^ {0,3}(?:[-+*]|\d+[.)])\s+/u.test(line) ||
    /^ {0,3}</u.test(line) ||
    line.includes("|")
  );
}

/**
 * Setext 제목 밑줄인지 확인한다.
 *
 * @param {string} line Markdown 한 줄
 * @returns {boolean} 제목 밑줄이면 true
 */
function isSetextUnderline(line) {
  return /^ {0,3}(?:=+|-+)\s*$/u.test(line);
}

/**
 * Intl.Segmenter가 문장 단위로 나눈 구간 중 문자나 숫자가 포함된 구간의 수를 센다.
 *
 * @param {Intl.Segmenter} segmenter 한국어 문장 분리기
 * @param {string} text 문단 원문
 * @returns {number} 관찰한 문장 수
 */
function countSentences(segmenter, text) {
  let count = 0;
  for (const part of segmenter.segment(text)) {
    if (/[\p{L}\p{N}]/u.test(part.segment)) {
      count += 1;
    }
  }
  return count;
}

/**
 * 문단 앞부분을 surrogate pair를 자르지 않고 480 UTF-16 code unit까지 반환한다.
 *
 * @param {string} text 문단 원문
 * @returns {string} AI가 검토 위치를 찾을 원문 일부
 */
function makeQuote(text) {
  if (text.length <= MAX_QUOTE_UTF16) {
    return text;
  }
  let end = MAX_QUOTE_UTF16;
  if (isHighSurrogate(text.charCodeAt(end - 1)) && isLowSurrogate(text.charCodeAt(end))) {
    end -= 1;
  }
  return text.slice(0, end);
}

/**
 * @param {string} value 판정 자료
 * @returns {boolean} 문자가 있고 Unicode가 온전하면 true
 */
function isNonEmptyText(value) {
  return value.trim().length > 0 && value.isWellFormed();
}

/**
 * @param {number} unit UTF-16 code unit
 * @returns {boolean} high surrogate이면 true
 */
function isHighSurrogate(unit) {
  return unit >= 0xd800 && unit <= 0xdbff;
}

/**
 * @param {number} unit UTF-16 code unit
 * @returns {boolean} low surrogate이면 true
 */
function isLowSurrogate(unit) {
  return unit >= 0xdc00 && unit <= 0xdfff;
}
