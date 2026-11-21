# Design documents

This directory holds requirements, research findings, approved decisions, and plans by topic. AI agents review, investigate, plan, and verify within the scope of the request. Record approved decisions, create documents only when requested, and report changes to existing documents.

## Files for each topic

```text
docs/designs/
  README.md
  <topic>-<nonce>/
    requirements.md
    references/
      <reference>.md
    decisions/
      <decision>.md
    plan.md
```

Record each topic's requirements in its `requirements.md`. Reuse the topic directory when work continues on the same subject. Add research notes, decisions, and a plan when the conditions below apply. Create directories when there is content to store in them and omit placeholder text.

## `requirements.md` records the desired result and constraints

For a review request, leave files untouched. Explain what is missing from the requirements or where different interpretations are possible.

When asked to draft or revise requirements, first check for an existing document on the same topic. Create a file if no such document exists or if the user explicitly asks for a separate one. Otherwise edit only the requested parts of the existing document. If the user asks for an empty file, leave it empty.

Describe when and how the user can observe that the requirement is met. Include any constraints that must still hold. Record an open question when the answer would change the outcome.

### Examples

- **Checking that comments are disabled.** An administrator turns off comments and opens an existing post. The comments area displays a notice that comments are disabled. Previously posted comments are hidden on that screen.
- **An open question about flood repairs.** If a home floods, is it enough for the homeowner to compare quotes from several providers? Should the homeowner also be able to request an immediate visit without waiting for quotes?

## `references/*.md` records research for later use

Write a research note when the findings will be needed for later planning or review. Record the question, the sources, and what each source establishes. When recommending an approach based on those findings, explain why they support it and what they leave unresolved.

### Example

- **Test sales of LEGO architecture sets.** At some Chicago stores, customers bought the architecture sets even though they cost more than other sets with the same number of pieces. The test sales leave open whether buyers in other regions would pay the same price.

## `decisions/*.md` records approved choices and their rationale

Create a decision record when an approved choice affects what later steps involve or when they can start, and the reason for that choice needs to be recorded. Describe the decision to be made, the alternatives considered, the choice made, and why. Identify the steps it affects. Until a decision is approved, keep the options in research notes or record the open question.

### Example

- **Redesigning the home screen of Oregon's traffic management system.** Even a home screen change required testing and deploying the entire system, so regional traffic management centers waited a long time for the changes they needed. The Oregon Department of Transportation and the development team at Oregon State University chose to divide the system into services they could deploy independently. They started with the home screen.

## `plan.md` records the order of steps and how to check completion

Create `plan.md` when the desired outcome is settled and the order of steps needs to be consulted during execution. Link to the entries in `requirements.md` on which the plan is based. Identify what each step changes and what result it should produce. If a later step depends on that result, explain why and order the steps accordingly. Describe how to verify each step and how to check that the full set of requirements is met at the end.

If the implementation method is uncertain, explain what you need to find out before you can plan the next step. Record open decisions alongside the steps that depend on them and plan independent steps first. After carrying out the plan at the user's request, record what you verified and what remains.

If requirements change, or new evidence makes the planned order or method unworkable, pause the affected steps. If the desired result changes, wait for confirmation of the change and permission to revise the requirements. Then update `requirements.md` first and the plan second. If only the method changes, record the evidence and update the order and checks for the affected steps. Unaffected steps can continue within the scope of the request.

### Example

- **Implementing a screen after prototype review and tool selection.** The user tries the prototype and decides which changes should be included. The implementation tools can be chosen independently of that review. Once both steps are complete, implement the screen and verify that it includes the agreed changes.
