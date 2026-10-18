# GitHub → Confluence policy navigation synchronization

**BUD-17:** This is a guarded **proposal**, not currently an activated scheduled sync.

The authoritative engineering policy is GitHub `master` Markdown, read by **both humans and AI**. Confluence is the human-facing navigation and explanation layer. Jira is the requirements, approvals, and event audit system.

## Security and data ownership

The job updates only pages in an **explicit allowlist**, never finds pages by title, never creates replacement pages and never updates manually maintained Confluence pages. An existing page must already have the exact `BC_GITHUB_SYNC_MANAGED_V1` marker and an exact configured title. Existing human-authored BuddhaConnect pages must remain human-owned and are **not** safe targets for this script. Use a new, dedicated auto-managed page after approval.

The script builds a readable Confluence index with links pinned to the exact `GITHUB_SHA`. It intentionally does **not** copy entire normative policies to Confluence, preventing stale duplicate text and Markdown conversion losses. The marker, title and version checks protect against accidental overwrite, and Confluence's version number acts as optimistic concurrency control. A rerun for the same commit returns without writing duplicate versions.

## Before activation (administrator setup)

1. Obtain **human approval for BUD-17**, then merge the high-risk GitHub Actions PR.
2. Create a dedicated Confluence page (under the correct project Space) that contains `BC_GITHUB_SYNC_MANAGED_V1` and no irreplaceable manually curated content. Verify it is clearly identified as machine-owned. Record its numeric page ID.
3. In GitHub Actions, add repository **secret** `CONFLUENCE_API_TOKEN` and **variable** `CONFLUENCE_EMAIL` for a least-privilege Confluence identity that can only edit the intended Space/pages.
4. Add GitHub Actions repository variable `CONFLUENCE_SYNC_MAPPING` as JSON:
   ```json
   {"pages":[{"pageId":"<NUMERIC_PAGE_ID>","title":"<EXACT_MANAGED_PAGE_TITLE>","sources":["AGENTS.md","docs/ENGINEERING_GOVERNANCE.md","docs/JIRA_WORKFLOW.md"]}]}
   ```
5. Verify protected master branch rules. The workflow runs only for approved `master` changes to policy files, with no PR code execution and no production deploy rights.
6. Trigger one controlled update; inspect GitHub Actions logs and Confluence page version/commit marker. If the step fails or credentials are missing, record `Pending Sync` against the related Jira task with the source commit.
7. Maintain a separate human-oriented Confluence overview (existing BC pages), linking to this managed index. Do not silently overwrite human-owned content.

## Limitations

- A successful GitHub policy merge does not imply Confluence is synced until a run verifies its update.
- This script does not create a Jira Pending Sync Comment automatically. Failure is observable as a failed GitHub Actions run; operators must track outstanding sync work in Jira unless a separate authenticated notification rule is configured.
- Concurrent manual page edits may cause a Confluence version conflict; stop and reconcile rather than overwrite.
- Do not confuse repository secrets with Confluence space access/role configuration; changes require a real administrator action.
- Copy this implementation to other projects only after changing the site endpoint, project allowlist and source paths under an active destination-project Ticket.
