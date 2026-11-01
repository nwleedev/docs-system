---
name: ui
description: Design service UI with the user through visual theme research, comparison, service-like HTML mockups, and feedback using copied XPath. Use for new UI directions, refinements, resumed design choices, implementation input, and visual validation. Excludes production application edits.
---

# UI

Develop the user's intended service experience through conversation, visual comparison, and inspectable HTML. Preserve requested behavior and confirmed choices as the design becomes concrete. The person choosing the design and the people who will use the service may have different information needs; keep design discussion out of the service screen.

## Establish the design basis

For a new direction, establish the intended outcome, representative scenario, required actions and states, constraints, existing guidance, desired impression, and avoided characteristics. Use available context first. Discuss material unknowns early without requiring design vocabulary, CSS values, or a questionnaire when the answer is already available.

Separate explicit requirements and confirmed preferences from existing implementations, drafts, and assumptions. Describe what people see, decide, and do, including repetition and mistake costs; a feature list alone is not a scenario. Do not replace a named interaction with an easier alternative or infer approval from silence.

Before research, form a provisional explanation of information priority, action placement, density, and domain relationships. Then search design themes and service UI, present viewable differences, and use feedback to establish the direction before making the first full UI mockup. A theme choice approves only the characteristics discussed. Resume pending choices or edits at their current step rather than repeating discovery.

## Common rules

These rules apply to every procedure and are defined here rather than repeated in references.

- Classify each claim as **Observed** (directly inspected appearance or interaction), **Source-stated** (an explicit fact in identified material), **Interpretation** (scenario-based analysis), or **Unknown** (missing evidence). Preserve source, screen, state, and relevant viewport or date. A claim's scope cannot exceed its evidence. Search summaries, text or DOM alone, and unopened links do not prove appearance; generated or unverified images do not prove a released UI was observed. Exact CSS values, tokens, and breakpoints need specifications, code, Storybook, or inspected DOM/CSS; screenshot estimates stay tentative.
- Distinguish **confirmed preferences and dislikes** (explicit choice and scope), **unresolved choices**, **hypotheses**, **tentative defaults or implementation proposals**, and **validated rules** (current running UI evidence, checked conditions, confirmed visual judgment, and scope). A build, handoff, old screenshot, or liked mockup does not validate running UI, behavior, accessibility, or implementation values. Do not replace approved choices with defaults. Silence is neither approval nor rejection.
- Show appearance through viewable images or running screens, never ASCII or text wireframes. Missing evidence leaves only the affected conclusion incomplete. Report mockup inspection, implementation input, running UI validation, and shared-rule validation separately. Claim improvements only with measurements and a comparison baseline.
- Derive distinctive composition from the scenario and domain content while preserving familiar interactions and accessibility conventions. References inform strategies, not a collection of colors, fonts, corners, and shadows to combine. Explain final rules without relying on service names.
- Exclude SaaS design from theme candidates and mockup directions unless explicitly requested. A subscription model or business audience is not that request; ordinary controls are not prohibited merely because SaaS services also use them.
- Define the foundation needed for current screens; expand only for actual scenarios. Do not build a complete token hierarchy, every component variant, a reference-storage service, or extra validation screens in advance. Preserve required functionality in refinements.
- Create and revise standalone HTML mockup files within the requested destination and permissions. Leave production application files, tokens, themes, components, and tests unchanged. Do not add a feedback server, agent bridge, browser extension, or review controls inside the mockup. Service controls and necessary user help remain part of the service.

## Optional design agent

Create a design agent only when explicitly requested; use one if no count is specified, subject to the host's limits. Give it the scenario, confirmed choices, avoided characteristics, and a bounded design responsibility. Its suggestions do not approve a direction or authorize production edits. If delegation is unavailable, report that limitation rather than claiming an agent was created.

## Read only the needed sections

Read the common rules and the selected section in full, including its subsections. Follow linked sections only when their stated condition applies; do not load whole reference files by default. Continue from the available next action without restarting discovery.

- New or changed direction: establish the basis above, then [theme research and comparison](references/research.md#decide-whether-research-is-needed) and [questions that need a response](references/decisions.md#decide-whether-a-question-is-necessary).
- External examples: [strategy discovery](references/research.md#discover-relevant-strategies), then [screen inspection](references/research.md#inspect-the-actual-screen) and [strategy analysis](references/research.md#analyze-compare-and-apply). Direct inspection alone needs only the inspection section.
- Short reply or resumed comparison: [continuation](references/decisions.md#continue-from-available-context), [response interpretation](references/decisions.md#request-and-interpret-a-choice), and [round accounting](references/decisions.md#count-rounds-and-stop-exploration).
- HTML mockup: [current foundation](references/implementation.md#establish-the-current-screens-foundation) and [generation and direct inspection](references/implementation.md#generate-and-inspect-a-mockup).
- Element selection help: [external selection and copying](references/implementation.md#select-an-element-outside-the-mockup).
- Copied XPath and a change request: [request interpretation](references/decisions.md#interpret-an-xpath-change-request), then [target verification and revision](references/implementation.md#revise-from-a-copied-full-xpath). Keep selection and copying outside the service HTML.
- Implementation input: [validation conditions](references/implementation.md#define-validation-conditions) and [handoff](references/implementation.md#prepare-implementation-input). Read the foundation only if current rules are missing or changing.
- Post-change UI check: [current evidence and scope](references/validation.md#establish-the-evidence-and-scope), [screen checks](references/validation.md#inspect-four-aspects-of-the-screen), and [differences and reuse](references/validation.md#resolve-differences-and-validate-reuse). Read [system completion](references/validation.md#distinguish-screen-validation-from-initial-system-completion) only when assessing a design system.

## Return enough context to continue

Return the changed decisions or evidence, affected scope, unresolved conditions, exact pending question and allowed reply, and next action with its needed input. Do not repeat an available unchanged result. Keep candidate identifiers and viewable material, choice states and reasons when stated, completed or pending rounds, and approved extensions available when relevant.

If prior context is absent or compressed, reconstruct the available goal, scenario, thesis, constraints, strategies and evidence, confirmed choices, proposals, conflicts, inspected targets and conditions, and round state needed for the next action. Request only missing information; do not claim to restore unavailable context. This is not a fixed schema or storage requirement. Do not save project-specific choices into this skill or claim unsaved context is persistent.
