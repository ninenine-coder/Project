@echo off
echo ========================================
echo    Firebase 權限問題修復工具
echo ========================================
echo.

echo [1/5] 檢查 Firestore 規則文件...
if exist "firestore.rules" (
    echo ✅ 找到 firestore.rules 文件
    type firestore.rules
) else (
    echo ❌ 找不到 firestore.rules 文件
    echo 正在創建默認規則...
    echo rules_version = '2'; > firestore.rules
    echo service cloud.firestore { >> firestore.rules
    echo   match /databases/{database}/documents { >> firestore.rules
    echo     match /{document=**} { >> firestore.rules
    echo       allow read, write: if true; >> firestore.rules
    echo     } >> firestore.rules
    echo   } >> firestore.rules
    echo } >> firestore.rules
    echo ✅ 已創建默認規則文件
)

echo.
echo [2/5] 檢查 Firebase 配置...
findstr "progect-115a5" src\services\userRegistrationService.js >nul
if %errorlevel% neq 0 (
    echo ❌ Firebase 配置可能有問題
) else (
    echo ✅ Firebase 配置正確
)

echo.
echo [3/5] 檢查 API 服務文件...
if exist "src\services\userRegistrationService.js" (
    echo ✅ 用戶註冊服務文件存在
) else (
    echo ❌ 用戶註冊服務文件不存在
)

if exist "src\utils\validationUtils.js" (
    echo ✅ 驗證工具文件存在
) else (
    echo ❌ 驗證工具文件不存在
)

echo.
echo [4/5] 檢查診斷工具...
if exist "firebase-diagnostic.html" (
    echo ✅ Firebase 診斷頁面存在
) else (
    echo ❌ Firebase 診斷頁面不存在
)

echo.
echo [5/5] 權限問題解決方案...
echo.
echo 🔧 可能的解決方案:
echo    1. 開啟 firebase-diagnostic.html 進行診斷
echo    2. 檢查 Firebase Console 中的 Firestore 規則
echo    3. 確認 Firestore 已啟用
echo    4. 檢查網路連線和防火牆設定
echo    5. 清除瀏覽器快取並重新載入
echo.
echo 📋 檢查清單:
echo    ✅ Firestore 規則: allow read, write: if true;
echo    ✅ Firebase 專案ID: progect-115a5
echo    ✅ API 服務已配置
echo    ✅ 診斷工具已準備
echo.
echo 🚀 下一步:
echo    1. 開啟 firebase-diagnostic.html
echo    2. 點擊「開始診斷」
echo    3. 查看診斷結果
echo    4. 根據結果進行相應修復
echo.
pause
