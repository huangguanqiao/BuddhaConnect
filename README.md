# BuddhaConnect 2.0

Astro 5 + Tailwind CSS 4 static site.

## Development

```bash
npm install
npm run dev
npm run build
```

Articles: `src/content/articles/*.md`. Preserved original materials: `source/` (do not modify).

## GitHub Pages

After testing, set Settings → Pages → Build and deployment source to **GitHub Actions**. The workflow deploys `master`. Confirm custom domain `code.buddhaconnect.com` and DNS before merging the PR.

Old Jekyll routes are intentionally not migrated. Sample articles are editorial content, not scripture quotations.
