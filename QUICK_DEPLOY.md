# 🚀 快速部署指南

## 📁 當前目錄結構
```
C:\Users\user\Desktop\畢業專題\Project\
├─ index.html          # 首頁
├─ login.html          # 登入頁面
├─ firebase.json       # Firebase 配置
└─ 其他頁面文件...
```

## ⚙️ Firebase 配置
```json
{
  "hosting": {
    "public": ".",           # 指向當前目錄
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🚀 部署步驟

### 1. 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. 登入 Firebase
```bash
firebase login
```

### 3. 初始化專案（如果尚未初始化）
```bash
firebase init hosting
# 選擇專案: progect-115a5
# 公開目錄: . (當前目錄)
# 配置為單頁應用: Yes
# 覆蓋 index.html: No
```

### 4. 部署
```bash
firebase deploy
```

## 🧪 測試部署

### 方法 1: 使用測試腳本
```bash
# 執行測試腳本
test-deploy.bat
```

### 方法 2: 手動測試
1. 打開 `deploy-test.html` 檢查所有頁面
2. 測試 `login.html` 的 Google 登入功能
3. 確認 `index.html` 正常顯示

## 🔧 故障排除

### 部署失敗
- 檢查 Firebase CLI 是否安裝
- 確認已登入 Firebase
- 檢查 `firebase.json` 配置

### 頁面無法訪問
- 確認 `index.html` 存在於根目錄
- 檢查 Firebase Hosting 設置
- 查看 Firebase Console 中的 Hosting 狀態

## 📱 訪問網址
部署成功後，您的網站將在以下網址可用：
- **Firebase Hosting**: `https://progect-115a5.firebaseapp.com`
- **自定義網域**: 可在 Firebase Console 中設置

## ✅ 完成檢查清單
- [ ] Firebase CLI 已安裝
- [ ] 已登入 Firebase
- [ ] `firebase.json` 配置正確
- [ ] 所有必要文件存在
- [ ] 部署成功
- [ ] 網站可正常訪問
- [ ] Google 登入功能正常
