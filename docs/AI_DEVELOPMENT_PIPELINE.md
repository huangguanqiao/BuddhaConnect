# BuddhaConnect autonomous AI development pipeline (BUD-25/26/27)
## Current implementation
GitHub Actions runs an **hourly read-only Jira intake**, plus manual workflow dispatch. This is a **foundation**, not a working coding agent. It makes **no** Jira mutations, GitHub PRs or UAT deployments. Without credentials it safely reports `configured:false`.
## Configuration (GitHub Actions)
- Repository variable `JIRA_BASE_URL`: e.g. `https://your-site.atlassian.net` (no trailing slash).
- Repository secrets `JIRA_EMAIL` and `JIRA_API_TOKEN`: dedicated least-privilege Jira automation identity, never commit credentials.
- Workflow `AI development intake (read only)` executes hourly at minute 17. GitHub scheduled workflows can be delayed or skipped.
- Add `ai-ready` only to a BUD Task/Bug/Story with clear acceptance criteria, status To Do or Ready for AI. No labels are automatically applied.
## Safety
- Fail-closed project and label filters, allowlisted issue types and statuses.
- Excludes obvious sensitive/high-risk requests; keyword checks are only a first layer, **not** adequate AI safety review.
- At most one selected issue per run; no retries or billing charges from AI APIs.
- Dry run only. Never claim that a Jira issue is implemented from a successful intake.
- `node --test tests/ai-dev-intake.test.mjs` validates eligibility and read-only API usage.
## Next phase (BUD-27)
1. Choose and verify a cloud coding-agent provider with actual headless/API access and pricing; do not assume a ChatGPT/Claude subscription includes API usage.
2. Add an isolated agent runner, capped token/budget/runtime and attempts, with narrow repository permissions. Explicitly block secrets, protected files, production deploy workflows and credential changes.
3. Use GitHub App or limited token for creating branches and PRs; ensure idempotency and audit by Jira key.
4. Required CI (Astro check, tests, build, security) must pass before auto-merge. No self-generated review approvals.
5. Confirm GitHub Pages UAT deployment and evidence, then update Jira In QA. Do not mark Done solely because build passed.
6. Production remains a separate human-gated Repo 2 → Hostinger promotion.
## Future risks
A Jira API token is an external credential; store it only in GitHub Actions secrets. GitHub-hosted runners and AI APIs may incur costs. Verify Jira plan, rate limits and GitHub Actions allowance before enabling paid execution.
