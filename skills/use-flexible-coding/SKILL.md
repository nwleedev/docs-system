---
name: use-flexible-coding
description: Investigate technical requests through project evidence, computer science principles, implementation patterns, and module or system architecture. Explain concrete code and file changes, alternatives, risks, and implementation readiness; this skill alone does not authorize implementation.
---

# Use Flexible Coding

Understand the outcome the user wants, investigate what the current task needs, and explain how to implement it with project-specific evidence and examples. Do not wait for a separate request for missing information, code structure, or the next step. Research and advice are the default; changes to source code, tests, configuration, or tooling require an explicit implementation or development instruction.

## Establish the task and destination

Identify the intended outcome, actual use conditions, stated constraints, applicable repository instructions, and any user-designated record. A project name or comparison suggests questions, not an approved feature set. Carry forward established intent and answers. Read `docs/dev/README.md` when it exists and the guidance applicable to the task. Do not require its creation, another skill, a plan, or a fixed documentation structure.

If no file is designated, propose suitable candidates with reasons without creating or editing files. If the designated file is absent or unwritable, pause recording and offer a draft and candidates in the conversation. Neither situation stops authorized reading and research or prevents giving the technical assessment in the conversation.

Write technical decisions only in the designated file, following its purpose and organization. A designated record does not authorize changes to other files. Do not create skill-specific records or research files. When collected material needs storage, inspect repository rules first rather than defaulting to temporary files; the designated-file condition still applies.

When designated requirements, plans, or reference documents are involved, connect the findings according to each file's purpose: intended behavior and constraints in requirements, applicable work and verification in plans, and principles, sources, and application conditions in references. Do not promote unapproved technical proposals into requirements or duplicate the same explanation across files; link existing explanations where appropriate. If only one file is designated, adapt to that file without creating the others.

## Start and resume

At the start, on resumption, and before each next work unit, reread the necessary parts of the designated record to recover the purpose, preserved requirements and their evidence, compared alternatives, decision reasons, assumptions, applicable examples, and unresolved questions. Check whether new evidence changes those assumptions before carrying a decision forward. Do not depend on detecting context compaction. If no record is designated, follow the proposal procedure instead of creating a recovery file.

## Research each task

Derive technical questions from the intended use, required behavior, and constraints, including before code exists. Where there is an implementation, trace input through callers, processing, stored or returned values, and failure handling. Locate the relevant files, functions, types, versions, and runtime conditions; explain their selection and what remains unread or unverified. Distinguish proposed structures from observed implementation. Existing code is evidence of current behavior, not a recommendation or proof that every relevant file was found.

Use that trace and plausible failures to investigate the facts and update rules, repeated work, concurrency, access, and resource use that can affect the decision. Establish which requirements must be preserved from documents, tests, and caller expectations. Separate these obligations from observed processing order, storage format, or transport; preserving behavior need not preserve its implementation. Investigate answerable facts first. Ask for missing preferences or behavior-changing choices with consequences and a supported recommendation, rather than delegating routine technical choices to the user.

Tests that only mirror implementation do not establish an obligation to keep that implementation. Where required behavior or compatibility is uncertain, identify the missing evidence and continue independent research without treating uncertainty as permission to change it.

Research the computer science principles, code design patterns, module responsibilities and dependencies, and system architecture needed to answer those questions. Use applicable official documentation, specifications, original research, and actual source or failure evidence. Select sources for the claim being investigated and check their assumptions against this project's versions and conditions. These are possible levels of investigation, not a syllabus to complete for every issue.

Investigate mechanisms, not just definitions, usage instructions, or generic advantages. Explain how the relevant operation or interaction causes or prevents the problem, what must hold for that explanation to apply, and what observation could support or contradict it. Follow processing steps, data representation, dependencies, and resource costs far enough to explain the decision. Connect a local pattern to wider module or system effects when those effects matter; do not infer them merely from a pattern's name. Use a project-specific example to make the causal explanation inspectable, and identify assumptions when evidence is missing.

Investigate local improvements alongside alternatives that change the processing method causing the problem, without waiting for local changes to fail. Explain what repeated work, storage or query method, processing order, or communication changes, how required behavior survives, and how suitability can be checked. Compare material costs such as time, memory, disk reads, storage, maintenance, and migration risk. Change size alone cannot justify the current method; neither require a redesign nor fill an alternatives quota. Separate observations, estimates with stated assumptions, and unmeasured effects. Do not invent workloads, targets, or improvements; this skill alone does not authorize measurements.

Deepen a question while an unresolved fact could change the explanation, rank the alternatives differently, or change the next action. Name that fact and its consequence. Conclude when the evidence supports a decision or establishes the specific uncertainty preventing one; honor requested research limits. More sources, topics, or prose do not establish depth. Do not stop at a technology recommendation when its mechanism and applicability remain unexplained.

## Explain principles and decision history

Explain the problem a principle solves, why it is relevant to this project, and why the proposed or chosen approach fits better than the alternatives. Include the principle's original problem and background as needed to understand that judgment, rather than adding an unrelated history lesson. Keep that background separate from the project's adoption history: use existing documents, issues, and version history to establish previous approaches, constraints, and reasons for change. If the history is unavailable, say so; do not invent past reasons or approvals or present a new proposal as an established decision.

## Explain changes and examples

Connect each required behavior to the work needed to make it operate, including the input, result, preservation, and failure handling applicable to that use. Users need not name every internal component. Explain the existing and proposed files, functions, and types to change or retain, their responsibilities, and why the changes are necessary; a directory tree alone is not an architecture explanation. Justify cases where no code or tests need adding. Explaining necessary processing neither approves an additional capability nor authorizes implementation.

For implementation advice, include the processing order and a compact code example showing how and why, without waiting for a follow-up asking how to write it. For module decisions, show concrete file and folder responsibilities and dependencies; for systems, explain communication and data flow. Use project-specific examples in the conversation or designated record, combining them when needed. Explain dependencies between stored facts, queries, processing steps, time, or memory when they clarify the decision. Do not invent unrelated objects, fixtures, scripts, or a new application to illustrate it.

Compare examples with the selected project evidence and official documentation. For code examples, match the project's versions, types, call relationships, and rules. Do not require creating source or test files or running checks just to validate examples. Distinguish evidence comparison from execution and identify unexecuted code accordingly.

Use visualization only when it makes the subject easier to understand. Do not substitute meaningless elements and connections for an explanation. Select tools according to their availability and intended purpose. Do not use Markdown tables, ASCII diagrams, or other visual representations that are hard to understand at a glance in a code editor.

For tests, explain what behavior to test, why testing is needed, and which kind of test fits. Research how to write the chosen test and include a project-specific example whose assertions observe the stated behavior. Do not replace the behavior under test with a fake and then test only the fake. If tests are unnecessary, record why and omit unnecessary test examples.

## Handle uncertainty

When excluding an alternative, identify the confirmed constraint it violates and cite the evidence. Separate that constraint from assumptions needing investigation; a possible incompatibility is not proof of impossibility. Explain what must be checked and how it could change the comparison rather than rejecting an alternative on an unverified assumption.

Keep confirmed evidence, proposals, and unverified claims distinct. When repository rules and research conflict, pause the affected judgment, explain the difference and the choices needed in the conversation, and continue only unaffected reading and research. Do not treat a conversation draft as a saved record or an unresolved choice as an implementation decision.

When new evidence appears, identify whether it concerns a defect, unclear intent, a technical constraint, or a proposed capability, then assess affected work and assumptions. Explain which agreed outcome would fail without any proposed requirement addition, considering alternative ways to meet it. Do not discard necessary processing as optional or promote every risk into a feature. Reassess feasibility, remaining effort, dependencies, and overall completion expectations even when requirements are unchanged. Follow the project's change procedure when present; otherwise explain the impact and next action in the conversation or authorized record. Preserve unaffected completion evidence. Resolve changes to requested outcomes or constraints with the user instead of silently weakening them to keep an earlier estimate.

## Return an actionable assessment

In the first substantive answer after investigation, connect the intended outcome to the findings, causal explanation, alternatives, concrete changes and reasons, and observable checks. State whether implementation can start, only named independent work can start, or an unanswered question blocks it. Explain prerequisites through what dependent work cannot do or establish without them; distinguish task-start needs from final acceptance criteria. Base readiness on choices, feasibility evidence, and checks rather than document existence. For each material risk, explain its trigger, affected behavior, evidence or assumption, mitigation or investigation, and effect on the work. Use stated deadlines and resource limits when assessing completion; do not invent dates or claim every risk was found.

Name the next action and any choice still needed; distinguish readiness from permission to modify files. Separate proposed checks, source inspection, simulated responses, and observed behavior. Explain what remains between a completed component and the overall outcome. If evidence is insufficient, identify the missing fact or integration instead of inventing code or claiming certainty. Keep the answer proportional, with no mandatory headings, counts, or unrelated investigation for a mechanical edit. When requirements suffice, explain why rather than manufacturing additions.
