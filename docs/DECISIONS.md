# Decision Log

## Existing implementation (observed)
- Astro static site with Tailwind CSS and GitHub Pages workflow.
- Retain historical `source/` materials.
- Do not migrate old Jekyll routes as part of initial rebuild (README.md).

## Collaboration policy (proposed in this PR)
- GitHub Markdown documents are the canonical technical and editorial knowledge base.
- AGENTS.md is the shared AI entry point; tool-specific files point to it.
- Every article is reviewed via PR before publication.
- No unverified canonical quotations or invented citations.
- Jira, Confluence or Notion may be integrated later, but no connection is assumed.

Record future decisions with date, context, choice and trade-offs.

## 2026-10-19 — Locale-first public information architecture (BUD-28)
- Use `/zh/`, `/zh-tw/` and `/en/` as canonical public entry points; keep old unlocalized routes as static redirects to avoid broken bookmarks.
- Keep only implemented, useful sections in primary navigation. Scripture and tools remain out of the navigation until sourced, reviewed content or working tools exist.
- Preserve an equivalent route when switching language. On an article without a published translation, link to the selected language homepage and clearly describe the fallback instead of linking to another language's article.
- Keep search fully static and locale-isolated. Index real published article body text, but do not describe it as scripture search or a remote Notion index.
