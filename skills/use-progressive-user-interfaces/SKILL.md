---
name: use-progressive-user-interfaces
description: Help users discover UI preferences through visual comparison of real service interfaces, continue an in-progress comparison from available context, turn confirmed choices into reusable design rules, and visually validate those rules in current running screens. Use for UI reference exploration, preference refinement, design-system guidance, a short reply to a pending visual choice, or visual validation after implementation. Do not use for software architecture planning or application code editing.
---

# Use Progressive User Interfaces

Discover user preferences by visually comparing real interfaces relevant to the current work. Build only the design rules needed for the screens being considered, and validate them in running UI when it is available. Treat the user's initial description as a starting point for exploration, not a complete specification.

## Establish the decision context

First identify the stated goal, the user task and screen needed for the current visual decision, confirmed constraints, and any existing design guidance. Distinguish approved requirements and decisions from the current implementation, drafts, prototypes, generated artifacts, and hypotheses. A screen's presence or absence in existing material does not by itself make it required or unnecessary.

Use a previous stage result when one is available. If the user gives a short answer and the available context identifies exactly one pending visual question, apply the answer to that question without asking the user to name this skill again. If prior context is missing or ambiguous, ask only for the information needed to continue and do not claim that an earlier state was restored.

## Select the procedures needed now

Select the references needed for the current task and read each one completely. Do not load every reference in advance.

- [Real UI discovery and candidate comparison](references/discovery.md): Read when exploring a new visual direction or a visual question that existing rules and current screens cannot answer. It defines how project materials shape the search scope and how to stop when searches no longer add useful candidates. Do not start another exploration for a request that only applies or validates a direction the user has already chosen.
- [Inspection of real interfaces](references/inspection.md): Read when a decision needs direct evidence from a rendered page, interaction, responsive layout, authenticated screen, or local running UI. Use it to select an available Browser and record what was and was not observed.
- [Case analysis and rationale](references/rationale.md): Read after inspecting candidates when explaining what each case does, comparing alternatives, or carrying evidence into a design decision.
- [User choices, exploration rounds, and stage results](references/preferences.md): Read when asking for or interpreting a choice, resolving conflicts, counting rounds, returning a stage result, or continuing a pending comparison. Before presenting candidates, check whether feedback is already pending and whether another round is available.
- [Tentative visualization and implementation input](references/implementation.md): Read when combining selected characteristics in a project screen or preparing rules and validation conditions for implementation. This procedure returns implementation input without editing code or prescribing the surrounding development workflow.
- [Post-change validation of the real UI](references/validation.md): Read when a current running screen is available for checking selected characteristics or rule reuse. Route post-change validation requests directly to this procedure. If the latest screen is unavailable, request only the necessary evidence.

For new work, establish the user's goal, task, needed screen and unresolved design question before exploring. Use Web Search to find candidates and official material; use an available Browser to inspect actual UI when the question depends on rendered appearance or behavior. Analyze inspected cases individually before comparing them. When continuing, follow the provided next action and account for changes in the current request. If validation reveals an implementation mismatch, return to implementation input. If it reveals a preference conflict, return to user choices.

## Conditions that apply throughout

- Distinguish evidence from direct visual inspection of real UI, AI-generated mockups, and images of unverified origin. Do not claim to have observed a real UI based only on help pages, documentation, or search summaries.
- Do not substitute ASCII art, text wireframes, or lengthy Markdown descriptions for a screen's appearance. Use text to explain differences visible in images or running screens.
- Keep user preferences, AI hypotheses, tentative implementation values, and rules validated in the real UI separate. Do not finalize characteristics or their scope of application without a user choice.
- Exploration is limited to three rounds per topic by default. Follow the user choices procedure for counting and extensions. Do not bypass pending feedback or a reached limit by starting a new topic.
- Do not edit application source code, `tokens.css`, framework themes, or component files through this skill. Implementation happens outside this skill under the authority and development process available for the current work. When the resulting running screen is provided, apply this skill's visual validation procedure.
- First check whether existing rules can express the current UI. Add only characteristics that are actually needed. Do not build a complete token system, every component, or a service for storing UI reference materials.
- Excalidraw and tldraw are examples of how to observe interfaces, not default candidates, services to copy, or required implementation targets.

## Return a stage result

At the end of each stage, return enough information for the next interaction to continue without a required storage system or fixed schema. Include the current topic and stage; the representative user task and screen with the reason each was included or excluded; the role and approval or uncertainty status of source material; candidate identifiers and viewable visual material; the exact pending question and allowed reply; confirmed preferences and dislikes with their scope; unresolved choices, hypotheses and tentative values; validated rules; completed and pending rounds; and the next action or required input. Omit fields that do not apply, but keep confirmed, tentative, and unresolved information distinct.

Use a structured input capability only when it is available, can keep the question active until the user responds, and returns an explicit accepted, declined, or canceled outcome. Otherwise present the candidates and question in the ordinary response. A canceled or unanswered question remains pending, and the round does not complete. Do not require a document system, a particular input UI, or another skill. A caller may save or transform the stage result through its own process.

Wait for the user's answer when a preference conflict or exploration extension needs a decision. If a required screen or capability is unavailable, explain what remains unverified and what input is needed next. Missing evidence or approval does not justify presenting help pages as real UI, promoting tentative values to finalized rules, or reporting a specification handoff, generated image, or successful build as completed real UI validation.
