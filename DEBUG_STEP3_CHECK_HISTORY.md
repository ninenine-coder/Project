# 🔍 Step 3: 检查历史成绩页面显示

## 测试历史成绩显示功能

### 1️⃣ 检查历史成绩页面加载

1. 打开历史成绩页面 (`history.html`)
2. 打开浏览器开发者工具 (F12) → Console
3. 查看是否有以下输出：

```
✅ 載入 1 筆成績記錄
或
✅ 載入 0 筆成績記錄
```

### 2️⃣ 手动测试历史成绩查询

在历史成绩页面的控制台粘贴这段代码：

```javascript
// 手动测试历史成绩查询
console.log("=== 历史成绩查询测试 ===");

async function testHistoryQuery() {
    try {
        const { getFirestore, collection, query, where, orderBy, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
        
        const db = getFirestore();
        const userName = window.currentUserName || "测试用户";
        
        console.log("1. 用户名:", userName);
        
        // 查询该用户的所有成绩
        const q = query(
            collection(db, "scores"),
            where("userName", "==", userName),
            orderBy("timestamp", "desc")
        );
        
        console.log("2. 开始查询...");
        const querySnapshot = await getDocs(q);
        
        console.log("3. 查询结果:");
        console.log("   总记录数:", querySnapshot.size);
        
        if (querySnapshot.empty) {
            console.log("   ❌ 没有找到成绩记录");
            console.log("   可能原因:");
            console.log("   - 成绩没有保存成功");
            console.log("   - 用户名不匹配");
            console.log("   - scores 集合为空");
        } else {
            console.log("   ✅ 找到成绩记录:");
            querySnapshot.forEach((doc, index) => {
                const data = doc.data();
                const date = data.timestamp?.toDate().toLocaleString() || "无时间";
                console.log(`   No.${index + 1}  ${data.score} 分  ${date}`);
            });
        }
        
        return querySnapshot.size;
        
    } catch (error) {
        console.error("❌ 查询失败:", error);
        
        if (error.code === 'failed-precondition') {
            console.log("\n🔧 解决方案:");
            console.log("需要在 Firebase Console 创建索引");
            console.log("集合: scores");
            console.log("字段: userName (Ascending), timestamp (Descending)");
        }
        
        return 0;
    }
}

// 执行查询测试
testHistoryQuery().then(count => {
    console.log("查询测试结果:", count > 0 ? `✅ 找到 ${count} 条记录` : "❌ 没有找到记录");
});
```

### 3️⃣ 检查页面元素

在历史成绩页面控制台执行：

```javascript
// 检查页面元素
console.log("=== 检查历史成绩页面元素 ===");

// 检查成绩列表容器
const scoreListContainer = document.getElementById('scoreListContainer');
const scoreList = document.getElementById('scoreList');

console.log("1. 成绩列表容器:", scoreListContainer ? "✅ 存在" : "❌ 不存在");
console.log("2. 成绩列表:", scoreList ? "✅ 存在" : "❌ 不存在");

if (scoreListContainer) {
    console.log("3. 容器显示状态:", scoreListContainer.style.display);
    console.log("4. 容器内容:", scoreListContainer.innerHTML.length > 0 ? "有内容" : "无内容");
}

if (scoreList) {
    console.log("5. 列表内容:", scoreList.innerHTML.length > 0 ? "有内容" : "无内容");
    console.log("6. 列表 HTML:", scoreList.innerHTML);
}

// 检查其他相关元素
const loadingState = document.getElementById('loadingState');
const noDataState = document.getElementById('noDataState');

console.log("7. 加载状态:", loadingState ? "✅ 存在" : "❌ 不存在");
console.log("8. 无数据状态:", noDataState ? "✅ 存在" : "❌ 不存在");

if (loadingState) {
    console.log("9. 加载状态显示:", loadingState.style.display);
}

if (noDataState) {
    console.log("10. 无数据状态显示:", noDataState.style.display);
}
```

### 4️⃣ 手动触发成绩加载

```javascript
// 手动触发成绩加载
console.log("\n=== 手动触发成绩加载 ===");

// 检查 loadUserScores 函数是否存在
if (typeof loadUserScores === 'function') {
    console.log("1. loadUserScores 函数存在");
    console.log("2. 开始手动加载...");
    
    loadUserScores().then(() => {
        console.log("3. ✅ 手动加载完成");
        
        // 检查加载后的状态
        setTimeout(() => {
            const scoreListContainer = document.getElementById('scoreListContainer');
            const scoreList = document.getElementById('scoreList');
            
            console.log("4. 加载后检查:");
            console.log("   容器显示:", scoreListContainer?.style.display);
            console.log("   列表内容长度:", scoreList?.innerHTML.length || 0);
        }, 1000);
    }).catch(error => {
        console.error("❌ 手动加载失败:", error);
    });
} else {
    console.error("❌ loadUserScores 函数不存在");
    console.log("可用函数:", Object.keys(window).filter(key => key.includes('load') || key.includes('score')));
}
```

### 5️⃣ 检查用户数据服务

```javascript
// 检查用户数据服务状态
console.log("\n=== 用户数据服务检查 ===");

console.log("1. userDataService:", window.userDataService ? "✅ 存在" : "❌ 不存在");
console.log("2. 已初始化:", window.userDataService?.isInitialized || false);
console.log("3. 已登录:", window.userDataService?.isLoggedIn() || false);
console.log("4. 当前用户:", window.userDataService?.currentUser || "无");
console.log("5. 用户名:", window.userDataService?.currentUserName || "无");
console.log("6. 全局用户名:", window.currentUserName || "无");

if (window.userDataService) {
    console.log("7. 用户信息:", window.userDataService.getUserInfo());
}
```

---

## 📋 检查结果分析

### 情况 A: 查询测试返回 0 条记录
**原因**: 
- 成绩没有成功保存到 Firestore
- 用户名不匹配
- 返回 Step 2 检查 API 连接

### 情况 B: 查询测试返回记录，但页面没显示
**原因**:
- 页面元素问题
- `loadUserScores` 函数有问题
- 返回检查页面元素

### 情况 C: 页面显示 "无数据"
**原因**:
- `scoreListContainer.style.display = "none"`
- 需要手动显示容器

### 情况 D: 所有测试都正常
**说明**: 历史成绩显示功能正常
- 检查是否有其他页面问题

---

## 🔧 快速修复

如果发现成绩已保存但页面没显示，在控制台执行：

```javascript
// 强制显示成绩列表
const scoreListContainer = document.getElementById('scoreListContainer');
if (scoreListContainer) {
    scoreListContainer.style.display = 'block';
    console.log("✅ 已强制显示成绩列表容器");
}

// 手动触发一次加载
if (typeof loadUserScores === 'function') {
    loadUserScores();
    console.log("✅ 已手动触发成绩加载");
}
```

---

**请执行上述测试并告诉我结果！**
