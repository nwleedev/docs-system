---
name: use-progressive-user-interfaces
description: Develop distinctive, coherent UI from usage scenarios. Use for screen design or refinement, visual reference comparison, generated mockups, implementation input, pending comparison replies, and running UI validation. Excludes software architecture and application code editing.
---

# Use Progressive User Interfaces

Derive screen composition from usage goals, information relationships, and domain constraints. Define the visual foundation needed now and inspect the resulting screen before reporting completion.

## Establish the design basis

For a new direction, identify the outcome, representative scenario, supported actions, required screens and states, constraints, and existing guidance. Describe the situation, information, decisions, action sequence, repetition, and mistake costs; a feature list is not a scenario.

Separate approved requirements from current implementation, drafts, and hypotheses. Existing artifacts show current behavior, not required scope. Clarify approval only when it changes the design.

Before external research, write a provisional design thesis explaining information priority, frequent actions, risks, density, domain relationships, and connections to existing UI. Include only relevant, supported details and unresolved assumptions. Reuse validated rules and platform or accessibility conventions; revise the thesis when evidence contradicts it.

## Common rules

These rules apply to every procedure and are defined here rather than repeated in references.

- Classify each claim as **Observed** (directly inspected appearance or interaction), **Source-stated** (an explicit fact in identified material), **Interpretation** (scenario-based analysis), or **Unknown** (missing evidence). Preserve source, screen, state, and relevant viewport or date. A claim's scope cannot exceed its evidence. Search summaries, text or DOM alone, and unopened links do not prove appearance; generated or unverified images do not prove a released UI was observed. Exact CSS values, tokens, and breakpoints need specifications, code, Storybook, or inspected DOM/CSS; screenshot estimates stay tentative.
- Distinguish **confirmed preferences and dislikes** (explicit choice and scope), **unresolved choices**, **hypotheses**, **tentative defaults or implementation proposals**, and **validated rules** (current running UI evidence, checked conditions, confirmed visual judgment, and scope). A build, handoff, old screenshot, or liked mockup does not validate running UI, behavior, accessibility, or implementation values. Do not replace approved choices with defaults. Silence is neither approval nor rejection.
- Show appearance through viewable images or running screens, never ASCII or text wireframes. Missing evidence leaves only the affected conclusion incomplete. Report mockup inspection, implementation input, running UI validation, and shared-rule validation separately. Claim improvements only with measurements and a comparison baseline.
- Derive distinctive composition from the scenario and domain content while preserving familiar interactions and accessibility conventions. References inform strategies, not a collection of colors, fonts, corners, and shadows to combine. Explain final rules without relying on service names.
- Define the foundation needed for current screens; expand only for actual scenarios. Do not build a complete token hierarchy, every component variant, a reference-storage service, or extra validation screens in advance. Preserve required functionality in refinements.
- This skill produces design input, not application edits. Leave source files, tokens, themes, and components unchanged; code changes require separate authorization and the applicable development process.

## Read only the needed sections

Read the common rules and the selected section in full, including its subsections. Follow linked sections only when their stated condition applies; do not load whole reference files by default. Continue from the available next action without restarting discovery.

- New or changed direction: establish the basis above; use [research entry](references/research.md#decide-whether-research-is-needed) only for unresolved evidence and [question classification](references/decisions.md#decide-whether-a-question-is-necessary) for open judgments.
- External examples: [strategy discovery](references/research.md#discover-relevant-strategies), then [screen inspection](references/research.md#inspect-the-actual-screen) and [strategy analysis](references/research.md#analyze-compare-and-apply). Direct inspection alone needs only the inspection section.
- Short reply or resumed comparison: [continuation](references/decisions.md#continue-from-available-context), [response interpretation](references/decisions.md#request-and-interpret-a-choice), and [round accounting](references/decisions.md#count-rounds-and-stop-exploration).
- Screen direction: [current foundation](references/implementation.md#establish-the-current-screens-foundation); for a generated image, also [generation and direct inspection](references/implementation.md#generate-and-inspect-a-mockup).
- Implementation input: [validation conditions](references/implementation.md#define-validation-conditions) and [handoff](references/implementation.md#prepare-implementation-input). Read the foundation only if current rules are missing or changing.
- Post-change UI check: [current evidence and scope](references/validation.md#establish-the-evidence-and-scope), [screen checks](references/validation.md#inspect-four-aspects-of-the-screen), and [differences and reuse](references/validation.md#resolve-differences-and-validate-reuse). Read [system completion](references/validation.md#distinguish-screen-validation-from-initial-system-completion) only when assessing a design system.

## Return enough context to continue

Return the changed decisions or evidence, affected scope, unresolved conditions, exact pending question and allowed reply, and next action with its needed input. Do not repeat an available unchanged result. Keep candidate identifiers and viewable material, choice states and reasons when stated, completed or pending rounds, and approved extensions available when relevant.

If prior context is absent or compressed, reconstruct the available goal, scenario, thesis, constraints, strategies and evidence, confirmed choices, proposals, conflicts, inspected targets and conditions, and round state needed for the next action. Request only missing information; do not claim to restore unavailable context. This is not a fixed schema or storage requirement. Do not save project-specific choices into this skill or claim unsaved context is persistent.
