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

Validate content (check relatedAlbums, slug format, etc.):
```
node scripts/validate-content.js
```

**每次新增或修改文章後，必須跑一次 validate 確認通過。**

## Project Info

- **GitHub:** https://github.com/esert214/lyra-classical-blog
- **Vercel:** https://lyra-classical-blog.vercel.app
- After `git push`, GitHub Action 觸發 Vercel Deploy Hook 自動部署

## Content Generation

### 用 AI 產生新文章（給 opencode 的指令）

**最簡單的方法：直接丟網址**

對 opencode 說：
> 「幫我寫這張專輯：`{網址}`」

opencode 會自動：
1. 到該網頁查專輯資訊、目錄編號、封面圖
2. 從目錄編號決定 slug（如 `dg-471489`）
3. 寫中英文全文（每段 3–5 句）
4. 自動 `git add / commit / push`
5. Vercel 自動上線

**或者手動指定：**

**專輯介紹：**
> 「幫我產生一篇新的專輯介紹文章，slug 為 `{slug}`，主題是 {專輯名稱/演出者}。」

**每日一曲：**
> 「幫我產生一篇新的每日一曲文章，slug 為 `{slug}`，主題是 {樂曲名稱/作曲家}。」

**AI 產生文章時必須遵守：**
1. Slug 使用唱片編號（如 `dg-471489`），而非描述性名稱（避免不同錄音撞 slug）
2. 搜尋實際專輯封面圖片，優先使用 DG / Universal Music 官方 CDN（`images.universal-music.de`）
3. 在 `relatedAlbums` 中，若有已存在的文章則填 `slug`（內部連結），否則留空 `slug` 只填 `url`（外部連結到 DG/Presto/Amazon）
4. **`relatedAlbums` 推薦的專輯必須與本文演出者/風格相關，不可推薦完全不同演出者的專輯**
5. **外部連結的 URL 必須經搜尋確認指向正確的專輯頁面，不可猜測或拼湊 URL**
6. **composers 必須涵蓋曲目中所有出现的作曲家，不可人為設上限**
7. 自動掃描既有檔案的 `relatedAlbums`，雙向補上 `slug` 連結
8. 演出者、作曲家在 zh 檔案中以 `English（中文）` 格式填寫
9. **生成後必須逐一檢查以下 frontmatter，不可遺漏：**
   - `hasPerformedInTaiwan`：不可都是 `false`，需查證演出者是否來過台灣
   - `taiwanVisitDetail`：不論 true/false 都必須填寫原因
   - `upcomingConcerts`：如有近期演出必須填寫
   - `relatedAlbums`：優先以 `slug` 連結同演出者的現有文章；無現有文章則以外部 `url` 推薦同演出者的其他專輯
10. 完成後跑 `node scripts/validate-content.js` 確認通過（若僅有 warnings 無 errors 仍可提交）
11. 最後自動 `git add / commit / push`，不需使用者手動操作
11. **寫作風格：採用瓦力唱片行（Wally Records）式敘事風格** — 第一人稱、情感鉤子、短段落、音樂作為人類故事的載體，避免技術分析或樂章拆解式的寫法
12. **每句標記 fact/fiction** — 在 body 中每段／句後以 `<!-- fact: ... -->` 或 `<!-- fiction: ... -->` HTML comment 標註哪些是查證事實、哪些是文學創作，方便日後調整風格

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

## Notable Recordings 連結行為

每日一曲的 `notableRecordings` 支援與 `relatedAlbums` 相同的連結邏輯：

- `slug` 有值 → 內部連結 `/album/{slug}`（優先）
- `url` 有值但 `slug` 為空 → 外部連結 `target="_blank"`（含 ↗ 圖示）
- 兩者皆無 → 純文字顯示（不可點擊）

## Development Lessons

### 2026-07-13：確定敘事風格為 Wally 式 + fact/fiction 標記

**問題：** 最初的兩篇文章（Beethoven 5、Barber Adagio）使用傳統古典樂評風格——樂章分解、結構分析、技巧描述——讀起來像教科書而非部落格。

**轉折：** 寫 Three Tenors 1994 文章時意外採用了瓦力唱片行式的敘事風格（第一人稱、短段落、情感驅動），使用者確認「不錯」並要求其他文章比照辦理。

**現在標準（已加入 AGENTS.md AI 規則）：**
1. 所有新文章採用 Wally 式敘事：第一人稱、情感鉤子、短段落、音樂作為人類故事的載體
2. 每句/段後以 `<!-- fact: -->` / `<!-- fiction: -->` HTML comment 標記哪些是查證事實、哪些是文學創作
3. 避免技術分析（不要寫「第一樂章 Allegro con brio，C 小調」式的教科書內容）

**工具：**
- 一個 Python 腳本 `check_simplified.py` 建立於 temp 目錄，供日後檢查繁簡混用問題

### 2026-07-13：relatedAlbums 推薦了不相關的專輯

**問題：** 為三大男高音（Three Tenors）的文章建立 `relatedAlbums` 時，AI 自動推薦了貝多芬第五號交響曲（Berlin Philharmonic / Abbado），因為那是當時唯一已存在的文章。但這兩張專輯的演出者、風格完全不同，推薦給使用者毫无意義。

**根因：** AI 在沒有已有文章可連結時，會機械式地填入任何現有文章的 `slug`，忽略了「演出者/風格是否相關」的判斷。

**解方：**
1. 建立 `scripts/validate-content.js` 驗證腳本，檢查：
   - `relatedAlbums` 的 `slug` 必須對應到已存在的文章
   - 外部連結的 artist 必須與當前文章的 artist/tags 有重疊
   - `relatedAlbums` 必須有 `slug` 或 `url`，不可兩者皆空
   - slug 格式必須包含 `-`
2. 加入 `prebuild` hook，`npm run build` 前自動驗證
3. AGENTS.md 規則明確記載：「不可推薦完全不同演出者的專輯」

**經驗：** 當已有文章數量少時，寧可 `relatedAlbums` 留空或只放外部連結到同系列/同演出者的專輯，也不要硬塞不相關的內部連結。

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
