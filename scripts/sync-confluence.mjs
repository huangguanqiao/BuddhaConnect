#!/usr/bin/env node
/**
 * Synchronises ONLY explicitly allowlisted, machine-managed Confluence index pages.
 * Source of truth is the exact Git commit triggering a protected-branch run.
 * Never writes an existing Confluence page unless a management marker is present.
 */
import { readFileSync } from 'node:fs';
const HOST = 'https://huangguanqiao.atlassian.net';
const MARKER = 'BC_GITHUB_SYNC_MANAGED_V1';

export function buildManagedPage({ title, repo, sha, sources }) {
  const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const safeSha = /^[0-9a-f]{40}$/.test(sha) ? sha : (()=>{ throw Error('Invalid commit SHA'); })();
  const rows = sources.map(p => {
    if (!/^(AGENTS\.md|docs\/[A-Za-z0-9_./-]+\.md)$/.test(p) || p.includes('..')) throw Error('Invalid source file path: ' + p);
    const url = 'https://github.com/' + repo + '/blob/' + safeSha + '/' + p;
    return '<li><a href="' + esc(url) + '">' + esc(p) + '</a></li>';
  }).join('');
  return '<p><strong>' + MARKER + '</strong></p>' +
    '<h1>' + esc(title) + '</h1>' +
    '<p><strong>Canonical engineering source:</strong> GitHub Markdown (not this Confluence mirror).</p>' +
    '<p><strong>Synced Git commit:</strong> <code>' + safeSha + '</code></p>' +
    '<p><strong>Synchronization:</strong> GitHub Actions from verified master source; operational tests and credentials must be enabled separately.</p>' +
    '<p>For AI agents and developers, follow the files below; for requirements and acceptance, consult the relevant Jira issue.</p>' +
    '<ul>' + rows + '</ul>';
}
export function assertManagedExisting(page) {
  const body = page?.body?.storage?.value ?? '';
  if (!body.includes(MARKER)) throw Error('Confluence page is not managed by this automation; refusing to overwrite');
  if (!Number.isInteger(page?.version?.number)) throw Error('Missing Confluence page version');
  if (!page.title) throw Error('Missing Confluence page title');
}
export function readMapping(text) {
  const config = JSON.parse(text);
  if (!Array.isArray(config.pages) || !config.pages.length) throw Error('No allowlisted managed pages configured');
  if (config.pages.length > 10) throw Error('Too many pages in one synchronization batch');
  for (const page of config.pages) {
    if (!/^[0-9]{1,19}$/.test(String(page.pageId))) throw Error('Page ID must be numeric');
    if (typeof page.title !== 'string' || !page.title.trim()) throw Error('Managed page title required');
    if (!Array.isArray(page.sources) || !page.sources.length) throw Error('Managed source paths required');
  }
  return config.pages;
}
async function main() {
  const sha = process.env.GITHUB_SHA;
  const repo = process.env.GITHUB_REPOSITORY;
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;
  const mapping = process.env.CONFLUENCE_SYNC_MAPPING;
  if (!email || !token || !mapping || !sha || !repo) {
    throw Error('Confluence sync not configured: required credentials, explicit page map, SHA or repository missing. Status: Pending Sync.');
  }
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) throw Error('Invalid GitHub repo');
  const pages = readMapping(mapping);
  const headers = {
    Authorization: 'Basic ' + Buffer.from(email + ':' + token).toString('base64'),
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  for (const item of pages) {
    const id = String(item.pageId);
    const api = HOST + '/wiki/api/v2/pages/' + id;
    const fetched = await fetch(api + '?body-format=storage', { headers, signal: AbortSignal.timeout(15000) });
    if (!fetched.ok) throw Error('Cannot fetch Confluence page ' + id + ', HTTP ' + fetched.status + '; Pending Sync');
    const current = await fetched.json();
    assertManagedExisting(current);
    if (current.title !== item.title) throw Error('Confluence page title differs from allowlist; refusing overwrite: ' + id);
    const next = buildManagedPage({ title: item.title, repo, sha, sources: item.sources });
    if (current.body.storage.value === next) {
      console.log('Already synced page ' + id + ' to ' + sha);
      continue;
    }
    const update = await fetch(api, {
      method: 'PUT', headers, signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        id, status: 'current', title: current.title,
        body: { representation: 'storage', value: next },
        version: { number: current.version.number + 1, message: 'GitHub policy sync ' + sha }
      })
    });
    if (!update.ok) throw Error('Confluence update failed for page ' + id + ', HTTP ' + update.status + '; Pending Sync');
    console.log('Synced managed Confluence page ' + id + ' from GitHub ' + sha);
  }
}
if (process.argv[1] && process.argv[1].endsWith('sync-confluence.mjs')) {
  main().catch(e => { console.error('::error::' + e.message); process.exitCode = 1; });
}
