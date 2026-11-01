# Decisions and continuation

Discuss the intended experience and compare meaningful directions with the user. Resolve routine details from evidence or tentative defaults so the conversation concerns outcomes rather than CSS attributes.

## Decide whether a question is necessary

- **Evidence-resolved:** Requirements, conventions, accessibility conditions, or validated rules establish the choice. Explain the reason and proceed.
- **Defaultable:** Differences have little effect on the outcome and fit the approved direction. Choose a coherent, reversible tentative default and state its scope.
- **Decision-required:** Alternatives meaningfully change actions, information priority, density, risk, or visual direction. Show observable differences and trade-offs, then request a scoped choice.

For a new direction, present the required theme comparison even when conventions resolve routine details. Ask about the visible differences that affect the intended experience; do not infer a preference from a subscription business model or from a vague adjective alone. A sufficiently described intent does not need an intake questionnaire.

For a conflict with a confirmed preference or validated rule, explain the incompatible conditions and ask whether to change the rule, approve an exception, limit the choice, or defer it. Preserve the existing rule until resolved.

## Continue from available context

Check that the supplied result or conversation matches the topic and target; follow its next action. Connect a short answer to exactly one identifiable pending question. If ambiguous or missing, ask only for the missing question, topic, or candidates. Reacquire unavailable visuals before requesting an appearance judgment.

## Request and interpret a choice

For a new comparison, present consequential directions, scenario effects, supporting visuals, trade-offs, and the exact question. Do not ask for each CSS attribute. Selection approves only the named or clarified characteristics; confirm unclear scope before extending it.

When the reply concerns a theme, distinguish the retained hierarchy, imagery, density, or other named characteristics from unchosen parts. Turn feedback into applicable design conditions. Liking one region does not approve the entire reference, all screens, or every interaction. Explain the next change in the conversation, not as text inside the service screen.

Keep candidates, viewable evidence, the exact question, pending round, and next action available before asking. Use structured input only when it holds the question until a response and reports an explicit accepted, declined, or canceled outcome. Otherwise ask in the ordinary response and wait.

Interpret responses within the recorded question:

- **Accepted:** Apply the answer only within its confirmed scope.
- **Declined:** Record the offered choices as not selected; infer neither a broader dislike nor another direction.
- **Canceled or unanswered:** Keep the question and round pending, with no approval, rejection, or completed round.

If a structured question disappears without an outcome, return its candidates and exact question in the ordinary response. A transient panel must not be their only copy. Read [round accounting](#count-rounds-and-stop-exploration) when interpreting feedback or presenting another comparison.

## Interpret an XPath change request

A copied full XPath plus a request identifies a proposed change to an existing mockup, not a new theme search. Recover the current file, relevant screen state, confirmed direction, requested change, and behavior to preserve. Use available context instead of requiring a fixed feedback form.

An explicit request to change a previously selected characteristic authorizes that named change; do not ask the same permission again. If its meaning, target, or effect on another confirmed requirement is unclear, ask only about that ambiguity. Do not apply it to other similar elements by assumption. Pass the request to [target verification and revision](implementation.md#revise-from-a-copied-full-xpath).

## Count rounds and stop exploration

Allow at most three rounds per visual topic unless an explicit extension is approved. Count a round only after candidates are shown and accepted or declined feedback is interpreted. Rejecting all candidates or explicitly being unable to decide completes one round. Pending, canceled, or unanswered questions remain in the same round; internal searches, tool calls, and access failures before presentation do not count.

Stop earlier when the direction suffices; no fixed principle count is required. Zero additional rounds are valid for resuming a confirmed direction or a focused edit, not for bypassing the initial theme comparison. After three unresolved rounds, stop automatic searching and ask for tentative visualization, extension with a specified additional count, or deferral. Preserve the count and approved stopping point; do not invent an extension length or automatically start another topic. Tentative visualization leaves unresolved choices open.
