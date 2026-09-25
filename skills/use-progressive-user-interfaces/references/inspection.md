# Inspect real interfaces

Use direct visual inspection when a decision depends on how a released service or the current project actually renders or behaves. This procedure turns a search lead into evidence; it does not treat search results or documentation as a substitute for seeing the interface.

## Choose the method that can answer the question

- Use Web Search to discover candidate services, locate relevant screens, and find official design documentation, source code, Storybook examples, or implementation details.
- Use an available Browser to open a real page and inspect its rendered appearance, interaction, responsive changes, or state. Use it for the current project's running UI when validating a change.
- Use official documentation or source material to confirm an explanation, design token, specification, or implementation detail that a rendered screen cannot establish by itself.

An available Browser does not guarantee that a site, account, route, state, or local address is reachable. Select only a Browser capability exposed in the current environment. Desktop embedded browsing and Cloud Browser access may have different network reachability, authentication, local-address access, and interaction support. Confirm access in the selected environment instead of assuming that one environment can inspect every page or state. Do not claim that an inaccessible page or state was observed.

If a relevant screen requires login, use the login screen in the available Browser. Do not ask the user to provide account credentials in chat. If access fails, record the service, screen or state, environment capability used, and observable reason when available. Search other services or task patterns only when substitution is allowed by the user. If the user requires a particular service or the missing evidence changes the decision, ask for a screenshot, recording, access path, or decision from the user. Keep the state unverified until evidence is available.

## Inspect only to the depth the question needs

Start with the whole screen and its purpose. Then inspect the relevant regions, components, internal structure, individual elements, and states only as needed to answer the design question. For example, a question about navigation placement may need the page and navigation region; a question about keyboard focus needs the focused element and its visible state. Do not inventory every element or state by default.

For each candidate, keep enough provenance to retrace the evidence: service and screen, source location, directly viewed page or image, and observed state. Add viewport size or observation time when it could change the comparison. For gallery images, verify the original service and screen when possible. A DOM snapshot, extracted text, unopened link, search result, or help page alone does not establish the visual appearance of a real UI.

Separate the evidence into four kinds:

- **Observed:** What is directly visible or what happened during an interaction. Limit the claim to the screen, viewport, and state inspected.
- **Source-stated reason:** An explanation explicitly given by a service owner, maintainer, specification, or other identified source. Link the source and state what it supports.
- **Interpretation:** An analysis of why a choice may work or how it relates to the current design question. Identify it as analysis, not as observed fact or confirmed intent.
- **Unknown:** A page, reason, state, viewport, or behavior not verified. State what evidence is missing when it matters.

One screen cannot establish a service-wide rule. Do not report hover, error, expanded, selected, or keyboard-focus behavior unless the relevant state is visible or the interaction was performed. Exclude help pages, general articles, and search-optimized pages from real UI examples, even when they link to the service.

## Support precise claims with precise evidence

A screenshot can support a visual comparison at the captured size. It does not by itself confirm exact CSS values, design tokens, responsive rules, implementation causes, or why the service chose a design. State precise dimensions, tokens, breakpoints, or other implementation values only when an official token or specification, source code, Storybook, or inspected DOM/CSS confirms them. Identify which source confirms a value and keep visual estimates labeled as estimates.

Inspect issues, pull requests, or change history only when implementation risk or a reported behavior needs explanation. Prefer the source owner's issue or change record. Do not make issue or PR research a mandatory part of every visual comparison.

Record the inspected evidence in the current stage result so the next procedure can distinguish verified facts, source explanations, analysis, and unknowns without requiring a particular storage system.
