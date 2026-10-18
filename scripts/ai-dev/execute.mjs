import { spawn } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { assessChanges, readGitChanges } from './policy.mjs';

const MAX_ATTEMPTS = Math.max(1, Math.min(3, Number(process.env.AI_MAX_ATTEMPTS || 2)));
const MODEL = /^[a-zA-Z0-9._-]{3,80}$/.test(process.env.AI_MODEL || '') ? process.env.AI_MODEL : 'gemini-2.5-flash';
const timeoutMs = 12 * 60 * 1000;

function run(command, args, { env = {}, timeout = timeoutMs } = {}) {
  return new Promise(resolve => {
    const child = spawn(command, args, { env, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    const timer = setTimeout(() => child.kill('SIGTERM'), timeout);
    child.on('close', code => { clearTimeout(timer); resolve({ code, output: output.slice(-30_000) }); });
    child.on('error', error => { clearTimeout(timer); resolve({ code: 127, output: error.message }); });
  });
}

function safeEnv() {
  const safe = { PATH: process.env.PATH, CI: 'true', NODE_ENV: 'test', HOME: process.env.HOME, npm_config_cache: process.env.npm_config_cache };
  return Object.fromEntries(Object.entries(safe).filter(([, value]) => value));
}

async function verify() {
  const tests = (await readdir('tests')).filter(name => name.endsWith('.test.mjs')).sort().map(name => `tests/${name}`);
  const commands = [
    ['node', ['--test', ...tests]],
    ['node', ['scripts/check-repository.mjs']],
    ['npm', ['run', 'check']],
    ['npm', ['run', 'build']]
  ];
  const env = safeEnv();
  for (const [command, args] of commands) {
    const result = await run(command, args, { env });
    if (result.code !== 0) return { ok: false, command: `${command} ${args.join(' ')}`, output: result.output };
  }
  return { ok: true };
}

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required');
  await mkdir('.ai-dev/home', { recursive: true });
  const basePrompt = await readFile('.ai-dev/prompt.md', 'utf8');
  let feedback = '';
  const attempts = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const prompt = `${basePrompt}${feedback}\n\nAttempt ${attempt}/${MAX_ATTEMPTS}. Implement the changes now.`;
    const agentEnv = {
      PATH: process.env.PATH,
      HOME: `${process.cwd()}/.ai-dev/home`,
      CI: 'true',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      npm_config_cache: process.env.npm_config_cache || `${process.cwd()}/.ai-dev/npm-cache`
    };
    const agent = await run('npx', ['-y', '@google/gemini-cli@0.64.0', '--skip-trust', '--approval-mode', 'auto_edit', '--model', MODEL, '--prompt', prompt], { env: agentEnv });
    if (agent.code !== 0) {
      attempts.push({ attempt, stage: 'agent', ok: false, output: agent.output });
      feedback = `\n\nThe previous agent invocation failed. Diagnose without weakening safety:\n${agent.output}`;
      continue;
    }
    const assessment = assessChanges(readGitChanges());
    if (!assessment.allowed) {
      attempts.push({ attempt, stage: 'policy', ok: false, assessment });
      throw new Error(`Generated diff rejected: ${assessment.reasons.join(', ')}`);
    }
    const verification = await verify();
    attempts.push({ attempt, stage: 'verification', ok: verification.ok, command: verification.command, assessment });
    if (verification.ok) {
      const report = { ok: true, model: MODEL, attempts, assessment };
      await writeFile('.ai-dev/result.json', JSON.stringify(report, null, 2));
      console.log(JSON.stringify(report, null, 2));
      return;
    }
    feedback = `\n\nThe implementation failed this verification command: ${verification.command}\n<verification-output>\n${verification.output}\n</verification-output>\nFix only the implementation; do not weaken or delete tests.`;
  }
  await writeFile('.ai-dev/result.json', JSON.stringify({ ok: false, model: MODEL, attempts }, null, 2));
  throw new Error(`AI implementation did not pass verification after ${MAX_ATTEMPTS} attempt(s)`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
