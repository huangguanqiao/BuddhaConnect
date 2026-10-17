# BuddhaConnect production deployment (single repository)

## Current topology

- Source branch: `master` (Astro source, public repository).
- UAT: GitHub Actions `.github/workflows/deploy.yml` builds `dist/` and publishes it to GitHub Pages at `code.buddhaconnect.com`.
- Production artifact branch: `production` (generated site files only, **not** a merge target). It is created on the **first approved manual release**, not when this PR is merged.
- Production host: Hostinger for `buddhaconnect.com`, only after its Git deployment is explicitly pointed at the `production` branch and the correct document root.

## Set up Hostinger before your first release

1. Record the current Hostinger site contents and take a backup.
2. Inspect the existing Git integration: repository URL, selected branch, deployment directory, and auto-deployment status.
3. Ensure Hostinger does **not** automatically publish the source branch `master` to the live document root.
4. Choose `production` as the selected Git branch after it exists (Hostinger may require the first build to create it).
5. Configure the document root to contain the generated `index.html`, `_astro/` and other `dist/` files, **not** a nested `dist` folder. Verify Hostinger's deployment behavior for replacing old files.
6. Confirm there is no conflict between a Hostinger Git sync and any manual file management. Do not upload secrets or Node source code to the public web root.

## Release procedure

1. Merge the feature PR to `master`; verify `deploy.yml` completes and inspect UAT.
2. Record the **full 40-character commit SHA** for the version successfully tested on UAT.
3. Open Actions > **Release approved Astro build to production branch** > Run workflow, choose branch `master` and paste the SHA.
4. The action verifies the commit belongs to `master`, checks it out, builds Astro, and commits **only** the contents of `dist/` to `production`.
5. On the first run, the action creates `production`. Connect Hostinger to that branch and test its behavior. On subsequent runs, confirm Hostinger Git auto-deploy is working; otherwise initiate the host's own deployment.
6. Verify production web pages and assets after the host has deployed. The GitHub action succeeding only proves that the output branch was updated; it does **not** prove Hostinger is live.

Important: the source repository currently has no `package-lock.json`. Until a lockfile is committed and `npm ci` is used consistently in **both** UAT and production, the production build can resolve different dependency versions from an earlier UAT build. Add a lockfile and switch UAT to `npm ci` before relying on byte-for-byte parity. Prefer promoting a verified immutable build artifact for stronger guarantees.

## Rollback

Use the same manually triggered workflow with the 40-character SHA of a previously validated `master` release, then confirm Hostinger has deployed it. Do not merge `master` into `production`, and do not manually edit generated files. The publish action uses an orphaned production commit each run; retain release SHAs/tags or GitHub Releases separately, rather than relying on the production branch history for rollback.

## Security

- Keep production publishing manual, with repository workflow access restricted to trusted maintainers.
- Public GitHub Actions logs and the `production` branch contain no deployment secrets.
- A repository Environment named `production` can be configured with reviewers if supported for the repository visibility and account plan.
- Before changing the repository to private, verify GitHub Pages and deployment approval eligibility on the new plan.
