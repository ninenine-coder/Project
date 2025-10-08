# Firebase 測驗結果問題解決方案

## 🔍 問題診斷

您提到在 Firebase 中沒有看到"總測驗次數"，這可能是由以下幾個原因造成的：

### 可能的原因

1. **Firebase 配置不一致**
   - 項目中有多個不同的 Firebase 配置
   - TypeScript 版本使用環境變數，但沒有 `.env` 文件
   - JavaScript 版本使用硬編碼配置

2. **用戶文檔不存在**
   - 用戶文檔可能還沒有在 Firestore 中創建
   - 需要先創建用戶文檔才能更新統計數據

3. **Firestore 安全規則**
   - 可能阻止了寫入操作
   - 需要檢查 Firestore 規則設置

4. **數據保存到錯誤的位置**
   - 可能保存到了錯誤的集合或文檔

## 🛠️ 解決步驟

### 步驟 1: 使用診斷工具

1. 打開 `test-firebase-direct.html`
2. 確保您已登入系統
3. 按順序點擊以下按鈕：
   - "檢查用戶登入"
   - "讀取用戶文檔"
   - "測試增加總測驗次數"
   - "模擬測驗結果"

### 步驟 2: 檢查 Firebase 控制台

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇項目 `progect-115a5`
3. 點擊 "Firestore Database"
4. 檢查是否有 `user` 集合
5. 在 `user` 集合中查找您的用戶 ID 文檔
6. 檢查文檔中是否有 `totalTests` 字段

### 步驟 3: 檢查 Firestore 規則

1. 在 Firebase Console 中點擊 "Firestore Database"
2. 點擊 "規則" 標籤
3. 確保規則允許讀寫操作：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許用戶讀寫自己的文檔
    match /user/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 允許用戶讀寫自己的測驗結果
    match /user/{userId}/quizResults/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 步驟 4: 手動創建用戶文檔（如果需要）

如果用戶文檔不存在，可以手動創建：

1. 在 Firebase Console 中點擊 "Firestore Database"
2. 點擊 "開始集合"
3. 集合 ID 輸入 `user`
4. 文檔 ID 輸入您的用戶 ID
5. 添加字段：
   - `totaltesttimes`: 0 (數字)
   - `totalTimeSpent`: 0 (數字)
   - `createdAt`: 當前時間戳

## 🔧 已修復的問題

### 1. 統一 Firebase 配置

已修復 `src/services/quizResultService.js` 和 `src/services/userDataService.js` 中的 Firebase 配置，確保使用相同的項目配置。

### 2. 添加完整的配置參數

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
    authDomain: "progect-115a5.firebaseapp.com",
    projectId: "progect-115a5",
    storageBucket: "progect-115a5.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 3. 更新字段名為 totaltesttimes

已將總測驗次數字段名從 `totalTests` 更改為 `totaltesttimes`，初始值為 0，與 `totalTimeSpent` 字段保持一致。

## 🧪 測試方法

### 方法 1: 使用診斷工具

1. 打開 `test-firebase-direct.html`
2. 登入系統
3. 點擊 "模擬測驗結果" 按鈕
4. 檢查結果是否顯示成功

### 方法 2: 實際測驗測試

1. 登入系統
2. 進入測驗頁面
3. 完成一次測驗
4. 查看瀏覽器控制台日誌
5. 檢查 Firebase 控制台中的數據

### 方法 3: 檢查控制台日誌

成功保存時應該看到：
```
正在保存測驗結果到Firebase...
✅ 測驗結果已成功保存到Firebase，總測驗次數已更新
```

## 📊 預期的 Firebase 數據結構

### 用戶文檔 (`user/{userId}`)
```json
{
  "totaltesttimes": 5,
  "totalTimeSpent": 1200,
  "lastQuizDate": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "name": "用戶姓名",
  "email": "user@example.com"
}
```

### 測驗結果子集合 (`user/{userId}/quizResults/{resultId}`)
```json
{
  "date": "2024-01-15T10:30:00.000Z",
  "score": 85,
  "correctAnswers": 17,
  "totalQuestions": 20,
  "totalTime": 209,
  "answers": [...],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🚨 常見錯誤和解決方案

### 錯誤 1: "用戶文檔不存在"
**解決方案**: 使用診斷工具手動創建用戶文檔，或確保用戶註冊時創建了文檔。

### 錯誤 2: "權限被拒絕"
**解決方案**: 檢查 Firestore 安全規則，確保允許用戶讀寫自己的文檔。

### 錯誤 3: "Firebase 配置錯誤"
**解決方案**: 確保所有服務使用相同的 Firebase 配置。

### 錯誤 4: "網絡連接問題"
**解決方案**: 檢查網絡連接，確保可以訪問 Firebase 服務。

## 📞 如果問題仍然存在

如果按照以上步驟操作後仍然沒有看到"總測驗次數"，請：

1. 使用 `test-firebase-direct.html` 進行診斷
2. 截圖顯示診斷結果
3. 檢查瀏覽器控制台的錯誤訊息
4. 確認 Firebase 控制台中的數據結構

## 🔄 更新日誌

### v1.1.0 (當前版本)
- ✅ 修復 Firebase 配置不一致問題
- ✅ 添加完整的診斷工具
- ✅ 統一所有服務的 Firebase 配置
- ✅ 添加詳細的錯誤處理和日誌

### v1.0.0 (之前版本)
- ✅ 實現基本的測驗結果保存功能
- ❌ Firebase 配置不一致導致保存失敗
