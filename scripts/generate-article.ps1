param(
  [ValidateSet('album', 'daily-classical')]
  [string]$Type,
  [string]$Slug
)

function New-AlbumFile {
  param([string]$Slug, [string]$Locale)

  $dir = "src\content\album"
  $file = "${dir}\${Slug}-${Locale}.md"

  $frontMatter = @"
---
title: "專輯名稱 (${Locale})"
locale: "${Locale}"
slug: "${Slug}"
date: $(Get-Date -Format "yyyy-MM-dd")
artist: "演出者"
album: "專輯名稱"
releaseDate: "發行年份"
genre: "類型"
catalogNumber: "唱片編號 (如 DG 471 489-2)"
performers:
  - name: "演出者1"
    role: "角色 (如指揮、鋼琴)"
    bio: "簡短介紹..."
  - name: "演出者2"
    role: "角色"
    bio: "簡短介紹..."
composers:
  - name: "作曲家"
    bio: "作曲家簡介..."
hasPerformedInTaiwan: false
taiwanVisitDetail: ""
taiwanVisitImages: []
upcomingConcerts:
  - date: "YYYY-MM-DD"
    location: "場地"
    event: "活動名稱"
    url: ""
relatedAlbums:
  - title: "相關專輯"
    artist: "演出者"
    coverImage: ""
    slug: ""
    url: ""
tags: ["標籤1", "標籤2"]
---

## 專輯介紹

請填寫專輯的詳細介紹內容，每段至少 3–5 句，包含：

- 這張專輯的背景與意義
- 演奏上的特色與亮點
- 個人的聆聽感受與推薦理由

## 曲目列表

### 曲目1
曲目介紹...

### 曲目2
曲目介紹...
"@

  New-Item -ItemType File -Path $file -Force -Value $frontMatter | Out-Null
  Write-Host "✅ Created: $file"
}

function New-DailyFile {
  param([string]$Slug, [string]$Locale)

  $dir = "src\content\daily-classical"
  $file = "${dir}\${Slug}-${Locale}.md"

  $frontMatter = @"
---
title: "樂曲名稱 (${Locale})"
locale: "${Locale}"
slug: "${Slug}"
date: $(Get-Date -Format "yyyy-MM-dd")
composer:
  name: "作曲家"
  bio: "作曲家簡介，包含生平與風格特色..."
period: "時期 (如古典、浪漫、20世紀)"
year: "創作年份"
coverImage: ""
notableRecordings:
  - performer: "演奏者1"
    label: "唱片公司"
    year: "錄音年份"
    notes: "推薦理由..."
  - performer: "演奏者2"
    label: "唱片公司"
    year: "錄音年份"
    notes: "推薦理由..."
tags: ["標籤1", "標籤2"]
---

## 樂曲介紹

請填寫樂曲的詳細介紹內容，每段至少 3–5 句，包含：

- 樂曲的創作背景與歷史
- 音樂結構與聆聽重點
- 個人的聆聽感受或特別版本推薦
"@

  New-Item -ItemType File -Path $file -Force -Value $frontMatter | Out-Null
  Write-Host "✅ Created: $file"
}

# Main
if (-not $Slug) {
  $Slug = Read-Host "Enter article slug (e.g., 'dg-471489')"
}

if (-not $Type) {
  $typeChoice = Read-Host "Article type? (album / daily-classical)"
  $Type = $typeChoice.ToLower()
}

Write-Host "`nCreating Chinese version..."
switch ($Type) {
  'album' { New-AlbumFile -Slug $Slug -Locale 'zh' }
  'daily-classical' { New-DailyFile -Slug $Slug -Locale 'zh' }
}

Write-Host "`nCreating English version..."
switch ($Type) {
  'album' { New-AlbumFile -Slug $Slug -Locale 'en' }
  'daily-classical' { New-DailyFile -Slug $Slug -Locale 'en' }
}

Write-Host "`n🎵 Done! Ask the AI (opencode) to fill in the content for slug '${Slug}'"
Write-Host "   — include real cover images from DG/Universal Music CDN"
Write-Host "   — backfill slug in relatedAlbums from existing articles"
Write-Host "   Then run: npx astro dev to preview"
