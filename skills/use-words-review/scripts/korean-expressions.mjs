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

/** @typedef {{ruleIndex: number, declarationIndex: number, expression: string}} ExpressionDescriptor */

/** @typedef {ExpressionDescriptor & {nfd: string}} NfdDescriptor */

/**
 * @typedef {{
 *   ruleIndex: number,
 *   declarationIndex: number,
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

/** @type {number} */
const MAX_WARNINGS = 20_000;
/** @type {number} */
const MAX_QUOTE_UTF16 = 480;
/**
 * 받침이 붙어 마지막 음절이 달라지는 활용형까지 찾도록 NFD 자모열 접두로 검사할 표현이다.
 *
 * @type {ReadonlySet<string>}
 */
const NFD_MATCHED_EXPRESSIONS = new Set(["좁히", "좁혀"]);

/**
 * 검사할 literal 후보와 AI가 각 문맥을 판정할 때 사용할 질문 및 대조 사례다.
 *
 * @type {ReadonlyArray<ExpressionRule>}
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
    id: "ko.close",
    expressions: ["닫"],
    message: "문짝이나 창처럼 여닫는 대상을 닫는 뜻인지 상태나 절차를 끝낸다는 번역인지 확인합니다.",
    queries: ["여닫을 수 있는 물건이나 화면 요소가 문장에 있습니까?", "완료 처리, 마감 또는 종료 같은 실제 행위를 대신합니까?"],
    negatives: ["작업을 닫힘으로 처리합니다."],
    positives: ["더 이상 사용하지 않는 탭을 닫습니다."],
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
].map((rule) => ({ kind: "literal", ...rule }));

/**
 * 내장 표현 규칙 전체를 순회해 모든 literal 출현을 찾는다.
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
  validateRules();
  const { syllableIndex, nfdDescriptors } = buildExpressionIndex();
  const matchedRules = rules.map(() => false);
  /** @type {Array<ExpressionWarning>} */
  const warnings = [];
  let total = 0;

  for (const source of sources) {
    if (!source.text.isWellFormed()) {
      throw new Error("rules:invalid-source");
    }
    const result = scanSource(source, syllableIndex, nfdDescriptors, warnings);
    total += result.found;
    for (const ruleIndex of result.matchedRuleIndexes) {
      matchedRules[ruleIndex] = true;
    }
  }

  return {
    id: "expressions",
    catalog: rules.map((rule) => ({
      id: rule.id,
      kind: rule.kind,
      expressions: rule.expressions,
    })),
    rules: rules.filter((rule, index) => matchedRules[index]),
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
 * @returns {void}
 */
function validateRules() {
  const ids = new Set();
  for (const rule of rules) {
    if (
      rule.kind !== "literal" ||
      !/^ko\.[a-z0-9-]+$/u.test(rule.id) ||
      ids.has(rule.id) ||
      !isNonEmptyText(rule.message)
    ) {
      throw new Error("rules:invalid-expression-rule");
    }
    ids.add(rule.id);
    validateTextList(rule.expressions, true);
    validateTextList(rule.queries, false);
    validateTextList(rule.negatives, false);
    validateTextList(rule.positives, false);
  }

  const declaredExpressions = new Set(rules.flatMap((rule) => rule.expressions));
  for (const expression of NFD_MATCHED_EXPRESSIONS) {
    if (!declaredExpressions.has(expression)) {
      throw new Error("rules:invalid-expression-rule");
    }
  }
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
 * 음절 literal 후보는 첫 UTF-16 code unit별로, NFD 접두 매칭 후보는 분해한 표현과 함께 선언 순서로 묶는다.
 *
 * @returns {{
 *   syllableIndex: ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>,
 *   nfdDescriptors: ReadonlyArray<NfdDescriptor>
 * }} 두 매칭 방식의 후보 색인
 */
function buildExpressionIndex() {
  /** @type {Map<string, Array<ExpressionDescriptor>>} */
  const syllableIndex = new Map();
  /** @type {Array<NfdDescriptor>} */
  const nfdDescriptors = [];
  let declarationIndex = 0;
  for (const [ruleIndex, rule] of rules.entries()) {
    for (const expression of rule.expressions) {
      if (NFD_MATCHED_EXPRESSIONS.has(expression)) {
        nfdDescriptors.push({
          ruleIndex,
          declarationIndex,
          expression,
          nfd: expression.normalize("NFD"),
        });
      } else {
        const firstUnit = expression[0];
        const descriptors = syllableIndex.get(firstUnit) ?? [];
        descriptors.push({ ruleIndex, declarationIndex, expression });
        syllableIndex.set(firstUnit, descriptors);
      }
      declarationIndex += 1;
    }
  }
  return { syllableIndex, nfdDescriptors };
}

/**
 * 한 source의 모든 음절 및 NFD 접두 출현을 원본 UTF-16 위치의 결정적 순서로 모은다.
 *
 * @param {string} text 검사할 원문
 * @param {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} syllableIndex 음절 후보 색인
 * @param {ReadonlyArray<NfdDescriptor>} nfdDescriptors NFD 접두 매칭 후보
 * @returns {ReadonlyArray<ExpressionMatch>} 시작 위치와 선언 순서로 정렬한 출현
 */
function collectMatches(text, syllableIndex, nfdDescriptors) {
  /** @type {Array<ExpressionMatch>} */
  const matches = [];
  for (let offset = 0; offset < text.length; offset += 1) {
    const descriptors = syllableIndex.get(text[offset]);
    if (descriptors === undefined) {
      continue;
    }
    for (const descriptor of descriptors) {
      if (text.startsWith(descriptor.expression, offset)) {
        matches.push({
          ruleIndex: descriptor.ruleIndex,
          declarationIndex: descriptor.declarationIndex,
          expression: descriptor.expression,
          start: offset,
          end: offset + descriptor.expression.length,
        });
      }
    }
  }
  collectNfdMatches(text, nfdDescriptors, matches);
  return matches.toSorted(
    (left, right) =>
      left.start - right.start ||
      left.declarationIndex - right.declarationIndex ||
      left.end - right.end,
  );
}

/**
 * NFD 접두 매칭 후보의 겹치는 출현을 원본 code point 범위로 되돌려 모은다.
 *
 * @param {string} text 검사할 원문
 * @param {ReadonlyArray<NfdDescriptor>} nfdDescriptors NFD 접두 매칭 후보
 * @param {Array<ExpressionMatch>} matches 출현을 추가할 배열
 * @returns {void}
 */
function collectNfdMatches(text, nfdDescriptors, matches) {
  if (nfdDescriptors.length === 0 || text.length === 0) {
    return;
  }
  const mapping = buildNfdMapping(text);
  for (const descriptor of nfdDescriptors) {
    for (let from = 0; from <= mapping.nfdText.length; ) {
      const found = mapping.nfdText.indexOf(descriptor.nfd, from);
      if (found === -1) {
        break;
      }
      const range = mapOriginalRange(mapping, found, found + descriptor.nfd.length);
      if (range !== null) {
        matches.push({
          ruleIndex: descriptor.ruleIndex,
          declarationIndex: descriptor.declarationIndex,
          expression: descriptor.expression,
          start: range.start,
          end: range.end,
        });
      }
      from = found + 1;
    }
  }
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
 * @param {ReadonlyMap<string, ReadonlyArray<ExpressionDescriptor>>} syllableIndex 음절 후보 색인
 * @param {ReadonlyArray<NfdDescriptor>} nfdDescriptors NFD 접두 매칭 후보
 * @param {Array<ExpressionWarning>} warnings 실행 전체의 상세 경고 앞부분
 * @returns {{found: number, matchedRuleIndexes: ReadonlySet<number>}} 출현 수와 발견 규칙 위치
 */
function scanSource(source, syllableIndex, nfdDescriptors, warnings) {
  const matches = collectMatches(source.text, syllableIndex, nfdDescriptors);
  const matchedRuleIndexes = new Set();
  let line = 1;
  let lineStart = 0;
  let lineEnd = findLineEnd(source.text, 0);
  let cursor = 0;

  for (let offset = 0; offset < source.text.length; offset += 1) {
    while (cursor < matches.length && matches[cursor].start === offset) {
      const match = matches[cursor];
      cursor += 1;
      matchedRuleIndexes.add(match.ruleIndex);
      if (warnings.length < MAX_WARNINGS) {
        warnings.push({
          ruleId: rules[match.ruleIndex].id,
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
