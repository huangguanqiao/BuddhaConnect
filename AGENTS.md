# BuddhaConnect — Shared AI Instructions

This is the canonical onboarding entry point for ChatGPT, Claude Code, Codex, Gemini and other agents with repository access.

## Before any work
1. Read README.md and docs/PROJECT.md.
2. Read docs/ARCHITECTURE.md, docs/CURRENT_STATE.md and docs/DECISIONS.md.
3. For writing or editing articles, also read docs/CONTENT_GUIDELINES.md, docs/SOURCE_POLICY.md, docs/BUDDHIST_TERMS.md and docs/PUBLISHING.md.
4. Inspect actual code and the latest target branch before changing anything. Repository files override stale documentation; update documentation when discrepancies are found.
5. Check related issues and open PRs if accessible. Never claim to have checked an external system you cannot access.

## Hard rules
- Preserve `source/` unchanged unless the project owner explicitly authorizes changes.
- Do not invent scripture quotations, citations, translations, attribution or canonical references.
- Keep scripture, traditional interpretation and original editorial explanation clearly separate.
- Do not publish automatically: use a feature branch and PR for review.
- Respect existing Astro content schema. Do not introduce new frontmatter fields without implementing and testing schema and consumers.
- Do not commit secrets, credentials, copyrighted third-party texts without permission, or unverified assertions presented as fact.
- Avoid overwriting another agent's work. Use a distinct branch for each task.
- Run `npm run build` when possible; report clearly if not run.

## Handoff
In each PR include purpose, changed files, checks performed, sources verified for editorial changes, risks, outstanding work and next steps. Update docs/CURRENT_STATE.md only for material project-wide milestones; record durable decisions in docs/DECISIONS.md. Use Jira only if a project is connected and identified.

## Jira source of truth and language conventions
- Jira project key: `BUD` (BuddhaConnect). Use an existing, matching issue whenever available; do not invent issue keys or create duplicate tickets.
- **Description**: Simplified Chinese for requirements, rationale, implementation plan, acceptance criteria and verification notes. Keep technical identifiers, commands, filenames, code snippets and URLs unchanged.
- **English Description** (exact Jira field name): A complete and faithful English counterpart of the Description, including acceptance criteria, caveats and links. Keep both fields semantically synchronized when requirements change; do not discard or overwrite richer existing content.
- **Summary, AI Prompt, Pull Requests, Comments, Labels**: English by default. Use English for branches, commits, PR titles, technical documentation and release notes unless a user explicitly requests otherwise.
- **AI Prompt**: AI-generated, ticket-specific executable instructions in English, based on the agreed Jira requirements and current repository state. Include objective, constraints, steps, acceptance checks, PR naming and handoff. Do not duplicate all generic rules from AGENTS.md. Treat this field as guidance, not proof that an action was taken. Never silently overwrite user-edited prompts.
- **Pull Requests**: Track Feature PR URLs, merged-to-UAT state, actual GitHub Production Release links/tags and any verified rollback history, in English. Existing records must be preserved when adding entries. Avoid claiming that a Production Promotion is a PR: this repository deploys via an explicitly triggered GitHub Release / artifact promotion, not a separate Production PR.
- Do not put a Production release date or mark a feature as live merely because code merged into `master` or files were pushed to `production`. Confirm Hostinger live deployment/verification and distinguish `pending verification` from `verified live`.
- If Jira is unavailable or a new custom field is not accessible, describe the blocker and do not replace, empty or misroute content. Only report a successful Jira update after the server confirms it.

## Git and CI/CD issue traceability
- Use a feature branch and PR that reference the real Jira key, e.g. `BUD-20-feat-virtual-wooden-fish` and `[BUD-20] feat: Add virtual wooden fish`.
- A GitHub PR merging into `master` means source is eligible for GitHub Pages UAT; it **does not** mean the feature is in Production.
- Never publish to Production or trigger a rollback without explicit owner approval. Production is published using the successful UAT build artifact to the `production` branch and Hostinger sync; respect the current workflows.
- In the PR description, summarize changes, tests, known risks and the associated Jira issue. Once a PR is merged, link it in Jira's **Pull Requests** field when possible, and retain any prior PR/release entries.
- After a verified Production promotion, add the actual Release URL, tag, release date/time and verification result to the associated Jira issue. Record rollbacks with target version and observed outcome; do not erase deployment history.
- Jira status tracks real delivery progress: **In Build** during implementation; **In QA** during Preview validation; **Ready for Release** after acceptance and before an approved Production promotion; **Done** only when the ticket's actual acceptance requirements are met (for production-facing features, typically verified live). Do not move an issue to Done solely because a PR was merged. Follow actual Jira workflow availability.

## Task execution and documentation
- Review the Jira issue's Chinese Description and English Description together; if they disagree, seek clarification or reconcile using explicit user-approved changes rather than guessing.
- Generate or refine AI Prompt after inspecting the real project files; clearly distinguish proposed actions from completed actions.
- For each completed change, update both language versions of the Jira description when its requirements or implementation notes change. Preserve source links and meaningful context.
- Follow [docs/JIRA_WORKFLOW.md](docs/JIRA_WORKFLOW.md) for field examples, promotion tracing and collaboration conventions.
