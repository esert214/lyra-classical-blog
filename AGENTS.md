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

### 每週批次工作流程（Weekly Batch，標準做法）

使用者每週會提供一次 **7 張專輯清單**（檔案如 `weekly/2026-W35.md`，或直接貼在對話中）。收到後照以下流程處理：

**1. 日期分配**
- 從既有文章的最後日期隔天開始，一天一篇（例：最後一篇為 08-21 → 本批 7 篇為 08-22 ~ 08-28）
- 順序依清單排列

**2. 派研究 agent（可並行）**
每張需查回：目錄編號、廠牌、封面圖 URL、發行日、演出者/作曲家 bio、來台紀錄、近期演出。
- 封面圖優先順序：Apple Music（mzstatic）→ Presto（cloudfront）→ 官方 CDN；必須驗證可用
- ⚠️ 要求 agent **不要寫入專案根目錄的 task_plan/findings/progress**（過去曾被覆寫），只回傳文字結果

**3. 獨立複查**
Agent 與清單都可能出錯，關鍵資料要自己再驗證一次：
- 目錄編號與曲目組合是否真實存在（W35 曾把 Masur/LPO 的蕭七誤列為蕭十五）
- 「XX 週年紀念版」等宣稱是否有實際發行對應
- 若查無該專輯，向使用者回報並建議替代版本，不可硬編

**4. 撰寫文章**
- 中英文各一：`src/content/album/{slug}-zh.md` / `-en.md`
- slug = `{廠牌縮寫}-{目錄編號}`
- Wally 式敘事 + fact/fiction 標記 + 完整 frontmatter（規則見上方「AI 產生文章時必須遵守」）

**5. relatedAlbums 跨連結**
- 同演出者／同作曲家／同廠牌優先用 `slug` 內部互連
- 新文章連到既有文章時，**雙向**補上既有文章的 `relatedAlbums`
- 音樂劇類互連（Hamilton↔Come From Away 等）、Pentatone 廠牌互連等

**6. 驗證與提交**
- `node scripts/validate-content.js` 通過（僅 warnings 可接受）
- `npx astro build` 確認無錯
- 一次 `git add / commit / push`（程式＋文章一起）

**7. 每日自動發佈（已內建，不需手動）**
- 文章日期未到時自動隱藏於首頁/列表（`src/lib/publish.ts` 的 `isPublished()`，以台灣時區判斷）
- GitHub Actions cron（台灣時間每日 00:05）觸發 Vercel 重建，當日文章自動「解鎖」上線
- 注意：單篇文章頁仍可直接網址訪問（getStaticPaths 不過濾），只是不會出現在列表
- 已知行為，屬正常設計

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

### 2026-08-22：研究 agent 覆寫根目錄規劃檔 + 清單資料錯誤

**問題 1：** 派出的研究 subagent 自行在專案根目錄建立/覆寫 `task_plan.md`、`findings.md`、`progress.md`，把 opencode 的規劃檔蓋掉（甚至編碼損毀）。

**解方：** 派 agent 時明確指示「不要寫入任何檔案，只回傳文字結果」；已寫入每週批次流程。

**問題 2：** 使用者的週清單（W35）含兩處錯誤：① Masur/LPO 的蕭士塔高維奇「第十五號」交響曲實際不存在（該組合錄的是第七號《列寧格勒》LPO0103）；② 「歌劇魅影 25 週年重混版」查無獨立發行。

**解方：**
1. 對清單宣稱的曲目/版本做獨立複查，不可直接照抄
2. 查無實體發行時向使用者回報並說明如何處理（改寫實際存在的版本、或請使用者替換）
3. 天鵝湖等無明確版本的項目，選擇資料最完整、可驗證的版本（如 Bel Air BAC119 影像版）並在文章中註明

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
