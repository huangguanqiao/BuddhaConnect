const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.AI_GITHUB_TOKEN;
const api = 'https://api.github.com';
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };

async function request(path, options = {}) {
  const response = await fetch(`${api}${path}`, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`GitHub ${options.method ?? 'GET'} ${path} failed: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!repository || !token) throw new Error('GitHub repository and AI_GITHUB_TOKEN are required');
  const [owner, repo] = repository.split('/');
  const sha = process.env.RUN_HEAD_SHA;
  const pulls = await request(`/repos/${owner}/${repo}/commits/${sha}/pulls`);
  const pr = pulls.find(item => item.state === 'open' && item.base.ref === 'master' && item.head.repo?.full_name === repository && /^ai\/BUD-\d+-/.test(item.head.ref));
  if (!pr) return console.log('No eligible AI PR is associated with this workflow run.');
  const issue = await request(`/repos/${owner}/${repo}/issues/${pr.number}`);
  const labels = issue.labels.map(label => label.name);
  if (!labels.includes('ai-generated')) return console.log('PR is not marked ai-generated.');

  if (process.env.RUN_CONCLUSION !== 'success') {
    const retryLabel = labels.find(label => /^ai-ci-retries:\d+$/.test(label)) ?? 'ai-ci-retries:0';
    const retries = Number(retryLabel.split(':').at(-1));
    if (retries >= 1) {
      await request(`/repos/${owner}/${repo}/issues/${pr.number}/comments`, { method: 'POST', body: JSON.stringify({ body: 'Automated CI retry limit reached. No merge or deployment was attempted; human diagnosis is required.' }) });
      return;
    }
    await request(`/repos/${owner}/${repo}/issues/${pr.number}/labels/${encodeURIComponent(retryLabel)}`, { method: 'DELETE' });
    await request(`/repos/${owner}/${repo}/issues/${pr.number}/labels`, { method: 'POST', body: JSON.stringify({ labels: ['ai-ci-retries:1'] }) });
    await request(`/repos/${owner}/${repo}/actions/runs/${process.env.RUN_ID}/rerun-failed-jobs`, { method: 'POST' });
    console.log(`Re-ran failed CI jobs once for PR #${pr.number}.`);
    return;
  }

  if (process.env.AI_AUTO_MERGE !== 'true' || !labels.includes('risk:low')) {
    console.log('Automatic merge is disabled or PR is not low risk.');
    return;
  }
  const required = (process.env.AI_REQUIRED_CHECKS || 'Astro check and production build,Verify BUD issue and PR identity,validate').split(',').map(value => value.trim()).filter(Boolean);
  let checks = [];
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const data = await request(`/repos/${owner}/${repo}/commits/${sha}/check-runs?per_page=100`);
    checks = data.check_runs;
    const byName = new Map(checks.map(check => [check.name, check]));
    const complete = required.every(name => byName.get(name)?.status === 'completed');
    if (complete) break;
    await sleep(20_000);
  }
  const byName = new Map(checks.map(check => [check.name, check]));
  const invalid = required.filter(name => byName.get(name)?.conclusion !== 'success');
  const anyFailure = checks.some(check => check.status === 'completed' && !['success', 'neutral', 'skipped'].includes(check.conclusion));
  if (invalid.length || anyFailure) throw new Error(`Merge gate not satisfied. Required checks without success: ${invalid.join(', ') || 'none'}`);
  const result = await request(`/repos/${owner}/${repo}/pulls/${pr.number}/merge`, {
    method: 'PUT', body: JSON.stringify({ merge_method: 'squash', sha, commit_title: pr.title })
  });
  if (!result.merged) throw new Error(`GitHub refused merge: ${result.message}`);
  console.log(`Merged low-risk PR #${pr.number}; branch protection was not bypassed.`);
}

main().catch(error => { console.error(`Reconcile failed: ${error.message}`); process.exitCode = 1; });
