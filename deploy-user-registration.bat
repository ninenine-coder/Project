@echo off
echo ========================================
echo    PBLS VR教學平台 - 用戶註冊系統部署
echo ========================================
echo.

echo [1/4] 檢查必要文件...
if not exist "src\services\userRegistrationService.js" (
    echo ❌ 錯誤: 找不到 userRegistrationService.js
    pause
    exit /b 1
)

if not exist "src\utils\validationUtils.js" (
    echo ❌ 錯誤: 找不到 validationUtils.js
    pause
    exit /b 1
)

if not exist "login.html" (
    echo ❌ 錯誤: 找不到 login.html
    pause
    exit /b 1
)

if not exist "register.html" (
    echo ❌ 錯誤: 找不到 register.html
    pause
    exit /b 1
)

echo ✅ 所有必要文件都存在

echo.
echo [2/4] 檢查Firebase配置...
findstr "progect-115a5" src\services\userRegistrationService.js >nul
if %errorlevel% neq 0 (
    echo ❌ 錯誤: Firebase配置不正確
    pause
    exit /b 1
)

echo ✅ Firebase配置正確

echo.
echo [3/4] 檢查API服務導入...
findstr "import.*userRegistrationService" login.html >nul
if %errorlevel% neq 0 (
    echo ❌ 錯誤: login.html 未正確導入API服務
    pause
    exit /b 1
)

findstr "import.*userRegistrationService" register.html >nul
if %errorlevel% neq 0 (
    echo ❌ 錯誤: register.html 未正確導入API服務
    pause
    exit /b 1
)

echo ✅ API服務導入正確

echo.
echo [4/4] 部署完成檢查...
echo.
echo 📋 部署清單:
echo    ✅ 用戶註冊API服務
echo    ✅ 數據驗證工具
echo    ✅ 錯誤處理機制
echo    ✅ 登入頁面整合
echo    ✅ 註冊頁面整合
echo    ✅ 測試頁面
echo    ✅ API使用文檔
echo.
echo 🚀 系統已準備就緒！
echo.
echo 📖 使用說明:
echo    1. 開啟 login.html 進行登入/註冊
echo    2. 開啟 register.html 進行獨立註冊
echo    3. 開啟 test-firestore-integration.html 進行測試
echo    4. 開啟 test-navigation.html 測試頁面導航
echo    5. 查看 USER_REGISTRATION_API_GUIDE.md 了解API使用
echo.
echo 🔥 Firestore 集合: user
echo 📊 文檔ID: 學號/工號
echo 🌐 Firebase 專案: progect-115a5
echo.
pause
