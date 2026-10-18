# BuddhaConnect autonomous AI development pipeline (BUD-25/26/27)

## Delivery state

The repository contains an opt-in Jira-to-UAT pipeline. It remains **dry-run by default**. Live mode processes at most one eligible `BUD` issue per run, creates an isolated branch and pull request, relies on the existing PR checks, and can merge only a narrowly classified low-risk PR. A successful merge is deployed by the existing GitHub Pages workflow; Jira moves to `In QA` only after that workflow succeeds and the UAT homepage returns HTML.

The pipeline never invokes `.github/workflows/release-prod.yml`, writes the `production` branch, calls Hostinger, or claims a Production deployment. Production Publish and Rollback remain owner-approved workflows.

## Execution flow

1. `.github/workflows/ai-dev-intake.yml` runs hourly or manually. Schedules remain dry-run unless `AI_DEV_LIVE_ENABLED=true`.
2. Jira intake accepts only `BUD` Task/Bug/Story issues with `ai-ready`, status `To Do` or `Ready for AI`, a meaningful description, and no high-risk keywords. Open PR keys are excluded and the oldest eligible key wins.
3. Live mode verifies all required credentials, transitions the ticket to `In Build`, records an English activity comment, and creates `ai/BUD-N-...` from current `master`.
4. Pinned Gemini CLI runs headlessly with `auto_edit`, not shell-command approval. Its child environment contains the Gemini key but no GitHub or Jira credential. Checkout does not persist a Git credential.
5. Every attempt is checked for protected paths, symlinks, binary files, at most 20 files and at most 1,200 changed lines. The runner then executes all Node tests, repository checks, `npm run check`, and `npm run build`. Verification failures can be returned to the agent for a bounded retry.
6. A successful local result is committed and pushed using the dedicated automation credential, then a Jira-keyed PR is opened. CI is triggered by that external credential; using the workflow `GITHUB_TOKEN` for PR creation would suppress downstream workflow events.
7. `.github/workflows/ai-dev-reconcile.yml` retries failed jobs from `PR quality checks` once for transient failures. It never loops indefinitely. A low-risk PR is merged only when explicit auto-merge is enabled, all configured required checks report success, and GitHub accepts the normal merge without a bypass option.
8. The existing `deploy.yml` deploys merged `master` to GitHub Pages UAT. `.github/workflows/ai-dev-uat-finalize.yml` verifies the successful workflow and HTTP/HTML response, records evidence in Jira, and transitions the issue to `In QA`.

## Required configuration

Configure these in GitHub repository Settings → Secrets and variables → Actions. Start with `AI_DEV_LIVE_ENABLED=false` and manually run dry-run mode first.

### Variables

- `JIRA_BASE_URL`: exact Atlassian site, for example `https://huangguanqiao.atlassian.net`.
- `AI_DEV_LIVE_ENABLED`: `true` only after credentials, branch rules, Jira transitions and a dry run are verified.
- `AI_DEV_AUTO_MERGE_ENABLED`: separately set `true` to delegate low-risk merges. Keep false until branch protection is confirmed.
- `AI_MODEL`: optional Gemini model identifier; default `gemini-2.5-flash`.
- `AI_MAX_ATTEMPTS`: optional `1`–`3`; default `2`.
- `AI_REQUIRED_CHECKS`: optional comma-separated check-run names. Default: `Astro check and production build,Verify BUD issue and PR identity,validate`. Keep synchronized with branch protection.
- `UAT_URL`: optional; default `https://code.buddhaconnect.com/`.

### Secrets

- `JIRA_EMAIL` and `JIRA_API_TOKEN`: a dedicated least-privilege Jira identity allowed to read BUD issues, comment and perform only the `In Build` / `In QA` transitions.
- `GEMINI_API_KEY`: a dedicated Gemini API key. Gemini CLI is selected because an API-key free tier may be available, but quota, data handling and billing depend on the connected Google account and must be verified before live mode. A consumer Gemini subscription is not proof of API entitlement.
- `AI_GITHUB_TOKEN`: preferably a short-lived GitHub App installation token; a fine-grained PAT is supported as the initial interface. Scope it only to this repository with Contents read/write, Pull requests read/write, Issues read/write, Actions read/write, and Metadata read. Use a non-admin automation identity with no branch-protection bypass and no access to Production environments.

GitHub App token minting is not implemented in-repository because it requires an owner-created App ID/private key. Replacing the fine-grained PAT with a short-lived App token is the recommended hardening step.

## Safety and risk classification

The agent cannot modify:

- `.github/`, `source/`, `AGENTS.md`, package manifests/lockfiles;
- the AI pipeline itself or canonical governance documents;
- environment, credential, secret or private-key paths.

Only ordinary application code, non-content tests and static images can be classified as low risk. Articles, documentation and any other allowed-but-not-low-risk change create a `risk:manual` PR and cannot auto-merge. CI/CD, authentication, permissions, credentials, database migrations, copyright/legal/payment work, Production and Hostinger requests are rejected at intake.

The label and keyword gates are defense in depth, not a general prompt-injection solution. Only trusted project maintainers should add `ai-ready`. Generated code still requires the repository's independent CI and normal audit trail.

## Failure and idempotency behavior

- One repository-wide concurrency group prevents overlapping intake runs.
- Open PRs containing the Jira key block duplicate selection.
- Missing credentials, malformed Jira responses, unavailable transitions, protected changes, oversized diffs and failed verification stop closed.
- Agent/test repair attempts are capped at three. GitHub failed-job retry is capped at one and tracked by `ai-ci-retries:N` labels.
- A failed run records a Jira blocker when possible and never reports implementation, merge, UAT or Production success.
- A claimed ticket remains `In Build` after a non-CI implementation failure for human diagnosis; a maintainer must deliberately return it to an eligible state before another intake.
- `workflow_run` reconciliation always checks same-repository `ai/BUD-*` branches and `ai-generated` labels before privileged actions.

## Verification commands

```sh
npm ci --no-audit --no-fund
node --test tests/*.test.mjs
node scripts/check-repository.mjs
npm run check
npm run build
```

These local checks do not prove that GitHub Actions, Jira writes, Gemini quota, branch protection, merge, or UAT deployment will succeed. Live end-to-end verification requires repository credentials and an intentionally labelled low-risk test ticket.

The current recovery policy gives the coding agent bounded local repair attempts, then retries a failed GitHub job once to cover transient runner failures. It does not give a privileged agent GitHub/Jira credentials during post-PR recovery. A deterministic CI failure after that retry is intentionally handed to a human. Provider-side quota/budget limits must also be configured on the Gemini API project; repository timeouts and attempt caps are not a billing guarantee.
