# Common Wording Examples

Use these examples only when a common criterion or allowed case is unclear. They calibrate audience, evidence, sensitive information, symbols, sentence meaning, and relationships between sentences. Similar wording does not fail automatically; judge the actual context.

## Keep different decisions in their responsible documents

Problematic:

> One decision record sets the log retention period, button color, and dependency update policy.

These subjects have different readers, approval roles, and verification methods. Their appearance in one request does not make them one decision.

Meaning-preserving alternative:

> Record the log retention period in the operations decision, link the button color to the approved design, and record the dependency update in the implementation plan and verification results.

## Remove decorative symbols, not required notation

Problematic:

> Quick setup · safe storage · easy sharing ✨

Natural alternative:

> Complete the setup, save the content, and share it with your team.

Keep exact symbols in formulas, trademarks, approved interface labels, code, character tests, and accessibility instructions. The reader's need for the notation, not the symbol alone, decides the result.

## Replace private locations while preserving usable locations

Problematic:

> Find the attachment in a named user's desktop directory.

Repository-relative alternative:

> See `examples/config.yml` for an example configuration.

If a local input location is required to reproduce a result, retain only the necessary part in an untracked record with suitable access. Do not quote credentials, private URLs, private identifiers, or personal locations in the review result.

## Rewrite inherited wording for the current readers

Problematic:

> Copy the earlier document's title, abstractions, and conclusion because it supplied the facts for this document.

Evidence-backed alternative:

> Retain verified facts and approved decisions from the earlier document. Explain them for the current readers by naming the actor, action, conditions, and result.

An existing document can establish facts and approved decisions without making its wording suitable for a new audience. Repeated structure remains useful when readers compare the same attributes in the same order.

## Make sentence relationships explicit

### Several judgments compressed into one sentence

> Apply the review findings to clarify the approved scope and confirm that it can be released.

- **Status:** `needs human input`
- **Missing relationship:** The text does not identify who confirms what, whether the clarification grants release approval, or whether it only changes a document.
- **Next step:** Obtain the review and approval roles before writing a replacement.

### Technical modifiers without identifiable objects

Heading:

> Submission path

Body:

> Separate it from the configuration code path.

- **Status:** `needs human input`
- **Missing relationship:** The first phrase could mean a registry address, artifact directory, or deployment destination. The second could mean a file location, import connection, or execution flow.
- **Next step:** Identify both objects and the required separation before replacing either phrase.

### Roles and approval that do not connect

> The reviewer lists the changed items. Release only the approved scope.

- **Status:** `needs human input`
- **Missing relationship:** The text does not identify who approves the items, when approval occurs, or which items were approved.
- **Possible wording after confirmation:** After the approval owner selects the items for release, the release owner publishes only those items.

### One phrase with several possible referents

> Attach the review findings and the release log to the report. Retain this record for seven days.

- **Status:** `needs human input`
- **Missing relationship:** `this record` could mean the findings, the log, or the complete report.
- **Possible wording after confirmation:** Retain the report, including the attached review findings and release log, for seven days.

### Clear condition and result

> If a document contains a personal path, replace it with a repository-relative path. Confirm that the file remains accessible at the revised path before sharing the document.

- **Status:** `pass`
- **Reason:** The condition, change, verification, and next action appear in order.
