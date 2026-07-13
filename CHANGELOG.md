# Lyra賞樂誌 — 開發紀錄

## [0.6.0] — 2026-07-13

### 寫作風格全面翻新（Wally 敘事風）

- **風格轉換** — 全部 6 篇文章（3 篇 × zh/en）從傳統古典樂評改寫為瓦力唱片行式敘事：
  - Beethoven 5 / Abbado（dg-471489）— 以阿巴多抗癌錄音為敘事核心
  - Three Tenors 1990（decca-4304332）— 用第一人稱電視記憶重寫
  - Three Tenors 1994（teldec-450996200）— 新文章，道奇體育場的全球集體記憶
  - Barber Adagio（sony-smk63088）— 從《前進高棉》電影場景切入
- **Fact/Fiction 標記** — 每篇 body 中以 `<!-- fact: -->` / `<!-- fiction: -->` HTML comment 標示查證事實與文學創作，方便日後調整風格
- **過往文章補標** — 重新讀取三篇舊文，加上完整 fact/fiction 標記

### 繁簡檢查

- 發現 `decca-4304332-zh.md` 有 3 個簡體字（创→創、过→過、万→萬），已修正
- 建立 `check_simplified.py` 腳本供日後自動檢查

### 首頁排序修正

- 不同文章設為不同日期，確保 newest-first 排序正確
- `HomePage.astro` sort 邏輯加入 `slug` 作為同日期時的穩定排序 tiebreaker

### 頁面數量

- 56 pages（+ new Three Tenors 1994 article zh/en）

## [0.5.1] — 2026-07-13

### 連結修正

- `decca-4304332` relatedAlbums 中「Paris 1994」更正為「Los Angeles 1994」
- 新增 `slug: "teldec-450996200"` 雙向連結新文章

## [0.5.0] — 2026-07-12

### RWD 響應式排版

- **Header 漢堡選單** — 手機版（< 768px）導覽列隱藏，改為漢堡按鈕觸發下拉選單，點擊外部自動關閉
- **全站手機排版調整** — Hero padding/font 縮減、main-content padding 縮減、卡片網格變單欄
- **Detail 頁面手機優化** — 標題字縮小、封面圖高度降低、related grid 變單欄

### 錄音版本連結

- `notableRecordings` schema 新增 `slug`（內部連結）與 `url`（外部連結）可選欄位
- 每日一曲頁面的錄音卡片現在可以連結到對應的專輯介紹頁面或外部來源
- 連結行為與 `relatedAlbums` 一致：`slug` 優先 → `url` 外部 → 純文字

### Vercel 部署修復

- 發現 Vercel 的 GitHub 整合未正確運作，自動部署失效
- 改為 GitHub Actions + Vercel Deploy Hook 方式觸發部署
- 每次 `git push` 到 `main` → GitHub Action 觸發 → Vercel 自動部署

## [0.2.0] — 2026-07-11

### 視覺大改版

- 色系全面更換：深靛藍 `#1e1b4b`／金 `#c9952e`／暖白 `#fcfbf9`
- 字體導入：Playfair Display（標題）、Inter（內文）、Noto Sans TC（中文）
- Hero 區使用 Elbphilharmonie 音樂廳照片 + 深色漸層 overlay
- 頁面背景加入紙紋 SVG 材質（subtle paper noise）
- 卡片 hover 陰影 lift 效果
- SVG 箭頭取代文字 ← 返回按鈕

### Schema 強化

- `performers` 從字串陣列改為物件 `{ name, role, bio }` — 支援角色與人物簡介
- `composers` 從字串陣列改為物件 `{ name, bio }` — 支援作曲家簡介
- `relatedAlbums` 新增 `slug`（內部連結）與 `url`（外部連結）雙欄位
- 新增 `catalogNumber` 欄位儲存唱片編號
- 中文內容名稱使用 `English（中文）` 格式

### Slug 命名規範

- 改採唱片編號作為 slug：`dg-471489`（原 `beethoven-sym5`）、`sony-smk63088`（原 `barber-adagio`）
- 避免不同錄音版本撞 slug

### 內容頁面元件

- AlbumDetail：演出者卡片（大頭貼 + 角色 + bio）、來台紀實圖片區、未來音樂會清單、相關推薦專輯（區分內外部連結 + ↗ 圖示）、hover 縮圖放大 2.5 倍
- DailyDetail：作曲家卡片 + bio、知名錄音版本列表

### 樣本內容更新

- 貝多芬第五號（dg-471489）— 使用 DG Universal Music CDN 真實封面圖、各樂章賞析、聆聽建議
- 巴伯弦樂慢板（sony-smk63088）
- 中英文格式統一：`English（中文）`

### 部署

- Git 初始化 + 推送至 GitHub（esert214/lyra-classical-blog）
- 部署至 Vercel（https://lyra-classical-blog.vercel.app）
- 自動 CI/CD（push → auto-deploy）

## [0.3.0] — 2026-07-11

### 工作流程確立

- 使用者只需提供商品網址（博客來 / Presto Music / DG 官網）→ AI 自動查資料、寫中英文文章、git push 上線
- Slug 由 AI 從目錄編號自動決定（如 `dg-471489`），使用者無需知道 slug
- 建立 `new-album.bat` / `new-daily.bat` — 雙擊即產模板 + git push
- 未來多站策略：科技 / 閱讀等新站另開獨立 repo，從此專案拷貝改造，不混在同一站

### 錯誤修正

- 移除 relatedAlbums 中不存在的 `slug`（`dg-471490`、`dg-471491`），改為純外部連結（Deutsche Grammophon）
- 修正 scripts/generate-article.ps1 中 slug 提示範例（`beethoven-sym5` → `dg-471489`）
- `.gitignore` 補充 `.playwright-mcp/`、`.vscode/`、`homepage-zh.yml`

## [0.4.0] — 2026-07-11

### Pitchfork 風格精進

- **Breadcrumb 導覽** — 取代原本的「返回列表」按鈕，改為 `首頁 › 專輯介紹 › 曲名` 格式，每一層都可點擊（AlbumDetail / DailyDetail）
- **Meta 資訊卡** — 文章標題下方改為欄位式佈局：唱片編號 / 演出者 / 發行年份 / 類型，附 label 小字（AlbumDetail）
- **Bookmark 書籤** — 每篇文章頂部有書籤按鈕，點擊存到瀏覽器 localStorage，按鈕切換「收藏 / 已收藏」狀態
- **我的收藏頁面** — `/bookmarks` 列出所有已存文章（封面 + 標題 + 類型），中英文各自獨立
- **導覽列書籤 icon** — Header 右側新增書籤圖示連結

### 本次新增功能

- **關於我頁面** — `/about` + `/en/about`，簡介 Lyra賞樂誌 由來與方向；導覽列新增「關於」連結
- **作者簡介區塊** — 每篇文章底部新增 AuthorBio 元件（頭像 + 名稱 + bio + 關於連結）
- **RSS Feed** — 安裝 `@astrojs/rss`，`/rss.xml` 輸出最新文章列表，支援 Feedly / Inoreader 等閱讀器
- **Tags 分類頁** — `/tags/` 標籤雲（依文章數排序）、`/tags/{tag}` 列出該標籤下所有文章；中英文各自獨立
- **Tags 可點擊** — 文章底部的標籤從純文字 `<span>` 改為可點擊的 `<a>` 連結

### 頁面數量

- 從 10 頁成長至 32 頁（含中英文 tags 動態路由）

## [0.1.0] — 2026-07-10

### 專案初始化

- 使用 Astro v7.0.7 建立專案骨架
- 安裝 Node.js 依賴、驗證建置環境

### Content Collections 架構

- 建立 `src/content.config.ts`，定義兩種內容類型：
  - **album** — 專輯介紹（含演出者、作曲家、來台紀錄、未來音樂會、相關專輯等欄位）
  - **daily-classical** — 每日一曲（含作曲家、時期、知名錄音版本等欄位）
- 使用 `glob` loader 搭配自訂 `generateId` 函式解決中英文內容 ID 衝突
- Zod schema 完整定義 frontmatter 型別驗證

### 雙語架構（中 / 英）

- 設計 language switch 架構 `${locale}-${slug}` ID 策略
- 實作 `src/i18n/utils.ts` 翻譯字串系統，支援動態參數插值
- 使用 `zh` / `en` 目錄區分內容，`/en/` 前綴路由區分語系

### 頁面與路由

- 首頁（內容卡片列表，按日期排序）
- 專輯列表頁 + 詳情頁（含演出者、作曲家、來台紀錄、音樂會預告、相關專輯區塊）
- 每日一曲列表頁 + 詳情頁（含知名錄音版本卡片）
- 所有頁面皆有中英文雙版本，右上角語言切換按鈕

### UI 元件

- **Header** — 導覽列（Logo、導覽連結、語言切換）
- **Footer** — 版權與標語
- **HomePage** — 首頁內容彙整
- **AlbumList / AlbumDetail** — 專輯列表與詳情
- **DailyList / DailyDetail** — 每日一曲列表與詳情
- 響應式排版（`auto-fill` 卡片網格）
- 色系風格（indigo 主色 `#6366f1`，淺灰背景 `#fafafa`，白色卡片）

### 樣本內容

- 貝多芬第五號交響曲《命運》— 中英文雙語 (beethoven-sym5)
- 巴伯：弦樂慢板 — 中英文雙語 (barber-adagio)

### 開發工具

- `scripts\generate-article.ps1` — 內容產生腳本，對話式引導建立中英文文章模板
- `AGENTS.md` — 專案說明書（開發指令、內容生成指令、部署流程）
- `vercel.json` — Vercel 部署設定

### 已知未來待辦

- [ ] 視覺優化（主題色、字體、封面圖、卡片質感）
- [ ] 樣本內容更換為正式第一篇貼文
- [ ] 嵌入 Spotify / YouTube 播放器
- [ ] 標籤篩選、站內搜尋
- [ ] 關於我、404 頁面
- [ ] 定時任務（GitHub Actions 排程產出 + 部署）
- [ ] 留言 / 聯絡功能
- [ ] 自動收信回信
