# Stack-Only Concern Discovery From Public Repositories

## Metadata

- Status: Accepted
- Date: 2026-06-17
- Supports: R17-R22, D3, U7
- Related Amendment: A2
- Supersedes: None
- Superseded By: None

## Research Question

When only a technology stack is known, how should the `docs/dev` template system use real public repositories to collect concrete concern candidates without overfitting to one repository or promoting external practices to local current rules?

## Context

The user identified a weakness in pure stack-based concern discovery: a stack name can produce vague concerns. This research validates a more concrete workflow: use GitHub CLI to find and inspect multiple active public repositories with similar stack signals, then extract concern candidates from actual repository metadata, root files, scripts, workflows, source layout, and maintenance signals.

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | Official docs | https://cli.github.com/manual/gh_search_repos | 2026-06-17 | `gh search repos` supports repository search with qualifiers and flags including archived state, forks, language, owner, stars, JSON output, and result limits. | Official GitHub CLI manual. |
| S2 | Official docs | https://cli.github.com/manual/gh_repo_view | 2026-06-17 | `gh repo view` can retrieve structured repository metadata, including topics and language data when requested. | Official GitHub CLI manual. |
| S3 | Runtime evidence | `gh search repos "topic:nextjs stars:>1000 archived:false fork:false" --limit 5 --json fullName,description,stargazersCount,language,pushedAt,isArchived,isFork,url` | 2026-06-17 | A stack query returns mixed repository roles, including prompt collection, agent workflow platform, framework source, UI library, and database platform. | Current command output; demonstrates search results need role labeling and filtering. |
| S4 | Runtime evidence | `gh repo view calcom/cal.com --json nameWithOwner,description,repositoryTopics,primaryLanguage,languages,latestRelease,updatedAt` | 2026-06-17 | Cal.com exposes scheduling/product workflow topics plus TypeScript, Next.js, auth, Postgres, Prisma, tRPC, Tailwind, Turborepo, and Zod signals. | Public repository metadata; repository has been renamed in API output to `calcom/cal.diy`. |
| S5 | Runtime evidence | `gh repo view supabase/supabase --json nameWithOwner,description,repositoryTopics,primaryLanguage,languages,latestRelease,updatedAt` | 2026-06-17 | Supabase exposes Postgres platform, realtime, auth, OAuth, vector, AI, docs, studio, and TypeScript/MDX signals. | Public repository metadata. |
| S6 | Runtime evidence | `gh repo view grafana/grafana --json nameWithOwner,description,repositoryTopics,primaryLanguage,languages,latestRelease,updatedAt` | 2026-06-17 | Grafana exposes observability, metrics, dashboards, alerting, data visualization, Go, TypeScript, plugins, and database integrations. | Public repository metadata. |
| S7 | Runtime evidence | `gh api repos/calcom/cal.com/contents --jq '.[].name'` | 2026-06-17 | Root files and folders show concerns such as app store, embed, database, e2e, i18n, docs, permissions, security, specs, and monorepo packages. | Public repository root inventory. |
| S8 | Runtime evidence | `gh api repos/supabase/supabase/contents --jq '.[].name'` | 2026-06-17 | Root files and folders show concerns such as apps, blocks, docker, e2e, examples, i18n, packages, patches, docs linting, Supabase platform, and Turborepo. | Public repository root inventory. |
| S9 | Runtime evidence | `gh api repos/grafana/grafana/contents --jq '.[].name'` | 2026-06-17 | Root files and folders show concerns such as Go workspace, frontend apps, e2e Playwright, packaging, plugins, policy, governance, roadmap, support, stylelint, Storybook, and generated schemas. | Public repository root inventory. |
| S10 | Runtime evidence | `gh api repos/*/contents/package.json --jq '.content' | base64 --decode | jq '.scripts | keys'` for sampled repositories | 2026-06-17 | Package scripts expose concrete concerns such as codegen, docs build, studio build, app store, embed tests, database scripts, plugin builds, OpenAPI generation, i18n extraction, a11y e2e, performance, lint, typecheck, and release checks. | Command shape used for all three samples; outputs summarized to avoid raw dumps. |
| S11 | Runtime evidence | `gh api repos/*/contents/.github/workflows --jq '.[].name'` for sampled repositories | 2026-06-17 | Workflow names expose operational concerns such as code owners, security audit, i18n verification, docs lint, studio tests, frontend coverage, release verification, Docker builds, SAST-like scans, Storybook accessibility, and generated schema checks. | Command shape used for all three samples; outputs summarized to avoid raw dumps. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Stack search results need filtering and role labeling before they can inform concern discovery. | S1, S3 | S4-S6 | Confirmed | Search result relevance differs by query and GitHub ranking. |
| Similar stack signals can map to different product concerns. | S4-S6 | S7-S9 | Confirmed | Cal.com, Supabase, and Grafana all have TypeScript/web signals but different product domains. |
| Actual root files and scripts produce more concrete concern candidates than stack names alone. | S7-S10 | S11 | Confirmed | Sampling should inspect files and scripts, not only metadata. |
| External sampled concerns must be grouped before local application. | S4-S11 | Existing R9/R16 | Confirmed | Sampled concerns are research evidence, not current rules. |
| GitHub CLI can collect enough evidence without cloning external repositories. | S1, S2 | S3-S11 | Confirmed | Some deeper source inspection may still require targeted `gh api` reads or local clone in a separate temp area, but not for the baseline workflow. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F12 | Stack-only input should trigger public repository sampling before concern candidates are proposed. | S1-S3 | High | R17 |
| F13 | Sample selection needs explicit filters: active, non-archived, non-fork, adoption signal, and stack relevance. | S1, S3-S6 | High | R18 |
| F14 | Sample research should inspect metadata, root files, manifests, scripts, workflows, source layout, docs, and release or maintenance signals. | S4-S11 | High | R19 |
| F15 | Concern candidates should be grouped as common, divergent, or repository-specific to avoid overfitting one sample. | S4-S11 | High | R20 |
| F16 | External sample findings require local applicability review before affecting target repository guidance. | S4-S11, R9, R16 | High | R21 |
| F17 | The process should record reproducible `gh` commands and summaries, not clone or vendor external repositories. | S1-S3, S7-S11 | High | R22 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Adds | A2 and R17-R22 define stack-only repository sampling requirements. |
| `decisions/` | Adds | D3 records the repository sampling decision. |
| `plan.md` | Adds | U7 and V7 guide future implementation of sampling instructions. |
| `traceability.md` | Updates | A2 rows map R17-R22 to RS3, D3, U7, V7, and audit evidence. |
| `completion-audit.md` | Updates | Audit rows prove stack-only sampling requirements are present. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| Samples used a web/TypeScript-adjacent query to validate the method. | The record proves the method, not a universal concern taxonomy. | Future stack-specific audits should sample repositories for the given stack. |
| GitHub search results can contain framework source, examples, libraries, and products in one result set. | Poor filtering could bias concern candidates. | Require role labels and sample diversity before extracting concerns. |
| Some repositories are very large and cannot be fully inspected through root summaries. | Deep concerns may be missed by baseline sampling. | Use targeted `gh api` reads for selected files, or create a separate decision before temporary cloning. |

## Sources

- GitHub CLI `gh search repos` manual: repository search and filters.
- GitHub CLI `gh repo view` manual: structured repository metadata.
- `gh search repos "topic:nextjs stars:>1000 archived:false fork:false" ...`: stack-query sample result.
- `gh repo view calcom/cal.com ...`: scheduling product repository metadata.
- `gh repo view supabase/supabase ...`: database platform repository metadata.
- `gh repo view grafana/grafana ...`: observability platform repository metadata.
- `gh api repos/*/contents ...`: root file and workflow inventories.
- `gh api repos/*/contents/package.json ...`: package script inventories.
