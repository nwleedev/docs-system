# Real UI discovery and candidate comparison

Find and directly inspect distinct real interfaces so the user can compare visual characteristics that remain undecided for the project. Base comparisons on screens the user can see, not descriptions on search pages.

## Frame the decision before searching

Identify the stated goal, the user task and screen needed to answer the current visual question, and the evidence that makes each item relevant. Classify material item by item rather than assigning one status to an entire file.

- Stated goals and approved requirements or decisions establish what the work must accomplish.
- Confirmed existing behavior and constraints establish what must be preserved.
- Existing UI and code show the current state; they do not define every required user task.
- Prototypes, generated artifacts, and draft documents propose possible solutions; they do not add requirements by themselves.
- Search hypotheses help find comparisons; they are not user choices.
- Material with unknown origin or approval remains uncertain.

Do not exclude a required user task because an existing React project or HTML page does not implement it. Do not include every screen or behavior shown in a draft or generated artifact. If uncertain status would change the representative task, candidate set, or question, ask only about that item. Otherwise retain the uncertainty in the stage result and continue with the confirmed scope. Return the selected representative task and screen, the reasons for including or excluding alternatives, and each material item's role and approval or uncertainty status.

## Choose search perspectives

Use the decision context, existing principles, and the user's description to identify one design topic to explore. Select only the representative tasks, states, and screens needed to answer it. If established principles already answer the question, proceed to implementation input without finding new references. Before exploring, follow the user choices procedure linked from `SKILL.md` to check any provided stage result, remaining rounds, and pending feedback.

Do not turn an abstract request into a single search query. Combine the perspectives needed for the current decision.

- Service category and purpose
- Screen role and interaction patterns
- Mood and information density
- Shape, corner radius, and borders
- Separation of background areas, shadows, and depth
- Typography, color, and emphasis
- Characteristics the user wants to avoid

For example, for "a calm list that makes many items easy to scan," examine list-based work screens, high information density, and restrained accent colors separately. Treat an interpretation such as "calm means gray" only as a search hypothesis, not a confirmed preference.

## Inspect candidate screens

Find candidates in released services or collections of real UI examples. Use available browsing or visual inspection capabilities to open and inspect running screens or UI images. The presence of a capability does not establish that screen access or visual inspection succeeded.

For each candidate, connect the service and screen names, source location, image or running screen directly inspected, and observed state. Include screen size or observation time when it affects the comparison. Return this evidence in the current stage result; do not require a document location or fixed record format.

Separate observations, interpretations, and unverified conditions. "The default list shows row dividers" is an observation. One screen cannot establish that "this service uses lines to separate content on every screen." Do not describe focus, error, or expanded states as observed when they are not visible in the current image.

Classify materials as follows.

- Real UI evidence: Material directly inspected and verified as a screen from a released service. For a gallery example, also include the evidence that identifies its original service and screen.
- Generated mockup: A proposal that combines characteristics for the project. It is neither a real service example nor evidence that an implementation has been validated.
- Image of unverified origin: Material that may help ask about visual preferences but does not establish what a released UI looks like. Apply the same standard to user-provided images.

Exclude help pages, documentation, blogs, and pages created to attract search traffic from real UI candidates. Even if such a page explains how to access a resource, do not present it as a UI reference. A DOM, extracted text, search summary, or unopened link alone does not complete visual inspection.

## When a real UI is inaccessible

If a real UI is inaccessible, explore other real interfaces from a wider range of perspectives.

Briefly include the inaccessible service and the reason in the stage result, then change the search perspective. Instead of finding more help pages for the same service, explore another domain with similar tasks, other screens with the same interaction pattern, or candidates with different information density and emphasis. Include the changed perspective and the real interfaces newly inspected.

If the user requires observation of a particular service, do not substitute another service without asking. Confirm the next action, such as requesting a screen from the user. Otherwise, explore alternatives first. If no suitable real UI is found or repeated failures produce no new evidence, request screens or defer the comparison. Excluding access failures from the round count does not justify continued searching without progress.

Do not count an access failure as an exploration round if no comparison material has been presented. Disclose when the origin of comparison material is unverified. Do not replace real UI evidence with help pages or generated images.

## Present candidates for visual comparison

Usually present three to five candidates per round, prioritizing differences that help the user decide. Do not add nearly identical candidates to reach a target count. If fewer suitable candidates are available, state that limitation and compare the differences found.

Show an image or running screen for each candidate and briefly explain the characteristics relevant to the current question. Where possible, present each candidate separately so the user can see distinct choices in information density, typographic hierarchy, or background separation. Do not substitute ASCII art, text wireframes, or lengthy descriptions for the visual comparison.

Do not require the user to choose an entire service as a package. Ask what to keep, remove, take from another candidate, or leave undecided. Let the user select different characteristics from multiple candidates. Do not summarize preferences using only a service name.

Before requesting feedback, prepare a stage result that identifies the candidates, viewable visual material, comparison characteristics, exact question, accepted reply form, pending round, and next action. Use a structured input capability only under the conditions in the user choices procedure; otherwise put the candidates and question in the ordinary response.

After presenting candidates and the question, wait for feedback. Follow the user choices procedure linked from `SKILL.md` when interpreting the response or deciding whether another round is needed. Do not automatically present more candidates or mark the round complete while feedback is pending.
