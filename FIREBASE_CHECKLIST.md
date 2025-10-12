# Firebase 登入問題快速自查清單

## 🔍 問題排查順序

### 1️⃣ Console 錯誤檢查

打開瀏覽器 Console (F12)，檢查是否有以下錯誤：

#### ❌ "Firebase App named '[DEFAULT]' already exists"
**原因**: 多次調用 `initializeApp()`  
**解決**: 
- 確保所有頁面只 `import` `./js/firebase.js`
- 移除其他地方的 `initializeApp()` 調用
- 使用 `getApps().length ? getApp() : initializeApp(config)`

#### ❌ 版本混用錯誤
**原因**: 混用 v9 和 v10 的 Firebase SDK  
**解決**: 
- 統一使用 `10.13.1` 版本
- 檢查所有 `import` 語句確保版本一致

---

### 2️⃣ Firebase Console 設定檢查

登入 [Firebase Console](https://console.firebase.google.com/)，檢查以下設定：

#### ✅ Authentication > Sign-in method

**Email/Password 登入**:
- [ ] Email/Password 已啟用
- [ ] 測試帳號已創建（在 Users 標籤）

**匿名登入**:
- [ ] Anonymous 已啟用

#### ✅ Authentication > Settings

**Authorized domains**:
- [ ] `localhost` 已列入
- [ ] 你的網域已列入（例如 `yoursite.github.io`）

**注意**: 如果網域未列入，登入會被拒絕！

---

### 3️⃣ 執行順序檢查

#### ❌ 常見錯誤: 在登入前存取 Firestore

```javascript
// ❌ 錯誤：auth 還沒還原就查詢
const snap = await getDocs(query(collection(db, 'scores')));

// ✅ 正確：先等 auth 還原
await authReady;
await ensureSignedIn();
const snap = await getDocs(query(collection(db, 'scores')));
```

**規則**: 
1. 先 `await authReady` 或 `await ensureSignedIn()`
2. 再執行 Firestore 讀寫

---

### 4️⃣ 帳號檢查

#### Email/Password 登入

**在 Firebase Console > Authentication > Users 確認**:
- [ ] 該 Email 確實存在
- [ ] 帳號狀態為「Enabled」（非 Disabled）
- [ ] 密碼正確（可重設密碼測試）

**常見登入錯誤代碼**:

| 錯誤代碼 | 說明 | 解決方法 |
|---------|------|---------|
| `auth/invalid-email` | Email 格式不對 | 檢查 Email 格式 |
| `auth/user-not-found` | 此 Email 沒註冊 | 先在 Console 創建帳號 |
| `auth/wrong-password` | 密碼錯誤 | 確認密碼正確 |
| `auth/invalid-credential` | Email 或密碼錯誤 | 檢查兩者 |
| `auth/too-many-requests` | 嘗試次數過多 | 等待或重設密碼 |
| `auth/network-request-failed` | 網路失敗 | 檢查網路和網域設定 |

---

### 5️⃣ 網頁環境檢查

#### HTTPS 要求

**在非 localhost 環境**:
- [ ] 網站使用 HTTPS（某些瀏覽器會擋 HTTP）
- [ ] 瀏覽器未阻擋 Cookie/IndexedDB

#### 瀏覽器設定

**Safari / 隱私模式**:
- [ ] 關閉「阻擋所有 Cookie」
- [ ] 允許本地儲存 (IndexedDB)

**Chrome 無痕模式**:
- [ ] 了解無痕模式可能無法持久化（設計如此）

---

## 🚀 臨時逃生方案

如果你需要快速進入系統查看資料，可以先使用匿名登入：

### 在任何頁面加入

```javascript
import { ensureSignedIn } from './js/ensureSignedIn.js';

try {
  await ensureSignedIn(); // 匿名也可
} catch (e) {
  console.error('匿名登入失敗：', e.code, e.message);
  alert('登入失敗，請檢查網路連線');
}
```

### 為什麼匿名登入可行？

你的 Firestore 規則對 `/scores` 是：
- ✅ 已登入即可（匿名 + 正式都符合）
- ✅ 需要 `uid` 檢查（寫入時帶 `uid: auth.currentUser.uid`）

所以匿名登入也能正常讀寫資料！

---

## 📋 完整檢查流程

### Step 1: 檢查 Firebase 初始化

```javascript
// 在 Console 執行
console.log(window.__FB__);
// 應該看到 { app, auth, db, authReady }
```

### Step 2: 檢查認證狀態

```javascript
// 在 Console 執行
await window.__FB__.authReady;
console.log(window.__FB__.auth.currentUser);
// 應該看到 user 物件或 null
```

### Step 3: 測試匿名登入

```javascript
// 在 Console 執行
await window.ensureSignedIn();
console.log(window.__FB__.auth.currentUser.uid);
// 應該看到一個 UID
```

### Step 4: 測試 Firestore 讀取

```javascript
// 在 Console 執行
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
const snap = await getDocs(collection(window.__FB__.db, 'scores'));
console.log('找到', snap.size, '筆成績');
```

---

## 🔧 常用除錯指令

```javascript
// 1. 檢查 Firebase 版本
console.log('Firebase 版本:', firebase.SDK_VERSION);

// 2. 檢查當前用戶
console.log('當前用戶:', window.__FB__.auth.currentUser);

// 3. 檢查持久化類型
console.log('持久化:', window.__FB__.auth.currentUser?.metadata);

// 4. 手動匿名登入
await window.ensureSignedIn();

// 5. 登出
await window.__FB__.auth.signOut();

// 6. 檢查學號/工號
console.log('學號/工號:', window.getUserKey());

// 7. 查看 localStorage
console.log('用戶資料:', localStorage.getItem('pbls_user_profile'));
```

---

## 📝 標準登入流程範例

### 最小可用登入頁面

```html
<script type="module">
  import { auth, authReady } from './js/firebase.js';
  import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

  const emailEl = document.querySelector('#email');
  const passEl  = document.querySelector('#password');
  const btn     = document.querySelector('#loginBtn');

  // 等 SDK 還原登入狀態
  await authReady;

  // 如果已登入就直接跳頁
  if (auth.currentUser && !auth.currentUser.isAnonymous) {
    location.href = 'history.html';
  }

  btn?.addEventListener('click', async () => {
    const email = emailEl?.value?.trim();
    const password = passEl?.value;
    
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ 登入成功：', user.uid);
      location.href = 'history.html';
    } catch (e) {
      console.error('❌ 登入失敗：', e.code, e.message);
      alert('登入失敗：' + e.code);
    }
  });
</script>
```

---

## 🎯 Firestore 規則檢查

確保你的規則允許已登入用戶讀寫：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // scores: 已登入 + uid 檢查
    match /scores/{docId} {
      allow read, create: if request.auth != null &&
        request.auth.uid == request.resource.data.uid;
      allow update, delete: if false;
    }
    
    // user: 已登入 + uid 檢查
    match /user/{docId} {
      allow read, create, update: if request.auth != null &&
        (
          request.auth.uid == docId ||
          request.auth.uid == request.resource.data.uid
        );
      allow delete: if false;
    }
  }
}
```

**重點**:
- `request.auth != null` 表示必須登入（匿名或正式都可）
- `request.auth.uid == request.resource.data.uid` 表示只能存取自己的資料

---

## 💡 最佳實踐

### 1. 統一 Firebase 初始化

所有頁面只載入一次：
```html
<script type="module" src="./js/firebase.js"></script>
```

### 2. 確保登入後再操作

```javascript
import { ensureSignedIn } from './js/ensureSignedIn.js';

await ensureSignedIn();
// 之後再讀寫 Firestore
```

### 3. 寫入時一定帶 uid

```javascript
const payload = {
  uid: auth.currentUser.uid,  // ★ 必須
  userName: getUserKey(),
  // ...其他欄位
};
await addDoc(collection(db, 'scores'), payload);
```

### 4. 查詢時使用 userName（學號/工號）

```javascript
const userKey = getUserKey();
const q = query(
  collection(db, 'scores'),
  where('userName', '==', userKey)
);
```

---

## 📚 相關文件

- [AUTH_PERSISTENCE_GUIDE.md](./AUTH_PERSISTENCE_GUIDE.md) - Auth 持久化完整指南
- [login-simple.html](./login-simple.html) - 簡化版登入頁面範例
- [test-auth-persistence.html](./test-auth-persistence.html) - Auth 測試頁面

---

**最後更新**: 2025-10-11  
**版本**: 1.0.0

