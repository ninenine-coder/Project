# Auth 持久化机制 - 实施指南

## 📋 概述

本系统已实现 Firebase Auth 持久化机制，确保用户在跨页面和页面刷新时保持登录状态，无需重复登录。

## 🎯 核心原理

### 1. 不是每页都重新登录
- Firebase SDK 会自动将认证状态保存在 IndexedDB/localStorage
- 换页后 SDK 会自动还原同一个使用者
- **只需在每个页面等待 Auth 还原完成，如果还原失败再执行匿名登录**

### 2. 三层保障机制

```
┌─────────────────────────────────────┐
│  1. Firebase 自动还原 (IndexedDB)   │
│     ↓ 失败？                        │
│  2. ensureSignedIn() 检查并登录     │
│     ↓ 失败？                        │
│  3. 手动 signInAnonymously()        │
└─────────────────────────────────────┘
```

## 📁 文件结构

### 核心文件

#### 1. `js/firebase.js` - Firebase 初始化
```javascript
import { initializeApp } from "...";
import { getAuth, browserLocalPersistence, setPersistence } from "...";

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// 明確使用「長期保存」
await setPersistence(auth, browserLocalPersistence);

// 等待 Auth 還原完成
export const authReady = new Promise(resolve => {
  const unsub = onAuthStateChanged(auth, () => { 
    unsub(); 
    resolve(); 
  });
});

window.__FB__ = { app, auth, db, authReady };
```

#### 2. `js/auth-helpers.js` - 认证辅助函数
```javascript
export async function ensureSignedIn() {
  // 1. 等待 SDK 从 IndexedDB 还原
  await new Promise(res => {
    const off = onAuthStateChanged(auth, () => { 
      off(); 
      res(); 
    });
  });

  // 2. 若没有用户，再做一次匿名登录
  if (!auth.currentUser) {
    const { user } = await signInAnonymously(auth);
    return user;
  }
  
  return auth.currentUser;
}

export function getUserKey() {
  const p = JSON.parse(localStorage.getItem('pbls_user_profile') || 'null');
  return p?.学号 || p?.工号 || p?.name || p?.studentId || null;
}
```

## 🚀 使用方法

### 在任何页面中使用

```javascript
import { auth, db } from './js/firebase.js';
import { ensureSignedIn, getUserKey } from './js/auth-helpers.js';

// 确保用户已登录（一次就好）
await ensureSignedIn();

// 之后就能安全地访问 Firestore
const userKey = getUserKey();
const q = query(
  collection(db, 'scores'),
  where('userName', '==', userKey)
);
const snap = await getDocs(q);
```

### 实际应用示例

#### 1. `history.html` - 历史成绩页面
```javascript
async function main() {
  // 1. 确保用户已登录
  await ensureSignedIn();
  
  // 2. 获取学号/工号
  const userKey = getUserKey();
  if (!userKey) {
    // 提示用户登录
    return;
  }
  
  // 3. 实时监听成绩
  listenMyScores(userKey);
}
```

#### 2. `exam_quiz.html` - 考试页面
```javascript
async function handleExamFinish(...) {
  // 确保已登录
  const user = await ensureSignedIn();
  const userName = getUserKey();
  
  // 保存成绩
  await createSequentialScore({
    uid: user.uid,
    userName: userName,
    score: finalScore,
    // ...
  });
}
```

## ✅ 优势

### 1. 无缝体验
- 用户只需登录一次
- 刷新页面不丢失状态
- 跨页面自动还原

### 2. 安全可靠
- 符合 Firestore 安全规则 (`request.auth != null`)
- 自动处理 race condition
- 兼容无痕/清除缓存场景

### 3. 易于维护
- 统一的认证入口
- 清晰的错误处理
- 便于调试和测试

## 🧪 测试

### 测试页面
访问 `test-auth-persistence.html` 进行完整测试：

1. **初始化检查** - 验证 Firebase 正确初始化
2. **认证状态检查** - 查看当前用户状态
3. **持久化测试** - 验证刷新后 UID 是否相同
4. **跨页面测试** - 在新标签页验证用户还原
5. **学号/工号测试** - 验证用户标识存储

### 测试场景

#### 场景 1: 首次访问
```
用户访问 history.html
  ↓
authReady 等待还原（无用户）
  ↓
ensureSignedIn() 执行匿名登录
  ↓
创建新的匿名用户（UID: abc123）
  ↓
显示成绩列表
```

#### 场景 2: 刷新页面
```
用户刷新 history.html
  ↓
authReady 等待还原
  ↓
SDK 从 IndexedDB 还原用户（UID: abc123）
  ↓
ensureSignedIn() 检测到已有用户，直接返回
  ↓
显示成绩列表（同一用户）
```

#### 场景 3: 跨页面
```
用户从 exam.html 跳转到 history.html
  ↓
新页面 authReady 等待还原
  ↓
SDK 自动还原同一用户（UID: abc123）
  ↓
ensureSignedIn() 返回现有用户
  ↓
显示成绩列表（同一用户）
```

## 🚨 常见问题

### Q1: 为什么不直接在每个页面调用 `signInAnonymously()`？
**A:** 每次调用都会创建新的匿名账户（新 UID），导致数据分散。正确做法是先等待还原，只有还原失败才创建新账户。

### Q2: `onAuthStateChanged` 和 `ensureSignedIn` 有什么区别？
**A:** 
- `onAuthStateChanged`: 监听认证状态变化（持续监听）
- `ensureSignedIn`: 一次性检查+登录（Promise 形式）

### Q3: 如何升级匿名账户？
**A:** 使用 `linkWithCredential()`:
```javascript
import { linkWithCredential, EmailAuthProvider } from "...";

const credential = EmailAuthProvider.credential(email, password);
await linkWithCredential(auth.currentUser, credential);
```

### Q4: 持久化数据存储在哪里？
**A:** 
- 优先使用 IndexedDB (`firebaseLocalStorageDb`)
- 降级使用 localStorage
- 可以在浏览器 DevTools > Application 中查看

### Q5: 如何调试认证问题？
**A:** 
1. 打开浏览器控制台
2. 运行 `await window.__FB__.authReady`
3. 检查 `window.__FB__.auth.currentUser`
4. 使用 `test-auth-persistence.html` 进行完整测试

## 📊 Firestore 规则配合

确保 Firestore 规则正确配置：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // scores: 本人可读/新增
    match /scores/{docId} {
      allow read, create: if request.auth != null &&
        request.auth.uid == request.resource.data.uid;
      allow update, delete: if false;
    }
    
    // user: 本人可读/写
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

## 🎓 最佳实践

### 1. 每个页面的标准初始化流程
```javascript
import { auth, db } from './js/firebase.js';
import { ensureSignedIn, getUserKey } from './js/auth-helpers.js';

async function main() {
  try {
    // 1. 确保已登录
    await ensureSignedIn();
    
    // 2. 获取用户标识
    const userKey = getUserKey();
    
    // 3. 执行业务逻辑
    // ...
    
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

main();
```

### 2. 保存数据时始终带 `uid`
```javascript
const payload = {
  uid: auth.currentUser.uid,  // ★ 必须
  userName: getUserKey(),
  // ...其他字段
};
await addDoc(collection(db, 'scores'), payload);
```

### 3. 查询数据时使用 `userName`（学号/工号）
```javascript
const userKey = getUserKey();
const q = query(
  collection(db, 'scores'),
  where('userName', '==', userKey)
);
```

## 📝 总结

| 特性 | 说明 |
|-----|------|
| **持久化** | ✅ 自动保存到 IndexedDB/localStorage |
| **跨页面** | ✅ 自动还原同一用户 |
| **刷新页面** | ✅ 保持登录状态 |
| **安全性** | ✅ 符合 Firestore 规则要求 |
| **易用性** | ✅ 统一的 `ensureSignedIn()` 接口 |
| **调试性** | ✅ 提供测试页面和控制台工具 |

---

**开发者**: Cursor AI  
**最后更新**: 2025-10-11  
**版本**: 1.0.0

