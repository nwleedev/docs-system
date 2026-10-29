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

## Start and resume

At the start, on resumption, and before each next work unit, reread the necessary parts of the designated record to recover the purpose, change decisions, and applicable examples. Do not depend on detecting context compaction. If no record is designated, follow the proposal procedure instead of creating a recovery file.

## Research each task

Establish the purpose, change target, and technology versions for each task. Proactively derive questions from the meaning and update rules of stored facts, external inputs and access permissions, repeated work, concurrency, and CPU, memory, storage, or network use. Use relevant project evidence and possible failures to select questions even when the user has not named a technical topic. These are prompts for investigation, not a checklist to fill for every task.

Investigate the relevant computer science principles, implementation patterns, module architecture (file and folder organization and dependencies), and system architecture together. Database normalization and query optimization, database and web security, HTTP caching, algorithms and data structures, UI performance, and backend load handling are examples, not an exhaustive or mandatory list. Cover the patterns and anti-patterns that address the selected questions; explain their purpose and conditions rather than filling in names.

Select project files by their relevance to the task and target, versions and runtime conditions, types and call relationships, and behavior to preserve or test. For module and system questions, use relevant code and configuration to establish responsibilities, dependencies, and runtime interactions. Explain those responsibilities and relationships using that evidence, and state why the files were selected and what remains unverified; do not claim to have found every file. Compare the selected evidence with current official guidance for the applicable versions and original research when needed. Existing code establishes project conditions, not a recommendation to copy its structure.

Research how each relevant principle works, its assumptions, and alternatives. Compare the factors that matter to the decision, such as execution time, memory use, disk reads, storage space, and code that must be maintained. State how the conclusion can be checked. Distinguish observed behavior, estimates with stated assumptions, and effects not yet measured; if evidence is missing, explain what is needed instead of inventing workloads, targets, or improvements. The skill alone does not authorize running measurements.

## Explain changes and examples

State which code to add, remove, merge, split, or modify and why. Explicitly justify cases where no code or tests need adding. Describing a change does not authorize performing it.

When recording technical decisions, choose project-specific examples for the decision: code showing how and why for implementation, file and folder organization with dependencies for modules, and communication and data flow for systems. Combine examples when needed rather than inventing unrelated objects, fixtures, or scripts. Compare examples with the selected project evidence and official documentation. For code examples, match the project's versions, types, call relationships, and rules. Do not require creating source or test files or running checks just to validate examples. Distinguish evidence comparison from execution and identify unexecuted code accordingly.

Use visualization only when it makes the subject easier to understand. Do not substitute meaningless elements and connections for an explanation. Select tools according to their availability and intended purpose. Do not use Markdown tables, ASCII diagrams, or other visual representations that are hard to understand at a glance in a code editor.

For tests, explain what behavior to test, why testing is needed, and which kind of test fits. Research how to write the chosen test and include a project-specific example whose assertions observe the stated behavior. Do not replace the behavior under test with a fake and then test only the fake. If tests are unnecessary, record why and omit unnecessary test examples.

## Handle uncertainty

Keep confirmed evidence, proposals, and unverified claims distinct. When repository rules and research conflict, pause the affected judgment, explain the difference and the choices needed in the conversation, and continue only unaffected reading and research. Do not treat a conversation draft as a saved record or an unresolved choice as an implementation decision.
