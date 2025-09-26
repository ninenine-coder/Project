@echo off
echo ========================================
echo PBLS VR教學平台 - Google 登入部署
echo ========================================
echo.

echo 1. 檢查必要文件...
if exist "public\index.html" (
    echo ✅ public/index.html 存在
) else (
    echo ❌ public/index.html 不存在
    pause
    exit /b 1
)

if exist "firebase.json" (
    echo ✅ firebase.json 存在
) else (
    echo ❌ firebase.json 不存在
    pause
    exit /b 1
)

echo.
echo 2. 檢查 Firebase 配置...
type firebase.json
echo.

echo 3. 檢查 Google OAuth 設置...
echo 請確認已完成以下設置：
echo - Google Cloud Console 專案設置
echo - Google+ API 已啟用
echo - OAuth 2.0 客戶端 ID 已創建
echo - 授權網域已設置
echo - HTML 文件中的客戶端 ID 已更新
echo.

set /p oauth_done="是否已完成 Google OAuth 設置? (y/n): "
if /i "%oauth_done%"=="n" (
    echo 請先完成 Google OAuth 設置，參考 GOOGLE_OAUTH_SETUP.md
    pause
    exit /b 1
)

echo.
echo 4. 檢查 Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI 未安裝
    echo 請先安裝 Node.js 和 Firebase CLI:
    echo 1. 安裝 Node.js: https://nodejs.org/
    echo 2. 執行: npm install -g firebase-tools
    pause
    exit /b 1
) else (
    echo ✅ Firebase CLI 已安裝
)

echo.
echo 5. 檢查 Firebase 登入狀態...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未登入 Firebase
    echo 請執行: firebase login
    pause
    exit /b 1
) else (
    echo ✅ 已登入 Firebase
)

echo.
echo 6. 準備部署...
echo 執行部署命令: firebase deploy
echo.
set /p deploy="是否現在部署? (y/n): "
if /i "%deploy%"=="y" (
    echo 開始部署...
    firebase deploy
    if %errorlevel% equ 0 (
        echo ✅ 部署成功！
        echo.
        echo 🌐 您的網站現在可以在以下網址訪問：
        echo https://progect-115a5.firebaseapp.com
        echo.
        echo 🧪 測試步驟：
        echo 1. 打開網站
        echo 2. 點擊 Google 登入按鈕
        echo 3. 選擇 Google 帳戶
        echo 4. 確認登入成功
    ) else (
        echo ❌ 部署失敗
    )
) else (
    echo 跳過部署
)

echo.
echo 部署測試完成！
pause
