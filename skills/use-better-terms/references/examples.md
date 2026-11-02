# Common Wording Examples

These synthetic examples contrast wording choices. Use the stated evidence rather than treating a phrase as inherently wrong.

## Remove decoration while preserving notation

Problematic:

> Quick setup · safe storage · easy sharing

If these are the supported actions write:

> Complete the setup. Save the content. Share it with your team.

Preserve exact symbols in formulas and approved names. Code and character tests may also require them. Keep notation needed for accessibility. The reader's need decides whether the symbol stays.

## Replace private locations

Do not direct readers to a named user's desktop directory when a repository example is available:

> See `examples/config.yml` for an example configuration.

Keep a necessary local reproduction location only in an untracked record with suitable access. Do not quote sensitive locations or credentials in the review response.

## Adapt inherited wording

An earlier document can establish facts without supplying suitable wording for new readers. Retain its verified facts and approved decisions. Explain the actors and actions the current readers need. Keep repeated structure when readers compare the same attributes in the same order.

## Separate clarification from approval

> Apply the review findings to clarify the approved scope and confirm that it can be released.

This needs human input. The sentence does not identify what is released or who approves release. Clarifying a document does not itself grant approval. Obtain the missing relationship before replacing the sentence.

Similarly this pair does not establish approval:

> The reviewer lists the changed items. Release only the approved items.

Name the approval owner and approved items only when the source establishes them. Do not promote the reviewer to approver.

## Resolve ambiguous objects

> Submission path

> Separate it from the configuration code path.

Both objects need clarification. The first could be a registry address or artifact directory. The second could be a file location or execution flow. Identify the actual objects before choosing a replacement.

A similar ambiguity occurs here:

> Attach the review findings and release log to the report. Retain this record for seven days.

If evidence identifies the complete report as the retained record write:

> Retain the report with its attached findings and release log for seven days.

Otherwise ask which record must be retained.

## Preserve a clear condition

> Replace a personal path with a repository-relative path if the document contains one. Confirm that the file remains accessible at the revised path before sharing the document.

The condition and required action are identifiable. A replacement must preserve the access check and its timing.

## Distinguish facts from a causal claim

Evidence states that the team added a dashboard. A separate record states that failures fell during the same month. It does not establish a causal relationship.

Unsupported:

> The team added a dashboard thereby reducing failures.

Supported:

> The team added a dashboard. Failures fell during the same month.

Do not replace the unsupported claim with a declaration that the dashboard had no effect. That conclusion is also absent from the evidence.

## Preserve valid ranges and terminology

> The archive contains reports from 2020 to 2025.

Keep this range when the archive supports it. The phrase `from A to B` is not itself a defect.

> Set the retention period to seven days. Keep the retention period unchanged during export.

Keep `retention period` in both sentences. Replacing it with a different noun may imply a different setting.

## Simplify actions without changing obligations

> Perform an evaluation of the revised text.

Equivalent:

> Evaluate the revised text.

Permission is different from obligation:

> You may attach a source excerpt.

Do not rewrite this as a requirement to attach an excerpt.

## Keep modifier and condition scope

> Only editors may publish the report.

Do not move `only` before `publish`. That position could limit what editors may do rather than who may publish.

> If editing is authorized then revise the draft and save the revision.

A split must keep both actions conditional. A list can express the shared condition without repeating it:

When editing is authorized:

- Revise the draft.
- Save the revision.

Do not make saving unconditional merely to shorten the sentences.
