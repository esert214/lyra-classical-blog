export const defaultLocale = 'zh' as const;
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

type TranslationMap = Record<string, { zh: string; en: string }>;

const translations: TranslationMap = {
  siteTitle: { zh: 'Lyra賞樂誌', en: 'Lyra Classical' },
  siteDescription: {
    zh: '古典音樂深度賞析 — 專輯介紹、名曲導聆',
    en: 'Classical music appreciation — album reviews, masterwork guides, performer features',
  },
  navHome: { zh: '首頁', en: 'Home' },
  navAlbum: { zh: '專輯介紹', en: 'Album Reviews' },
  navDaily: { zh: '每日一曲', en: 'Daily Classical' },
  switchLang: { zh: 'English', en: '中文' },
  footerTagline: {
    zh: '用耳朵旅行，穿越三百年的古典時光',
    en: 'Travel through 300 years of classical music',
  },
  albumSection: { zh: '專輯介紹', en: 'Album Reviews' },
  dailySection: { zh: '每日一曲', en: 'Daily Classical' },
  albumCount: { zh: '共 {count} 篇專輯介紹', en: '{count} albums' },
  dailyCount: { zh: '共 {count} 篇古典名曲', en: '{count} classical pieces' },
  readMore: { zh: '閱讀更多', en: 'Read More' },
  trackList: { zh: '曲目列表', en: 'Track List' },
  performerInfo: { zh: '演出者介紹', en: 'About the Performer' },
  composerInfo: { zh: '作曲家介紹', en: 'About the Composer' },
  taiwanVisit: { zh: '來台演出紀錄', en: 'Taiwan Performance History' },
  upcomingConcert: { zh: '近期現場表演資訊', en: 'Upcoming Concerts' },
  alternativeRecording: { zh: '其他推薦錄音', en: 'Alternative Recordings' },
  relatedAlbum: { zh: '同演出者其他專輯推薦', en: 'More Albums by This Performer' },
  backToList: { zh: '返回列表', en: 'Back to List' },
  pageNotFound: { zh: '頁面不存在', en: 'Page Not Found' },
  pageNotFoundDesc: {
    zh: '抱歉，您要找的頁面不存在。',
    en: 'Sorry, the page you are looking for does not exist.',
  },
  goHome: { zh: '回到首頁', en: 'Go Home' },
  moreInfo: { zh: '更多資訊 →', en: 'More Info →' },
  published: { zh: '刊登日期：', en: 'Published ' },
  saveArticle: { zh: '收藏文章', en: 'Save Story' },
  savedArticle: { zh: '已收藏', en: 'Saved' },
  bookmarks: { zh: '我的收藏', en: 'Bookmarks' },
  noBookmarks: { zh: '還沒有收藏任何文章', en: 'No saved articles yet' },
  navAbout: { zh: '關於', en: 'About' },
  navTags: { zh: '標籤', en: 'Tags' },
  catalogLabel: { zh: '唱片編號', en: 'Catalog' },
  artistLabel: { zh: '演出者', en: 'Artist' },
  releaseLabel: { zh: '發行年份', en: 'Released' },
  genreLabel: { zh: '類型', en: 'Genre' },
};

export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[locale] ?? entry[defaultLocale] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}
