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

## Project Info

- **GitHub:** https://github.com/esert214/lyra-classical-blog
- **Vercel:** https://lyra-classical-blog.vercel.app
- After `git push`, Vercel auto-deploys

## Content Generation

### 用 AI 產生新文章（給 opencode 的指令）

要新增一篇部落格文章，請對 opencode 說：

**專輯介紹：**
> 「幫我產生一篇新的專輯介紹文章，slug 為 `{slug}`，主題是 {專輯名稱/演出者}。請搜尋並放上該專輯的實際封面圖片網址在 `coverImage` 欄位。請包含中英文雙語版本，每段至少 3–5 句。」

**每日一曲：**
> 「幫我產生一篇新的每日一曲文章，slug 為 `{slug}`，主題是 {樂曲名稱/作曲家}。如果有知名的實體專輯封面，請搜尋並放上圖片網址在 `coverImage` 欄位。請包含中英文雙語版本，每段至少 3–5 句。」

**AI 產生文章時必須遵守：**
1. Slug 使用唱片編號（如 `dg-471489`），而非描述性名稱（避免不同錄音撞 slug）
2. 搜尋實際專輯封面圖片，優先使用 DG / Universal Music 官方 CDN（`images.universal-music.de`）
3. 在 `relatedAlbums` 中，若有已存在的文章則填 `slug`（內部連結），否則留空 `slug` 只填 `url`（外部連結到 DG/Presto/Amazon）
4. 自動掃描既有檔案的 `relatedAlbums`，雙向補上 `slug` 連結
5. 演出者、作曲家在 zh 檔案中以 `English（中文）` 格式填寫

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
- Entry ID = `{locale}-{slug}`（如 `zh-dg-471489`），頁面用 `data.locale + data.slug` 查詢
- Slug 命名規則：`{廠牌縮寫}-{目錄編號}`（如 `dg-471489`, `sony-smk63088`）

## Related Albums 連結行為

- `slug` 有值 → 內部連結 `/album/{slug}`（優先）
- `url` 有值但 `slug` 為空 → 外部連結 `target="_blank"`（含 ↗ 圖示）
- 兩者皆無 → 純文字顯示（不可點擊）
- Hover 時縮圖放大 2.5 倍

## Color System

- Primary: `#1e1b4b`（deep indigo）
- Accent: `#c9952e`（gold）
- Background: `#fcfbf9`（warm white）
- Surface: `#f8f7f4`
- Border: `#e6e3db`
- Muted text: `#7c7a8a`
- Fonts: Playfair Display (headings), Inter (sans), Noto Sans TC (Chinese)

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
