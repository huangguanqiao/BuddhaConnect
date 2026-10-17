# <PROJECT_NAME> — Engineering standards (human guide)

**Status:** <Synced / Pending Sync>  
**Canonical GitHub commit:** `<MERGE_SHA>`  
**Last verified sync:** `<LOCAL_TIME_AND_ZONE>`  
**Policy change issue:** `<JIRA_KEY>-N`  
**Canonical:** `https://github.com/<OWNER>/<REPO>/blob/<SOURCE_BRANCH>/AGENTS.md`

## Read these first

- GitHub `AGENTS.md` — **normative engineering rules**, read by people and AI.
- `docs/PROJECT_CONFIG.md` — project-specific settings/approval ownership.
- `docs/ENGINEERING_GOVERNANCE.md` — risk and change authority.
- Jira issues — requirements, acceptance, priorities, links and event audit.

## Plain-language workflow

Ticket first → appropriately linked issue → AI/human implementation → PR → actual CI and review evidence → UAT → explicit Production approval → live verification → Jira completion.

## Risk and change authority

Explain low/medium/high/critical changes and **who** can approve each. A successful build does not grant automatic Production authority.

## Sync and audit

This Confluence page is a human-readable **mirror**, not a separate policy. Change the canonical policy in a Jira-keyed GitHub PR, then sync this page by validated commit ID. On failure write `Pending Sync`, keep the last confirmed commit, and retry without overwriting human annotations.
