# Design documents

This directory holds requirements, research findings, approved decisions, and execution plans by topic. Review, investigate, plan, and verify within the scope of the request. Create documents when creation falls within that scope and report edits to existing documents.

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

Create `requirements.md` if no requirements document exists or the user requests a separate one. When revising an existing document, edit only the requested parts. If the user asks for an empty file, leave it empty.

For each requirement, record the usage scenario and inputs, the expected behavior or deliverable, what to change and which constraints to preserve, and the observable result and pass criteria for verification. Give each requirement a heading or identifier so the plan can reference it. Record an open question if its answer would change the outcome, what must change, a constraint, or a completion criterion. If a plan already exists, identify the affected steps. Update the requirements after the user decides.

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

## `plan.md` records the order of steps, completion criteria, and progress

Create or update `plan.md` when the request includes maintaining a written plan. Summarize the intended outcome and constraints at the top. Link to the relevant entries in `requirements.md` and any recorded decisions that the plan follows. Record the following for each step.

- The requirement the step follows, what to change, and what work to perform
- The deliverable or verification result needed from a prior step and the deliverable this step should produce
- The verification method and pass criteria
- The current completion status, actual verification results and evidence, and remaining work or conditions for resuming
- For a pending step, the user decision or investigation result needed and what would allow you to confirm the step

Update progress after verifying a step or when execution stops. Mark steps complete only when they meet their pass criteria. Record the final verification result for each requirement and constraint covered by the request.

When the implementation approach changes, record why and identify the affected steps and checks. Mark a requirements change as pending if it still needs a user decision. Once the change is confirmed, update `requirements.md` if you have permission to edit it, then update the plan.

### Example

- **Implementing a screen after prototype review and tool selection.** Mark screen implementation as pending while changes to the prototype are still undecided. Plan tool selection if it can proceed independently. Confirm the implementation step once the changes and tools are settled, then verify the screen behavior for each agreed change.
