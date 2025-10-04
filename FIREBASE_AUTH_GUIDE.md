# Firebase 登入系統使用指南

## 概述
本系統已整合 Firebase Authentication 和 Firestore 資料庫，實現完整的用戶註冊、登入和會話管理功能。

## 功能特色

### 1. 用戶註冊
- **註冊頁面**: `register.html`
- **功能**: 
  - 電子郵件驗證
  - 密碼強度檢查（需包含大小寫英文和數字，至少8個字元）
  - 用戶資料收集（姓名、所屬單位、科系/部門、電話）
  - 自動檢查重複註冊
- **資料儲存**: 所有註冊資料儲存到 Firestore 的 `users` 集合

### 2. 用戶登入
- **登入頁面**: `login.html`
- **功能**:
  - 電子郵件和密碼驗證
  - 記住帳號功能
  - 登入狀態檢查
  - 自動跳轉到主頁面
- **驗證流程**: 
  1. 檢查 Firestore 中是否存在該電子郵件
  2. 驗證密碼是否正確
  3. 檢查帳號是否被停用
  4. 更新最後登入時間
  5. 儲存登入狀態到 localStorage

### 3. 會話管理
- **自動檢查**: 進入主頁面時自動檢查登入狀態
- **登出功能**: 清除本地儲存的用戶資料
- **用戶信息顯示**: 在頁面頂部顯示用戶所屬單位和部門

## 檔案結構

### 核心檔案
- `firebase-config.js` - Firebase 配置和認證服務
- `login.html` - 登入頁面
- `register.html` - 註冊頁面
- `info.html` - 主頁面（包含登入檢查）
- `firestore.rules` - Firestore 安全規則

### Firebase 配置
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "109099222287",
    appId: "1:109099222287:web:4f7b56a1eebe5abbfaaa7a"
};
```

## 資料庫結構

### users 集合
每個用戶文檔包含以下欄位：
```javascript
{
    email: "user@example.com",           // 電子郵件（唯一）
    password: "hashedPassword",          // 密碼（實際應用中應加密）
    name: "用戶姓名",                    // 姓名
    where: "長庚大學",                   // 所屬單位
    department: "護理系",                // 科系/部門
    phone: "03-2118800",                // 電話/分機
    createdAt: Timestamp,                // 註冊時間
    lastLogin: Timestamp,                // 最後登入時間
    isActive: true                       // 帳號狀態
}
```

## 安全規則

### Firestore 安全規則
- 允許讀取用戶資料（用於登入驗證）
- 允許創建新用戶（註冊時）
- 允許更新最後登入時間
- 不允許刪除用戶資料
- 其他集合的讀寫權限根據需要設定

## 使用流程

### 新用戶註冊
1. 訪問 `register.html`
2. 填寫完整的註冊資料
3. 系統檢查電子郵件是否已註冊
4. 驗證密碼強度
5. 將資料儲存到 Firestore
6. 顯示註冊成功訊息
7. 跳轉到登入頁面

### 用戶登入
1. 訪問 `login.html`
2. 輸入電子郵件和密碼
3. 選擇是否記住帳號
4. 系統驗證用戶資料
5. 儲存登入狀態
6. 自動跳轉到 `info.html`

### 系統使用
1. 進入任何頁面時自動檢查登入狀態
2. 未登入用戶會被重定向到登入頁面
3. 已登入用戶可以正常使用系統功能
4. 點擊登出按鈕清除登入狀態

## 錯誤處理

### 常見錯誤訊息
- "此電子郵件尚未註冊，請先註冊帳號！" - 登入時電子郵件不存在
- "密碼錯誤，請重新輸入！" - 登入時密碼不正確
- "此電子郵件已被註冊" - 註冊時電子郵件重複
- "此帳號已被停用，請聯繫管理員" - 帳號被管理員停用

### 備用方案
- 如果 Firebase 無法連接，系統會使用本地儲存作為備用方案
- 本地儲存的資料格式與 Firestore 相同
- 確保系統在離線狀態下仍可正常運作

## 部署注意事項

### Firebase 設定
1. 確保 Firebase 專案已正確配置
2. 啟用 Firestore 資料庫
3. 部署 Firestore 安全規則
4. 設定適當的 CORS 政策

### 安全考量
1. 密碼應該在客戶端加密後再傳送到 Firestore
2. 考慮使用 Firebase Authentication 的內建認證功能
3. 定期檢查和更新安全規則
4. 監控異常登入活動

## 開發者資訊

### 主要函數
- `initializeFirebase()` - 初始化 Firebase
- `authService.registerUser()` - 註冊新用戶
- `authService.loginUser()` - 用戶登入
- `authService.getCurrentUser()` - 獲取當前用戶
- `authService.logout()` - 用戶登出

### 擴展功能
- 可以添加密碼重置功能
- 可以添加用戶資料編輯功能
- 可以添加管理員後台
- 可以添加登入日誌記錄

## 技術支援
如有任何問題，請檢查：
1. Firebase 專案配置是否正確
2. 網路連線是否正常
3. 瀏覽器控制台是否有錯誤訊息
4. Firestore 安全規則是否正確部署
