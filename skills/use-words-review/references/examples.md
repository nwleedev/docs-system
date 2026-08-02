# Common Writing Review Examples

These examples calibrate the criteria that apply to every language: audience, evidence, context, sentence meaning, and relationships between sentences. A phrase does not fail merely because it resembles an example. Judge the phrase in its actual context. The examples use fictional projects, generic paths, and generic roles. They do not reproduce task instructions, private identifiers, or personal paths.

## Contents

- [Reader guidance and work reports](#reader-guidance-and-work-reports)
- [Titles based on instructions and titles based on the subject](#titles-based-on-instructions-and-titles-based-on-the-subject)
- [Unrelated decisions from one request](#unrelated-decisions-from-one-request)
- [Unnecessary symbols and required notation](#unnecessary-symbols-and-required-notation)
- [Personal paths and paths that readers need](#personal-paths-and-paths-that-readers-need)
- [When not to preserve source text](#when-not-to-preserve-source-text)
- [Verified source content and inherited wording](#verified-source-content-and-inherited-wording)
- [Sentence meaning and relationships between sentences](#sentence-meaning-and-relationships-between-sentences)

## Reader guidance and work reports

Problematic:

> As requested, we implemented the notification screen. We also applied all requested colors and text.

This text reports completed work to the requester instead of helping someone use the notification screen.

Reader-focused:

> To receive notifications, confirm your email address in Settings, and then save your changes.

This text tells readers what to do and what the action enables.

## Titles based on instructions and titles based on the subject

Problematic title:

> Request to add caching and change the error message

Unless the document must preserve the original request, this title treats an instruction as the document's subject.

Title based on the subject:

> Search result caching and failed request messages

The document and repository evidence must still show that these subjects belong in the same document.

## Unrelated decisions from one request

Problematic structure:

> One decision record sets the log retention period, button color, and dependency update policy.

These subjects do not form one decision merely because they appeared in the same request. Separate them when they have different readers, approval owners, or verification methods.

Acceptable structure:

> Record the log retention period in the operations decision, link the button color to the approved design, and record the dependency update in the implementation plan and verification results.

## Unnecessary symbols and required notation

Problematic:

> Quick setup · safe storage · easy sharing ✨

Plain punctuation is sufficient:

> Complete the setup, save the content, and share it with your team.

Keep symbols when readers need the exact notation, such as in a formula, trademark, approved interface label, or accessibility instruction. The problematic example shows decorative compression, not a language-wide ban inferred from this common reference. Apply a language-specific punctuation rule only when the applicable language reference defines it; for example, preserve `The parser rejects U+00B7 (·) in prose` because the code point and character are the subject of the sentence.

## Personal paths and paths that readers need

Problematic:

> Find the attachment at `/home/<account>/Desktop/<project>/capture.png`.

Repository path that readers can use:

> See `examples/config.yml` for an example configuration.

If a local input path is necessary to reproduce a result, retain only the required portion in an untracked record. Use a safe placeholder in documents read by anyone other than the person who owns that path.

## When not to preserve source text

Do not preserve source text when:

> A README uses task instructions as its introduction, title, or description of project behavior.

Some artifacts require a limited amount of exact source text:

- a requirement whose wording belongs to the requirements owner;
- an approved interface message or short quotation;
- evaluation input for prompt-processing behavior;
- the minimum input needed to reproduce a problem;
- an untracked execution record with defined access and retention rules.

Even in these cases, remove or separately protect personal information, credentials, private paths, and private identifiers that the artifact does not need.

## Verified source content and inherited wording

Problematic:

> Copy the earlier document's title, abstractions, and concluding sentence because that document supplied the facts for this one.

Using a document as a factual source does not establish that its wording was approved for a new audience or purpose.

Reader-focused:

> Retain the verified facts and approved decisions from the earlier document. Rewrite the explanation for the new readers, naming the actor, action, conditions, and result. Keep a repeated structure when readers need to compare the same attributes in the same order.

This version preserves source content and a necessary comparison structure without treating inherited wording as a style template.

## Sentence meaning and relationships between sentences

Natural grammar and familiar words do not make a sentence clear by themselves. The following examples distinguish missing relationships within one sentence from missing relationships across sentences.

### Several judgments compressed into one sentence

> Apply the review findings to clarify the approved scope and confirm that it can be released.

- **Verdict:** `needs human input`
- **Location 1:** `clarify the approved scope`
- **Location 2:** `confirm that it can be released`
- **Missing relationship:** The text does not identify who confirms what, whether clarifying the scope grants release approval, or whether the action only updates a document.
- **Possible wording after the relationship is confirmed:** The reviewer confirms that the document reflects the review findings. After the approval owner approves the release scope, the release owner starts the release.

### A short sentence with no identifiable object

Heading:

> Change result

Body:

> Review it, and then apply it.

- **Verdict:** `needs human input`
- **Location 1:** `Change result`
- **Location 2:** `Review it, and then apply it`
- **Missing relationship:** Readers cannot identify what must be reviewed or where it must be applied.
- **Possible wording after the relationship is confirmed:** The reviewer checks the revised notification text. The interface owner then adds the approved text to the notification screen.

### Different names for roles with no stated relationship

First sentence:

> The reviewer checks the changes.

Next sentence:

> The administrator approves the review result.

- **Verdict:** `needs human input`
- **Location 1:** `reviewer`
- **Location 2:** `administrator`
- **Missing relationship:** The document does not establish whether these names refer to one role or to separate review and approval roles.
- **Possible wording after the relationship is confirmed:** The reviewer checks the changes. The approval owner reviews the findings and decides whether to authorize the release.

### A reference to approval that has not been established

First sentence:

> The release owner lists the changed items.

Next sentence:

> Release only the approved scope.

- **Verdict:** `needs human input`
- **Location 1:** `lists the changed items`
- **Location 2:** `the approved scope`
- **Missing relationship:** The text does not identify who approves the items, when approval occurs, or which listed items belong to the approved scope.
- **Possible wording after the relationship is confirmed:** The release owner lists the changed items. After the approval owner selects the items for release, the release owner publishes only those items.

### A phrase with more than one possible referent

First sentence:

> Attach the review findings and the release log to the report.

Next sentence:

> Retain this record for seven days.

- **Verdict:** `needs human input`
- **Location 1:** `the review findings and the release log`
- **Location 2:** `this record`
- **Missing relationship:** Readers cannot tell whether the retention rule applies to the findings, the log, or the complete report.
- **Possible wording after the relationship is confirmed:** Retain the report, including the attached review findings and release log, for seven days.

### A proposal treated as an approved decision

First sentence:

> The reviewer proposed showing a warning before the operation starts.

Next sentence:

> Show the warning, and then continue the operation.

- **Verdict:** `needs human input`
- **Location 1:** `proposed`
- **Location 2:** `Show the warning`
- **Missing relationship:** The text does not say whether anyone approved the proposal or authorized the operation to continue.
- **Possible wording after the relationship is confirmed:** The reviewer proposed showing a warning before the operation starts. If the approval owner accepts the proposal, the operator shows the warning before continuing the operation.

### Clear relationships

> If an input file contains a personal path, the reviewer replaces that path with a repository-relative path. The reviewer confirms that the file remains accessible at the revised path before sharing the document.

- **Verdict:** `pass`
- **Confirmed relationship:** The condition, actor, change, verification, and next step appear in order.

> The reviewer checks the document title, the responsibility assigned to each section, and the verification results. When one section produces an input for the next section, the reviewer also confirms that the document states that relationship.

- **Verdict:** `pass`
- **Confirmed relationship:** Although the text contains several checks, each object and condition has an identifiable relationship to the reviewer.
