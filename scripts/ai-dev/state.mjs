import { readFile } from 'node:fs/promises';
import { activity, jiraClient } from './jira.mjs';

async function main() {
  const action = process.argv[2];
  const task = JSON.parse(await readFile('.ai-dev/task.json', 'utf8'));
  const jira = jiraClient({ baseUrl: process.env.JIRA_BASE_URL, email: process.env.JIRA_EMAIL, apiToken: process.env.JIRA_API_TOKEN });
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  if (action === 'claim') {
    const status = await jira.transition(task.key, ['In Build', 'In Progress']);
    await jira.comment(task.key, activity({
      action: 'Autonomous implementation claimed', summary: `The guarded AI pipeline claimed ${task.key} and moved it to ${status}.`,
      changes: `Isolated branch ${task.branch}; bounded Gemini CLI execution will start without GitHub/Jira credentials in the agent process.`,
      testing: 'Pending.', references: runUrl, nextStep: 'Generate the implementation, run repository checks, and open a PR if all local gates pass.'
    }));
  } else if (action === 'failure') {
    await jira.comment(task.key, activity({
      action: 'Autonomous implementation blocked', summary: 'The guarded pipeline stopped without claiming successful delivery.',
      changes: 'No Production deployment was attempted. Inspect the linked run for the exact failed gate.', testing: 'Failed or incomplete; see run.',
      references: runUrl, nextStep: 'Human review or a later bounded retry is required.'
    }));
  } else throw new Error('Expected state action: claim or failure');
}

main().catch(error => { console.error(`Jira state update failed: ${error.message}`); process.exitCode = 1; });
