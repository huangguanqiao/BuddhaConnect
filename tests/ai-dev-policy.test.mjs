import test from 'node:test';
import assert from 'node:assert/strict';
import { assessChanges } from '../scripts/ai-dev/policy.mjs';

const entry = (path, extra = {}) => ({ path, status: 'M', added: 10, deleted: 2, binary: false, symlink: false, ...extra });

test('ordinary source and test changes can be low risk', () => {
  const result = assessChanges([entry('src/pages/about.astro'), entry('tests/about.test.mjs')]);
  assert.equal(result.allowed, true);
  assert.equal(result.lowRisk, true);
});

test('workflow, production, source archive and agent files are protected', () => {
  for (const path of ['.github/workflows/deploy.yml', 'source/original.md', 'scripts/ai-dev/execute.mjs', 'AGENTS.md', 'package-lock.json']) {
    const result = assessChanges([entry(path)]);
    assert.equal(result.allowed, false, path);
    assert.match(result.reasons.join(','), /protected_path/);
  }
});

test('content, docs and oversized diffs require manual merge or are rejected', () => {
  assert.equal(assessChanges([entry('src/content/articles/example.md')]).lowRisk, false);
  assert.equal(assessChanges([entry('docs/PROJECT.md')]).lowRisk, false);
  assert.equal(assessChanges([entry('src/pages/a.astro', { added: 1201 })]).allowed, false);
  assert.equal(assessChanges([entry('src/pages/a.astro', { symlink: true })]).allowed, false);
});
