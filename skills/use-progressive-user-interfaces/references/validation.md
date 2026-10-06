# Validate running UI and finalize scoped rules

Check the latest running screen's goal completion, consistency, completeness, and distinctiveness. Finalize only inspected rules within confirmed scope.

## Establish the evidence and scope

Use the scenario, preserved functionality, direction, rules, proposals, exceptions, and targets from current implementation input. For missing inspection conditions read [validation conditions](implementation.md#define-validation-conditions).

Confirm that the running UI or supplied screen evidence reflects the evaluated changes. If unclear, request current evidence or defer the affected check. Follow [screen checks](#inspect-four-aspects-of-the-screen) and [differences and reuse](#resolve-differences-and-validate-reuse) before finalizing rules.

## Inspect four aspects of the screen

### Goal completion and action sequence

Follow the representative scenario to its outcome. Check main-action discoverability, timely information, status and next-step feedback, repeated actions, and risky-action confirmation or recovery. Verify transitions by interaction or demonstrated evidence; record observed difficulties and conditions. Visual inspection alone proves neither complete behavioral correctness nor measured usability improvement.

### Visual consistency

Compare regions and relevant states against typography, spacing, alignment, density, surfaces, action emphasis, and component treatment. Differences need scenario or state-based reasons. Default library styling is allowed; inconsistency with the chosen direction is the defect.

### Completeness

Inspect whole composition, readable domain content, actual volume, long text, affected states, and relevant sizes, themes, and languages. Record clipping, absent states, placeholders, unexplained spacing, and unfinished regions against their conditions. Do not infer responsive behavior from one viewport.

For keyboard operation, semantic accessibility, or compliance claims, obtain interaction or applicable independent checks; visual inspection alone is insufficient.

### Distinctiveness

Explain structure, hierarchy, and emphasis through the thesis and domain constraints. Identify distinguishing choices beyond decoration and their evidence. Lists, cards, and sidebars are valid when justified by the scenario. This judgment proves neither uniqueness across all services nor measured usability improvement.

## Resolve differences and validate reuse

Present current visuals with preserved characteristics, differences, and unverified conditions. Obtain scoped visual judgment where direction or preference needs confirmation through [comparison](decisions.md#request-and-interpret-a-choice).

- Missing required characteristic: return the defect, target, and conditions to implementation input; reinspect the corrected current screen.
- Thesis cannot explain structure or scenario: revisit the affected basis and only its unresolved evidence question.
- Conflict with an existing rule: use [conflict handling](decisions.md#decide-whether-a-question-is-necessary).
- Missing state, screen, or interaction: separate verified and unverified parts and request evidence.

Use existing rules and screens when they resolve differences. Before finalizing a shared rule, inspect another existing applicable target. Without it, retain target-specific scope; unresolved reuse differences keep shared validation incomplete.

Return rules with current evidence, confirmed judgment, inspected targets and states, reasons, exceptions, and remaining differences. Finalized guidance contains only validated rules and conditions; proposals, estimates, unresolved choices, and reuse differences remain separate. Express rules as needed: principles, common characteristics, scenario-specific rules, or tokens. Reinspect affected applications when a rule changes.

## Distinguish screen validation from initial system completion

Read this section only for a design-system completion assessment. One screen is insufficient: current primary screens must express an explainable consistent direction, recurring and scenario-specific rules must cover them, implementation conditions and avoided characteristics must be specified, and new screens must reuse the direction without restarting every decision.

Report validated screens and remaining system conditions separately when evidence is missing.
