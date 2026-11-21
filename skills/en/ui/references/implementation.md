# Coherent mockups and implementation input

Build an inspectable HTML service screen from the agreed direction, revise the requested elements, and provide scoped implementation input.

## Establish the current screen's foundation

Use the available goal, scenario, information relationships, constraints, existing rules, choices, and unresolved questions. Define the current foundation: typography, spacing, alignment, page regions, density, surfaces, and action emphasis. Include relevant primary, secondary, destructive, selected, disabled, focus, error, loading, empty, and responsive treatments.

Connect each rule to its intended use and scenario constraint. Prefer a principle before a numeric value. Use realistic domain content, information volume, meaningful labels, long content, and status information. Do not add capabilities merely to enrich the screen or fill regions with interchangeable cards and placeholders.

## Generate and inspect a mockup

Use [the current foundation](#establish-the-current-screens-foundation) if it is missing or changing.

For a new direction, obtain feedback on the [theme comparison](research.md#present-a-theme-comparison) before the first full mockup. Create standalone HTML at the agreed destination. For a serverless mockup, keep the required CSS and JavaScript in the file and avoid dependencies that require a build or backend. Use existing assets where permitted; image generation may support imagery or a visual comparison, but does not replace HTML or interaction checks.

Translate the scenario into the whole composition: realistic content and volume, information priority, actions, foundation, relevant states and viewport, confirmed characteristics, and tentative defaults. Use domain-appropriate imagery, diagrams, spatial relationships, controls, or other visual forms where they communicate the content. Do not turn every relationship or action into explanatory text and buttons. Do not invent decoration or features to satisfy a visual quota.

Implement the requested interactions in the mockup. If list reordering requires drag and drop, make dragging change the order; keyboard or other accessible alternatives supplement it. Text buttons alone do not satisfy that requirement. Keep simulation limits and missing backend connections in the conversation; do not fabricate a successful real transaction or add an unimplemented-feature warning to excuse a required interaction.

Apply [service content rules](#keep-the-screen-about-the-service) before rendering. Open the actual HTML and inspect the rendered screen, then exercise the affected interactions. File creation, source inspection, and a successful tool response do not prove appearance or behavior. Check the whole screen before details:

- Information priority, main action, region hierarchy, and balance support the scenario.
- Alignment, spacing, typography, density, surfaces, and action emphasis share a foundation.
- Domain content is plausible and readable, without clipping or filler.
- Relevant states, requested interactions, and responsive conditions are checked where possible; absent conditions remain unverified.
- Structure and emphasis have scenario-based reasons, and familiar controls remain understandable.

Correct defects and inspect the affected result. If correction fails or repeated attempts stop improving the defect, report that condition incomplete with its next action. Provide the file or viewable screen and describe its direction, simulated behavior, and unverified conditions in the conversation. For meaningful choices, read [comparison](decisions.md#request-and-interpret-a-choice).

If rendering or interaction inspection fails, identify the unavailable capability and affected evidence. A screenshot can support an appearance judgment, not prove interaction. Defer the affected check rather than claiming it passed or silently replacing a designated reference.

## Keep the screen about the service

Render the service people are meant to use, with its content, state, and controls. Separate display content from authoring notes before writing HTML. Keep mockup introductions, design rationale, decision history, writing or implementation process, work reports, and review instructions in the conversation or designated handoff. Add no review menus, feedback panels, XPath copy controls, or hidden review mode to the HTML.

Judge each phrase by its reader, meaning, evidence, and effect on an action. Remove generic disclaimers, redundant instructions, unexplained warnings, and incomprehensible wording when they do not help the person use the service. These are examples of unwanted AI Caption, not an exhaustive banned-phrase list. If the intended meaning is unclear, clarify it rather than inventing a polished explanation.

Keep necessary labels, input conditions, actual progress and error feedback, recovery instructions, accessibility information, and required notices. Make them specific to the current action and state. Do not strip useful guidance merely because it resembles an example of unwanted text. In a report, retain methods and evidence needed to understand its findings; exclude commentary about how the agent wrote the file unless that account is itself requested.

## Select an element outside the mockup

Explain the procedure in the conversation: open the HTML in a browser with developer tools, inspect the intended element, select its DOM node, and use the browser's full XPath copy command. In Chrome DevTools, this is **Copy > Copy full XPath** on the node in Elements. A browser or embedded preview may lack this command; use a suitable external browser rather than adding a copy tool to the service screen.

Ask the user to paste the copied XPath and desired change into the conversation. Include the file or relevant state only when available context cannot identify it. No fixed feedback form, new server, or automatic connection to the agent is required. Continue with [request interpretation](decisions.md#interpret-an-xpath-change-request) and [revision](#revise-from-a-copied-full-xpath).

## Revise from a copied full XPath

Identify the current HTML file and rendered state, then match the supplied full XPath to the live DOM, the element's content and context, and the source that produces it. XPath identifies a DOM location, not a source line. A syntactically valid path alone does not establish the intended target; changed structure or list order can point it at a different element.

If the target is missing, ambiguous, or inconsistent with the request, stop the affected edit and obtain only the needed current node, state, or clarification. Do not choose a similar element by guesswork. For an iframe, Shadow DOM, or dynamically created node, first identify its document or root and relevant state. Do not promise that one document-level XPath traverses all of them. If live DOM inspection is unavailable, keep the target unverified until sufficient current evidence is supplied.

Apply the authorized change to the matched element and preserve unrelated confirmed behavior. After a structure change, do not reuse an old positional XPath without checking it again. Inspect the revised screen and exercise affected behavior, including the required drag or input action where relevant. Report the changed file, reflected request, and remaining checks in the conversation. Have the user reopen or refresh the file to view it; do not promise automatic refresh or render revision status inside the service screen.

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
