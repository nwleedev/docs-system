# Repository Evidence Template

Use this template for target-repository-specific evidence that explains what this repository is and why the top-level `docs/dev` current rules apply here.

## Target Output

- `docs/dev/repository/README.md`
- `docs/dev/repository/<topic>.md` only when repository evidence becomes too large for the README.

## Use When

- A repository's purpose, technology stack, source layout, generated output, verification commands, external checkouts, local constraints, baseline evidence, or audit history must be recorded.
- Development guidance targets need evidence, classification, confidence, and owner-folder routing before implementation.
- Only a technology stack is known and public repository sampling is needed before proposing target candidates.
- GitHub evidence must be preserved even when `gh` is unavailable.
- A current rule in `architecture`, `engineering`, `domain`, `ai`, `decisions`, or a proposal in `evolution` needs local repository evidence.
- The root `docs/dev/README.md` would otherwise leak repo-specific assumptions into portable governance.

## Do Not Use For

- Current code-writing rules. Use `engineering/`.
- Module boundaries, import direction, ownership, runtime/data flow, or public API rules. Use `architecture/`.
- Domain vocabulary or business invariants. Use `domain/`.
- Future proposals or migrations. Use `evolution/`.
- AI reading order or agent behavior rules. Use `ai/`.
- Decision rationale or supersession history. Use `decisions/`.

## Cross-Check

Confirm the target repository's `docs/dev/README.md` Folder Ownership and Reading Order. `repository/` owns evidence and context only; it links to current-rule folders instead of replacing them.

Do not recreate `docs/dev/profile/{architecture,engineering,domain,evolution,ai,decisions}/` as the default evidence taxonomy. If application-specific evidence is needed, add a decision before creating `docs/dev/application/`.

## Completion Check

- Repository purpose, stack, source layout, generated output, verification commands, constraints, baseline evidence, and audit history are recorded or explicitly marked not found.
- Development guidance targets record decision point, risk, evidence, owner folder, classification, confidence, and follow-up.
- External repository cross-validation records multiple public repositories or a justified smaller sample.
- GitHub fallback evidence records tool/interface, URLs, steps, inspected files/pages, date, limitations, and confidence impact.
- Each evidence row links to the top-level current-rule folder it supports.
- No current engineering, architecture, AI, domain, evolution, or decision rule is written as repository evidence.
- Root README remains portable and links to `repository/` instead of embedding target-repository stack defaults.
- Placeholder text has been removed.
