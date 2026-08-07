# 번역투와 정형화된 AI 문체를 줄이는 방법

## 조사 질문과 소유 범위

이 문서는 [요구사항 문서](../requirements.md)의 `AI가 잘못된 텍스트를 사용하는 문제`, `자연스러운 문장 연결`과 `문맥에 맞지 않는 경로와 공개 표현`에 필요한 사실을 다룬다.

조사 대상은 한국어의 어휘와 용어, 문장 구조, 글의 전개, 문장부호와 문자다. 산출물의 실제 독자를 정하는 방법은 [독자 혼동 조사](./public-output-audience-research.md)가, 작업 지시 문구가 코드·문서·커밋에 들어가는 문제는 [작업 의도와 산출물 출처 조사](./prompt-intent-and-artifact-provenance-research.md)가 맡는다.

첫 조사는 2026년 7월 17일에 수행했다. 국립국어원과 Microsoft의 한국어 작성 지침, 한국어 생성문과 번역문을 평가한 연구, GitHub 이슈를 확인했다. 7월 27일에는 문장과 문단에 나타난 역할, 조건, 가정과 정보 순서를 다룬 공식 작성 지침을 추가로 대조했다. 7월 28일에는 자연스러운 어휘와 문법을 썼더라도 한 문장에 뜻을 지나치게 압축하면 이해하기 어려운 문제와 문맥에 따라 달라지는 표현을 별도로 조사했다. 이 문서는 조사 결과와 적용 제안을 기록하며, 특정 표현을 금지하거나 저장소 규칙을 바꾸는 결정을 대신하지 않는다.

### 추가 조사 방법과 자료 선택

2026년 7월 28일에는 `공개 저장소`, `공개 리포지토리`, `퍼블릭 리포지토리`, `유효성`, `정합성 검증`, `가시성`, `표시 유형`, `루브릭 평가 기준`, `지원`, `보장`, `노출`, `쉬운 공공언어`, `문맥에 맞지 않는 단어`, `명사 나열`과 `피동 표현`을 검색했다. AI가 작성했다고 밝힌 한국어 자료가 표현 빈도의 근거가 될 수 있는지 확인하려고 GitHub에서 `AI로 작성`, `ChatGPT로 작성`과 `생성형 AI로 작성`도 검색했다.

현재 효력이 있거나 조사일에 게시된 공식 한국어 문서, 표준, 법령, 연구 원문과 실제 소프트웨어 저장소만 포함 후보로 삼았다. AI 작성 자료는 작성자가 생성 사실과 대상 범위를 명시했거나 생성 기록을 확인할 수 있는 경우에만 표현 빈도 조사에 포함하기로 했다. 블로그와 큐레이션 글, 원문 문맥을 확인할 수 없는 검색 결과, 영어 자료만 있는 용례, 작성 주체를 추정한 자료는 제외했다. GitHub 검색에서 확인한 작성 고지는 코드나 범위를 특정하지 않은 일부 내용에 관한 것이어서 한국어 문장의 표현 빈도를 비교할 자료로 사용하지 않았다.

## 결론

`경계`, `범위`, `계약`, `루브릭`이나 긴 대시처럼 눈에 띄는 단어와 기호를 일괄 금지하는 방법은 문제를 제대로 판정하지 못한다. 가운뎃점과 이모지도 그 자체로 AI 작성의 증거가 아니다. 같은 표현도 법률, 수학, 화면 배치, 평가 연구에서는 정확한 용어일 수 있다. 반대로 금칙어가 하나도 없어도 영어 어순, 명사 나열, 불필요한 피동, 균일한 문단 구조가 남으면 한국어 문장은 여전히 부자연스럽다.

확인한 자료에서 반복되는 방법은 다음과 같다.

1. 작성할 UI, 기술 문서, 조사 보고서와 같은 종류의 실제 한국어 표본을 따로 모은다.
2. 원문의 단어를 옮기기 전에 대상, 동작, 조건, 책임 주체를 추리고 한국어 문장을 새로 쓴다.
3. 정확성, 유창성, 문체, 용어를 별도 항목으로 판정한다.
4. 맞춤법·용어 일관성·유니코드 안전성 같은 항목은 자동 검사하고, 자연스러움과 글의 쓰임은 한국어 독자가 비교한다.
5. 실제 실패 사례와 사람 판정의 불일치를 평가 기준과 회귀 사례에 반영한다.
6. 문장 하나의 자연스러움, 문장 자체의 뜻과 문서 전체의 연결 관계를 나눠 검토한다.
7. 자주 잘못 쓰이는 표현은 검토 후보로만 삼고, 실제 뜻과 독자 및 분야를 확인해 유지하거나 고친다.

‘AI가 쓴 듯한 글’을 사람처럼 위장하는 것이 목표가 되어서는 안 된다. 오탈자나 무작위 구어체를 넣는 대신, 독자가 필요한 사실을 자연스러운 한국어로 정확히 이해하는지를 목표로 삼아야 한다.

## 문제를 네 층으로 나눠야 하는 이유

### 어휘와 용어

국립국어원의 `쉬운 공공언어 쓰기 길잡이`는 문맥에 맞는 단어, 명료한 문장, 번역투와 명사 나열의 회피를 함께 요구한다. `한눈에 알아보는 공공언어 바로 쓰기`는 공공문서 종류와 일본어투 용어를 별도로 다룬다. 이는 어려워 보이는 단어 하나를 바꾸는 작업과 문장 전체를 고치는 작업이 다르다는 공식 지침이다. [국립국어원 쉬운 공공언어 쓰기 길잡이, 2015-02-13 최종 수정](https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=399&mn_id=46&pageIndex=10), [한눈에 알아보는 공공언어 바로 쓰기, 2024-06-04 최종 수정](https://korean.go.kr/front/etcData/etcDataView.do?etc_seq=699&mn_id=&pageIndex=1)

Microsoft의 한국어 현지화 지침도 일반 독자에게는 익숙한 말을 쓰되 기술 독자에게 필요한 전문용어는 유지하라고 한다. 단어 단위 번역, 영어식 소유 표현, 불필요한 동작 명사와 보조 동사, 영어 문장부호의 직접 이전을 함께 점검한다. 따라서 용어 목록은 `금지` 하나가 아니라 `권장`, `허용`, `처음에 설명한 뒤 사용`처럼 문서 종류와 독자에 맞춰 관리하는 편이 낫다. [Microsoft Korean Localization Style Guide, 안내 페이지 2025-04-25 갱신](https://learn.microsoft.com/ko-kr/globalization/reference/microsoft-style-guides)

### 단어 목록은 판정의 시작점으로만 사용한다

공식 한국어 문서에 나온 표현이라는 사실만으로 모든 문서에서 자연스럽다고 판정할 수 없다. 같은 기관의 한국어 문서도 `공개 저장소`, `공개 리포지토리`와 `퍼블릭 리포지토리`를 섞어 쓰거나 `가시성`과 `표시 유형`을 같은 설정에 사용한다. 공식 번역은 해당 제품의 용례를 확인하는 근거지만, 다른 독자와 문서에 그대로 옮길 근거는 아니다.

- [GitHub 프로필 기여 문서](https://docs.github.com/ko/account-and-profile/concepts/contributions-on-your-profile)는 프로필에 표시할 수 있는 항목을 설명하면서 `공개 저장소`를 사용한다.
- [GitHub 데이터 유출 방지 지침](https://docs.github.com/ko/code-security/tutorials/secure-your-organization/prevent-data-leaks)은 저장소의 표시 유형을 설명하면서 `퍼블릭 리포지토리`를 사용한다.
- [Microsoft Power Pages 사이트 표시 설정](https://learn.microsoft.com/ko-kr/power-pages/security/site-visibility)은 사이트를 볼 수 있는 사람을 정하는 설정을 `사이트 가시성`이라고 부른다.

현재 저장소의 [자연스러운 한국어 작성 지침](../../../../AGENTS.md#writing-natural-korean)은 `경계`, `계약`, `지원`, `보장`, `노출`처럼 문맥에 따라 뜻이 달라지는 표현과 정보 없이 붙이기 쉬운 수식어를 검토 후보로 든다. 이 목록은 저장소의 작성 규칙이지 AI 생성문의 표현 빈도를 측정한 자료가 아니므로, 조사할 표현을 고르는 데만 사용했다.

현재 저장소 지침과 실제 실패에서 반복되는 후보는 다음처럼 나뉜다.

- **분야에서 뜻이 정해진 명사.** `범위`, `경계`, `계약`, `루브릭`, `유효성`, `정합성`, `가시성`은 법률, 수학, 교육 평가, 시험 방법, 데이터 품질과 제품 설정에서 정확한 용어가 될 수 있다. 해당 분야와 판정 대상이 문서에 드러날 때는 유지하고, 일반 독자가 실제로 확인할 조건을 알아야 할 때는 포함 대상, 일치시킬 값, 채점 기준 또는 볼 수 있는 사람을 직접 적는다.
  - [선원법 적용범위](https://law.go.kr/LSW/lsInfoP.do?lsiSeq=193433)는 법 조항이 적용되는 대상을 `적용범위`로 구분한다.
  - [항공정보 품질관리 지침의 유효성 정의](https://law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000238114)는 시험 방법의 `유효성`을 의도한 목적에 맞는지 객관적 증거로 확인하는 절차로 정의한다.
  - [국토교통부 항공사 코드 데이터](https://www.data.go.kr/data/15061951/fileData.do)는 서로 다른 코드 값이 맞는지 검사하는 일을 `정합성 검증`이라고 적는다.
  - [국립국어원 평가인증 연구](https://www.korean.go.kr/common/download.do?c_file_name=6dfb6914-dc17-4829-87a0-ceba40e8fdfd_0.pdf&file_path=reportData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B5%90%EC%9B%90+%EA%B5%90%EC%9C%A1%EA%B8%B0%EA%B4%80+%ED%8F%89%EA%B0%80%EC%9D%B8%EC%A6%9D+%ED%83%80%EB%8B%B9%EC%84%B1+%EC%A0%90%EA%B2%80+%EB%B0%8F+%EA%B5%90%EC%9B%90%EC%9E%90%EA%B2%A9%EC%A0%9C%EB%8F%84+%EC%9A%B4%EC%98%81+%ED%9A%A8%EC%9C%A8%ED%99%94+%EB%B0%A9%EC%95%88+%EC%97%B0%EA%B5%AC+%EA%B2%B0%EA%B3%BC%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf)는 단계별 평정 기준을 `루브릭`이라고 부른다.
  - [한국교육학술정보원 디지털 리터러시 검사 연구](https://www.keris.or.kr/main/ad/pblcte/selectPblcteRRInfo.do?mi=1138&pblcteSeq=13834)는 검사 문항의 단계별 채점 기준을 루브릭으로 제시한다.
- **여러 행동을 대신할 수 있는 동사.** `지원`, `보장`, `대응`, `다루다`, `노출`, `포착`, `정렬`, `표면화`는 문맥에 따라 서로 다른 일을 가리킨다. 독자가 구현하거나 검증해야 하는 문서에서는 어떤 값을 받고, 무엇을 표시하거나 반환하며, 누가 어떤 문제를 처리하는지 실제 동작으로 바꿔 쓴다.
  - [Microsoft Windows 10 지원 종료 문서](https://learn.microsoft.com/ko-kr/microsoft-365-apps/end-of-support/windows-10-support)는 `지원`을 제품 유지보수 기간이 끝나는 상태에 사용한다.
  - [Microsoft Windows App SDK 지원 설명](https://learn.microsoft.com/ko-kr/windows/apps/windows-app-sdk/release-channels)은 `지원`을 릴리스 채널별 제공 기간과 연결한다.
  - [근로기준법](https://www.law.go.kr/법령/근로기준법)은 `보장`을 법률상 권리와 근로 조건에 사용한다.
- **정보를 더하지 않는 평가와 수식.** `핵심`, `효과적`, `원활`, `강력`, `견고`, `포괄적`, `다양한`, `본질적`이 무엇과 비교한 결과인지 문서에 없다면 독자가 확인할 정보가 늘어나지 않는다. 삭제해도 기능, 조건이나 판단이 달라지지 않으면 빼고, 성능이나 품질을 주장하려면 측정 대상과 기준 및 결과를 적는다.
- **대상 없이 쓰인 익숙한 말.** `해당`, `관련`, `이 내용`, `결과`, `출력`, `데이터`, `기능`, `범위`는 한국어 자체가 잘못된 말이 아니다. 그러나 가까운 문장에서 하나의 대상을 찾을 수 없거나 행동의 끝을 감추면 구체적인 이름과 결과로 바꾼다. 저장소 근거만으로 대상을 확인할 수 없으면 자연스럽게 보이는 문장을 추정해 만들지 않고 `needs human input`으로 남긴다.

검토 순서는 표현 검색, 문맥 확인, 판정 순이다. 먼저 후보를 찾되, 그 표현이 가리키는 대상, 행동, 조건과 결과를 앞뒤 문장에서 확인한다. 정확한 전문용어이면 유지하고, 뜻을 한 단어에 압축했다면 실제 행동이나 상태를 적는다. 용례가 있다는 이유만으로 통과시키거나 후보 목록에 있다는 이유만으로 실패시키지 않는다.

### 문장 구조

번역투는 번역이 틀렸다는 말과 같지 않다. Riley 외는 원어 문장과 번역 문장을 다른 문체로 학습한 뒤 자연 문체 출력을 유도했다. 영어-프랑스어 실험에서 자연 문체 출력은 참조 번역과의 BLEU 점수는 낮았지만 사람이 더 선호했다. 표면적 정답 일치율만 높이면 번역투를 선호할 수 있으므로 자연스러움을 별도 항목으로 평가해야 한다. 한국어 실험은 아니라는 한계가 있다. [Riley 외, Translationese as a Language in “Multilingual” NMT, ACL 2020](https://aclanthology.org/2020.acl-main.691/)

### 글의 전개

정형화된 AI 문체도 단어 빈도만의 문제가 아니다. Shaib 외는 생성문에서 반복되는 품사 배열을 측정했고, 모델 생성문의 문장 틀 가운데 사전 학습 자료에도 있던 비율은 76%, 사람 글은 35%라고 보고했다. 이 결과는 특정 접속어를 지우라는 처방이 아니라 반복되는 문장 짜임을 별도 진단 대상으로 보라는 근거다. 영어 중심 연구이며 문장을 고친 뒤 품질 향상을 측정한 실험은 아니다. [Shaib 외, Detection and Measurement of Syntactic Templates in Generated Text, EMNLP 2024](https://aclanthology.org/2024.emnlp-main.368/)

한국어 자료를 사용한 KatFishNet 연구에서도 사람 글은 품사 조합이 더 다양했고, LLM 글은 쉼표와 규칙적인 띄어쓰기가 더 자주 나타났다. 에세이에서 쉼표가 있는 문장 비율은 사람 26.31%, LLM 61.03%였고 문장당 쉼표 수는 1.13과 2.56이었다. 그러나 논문 초록처럼 원래 구조가 정형화된 글에서는 차이가 줄었다. 쉼표 수 하나로 실패를 확정하지 말고 같은 종류의 실제 글과 비교해야 한다. [Kim 외, Detecting LLM-Generated Korean Text through Linguistic Feature Analysis, ACL 2025](https://aclanthology.org/2025.acl-long.1030/)

자연스러운 어휘와 문법만으로는 문서의 흐름을 확인할 수 없다. 문장을 따로 읽는 검사와 함께 문단 안에서 정보가 어떤 순서로 이어지는지 확인해야 한다.

- [Google 문장 구성](https://developers.google.com/style/sentence-structure)은 지시문에서 조건이나 목표를 행동보다 앞에 두도록 안내한다.
- [GOV.UK 사용자 스토리 작성](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories)은 행위자, 필요한 동작, 목표와 완료 결과를 함께 적도록 안내한다.

#### 긴 문단은 중심 내용과 관계를 기준으로 나눈다

긴 문단은 고정된 글자 수로 실패 처리하지 않고 중심 내용과 문단 사이의 관계를 기준으로 나눈다. 서로 다른 미확정 사항처럼 각각 근거와 다음 행동이 있는 내용은 각 문단의 첫 문장에서 그 사항을 밝히고, 이어지는 문장에서 근거와 영향을 설명한다. 하나의 복잡한 생각을 설명하는 문단은 문장 수가 많다는 이유만으로 나누지 않는다.

공식 자료를 함께 대조하면 긴 문단은 검토 후보지만 길이만으로 실패를 확정할 수 없다. Google은 한 문단이 하나의 생각을 다루도록 안내하고, 문장이 다섯 개나 여섯 개를 넘으면 내용이 과도한지 확인하되 하나의 생각이라면 더 길어도 나누지 말라고 설명한다. 캐나다 정부 지침도 한 문단에 하나의 중심 내용을 두도록 권하고, 평균 문장 길이와 문단 길이만으로 읽기 쉬운 정도를 판단하는 도구의 한계 자료를 함께 제공한다.

- [Google 문단 구성](https://developers.google.com/style/paragraph-structure), 2024년 10월 15일 갱신본을 2026년 8월 7일에 확인했다.
- [캐나다 정부의 접근 가능한 문서 작성 지침](https://www.canada.ca/en/employment-social-development/programs/accessible-canada-regulations-guidance/language/writing.html), 2022년 9월 29일 게시본을 2026년 8월 7일에 확인했다.

국립국어원은 전달 목적과 내용이 분명하도록 문장 성분의 호응, 생략과 과도한 연결을 확인하고 번역투나 명사 나열을 피하면서 단락을 적절히 나누도록 안내한다. W3C는 짧은 텍스트 묶음과 여백이 이해를 돕는다고 설명한다. Microsoft는 짧은 문단과 중요한 정보의 앞 배치를 권하고, 미국 연방정부의 Digital.gov는 짧고 집중된 문단을 사용하면서 문단 사이의 주제 연결도 확인하라고 안내한다.

- [국립국어원 쉬운 공공언어 쓰기 길잡이](https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=399&mn_id=46&pageIndex=10), 2015년 2월 13일 최종 수정본을 2026년 8월 7일에 다시 확인했다.
- [W3C의 명확하고 이해하기 쉬운 콘텐츠 지침](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/), 2021년 4월 29일 공개 자료를 2026년 8월 7일에 확인했다.
- [Microsoft의 훑어보기 쉬운 콘텐츠 지침](https://learn.microsoft.com/en-us/style-guide/scannable-content/), 2023년 6월 20일 갱신본을 2026년 8월 7일에 확인했다.
- [Digital.gov의 콘텐츠 설계 접근성 지침](https://digital.gov/guides/accessibility-for-teams/content-design/), 2026년 8월 7일에 확인했다.

목록은 대등한 항목, 조건이나 순서를 빠르게 찾게 할 때 적합하다. 근거가 어떤 판단을 뒷받침하고 그 판단이 다음 행동을 어떻게 바꾸는지 설명해야 한다면 여러 플레인 텍스트 문단이 관계를 더 잘 보존한다. Markdown에서는 빈 줄로 구분해야 두 텍스트 덩어리가 별도 문단으로 해석되므로, 소스 코드의 단순 줄바꿈은 완료 증거가 아니다.

- [Digital.gov의 목록 지침](https://digital.gov/guides/plain-language/design/lists)은 항목, 조건과 절차를 목록으로 제시하되 목록을 과도하게 사용하지 말라고 안내한다. 2026년 8월 7일에 확인했다.
- [CommonMark 문단 명세](https://spec.commonmark.org/current/#paragraphs)는 빈 줄이 없는 연속된 텍스트 줄을 한 문단으로 해석한다. 현재 명세를 2026년 8월 7일에 확인했다.

이 결론은 [한국어 문서 검토 재발 방지 요구사항](../../korean-writing-review-6f3a/requirements.md)의 문단 작성 조건과 [구현 계획](../../korean-writing-review-6f3a/plan.md)의 `여러 중심 내용을 담은 긴 산문을 의미 단위별 문단으로 나눈다` 작업에 반영한다.

역할, 전제, 순서와 문서 구조도 어휘와 별도로 확인해야 한다. 다음 두 자료는 요구사항과 웹 문서를 대상으로 하므로 모든 글에 그대로 적용할 수는 없지만, 문장과 절의 관계를 검토할 근거가 된다.

- [NASA 요구사항 작성 점검표](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)는 한 문장에 하나의 생각과 하나의 주어 및 서술어가 있는지, 가정이 명시됐는지, 관련 요구사항과 모순되지 않는지 확인한다.
- [W3C 제목 구조](https://www.w3.org/WAI/tutorials/page-structure/headings/)는 제목 계층이 문서의 구성과 각 절의 관계를 전달해야 한다고 설명한다.

문법이 맞고 익숙한 단어를 썼다는 사실만으로 문장 자체가 이해하기 쉽다고 볼 수는 없다. 문장의 길이를 기계적으로 제한하지 말고, 한 문장 안에서 주체, 행동, 조건과 결과의 관계를 독자가 추측해야 하는지 따로 판정해야 한다.

- [NASA 요구사항 작성 점검표](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)는 문법 정확성과 별도로 한 문장에 하나의 생각과 하나의 주어 및 서술어가 있는지, 가정이 빠지지 않았는지 확인한다.
- [GOV.UK 기능 표준 작성 지침](https://www.gov.uk/government/publications/handbook-for-standard-managers/functional-standards-writing-style-guide)은 한 문장에 한 가지 생각을 담도록 안내한다.
- [Microsoft 전 세계 독자를 위한 작성 지침](https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips)은 여러 구나 절을 잇는 복문을 나누되 필요한 뜻까지 줄이지 않도록 안내한다.

짧은 문장도 대상이나 전제가 빠졌다면 고쳐야 하고, 긴 문장도 각 요소의 관계가 분명하다면 길이만으로 실패로 판정하면 안 된다.

- [Google 문장 구성](https://developers.google.com/style/sentence-structure)은 지시문에서 상황, 조건이나 목표를 행동보다 먼저 제시하도록 안내한다.
- [GOV.UK 명료한 문장 지침](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/)은 능동문으로 행동 주체를 드러내고 긴 문장을 나눌 후보로 보되 문장 길이만으로 품질을 판단하지 않도록 설명한다.

### 문장부호와 문자

사람이 키보드로 쉽게 입력하지 않는다는 이유만으로 모든 특수문자를 지우면 정상 문장과 코드가 손상될 수 있다. Claude Code의 GitHub 이슈에는 관련 없는 파일 수정 중 올바른 굽은따옴표와 악센트 문자가 ASCII 문자로 바뀌어 사용자 문구, 정규식, 다국어 문자열이 손상됐다는 재현 사례가 있다. 이는 문자 정규화도 원문 보존과 변경 비교 없이 적용하면 안 된다는 실제 사례다. [anthropics/claude-code #1599, 2025-06-04 등록](https://github.com/anthropics/claude-code/issues/1599)

반면 눈에 보이지 않는 제어 문자, 양방향 표시 문자, 모양만 비슷한 문자 혼용은 문체가 아니라 안전성과 호환성 문제다. GitHub Agentic Workflows의 공식 검사기는 영폭 문자와 양방향 제어 같은 유니코드 악용을 별도로 거부한다. 자연스러운 문장부호와 숨은 제어 문자를 같은 규칙으로 처리하지 않는 사례다. [GitHub Agentic Workflows Markdown reference](https://github.github.com/gh-aw/reference/markdown/)

영어 의학 논문 69,632편을 분석한 2026년 사전등록 연구에서는 긴 대시가 들어간 글이 ChatGPT 이전 4.23%에서 이후 11.58%로 늘었다. 저자는 이를 개별 글의 AI 사용 판정기가 아니라 집단 수준의 신호라고 제한했다. 영어 의학 논문의 변화는 한국어 입력 편의나 제품 문구의 적절성을 증명하지 않는다. [Czuma, Em-ergence of the em-dash, 2026-06-28 제출본](https://arxiv.org/abs/2606.29540)

### 가운뎃점과 이모지는 문맥으로 판정한다

국립국어원은 가운뎃점을 열거한 말 가운데 짝을 이루거나 밀접한 관계가 있는 말, 특별한 의미가 있는 날짜, 같은 계열의 단위를 묶는 데 쓰는 문장부호로 설명한다. `·`가 키보드에서 바로 보이지 않거나 AI 글에서 자주 보인다는 인상만으로 정상적인 한국어 문장부호까지 제거할 근거는 없다. 용례에 맞지 않는 장식적 반복은 고칠 수 있지만, 문자 자체를 AI 표지로 판정하면 거짓 양성이 생긴다. [국립국어원, 가운뎃점](https://www.korean.go.kr/nkview/nknews/200009/26_6.htm)

Unicode UTS #51은 이모지를 글 안에서 사용하는 그림 문자 또는 문자 조합으로 정의한다. 이모지는 표준화된 텍스트 표현 수단이지 생성 주체를 나타내는 표식이 아니다. 다만 채널과 독자에 따라 적합성은 달라진다. [Unicode, UTS #51](https://www.unicode.org/reports/tr51/)

W3C의 H86 기법은 이모지의 접근 가능한 이름이 작성자가 의도한 뜻과 다를 수 있고 이모티콘이 화면 읽기 프로그램 사용자에게 혼란을 줄 수 있으므로 대체 텍스트와 문맥을 확인하라고 한다. Microsoft의 작성 지침도 이모지를 사교적이고 비격식인 상황에서 제한적으로 사용하되, 의미가 이모지 없이도 전달돼야 하며 심각한 주제, 단어 대신 쓰기, 문장 중간 삽입, 글머리표, 과도한 반복을 피하라고 한다. 따라서 프로젝트는 `이모지 금지`를 AI 탐지 규칙으로 두기보다 채널의 격식, 접근성, 의미 전달 필요에 따라 허용 범위를 정해야 한다. [W3C H86](https://www.w3.org/WAI/WCAG21/Techniques/html/H86), [Microsoft emoji style](https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/e/emoticons-emoji)

## 효과가 측정된 접근

### 대상 글의 실제 한국어를 참조한다

XDAC 연구는 실제 한국어 뉴스 댓글을 검색해 참조로 넣고 말투, 감정, 간결성, 문자 사용을 조건으로 지정했다. 블라인드 평가에서 생성 댓글의 67.1%가 사람 댓글처럼 인식됐고 실제 댓글은 72.9%였다. 생성 댓글의 문맥 관련성은 94.8%, 유창성은 71.3%였다. ‘자연스럽게 쓰라’는 추상 지시보다 대상 글의 실제 표본을 제공하는 접근이 구체적이라는 근거다. [Go 외, XDAC, ACL 2025](https://aclanthology.org/2025.acl-long.1108/), [공식 저장소](https://github.com/airobotlab/XDAC)

다만 뉴스 댓글에서 사람처럼 보이게 하는 연구를 UI나 README에 그대로 적용할 수는 없다. 오탈자와 구어체까지 흉내 내는 대신, 각 프로젝트가 승인한 UI 문구나 기술 문서 표본을 사용해야 한다.

### 한국어 품질을 여러 항목으로 나눈다

Park와 Padó는 영한 번역 1,200문장을 정확성, 유창성, 문체, 용어로 나누어 평가했다. 참조 번역이 있는 평가는 정확성에서, 참조 번역이 없는 평가는 문체에서 더 나았다. 문체 오류는 격식 수준뿐 아니라 어순, 능동·피동, 단어와 문장의 변환에서 생긴 뉘앙스 변화까지 포함했다. 자유 생성문을 직접 평가한 연구는 아니지만 한국어 자연스러움을 단어 목록이나 단일 점수로 판정하기 어렵다는 직접 근거다. [Park·Padó, Multi-Dimensional Machine Translation Evaluation, LREC-COLING 2024](https://aclanthology.org/2024.lrec-main.1024/)

이를 프로젝트 문구에 적용할 때는 최소한 다음 판정을 분리할 수 있다.

- 사실과 의도가 보존됐는가.
- 한국어 문장으로 막힘없이 읽히는가.
- 문서 종류와 독자에게 맞는 높임 수준과 어조인가.
- 분야에서 정확한 용어를 일관되게 썼는가.

### 직관 대신 실패 유형이 있는 평가표를 쓴다

LREAD v3는 한국어 논증문을 판정할 때 내용, 구성, 표현의 세부 기준과 판정 근거를 사용했다. 훈련된 평가자 세 명의 다수결 정확도는 직관만 사용한 단계의 0.60에서 평가표를 사용한 단계의 0.90으로 높아졌다. 마지막 단계의 10/10은 제한된 초등학생 화자 표본 결과이며 일반 성능으로 해석할 수 없다. 평가자 간 Fleiss의 카파는 -0.09에서 0.82로 높아졌다. 저자도 이를 넓은 결론이 아니라 같은 평가자 집단 안에서 보정한 예비 근거로 규정한다. [Park·Han, LREAD v3, 2026-03-17 개정](https://arxiv.org/abs/2601.19913)

이 연구는 사람과 AI를 가려내는 것이 목적이지만, 실제 실패 사례에서 세부 판정 기준을 만들고 판정 이유를 기록하는 방법은 자연스러운 한국어 검토에도 적용할 수 있다. 표본 세 명과 제한된 글 종류 때문에 저장소마다 실제 독자를 다시 보정해야 한다.

## 적용 제안

### 생성 전에 뜻을 다시 구성한다

영어 원문이나 작업 메모를 문장별로 번역하지 않는다. 먼저 독자에게 전달할 문구에 필요한 사실을 다음처럼 추린다.

- 무엇을 가리키는가.
- 누가 무엇을 하는가.
- 어떤 조건에서 동작하는가.
- 독자가 무엇을 알아야 하거나 할 수 있어야 하는가.

그 뒤 대상 문서의 실제 한국어 표본과 용어를 사용해 문장을 새로 쓴다. 의미 보존과 자연스러움을 한 번에 판정하면 둘 중 하나가 가려질 수 있으므로 각각 검토한다.

### 문장 자체의 뜻을 따로 확인한다

자연스러운 어휘와 문법을 사용했더라도 한 문장에 전제, 조건, 판단이나 행동을 여럿 압축하면 필요한 관계가 빠질 수 있다. 문장마다 다음 내용을 문서에 적힌 정보만으로 구분할 수 있는지 확인한다.

- 무엇을 가리키는가.
- 누가 무엇을 하는가.
- 어떤 조건이나 전제가 적용되는가.
- 행동이나 판단의 결과가 무엇인가.

독립된 판단이나 행동이 여럿이고 그 관계를 추측해야 한다면 문장을 나누거나 빠진 설명을 보충한다. 짧게 쓰는 것 자체를 목표로 삼지 않는다. 긴 문장도 각 요소의 관계가 분명하면 유지하고, 짧은 문장도 대상이나 전제가 빠졌다면 고친다.

### 문장 사이의 관계를 따로 검토한다

문장별 어휘와 문법을 고친 뒤 문단과 문서 전체를 다시 읽는다. 두 번째 검토에서는 다음 관계를 문서 자체의 설명만으로 확인할 수 있는지 살핀다.

- 같은 역할 이름이 문서 전체에서 같은 책임을 가리키는가.
- 대명사와 `이 내용`, `해당 결과` 같은 표현이 무엇을 가리키는지 가까운 문장에서 알 수 있는가.
- 조건과 가정이 먼저 제시되고, 그 조건에서 해야 할 행동과 다음 단계가 이어지는가.
- 확인된 사실, 검토할 제안과 승인된 결정이 서로 다른 상태로 표시되는가.
- 제목과 문단 순서만 따라가도 앞 절의 결과가 다음 절에 필요한 이유를 알 수 있는가.

이 검토는 접속어를 추가해 문장을 억지로 이어 붙이는 작업이 아니다. 관계를 확인할 근거가 없으면 매끄러운 문장으로 추정해서 채우지 않고, 필요한 역할이나 결정이 확인되지 않았다고 기록한다.

### 자동 검사와 사람 판단의 역할을 나눈다

자동 검사에 맞는 항목은 맞춤법과 띄어쓰기 후보, 승인된 용어의 일관성, 반복되는 상투어와 문장 틀의 후보, 유니코드 `Cf`·제어 문자, 채널에서 금지한 문자다. 자동 검사는 후보를 표시하되 분야 용어와 유효한 문장부호를 바로 삭제하지 않는다.

사람은 원문과 수정문을 작성 주체를 가린 채 비교하고 의미 보존, 자연스러움, 용어 정확성, 글의 전개를 따로 판정한다. LLM 판정은 문법과 형식의 1차 검사에 사용할 수 있지만 고유한 목소리와 장르 적합성의 최종 판정을 맡기지 않는다.

### 실제 실패를 문서 종류별로 축적한다

UI, README, 조사 보고서는 필요한 문장 길이, 높임 수준, 전문용어, 문장부호가 다르다. 한 종류에서 발견한 금칙어나 빈도 기준을 다른 종류에 그대로 옮기지 않는다. 실패 사례는 다음 네 범주로 기록하고, 정상 대조군도 함께 둔다.

- **어휘와 용어.** 뜻을 확인하지 않은 일대일 치환과 문맥에 맞지 않는 전문용어를 실패 후보로 기록한다. 정착한 분야 용어까지 금지하지 않도록 정상 대조군을 함께 둔다.
- **문장 구조.** 영어 어순, 불필요한 피동, 긴 명사구와 여러 뜻을 압축해 관계가 빠진 문장을 실패 후보로 기록한다. 기술 문서에 필요한 정확한 수식 관계와 길더라도 뜻이 분명한 문장을 보존하도록 정상 대조군을 함께 둔다.
- **글의 전개.** 반복되는 접속어, 열거, 요약과 균일한 문단을 실패 후보로 기록한다. 짧고 반복적인 UI 패턴처럼 의도된 일관성을 허용하도록 정상 대조군을 함께 둔다.
- **문자.** 숨은 제어 문자와 채널에서 허용하지 않은 장식 문자를 실패 후보로 기록한다. 올바른 문장부호와 다국어 문자를 보존하도록 정상 대조군을 함께 둔다.

## 요구사항과 계획에 미치는 영향

문장 자체의 뜻과 문장 사이의 관계는 새 린터나 별도 검토 스킬이 아니라 현재 `skills/use-words-review/SKILL.md`의 입력 범위와 판정 기준에서 다뤄야 한다. 문장 자체의 검토에서는 대상, 주체, 행동, 조건과 결과 중 무엇이 빠졌거나 서로 얽혔는지 보고해야 한다. 앞뒤 관계를 판단할 때는 필요한 문단이나 절을 함께 전달하고, 관계가 끊긴 경우에는 연결되지 않는 두 위치를 모두 보고해야 한다.

`skills/use-words-review/references/examples.md`에는 여러 전제와 행동을 한 문장에 압축한 경우, 대상이나 필요한 설명이 빠진 경우, 역할 이름이 설명 없이 달라지는 경우, 앞에서 정하지 않은 결과를 참조하는 경우, 지칭 대상이 둘 이상인 경우, 제안을 승인된 결정처럼 이어 쓰는 경우와 정상 대조문을 추가해야 한다. 루트와 배포용 AGENTS 문서에는 문장 자체의 뜻을 확인하고 문단과 문서 전체를 다시 읽는 원칙만 두며, 상세 판정 목록은 스킬이 소유해야 한다.

`경로`, `공개`와 위 후보 표현도 같은 스킬에서 문맥으로 판정해야 한다. 스킬은 후보를 찾은 뒤 독자에게 필요한 대상, 행동, 조건이나 결과가 빠졌는지 보고해야 하며, 단어 목록만으로 실패를 확정하면 안 된다. 예시에는 문제 용례와 같은 표현이 정확한 전문용어로 쓰인 정상 용례를 함께 두어야 한다. `공개 저장소`처럼 제품마다 명칭이 다른 표현은 해당 제품의 실제 표시 유형과 열람 조건을 확인하고, 일반적인 인터넷 배포 상태는 독자가 확인해야 할 상태를 직접 적는다.

## 근거의 강도와 한계

### 한국어 번역 MQM

- **확인된 결과.** 정확성, 유창성, 문체, 용어를 분리하면 오류를 더 구체적으로 판정할 수 있다.
- **적용 한계.** 번역문 연구이며 자유 생성문은 아니다.

### XDAC

- **확인된 결과.** 대상 장르의 실제 한국어 참조와 세부 조건을 사용한 생성문을 사람이 비교했다.
- **적용 한계.** 뉴스 댓글과 사람 판별이 목적이다.

### LREAD v3

- **확인된 결과.** 평가표와 보정을 사용한 세 명의 판정 정확도와 일치도가 높아졌다.
- **적용 한계.** 사전 심사 전 예비 연구이며 글 종류와 표본이 작다.

### KatFishNet과 문장 틀 연구

- **확인된 결과.** LLM 글의 쉼표, 품사 배열, 문장 틀 반복 차이를 측정했다.
- **적용 한계.** 탐지 성능이지 퇴고 후 품질 향상은 아니다.

### 국립국어원과 Microsoft 지침

- **확인된 결과.** 문맥, 독자, 문장 구조, 용어, 문장부호를 함께 점검하는 실무 기준을 제시한다.
- **적용 한계.** 지침 도입 전후의 생성 품질 수치는 없다.

### 공식 한국어 전문용례

- **확인된 결과.** 법령, 품질 지침, 공공데이터와 교육 연구에서 `적용범위`, `유효성`, `정합성`과 `루브릭`이 구체적인 판정 대상과 함께 쓰인다. 제품 문서에서는 `공개 저장소`, `공개 리포지토리`, `가시성`과 `표시 유형`이 섞여 있다.
- **적용 한계.** 한 기관이나 제품이 채택한 번역은 다른 독자에게도 자연스럽다는 증거가 아니다. 공식 문서에도 번역과 용어가 일관되지 않은 사례가 있다.

### 문서 구조 작성 지침

- **확인된 결과.** Google, Microsoft, GOV.UK, NASA와 W3C 지침은 한 문장에 담긴 생각의 수, 행위자, 조건, 가정, 정보 순서와 제목 계층을 각각 확인하도록 안내한다.
- **적용 한계.** 기술 문서, 사용자 스토리, 요구사항과 웹 문서 지침이며 한국어 생성문을 고친 뒤 품질 향상을 측정한 실험은 아니다.

### Unicode 관련 GitHub 이슈

- **확인된 결과.** 무차별 문자 치환이 사용자 문구와 코드까지 손상한 사례가 있다.
- **적용 한계.** 특정 Claude Code 버전과 편집 경로의 사용자 보고다.

### 가운뎃점과 이모지 표준 및 접근성 지침

- **확인된 결과.** 가운뎃점은 한국어 문장부호이고 이모지는 Unicode 텍스트 표현이다. 이모지는 문맥과 대체 설명을 확인해야 한다.
- **적용 한계.** 해당 문자의 빈도로 AI 작성 여부를 판정한 한국어 품질 연구는 아니다.

특정 프롬프트 한 줄이나 금칙어 목록이 번역투 발생률을 얼마만큼 줄이는지는 확인되지 않았다. 위 후보가 AI 작성문에서 얼마나 자주 나타나는지 비교한 한국어 말뭉치 연구도 찾지 못했다. 후보 목록은 저장소에서 관찰된 실패와 영어 개념을 한 단어로 고정하기 쉬운 지점을 검토하기 위한 것이며 AI 작성 여부를 판별하는 자료가 아니다. 가장 강한 결과도 제한된 글 종류와 평가자에서 얻었으므로, 대상 프로젝트의 실제 문구로 기준 성능과 변경 후 결과를 비교해야 한다.

## 조사 반복과 중단 근거

기존 네 차례에 가운뎃점과 이모지를 다룬 세 차례, 문장 사이의 관계를 다룬 한 차례, 문장 자체의 뜻을 다룬 한 차례, 문맥에 따라 달라지는 표현을 다룬 네 차례와 긴 문단 구성을 다룬 한 차례를 더해 모두 열네 차례 검색과 원문 대조를 수행했다.

1. 한국어 번역투, 공공언어, AI 문체, 문장부호에서 오류 분류를 찾았다.
2. 실제 생성 개입과 사람 평가에서 장르별 참조, 자연 문체 선택, 다차원 평가를 찾았다.
3. 문장 구조, 용어 표준화, 유니코드와 키보드에서 자동 검사와 문자 보존의 구분을 찾았다.
4. 기술 문서, UI 한국어, 글의 전개를 추가 검색했다.
5. 국립국어원에서 가운뎃점의 문장부호 용례를 확인했다.
6. Unicode와 W3C에서 이모지의 문자 정의와 접근성 조건을 확인했다.
7. 이모지의 채널별 사용 지침과 두 문자를 AI 작성 표지로 볼 직접 근거를 추가 검색했다.
8. 문단의 한 가지 생각, 조건과 행동의 순서, 행위자와 목표, 가정과 제목 계층을 다룬 공식 작성 지침을 대조했다.
9. 한 문장에 담긴 생각의 수, 복문을 나눌 조건, 주체와 행동, 생략된 전제를 다룬 공식 작성 지침을 대조했다.
10. `경로`와 `공개 저장소`가 파일 위치, 제품 표시 유형과 일반적인 인터넷 배포 상태를 각각 가리키는 용례를 대조했다.
11. `유효성`, `정합성`, `가시성`과 `루브릭`이 품질, 데이터, 제품 설정과 교육 평가에서 쓰이는 조건을 확인했다.
12. `지원`, `보장`처럼 여러 행동을 가리키는 동사와 정보를 더하지 않는 수식어를 공식 제품 문서와 저장소 지침에서 대조했다.
13. 쉬운 공공언어의 문맥 오류, 명사 나열과 피동 표현을 다시 검색하고 저장소 변경 이력의 대상, 역할, 결과 누락과 비교했다.
14. 긴 문단, 한 문단의 중심 내용, 훑어보기, 여백, 목록 선택과 Markdown 문단 구분을 공식 지침 및 명세에서 대조했다.

마지막 검색에서는 긴 문단을 고정된 글자 수로 실패 처리할 근거가 나오지 않았다. 문단의 중심 내용, 중요한 정보의 위치, 문단 사이의 관계와 문서 형식에 맞는 구분 방법을 함께 확인해야 한다는 결론으로 자료가 모여 조사를 끝냈다.

## 검토한 출처와 시점

- 국립국어원, [쉬운 공공언어 쓰기 길잡이](https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=399&mn_id=46&pageIndex=10), 2015-02-13 최종 수정본, 2026-07-17 확인.
- 국립국어원, [한눈에 알아보는 공공언어 바로 쓰기](https://korean.go.kr/front/etcData/etcDataView.do?etc_seq=699&mn_id=&pageIndex=1), 2024-06-04 최종 수정본, 2026-07-17 확인.
- Microsoft, [Korean Localization Style Guide](https://learn.microsoft.com/ko-kr/globalization/reference/microsoft-style-guides), 2025-04-25 갱신 안내, 2026-07-17 확인.
- Riley 외, [Translationese as a Language in “Multilingual” NMT](https://aclanthology.org/2020.acl-main.691/), ACL 2020, 2026-07-17 확인.
- Park·Padó, [Multi-Dimensional Machine Translation Evaluation](https://aclanthology.org/2024.lrec-main.1024/), LREC-COLING 2024, 2026-07-17 확인.
- Shaib 외, [Detection and Measurement of Syntactic Templates in Generated Text](https://aclanthology.org/2024.emnlp-main.368/), EMNLP 2024, 2026-07-17 확인.
- Go 외, [XDAC](https://aclanthology.org/2025.acl-long.1108/), ACL 2025, 2026-07-17 확인.
- Kim 외, [Detecting LLM-Generated Korean Text through Linguistic Feature Analysis](https://aclanthology.org/2025.acl-long.1030/), ACL 2025, 2026-07-17 확인.
- Park·Han, [LREAD v3](https://arxiv.org/abs/2601.19913), 2026-03-17 개정본, 2026-07-17 확인.
- Czuma, [Em-ergence of the em-dash](https://arxiv.org/abs/2606.29540), 2026-06-28 제출본, 2026-07-17 확인.
- GitHub, [Agentic Workflows Markdown reference](https://github.github.com/gh-aw/reference/markdown/), 2026-07-17 확인.
- Anthropic Claude Code, [Unicode 문자 변형 이슈 #1599](https://github.com/anthropics/claude-code/issues/1599), 2025-06-04 등록본과 후속 재현, 2026-07-17 확인.
- 국립국어원, [가운뎃점](https://www.korean.go.kr/nkview/nknews/200009/26_6.htm), 2026-07-17 확인.
- Unicode Consortium, [Unicode Technical Standard #51](https://www.unicode.org/reports/tr51/), Version 17.0, Revision 29, 2025-09-04 개정본, 2026-07-17 확인.
- W3C, [H86: Providing text alternatives for emojis, emoticons, ASCII art, and leetspeak](https://www.w3.org/WAI/WCAG21/Techniques/html/H86), 2026-07-17 확인.
- Microsoft, [Emoticons and emoji](https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/e/emoticons-emoji), 2026-04-11 갱신본, 2026-07-17 확인.
- Google, [Paragraph structure](https://developers.google.com/style/paragraph-structure), 2024-10-15 갱신본, 2026-07-27 확인.
- Google, [Sentence structure](https://developers.google.com/style/sentence-structure), 2024-10-15 갱신본, 2026-07-27 확인.
- GOV.UK, [Writing user stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories), 2026-07-27 확인.
- NASA, [How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/), 2026-07-27 확인.
- Microsoft, [Writing tips](https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips), 2023-06-14 갱신본, 2026-07-28 확인.
- GOV.UK, [Use clear language](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/), 2026-07-28 확인.
- GOV.UK, [Functional Standards writing style guide](https://www.gov.uk/government/publications/handbook-for-standard-managers/functional-standards-writing-style-guide), 2024-09-30 발행본, 2026-07-28 확인.
- W3C, [Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/), 2026-07-27 확인.
- GitHub, [프로필에서 기여](https://docs.github.com/ko/account-and-profile/concepts/contributions-on-your-profile), `공개 저장소` 용례 확인, 2026-07-28 확인.
- GitHub, [조직에서 데이터 유출 방지](https://docs.github.com/ko/code-security/tutorials/secure-your-organization/prevent-data-leaks), `퍼블릭 리포지토리` 용례 확인, 2026-07-28 확인.
- Microsoft, [Power Pages의 사이트 가시성](https://learn.microsoft.com/ko-kr/power-pages/security/site-visibility), 2025-05-08 갱신본, 2026-07-28 확인.
- 국가법령정보센터, [선원법 적용범위](https://www.law.go.kr/법령/선원법), 법률 적용 대상의 `범위` 용례 확인, 2026-07-28 확인.
- 국가법령정보센터, [근로기준법의 권리 보장](https://www.law.go.kr/법령/근로기준법), 법률상 권리의 `보장` 용례 확인, 2026-07-28 확인.
- 국가법령정보센터, [항공정보 품질관리 지침의 유효성 정의](https://law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000238114), 시험 방법의 `유효성` 정의 확인, 2026-07-28 확인.
- 공공데이터포털, [국토교통부 세계항공사 코드](https://www.data.go.kr/data/15061951/fileData.do), 2026-02-26 수정본, 2026-07-28 확인.
- 국립국어원, [한국어교원 교육기관 평가인증 타당성 연구](https://www.korean.go.kr/common/download.do?c_file_name=6dfb6914-dc17-4829-87a0-ceba40e8fdfd_0.pdf&file_path=reportData&o_file_name=%ED%95%9C%EA%B5%AD%EC%96%B4%EA%B5%90%EC%9B%90+%EA%B5%90%EC%9C%A1%EA%B8%B0%EA%B4%80+%ED%8F%89%EA%B0%80%EC%9D%B8%EC%A6%9D+%ED%83%80%EB%8B%B9%EC%84%B1+%EC%A0%90%EA%B2%80+%EB%B0%8F+%EA%B5%90%EC%9B%90%EC%9E%90%EA%B2%A9%EC%A0%9C%EB%8F%84+%EC%9A%B4%EC%98%81+%ED%9A%A8%EC%9C%A8%ED%99%94+%EB%B0%A9%EC%95%88+%EC%97%B0%EA%B5%AC+%EA%B2%B0%EA%B3%BC%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf), 2026-07-28 확인.
- 한국교육학술정보원, [국가수준 초중학생 디지털 리터러시 수준 측정 연구](https://www.keris.or.kr/main/ad/pblcte/selectPblcteRRInfo.do?mi=1138&pblcteSeq=13834), 2026-07-28 확인.
- Microsoft, [Windows 10 지원 종료](https://learn.microsoft.com/ko-kr/microsoft-365-apps/end-of-support/windows-10-support), 제품 유지보수 기간의 `지원` 용례 확인, 2026-07-28 확인.
- Microsoft, [Windows App SDK 릴리스 채널](https://learn.microsoft.com/ko-kr/windows/apps/windows-app-sdk/release-channels), 릴리스 채널별 제공 기간의 `지원` 용례 확인, 2026-07-28 확인.
