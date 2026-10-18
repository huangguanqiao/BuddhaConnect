import { activity, jiraClient } from './jira.mjs';

const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`GitHub GET ${path} failed: HTTP ${response.status}`);
  return response.json();
}

async function main() {
  if (process.env.RUN_CONCLUSION !== 'success') return console.log('UAT workflow did not succeed; Jira was not advanced.');
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const pulls = await github(`/repos/${owner}/${repo}/commits/${process.env.RUN_HEAD_SHA}/pulls`);
  const pr = pulls.find(item => item.merged_at && item.base.ref === 'master');
  if (!pr) return console.log('No merged PR associated with the UAT commit.');
  const issue = await github(`/repos/${owner}/${repo}/issues/${pr.number}`);
  if (!issue.labels.some(label => label.name === 'ai-generated')) return console.log('Merged PR is not AI-generated.');
  const key = `${pr.title} ${pr.head.ref}`.match(/BUD-\d+/i)?.[0]?.toUpperCase();
  if (!key) throw new Error('Cannot derive Jira key from merged PR');
  const uatUrl = process.env.UAT_URL || 'https://code.buddhaconnect.com/';
  const response = await fetch(uatUrl, { redirect: 'follow', headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`UAT verification failed: HTTP ${response.status}`);
  const html = await response.text();
  if (!/<html[\s>]/i.test(html)) throw new Error('UAT verification failed: response is not HTML');
  const jira = jiraClient({ baseUrl: process.env.JIRA_BASE_URL, email: process.env.JIRA_EMAIL, apiToken: process.env.JIRA_API_TOKEN });
  const status = await jira.transition(key, ['In QA']);
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  await jira.comment(key, activity({
    action: 'UAT deployment verified', summary: `GitHub Pages workflow succeeded and ${uatUrl} returned HTTP ${response.status}; moved ticket to ${status}.`,
    changes: `Merged PR #${pr.number} deployed from master. No Hostinger Production workflow was invoked.`,
    testing: 'Required PR checks passed before merge; GitHub Pages workflow succeeded; UAT homepage returned HTML.',
    references: `${pr.html_url} | ${runUrl} | ${uatUrl}`, nextStep: 'Perform human UAT. Production remains a separate owner-approved action.'
  }));
}

main().catch(error => { console.error(`UAT finalization failed: ${error.message}`); process.exitCode = 1; });
