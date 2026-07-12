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
- [`.agents/skills/use-design-docs`](./.agents/skills/use-design-docs/SKILL.md) and [`.agents/skills/use-dev-guidance`](./.agents/skills/use-dev-guidance/SKILL.md) are optional adapters for Codex and compatible skill runners. The skills route work; the linked READMEs remain the source of the rules.
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

## Working principles

- Treat repository evidence as the source for current local rules. External guidance can support a proposal, but it does not prove that a rule applies to a particular project.
- Keep human decisions separate from AI inferences. Requirements and product decisions need explicit human review.
- Give each rule one owner. Link to the owning document instead of copying the same rule into several files.
- Use linters, type or schema checks, tests, CI, runtime checks, and human review where they can verify a rule. Prose alone does not establish compliance.

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
