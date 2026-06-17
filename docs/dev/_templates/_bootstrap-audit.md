# docs/dev Bootstrap Audit

Use this checklist when an AI agent or contributor creates or substantially reorganizes a `docs/dev` system from these templates. The audit proves that the output is grounded in the target repository, not copied from this repository or from a specific skill.

## Target Repository

| Field | Value |
| --- | --- |
| Repository name | <name> |
| Repository purpose | <summary with source path> |
| Existing `docs/dev` status | <absent / partial / present> |
| Existing development guidance | <repo-relative paths checked> |
| Technology stack evidence | <manifest/config paths checked> |
| Source layout evidence | <source paths checked> |
| Verification command evidence | <scripts/config/test paths checked> |
| Constraints | <legacy/generated/external/security/release constraints> |

## Created Or Updated Structure

| Path | Action | Evidence Used | Current / Future / Decision / AI Rule |
| --- | --- | --- | --- |
| `docs/dev/README.md` | <created/updated/unchanged> | <paths> | <classification> |
| `docs/dev/repository/README.md` | <created/updated/unchanged/not needed> | <paths> | <repository evidence> |
| `docs/dev/architecture/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/engineering/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/domain/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/evolution/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/ai/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |
| `docs/dev/decisions/README.md` | <created/updated/unchanged/not needed> | <paths> | <classification> |

## Evidence Promotion

| Claim | Evidence | Classification | Why This Is Safe |
| --- | --- | --- | --- |
| <claim> | <repo-relative source/config/test/doc paths> | <Current Rule / Local Constraint / Recommended Future Pattern / Open Question> | <reason> |

## Missing Evidence

| Missing Evidence | Checked Paths | Classification | Follow-Up |
| --- | --- | --- | --- |
| <item> | <paths> | <Open Question / Local Constraint / Recommended Future Pattern> | <next step> |

## Independence Checks

| Check | Pass / Fail | Evidence |
| --- | --- | --- |
| No template output assumes this repository's stack as the target stack. | <Pass/Fail> | <paths> |
| No template output requires `maintain-dev-docs` or another specific skill. | <Pass/Fail> | <paths> |
| No skill-local path, absolute user path, worktree name, or session state is required. | <Pass/Fail> | <paths> |
| Existing target docs were inventoried before replacement or deletion. | <Pass/Fail> | <paths> |
| Current rules, future proposals, AI rules, and decisions are physically separated. | <Pass/Fail> | <paths> |
| Repository evidence is under `docs/dev/repository/`, not same-named `profile/<folder>` folders. | <Pass/Fail> | <paths> |
| `docs/dev/application/` was not created without a decision record. | <Pass/Fail> | <paths> |

## Completion Decision

- Verdict: <Pass / Pass With Follow-Up / Fail>
- Remaining gaps: <open questions or follow-up docs>
- Reviewer: <name or role>
- Date: <YYYY-MM-DD>
