/** BUD-21: locale and article identity contract. No implicit translation fallback. */
export const LOCALES = Object.freeze(['zh-CN', 'zh-TW', 'en']);
export const LOCALE_PATHS = Object.freeze({'zh-CN':'zh','zh-TW':'zh-tw',en:'en'});
export const DEFAULT_LOCALE = 'zh-CN';

export function isLocale(locale) {
  return LOCALES.includes(locale);
}
export function localePrefix(locale) {
  if (!isLocale(locale)) throw new Error('Unsupported locale: '+locale);
  return '/'+LOCALE_PATHS[locale];
}
export function articleIdentity(articleId, locale) {
  if (!articleId || typeof articleId !== 'string' || !isLocale(locale)) throw new Error('Invalid article identity');
  return JSON.stringify([articleId, locale]);
}
export function publishedArticlesForLocale(articles, locale) {
  if (!isLocale(locale)) throw new Error('Unsupported locale');
  return articles.filter(a => a.language === locale && a.published === true);
}
export function articleUrl(article) {
  if (!article?.slug || !article?.articleId) throw new Error('Missing article slug or identity');
  return localePrefix(article.language)+'/articles/'+encodeURIComponent(article.slug)+'/';
}
export function translationUrl(articles, articleId, locale) {
  const translated = publishedArticlesForLocale(articles, locale).find(a=>a.articleId===articleId);
  return translated ? articleUrl(translated) : null;
}
export function searchArticles(articles, locale, query) {
  const needle = String(query ?? '').trim().toLocaleLowerCase();
  return publishedArticlesForLocale(articles, locale).filter(a =>
    !needle || [a.title, a.description, a.category].some(v=>String(v??'').toLocaleLowerCase().includes(needle))
  );
}
export function assertUniqueArticleLocales(articles) {
  const seen = new Set();
  for (const a of articles) {
    const key = articleIdentity(a.articleId, a.language);
    if (seen.has(key)) throw new Error('Duplicate Article ID + Language: '+key);
    seen.add(key);
  }
  return true;
}
