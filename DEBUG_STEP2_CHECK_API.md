# 🔍 Step 2: 检查 API 回传数据库

## 测试 Firebase 连接

### 1️⃣ 检查 Firebase 初始化

在控制台粘贴这段代码：

```javascript
// 检查 Firebase 状态
console.log("=== Firebase 状态检查 ===");

// 检查 app 实例
console.log("1. Firebase App:", window.firebase?.app || "未找到");

// 检查 Firestore 实例
const { getFirestore } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
const db = getFirestore();
console.log("2. Firestore DB:", db ? "✅ 已初始化" : "❌ 未初始化");

// 检查 Auth 状态
const { getAuth } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js");
const auth = getAuth();
console.log("3. Auth 状态:", auth.currentUser ? `✅ 已登录: ${auth.currentUser.email}` : "❌ 未登录");

// 检查用户数据服务
console.log("4. userDataService:", window.userDataService ? "✅ 存在" : "❌ 不存在");
console.log("5. 用户名:", window.currentUserName || "未设置");
```

### 2️⃣ 测试 Firestore 写入权限

```javascript
// 测试写入权限
console.log("\n=== 测试 Firestore 写入 ===");

try {
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    const db = getFirestore();
    
    console.log("开始写入测试数据...");
    
    const testData = {
        userName: window.currentUserName || "测试用户",
        score: 999,
        timestamp: serverTimestamp(),
        test: true
    };
    
    console.log("测试数据:", testData);
    
    const docRef = await addDoc(collection(db, "scores"), testData);
    console.log("✅ 写入成功！Document ID:", docRef.id);
    
    // 等待 2 秒后删除测试数据
    setTimeout(async () => {
        const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        await deleteDoc(doc(db, "scores", docRef.id));
        console.log("🧹 测试数据已删除");
    }, 2000);
    
} catch (error) {
    console.error("❌ 写入失败:", error);
    console.error("错误代码:", error.code);
    console.error("错误信息:", error.message);
    
    if (error.code === 'permission-denied') {
        console.log("\n🔧 解决方案:");
        console.log("1. 检查 Firestore Rules");
        console.log("2. 确保用户已登录");
        console.log("3. 检查 scores 集合权限");
    }
}
```

### 3️⃣ 检查 Firestore Rules

访问 Firebase Console:
1. 打开 https://console.firebase.google.com/
2. 选择项目: `progect-115a5`
3. 左侧菜单 → **Firestore Database**
4. 点击顶部的 **Rules** 标签

**应该看到的规则**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /scores/{scoreId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

**如果规则不正确，请更新并点击"发布"**

### 4️⃣ 手动测试完整保存流程

```javascript
// 完整保存测试
console.log("\n=== 完整保存测试 ===");

async function testCompleteSave() {
    try {
        const { getFirestore, collection, addDoc, serverTimestamp } = 
            await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        
        const db = getFirestore();
        const userName = window.currentUserName || "测试用户";
        const score = 35; // 使用你刚才的分数
        
        console.log("准备保存:", { userName, score });
        
        const docData = {
            userName: userName,
            score: score,
            timestamp: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "scores"), docData);
        
        console.log("✅ 保存成功！");
        console.log("Document ID:", docRef.id);
        console.log("数据:", docData);
        
        return true;
        
    } catch (error) {
        console.error("❌ 保存失败:", error);
        return false;
    }
}

// 执行测试
testCompleteSave().then(success => {
    console.log("测试结果:", success ? "✅ 成功" : "❌ 失败");
});
```

---

## 📋 检查结果

### 如果 Firebase 状态检查失败:
- 检查网络连接
- 检查 Firebase 配置
- 重新刷新页面

### 如果写入权限测试失败:
- 检查 Firestore Rules
- 确保用户已登录
- 检查 scores 集合是否存在

### 如果完整保存测试成功:
- 说明 API 连接正常
- 进入 Step 3 检查历史成绩显示

---

## 🚨 常见错误及解决

### Permission Denied
```
❌ 错误代码: permission-denied
```
**解决**: 更新 Firestore Rules（见上面）

### Network Error
```
❌ 网络连接错误
```
**解决**: 检查网络连接，重新刷新页面

### Collection Not Found
```
❌ 集合不存在
```
**解决**: 在 Firebase Console 手动创建 `scores` 集合

---

**请执行上述测试并告诉我结果！**
