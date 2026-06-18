# docs/dev Templates

이 폴더는 AI와 팀원이 `docs/dev` 개발 지침을 새로 만들거나 크게 갱신할 때 사용하는 repo-tracked 템플릿이다. `maintain-dev-docs` 같은 워크플로우 스킬이 없어도 이 폴더만으로 위치 결정, 근거 수집, 문서 작성, 완료 감사를 진행할 수 있어야 한다.

템플릿은 현재 레포의 기술스택을 다른 레포의 기본값으로 복사하지 않는다. 새 문서를 작성할 때에는 먼저 대상 레포의 source, config, test, existing docs, accepted decisions를 확인하고, 근거가 있는 항목만 current rule로 승격한다.

Root governance는 이 폴더가 아니라 [`../README.md`](../README.md)가 소유한다. 이 폴더는 folder-specific authoring router이며, `docs/dev/_templates/root-readme.md`는 만들지 않는다.

`development guidance target`은 current rule, future proposal, local constraint, open question으로 기록할 수 있는 구체적인 개발 판단 지점이다. Dependency 이름, 사용자 기능, UI 화면, 넓은 product area만으로 target을 만들지 않는다.

템플릿은 `data.txt`, Next.js, 특정 항목 수, 특정 source list를 요구하지 않는다. 명시적 관심사 목록이 있으면 source item을 보존하고, 목록이 없으면 stack evidence와 공식 문서에서 target을 도출한다.

## Reading Order

1. 이 README에서 문서의 목적과 대상 폴더를 고른다.
2. root governance, repository evidence 위치, bootstrap 흐름은 [`../README.md`](../README.md)를 확인한다.
3. 대상 폴더의 `_templates/<folder>/README.md`를 읽고 include/exclude와 target output을 확인한다.
4. 대상 폴더의 `_template.md`를 복사 기준으로 삼아 문서를 작성한다.
5. 대상 레포에 `docs/dev/<folder>/README.md`가 이미 있으면 Include, Exclude, Dynamic File Policy를 다시 확인한다.
6. 대상 레포에 `docs/dev`가 없거나 새 구조를 세팅하는 경우 `_bootstrap-audit.md`로 근거와 누락 항목을 기록한다.
7. 기술스택만 주어진 경우 public repository sampling 또는 동등한 GitHub evidence를 먼저 기록하고, target repository evidence 없이 current rule로 승격하지 않는다.
8. 넓은 기술스택 요청이나 예방 패턴 요청이 있으면 `Development Guidance Target Router`와 repository template의 target inventory를 먼저 채우고, target coverage가 확인된 뒤 상세 문서를 작성한다.

## Placement Router

| Document Intent | Template README | Body Template | Target Output |
| --- | --- | --- | --- |
| feature/module boundary, import direction, public API, ownership | `architecture/README.md` | `architecture/_template.md` | `docs/dev/architecture/<topic>.md` |
| language, framework, library, test, lint, build, generated-code rule | `engineering/README.md` | `engineering/_template.md` | `docs/dev/engineering/<topic>.md` |
| product vocabulary, state meaning, invariant, business interpretation | `domain/README.md` | `domain/_template.md` | `docs/dev/domain/<topic>.md` |
| future migration, alternative, technical debt, non-current proposal | `evolution/README.md` | `evolution/_template.md` | `docs/dev/evolution/<topic>.md` |
| AI reading order, uncertainty handling, agent behavior rule | `ai/README.md` | `ai/_template.md` | `docs/dev/ai/<topic>.md` or `docs/dev/ai/README.md` |
| accepted/deferred/superseded long-lived decision | `decisions/README.md` | `decisions/_template.md` | `docs/dev/decisions/<number>-<topic>.md` |
| repository purpose, stack, source layout, verification commands, local constraints, baseline evidence | `repository/README.md` | `repository/_template.md` | `docs/dev/repository/README.md` or `docs/dev/repository/<topic>.md` |

## Development Guidance Target Router

| Target Shape | Evidence Owner | Guidance Owner | Classification Rule |
| --- | --- | --- | --- |
| Stack evidence, source layout, public repository sampling, fallback evidence, local constraints | `repository/` | Linked owner folder | Evidence only; never a current rule by itself |
| Module boundary, layer ownership, runtime flow, public API placement | `repository/` evidence table | `architecture/` | Current rule only with target repository evidence |
| Library composition, validation contract, generated code, tests, build, lint, release tooling | `repository/` evidence table | `engineering/` | Current rule only with target manifests/config/source/test evidence |
| Product vocabulary, state meaning, business invariant | `repository/` evidence table | `domain/` | Current rule only with repeated source/product/test evidence |
| Better pattern that is not accepted yet | `repository/` evidence table | `evolution/` | `Recommended Future Pattern`, `Deferred`, or `Open Question` |
| AI reading order, uncertainty behavior, generic snippet prevention | `repository/` evidence table | `ai/` | Current AI rule only with repo-tracked instruction evidence |
| Accepted trade-off, supersession, dependency or process choice | `repository/` evidence table | `decisions/` | Accepted only through a decision record |

## Broad Input Router

| Input Shape | First Output | Follow-Up Output | Rule |
| --- | --- | --- | --- |
| Explicit concern list, issue, meeting note, uploaded/external/restricted source | `repository/<topic>.md` or design package inventory | Owner-folder docs after classification | Preserve each requirement-relevant source item with stable IDs before summarizing. |
| Technology stack name only | `repository/README.md` stack evidence and sampling table | `evolution/` recommended patterns or owner-folder open questions | Derive targets from manifests, official docs, and sampled repositories before proposing current rules. |
| Target repository evidence exists | `repository/README.md` target inventory | `architecture/`, `engineering/`, `domain/`, `ai`, `decisions` | Promote only evidence-backed targets to current rules. |
| Product/UI visual research request | Research record or `repository/<topic>.md` evidence table | `domain/` guidance or `decisions/` record | Preserve URLs, screenshots, task context, accessibility notes, and limitations. |

Do not reduce broad technology-stack work to a few familiar library topics. Group targets for authoring efficiency, but preserve target coverage through traceability.

## Repository Evidence Routing

`docs/dev/repository/`는 target-repository-specific evidence를 보존한다. 이 영역은 current rule을 소유하지 않고 top-level current-rule folders로 링크한다.

| Evidence Intent | Target Output | Rule |
| --- | --- | --- |
| repository purpose, stack, source layout, generated code, verification commands, local constraints | `docs/dev/repository/README.md` | current rule로 쓰지 않는다 |
| local evidence for architecture guidance | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | top-level `docs/dev/architecture/` current rule에 링크한다 |
| local evidence for engineering guidance | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | top-level `docs/dev/engineering/` current rule에 링크한다 |
| local evidence for domain, evolution, AI, decisions | `docs/dev/repository/README.md` evidence table or `docs/dev/repository/<topic>.md` | current rule/proposal/decision 본문을 대체하지 않는다 |

`docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` 같은 same-named evidence taxonomy는 기본 생성하지 않는다. `docs/dev/application/` scope axis는 기본 생성하지 않고, 다중 앱이나 application-specific evidence가 실제로 필요하면 먼저 decision record로 ownership과 target output을 정한다.

## Target Repository Evidence

모든 `_template.md`는 current guidance를 쓰기 전에 다음 정보를 먼저 채운다.

| Field | Required Evidence |
| --- | --- |
| Repository purpose | README, product docs, app entrypoints, or package metadata |
| Technology stack | package manifests, lockfiles, config files, build scripts |
| Source layout | top-level source folders, module boundaries, generated output locations |
| Existing docs | `docs/dev`, `docs/designs`, ADRs, README, contributing docs, AGENTS-style files |
| Verification commands | test, typecheck, lint, build, browser/e2e commands that are actually present |
| Constraints | legacy areas, external checkouts, generated files, security or release constraints |

If evidence is not found, write `Not found after checking <repo-relative paths>` and classify the missing item as `Open Question`, `Local Constraint`, or `Recommended Future Pattern`. Do not invent a current rule.

## Evidence Collection Lanes

| Lane | Inspect | Output |
| --- | --- | --- |
| Stack evidence | manifests, lockfiles, dependency metadata, framework config, generated-code config, build scripts, verification commands | Candidate engineering, architecture, generated artifact, verification, or release targets |
| Repository topic evidence | README, product docs, package metadata, catalog metadata, source entrypoints, route/API surfaces, ownership, lifecycle, domain vocabulary | Candidate domain, architecture, or product-surface targets |
| Operational quality evidence | tests, build, dependency updates, generated artifacts, security, maintenance, ownership, docs, packaging, release signals | Candidate verification, maintenance, release, or documentation targets |

Cross-check important targets with at least two evidence types when practical. Conflicts stay `Open Question` or low confidence.

When an explicit source list contains many requested concerns, record source location, persistence state, optional item count, stable target ID or cluster range, and any reconstructed text needed for reviewers to audit coverage without reopening ignored or private files.

## Stack-Only Sampling

When only a technology stack is known, sample public repositories before proposing targets.

| Step | Minimum Recording |
| --- | --- |
| Query and selection | search query, filters, activity, non-archived/non-fork status, adoption signal, stack relevance, sample role |
| Inspection | manifests, scripts, workflows, source layout, docs, releases, maintenance signals |
| Grouping | `Shared Stack`, `Stack Plus Domain`, `Repository Specific` |
| Local applicability | why this candidate does or does not apply to the target repository |
| Limitations | missing files, weak search results, stale docs, conflicts, confidence impact |

Prefer at least five repositories. If the ecosystem is small or search quality is poor, at least three is acceptable when the reason is recorded.

## GitHub Evidence Fallbacks

Prefer `gh` for GitHub evidence, but do not require it. Accepted fallbacks are GitHub Web UI, GitHub REST API through an approved HTTP client, installed GitHub MCP or connector output, and stable GitHub file URLs. Record tool/interface, source URLs, query or navigation steps, inspected files/pages, retrieval date, evidence summary, limitations, and confidence impact.

Temporary archive or clone inspection requires a separate decision or explicit implementation note and must not vendor sampled repositories into the target repository.

## Common Completion Rules

- `Scenario Coverage` appears before examples.
- Each scenario maps to at least one best/anti-pattern pair, positive/negative example, behavior case, or explicit no-example rationale.
- Best examples explain intent, applicability, impact, and verification.
- Anti-pattern examples explain failure mode, user or maintenance impact, safer alternative, and target-repository constraints.
- Sources are repo-relative paths or stable public URLs. Skill-local paths, machine-specific paths, session IDs, and worktree names are not valid sources.
- Placeholder text must be removed before a generated document is considered complete.
- Named technologies in generated documents must be optional evidence or examples, not template prerequisites.
- Broad technology-stack requests are complete only when explicit source items or derived targets map to evidence, owner folder, classification, pattern coverage, and either a detailed guidance section, an accepted decision, or an explicit open question/follow-up.

## Optional Commands

Reusable prompt/runbook commands live in `docs/dev/_commands`. Commands can decompose broad work, but templates remain the normative output contract. Commands must not own current rules, target repository facts, accepted decisions, or source-of-truth evidence.

## Bootstrap Path For Repositories Without docs/dev

1. Use [`../README.md`](../README.md) as the canonical portable governance base.
2. Create `docs/dev/repository/README.md` from target repository evidence.
3. Create only the folder READMEs needed by current evidence. Do not create empty detailed documents.
4. Use the relevant `_template.md` files to write current rules, future proposals, AI rules, and decisions separately.
5. Record the bootstrap proof in `_bootstrap-audit.md` or an equivalent tracked audit file.
6. Leave unsupported patterns as open questions or future proposals instead of current rules.

## Optional Skill Usage

Workflow skills can help scan, draft, or audit documents, but they are not the source of truth. The source of truth is the target repository's tracked `docs/dev` files plus the evidence recorded inside them.
