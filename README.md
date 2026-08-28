# Docs System

[한국어](./README.ko.md)

`Docs System` researches instructions and documentation practices for teams that work with coding agents. It is not an application or a universal template. Select only rules supported by the target repository's code, configuration, documents, and approved decisions.

## Repository Files

- [`AGENTS.md`](./AGENTS.md) is this repository's working example. [`src/AGENTS.en.md`](./src/AGENTS.en.md) and [`src/AGENTS.ko.md`](./src/AGENTS.ko.md) are reference documents for other repositories.
- [`docs/designs/README.md`](./docs/designs/README.md) defines this repository's design-document rules. [`use-design-docs`](./skills/use-design-docs/SKILL.md) routes requirements, research, decisions, planning, and validation through a repository's corresponding README.
- [`docs/dev/README.md`](./docs/dev/README.md) defines this repository's development-guidance rules. [`use-dev-guidance`](./skills/use-dev-guidance/SKILL.md) routes stack research, checks, dependency work, guidance, and implementation validation through a repository's corresponding README.
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

Copy the matching invocation subsection from [`src/AGENTS.en.md`](./src/AGENTS.en.md) or [`src/AGENTS.ko.md`](./src/AGENTS.ko.md) into the instruction file loaded by the tool. The `use-better-terms` subsection is bounded by `BEGIN USE BETTER TERMS` and `END USE BETTER TERMS`; the design and development subsections are titled for their respective responsibilities. For Claude Code, place the subsection in `CLAUDE.md` or import an applicable `AGENTS.md` with `@AGENTS.md`.

To remove a Skill, delete the copied Skill directory and its copied invocation subsection. Keep repository authority READMEs created or used by the Skill, unrelated instructions, and imports still required by other rules.
