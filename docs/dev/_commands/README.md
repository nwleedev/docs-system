# docs/dev Commands

`docs/dev/_commands` contains reusable prompt and runbook files for maintaining `docs/dev` across repositories.

Commands are optional execution aids. They do not own current rules, repository facts, accepted decisions, source packs, worked examples, or portable governance. Those artifacts stay in `docs/dev/README.md`, `docs/dev/_templates/**`, `docs/dev/repository/**`, `docs/dev/<owner>/**`, or a tracked design package.

## Command Contract

Every command file should define:

| Field | Required Content |
| --- | --- |
| Purpose | The repeated documentation task this command executes. |
| Inputs | Source material, target repository evidence, and prior docs the command expects. |
| Required reading | Normative templates and existing docs that must be read before writing. |
| Output contract | The sections, mappings, and evidence the command must produce. |
| Coverage gate | How completion proves every explicit source item or derived target was processed. |
| Prohibited shortcuts | Shortcuts that would hide missing target coverage or turn examples into baselines. |
| Verification | Searches, audits, or review steps required before the command output is accepted. |

## Available Commands

| Command | Use When | Primary Output |
| --- | --- | --- |
| `research-source-pack.md` | A broad technology-stack request, explicit concern list, issue, meeting note, or external/restricted source needs to become `docs/dev` guidance. | Target inventory, evidence routing, classification, and coverage obligations. |
| `write-owner-guidance.md` | Target inventory and evidence are ready to become owner-folder guidance. | Architecture, engineering, domain, evolution, AI, or decision guidance with best/anti coverage. |
| `audit-source-pack-coverage.md` | A broad source pack or derived target inventory needs completion review. | Coverage audit that identifies mapped, deferred, rejected, or unresolved targets. |

## Ownership Rules

- Commands may describe workflow, sequencing, and review prompts.
- Commands must defer current rules to owner-folder docs and accepted decisions.
- Commands must defer repository facts and source pack inventories to `docs/dev/repository/**` or a design package.
- Commands must not require `data.txt`, Next.js, a fixed item count, a sampled repository, or a worked example as a portable baseline.
- Commands must not store raw source packs under `_commands`.
