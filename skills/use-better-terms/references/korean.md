# Korean Wording Criteria

## Literal translation and hidden actors

Korean words alone do not make a sentence natural. An English subject pattern or a stack of nouns can hide actions and relationships. Use verbs and Korean particles to show who reads, decides, and records; do not make a document or feature appear to exercise judgment or responsibility.

This sentence needs human input because it does not identify who checks which input or what changes after an error:

> 이 문서는 입력 품질 향상과 오류 처리 개선을 수행한다.

If the evidence establishes these actions, write:

> 변환기는 각 행의 날짜를 검사한다. 날짜 형식이 맞지 않으면 행 번호와 입력값을 오류 메시지에 기록하고 변환을 중단한다.

An uncataloged noun can also hide several actions. If evidence distinguishes a scheduler selecting retries from a processor recording outcomes, this sentence collapses them into `업무`:

> 업무를 안정적으로 처리하고 업무를 관리한다.

Write each verified action and object:

> 스케줄러는 재시도할 항목을 선택한다. 처리기는 성공 여부와 처리 시각을 기록한다.

If `업무` is instead an approved classification name, preserve that name. If its meaning is undefined, identify what must be established before rewriting it.

## Active, passive, and state descriptions

Do not prefer one voice universally. Consider active wording first when the verified actor or responsibility matters to a reader's decision or next action. Consider passive wording or a state description when the resulting state is central and naming the actor adds no useful information.

When both forms preserve the verified meaning, write actual alternatives and compare responsibility, focus, the order of conditions and results, and the reader's next action. Record the choice. Do not invent an actor to form an active sentence or use passive wording to hide responsibility that must be established.

Voice comparison does not apply to punctuation, code notation, or exact names merely because they triggered a warning. Judge those warnings through the applicable criteria.

## English common nouns inside Korean prose

Keep exact service names, API names, commands, identifiers, and approved technical terms. For ordinary roles, stages, states, and judgments, ask whether English makes the meaning more precise. Replace redundant parenthetical translations and English nouns that hide actions with natural Korean used by the repository.

When the document defines the roles and outputs, replace:

> reviewer가 findings를 확인하고 approval owner에게 전달한다.

with:

> 검수자가 검토 결과를 확인하고 승인 책임자에게 전달한다.

Keep an exact API name such as `Response.create`; explain the caller's action and the values to record on failure in Korean.

## Repetition and referents

Repeated terminology can preserve a reference. Here `전력 소비량` denotes the same measurement; substituting another noun could suggest a different metric:

> 전력 소비량을 시간별로 측정한다. 전력 소비량이 기준을 넘으면 경고를 기록한다.

Here repetition of `업무` does not establish whether checking, approval, and recording concern the same thing:

> 업무를 확인하고 업무를 승인한 뒤 업무를 기록한다.

If evidence distinguishes the actors and objects, write:

> 담당자는 요청 내용을 확인한다. 승인 책임자는 요청을 승인한다. 기록기는 승인 여부를 저장한다.

## Relationships across sentences

Korean can omit subjects and summarize earlier clauses; check that referents, roles, assumptions, and decision states remain identifiable across sentences. Verify that an earlier result supplies the next action's starting condition and that necessary exceptions and assumptions precede the actions using them.

This pair needs human input because the responsible person, approval, and deployment condition are undefined:

> 검수자가 수정안을 제안한다. 담당자는 승인된 내용을 배포한다.

If the relationship is established, write:

> 검수자가 수정안을 제안한다. 승인 책임자가 수정안을 승인하면 배포 담당자가 승인된 문구를 배포한다.

Distinguish an omitted actor from an unknown actor. If the execution record states `검수자가 초안을 승인한 뒤 배포 담당자가 배포했다`, restore that actor and condition in this sentence:

> 초안이 승인되면 배포한다.

> 검수자가 초안을 승인하면 배포 담당자가 승인된 초안을 배포한다.

Without evidence for the approver and deployment condition, do not complete this sentence by guessing:

> 담당자가 적절한 시점에 검토를 완료하고 배포한다.

Ask who approves and which conditions permit deployment. Evidence not yet inspected is not evidence known to be absent.

Keep observations distinct from predicted effects. A log showing failures does not establish that changing retention will reduce them:

> 현재 로그에서 실패 건수를 확인했다. 보존 기간을 바꾸면 실패 건수가 줄어들 것이다.

The first sentence is an observation; the second is an unverified prediction. A claim about the change needs evidence comparing the same conditions after applying it, with a defined observation time.

## Meaning units in long paragraphs

Split only when distinct subjects, evidence, conditions, decision states, or next actions force readers to reconstruct relationships. Access permission, log retention, and deployment approval need separate paragraphs when their evidence and follow-up actions differ. A long paragraph can remain intact when it describes one execution sequence from input checks through error recording, storage, and processed-count recording.
