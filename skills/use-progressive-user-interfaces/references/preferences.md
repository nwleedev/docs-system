# User choices, exploration rounds, and records

Record the characteristics the user confirms and where they apply. Preserve those choices and the exploration round count across conversations. Track preference confirmation separately from validation of rules in the real UI.

## Choose a record location and resume work

First find the project's existing design documents and finalized guidance. If no suitable record location exists, agree on one with the user during the first use. Do not write project state into this skill's reference files or copy lengthy instructions into the project-wide `AGENTS.md`.

Read and update the following information as distinct items within the existing documentation system. The information only needs to be retrievable; do not create a separate storage service or require a fixed file format.

- Project, target screen, and current exploration topic
- Confirmed preferences and dislikes, their scope of application, and the reasons for each choice
- Unresolved decisions, AI hypotheses, and tentative implementation proposals for validation
- Completed rounds, presented candidates and feedback, the round awaiting a response, and approved additional rounds
- Evidence from real UI observations, validated rules and their conditions of use, inspected screens, remaining differences, and exceptions
- Next action and any user decision or running screen needed before it

When resuming, read these records first and compare them with the current request. For example, if two rounds are complete and the third round is awaiting feedback, do not start a new first round. Update the count to three completed rounds after receiving feedback. Reading the same feedback again does not increase the count.

If records conflict or the previous count cannot be established, ask the user only about the uncertain parts. Do not assume the latest record always takes precedence or overwrite existing choices. If a record cannot be read or saved, do not claim that restoring or saving the state succeeded.

When the request authorizes changes to project documents, update the agreed location with the confirmed information. For read-only requests, report the information in the conversation without saving it. If finalized guidance already exists, do not create another document containing the same rules.

## Clarify what a choice means

Confirm which characteristics the user wants to keep from a selected candidate. Choosing a screen does not imply a preference for all of its colors, fonts, and corners. Ask what to keep, remove, take from another candidate, or leave undecided in the compared screens.

If the user chooses only the corners of one button, record a shape preference for that button. Before generalizing it into a corner rule for all components, confirm the scope of application with the user and validate reuse in the real UI.

Keep the following states separate.

- Confirmed preferences and dislikes: Characteristics the user chooses or says to avoid. Record where they apply and the supporting evidence.
- Unresolved decisions: Elements not yet chosen or deliberately deferred. No response means neither approval nor rejection.
- AI hypotheses: Possibilities inferred to guide searching or comparison. Do not record them as user preferences.
- Tentative implementation proposals: Characteristics and values provisionally applied for inspection in a screen. Even if the user likes a mockup, do not promote these to finalized specifications before real UI validation.
- Validated rules: Rules with characteristics checked in a running screen, conditions of use, and the user's judgment. Follow the post-change validation procedure linked from `SKILL.md` when updating them.

If a new choice conflicts with an existing principle, explain both and ask the user how to proceed. Options include changing the existing rule, approving an exception, limiting the choice to a specific component, or leaving it unresolved. Until the user decides, retain existing finalized rules and do not pass the conflicting new choice as a finalized specification.

## Count rounds and stop exploration

Exploration is limited to three rounds per design topic by default. A round ends when candidates have been presented and the user's feedback has been received.

- Count one round even if the user rejects every candidate or says they cannot decide.
- While feedback on presented candidates is pending, the same round remains in progress. Do not automatically present more candidates.
- Do not count internal searches or tool calls as separate rounds.
- If access failures prevent presentation of comparison materials, do not increase the count. Follow the alternative search and stopping conditions in the real UI discovery procedure.

Exploration may end before the limit if creating the next screen would help the user decide more effectively. End initial exploration when there are distinct directions, three to seven principles that explain them, known dislikes, and reusable constraints. Do not invent principles the user has not chosen to meet a target count, or keep searching until every characteristic is finalized.

If the direction remains unresolved after three rounds, stop automatic searching and ask the user for the next action. Perform only the chosen action: a tentative visualization with uncertainty identified, an extension with a specified number of additional rounds, or deferral of the topic. For an approved extension, record the additional rounds and stopping point while retaining the previous completed count. Do not choose an extension length when the user has not specified one.

A choice to create a tentative visualization does not resolve outstanding decisions. Do not automatically start a new design topic after ending or deferring exploration. When asked for a new screen, use existing rules first. Propose renewed exploration only for a new visual question those rules cannot answer.
