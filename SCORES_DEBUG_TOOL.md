# 🔍 Scores 写入问题调试工具

## 立即检查：控制台输出

### 1️⃣ 完成一次笔试测验，查看控制台是否有以下输出：

```
✅ 筆試結束，準備儲存成績: [分数]
當前用戶名: [姓名]

🔍 Step 1: saveWrittenExamScoreToFirestore 已被呼叫，分數: [分数]
🔍 Step 2: 取得使用者姓名: [姓名]
👤 使用者已登入: [email]
🔍 Step 3: 準備呼叫 window.saveWrittenExamScore

🔥 Step 4: 嘗試寫入 Firestore 成績: [姓名] [分数]
🔥 Step 5: 檢查 db 物件: ✅ 存在
🔥 Step 6: 檢查 auth.currentUser: ✅ [email]
🔥 Step 7: 下一個序號: [数字]
🔥 Step 8: 準備寫入的資料: {...}
🔥 Step 9: 目標文檔 ID: scores [数字]

✅ 筆試成績已儲存成功！Document ID: scores [数字]
或
❌ 儲存筆試成績時發生錯誤: [错误信息]
```

---

## 🧪 手动测试工具

### 测试 1: 基础连接测试
在控制台执行：

```javascript
// 基础连接测试
console.log("=== 基础连接测试 ===");

// 检查用户名
console.log("1. 用户名:", window.currentUserName);

// 检查保存函数
console.log("2. 保存函数:", typeof window.saveWrittenExamScore);

// 检查 Auth 状态
console.log("3. Auth 状态:", window.auth?.currentUser ? "✅ 已登录" : "❌ 未登录");
if (window.auth?.currentUser) {
    console.log("   用户信息:", window.auth.currentUser.email);
}

// 检查 userDataService
console.log("4. userDataService:", window.userDataService ? "✅ 存在" : "❌ 不存在");
console.log("5. 服务已初始化:", window.userDataService?.isInitialized || false);
```

### 测试 2: 简化版成绩保存测试
```javascript
// 简化版保存测试（不使用有序 ID）
console.log("\n=== 简化版保存测试 ===");

(async () => {
    try {
        const { getFirestore, collection, addDoc, serverTimestamp } = 
            await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        
        const db = getFirestore();
        const userName = window.currentUserName || "测试用户";
        
        console.log("1. 准备保存数据:");
        console.log("   - 集合名称: scores");
        console.log("   - 用户名:", userName);
        console.log("   - 分数: 99");
        
        const testData = {
            userName: userName,
            score: 99,
            timestamp: serverTimestamp(),
            test: true // 标记这是测试数据
        };
        
        console.log("2. 开始保存...");
        const docRef = await addDoc(collection(db, "scores"), testData);
        
        console.log("✅ 保存成功！");
        console.log("   Document ID:", docRef.id);
        console.log("   数据:", testData);
        
        // 等待 3 秒后删除测试数据
        setTimeout(async () => {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            await deleteDoc(doc(db, "scores", docRef.id));
            console.log("🧹 测试数据已删除");
        }, 3000);
        
    } catch (error) {
        console.error("❌ 保存失败:", error);
        console.error("错误代码:", error.code);
        console.error("错误信息:", error.message);
        
        if (error.code === 'permission-denied') {
            console.log("\n🔧 权限问题解决方案:");
            console.log("1. 检查 Firestore Rules");
            console.log("2. 确认用户已登录");
            console.log("3. 检查集合名称是否正确");
        }
    }
})();
```

### 测试 3: 有序 ID 系统测试
```javascript
// 有序 ID 系统测试
console.log("\n=== 有序 ID 系统测试 ===");

(async () => {
    try {
        const { getFirestore, collection, query, orderBy, limit, getDocs, documentId, doc, setDoc, serverTimestamp } = 
            await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        
        const db = getFirestore();
        
        // 1. 获取下一个序号
        console.log("1. 获取下一个序号...");
        const scoresRef = collection(db, "scores");
        const q = query(scoresRef, orderBy(documentId(), "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        let nextScoreId;
        if (querySnapshot.empty) {
            nextScoreId = 1;
            console.log("   📊 这是第一笔记录，序号: 1");
        } else {
            const latestDoc = querySnapshot.docs[0];
            const latestId = latestDoc.id;
            console.log("   📊 最新文档 ID:", latestId);
            
            const match = latestId.match(/scores(\d+)/);
            if (match) {
                nextScoreId = parseInt(match[1]) + 1;
                console.log("   📊 下一个序号:", nextScoreId);
            } else {
                nextScoreId = 1;
                console.log("   ⚠️ ID 格式不正确，从 1 开始");
            }
        }
        
        // 2. 尝试保存
        console.log("2. 尝试保存有序 ID 文档...");
        const userName = window.currentUserName || "测试用户";
        const docData = {
            userName: userName,
            score: 88,
            timestamp: serverTimestamp(),
            test: true
        };
        
        const docRef = doc(db, "scores", `scores${nextScoreId}`);
        console.log("   目标文档 ID: scores" + nextScoreId);
        
        await setDoc(docRef, docData);
        
        console.log("✅ 有序 ID 保存成功！");
        console.log("   Document ID: scores" + nextScoreId);
        console.log("   数据:", docData);
        
        // 等待 3 秒后删除测试数据
        setTimeout(async () => {
            const { deleteDoc } = await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
            await deleteDoc(docRef);
            console.log("🧹 测试数据已删除");
        }, 3000);
        
    } catch (error) {
        console.error("❌ 有序 ID 保存失败:", error);
        console.error("错误代码:", error.code);
        console.error("错误信息:", error.message);
    }
})();
```

### 测试 4: 现有数据检查
```javascript
// 检查现有数据
console.log("\n=== 现有数据检查 ===");

(async () => {
    try {
        const { getFirestore, collection, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, "scores"));
        
        console.log("scores 集合总文档数:", snapshot.size);
        
        if (snapshot.empty) {
            console.log("集合为空");
        } else {
            console.log("现有文档:");
            snapshot.forEach((doc, index) => {
                const data = doc.data();
                console.log(`  ${index + 1}. ${doc.id}: ${data.userName} - ${data.score} 分`);
            });
        }
        
    } catch (error) {
        console.error("❌ 查询失败:", error);
    }
})();
```

---

## 🚨 常见问题排查

### 问题 1: 看到 "❌ window.saveWrittenExamScore 函数不存在"
**原因**: Firebase 模块未正确加载
**解决**: 刷新页面，确保网络连接正常

### 问题 2: 看到 "❌ 未登入"
**原因**: 用户未登录或登录状态丢失
**解决**: 重新登录

### 问题 3: 看到 "permission-denied"
**原因**: Firestore Rules 问题
**解决**: 
1. 确认 Rules 已保存并发布
2. 检查集合名称是否为 `scores`
3. 确认用户已登录

### 问题 4: 看到 "failed-precondition"
**原因**: 缺少索引
**解决**: 在 Firebase Console 创建索引

### 问题 5: 有序 ID 系统出错
**原因**: 查询文档 ID 时出错
**解决**: 使用简化版保存（测试 2）

---

## 📋 请提供信息

执行上述测试后，请告诉我：

1. **控制台显示了什么？**（复制所有输出）
2. **哪个测试成功了？哪个失败了？**
3. **具体的错误信息是什么？**

根据这些信息，我能准确定位问题所在！
