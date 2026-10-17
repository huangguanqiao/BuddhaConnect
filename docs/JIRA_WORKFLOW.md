# Jira and AI collaboration workflow — BuddhaConnect

The authoritative issue tracker is Jira project **BUD** at https://huangguanqiao.atlassian.net. Shared agent rules live in [AGENTS.md](../AGENTS.md), which takes precedence over this example document if rules conflict.

## Jira fields

| Field (exact name) | Language | Content |
| --- | --- | --- |
| Summary | English | Concise title of the feature, fix or task |
| Description | Simplified Chinese | Complete requirements, context, acceptance criteria and updates |
| English Description | English | Faithful full translation of Description (not just a summary) |
| AI Prompt | English | AI-generated, task-specific instructions derived from Jira and the current repo |
| Pull Requests | English | Feature PRs, verified Production Releases and rollback entries |
| Comments | English | Implementation handoff, testing and decision updates |
| Labels | English | Searchable categories, such as `cicd`, `content`, `ui` |

Use the exact case-sensitive custom field names as returned by Jira metadata. Custom field IDs can vary by site and must be resolved, never guessed. Never erase existing content just to satisfy this structure.

## No ticket, no change — intake and grouping

**Mandatory:** Every change to website copy, code, content, documentation, metadata, configuration or assets must have a real BUD-XX issue **before the first file edit**, even a one-word change. Pure discussion, inspection and research without modifying anything need no ticket.

1. Search for an existing issue covering the exact scope. If found, keep using it. Do not create duplicate issues for every AI handoff or tiny commit.
2. Otherwise create a Bug for defects, Story for user-facing functionality, or Task for maintenance, content edits and documentation. Write Chinese Description and a full English Description, with appropriately small acceptance criteria for tiny edits.
3. Create a Jira-keyed branch and PR **after** the issue exists.
4. For a coherent batch of tiny edits, list all affected files/pages and expected changes in **one** issue and PR, retaining one clear review/acceptance boundary.
5. Split work when objective, module, risk, reviewer, release or independently testable behavior differs. **Same calendar day is a convenience, not permission to bundle unrelated work.** Continuing an unfinished task on the next day does not require a new ticket.
6. If Jira is inaccessible, stop before modifying and report the blocker. An incident exception requires explicit owner approval, transparent logging and backfilled Jira evidence once access returns.

### Small-change examples

| Scenario | Jira approach |
| --- | --- |
| Fix a single word on the homepage | One lightweight Task, branch and PR |
| Correct six typos on homepage/navigation in one review batch | One copy-edit Task listing all corrections; one PR |
| Fix Buddhist terminology in a coherent editorial review batch | One content Task if review/acceptance scope is shared |
| Change homepage copy and fix login security on the same day | Two issues and separate PRs |
| Continue yesterday's unfinished wooden-fish feature | Reuse its existing Story |
| Discover a separate feature while fixing a bug | New ticket, link related issues |

## AI workflow

1. Read `AGENTS.md` and relevant project docs, then open the actual Jira issue and inspect the code.
2. Understand requirements from both descriptions. If one is missing, draft a translation of the other; preserve important qualifications and URLs.
3. Draft `AI Prompt` in English: goal, scope, technical approach, constraints, acceptance checks, test commands, branch and PR naming, handoff. Do not claim a generated prompt was executed.
4. Implement in a dedicated feature branch with an actual `BUD-XX` key and create a PR: `[BUD-XX] feat: Clear English title`.
5. Run checks and build; log real test results rather than unverified claims. Merge into `master` only after review; GitHub Pages UAT is deployed automatically.
6. Link merged PR(s) in the ticket's `Pull Requests` field. UAT acceptance is separate from code merge.
7. Only with explicit approval, trigger the existing Production Publish workflow. Verify the Hostinger-served website before declaring the feature live, and record the true GitHub Release URL and tag.
8. If a rollback occurs, append the rollback event, target and verification outcome to the same ticket. Leave old history intact.

## Example: Description (Chinese)

**目标：** 为网站增加虚拟木鱼，支持移动设备操作。

**验收标准：**
- 点击时播放音效，并正确累计敲击次数。
- 提供静音控制。
- 桌面端和手机端均可正常使用。

**实施与验证：** 开发完成后通过 GitHub Pages UAT 验证；未获明确授权不得发布 Production。

## Example: English Description

**Goal:** Add a virtual wooden fish to the website, suitable for mobile interaction.

**Acceptance criteria:**
- Play a sound on tap and increment the tap count correctly.
- Provide a mute control.
- Work on both desktop and mobile.

**Implementation and verification:** Validate in GitHub Pages UAT after development. Do not publish to Production without explicit approval.

## Example: AI Prompt

```text
Implement BUD-20: Virtual Wooden Fish.
Read AGENTS.md, relevant project documentation and the current Astro codebase.
Build a responsive interactive wooden fish with a tap counter, sound and mute control.
Reuse current UI patterns and avoid unnecessary dependencies.
Validate every acceptance criterion and run the available project checks.
Create a feature PR titled "[BUD-20] feat: Add virtual wooden fish".
Update the Jira ticket with factual test evidence and the Feature PR URL.
Do not initiate a Production deployment.
```

## Example: Pull Requests field (append, do not overwrite)

```text
Feature PR: https://github.com/huangguanqiao/BuddhaConnect/pull/25
UAT: Merged to master; preview validation complete.

Production Release: https://github.com/huangguanqiao/BuddhaConnect/releases/tag/prd-YYYY-MM-DD-run-N
Release Tag: prd-YYYY-MM-DD-run-N
Production Verification: Verified live on YYYY-MM-DD HH:mm Australia/Sydney.

Rollback: None.
```

The URLs and release values in this example are **illustrative, not actual deployments**. Only record a real Production Release when its tag, URL and live-site verification have been observed.

## Jira status discipline

- `To Do` / `Solutioning` / `Ready to Build`: planning and refinement.
- `In Build`: code or content work underway.
- `In QA`: testing and Preview/UAT verification.
- `Ready for Release`: approved and waiting for manual Production Publish.
- `Done`: acceptance completed; production-facing features generally require verified Production deployment.
- `On Hold` / `Won't Do`: blocked or declined; document why.

AI agents can recommend status changes but should only apply changes matching observed evidence and the project's available transitions.


## Jira Comment activity log — mandatory milestone template

All Jira Comments are in English. Comments provide a chronological, human-readable work log: write a new entry for a new event instead of rewriting previous history. They complement the two Descriptions, AI Prompt and Pull Requests field.

### Required template

~~~text
Activity: Development Update
Date: 2026-10-17 21:45 Australia/Sydney (AEDT)
Performed by: Claude Code
Reported by: ChatGPT (only when reporting someone else's work)
Summary: Updated the virtual wooden fish tap counter and mobile layout.
Changes: src/components/WoodenFish.astro; src/pages/index.astro
Testing: npm run build — Passed; manual UAT — Not run.
References: https://github.com/huangguanqiao/BuddhaConnect/pull/25
Next Step: Review PR and validate on Preview before requesting release.
~~~

**Illustrative only**: Never reuse the date, performer, files, result or PR number as real evidence.

### Events worth logging

| Activity | When to log |
| --- | --- |
| Development Started | Work started or material scope/context changes |
| Development Update | Significant implementation increment is completed |
| Pull Request Created | A reviewable PR actually exists |
| Code Merged | Merge into master is confirmed |
| Testing Result | CI, build, manual test or UAT result is known |
| Blocker / Decision | A meaningful blocker or decision changes the plan |
| Handover | Another AI/human needs the current status and next steps |
| Production Deployment | Publish initiated and the result observed |
| Production Rollback | Rollback executed, target and verification recorded |
| Completion | Applicable acceptance/Done criteria have been met |

### Identity, date and quality requirements

- **Performed by** is the verified actor: ChatGPT, Claude Code, Codex, Gemini, Human / Project Owner, or GitHub Actions. For joint work, attribute each contributor accurately; if unverified, say Unknown / not independently verified.
- **Reported by** is required if the commenting AI merely reports another person's/agent's work. The Jira native comment author is the Atlassian account that posts it, **not automatically the work performer**.
- Use the real YYYY-MM-DD HH:mm with an accurate timezone (e.g. Australia/Sydney, Australia/Canberra, or UTC offset). Never infer an execution or deployment timestamp from PR creation time.
- **Testing** names real commands/tests and outcomes; use Not run (reason) or Not applicable rather than inventing success. Separate Build passed, UAT pending and verified Production.
- Keep updates brief, professional and useful: real changes, references, risks and next steps. Never paste large diffs, credentials or the whole Description.
- Write one meaningful milestone comment for a coherent batch, **not one comment per keystroke, file save or trivial edit**.
- Distinguish "Published to production branch; Hostinger/live verification pending" from "Verified live on Production." Add a follow-up comment after live verification.
- Record failures/blockers and rollback results as well as successes. Preserve earlier comment history; do not rewrite old entries as routine practice.
- Confirm Jira writes actually succeeded before claiming a comment exists. Only mark Done based on applicable acceptance evidence.

### Example: one batch of small wording changes

~~~text
Activity: Development Update
Date: <actual date/time and timezone>
Performed by: <actual actor>
Summary: Corrected copy in the agreed editorial review batch.
Changes:
- src/pages/index.astro — corrected heading punctuation.
- src/components/Header.astro — updated navigation label.
- src/content/articles/example.md — corrected terminology.
Testing: npm run build — <actual result>; editorial review — <actual result>.
References: <real BUD ticket and PR URL>
Next Step: <actual next action>
~~~

These edits can share one ticket **only when they are genuinely one review scope**. Merely listing several files does not justify combining unrelated tasks.


## Completed tickets: immutable history and new change requests

**Done / Closed = frozen historical acceptance baseline.** Preserve the original Chinese Description, English Description, AI Prompt, recorded delivery details and historical Pull Requests/release entries. A future request creates a new linked Jira issue, **even if the enhancement is very small**. Apply the existing no-ticket-no-change rule before any file edits.

- A new feature or enhancement after Done → new **Story** (or suitable Task), native **Relates** to original feature.
- A later defect discovered after Done → new **Bug**, native **Relates** to original feature; do not retroactively rewrite old acceptance results.
- A new copy refinement after Done → new **Task**, native **Relates** if it changes or extends that completed original. Several coherent minor edits can share this **new** Task under the existing batching rules.
- Accidental closure or material historical correction → request explicit owner approval to reopen/edit; record who approved it, what changed and why in a new Jira Comment. Preserve earlier evidence.
- A Jira Comment or native link may be appended to the original Done Ticket to point to follow-up work. Do **not** overwrite the closed issue's descriptions just to mention the new ticket.

### Native issue links and accurate direction

BuddhaConnect's configured Jira issue link types were checked and include **Blocks**, **Relates**, **Duplicate**, and **Cloners**. Read site metadata before linking instead of assuming types or direction.

| Relationship | Native mechanism | When to use |
| --- | --- | --- |
| Follow-up enhancement of original feature | Relates | BUD-21 relates to BUD-20 (example only) |
| Bug affecting original feature | Relates | New Bug relates to original feature |
| A must complete before B can proceed | Blocks | **A blocks B**; on B display **is blocked by A** |
| Two Jira issues cover the same work | Duplicate | Link the true duplicate and keep a canonical issue |
| One issue is an actual copy of another | Cloners | Only when cloning has really occurred |
| Large feature divided into deliverables | Parent / Epic | Use Jira hierarchy, not an arbitrary issue link |
| Business urgency or scheduling importance | Priority field | Use Highest / High / Medium / Low / Lowest as available, with rationale when important |

**Don't misuse Blocks.** B being related to A, or A having higher Priority, does not prove B is blocked by A. Use Blocks only for a concrete prerequisite that affects implementation, verification or release. Before changing status, inspect unresolved blockers; don't claim an issue is ready for release or accepted if its actual acceptance depends on an unfinished issue.

**Link creation checklist:** search existing tickets → identify the original/parent/blocker → choose the strongest truthful relation → check exact issue keys → check Blocks direction → create the native link → confirm it exists → log a short English Comment. Avoid duplicate/spurious links and avoid altering completed descriptions.

### Illustrative change request example

~~~text
Original ticket: BUD-20 — Add Virtual Wooden Fish — Done
New ticket: BUD-21 — Add Auto-Tapping Mode — To Do
Relationship: BUD-21 relates to BUD-20

BUD-21 change details:
- Previous behavior: manual tapping and audio.
- Requested change: optional auto-tapping mode.
- Why: make repetitive practice easier.
- Acceptance: new control can start/stop auto-tapping; existing manual tapping remains intact.
- Impact: UI behavior and sound control.
~~~

These keys are illustrative, not actual tickets. On **BUD-20**, add a short Comment such as "Follow-up enhancement tracked in BUD-21" only after creating the real issue and confirming its link. Leave the old Description and English Description untouched.

### Example: priority is not dependency

~~~text
BUD-31 (High Priority) — Improve search results
BUD-32 (Medium Priority) — Add search filters
If filters require the improved search API: BUD-31 blocks BUD-32.
If filters work independently: no Blocks link; use Relates only if helpful.
~~~
