# 🚀 用戶資料服務完整集成指南

## ✅ 新版 userDataService.js 特點

### 核心優勢
1. **自動監聽登入狀態** - 使用 Firebase Auth 的 `onAuthStateChanged`
2. **自動載入姓名** - 登入後自動從 Firestore `users` 集合讀取
3. **全域可用** - `window.currentUserName` 和 `window.userDataService`
4. **簡潔高效** - 移除了冗餘代碼，保留核心功能

---

## 🧠 功能總覽

### 主要方法

| 功能 | 描述 | 調用方式 |
|------|------|---------|
| `initialize()` | 自動監聽登入狀態（登入後自動載入姓名） | 自動執行 |
| `loadUserName(uid)` | 從 Firestore 的 `users` 集合讀取 `name` 欄位 | 自動調用 |
| `window.currentUserName` | 全站可直接取用的使用者姓名（例如考試成績用） | 直接讀取 |
| `getUserInfo()` | 給 Header 顯示「王小明（example@gmail.com）」 | `userDataService.getUserInfo()` |
| `logout()` | 登出 + 清除 localStorage | `userDataService.logout()` |

---

## 🔄 自動化流程

### 登入流程
```
1️⃣ 用戶在 login.html 登入
2️⃣ Firebase Auth 觸發 onAuthStateChanged
3️⃣ userDataService.initialize() 偵測到登入
4️⃣ 自動調用 loadUserName(uid)
5️⃣ 從 Firestore users 集合讀取姓名
6️⃣ 設置 window.currentUserName = "張三"
7️⃣ 控制台輸出: "✅ Firestore 已載入使用者姓名：張三"
```

### 成績保存流程
```
1️⃣ 用戶完成笔试测验
2️⃣ exam_quiz.html 調用 saveWrittenExamScore()
3️⃣ 直接讀取 window.currentUserName
4️⃣ 保存到 Firestore scores 集合
5️⃣ 控制台輸出: "✅ 筆試成績已儲存成功！"
```

### 成績顯示流程
```
1️⃣ 用戶進入 history.html
2️⃣ loadUserScores() 讀取 window.currentUserName
3️⃣ 查詢 scores 集合 where userName == window.currentUserName
4️⃣ 顯示該用戶的所有成績
5️⃣ 控制台輸出: "✅ 載入 5 筆成績記錄"
```

---

## 🚀 串接邏輯（不需再改其他頁面）

### 各頁面自動集成

| 頁面 | 動作 | 說明 |
|------|------|------|
| `login.html` | 登入成功後自動觸發 `onAuthStateChanged` → 載入姓名 | 無需手動調用 |
| `exam_quiz.html` | 呼叫 `saveWrittenExamScore()` 時自動取得 `window.currentUserName` | 已集成 |
| `history.html` | 載入時即可直接讀取該使用者的成績紀錄 | 已集成 |
| `index.html` | 可使用 `userDataService.getUserInfo()` 顯示用戶資訊 | 可選 |
| `exam.html` | 可使用 `userDataService.getUserInfo()` 顯示用戶資訊 | 可選 |

---

## 📊 數據流向圖

```
┌─────────────┐
│  登入頁面    │
│ login.html  │
└──────┬──────┘
       │ 登入成功
       ▼
┌─────────────────────────┐
│ Firebase Auth           │
│ onAuthStateChanged      │
└──────┬──────────────────┘
       │ 觸發
       ▼
┌─────────────────────────┐
│ userDataService         │
│ .initialize()           │
└──────┬──────────────────┘
       │ 自動調用
       ▼
┌─────────────────────────┐
│ Firestore users 集合    │
│ 讀取 name 欄位          │
└──────┬──────────────────┘
       │ 設置
       ▼
┌─────────────────────────┐
│ window.currentUserName  │
│ = "張三"                │
└──────┬──────────────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ 筆試測驗     │      │ 歷史成績     │
│exam_quiz.html│      │history.html │
└─────────────┘      └─────────────┘
  保存成績               顯示成績
```

---

## 💻 實際代碼示例

### 在任何頁面讀取用戶名
```javascript
// 方法 1: 直接讀取全域變量（推薦）
const userName = window.currentUserName || "未命名使用者";
console.log('當前用戶:', userName);

// 方法 2: 通過服務對象讀取
const userName = window.userDataService.currentUserName;
console.log('當前用戶:', userName);
```

### 顯示用戶資訊
```javascript
// 在 Header 或側邊欄顯示用戶資訊
const userInfo = window.userDataService.getUserInfo();
document.getElementById('user-info').textContent = userInfo;
// 輸出: "張三 (user@example.com)"
```

### 檢查登入狀態
```javascript
if (window.userDataService.isLoggedIn()) {
    console.log('用戶已登入');
} else {
    console.log('用戶未登入，跳轉到登入頁面');
    window.location.href = 'login.html';
}
```

### 登出
```javascript
// 在登出按鈕的點擊事件中
async function handleLogout() {
    await window.userDataService.logout();
    window.location.href = 'login.html';
}
```

---

## 🔍 調試與驗證

### 成功標誌（控制台輸出）
```
👤 使用者已登入: user@example.com
✅ Firestore 已載入使用者姓名：張三
```

### 驗證命令（在瀏覽器控制台執行）
```javascript
// 檢查用戶名
console.log('用戶名:', window.currentUserName);

// 檢查服務狀態
console.log('服務已初始化:', window.userDataService.isInitialized);
console.log('用戶已登入:', window.userDataService.isLoggedIn());

// 檢查用戶資訊
console.log('用戶資訊:', window.userDataService.getUserInfo());
```

---

## ⚠️ 常見問題排查

### 問題 1: `window.currentUserName` 是 `undefined`
**原因**: 用戶未登入或服務尚未初始化
**解決**:
```javascript
// 等待服務初始化
if (!window.userDataService.isInitialized) {
    await window.userDataService.initialize();
}
const userName = window.currentUserName || "未命名使用者";
```

### 問題 2: Firestore 找不到用戶文件
**原因**: `users` 集合中沒有對應的文件
**解決**: 
1. 檢查 Firebase Console → Firestore → `users` 集合
2. 確保文件 ID 是用戶的 `uid`
3. 確保文件中有 `name` 欄位

### 問題 3: 成績保存時用戶名是 "未命名使用者"
**原因**: 服務尚未完全初始化
**解決**:
```javascript
// 在保存成績前檢查
if (!window.currentUserName) {
    console.warn('等待用戶名載入...');
    await new Promise(resolve => setTimeout(resolve, 1000));
}
const userName = window.currentUserName || "未命名使用者";
```

---

## 📋 集成檢查清單

### 必須完成
- [x] `src/services/userDataService.js` 已更新
- [x] `exam_quiz.html` 已導入服務
- [x] `history.html` 已導入服務
- [x] 所有頁面都可以訪問 `window.currentUserName`

### 可選優化
- [ ] 在 Header 顯示用戶資訊
- [ ] 在側邊欄顯示用戶名
- [ ] 添加登出按鈕並綁定 `logout()` 方法
- [ ] 添加未登入時的自動跳轉

---

## 🎯 完整示例：筆試成績保存

### exam_quiz.html 中的實現
```javascript
// 測驗結束時
async function saveWrittenExamScoreToFirestore(score) {
    try {
        // 直接讀取全域用戶名（由 userDataService 自動設置）
        const userName = window.currentUserName || "未命名使用者";
        
        // 保存成績
        const success = await window.saveWrittenExamScore(userName, score);
        if (success) {
            console.log(`✅ 筆試成績 ${score} 分已成功保存到 scores 集合`);
        }
    } catch (error) {
        console.error("❌ 保存筆試成績時發生錯誤:", error);
    }
}
```

---

**用戶資料服務已完全自動化！** 🎉

現在系統會：
- ✅ **自動監聽登入** - Firebase Auth 狀態變化自動處理
- ✅ **自動載入姓名** - 登入後立即從 Firestore 讀取
- ✅ **全域可用** - 任何頁面都可以讀取 `window.currentUserName`
- ✅ **無需手動操作** - 整個流程完全自動化

您不需要在其他頁面做任何修改，系統已經自動集成完成！
