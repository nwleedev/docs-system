# Template-Only Versus Examples Prompt Pack Strategy

## Metadata

- Status: Draft
- Date: 2026-06-18
- Supports: R31-R36

## Research Question

사용자가 "Next.js 애플리케이션 레포의 기술스택에 대해 올바른 코드 작성 방법, 소프트웨어 공학, 디자인 패턴, 모듈 아키텍처를 자세히 리서치+교차검증하고, 다양한 케이스의 best/anti pattern 예시를 전수 문서화하라"는 넓은 프롬프트를 입력했을 때, `docs/dev` 템플릿 강화만으로 충분한가? 아니면 `docs/dev/_commands` 같은 별도 재사용 프롬프트/런북 폴더가 필요한가?

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S34 | Documentation framework | Diátaxis: `https://diataxis.fr/`, `https://diataxis.fr/start-here/` | 2026-06-18 | Documentation has different user needs: tutorials, how-to guides, reference, and explanation. One artifact type should not carry all needs. | High; widely used documentation framework. |
| S35 | Docs-as-code platform docs | Backstage TechDocs: `https://backstage.io/docs/features/techdocs/`, `https://backstage.io/docs/features/techdocs/creating-and-publishing/` | 2026-06-18 | Docs-as-code keeps documentation close to code and can use templates/examples as reusable documentation assets. | High; official docs. |
| S36 | Prompt engineering official docs | OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-18 | Effective prompting needs clear instructions, reference grounding, task decomposition, and iteration because output is nondeterministic. | High; official OpenAI docs. |
| S37 | Prompting official docs | OpenAI Prompting guide: `https://developers.openai.com/api/docs/guides/prompting` | 2026-06-18 | Tone/role guidance belongs in system-level context, while task-specific details and examples belong in user/task context. | High; official OpenAI docs. |
| S38 | Prompt engineering official docs | Anthropic Claude prompting best practices: `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices` | 2026-06-18 | Prompting guidance emphasizes clear instructions, examples, structured context, and agentic workflows. | High; official vendor docs. |
| S39 | Prompt engineering official docs | Google Gemini prompt design strategies: `https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/prompts/prompt-design-strategies` | 2026-06-18 | Prompt design best practices include clear instructions, few-shot examples, contextual information, system instructions, structure, and iteration. | High; official Google Cloud docs. |
| S40 | Local governance | `docs/dev/README.md`, `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md` | 2026-06-18 | Existing governance and templates define owner routing and evidence discipline that can be extended by a future target-decomposition workflow. | High; local source of truth used as design input. |
| S41 | Worked source pack | `requirements.md`, `research/0002-concern-inventory.md`, `research/0004-portable-source-pack-workflow.md` | 2026-06-18 | The Next.js worked example demonstrates the coverage burden: granular targets, multiple owner folders, several open questions, and many best/anti patterns. | High; current design package. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Templates can enforce structure and audit fields, but they are not enough to teach a broad, high-variance workflow reliably. | S34 | S36, S39 | Confirmed | A sufficiently disciplined agent can still use templates, but reliability depends on examples and task decomposition. |
| Prompt/runbook packs should not become source of truth for current rules. | S35 | S40 | Confirmed | They should be reusable task launchers, with current rules still owned by owner folders. |
| Broad one-shot prompts should be decomposed into target derivation, evidence collection, routing, pattern coverage, detailed docs, and audit. | S36, S39 | S41 | Confirmed | The decomposition should be encoded in reusable prompts or runbooks. |
| Few-shot structure is useful for complex output shape, but worked source material should not live beside reusable command prompts. | S38, S39 | S41 | Confirmed | Source packs should stay in repository evidence or design packages; command files should stay stack-neutral. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. Templates only | Keep strengthening `_template.md` files and root README. | Simple source of truth; less folder sprawl; low governance overhead. | Broad prompt still depends on agent remembering the workflow; examples and prompt decomposition are implicit; high risk of shallow coverage for complex technology stacks. | Insufficient alone for reliable exhaustive target decomposition. |
| B. Prompt/runbook folder only | Add reusable prompts but do not strengthen templates. | Easy for agents to launch a broad task; task decomposition is explicit. | Prompts can drift; lacks hard audit fields and owner-folder routing if templates are weak. | Insufficient alone because it weakens evidence and rule-promotion governance. |
| C. Hybrid templates + `_commands` | Keep templates as normative schema and add optional `_commands` prompt/runbooks that show how to execute broad source pack workflows. | Templates preserve governance; commands decompose broad tasks; audit can verify coverage; source packs stay in repository/design evidence. | Requires clear ownership so commands do not become current rules or evidence stores. | Recommended. |

## Recommended Structure

The current implementation adds an optional `_commands` layer so broad prompts can be executed reliably from a short user request.

```text
docs/dev/
  _commands/
    README.md
    research-source-pack.md
    write-owner-guidance.md
    audit-source-pack-coverage.md
```

Ownership rules:

- `docs/dev/README.md` owns portable governance and completion rules.
- `docs/dev/_templates/**` owns normative document schemas.
- `docs/dev/repository/**` owns target repository evidence and source pack inventories.
- `docs/dev/_commands/**` owns non-normative reusable prompt files and runbooks.
- `docs/dev/_commands/**` must not own source packs, worked evidence, current rules, target repository facts, accepted decisions, or portable governance.

## Prompt Pack Contract

Each `docs/dev/_commands` prompt file declares:

| Field | Required Content |
| --- | --- |
| Purpose | Which phase it runs: target derivation, source reconstruction when applicable, evidence collection, owner routing, detailed guide writing, or audit. |
| Inputs | Explicit concern source when present, target repository path, technology stack evidence, existing docs/dev paths. |
| Required reading | `docs/dev/README.md`, repository evidence, relevant templates, source pack inventory. |
| Output contract | Exact files or tables to create/update. |
| Coverage gate | How to prove every explicit source item or derived development guidance target was processed. |
| Prohibited shortcuts | Sampling-only summaries, current-rule promotion without target evidence, stack examples as baseline. |
| Verification | Commands/reviews to run and audit rows to update. |

## Source Pack Placement Contract

Do not add `docs/dev/_commands/source-packs`. Source packs are evidence inputs and should be recorded in `docs/dev/repository/**` or a design/research package. Each source pack record should declare:

| Field | Required Content |
| --- | --- |
| Stack label | Example stack only, not portable baseline. |
| Source pack summary | Explicit item count when applicable, stable target ID or cluster range, persistence state. |
| Evidence map | Official docs, local repo evidence, public repo evidence, gaps. |
| Owner routing | Which items map to architecture, engineering, domain, evolution, ai, decisions, repository. |
| Pattern matrix | Best/anti example obligations by item group. |
| Open questions | Items that cannot become current rule yet. |
| Audit result | Pass/partial/gaps with source item coverage. |

## Decision

템플릿 강화만으로는 구현 가능성은 있지만, 사용자가 매우 넓은 한 문장 프롬프트를 입력했을 때 기술스택을 충분히 세밀한 development guidance target으로 분해하고 best/anti 예시까지 문서화하도록 안정적으로 유도하기에는 약하다. `data.txt`는 worked example의 입력일 뿐이며 portable baseline이 아니다.

권장안은 hybrid다.

1. 템플릿은 normative schema와 audit gate로 유지한다.
2. `docs/dev/_commands`를 추가해 재사용 가능한 prompt runbook을 두고, worked source pack은 `repository` evidence 또는 design package에 둔다.
3. `_commands`는 current rule이 아니라 "재사용 가능한 프롬프트 분해와 실행 런북"만 소유한다.
4. 실제 target repository의 current rule 승격은 여전히 `repository` evidence와 owner folder 문서가 담당한다.

## Implementation Result

This recommendation is implemented without adding stack-specific examples into core templates:

1. `docs/dev/_commands/README.md` defines ownership boundaries.
2. `docs/dev/_commands/research-source-pack.md` covers broad prompt decomposition.
3. `docs/dev/_commands/write-owner-guidance.md` covers owner-folder guidance writing from a target inventory.
4. `docs/dev/_commands/audit-source-pack-coverage.md` covers source-pack coverage audits.
5. The Next.js source pack remains in this design package and is not copied under `_commands`.
6. Completion audit and templates include portability checks that fail if an example stack becomes the default baseline.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | Template strengthening is necessary but not sufficient for reliable exhaustive execution of broad source pack prompts. | S34, S36-S41 | High | R31-R33 |
| F2 | A dedicated `_commands` folder is justified when the desired behavior depends on task decomposition and reusable prompt shape. | S36-S39, S41 | High | R32-R35 |
| F3 | The `_commands` folder must be explicitly non-normative to avoid turning prompts or a worked stack into the portable baseline. | S35, S40 | High | R35-R36 |
| F4 | The safest design is hybrid: templates enforce schema/audit, `_commands` teaches execution, repository evidence controls current-rule promotion. | S34-S41 | High | R31-R36 |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| No second non-Next.js worked example exists. | Cross-stack generality is implemented as templates and command runbooks, but not demonstrated with another concrete source pack. | Add a second example when a concrete target stack is selected. |

## Sources

- Diátaxis documentation framework: `https://diataxis.fr/`
- Backstage TechDocs docs-as-code documentation: `https://backstage.io/docs/features/techdocs/`
- OpenAI prompt engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- OpenAI prompting guide: `https://developers.openai.com/api/docs/guides/prompting`
- Anthropic Claude prompting best practices: `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices`
- Google Gemini prompt design strategies: `https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/prompts/prompt-design-strategies`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/repository/_template.md`
- `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0002-concern-inventory.md`
- `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0004-portable-source-pack-workflow.md`
