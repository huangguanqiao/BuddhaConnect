# BuddhaConnect Engineering Governance

**Status:** Canonical policy on GitHub `master`. **Change Ticket:** BUD-14. **Audience:** Project owner, developers and all AI agents.

This document expands the hard rules in [AGENTS.md](../AGENTS.md). For Jira field semantics see [JIRA_WORKFLOW.md](JIRA_WORKFLOW.md), and for CI credentials see [JIRA_AUTOMATION.md](JIRA_AUTOMATION.md).

## 1. Authority and precedence

| Concern | Authoritative system | Consumer / record |
| --- | --- | --- |
| Engineering rules | GitHub `master` — `AGENTS.md` and linked standards | Confluence human-readable hub |
| Requirements and acceptance | Jira BUD issue, Chinese Description and English Description | GitHub PR references |
| Source code and review | GitHub PR and commit history | Jira Pull Requests and Comments |
| CI outcomes | GitHub Actions job results | Jira evidence comments |
| Release artifact and tag | GitHub Actions/Release and `production` history | Jira deployment record |
| Live production state | Actual Hostinger-served site, verified independently | Release Verified live and Jira activity |
| Editorial source claims | Verified and permitted source material | Editorial documentation and PR |

When sources conflict, **do not guess or silently synchronize the wrong direction**. Confirm the authoritative record, open or reuse a BUD issue for a correction, and record the reconciliation.

## 2. Change intake, review and merge authorization

**No ticket, no change** — even small content or documentation edits. Read the ticket, look for duplicates and dependencies, and keep Done/Closed issue descriptions as historic baselines. Record approval, testing and changes with actual actor attribution.

| Risk | Examples | Minimum review before source merge |
| --- | --- | --- |
| Low | Local typo, punctuation, isolated non-sensitive documentation | AI may merge after successful mandatory CI and Jira gate **only when the owner has delegated autonomous low-risk merges**, the PR meets agreed scope, and GitHub rules permit it |
| Medium | New UI feature, component, interactive practice tool, new editorial article | PR CI, acceptance evidence, scope/dependency review; independent human review or explicit owner-delegated AI merge policy as appropriate to content risk |
| High | Authentication, privacy, sensitive data, security, dependencies with broad impact, CI/CD or GitHub Actions, publishing infrastructure, permissions, large editorial imports | **Explicit human approval before merge**; document risk, verification and rollback |
| Critical | Production incident, security breach, unauthorized access, broken payment or severe content-integrity issue | Incident ticket, contained emergency exception, explicit owner/authorized operator approval, restore service then retrospective review |

**Default:** AI creates PR and performs checks, but **does not assume standing authority to merge high-risk PRs**. A user authorizing a particular implementation does not automatically authorize unrelated future Production releases. Never bypass Rulesets, required checks or explicit environmental approvals. If required checks are missing or pending, leave the PR open.

The repository may not currently have enforceable branch restrictions; documenting the table does not claim they are configured. Refer to BUD-11 to implement GitHub Rulesets and Production Environment protections.

## 3. Agent identity, handoff and ownership

- Every action must be attributed to its **actual performer** and, when different, its **reporter**. A shared Atlassian/GitHub account does not prove independent review or separate AI identity.
- One task owner/active branch per independently deliverable scope; before work, check active PRs and recent commits to avoid overwriting parallel agents.
- Handoff in Jira Comment: issue key, objective, state, base/head commit, branch, PR URL, files changed, actual checks/results, unresolved risks/dependencies, next action and who is expected to perform it.
- One AI may perform code review of another's output, but do not call it independent approval unless the reviewer and evidence are verifiable. Security-sensitive work requires human decision.
- An AI Prompt is a working instruction, not an approval, proof of tests, or permission to deploy.

## 4. Failure, retries and audit events

- External updates (GitHub, Jira, Confluence) are **not one transaction**. If GitHub succeeds but Jira/Confluence fails, record the successful commit/PR and explicitly mark the sync action as **Pending Sync**; retry without duplicating Tickets, Comments or pages.
- Use stable identifiers for deduplication: Jira key; GitHub owner/repo/PR number; workflow run and event name; Release tag; Confluence content ID and linked source commit. Check before creating a new record.
- Never overwrite a completed ticket's historical Descriptions to backfill deployment evidence. Append a factual Comment and native Issue Link instead.
- No silent failure: report exact failed step, last confirmed state, impact, owner and retry path. Never falsely claim GitHub Release, Jira Comment or Confluence page is live without confirmation.
- GitHub PR merge, UAT deployment, UAT human acceptance, Production branch update, Hostinger sync and verified live **are distinct events**.
- Failed Production smoke test is **not** automatic rollback approval. The operator inspects evidence and obtains the appropriate authorization.

## 5. Emergency exceptions

1. Declare the incident and affected service, risk and justification.
2. Check or create a BUD Incident/Bug issue. If Jira is down, owner explicitly authorizes the exception, and the incident ID is documented in the fallback operational log.
3. Make the **minimum safe change**, with operator approval and backup/rollback plan. Never expose secrets in comments or artifacts.
4. Capture timestamps, actual actor, commits, approvals and production checks; backfill Jira and related links when service is restored.
5. Follow up with a review Ticket for the root cause and control improvements; do not silently change already Done requirement history.

## 6. Secrets, dependencies, sources and data

- Principle of least privilege for Atlassian/GitHub/Hostinger integrations. Prefer dedicated automation identity and scoped permissions; separate code review, Jira write and Production publish roles.
- Never store API tokens, account secrets, personal data, access codes or private keys in source, Jira Comments, Confluence pages, PR descriptions or logs.
- Review dependency changes and licensing. Do not include unlicensed Buddhist text/audio/illustrations or fabricate scripture references. Follow editorial source policy for canonical provenance and terms.
- Keep `source/` untouched without explicit owner permission.
- Include accessibility (keyboard/mobile/screen-reader), responsive behavior and performance checks in suitable feature acceptance criteria; scope to user impact and risk.

## 7. Standard change completion checklist

1. A real BUD ticket exists and is not terminal for new scope; related/parent/blocked-by links are accurate.
2. Chinese and English requirement descriptions agree; the PR title uses `[type][BUD-XX] English action`, Branch references the same ticket.
3. CI and required risk-appropriate reviews passed; actual results are in PR/Jira.
4. GitHub PR merge outcome and commit are recorded; UAT checks/acceptance are separate.
5. Production publish and rollback are explicit human-approved actions and never inferred from PR merge.
6. Verified Production (if applicable) is evidenced; Release and Jira record actual result.
7. Confluence informational copy has the canonical GitHub URL and pinned commit, or is clearly marked Pending Sync.
8. Jira Done only when applicable acceptance criteria are met; terminal Tickets remain history.

## 8. Policy maintenance

- **Canonical change:** open/reuse BUD ticket -> create branch -> PR -> required review/CI -> merge into GitHub `master`.
- **Confluence mirror:** update the policy index and explanation only after merge. Record the authoritative source files and merged commit. If the sync cannot be completed, leave Jira open/record Pending Sync.
- **Conflict resolution:** GitHub normative text wins for engineering controls, Jira wins for ticket requirements and acceptance. Never make editable Confluence prose a second independent engineering policy.
- **Periodic audit:** after each material policy change, verify GitHub links, current Confluence commit marker, active Jira ticket links, permissions, required checks and any Pending Sync items. Full scheduled sync is a separate automation task, not assumed active here.

## 9. Reuse in other projects

Reusable governance starter kit: [docs/templates/README.md](templates/README.md). Copy the template into the destination project's **own** repository, fill its Jira key, GitHub branches, test/release endpoints, approval authorities and Confluence space, then create an issue in that destination project before making further changes. The kit is a portable **starting point**, not a claim that BuddhaConnect settings or secrets apply elsewhere. Do not automatically reuse BUD issue keys, statuses, websites, webhook credentials or Production rules in another project.
