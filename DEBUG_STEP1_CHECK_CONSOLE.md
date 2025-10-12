# 🔍 Step 1: 检查控制台输出

## 立即检查：浏览器控制台

### 1️⃣ 打开开发者工具
- 按 `F12` 或右键 → 检查元素
- 切换到 **Console (控制台)** 标签

### 2️⃣ 查看是否有以下输出

你应该看到这些信息（按顺序）：

```
✅ 筆試結束，準備儲存成績: 35
當前用戶名: [你的姓名]

🔍 Step 1: saveWrittenExamScoreToFirestore 已被呼叫，分數: 35

🔍 Step 2: 取得使用者姓名: [你的姓名]

👤 使用者已登入: [你的email]
或
⚠️ 警告: 使用者可能未登入，但仍嘗試保存成績

🔍 Step 3: 準備呼叫 window.saveWrittenExamScore

🔥 Step 4: 嘗試寫入 Firestore 成績: [你的姓名] 35

🔥 Step 5: 檢查 db 物件: ✅ 存在

🔥 Step 6: 檢查 auth.currentUser: ✅ [email]
或
🔥 Step 6: 檢查 auth.currentUser: ❌ 未登入

🔥 Step 7: 準備寫入的資料: {userName: "...", score: 35, timestamp: ...}

🔥 Step 8: 目標集合: scores

✅ 筆試成績已儲存成功！Document ID: [ID]
✅ 成功儲存筆試成績: [你的姓名] - 35 分
```

### 3️⃣ 检查结果

#### 情况 A: 看到所有 Step 1-8 ✅
- 说明代码正常执行
- 进入 Step 2 检查 API 连接

#### 情况 B: 看到 Step 1-3，但没有 Step 4 🔥
- 说明 `window.saveWrittenExamScore` 函数不存在
- **问题**: Firebase 模块未正确加载
- **解决**: 检查网络连接和 Firebase 配置

#### 情况 C: 看到 Step 4-8，但显示错误 ❌
- 说明 Firebase 连接有问题
- **问题**: 可能是权限或网络问题
- 进入 Step 2 详细检查

#### 情况 D: 完全没有看到任何 Step 🔍
- **问题**: `showQuizResults` 函数没有被调用
- **解决**: 检查测验结束逻辑

---

## 🚨 如果没有看到任何输出

### 手动触发保存测试

在控制台粘贴这段代码：

```javascript
// 手动测试保存功能
console.log("=== 手动测试开始 ===");
console.log("1. 检查用户名:", window.currentUserName);
console.log("2. 检查保存函数:", typeof window.saveWrittenExamScore);

if (window.saveWrittenExamScore && window.currentUserName) {
    console.log("3. 开始手动保存测试...");
    window.saveWrittenExamScore(window.currentUserName, 35)
        .then(success => {
            console.log("4. 手动保存结果:", success ? "✅ 成功" : "❌ 失败");
        })
        .catch(error => {
            console.error("5. 手动保存错误:", error);
        });
} else {
    console.error("❌ 缺少必要函数或用户名");
    console.log("saveWrittenExamScore 存在:", !!window.saveWrittenExamScore);
    console.log("currentUserName:", window.currentUserName);
}
```

---

## 📋 请提供信息

请告诉我：

1. **控制台显示了什么？**（复制所有相关输出）
2. **有没有弹出 Alert？**（显示"成績已上傳成功"的弹窗）
3. **手动测试的结果是什么？**

根据这些信息，我会判断问题出在哪一步。
