# Lyra Classical Blog

古典音樂評論與推薦部落格，使用 [Astro](https://astro.build) 建構，部署於 Vercel。

## 專案資訊

- **GitHub:** https://github.com/esert214/lyra-classical-blog
- **網站:** https://lyra-classical-blog.vercel.app
- Push to GitHub 後 Vercel 自動部署

## 開發指令

| Command | Action |
|---------|--------|
| `npm install` | 安裝依賴 |
| `npm run dev` | 啟動本地開發伺服器 |
| `npm run build` | 建構生產版本（會自動先跑 validate） |
| `npm run preview` | 預覽建構結果 |
| `npm run validate` | 驗證所有內容檔案的 frontmatter |

## 內容結構

- `src/content/album/{slug}-zh.md` — 中文專輯介紹
- `src/content/album/{slug}-en.md` — 英文專輯介紹
- `src/content/daily-classical/{slug}-zh.md` — 中文每日一曲
- `src/content/daily-classical/{slug}-en.md` — 英文每日一曲
- Slug 命名規則：`{廠牌縮寫}-{目錄編號}`（如 `dg-471489`, `decca-4304332`）

## 內容驗證

新增或修改文章後，執行驗證：

```sh
npm run validate
```

檢查項目：
- `relatedAlbums` 的 `slug` 必須對應到已存在的文章
- 外部連結的 artist 必須與當前文章相關
- `relatedAlbums` 必須有 `slug` 或 `url`
- slug 格式必須包含 `-`

## AI 產生文章

對 opencode 說：

> 「幫我寫這張專輯：`{網址}`」

AI 會自動查資料、寫中英文文章、跑驗證、commit & push。

詳細規則請參閱 [AGENTS.md](./AGENTS.md)。
