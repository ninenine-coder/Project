# 🚀 PBLS VR教學平台 - 部署指南

## ✅ 當前狀態檢查

### Firebase 配置已完整
- ✅ **API Key**: `AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q`
- ✅ **Project ID**: `progect-115a5`
- ✅ **App ID**: `1:109099222287:web:4f7b56a1eebe5abbfaaa7a`
- ✅ **Auth Domain**: `progect-115a5.firebaseapp.com`

## 🧪 測試步驟

### 1. 本地測試
```bash
# 打開測試頁面
open deploy-test.html
```

### 2. Google 登入測試
```bash
# 測試 Google 登入功能
open test-google-login.html
```

### 3. 完整功能測試
```bash
# 測試完整登入流程
open login.html
```

## 🔧 Firebase Console 設置

### 1. 啟用 Google 登入
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案 "Progect"
3. 前往 **Authentication > Sign-in method**
4. 啟用 **Google** 登入提供者
5. 設定 OAuth 同意畫面

### 2. 設置授權網域
1. 在 **Authentication > Settings** 中
2. 在 "授權網域" 區段添加：
   - `localhost` (本地測試)
   - `progect-115a5.firebaseapp.com` (Firebase Hosting)
   - 您的自定義網域 (如果有)

## 🚀 部署到 Firebase Hosting

### 1. 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. 登入 Firebase
```bash
firebase login
```

### 3. 初始化專案
```bash
firebase init hosting
# 選擇現有專案: progect-115a5
# 公開目錄: . (當前目錄)
# 配置為單頁應用: Yes
# 覆蓋 index.html: No
```

### 4. 部署
```bash
firebase deploy
```

## 📁 專案結構

```
Project/
├─ index.html              # 首頁 (練習專區)
├─ login.html              # 登入頁面
├─ exam.html               # 考試專區
├─ history.html            # 歷史成績
├─ info.html               # 資訊頁面
├─ team.html               # 團隊介紹
├─ exam_quiz.html          # 筆試測驗
├─ assets/                 # 資源文件
│  ├─ logo.png
│  └─ 周哲旭.png
├─ data/                   # 數據文件
│  └─ questions.json
├─ firebase.json           # Firebase 配置
└─ deploy-test.html        # 部署測試頁面
```

## 🔍 故障排除

### Google 登入失敗
1. 檢查 Firebase Console 中是否啟用 Google 登入
2. 確認授權網域設置正確
3. 檢查瀏覽器是否阻擋彈出視窗

### 部署失敗
1. 確認 Firebase CLI 已安裝
2. 檢查 `firebase.json` 配置
3. 確認專案權限

### 頁面無法載入
1. 檢查文件路徑是否正確
2. 確認 Firebase Hosting 配置
3. 檢查瀏覽器控制台錯誤

## 📞 支援

如果遇到問題，請檢查：
1. 瀏覽器控制台錯誤信息
2. Firebase Console 設置
3. 網路連線狀態

## 🎉 完成檢查清單

- [ ] Firebase 配置完整
- [ ] Google 登入功能正常
- [ ] 所有頁面可正常訪問
- [ ] 部署到 Firebase Hosting 成功
- [ ] 在生產環境中測試登入功能

---

**注意**: 確保在 Firebase Console 中正確設置 Google 登入和授權網域，這是 Google 登入正常工作的關鍵！
