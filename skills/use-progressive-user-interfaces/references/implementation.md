# Coherent mockups and implementation input

Translate the design thesis into a coherent screen direction, inspect generated visuals, and provide scoped implementation input.

## Establish the current screen's foundation

Use the available goal, scenario, information relationships, constraints, existing rules, choices, and unresolved questions. Define the current foundation: typography, spacing, alignment, page regions, density, surfaces, and action emphasis. Include relevant primary, secondary, destructive, selected, disabled, focus, error, loading, empty, and responsive treatments.

Connect each rule to its intended use and scenario constraint. Prefer a principle before a numeric value. Use realistic domain content, information volume, meaningful labels, long content, and status information. Do not add capabilities merely to enrich the screen or fill regions with interchangeable cards and placeholders.

## Generate and inspect a mockup

Use [the current foundation](#establish-the-current-screens-foundation) if it is missing or changing.

Generate when the direction needs visual review or existing visuals cannot distinguish meaningful alternatives. Use an available image-generation capability and its instructions.

Describe the whole composition: target, goal, scenario, content and volume, information priority, actions, foundation, relevant states and viewport, preserved or avoided characteristics, defaults, and unresolved choices. For alternatives, vary a consequential strategy and use separate images where possible.

Before submission, open and visually inspect the actual returned image. A prompt or success message does not prove its appearance. Check the whole screen before details:

- Information priority, main action, region hierarchy, and balance support the scenario.
- Alignment, spacing, typography, density, surfaces, and action emphasis share a foundation.
- Domain content is plausible and readable, without clipping or filler.
- Relevant states and responsive conditions are represented where possible; absent conditions remain unverified.
- Structure and emphasis have scenario-based reasons, and familiar controls remain understandable.

Diagnose visible defects, correct them, and inspect the revised image. If correction fails or repeated attempts stop improving the defect, report the affected condition incomplete with its next action. Show the inspected image labeled as generated, with direction and unverified conditions. For meaningful choices, read [comparison](decisions.md#request-and-interpret-a-choice).

If generation or inspection fails, identify missing evidence. Use already viewable real screens only if they support the same decision; otherwise defer visualization. A designated reference cannot be silently replaced.

## Define validation conditions

Choose representative targets and affected states, screen sizes, themes, and languages from approved requirements, the scenario, and existing guidance. Explain them without requiring professional vocabulary or CSS decisions. For materially different scope or direction, use [question classification](decisions.md#decide-whether-a-question-is-necessary).

For a proposed shared rule, identify another existing applicable target. If absent, validate the current target and leave reuse incomplete.

## Prepare implementation input

Return the current change's goal, scenario, supported actions, preserved functionality, and specific appearance to change, together with:

- Thesis, information relationships, adopted strategies and evidence, and rejected alternatives.
- Applicable existing principles or tokens, foundation, confirmed choices, exceptions, and scope.
- Tentative values, unresolved evidence or choices, conflicts that must not be applied, and characteristics to avoid.
- Representative targets and conditions from [validation conditions](#define-validation-conditions), including existing reuse targets.

Use the needed form: principles, tokens, CSS variables, themes, or component usage rules. Refer to existing guidance instead of duplicating it. After separately authorized code changes, use [current UI validation](validation.md#establish-the-evidence-and-scope).
