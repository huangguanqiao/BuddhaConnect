# <PROJECT_NAME> — Shared AI and Developer Instructions

**Configuration**: `docs/PROJECT_CONFIG.md`. Read it before using any ticket key, domain, repository or deployment action. **Canonical policy** is this GitHub repository; Confluence is a human-facing interpretation and navigation mirror.

## Mandatory preflight

1. Read README, project configuration, architecture, risk and content/source rules.
2. Search Jira for an existing applicable issue in `<JIRA_KEY>`. If none applies, create a new Story/Bug/Task **before the first file edit**, even a one-word change. Discussions and read-only research do not need an issue.
3. Ensure the issue is not Done/Closed, record meaningful links to original features and actual directional blockers, and review acceptance criteria. Preserve completed issue descriptions as historical baseline.
4. Check live source, active PRs and other agents' work to avoid collisions; do not claim tools or evidence you did not access.

## Delivery controls

- PR title: `[type][<JIRA_KEY>-N] Clear English action`, branch: `<JIRA_KEY>-N-short-kebab-description`. Consistent names, authentic keys and English activity comments; preserve existing project-specific bilingual conventions.
- Use dedicated feature branch and PR, run the project's actual checks, identify real reviewer, report failed/not-run tests honestly.
- Low-risk autonomous PR merge **only under documented owner delegation and enforced green required checks**. Security, CI/CD, authentication, data privacy, secrets, deployment and bulk changes require **explicit human source-merge approval**.
- Merge to source/UAT branch does not prove UAT approval, release, or verified Production. Production Publish or Rollback always requires explicit authorisation.
- Log meaningful Jira milestones: timestamp/time zone; true Performed by and optional Reported by; Action, Changes, Testing, References and Next Step.
- On partial cross-system failure, record `Pending Sync`, preserve PR/commit/event IDs and retry without duplicates.
- Never commit or disclose secrets or unlicensed third-party content. Follow project-specific editorial/privacy requirements.

## Handoff

Use `docs/templates/HANDOFF.template.md` or the destination project's handoff template. Include issue, Branch/PR/commit, CI evidence, related issues/blockers, risk, owner and next action.

This template intentionally contains placeholders. Never use it before configuration and project-specific approval.
