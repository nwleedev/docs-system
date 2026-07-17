# use-words-review 설치와 AGENTS 설정

`use-words-review`는 문서, README, UI 문구, 접근성 문구, 코드 주석, 커밋, PR, 이슈 문구와 릴리스 노트를 공개하기 전에 범용 서브에이전트로 검토하는 스킬이다. 독자에게 맞지 않는 작업 보고, 내부 작업 문구의 혼입, 근거 없는 설명, 개인 경로와 비공개 식별자, 번역체와 불필요한 기호를 찾는다. 검토는 파일을 수정하지 않으며, 수정은 별도 승인을 받아 진행한다.

## 파일 역할

- [`SKILL.md`](SKILL.md)는 자동 호출과 명시 호출의 진입점이며 검토 절차를 모두 포함한다.
- [`references/examples.md`](references/examples.md)는 한국어 표현이나 허용 여부가 모호한 사례를 검토할 때만 읽는 합성 예시다.
- 이 README는 사람이 스킬을 설치하고 대상 저장소의 AGENTS에 필요한 지침을 적용할 때 사용한다. 스킬 실행 시 자동으로 읽힌다고 가정하지 않는다.

## 설치

스킬 디렉터리 전체를 사용하는 도구가 탐색하는 위치에 복사한다.

- Codex 저장소 설치: `.agents/skills/use-words-review/`
- Codex 사용자 설치: `$HOME/.agents/skills/use-words-review/`
- Claude Code 저장소 설치: `.claude/skills/use-words-review/`
- Claude Code 사용자 설치: `$HOME/.claude/skills/use-words-review/`
- 플러그인 배포: `<plugin-root>/skills/use-words-review/`

도구별 탐색 위치와 우선순위는 [Codex 스킬 문서](https://developers.openai.com/codex/skills)와 [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)에서 현재 동작을 확인한다. 이 저장소의 `skills/use-words-review/`는 배포 원본이며 그 위치만으로 자동 탐색된다고 가정하지 않는다.

다음 순서로 설정한다.

1. 스킬 디렉터리를 선택한 위치에 설치한다.
2. 새 세션에서 스킬이 목록에 나타나거나 명시 호출되는지 확인한다.
3. 아래 지침 중 대상 저장소에 적용되는 부분을 기존 AGENTS에 합친다.
4. 공개 산출물 변경을 하나 준비하고 명시 호출과 자동 선택을 각각 확인한다.
5. 리뷰 결과가 파일을 바꾸지 않고 상태와 근거만 반환하는지 확인한다.

호출 지침만 먼저 복사하지 않는다. 설치되지 않은 스킬을 AGENTS가 요구하면 실행자가 존재하지 않는 도구를 호출하게 된다.

## AGENTS에 적용할 기본 지침

아래 블록은 배포를 위한 기본안이다. 저장소에 이미 같은 책임을 가진 절이 있으면 새 절을 만들지 말고 기존 절에 합친다. 제목과 배치는 바꿀 수 있지만, 적용 대상으로 선택한 규칙의 동작을 약화하지 않는다.

`Public Outputs`와 `Words Review`는 문서, 코드 주석, 커밋 또는 사용자 문구를 공개하거나 추적하는 저장소에 적용한다. `Writing Natural Korean`은 한국어 산출물을 작성하는 저장소에 적용한다.

### 공개 산출물과 근거

```markdown
## Public Outputs

- Treat repository content that is committed or shared, including README files, documentation, source code and comments, commit and pull-request text, issue text, release notes, user-visible text, and assistive text, as public unless the repository explicitly classifies it otherwise.
- Before writing, identify the intended readers, what they need to understand or do, and the artifact that owns the information.
- Base public statements on verified repository evidence, sourced facts, approved decisions, or approved public wording. Do not use a user prompt, agent instruction, task description, work note, review criterion, requested format, tool condition, or progress report as publishable source text.
- Do not quote, copy, or lightly rewrite internal work inputs into titles, filenames, headings, product facts, decision reasons, comments, or user-visible text. When the underlying information is needed, write it from a publishable source for the intended readers.
- Keep credentials, personal absolute paths, private URLs, private project identifiers, internal-only names, unresolved decisions, review notes, and publication checklists out of public outputs. Use repository-relative paths when readers need a path.
- Preserve exact source text only when the artifact requires it, such as a human-owned requirement, approved user-visible wording or quotation, prompt-processing evaluation data, a minimal reproduction input, or an access-controlled log that will not be committed. Keep only the necessary portion.
- Write commit messages from the actual change and its reason. Write user-visible and assistive text from the task the user is performing, the purpose of the element, and the state the user needs to understand.
```

### 자연스러운 한국어

```markdown
### Writing Natural Korean

- Do not write generic boilerplate that could be pasted into another project unchanged. Reflect the actual readers, repository, and decision at hand.
- Make every sentence provide evidence, record a decision, state an action, or supply necessary context. Remove introductions, conclusions, summaries, and transitions that merely repeat nearby text.
- Avoid stock phrases and inflated modifiers that add no meaning. Let the content determine subsection length and structure instead of forcing repeated transitions or arbitrary groups.
- Do not translate English word by word. Identify the referent, action, conditions, and responsible actor, then rewrite the sentence in natural Korean.
  - Remove forms such as `~에 대해서`, `~에 의해서`, `~에 있어서`, or `~와의` when a suitable particle or a direct sentence preserves the meaning.
  - Make the responsible actor the subject when a passive construction hides responsibility.
  - Avoid English-style inanimate subjects, strings of nouns, unnecessary passive constructions, and mixed forms such as `사용자-facing`.
- Do not map an English technical term to one fixed Korean word. Describe the actual action or condition in context, and keep an established term when it is precise in the relevant field.
- Before publishing, read the text as the intended readers. Rewrite expressions that a Korean speaker would not use in the same situation, sentences that sound polished but add no information, and literal translations that reveal the English source.
```

구체적인 상투어와 영문 용어 대응은 AGENTS를 길게 만들기보다 스킬의 합성 예시에서 검토한다. 반복해서 발생하고 상시 작성 전에 알아야 하는 실패가 확인되면 AGENTS 기본안에 추가할지 별도로 검토한다.

### 공개 전 리뷰

```markdown
### Words Review

- After creating or changing a public output, and before committing or sharing it, use the `use-words-review` skill. Also use it when the user explicitly requests a wording or public-output review.
- Give the review the changed outputs, intended readers, applicable repository rules, and candidate commit or publication text. Provide exact prompt text only when an explicit comparison is required, and minimize and redact it first.
- Have the skill delegate semantic review to one available general-purpose subagent without creating or requiring a named reviewer definition. Keep the delegation read-only when the host supports tool restrictions.
- Verify every returned finding against the actual change in the main agent, and confirm that the reviewer did not modify files.
- Report `pass`, `needs revision`, `needs human input`, or `not applicable` with a location and reason. Do not edit the reviewed output unless the user separately authorizes the change.
- If no general-purpose subagent is available or write access cannot be restricted, report that limitation instead of claiming independent or tool-enforced read-only review.
```

### 문서 작업과 연결

설계 문서나 개발 지침의 소유 규칙과 검증 규칙이 이미 있다면 그 규칙을 `use-words-review`로 대체하지 않는다. 기존 `Documentation Work` 또는 같은 책임의 절에 다음 연결만 추가한다.

```markdown
### Documentation Review

- Apply the repository's document-type rules before treating a document as complete. Then run `use-words-review` on the changed public document before committing or sharing it.
- Keep requirement ownership, sourced research, approved decisions, implementation planning, and verification evidence in their owning documents. Do not copy prompt wording between documents for traceability.
- Treat document validation and wording review as separate checks. Passing one does not prove the other.
```

## 기존 AGENTS와 병합

1. 현재 AGENTS에서 독자, 공개 산출물, 한국어 작성, 문서 검토와 스킬 호출을 담당하는 절을 찾는다.
2. 같은 책임의 절이 있으면 위 블록의 빠진 동작만 합친다.
3. 저장소가 만들지 않는 산출물이나 사용하지 않는 문서 체계에 관한 문장은 제외한다.
4. 저장소 고유의 명령, 도구, 경로와 승인 절차는 실제 설정을 확인한 뒤 추가한다.
5. 스킬의 입력 수집, 서브에이전트 프롬프트와 상태 집계 절차는 AGENTS에 복사하지 않는다. 해당 절차는 `SKILL.md`가 소유한다.
6. 합친 뒤 AGENTS만 읽은 새 실행자가 언제 글쓰기 원칙을 적용하고 언제 스킬을 호출할지 확인한다.

README의 기본안과 대상 AGENTS에 적용된 문구가 비슷한 것은 배포 과정에서 발생하는 의도된 복사다. 대상 저장소는 채택한 지침을 자신의 현재 규칙으로 관리하고, 이 README의 변경을 자동으로 따라간다고 가정하지 않는다.

## 범용 서브에이전트가 없는 환경

스킬은 사용할 수 있는 범용 서브에이전트에 실행 시점의 역할과 기준을 전달한다. 별도의 전용 에이전트 파일을 요구하지 않는다. 호스트가 범용 서브에이전트를 제공하지 않으면 주 에이전트가 같은 기준으로 검토할 수 있지만, 결과에 독립 검토가 수행되지 않았다고 명시해야 한다.
