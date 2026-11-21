---
name: alakazam
description: Create skills, review an existing SKILL.md, or reorganize skill instructions while preserving their meaning and style. This skill can also help set up a subagent to work on a specific skill.
---

## Create a skill

- Use the requested name as given. If the user provides only a description, choose a name that identifies the skill’s main function. Names must be 1–64 characters long and use lowercase ASCII letters, digits, or hyphens. Hyphens cannot be consecutive or appear at either end. If a requested name is invalid, suggest alternatives.
- Describe what the skill does and when to use it. If the name makes its purpose clear, write the description. If the purpose is unclear, clarify it before creating the skill.
- Run the Node.js script from the directory containing this file. If an output directory is specified, pass it with `--output-dir`. For a repository-specific skill, specify that repository’s `.agents/skills` directory.
- When using this skill to write another skill, keep tables out of the resulting instructions.

```sh
node scripts/create.mjs --name code-review --description 'Review written code.'
```

The generated `SKILL.md` contains only the `name` and `description` fields. The script creates empty `scripts/`, `references/`, and `assets/` directories. Check the output for the location of the generated file or the reason creation failed.

## Review instructions

- Read the supplied instructions or the specified `SKILL.md`. Identify what the skill is intended to accomplish, how it applies, where rules conflict, and which conditions are missing.
- Identify structural problems and suggest a structure that fits the content. For each proposed addition, explain when the instruction would be needed and suggest wording. State the action directly without referring to a person or role.
- For a review or a request for suggestions, return the findings only. Edit the skill only when the user explicitly requests changes.

## Rewrite instructions

- When asked to reorganize instructions, identify how the rules relate. Present dependent actions in sequence. If behavior depends on the input or type of request, explain what to do in each case. Make clear where shared rules and individual exceptions apply.
- Use the supplied content. If a rule appears to be missing, propose it separately.
- You may add headings or split or combine sentences and lists to fit the structure. Preserve the original terminology, tone, and sentence endings where possible, and refine wording where the context requires it. Preserve existing metadata, commands, file paths, and quotations.
- Preserve scope, conditions, exceptions, and priority. Make clear what is required, recommended, permitted, or prohibited and when each instruction applies.
- Consolidate repeated instructions only when both meaning and scope match. If rules conflict, propose criteria for resolving the conflict separately.
- When asked to apply changes, edit only the specified files. When asked for a draft, return the rewritten text.
- Compare the original and rewritten instructions to verify that their meaning is intact. To avoid bias from the AI’s own interpretation, make this comparison without running the skill being rewritten.
