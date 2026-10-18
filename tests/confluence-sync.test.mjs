import test from 'node:test';
import assert from 'node:assert/strict';
import { buildManagedPage, assertManagedExisting, readMapping } from '../scripts/sync-confluence.mjs';

test('only explicitly-managed Confluence pages can be written', () => {
  assert.throws(() => assertManagedExisting({ title:'Human page', version:{number:2}, body:{storage:{value:'<p>Human content</p>'}} }), /not managed/);
});
test('managed pages require valid version and title', () => {
  assert.doesNotThrow(() => assertManagedExisting({ title:'Approved machine page', version:{number:1}, body:{storage:{value:'BC_GITHUB_SYNC_MANAGED_V1'}} }));
});
test('sync index pins immutable source commit', () => {
  const html = buildManagedPage({title:'Index',repo:'example/test',sha:'a'.repeat(40),sources:['AGENTS.md']});
  assert.ok(html.includes('BC_GITHUB_SYNC_MANAGED_V1'));
  assert.ok(html.includes('/blob/' + 'a'.repeat(40) + '/AGENTS.md'));
});
test('invalid allowlist rejected before any writes', () => {
  assert.throws(() => readMapping('{"pages":[{"pageId":"oops","title":"Bad","sources":["AGENTS.md"]}]}'), /numeric/);
  assert.throws(() => buildManagedPage({ title:'Bad',repo:'example/test',sha:'a'.repeat(40),sources:['../secret.md'] }), /Invalid source/);
});
