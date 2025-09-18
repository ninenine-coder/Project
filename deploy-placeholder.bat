@echo off
echo ========================================
echo    PBLS VR教學平台 - 預留版本部署
echo ========================================
echo.

echo 這將部署包含VR功能預留區域的版本
echo 適合在VR資源準備完成前使用
echo.

set /p confirm="確認部署預留版本？(Y/N): "

if /i "%confirm%"=="Y" goto deploy
if /i "%confirm%"=="N" goto exit
goto invalid_input

:deploy
echo.
echo 部署預留版本...
copy index-with-placeholders.html index.html
echo ✅ 預留版本已準備完成
echo.

echo 推送到GitHub...
git add .
git commit -m "部署PBLS VR教學平台預留版本"
git push origin main
echo.

echo ✅ 部署完成！
echo.
echo 預留版本特色：
echo - 完整的登入系統
echo - 4個互動選單
echo - VR功能預留區域
echo - 虛擬人功能預留區域
echo - 響應式設計
echo.
echo 您的網站網址：
echo https://您的用戶名.github.io/Project/
echo.
echo 後續整合：
echo 1. 準備VR資源（Unity Build、360度影片、虛擬人模型）
echo 2. 參考 VR_Integration_Guide.md 進行整合
echo 3. 整合完成後重新部署完整版本
echo.
pause
goto exit

:invalid_input
echo.
echo ❌ 無效輸入，請輸入 Y 或 N
echo.
pause
goto exit

:exit
echo.
echo 感謝使用！
pause
