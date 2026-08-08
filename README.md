# Docs System

[한국어](./README.ko.md)

`Docs System` collects instructions and documentation practices for teams that work with coding agents. It is a research repository, not an application and not a universal template.

The files here are starting points. Select the sections that apply to the target repository, rewrite them around its actual tools and risks, and leave out rules that cannot be supported by its code, configuration, or team decisions.

## Contents

- [`AGENTS.md`](./AGENTS.md) is this repository's working example. It is written in English and configures agents to communicate and write project documentation in Korean.
- [`src/AGENTS.en.md`](./src/AGENTS.en.md) is a reference document for English-speaking users.
- [`src/AGENTS.ko.md`](./src/AGENTS.ko.md) is a reference document for Korean-speaking users.
- [`docs/designs/README.md`](./docs/designs/README.md) describes how to manage requirements, research, decisions, plans, and verification without forcing every project into one document template.
- [`docs/dev/README.md`](./docs/dev/README.md) describes how to research, organize, apply, and check development guidance.
- [`skills/use-design-docs`](./skills/use-design-docs/SKILL.md) and [`skills/use-dev-guidance`](./skills/use-dev-guidance/SKILL.md) are reference implementations to customize for a project. Each skill routes work and includes a `references/_README.md` starting point for repositories that do not yet have the corresponding authority README.
- [`skills/use-words-review`](./skills/use-words-review/SKILL.md) is a read-only review skill for text and names that will be committed or shared.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md) shows one stack-specific research prompt. It is an example, not a default for other projects.

The two language documents under `src/` are maintained independently and are not guaranteed to contain equivalent rules. Compare the relevant sections before adopting either one.

## Use the reference documents

1. Inspect the target repository's code, configuration, tests, existing documentation, and accepted decisions.
2. Start with [`src/AGENTS.en.md`](./src/AGENTS.en.md) or [`src/AGENTS.ko.md`](./src/AGENTS.ko.md).
3. Copy only the sections that govern work the repository actually performs.
4. Replace assumed tools, branch policies, commands, and technology-specific rules with verified local ones.
5. Save the result as `AGENTS.md` in the target repository. Add directory-specific files only when the agent supports them, its discovery rules are understood, and that directory needs different instructions.
6. Keep the root file concise. Move detailed knowledge into maintained documents and link to it instead of turning `AGENTS.md` into a manual.

The paths and names under `src/` are not default instruction locations for Codex and similar tools. Copy the selected material into a recognized file or configure the tool explicitly. This repository does not generate or merge `AGENTS.md`. Do not combine every reference section by default. A short instruction file with relevant, testable rules is more useful than a complete-looking file filled with assumptions.

## Apply a skill reference implementation

Copy the entire selected skill directory to a location supported by the tool. Selecting `use-design-docs` or `use-dev-guidance` also copies its `references/_README.md`. The `skills/` directory contains customizable reference implementations, not complete Plugins or automatic installation and upgrade tooling.

- Codex repository: `.agents/skills/<skill-name>/`
- Codex user: `$HOME/.agents/skills/<skill-name>/`
- Claude Code repository: `.claude/skills/<skill-name>/`
- Claude Code user: `$HOME/.claude/skills/<skill-name>/`
- Plugin: `<plugin-root>/skills/<skill-name>/`

Confirm the current discovery locations in the [Codex skills documentation](https://developers.openai.com/codex/skills) or [Claude Code skills documentation](https://code.claude.com/docs/en/skills). A directory under this repository's `skills/` path is not automatically discovered.

When a repository adopting `use-design-docs` or `use-dev-guidance` already has its authority README, use the existing file. If the README is absent and the skill determines that the current work needs it, the skill identifies the installed `_README.md` and target path and asks for approval. After approval, it creates `docs/designs/README.md` or `docs/dev/README.md` from the `_README.md` content without the maintenance HTML comment, then reads the new file completely. The `_README.md` never overwrites an existing authority README and is not kept in automatic synchronization with it.

If the user declines creation, the skill inspects repository instructions, existing documentation locations, and the directory structure. It writes the originally requested file only when the request authorizes that change and the repository evidence supports the location. It asks the user when the repository does not establish a suitable location, and keeps review or research requests read-only.

After selecting `use-words-review`, copy the entire section from [`src/AGENTS.en.md`](./src/AGENTS.en.md) or [`src/AGENTS.ko.md`](./src/AGENTS.ko.md), including the `BEGIN USE WORDS REVIEW` and `END USE WORDS REVIEW` markers, into an instruction file that the tool loads. Use the applicable `AGENTS.md` for Codex. For Claude Code, add the section to `CLAUDE.md`, or keep it in `AGENTS.md` and import that file from `CLAUDE.md` with `@AGENTS.md`. Keep the target repository's existing section structure and add only the rules that apply there.

To remove a skill, delete only the skill directory that you copied. If you added the marked `use-words-review` section to an instruction file, remove that section too. Keep repository READMEs created or used by a skill, the surrounding instructions, and any `@AGENTS.md` import that remains necessary for other rules.

Compound Skills are optional. Use Git's worktree and commit features directly when they are not installed. Even when Compound is available, do not copy its managed tool-mapping block into this repository's `src` examples.

## Working principles

- Treat repository evidence as the source for current local rules. External guidance can support a proposal, but it does not prove that a rule applies to a particular project.
- Keep decisions made by requirements owners and decision owners separate from AI inferences. Requirements need confirmation from their owner, and product decisions need approval from their decision owner.
- Give each rule one owner. Link to the owning document instead of copying the same rule into several files.
- Use linters, type or schema checks, tests, CI, runtime checks, and review by the responsible reviewer where they can verify a rule. Prose alone does not establish compliance.

## Project status

This repository changes as its guidance is tested in other repositories. Before adopting a file, review its Git history and confirm that each selected rule matches the target repository.

## Design references

The repository's direction is informed by the following primary sources:

- [AGENTS.md open format](https://agents.md/)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [GitHub: Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Visual Studio Code: Use custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [GitHub: About the repository README file](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
