@echo off
echo ========================================
echo PBLS VR教學平台 - 部署測試
echo ========================================
echo.

echo 1. 檢查必要文件...
if exist "index.html" (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html 不存在
    pause
    exit /b 1
)

if exist "login.html" (
    echo ✅ login.html 存在
) else (
    echo ❌ login.html 不存在
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

echo 3. 檢查 Firebase CLI 是否安裝...
firebase --version
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI 未安裝
    echo 請執行: npm install -g firebase-tools
    pause
    exit /b 1
) else (
    echo ✅ Firebase CLI 已安裝
)

echo.
echo 4. 檢查 Firebase 登入狀態...
firebase projects:list
if %errorlevel% neq 0 (
    echo ❌ 未登入 Firebase
    echo 請執行: firebase login
    pause
    exit /b 1
) else (
    echo ✅ 已登入 Firebase
)

echo.
echo 5. 準備部署...
echo 執行部署命令: firebase deploy
echo.
set /p deploy="是否現在部署? (y/n): "
if /i "%deploy%"=="y" (
    echo 開始部署...
    firebase deploy
    if %errorlevel% equ 0 (
        echo ✅ 部署成功！
    ) else (
        echo ❌ 部署失敗
    )
) else (
    echo 跳過部署
)

echo.
echo 測試完成！
pause
