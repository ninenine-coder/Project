@echo off
echo ========================================
echo    PBLS VR教學平台啟動腳本
echo ========================================
echo.

echo 檢查Node.js安裝...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 錯誤: 未找到Node.js
    echo 請先安裝Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js已安裝
echo.

echo 檢查npm安裝...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 錯誤: 未找到npm
    echo 請重新安裝Node.js
    echo.
    pause
    exit /b 1
)

echo npm已安裝
echo.

echo 安裝專案依賴...
npm install
if %errorlevel% neq 0 (
    echo 錯誤: 依賴安裝失敗
    echo.
    pause
    exit /b 1
)

echo.
echo 依賴安裝完成！
echo.

echo 啟動開發伺服器...
echo 應用程式將在 http://localhost:3000 啟動
echo 按 Ctrl+C 停止伺服器
echo.

npm run dev

pause
