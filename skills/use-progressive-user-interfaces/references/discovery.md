# Real UI discovery and candidate comparison

Find and directly inspect distinct real interfaces so the user can compare visual characteristics that remain undecided for the project. Base comparisons on screens the user can see, not descriptions on search pages.

## Choose search perspectives

Read the project's purpose, target screen, existing principles, and the user's description to identify the design topic to explore. If established principles already answer the question, proceed to implementation input without finding new references. Before exploring, follow the user choices and records procedure linked from `SKILL.md` to check the remaining rounds and whether feedback is pending.

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

Find candidates in released services or collections of real UI examples. Use available tools, such as a browser MCP tool, to open and visually inspect running screens or UI images. The presence of a tool does not establish that screen access or visual inspection succeeded.

For each candidate, connect the service and screen names, source location, image or running screen directly inspected, and observed state. Record screen size or observation time when it affects the comparison. Link this evidence from the project's existing documents rather than requiring a new record format.

Separate observations, interpretations, and unverified conditions. "The default list shows row dividers" is an observation. One screen cannot establish that "this service uses lines to separate content on every screen." Do not describe focus, error, or expanded states as observed when they are not visible in the current image.

Classify materials as follows.

- Real UI evidence: Material directly inspected and verified as a screen from a released service. For a gallery example, also record the evidence that identifies its original service and screen.
- Generated mockup: A proposal that combines characteristics for the project. It is neither a real service example nor evidence that an implementation has been validated.
- Image of unverified origin: Material that may help ask about visual preferences but does not establish what a released UI looks like. Apply the same standard to user-provided images.

Exclude help pages, documentation, blogs, and pages created to attract search traffic from real UI candidates. Even if such a page explains how to access a resource, do not present it as a UI reference. A DOM, extracted text, search summary, or unopened link alone does not complete visual inspection.

## When a real UI is inaccessible

If a real UI is inaccessible, explore other real interfaces from a wider range of perspectives.

Briefly record the inaccessible service and the reason, then change the search perspective. Instead of finding more help pages for the same service, explore another domain with similar tasks, other screens with the same interaction pattern, or candidates with different information density and emphasis. Record the changed perspective and the real interfaces newly inspected.

If the user requires observation of a particular service, do not substitute another service without asking. Confirm the next action, such as requesting a screen from the user. Otherwise, explore alternatives first. If no suitable real UI is found or repeated failures produce no new evidence, request screens or defer the comparison. Excluding access failures from the round count does not justify continued searching without progress.

Do not count an access failure as an exploration round if no comparison material has been presented. Disclose when the origin of comparison material is unverified. Do not replace real UI evidence with help pages or generated images.

## Present candidates for visual comparison

Usually present three to five candidates per round, prioritizing differences that help the user decide. Do not add nearly identical candidates to reach a target count. If fewer suitable candidates are available, state that limitation and compare the differences found.

Show an image or running screen for each candidate and briefly explain the characteristics relevant to the current question. Where possible, present each candidate separately so the user can see distinct choices in information density, typographic hierarchy, or background separation. Do not substitute ASCII art, text wireframes, or lengthy descriptions for the visual comparison.

Do not require the user to choose an entire service as a package. Ask what to keep, remove, take from another candidate, or leave undecided. Let the user select different characteristics from multiple candidates. Do not summarize preferences using only a service name.

After presenting candidates and questions, wait for feedback. Follow the user choices and records procedure linked from `SKILL.md` when recording choices or deciding whether another round is needed. Do not automatically present more candidates while waiting.
