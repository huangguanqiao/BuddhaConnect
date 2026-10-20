import {LOCALES} from './i18n.mjs';
export const SEARCH_TYPES = Object.freeze(['articles']);
export const SEARCH_SORTS = Object.freeze(['relevance','newest','oldest','title']);
export function normalizeSearchParams({language='zh-CN',query='',category='',sort='relevance'}={}) {
 if(!LOCALES.includes(language)) throw new Error('Unsupported locale');
 return {language,query:String(query).trim(),category:String(category).trim(),sort:SEARCH_SORTS.includes(sort)?sort:'relevance'};
}
export function filterSearchEntries(entries,options={}) {
 const {language,query,category,sort}=normalizeSearchParams(options);
 const q=query.toLocaleLowerCase();
 const result=entries.filter(a=>a.language===language && a.published===true)
 .filter(a=>!category || a.category===category)
 .filter(a=>!q || [a.title,a.description,a.category,a.searchText].some(v=>String(v??'').toLocaleLowerCase().includes(q)));
 const score=(a)=>!q?0:(String(a.title??'').toLocaleLowerCase().includes(q)?8:0)+(String(a.description??'').toLocaleLowerCase().includes(q)?4:0)+(String(a.category??'').toLocaleLowerCase().includes(q)?3:0)+(String(a.searchText??'').toLocaleLowerCase().includes(q)?1:0);
 result.sort((a,b)=>sort==='title'?a.title.localeCompare(b.title,language):sort==='oldest'?new Date(a.date).getTime()-new Date(b.date).getTime():sort==='newest'?new Date(b.date).getTime()-new Date(a.date).getTime():score(b)-score(a)||new Date(b.date).getTime()-new Date(a.date).getTime());
 return result;
}
