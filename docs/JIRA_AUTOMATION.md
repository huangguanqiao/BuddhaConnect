# GitHub ↔ Jira automation setup (BuddhaConnect)

All change governance rules remain in [AGENTS.md](../AGENTS.md) and [JIRA_WORKFLOW.md](JIRA_WORKFLOW.md). **Do not expose Jira API tokens in code, Comments or pull requests.**

## PR gate

The trusted-base `.github/workflows/jira-pr-gate.yml` runs with `pull_request_target` for PR metadata only. It **does not** check out or execute PR contents. It checks that both:
- The PR title starts with `[BUD-N]`, for example `[BUD-10] ci: Add Jira gate`.
- The source branch includes the same BUD key, for example `BUD-10-jira-pr-audit`.

When Jira credentials are present, it additionally verifies the actual Jira issue exists, belongs to BUD and has not reached a terminal Done status. A follow-up to Done must use a new linked Jira ticket.

If Jira integration is not yet configured, the gate still rejects malformed PR title/branch pairs. It prints a clear warning that **live Jira verification was NOT performed**. For fail-closed behavior, enable strict mode below.

## Configure Jira credentials (repository settings)

Create a dedicated, low-privilege Jira automation identity where possible. It needs permission to **browse BUD issues** and **add comments**. Do not grant project administration or delete access solely for this automation. Use a separate identity/token from human or AI interactive credentials if possible.

In **GitHub → Repository Settings → Secrets and variables → Actions**, add:

| Type | Name | Value |
| --- | --- | --- |
| Repository variable | `JIRA_EMAIL` | Email address of the Jira automation identity |
| Repository secret | `JIRA_API_TOKEN` | Token belonging to that identity |
| Repository variable | `JIRA_STRICT_CHECK` | `true` to fail PR checks if credentials are missing |

The URL is fixed to `https://huangguanqiao.atlassian.net` and the project to `BUD` in the workflows, so an untrusted PR cannot redirect secrets to an arbitrary host.

**Security:** `pull_request_target` is safe here only because the jobs do not checkout, evaluate, import or run PR code; keep this invariant. Never copy these Jira secrets into the regular `pull_request` build job.

## Jira PR activity log

`.github/workflows/jira-pr-activity.yml` adds a Jira Comment on PR **opened**, **merged** or **closed without merging**. Each activity has a deterministic `[github-pr-event:...]` marker to reduce duplicate comments on retries. It does not rewrite Description, English Description, AI Prompt, Pull Requests or ticket status.

The activity identifies the actual GitHub PR actor and separately labels the reporting system as `GitHub Actions`. It is **not** an independent human review, UAT acceptance or Production verification.

If secrets are absent, the workflow clearly warns and **does not write Jira Comments**. Failed writes appear in the GitHub Actions run so an operator can investigate. The marker lookup provides best-effort idempotency; concurrent runs can still race, so treat the native Jira activity history as authoritative.

## Required GitHub protection settings (manual admin action)

These rules cannot be assumed active merely because workflows exist. In **GitHub → Settings → Rules → Rulesets** (or Branch protection), configure:

1. Target `master`: require PRs before merging, require the `Astro check and production build` status and the `Verify BUD issue and PR identity` status after each has been observed in GitHub Actions; restrict direct pushes and review bypass exceptions.
2. Target `production`: prohibit general direct pushes and force pushes. The existing approved Production Publish/Rollback workflows must still be able to update this branch. Test the actor/bypass arrangement before enforcing, or Hostinger release could break.
3. Configure **Settings → Environments → production** with required reviewers / approval if available on the repository's plan and visibility, and restrict the allowed branch to `master`. Review existing environment protection before editing.
4. For a genuinely protected two-party review, ensure the approver is a different authorized person; multiple AI identities using one GitHub account do not provide independent approval.

**Important:** Some GitHub protection and required-review settings depend on repository visibility and subscription. Check current GitHub settings before treating these as enforceable.

## CI and deployment acceptance

- `pr-quality.yml` runs `npm ci`, `npm run check` and `npm run build` before a source PR can merge (when its status check is required in the ruleset).
- Merging to `master` triggers GitHub Pages UAT, but that alone is not a human UAT acceptance.
- Production Publish remains explicitly manual. The live smoke check in `release-prod.yml` retries for Hostinger synchronization and checks HTML equality against the UAT artifact and referenced assets. A failed live smoke check means **Production verification failed/pending**; it **does not undo the Production push automatically**.
- A published GitHub Release can initially state verification pending. Record `Verified live` only after the live test passes, and only mark Jira Done when the applicable acceptance criteria are fulfilled.

## First activation checklist

- Merge the BUD-6 and BUD-10 implementation PRs.
- Run a test PR with a **real active BUD key**; check both quality and Jira gate jobs.
- Configure Jira automation identity, `JIRA_EMAIL` variable and `JIRA_API_TOKEN` secret. Set strict mode true; verify the Jira issue's actual nonterminal status is checked.
- Verify a PR opened/merged Comment is written **once** (and contains date, actor, link and event marker).
- Enable GitHub Ruleset required checks only after they exist and run green; verify a malformed PR is blocked.
- Confirm Production environment approval/branch rules without disabling manual Publish/Rollback.
- With explicit owner approval, perform a low-risk Production release and verify that the Hostinger live smoke check passes; never use a test release without that approval.


## Verified Production Release → Jira evidence (BUD-13)

The trusted `.github/workflows/jira-production-audit.yml` runs **only after the manual Production Publish workflow completes successfully**. It finds that exact run's GitHub Release by the `-run-N` tag suffix, requires the Release to say `Verified live on Hostinger`, and extracts BUD keys from the actual merged PR summaries included in the Release.

For each matching ticket, it writes a single English Production Deployment Comment including the Release URL/tag, workflow run and verified Hostinger smoke result. The comment carries a deterministic `github-production-release` marker for best-effort deduplication and leaves original Jira descriptions untouched, even if an issue is Done.

**This does not mark Jira Done**, update the ticket's `Pull Requests` field, or infer missing PR/Jira relationships. If the GitHub Release contains no PRs with recognizable BUD keys, no associations are invented. Missing Jira credentials result in a warning, not a claim that records were written. A successful GitHub Release does not prove the Jira automation has run.

End-to-end acceptance requires a separately approved live Production Publish with configured Jira credentials and confirmation that the appropriate Jira Comment exists. Review the GitHub Actions job logs for any failures.
