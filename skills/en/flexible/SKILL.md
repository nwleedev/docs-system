---
name: flexible
description: Use when drafting or reviewing requirements, planning how to meet them, or carrying out a requested plan. Identify which steps can be planned from the current requirements, what needs to change at each step, and how to verify the result.
---

# Review requirements and plan the work

For a review request, leave files untouched and explain which steps you can plan from the current requirements. If a decision is still open, explain what needs to be confirmed and which steps or dependencies the answer would change. When asked to draft or revise a document, record the confirmed requirements and constraints. When asked for a plan, give the steps in order and explain how to verify them. Carry out those steps when the user also asks for execution.

## Check the current state and prior decisions

Starting at the repository root, look for documents and rules governing requirements, designs, and plans. Follow the project's conventions for where and how to document them. If the project has no such rules and needs a guide for maintaining design documents, you may propose creating `docs/designs/README.md`. If the user agrees, read the full [design documentation guide](references/_README.md) and copy its contents into that file. Keep attachments and prompts out of the repository.

Compare the request with existing requirements to identify what should change and which constraints still apply. Determine what result the user could observe to confirm that the requirement is met. Check the code, Git history, project README, handoff notes, and design records for the current behavior and prior decisions. Consult external sources when needed to answer an open question.

## Decide which steps you can plan

- **If different interpretations would produce different outcomes,** check existing records first. If the intent is still unclear, explain what each choice would change and ask which outcome the user wants. Investigate how the steps would differ if the choice affects the procedure. Pause only the steps that depend on the answer.
- **If the outcome is clear but the method is uncertain,** investigate the facts that determine how to proceed. Identify what you need to learn to plan the next step. If several methods meet the requirement, use the evidence and constraints to choose one.
- **If you know what to change and how to verify completion,** write the plan. If the current behavior already meets the requirement, show the evidence and finish there.

### Examples

- **Ask which results to export.** “I want to download my book search results as a file.” The first page shows 10 of the 12 matching books. Ask, “Should the file contain the 10 books on this page or all 12 matches?” The answer determines both what the file should contain and how to check it.
- **Inspect the repository to plan a documentation change.** “Combine the Windows and macOS installation instructions into one guide.” Compare the preparation steps and installation commands. Plan to describe shared steps once and present the commands that differ under the relevant operating system.
- **Check whether the existing export meets the requirement.** If the user answers, “I want all 12 books from this search,” open a file downloaded with the existing export. Compare each title on both pages with the file. If it contains all 12 books, explain how to download it and report what you verified.

## Write the plan

1. Confirm the requirements and decisions the plan must follow. Include only the changes they call for and explain why each is needed.
2. Order the steps by identifying what result each step needs from an earlier one. For any step that cannot start yet, state what must be confirmed first.
3. Define how to tell when each step is complete. End with a check that covers both the original requirement and the constraints that must still hold in actual use.

### Example

**Combine two installation guides.** The two READMEs share the same preparation steps but use different installation commands. The commands and their order must stay intact, and readers must be able to reach the combined guide from either README.

1. Write the shared preparation steps once in the new guide, followed by separate installation instructions for Windows and macOS. Compare each set of commands with its original README to verify that every command appears in the same order.
2. Once the new guide is ready, replace the duplicate instructions in each README with a link directly to the instructions for that operating system. Open each link and verify that it shows the correct installation commands.

## Carry out the plan and update it as needed

When asked to carry out the plan, start with steps whose prerequisites are met. At each step, distinguish what you verified from what remains. At the end, check the result the user expected.

If new evidence changes only the method, update the affected steps and their checks. If the agreed outcome or a constraint must change, explain what would change and ask for a decision. Continue with unaffected steps while the others await the decision.

### Examples

- **A link breaks after the guide moves.** Following the configuration example link from the relocated guide gives a file-not-found error. If the example file is still in place and moving the guide changed the relative path, add a step to fix the link. Start at the existing README, follow its link to the guide, then open the example link and verify that it leads to the original file.
- **The user changes the desired result.** “Keep the installation instructions in the two documents and make both easy to find from the repository home page.” Stop merging the instructions and check what content has already moved. Revise the plan to keep each system's instructions in its README and link to both READMEs from the home page. Verify that each link opens the intended README and that all the original installation steps are present.

## Draft or revise a requirements document

First check for an existing requirements document on the same topic. Create a file if there is no such document or if the user explicitly requests a separate one. Otherwise edit only the requested parts of the existing document.

If you need a new file and the repository uses the layout described in `docs/designs/README.md`, you can use the command below to create a topic directory and an empty `requirements.md`. Run it from the skill directory with Node.js 22.0.0 or later. Add content if the user also requested a draft.

```sh
node scripts/requirements/create.mjs --repo <repository-root> --topic <topic-slug>
```

Use `--help` on its own to see the required arguments and what to check if the command fails. Run the script only when creating a file. If the repository follows different documentation rules, use the locations and conventions they specify. Create directories for research and decisions when you have records to put in them.
