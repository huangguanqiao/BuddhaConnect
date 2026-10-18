import test from 'node:test';
import assert from 'node:assert/strict';
import { jiraClient } from '../scripts/ai-dev/jira.mjs';

const response = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

test('Jira transition is idempotent when the target status is current', async () => {
  const calls = [];
  const jira = jiraClient({
    baseUrl: 'https://example.atlassian.net', email: 'bot@example.com', apiToken: 'token',
    fetchImpl: async (url, options) => {
      calls.push([String(url), options.method ?? 'GET']);
      return response(200, { fields: { status: { name: 'In QA' } } });
    }
  });
  assert.equal(await jira.transition('BUD-1', ['In QA']), 'In QA');
  assert.deepEqual(calls.map(call => call[1]), ['GET']);
});

test('Jira client discovers transitions and posts structured comments', async () => {
  const calls = [];
  const jira = jiraClient({
    baseUrl: 'https://example.atlassian.net', email: 'bot@example.com', apiToken: 'token',
    fetchImpl: async (url, options) => {
      const path = new URL(url).pathname;
      calls.push([path, options.method ?? 'GET', options.body]);
      if (path.endsWith('/transitions') && (options.method ?? 'GET') === 'GET') return response(200, { transitions: [{ id: '7', to: { name: 'In Build' } }] });
      if (path.endsWith('/transitions')) return response(204);
      if (path.endsWith('/comment')) return response(201, { id: '10' });
      return response(200, { fields: { status: { name: 'To Do' } } });
    }
  });
  assert.equal(await jira.transition('BUD-2', ['In Build']), 'In Build');
  await jira.comment('BUD-2', 'Evidence');
  assert.deepEqual(calls.map(call => call[1]), ['GET', 'GET', 'POST', 'POST']);
  assert.match(calls.at(-1)[2], /Evidence/);
});
