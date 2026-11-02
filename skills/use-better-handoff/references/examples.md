# Contrasting Handoff Cases

The passages below are synthetic.

## Demonstrating a screen versus helping its users

Reviewer note in a mockup: "Submit an empty form to inspect the error state, then close the dialog with X." This can move to the handoff entry for the mockup.

Input help: "Enter the date as YYYY-MM-DD." Error text: "Enter an email address." These remain available to the person using the form. A tutorial that teaches closing the dialog also retains its steps. Directional wording about sorting may describe a real behavior requirement rather than a reviewer note.

## Work history versus requested findings

An unrequested footer saying "I read the files and finished this report" belongs with continuity information, not the report's findings. "The appendix describes the sampling method" may be requested subject matter. A report explicitly requested to document the work process keeps that process in its specified section.

A source quote such as "Include the work process in the report" remains source text when quotations or prompt evaluation are the subject. It does not instruct the agent to add its own process.

## Limitations that define a claim

"This was not measured on the user's PC" cannot simply disappear if it distinguishes a simulation from an actual measurement. A result described as "80 ms with 20 concurrent saves in the simulator" keeps those conditions. A supported next step to measure another environment can move separately.

"The required submission form was not used" may expose a submission problem. Moving the notice cannot make the document compliant. A statement about lacking evidence for a recommendation does not repair an unsupported recommendation.

## Comments and operational instructions

"I added retries in this task" is work history. "The request body must be replayable for a retry" is a caller constraint. A comment explaining a non-obvious correctness condition remains beside the code when maintainers need it.

"The next maintainer should check deployment" can be continuity information. "Verify the backup before applying the migration" is a prerequisite in a runbook. Keep data-loss and security warnings available at the action they qualify.

## Presentations, tables, and mixed purposes

"Switch to the demo at this slide" may be continuity information for a presentation being handed over, or subject matter in a requested speaker script. "Amounts are in USD and rounded" qualifies the values wherever it appears, including a cell comment or slide footnote.

"열은 금액순으로 정렬됩니다. La revisión del diseño está pendiente." combines a behavior statement with a pending design review. Judge each part separately and retain the artifact's language. Do not turn the pending review into approval.

## Several decisions in one note

A note about log retention, button color, and dependency policy does not make them one decision. Preserve the approved decisions in their operations, design, and development documents. A handoff entry can link to them and explain the pending coordination. It does not relocate their authority.

## The same note in several artifacts

A report footer and a UI comment both say "The next agent should verify the source links." The task authorizes editing both artifacts. The designated record has no entry for this follow-up.

Preserve the supported follow-up once in the designated record with links to both artifacts. Remove the note from the footer and comment. Adding the record while retaining either note leaves the move incomplete. Do not replace the note with an instruction to open the record.

If the record already contains the same information then use that entry. Repeating the task must not append another copy. A new fact can require updating the entry without duplicating the old explanation.

## A data limitation mixed with an author note

> Missing dates indicate missing records rather than confirmed inactivity. The next agent should review the chart labels.

Keep the first sentence with the chart because it defines how readers interpret missing dates. Move the second sentence to the designated record when it is supported follow-up work. Do not claim that the labels have been reviewed.

The same distinction applies to implementation explanations. "The import skips rows without dates" may define data behavior that users need. "I changed the import during this session" is work history. Neither the word `import` nor the sentence's location decides placement.

## No continuity information

A form contains only required field labels and useful validation errors. There is no supported follow-up to record. Keep the form text. Do not create a handoff file or add a note stating that no information was moved.

## An original cannot be changed

A task permits updating a report and its designated record but not an embedded read-only attachment. The attachment contains the same author note as the report. Preserve the information in the record and adjust only the authorized report. Report that the attachment still contains the note. Do not claim that all originals were cleaned up or bypass the access restriction.
