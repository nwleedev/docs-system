---
name: flexible
description: Use when reviewing or drafting requirements or when writing or updating an execution plan. Confirm the intended outcome and constraints, then specify the order and verification method for steps with defined completion criteria.
---

# Review requirements and plan the work

- **Review only.** Provide the requested assessment and its evidence in the response. If the evidence is insufficient to reach a conclusion, state what you confirmed and what information you still need.
- **Draft or revise requirements.** Record the confirmed requirements and constraints in the document when requested.
- **Plan or execute.** When requested, write a plan or review the existing plan using the criteria below. Execute confirmed steps with satisfied prerequisites only when execution is requested.

Create or modify files only when that work falls within the request.

## Check the current state and prior decisions

Starting at the repository root, look for documents and rules governing requirements, designs, and plans. Follow the project's conventions for where and how to document them. If the request includes maintaining a record of requirements, decisions, or plans and the repository has no documentation rules, you may propose creating `docs/designs/README.md`. Once approval to create the file is confirmed, copy the full [design documentation guide](references/_README.md) into that file. Use attachments and prompts as reference material and keep them out of the repository.

Identify the intended outcome and constraints in the request, requirements documents, and approved decisions. Check the code, tests, Git history, project README, handoff notes, and design records to see how the part under review works now and what has changed. If repository materials leave a technical question unresolved, consult sources that apply to the project's versions and runtime conditions.

Compare the observed results or deliverables with the completion criteria to determine whether the requirements are met. When reviewing claims about a cause or a completed fix, distinguish observations, possible causes, proposed fixes, and verification results from actual execution. State what each piece of evidence establishes.

## Clarify requirements and decide which steps to confirm

Identify the request, requirements entry, or approved decision that establishes each of the following for a step.

1. **Intended outcome.** State the usage scenario and inputs, what should happen, and what result or deliverable is needed.
2. **What to change and constraints.** Identify which features, conditions for running them, results they produce, or documents need to change. If the outcome depends on where the change applies, specify which service users, data, or usage scenarios to include or exclude. Record which features and ways of using them must remain available and which constraints must hold.
3. **Completion criteria.** Specify the observable results or deliverables and what counts as passing verification. Where the requirements cover normal operation, compatibility with existing features, or what happens on failure, state the criteria for each that applies.

Confirm a step only after establishing all three and completing the investigation needed to select an implementation approach. Before adding, changing, or removing an externally accessible feature or an observable result, identify the requirement or approved decision that supports the change. Check when features run, what happens on failure, and which actions the interface offers. Leave unsupported changes out of the confirmed plan and do not carry them out.

- **Decisions needed.** If the outcome, what to change, a constraint, or a completion criterion is unclear or conflicts with another, compare the existing requirements and approved decisions. If the requirements remain unclear or a technical constraint prevents meeting them as written, explain directly in the reply when the problem occurs and how it affects the requested outcome. If a choice is needed, explain what would change under each option and ask for a decision. Mark dependent steps as pending and state which decision is needed. Plan independent steps separately.
- **Technical questions.** If the requirements are confirmed and a technical fact or implementation approach is still unknown, investigate the relevant code, interfaces, or actual results at runtime. If implementation depends on the answer, specify what to establish and how to check it before confirming the implementation step. If several approaches meet the requirements, choose one based on the evidence and constraints.
- **Requirements already met.** Compare what existing features produce or what existing deliverables contain with the completion criteria. Show the evidence for requirements that are already met and omit the steps to change them.

### Examples

- **Ask which results to export.** “I want to download my book search results as a file.” The first page shows 10 of the 12 matching books. Ask, “Should the file contain the 10 books on this page or all 12 matches?” While the question is open, check which items the current export includes. Confirm the implementation step and its completion criteria once the answer is confirmed.
- **A booking confirmation for a fictional workshop.** If the requirement says to display the booking number once the booking is confirmed, even when the confirmation fails to print, keep showing the number when printing fails. If the requirements and approved decisions leave it unclear whether to show the number on print failure, ask in the reply, “Should the booking number still appear if printing fails?” Leave email delivery out of the plan and implementation unless a requirement or approved decision supports adding it.
- **Inspect the repository to plan a documentation change.** “Combine the Windows and macOS installation instructions into one guide.” Compare the preparation steps and installation commands. Plan to describe shared steps once and present the commands that differ under the relevant operating system.
- **Check whether the existing export meets the requirement.** If the answer is “I want all 12 books from this search,” open a file downloaded with the existing export. Compare each title on both pages with the file. If it contains all 12 books, explain how to download it and report what you verified.

## Write the plan

1. State the intended outcome and the constraints that must hold. For each step, identify what to change, what work to perform, and the requirement or decision that supports it. If a step changes several externally accessible features or observable results, record which requirement or decision supports each change. Link to the relevant entries when source documents exist.
2. Order the steps by identifying which deliverable or verification result each one needs from an earlier step. For pending steps, record the open question or investigation and what would allow you to confirm the step.
3. Specify each step's expected deliverable, verification method, and pass criteria. Include a final check for each requirement and constraint covered by the request. Compare the externally accessible features and observable results before and after implementation. Verify that a governing requirement or approved decision supports each actual change.

### Example

**Combine two installation guides.** The two READMEs share the same preparation steps but use different installation commands. The commands and their order must stay intact, and both READMEs must link to the combined guide.

1. Write the shared preparation steps once in the new guide, followed by separate installation instructions for Windows and macOS. Compare each set of commands with its original README to verify that every command appears in the same order.
2. Once the new guide is ready, replace the duplicate instructions in each README with a link directly to the instructions for that operating system. Open each link and verify that it shows the correct installation commands.

## Carry out and update the plan

When starting or resuming execution, consult the requirements, prior decisions, and latest plan. Compare recorded progress with actual deliverables or verification records. Proceed with confirmed steps whose prerequisites are met.

After verifying a step or when execution stops, update its completion status, actual verification results and evidence, remaining work, and conditions for resuming. Record the update in the plan document or in the conversation if the plan was provided there. Mark steps complete only when they meet their pass criteria. Use the final verification to determine whether the work is complete.

- **Implementation changes.** When changing the approach within the confirmed requirements, record the new facts and the reason for the change. Update the affected steps, prerequisites, and checks.
- **Requirements changes.** When the outcome, what to change, a constraint, or a completion criterion must change, explain the change and identify the affected steps and checks. Use the request as the source for any change it explicitly states. If a decision is still needed, follow the decision procedure under [Clarify requirements and decide which steps to confirm](#clarify-requirements-and-decide-which-steps-to-confirm) and pause only the affected steps. Once the change is confirmed, update the requirements document first if you have permission to edit it, then update the plan. If there is no requirements document or it cannot be edited, record the confirmed change in the conversation and update the plan.

Rerun checks whose results are invalidated by an implementation or requirements change.

### Examples

- **A link breaks after the guide moves.** Following the configuration example link from the relocated guide gives a file-not-found error. If the example file is still in place and moving the guide changed the relative path, add a step to fix the link. Start at the existing README, follow its link to the guide, then open the example link and verify that it leads to the original file.
- **The requested outcome changes.** “Keep the installation instructions in the two documents and make both easy to find from the repository home page.” Stop merging the instructions and check what content has already moved. Revise the plan to keep each system's instructions in its README and link to both READMEs from the home page. Verify that each link opens the intended README and that all the original installation steps are present.

## Draft or revise a requirements document

First check for an existing requirements document on the same topic. Create a file if there is no such document or if the request explicitly calls for a separate one. Otherwise edit only the requested parts of the existing document.

If you need a new file and the repository uses the layout described in `docs/designs/README.md`, you can use the command below to create a topic directory and an empty `requirements.md`. Run it from the skill directory with Node.js 22.0.0 or later. Add content if the request also calls for a draft.

```sh
node scripts/requirements/create.mjs --repo <repository-root> --topic <topic-slug>
```

Use `--help` on its own to see the required arguments and what to check if the command fails. Run the script only when creating a file. Create directories for research and decisions when you have records to put in them.
