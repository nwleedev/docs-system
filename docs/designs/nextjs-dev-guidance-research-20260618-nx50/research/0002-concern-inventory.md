# Concern Inventory And Documentation Contract

## Metadata

- Status: Draft
- Date: 2026-06-18
- Supports: R2-R3, R7-R24

## Research Question

worked example source인 `temps/frontend-concerns/data.txt`의 항목을 Next.js App Router 레포의 세밀한 `docs/dev` development guidance target으로 어떻게 분류하고, 각 target별 베스트/안티 코드 패턴 예시를 어떤 방식으로 리서치하고 문서화해야 하는가?

## Concern Groups

| Group | Concern IDs | Primary Owner | Documentation Output |
| --- | --- | --- | --- |
| Dev docs governance | C00 | repository, ai | `docs/dev/repository/README.md`, `docs/dev/ai/<topic>.md` |
| Next.js App Router architecture and security | C01-C05, C08-C09 | architecture, engineering, decisions | `docs/dev/architecture/nextjs-app-router.md`, `docs/dev/engineering/nextjs-server-boundaries.md` |
| Server state, form state, client state | C06-C19 | engineering | `docs/dev/engineering/tanstack-query.md`, `react-hook-form.md`, `zustand.md` |
| React component patterns | C20-C28, C44, C48 | engineering, architecture | `docs/dev/engineering/react-patterns.md`, `docs/dev/architecture/component-composition.md` |
| Research and UI decisions | C29-C30, C43 | decisions, domain, research | `docs/dev/decisions/<ui-library>.md`, `docs/dev/domain/ui-ux-principles.md` |
| Testing | C31-C36, C42 | engineering | `docs/dev/engineering/testing-guidance.md` |
| TypeScript, JavaScript, lint, docs | C24, C37-C41, C46-C47 | engineering, architecture | `docs/dev/engineering/typescript-eslint.md`, `javascript-control-flow.md`, `software-engineering.md` |
| Styling | C45 | engineering | `docs/dev/engineering/tailwind-styling.md` |

## Pattern Documentation Contract

Every detailed concern document should use this structure:

| Section | Required Content | Why |
| --- | --- | --- |
| Target Repository Evidence | manifests, source paths, configs, tests, existing docs | Prevents generic advice from becoming current rule. |
| Scenario Coverage | user flow, code path, boundary, or failure case matrix | Ensures examples cover varied cases before code snippets. |
| Best Pattern | intent, applicability, impact, constraints, verification | Makes the rule reviewable. |
| Anti-Pattern | failure mode, impact, safer alternative, detection signal | Prevents "style preference" guidance. |
| Source Evidence | official docs, local evidence, public repo evidence | Enables re-checking. |
| Open Questions | missing local decisions or weak evidence | Prevents false certainty. |

## Best/Anti Example Matrix

| Concern IDs | Best Pattern Example To Research | Anti-Pattern Example To Research | Verification |
| --- | --- | --- | --- |
| C01 | Route segment owns URL, layout owns shared shell, route handler owns HTTP boundary. | One feature folder manually switches URL state while bypassing App Router conventions. | Route tree review and navigation tests. |
| C02 | Server Component fetches data and passes serializable props to a small Client Component. | Adding `'use client'` to a route root because one nested button needs state. | Bundle review and import boundary check. |
| C03-C05 | Auth/authorization checked inside server actions/route handlers before mutation or secret access. | Middleware-only auth or client-side checks treated as sufficient for server mutation. | Security review and negative authorization tests. |
| C06-C07, C18-C19 | Query keys encode resource identity; mutations use mutation status and invalidation. | Duplicating remote status in `useState` or invalidating broad unrelated keys. | Query key review and mutation tests. |
| C11-C17 | RHF controls form lifecycle; field arrays use stable ids; watched fields subscribe narrowly. | Parent component watches whole form and passes `register` through multiple layers. | Render count check and form behavior tests. |
| C10 | Zustand store is request-safe and scoped to client state. | Module-level store stores request/user data in SSR path. | SSR/request isolation review. |
| C20-C28 | Derived values render directly; Effects synchronize external systems; refs hold non-render values. | Effect chains derive UI state; refs hide values that should re-render UI. | React StrictMode and interaction tests. |
| C29-C30, C43 | UI library or visual pattern selected by accessibility, composition, theming, bundle, product fit. | Popularity-only component library choice or copied commercial layout without task rationale. | Decision matrix and browser visual evidence. |
| C31-C36, C42 | Tests assert accessible user-visible behavior and fail for the right reason. | Test ids first, implementation mocks only, duplicate tests that never catch regressions. | Testing Library query review and mutation/manual failure check. |
| C37, C46 | ESLint and TS rules reject unsafe escape hatches with documented exceptions. | `any`, disabled lint rules, or broad ignores added to pass build. | lint/typecheck and exception audit. |
| C38-C41 | Independent async work runs in parallel; array/loop choice matches intent; helpers are pure. | Serial await waterfalls, clever reduce, hidden side effects in transforms. | code review and unit tests for pure helpers. |
| C44, C48 | Props are explicit when local and context/global state only when shared semantics justify it. | Premature global state or mega component with multiple reasons to change. | component ownership review. |
| C45 | Tailwind uses tokens, variants, and shared composition for repeated semantics. | Arbitrary class values duplicated across features. | class search and visual regression. |

## Documentation Sequencing

1. Start with `docs/dev/repository/README.md` evidence for the target Next.js app: package manager, Next.js version, App Router usage, test runner, styling, state/form libraries, source layout.
2. Create architecture guidance before engineering details when the concern affects import direction, server/client boundaries, FSD layers, or public API ownership.
3. Create engineering guidance for API usage, hooks, tests, lint, build, validation, generated code, and JavaScript/TypeScript patterns.
4. Create decision records for UI library selection, FSD naming (`pages` vs `entries`), and any rule that changes source-of-truth ownership.
5. Keep visual UI/UX research as a separate research record with browser evidence, screenshots under project-controlled paths, and source URLs.

## Open Questions

| Question | Why It Is Not Current Rule Yet | Follow-Up |
| --- | --- | --- |
| Should FSD `pages` be renamed to `entries` or `_pages` in this target repository? | FSD docs describe naming conflict handling, but the user specifically mentioned `entries`; target repo convention is not accepted yet. | Create decision record before current architecture rule. |
| Which UI component library should be used? | No target product needs, design tokens, accessibility requirements, or bundle constraints have been collected. | Research candidates and write decision matrix. |
| Which commercial services are visually similar? | Target product category is unknown. | Ask for product domain or sample competitors before visual research. |
| How much testing is too much? | Requires target risk model, CI cost, defect history, and test pyramid. | Record repository evidence after app setup. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | The worked example items should not become one document per counted item; they should be grouped by `docs/dev` ownership and split only when scenario coverage becomes too large. | `docs/dev/README.md`, C00-C48 | High | R3, R24 |
| F2 | The first detailed documents should be Next.js boundaries, server state/form/client state separation, React component patterns, and testing guidance because they prevent the largest class of cross-cutting mistakes. | RS1 F1-F4, C01-C36 | High | R11-R19 |
| F3 | C08, C17, C29, C30, C36, C42, C43 require target repo or product decisions before current rule promotion. | C08/C17/C29/C30/C36/C42/C43 rows | Medium | Open questions |
| F4 | Every concern can still be documented as a research-backed `Recommended Future Pattern` before code exists, as long as the document labels examples as pseudo-code and records missing target evidence. | `docs/dev/README.md`, RS1 | High | R7-R10 |

## Sources

- `requirements.md#Concern Inventory`: durable reconstruction of the local ephemeral source.
- `research/0001-source-map.md`: official and primary source map.
- `docs/dev/README.md`: owner folder and evidence promotion rules.
- `docs/dev/_templates/README.md`: pattern documentation contract.
