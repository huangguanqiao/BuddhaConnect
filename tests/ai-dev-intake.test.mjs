import test from 'node:test';import assert from 'node:assert/strict';
import {evaluateIssue,planIssues,fetchJiraIssues} from '../scripts/ai-dev/intake.mjs';
const issue=(key='BUD-99',extra={})=>({key,fields:{summary:'Add accessible FAQ page',description:'Add page and unit tests, acceptance criteria are specified.',labels:['ai-ready'],issuetype:{name:'Task'},status:{name:'To Do'},...extra}});
test('only explicitly opted-in BUD tasks accepted',()=>{
 assert.equal(evaluateIssue(issue()).eligible,true);
 assert.equal(evaluateIssue(issue('ABC-2')).eligible,false);
 assert.equal(evaluateIssue(issue('BUD-99',{labels:[]})).eligible,false);
});
test('high-risk work is held for manual review',()=>{
 assert.equal(evaluateIssue(issue('BUD-10',{summary:'Rotate production secret'})).eligible,false);
 assert.equal(evaluateIssue(issue('BUD-10',{summary:'删除数据'})).eligible,false);
});
test('one task per run and duplicate active tasks excluded',()=>{
 const plan=planIssues([issue('BUD-12'),issue('BUD-11'),issue('BUD-13')],{limit:50,activeKeys:['BUD-11']});
 assert.deepEqual(plan.selected.map(x=>x.key),['BUD-12']);
 assert.equal(plan.mode,'dry_run');
});
test('Jira credentials and HTTPS site are mandatory',async()=>{
 await assert.rejects(()=>fetchJiraIssues({baseUrl:'http://evil.example',email:'a',apiToken:'b'}));
 await assert.rejects(()=>fetchJiraIssues({baseUrl:'https://example.atlassian.net',email:'',apiToken:''}));
});
test('fetch reads only Jira search API',async()=>{
 let method='';
 const data=await fetchJiraIssues({baseUrl:'https://example.atlassian.net',email:'a@example.com',apiToken:'test',fetchImpl:async(url,opts)=>{assert.match(String(url),/\/rest\/api\/3\/search\/jql/);method=opts.method??'GET';return {ok:true,json:async()=>({issues:[issue()]})}}});
 assert.equal(method,'GET');assert.equal(data.length,1);
});
