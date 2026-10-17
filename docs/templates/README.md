# Reusable AI Project Governance Kit

This folder is a **template**, not the live BuddhaConnect policy. Copy it to another repository, then fill the configuration placeholders and check every inherited rule. Do not copy sensitive credentials or use BuddhaConnect's Jira key in a different project.

## Ownership and sources

- **GitHub Markdown**: canonical, version-controlled operating standards for AI **and humans**; policies can be tested through CI.
- **Jira**: requirements, acceptance, linked change history, actual ownership and event audit.
- **Confluence**: human-readable explanations, onboarding and decisions. Link to canonical GitHub source and commit; never maintain an untracked competing engineering policy.
- **GitHub Actions / production host**: observed build and deployment evidence; successful workflow ≠ validated production.

## Bootstrap steps

1. Copy `PROJECT_CONFIG.example.md` to `docs/PROJECT_CONFIG.md` and fill project-specific Jira key, repository, branch, UAT/Production targets, ticket custom fields, Confluence space, contact roles and approvals.
2. Copy `AGENTS.template.md` to root `AGENTS.md` (or merge carefully with existing instructions). Keep AGENTS short: hard rules and links, not long examples.
3. Adopt existing `JIRA_WORKFLOW.md` and `ENGINEERING_GOVERNANCE.md` carefully, replacing BuddhaConnect-specific references using the completed configuration.
4. Create a **new change Ticket in the destination project before editing**; do not reuse a completed Ticket from this project.
5. Establish Branch/PR naming, truthful actor attribution, CI checks, security scanning, content licensing, accessibility, emergency exceptions and UAT/production separation.
6. Enable required checks, rulesets, approval and least-privilege secrets using admin-authorised configuration. Document what is still **NOT ENFORCED**.
7. Set up Confluence human-facing navigation; record source commit and Last Synced state, not just a mutable master URL.
8. Exercise one low-risk ticket→PR→check→UAT workflow, then test an approved production publish and rollback separately. Never call an untested rule "enabled".
9. Create an open task for periodic audit of branch protection, sync drift, stale tickets, dependency links and security alerts.

## Acceptance / safety

- Every actual change is tied to a real active destination-project issue; Done/Closed descriptions stay frozen.
- Lightweight edits may batch by **shared objective and acceptance**, not by calendar date alone.
- AI can merge low-risk PRs only under clear delegation and passing required checks; sensitive/security/CI/CD changes require explicit human approval before merge.
- Production publish/rollback always requires an explicit authorised decision.
- If any Jira/Confluence write fails, preserve the actual Git SHA/PR ID, mark Pending Sync and retry idempotently; do not fabricate success.
- Avoid shipping a generic template's example secrets, domains, priorities, status names or field IDs into another project.

## Files

- `AGENTS.template.md`: minimal shared agent policy entry point.
- `PROJECT_CONFIG.example.md`: reusable project-specific configuration and setup checklist.
- `HANDOFF.template.md`: standard evidence-based AI/human handoff.
- `CONFLUENCE_MIRROR.template.md`: human-readable page skeleton and sync semantics.

The full BuddhaConnect policy remains under root `AGENTS.md` and `docs/`. See `docs/JIRA_AUTOMATION.md` for setup of this repository only.
