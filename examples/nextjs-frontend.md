This file is a free-form example prompt for writing `docs/dev` guidance in a NextJS-based repository. Expand the concerns below in whatever structure best fits the target repository, but for each concern research and cross-validate external public repositories, official documentation, and the local repository baseline. Document what not to do, the required safer alternative, best-practice code patterns, anti-pattern examples across multiple code scenarios, verification methods, and ESLint enforcement options under `docs/dev`.

When developing a NextJS-based application, research and cross-validate **how to write correct code, which design patterns to use, and how to structure the module architecture** for each item below, then document the findings under `docs/dev`. For every concern, also research and cross-validate **best-practice code pattern examples and anti-pattern examples** across multiple code scenarios, and document the code examples as well.

NextJS App Router routing
How to place NextJS Server Components and Client Components in the appropriate locations
Security concerns when using NextJS Server Components
Security concerns when using NextJS Middleware
Security concerns when using NextJS API Routes and Server Actions
Detailed TanStack Query guidance
TanStack Query Advanced Server Side Rendering
NextJS + Feature-Sliced Design: because of NextJS-specific routing behavior, manage the `pages` module by renaming it to `entries` or `entry`
Issues in NextJS + Feature-Sliced Design where server-only modules and client-only modules become mixed together
Correct usage of Zustand
Detailed React Hook Form guidance
How to use hooks provided by React Hook Form, such as `useWatch`, `useFormContext`, and `useFieldArray`
Managing list-shaped input fields and optimizing rendering with `useFieldArray` in React Hook Form
Rendering optimization with React Hook Form
Schema validation with React Hook Form, Zod, and `@hookform/resolvers`
How to minimize props drilling with React Hook Form
Injecting TanStack Query query client methods into React Hook Form `async defaultValues` as functions
Query key management in TanStack Query
How to manage mutation-related state with `useMutation` in TanStack Query instead of duplicating it with `useState`
React "You Might Not Need an Effect" concerns
Issues caused by nesting multiple expressions inside React JSX markup
How to split components in a NextJS + Feature-Sliced Design structure to prevent uncontrolled growth of props and expressions
How to reduce coupling and increase cohesion in the application
How to write JSDoc, including not only short descriptions but also the information needed to explain parameters, return values, and related types
Why React `useMemo` and `useCallback` should not be overused
React children-based composition and the Compound Component Pattern
Issues caused by overusing React `useRef` and overusing `useState`
React `useRef` versus cleanup functions, for example whether to track a `ResizeObserver` with `useRef` or declare and call cleanup logic inside `useEffect`
Research on UI component libraries
Visual research on commercial services that provide functionality similar to our application, including how they build layouts, pages, and styles
Correct TDD practices, including writing tests for observable user behavior
The definition and examples of meaningless tests, and how to prevent issues caused by writing meaningless tests
How to determine whether the tests that were written are actually good tests
Using accessibility selectors in test code instead of test IDs and hardcoded selectors
Writing tests that can guarantee the real behavior of the application
Issues caused by having too many tests, and how to remove tests when they are no longer useful
How to forbid the `any` type in TypeScript and write and manage types correctly
How to use `Promise.all` and `Promise.allSettled` instead of overusing `await` inside loops
Research comparing the strengths and weaknesses of `for...of`, `for...in`, and regular `for` loops, including when each should be used
When to use array methods such as `forEach`, `map`, `reduce`, and `filter`, including cases where `reduce` may be used instead of `filter` and `map`
How to write code as pure functions whenever possible
Whether frontend test code should use assertions such as `toContain` and `toHaveTextContent`
Criteria for good UI/UX, including examples of intuitive and user-friendly UI/UX
How to use props drilling only when it is truly necessary
How to style with Tailwind CSS and reduce hardcoded styling
How to apply software engineering principles to our application
How to make each unit, such as a function, class, or component, responsible for only one role

Also document how to configure ESLint to enforce code patterns for the items above.
