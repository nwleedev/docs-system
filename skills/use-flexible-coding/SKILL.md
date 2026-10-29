---
name: use-flexible-coding
description: Research project-specific computer science principles, implementation patterns, module architecture including file and folder organization, and system architecture. Use when technical choices need investigation, reasons, and project-specific examples explained or recorded; this skill alone does not authorize implementation.
---

# Use Flexible Coding

Research the principles needed for the requested work and explain technical decisions with project-specific examples. Research and examples are the default; changes to source code, tests, configuration, or tooling require an explicit implementation or development instruction.

## Establish the task and destination

Before editing, identify the requested work, applicable repository instructions, and the file designated by the user. Do not assume a plan, a sequence of steps, or a fixed documentation directory exists.

If no file is designated, find suitable candidates from repository rules and the current work, explain the selection, and propose them without creating or editing files. If the designated file is absent or unwritable, pause recording and offer a draft and candidates in the conversation.

Write technical decisions only in the designated file, following its purpose and organization. A designated record does not authorize changes to other files. Do not create skill-specific records or research files. When collected material needs storage, inspect repository rules first rather than defaulting to temporary files; the designated-file condition still applies.

When designated requirements, plans, or reference documents are involved, connect the findings according to each file's purpose: intended behavior and constraints in requirements, applicable work and verification in plans, and principles, sources, and application conditions in references. Do not promote unapproved technical proposals into requirements or duplicate the same explanation across files; link existing explanations where appropriate. If only one file is designated, adapt to that file without creating the others.

## Start and resume

At the start, on resumption, and before each next work unit, reread the necessary parts of the designated record to recover the purpose, decision reasons, assumptions, applicable examples, and unresolved questions. Do not depend on detecting context compaction. If no record is designated, follow the proposal procedure instead of creating a recovery file.

## Research each task

Establish the purpose, change target, and technology versions for each task. Proactively derive questions from the meaning and update rules of stored facts, external inputs and access permissions, repeated work, concurrency, and CPU, memory, storage, or network use. Use relevant project evidence and possible failures to select questions even when the user has not named a technical topic. These are prompts for investigation, not a checklist to fill for every task.

Investigate the relevant computer science principles, implementation patterns, module architecture (file and folder organization and dependencies), and system architecture together. Database normalization and query optimization, database and web security, HTTP caching, algorithms and data structures, UI performance, and backend load handling are examples, not an exhaustive or mandatory list. Cover the patterns and anti-patterns that address the selected questions; explain their purpose and conditions rather than filling in names.

Select project files by their relevance to the task and target, versions and runtime conditions, types and call relationships, and behavior to preserve or test. For module and system questions, use relevant code and configuration to establish responsibilities, dependencies, and runtime interactions. Explain those responsibilities and relationships using that evidence, and state why the files were selected and what remains unverified; do not claim to have found every file. Compare the selected evidence with current official guidance for the applicable versions and original research when needed. Existing code establishes project conditions, not a recommendation to copy its structure.

Establish which requirements and functional specifications must be preserved and cite their evidence in requirements, tests, and caller expectations. Separate these obligations from observed implementation choices such as processing order, storage format, and transport. Preserving required behavior does not necessarily require preserving its implementation; existing code or tests that mirror it do not establish that obligation. Where the evidence is insufficient, identify what is observed and what still needs confirmation before adopting an alternative. Continue applicable research without treating uncertainty as permission to change required behavior or compatibility.

Actively investigate both local improvements and alternatives that change the processing method causing the problem; do not defer the latter until local changes fail. Use the relevant principles and architecture to explain which repeated work, storage and query approach, processing order, or communication changes, how each alternative preserves the required behavior, and how its suitability can be checked. Research each principle's operation and assumptions. Compare the factors that matter, such as execution time, memory use, disk reads, storage space, maintenance, and migration risks. Change size can inform that comparison but cannot by itself justify favoring the current method; neither require a redesign nor fill a quota of alternatives. Distinguish observed behavior, estimates with stated assumptions, and effects not yet measured; if evidence is missing, explain what is needed instead of inventing workloads, targets, or improvements. The skill alone does not authorize running measurements.

## Explain principles and decision history

Explain the problem a principle solves, why it is relevant to this project, and why the proposed or chosen approach fits better than the alternatives. Include the principle's original problem and background as needed to understand that judgment, rather than adding an unrelated history lesson. Keep that background separate from the project's adoption history: use existing documents, issues, and version history to establish previous approaches, constraints, and reasons for change. If the history is unavailable, say so; do not invent past reasons or approvals or present a new proposal as an established decision.

## Explain changes and examples

State which code to add, remove, merge, split, or modify and why. Explicitly justify cases where no code or tests need adding. Describing a change does not authorize performing it.

When recording technical decisions, choose project-specific examples for the decision: code showing how and why for implementation, file and folder organization with dependencies for modules, and communication and data flow for systems. Explain dependencies between stored facts, queries, processing steps, or execution time and memory comparisons when they make the principle and its application clearer. Combine examples when needed rather than inventing unrelated objects, fixtures, or scripts.

Compare examples with the selected project evidence and official documentation. For code examples, match the project's versions, types, call relationships, and rules. Do not require creating source or test files or running checks just to validate examples. Distinguish evidence comparison from execution and identify unexecuted code accordingly.

Use visualization only when it makes the subject easier to understand. Do not substitute meaningless elements and connections for an explanation. Select tools according to their availability and intended purpose. Do not use Markdown tables, ASCII diagrams, or other visual representations that are hard to understand at a glance in a code editor.

For tests, explain what behavior to test, why testing is needed, and which kind of test fits. Research how to write the chosen test and include a project-specific example whose assertions observe the stated behavior. Do not replace the behavior under test with a fake and then test only the fake. If tests are unnecessary, record why and omit unnecessary test examples.

## Handle uncertainty

When excluding an alternative, identify the confirmed constraint it violates and cite the evidence. Separate that constraint from assumptions needing investigation; a possible incompatibility is not proof of impossibility. Explain what must be checked and how it could change the comparison rather than rejecting an alternative on an unverified assumption.

Keep confirmed evidence, proposals, and unverified claims distinct. When repository rules and research conflict, pause the affected judgment, explain the difference and the choices needed in the conversation, and continue only unaffected reading and research. Do not treat a conversation draft as a saved record or an unresolved choice as an implementation decision.
