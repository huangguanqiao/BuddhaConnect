import {fetchJiraIssues,planIssues} from './intake.mjs';
import {writeFile} from 'node:fs/promises';
const output=process.env.GITHUB_STEP_SUMMARY;
async function main(){
 const configured=Boolean(process.env.JIRA_BASE_URL&&process.env.JIRA_EMAIL&&process.env.JIRA_API_TOKEN);
 if(!configured){
  const report={mode:'dry_run',configured:false,selected:[],message:'Jira credentials not configured. No action taken.'};
  console.log(JSON.stringify(report,null,2));
  if(output)await writeFile(output,'## AI Development Intake\n\nJira credentials not configured. Dry run only.\n',{flag:'a'});
  return;
 }
 const issues=await fetchJiraIssues({baseUrl:process.env.JIRA_BASE_URL,email:process.env.JIRA_EMAIL,apiToken:process.env.JIRA_API_TOKEN});
 const plan=planIssues(issues,{limit:1});
 console.log(JSON.stringify(plan,null,2));
 if(output)await writeFile(output,`## AI Development Intake\n\nMode: **dry_run**\n\nEligible candidate(s): ${plan.selected.map(x=>x.key).join(', ')||'none'}\n\nNo Jira or GitHub mutations were performed.\n`,{flag:'a'});
}
main().catch(e=>{console.error('Intake failed:',e.message);process.exitCode=1});
