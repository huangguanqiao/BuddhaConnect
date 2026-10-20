# Website UX architecture

Verified against the BUD-28 implementation on 2026-10-19.

## Public structure

Each supported locale (`zh-CN`, `zh-TW`, `en`) has the same useful top-level structure:

1. Home
2. Start here
3. Buddhist teachings
4. Daily practice
5. Articles and insights
6. About BuddhaConnect

Search is a global header action rather than a competing navigation section. Sutras/scriptures and Buddhist tools are planned information-architecture areas, but they are intentionally excluded from primary navigation until real reviewed content or working tools exist.

## Translation behavior

- Static section switching preserves the equivalent section in the selected language.
- Article switching preserves the stable `articleId` and uses that locale's own slug when a published translation exists.
- If an article translation does not exist, the language option leads to the selected language homepage and carries an explanatory title. It never constructs a route that was not generated.
- Drafts, unpublished entries and content from another locale are excluded from lists and search.

## Content and search boundaries

- Article Markdown is the only current published content source.
- Static search covers title, summary, category and stripped Markdown body text for the current locale.
- There is no implemented Notion page-body sync, scripture corpus or scripture full-text index. UI copy must not imply otherwise.
- Existing original SVG artwork is reused; no third-party image dependency was added.

## Shared components

`Header`, `LanguageMenu`, `Footer`, `Breadcrumbs`, `PageHero`, `ContentCard` and `EmptyState` define the shared experience. The header provides separate desktop and mobile navigation, while the language menu supports pointer/touch, arrow keys, Home/End, Escape, focus restoration and screen-reader state.

## Manual UAT focus

- Confirm typography and wrapping on real iOS Safari and Android Chrome devices.
- Review Simplified Chinese, Traditional Chinese and English interface copy with native-language reviewers.
- Verify GitHub Pages base URL, custom domain, canonical URLs and sitemap after merge.
- Validate future article translation relationships before publishing any new locale edition.
