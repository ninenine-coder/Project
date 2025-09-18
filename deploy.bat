@echo off
echo ========================================
echo    PBLS VR教學平台 - GitHub Pages部署
echo ========================================
echo.

echo 選擇部署版本:
echo 1. 測試版本 (簡單頁面)
echo 2. 完整版本 (完整功能)
echo 3. 退出
echo.

set /p choice="請輸入選擇 (1-3): "

if "%choice%"=="1" goto test_version
if "%choice%"=="2" goto full_version
if "%choice%"=="3" goto exit
goto invalid_choice

:test_version
echo.
echo 部署測試版本...
copy test.html index.html
echo ✅ 測試版本已準備完成
goto git_push

:full_version
echo.
echo 部署完整版本...
copy complete-demo.html index.html
echo ✅ 完整版本已準備完成
goto git_push

:git_push
echo.
echo 推送到GitHub...
git add .
git commit -m "部署PBLS VR教學平台到GitHub Pages"
git push origin main
echo.
echo ✅ 部署完成！
echo.
echo 請前往您的GitHub repository:
echo 1. 點擊 Settings 標籤
echo 2. 滾動到 Pages 區塊
echo 3. 選擇 Deploy from a branch
echo 4. 選擇 main 分支和 / (root) 資料夾
echo 5. 等待 1-5 分鐘部署完成
echo.
echo 您的網站網址將是:
echo https://您的用戶名.github.io/Project/
echo.
pause
goto exit

:invalid_choice
echo.
echo ❌ 無效選擇，請重新執行
echo.
pause
goto exit

:exit
echo.
echo 感謝使用！
pause
