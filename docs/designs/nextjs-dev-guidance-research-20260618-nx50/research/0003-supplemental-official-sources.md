# Supplemental Official Sources

## Metadata

- Status: Draft
- Date: 2026-06-18
- Supports: R4-R6, R19-R23

## Research Question

RS1에서 부족했던 Tailwind, JavaScript iteration/Promise, JSDoc/TSDoc, Playwright/jest-dom, UI/UX/accessibility 영역은 어떤 공식/표준 자료로 교차검증해야 하는가?

## Evidence

| Source ID | Type | Source | Accessed | Claim Used | Quality Notes |
| --- | --- | --- | --- | --- | --- |
| S12 | Official docs | MDN `Promise.all`: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all` | 2026-06-18 | independent promises can be combined and reject on first rejection. | High; JavaScript reference. |
| S13 | Official docs | MDN `Promise.allSettled`: `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled` | 2026-06-18 | all settled results can be inspected without failing the whole aggregate. | High; JavaScript reference. |
| S14 | Official docs | MDN Array methods: `forEach`, `map`, `filter`, Array overview | 2026-06-18 | array methods have distinct semantics; `map` return value should be used, otherwise `forEach` or loop is clearer. | High; JavaScript reference. |
| S15 | Official docs | Tailwind CSS `Adding custom styles`: `https://tailwindcss.com/docs/adding-custom-styles` | 2026-06-18 | arbitrary values are available for one-off needs, so repeated arbitrary values need a stronger token or abstraction decision. | High; official docs. |
| S16 | Official docs | Tailwind CSS `Theme variables`: `https://tailwindcss.com/docs/theme` | 2026-06-18 | design tokens such as typography, colors, shadows, breakpoints belong in theme variables. | High; official docs. |
| S17 | Official docs | TypeScript JSDoc reference: `https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html` | 2026-06-18 | JSDoc supports `@param` and `@returns`, but TypeScript code already has type syntax that should not be redundantly restated without value-contract meaning. | High; official TypeScript docs. |
| S18 | Standard proposal | TSDoc: `https://tsdoc.org/` and `https://tsdoc.org/pages/tags/returns/` | 2026-06-18 | TSDoc standardizes TypeScript doc comments for tool extraction and supports return value documentation. | Medium-high; standard proposal used by tooling. |
| S19 | Official docs | Playwright Best Practices: `https://playwright.dev/docs/best-practices` | 2026-06-18 | automated tests should verify user-visible behavior and avoid implementation details. | High; official docs. |
| S20 | Official docs | Playwright Locators: `https://playwright.dev/docs/locators` | 2026-06-18 | locators should prioritize user-facing attributes and explicit contracts such as role locators. | High; official docs. |
| S21 | Official docs | Playwright Assertions: `https://playwright.dev/docs/test-assertions` | 2026-06-18 | assertions should use a matcher that reflects the expectation. | High; official docs. |
| S22 | Official project docs | testing-library/jest-dom README: `https://github.com/testing-library/jest-dom` | 2026-06-18 | jest-dom adds declarative DOM matchers such as text/content assertions. | High; primary project source. |
| S23 | Standard | W3C WCAG 2.2: `https://www.w3.org/TR/WCAG22/` | 2026-06-18 | accessible content must be evaluated against accessibility needs across disability categories. | High; W3C recommendation. |
| S24 | Standard overview | W3C WAI WCAG overview: `https://www.w3.org/WAI/standards-guidelines/wcag/` | 2026-06-18 | WCAG is an international standard for web accessibility. | High; W3C overview. |
| S25 | UX research guidance | Nielsen Norman Group usability heuristics: `https://www.nngroup.com/articles/ten-usability-heuristics/` | 2026-06-18 | usability heuristics are broad rules of thumb for interaction design. | Medium-high; reputable UX research organization, not a formal standard. |

## Cross-Validation

| Claim | Evidence A | Evidence B | Result | Caveat |
| --- | --- | --- | --- | --- |
| Async guidance should distinguish fail-fast parallel work from all-result collection. | S12 | S13 | Confirmed | Sequential `for...of await` remains valid for dependent operations. |
| Array method guidance should be semantic, not stylistic. | S14 | C40 | Confirmed | Performance-sensitive code may still prefer loops after measurement. |
| Tailwind hardcoding guidance should distinguish one-off arbitrary values from repeated design decisions. | S15 | S16 | Confirmed | Target design tokens are needed for current rule. |
| TSDoc/JSDoc guidance should document caller contract, not duplicate TypeScript signatures. | S17 | S18 | Confirmed | Project comment policy already requires richer JSDoc/TSDoc details. |
| Testing should prioritize user-visible behavior and user-facing locators. | S19 | S20 | Confirmed | Component-level Testing Library and E2E Playwright should share principle but use tool-specific APIs. |
| Text assertions can be valid when tied to user-visible content, but brittle broad text blobs should be avoided. | S21 | S22 | Confirmed | C42 remains context-sensitive; exactness and accessibility query context matter. |
| UI/UX guidance must combine accessibility standards and usability heuristics rather than visual taste alone. | S23, S24 | S25 | Confirmed | Commercial product visual research still needs product category evidence. |

## Findings

| Finding ID | Finding | Evidence | Confidence | Applies To |
| --- | --- | --- | --- | --- |
| F1 | `Promise.all` and `Promise.allSettled` guidance should be based on dependency and failure semantics, not a blanket ban on `await` in loops. | S12, S13 | High | C38 |
| F2 | JavaScript collection guidance should explain intent: transform with `map`, select with `filter`, side effects with `forEach`/loop, aggregation with `reduce` only when it clarifies the accumulator contract. | S14 | High | C39-C40 |
| F3 | Tailwind guidance should prefer theme variables/tokens for repeated design decisions and reserve arbitrary values for justified one-offs. | S15, S16 | High | C45 |
| F4 | JSDoc/TSDoc comments should document meaning, units, constraints, side effects, and return semantics rather than repeating TypeScript type names. | S17, S18 | High | C24 |
| F5 | Testing guidance should use user-visible behavior, role/label locators, and expectation-specific assertions as the default. | S19-S22 | High | C31-C36, C42 |
| F6 | UI/UX research should combine WCAG accessibility evidence, usability heuristics, and product-specific visual evidence. | S23-S25 | High | C30, C43 |

## Impact

| Artifact | Impact Type | Required Update |
| --- | --- | --- |
| `requirements.md` | Supports | R19-R23 evidence coverage is stronger. |
| `traceability.md` | Updates | Source coverage for R4-R6 and R19-R23 can move from broad partial to stronger partial/full depending on final docs/dev status. |
| `completion-audit.md` | Updates | Official source gap is reduced; final detailed guide gap remains. |

## Gaps

| Gap | Impact | Follow-Up |
| --- | --- | --- |
| Source pages were located and summarized from search snippets rather than full-page extracted notes for some sources. | Claims are suitable for planning but final guide documents should still re-open exact pages when quoting or writing detailed examples. | Re-open exact pages during each detailed guide authoring pass. |
| Commercial product visual research is not performed. | C30 remains incomplete as a visual evidence deliverable. | Define target product category and inspect comparable products in browser. |

## Sources

- MDN Promise and Array reference pages.
- Tailwind CSS official docs.
- TypeScript JSDoc reference and TSDoc.
- Playwright official docs.
- testing-library/jest-dom project docs.
- W3C WCAG and WAI overview.
- Nielsen Norman Group usability heuristics.
