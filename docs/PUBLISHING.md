# Article Production and Publishing Workflow

## 1. Research
Read AGENTS.md and the editorial docs. Search current article inventory and check sources. Record provenance and copyright/licensing concerns.

## 2. Draft
Create a descriptive kebab-case Markdown file under `src/content/articles/` on a dedicated branch. Use existing schema:
```yaml
---
title: "什么是四圣谛？"
description: "面向初学者的四圣谛简介。"
date: 2026-10-14
category: "佛教基础"
---
```
The example is a format illustration, not a published article or an approved taxonomy.

## 3. Review
Check factual accuracy, source citations, school-specific interpretation, language quality, duplicate topics, links, licensing and SEO title/description. Run `npm run build` where possible.

## 4. PR
Explain sources verified, changed files, checks, uncertainties and reviewer questions. Do not merge or publish without approval.

## 5. Handoff
Record unfinished verification and next steps in PR/issue. Update durable docs only when policies or architecture change.

Note: There is currently no draft-status frontmatter field or automated editorial approval gate. Branches and PRs are the draft boundary until implemented.
