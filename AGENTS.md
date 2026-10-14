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
