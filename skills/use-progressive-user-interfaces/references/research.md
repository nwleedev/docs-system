# Research strategies and inspect evidence

Answer unresolved design questions through relevant evidence, then compare strategies against the design thesis.

## Decide whether research is needed

Use validated rules, standards, and platform conventions first. Skip external discovery if these resolve the direction or only minor variations remain. Uncertain standards call for official guidance, not necessarily service comparisons.

Check available pending feedback and rounds before discovery. Read [continuation](decisions.md#continue-from-available-context) if feedback is pending, and [round limits](decisions.md#count-rounds-and-stop-exploration) before seeking another comparison.

## Discover relevant strategies

Check pending feedback and remaining rounds through [research entry](#decide-whether-research-is-needed) before starting discovery.

Search by the unresolved question, goals, information relationships, action frequency, density, mistake costs, domain constraints, and input or viewport conditions. Vary categories or interaction approaches when results repeat one strategy.

Use search to locate examples and current primary sources: official guidance, code, Storybook, specifications, or relevant issues. Results are leads. Check whether platform-specific guidance applies before adopting it.

Stop when evidence distinguishes meaningful alternatives, candidates repeat strategies, or further searches yield no usable evidence. No fixed candidate count is required. Keep essential unanswered questions unresolved. Read [screen inspection](#inspect-the-actual-screen) before appearance claims and [analysis](#analyze-compare-and-apply) before comparing strategies.

## Inspect the actual screen

Use available Browser or MCP visual capabilities for rendered appearance, interaction, responsive changes, and authenticated states. Verify reachability; desktop and remote environments differ in authentication, local access, and interactions.

Inspect the whole screen, then relevant regions, components, structure, elements, and states only as deeply as the question needs. Keep the service and screen, source location, viewable evidence, observed conditions, and gallery provenance. A still image cannot establish hidden states or transitions.

Use the login interface, never request credentials in chat. On failure, identify missing screen or state, capability, and observed failure. Try substitutes only when allowed; never silently replace a designated service. If essential evidence remains unavailable, request current screenshots, recordings, supported access, or deferral.

## Analyze, compare, and apply

Analyze each case before comparison: the problem, information relationships, action placement and repetition, states, density, and relevant visual choices, with evidence and conditions. Compare consequential trade-offs against the thesis; preserve alternatives and uncertainty rather than averaging examples.

Return **adopt**, **adapt**, **reject**, or **unresolved** for each relevant strategy, with reason, evidence, and target. Revise mistaken assumptions in the thesis. For approval conflicts use [question classification](decisions.md#decide-whether-a-question-is-necessary); for meaningful alternatives use [comparison](decisions.md#request-and-interpret-a-choice). Otherwise continue to implementation input.

Inspect official issues or change history only when reported behavior, risk, or disagreement with documentation makes them relevant.
