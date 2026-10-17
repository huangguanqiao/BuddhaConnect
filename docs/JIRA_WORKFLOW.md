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
