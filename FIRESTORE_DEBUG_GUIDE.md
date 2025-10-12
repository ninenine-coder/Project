# 🔍 Firestore 成績寫入調試完整指南

## ✅ 已添加的調試功能

我已經在 `exam_quiz.html` 中添加了完整的調試信息，現在可以逐步追蹤成績保存的完整流程。

---

## 🧭 調試流程檢查點

### Step 1: 測驗結束觸發
**位置**: `showQuizResults()` 函數結尾
**控制台輸出**:
```
✅ 筆試結束，準備儲存成績: [分數]
當前用戶名: [姓名]
```

**檢查項目**:
- [ ] 這兩行是否出現？
- [ ] 分數是否正確？
- [ ] 用戶名是什麼？（如果是 `undefined` 或 `未命名使用者` 需要檢查登入）

---

### Step 2: 保存函數被調用
**位置**: `saveWrittenExamScoreToFirestore()` 開始
**控制台輸出**:
```
🔍 Step 1: saveWrittenExamScoreToFirestore 已被呼叫，分數: [分數]
```

**檢查項目**:
- [ ] 這行是否出現？
- [ ] 如果沒出現，代表函數沒被調用

---

### Step 3: 檢查 Firebase 函數
**控制台輸出**:
```
🔍 Step 2: 取得使用者姓名: [姓名]
👤 使用者已登入: [email/uid]
或
⚠️ 警告: 使用者可能未登入，但仍嘗試保存成績
🔍 Step 3: 準備呼叫 window.saveWrittenExamScore
```

**檢查項目**:
- [ ] 用戶名是否正確？
- [ ] 是否顯示已登入？
- [ ] 如果出現 `❌ window.saveWrittenExamScore 函數不存在！` → Firebase 初始化失敗

---

### Step 4: Firebase 寫入準備
**位置**: `saveWrittenExamScore()` 函數
**控制台輸出**:
```
🔥 Step 4: 嘗試寫入 Firestore 成績: [姓名] [分數]
🔥 Step 5: 檢查 db 物件: ✅ 存在 或 ❌ 不存在
🔥 Step 6: 檢查 auth.currentUser: ✅ [email] 或 ❌ 未登入
🔥 Step 7: 準備寫入的資料: {userName, score, timestamp}
🔥 Step 8: 目標集合: scores
```

**檢查項目**:
- [ ] db 物件是否存在？
- [ ] auth.currentUser 是否存在？（如果不存在，可能是權限問題）
- [ ] 資料結構是否正確？

---

### Step 5: 寫入結果
**成功時**:
```
✅ 筆試成績已儲存成功！Document ID: [ID]
✅ 成功儲存筆試成績: [姓名] - [分數] 分
✅ 筆試成績 [分數] 分已成功保存到 scores 集合
```
**還會彈出 Alert**:
```
✅ 筆試成績已上傳成功！
姓名: [姓名]
分數: [分數]
```

**失敗時**:
```
❌ 儲存筆試成績時發生錯誤: [錯誤]
❌ 錯誤代碼: [code]
❌ 錯誤訊息: [message]
❌ 完整錯誤: [詳細信息]
```

---

## 🚨 常見錯誤及解決方案

### 錯誤 1: Permission Denied
```
❌ 錯誤代碼: permission-denied
❌ 錯誤訊息: Missing or insufficient permissions
```

**原因**: Firestore 安全規則不允許寫入
**解決方案**:
1. 檢查 Firebase Console → Firestore → Rules
2. 確保有以下規則：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. 如果用戶未登入 (`auth.currentUser` 為 `null`)，需要先登入

---

### 錯誤 2: Firebase Not Initialized
```
❌ window.saveWrittenExamScore 函數不存在！
```

**原因**: Firebase 模組未正確加載
**解決方案**:
1. 檢查 `<script type="module">` 是否正確加載
2. 檢查瀏覽器控制台是否有其他 JavaScript 錯誤
3. 確認網絡連接正常

---

### 錯誤 3: Collection Name 錯誤
```
❌ 錯誤訊息: [相關於路徑的錯誤]
```

**原因**: 集合名稱大小寫錯誤
**解決方案**:
1. 確認代碼中使用 `"scores"` (全小寫)
2. 確認 Firestore 中的集合名稱也是 `scores`

---

### 錯誤 4: 用戶名未設置
```
當前用戶名: undefined
或
🔍 Step 2: 取得使用者姓名: 未命名使用者
```

**原因**: `window.currentUserName` 未正確設置
**解決方案**:
1. 檢查 `userDataService` 是否正確初始化
2. 檢查登入後是否自動載入用戶名
3. 在控制台執行: `console.log(window.currentUserName)`

---

## 🧪 手動測試步驟

### 測試 1: 檢查全域變量
在瀏覽器控制台執行：
```javascript
// 檢查用戶名
console.log('用戶名:', window.currentUserName);

// 檢查保存函數
console.log('保存函數:', window.saveWrittenExamScore);

// 檢查 Auth 狀態
console.log('Auth:', window.auth);
console.log('當前用戶:', window.auth?.currentUser);
```

---

### 測試 2: 手動觸發保存
在瀏覽器控制台執行：
```javascript
// 手動保存測試成績
if (window.saveWrittenExamScore) {
    window.saveWrittenExamScore('測試用戶', 88).then(result => {
        console.log('手動測試結果:', result);
    });
}
```

---

### 測試 3: 檢查 Firebase 連接
在瀏覽器控制台執行：
```javascript
// 檢查 Firestore 連接
import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js')
  .then(({ getFirestore, collection, getDocs }) => {
    const db = getFirestore();
    return getDocs(collection(db, 'scores'));
  })
  .then(snapshot => {
    console.log('現有成績數量:', snapshot.size);
    snapshot.forEach(doc => {
      console.log('成績記錄:', doc.id, doc.data());
    });
  })
  .catch(error => {
    console.error('讀取失敗:', error);
  });
```

---

## 📊 完整調試流程圖

```
測驗結束
    ↓
✅ 筆試結束，準備儲存成績
    ↓
🔍 Step 1: saveWrittenExamScoreToFirestore 被調用
    ↓
🔍 Step 2: 取得使用者姓名
    ↓
🔍 Step 3: 準備呼叫 window.saveWrittenExamScore
    ↓
🔥 Step 4: 嘗試寫入 Firestore
    ↓
🔥 Step 5: 檢查 db 物件
    ↓
🔥 Step 6: 檢查 auth.currentUser
    ↓
🔥 Step 7: 準備寫入的資料
    ↓
🔥 Step 8: 目標集合 scores
    ↓
寫入 Firestore
    ↓
✅ 成功 → 顯示 Alert 和 Console Log
或
❌ 失敗 → 顯示詳細錯誤信息
```

---

## 🎯 下一步行動

### 如果所有 Step 都有顯示，但仍然寫入失敗
1. **複製完整的錯誤訊息**
2. **檢查 Firebase Console 的 Firestore Rules**
3. **確認用戶已登入** (`auth.currentUser` 不為 `null`)
4. **檢查網絡連接**

### 如果某個 Step 沒有顯示
- **Step 1 沒顯示**: 測驗結束邏輯沒被觸發
- **Step 4 沒顯示**: `window.saveWrittenExamScore` 函數不存在
- **沒有任何 Step**: JavaScript 可能有語法錯誤，檢查控制台

---

## 📞 提供錯誤報告時請包含

1. **完整的控制台輸出** (從 Step 1 到最後)
2. **錯誤代碼和訊息** (如果有)
3. **用戶登入狀態** (`auth.currentUser`)
4. **Firestore Rules 設置**
5. **瀏覽器和版本**

---

**現在請完成一次筆試測驗，並將完整的控制台輸出提供給我！** 🔍

這樣我就能準確定位問題所在。
