#!/usr/bin/env node
// Deterministic, offline documentation / article quality checks.
// This checker cannot validate doctrinal accuracy, licensing or external HTTP links.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

function scan(dir, skip = new Set(['node_modules', 'dist', '.git', '.astro', 'source'])) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
    if (ent.isDirectory()) return skip.has(ent.name) ? [] : scan(resolve(dir, ent.name), skip);
    return ent.isFile() && /\.(md|mdx)$/i.test(ent.name) ? [resolve(dir, ent.name)] : [];
  });
}
export function validate(root = DEFAULT_ROOT) {
  const errors = [], warnings = [];
  const docs = [...scan(resolve(root, 'docs')), ...scan(resolve(root, 'src/content/articles')), ...['AGENTS.md','README.md'].map(p => resolve(root,p)).filter(existsSync)];
  for (const file of docs) {
    const txt = readFileSync(file, 'utf8');
    const fileId = relative(root, file);
    if (!txt.trim()) { errors.push(fileId + ': empty Markdown file'); continue; }
    if (file.includes(sep + 'src' + sep + 'content' + sep + 'articles' + sep)) {
      const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!fm) errors.push(fileId + ': missing YAML frontmatter');
      else for (const k of ['title','description','date']) {
        if (!new RegExp('^' + k + ':\\s*\\S+', 'm').test(fm[1])) errors.push(fileId + ': missing ' + k + ' frontmatter');
      }
      // Human editorial/source review remains mandatory; automation does not approve quotations or rights.
    }
    // Ignore fenced code examples and inline code snippets when scanning local Markdown links.
    const safeText = txt.replace(/^([ \t]*)(```|~~~)[^\r\n]*\r?\n[\s\S]*?^\1\2[ \t]*$/gm, '').replace(/`[^`\n]*`/g, '');
    for (const m of safeText.matchAll(/!?\[[^\]\r\n]*\]\(([^)\r\n]+)\)/g)) {
      let dest = m[1].trim().replace(/^<|>$/g, '').split(/\s+["']/)[0];
      if (!dest || /^(https?:|mailto:|tel:|data:|#)/i.test(dest) || dest.startsWith('//')) continue;
      try { dest = decodeURIComponent(dest.split('#')[0].split('?')[0]); } catch { errors.push(fileId + ': invalid URI encoding'); continue; }
      if (!dest) continue;
      // Absolute site routes are Astro/build-dependent; do not pretend to validate them locally.
      if (dest.startsWith('/')) { warnings.push(fileId + ': absolute site route not validated: ' + dest); continue; }
      const target = resolve(dirname(file), dest);
      if (!target.startsWith(root + sep) && target !== root) { errors.push(fileId + ': relative link escapes repository: ' + dest); continue; }
      if (!existsSync(target)) errors.push(fileId + ': broken relative link: ' + dest);
    }
  }
  return { errors, warnings, filesChecked: docs.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validate(process.cwd());
  console.log('Checked ' + result.filesChecked + ' Markdown files.');
  for (const warn of result.warnings) console.log('WARNING ' + warn);
  for (const err of result.errors) console.error('ERROR ' + err);
  if (result.errors.length) process.exitCode = 1;
}
