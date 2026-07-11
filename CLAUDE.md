## Development

Start the dev server:
```
npx astro dev
```

Build the site:
```
npx astro build
```

Preview the build:
```
npx astro preview
```

## Content Generation

### 用 AI 產生新文章（給 opencode 的指令）

要新增一篇部落格文章，請對 opencode 說：

**專輯介紹：**
> 「幫我產生一篇新的專輯介紹文章，slug 為 `{slug}`，主題是 {專輯名稱/演出者}。請搜尋並放上該專輯的實際封面圖片網址在 `coverImage` 欄位。請包含中英文雙語版本，每段至少 3–5 句。」

**每日一曲：**
> 「幫我產生一篇新的每日一曲文章，slug 為 `{slug}`，主題是 {樂曲名稱/作曲家}。如果有知名的實體專輯封面，請搜尋並放上圖片網址在 `coverImage` 欄位。請包含中英文雙語版本，每段至少 3–5 句。」

### 或者手動建立

```
.\scripts\generate-article.ps1 -Type album -Slug my-new-slug
.\scripts\generate-article.ps1 -Type daily-classical -Slug my-new-slug
```

此腳本會建立中英文 frontmatter 模板，然後交給 AI 填寫內容。

## Content Structure

- `src/content/album/{slug}-zh.md` — 中文專輯介紹
- `src/content/album/{slug}-en.md` — 英文專輯介紹
- `src/content/daily-classical/{slug}-zh.md` — 中文每日一曲
- `src/content/daily-classical/{slug}-en.md` — 英文每日一曲

## Deployment

### Vercel (推薦)

1. Push to GitHub
2. Import repo on https://vercel.com
3. Framework preset: **Astro**
4. Deploy — done

### Netlify

1. Push to GitHub
2. Import repo on https://netlify.com
3. Build command: `npx astro build`
4. Publish directory: `dist`
5. Deploy — done

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
