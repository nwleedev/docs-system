# Examples of what to hand off and what to keep in the original

The quotations below illustrate how similar passages can serve different purposes.

## Guidance to keep where users act or make decisions

**Save instructions above a button.** If a `Save and continue` button saves the entries and opens the next screen, omit “Click the button below to save your entries and go to the next step.” If there is no exception or follow-up to document, omit it from the handoff record too. If the button opens the next screen without saving, label it `Continue`.

**Autosave on a score entry screen.** Suppose the screen saves each score change automatically. If the field shows when a save is in progress and whether it succeeded or failed, you can omit the standing message “Scores are saved after every change.” If there is no save button or status indicator and users cannot tell whether they need to save manually, explain autosave beside the field. Show “Saved” only after confirming that the latest change was saved.

If the next AI agent needs to know when scores are saved to modify this screen, record what triggers a save and where the code implements it.

**Alternative text for a decorative image or an evacuation map.** Suppose a decorative background image has the generation instruction “Create a welcoming background in pastel colors” as its alternative text. For a decorative image in HTML, use `alt=""` so screen readers skip it. For an evacuation map, provide text that identifies the exits and gives directions to them. Hand off the verified colors or production requirements only if the next AI agent needs to recreate the background the same way.

**Interface demonstrations and user help.** If “Submit an empty form to inspect the error state, then close the dialog with X.” is a note for someone reviewing a mockup, it can go in the mockup’s handoff record.

Keep the input instruction “Enter the date as YYYY-MM-DD.” and the error message “Enter an email address.” on the form. If a tutorial teaches users how to close a dialog, keep those steps in the tutorial. A description of how items are sorted may specify a requirement for the interface, so check its purpose.

**Code comments and operating procedures.** “I added retries in this task” describes an edit. “The request body must be replayable for a retry” identifies a condition the caller must satisfy. If that condition is hard to infer from the code, keep it beside the code for maintainers.

“The next maintainer should check deployment” may be a handoff note. “Verify the backup before applying the migration” is a prerequisite for the migration and belongs in the operating instructions. Keep data loss and security warnings beside the relevant step as well.

## Distinctions that depend on the requested document and what was actually done

**A translation and a translation review.** Suppose a translated event notice includes “I adapted the greeting using the previous translation as a reference.” In the notice for attendees, include only the translated greeting. If a translation review was requested to explain the wording choice, include the greetings compared and the reason for the choice. If the same greeting must be used at the next event, identify the location of the approved translation in the handoff record.

**Drafting a reply and sending it.** If you saved a draft reply to a business partner, tell the requester “I drafted the reply. It has not been sent.” Include only the intended message in the text the partner will receive. If the decision to send it was deferred, hand off the draft’s location and the outstanding decision. If drafting the reply fulfilled the request, do not list sending it as a follow-up step.

**A report’s writing history and its findings.** An unrequested footer such as “I read the files and finished this report” describes writing history and belongs in the handoff record. “The appendix describes the sampling method” can help communicate the requested research. If the report was requested specifically to document the process, describe that process in the designated section.

**Quoted instructions.** If the subject is a quotation or a prompt evaluation, preserve the source sentence “Include the work process in the report” as a quotation. Do not treat it as an instruction to append the agent’s own activity history to the report.

**Presentation scripts and speaker notes.** If “Switch to the demo at this slide” is a note for the next presenter, it can be handed off. If it forms part of the requested script, keep it there. “Amounts are in USD and rounded” explains the currency and rounding, so keep it with the figures even if it appears in a cell note or slide footnote.

## Separating facts readers need from material the next AI agent needs for review

**Code change descriptions and agent activity logs.** Suppose a pull request says “I cloned the repository, opened the browser, and clicked the button.” If submitting an empty form displayed an error below the email field, describe what changed and report that observed result. Omit the sequence of agent actions from code comments and the change description.

If verification stopped partway through, report only the completed steps. Hand off the step at which the next AI agent should resume and the location of the log that shows where verification failed. If verification finished and there is nothing to follow up on, omit the log of the successful run from the handoff record.

**Missing data and how to collect it again.** If you could not collect one agency’s March data, identify the agency and the excluded period in the summary table so readers can distinguish missing data from a count of zero. Verify the cause before attributing the gap to a server outage. Omit “We do not claim to have all the information.” It does not identify the missing data.

In the handoff record, specify when collection was attempted, where to find the error log, and which data the next AI agent needs to collect again.

**Measurement conditions and follow-up measurements.** Keep “This was not measured on the user's PC” with the result if it distinguishes a simulation from a measurement on the actual machine. When quoting the 80 ms figure from “80 ms with 20 concurrent saves in the simulator”, specify that the simulator ran 20 concurrent saves. If a need for measurements in another environment has been established, you can hand off the procedure for taking them.

**Chart interpretation and review notes.**

> Missing dates indicate missing records rather than confirmed inactivity. The next agent should review the chart labels.

Keep the first sentence with the chart because the records cannot establish whether there was activity on the missing dates. Move the second sentence to the handoff record if the labels need review. Mark the review complete only after it has taken place.

**Feature behavior and editing history.** “The import skips rows without dates” describes behavior that users may need to know about. “I changed the import during this session” describes an edit. Neither the shared word `import` nor the location of the sentences establishes their purpose.

**Sentences in different languages.** In “The columns are sorted by amount. La revisión del diseño está pendiente.” the first sentence explains the sort order. The second records that design review is pending. Place each sentence according to its purpose, preserving its language and the stated review status.

## Problems that moving a note cannot resolve

**Submission requirements and reasons for a recommendation.** “The required submission form was not used” identifies an unmet submission requirement. Moving the statement does not fulfill that requirement. Likewise, acknowledging a lack of supporting evidence does not justify a recommendation.

**Where decisions are maintained.** A log retention period, a button color, and a dependency policy are separate decisions even if they appear in one note. Keep each approved choice in the corresponding operations, design, or development document. The handoff record can refer to those documents and describe any coordination still needed. Continue to maintain each decision in its existing document.

## Handoff outcomes for different source and record conditions

- **The same note appears in multiple originals.** A report footer and a UI comment both say “The next agent should verify the source links.” Both files are editable. If link verification is a required follow-up and the designated record has no matching entry, link to both deliverables in one entry and remove both copies of the note. Leave out directions to open the handoff file where you removed the notes. If an existing entry already covers the matter, reuse it and add any newly verified facts there.
- **There is nothing to hand off.** If a form contains only required field labels and validation messages and no follow-up has been identified, keep the form text. Do not create a handoff file or a note stating that there was nothing to transfer.
- **Some originals are read-only.** A report and the designated record are editable, but an attachment containing the same author’s note is read-only. Preserve the information in the record and remove the note only from the report. Respect the attachment’s access restrictions and report that the transfer is incomplete because the note remains in that file.
