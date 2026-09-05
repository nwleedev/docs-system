---
name: use-progressive-user-interfaces
description: Help users discover UI preferences through visual comparison of real service interfaces and incrementally turn those choices into reusable project design rules. Use for UI reference exploration, preference refinement, design-system guidance, or visual validation after implementation. Do not use for software architecture planning or application code editing.
---

# Use Progressive User Interfaces

Discover user preferences by visually comparing real interfaces relevant to the project. Build a set of design rules from those validated in the screens the project currently needs. Treat the user's initial description as a starting point for exploration, not a complete specification.

## Establish the project context

First identify the project's purpose, the screens or components currently needed, and existing design guidance and progress records. Do not ask again for facts already recorded. If the project or target screen is unclear, ask only for the information needed to identify it.

If records exist, read the selected characteristics, their scope of application, unresolved choices, exploration round count, and next action. Compare them with the current request. If the records are unavailable, do not guess the previous state or reset the count. Read the user choices and records procedure when choosing a record location, restoring state, or updating it.

## Select the procedures needed now

Select the references needed for the current task and read each one completely. Do not load every reference in advance.

- [Real UI discovery and candidate comparison](references/discovery.md): Read when exploring a new visual direction or a new question that existing rules and current screens cannot answer. Do not start another exploration for a request that only implements or validates a direction the user has already chosen.
- [User choices and records](references/preferences.md): Read when confirming or recording preferences, resolving conflicts, managing exploration rounds and stopping conditions, choosing a record location, or resuming work. Before presenting candidates, check the remaining rounds and whether feedback is pending.
- [Tentative visualization and implementation input](references/implementation.md): Read when combining selected characteristics in a project screen or preparing implementation input for a new screen that uses existing rules. Provide the main session with the reasoning and validation conditions without editing code.
- [Post-change validation of the real UI](references/validation.md): Read when receiving a running screen changed by the main session or checking rule reuse. Route post-change validation requests directly to this procedure. If the latest screen is unavailable, request the necessary evidence.

For new work, establish the project context and record location before exploration. When resuming, follow the recorded next action and clarify any changes introduced by the current request. If validation reveals an implementation mismatch, return to implementation input. If it reveals a preference conflict, return to user choices.

## Conditions that apply throughout

- Distinguish evidence from direct visual inspection of real UI, AI-generated mockups, and images of unverified origin. Do not claim to have observed a real UI based only on help pages, documentation, or search summaries.
- Do not substitute ASCII art, text wireframes, or lengthy Markdown descriptions for a screen's appearance. Use text to explain differences visible in images or running screens.
- Keep user preferences, AI hypotheses, tentative implementation values, and rules validated in the real UI separate. Do not finalize characteristics or their scope of application without a user choice.
- Exploration is limited to three rounds per topic by default. Follow the user choices and records procedure for counting and extensions. Do not bypass pending feedback or a reached limit by starting a new topic.
- Do not edit application source code, `tokens.css`, framework themes, or component files through this skill. The main session implements approved changes through the project's development workflow and then reapplies this skill's visual validation procedure. The main session means the coding agent in the primary conversation, not a separate agent or a technical separation of permissions.
- First check whether existing rules can express the current UI. Add only characteristics that are actually needed. Do not build a complete token system, every component, or a service for storing UI reference materials.
- Excalidraw and tldraw are examples of how to observe interfaces, not default candidates, services to copy, or required implementation targets.

## Pause and report

Wait for the user's answer when a conflict, exploration extension, or record location needs their decision. If a required screen or tool is unavailable, explain what remains unverified and what input is needed next. Missing evidence or approval does not justify presenting help pages as real UI or promoting tentative values to finalized rules.

At the end of a stage, update the project records with confirmed choices and evidence, unresolved decisions, validated targets and conditions, and the next action. Summarize these for the user. Do not store individual project preferences or progress in this skill's files. Do not report a specification handoff, image generation, or successful build as completed real UI validation.
