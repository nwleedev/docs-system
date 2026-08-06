import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { execFile, spawnSync } from "node:child_process";
import { constants } from "node:fs";
import { access, lstat, open, readFile, realpath } from "node:fs/promises";
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

/**
 * @typedef {{
 *   id: string,
 *   expressions: ReadonlyArray<string>,
 *   message: string,
 *   queries: ReadonlyArray<string>,
 *   negatives: ReadonlyArray<string>,
 *   positives: ReadonlyArray<string>
 * }} Rule
 */

/**
 * @typedef {{
 *   id: string,
 *   path?: string,
 *   text: string,
 *   bytes: number
 * }} Source
 */

/**
 * @typedef {{
 *   ruleId: string,
 *   expression: string,
 *   sourceId: string,
 *   line: number,
 *   startUtf16: number,
 *   endUtf16: number,
 *   quote: string
 * }} Warning
 */

/**
 * @typedef {{
 *   sources: ReadonlyArray<SourceMetadata>,
 *   warnings: ReadonlyArray<Warning>,
 *   matchedRules: ReadonlyArray<boolean>,
 *   total: number
 * }} ScanResult
 */

/**
 * @typedef {{kind: "changed", repository: string} |
 *   {kind: "files", files: ReadonlyArray<string>} |
 *   {kind: "stdin", sourceName: string} |
 *   {kind: "self-test"}} InputMode
 */

/**
 * @typedef {{
 *   ruleIndex: number,
 *   expression: string
 * }} ExpressionDescriptor
 */

/**
 * @typedef {{
 *   id: string,
 *   path?: string
 * }} SourceMetadata
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
const MAX_WARNINGS = 50_000;
/** @type {number} */
const MAX_QUOTE_UTF16 = 480;
/** @type {number} */
const MAX_JSON_BYTES = 64 * 1024 * 1024;
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
 * 검사할 literal 후보와 AI가 각 문맥을 판정할 때 사용할 질문 및 대조 사례다.
 *
 * @type {ReadonlyArray<Rule>}
 */
const rules = [
  {
    id: "ko.middle-dot",
    expressions: ["·"],
    message: "일반 산문의 가운뎃점인지 정확한 문자를 보존해야 하는 용례인지 확인합니다.",
    queries: [
      "쉼표, 조사 또는 문장 분리로 같은 뜻을 더 쉽게 전달할 수 있습니까?",
      "인용문, 승인된 이름, 코드 또는 문자 처리 사례라서 이 문자가 필요합니까?",
    ],
    negatives: ["설계·구현 결과를 기록합니다."],
    positives: ["문자 U+00B7은 `·`이다."],
  },
  {
    id: "ko.about",
    expressions: ["에 대해서"],
    message: "조사를 줄이거나 문장 구조를 바꿔 대상을 직접 설명할 수 있는지 확인합니다.",
    queries: ["이 표현을 빼도 뜻이 같습니까?", "무엇을 설명하거나 검사하는지 바로 알 수 있습니까?"],
    negatives: ["검사 결과에 대해서 설명합니다."],
    positives: ["검사 결과를 설명합니다."],
  },
  {
    id: "ko.by-passive",
    expressions: ["에 의해서"],
    message: "피동문이 실제 행동 주체와 책임을 감추는지 확인합니다.",
    queries: ["누가 행동하는지 문장에 나옵니까?", "피동 표현이 필요한 이유가 있습니까?"],
    negatives: ["변경은 검토에 의해서 승인됩니다."],
    positives: ["검수자가 변경 내용을 확인하고 승인 책임자가 배포를 승인합니다."],
  },
  {
    id: "ko.in-context",
    expressions: ["에 있어서"],
    message: "장소나 조건을 뜻하지 않는 번역체인지 확인합니다.",
    queries: ["이 표현을 조사 하나로 바꿀 수 있습니까?", "적용되는 조건이 문장에 직접 나옵니까?"],
    negatives: ["파일 검사에 있어서 속도가 중요합니다."],
    positives: ["파일 검사에서는 속도가 중요합니다."],
  },
  {
    id: "ko.with-relationship",
    expressions: ["와의"],
    message: "명사 사이의 관계를 조사나 동사로 직접 나타낼 수 있는지 확인합니다.",
    queries: ["두 대상이 어떤 행동으로 연결되는지 알 수 있습니까?", "명사 나열을 동사로 바꿀 수 있습니까?"],
    negatives: ["검수자와의 합의를 기록합니다."],
    positives: ["검수자와 합의한 내용을 기록합니다."],
  },
  {
    id: "ko.must-double-negative",
    expressions: ["하지 않으면 안 된다"],
    message: "이중 부정을 의무를 직접 나타내는 문장으로 바꿀 수 있는지 확인합니다.",
    queries: ["`해야 한다`로 써도 뜻이 같습니까?", "의무의 주체가 문장에 나옵니까?"],
    negatives: ["검수자는 결과를 확인하지 않으면 안 된다."],
    positives: ["검수자는 결과를 확인해야 한다."],
  },
  {
    id: "ko.hold-meeting",
    expressions: ["회의를 가지다"],
    message: "영어식 명사와 동사 결합을 실제 회의 행동으로 바꿀 수 있는지 확인합니다.",
    queries: ["회의를 열거나 회의한다는 뜻입니까?", "회의의 주체와 목적이 드러납니까?"],
    negatives: ["담당자들이 검토 회의를 가집니다."],
    positives: ["담당자들이 검토 회의를 엽니다."],
  },
  {
    id: "ko.user-facing",
    expressions: ["사용자-facing"],
    message: "한국어 문장에 영어 보통명사를 혼합하지 않고 실제 표시 대상을 설명할 수 있는지 확인합니다.",
    queries: ["제품명이나 API 이름처럼 원문을 유지해야 합니까?", "사용자에게 무엇이 보이는지 직접 쓸 수 있습니까?"],
    negatives: ["사용자-facing 오류 문구를 수정합니다."],
    positives: ["사용자에게 표시할 오류 문구를 수정합니다."],
  },
  {
    id: "ko.scope",
    expressions: ["범위"],
    message: "무엇이 포함되고 제외되는지 확인할 수 있는 범위인지 판정합니다.",
    queries: ["적용 대상과 제외 대상이 드러납니까?", "가까운 문장에서 하나의 대상을 가리킵니까?"],
    negatives: ["검토 범위를 적절하게 맞춥니다."],
    positives: ["검사 범위는 변경된 Markdown 파일이며 이미지 파일은 제외합니다."],
  },
  {
    id: "ko.boundary",
    expressions: ["경계"],
    message: "안과 밖 또는 책임이 바뀌는 실제 기준이 있는지 확인합니다.",
    queries: ["무엇과 무엇을 나누는지 알 수 있습니까?", "수학, 보안 또는 시스템 분야의 정확한 용어입니까?"],
    negatives: ["조사와 구현의 경계를 정리합니다."],
    positives: ["두 시스템의 보안 경계에서 요청을 다시 인증합니다."],
  },
  {
    id: "ko.contract",
    expressions: ["계약"],
    message: "법률 계약 또는 명시된 인터페이스 규칙을 가리키는지 확인합니다.",
    queries: ["당사자나 모듈이 따라야 할 조건이 정의돼 있습니까?", "단순한 약속이나 관계를 대신하는 표현입니까?"],
    negatives: ["두 문서의 계약을 맞춥니다."],
    positives: ["근로계약의 유효성은 계약 체결 당시의 법률에 따라 판단합니다."],
  },
  {
    id: "ko.rubric",
    expressions: ["루브릭"],
    message: "평가 항목과 판정 기준이 실제로 정의된 채점 도구인지 확인합니다.",
    queries: ["평가 항목과 단계별 기준이 나옵니까?", "단순한 확인 목록을 대신하는 표현입니까?"],
    negatives: ["문서 품질 루브릭을 확인합니다."],
    positives: ["채점 루브릭은 답안의 정확성, 근거와 설명을 각각 평가합니다."],
  },
  {
    id: "ko.validity",
    expressions: ["유효성"],
    message: "무엇이 어떤 조건에서 유효한지 판정 대상을 확인합니다.",
    queries: ["유효 여부를 결정하는 규칙이 있습니까?", "정확성이나 존재 여부를 뭉뚱그린 표현입니까?"],
    negatives: ["설정의 유효성을 보장합니다."],
    positives: ["서명 유효성은 등록된 공개 키로 검증합니다."],
  },
  {
    id: "ko.consistency",
    expressions: ["정합성"],
    message: "서로 일치해야 하는 값과 비교 방법이 드러나는지 확인합니다.",
    queries: ["어떤 값끼리 비교합니까?", "일치 조건과 불일치 처리 방법이 있습니까?"],
    negatives: ["데이터 정합성을 강화합니다."],
    positives: ["두 테이블의 주문 식별자를 비교해 데이터 정합성을 확인합니다."],
  },
  {
    id: "ko.visibility",
    expressions: ["가시성"],
    message: "분야에서 정한 표시 상태 또는 관찰 가능성을 가리키는지 확인합니다.",
    queries: ["누가 무엇을 볼 수 있는지 알 수 있습니까?", "제품 설정이나 전문 분야의 정확한 명칭입니까?"],
    negatives: ["진행 상황의 가시성을 높입니다."],
    positives: ["사이트 가시성을 공개로 바꾸면 인터넷 사용자가 페이지를 볼 수 있습니다."],
  },
  {
    id: "ko.path",
    expressions: ["경로"],
    message: "파일 위치, URL, 네트워크 구간 또는 그래프 탐색 순서를 가리키는지 확인합니다.",
    queries: ["위치나 이동 구간을 식별할 수 있습니까?", "방법이나 절차를 대신하는 표현입니까?"],
    negatives: ["시험 환경 접근 경로를 정리합니다."],
    positives: ["설정 파일 경로는 `config/app.yml`입니다."],
  },
  {
    id: "ko.public",
    expressions: ["공개"],
    message: "누가 무엇을 읽거나 사용할 수 있는 상태인지 확인합니다.",
    queries: ["인증과 권한 조건이 드러납니까?", "공개 키나 정보공개처럼 확립된 개념입니까?"],
    negatives: ["외부 자료는 공개 저장소에서 확인합니다."],
    positives: ["공개 키는 서명을 검증하는 데 사용합니다."],
  },
  {
    id: "ko.product",
    expressions: ["제품"],
    message: "판매하거나 제공하는 구체적인 제품을 뜻하는지 확인합니다.",
    queries: ["어떤 서비스나 물품을 가리키는지 알 수 있습니까?", "기능, 저장소 또는 문서를 뭉뚱그린 표현입니까?"],
    negatives: ["문서 제품의 품질을 개선합니다."],
    positives: ["이 제품은 설치형 장비와 함께 판매됩니다."],
  },
  {
    id: "ko.saturation",
    expressions: ["포화"],
    message: "측정 대상과 더 증가하지 않는 판정 조건이 정의돼 있는지 확인합니다.",
    queries: ["물리 또는 기술 상태의 측정 기준이 있습니까?", "연구라면 새 범주가 나오지 않는 판단 방법과 중단 기준이 있습니까?"],
    negatives: ["조사 결과가 포화될 때까지 사례를 모읍니다."],
    positives: ["센서 출력이 상한에 도달해 입력을 늘려도 값이 증가하지 않으면 포화로 판정합니다."],
  },
  {
    id: "ko.ownership",
    expressions: ["소유"],
    message: "재산권 또는 승인된 책임 관계가 실제로 있는지 확인합니다.",
    queries: ["누가 무엇에 대한 권리나 책임을 가집니까?", "기록, 운영 또는 답변 같은 행동을 대신합니까?"],
    negatives: ["이 절은 설치 지침을 소유합니다."],
    positives: ["저작권자는 소스 코드의 저작권을 소유합니다."],
  },
  {
    id: "ko.falsification",
    expressions: ["반증"],
    message: "검증할 가설과 그 가설을 기각할 조건이 명시돼 있는지 확인합니다.",
    queries: ["기각할 가설이 문장에 나옵니까?", "실행 가능성 확인이나 실패 조건 점검을 대신합니까?"],
    negatives: ["구현 가능성을 반증합니다."],
    positives: ["관측값이 예측 구간을 벗어나면 이 가설의 반증 근거로 사용합니다."],
  },
  {
    id: "ko.narrow",
    expressions: ["좁히", "좁혀"],
    message: "줄어드는 대상과 이전 및 이후 기준이 드러나는지 확인합니다.",
    queries: ["무엇을 얼마나 줄이는지 알 수 있습니까?", "검색, 선택 또는 물리적 폭을 실제로 줄입니까?"],
    negatives: ["모듈의 경계를 좁혀 안정성을 높입니다."],
    positives: ["검색 범위를 최근 변경 파일로 좁혀 검사 시간을 줄입니다."],
  },
  {
    id: "ko.fix-in-place",
    expressions: ["박다", "박아", "박은", "박힌", "박혀"],
    message: "물체를 고정하는 뜻인지 규칙을 바꾸기 어렵게 만든다는 비유인지 확인합니다.",
    queries: ["물리적으로 고정하는 대상이 있습니까?", "설정하거나 기록한다는 행동을 대신합니까?"],
    negatives: ["지원 버전을 코드에 박아 둡니다."],
    positives: ["벽에 못을 박아 안내판을 고정합니다."],
  },
  {
    id: "ko.support",
    expressions: ["지원"],
    message: "허용하는 입력, 제공하는 기능 또는 책임 범위가 구체적인지 확인합니다.",
    queries: ["무엇을 사용할 수 있게 합니까?", "지원하지 않는 조건도 예측할 수 있습니까?"],
    negatives: ["여러 형식을 안정적으로 지원합니다."],
    positives: ["이 변환기는 JSON과 CSV 입력을 지원합니다."],
  },
  {
    id: "ko.guarantee",
    expressions: ["보장"],
    message: "보장 주체, 조건과 결과가 명시돼 있는지 확인합니다.",
    queries: ["누가 어떤 조건에서 무엇을 책임집니까?", "검사하거나 방지한다는 동작을 대신합니까?"],
    negatives: ["이 규칙은 결과의 정확성을 보장합니다."],
    positives: ["보험 약관은 정해진 조건에서 입원비 지급을 보장합니다."],
  },
  {
    id: "ko.response",
    expressions: ["대응"],
    message: "어떤 사건에 누가 어떤 행동을 하는지 확인합니다.",
    queries: ["발생 조건과 후속 행동이 드러납니까?", "오류를 무시하거나 포괄적으로 처리한다는 뜻입니까?"],
    negatives: ["예외 상황에 유연하게 대응합니다."],
    positives: ["재난 대응 절차는 경보가 울리면 작업자가 전원을 차단하도록 정합니다."],
  },
  {
    id: "ko.cover-topic",
    expressions: ["다루다"],
    message: "설명할 주제나 처리할 동작이 구체적인지 확인합니다.",
    queries: ["무엇을 설명하거나 처리합니까?", "여러 독립 행동을 하나로 감춘 표현입니까?"],
    negatives: ["이 절은 다양한 오류를 다룹니다."],
    positives: ["이 절에서는 RFC 8259의 숫자 문법을 다룹니다."],
  },
  {
    id: "ko.exposure",
    expressions: ["노출"],
    message: "무엇이 누구에게 보이거나 드러나는지 확인합니다.",
    queries: ["대상과 관찰자가 명시돼 있습니까?", "API 제공이나 화면 표시를 대신하는 표현입니까?"],
    negatives: ["내부 기능을 외부에 노출합니다."],
    positives: ["로그에 비밀번호가 기록되면 개인정보 노출 사고로 처리합니다."],
  },
  {
    id: "ko.capture",
    expressions: ["포착"],
    message: "카메라나 센서가 순간을 기록하는 뜻인지 추상적인 발견을 대신하는지 확인합니다.",
    queries: ["무엇이 어떤 순간을 기록합니까?", "찾거나 확인한다는 행동을 대신합니까?"],
    negatives: ["문서의 문제를 포착합니다."],
    positives: ["카메라는 움직임을 감지한 순간의 영상을 포착합니다."],
  },
  {
    id: "ko.alignment",
    expressions: ["정렬"],
    message: "순서 또는 화면 배치를 정하는 기준이 드러나는지 확인합니다.",
    queries: ["어떤 값을 어떤 기준으로 배열합니까?", "의견이나 목표를 맞춘다는 뜻을 대신합니까?"],
    negatives: ["팀의 목표를 정렬합니다."],
    positives: ["목록을 작성일의 내림차순으로 정렬합니다."],
  },
  {
    id: "ko.surface",
    expressions: ["표면화"],
    message: "숨겨져 있던 대상이 실제로 드러나는 사건인지 확인합니다.",
    queries: ["무엇이 어디에서 드러납니까?", "표시하거나 보고한다는 동작을 대신합니까?"],
    negatives: ["검사 결과에서 문제를 표면화합니다."],
    positives: ["잠재된 갈등이 공개 토론에서 표면화됐습니다."],
  },
  {
    id: "ko.core",
    expressions: ["핵심"],
    message: "중요하다는 평가를 뒷받침하는 기준이 있는지 확인합니다.",
    queries: ["무엇보다 중요한지 기준이 있습니까?", "이 표현을 지워도 사실과 행동이 같습니까?"],
    negatives: ["핵심 기능을 개선합니다."],
    positives: ["로그인과 결제는 출시 전에 반드시 통과해야 하는 핵심 기능으로 지정됐습니다."],
  },
  {
    id: "ko.effective",
    expressions: ["효과적"],
    message: "목표와 측정 결과가 효과 판단을 뒷받침하는지 확인합니다.",
    queries: ["어떤 목표에 효과가 있습니까?", "비교 결과나 관찰 근거가 있습니까?"],
    negatives: ["효과적인 검토 절차를 사용합니다."],
    positives: ["캐시 적용 뒤 응답 시간이 절반으로 줄어 이 방법이 효과적이었습니다."],
  },
  {
    id: "ko.smooth",
    expressions: ["원활"],
    message: "중단 없이 진행된다는 조건과 관찰 결과가 있는지 확인합니다.",
    queries: ["무엇이 막히지 않아야 합니까?", "오류, 지연 또는 재시도 조건이 명시돼 있습니까?"],
    negatives: ["원활한 사용자 경험을 제공합니다."],
    positives: ["차량이 원활하게 합류하도록 진입 신호 시간을 조정합니다."],
  },
  {
    id: "ko.strong",
    expressions: ["강력"],
    message: "강도를 판단하는 측정값이나 비교 기준이 있는지 확인합니다.",
    queries: ["무엇보다 강한지 알 수 있습니까?", "기능이 많다는 뜻을 대신합니까?"],
    negatives: ["강력한 검사 기능을 제공합니다."],
    positives: ["시험에서 기존 자석보다 두 배 큰 힘을 낸 강력한 자석입니다."],
  },
  {
    id: "ko.robust",
    expressions: ["견고"],
    message: "고장이나 변형을 견딘 조건과 시험 근거가 있는지 확인합니다.",
    queries: ["어떤 실패를 견딥니까?", "시험이나 구조 기준이 명시돼 있습니까?"],
    negatives: ["견고한 아키텍처를 구성합니다."],
    positives: ["내진 시험을 통과한 견고한 기초 위에 장비를 설치합니다."],
  },
  {
    id: "ko.comprehensive",
    expressions: ["포괄적"],
    message: "포함한 대상과 제외한 대상을 열거할 수 있는지 확인합니다.",
    queries: ["무엇을 모두 포함합니까?", "누락 여부를 확인할 기준이 있습니까?"],
    negatives: ["포괄적인 검토를 수행합니다."],
    positives: ["입력, 출력, 오류와 복구 절차를 모두 포함해 포괄적으로 검토합니다."],
  },
  {
    id: "ko.various",
    expressions: ["다양한"],
    message: "서로 다른 대상이나 조건을 실제로 열거하는지 확인합니다.",
    queries: ["어떤 종류가 있는지 알 수 있습니까?", "복수라는 사실 외에 정보를 더합니까?"],
    negatives: ["다양한 상황을 지원합니다."],
    positives: ["JSON, CSV와 TSV처럼 다양한 입력 형식을 읽습니다."],
  },
  {
    id: "ko.essential",
    expressions: ["본질적"],
    message: "분야에서 정한 필수 속성이나 정의가 있는지 확인합니다.",
    queries: ["그 속성이 없으면 대상이 달라집니까?", "단순히 중요하다는 평가를 대신합니까?"],
    negatives: ["문서 검토는 본질적인 작업입니다."],
    positives: ["납품을 불가능하게 하는 위반을 본질적 계약 위반으로 정의합니다."],
  },
  {
    id: "ko.the-relevant",
    expressions: ["해당"],
    message: "가까운 문장에서 하나의 대상을 가리키는지 확인합니다.",
    queries: ["어떤 명사를 다시 가리키는지 하나로 정해집니까?", "대상 이름을 직접 반복하는 편이 더 분명합니까?"],
    negatives: ["해당 기능을 실행합니다."],
    positives: ["사용자가 선택한 파일을 읽습니다. 해당 파일이 비어 있으면 검사를 종료합니다."],
  },
  {
    id: "ko.related",
    expressions: ["관련"],
    message: "두 대상의 관계가 무엇인지 확인합니다.",
    queries: ["무엇과 어떤 이유로 연결됩니까?", "대상 이름이나 조건을 직접 쓸 수 있습니까?"],
    negatives: ["관련 데이터를 확인합니다."],
    positives: ["결제 오류와 관련된 요청 로그를 확인합니다."],
  },
  {
    id: "ko.this-content",
    expressions: ["이 내용"],
    message: "앞 문장이나 절 가운데 하나의 내용을 가리키는지 확인합니다.",
    queries: ["독자가 하나의 선행 문장을 선택할 수 있습니까?", "가리키는 규칙이나 결론을 직접 쓸 수 있습니까?"],
    negatives: ["이 내용을 다음 단계에 반영합니다."],
    positives: ["이 내용은 직전 문장의 오류 처리 규칙을 가리킵니다."],
  },
  {
    id: "ko.result",
    expressions: ["결과"],
    message: "어떤 입력과 계산에서 나온 값인지 확인합니다.",
    queries: ["앞 단계의 행동과 산출물이 연결됩니까?", "합계, 판정 또는 파일처럼 실제 값을 쓸 수 있습니까?"],
    negatives: ["결과를 다음 작업에 사용합니다."],
    positives: ["주문 금액을 합산한 결과를 영수증의 합계로 표시합니다."],
  },
  {
    id: "ko.output",
    expressions: ["출력"],
    message: "무엇을 어느 stream, 파일 또는 화면에 기록하는지 확인합니다.",
    queries: ["출력 형식과 목적지가 드러납니까?", "함수 반환값과 process 출력을 구분합니까?"],
    negatives: ["출력을 확인합니다."],
    positives: ["표준 출력에 JSON 객체 하나를 기록합니다."],
  },
  {
    id: "ko.data",
    expressions: ["데이터"],
    message: "값의 종류, 필드와 출처를 확인할 수 있는지 판정합니다.",
    queries: ["어떤 값을 어디에서 읽습니까?", "더 구체적인 도메인 이름을 쓸 수 있습니까?"],
    negatives: ["데이터를 처리합니다."],
    positives: ["주문 데이터의 `total` 열을 합산합니다."],
  },
  {
    id: "ko.feature",
    expressions: ["기능"],
    message: "사용자가 수행할 수 있는 구체적인 행동을 가리키는지 확인합니다.",
    queries: ["어떤 입력과 결과가 있는지 알 수 있습니까?", "모듈, 함수 또는 화면 이름을 직접 쓸 수 있습니까?"],
    negatives: ["해당 기능을 개선합니다."],
    positives: ["파일 업로드 기능은 CSV 파일을 받아 주문 목록을 만듭니다."],
  },
];

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
 * 내장 규칙의 식별자, 후보 표현, 질문과 대조 사례가 실행 가능한지 확인한다.
 *
 * @param {ReadonlyArray<Rule>} ruleSet 검사할 규칙 배열
 * @returns {void}
 */
function validateRules(ruleSet) {
  /** @type {Set<string>} */
  const ids = new Set();
  for (const rule of ruleSet) {
    if (!/^ko\.[a-z0-9-]+$/u.test(rule.id) || ids.has(rule.id)) {
      throw scannerError("rules:invalid-id");
    }
    ids.add(rule.id);
    if (!isNonEmptyText(rule.message)) {
      throw scannerError("rules:invalid-message");
    }
    validateTextList(rule.expressions, "rules:invalid-expression", true);
    validateTextList(rule.queries, "rules:invalid-query", false);
    validateTextList(rule.negatives, "rules:invalid-negative", false);
    validateTextList(rule.positives, "rules:invalid-positive", false);
  }
}

/**
 * 규칙의 문자열 배열이 비어 있지 않고 중복 및 잘못된 Unicode를 포함하지 않는지 확인한다.
 *
 * @param {ReadonlyArray<string>} values 검사할 문자열 배열
 * @param {string} errorCode 실패할 때 사용할 공개 오류 code
 * @param {boolean} enforceQuoteLimit 후보 표현 길이를 quote 상한과 함께 검사할지 여부
 * @returns {void}
 */
function validateTextList(values, errorCode, enforceQuoteLimit) {
  if (values.length === 0) {
    throw scannerError(errorCode);
  }
  /** @type {Set<string>} */
  const unique = new Set();
  for (const value of values) {
    if (!isNonEmptyText(value) || unique.has(value)) {
      throw scannerError(errorCode);
    }
    if (enforceQuoteLimit && (value.length > MAX_QUOTE_UTF16 || /[\r\n]/u.test(value))) {
      throw scannerError(errorCode);
    }
    unique.add(value);
  }
}

/**
 * 사람이 읽을 규칙 자료가 공백뿐인 값이나 고립 surrogate를 포함하는지 확인한다.
 *
 * @param {string} value 검사할 문자열
 * @returns {boolean} 문자가 있고 Unicode가 온전하면 true
 */
function isNonEmptyText(value) {
  return value.trim().length > 0 && value.isWellFormed();
}

/**
 * 필요한 source 제공 함수 하나만 호출하고 내장 규칙 전체로 동일한 탐색을 실행한다.
 *
 * @param {Readonly<{provideSources: SourceProvider}>} dependencies source를 읽는 실제 기능
 * @returns {Promise<ScanResult>} 전체 출현 수와 제한된 상세 경고를 가진 탐색 결과
 */
async function scanSources({ provideSources }) {
  validateRules(rules);
  const sources = await provideSources();
  return scanProvidedSources(sources, rules, MAX_WARNINGS);
}

/**
 * 준비된 source를 입력 순서대로 검사하며 규칙을 외부 입력으로 선택하지 않는 탐색 본체다.
 *
 * @param {ReadonlyArray<Source>} sources 입력 어댑터가 만든 source
 * @param {ReadonlyArray<Rule>} ruleSet 실행할 규칙 배열
 * @param {number} warningLimit 메모리에 보관할 결정적 상세 경고 수
 * @returns {ScanResult} 모든 출현의 집계와 앞부분 상세 경고
 */
function scanProvidedSources(sources, ruleSet, warningLimit) {
  if (sources.length > MAX_SOURCES) {
    throw scannerError("input:too-many-sources");
  }
  /** @type {Array<Warning>} */
  const warnings = [];
  /** @type {Array<boolean>} */
  const matchedRules = ruleSet.map(() => false);
  const expressionIndex = buildExpressionIndex(ruleSet);
  let total = 0;
  let totalBytes = 0;

  for (const source of sources) {
    if (source.bytes < 0 || source.bytes > MAX_SOURCE_BYTES || !source.text.isWellFormed()) {
      throw scannerError("input:invalid-source");
    }
    totalBytes += source.bytes;
    if (totalBytes > MAX_TOTAL_BYTES) {
      throw scannerError("input:total-too-large");
    }
    const sourceResult = scanSource(source, ruleSet, expressionIndex, warningLimit, warnings);
    total += sourceResult.found;
    for (const ruleIndex of sourceResult.matchedRuleIndexes) {
      matchedRules[ruleIndex] = true;
    }
  }

  const sourceMetadata = sources.map((source) =>
    source.path === undefined ? { id: source.id } : { id: source.id, path: source.path },
  );
  return { sources: sourceMetadata, warnings, matchedRules, total };
}

/**
 * 첫 UTF-16 code unit별 후보를 규칙과 표현 선언 순서로 묶어 전체 문자열 순회를 작게 유지한다.
 *
 * @param {ReadonlyArray<Rule>} ruleSet 내장 또는 self-test 규칙
 * @returns {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} 첫 문자에서 후보 설명으로 이어지는 색인
 */
function buildExpressionIndex(ruleSet) {
  /** @type {Map<string, Array<ExpressionDescriptor>>} */
  const index = new Map();
  for (const [ruleIndex, rule] of ruleSet.entries()) {
    for (const expression of rule.expressions) {
      const firstUnit = expression[0];
      const descriptors = index.get(firstUnit) ?? [];
      descriptors.push({ ruleIndex, expression });
      index.set(firstUnit, descriptors);
    }
  }
  return index;
}

/**
 * 한 source의 모든 UTF-16 시작 위치를 순회해 겹치는 literal 출현도 각각 집계한다.
 *
 * @param {Source} source 검사할 source
 * @param {ReadonlyArray<Rule>} ruleSet 규칙 선언 순서를 제공하는 배열
 * @param {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} expressionIndex 첫 문자별 후보 색인
 * @param {number} warningLimit 상세 경고 상한
 * @param {Array<Warning>} warnings 실행 전체에서 앞부분 경고를 보관하는 배열
 * @returns {{found: number, matchedRuleIndexes: ReadonlySet<number>}} 이 source의 출현 수와 규칙 위치
 */
function scanSource(source, ruleSet, expressionIndex, warningLimit, warnings) {
  let found = 0;
  let line = 1;
  let lineStart = 0;
  let lineEnd = findLineEnd(source.text, 0);
  /** @type {Set<number>} */
  const matchedRuleIndexes = new Set();

  for (let offset = 0; offset < source.text.length; offset += 1) {
    const descriptors = expressionIndex.get(source.text[offset]);
    if (descriptors !== undefined) {
      for (const descriptor of descriptors) {
        if (source.text.startsWith(descriptor.expression, offset)) {
          found += 1;
          matchedRuleIndexes.add(descriptor.ruleIndex);
          if (warnings.length < warningLimit) {
            const startUtf16 = offset - lineStart + 1;
            warnings.push({
              ruleId: ruleSet[descriptor.ruleIndex].id,
              expression: descriptor.expression,
              sourceId: source.id,
              line,
              startUtf16,
              endUtf16: startUtf16 + descriptor.expression.length,
              quote: makeQuote(
                source.text,
                lineStart,
                lineEnd,
                offset,
                descriptor.expression.length,
              ),
            });
          }
        }
      }
    }

    const unit = source.text.charCodeAt(offset);
    const previousUnit = offset === 0 ? -1 : source.text.charCodeAt(offset - 1);
    if (unit === 13) {
      const nextOffset = source.text.charCodeAt(offset + 1) === 10 ? offset + 2 : offset + 1;
      line += 1;
      lineStart = nextOffset;
      lineEnd = findLineEnd(source.text, nextOffset);
    } else if (unit === 10 && previousUnit !== 13) {
      line += 1;
      lineStart = offset + 1;
      lineEnd = findLineEnd(source.text, offset + 1);
    }
  }
  return { found, matchedRuleIndexes };
}

/**
 * 한 줄의 끝을 LF, CRLF와 단독 CR을 같은 줄바꿈으로 보아 찾는다.
 *
 * @param {string} text source 원문
 * @param {number} start 줄의 첫 UTF-16 offset
 * @returns {number} 줄바꿈 문자 또는 문자열 끝의 exclusive offset
 */
function findLineEnd(text, start) {
  for (let offset = start; offset < text.length; offset += 1) {
    const unit = text.charCodeAt(offset);
    if (unit === 10 || unit === 13) {
      return offset;
    }
  }
  return text.length;
}

/**
 * UTF-16 code unit이 surrogate pair의 앞쪽인지 확인한다.
 *
 * @param {number} unit 검사할 UTF-16 code unit
 * @returns {boolean} high surrogate 범위에 있으면 true
 */
function isHighSurrogate(unit) {
  return unit >= 0xd800 && unit <= 0xdbff;
}

/**
 * UTF-16 code unit이 surrogate pair의 뒤쪽인지 확인한다.
 *
 * @param {number} unit 검사할 UTF-16 code unit
 * @returns {boolean} low surrogate 범위에 있으면 true
 */
function isLowSurrogate(unit) {
  return unit >= 0xdc00 && unit <= 0xdfff;
}

/**
 * 일치 표현을 보존하면서 해당 줄에서 최대 480 UTF-16 code unit만 잘라낸다.
 *
 * @param {string} text source 원문
 * @param {number} lineStart 줄 시작 offset
 * @param {number} lineEnd 줄 끝 offset
 * @param {number} matchStart 일치 시작 offset
 * @param {number} matchLength 일치 표현 길이
 * @returns {string} AI가 문맥 판정에 사용할 제한된 원문 일부
 */
function makeQuote(text, lineStart, lineEnd, matchStart, matchLength) {
  if (lineEnd - lineStart <= MAX_QUOTE_UTF16) {
    return text.slice(lineStart, lineEnd);
  }
  const remaining = MAX_QUOTE_UTF16 - matchLength;
  const preferredStart = matchStart - Math.floor(remaining / 2);
  let start = Math.max(lineStart, Math.min(preferredStart, lineEnd - MAX_QUOTE_UTF16));
  let end = start + MAX_QUOTE_UTF16;
  if (isLowSurrogate(text.charCodeAt(start)) && isHighSurrogate(text.charCodeAt(start - 1))) {
    start += 1;
  }
  if (isHighSurrogate(text.charCodeAt(end - 1)) && isLowSurrogate(text.charCodeAt(end))) {
    end -= 1;
  }
  return text.slice(start, end);
}

/**
 * 상세 경고 수를 줄여도 전체 규칙, source와 정확한 집계를 유지하는 공개 결과를 만든다.
 *
 * @param {ScanResult} scan 탐색이 끝난 내부 결과
 * @param {number} shownWarnings 출력에 포함할 결정적 경고 앞부분 길이
 * @returns {{
 *   catalog: ReadonlyArray<{id: string, expressions: ReadonlyArray<string>}>,
 *   rules: ReadonlyArray<Rule>,
 *   sources: ReadonlyArray<{id: string, path?: string}>,
 *   warnings: ReadonlyArray<Warning>,
 *   summary: {total: number, shown: number, omitted: number}
 * }} 표준 출력으로 직렬화할 결과
 */
function createPublicResult(scan, shownWarnings) {
  const selectedWarnings = scan.warnings.slice(0, shownWarnings);
  return {
    catalog: rules.map((rule) => ({ id: rule.id, expressions: rule.expressions })),
    rules: rules.filter((rule, index) => scan.matchedRules[index]),
    sources: scan.sources,
    warnings: selectedWarnings,
    summary: {
      total: scan.total,
      shown: selectedWarnings.length,
      omitted: scan.total - selectedWarnings.length,
    },
  };
}

/**
 * JSON의 고정 부분과 경고별 byte를 한 번씩 계산해 상한 안의 가장 긴 앞부분을 반환한다.
 *
 * @param {ScanResult} scan 모든 source와 규칙을 끝까지 검사한 결과
 * @param {number} maxBytes 직렬화한 JSON에 허용할 최대 UTF-8 byte
 * @returns {string} byte 상한을 지키는 JSON 객체 문자열
 */
function serializeBoundedResult(scan, maxBytes) {
  const base = createPublicResult(scan, 0);
  const head = `{"catalog":${JSON.stringify(base.catalog)},"rules":${JSON.stringify(base.rules)},"sources":${JSON.stringify(base.sources)},"warnings":[`;
  /** @type {Array<string>} */
  const serializedWarnings = [];
  let warningBytes = 0;

  /**
   * @param {number} shown 출력할 상세 경고 수
   * @returns {string} 전체 집계와 생략 수를 담은 JSON 뒷부분
   */
  const makeTail = (shown) =>
    `],"summary":${JSON.stringify({
      total: scan.total,
      shown,
      omitted: scan.total - shown,
    })}}`;
  let tail = makeTail(0);
  const headBytes = Buffer.byteLength(head, "utf8");
  if (headBytes + Buffer.byteLength(tail, "utf8") > maxBytes) {
    throw scannerError("output:too-large");
  }

  for (const warning of scan.warnings) {
    const serialized = JSON.stringify(warning);
    const separatorBytes = serializedWarnings.length === 0 ? 0 : 1;
    const nextWarningBytes = warningBytes + separatorBytes + Buffer.byteLength(serialized, "utf8");
    const nextTail = makeTail(serializedWarnings.length + 1);
    if (headBytes + nextWarningBytes + Buffer.byteLength(nextTail, "utf8") > maxBytes) {
      break;
    }
    serializedWarnings.push(serialized);
    warningBytes = nextWarningBytes;
    tail = nextTail;
  }

  let serializedResult = head + serializedWarnings.join(",") + tail;
  while (Buffer.from(serializedResult, "utf8").byteLength > maxBytes) {
    serializedWarnings.pop();
    tail = makeTail(serializedWarnings.length);
    serializedResult = head + serializedWarnings.join(",") + tail;
  }
  return serializedResult;
}

/**
 * UTF-8 byte chunk를 source별 decoder로 해석하면서 파일 및 실행 전체 상한을 넘기 전에 중단한다.
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
      const buffer = typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
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
    if (result === null || seen.has(result.realPath)) {
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

  return [...paths].sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
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
 * 운영 parser와 탐색 함수를 직접 호출하고 process 종료 및 JSDoc 금지 타입을 함께 검사한다.
 *
 * @returns {Promise<void>} 모든 assertion이 통과하면 끝나는 Promise
 */
async function runSelfTest() {
  validateRules(rules);
  assert.equal(rules.length, 46);
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
  assert.throws(() => parseCommandLine([]), /usage:invalid-input-mode/u);
  const modeArguments = [
    ["--changed", "."],
    ["--file", "a"],
    ["--stdin"],
    ["--self-test"],
  ];
  for (let modeMask = 0; modeMask < 2 ** modeArguments.length; modeMask += 1) {
    for (const includeSourceName of [false, true]) {
      const args = modeArguments.flatMap((modeArgs, index) =>
        (modeMask & (1 << index)) === 0 ? [] : modeArgs,
      );
      if (includeSourceName) {
        args.push("--source-name", "sample");
      }
      const selectedCount = modeArguments.reduce(
        (count, _modeArgs, index) => count + Number((modeMask & (1 << index)) !== 0),
        0,
      );
      const stdinSelected = (modeMask & (1 << 2)) !== 0;
      const isValid = selectedCount === 1 && stdinSelected === includeSourceName;
      if (isValid) {
        assert.doesNotThrow(() => parseCommandLine(args));
      } else {
        assert.throws(() => parseCommandLine(args), /usage:/u);
      }
    }
  }
  for (const args of [
    ["--stdin", "--stdin", "--source-name", "sample"],
    ["--changed", ".", "--changed", "."],
    ["--stdin", "--source-name", "sample", "--source-name", "sample"],
    ["--self-test", "--self-test"],
  ]) {
    assert.throws(() => parseCommandLine(args), /usage:option-repeated/u);
  }
  for (const args of [
    ["--changed", ".", "--file", "a"],
    ["--changed", ".", "--stdin", "--source-name", "sample"],
    ["--file", "a", "--stdin", "--source-name", "sample"],
    ["--file", "a", "--self-test"],
    ["--stdin"],
    ["--source-name", "sample", "--self-test"],
  ]) {
    assert.throws(() => parseCommandLine(args), /usage:/u);
  }
  for (const args of [
    ["--changed", ""],
    ["--file", ""],
    ["--stdin", "--source-name", ""],
    ["--changed", "\ud800"],
    ["--file", "\udc00"],
    ["--stdin", "--source-name", "\ud800"],
  ]) {
    assert.throws(() => parseCommandLine(args), /usage:invalid-input-name/u);
  }
  const maximumFileArgs = Array.from(
    { length: MAX_SOURCES },
    (_, index) => ["--file", `file-${index}`],
  ).flat();
  assert.equal(parseCommandLine(maximumFileArgs).kind, "files");
  assert.throws(
    () => parseCommandLine([...maximumFileArgs, "--file", "too-many"]),
    /usage:too-many-sources/u,
  );

  /** @type {Rule} */
  const overlapRule = {
    id: "ko.overlap-test",
    expressions: ["가가"],
    message: "겹치는 탐색 검사",
    queries: ["두 위치를 모두 찾았습니까?"],
    negatives: ["가가가"],
    positives: ["가 나 가"],
  };
  const overlap = scanProvidedSources(
    [{ id: "overlap", text: "가가가", bytes: Buffer.byteLength("가가가") }],
    [overlapRule],
    MAX_WARNINGS,
  );
  assert.equal(overlap.total, 2);
  assert.equal(overlap.warnings.length, 2);
  const sameOffset = scanProvidedSources(
    [{ id: "same-offset", text: "가", bytes: Buffer.byteLength("가") }],
    [
      { ...overlapRule, id: "ko.same-offset-first", expressions: ["가"] },
      { ...overlapRule, id: "ko.same-offset-second", expressions: ["가"] },
    ],
    MAX_WARNINGS,
  );
  assert.deepEqual(sameOffset.warnings.map((warning) => warning.ruleId), [
    "ko.same-offset-first",
    "ko.same-offset-second",
  ]);

  const baseRule = rules[0];
  for (const invalidRule of [
    { ...baseRule, id: "invalid" },
    { ...baseRule, message: "" },
    { ...baseRule, message: "\ud800" },
    { ...baseRule, expressions: [] },
    { ...baseRule, expressions: ["중복", "중복"] },
    { ...baseRule, expressions: ["\ud800"] },
    { ...baseRule, expressions: ["여러\r줄"] },
    { ...baseRule, expressions: ["여러\n줄"] },
    { ...baseRule, queries: [] },
    { ...baseRule, queries: ["\ud800"] },
    { ...baseRule, negatives: [] },
    { ...baseRule, negatives: ["\ud800"] },
    { ...baseRule, positives: [] },
    { ...baseRule, positives: ["\ud800"] },
  ]) {
    assert.throws(() => validateRules([invalidRule]), /rules:/u);
  }
  assert.throws(() => validateRules([baseRule, baseRule]), /rules:invalid-id/u);

  const positionText = "😀경계\r\n앞 경계\r뒤 경계\n";
  const positions = scanProvidedSources(
    [{ id: "positions", text: positionText, bytes: Buffer.byteLength(positionText) }],
    [rules.find((rule) => rule.id === "ko.boundary") ?? rules[0]],
    MAX_WARNINGS,
  );
  assert.deepEqual(
    positions.warnings.map((warning) => [warning.line, warning.startUtf16, warning.endUtf16]),
    [
      [1, 3, 5],
      [2, 3, 5],
      [3, 3, 5],
    ],
  );

  const sameLineSeparators = "a\t경계\u2028b경계\u2029c경계";
  const sameLinePositions = scanProvidedSources(
    [
      {
        id: "same-line-separators",
        text: sameLineSeparators,
        bytes: Buffer.byteLength(sameLineSeparators),
      },
    ],
    [rules.find((rule) => rule.id === "ko.boundary") ?? rules[0]],
    MAX_WARNINGS,
  );
  assert.deepEqual(
    sameLinePositions.warnings.map((warning) => [
      warning.line,
      warning.startUtf16,
      warning.endUtf16,
    ]),
    [[1, 3, 5], [1, 7, 9], [1, 11, 13]],
  );

  const empty = scanProvidedSources([{ id: "empty", text: "", bytes: 0 }], rules, MAX_WARNINGS);
  const emptyPublic = createPublicResult(empty, 0);
  assert.equal(emptyPublic.catalog.length, rules.length);
  assert.equal(emptyPublic.sources.length, 1);
  assert.deepEqual(emptyPublic.summary, { total: 0, shown: 0, omitted: 0 });

  const limited = scanProvidedSources(
    [{ id: "limited", text: "경계 경계 경계", bytes: Buffer.byteLength("경계 경계 경계") }],
    rules,
    1,
  );
  const limitedPublic = createPublicResult(limited, limited.warnings.length);
  assert.deepEqual(limitedPublic.summary, { total: 3, shown: 1, omitted: 2 });
  assert.equal(limitedPublic.rules.some((rule) => rule.id === "ko.boundary"), true);
  assert.doesNotThrow(() => JSON.parse(serializeBoundedResult(limited, MAX_JSON_BYTES)));
  assert.throws(() => serializeBoundedResult(limited, 1), /output:too-large/u);
  assert.throws(() => serializeBoundedResult({ ...limited, total: 1n }, MAX_JSON_BYTES), TypeError);
  const cyclicWarning = { ...limited.warnings[0] };
  cyclicWarning.quote = cyclicWarning;
  assert.throws(
    () => serializeBoundedResult({ ...limited, warnings: [cyclicWarning] }, MAX_JSON_BYTES),
    TypeError,
  );

  const longLine = `${"가".repeat(500)}경계${"나".repeat(500)}`;
  const quoted = scanProvidedSources(
    [{ id: "quote", text: longLine, bytes: Buffer.byteLength(longLine) }],
    [rules.find((rule) => rule.id === "ko.boundary") ?? rules[0]],
    MAX_WARNINGS,
  );
  assert.equal(quoted.warnings[0].quote.length, MAX_QUOTE_UTF16);
  assert.equal(quoted.warnings[0].quote.includes("경계"), true);

  /** @type {Rule} */
  const maximumExpressionRule = {
    ...overlapRule,
    id: "ko.maximum-expression-test",
    expressions: ["가".repeat(MAX_QUOTE_UTF16)],
  };
  const maximumExpression = scanProvidedSources(
    [
      {
        id: "maximum-expression",
        text: maximumExpressionRule.expressions[0],
        bytes: Buffer.byteLength(maximumExpressionRule.expressions[0]),
      },
    ],
    [maximumExpressionRule],
    MAX_WARNINGS,
  );
  assert.equal(maximumExpression.warnings[0].quote.length, MAX_QUOTE_UTF16);
  assert.throws(
    () => validateTextList(["가".repeat(MAX_QUOTE_UTF16 + 1)], "rules:invalid-expression", true),
    /rules:invalid-expression/u,
  );

  for (const surrogateBoundaryText of [
    `😀${"가".repeat(238)}경계${"나".repeat(500)}`,
    `${"가".repeat(500)}경계${"나".repeat(238)}😀${"다".repeat(500)}`,
  ]) {
    const surrogateBoundary = scanProvidedSources(
      [
        {
          id: "surrogate-boundary",
          text: surrogateBoundaryText,
          bytes: Buffer.byteLength(surrogateBoundaryText),
        },
      ],
      [rules.find((rule) => rule.id === "ko.boundary") ?? rules[0]],
      MAX_WARNINGS,
    );
    assert.equal(surrogateBoundary.warnings[0].quote.isWellFormed(), true);
    assert.equal(surrogateBoundary.warnings[0].quote.includes("경계"), true);
    assert.equal(surrogateBoundary.warnings[0].quote.length <= MAX_QUOTE_UTF16, true);
  }

  const allExpressions = rules.flatMap((rule) => rule.expressions).join("\n");
  const allRules = scanProvidedSources(
    [{ id: "all-rules", text: allExpressions, bytes: Buffer.byteLength(allExpressions) }],
    rules,
    MAX_WARNINGS,
  );
  assert.equal(allRules.matchedRules.every((matched) => matched), true);
  assert.equal(createPublicResult(allRules, allRules.warnings.length).catalog.length, rules.length);
  assert.throws(
    () => validateTextList(["여러\n줄"], "rules:invalid-expression", true),
    /rules:invalid-expression/u,
  );

  const expectedGitStatuses = [
    " M", " T", " A", " D", "M ", "MM", "MT", "MD", "T ", "TM", "TT", "TD", "A ",
    "AM", "AT", "AD", "D ", "DD", "AU", "UD", "UA", "DU", "AA", "UU", "??",
  ];
  assert.deepEqual([...SUPPORTED_GIT_STATUSES], expectedGitStatuses);
  const everyStatus = Buffer.from(
    expectedGitStatuses.map((status, index) => `${status} file-${index}.md\0`).join(""),
  );
  assert.equal(parseGitStatus(everyStatus).length, expectedGitStatuses.length);
  assert.deepEqual(parseGitStatus(Buffer.from(" M z.md\0?? 가.md\0 M a.md\0")), [
    "a.md", "z.md", "가.md",
  ]);
  const normalizationStatus = Buffer.from("?? é.md\0?? é.md\0");
  const originalNormalizationStatus = Buffer.from(normalizationStatus);
  assert.deepEqual(parseGitStatus(normalizationStatus), ["é.md", "é.md"]);
  assert.deepEqual(normalizationStatus, originalNormalizationStatus);
  const specialGitPath = "\uFEFF space\tline\n가.md";
  assert.deepEqual(parseGitStatus(Buffer.from(`?? ${specialGitPath}\0`)), [specialGitPath]);
  assert.deepEqual(parseGitStatus(Buffer.alloc(0)), []);
  for (const status of [" U", "U ", "MU", "UT", "MA", "DM", "DT", "R ", "C "]) {
    assert.throws(
      () => parseGitStatus(Buffer.from(`${status} rejected.md\0`)),
      /git:invalid-status/u,
    );
  }
  assert.throws(() => parseGitStatus(Buffer.from("?? missing-nul.md")), /git:invalid-status/u);
  assert.throws(
    () => parseGitStatus(Buffer.from([0x3f, 0x3f, 0x20, 0xc3, 0x28, 0x00])),
    /git:invalid-status/u,
  );

  assert.throws(
    () =>
      scanProvidedSources(
        Array.from({ length: 17 }, (_, index) => ({
          id: `total-limit-${index}`,
          text: "",
          bytes: MAX_SOURCE_BYTES,
        })),
        rules,
        0,
      ),
    /input:total-too-large/u,
  );
  const totalLimitSources = Array.from({ length: MAX_TOTAL_BYTES / MAX_SOURCE_BYTES }, (_, index) => ({
    id: `total-limit-exact-${index}`,
    text: "",
    bytes: MAX_SOURCE_BYTES,
  }));
  const totalBeforeLimit = totalLimitSources.map((source, index) =>
    index === totalLimitSources.length - 1 ? { ...source, bytes: source.bytes - 1 } : source,
  );
  assert.equal(scanProvidedSources(totalBeforeLimit, rules, 0).sources.length, 16);
  assert.equal(scanProvidedSources(totalLimitSources, rules, 0).sources.length, 16);
  assert.throws(
    () =>
      scanProvidedSources(
        [...totalLimitSources, { id: "total-limit-after", text: "", bytes: 1 }],
        rules,
        0,
      ),
    /input:total-too-large/u,
  );

  const maximumSources = Array.from({ length: MAX_SOURCES }, (_, index) => ({
    id: `source-${index}`,
    text: "",
    bytes: 0,
  }));
  assert.equal(scanProvidedSources(maximumSources, rules, 0).sources.length, MAX_SOURCES);
  assert.throws(
    () =>
      scanProvidedSources(
        [...maximumSources, { id: "too-many", text: "", bytes: 0 }],
        rules,
        0,
      ),
    /input:too-many-sources/u,
  );

  const deterministicSources = [
    { id: "second", text: "경계", bytes: Buffer.byteLength("경계") },
    { id: "first", text: "공개", bytes: Buffer.byteLength("공개") },
  ];
  const originalDeterministicSources = deterministicSources.map((source) => ({ ...source }));
  const firstDeterministicScan = scanProvidedSources(deterministicSources, rules, MAX_WARNINGS);
  const firstDeterministicResult = serializeBoundedResult(firstDeterministicScan, MAX_JSON_BYTES);
  const differentDeterministicResult = serializeBoundedResult(
    scanProvidedSources(
      [{ id: "different", text: "계약", bytes: Buffer.byteLength("계약") }],
      rules,
      MAX_WARNINGS,
    ),
    MAX_JSON_BYTES,
  );
  const secondDeterministicScan = scanProvidedSources(deterministicSources, rules, MAX_WARNINGS);
  const secondDeterministicResult = serializeBoundedResult(secondDeterministicScan, MAX_JSON_BYTES);
  assert.equal(firstDeterministicResult, secondDeterministicResult);
  assert.notEqual(firstDeterministicResult, differentDeterministicResult);
  assert.notStrictEqual(firstDeterministicScan.warnings, secondDeterministicScan.warnings);
  assert.notStrictEqual(firstDeterministicScan.matchedRules, secondDeterministicScan.matchedRules);
  assert.notStrictEqual(firstDeterministicScan.sources, secondDeterministicScan.sources);
  assert.deepEqual(deterministicSources, originalDeterministicSources);

  assert.deepEqual(
    sanitizeEnvironment(
      {
        PATH: "/usr/bin",
        GIT_DIR: "hidden",
        git_work_tree: "hidden",
        LANG: "ko_KR.UTF-8",
        LC_ALL: "ko_KR.UTF-8",
        KEEP: "value",
      },
      "darwin",
    ),
    { PATH: "/usr/bin", KEEP: "value", LC_ALL: "C", LANG: "C" },
  );
  assert.deepEqual(sanitizeEnvironment({ Path: "C:\\Git", PATH: "C:\\Git" }, "win32"), {
    PATH: "C:\\Git",
    LC_ALL: "C",
    LANG: "C",
  });
  assert.throws(
    () => sanitizeEnvironment({ Path: "C:\\one", PATH: "C:\\two" }, "win32"),
    /git:ambiguous-path/u,
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
  await assert.rejects(
    () =>
      runChildFile(process.execPath, ["-e", "setInterval(() => {}, 1_000)"], {
        cwd: process.cwd(),
        env: {},
        timeout: 10,
        maxBuffer: SELF_TEST_OUTPUT_BYTES,
      }),
    /git:command-failed/u,
  );
  await assert.rejects(
    () =>
      runChildFile(process.execPath, ["-e", "process.stdout.write('x'.repeat(100))"], {
        cwd: process.cwd(),
        env: {},
        timeout: SELF_TEST_TIMEOUT_MS,
        maxBuffer: 10,
      }),
    /git:command-failed/u,
  );
  await assert.rejects(
    () =>
      runChildFile(process.execPath, ["-e", "process.stderr.write('x'.repeat(100))"], {
        cwd: process.cwd(),
        env: {},
        timeout: SELF_TEST_TIMEOUT_MS,
        maxBuffer: 10,
      }),
    /git:command-failed/u,
  );

  /**
   * @param {ReadonlyArray<Uint8Array>} chunks 순서대로 내보낼 입력 byte chunk
   * @returns {AsyncGenerator<Uint8Array, void, void>} decodeChunks에 전달할 chunk stream
   */
  async function* chunkSequence(chunks) {
    for (const chunk of chunks) {
      yield chunk;
    }
  }
  await assert.rejects(
    () => decodeChunks(chunkSequence([Uint8Array.from([0xc3, 0x28])]), 0),
    /input:invalid-utf8/u,
  );
  await assert.rejects(
    () => decodeChunks(chunkSequence([Uint8Array.from([0xc3])]), 0),
    /input:invalid-utf8/u,
  );
  await assert.rejects(
    () => decodeChunks(chunkSequence([Uint8Array.from([0xa9])]), 0),
    /input:invalid-utf8/u,
  );

  const splitUtf8 = Buffer.from("\uFEFF경계\uFEFF", "utf8");
  const decodedSplitUtf8 = await decodeChunks(
    chunkSequence([splitUtf8.subarray(0, 4), splitUtf8.subarray(4, 7), splitUtf8.subarray(7)]),
    0,
  );
  assert.deepEqual(decodedSplitUtf8, { text: "경계\uFEFF", bytes: splitUtf8.byteLength });
  assert.deepEqual(
    await decodeChunks(chunkSequence([Buffer.from("\uFEFF", "utf8")]), 0),
    { text: "", bytes: 3 },
  );
  await assert.rejects(
    () => decodeChunks(chunkSequence([Uint8Array.from([0])]), 0),
    /input:nul-byte/u,
  );
  assert.equal(
    (await decodeChunks(chunkSequence([Buffer.alloc(MAX_SOURCE_BYTES, 0x61)]), 0)).bytes,
    MAX_SOURCE_BYTES,
  );
  await assert.rejects(
    () => decodeChunks(chunkSequence([Buffer.alloc(MAX_SOURCE_BYTES + 1, 0x61)]), 0),
    /input:source-too-large/u,
  );
  assert.deepEqual(await decodeChunks(chunkSequence([]), MAX_TOTAL_BYTES), { text: "", bytes: 0 });
  assert.deepEqual(
    await decodeChunks(chunkSequence([Uint8Array.from([0x61])]), MAX_TOTAL_BYTES - 2),
    { text: "a", bytes: 1 },
  );
  assert.deepEqual(
    await decodeChunks(chunkSequence([Uint8Array.from([0x61])]), MAX_TOTAL_BYTES - 1),
    { text: "a", bytes: 1 },
  );
  await assert.rejects(
    () => decodeChunks(chunkSequence([Uint8Array.from([0x61])]), MAX_TOTAL_BYTES),
    /input:total-too-large/u,
  );
  await assert.rejects(
    () =>
      decodeChunks(
        chunkSequence([Buffer.alloc(MAX_SOURCE_BYTES + 1, 0x61)]),
        MAX_TOTAL_BYTES,
      ),
    /input:source-too-large/u,
  );

  const scriptPath = fileURLToPath(import.meta.url);
  const scriptText = await readFile(scriptPath, "utf8");
  const forbiddenJSDocType = /\{[^}]*\b(?:object|any)\b[^}]*\}/u;
  const jsdocBlocks = scriptText.match(/\/\*\*[\s\S]*?\*\//gu) ?? [];
  for (const jsdocBlock of jsdocBlocks) {
    assert.doesNotMatch(jsdocBlock, forbiddenJSDocType);
  }
  assert.match("/** @param {\nobject\n} value */", forbiddenJSDocType);
  assert.match("/** @returns {Array<\nany\n>} */", forbiddenJSDocType);

  await assert.rejects(
    () => provideFileSources([scriptPath, scriptPath]),
    /usage:duplicate-file/u,
  );
  if (process.platform !== "win32") {
    await assert.rejects(() => provideFileSources(["/dev/null"]), /input:regular-file-required/u);
  }

  const fileChild = spawnSync(process.execPath, [scriptPath, "--file", scriptPath], {
    encoding: "utf8",
    timeout: SELF_TEST_TIMEOUT_MS,
    maxBuffer: SELF_TEST_OUTPUT_BYTES,
    windowsHide: true,
  });
  const stdinChild = spawnSync(
    process.execPath,
    [scriptPath, "--stdin", "--source-name", "self-test-source"],
    {
      input: scriptText,
      encoding: "utf8",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: SELF_TEST_OUTPUT_BYTES,
      windowsHide: true,
    },
  );
  for (const successfulChild of [fileChild, stdinChild]) {
    assert.equal(successfulChild.error, undefined);
    assert.equal(successfulChild.signal, null);
    assert.equal(successfulChild.status, 0);
    assert.equal(successfulChild.stderr, "");
  }
  const fileOutput = JSON.parse(fileChild.stdout);
  const stdinOutput = JSON.parse(stdinChild.stdout);
  assert.deepEqual(fileOutput.catalog, stdinOutput.catalog);
  assert.deepEqual(fileOutput.rules, stdinOutput.rules);
  assert.deepEqual(fileOutput.summary, stdinOutput.summary);
  assert.deepEqual(
    fileOutput.warnings.map((warning) => ({ ...warning, sourceId: "" })),
    stdinOutput.warnings.map((warning) => ({ ...warning, sourceId: "" })),
  );

  const child = spawnSync(process.execPath, [scriptPath, "--invalid-self-test-argument"], {
    encoding: "utf8",
    timeout: SELF_TEST_TIMEOUT_MS,
    maxBuffer: SELF_TEST_OUTPUT_BYTES,
    windowsHide: true,
  });
  assert.equal(child.error, undefined);
  assert.equal(child.signal, null);
  assert.equal(child.status, 2);
  assert.equal(child.stdout, "");
  assert.equal(child.stderr, "usage:invalid-arguments\n");

  for (const [args, input, expectedError] of [
    [["--stdin", "--source-name", "invalid-utf8"], Buffer.from([0xc3, 0x28]), "input:invalid-utf8\n"],
    [["--stdin", "--source-name", "nul"], Buffer.from([0]), "input:nul-byte\n"],
    [
      ["--stdin", "--source-name", "too-large"],
      Buffer.alloc(MAX_SOURCE_BYTES + 1, 0x61),
      "input:source-too-large\n",
    ],
    [["--file", "missing-self-test-file"], Buffer.alloc(0), "input:file-unavailable\n"],
    [["--changed", scriptPath], Buffer.alloc(0), "git:repository-required\n"],
  ]) {
    const failedChild = spawnSync(process.execPath, [scriptPath, ...args], {
      input,
      encoding: "buffer",
      timeout: SELF_TEST_TIMEOUT_MS,
      maxBuffer: SELF_TEST_OUTPUT_BYTES,
      windowsHide: true,
    });
    assert.equal(failedChild.error, undefined);
    assert.equal(failedChild.signal, null);
    assert.equal(failedChild.status, 2);
    assert.equal(failedChild.stdout.byteLength, 0);
    assert.equal(failedChild.stderr.toString("utf8"), expectedError);
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
}

/**
 * 선택한 입력 어댑터를 같은 탐색 본체에 연결하고 정상 JSON 하나를 stdout에 기록한다.
 *
 * @param {ReadonlyArray<string>} args Node.js 실행 파일과 스크립트 위치를 제외한 인수
 * @returns {Promise<void>} self-test 또는 JSON 기록이 끝나면 완료되는 Promise
 */
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
  const json = serializeBoundedResult(scan, MAX_JSON_BYTES);
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
