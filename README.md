# Docs System

[한국어](./README.ko.md)

`Docs System` researches instructions and documentation practices for teams that work with coding agents. It is not an application or a universal template. Select only rules supported by the target repository's code, configuration, documents, and approved decisions.

## Repository Files

- [`AGENTS.md`](./AGENTS.md) is this repository's working example. [`src/AGENTS.en.md`](./src/AGENTS.en.md) and [`src/AGENTS.ko.md`](./src/AGENTS.ko.md) are reference documents for other repositories.
- [`docs/designs/README.md`](./docs/designs/README.md) defines this repository's design-document rules. [`use-flexible-design`](./skills/use-flexible-design/SKILL.md) develops and supplements requirements, investigates missing information, and connects research, decisions, and plans under a repository's corresponding README.
- [`docs/dev/README.md`](./docs/dev/README.md) defines this repository's development-guidance rules. [`use-dev-guidance`](./skills/use-dev-guidance/SKILL.md) routes stack research, checks, dependency work, guidance, and implementation validation through a repository's corresponding README.
- [`use-flexible-coding`](./skills/use-flexible-coding/SKILL.md) researches the computer science principles, implementation patterns, module architecture including file and folder organization, and system architecture needed for a project. It explains application reasons, relevant background, and project decision history with examples suited to each decision. It records them in a user-designated file or proposes candidates when none is designated. It can be selected separately from the existing development-guidance skill.
- [`use-better-handoff`](./skills/use-better-handoff/SKILL.md) keeps continuity notes in a designated handoff file and supports reading it to understand a project. The default filename and location can be changed.
- [`use-better-terms`](./skills/use-better-terms/SKILL.md) improves text and names before storage or sharing by applying evidence-backed alternatives first and leaving unsupported meaning changes for human input.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md) is one stack-specific research prompt, not a default for another project.

The two language documents under `src/` are maintained independently. Compare the applicable sections before adopting either one.

## Adopt an AGENTS Reference

1. Inspect the target repository's code, configuration, tests, documents, and approved decisions.
2. Start from one language file under `src/` and copy only sections that govern work the repository performs.
3. Replace assumed tools, branch policies, commands, and technology rules with verified repository rules.
4. Save the result in an instruction location the agent loads, such as the repository's root `AGENTS.md` for Codex.

This repository does not generate or merge instruction files. Keep the adopted file short and link to maintained repository documents for detailed knowledge.

## Install or Remove a Skill

Copy the complete selected Skill directory, including its references and scripts, to a discovery location supported by the tool:

- Codex repository: `.agents/skills/<skill-name>/`
- Codex user: `$HOME/.agents/skills/<skill-name>/`
- Claude Code repository: `.claude/skills/<skill-name>/`
- Claude Code user: `$HOME/.claude/skills/<skill-name>/`
- Plugin: `<plugin-root>/skills/<skill-name>/`

Confirm current locations in the [Codex skills documentation](https://developers.openai.com/codex/skills) or [Claude Code skills documentation](https://code.claude.com/docs/en/skills). A directory under this repository's `skills/` is research material and is not discovered automatically.

Copy the matching invocation subsection from [`src/AGENTS.en.md`](./src/AGENTS.en.md) or [`src/AGENTS.ko.md`](./src/AGENTS.ko.md) into the instruction file loaded by the tool. The handoff and wording subsections use `BEGIN USE BETTER HANDOFF` / `END USE BETTER HANDOFF` and `BEGIN USE BETTER TERMS` / `END USE BETTER TERMS`. Use handoff placement before wording review when adopting both. The design and development subsections are titled for their respective responsibilities. For Claude Code, place the subsection in `CLAUDE.md` or import an applicable `AGENTS.md` with `@AGENTS.md`.

For handoff support, copy the complete `skills/use-better-handoff/` directory and its invocation subsection. Its instructions are in English, as are the wording skill's instructions; language-specific examples retain their original text. A task or standing project instruction can choose a handoff filename and location. Each skill can be adopted independently; neither loads the other as a dependency.

To remove a Skill, delete the copied Skill directory and its copied invocation subsection. Keep repository authority READMEs created or used by the Skill, unrelated instructions, and imports still required by other rules.

## Prepare a Design Package

For a new design package using the bundled layout, run `node scripts/requirements/create.mjs --repo <repository-root> --topic <topic-slug>` from the installed `use-flexible-design` directory. Node.js 22.0.0 or newer is required; no external packages are needed. The script creates only a folder and an empty `requirements.md`. The Skill searches existing requirements before creating a package and writes minimal content from the request unless empty preparation is requested. Plans, research, and decisions are added to the same package when needed.
