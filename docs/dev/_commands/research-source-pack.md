# Research Source Pack Command

## Purpose

Use this command when a broad technology-stack request, explicit concern list, issue, meeting note, or external/restricted source should become `docs/dev` guidance.

The command exists to decompose broad input into sufficiently granular development guidance targets before any current rule or owner-folder guidance is written.

## Inputs

- Target repository path, branch, and known product context.
- Explicit source items, if present.
- Stack evidence from package manifests, lockfiles, framework config, runtime structure, CI, tests, and existing docs.
- Official documentation, standards, and primary sources for the detected stack.
- Existing `docs/dev/**` guidance and design packages.

## Required Reading

- `docs/dev/README.md`
- `docs/dev/_templates/README.md`
- `docs/dev/_templates/repository/_template.md`
- `docs/dev/_templates/_bootstrap-audit.md`
- Existing `docs/dev/repository/**` evidence for the target repository, if present.

## Output Contract

Produce a source-pack research record or repository evidence update with:

| Section | Required Content |
| --- | --- |
| Input classification | Whether the input is an explicit concern list, broad stack request, repository evidence set, design package, issue, meeting note, or external source. |
| Target inventory | Stable source item IDs or derived target IDs, grouped only after each target remains traceable. |
| Stack evidence | Files, manifests, docs, runtime behavior, or official sources supporting each target. |
| Owner routing | The best `docs/dev/<owner>` folder for each target. |
| Classification | Current rule, recommended future pattern, local constraint, open question, accepted decision need, or not applicable. |
| Pattern obligation | Expected best/anti pattern, behavior example, decision case, or explicit no-example rationale. |
| Confidence and limitations | Evidence quality, missing sources, and follow-up research needed. |

## Coverage Gate

Every explicit source item or derived target must map to one of:

- Current-rule candidate with repository evidence.
- Recommended future pattern with official or primary evidence.
- Open question with the missing evidence named.
- Local constraint with target repository proof.
- Not applicable rationale.
- Decision record need.

Do not claim completion from a sample of familiar targets.

## Prohibited Shortcuts

- Treating a dependency name as a complete target.
- Summarizing a broad technology stack into familiar framework tips.
- Promoting official-document advice to current guidance without target repository evidence.
- Making Next.js, `data.txt`, a sampled repository, or a fixed item count the portable baseline.
- Storing source packs or worked evidence under `_commands`.

## Verification

- Search the output for stack names that appear as defaults rather than evidence-backed examples.
- Review every source item or derived target for owner, classification, evidence, pattern obligation, and follow-up.
- Confirm the repository evidence or design package records source location, persistence state, and reconstruction location when the source is ephemeral or restricted.
