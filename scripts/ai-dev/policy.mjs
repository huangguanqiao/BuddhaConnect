import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';

const FORBIDDEN = [
  /^\.github\//,
  /^source\//,
  /^\.env(?:\.|$)/,
  /^AGENTS\.md$/,
  /^package(?:-lock)?\.json$/,
  /^docs\/(?:ENGINEERING_GOVERNANCE|JIRA_WORKFLOW|AI_DEVELOPMENT_PIPELINE)\.md$/,
  /^scripts\/ai-dev\//,
  /(?:^|\/)(?:credentials?|secrets?|private[-_.]?key)(?:\.|\/|$)/i
];
const LOW_RISK = /^(?:src\/(?!content\/).+\.(?:astro|css|js|mjs|ts)|tests\/.+\.test\.mjs|public\/.+\.(?:svg|png|jpg|jpeg|webp|ico))$/i;

export function assessChanges(entries, { maxFiles = 20, maxLines = 1200 } = {}) {
  const reasons = [];
  const files = entries.map(entry => entry.path);
  const totalLines = entries.reduce((sum, entry) => sum + entry.added + entry.deleted, 0);
  if (!files.length) reasons.push('no_changes');
  if (files.length > maxFiles) reasons.push('too_many_files');
  if (totalLines > maxLines) reasons.push('diff_too_large');
  for (const entry of entries) {
    if (/[\x00-\x1f\x7f\\]/.test(entry.path)) reasons.push(`unsafe_path:${JSON.stringify(entry.path)}`);
    if (entry.symlink) reasons.push(`symlink:${entry.path}`);
    if (entry.binary) reasons.push(`binary:${entry.path}`);
    if (FORBIDDEN.some(pattern => pattern.test(entry.path))) reasons.push(`protected_path:${entry.path}`);
  }
  const lowRisk = reasons.length === 0 && files.every(file => LOW_RISK.test(file));
  return { allowed: reasons.length === 0, lowRisk, reasons: [...new Set(reasons)], files, totalLines };
}

export function readGitChanges(base = 'origin/master') {
  const names = execFileSync('git', ['diff', '--name-status', '-z', '--no-renames', base, '--'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const statuses = new Map();
  for (let index = 0; index < names.length; index += 2) statuses.set(names[index + 1], names[index]);
  const nums = execFileSync('git', ['diff', '--numstat', '-z', '--no-renames', base, '--'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const tracked = nums.map(line => {
    const firstTab = line.indexOf('\t');
    const secondTab = line.indexOf('\t', firstTab + 1);
    const added = line.slice(0, firstTab);
    const deleted = line.slice(firstTab + 1, secondTab);
    const path = line.slice(secondTab + 1);
    return {
      path,
      status: statuses.get(path) ?? 'M',
      added: added === '-' ? 0 : Number(added),
      deleted: deleted === '-' ? 0 : Number(deleted),
      binary: added === '-' || deleted === '-',
      symlink: existsSync(path) && lstatSync(path).isSymbolicLink()
    };
  });
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' })
    .split('\0').filter(Boolean).map(path => {
      const symlink = lstatSync(path).isSymbolicLink();
      const content = symlink ? Buffer.alloc(0) : readFileSync(path);
      const binary = content.includes(0);
      return { path, status: 'A', added: binary ? 0 : content.toString('utf8').split('\n').length, deleted: 0, binary, symlink };
    });
  return [...tracked, ...untracked];
}
