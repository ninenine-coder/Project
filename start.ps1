# PBLS VR教學平台啟動腳本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PBLS VR教學平台啟動腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查Node.js安裝
Write-Host "檢查Node.js安裝..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js已安裝: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "錯誤: 未找到Node.js" -ForegroundColor Red
    Write-Host "請先安裝Node.js: https://nodejs.org/" -ForegroundColor Red
    Write-Host ""
    Read-Host "按Enter鍵退出"
    exit 1
}

Write-Host ""

# 檢查npm安裝
Write-Host "檢查npm安裝..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm已安裝: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "錯誤: 未找到npm" -ForegroundColor Red
    Write-Host "請重新安裝Node.js" -ForegroundColor Red
    Write-Host ""
    Read-Host "按Enter鍵退出"
    exit 1
}

Write-Host ""

# 安裝依賴
Write-Host "安裝專案依賴..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "依賴安裝完成！" -ForegroundColor Green
} catch {
    Write-Host "錯誤: 依賴安裝失敗" -ForegroundColor Red
    Write-Host ""
    Read-Host "按Enter鍵退出"
    exit 1
}

Write-Host ""

# 啟動開發伺服器
Write-Host "啟動開發伺服器..." -ForegroundColor Yellow
Write-Host "應用程式將在 http://localhost:3000 啟動" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor Cyan
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host "開發伺服器已停止" -ForegroundColor Yellow
}

Read-Host "按Enter鍵退出"
