# Project Governance Configuration (copy, fill, validate)

| Setting | Value to replace | Validation |
| --- | --- | --- |
| Project name | `<PROJECT_NAME>` | Required |
| Jira site / project key | `<JIRA_SITE_URL>` / `<JIRA_KEY>` | Must match a real accessible project |
| Jira workflow / terminal status | `<WORKFLOW_STATES>` | Verify site metadata |
| Jira bilingual fields | `<DESCRIPTION_LANGUAGE_FIELDS>` | Confirm existing custom fields, do not invent IDs |
| GitHub repository / source branch | `<OWNER>/<REPO>` / `<SOURCE_BRANCH>` | Validate branch exists |
| UAT website and environment | `<UAT_URL>` / `<UAT_ENV>` | Verify actual behavior |
| Production host and publish workflow | `<PRODUCTION_HOST>` / `<PUBLISH_WORKFLOW>` | Must be explicit/manual and tested |
| Rollback method | `<ROLLBACK_WORKFLOW>` | Restore a verified known-good release |
| Confluence site and space | `<CONFLUENCE_URL>` / `<SPACE_ID>` | Validate page owner/access |
| Risk approver / release approver | `<REVIEWER_ROLE>` / `<RELEASE_APPROVER>` | Require independent approval where necessary |
| Owner-granted AI merge scope | `<LOW_RISK_ONLY_OR_NONE>` | Do not infer consent |
| Timezone | `<IANA_TIMEZONE>` | e.g. Australia/Canberra |
| Automation credentials | `<SECRET_NAMES_ONLY>` | Never put secret VALUES here |
| Content license/review | `<CONTENT_POLICY>` | Verify rights and evidence |
| Ruleset / security / backup review | `<CONTROL_OWNER_AND_DATE>` | Document enabled versus planned |

## Activation checklist

- [ ] Placeholders replaced; no BuddhaConnect references accidentally reused.
- [ ] Real Jira issue types/field names/link types inspected.
- [ ] Engineering risk and merge approvers explicitly agreed.
- [ ] Required GitHub checks/rulesets truly enabled and tested.
- [ ] Confluence source-of-truth and mirror commit provenance established.
- [ ] Production Publish and Rollback tested only after explicit approval.
- [ ] Sample low-risk change can be traced from Jira through PR/CI/UAT, including observed results.
- [ ] Unimplemented controls filed as active issues and marked Pending, not claimed complete.
