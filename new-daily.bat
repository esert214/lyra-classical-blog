@echo off
chcp 65001 >nul
echo === Lyra賞樂誌 — 新增每日一曲 ===
set /p slug="請輸入 slug（如 sony-smk63088）: "
powershell -ExecutionPolicy Bypass -File "scripts\generate-article.ps1" -Type daily-classical -Slug %slug%
if %errorlevel% neq 0 pause & exit /b %errorlevel%
git add src\content\daily-classical\%slug%-zh.md src\content\daily-classical\%slug%-en.md
git commit -m "feat: add daily classical %slug% template"
git push
echo.
echo ✅ 模板已建立並上傳 GitHub / Vercel 會自動部署
echo 下一步：告訴 opencode「幫我填 %slug% 的內容」
pause
