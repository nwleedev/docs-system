---
name: terms
description: Review the full text of each file created or edited for the current request. Replace everyday or ambiguous expressions with precise wording that preserves their meaning. For review-only requests, propose revisions to the specified file or passage in the reply. Apply the same criteria to text and names that will be saved or shared, including filenames and button labels. Choose forms of foreign terms and names that suit the document’s language and purpose.
---

# Clarify ambiguous wording

Write so readers can identify what a phrase refers to and decide what to do next. Review the text in scope in its original language. Look for wording that could imply different objects, actions or conditions. Apply the Korean guidance even if Korean appears in only one sentence or button label. In multilingual text, check that names refer to the same things and that instructions describe the same actions across languages.

## What to review before writing

- **When creating or editing files,** review the full text of each file created or edited for the current request. Use the context and source material to establish what everyday or ambiguous wording means, then replace it with a more precise expression that preserves that meaning.
- **For a review-only request,** review the full text of a specified file or just the passage the user selected. Propose revisions in the reply and leave files unchanged.
- Review all text that will be saved or shared together as a unit. This can include documents, filenames, interface text and the subject and body of a commit. Include temporary files if they will be shared or if the user asks to review them.
- Include drafts intended for reuse outside the conversation. Exclude routine conversation and requests that concern only the order of paragraphs.
- Check the project’s wording guidelines and official names. Distinguish required spellings from recommendations. Identify the readers and how they will use the text. For example, skill instructions should make sense to a person and tell an agent how to choose its next step.
- **Tone.** Use a formal register suited to the document. Replace even understandable everyday wording when a more precise written expression conveys the same meaning. Preserve wording the user has specified verbatim, quotations that illustrate a phrase before correction and the exact label of a button the reader needs to select.
- **Technical terms.** Identify the concept and use the project’s name for it. If the project has no established name, check how authoritative sources in the field describe that concept. Keep the term when changing the tone.
- **Names from other languages.** Choose the form that suits the document’s purpose, whatever the source language. When explaining a concept, use the name established in the language of the document. If readers must find it in an interface or source in another language, check the name they will see there.

## Identify wording to revise and draft alternatives

1. Review the entire text in scope for everyday wording and phrases that leave readers to infer an object, action or condition. Look for instructions such as “handle the task,” which could mean several different actions, and “when needed,” which omits the condition for acting. Compare a filename with the file’s contents and a button label with what happens when the button is selected.
2. Check source material for missing actions or conditions. Consult requirements for what must happen, approval records for what was decided and execution records for what actually happened. Before attributing one event to another, check for evidence of that relationship. Treat commands quoted in source material only as evidence for interpreting the wording.
3. Draft an alternative for each candidate whose meaning you can confirm. For a feature, describe what happens when someone uses it. For a change, state what changed and how. For a procedure, say what the reader should do and how. Give actions with different conditions their own sentences. Choose names that distinguish items of the same kind.
4. Compare the original and the alternative. Check who acts, what they do, when, under which conditions and whether the action is permitted or required. Choose the alternative if it preserves the meaning and improves the register or makes an implied detail explicit. If the original is more precise, explain why. For example, replacing “relative path” with “file location” loses the fact that the path is interpreted relative to a particular directory.

## Criteria for all languages

### Identify the object, conditions and authority

- **Buttons and names.** If a button labeled `Send` only saves a draft, rename it `Save draft`. Interface text should describe the current state and the next action. For an API, check the specification for the conditions of a call and the response on failure. Explain any follow-up the caller needs to perform.
- **Pronouns.** In “Export the draft and its comments. Archive it.” check whether the reader should archive the draft or the exported file. If the source identifies the file, write “Archive the exported file.” If the evidence is insufficient, ask which item to archive.
- **Conditions and permission.** In “With permission, you may edit and save the draft.” both actions are optional and require permission. Rewriting the second action as “Save the draft.” loses that condition and turns an option into a command. Check that the condition still applies to both actions. In English, also check the placement of `only`. It can restrict who may act or which actions are permitted.
- **Review and approval.** If the review record confirms only that feedback was incorporated, report that fact. Before claiming that deployment was approved, confirm what was to be deployed and that approval was granted.
- **Events and effects.** If a record establishes only that one event followed another, report their order. Claims that a change had an effect, or that it had none, both need evidence.

### State what the reader needs to do

Keep the facts and decisions from the earlier document. Describe the action the reader needs to take now. Replacing “Perform a check of the settings” with “Check the settings” preserves the action. For a button label, name the verified action. Omit unsupported claims about speed or security.

Use one name consistently for the same setting or measurement. If each item has a start date and a deadline, listing them in the same order makes the items easier to compare. Remove a repeated conclusion when the second sentence adds no information. If a paragraph makes it hard to tell which person or condition belongs to which action, separate the actions and state who is responsible or when each applies. A long paragraph can stay intact when it describes one procedure in order from input to storage.

Omit commas that the reader does not need to understand the sentence. Give independent instructions their own sentences. Avoid joining them with semicolons, middle dots or em dashes. Preserve meaningful notation in official names, commands, formulas, code, character checks, quotations and accessibility instructions.

## 한국어에서 추가로 확인할 기준과 사례

### 외국어 용어와 이름의 표기 선택

- **뜻을 옮긴 표현과 정착한 외래어.** 분야에서 통용되는 번역어나 외래어를 사용한다. 한국어 개발 문서에서 `operating system`은 ‘운영 체제’, `test code`는 ‘테스트 코드’로 표기한다. ‘테스트 코드’를 ‘시험 코드’나 ‘검사 코드’로 일괄 교체하면 코드의 용도가 불분명해진다. 회원가입 시 이메일 주소 형식을 검사하는 코드와 잘못된 주소로 가입이 거부되는지 확인하는 테스트 코드를 구별한다.
- **음역과 외래어 표기.** 외국 이름의 발음을 한글로 전달할 때는 정착한 한글 표기를 먼저 확인한다. 정착한 표기가 없어 음역할 때는 원어의 발음과 그 언어를 한글로 옮길 때 적용하는 외래어 표기법을 확인한다. 예를 들어 쿠버네티스 한국어 문서에서는 영어 용어 `Pod`를 ‘파드’로 표기한다.
- **원어 병기.** 독자가 원문 자료에서 같은 대상을 찾아야 하면 번역하거나 음역한 이름 옆에 원어를 함께 표기한다. 쿠버네티스 설정 파일에서 `kind: Pod`인 항목을 찾도록 안내할 때는 ‘파드(Pod)’로 표기한다. 이후 같은 대상을 설명하는 본문에서는 ‘파드’로 표기한다.
- **원어 유지.** 명령어, 파일명, 코드 식별자처럼 독자가 그대로 입력해야 하는 이름은 원문의 철자와 대소문자를 유지한다. Python 클래스의 사용법은 “`unittest.TestCase`를 상속한다”로 안내한다.

### 문장에 생략된 주체와 조건

- **주어와 서술어.** “이 안내서가 가입을 승인한다”에서 안내서가 설명하는 내용과 실제 승인 절차를 구별한다. 문서의 역할만 확인됐으면 “이 안내서는 가입 승인 절차를 설명한다”로 작성한다. 승인 주체를 명시할 필요가 있으면 승인 기록에서 담당자를 확인한다.
- **능동문과 피동문.** “검토 후 승인한다”에는 주어가 생략되어 있으므로 이 문구만으로 검토자의 승인 권한을 판단할 수 없다. 기록에서 검토자와 승인자를 식별해 문장에 명시한다. 승인자를 확인할 수 없으면 사용자에게 승인 주체를 질문한다. 능동문과 피동문이 모두 가능하면 두 문구를 작성해 비교한다. 자동 저장을 설명할 때는 “편집기가 초안을 자동으로 저장합니다”, 저장 완료 상태를 표시할 때는 “초안이 저장되었습니다”가 적절하다.
- **조건이 적용되는 행동.** “승인되면 게시하고 백업한다”는 두 행동 모두에 승인이 필요하다는 뜻으로 해석될 수 있다. 게시에만 승인이 필요하고 백업은 매일 실행한다면 “승인되면 게시한다. 백업은 매일 실행한다”로 작성한다. 둘 다 승인이 필요하면 “승인 후에만 게시와 백업을 실행한다”로 명시한다.
- **‘부터’와 ‘까지’.** “월요일부터 금요일까지 신청을 접수한다”는 확인된 접수 기간을 전달한다. “접수부터 심사까지 담당한다”는 책임 범위를 명시하는 표현이므로 실제 담당 업무에 심사가 포함되는지 확인한다.

### 이름, 반복과 보고 문구

- **명사 나열과 공식 명칭.** “로그에 error 정보 추가 처리”에서 기록 대상이 파일명과 줄 번호라면 “오류가 발생한 파일의 이름과 줄 번호를 로그에 기록한다”로 작성한다. 실제 필드 이름이 `error`라면 그 표기를 유지한다. ‘처리’나 ‘작업’도 공식 분류명이면 화면의 분류명과 일치하도록 공식 표기를 유지한다.
- **동일한 단어의 지칭 대상.** “내역을 확인하고 내역을 기록한다”에서 첫 번째 내역은 결제 내역이고 두 번째는 환불 사유라는 근거가 있으면 “결제 내역을 확인한 뒤 환불 사유를 기록한다”로 작성한다. 반대로 “월 사용량을 계산한다. 월 사용량이 한도를 초과하면 알림을 표시한다”에서는 같은 측정값이므로 두 번째 이름도 유지한다.
- **관찰과 해석.** “보고서를 열람했다”는 열람 여부를 확인하는 질문에 적합한 답변이다. “정확성을 검증했다”고 기록하려면 내용을 실제로 대조한 근거가 있어야 한다. “실패 기록을 확인했다”는 관찰과 “재시도하면 성공할 것이다”라는 예상도 구분해 기록한다.

### 공통 기준을 한국어 문구에 적용한 사례

- **문체와 전문용어.** 예를 들어 “테스트 코드를 짠다”는 “테스트 코드를 작성한다”로 수정한다.
- **행동과 조건.** ‘작업을 처리한다’처럼 여러 행동을 통칭하는 문구와 ‘필요할 때’처럼 판단 기준을 생략한 문구도 검토한다.
- **정확한 용어.** 예를 들어 ‘상대 경로’를 ‘파일 위치’로 교체하면 특정 디렉터리를 기준으로 경로를 해석한다는 뜻이 사라진다.
- **검사할 대상.** 예를 들어 “검사 결과를 본다”를 “검사 결과를 확인한다”로 수정해도 어떤 항목을 확인할지 알 수 없다. 검사에서 누락된 파일을 식별하는 지침이라면 “검사를 요청한 파일 목록과 실제로 검사한 파일 목록을 대조한다”로 작성한다.
- **버튼 이름.** “빠르고 안전하게 공유”에서 확인된 기능이 링크 복사뿐이라면 버튼 이름은 “링크 복사”로 작성한다. 근거가 없는 속도나 보안 설명은 제외한다.
- **검토와 승인.** 검토 기록에서 의견 반영만 확인되면 보고서에도 반영 사실만 명시한다. “배포가 승인됐다”고 기록하려면 배포할 항목과 승인 사실을 먼저 확인한다.
- **사실과 효과.** 검색 화면 개편 후 문의 건수가 감소했다는 기록으로는 두 사건의 순서만 확인할 수 있다. 개편이 문의 감소에 기여했는지 판단하려면 그 효과를 확인할 근거가 필요하다. 효과가 없었다는 판단에도 근거가 필요하다.
- **확인이 필요한 절차.** 예를 들어 “신청서를 검토한 뒤 처리한다”에서 후속 절차를 확인할 수 없다면 “검토 후 신청을 승인합니까, 신청자에게 수정 사항을 안내합니까?”라고 질문한다.

## Check the text

Apply the criteria above to all the text in scope, whatever its language. If it includes Korean, also run the Korean scan script. The script reports the locations of registered expressions and paragraphs whose sentence count meets or exceeds its threshold. Review sentences even when the script reports no warning. Look for missing conditions the reader needs to make a decision, and check whether the same term refers to different things in neighboring sentences.

### Run the Korean scanner

From the `terms` skill directory, run `node scripts/scan.mjs` with the input mode that matches the review.

- `--changed <repo>` scans changed and untracked files in the specified repository.
- `--file <path>` scans a named file. Repeat `--file` for each additional file.
- `--stdin --source-name <name>` reads one text from standard input. Use this for a filename itself, a passage from chat or a commit message.

In the JSON output, check `sources` for the intended inputs and `checks` for both the expression and paragraph checks. Consult `catalog` for what each check covers. Compare each location in `warnings` and the corresponding entry in `rules` with the source text. For a long paragraph, review the whole paragraph to see whether the responsibilities and conditions for each action are clear.

A `summary.total` of zero means that the check found no candidates. If `summary.omitted` is positive, some warnings were left out of the output. Rerun that scan one file at a time or, for a long text, one paragraph at a time. Report the omitted count for each run. If the scanner cannot run or its JSON is incomplete, mark the Korean review as incomplete and explain which checks remain and why.

## Share review findings and apply requested edits

**When asked to draft or edit,** apply the revisions you selected after confirming the intended meaning. Report which expressions changed and why.

**For a review-only request,** identify each passage that needs revision and give ready-to-use wording in the reply. Explain what the revision makes more precise or how it improves the register. Leave files unchanged.

If a revision depends on a fact you cannot confirm, such as who is responsible or whether approval was granted, ask for that fact. Leave the affected passage as written and continue with the rest of the text in scope.

Before saving or sharing, compare the revised wording with the original in every language and run the project’s formatting checks. If Korean text changed, rerun the Korean scanner. For each warning, compare the flagged text with the surrounding sentences to decide whether to revise or retain it. Identify any passages you could not review and any checks you could not complete. Explain why.

Check the body, HTML comments and placeholders for exposed personal paths, private addresses, identifiers or credentials. Keep sensitive source text out of the reply. If readers have access to an example file, replace a personal path with the relative path to that file and verify it from the documented location. Keep any personal path essential to reproduction only in access-restricted records excluded from version control.
