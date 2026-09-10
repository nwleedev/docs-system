# User choices, exploration rounds, and stage results

Interpret the characteristics the user confirms, keep their scope explicit, and return enough context for a later interaction to continue. Keep preference confirmation separate from validation of rules in running UI. This procedure does not require or provide persistent storage.

## Continue from available context

Use a stage result supplied by the caller or visible in the current conversation. Confirm that its topic and target still match the current request, then follow its next action. Do not restart discovery when the result shows that a choice, implementation input, or post-change validation is next.

If the user replies with a candidate number or another short choice and the available context identifies exactly one pending question, connect that answer to the question. Do not ask the user to invoke or name this skill again. If several questions could match, ask which one the reply addresses. If prior context is unavailable, ask only for the missing topic, candidates, or question and do not claim to have restored them.

Visual material must remain available for a visual comparison. If a prior result names material that can no longer be viewed, request or reacquire that material before asking the user to judge its appearance.

## Return a stage result

At the end of every stage, return the applicable information below in a concise form. This is a semantic checklist, not a required schema.

- Current visual topic, current procedure, and the representative user task and screen with the reason each was included or excluded
- Candidate identifiers, viewable visual material and observed states, plus each source item's role and approval or uncertainty status
- Comparison characteristics, the exact pending question, and the allowed reply
- Confirmed preferences and dislikes, their scope, and the user's stated reason
- Unresolved choices, AI hypotheses, and tentative implementation proposals
- Validated rules, inspected screens and conditions, remaining differences, and exceptions
- Completed exploration rounds, the round awaiting feedback, and any approved extension
- Next action and the user input or current running screen needed for it

Keep confirmed, tentative, unresolved, and validated information distinct. A caller may save or transform the result through its own process, but this procedure must work when no document system or storage is available. Do not write project-specific choices into this skill's files, require a fixed file format, or report unsaved state as persistent.

Before requesting a choice, assemble the candidate evidence, question, pending round, and next action in the stage result. If the interaction ends before an answer is accepted, these items remain the result of the stage and the round remains pending.

## Request and interpret a choice

Use a structured input capability only when it is available, can keep the question active until the user responds, and returns an explicit accepted, declined, or canceled outcome. Otherwise present the candidate comparison, allowed reply, and exact question in the ordinary response, then wait for the next user message.

Interpret outcomes without collapsing them into one state.

- Accepted: Apply only the answer the user provided. Confirm the selected characteristics and their scope before treating them as preferences.
- Declined: Treat the offered choices as not selected. Do not infer a broader dislike or an alternative preference that the user did not state.
- Canceled or unanswered: Keep the question and round pending. Do not record a choice, rejection, or completed round.

If a structured request disappears without an outcome, treat it as unanswered and return the candidates and question through the ordinary response when control resumes. Never rely on a transient input UI as the only copy of the pending question.

## Clarify what a choice means

Confirm which characteristics the user wants to keep from a selected candidate. Choosing a screen does not imply a preference for all of its colors, fonts, and corners. Ask what to keep, remove, take from another candidate, or leave undecided in the compared screens.

If the user chooses only the corners of one button, retain a shape preference for that button. Before generalizing it into a corner rule for all components, confirm the scope with the user and validate reuse in running UI.

Keep the following states separate.

- Confirmed preferences and dislikes: Characteristics the user chooses or explicitly says to avoid, together with where they apply.
- Unresolved choices: Elements not yet chosen or deliberately deferred. No response means neither approval nor rejection.
- AI hypotheses: Possibilities inferred to guide searching or comparison. They are not user preferences.
- Tentative implementation proposals: Characteristics and values provisionally applied for inspection. Approval of a generated mockup does not validate those values in running UI.
- Validated rules: Rules checked in running UI under stated conditions and accepted by the user. Follow the post-change validation procedure linked from `SKILL.md` when updating them.

If a new choice conflicts with an existing principle, explain both and ask the user how to proceed. Options include changing the existing rule, approving an exception, limiting the choice to a specific component, or leaving it unresolved. Until the user decides, retain existing validated rules and do not pass the conflicting choice as a finalized specification.

## Count rounds and stop exploration

Exploration is limited to three rounds per visual topic by default. A round ends only after candidates have been presented and the user's accepted or declined feedback has been interpreted.

- Count one round if the user rejects every candidate or says they cannot decide.
- While feedback is pending or a question is canceled or unanswered, the same round remains in progress.
- Do not count internal searches or tool calls as separate rounds.
- If access failures prevent presentation of comparison material, do not increase the count. Follow the alternative search and stopping conditions in the real UI discovery procedure.

Exploration may end before the limit if creating the next screen would help the user decide more effectively. End initial exploration when there are distinct directions, three to seven principles that explain them, known dislikes, and reusable constraints. Do not invent principles the user has not chosen to meet a target count or keep searching until every characteristic is finalized.

If the direction remains unresolved after three rounds, stop automatic searching and ask the user for the next action. Perform only the chosen action: a tentative visualization with uncertainty identified, an extension with a specified number of additional rounds, or deferral of the topic. For an approved extension, include the additional rounds and stopping point in the stage result while retaining the previous completed count. Do not choose an extension length when the user has not specified one.

A choice to create a tentative visualization does not resolve outstanding decisions. Do not automatically start a new visual topic after ending or deferring exploration. When asked for a new screen, use existing rules first. Propose renewed exploration only for a new visual question those rules cannot answer.
