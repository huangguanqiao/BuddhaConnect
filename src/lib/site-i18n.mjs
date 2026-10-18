import {LOCALES,LOCALE_PATHS,localePrefix} from './i18n.mjs';
export {LOCALES,LOCALE_PATHS,localePrefix};
export const UI = {
 'zh-CN':{home:'首页',articles:'文章',search:'搜索文章',read:'阅读全文',back:'返回文章',empty:'当前语言暂无文章',noResults:'没有匹配的文章',intro:'探索佛教文化、经典与生活智慧',all:'全部文章',missing:'此文章暂未提供所选语言版本'},
 'zh-TW':{home:'首頁',articles:'文章',search:'搜尋文章',read:'閱讀全文',back:'返回文章',empty:'目前語言尚無文章',noResults:'找不到符合的文章',intro:'探索佛教文化、經典與生活智慧',all:'全部文章',missing:'此文章尚未提供所選語言版本'},
 en:{home:'Home',articles:'Articles',search:'Search articles',read:'Read article',back:'Back to articles',empty:'No articles available in this language',noResults:'No matching articles',intro:'Explore Buddhist culture, teachings and everyday wisdom',all:'All articles',missing:'This article is not available in the selected language'}
};
export function localeFromPath(pathname) {
 const part=pathname.split('/').filter(Boolean)[0];
 return LOCALES.find(l=>LOCALE_PATHS[l]===part) ?? 'zh-CN';
}
export function localizedEntry(entry) {
 return {articleId:entry.data.articleId??entry.id,language:entry.data.language,slug:entry.data.slug??entry.id,title:entry.data.title,description:entry.data.description,category:entry.data.category,published:entry.data.published};
}
