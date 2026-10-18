import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validate } from '../scripts/check-repository.mjs';

function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'bud-quality-'));
  try { mkdirSync(join(root, 'docs')); mkdirSync(join(root, 'src/content/articles'), { recursive: true }); fn(root); }
  finally { rmSync(root, { recursive: true, force: true }); }
}
test('valid doc links and article frontmatter pass', () => fixture(root => {
  writeFileSync(join(root,'docs','guide.md'), '# Guide\n[Relative](page.md)\n');
  writeFileSync(join(root,'docs','page.md'), '# Page\n');
  writeFileSync(join(root,'src/content/articles','a.md'), '---\ntitle: Good\ndescription: Test\ndate: 2026-10-18\n---\nBody\n');
  assert.deepEqual(validate(root).errors, []);
}));
test('broken local Markdown links fail', () => fixture(root => {
  writeFileSync(join(root,'docs','guide.md'), '[Missing](not-here.md)\n');
  assert.ok(validate(root).errors.some(x => x.includes('broken relative link')));
}));
test('missing article metadata fails', () => fixture(root => {
  writeFileSync(join(root,'src/content/articles','a.md'), '---\ntitle: A\n---\nBody\n');
  assert.ok(validate(root).errors.some(x => x.includes('missing description')));
}));
