# Lyra賞樂誌 — 開發紀錄

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
