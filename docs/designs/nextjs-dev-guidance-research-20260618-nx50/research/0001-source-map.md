# Official And Primary Source Map

## Metadata

- Status: Draft
- Date: 2026-06-18
- Supports: R4-R6, R11-R23

## Research Question

Next.js App Router 레포의 `docs/dev`가 잘못된 코드 패턴을 예방하려면 어떤 공식/1차 자료를 기준으로 각 관심사 문서를 교차검증해야 하는가?

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S1 | Official docs | Next.js docs via Context7 `/vercel/next.js`; upstream source URLs include `github.com/vercel/next.js/.../app-router-migration.mdx`, `production-checklist.mdx`, `glossary.mdx` | 2026-06-18 | App Router는 Server Components를 기본으로 하고, Client Components는 `'use client'` boundary가 필요하며, Route Handlers가 `app` 경로의 request handler 역할을 한다. | High; official docs. |
| S2 | Official docs | React docs via Context7 `/reactjs/react.dev`; upstream source URLs include `react.dev` content for Effects, refs, useMemo/useCallback, StrictMode | 2026-06-18 | derived state를 Effect로 만들지 말고, subscriptions/observers는 cleanup을 반환하며, memoization은 필요한 경우에만 사용한다. | High; official docs. |
| S3 | Official docs | TanStack Query docs via Context7 `/tanstack/query`; upstream source URLs include `docs/framework/react/quick-start.md`, `advanced-ssr.md`, `migrating-to-v5.md` | 2026-06-18 | Query는 server state, Mutation은 server writes와 invalidation, Advanced SSR은 Server Component에서 prefetch/dehydrate와 HydrationBoundary를 사용한다. | High; official docs. |
| S4 | Official docs | React Hook Form `useFieldArray`, `useWatch`, `useForm`, `watch`: `https://react-hook-form.com/docs/...` | 2026-06-18 | RHF는 field-level subscription과 field array API를 제공하며 large form render isolation에 맞는 훅을 제공한다. | High; official docs located through SearXNG. |
| S5 | Official docs | Zustand Next.js setup: `https://zustand.docs.pmnd.rs/learn/guides/nextjs` | 2026-06-18 | Next.js SSR 환경에서는 module state/global store가 request 간 공유될 수 있으므로 store 생성과 provider boundary가 중요하다. | High; official docs located through SearXNG. |
| S6 | Official docs | Testing Library query docs: `https://testing-library.com/docs/queries/about/`, `https://testing-library.com/docs/queries/bytestid/` | 2026-06-18 | 테스트는 사용자가 상호작용하는 방식에 가깝게 작성하고, test id는 다른 query가 적합하지 않을 때의 fallback이다. | High; official docs located through SearXNG. |
| S7 | Official docs | typescript-eslint `no-explicit-any`: `https://typescript-eslint.io/rules/no-explicit-any/` | 2026-06-18 | `any`는 타입 시스템을 우회하므로 known type, `unknown`, narrowing 같은 대안을 우선한다. | High; official lint rule docs. |
| S8 | Official docs | Next.js ESLint and TypeScript docs: `https://nextjs.org/docs/app/api-reference/config/typescript`, `https://nextjs.org/docs/pages/api-reference/config/eslint` | 2026-06-18 | Next.js는 TypeScript와 lint integration guidance를 제공한다. | High; official docs located through SearXNG. |
| S9 | Official docs | Feature-Sliced Design with Next.js: `https://feature-sliced.design/docs/guides/tech/with-nextjs` | 2026-06-18 | FSD와 Next.js router folders의 이름 충돌은 별도 naming/entry strategy를 필요로 한다. | Medium-high; official FSD docs, not Next.js official. |
| S10 | Official docs | Tailwind CSS docs, expanded in `research/0003-supplemental-official-sources.md` | 2026-06-18 | Token/theme/utility usage should ground styling guidance. | Expanded by S15-S16. |
| S11 | Standard / UX research | WCAG, WAI, Nielsen Norman Group, expanded in `research/0003-supplemental-official-sources.md` | 2026-06-18 | UI/UX guidance needs accessibility and task evidence, not aesthetic preference alone. | Expanded by S23-S25; product-specific visual evidence remains pending. |
| S32 | Official docs | Next.js Authentication guide: `https://nextjs.org/docs/14/app/building-your-application/authentication` and `https://nextjs.org/docs/pages/guides/authentication` | 2026-06-18 | Sensitive server operations, Route Handlers, and API routes need server-side authentication and authorization checks. | High; official docs located through SearXNG. |
| S33 | Official docs | Next.js Data Security guide: `https://nextjs.org/docs/app/guides/data-security` | 2026-06-18 | Data access and mutations should keep authentication, authorization, and database logic in dedicated server-only modules or data access layers. | High; official docs located through SearXNG. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Server/client component boundaries must be first-class architecture guidance. | S1 | S2 | Confirmed | Target repo import graph still required before current rule. |
| Server state and form state must not be collapsed into one local state pattern. | S3 | S4 | Confirmed | Integration pattern C17 needs a deeper follow-up with RHF async default values. |
| Zustand guidance must be Next.js-specific, not generic global store advice. | S5 | S1 | Confirmed | Requires target repo SSR/rendering mode to promote current rule. |
| Tests should prefer user-observable accessibility queries. | S6 | User concern C31-C35 | Confirmed | Need concrete test framework evidence in target repo. |
| FSD naming and server/client import boundaries need a decision or local convention. | S9 | S1 | Confirmed | C08 remains `Open Question` until target repo chooses naming. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | Next.js guidance should start from App Router architecture, server/client boundaries, and server-only security before library-specific patterns. | S1, S2 | High | C01-C05, C08-C09 |
| F2 | React guidance should prevent unnecessary Effects, blanket memoization, ref/state misuse, and unreadable component bodies with scenario-specific best/anti examples. | S2 | High | C20-C28, C41, C44, C48 |
| F3 | TanStack Query, RHF, and Zustand require separate ownership rules because they manage server state, form state, and client state respectively. | S3, S4, S5 | High | C06-C19 |
| F4 | Testing guidance should be behavior-first and accessibility-first, with test ids treated as fallback. | S6 | High | C31-C36, C42 |
| F5 | TypeScript/ESLint guidance should make `any` exceptions explicit and reviewable rather than silently disabling type safety. | S7, S8 | High | C37, C46 |
| F6 | FSD with Next.js is plausible but needs a local decision for route folder naming and server/client import enforcement. | S9, S1 | Medium | C08-C09, C22-C23 |
| F7 | Next.js security guidance should treat middleware and client checks as insufficient for sensitive operations; authorization must be checked in server-side request/mutation/data boundaries. | S32, S33 | High | C03-C05 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Supports | R4-R24 source and evidence requirements. |
| `research/0002-concern-inventory.md` | Supports | Map C00-C48 to evidence sources and owner folders. |
| `plan.md` | Adds | Implementation units for deeper source reading and final docs/dev generation. |
| `traceability.md` | Adds | Map source IDs to requirement and concern coverage. |
| `completion-audit.md` | Adds evidence | Record which source areas are complete and which remain pending. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| UI library selection and product-specific visual examples have not yet been researched with candidate products or screenshots. | C29-C30, C43 need stronger product-specific evidence. | Add visual/product research after the target product category is known. |
| Real public Next.js repository sampling has not yet been performed in this package. | Concern examples remain pseudo-code and recommended future patterns. | Add repository sampling before promoting any current rule. |
| Visual commercial-service research requires browser screenshots and product-specific scope. | C30/C43 remain `Open Question`. | Use browser/devtools and save evidence under allowed project paths when the target app category is known. |

## Sources

- Next.js official documentation via Context7 `/vercel/next.js`.
- React official documentation via Context7 `/reactjs/react.dev`.
- TanStack Query official documentation via Context7 `/tanstack/query`.
- React Hook Form official documentation search results.
- Zustand official documentation search results.
- Testing Library official documentation search results.
- typescript-eslint official documentation search results.
- Feature-Sliced Design official documentation search results.
