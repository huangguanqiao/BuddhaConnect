# Architecture — verified from repository (2026-10-14)

- Astro 5, static output, @astrojs/sitemap, Tailwind CSS 4 via Vite.
- Site URL in astro.config.mjs: https://code.buddhaconnect.com.
- Source code: src/pages, src/layouts, src/components, src/styles.
- Article content: src/content/articles/*.md.
- Collection definition: src/content.config.ts using Astro glob loader.
- Frontmatter schema: required title (string), description (string), date (coerced date); category (string, default 生活智慧).
- Historical source materials: source/ — do not modify.
- GitHub Actions workflow: .github/workflows/deploy.yml; README states deployment from master to GitHub Pages.

## Local commands
```sh
npm install
npm run dev
npm run build
```

Validate any proposed schema, URL, route or deployment change against actual implementation. The presence of configuration does not itself prove a successful live deployment.
