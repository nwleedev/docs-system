---
name: "ui"
description: "Research which screens a service or application needs. Review layouts by device, component choices and presentation, UI copy, panel typography and spacing, and the service's visual style. Also use when deriving design rules from reference materials or reviewing content layout in slides and documents."
---

# Review UI and content layout

Propose screens and UI elements based on the service's features and usage scenarios. Identify missing or duplicate elements and unnecessary guidance in existing screens. For slides and documents, follow [Review content layout in slides and documents](#review-content-layout-in-slides-and-documents).

## Identify the service and check its current state

- Use the request and project documents to identify the service, user groups and permissions, supported environments, and features or screens under review. In a monorepo, distinguish each service's requirements and design decisions.
- Compare the existing UI with the requirements. Distinguish behavior observed in the running application, behavior established from code, and elements or layouts visible in screenshots.
- For a specific screen or feature, check how its states, entry and return paths, and shared components affect the proposed layout. Reassess affected screens and elements when requirements change.

## Research which screens are needed

1. For each user group, identify what starts the feature flow, the main decisions and actions, and what users need to verify at completion. Check whether permissions or the outcome change the navigation path.
2. Compare a dedicated page, a region or state of an existing screen, and a dialog as ways to provide the necessary information and actions. Decide based on whether users need to open or revisit it directly, retain the current information and selection, or confirm a choice separately.
3. Examine live screens and official help for similar services, along with the target platform's design guidelines. Compare the examples' elements and display conditions with the project's requirements before adopting them.

## Adapt screens to devices and usage environments

Apply this section when supported devices or usage environments change the layout or interaction.

- Identify the scenarios users need to complete in each supported environment. Check which interaction steps change with window size, orientation, fold state, or input method.
- Set information priorities, available actions, navigation, and transitions for each environment. For example, decide whether to show a list and its details together and how users return from the details to the list. If features differ across environments, state which scenarios users can complete in each and explain the differences.
- Specify which selections, input values, and scroll positions to preserve when the window resizes, the device posture changes, or users return to the previous screen.

## Define each screen's UI elements

When reviewing a specific element, apply only the steps that affect the requested decision.

1. **Identify each element's role and what its actions affect.** Identify what users should see first, what values they enter, where they navigate, and what actions they take and outcomes they see. Specify whether each action applies to a field, item, settings group, or the entire screen.
2. **Specify display conditions and states.** Identify which inputs or selections reveal or enable other elements and when changes take effect. Specify what users see and can do when loading, empty results, failures, or permission restrictions affect their next action.
3. **Choose components.** Compare candidates by the element's role, input format, number of options, need to compare options side by side, when changes take effect, the device's input methods, and accessibility requirements.
4. **Specify visual treatment and accessibility information.** Use the design system and the relative priority of information and actions to choose labels, icons, backgrounds, borders, and state indicators. Specify the accessible name and role of each interactive element and the states to expose to assistive technologies. Verify that the implementation exposes this information when reviewing it.
5. **Group and order elements.** Place elements that users need together, such as a control and what it affects or an option and the field it reveals, in the same group. Arrange them so reading order and keyboard focus order reflect how the information relates and how users act on it. Verify focus order with a keyboard on the running screen.
6. **Lay out the screen.** Choose a format such as a table or list based on what users need to compare and how items relate. Place the groups and decide which regions appear together and which require a screen transition. Use the same requirements to compare alternative layouts by what appears first, where the main actions sit, and how states are shown.

## Review whether UI copy is needed

- Identify information users would miss without the copy, such as what an action does, the expected input format, the current state, or why an error occurred and how to resolve it.
- Omit guidance that repeats the screen title, labels, control names, or existing state indicators. Retain labels and instructions needed for input.
- Show copy only when its state or condition applies. For example, place the cause and remedy for an input error near the relevant field and associate the message with that field.

## Set panel typography and spacing

- Propose font sizes, weights, and line heights based on the hierarchy and reading order of titles, body text, labels, and supporting information.
- Specify spacing between related elements, spacing between groups, and padding inside the panel.
- Name the project's typography and spacing tokens to use. If no standard exists and numeric values are needed, propose values and specify when they apply. Check whether wrapping or clipping makes content hard to read or controls hard to use with long copy, enlarged text, or at the narrowest supported screen width.

## Review the service's visual style

Compare colors, typography, and spacing in running screens or mockups with the brand guidelines or design system. Check whether elements with the same role use a consistent visual treatment across screens.

## Derive design rules from reference sites and images

Apply this section when asked to derive design rules from reference materials or assess whether those rules fit the project.

### What each source can establish

- **Images.** Inspect layout, alignment, visual hierarchy, relative sizes, and spacing. Compare recurring treatments and differences across the states shown in multiple images. Mark transition triggers, original CSS values, and design tokens as unverified from images alone.
- **Live sites.** Record the screen, viewport size, state, and interactions tested. Inspect computed styles in the browser. Check applied style rules and variable definitions for source declarations and design tokens. Mark behavior on inaccessible screens or in states you could not reproduce as unverified.
- **Source design files.** Inspect accessible layer properties, spacing, components, variables, and prototype behavior. Check whether those designs were implemented and how they behave using the running site or its code.

### Handle unknowns and propose rules

1. If missing information about a rule's applicability or values prevents a comparison, state what needs to be verified and request the materials needed to verify it.
2. If the available information supports a comparison or further materials are unavailable, present options within the limits of the evidence. For each option, explain the evidence, reasoning, assumptions, and conditions for use.
3. Distinguish observed features from proposed rules. For each rule, specify where it applies, under what conditions, any exceptions, and which screens and states to check after implementation.

## Report proposals and findings

- Distinguish what you verified in existing screens or materials from the additions, changes, or removals you propose. For each proposal, state when it applies and identify the requirements, observations, official guidance, or examples that support it.
- If unverified information could change a conclusion, specify what information is needed and which proposals it affects.

## Review content layout in slides and documents

Apply this section only when asked to review or propose a content layout for slides or a document.

1. Identify the audience, reading purpose, and viewing conditions. For slides, determine whether readers will follow a presentation or read on their own. For documents, determine whether readers will read in sequence or look up specific information.
2. Distinguish what readers need first, what they need to compare, and what belongs in supporting explanations. Consult official guidance and examples for the same medium and purpose to examine heading hierarchy, page and paragraph divisions, and the placement of tables and figures.
3. For slides, propose how much information to include on each slide and where to place titles, body text, and charts. For documents, propose a heading hierarchy, page and paragraph structure, and placement for tables, figures, and their explanations. Check that the hierarchy is apparent in both the visual reading order and the navigation order provided to assistive technologies.
