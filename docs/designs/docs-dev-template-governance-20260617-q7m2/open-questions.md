# Open Questions

## Metadata

- Status: draft
- Last Updated: 2026-06-17
- Scope: unresolved choices to confirm before implementing `docs/dev/README.md` and `docs/dev/_templates/**`

## Summary

These questions should be answered before or during the first implementation pass. If implementation must proceed without a separate answer, use the recommended default and record that choice in the implementation notes or a new decision record.

## OQ1. Global Display Phrase For `concern`

**Question:** Which English display phrase should future `docs/dev` docs use for `concern` so the templates remain usable by global teams?

| Option | Description | Trade-Off |
| --- | --- | --- |
| A. `concern` | Keeps the architecture-documentation term and is concise. | It can be confused with user-facing features, UI surfaces, or broad product areas unless defined first. |
| B. `development guidance target` | Makes the intended meaning explicit: a development decision point that may need guidance. | It is longer, so templates should define it once and may use `concern` as the short label afterward. |
| C. `guidance target` | Shorter than `development guidance target` and fits template language. | It is still abstract without a clear first definition. |

**Recommended default:** Use `development guidance target` as the global English display phrase and optionally write `concern` in parentheses on first use.

**Implementation note:** Define the term before any inventory, sampling, or classification instructions.

## OQ2. Default Public Repository Sample Count

**Question:** How many public repositories should be sampled when only a technology stack is known?

| Option | Description | Trade-Off |
| --- | --- | --- |
| A. At least 3 repositories | Lower research cost and faster first pass. | May be too small to separate common, divergent, and repository-specific concerns. |
| B. At least 5 repositories | Better basis for grouping common, divergent, and repository-specific concerns. | Higher research cost. |
| C. Variable count by ecosystem size | Adapts to large and small technology ecosystems. | Requires more judgment from the implementer. |

**Recommended default:** Require at least five repositories, with a documented reduction to at least three only when the ecosystem is small, search quality is poor, or time constraints are explicitly recorded.

**Implementation note:** The count is a discovery baseline, not a proof threshold. Local applicability still requires target repository evidence.

## OQ3. Official Fallback Evidence Scope When `gh` Is Unavailable

**Question:** Which non-`gh` evidence paths should be treated as official fallback paths?

| Option | Description | Trade-Off |
| --- | --- | --- |
| A. GitHub Web UI only | Easy to reproduce manually. | Harder to capture structured metadata and repeated queries. |
| B. GitHub Web UI, REST API, and GitHub MCP or connector | Works across browser, API, and installed connector environments. | Requires strict evidence recording fields to keep outputs comparable. |
| C. Include temporary archive or clone inspection | Allows precise file tree and code inspection when APIs or UI are insufficient. | Risks weakening the no-clone/no-vendor guardrail unless separately controlled. |

**Recommended default:** Use option B as the normal fallback scope. Allow option C only after a separate decision record or implementation note explains the temporary location, cleanup, and no-vendor boundary.

**Implementation note:** Every fallback record must include tool or interface, source URLs, query or navigation steps, inspected files or pages, retrieval date, evidence summary, limitations, and confidence impact.

## OQ4. Ownership Of `Recommended Future Pattern`

**Question:** Where should `Recommended Future Pattern` records primarily live?

| Option | Description | Trade-Off |
| --- | --- | --- |
| A. Record primarily in `repository` templates | Keeps evidence, confidence, and applicability together. | The guidance may be distant from the topical folder that owns future rules. |
| B. Record directly in topical owner folders | Keeps guidance near architecture, engineering, domain, evolution, AI, or decisions context. | Evidence can become duplicated or scattered. |
| C. Split evidence and interpretation | Store evidence, classification, and applicability in `repository`; store interpretation and application direction in the topical owner folder. | Requires link discipline between templates. |

**Recommended default:** Use option C. `repository` owns evidence and classification; the topical folder owns interpretation, application guidance, and eventual promotion to current rules.

**Implementation note:** Current rules should still require target repository evidence and cross-validation.

## OQ5. Placement Of Named Stack Examples

**Question:** Should future templates include named stack examples?

| Option | Description | Trade-Off |
| --- | --- | --- |
| A. No named stack examples | Strongest stack-neutrality. | Harder for new users to understand the expected granularity. |
| B. Short optional examples inside templates | Helps users understand the expected shape quickly. | Named stacks can accidentally look like defaults. |
| C. Longer examples in appendix, example, or research sections | Keeps core templates neutral while preserving concrete examples. | Readers may need to follow links for examples. |

**Recommended default:** Keep core templates minimal and stack-neutral. Use short optional examples only when necessary, and place longer named-stack examples in separate example or research sections.

**Implementation note:** Named technologies must never be required for the template system to work.
