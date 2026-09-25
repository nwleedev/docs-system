# Analyze cases and compare design choices

Analyze each inspected case on its own before comparing the options. Preserve the source and conditions for each finding so the user can trace why an option is being considered.

## Describe each case on its own

For each case, identify the service and screen, the user task it supports, the relevant observed choices, the inspected viewport and states, and the evidence source. Separate what was observed from what a source explicitly says, the analysis of why the choice may help, and anything that remains unknown. Follow [inspection of real interfaces](inspection.md) when deciding what each source can support.

Do not turn one screen into a claim about every screen in its service. Do not infer the designer's intent from the appearance alone. If two cases differ, preserve both descriptions even when one choice may be better for the current project.

## Compare only after the individual analyses

Compare cases against the user's current task, screen, constraints, and unresolved design question. Describe the useful similarities, different solutions, distinctive choices, and opposing choices. Explain trade-offs that matter to the task, such as scan speed versus density or visual separation versus screen space. Identify uncertainty when the evidence does not explain a difference.

Do not average several services into a generic style or let a famous service define the target. Keep alternatives visible when they lead to meaningful trade-offs. A user may select different characteristics from different cases; the comparison must not imply that choosing one service adopts its complete visual direction.

Distinguish general design guidance from a service-specific visual direction. Classify the role of each individual evidence item for the question at hand; a single source may provide more than one kind of evidence, and its role may differ by claim. Do not label an entire source as universally authoritative or suitable for every design question.

Carry the comparison into the user-facing choice and implementation input with the relevant case, evidence link, intended use, trade-off, and uncertainty. Keep user-confirmed preferences separate from AI analysis and tentative implementation proposals. Follow the user choices procedure for pending questions, responses, and stage results.
