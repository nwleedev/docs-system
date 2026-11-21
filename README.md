# Docs System

[한국어](./README.ko.md)

`Docs System` is a research repository for teams that use coding agents. It contains examples of agent instructions and documentation practices. When adopting them, select rules that match the target repository's code, configuration, documents, and approved decisions.

## Repository Files

- [`AGENTS.md`](./AGENTS.md) contains the instructions for agents in this repository. [`src/en/AGENTS.md`](./src/en/AGENTS.md) is the English reference for other repositories.
- [`docs/designs/README.md`](./docs/designs/README.md) defines how this repository organizes requirements, research, decisions, and plans.
- [`docs/dev/README.md`](./docs/dev/README.md) defines which development rules belong in this repository and links to the guidance for its Node.js command-line scanners.
- [`examples/nextjs-frontend.md`](./examples/nextjs-frontend.md) illustrates how to request research on development practices for a Next.js frontend. Its choice of technologies is specific to that example.

### Skills

- [`flexible`](./skills/en/flexible/SKILL.md) identifies which steps the current requirements support and how to verify each one. For a review, the agent leaves files untouched and explains which steps depend on open questions. It carries out the plan when the user requests execution.
- [`programming`](./skills/en/programming/SKILL.md) compares ways to implement a feature or resolve a problem in existing code. It explains why an approach fits, which code would change, and how to verify the result. The agent changes code only when the user asks for implementation.
- [`ui`](./skills/en/ui/SKILL.md) compares visual designs and creates standalone HTML mockups. To request a revision, copy the element's full XPath from the browser developer tools and describe what should change in the mockup. Production application code stays unchanged during mockup revisions.
- [`handover`](./skills/en/handover/SKILL.md) moves notes for the next agent to the designated handoff file. Instructions that readers need stay in the original document. Use this skill to consult or update an existing handoff record.
- [`terms`](./skills/en/terms/SKILL.md) reviews the full text of each file created or edited for the current request and revises everyday or ambiguous wording. It also applies to filenames and interface text. For review-only requests, it suggests revisions to the selected file or passage in the reply. It reviews text in any language and runs additional checks on Korean text.

The English reference and [its Korean counterpart](./src/ko/AGENTS.md) are maintained independently. Compare the applicable sections before adopting either one.

## Adopt an AGENTS Reference

1. Check the target repository's code, configuration, tests, documentation, and approved decisions to establish which rules already apply.
2. Choose the English or Korean `AGENTS.md` under `src/`. Copy the instructions for the activities your team performs in that repository.
3. Adapt the copied instructions to the tools, branch policies, commands, and technology conventions you verified in the target repository.
4. Save those instructions in the file your agent loads for the target repository. For Codex, you can use `AGENTS.md` at the repository root.

Copy and edit the instructions manually. This repository has no tool for generating or merging instruction files. Keep the instruction file short and link to repository documents for detailed rules.

Add a wording section to the project's `AGENTS.md` only when the project has rules to document. Write the rules in that section or link to the document where the project maintains them.

## Install or Remove a Skill

Both language editions use the same skill name. Choose an edition and copy the skill directory with its references, scripts, and agent settings. For example, to install the English `terms` skill for one Codex repository, copy `skills/en/terms/` to `.agents/skills/terms/` in that repository. Choose the destination below for a repository, a user account, or a plugin.

- Codex repository: `.agents/skills/<skill-name>/`
- Codex user: `$HOME/.agents/skills/<skill-name>/`
- Claude Code repository: `.claude/skills/<skill-name>/`
- Claude Code user: `$HOME/.claude/skills/<skill-name>/`
- Plugin: `<plugin-root>/skills/<skill-name>/`

Codex and Claude Code discover installed skills in their designated directories. The copies under this repository's `skills/` directory are research material. For current installation locations, see the [Codex skills documentation](https://developers.openai.com/codex/skills) or [Claude Code skills documentation](https://code.claude.com/docs/en/skills).

To have the agent invoke an installed skill in the situations defined by the project, copy that skill's instructions from [`src/en/AGENTS.md`](./src/en/AGENTS.md) into the instruction file your tool loads. For `handover`, copy the block delimited by `BEGIN HANDOVER` and `END HANDOVER`. For `terms`, use `BEGIN TERMS` and `END TERMS`. If you install both, transfer handoff notes before reviewing the wording.

The research and design instructions invoke `flexible`. The development instructions invoke `programming`. You can invoke `ui` directly when requesting a design. For Claude Code, add the chosen instructions to `CLAUDE.md` or use `@AGENTS.md` in `CLAUDE.md` to import the repository's instruction file.

To uninstall a skill, delete its installed directory and remove any invocation instructions you copied for it. Preserve project READMEs that the skill created or used, instructions for other skills, and imports those instructions still need.

## Prepare a Design Package

When asked to draft or revise requirements, `flexible` first checks for a document on the same topic. Create a new document if none exists or the user explicitly requests a separate one. Otherwise, revise only the requested parts of the existing document. The command below creates the new document when the target repository uses the bundled layout and already has `docs/designs/README.md`.

Run the command from the installed `flexible` directory with Node.js 22.0.0 or later. Replace `<repository-root>` with the path to the target repository and `<topic-slug>` with the topic identifier, such as `book-search`.

```sh
node scripts/requirements/create.mjs --repo <repository-root> --topic <topic-slug>
```

The script creates a topic directory and an empty `requirements.md` without external packages. Write the requirements in that file if the request includes drafting them. The [design document guide](./skills/en/flexible/references/_README.md) explains when to add research notes, decision records, and a plan to the same directory.

## Check Korean text

From the installed `terms` directory, run `node scripts/scan.mjs --file <path>`. Replace `<path>` with the document's absolute path or its path relative to the `terms` directory. Run `node scripts/scan.mjs --help` to see the other input options. For each warning, read the flagged text in context to decide whether it needs revision.
