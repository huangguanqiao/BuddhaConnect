import test from 'node:test';
import assert from 'node:assert/strict';
import {articleIdentity,articleUrl,searchArticles,translationUrl,assertUniqueArticleLocales} from '../src/lib/i18n.mjs';
const entries=[
 {articleId:'ART-1',language:'zh-CN',slug:'sidi',title:'四圣谛',published:true},
 {articleId:'ART-1',language:'en',slug:'four-truths',title:'Four Noble Truths',published:true},
 {articleId:'ART-2',language:'en',slug:'english-only',title:'English only',published:true},
 {articleId:'ART-3',language:'zh-CN',slug:'draft',title:'未发布',published:false},
];
test('same Article ID may have different locales',()=>assert.notEqual(articleIdentity('ART-1','en'),articleIdentity('ART-1','zh-CN')));
test('search is locale isolated and published only',()=>{
 assert.deepEqual(searchArticles(entries,'zh-CN','English'),[]);
 assert.deepEqual(searchArticles(entries,'zh-CN','').map(a=>a.title),['四圣谛']);
});
test('translation navigation never falls back to wrong locale',()=>{
 assert.equal(translationUrl(entries,'ART-1','en'),'/en/articles/four-truths/');
 assert.equal(translationUrl(entries,'ART-2','zh-CN'),null);
});
test('duplicate article-locale pairs fail closed',()=>{
 assert.throws(()=>assertUniqueArticleLocales([...entries,entries[0]]),/Duplicate/);
 assert.equal(assertUniqueArticleLocales(entries),true);
});
test('article route is localized',()=>assert.equal(articleUrl(entries[0]),'/zh/articles/sidi/'));
