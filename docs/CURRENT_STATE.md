# Current State and Handoff

Last documentation review: 2026-10-19.

## Confirmed
- Repository default branch is master.
- Astro 5 static site scaffold is present.
- Three sample Markdown articles currently exist: impermanence.md, mindful-moment.md and what-is-buddhism.md.
- Content schema supports title, description, date and category.
- Original source/ folder remains in place.
- GitHub Pages UAT on `master` and the independent `production` branch / Hostinger Git workflow have been manually confirmed in the earlier release setup.
- Jira `BUD` project and bilingual issue conventions are in use; repo policy is in `AGENTS.md` and `docs/JIRA_WORKFLOW.md`.
- BUD-6 introduces PR quality checks and post-Publish live-site checks; runtime success still needs confirmation after merge.
- BUD-25/BUD-26 provide fail-closed Jira intake and dry-run tests. BUD-27 adds a default-off, credential-gated AI branch/PR pipeline with bounded retries, protected-path checks, low-risk merge gates and GitHub Pages UAT/Jira reconciliation; live execution still requires repository configuration and an end-to-end test ticket.
- BUD-28 refactors the public site on its feature branch into one locale-first information architecture with a shared responsive design system, accessible language dropdown, integrated static search and safe legacy-route redirects. Merge and GitHub Pages UAT validation remain pending.

## Not yet verified
- Editorial verification of sample articles.
- GitHub PR merge enforcement (branch/ruleset settings), Jira API credential configuration and automated Jira status updates.
- New PR checks and Hostinger smoke test passing on real GitHub Actions executions.
- BUD-27 live-mode credentials, non-admin automation identity, exact required-check names, Gemini quota and end-to-end Jira-to-UAT execution.
- Automated editorial validation or content approval process.
- Traditional Chinese and English article editions. Their localized UI is complete, but their article lists intentionally remain empty until real reviewed translations exist.
- Reviewed scripture content, a scripture search index and public Buddhist tools; these unfinished sections are intentionally absent from primary navigation.
- BUD-22 Notion database credentials, page-body sync and end-to-end synchronization evidence.

## Next steps
1. Confirm new PR quality workflow is green and enable required checks in GitHub branch rules.
2. Verify the Production smoke test with a separately approved Publish; do not declare success solely from a branch update.
3. Confirm editorial audience, source rights, language and citation standards.
4. Pilot one new article through research → draft → source review → PR → human approval.

For task-specific work, PRs and issues are the live handoff record; do not treat this file as a real-time task board.
