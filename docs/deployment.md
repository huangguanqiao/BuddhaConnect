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

## Safe Hostinger cutover

1. Inspect existing Hostinger Git integration: branch, directory, auto-deploy, and site type. Back up current web root.
2. Stop any automatic syncing of `master` into the public Hostinger document root; it contains unbuilt Astro source.
3. The `production` branch is created only when the first manual Publish Action runs. Hostinger branch switching may need to happen after that first run.
4. Point Hostinger Git deployment to `production`. The public document root should directly contain `index.html`, `_astro/`, and site files, **not** a nested `dist/` folder.
5. Verify how Hostinger handles overwritten and deleted files, whether auto-deploy truly triggers on `production` updates, and whether any webhook requires configuration. If needed, perform a Hostinger Git pull/deploy manually until auto-deploy is verified.
6. Keep UAT on GitHub Pages throughout. Avoid serving production from a directory also managed by another Git integration.

## Rollback

Production is now published with `force_orphan: false`, preserving the previous file snapshot as the parent commit. After a new UAT-tested build is published with this configuration, the previous Production snapshot becomes eligible for rollback.

One-click rollback procedure:

1. Open GitHub > Actions > **Rollback Production to previous release**.
2. Choose `master` and click **Run workflow**. There are no SHA or version inputs.
3. The workflow reads the previous commit on the `production` branch, creates a **new production commit** containing exactly the previous commit's files, and pushes it to `production`.
4. Hostinger should automatically sync the updated branch. Verify `buddhaconnect.com` and its assets. UAT remains unchanged.

The rollback uses the **previous production commit**, not an earlier UAT build. It refuses to run if no parent snapshot exists, or if the previous snapshot has identical file contents. Running rollback a second time can restore the version that was current immediately before the first rollback (toggle behavior).

**Migration warning:** The old deployment configuration used `force_orphan: true`, which discarded production branch ancestry. The currently live production version does **not** have an available parent from earlier releases. To test rollback, first publish a *new* UAT-tested change after this PR is merged. That publish will preserve today's live version as the previous snapshot. Then run the Rollback workflow to restore it.

Git history on `production` is retained going forward, but keep periodic backups or immutable tagged releases for disaster recovery. This workflow restores versioned Git files; check Hostinger synchronization and any files outside the repository separately.

## Operational considerations

- GitHub Actions build-artifact retention is limited. A recent UAT build must still be available for one-click publication.
- A `package-lock.json` is currently absent. Add it and use `npm ci` to stabilize future UAT builds, although promotion of the **same UAT artifact** already avoids a second dependency resolution.
- Only trusted maintainers should be permitted to publish. The production job uses a GitHub Environment named `production`; configure reviewers and branch restrictions according to your plan's support.
- GitHub workflow permissions must allow Actions to write repository contents for the `production` branch. Review branch protection/rulesets and GitHub Actions workflow permissions if publication fails.
- Check GitHub Pages and Environment features before converting the repository from Public to Private under GitHub Pro.
