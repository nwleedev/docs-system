# Remove Non-Executable Commands And Keep Examples

## Metadata

- Status: Accepted
- Date: 2026-06-19
- Related Amendment: A1, A2
- Supersedes: `docs/designs/nextjs-dev-guidance-research-20260618-nx50/research/0005-template-vs-examples-prompt-pack.md` recommendation to keep `_commands`
- Superseded By: None
- Preserves: R1-R23, U8-U12
- Replaces: Live `docs/dev/_commands/**` prompt/runbook layer

## Context

The current live `docs/dev/_commands/**` files are Markdown prompt/runbooks, not executable commands. They overlap with responsibilities now assigned to `docs/dev/README.md`, `docs/dev/_templates/**`, `docs/dev/repository/**`, `examples/*.md`, and `_bootstrap-audit.md`.

The user accepted deleting `_commands` and keeping `examples/` as the folder name. Example prompt files should remain free-form after a common top instruction, rather than becoming fixed section templates.

## Requirement Change Classification

- Related Amendment: A1, A2
- Change Type: Supersedes
- Preserved Requirement IDs: R1-R23
- New Requirement IDs: None
- Modified Requirement IDs: R17-R23
- Superseded Requirement IDs: None
- Preserved Requirement Scope: Templates stay stack-neutral; broad stack guidance still requires evidence-backed target decomposition, external repository cross-validation, best/anti pattern coverage, and auditability.
- Superseded Requirement Scope: `_commands` as a live non-normative prompt/runbook layer.
- Plan Impact: U8-U12 must complete together so deleted command responsibilities remain covered.
- Traceability Impact: R17-R23 map to this decision.
- Completion Audit Impact: The final audit must prove live docs no longer reference `_commands` and replacement responsibilities are present.
- Migration Required: Update README, templates, repository template, bootstrap audit, examples prompt, traceability, and completion audit; delete `docs/dev/_commands/**`.

## Decision Drivers

- `_commands` created an expectation that command files should execute in consumer repositories.
- The command responsibilities are not unique source-of-truth data.
- `examples/` should mean repository-applicable example prompts, not a prohibition-only catalog.
- Fixed detailed sections in example prompts would make stack-specific prompts unnecessarily rigid.

## Considered Options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| A | Keep `_commands` as prompt/runbooks | Lowest migration cost | Preserves command expectation mismatch and duplicate workflow entry point |
| B | Delete `_commands` and move responsibilities to README/templates/examples/audit | Removes mismatch and keeps source-of-truth boundaries clear | Requires coordinated live reference cleanup |
| C | Rename `examples/` to `prohibitions/` | Strongly signals what not to do | Narrows positive guidance, external validation, and best pattern responsibilities |
| D | Keep `examples/` and use free-form prompts with common top guidance | Keeps examples meaning and allows stack-specific prompt shape | Requires top guidance to carry do-not and alternative requirements |

## Decision

Choose B and D.

Delete `docs/dev/_commands/**`. Keep `examples/` as the folder for repository-applicable example prompts. Each example prompt may use free-form structure after a common top instruction that requires external repository cross-validation, what-not-to-do extraction, required safer alternatives, best/anti examples, verification, and relevant enforcement.

## Consequences

- Live guidance no longer exposes non-executable command files as an authoring path.
- README and templates must explicitly carry external repository cross-validation and audit gates.
- Example prompts remain flexible enough for different stacks.
- Historical research that recommended `_commands` remains as history and is superseded by this package.

## Confirmation

Implementation is accepted only when:

- `docs/dev/_commands/**` is deleted.
- Live `docs/dev` and `examples` files no longer reference `_commands` command files.
- `External Repository Cross-Validation` appears in README and templates.
- `examples/nextjs-frontend.md` keeps a free-form body after common top guidance.
- Traceability and completion audit record the migration.

## Revisit Trigger

- A real executable command system is introduced.
- Multiple stack example prompts show that free-form prompts cause repeated omissions.
- The team chooses to rename `examples/` despite the narrower meaning.

## Sources

- `requirements.md`: R17-R23.
- `plan.md`: U8-U12 and V8-V12.
- `research/0006-remove-commands-decision.md`: replacement responsibility map.
- `research/0007-examples-vs-prohibitions-naming.md`: naming and free-form prompt recommendation.
