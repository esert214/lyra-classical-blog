# Lyra賞樂誌 — 開發紀錄

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
