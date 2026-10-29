---
name: use-flexible-coding
description: Research task-specific coding decisions, patterns and anti-patterns, and project-specific code and test examples. Use when a request needs technical choices and their reasons explained or recorded; this skill alone does not authorize implementation.
---

# Use Flexible Coding

Explain coding decisions and project-specific examples for the requested work. Research and examples are the default; changes to source code, tests, configuration, or tooling require an explicit implementation or development instruction.

## Establish the task and destination

Before editing, identify the requested work, applicable repository instructions, and the file designated by the user. Do not assume a plan, a sequence of steps, or a fixed documentation directory exists.

If no file is designated, find suitable candidates from repository rules and the current work, explain the selection, and propose them without creating or editing files. If the designated file is absent or unwritable, pause recording and offer a draft and candidates in the conversation.

Write technical decisions only in the designated file, following its purpose and organization. A designated record does not authorize changes to other files. Do not create skill-specific records or research files. When collected material needs storage, inspect repository rules first rather than defaulting to temporary files; the designated-file condition still applies.

## Start and resume

At the start, on resumption, and before each next work unit, reread the necessary parts of the designated record to recover the purpose, change decisions, and applicable examples. Do not depend on detecting context compaction. If no record is designated, follow the proposal procedure instead of creating a recovery file.

## Research each task

Establish the purpose, change target, and technology versions for each task, then investigate the failures and consequences that justify further research. Cover the patterns and anti-patterns needed to address those problems; explain the purpose and conditions of an approach rather than filling in pattern names or a uniform checklist.

Select project files by their relevance to the task and target, versions and runtime conditions, types and call relationships, and behavior to preserve or test. Explain the selection and any gaps; do not claim to have found every file. Compare the selected evidence with current official guidance for the applicable versions. Existing code establishes project conditions, not a recommendation to copy its structure.

## Explain changes and examples

State which code to add, remove, merge, split, or modify and why. Explicitly justify cases where no code or tests need adding. Describing a change does not authorize performing it.

When recording technical decisions, include project-specific code examples showing how to write the code and why. Match the project's versions, types, call relationships, and rules rather than inventing unrelated objects, fixtures, or scripts. Compare examples with the selected project evidence and official documentation; do not require creating source or test files or running checks just to validate examples. Distinguish that comparison from execution and label unexecuted examples accordingly.

For tests, explain what behavior to test, why testing is needed, and which kind of test fits. Research how to write the chosen test and include a project-specific example whose assertions observe the stated behavior. Do not replace the behavior under test with a fake and then test only the fake. If tests are unnecessary, record why and omit unnecessary test examples.

## Handle uncertainty

Keep confirmed evidence, proposals, and unverified claims distinct. When repository rules and research conflict, pause the affected judgment, explain the difference and the choices needed in the conversation, and continue only unaffected reading and research. Do not treat a conversation draft as a saved record or an unresolved choice as an implementation decision.
