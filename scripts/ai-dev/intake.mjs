/**
 * Fail-closed Jira intake shared by dry-run and live AI development workflows.
 * Selection is deterministic and never mutates Jira.
 */
const ALLOWED_TYPES = new Set(['Task', 'Bug', 'Story']);
const ALLOWED_STATUSES = new Set(['To Do', 'Ready for AI']);
const BLOCKED = /\b(production|prod deployment|delete data|credential|secret|password|payment|legal|copyright|permission escalation|security bypass|database migration|hostinger|github actions?|workflow|branch protection|authentication|authorization)\b|生产环境|删除数据|密钥|密码|版权|付费|权限提升|数据迁移|工作流|身份验证|授权/i;
const REQUIRED_LABEL = 'ai-ready';
const KEY = /^BUD-\d+$/;

export function jiraText(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  if (typeof value.text === 'string') return value.text;
  if (Array.isArray(value)) return value.map(jiraText).filter(Boolean).join('\n');
  return jiraText(value.content);
}

export function evaluateIssue(issue) {
  const fields = issue?.fields ?? {};
  const key = String(issue?.key ?? '');
  const labels = Array.isArray(fields.labels) ? fields.labels : [];
  const type = String(fields.issuetype?.name ?? '');
  const status = String(fields.status?.name ?? '');
  const summary = String(fields.summary ?? '').trim();
  const description = jiraText(fields.description).trim();
  const reasons = [];

  if (!KEY.test(key)) reasons.push('invalid_project_or_key');
  if (!labels.includes(REQUIRED_LABEL)) reasons.push('not_opted_in');
  if (!ALLOWED_TYPES.has(type)) reasons.push('unsupported_type');
  if (!ALLOWED_STATUSES.has(status)) reasons.push('not_ready');
  if (!summary || description.length < 20) reasons.push('missing_specification');
  if (BLOCKED.test(`${summary} ${description}`)) reasons.push('high_risk_manual_review');

  return { key, eligible: reasons.length === 0, reasons, summary, description, type, status };
}

export function planIssues(issues, { limit = 1, activeKeys = [] } = {}) {
  const active = new Set(activeKeys.map(String));
  const reviewed = issues.map(evaluateIssue).map(result => active.has(result.key)
    ? { ...result, eligible: false, reasons: [...result.reasons, 'already_active'] }
    : result);
  const selected = reviewed
    .filter(result => result.eligible)
    .sort((a, b) => Number(a.key.split('-')[1]) - Number(b.key.split('-')[1]))
    .slice(0, Math.max(0, Math.min(1, limit)));
  return { mode: 'dry_run', selected, reviewed };
}

export async function fetchJiraIssues({ baseUrl, email, apiToken, fetchImpl = fetch }) {
  if (!/^https:\/\/[a-z0-9-]+\.atlassian\.net$/.test(baseUrl ?? '')) {
    throw new Error('Jira base URL must be an Atlassian HTTPS site');
  }
  if (!email || !apiToken) throw new Error('Missing Jira credentials');
  const jql = 'project = BUD AND labels = ai-ready AND status in ("To Do", "Ready for AI") ORDER BY created ASC';
  const url = new URL('/rest/api/3/search/jql', baseUrl);
  url.searchParams.set('jql', jql);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('fields', 'summary,description,labels,issuetype,status');
  const response = await fetchImpl(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) throw new Error(`Jira query failed: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.issues)) throw new Error('Unexpected Jira response');
  if (data.nextPageToken) throw new Error('More than 50 candidate issues; refusing incomplete scan');
  return data.issues;
}
