---
name: use-flexible-coding
description: Investigate technical requests through project evidence, computer science principles, implementation patterns, and module or system architecture. Explain concrete code and file changes, alternatives, risks, and implementation readiness; this skill alone does not authorize implementation.
---

# Use Flexible Coding

Understand the outcome the user wants, investigate what the current task needs, and explain how to implement it with project-specific evidence and examples. Do not wait for a separate request for missing information, code structure, or the next step. Research and advice are the default; changes to source code, tests, configuration, or tooling require an explicit implementation or development instruction.

## Establish the task and destination

Identify the intended outcome, stated constraints, applicable repository instructions, and any user-designated record. Carry forward intent and answers already established in the conversation. Read `docs/dev/README.md` when it exists and the guidance applicable to the task. Do not require its creation, another skill, a plan, or a fixed documentation structure.

If no file is designated, propose suitable candidates with reasons without creating or editing files. If the designated file is absent or unwritable, pause recording and offer a draft and candidates in the conversation. Neither situation stops authorized reading and research or prevents giving the technical assessment in the conversation.

Write technical decisions only in the designated file, following its purpose and organization. A designated record does not authorize changes to other files. Do not create skill-specific records or research files. When collected material needs storage, inspect repository rules first rather than defaulting to temporary files; the designated-file condition still applies.

When designated requirements, plans, or reference documents are involved, connect the findings according to each file's purpose: intended behavior and constraints in requirements, applicable work and verification in plans, and principles, sources, and application conditions in references. Do not promote unapproved technical proposals into requirements or duplicate the same explanation across files; link existing explanations where appropriate. If only one file is designated, adapt to that file without creating the others.

## Start and resume

At the start, on resumption, and before each next work unit, reread the necessary parts of the designated record to recover the purpose, preserved requirements and their evidence, compared alternatives, decision reasons, assumptions, applicable examples, and unresolved questions. Do not depend on detecting context compaction. If no record is designated, follow the proposal procedure instead of creating a recovery file.

## Research each task

Trace the relevant work from input through callers and processing to stored or returned values and failure handling. Locate the actual files, functions, types, technology versions, and runtime conditions. Select files for their connection to the request, preserved behavior, or an example's integration; explain that selection and what remains unread or unverified. Do not claim to have found every file or treat existing code as a recommended pattern.

Use that trace and plausible failures to derive questions about stored facts and their update rules, external inputs and access, repeated work, concurrency, and CPU, memory, storage, or network use. Investigate answerable facts before asking the user. Ask for choices that would change required behavior or the implementation, with their consequences and a supported recommendation. Explain why each missing condition matters to the current outcome; do not promote implementation choices, risks, or future capabilities into new requirements.

Research the computer science principles, implementation patterns, module architecture (file and folder responsibilities and dependencies), and system architecture needed to answer those questions. Use current official guidance for the applicable versions and original research when needed. Connect each principle or pattern to the failure it prevents, its operation and assumptions, and observable evidence that could confirm its suitability. Normalization, query optimization, security, caching, algorithms, UI performance, and backend load are possible topics, not a required syllabus. Investigate what affects the task, not every theoretical anti-pattern.

Establish which requirements and functional specifications must be preserved and cite their evidence in requirements, tests, and caller expectations. Separate these obligations from observed implementation choices such as processing order, storage format, and transport. Preserving required behavior does not necessarily require preserving its implementation; existing code or tests that mirror it do not establish that obligation. Where the evidence is insufficient, identify what is observed and what still needs confirmation before adopting an alternative. Continue applicable research without treating uncertainty as permission to change required behavior or compatibility.

Investigate local improvements alongside alternatives that change the processing method causing the problem, without waiting for local changes to fail. Explain what repeated work, storage or query method, processing order, or communication changes, how required behavior survives, and how suitability can be checked. Compare material costs such as time, memory, disk reads, storage, maintenance, and migration risk. Change size alone cannot justify the current method; neither require a redesign nor fill an alternatives quota. Separate observations, estimates with stated assumptions, and unmeasured effects. Do not invent workloads, targets, or improvements; this skill alone does not authorize measurements.

## Explain principles and decision history

Explain the problem a principle solves, why it is relevant to this project, and why the proposed or chosen approach fits better than the alternatives. Include the principle's original problem and background as needed to understand that judgment, rather than adding an unrelated history lesson. Keep that background separate from the project's adoption history: use existing documents, issues, and version history to establish previous approaches, constraints, and reasons for change. If the history is unavailable, say so; do not invent past reasons or approvals or present a new proposal as an established decision.

## Explain changes and examples

Name the existing and proposed files, functions, and types to add, remove, merge, split, modify, or retain, with their responsibilities and dependencies. Explain why a file or folder should exist rather than merely listing a directory tree or imposing layers. Justify cases where no code or tests need adding. Describing a change does not authorize performing it.

For implementation advice, include the processing order and a compact code example showing how and why, without waiting for a follow-up asking how to write it. For module decisions, show concrete file and folder responsibilities and dependencies; for systems, explain communication and data flow. Use project-specific examples in the conversation or designated record, combining them when needed. Explain dependencies between stored facts, queries, processing steps, time, or memory when they clarify the decision. Do not invent unrelated objects, fixtures, scripts, or a new application to illustrate it.

Compare examples with the selected project evidence and official documentation. For code examples, match the project's versions, types, call relationships, and rules. Do not require creating source or test files or running checks just to validate examples. Distinguish evidence comparison from execution and identify unexecuted code accordingly.

Use visualization only when it makes the subject easier to understand. Do not substitute meaningless elements and connections for an explanation. Select tools according to their availability and intended purpose. Do not use Markdown tables, ASCII diagrams, or other visual representations that are hard to understand at a glance in a code editor.

For tests, explain what behavior to test, why testing is needed, and which kind of test fits. Research how to write the chosen test and include a project-specific example whose assertions observe the stated behavior. Do not replace the behavior under test with a fake and then test only the fake. If tests are unnecessary, record why and omit unnecessary test examples.

## Handle uncertainty

When excluding an alternative, identify the confirmed constraint it violates and cite the evidence. Separate that constraint from assumptions needing investigation; a possible incompatibility is not proof of impossibility. Explain what must be checked and how it could change the comparison rather than rejecting an alternative on an unverified assumption.

Keep confirmed evidence, proposals, and unverified claims distinct. When repository rules and research conflict, pause the affected judgment, explain the difference and the choices needed in the conversation, and continue only unaffected reading and research. Do not treat a conversation draft as a saved record or an unresolved choice as an implementation decision.

## Return an actionable assessment

In the first substantive answer after investigation, connect the intended outcome to the findings, concrete changes, reasons, and observable checks. State whether implementation can start, only named independent work can start, or an unanswered question blocks it. Base that judgment on required choices, technical feasibility evidence, and a way to check the result, not on document existence. For each material risk, explain its trigger, affected behavior, evidence or assumption, mitigation or investigation, and effect on starting work. Do not imply every risk has been found.

Name the next action and any choice still needed; distinguish technical readiness from permission to modify files. If evidence is insufficient, identify the missing fact or integration instead of inventing code or claiming certainty. Keep the answer proportional to the request, with no mandatory headings, counts, or investigation of unrelated topics for a mechanical edit. When the current requirements are sufficient, explain why rather than manufacturing additions.
