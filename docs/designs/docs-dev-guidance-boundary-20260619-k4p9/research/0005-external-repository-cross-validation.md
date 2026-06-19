# External Repository Cross-Validation

## Metadata

- Status: Draft
- Date: 2026-06-19
- Supports: R14-R16
- Related Amendment: None
- Supersedes: None
- Superseded By: None

## Research Question

`docs/dev/README.md`의 `Stack-Only Repository Sampling`을 어떻게 강화해야, 기술스택만 주어진 경우뿐 아니라 기존 로컬 코드가 존재하는 경우에도 여러 GitHub 레포를 리서치+교차검증해 세부 개발 관심사, 해야 할 것, 하지 말아야 할 것을 도출하게 만들 수 있는가?

## Context

이전 README는 "기술스택 이름만으로 target을 추론하지 말라"는 방향은 갖고 있었다. 하지만 실제 문제는 더 넓다. target repository에 코드가 이미 있어도 그 코드가 좋은 패턴인지, 우연히 굳은 로컬 anti-pattern인지 알 수 없다. 따라서 로컬 코드는 current-state evidence로만 다루고, best-practice authority는 공식 문서와 여러 외부 레포의 반복 증거로 교차검증해야 한다.

이 요구는 새 `Authoring Guardrails` 파트를 추가하는 것보다 기존 `Stack-Only Repository Sampling` 섹션을 `External Repository Cross-Validation`으로 확장하는 방식이 더 직접적이다.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | User constraint | User request on 2026-06-19 | 2026-06-19 | 기존 코드가 있어도 믿을 수 없으므로 여러 GitHub 레포를 리서치해 개발 지침과 best/anti pattern을 도출해야 한다. | High; direct requirement. |
| S2 | Local docs | `docs/dev/README.md` | 2026-06-19 | 현재 섹션은 `Stack-Only Repository Sampling`으로 좁게 명명되어 있고, existing local code가 authority가 아니라는 문장이 없다. | High; current source. |
| S3 | Local templates | `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md` | 2026-06-19 | template 쪽도 stack-only sampling을 별도 섹션으로 두지만, target repository code가 있는 경우의 external validation gate는 약하다. | High; current source. |
| S4 | Prior research | `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0003-stack-only-concern-discovery-from-public-repositories.md` | 2026-06-19 | public repo sampling은 stack name보다 manifests, scripts, workflows, source layout에서 더 구체적인 concern을 만든다. | High; accepted local research. |
| S5 | Official docs | GitHub CLI `gh search repos`, `https://cli.github.com/manual/gh_search_repos` | 2026-06-19 | repository search는 qualifiers와 JSON output을 통해 active/non-archived/non-fork/adoption filtering에 사용할 수 있다. | High; official docs checked by direct access. |
| S6 | Official docs | GitHub CLI `gh repo view`, `https://cli.github.com/manual/gh_repo_view` | 2026-06-19 | repository metadata, topics, language data를 구조적으로 수집할 수 있다. | High; official docs checked by direct access. |
| S7 | Official docs | GitHub repository search docs, `https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories` | 2026-06-19 | GitHub repository search can be constrained with search qualifiers. | High; official docs checked by direct access. |
| S8 | Official docs | GitHub code search docs, `https://docs.github.com/en/search-github/searching-on-github/searching-code` | 2026-06-19 | code search can inspect usage patterns, but search hits are discovery aids that need direct file/context review. | High; official docs checked by direct access; interpretation constrained by local policy. |
| S9 | Prompt engineering official docs | OpenAI Prompt Engineering, `https://developers.openai.com/api/docs/guides/prompt-engineering` | 2026-06-19 | clear instructions, reference grounding, task decomposition, and verification improve output reliability. | High; official docs checked by direct access. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Existing local code should be treated as current-state evidence, not proof of recommended practice. | S1, S2 | S4, S9 | Confirmed | Local evidence still matters for applicability and migration constraints. |
| The README section name `Stack-Only Repository Sampling` is too narrow for the desired behavior. | S1, S2 | S3 | Confirmed | Existing stack-only rules can be preserved under a broader section. |
| External repository research should extract do/don't guidance, not only candidate target names. | S1, S4 | S5-S8 | Confirmed | External examples still cannot become current rules without local applicability review. |
| GitHub fallback evidence must satisfy the same evidence contract as `gh`; fallback is not permission to skip sampling. | S2, S3 | S5-S8 | Confirmed | Rate limits and access limits must be recorded as confidence impact. |

## External Repository Cross-Validation Model

Replace or expand `Stack-Only Repository Sampling` with `External Repository Cross-Validation`.

The model should trigger when any of the following is true:

- only a technology stack is known;
- target repository code exists but may encode local anti-patterns;
- existing `docs/dev` guidance is absent, stale, or suspected to be too local;
- the user asks for best practices, anti-patterns, architecture, conventions, testing guidance, or development guidance for a stack;
- Codex is about to write current or recommended development guidance from observed local code.

## Proposed README Direction

Recommended replacement opening:

```md
## External Repository Cross-Validation

Do not infer development guidance targets from a technology-stack name, existing local code, or repository habits alone. Existing code is current-state evidence, not proof of a recommended pattern.

When writing docs/dev guidance for a technology stack, architecture pattern, coding convention, testing practice, or best/anti pattern, inspect multiple real public repositories and official documentation before promoting guidance.
```

Recommended completion gate:

```md
Guidance is incomplete if it relies only on local code, official docs alone, memory, or a single repository sample.
```

## Required Sampling Steps

| Step | Rule |
| --- | --- |
| Trigger | Run external cross-validation for stack guidance, best/anti patterns, architecture conventions, testing conventions, and coding rules, even when target repository code exists. |
| Local baseline | Record local code as current-state evidence and identify possible local anti-patterns or missing guidance. |
| Select samples | Inspect at least five active, non-archived, non-fork repositories by default; use three only with a recorded reason. |
| Inspect evidence | Inspect metadata, manifests, lockfiles, scripts, workflows, source layout, docs, release/maintenance signals, and targeted source files when needed. |
| Extract guidance | Extract concrete decision points, what-to-do patterns, what-not-to-do anti-patterns, verification signals, tooling constraints, and migration risks. |
| Cross-validate | Compare sample evidence against official docs and local applicability before writing current or recommended guidance. |
| Classify | Classify each candidate as `Current Rule`, `Recommended Future Pattern`, `Open Question`, `Local Constraint`, or `Not Applicable`. |
| Completion gate | Mark the research incomplete if sampled repositories, inspected paths, limitations, candidate grouping, and do/don't extraction are missing. |

## GitHub Evidence Fallback Strengthening

`GitHub Evidence Fallbacks` should explicitly say:

```md
Fallback evidence must satisfy the same evidence contract as `gh` evidence. A fallback is not permission to skip external repository cross-validation.
```

Suggested table change:

| Preferred Path | Accepted Fallback | Coverage Required |
| --- | --- | --- |
| `gh search repos`, `gh repo view`, `gh api`, `gh search code` | GitHub Web UI, REST API, installed GitHub MCP/connector, stable GitHub URLs | Same sample count, same inspected evidence categories, same source URLs, same limitations and confidence notes. |

## Target Output Impact

| File | Required Change |
| --- | --- |
| `docs/dev/README.md` | Rename or expand `Stack-Only Repository Sampling` to `External Repository Cross-Validation`; add existing-code-is-not-authority rule and completion gate. |
| `docs/dev/_templates/README.md` | Mirror the broader term so templates do not treat external sampling as stack-only. |
| `docs/dev/_templates/repository/_template.md` | Rename `Stack-Only Public Repository Sampling` to `External Repository Cross-Validation Evidence`; add local baseline and do/don't extraction columns. |
| `docs/dev/_templates/_bootstrap-audit.md` | Add an independence check that local code was not treated as best-practice authority without external cross-validation. |
| `examples/*.md` | Prompt files should require sampled repo evidence plus official docs for every detailed concern and best/anti pair. |

## Options

| Option | Description | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. Keep `Stack-Only Repository Sampling` unchanged | Sampling only applies when no target code exists. | Minimal change. | Does not solve the user's core failure mode. | Reject. |
| B. Add one sentence under stack-only | Say existing code is not authority but keep section name. | Small diff. | Section title still suggests sampling is only for stack-only inputs. | Insufficient. |
| C. Rename to `External Repository Cross-Validation` | Broaden trigger to stack-only, stale/missing guidance, and untrusted local code. | Directly matches desired behavior and prevents local-code overtrust. | Requires updates in README and templates. | Recommended. |
| D. Add separate `External Repository Cross-Validation` section while keeping stack-only | Avoids breaking old wording. | More explicit. | Adds another part and increases README size. | Use only if rename is too disruptive. |

## Recommendation

Use option C.

The README should teach Codex that external repository cross-validation is required for development guidance, not only for stack-only discovery. Local code remains important, but only as current-state evidence and applicability evidence. It must not be treated as proof that a pattern is correct.

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | `Stack-Only Repository Sampling` is too narrow because local code can also be untrustworthy. | S1-S4 | High | R14, R16 |
| F2 | README should explicitly state that existing code is current-state evidence, not best-practice authority. | S1, S2, S4 | High | R15 |
| F3 | External repo research must extract do/don't patterns, verification signals, and tooling constraints, not only target labels. | S1, S4-S9 | High | R14-R16 |
| F4 | GitHub fallback mechanisms must preserve the same sampling and inspection contract as `gh`. | S3, S5-S8 | High | R16 |
| F5 | The best design is to rename/expand the existing section instead of adding a new top-level part. | S2, S3, S4 | High | R16 |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| This record does not implement the README/template changes. | The current README still uses the narrower `Stack-Only Repository Sampling` heading. | Implement a focused docs diff after this design direction is accepted. |
| No concrete consumer repository failure log is linked. | The finding is based on user-reported failure and existing docs structure. | Capture the failed prompt/session or affected repo evidence if available. |
| Public repository sampling can be biased by search ranking. | Sample quality can affect concern candidates. | Require role labels, sample diversity, and limitations/confidence notes. |

## Sources

- GitHub CLI `gh search repos` manual: `https://cli.github.com/manual/gh_search_repos`
- GitHub CLI `gh repo view` manual: `https://cli.github.com/manual/gh_repo_view`
- GitHub repository search docs: `https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories`
- GitHub code search docs: `https://docs.github.com/en/search-github/searching-on-github/searching-code`
- OpenAI Prompt Engineering: `https://developers.openai.com/api/docs/guides/prompt-engineering`
- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/repository/_template.md`
- `docs/designs/docs-dev-template-governance-20260617-q7m2/research/0003-stack-only-concern-discovery-from-public-repositories.md`
