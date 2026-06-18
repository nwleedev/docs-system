---
title: Next.js Development Guidance Research
date: 2026-06-18
status: draft
---

# Next.js Development Guidance Research

## Summary

Next.js 애플리케이션 레포를 새로 세팅한다고 가정하고, 잘못된 코드 작성 방식을 예방하기 위한 `docs/dev` 리서치 패키지를 만든다. 이 패키지는 기술스택을 충분히 세밀한 development guidance target으로 분해하고, 각 target에 대해 올바른 코드 패턴, 디자인 패턴, 모듈 아키텍처, 베스트/안티 코드 예시를 어떻게 리서치하고 문서화해야 하는지 정의한다.

Next.js는 이 패키지의 worked example이다. 실제 `docs/dev/README.md`와 `docs/dev/_templates/**` 시스템은 Next.js, 특정 파일명, 특정 항목 수, 특정 source list를 portable baseline으로 삼으면 안 된다. 다른 레포의 기술스택도 dependency 이름이나 넓은 카테고리 수준에서 멈추지 않고, 구현자가 실제로 판단해야 하는 세밀한 development guidance target으로 분해되어야 한다.

## Problem Frame

Next.js App Router 기반 레포는 라우팅, 서버/클라이언트 컴포넌트 경계, 서버 액션과 Route Handler 보안, 서버 상태, 폼 상태, 클라이언트 상태, 테스트, TypeScript, 스타일링, UI/UX, 모듈 아키텍처가 서로 얽힌다. 개발 지침 없이 코드부터 작성하면 `use client` 경계 확산, 서버 전용 코드의 클라이언트 번들 유입, React Hook Form과 TanStack Query의 책임 혼합, Zustand 전역 store 오용, 무의미한 테스트, `any` 확산, 임의 Tailwind 값 증가 같은 문제가 누적된다.

이 패키지는 바로 애플리케이션 코드를 작성하지 않는다. 대신 `docs/dev`가 각 관심사를 evidence-backed current rule, recommended future pattern, open question, local constraint로 나누고, 관심사별 베스트/안티 예시를 공식 문서와 실제 레포/런타임 근거로 교차검증할 수 있도록 리서치 구조를 만든다.

## Scope Preservation

| Request Phrase | Coverage Obligation | Forbidden Narrowing | Completion Proof |
| --- | --- | --- | --- |
| `"NextJS 애플리케이션 레포"를 세팅했다고 가정` | Next.js App Router 기반 프론트엔드 레포의 개발 지침 체계를 다룬다. | 일반 React 앱, 라이브러리 문서 요약, 단일 기능 구현으로 축소한다. | 요구사항, 관심사 인벤토리, 리서치 소스가 Next.js App Router를 기준으로 연결된다. |
| `"올바른 코드 패턴, 디자인 패턴, 모듈 아키텍처"` | 코드 작성 규칙뿐 아니라 컴포넌트 조합, 모듈 경계, FSD와 Next.js 경계, 응집도/결합도까지 포함한다. | 라이브러리 API 사용법만 정리한다. | 관심사 인벤토리가 `architecture`, `engineering`, `domain`, `evolution`, `ai`, `decisions`, `repository` 소유권으로 분류된다. |
| `리서치+교차검증` | 공식/1차 문서와 보조 자료 또는 로컬 요구사항을 함께 사용한다. | 블로그 하나나 기억 기반 요약으로 결론을 낸다. | `research/0001-source-map.md`와 `research/0002-concern-inventory.md`가 소스와 교차검증 방식을 기록한다. |
| `워크트리 브랜치를 생성` | main이 아닌 `.worktrees/docs-nextjs-dev-guidance-research` 작업 브랜치에서 문서를 작성한다. | main에서 직접 수정한다. | `git status --short --branch`가 `docs/nextjs-dev-guidance-research` 브랜치를 보여준다. |
| `temps/frontend-concerns/data.txt 파일에 있는 약 50가지 항목` | 이 패키지의 worked example source를 누락 없이 재구성하되, 항목 수 자체를 portable 목표로 삼지 않는다. | 일부 유명 라이브러리만 다루거나, 반대로 항목 수 맞추기를 목표로 삼는다. | `Concern Inventory`가 C00-C48까지 보존하고, 해당 항목들이 세밀한 development guidance target 분해 예시임을 명시한다. |
| `베스트 패턴, 안티패턴 예시를 다양한 케이스에서 리서치` | 각 관심사 문서가 최소 best/anti pair, 적용 조건, 실패 모드, 검증 방법을 갖도록 요구한다. | "권장한다/금지한다" 수준의 규칙만 쓴다. | `Pattern Documentation Contract`와 관심사별 expected examples가 기록된다. |
| `NextJS 애플리케이션 레포는 어디까지나 예시` | Portable `docs/dev` governance는 어떤 기술스택도 특정 파일명, Next.js, React 계열, 항목 수를 baseline으로 삼지 않도록 설계해야 한다. | Next.js/React/TanStack/RHF/Tailwind나 `data.txt`를 템플릿의 기본 전제로 만든다. | 설계 패키지가 stack-neutral target decomposition 원칙과 no-baseline guardrail을 기록한다. |
| `다른 레포에서 사용하는 기술 스택에 대해서 data.txt 파일에 나타난 분량의 관심사만큼` | “분량”보다 세밀함을 보존한다. 기술스택을 development guidance target으로 충분히 분해하고, 각 target을 evidence, owner, classification, pattern obligation으로 연결한다. | 대표 항목 몇 개만 샘플링하거나, 항목 수 집계만으로 충분하다고 본다. | 설계 패키지가 granular target decomposition, evidence-backed documentation, traceability rule을 제안한다. |
| `템플릿을 더 강화하는 것만으로는 구현할 수 있을까요?` | 템플릿-only 접근과 examples/prompt pack 접근을 비교한다. | 하나의 선호안을 근거 없이 선택한다. | RS5가 외부 근거와 options comparison을 기록한다. |
| `docs/dev/examples 폴더와 같이 특정 폴더를 세팅해서 프롬프트 파일을 따로 세팅해야 할까요?` | 재사용 가능한 프롬프트/런북 폴더의 필요성, ownership, risk, decision boundary를 판단한다. | 프롬프트 폴더를 current rule source로 만들거나 Next.js baseline으로 만든다. | RS5와 `plan.md`의 docs/dev management amendment가 `_commands` 중심 hybrid recommendation과 non-normative ownership을 기록한다. |

## Source Material Handling

`temps/frontend-concerns/data.txt`는 이 worked example에서만 사용된 gitignore 아래의 local/ephemeral source다. 따라서 이 요구사항 문서는 원본 항목을 아래 `Concern Inventory`에 자체 재구성하고, 이후 문서는 이 인벤토리를 durable source로 사용한다. 이 파일명이나 항목 수는 `docs/dev`의 portable 전제가 아니다.

## Requirements

**Research Package**

- R1. 새 리서치 패키지는 `docs/designs/nextjs-dev-guidance-research-20260618-nx50/` 아래에 tracked-ready 문서로 작성해야 한다.
- R2. 임시 파일 원본 항목은 durable 문서에 C00-C48 식별자로 재구성해야 한다.
- R3. 각 항목은 `docs/dev` owner folder, classification, primary evidence, cross-validation need, expected best/anti example type을 가져야 한다.
- R3a. C00-C48은 항목 수 기준이 아니라 기술스택을 세밀한 development guidance target으로 분해한 worked example로 해석해야 한다.

**Evidence And Cross-Validation**

- R4. Next.js, React, TanStack Query, React Hook Form, Zustand, Testing Library, TypeScript/ESLint, Tailwind, FSD 관련 주장은 공식 문서 또는 1차 문서를 우선해야 한다.
- R5. 코드 패턴이나 모듈 아키텍처 권고는 공식 문서만으로 끝내지 않고 Next.js App Router 레포에 적용할 때의 경계, 실패 모드, 검증 방법을 함께 기록해야 한다.
- R6. 시각적 UI/UX 리서치는 상용 서비스 화면 조사를 요구하지만, 현재 패키지에서는 조사 방법과 evidence contract를 정의하고 실제 특정 제품 캡처는 별도 리서치 문서나 브라우저 검증으로 분리해야 한다.

**Pattern Documentation Contract**

- R7. 각 관심사 상세 문서는 `Scenario Coverage`를 예시보다 먼저 두어야 한다.
- R8. 각 best pattern은 intent, applicability, impact, target repository constraints, verification을 설명해야 한다.
- R9. 각 anti-pattern은 failure mode, user/maintenance impact, safer alternative, detection signal을 설명해야 한다.
- R10. 코드 예시는 target repository evidence가 있을 때 실제 코드 기반으로 쓰고, 아직 레포가 없는 상태에서는 Next.js App Router 가정의 pseudo-code로 표시해야 한다.

**Next.js App Router Development Concerns**

- R11. App Router 라우팅, route group, layout/template/loading/error 경계는 architecture guidance로 문서화해야 한다.
- R12. Server Component와 Client Component 배치는 Next.js와 React 경계, `use client`, serialization, browser API 사용 가능성, 번들 영향을 기준으로 문서화해야 한다.
- R13. 서버 컴포넌트, Middleware, Route Handler, Server Action 보안은 인증/인가를 호출자나 클라이언트 신뢰가 아니라 서버 경계에서 검증하는 패턴으로 문서화해야 한다.
- R14. 서버 전용 모듈과 클라이언트 전용 모듈 혼합 방지는 `server-only`, `client-only`, import direction, FSD layer rule로 문서화해야 한다.

**State, Form, Data, React Concerns**

- R15. TanStack Query는 서버 상태 소유권, query key, mutation state, invalidation, SSR hydration, form default value 연동을 분리해 문서화해야 한다.
- R16. React Hook Form은 uncontrolled 중심 form state, `useWatch`, `useFormContext`, `useFieldArray`, resolver validation, render isolation, props drilling 감소를 분리해 문서화해야 한다.
- R17. Zustand는 client state와 server state를 혼동하지 않고, Next.js SSR/request boundary, per-request store, selector/equality, 전역 store 오용을 기준으로 문서화해야 한다.
- R18. React Effect, memoization, refs/state, cleanup, children composition, compound component, JSX readability는 React 공식 지침에 맞춰 best/anti pair로 문서화해야 한다.

**Testing, TypeScript, Styling, UI/UX Concerns**

- R19. 테스트 지침은 TDD, 관찰 가능한 사용자 동작, 접근성 selector, 무의미한 테스트 방지, 테스트 과잉 제거 기준을 포함해야 한다.
- R20. TypeScript와 ESLint 지침은 `any` 금지, 타입 설계, lint rule, Next.js ESLint integration을 포함해야 한다.
- R21. Tailwind CSS 지침은 design token, semantic abstraction, 하드코딩 방지, class composition boundary를 포함해야 한다.
- R22. UI 컴포넌트 라이브러리와 상용 서비스 시각 리서치는 선택 기준, 접근성, composability, theming, lock-in, visual evidence contract를 포함해야 한다.

**Software Engineering Concerns**

- R23. 응집도, 결합도, 단일 책임, 순수 함수, 반복문/배열 메서드/비동기 병렬화/JSDoc은 프론트엔드 코드 리뷰에서 적용 가능한 engineering guidance로 문서화해야 한다.
- R24. 관심사가 너무 넓은 경우 하나의 문서로 뭉치지 않고 architecture, engineering, domain, evolution, ai, decisions, repository evidence로 분리해야 한다.

**Proposed Portable docs/dev Target Decomposition System**

- R25. Next.js 관련 항목은 worked example로만 남겨야 하며, `docs/dev`의 portable 설계는 Next.js, React, TanStack Query, RHF, Zustand, Tailwind, FSD, `data.txt`, 특정 항목 수를 기본 전제로 삼으면 안 된다.
- R26. `docs/dev`는 기술스택을 dependency 이름이나 넓은 카테고리로만 다루지 않고, 구현자가 판단해야 하는 development guidance target으로 충분히 세밀하게 분해하는 시스템으로 설계해야 한다.
- R27. 설계 패키지는 세밀한 target을 repository evidence, owner-folder docs, decision records, visual/product research로 라우팅하는 규칙을 제안해야 한다.
- R28. 설계 패키지는 source location, persistence state, optional item count, stable target IDs or clusters, coverage rule, reconstruction location, per-target mapping, pattern coverage를 기록하는 제안 필드를 정의해야 한다.
- R29. 설계 패키지는 대규모 또는 세밀한 기술스택 관심사가 샘플링 몇 개로 축소되지 않았음을 검증하는 coverage audit 제안을 포함해야 한다.
- R30. 다른 기술스택도 충분히 세밀한 target이 evidence, owner folder, classification, best/anti pattern obligation, pattern coverage, follow-up으로 매핑되기 전에는 completion을 주장하면 안 된다는 제안을 기록해야 한다.

**Template Versus Examples Strategy**

- R31. 템플릿 강화만으로 broad source pack prompt를 충분히 안정적으로 실행할 수 있는지 리서치해야 한다.
- R32. `docs/dev/_commands` 같은 재사용 가능한 프롬프트/런북 폴더가 필요한지 리서치해야 한다.
- R33. 비교는 최소한 template-only, prompt/runbook-only, hybrid 접근의 장단점을 포함해야 한다.
- R34. 리서치는 prompt engineering 공식/1차 자료와 documentation architecture 자료를 교차검증해야 한다.
- R35. `_commands` 폴더를 권장한다면, current rule source가 아니라 non-normative prompt/runbook layer라는 ownership boundary를 명시해야 한다.
- R36. Next.js worked example이나 source pack이 portable baseline으로 승격되지 않도록 `_commands`, `repository`, owner folders 사이의 portability guardrail을 정의해야 한다.

**docs/dev Management Upgrade Plan**

- R37. 지금까지 수집한 source pack, template, prompt-folder 논의를 바탕으로 `docs/dev` 파일 관리 시스템 업그레이드 제안 플랜을 기존 `plan.md`에 amendment로 작성해야 한다.
- R38. 플랜은 `docs/dev/README.md`, `docs/dev/_templates/**`, `docs/dev/_commands/**`, `docs/dev/repository/**`, `docs/dev/<owner>/**`의 책임 경계를 구분해야 한다.
- R39. 플랜은 `_commands`가 재사용 가능한 프롬프트/런북만 소유하며 source pack, current rule, target repository evidence를 소유하지 않는다는 금지선을 포함해야 한다.
- R40. 플랜은 단계별 구현 단위, 검증 기준, decision boundary, migration strategy를 포함해야 한다.

**Plan Coverage Review**

- R41. `plan.md`는 RS1-RS5의 findings, gaps, open questions, implementation guidance가 어떤 plan unit, amendment, verification, deferred follow-up으로 반영됐는지 리뷰해야 한다.
- R42. 리뷰는 플랜에 누락된 항목과 이미 반영된 항목을 구분하고, 누락이 있다면 플랜 본문에 보강하거나 명시적 follow-up으로 남겨야 한다.
- R43. 리뷰 결과는 `traceability.md`와 `completion-audit.md`에서 검증 가능한 evidence로 연결해야 한다.

**Prior No-Direct-Change Constraint And Implementation Authorization**

- R44. 이전 검토 단계에서는 사용자가 `docs/dev/README.md`나 `docs/dev/_templates/**` 변경을 명령하지 않았으므로, `docs/dev/**` tracked 파일을 변경하지 않는 제약을 적용했다.
- R45. 현재 사용자가 업데이트된 설계 문서 패키지를 바탕으로 플랜 완수와 Git 커밋을 명시했으므로, R44의 이전 제약은 이번 구현 단계에서 대체된다.
- R46. 설계 패키지와 실제 `docs/dev` 템플릿은 `docs/dev`가 Next.js, 특정 파일명, `data.txt`, 특정 source list, 특정 항목 수를 portable baseline으로 삼지 않는다는 원칙을 유지해야 한다.
- R47. 설계 패키지와 실제 `docs/dev` 템플릿은 `docs/dev`가 기술스택을 충분히 세밀한 development guidance target으로 분해하고 근거 기반으로 문서화하는 시스템이라는 관점을 명시해야 한다.

**docs/dev Template And Command Implementation**

- R48. `docs/dev/README.md`는 `_commands` 폴더 책임과 target decomposition 절차를 portable governance로 설명해야 한다.
- R49. `docs/dev/_templates/README.md`, `docs/dev/_templates/repository/_template.md`, `docs/dev/_templates/_bootstrap-audit.md`는 broad technology-stack input, explicit source item, derived target coverage, pattern obligation을 검증 가능한 템플릿 필드와 audit gate로 포함해야 한다.
- R50. `docs/dev/_commands/**`는 재사용 가능한 prompt/runbook만 소유해야 하며, source pack, current rule, repository evidence, accepted decision, worked example을 소유하면 안 된다.
- R51. 구현된 템플릿과 명령 파일은 다양한 레포의 기술스택을 세밀하게 분석하도록 유도해야 하지만, 특정 worked example의 stack name, file name, source count, item count를 요구하면 안 된다.

## Concern Inventory

| ID | Source Line | Concern | Owner | Classification | Required Evidence | Expected Best/Anti Example |
| --- | ---: | --- | --- | --- | --- | --- |
| C00 | 1 | Next.js 애플리케이션에서의 dev docs 세팅 | repository | Current research target | `docs/dev/README.md`, `docs/dev/_templates/**` | docs/dev bootstrap best/anti |
| C01 | 3 | Next.js App Router 라우팅 | architecture | Recommended Future Pattern | Next.js App Router docs | route segment/layout boundary best/anti |
| C02 | 4 | Server Component와 Client Component 배치 | architecture | Recommended Future Pattern | Next.js + React docs | server-first composition vs client boundary sprawl |
| C03 | 5 | Server Component 보안 이슈 | engineering | Recommended Future Pattern | Next.js security docs | server-only data access vs leaking secrets |
| C04 | 6 | Middleware 보안 이슈 | engineering | Recommended Future Pattern | Next.js middleware docs | coarse request guard vs business auth in middleware only |
| C05 | 7 | API Routes, Route Handlers, Server Actions 보안 | engineering | Recommended Future Pattern | Next.js route/action docs | authenticated mutation boundary vs trusting client input |
| C06 | 8 | TanStack Query 상세 | engineering | Recommended Future Pattern | TanStack Query docs | server state ownership vs duplicating remote state in useState |
| C07 | 9 | TanStack Query Advanced Server Side Rendering | engineering | Recommended Future Pattern | TanStack advanced SSR docs | prefetch/dehydrate boundary vs global QueryClient reuse |
| C08 | 10 | Next.js + FSD, `pages`를 `entries`로 관리 | architecture | Open Question | FSD Next.js docs + target layout | route entry layer naming best/anti |
| C09 | 11 | FSD에서 server-only/client-only 모듈 혼합 방지 | architecture | Recommended Future Pattern | Next.js server-only + FSD docs | import direction guard vs cross-boundary imports |
| C10 | 12 | Zustand 올바른 사용 | engineering | Recommended Future Pattern | Zustand Next.js guide | per-request/client store vs module singleton SSR leak |
| C11 | 13 | React Hook Form 상세 | engineering | Recommended Future Pattern | RHF docs | form state ownership vs controlled everything |
| C12 | 14 | RHF hooks: `useWatch`, `useFormContext`, `useFieldArray` | engineering | Recommended Future Pattern | RHF hook docs | scoped subscriptions vs root watch rerender |
| C13 | 15 | `useFieldArray` 리스트 입력과 렌더링 최적화 | engineering | Recommended Future Pattern | RHF useFieldArray docs | stable field id vs array index key |
| C14 | 16 | RHF 렌더링 최적화 | engineering | Recommended Future Pattern | RHF performance docs | isolated fields vs parent-driven form rerender |
| C15 | 17 | RHF + zod + resolver validation | engineering | Recommended Future Pattern | RHF resolver + Zod docs | schema resolver contract vs duplicate ad hoc validation |
| C16 | 18 | RHF로 props drilling 최소화 | engineering | Recommended Future Pattern | RHF FormProvider docs | context provider boundary vs passing register through many layers |
| C17 | 19 | QueryClient method를 RHF async default values에 주입 | engineering | Open Question | TanStack Query + RHF docs | cached default loader vs effect reset race |
| C18 | 20 | TanStack Query query key 관리 | engineering | Recommended Future Pattern | TanStack query keys docs | key factory/scope vs stringly broad keys |
| C19 | 21 | `useMutation` 상태로 useState 대체 | engineering | Recommended Future Pattern | TanStack mutation docs | mutation status source vs duplicated pending/error state |
| C20 | 22 | React "You Might Not Need an Effect" | engineering | Recommended Future Pattern | React docs | derive during render vs effect-driven derived state |
| C21 | 23 | JSX 표현식 중첩 이슈 | engineering | Recommended Future Pattern | React composition/readability docs | extracted named values/components vs nested inline logic |
| C22 | 24 | FSD 구조에서 props/표현식 증가 방지 컴포넌트 분리 | architecture | Recommended Future Pattern | FSD + React docs | feature component split vs giant route component |
| C23 | 25 | 결합도 낮추고 응집력 높이기 | architecture | Recommended Future Pattern | software design + local architecture | cohesive feature boundary vs shared dumping ground |
| C24 | 26 | JSDoc/TSDoc 작성 방법 | engineering | Recommended Future Pattern | TypeScript/TSDoc docs | caller contract docs vs redundant type restatement |
| C25 | 27 | `useMemo`/`useCallback` 남용 방지 | engineering | Recommended Future Pattern | React docs | measured memoization vs blanket memo |
| C26 | 28 | Children composition, Compound Component Pattern | architecture | Recommended Future Pattern | React composition docs | composable slots/context vs boolean prop explosion |
| C27 | 29 | `useRef`/`useState` 남용 | engineering | Recommended Future Pattern | React refs/state docs | state for UI, ref for non-render value vs hidden UI state in ref |
| C28 | 30 | `useRef` vs effect cleanup for ResizeObserver | engineering | Recommended Future Pattern | React effect cleanup docs | cleanup-owned observer vs ref-only lifecycle tracking |
| C29 | 31 | UI 컴포넌트 라이브러리 리서치 | decisions | Open Question | library docs, accessibility, bundle, theming evidence | decision matrix vs popularity-only choice |
| C30 | 32 | 상용 서비스 시각 리서치 | research | Open Question | browser screenshots, product URLs, accessibility notes | visual pattern inventory vs copying surface style |
| C31 | 33 | 올바른 TDD와 사용자 동작 테스트 | engineering | Recommended Future Pattern | Testing Library + Playwright docs | behavior-first test vs implementation-first test |
| C32 | 34 | 무의미한 테스트 정의와 방지 | engineering | Recommended Future Pattern | Testing Library principles | outcome assertion vs snapshot/implementation assertion only |
| C33 | 35 | 테스트 코드 품질 확인 | engineering | Recommended Future Pattern | Testing Library, mutation/e2e strategy | failing-for-right-reason check vs always-green mock |
| C34 | 36 | 접근성 selector 활용 | engineering | Recommended Future Pattern | Testing Library query priority | role/label queries vs test id first |
| C35 | 37 | 실제 앱 동작 보장 테스트 | engineering | Recommended Future Pattern | Playwright/Testing Library docs | integrated user flow vs isolated mock-only path |
| C36 | 38 | 테스트 코드 과잉과 제거 기준 | engineering | Open Question | test pyramid/local coverage evidence | coverage by risk vs duplicate assertion sprawl |
| C37 | 39 | TypeScript `any` 금지와 타입 관리 | engineering | Recommended Future Pattern | TypeScript + typescript-eslint docs | unknown/narrowing/domain types vs any escape hatch |
| C38 | 40 | await in loop 대신 Promise.all/allSettled | engineering | Recommended Future Pattern | JS/MDN + Vercel async guidance | parallel independent IO vs serial waterfall |
| C39 | 41 | `for...of`, `for...in`, 일반 `for` 비교 | engineering | Recommended Future Pattern | JS/MDN docs | iteration by data shape vs one-loop-for-all |
| C40 | 42 | `forEach`, `map`, `reduce`, `filter` 사용 기준 | engineering | Recommended Future Pattern | JS/MDN docs | semantic array method vs clever reduce |
| C41 | 43 | 순수 함수로 코드 작성 | engineering | Recommended Future Pattern | React purity docs | pure transform/helper vs hidden side effect |
| C42 | 44 | `toContain`, `toHaveTextContent` 사용 가능성 | engineering | Open Question | jest-dom + Testing Library docs | accessible assertion vs brittle text blob |
| C43 | 45 | 좋은 UI/UX 기준과 사례 | domain | Open Question | WCAG/Nielsen/product research | task-centered UI evidence vs aesthetic-only judgment |
| C44 | 46 | 필요한 상황에서만 props drilling | architecture | Recommended Future Pattern | React state sharing/composition docs | local explicit prop vs premature global/context |
| C45 | 47 | Tailwind CSS 스타일링과 하드코딩 감소 | engineering | Recommended Future Pattern | Tailwind docs | tokens/variants vs arbitrary value sprawl |
| C46 | 48 | ESLint 설정 | engineering | Recommended Future Pattern | Next.js ESLint + typescript-eslint docs | strict lint profile vs disabled rules |
| C47 | 50 | 소프트웨어 공학 활용 | architecture | Recommended Future Pattern | design principles + local evidence | principle-to-review checklist vs abstract slogan |
| C48 | 51 | 단일 책임 단위 설계 | architecture | Recommended Future Pattern | React/components + design principles | one reason to change vs multi-purpose component |

## Required Artifacts And Persistence

| Artifact | Required For | Expected Persistence | Completion Proof | Decision Needed |
| --- | --- | --- | --- | --- |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/requirements.md` | R1-R24 | Tracked | `git status --porcelain` | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/README.md` | R3-R6 | Tracked | file exists and indexes records | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0001-source-map.md` | R4-R6 | Tracked | official and cross-validation sources recorded | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0002-concern-inventory.md` | R2-R24 | Tracked | C00-C48 mapped to evidence and docs/dev owner | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/plan.md` | R1-R24 | Tracked | plan units and verification rows present | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/traceability.md` | R1-R24 | Tracked | requirements map to concerns and evidence | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/completion-audit.md` | R1-R24 | Tracked | requirement-level audit present | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0004-portable-source-pack-workflow.md` | R25-R30 | Tracked | proposed stack-neutral target decomposition workflow present | None |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md` | R31-R36 | Tracked | template-only vs prompt/runbook strategy researched | Current implementation follows the accepted `_commands` ownership boundary |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/plan.md` | R37-R40 | Tracked | upgrade plan amendment covers ownership, sequencing, guardrails, and verification | Current implementation completes the template and `_commands` management upgrade |
| `docs/designs/nextjs-dev-guidance-research-20260618-nx50/plan.md` | R41-R43 | Tracked | plan coverage review maps RS1-RS5 findings, gaps, and open questions to plan treatment | None |
| `docs/dev/README.md` | R46-R48, R51 | Tracked | target decomposition and `_commands` ownership are present | None |
| `docs/dev/_templates/README.md` | R46-R49, R51 | Tracked | broad input router and command boundary are present | None |
| `docs/dev/_templates/repository/_template.md` | R49, R51 | Tracked | broad input and target coverage fields are present | None |
| `docs/dev/_templates/_bootstrap-audit.md` | R49, R51 | Tracked | target decomposition and pattern coverage audit rows are present | None |
| `docs/dev/_commands/**` | R50-R51 | Tracked | reusable non-normative command files exist | None |

## Scope Boundaries

**Deferred**

- 실제 Next.js 앱 코드 구현.
- worked example 관심사의 최종 `docs/dev/<folder>/<topic>.md` 전체 작성.
- UI/UX 상용 서비스 스크린샷 수집.
- 특정 UI 컴포넌트 라이브러리 채택 결정.
- public repository sampling의 full matrix 작성.
- 다른 기술스택에 대한 실제 source pack 작성. 이 패키지는 절차를 제안하고, Next.js source pack은 worked example로 유지한다.
- 특정 target repository의 `docs/dev/repository/**` source pack 작성.

**Out Of Scope**

- main 브랜치 직접 수정.
- `temps/` 파일을 completion evidence로 사용하는 것.
- 공식 문서와 충돌하는 local convention을 current rule로 승격하는 것.
- Next.js worked example을 portable template baseline으로 만드는 것.
- 프롬프트 파일을 current engineering rule의 source of truth로 사용하는 것.
- source pack이나 worked evidence를 `docs/dev/_commands/**` 아래에 저장하는 것.

## Sources

- `temps/frontend-concerns/data.txt`: local/ephemeral worked-example source reconstructed as C00-C48; not a portable input requirement.
- `docs/dev/README.md`: docs/dev owner folders, target decomposition, command ownership, and evidence promotion rules.
- `docs/dev/_templates/README.md`: template routing, broad input router, command boundary, and pattern documentation contract.
- `docs/dev/_commands/**`: non-normative reusable prompt/runbook implementation for broad source-pack workflows.
- Next.js official documentation through Context7 `/vercel/next.js`: App Router, Server Components, Client Components, Route Handlers, Server Actions, Middleware.
- React official documentation through Context7 `/reactjs/react.dev`: Effects, refs, memoization, purity, children composition.
- TanStack Query official documentation through Context7 `/tanstack/query`: query keys, mutations, invalidation, advanced SSR.
- React Hook Form official documentation search results: `useFieldArray`, `useWatch`, `useForm`, `watch`.
- Zustand official documentation search results: Next.js setup and SSR constraints.
- Testing Library official documentation search results: query priority and `ByTestId` fallback.
- typescript-eslint official documentation search result: `no-explicit-any`.
- Feature-Sliced Design official documentation search result: usage with Next.js.
