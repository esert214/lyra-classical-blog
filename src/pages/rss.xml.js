import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const albums = await getCollection('album', (e) => e.data.locale === 'zh');
  const dailies = await getCollection('daily-classical', (e) => e.data.locale === 'zh');
  const items = [
    ...albums.map((e) => ({
      title: e.data.album,
      description: `${e.data.artist} · ${e.data.releaseDate} · ${e.data.genre}`,
      pubDate: e.data.date,
      link: `/album/${e.data.slug}/`,
    })),
    ...dailies.map((e) => ({
      title: e.data.title,
      description: `${e.data.composer.name} · ${e.data.period}`,
      pubDate: e.data.date,
      link: `/daily-classical/${e.data.slug}/`,
    })),
  ];
  items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: 'Lyra賞樂誌',
    description: '古典音樂深度賞析 — 專輯介紹、名曲導聆',
    site: context.site || 'https://lyra-classical-blog.vercel.app',
    items,
  });
}
