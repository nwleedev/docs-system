# Write Owner Guidance Command

## Purpose

Use this command after target decomposition and evidence review are ready to become owner-folder guidance.

The command turns target inventories into grouped `docs/dev/<owner>/**` documents without creating one document per counted item or one broad, unauditable document for an entire stack.

## Inputs

- Target inventory from `docs/dev/repository/**` or a design package.
- Evidence and confidence notes for each target.
- Existing owner-folder guidance and decision records.
- Applicable templates from `docs/dev/_templates/**`.

## Required Reading

- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- The owner-folder `README.md` for the target document.
- The matching owner-folder `_template.md`.
- Relevant `docs/dev/repository/**` evidence.
- Relevant decision records.

## Output Contract

Each owner guidance document should include:

| Section | Required Content |
| --- | --- |
| Scope | Which targets are covered and which are explicitly out of scope. |
| Target repository evidence | Evidence proving the guidance applies to the target repository. |
| Scenario coverage | Development scenarios covered before examples are written. |
| Best patterns | Intent, applicability, impact, constraints, and verification. |
| Anti-patterns | Failure mode, user or maintenance impact, safer alternative, and detection signal. |
| Source evidence | Official, primary, local, and cross-validation sources. |
| Open questions | Targets that need evidence, decisions, or product context before promotion. |
| Verification | Commands, reviews, runtime checks, or code search needed to validate the guidance. |
| Traceability | Source item IDs or derived target IDs covered by the document. |

For test or verification guidance, the verification section must explain which acceptance example, user regression, or public contract the check protects.

## Coverage Gate

Every routed target ID must map to one of:

- A scenario and best/anti pattern pair.
- A behavior example or decision case.
- A local constraint with verification.
- An open question with a named blocker.
- An explicit no-example rationale.

For test guidance, every proposed verification must map to one of:

- an approved acceptance example ID;
- a user regression statement;
- a public contract name for lower-level unit tests.

## Prohibited Shortcuts

- Writing one broad stack guide that hides unmapped targets.
- Copying a worked example as current guidance for another repository.
- Treating pseudo-code as repository-proven code.
- Dropping targets because they are hard to classify.
- Weakening template-required evidence, scenario, or audit sections.

## Verification

- Search the owner document for every routed target ID.
- Confirm every best pattern has a corresponding failure mode or anti-pattern.
- Confirm every current rule has target repository evidence.
- Confirm future patterns and open questions are not worded as accepted current rules.
- Confirm test verification is tied to an acceptance example, user regression, or public contract instead of implementation shape alone.
