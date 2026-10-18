function authHeader(email, apiToken) {
  return `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`;
}

export function jiraClient({ baseUrl, email, apiToken, fetchImpl = fetch }) {
  if (!/^https:\/\/[a-z0-9-]+\.atlassian\.net$/.test(baseUrl ?? '') || !email || !apiToken) {
    throw new Error('Valid Jira configuration is required');
  }
  const request = async (path, options = {}) => {
    const response = await fetchImpl(new URL(path, baseUrl), {
      ...options,
      headers: {
        Authorization: authHeader(email, apiToken),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: AbortSignal.timeout(15_000)
    });
    if (!response.ok) throw new Error(`Jira ${options.method ?? 'GET'} ${path} failed: HTTP ${response.status}`);
    return response.status === 204 ? null : response.json();
  };
  return {
    async comment(key, text) {
      return request(`/rest/api/3/issue/${encodeURIComponent(key)}/comment`, {
        method: 'POST',
        body: JSON.stringify({ body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } })
      });
    },
    async transition(key, targetNames) {
      const issue = await request(`/rest/api/3/issue/${encodeURIComponent(key)}?fields=status`);
      const current = String(issue.fields?.status?.name ?? '');
      if (targetNames.some(name => name.toLowerCase() === current.toLowerCase())) return current;
      const data = await request(`/rest/api/3/issue/${encodeURIComponent(key)}/transitions`);
      const wanted = targetNames.map(name => name.toLowerCase());
      const transition = data.transitions?.find(item => wanted.includes(String(item.to?.name ?? item.name).toLowerCase()));
      if (!transition) throw new Error(`No Jira transition available for ${targetNames.join(' / ')}`);
      await request(`/rest/api/3/issue/${encodeURIComponent(key)}/transitions`, {
        method: 'POST', body: JSON.stringify({ transition: { id: transition.id } })
      });
      return transition.to?.name ?? transition.name;
    }
  };
}

export function activity({ action, summary, changes, testing, references, nextStep }) {
  const timestamp = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'longOffset'
  }).format(new Date()).replace(',', '');
  return [
    `Date: ${timestamp} (Australia/Sydney)`, 'Performed by: GitHub Actions / Gemini CLI', `Action: ${action}`,
    `Summary: ${summary}`, `Changes: ${changes}`, `Testing: ${testing}`, `References: ${references}`, `Next Step: ${nextStep}`
  ].join('\n');
}
