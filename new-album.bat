@echo off
chcp 65001 >nul
echo === Lyra賞樂誌 — 新增專輯介紹 ===
set /p slug="請輸入 slug（如 dg-471490）: "
powershell -ExecutionPolicy Bypass -File "scripts\generate-article.ps1" -Type album -Slug %slug%
if %errorlevel% neq 0 pause & exit /b %errorlevel%
git add src\content\album\%slug%-zh.md src\content\album\%slug%-en.md
git commit -m "feat: add album %slug% template"
git push
echo.
echo ✅ 模板已建立並上傳 GitHub / Vercel 會自動部署
echo 下一步：告訴 opencode「幫我填 %slug% 的內容」
pause
