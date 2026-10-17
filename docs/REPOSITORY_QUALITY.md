# Repository and editorial quality gates

**Jira:** BUD-16. This is a deterministic automated check, **not** religious, legal or copyright approval.

Run `node scripts/check-repository.mjs` before opening PRs. Run `node --test tests/repository-quality.test.mjs` to exercise the validator. It scans Markdown under `docs/`, `src/content/articles/`, root README and AGENTS; flags missing local targets, empty files, and missing basic article frontmatter required by the current Astro schema. External URLs and Astro absolute routes are deliberately not treated as verified.

## Human editorial checklist (Jira PR evidence)

- [ ] A real BUD Ticket describes the purpose and audience; no duplicate/Done ticket reuse.
- [ ] Scripture title, collection/canon, translation/edition and source link or stable reference have been checked.
- [ ] Exact quotation was checked against the stated edition; explanation/interpretation is not presented as canonical quotation.
- [ ] Rights and licenses permit reuse of the specific text, translation, audio, image and other media. “Found online” alone is insufficient.
- [ ] Conflicting interpretations are properly attributed; no invented source, quote or spiritual/medical guarantee.
- [ ] Terminology follows `BUDDHIST_TERMS.md`; content and title are reviewed for duplication, accessibility and mobile reading.
- [ ] Reviewer identity/date/evidence are recorded in Jira and PR. A CI pass does **not** count as human editorial approval.

## Portable design

The checker uses only Node.js standard libraries. To reuse in other projects, move the script and tests under an active destination-project Ticket and adjust article paths/frontmatter fields to that project's schema. Do not blindly copy Buddhist editorial rules into non-Buddhist apps.

GitHub PR CI integration and any CI security-impacting modifications must be merged only after explicit human approval. BUD-16 tracks that approval and runtime verification.
