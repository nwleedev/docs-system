# Real UI discovery and candidate selection

Find real interface candidates that can help answer an unresolved visual question for the current project. Use the inspection procedure to verify candidates and gather visual evidence before presenting a comparison.

## Frame the decision before searching

Identify the stated goal, the user task and screen needed to answer the current visual question, and the evidence that makes each item relevant. Classify material item by item rather than assigning one status to an entire file.

- Stated goals and approved requirements or decisions establish what the work must accomplish.
- Confirmed existing behavior and constraints establish what must be preserved.
- Existing UI and code show the current state; they do not define every required user task.
- Prototypes, generated artifacts, and draft documents propose possible solutions; they do not add requirements by themselves.
- Search hypotheses help find comparisons; they are not user choices.
- Material with unknown origin or approval remains uncertain.

Do not exclude a required user task because an existing React project or HTML page does not implement it. Do not include every screen or behavior shown in a draft or generated artifact. If uncertain status would change the representative task, candidate set, or question, ask only about that item. Otherwise retain the uncertainty in the stage result and continue with the confirmed scope. Return the selected representative task and screen, the reasons for including or excluding alternatives, and each material item's role and approval or uncertainty status.

## Choose search perspectives

Use the decision context, existing principles, and the user's description to identify one design topic to explore. Select only the representative tasks, states, and screens needed to answer it. If established principles already answer the question, proceed to implementation input without finding new references. Before exploring, follow the user choices procedure linked from `SKILL.md` to check any provided stage result, remaining rounds, and pending feedback. These checks govern user-facing rounds; internal searches and Browser inspections do not count as rounds.

Do not turn an abstract request into a single search query or let the first recognizable service determine the direction. Use Web Search to find candidates from the perspectives needed for the current decision. Search results are leads, not evidence that a page was visually inspected.

- Service category and purpose
- Screen role and interaction patterns
- Mood and information density
- Shape, corner radius, and borders
- Separation of background areas, shadows, and depth
- Typography, color, and emphasis
- Characteristics the user wants to avoid

For example, for "a calm list that makes many items easy to scan," examine list-based work screens, high information density, and restrained accent colors separately. Treat an interpretation such as "calm means gray" only as a search hypothesis, not a confirmed preference.

## Decide when candidate discovery is sufficient

Continue searching across relevant perspectives until the candidates provide meaningfully different ways to answer the design question. Stop when the inspected candidates cover the useful perspectives, the remaining candidates repeat choices already represented, and another search is unlikely to add a decision-relevant alternative. Do not use a fixed number of URLs or searches as the stopping rule, and do not add near-duplicates to reach a target.

If one perspective yields few candidates, search another relevant service category, task pattern, or information density rather than repeating similar queries. If a chosen service cannot be opened, follow the access and alternative-evidence guidance in [inspection of real interfaces](inspection.md). Do not treat additional search attempts as additional user exploration rounds.

## Prepare candidates for comparison

Use the inspection procedure to determine which candidates have sufficient visual evidence and whether their sources are appropriate. Do not present help pages, search summaries, unopened links, or images of unknown origin as inspected real interfaces. Keep generated mockups distinct from reference candidates.

Usually present three to five inspected candidates per round, prioritizing differences that help the user decide. Do not add nearly identical candidates to reach a target count. If fewer suitable candidates are available, state that limitation and compare the differences found.

Show visual material for each candidate and briefly explain the characteristics relevant to the current question. Where possible, present each candidate separately so the user can see distinct choices in information density, typographic hierarchy, or background separation. Do not substitute ASCII art, text wireframes, or lengthy descriptions for the visual comparison.

Do not require the user to choose an entire service as a package. Ask what to keep, remove, take from another candidate, or leave undecided. Let the user select different characteristics from multiple candidates. Do not summarize preferences using only a service name.

Before requesting feedback, read [case analysis and rationale](rationale.md), then prepare a stage result that identifies each inspected case and source, viewable visual material, observed states, comparison characteristics, exact question, accepted reply form, pending round, and next action. Use a structured input capability only under the conditions in the user choices procedure; otherwise put the candidates and question in the ordinary response.

After presenting candidates and the question, wait for feedback. Follow the user choices procedure linked from `SKILL.md` when interpreting the response or deciding whether another round is needed. Do not automatically present more candidates or mark the round complete while feedback is pending.
