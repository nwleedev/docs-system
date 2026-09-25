# Post-change validation of the real UI and rule finalization

Check user choices and agreed conditions in the latest screen running the modified code. Use the evidence distinctions in [inspection of real interfaces](inspection.md) to keep direct observation, source-stated reasons, analysis, and unknowns separate. Finalize rules only for the targets validated. Keep preferences for generated mockups separate from rules validated in the real UI.

## Gather the evidence needed for validation

Read the provided stage result and implementation input for the reasons behind choices, characteristics to preserve, existing rules, tentative values and exceptions, and the agreed representative screen and validation conditions. If conditions for this change have not been established, agree on them with the user first.

Confirm that the screen reflects the implementation being evaluated. Obtain the running UI's address or screen material, together with evidence of which changes it reflects. If its relationship to the current work is unclear, request a current screen or defer validation.

Real UI validation remains incomplete if the only evidence is a generated image, a successful build message, a specification handoff, or a screenshot from before the change. If the latest screen cannot be inspected visually, defer updates to finalized rules. Do not edit application code through this skill to produce validation evidence.

## Compare the changed screen

Directly inspect the representative screen or component and check whether it preserves the selected characteristics. Compare the attributes addressed by this change, including hierarchy, layout, component structure, action placement, information density, typography, spacing, shape, color, background separation, interaction states, or responsive changes as relevant, with the evidence behind the choices. Show the user whether the appearance follows consistent principles, whether a choice that worked in a reference is unsuitable for this project, and whether any attributes need further decisions.

Inspect states affected by the change, such as selected, error, disabled, and keyboard-focus states. Check affected screen sizes, themes, and languages used by the project against the agreed criteria. If a state transition needs validation, interact with the running UI or obtain material that demonstrates the transition. A single still image does not verify interactions or every state.

Present the screen or image with a brief explanation of preserved characteristics, differences from the user's choices, and unverified conditions. Ask for the user's visual judgment and include it in the next stage result. Builds and checks of existing behavior remain outside this skill. Do not claim that visual inspection alone validates all behavior or accessibility.

## Validate reuse and address differences

Before finalizing a shared rule, inspect its application in another existing screen or component. Compare whether its intended use and selected characteristics are preserved in the reuse target. Do not generalize to targets that have not been inspected.

If no other target exists yet, retain a rule limited to the validated target without creating a new screen. If reuse reveals differences, leave shared-rule validation incomplete and include the differences in the stage result. A representative screen that looks good does not establish that a shared rule is validated.

Choose the next procedure according to the cause of the difference.

- If an agreed characteristic is missing from the implementation, return to implementation input with the target, difference, and validation conditions. Validate again only when a corrected current screen is available.
- If preferences or existing principles need to change, return to the user choices procedure. Confirm whether to change the rule, approve an exception, limit it to a particular target, or leave the choice unresolved. Do not weaken existing rules without the user's decision.
- If a required state or screen is unavailable, separate verified from unverified parts and request evidence. Do not mark unverified conditions as passed.

Do not search for new references when existing rules and current screens can resolve the issue. Ask the user about further exploration only when a new visual question remains unanswered.

## Return validated rules

Return a stage result that connects the user's confirmed visual judgment with running UI evidence. For each rule, include its intended use, applicable targets and conditions, validated screens and states, reasons for the choice, exceptions, and remaining differences. Follow the user choices procedure linked from `SKILL.md`.

Include only validated rules and their conditions of use in finalized guidance or any result intended for reuse. Keep unresolved decisions, tentative implementation values, unverified states, and reuse differences separate. Do not turn a value supported only by a confirmed preference into a validated token, or remove unverified conditions to make validation appear complete. A caller may persist the result through its own process; this procedure does not require a storage location.

Express each rule at the level its use requires: a design principle, shared characteristic, usage-specific rule, or token. Do not add tokens merely because more components exist. When a rule changes or is added, inspect the UI where it is applied again. Leave code changes outside this skill.

## Distinguish screen validation from initial design system completion

Completing validation for one screen means that its agreed conditions have been checked. It does not mean the entire initial design system is complete.

Consider the initial design system complete when the current project provides evidence for the following conditions.

- The visual characteristics that distinguish it from other directions can be explained.
- The selected characteristics appear consistently in the running application's current primary screens.
- Recurring shared characteristics and usage-specific rules are documented.
- Existing rules can express the primary interfaces currently needed.
- Rules, conditions of use, and styles to avoid are specified for implementation work.
- Evidence from new screens shows that the existing direction and rules can be reused without deciding them again from the beginning.

If evidence is missing, report completed screen validations separately from remaining checks. Do not require every component and token, or a new validation application, as a condition of completion. After completion, do not expand the system without an actual need.

Evaluate reductions in exploration time, token usage, or revision count only when actual observations provide a comparison baseline. Producing guidance or screens alone does not prove these improvements.
