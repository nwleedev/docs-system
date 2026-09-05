# Tentative visualization and implementation input for the main session

Combine the user's selected characteristics in a project screen for visual review. Give the main session the design decisions and validation conditions needed for implementation. This procedure does not authorize application code changes.

## Define the rules needed for the current UI

Read confirmed preferences, existing rules, exceptions, and unresolved decisions from the project records. First assess whether existing principles and tokens can support the required screen. A new screen alone does not justify another reference search or a complete token hierarchy.

Describe rules through selected characteristics and their intended use, not service names. Instead of "Linear style," specify the information density, typographic hierarchy, spacing, or emphasis to preserve. Define only the color, background separation, typography, spacing, shape, border, and shadow rules needed for this UI.

Where possible, state principles before values. For example, retain the principle "separate the list and detail areas with borders rather than shadows" and specify only the border values currently needed. Label undecided values as tentative implementation proposals, not user preferences or finalized rules.

## Visualize new combinations

If characteristics selected from several references need to be seen together, or text alone is insufficient for a decision, use an available official image-generation skill or equivalent tool to create a mockup of the project screen. Read the tool's required instructions and confirm that it is usable. Do not implement image generation itself.

When requesting a mockup, distinguish the target screen's purpose, selected characteristics and evidence, existing rules to retain, characteristics to avoid, tentative decisions, and unresolved elements. Do not copy an entire reference screen. When comparing directions, make them meaningfully different, such as in background separation or density, and present separate images where possible.

Label the image as a "generated mockup" and explain which characteristics it combines. Show the image and ask the user whether it preserves their selected characteristics. Record choices through the user choices and records procedure linked from `SKILL.md`. Confirmation that the user likes a mockup does not complete validation of its implementation values in the real UI.

If image generation is unavailable or fails, say so. Ask whether the real screens already available support the needed decision, or defer visualization. Do not claim an image was generated when it was not, or substitute a text wireframe for its appearance. If essential visual evidence is missing, leave the affected decisions unresolved.

## Agree on validation conditions before implementation

Choose a representative screen or component for the current decision and agree with the user on states and conditions of use. Include affected selected, error, disabled, and keyboard-focus states, along with relevant screen sizes, themes, and languages used by the project. Do not add every state or environment indiscriminately.

If the rule is intended for shared use, also choose another existing screen or component where it applies. If there is no other target, validate only the current target and leave shared-rule validation incomplete. Do not create a new screen or application solely to validate reuse.

## Prepare the handoff to the main session

Separate tentative changes for validation from finalized guidance to reuse. The need for tentative values does not by itself block implementation, but do not present unvalidated values as final rules.

Include all information needed for the current change, without unrelated detail.

- Target screen or component and the purpose of the change
- Visual characteristics to preserve, user choices, and observational evidence
- Existing principles and tokens to reuse, permitted exceptions, and their scope of application
- Tentative values for validation, unresolved decisions, and conflicting choices that must not yet be applied
- Styles to avoid and rules that must not be added without approval
- Agreed validation screens, states, conditions of use, and reuse targets for shared rules

Adapt the specification format to the project. Provide design principles, design tokens, CSS variable or theme specifications, component usage rules, and prohibited visual patterns at the level needed. Reuse an existing `DESIGN.md` or equivalent guidance rather than duplicating finalized rules.

The main session makes only user-approved code changes, follows the project's development guidance, and checks existing behavior. Editing `tokens.css`, theme settings, and component files is also the main session's responsibility. Even when the same agent performs both procedures, making a design decision does not replace authorization to change code.

After code changes, the main session prepares the latest screen running the modified code and reapplies the post-change validation procedure linked from `SKILL.md`. At handoff, report separately whether implementation input, implementation, and real UI validation are complete.
