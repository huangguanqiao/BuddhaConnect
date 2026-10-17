# BuddhaConnect: one-click promotion from UAT to Production

## Deployment topology

- One public GitHub repository: `huangguanqiao/BuddhaConnect`.
- `master`: Astro source; automatic `.github/workflows/deploy.yml` build + GitHub Pages deployment to `code.buddhaconnect.com`.
- Each UAT workflow run archives **the same built `dist/` directory** as the deployable `uat-dist` artifact, retained for up to 90 days.
- `production`: generated website files only; **never merge source code into this branch**.
- Hostinger: configure Git deployment to pull `production` to `buddhaconnect.com` document root, once verified.

## One-click production publication

1. Merge changes into `master`, wait for the **Build and deploy Astro to GitHub Pages** Action to finish successfully, and test the site at `code.buddhaconnect.com`.
2. Open GitHub > Actions > **Publish current UAT build to Production** > **Run workflow**, selecting `master`. There is **no SHA to type**.
3. The job finds the **latest UAT workflow run** on `master`. If it is still running or failed, publishing stops. The job also stops if that run's `uat-dist` artifact has expired or is missing.
4. The Action downloads the exact static files built for that UAT run **without running another build**, verifies they contain the Astro site, and publishes them to `production`.
5. Verify that Hostinger has actually pulled and deployed `production`, then smoke-test the live site. A green GitHub Action only confirms that the branch was updated, not that the production host deployed it.

**Important**: Press Publish only after the latest successful UAT deployment is the one you actually tested. If new UAT changes arrive while you are testing, retest the latest run. This workflow has no separate automated human-test-signoff record. Do not release during an in-progress UAT deployment.

## Automatic Promotion record

After a successful manual Publish, the workflow creates a GitHub Release titled
`[Promotion] PRD YYYY-MM-DD` (Australian local date). It uses a unique tag
`prd-YYYY-MM-DD-run-N`, so multiple publishes on the same date are allowed.

The Release Description includes merged GitHub PR titles and links where available,
a comparison link back to the previous recorded release, the UAT workflow run,
source SHA, production branch commit and a rollback reference. Existing release
records are left unchanged. The first release has no previous tagged baseline,
so its automatic PR list may be limited to PRs associated with the current source
commit; it never fabricates Jira ticket links. Jira ticket references can be
included in feature PR titles/descriptions, or added to the release notes manually.

This records a push to the Production Git branch; it is NOT proof that Hostinger
finished deployment. Verify the live website separately. Find records at
GitHub > Releases. Rollback does not rewrite or delete past Release records.

## Safe Hostinger cutover

1. Inspect existing Hostinger Git integration: branch, directory, auto-deploy, and site type. Back up current web root.
2. Stop any automatic syncing of `master` into the public Hostinger document root; it contains unbuilt Astro source.
3. The `production` branch is created only when the first manual Publish Action runs. Hostinger branch switching may need to happen after that first run.
4. Point Hostinger Git deployment to `production`. The public document root should directly contain `index.html`, `_astro/`, and site files, **not** a nested `dist/` folder.
5. Verify how Hostinger handles overwritten and deleted files, whether auto-deploy truly triggers on `production` updates, and whether any webhook requires configuration. If needed, perform a Hostinger Git pull/deploy manually until auto-deploy is verified.
6. Keep UAT on GitHub Pages throughout. Avoid serving production from a directory also managed by another Git integration.

## Rollback: previous or any retained Promotion Release

Open GitHub > Actions > **Rollback Production (previous or Release Tag)**, choose branch `master`, and select one of these modes:

- **previous** (default): no tag required; restore the immediately preceding Production commit's complete file tree. A second rollback may restore the version you just rolled back from.
- **release_tag**: copy an exact `prd-YYYY-MM-DD-run-N` tag from [GitHub Releases](https://github.com/huangguanqiao/BuddhaConnect/releases), paste it into `release_tag`, then click Run workflow. The selected Release's complete original static files are restored.

The workflow checks that a requested tag corresponds to a published GitHub Release, belongs to the current Production Git history, includes `index.html` and Astro static assets, and differs from the current Production snapshot. It then creates a **new** commit on `production` containing the selected snapshot's file tree. It never rewrites Git history, merges source code, or changes UAT. Hostinger should automatically sync this update, but you must confirm the live site's pages and assets afterward.

**Limitations:** Only releases whose tagged Production commits are still reachable in the current branch history can be selected. Older deployments created by `force_orphan: true` may have no available history or tag. The default `previous` option restores the preceding *commit*, which may itself be a rollback rather than a standard promotion. GitHub Releases are used as immutable version selectors here; never repoint or delete a tagged Release you might need for recovery. Files and database changes outside the versioned static website are not reverted.

**Safety:** Rollback is an intentional Production write. Its Action run should be restricted to trusted maintainers. An error/no-op leaves Production unchanged. Review the GitHub Action summary and confirm Hostinger's actual deployment afterward. No additional Build step is involved.

## Operational considerations

- GitHub Actions build-artifact retention is limited. A recent UAT build must still be available for one-click publication.
- A `package-lock.json` is currently absent. Add it and use `npm ci` to stabilize future UAT builds, although promotion of the **same UAT artifact** already avoids a second dependency resolution.
- Only trusted maintainers should be permitted to publish. The production job uses a GitHub Environment named `production`; configure reviewers and branch restrictions according to your plan's support.
- GitHub workflow permissions must allow Actions to write repository contents for the `production` branch. Review branch protection/rulesets and GitHub Actions workflow permissions if publication fails.
- Check GitHub Pages and Environment features before converting the repository from Public to Private under GitHub Pro.

## CI/CD reliability hardening

- Publishing requires the latest successful GitHub Pages deployment to match the current `master` commit. If a new merge occurs before or during publication, the Production workflow stops, rather than silently publishing an untested build.
- Before writing to `production`, the workflow rechecks that the same UAT run remains the latest and succeeded.
- Rollback run summaries safely escape literal Markdown backticks, avoiding accidental Bash command substitution after production has already changed.
- This repository currently lacks `package-lock.json`, so UAT temporarily continues using `npm install`. To generate a real lockfile using npm's dependency resolver, run **Generate reproducible npm lockfile** once via GitHub Actions on `master`. The workflow pushes `chore/npm-lockfile`, to be reviewed and merged with a PR. Then update UAT to `npm ci --no-audit --no-fund`. Do not switch UAT to `npm ci` before the lockfile is committed.
- Changing the workflows alone does not run Publish or Rollback. Verify the next UAT deployment and test a safe release before relying on the new checks.
