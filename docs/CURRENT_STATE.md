# Current State and Handoff

Last documentation review: 2026-10-18.

## Confirmed
- Repository default branch is master.
- Astro 5 static site scaffold is present.
- Three sample Markdown articles currently exist: impermanence.md, mindful-moment.md and what-is-buddhism.md.
- Content schema supports title, description, date and category.
- Original source/ folder remains in place.
- GitHub Pages UAT on `master` and the independent `production` branch / Hostinger Git workflow have been manually confirmed in the earlier release setup.
- Jira `BUD` project and bilingual issue conventions are in use; repo policy is in `AGENTS.md` and `docs/JIRA_WORKFLOW.md`.
- BUD-6 introduces PR quality checks and post-Publish live-site checks; runtime success still needs confirmation after merge.

## Not yet verified
- Editorial verification of sample articles.
- GitHub PR merge enforcement (branch/ruleset settings), Jira API credential configuration and automated Jira status updates.
- New PR checks and Hostinger smoke test passing on real GitHub Actions executions.
- Automated editorial validation or content approval process.

## Next steps
1. Confirm new PR quality workflow is green and enable required checks in GitHub branch rules.
2. Verify the Production smoke test with a separately approved Publish; do not declare success solely from a branch update.
3. Confirm editorial audience, source rights, language and citation standards.
4. Pilot one new article through research → draft → source review → PR → human approval.

For task-specific work, PRs and issues are the live handoff record; do not treat this file as a real-time task board.
