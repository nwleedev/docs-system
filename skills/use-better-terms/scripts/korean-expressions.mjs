/**
 * @typedef {{
 *   id: string,
 *   kind: "literal",
 *   expressions: ReadonlyArray<string>,
 *   message: string,
 *   queries: ReadonlyArray<string>,
 *   negatives: ReadonlyArray<string>,
 *   positives: ReadonlyArray<string>
 * }} ExpressionRule
 */

/**
 * @typedef {{lemma: string, pos: "adjective" | "verb", aux?: "active" | "passive" | "state"}} Term
 */

/**
 * @typedef {ExpressionRule & {
 *   mode: "literal" | "lemma" | "phrase",
 *   terms?: ReadonlyArray<Term>,
 *   prefix?: string
 * }} InternalRule
 */

/**
 * @typedef {{id: string, text: string}} Source
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
 * }} ExpressionWarning
 */

/** @typedef {{rule: number, order: number, surface: string, expression: string}} ExpressionDescriptor */

/**
 * @typedef {{
 *   rule: number,
 *   order: number,
 *   expression: string,
 *   start: number,
 *   end: number
 * }} ExpressionMatch
 */

/**
 * @typedef {{
 *   nfdText: string,
 *   originalStarts: ReadonlyArray<number>,
 *   nfdStarts: ReadonlyArray<number>
 * }} NfdMapping
 */

/** @typedef {{rule: number, order: number, expression: string, length: number, prefix: string}} TermDescriptor */
/** @typedef {{order: number, surface: string, expression: string}} LabelDescriptor */

/** @type {number} */
const MAX_WARNINGS = 20_000;
/** @type {number} */
const MAX_QUOTE_UTF16 = 480;

/**
 * 검사할 표현 후보와 AI가 각 문맥을 판정할 때 사용할 질문 및 대조 사례다.
 *
 * @type {ReadonlyArray<InternalRule>}
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
    mode: "phrase",
    prefix: "회의를 ",
    terms: [{ lemma: "가지다", pos: "verb" }],
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
    id: "ko.small",
    expressions: ["작은"],
    message: "실제 크기인지 다른 수량이나 영향의 정도를 대신하는지 확인합니다.",
    queries: [
      "측정할 수 있는 실제 크기를 뜻합니까?",
      "파일 수, 변경량 또는 영향처럼 다른 수량을 더 정확히 쓸 수 있습니까?",
    ],
    negatives: ["작은 변경을 먼저 처리합니다."],
    positives: ["이 부품은 가로 5 mm인 작은 부품입니다."],
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
    message: "파일 위치, 네트워크 구간 또는 그래프 탐색 순서를 가리키는지, 더 정확한 대상 이름으로 바꿀 수 있는지 확인합니다.",
    queries: [
      "위치나 이동 구간을 식별할 수 있습니까?",
      "URL, 파일 위치, import 관계나 실행 흐름처럼 더 정확한 이름을 쓸 수 있습니까?",
      "방법이나 절차를 대신하는 표현입니까?",
    ],
    negatives: [
      "시험 환경 접근 경로를 정리합니다.",
      "릴리스 전달 경로는 `https://packages.example.invalid/app`입니다.",
    ],
    positives: ["설정 파일 경로는 `config/app.yml`입니다."],
  },
  {
    id: "ko.flow",
    expressions: ["흐름"],
    message: "이동하는 대상을 뜻하는지 작업 단계, 실행 순서 또는 상태 변화를 대신하는지 확인합니다.",
    queries: [
      "물처럼 실제로 이동하는 대상이 문장에 있습니까?",
      "작업 단계, 실행 순서 또는 상태 변화를 직접 설명할 수 있습니까?",
    ],
    negatives: ["업무 흐름을 개선합니다."],
    positives: ["하천의 물 흐름을 유량계로 측정합니다."],
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
    id: "ko.narrow-state",
    mode: "lemma",
    terms: [{ lemma: "좁다", pos: "adjective", aux: "state" }],
    expressions: ["좁", "좁아", "좁았"],
    message: "실제 폭, 수량 또는 선택할 수 있는 대상이 제한된 상태인지 확인하고 더 정확한 표현을 먼저 찾습니다.",
    queries: [
      "무엇이 어떤 기준과 비교해 제한된 상태입니까?",
      "실제 폭, 대상 수 또는 선택 조건을 직접 설명할 수 있습니까?",
    ],
    negatives: ["변경 범위가 좁습니다."],
    positives: ["변경 파일은 결제 모듈의 두 파일로 제한됩니다."],
  },
  {
    id: "ko.narrow",
    mode: "lemma",
    terms: [{ lemma: "좁히다", pos: "verb" }],
    expressions: ["좁히", "좁혀"],
    message: "줄어드는 대상과 이전 및 이후 기준이 드러나는지 확인합니다.",
    queries: ["무엇을 얼마나 줄이는지 알 수 있습니까?", "검색, 선택 또는 물리적 폭을 실제로 줄입니까?"],
    negatives: ["모듈의 경계를 좁혀 안정성을 높입니다."],
    positives: ["검색 범위를 최근 변경 파일로 좁혀 검사 시간을 줄입니다."],
  },
  {
    id: "ko.close",
    mode: "lemma",
    terms: [
      { lemma: "닫다", pos: "verb" },
      { lemma: "닫히다", pos: "verb" },
    ],
    expressions: ["닫"],
    message: "문짝이나 창처럼 여닫는 대상을 닫는 뜻인지 상태나 절차를 끝낸다는 번역인지 확인합니다.",
    queries: ["여닫을 수 있는 물건이나 화면 요소가 문장에 있습니까?", "완료 처리, 마감 또는 종료 같은 실제 행위를 대신합니까?"],
    negatives: ["작업을 닫힘으로 처리합니다."],
    positives: ["더 이상 사용하지 않는 탭을 닫습니다."],
  },
  {
    id: "ko.fix-in-place",
    mode: "lemma",
    terms: [
      { lemma: "박다", pos: "verb", aux: "active" },
      { lemma: "박히다", pos: "verb", aux: "passive" },
    ],
    expressions: ["박다", "박아", "박은", "박힌", "박혀", "박", "박았", "박히", "박혔"],
    message: "대상을 넣거나 고정한 행동인지, 대상이 한곳에 남아 굳어진 상태인지 확인하고 각 상황을 더 정확히 설명하는 표현을 먼저 찾습니다.",
    queries: [
      "누가 무엇을 어디에 넣거나 고정했습니까?",
      "무엇이 어디에 남아 있거나 굳어진 상태입니까?",
      "비유라면 설정하거나 기록한 내용 또는 바꾸기 어려운 이유를 직접 설명할 수 있습니까?",
    ],
    negatives: ["지원 버전을 코드에 박아 둡니다.", "규칙이 코드에 박혀 있습니다."],
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
    mode: "lemma",
    terms: [{ lemma: "다루다", pos: "verb" }],
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
  {
    id: "ko.work",
    expressions: ["업무"],
    message: "맡은 일이나 처리 대상을 가리키는지, 여러 행동을 막연한 이름으로 묶는지 확인합니다.",
    queries: [
      "누가 어떤 일을 맡거나 처리합니까?",
      "검사, 기록, 승인 또는 운영처럼 실제 행동을 쓸 수 있습니까?",
      "조직이나 분야에서 정한 업무 이름이라서 유지해야 합니까?",
    ],
    negatives: ["업무 흐름을 개선합니다."],
    positives: ["이 업무는 승인된 배치 작업의 실행과 결과 기록을 뜻합니다."],
  },
  {
    id: "ko.status",
    expressions: ["지위"],
    message: "권리나 자격을 뜻하는 정확한 용어인지, 대상의 상태나 역할을 대신하는지 확인합니다.",
    queries: [
      "법률상 권리나 자격처럼 분야에서 정한 의미입니까?",
      "대상의 상태, 역할 또는 권한을 더 정확하게 쓸 수 있습니까?",
      "누가 어떤 조건에서 그 지위를 얻거나 바꿉니까?",
    ],
    negatives: ["구성 요소의 지위를 변경합니다."],
    positives: ["법률상 지위는 계약 체결일의 법률에 따라 판단합니다."],
  },
  {
    id: "ko.consumption",
    expressions: ["소비"],
    message: "자원 사용량을 뜻하는 정확한 용어인지, 무엇을 얼마나 사용하는지 빠뜨리는 표현인지 확인합니다.",
    queries: [
      "전력, 메모리 또는 다른 자원 가운데 무엇을 사용합니까?",
      "사용량과 측정 단위를 직접 쓸 수 있습니까?",
      "경제나 기술 분야에서 정한 소비 개념이라서 유지해야 합니까?",
    ],
    negatives: ["리소스 소비를 줄입니다."],
    positives: ["전력 소비량을 시간별로 측정합니다."],
  },
].map((rule) => ({ kind: "literal", mode: "literal", ...rule }));

const FINAL_N = "\u11ab";
const FINAL_L = "\u11af";
const FINAL_M = "\u11b7";
const FINAL_B = "\u11b8";
const FINAL_SS = "\u11bb";

const endings = {
  adjective: {
    consonant: [
      "다",
      "습니다",
      "습니까",
      "고",
      "지",
      "지만",
      "거나",
      "은데",
      "으면",
      "으니",
      "으며",
      "으면서",
      "도록",
      "게",
      "은",
      "을",
      "던",
      "기",
      "음",
      "겠다",
      "겠고",
      "겠지만",
      "겠습니다",
      "겠습니까",
      "으시다",
      "으시고",
      "으시면",
      "으십니다",
      "으십니까",
      "으셨다",
      "으셨습니다",
      "더라",
      "더니",
      "다고",
      "다는",
      "다면",
    ],
    vowel: [
      "다",
      `${FINAL_B}니다`,
      `${FINAL_B}니까`,
      "고",
      "지",
      "지만",
      "거나",
      `${FINAL_N}데`,
      "면",
      "니",
      "며",
      "면서",
      "도록",
      "게",
      FINAL_N,
      FINAL_L,
      "던",
      "기",
      FINAL_M,
      "겠다",
      "겠고",
      "겠지만",
      "겠습니다",
      "겠습니까",
      "시다",
      "시고",
      "시면",
      "십니다",
      "십니까",
      "셨다",
      "셨습니다",
      "더라",
      "더니",
      `${FINAL_N}다고`,
      `${FINAL_N}다는`,
      `${FINAL_N}다면`,
    ],
  },
  verb: {
    consonant: [
      "다",
      "는다",
      "습니다",
      "습니까",
      "고",
      "지",
      "지만",
      "거나",
      "는데",
      "으면",
      "으니",
      "으며",
      "으면서",
      "도록",
      "게",
      "는",
      "은",
      "을",
      "던",
      "기",
      "음",
      "겠다",
      "겠고",
      "겠지만",
      "겠습니다",
      "겠습니까",
      "으시다",
      "으시고",
      "으시면",
      "으십니다",
      "으십니까",
      "으셨다",
      "으셨습니다",
      "더라",
      "더니",
      "는다고",
      "는다는",
      "는다면",
    ],
    vowel: [
      "다",
      `${FINAL_N}다`,
      `${FINAL_B}니다`,
      `${FINAL_B}니까`,
      `${FINAL_B}니다와`,
      "고",
      "지",
      "지만",
      "거나",
      "는데",
      "면",
      "니",
      "며",
      "면서",
      "도록",
      "게",
      FINAL_N,
      FINAL_L,
      "는",
      "던",
      "기",
      FINAL_M,
      `${FINAL_M}으로`,
      "겠다",
      "겠고",
      "겠지만",
      "겠습니다",
      "겠습니까",
      "시다",
      "시고",
      "시면",
      "신다",
      "십니다",
      "십니까",
      "셨다",
      "셨습니다",
      "더라",
      "더니",
      `${FINAL_N}다고`,
      `${FINAL_N}다는`,
      `${FINAL_N}다면`,
    ],
  },
  fused: ["", "요", "서", "도", "야", "야만", "야지"],
  past: [
    "다",
    "어요",
    "습니다",
    "습니까",
    "고",
    "지만",
    "는데",
    "으면",
    "으니",
    "으며",
    "던",
    "다고",
    "다는",
    "다면",
  ],
  afterda: ["", "가", "가도", "가는", "가면", "시피"],
  auxiliary: {
    state: ["지다", "지고", "지면", "지며", "졌다", "졌습니다"],
    active: ["두다", "두고", "두면", "둔다", "놓다", "놓고", "놓으면", "놓는다"],
    passive: ["있다", "있고", "있으면", "있으며", "있습니다", "있는", "있던"],
  },
};

/**
 * 내장 표현 규칙 전체를 순회해 모든 고정 표현과 규칙 활용 출현을 찾는다.
 *
 * @param {ReadonlyArray<Source>} sources 입력 순서가 고정된 원문
 * @returns {{
 *   id: "expressions",
 *   catalog: ReadonlyArray<{id: string, kind: "literal", expressions: ReadonlyArray<string>}>,
 *   rules: ReadonlyArray<ExpressionRule>,
 *   warnings: ReadonlyArray<ExpressionWarning>,
 *   summary: {total: number, shown: number, omitted: number}
 * }} 전체 출현 집계와 제한된 상세 경고
 * @remarks 규칙과 표현은 외부 입력으로 선택하지 않으며 겹치는 출현도 각각 센다.
 */
export function scanExpressions(sources) {
  return scanExpressionRules(sources, rules);
}

/**
 * 자체 검사가 공통 활용 규칙의 자료 추가와 잘못된 자료 거부를 직접 실행한다.
 *
 * @returns {void}
 */
export function selfTestExpressionRules() {
  const definition = {
    kind: "literal",
    mode: "lemma",
    id: "ko.test-adjective",
    terms: [{ lemma: "차다", pos: "adjective" }],
    expressions: ["차"],
    message: "표제어 자료 검사용 규칙입니다.",
    queries: ["활용형을 찾았습니까?"],
    negatives: ["검사 전"],
    positives: ["검사 후"],
  };
  const warning = scanExpressionRules([{ id: "temporary", text: "찹니다." }], [definition])
    .warnings[0];
  if (
    warning?.ruleId !== "ko.test-adjective" ||
    warning.expression !== "차" ||
    warning.startUtf16 !== 1 ||
    warning.endUtf16 !== 2
  ) {
    throw new Error("self-test:expression-rules");
  }

  try {
    scanExpressionRules([], [
      {
        ...definition,
        terms: [{ lemma: "차다", pos: "noun" }],
      },
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === "rules:invalid-expression-rule") {
      return;
    }
  }
  throw new Error("self-test:expression-rules");
}

/**
 * 전달받은 비공개 규칙 자료를 검증하고 모든 표현 출현을 찾는다.
 *
 * @param {ReadonlyArray<Source>} sources 입력 순서가 고정된 원문
 * @param {ReadonlyArray<InternalRule>} definitions 검사할 규칙 자료
 * @returns {ReturnType<typeof scanExpressions>} 전체 출현 집계와 제한된 상세 경고
 */
function scanExpressionRules(sources, definitions) {
  validateRules(definitions);
  const { literal, token } = buildExpressionIndex(definitions);
  const matchedRules = definitions.map(() => false);
  /** @type {Array<ExpressionWarning>} */
  const warnings = [];
  let total = 0;

  for (const source of sources) {
    if (!source.text.isWellFormed()) {
      throw new Error("rules:invalid-source");
    }
    const result = scanSource(source, definitions, literal, token, warnings);
    total += result.found;
    for (const ruleIndex of result.matchedRuleIndexes) {
      matchedRules[ruleIndex] = true;
    }
  }

  return {
    id: "expressions",
    catalog: definitions.map((rule) => ({
      id: rule.id,
      kind: rule.kind,
      expressions: rule.expressions,
    })),
    rules: definitions.filter((rule, index) => matchedRules[index]).map(makePublicRule),
    warnings,
    summary: {
      total,
      shown: warnings.length,
      omitted: total - warnings.length,
    },
  };
}

/**
 * 규칙의 식별자와 판정 자료가 실행 가능한지 확인한다.
 *
 * @param {ReadonlyArray<InternalRule>} definitions 검사할 규칙 자료
 * @returns {void}
 */
function validateRules(definitions) {
  const ids = new Set();
  const lemmas = new Set();
  for (const rule of definitions) {
    if (
      rule.kind !== "literal" ||
      !["literal", "lemma", "phrase"].includes(rule.mode) ||
      !/^ko\.[a-z0-9-]+$/u.test(rule.id) ||
      ids.has(rule.id) ||
      !isNonEmptyText(rule.message) ||
      !hasLowercaseKeys(rule)
    ) {
      throw new Error("rules:invalid-expression-rule");
    }
    ids.add(rule.id);
    validateTextList(rule.expressions, true);
    validateTextList(rule.queries, false);
    validateTextList(rule.negatives, false);
    validateTextList(rule.positives, false);
    validateTerms(rule, lemmas);
  }

  validateEndings(endings);
}

/**
 * 검사 방식에 필요한 표제어와 구문 앞부분을 확인한다.
 *
 * @param {InternalRule} rule 검사할 규칙
 * @param {Set<string>} lemmas 앞선 규칙에서 선언한 표제어
 * @returns {void}
 */
function validateTerms(rule, lemmas) {
  if (rule.mode === "literal") {
    if (rule.terms !== undefined || rule.prefix !== undefined) {
      throw new Error("rules:invalid-expression-rule");
    }
    return;
  }

  if (
    !Array.isArray(rule.terms) ||
    rule.terms.length === 0 ||
    (rule.mode === "phrase" &&
      (!isNonEmptyText(rule.prefix ?? "") ||
        /[\r\n]/u.test(rule.prefix) ||
        !rule.expressions.some((expression) => expression.startsWith(rule.prefix)))) ||
    (rule.mode === "lemma" && rule.prefix !== undefined)
  ) {
    throw new Error("rules:invalid-expression-rule");
  }

  for (const term of rule.terms) {
    const stem = term.lemma.slice(0, -1);
    if (
      !hasLowercaseKeys(term) ||
      !term.lemma.endsWith("다") ||
      stem.length === 0 ||
      ![...stem].every((character) => isMorphologyTokenCodePoint(character.codePointAt(0))) ||
      !["adjective", "verb"].includes(term.pos) ||
      (term.aux !== undefined && !["active", "passive", "state"].includes(term.aux)) ||
      lemmas.has(term.lemma)
    ) {
      throw new Error("rules:invalid-expression-rule");
    }
    lemmas.add(term.lemma);
  }
}

/**
 * 공통 어미 자료의 이름, 배열과 Unicode를 확인한다.
 *
 * @param {object} value 검사할 자료
 * @returns {void}
 */
function validateEndings(value) {
  if (!hasLowercaseKeys(value)) {
    throw new Error("rules:invalid-expression-rule");
  }
  for (const item of Object.values(value)) {
    if (Array.isArray(item)) {
      const unique = new Set();
      if (item.length === 0) {
        throw new Error("rules:invalid-expression-rule");
      }
      for (const ending of item) {
        if (typeof ending !== "string" || !ending.isWellFormed() || unique.has(ending)) {
          throw new Error("rules:invalid-expression-rule");
        }
        unique.add(ending);
      }
    } else if (typeof item === "object" && item !== null) {
      validateEndings(item);
    } else {
      throw new Error("rules:invalid-expression-rule");
    }
  }
}

/**
 * 비공개 자료의 속성명이 영문 소문자로만 이루어졌는지 확인한다.
 *
 * @param {object} value 검사할 객체
 * @returns {boolean} 모든 속성명이 조건을 만족하면 true
 */
function hasLowercaseKeys(value) {
  return Object.keys(value).every((key) => /^[a-z]+$/u.test(key));
}

/**
 * 비공개 검사 자료를 제외하고 기존 공개 규칙 필드만 반환한다.
 *
 * @param {InternalRule} rule 검사 규칙
 * @returns {ExpressionRule} 공개 JSON에 기록할 규칙
 */
function makePublicRule(rule) {
  return {
    kind: rule.kind,
    id: rule.id,
    expressions: rule.expressions,
    message: rule.message,
    queries: rule.queries,
    negatives: rule.negatives,
    positives: rule.positives,
  };
}

/**
 * 규칙 문자열 배열의 공백, 중복, Unicode와 길이를 확인한다.
 *
 * @param {ReadonlyArray<string>} values 검사할 문자열 배열
 * @param {boolean} expression 표현에 quote 길이와 줄바꿈 제한을 적용할지 여부
 * @returns {void}
 */
function validateTextList(values, expression) {
  if (values.length === 0) {
    throw new Error("rules:invalid-expression-rule");
  }
  const unique = new Set();
  for (const value of values) {
    if (
      !isNonEmptyText(value) ||
      unique.has(value) ||
      (expression && (value.length > MAX_QUOTE_UTF16 || /[\r\n]/u.test(value)))
    ) {
      throw new Error("rules:invalid-expression-rule");
    }
    unique.add(value);
  }
}

/**
 * 사람이 읽을 규칙 자료가 공백뿐이거나 잘못된 Unicode인지 확인한다.
 *
 * @param {string} value 검사할 문자열
 * @returns {boolean} 문자가 있고 Unicode가 온전하면 true
 */
function isNonEmptyText(value) {
  return value.trim().length > 0 && value.isWellFormed();
}

/**
 * 고정 표현과 활용형 token을 선언 순서 및 사용자 진단에 연결한다.
 *
 * @param {ReadonlyArray<InternalRule>} definitions 검사할 규칙 자료
 * @returns {{
 *   literal: ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>,
 *   token: ReadonlyMap<string, ReadonlyArray<TermDescriptor>>
 * }} 두 매칭 방식의 후보 색인
 */
function buildExpressionIndex(definitions) {
  /** @type {Map<string, Array<ExpressionDescriptor>>} */
  const literal = new Map();
  /** @type {Map<string, Array<TermDescriptor>>} */
  const token = new Map();
  let order = 0;
  for (const [index, rule] of definitions.entries()) {
    /** @type {Array<LabelDescriptor>} */
    const labels = [];
    for (const expression of rule.expressions) {
      const surface = expression.normalize("NFD");
      labels.push({ order, surface, expression });
      if (rule.mode === "literal") {
        const firstUnit = surface[0];
        const descriptors = literal.get(firstUnit) ?? [];
        descriptors.push({ rule: index, order, surface, expression });
        literal.set(firstUnit, descriptors);
      }
      order += 1;
    }

    for (const term of rule.terms ?? []) {
      const stem = term.lemma.slice(0, -1).normalize("NFD");
      const bare = labels.some((label) => label.surface === stem);
      for (const [surface, length] of buildForms(term, bare)) {
        const descriptor = makeTermDescriptor(rule, index, surface, length, labels);
        addTermDescriptor(token, surface, descriptor);
      }
    }
  }
  return { literal, token };
}

/**
 * 표제어의 규칙 활용을 정규화한 token과 보고할 어간 길이로 만든다.
 *
 * @param {Term} term 표제어, 품사와 보조 용언 종류
 * @param {boolean} bare 선언 표현에 어간 자체가 있는지 여부
 * @returns {ReadonlyMap<string, number>} NFD token과 보고할 NFD 길이
 */
function buildForms(term, bare) {
  const forms = new Map();
  const stem = term.lemma.slice(0, -1).normalize("NFD");
  const shape = hasFinalConsonant(stem) ? "consonant" : "vowel";
  addForms(forms, stem, endings[term.pos][shape]);
  if (bare) {
    forms.set(stem, stem.length);
  }
  addForms(forms, term.lemma.normalize("NFD"), endings.afterda);

  const fused = makeFusedStem(stem);
  if (fused !== null) {
    addForms(forms, fused, endings.fused);
    if (term.aux !== undefined) {
      addForms(forms, fused, endings.auxiliary[term.aux]);
    }
    addForms(forms, addFinalConsonant(fused, FINAL_SS), endings.past);
  }
  return forms;
}

/**
 * 한 활용 표면에 공통 어미를 붙여 중복 없는 token 자료를 추가한다.
 *
 * @param {Map<string, number>} forms 생성한 활용형
 * @param {string} surface NFD 활용 표면
 * @param {ReadonlyArray<string>} values 붙일 어미
 * @returns {void}
 */
function addForms(forms, surface, values) {
  for (const ending of values) {
    const value = `${surface}${ending.normalize("NFD")}`;
    forms.set(value, Math.max(forms.get(value) ?? 0, surface.length));
  }
}

/**
 * 받침 유무와 마지막 모음에 따라 아/어 표면을 만든다.
 *
 * @param {string} stem NFD 어간
 * @returns {string | null} 지원하는 규칙으로 만든 NFD 표면
 */
function makeFusedStem(stem) {
  const vowel = findLastVowel(stem);
  if (vowel === null) {
    return null;
  }
  if (hasFinalConsonant(stem)) {
    const ending = vowel === "\u1161" || vowel === "\u1169" ? "아" : "어";
    return `${stem}${ending.normalize("NFD")}`;
  }
  if (vowel === "\u1175") {
    return `${stem.slice(0, -1)}\u1167`;
  }
  if (vowel === "\u116e") {
    return `${stem.slice(0, -1)}\u116f`;
  }
  return null;
}

/**
 * NFD 어간의 마지막 현대 한글 모음을 찾는다.
 *
 * @param {string} stem NFD 어간
 * @returns {string | null} 마지막 중성 자모
 */
function findLastVowel(stem) {
  for (let index = stem.length - 1; index >= 0; index -= 1) {
    const codePoint = stem.codePointAt(index);
    if (codePoint >= 0x1161 && codePoint <= 0x1175) {
      return stem[index];
    }
  }
  return null;
}

/**
 * NFD 어간이 현대 한글 종성으로 끝나는지 확인한다.
 *
 * @param {string} stem NFD 어간
 * @returns {boolean} 받침이 있으면 true
 */
function hasFinalConsonant(stem) {
  const codePoint = stem.codePointAt(stem.length - 1);
  return codePoint >= 0x11a8 && codePoint <= 0x11c2;
}

/**
 * 모음으로 끝나는 NFD 표면에 종성을 추가한다.
 *
 * @param {string} surface NFD 활용 표면
 * @param {string} consonant 종성 자모
 * @returns {string} 종성을 붙인 NFD 표면
 */
function addFinalConsonant(surface, consonant) {
  return `${surface}${consonant}`;
}

/**
 * 생성된 token에 표시 표현, 선언 순서와 구문 앞부분을 연결한다.
 *
 * @param {InternalRule} rule 검사 규칙
 * @param {number} index 규칙 위치
 * @param {string} surface NFD token
 * @param {number} length 보고할 어간 길이
 * @param {ReadonlyArray<LabelDescriptor>} labels 정규화한 표시 표현과 선언 순서
 * @returns {TermDescriptor} 실행용 후보
 */
function makeTermDescriptor(rule, index, surface, length, labels) {
  let expression = labels[0].expression;
  let order = labels[0].order;
  let matched = 0;
  for (const label of labels) {
    if (surface.startsWith(label.surface) && label.surface.length > matched) {
      expression = label.expression;
      order = label.order;
      matched = label.surface.length;
    }
  }
  return {
    rule: index,
    order,
    expression,
    length: matched === 0 ? length : matched,
    prefix: (rule.prefix ?? "").normalize("NFD"),
  };
}

/**
 * 같은 token과 규칙의 후보는 더 긴 보고 범위 하나만 유지한다.
 *
 * @param {Map<string, Array<TermDescriptor>>} token token 색인
 * @param {string} surface NFD token
 * @param {TermDescriptor} descriptor 추가할 후보
 * @returns {void}
 */
function addTermDescriptor(token, surface, descriptor) {
  const descriptors = token.get(surface) ?? [];
  const current = descriptors.findIndex((candidate) => candidate.rule === descriptor.rule);
  if (current === -1) {
    descriptors.push(descriptor);
  } else if (descriptors[current].length < descriptor.length) {
    descriptors[current] = descriptor;
  }
  token.set(surface, descriptors);
}

/**
 * 한 source의 모든 literal 및 활용형 출현을 원본 UTF-16 위치의 결정적 순서로 모은다.
 *
 * @param {string} text 검사할 원문
 * @param {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} literal 고정 표현 색인
 * @param {ReadonlyMap<string, ReadonlyArray<TermDescriptor>>} token 활용형 token 색인
 * @returns {ReadonlyArray<ExpressionMatch>} 시작 위치와 선언 순서로 정렬한 출현
 */
function collectMatches(text, literal, token) {
  /** @type {Array<ExpressionMatch>} */
  const matches = [];
  const mapping = buildNfdMapping(text);
  for (let offset = 0; offset < mapping.nfdText.length; offset += 1) {
    const descriptors = literal.get(mapping.nfdText[offset]);
    if (descriptors === undefined) {
      continue;
    }
    for (const descriptor of descriptors) {
      if (!mapping.nfdText.startsWith(descriptor.surface, offset)) {
        continue;
      }
      const range = mapOriginalRange(mapping, offset, offset + descriptor.surface.length);
      if (range !== null) {
        matches.push({
          rule: descriptor.rule,
          order: descriptor.order,
          expression: descriptor.expression,
          start: range.start,
          end: range.end,
        });
      }
    }
  }
  collectTermMatches(text, mapping, token, matches);
  return matches.toSorted(
    (left, right) =>
      left.start - right.start ||
      left.order - right.order ||
      left.end - right.end,
  );
}

/**
 * 한국어 token 전체가 검증된 활용으로 해석될 때 표제어의 원본 범위를 모은다.
 *
 * @param {string} text 검사할 원문
 * @param {NfdMapping} mapping 원문과 NFD 위치 대응
 * @param {ReadonlyMap<string, ReadonlyArray<TermDescriptor>>} token 활용형 token 색인
 * @param {Array<ExpressionMatch>} matches 출현을 추가할 배열
 * @returns {void}
 */
function collectTermMatches(text, mapping, token, matches) {
  for (let tokenStart = 0; tokenStart < text.length; ) {
    const codePoint = text.codePointAt(tokenStart);
    if (!isMorphologyTokenCodePoint(codePoint)) {
      tokenStart += codePoint > 0xffff ? 2 : 1;
      continue;
    }

    let tokenEnd = tokenStart;
    while (tokenEnd < text.length) {
      const tokenCodePoint = text.codePointAt(tokenEnd);
      if (!isMorphologyTokenCodePoint(tokenCodePoint)) {
        break;
      }
      tokenEnd += tokenCodePoint > 0xffff ? 2 : 1;
    }

    const surface = text.slice(tokenStart, tokenEnd).normalize("NFD");
    const descriptors = token.get(surface) ?? [];
    const source = findCodePointIndex(mapping.originalStarts, tokenStart);
    const offset = mapping.nfdStarts[source];
    for (const descriptor of descriptors) {
      const start = offset - descriptor.prefix.length;
      if (start < 0 || !mapping.nfdText.startsWith(descriptor.prefix, start)) {
        continue;
      }
      const range = mapOriginalRange(mapping, start, offset + descriptor.length);
      if (range !== null) {
        matches.push({
          rule: descriptor.rule,
          order: descriptor.order,
          expression: descriptor.expression,
          start: range.start,
          end: range.end,
        });
      }
    }
    tokenStart = tokenEnd;
  }
}

/**
 * 활용형 token에 사용할 현대 한글 음절과 정준 분해 자모인지 확인한다.
 *
 * @param {number | undefined} codePoint Unicode code point
 * @returns {boolean} 형태 판정 token에 포함하면 true
 */
function isMorphologyTokenCodePoint(codePoint) {
  return (
    codePoint !== undefined &&
    ((codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
      (codePoint >= 0x1100 && codePoint <= 0x11ff) ||
      (codePoint >= 0xa960 && codePoint <= 0xa97f) ||
      (codePoint >= 0xd7b0 && codePoint <= 0xd7ff))
  );
}

/**
 * code point마다 NFD를 이어 붙여 원본 위치와 NFD 위치의 대응을 만든다.
 *
 * @param {string} text 검사할 원문
 * @returns {NfdMapping} NFD 원문과 code point 시작 위치 대응
 * @remarks 마지막 항목은 두 문자열의 끝 위치를 가리키는 sentinel이다.
 */
function buildNfdMapping(text) {
  /** @type {Array<number>} */
  const originalStarts = [];
  /** @type {Array<number>} */
  const nfdStarts = [];
  /** @type {Array<string>} */
  const parts = [];
  let nfdLength = 0;
  for (let offset = 0; offset < text.length; ) {
    const codePoint = text.codePointAt(offset);
    const unitLength = codePoint > 0xffff ? 2 : 1;
    const decomposed = text.slice(offset, offset + unitLength).normalize("NFD");
    originalStarts.push(offset);
    nfdStarts.push(nfdLength);
    parts.push(decomposed);
    nfdLength += decomposed.length;
    offset += unitLength;
  }
  originalStarts.push(text.length);
  nfdStarts.push(nfdLength);
  return { nfdText: parts.join(""), originalStarts, nfdStarts };
}

/**
 * NFD 일치 범위를 원본 UTF-16 범위로 바꾸고 음절 중간에서 끝난 일치는 그 음절의 끝으로 올린다.
 *
 * @param {NfdMapping} mapping 원본과 NFD 위치 대응
 * @param {number} nfdStart NFD 일치 시작 위치
 * @param {number} nfdEnd NFD 일치의 exclusive 끝 위치
 * @returns {null | {start: number, end: number}} code point 시작에 정렬되지 않은 일치는 null
 */
function mapOriginalRange(mapping, nfdStart, nfdEnd) {
  const startIndex = findCodePointIndex(mapping.nfdStarts, nfdStart);
  if (mapping.nfdStarts[startIndex] !== nfdStart) {
    return null;
  }
  const lastIndex = findCodePointIndex(mapping.nfdStarts, nfdEnd - 1);
  return {
    start: mapping.originalStarts[startIndex],
    end: mapping.originalStarts[lastIndex + 1],
  };
}

/**
 * 목표 NFD 위치를 포함하는 code point 항목을 이분 탐색으로 찾는다.
 *
 * @param {ReadonlyArray<number>} nfdStarts 오름차순 NFD 시작 위치
 * @param {number} target 찾을 NFD 위치
 * @returns {number} `nfdStarts[index] <= target`을 만족하는 가장 큰 index
 */
function findCodePointIndex(nfdStarts, target) {
  let lower = 0;
  let upper = nfdStarts.length - 1;
  while (lower < upper) {
    const middle = Math.ceil((lower + upper) / 2);
    if (nfdStarts[middle] <= target) {
      lower = middle;
    } else {
      upper = middle - 1;
    }
  }
  return lower;
}

/**
 * 한 source의 모든 출현을 모아 줄과 열을 계산하고 경고 상한 안에서 기록한다.
 *
 * @param {Source} source 검사할 원문
 * @param {ReadonlyArray<InternalRule>} definitions 검사할 규칙 자료
 * @param {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} literal 고정 표현 색인
 * @param {ReadonlyMap<string, ReadonlyArray<TermDescriptor>>} token 활용형 token 색인
 * @param {Array<ExpressionWarning>} warnings 실행 전체의 상세 경고 앞부분
 * @returns {{found: number, matchedRuleIndexes: ReadonlySet<number>}} 출현 수와 발견 규칙 위치
 */
function scanSource(source, definitions, literal, token, warnings) {
  const matches = collectMatches(source.text, literal, token);
  const matchedRuleIndexes = new Set();
  let line = 1;
  let lineStart = 0;
  let lineEnd = findLineEnd(source.text, 0);
  let cursor = 0;

  for (let offset = 0; offset < source.text.length; offset += 1) {
    while (cursor < matches.length && matches[cursor].start === offset) {
      const match = matches[cursor];
      cursor += 1;
      matchedRuleIndexes.add(match.rule);
      if (warnings.length < MAX_WARNINGS) {
        warnings.push({
          ruleId: definitions[match.rule].id,
          expression: match.expression,
          sourceId: source.id,
          line,
          startUtf16: offset - lineStart + 1,
          endUtf16: match.end - lineStart + 1,
          quote: makeQuote(source.text, lineStart, lineEnd, offset, match.end - offset),
        });
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

  return { found: matches.length, matchedRuleIndexes };
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
 * 일치 표현을 보존하면서 줄에서 최대 480 UTF-16 code unit을 반환한다.
 *
 * @param {string} text source 원문
 * @param {number} lineStart 줄 시작 offset
 * @param {number} lineEnd 줄 끝 offset
 * @param {number} matchStart 일치 시작 offset
 * @param {number} matchLength 일치 표현 길이
 * @returns {string} AI가 문맥 판정에 사용할 원문 일부
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
