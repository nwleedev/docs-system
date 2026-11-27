/** @typedef {{id: string, text: string}} Source */

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

/** @typedef {{text: string, line: number, startUtf16: number}} Paragraph */

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
    "일곱 문장이 날짜 검사부터 저장까지 같은 절차를 실행 순서대로 설명하면 한 문단으로 유지합니다.",
  ],
};

/**
 * @param {ReadonlyArray<Source>} sources
 * @returns {{
 *   id: "paragraphs",
 *   catalog: ReadonlyArray<{id: string, kind: "paragraph", min: number}>,
 *   rules: ReadonlyArray<ParagraphPolicy>,
 *   warnings: ReadonlyArray<ParagraphWarning>,
 *   summary: {total: number, shown: number, omitted: number}
 * }}
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

/** @returns {void} */
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
 * @param {string} text
 * @returns {ReadonlyArray<Paragraph>}
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
 * @param {string} text
 * @returns {ReadonlyArray<{text: string, line: number}>}
 */
function splitLines(text) {
  return text.split(/\r\n|\r|\n/u).map((line, index) => ({ text: line, line: index + 1 }));
}

/**
 * @param {string} line
 * @returns {{character: string, length: number} | null}
 */
function readFence(line) {
  const match = /^ {0,3}(`{3,}|~{3,})/u.exec(line);
  if (match === null) {
    return null;
  }
  return { character: match[1][0], length: match[1].length };
}

/**
 * @param {string} line
 * @returns {boolean}
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
 * @param {string} line
 * @returns {boolean}
 */
function isSetextUnderline(line) {
  return /^ {0,3}(?:=+|-+)\s*$/u.test(line);
}

/**
 * @param {Intl.Segmenter} segmenter
 * @param {string} text
 * @returns {number}
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
 * @param {string} text
 * @returns {string}
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
 * @param {string} value
 * @returns {boolean}
 */
function isNonEmptyText(value) {
  return value.trim().length > 0 && value.isWellFormed();
}

/**
 * @param {number} unit
 * @returns {boolean}
 */
function isHighSurrogate(unit) {
  return unit >= 0xd800 && unit <= 0xdbff;
}

/**
 * @param {number} unit
 * @returns {boolean}
 */
function isLowSurrogate(unit) {
  return unit >= 0xdc00 && unit <= 0xdfff;
}
