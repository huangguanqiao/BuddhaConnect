# BuddhaConnect — Shared AI Instructions

This is the canonical onboarding entry point for ChatGPT, Claude Code, Codex, Gemini and other agents with repository access.

## Before any work
1. Read README.md and docs/PROJECT.md.
2. Read docs/ARCHITECTURE.md, docs/CURRENT_STATE.md and docs/DECISIONS.md.
3. For writing or editing articles, also read docs/CONTENT_GUIDELINES.md, docs/SOURCE_POLICY.md, docs/BUDDHIST_TERMS.md and docs/PUBLISHING.md.
4. Inspect actual code and the latest target branch before changing anything. Repository files override stale documentation; update documentation when discrepancies are found.
5. Check the existing Jira BUD issues and open PRs before any modification. An applicable Jira issue is mandatory; create one first if needed. Never claim to have checked an external system you cannot access.

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

## Mandatory ticket-first change control (all agents and humans)
- **No Jira ticket, no modification.** Before changing code, content, copy, metadata, images, configuration, deployment workflows or project documentation, search for an existing applicable `BUD-XX` issue. This includes a one-word typo fix, a one-line CSS edit and AI-authored content. Reading, discussing and researching without making a change do not require a new issue.
- Reuse an existing issue only when the new change fits its explicit objective, scope, acceptance criteria and ownership. Add the change to its Chinese Description and equivalent English Description if the agreed scope evolves; do not silently expand a ticket beyond its intent.
- If none applies, **create a Jira Task, Bug or Story first**, according to the work type; write Chinese Description plus corresponding English Description. Then create the branch and PR using that actual issue key. Never invent an ID or retroactively present an untracked change as ticketed.
- **Batch small edits by coherent purpose, not date alone.** Several tiny wording, spelling, punctuation or terminology fixes can share one issue and PR when they concern the same page, content batch, module, goal and review/acceptance cycle (often one day's work). List each affected page/file and examples in the issue/PR. Do not bundle unrelated features, behavior changes, security fixes, risky deployments or separately testable items just because they occurred the same day. Create a new issue for a distinct goal or future batch; use an Epic/parent to group related tickets when useful.
- For example, five small homepage text corrections in one review batch may use one `chore(copy)` Task; a payment-flow bug and a scripture translation correction require separate tickets. A trivial edit may have lightweight criteria/tests, but still requires an issue, branch, PR and factual handoff.
- If Jira cannot be reached, **stop before modifying** and report the blocker; ask the owner before any emergency exception. For an explicitly approved incident requiring an immediate repair, document the exception transparently, create/backfill a proper Jira issue as soon as access returns, and link all commits/PRs. Never pretend the normal sequence was followed.
- Do not auto-create duplicate tickets every time an agent continues an existing task; each meaningful delivery increment uses its relevant existing issue unless the scope differs.

## Mandatory Jira activity comments (English)
- Log each **meaningful milestone** in the relevant Jira issue: work started/handoff, substantive implementation, PR creation/merge, testing and UAT result, blocker/decision, approved Production deployment and live verification, rollback, or final completion. Do not spam comments for each file save, token, tool call or inconsequential edit.
- Format each comment as a short, human-readable work log using the template in `docs/JIRA_WORKFLOW.md`. Include **Date** (actual YYYY-MM-DD HH:mm plus IANA timezone or UTC offset), **Performed by** (actual human/agent/system), **Action**, **Summary**, **Changes**, **Testing**, **References** and **Next Step**. Use `Not run` or `Not applicable` where accurate; never fabricate outcomes.
- The Jira **comment author** is the actual connected Atlassian account. The `Performed by` field identifies who truly performed the work; when another agent merely reports it, include `Reported by` separately. Never imply a separate Jira login, tool access, review, test or deployment that did not occur.
- Use consistent performer names (e.g. `ChatGPT`, `Codex`, `Claude Code`, `Gemini`, `Human / Project Owner`, `GitHub Actions`). When authorship cannot be established, write `Unknown / not independently verified`, not a guess. Attribute joint efforts explicitly.
- Use only observed timestamps/timezones and evidence. For deployment events distinguish `pushed to production branch`, `Hostinger synchronization pending` and `verified live`. A GitHub job succeeding is not automatically proof of a live website.
- Prefer concise objective statements: what was actually changed, checks run and their results, links to PR/commit/release, risks and next action. Do not paste the full diff, duplicate the entire Description/AI Prompt, expose secrets, or modify/delete old activity comments as normal practice.
- Update the `Pull Requests` field with consolidated feature/release references as appropriate; **Comments** preserve the chronological narrative. Keep both descriptions synchronized when scope, acceptance or final implementation materially changes. A comment does not replace a required ticket, PR, test or approval.
- After a successfully saved Jira comment or field update, confirm the result before reporting success. If the write fails, report the unlogged action and retry safely; do not falsely claim an audit record exists.

## Full delivery checklist
1. Locate or create the matching `BUD-XX` before touching files; avoid duplicate or unrelated issue grouping.
2. Review bilingual requirements and existing architecture; generate ticket-specific English AI Prompt when appropriate.
3. Implement on a dedicated, Jira-keyed branch; commit and open a Jira-keyed PR. Never directly edit the Production branch.
4. Run relevant checks; record actual results in Jira Comments, with genuine performer/time attribution.
5. Merge to `master` with review; validate Preview/UAT separately and log the result.
6. Obtain explicit owner approval before Production Publish or Rollback, and verify live site before declaring production completion.
7. Preserve feature PR, release and rollback history in Jira; transition status to Done only on the ticket's applicable acceptance evidence.


## Completed issue protection and change requests
- Treat Jira issues in **Done** or **Closed** (or another actual terminal state) as a **frozen historical baseline**. Do not modify their original **Description**, **English Description**, **AI Prompt**, acceptance criteria or previous feature/release records as routine follow-up work.
- For a **new enhancement**, **post-completion bug**, **wording revision**, or **change request**, search existing issues, then **create a new Story / Bug / Task** before changing files. State what differs from the completed original, why, affected scope, acceptance criteria and expected risk. Link the new issue to the original with a native Jira link (usually **Relates**). A Change Request is a concept; it does not require adding a custom Jira issue type.
- On the original completed issue, only add an accurate follow-up **Comment** and native **Issue Link**, as needed. Preserve its existing release and Pull Requests history. Do not reassign its old PR or overwrite it with the new delivery's records.
- **Exception:** An erroneous Done transition, essential factual correction or compliance-driven amendment may justify reopening or editing the original issue, but only with explicit owner approval, a reason recorded in Jira Comments and an auditable change history. Never quietly reopen or rewrite it.
- Closing a ticket does **not** mean all future related development is prohibited: it means **new scope gets a new linked ticket**. Avoid reopening merely to append an enhancement.

## Native Jira links, hierarchy, priority and dependencies
- **Before creating or implementing an issue**, inspect related completed/original features, open Bugs, existing similar Tickets, parent/Epic links, blockers and duplicate issues. Use Jira's **native issue links**, not only links pasted into Comments or Description. Only create a link when its relationship is real and supported by evidence.
- Supported link types must be discovered from the Jira site rather than assumed. Current BUD Jira site types verified: **Blocks**, **Relates**, **Duplicate**, **Cloners**. Jira **Parent/Epic** relationship is hierarchy, **not** an issue link; use the parent field when there is genuine decomposition.
- **Relates**: subsequent enhancements or Bugs referring to an original feature, and meaningful peer-to-peer connections without a stronger, provable dependency.
- **Blocks**: actual execution, testing or release prerequisite. Direction matters: if A must finish before B can proceed, record **A blocks B** / **B is blocked by A**. Never reverse the direction; don't invent a blocker simply because issues are related.
- **Duplicate**: genuine duplicate request/defect; designate the original canonical issue and note why. **Cloners** only for genuine copies/clones, not normal enhancements.
- **Priority** expresses urgency/importance through Jira's native **Priority** field. It is **not** equivalent to dependencies or task order. Higher priority does not automatically block lower priority work. When priority affects scheduling, describe why in the ticket.
- When relevant blockers remain unresolved, clearly show **Blocked** in the working notes/Comments and avoid advancing to Ready for Release or Done contrary to acceptance; if the actual workflow lacks a Blocked state, retain the valid status and document the blocking issue key.
- For multi-ticket work, use an **Epic/parent** for a real shared deliverable, direct Blocks links for prerequisites, and Relates links for related but independent work. Be selective: don't indiscriminately link every issue in the same project.
- Add links **when creating the new related issue or when discovering the relationship**, verify both issue keys and link direction, and mention the linkage in an English activity Comment. Confirm server success. If native links cannot be created, report the limitation rather than claiming they exist.


## Naming conventions — Jira, PR, branch, commit
- Jira Summary: `[Area] Verb + clear English objective` (e.g. `[UI] Add virtual wooden fish`, `[Content] Correct homepage terminology`, `[CI/CD] Validate Jira PR naming`). Do NOT put the Jira Key in Summary; Jira already shows it separately. Issue Type (Story/Bug/Task) is distinct from the Area tag.
- New feature PR title: `[type][BUD-XX] Clear English action`, e.g. `[feat][BUD-20] Add virtual wooden fish`, `[fix][BUD-21] Correct mobile tap counter`. Allowed lower-case types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `content`. The action begins with an uppercase letter. Branch and PR must refer to the same existing, applicable BUD ticket.
- Branch: `BUD-XX-short-kebab-description`. Commit: Conventional Commit style `type(scope): short English summary` where practical. Do not use `BUD~20`, which is not a Jira issue key.
- Production GitHub Releases retain `[Promotion] PRD YYYY-MM-DD`: they are not feature PR titles. Do not retroactively rename historical PRs or completed Jira summaries. Full examples in `docs/JIRA_WORKFLOW.md`.
