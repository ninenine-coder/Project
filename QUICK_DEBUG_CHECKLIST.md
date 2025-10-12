# ✅ 快速調試清單

## 🚀 立即檢查這些項目

### 1️⃣ 打開瀏覽器開發者工具
- 按 `F12` 或右鍵 → 檢查
- 切換到 **Console (主控台)** 標籤

---

### 2️⃣ 完成一次筆試測驗

---

### 3️⃣ 檢查控制台輸出

#### 你應該看到這些訊息（按順序）：

```
✅ 筆試結束，準備儲存成績: [分數]
當前用戶名: [你的名字]

🔍 Step 1: saveWrittenExamScoreToFirestore 已被呼叫，分數: [分數]

🔍 Step 2: 取得使用者姓名: [你的名字]

👤 使用者已登入: [你的email]

🔍 Step 3: 準備呼叫 window.saveWrittenExamScore

🔥 Step 4: 嘗試寫入 Firestore 成績: [你的名字] [分數]

🔥 Step 5: 檢查 db 物件: ✅ 存在

🔥 Step 6: 檢查 auth.currentUser: ✅ [你的email]

🔥 Step 7: 準備寫入的資料: {userName: "...", score: ..., timestamp: ...}

🔥 Step 8: 目標集合: scores

✅ 筆試成績已儲存成功！Document ID: [ID]

✅ 成功儲存筆試成績: [你的名字] - [分數] 分

✅ 筆試成績 [分數] 分已成功保存到 scores 集合
```

#### 還會彈出一個 Alert:
```
✅ 筆試成績已上傳成功！
姓名: [你的名字]
分數: [分數]
```

---

### 4️⃣ 如果看到錯誤訊息

#### 找到紅色的錯誤訊息：
```
❌ [錯誤內容]
```

#### 然後：
1. **截圖整個控制台**
2. **複製所有文字**
3. **提供給我**

---

### 5️⃣ 快速手動測試

在控制台貼上這段代碼並按 Enter：

```javascript
// 測試 1: 檢查基本設置
console.log("=== 基本檢查 ===");
console.log("用戶名:", window.currentUserName);
console.log("保存函數:", typeof window.saveWrittenExamScore);
console.log("Auth 狀態:", window.auth?.currentUser ? "已登入" : "未登入");

// 測試 2: 手動保存測試成績
console.log("\n=== 開始手動測試 ===");
if (window.saveWrittenExamScore) {
    window.saveWrittenExamScore('手動測試', 99)
        .then(success => {
            if (success) {
                console.log("✅ 手動測試成功！");
            } else {
                console.log("❌ 手動測試失敗");
            }
        })
        .catch(error => {
            console.error("❌ 手動測試錯誤:", error);
        });
} else {
    console.error("❌ saveWrittenExamScore 函數不存在");
}
```

---

### 6️⃣ 檢查 Firestore

1. 打開 **Firebase Console**: https://console.firebase.google.com/
2. 選擇你的專案: `progect-115a5`
3. 左側選單 → **Firestore Database**
4. 查看 `scores` 集合
5. 檢查是否有新的記錄

---

## 🎯 根據結果判斷

### 情況 A: 沒有任何 Step 顯示
**問題**: JavaScript 語法錯誤或函數沒被調用
**檢查**: 控制台是否有其他紅色錯誤？

### 情況 B: Step 1-3 有，但 Step 4 之後沒有
**問題**: `window.saveWrittenExamScore` 函數不存在
**檢查**: Firebase 模組是否正確加載？

### 情況 C: 所有 Step 都有，但顯示錯誤
**問題**: Firestore 寫入失敗
**最常見原因**:
1. **Permission Denied** → 沒登入或 Firestore Rules 設置錯誤
2. **集合名稱錯誤** → 確認是 `"scores"` (小寫)
3. **網絡問題** → 檢查網路連接

### 情況 D: 所有 Step 都成功，但 Firestore 沒資料
**問題**: 可能是 Firestore Console 沒刷新
**解決**: 在 Firebase Console 按 `Ctrl+R` 重新整理頁面

---

## 📸 需要提供的信息

如果問題還沒解決，請提供：

1. **完整的控制台輸出截圖**
2. **手動測試的結果**
3. **Firestore Rules 的截圖**
4. **是否彈出 Alert？內容是什麼？**

---

**準備好了嗎？開始測試吧！** 🚀
