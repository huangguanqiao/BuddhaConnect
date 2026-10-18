# Architecture — verified from repository (2026-10-19)

- Astro 5, static output, @astrojs/sitemap, Tailwind CSS 4 via Vite.
- Site URL in astro.config.mjs: https://code.buddhaconnect.com.
- Source code: src/pages, src/layouts, src/components, src/styles.
- Locale-first public routes: `/zh/`, `/zh-tw/` and `/en/`, with equivalent section routes for start, teachings, practice, articles, search and about.
- Shared UI: `src/components` contains the header/mobile navigation, accessible language menu, footer, breadcrumbs, page heroes, content cards and empty states.
- Article content: `src/content/articles/*.md`; pages and search expose only entries whose locale matches the route and whose `published` field is true.
- Collection definition: src/content.config.ts using Astro glob loader.
- Frontmatter schema: required title, description and date; category, stable article ID, locale, locale-specific slug, published state, optional QA state and site section are supported.
- Static search indexes the available title, description, category and Markdown body at build time. It does not claim a scripture corpus or remote full-text service.
- Historical source materials: source/ — do not modify.
- GitHub Actions workflow: .github/workflows/deploy.yml; README states deployment from master to GitHub Pages.

## Local commands
```sh
npm install
npm run dev
npm run build
```

Validate any proposed schema, URL, route or deployment change against actual implementation. The presence of configuration does not itself prove a successful live deployment.

See [UX architecture](UX_ARCHITECTURE.md) for the current navigation, translation fallback and content-readiness rules.
