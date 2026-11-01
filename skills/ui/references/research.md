# Research themes and inspect evidence

Find visibly different theme directions that fit the scenario, inspect their evidence, and make them comparable before producing a full service mockup.

## Decide whether research is needed

For a new UI direction, search and compare themes before the first full mockup. Existing validated rules, standards, and platform conventions constrain the search; they do not replace the requested theme comparison. For an already confirmed direction or a focused edit, research only a new unresolved question. Uncertain standards call for official guidance, not necessarily more service examples.

Check available pending feedback and rounds before discovery. Read [continuation](decisions.md#continue-from-available-context) if feedback is pending, and [round limits](decisions.md#count-rounds-and-stop-exploration) before seeking another comparison.

When research is needed, continue with [strategy discovery](#discover-relevant-strategies), inspect and analyze the evidence, then [present a theme comparison](#present-a-theme-comparison) for a new direction.

## Discover relevant strategies

Check pending feedback and remaining rounds through [research entry](#decide-whether-research-is-needed) before starting discovery.

Search both service interfaces and design work using the scenario, desired impression, information relationships, density, domain, and input or viewport conditions. Broaden beyond near-identical service screens to relevant editorial, graphic, typographic, photographic, or illustration work. These are possible search directions, not a quota to fill. If results repeat one layout or treatment, change the design field or composition strategy rather than merely changing colors.

A theme is a coherent direction for hierarchy, typography, imagery, composition, and tone. Compare how it could serve this scenario; do not treat a theme as a ready-made service template or average unrelated visual attributes. Apply the entrypoint's SaaS exclusion while selecting candidates. Do not classify every familiar list, button, or sidebar as a SaaS theme.

Use search to locate examples and current primary sources: official guidance, code, Storybook, specifications, or relevant issues. Results are leads. Check whether platform-specific guidance applies before adopting it.

Stop when evidence distinguishes meaningful alternatives, candidates repeat strategies, or further searches yield no usable evidence. No fixed candidate count is required. Keep essential unanswered questions unresolved. Read [screen inspection](#inspect-the-actual-screen) before appearance claims and [analysis](#analyze-compare-and-apply) before comparing strategies.

## Present a theme comparison

Show viewable source material with a source link and the characteristics actually observed. Explain the consequential differences, where each direction fits or conflicts with the scenario, and the specific choice now needed. A name such as "minimal" or "editorial," a list of colors, or a long description cannot replace visual material.

Ask which observed characteristics to keep or avoid, without asking for professional terminology. Keep this comparison outside the service HTML. Follow [response interpretation](decisions.md#request-and-interpret-a-choice) and wait for the answer before treating the direction as confirmed. If no direction is accepted, preserve the unresolved choice and remaining rounds rather than producing a supposedly approved screen.

## Inspect the actual screen

Use available Browser or MCP visual capabilities for rendered appearance, interaction, responsive changes, and authenticated states. Verify reachability; desktop and remote environments differ in authentication, local access, and interactions. A design artwork can establish visual treatment, but not a released service's behavior. Keep that distinction even when both appear in one comparison.

Inspect the whole screen, then relevant regions, components, structure, elements, and states only as deeply as the question needs. Keep the service and screen, source location, viewable evidence, observed conditions, and gallery provenance. A still image cannot establish hidden states or transitions.

Use the login interface, never request credentials in chat. On failure, identify missing screen or state, capability, and observed failure. Try substitutes only when allowed; never silently replace a designated service. If essential evidence remains unavailable, request current screenshots, recordings, supported access, or deferral.

## Analyze, compare, and apply

Analyze each case before comparison: the problem, information relationships, action placement and repetition, states, density, and relevant visual choices, with evidence and conditions. Compare consequential trade-offs against the thesis; preserve alternatives and uncertainty rather than averaging examples.

Return **adopt**, **adapt**, **reject**, or **unresolved** for each relevant strategy, with reason, evidence, and target. Revise mistaken assumptions in the thesis. For approval conflicts use [question classification](decisions.md#decide-whether-a-question-is-necessary). For a new direction, [present the theme comparison](#present-a-theme-comparison); for other meaningful alternatives use [comparison](decisions.md#request-and-interpret-a-choice). Once the direction is resolved, continue to the requested mockup or implementation input.

Inspect official issues or change history only when reported behavior, risk, or disagreement with documentation makes them relevant.
