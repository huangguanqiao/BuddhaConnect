import { LOCALES, LOCALE_PATHS, localePrefix } from './i18n.mjs';

export { LOCALES, LOCALE_PATHS, localePrefix };

export const LOCALE_NAMES = Object.freeze({ 'zh-CN': '简体中文', 'zh-TW': '繁體中文', en: 'English' });
export const SECTION_PATHS = Object.freeze({ home: '', start: 'start', teachings: 'teachings', practice: 'practice', articles: 'articles', search: 'search', about: 'about' });
export const PRIMARY_NAV = Object.freeze(['home', 'start', 'teachings', 'practice', 'articles', 'about']);

export const UI = {
  'zh-CN': {
    skip: '跳到主要内容', menu: '菜单', close: '关闭菜单', language: '选择语言', currentLanguage: '当前语言',
    home: '首页', start: '从这里开始', teachings: '佛法教义', practice: '日常修行', articles: '文章与见解', search: '搜索', about: '关于我们',
    read: '阅读全文', browse: '浏览全部文章', back: '返回文章', empty: '当前语言暂时没有已发布文章', noResults: '没有找到匹配内容',
    fallback: '此页面尚无对应翻译，将前往所选语言的首页。', breadcrumb: '面包屑', all: '全部', category: '分类', sort: '排序',
    relevance: '相关度', newest: '最新发布', oldest: '最早发布', titleSort: '标题', clear: '清除', results: '项结果',
    searchPlaceholder: '搜索标题、摘要、分类与正文', searchHint: '仅搜索当前语言中已发布的内容。', unavailable: '内容正在准备中',
    footerPurpose: '以清晰、温和和可查证的方式，连接佛教学习与当下生活。', footerNote: '佛经与工具栏目将在有经过来源和编辑审核的内容后开放。',
    copyright: '以尊重与求证的态度分享佛教文化', editorial: '编辑说明', editorialText: '本站内容用于文化与教育交流，不替代医疗、心理或其他专业建议。',
  },
  'zh-TW': {
    skip: '跳到主要內容', menu: '選單', close: '關閉選單', language: '選擇語言', currentLanguage: '目前語言',
    home: '首頁', start: '從這裡開始', teachings: '佛法教義', practice: '日常修行', articles: '文章與觀點', search: '搜尋', about: '關於我們',
    read: '閱讀全文', browse: '瀏覽全部文章', back: '返回文章', empty: '目前語言暫時沒有已發布文章', noResults: '找不到符合的內容',
    fallback: '此頁面尚無對應翻譯，將前往所選語言的首頁。', breadcrumb: '麵包屑', all: '全部', category: '分類', sort: '排序',
    relevance: '相關度', newest: '最新發布', oldest: '最早發布', titleSort: '標題', clear: '清除', results: '項結果',
    searchPlaceholder: '搜尋標題、摘要、分類與正文', searchHint: '只搜尋目前語言中已發布的內容。', unavailable: '內容準備中',
    footerPurpose: '以清晰、溫和和可查證的方式，連結佛教學習與當下生活。', footerNote: '佛經與工具欄目將在有經過來源和編輯審核的內容後開放。',
    copyright: '以尊重與求證的態度分享佛教文化', editorial: '編輯說明', editorialText: '本站內容用於文化與教育交流，不替代醫療、心理或其他專業建議。',
  },
  en: {
    skip: 'Skip to main content', menu: 'Menu', close: 'Close menu', language: 'Choose language', currentLanguage: 'Current language',
    home: 'Home', start: 'Start here', teachings: 'Buddhist teachings', practice: 'Daily practice', articles: 'Articles & insights', search: 'Search', about: 'About us',
    read: 'Read article', browse: 'Browse all articles', back: 'Back to articles', empty: 'There are no published articles in this language yet', noResults: 'No matching content found',
    fallback: 'This page has no equivalent translation yet. You will be taken to the selected language homepage.', breadcrumb: 'Breadcrumb', all: 'All', category: 'Category', sort: 'Sort',
    relevance: 'Relevance', newest: 'Newest', oldest: 'Oldest', titleSort: 'Title', clear: 'Clear', results: 'results',
    searchPlaceholder: 'Search titles, summaries, categories and article text', searchHint: 'Searches published content in the current language only.', unavailable: 'Content in preparation',
    footerPurpose: 'Connecting Buddhist learning with everyday life through clear, gentle and verifiable content.', footerNote: 'Scripture and tools will be added to navigation only after sourced, reviewed content is ready.',
    copyright: 'Sharing Buddhist culture with care and verification', editorial: 'Editorial note', editorialText: 'This site is for cultural and educational purposes and does not replace medical, mental health or other professional advice.',
  },
};

export const PAGE_CONTENT = {
  'zh-CN': {
    home: { eyebrow: '佛教学习 · 日常实践', title: '在纷繁世界中，找到一条清晰、温和的学习路径。', description: '从可靠的入门文章开始，逐步理解佛教思想，并把觉察与善意带回日常生活。', primary: '从这里开始', secondary: '阅读文章', exploreEyebrow: '选择你的路径', exploreTitle: '不必一次理解所有事情', exploreDescription: '按照自己的兴趣和节奏，从一个真实问题、一篇短文或一个简单练习开始。', latestEyebrow: '最新发布', latestTitle: '经过编辑流程的阅读内容', latestDescription: '这里只展示当前语言中已经发布的文章。', values: [['清晰', '为初学者解释术语与背景。'], ['审慎', '区分原典、传统解释与编辑说明。'], ['开放', '尊重不同佛教传统与学习节奏。']] },
    start: { eyebrow: '初学者路径', title: '从这里开始', description: '不需要预先知道答案。先了解网站如何组织内容，再从一篇已发布的入门文章开始。', intro: '适合第一次接触佛教的读者', note: '入门内容会先说明范围与背景；涉及经典或传统观点时，需要经过来源与编辑审核。' },
    teachings: { eyebrow: '理解与思考', title: '佛法教义', description: '通过已发布的解释性文章了解重要观念，并留意不同传统可能存在的表达差异。', intro: '已发布的教义相关文章', note: '此栏目不把编辑说明当作经文，也不提供尚未建立索引的佛经全文搜索。' },
    practice: { eyebrow: '回到当下', title: '日常修行', description: '从短小、可行的日常练习阅读开始，不追求表演式的完美。', intro: '已发布的日常实践文章', note: '练习内容仅供文化与教育参考，不替代专业医疗或心理支持。' },
    articles: { eyebrow: '文章与见解', title: '按自己的节奏阅读', description: '浏览当前语言中已经发布的内容；草稿、未审核内容和其他语言版本不会混入列表。' },
    search: { eyebrow: '站内搜索', title: '找到适合此刻的阅读', description: '搜索当前语言中已发布文章的标题、摘要、分类和正文。' },
    about: { eyebrow: '关于 BuddhaConnect', title: '让学习更清楚，也更贴近日常。', description: 'BuddhaConnect 是一个以阅读、理解与日常实践为中心的佛教文化教育网站。', intro: '我们的工作方式', paragraphs: ['我们以平实、开放的方式介绍佛教文化与思想，并尊重不同传统之间的差异。', '网站仍在持续建设。现有内容数量有限；没有经过来源、版权和编辑审核的材料不会作为已完成栏目发布。', '三种语言共享同一套产品体验，但文章只有在对应语言版本真实存在并发布后才会显示。'] },
  },
  'zh-TW': {
    home: { eyebrow: '佛教學習 · 日常實踐', title: '在紛繁世界中，找到一條清晰、溫和的學習路徑。', description: '從可靠的入門文章開始，逐步理解佛教思想，並把覺察與善意帶回日常生活。', primary: '從這裡開始', secondary: '閱讀文章', exploreEyebrow: '選擇你的路徑', exploreTitle: '不必一次理解所有事情', exploreDescription: '按照自己的興趣和步調，從一個真實問題、一篇短文或一個簡單練習開始。', latestEyebrow: '最新發布', latestTitle: '經過編輯流程的閱讀內容', latestDescription: '這裡只展示目前語言中已經發布的文章。', values: [['清晰', '為初學者解釋術語與背景。'], ['審慎', '區分原典、傳統解釋與編輯說明。'], ['開放', '尊重不同佛教傳統與學習步調。']] },
    start: { eyebrow: '初學者路徑', title: '從這裡開始', description: '不需要預先知道答案。先了解網站如何組織內容，再從一篇已發布的入門文章開始。', intro: '適合第一次接觸佛教的讀者', note: '入門內容會先說明範圍與背景；涉及經典或傳統觀點時，需要經過來源與編輯審核。' },
    teachings: { eyebrow: '理解與思考', title: '佛法教義', description: '透過已發布的解釋性文章了解重要觀念，並留意不同傳統可能存在的表達差異。', intro: '已發布的教義相關文章', note: '此欄目不把編輯說明當作經文，也不提供尚未建立索引的佛經全文搜尋。' },
    practice: { eyebrow: '回到當下', title: '日常修行', description: '從短小、可行的日常練習閱讀開始，不追求表演式的完美。', intro: '已發布的日常實踐文章', note: '練習內容僅供文化與教育參考，不替代專業醫療或心理支持。' },
    articles: { eyebrow: '文章與觀點', title: '按自己的步調閱讀', description: '瀏覽目前語言中已發布的內容；草稿、未審核內容和其他語言版本不會混入列表。' },
    search: { eyebrow: '站內搜尋', title: '找到適合此刻的閱讀', description: '搜尋目前語言中已發布文章的標題、摘要、分類和正文。' },
    about: { eyebrow: '關於 BuddhaConnect', title: '讓學習更清楚，也更貼近日常。', description: 'BuddhaConnect 是一個以閱讀、理解與日常實踐為中心的佛教文化教育網站。', intro: '我們的工作方式', paragraphs: ['我們以平實、開放的方式介紹佛教文化與思想，並尊重不同傳統之間的差異。', '網站仍在持續建設。現有內容數量有限；沒有經過來源、版權和編輯審核的材料不會作為已完成欄目發布。', '三種語言共享同一套產品體驗，但文章只有在對應語言版本真實存在並發布後才會顯示。'] },
  },
  en: {
    home: { eyebrow: 'Buddhist learning · Everyday practice', title: 'Find a clear, gentle path through a complicated world.', description: 'Begin with carefully prepared introductory articles, explore Buddhist ideas step by step, and bring awareness and kindness into daily life.', primary: 'Start here', secondary: 'Read articles', exploreEyebrow: 'Choose your path', exploreTitle: 'You do not need to understand everything at once', exploreDescription: 'Follow your own questions and pace, beginning with one honest question, a short article, or a simple practice.', latestEyebrow: 'Recently published', latestTitle: 'Reading that has passed the editorial workflow', latestDescription: 'Only published content in the current language appears here.', values: [['Clear', 'Terms and context are explained for newcomers.'], ['Careful', 'Source text, tradition and editorial explanation stay distinct.'], ['Open', 'Different Buddhist traditions and learning paces are respected.']] },
    start: { eyebrow: 'A beginner path', title: 'Start here', description: 'You do not need to arrive with answers. Learn how the library is organised, then begin with a published introductory article.', intro: 'For readers meeting Buddhism for the first time', note: 'Introductory content explains its scope and context. Material about scripture or traditional positions requires source and editorial review.' },
    teachings: { eyebrow: 'Understand and reflect', title: 'Buddhist teachings', description: 'Explore important ideas through published explanatory articles, while recognising that traditions may express them differently.', intro: 'Published articles about teachings', note: 'This section does not present editorial explanation as scripture or claim a full-text scripture index that does not exist.' },
    practice: { eyebrow: 'Return to the present', title: 'Daily practice', description: 'Begin with short, practical reading for everyday life, without turning practice into a performance of perfection.', intro: 'Published everyday-practice articles', note: 'Practice content is for cultural and educational use and is not a substitute for professional medical or mental health support.' },
    articles: { eyebrow: 'Articles & insights', title: 'Read at your own pace', description: 'Browse published content in this language. Drafts, unreviewed material and other-language editions are kept out of the list.' },
    search: { eyebrow: 'Site search', title: 'Find the reading you need now', description: 'Search titles, summaries, categories and article text from published content in the current language.' },
    about: { eyebrow: 'About BuddhaConnect', title: 'Make learning clearer and closer to daily life.', description: 'BuddhaConnect is a Buddhist cultural education website centred on reading, understanding and everyday practice.', intro: 'How we work', paragraphs: ['We introduce Buddhist culture and ideas in plain, open language while respecting differences among traditions.', 'The site is still growing and the current library is small. Material without source, rights and editorial review will not be presented as a finished collection.', 'All three languages share one product experience, but an article appears only when a real, published edition exists in that language.'] },
  },
};

export function localeFromPath(pathname) {
  const part = pathname.split('/').filter(Boolean)[0];
  return LOCALES.find((locale) => LOCALE_PATHS[locale] === part) ?? 'zh-CN';
}

export function localizedPath(locale, section = 'home') {
  const segment = SECTION_PATHS[section];
  if (segment === undefined) throw new Error(`Unknown section: ${section}`);
  return `${localePrefix(locale)}/${segment ? `${segment}/` : ''}`;
}

export function translationLinksFor(section) {
  return LOCALES.map((locale) => ({ locale, url: localizedPath(locale, section) }));
}

export function stripMarkdown(value = '') {
  return String(value).replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]+)`/g, '$1').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/^[#>*+-]+\s*/gm, '').replace(/[\*_~]/g, '').replace(/\s+/g, ' ').trim();
}

export function localizedEntry(entry) {
  return { articleId: entry.data.articleId ?? entry.id, language: entry.data.language, slug: entry.data.slug ?? entry.id, title: entry.data.title, description: entry.data.description, category: entry.data.category, section: entry.data.section ?? 'teachings', date: entry.data.date, published: entry.data.published, searchText: stripMarkdown(entry.body ?? '') };
}
