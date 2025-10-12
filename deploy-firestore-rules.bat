@echo off
echo ========================================
echo    部署 Firestore 規則到 Firebase
echo ========================================
echo.

echo [1/3] 檢查 Firestore 規則文件...
if exist "firestore.rules" (
    echo ✅ 找到 firestore.rules 文件
) else (
    echo ❌ 找不到 firestore.rules 文件
    pause
    exit /b 1
)

echo.
echo [2/3] 檢查 Firebase 配置...
if exist "firebase.json" (
    echo ✅ 找到 firebase.json 文件
) else (
    echo ❌ 找不到 firebase.json 文件
    pause
    exit /b 1
)

echo.
echo [3/3] 部署 Firestore 規則...
echo 正在部署規則到 Firebase 專案...
firebase deploy --only firestore:rules

echo.
echo ✅ 部署完成！
echo.
echo 📋 部署的規則包含：
echo    - user 集合：允許所有用戶讀取、創建、更新
echo    - scores 集合：允許所有已認證用戶讀取、創建
echo    - counters 集合：允許所有已認證用戶讀取、創建、更新
echo    - user/{uid}/scores 子集合：允許用戶管理自己的成績
echo    - user/{uid}/results 子集合：開發測試用開放權限
echo.
echo 🎯 現在考試成績應該可以正常上傳了！
echo.
pause
