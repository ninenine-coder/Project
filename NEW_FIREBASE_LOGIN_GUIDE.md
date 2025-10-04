# 新版 Firebase 登入系統使用指南

## 🎯 系統特色

### 📋 功能概述
- **整合式登入註冊頁面**：單一頁面包含登入和註冊功能
- **Firebase Firestore 雲端儲存**：所有用戶資料儲存在雲端
- **現代化 UI 設計**：簡潔美觀的用戶介面
- **響應式設計**：適配各種設備尺寸

### 🔧 技術架構
- **Firebase SDK v9**：使用最新的模組化 SDK
- **Firestore 資料庫**：雲端 NoSQL 資料庫
- **ES6 模組**：現代 JavaScript 模組化開發
- **CSS Grid & Flexbox**：現代 CSS 佈局

## 📊 資料庫結構

### Firestore 集合：`user`
每個用戶文檔以學號/工號作為文檔ID：

```javascript
// 文檔ID: "S1234567" 或 "E7654321"
{
  account: "cgu123",                    // 登入帳號
  password: "password123",              // 密碼（明文，示範用）
  "姓名": "張三",                       // 中文姓名
  department: "兒童急診",               // 系所/部門
  phone: "0912345678",                 // 電話
  "school/hospital": "長庚醫院",        // 學校/醫院
  createdAt: Timestamp                 // 註冊時間
}
```

## 🚀 使用流程

### 1. 用戶註冊
1. 訪問 `login.html`
2. 點擊「註冊帳號」標籤
3. 填寫完整資料：
   - **學號/工號**：作為 Firestore 文檔ID（必填）
   - **帳號**：登入用帳號（必填）
   - **密碼**：至少6碼（必填）
   - **姓名**：中文/英文姓名（必填）
   - **系所/部門**：例如「兒童急診」（選填）
   - **電話**：聯絡電話（選填）
   - **school/hospital**：例如「長庚醫院」（選填）
4. 點擊「建立帳號」完成註冊

### 2. 用戶登入
1. 在登入頁面輸入帳號和密碼
2. 系統查詢 Firestore 驗證帳號密碼
3. 登入成功後自動跳轉到 `info.html`
4. 用戶資料儲存到 localStorage 供其他頁面使用

## ⚙️ Firebase 配置

### 1. 更新 Firebase 配置
在 `login.html` 中找到以下配置並替換為您的實際值：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. 部署 Firestore 安全規則
將 `firestore.rules` 文件部署到您的 Firebase 專案：
```bash
firebase deploy --only firestore:rules
```

## 🔐 安全考量

### 目前狀態
- **密碼明文儲存**：目前為示範用途，密碼以明文儲存
- **開放讀寫權限**：安全規則較為寬鬆，適合開發階段

### 生產環境建議
1. **使用 Firebase Authentication**：替換密碼驗證
2. **密碼雜湊**：使用 bcrypt 等演算法雜湊密碼
3. **嚴格安全規則**：限制讀寫權限
4. **HTTPS 強制**：確保資料傳輸安全

## 📱 頁面整合

### 與現有系統整合
- **登入成功後跳轉**：自動跳轉到 `info.html`
- **用戶資料同步**：登入後將用戶資料儲存到 localStorage
- **會話管理**：其他頁面可讀取 localStorage 中的用戶資料

### 用戶資料格式
```javascript
// localStorage 中的用戶資料
{
  uid: "S1234567",                     // 學號/工號
  email: "cgu123",                     // 登入帳號
  name: "張三",                        // 姓名
  displayName: "張三",                 // 顯示名稱
  photoURL: "https://via.placeholder.com/40/17a2b8/ffffff?text=張",
  loginTime: "2024-01-01T00:00:00.000Z",
  loginMethod: "firebase",
  where: "長庚醫院",                   // 學校/醫院
  department: "兒童急診",              // 系所/部門
  phone: "0912345678"                  // 電話
}
```

## 🧪 測試建議

### 1. 基本功能測試
- 註冊新用戶帳號
- 使用註冊的帳號登入
- 檢查 Firestore 中是否出現用戶資料
- 確認登入後跳轉正常

### 2. 錯誤處理測試
- 嘗試註冊重複的學號/工號
- 使用錯誤的帳號密碼登入
- 測試網路連線異常情況

### 3. 資料驗證測試
- 檢查必填欄位驗證
- 測試密碼長度限制
- 驗證資料格式正確性

## 🔧 故障排除

### 常見問題
1. **Firebase 初始化失敗**：檢查配置是否正確
2. **寫入 Firestore 失敗**：檢查安全規則和網路連線
3. **登入驗證失敗**：確認帳號密碼正確性
4. **跳轉頁面失敗**：檢查目標頁面是否存在

### 調試方法
- 開啟瀏覽器開發者工具查看控制台錯誤
- 檢查 Firestore 控制台確認資料寫入
- 驗證 Firebase 專案配置

## 📈 未來擴展

### 可能的功能擴展
- 密碼重置功能
- 用戶資料編輯
- 管理員後台
- 登入日誌記錄
- 多語言支援

### 技術升級
- 整合 Firebase Authentication
- 添加 OAuth 登入（Google、Facebook等）
- 實現 JWT Token 認證
- 添加資料加密功能

---

**建立時間**：$(date)
**版本**：v2.0
**狀態**：✅ 就緒
