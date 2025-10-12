# 🔥 Firebase scores 集合设置指南

## ✅ 你已经完成的步骤

1. ✅ 在 Firebase Console 创建了 `scores` 集合

---

## 📋 需要确认的事项

### 1️⃣ Firestore 集合名称
**必须是**: `scores` (全小写)

### 2️⃣ Firestore 安全规则 (Rules)

请到 Firebase Console 检查并设置规则：

#### 路径
Firebase Console → Firestore Database → Rules

#### 推荐规则（允许已登录用户读写）
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // users 集合规则
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // scores 集合规则（所有已登录用户可读写）
    match /scores/{scoreId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### 或者临时测试规则（开发阶段，**上线前必须改回**）
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 🎯 完整测试流程

### Step 1: 检查 Firestore 设置
1. 打开 Firebase Console: https://console.firebase.google.com/
2. 选择项目: `progect-115a5`
3. 左侧菜单 → **Firestore Database**
4. 检查是否有 `scores` 集合（可能是空的，这正常）

### Step 2: 检查安全规则
1. 在 Firestore 页面，点击顶部的 **Rules** 标签
2. 确认有允许 `scores` 集合读写的规则
3. 如果没有，复制上面的规则并点击 **发布**

### Step 3: 测试保存功能
1. 打开你的网站
2. 登录账户
3. 打开浏览器开发者工具 (F12) → Console
4. 完成一次笔试测验
5. 观察控制台输出

#### 应该看到的输出：
```
✅ 筆試結束，準備儲存成績: [分数]
當前用戶名: [你的姓名]
🔍 Step 1: saveWrittenExamScoreToFirestore 已被呼叫，分數: [分数]
🔍 Step 2: 取得使用者姓名: [你的姓名]
👤 使用者已登入: [你的email]
🔍 Step 3: 準備呼叫 window.saveWrittenExamScore
🔥 Step 4: 嘗試寫入 Firestore 成績: [你的姓名] [分数]
🔥 Step 5: 檢查 db 物件: ✅ 存在
🔥 Step 6: 檢查 auth.currentUser: ✅ [email]
🔥 Step 7: 準備寫入的資料: {...}
🔥 Step 8: 目標集合: scores
✅ 筆試成績已儲存成功！Document ID: [自动生成的ID]
✅ 成功儲存筆試成績: [你的姓名] - [分数] 分
```

#### 还会弹出 Alert：
```
✅ 筆試成績已上傳成功！
姓名: [你的姓名]
分數: [分数]
```

### Step 4: 检查 Firestore 数据
1. 回到 Firebase Console → Firestore Database
2. 刷新页面
3. 查看 `scores` 集合
4. 应该看到新的文档，包含：
   - `userName`: "你的姓名"
   - `score`: 数字
   - `timestamp`: 时间戳

### Step 5: 测试历史成绩显示
1. 在网站上点击 "历史成绩" 页面
2. 应该看到刚才保存的成绩
3. 格式：`No.1  [分数] 分  [时间]`

---

## 🔧 Firestore 索引设置（如果需要）

如果在控制台看到错误：
```
The query requires an index
```

### 解决方法：
1. 点击控制台中的链接，会自动跳转到 Firebase Console
2. 点击 "创建索引" 按钮
3. 等待几分钟让索引创建完成

### 或者手动创建索引：
Firebase Console → Firestore → Indexes → Create Index

**集合**: `scores`
**字段**:
- `userName` (Ascending)
- `timestamp` (Descending)

**查询范围**: Collection

---

## 📊 数据结构示例

### scores 集合中的文档
```javascript
// 文档 ID: 自动生成 (例如: abc123xyz)
{
  userName: "張三",
  score: 85,
  timestamp: Timestamp(2024, 1, 15, 14, 30, 25)
}

// 另一笔记录
{
  userName: "張三",
  score: 92,
  timestamp: Timestamp(2024, 1, 14, 10, 15, 30)
}

// 其他用户的记录
{
  userName: "李四",
  score: 78,
  timestamp: Timestamp(2024, 1, 15, 16, 45, 12)
}
```

### 查询逻辑
```javascript
// 只显示当前用户（張三）的成绩
query(
  collection(db, "scores"),
  where("userName", "==", "張三"),
  orderBy("timestamp", "desc")
)

// 结果（按时间降序）：
// No.1  85 分  2024/1/15 14:30:25
// No.2  92 分  2024/1/14 10:15:30
```

---

## ⚠️ 常见问题排查

### 问题 1: 成绩没有保存
**检查**:
1. 控制台是否有错误？
2. Firestore Rules 是否允许写入？
3. 用户是否已登录？

### 问题 2: Permission Denied
**原因**: Firestore Rules 设置问题
**解决**: 检查并更新 Rules（见上面的推荐规则）

### 问题 3: 历史成绩页面没有显示
**检查**:
1. `window.currentUserName` 是否有值？
2. Firestore 中是否有对应的数据？
3. `userName` 字段是否完全匹配？

### 问题 4: 索引错误
**解决**: 按照上面的索引设置步骤创建索引

---

## 🎯 快速验证命令

在浏览器控制台执行：

```javascript
// 1. 检查用户名
console.log("当前用户名:", window.currentUserName);

// 2. 手动保存测试成绩
if (window.saveWrittenExamScore) {
    window.saveWrittenExamScore(window.currentUserName || "测试用户", 88)
        .then(success => {
            console.log("手动保存结果:", success ? "✅ 成功" : "❌ 失败");
        });
} else {
    console.error("❌ saveWrittenExamScore 函数不存在");
}

// 3. 查看现有成绩（需要等待上面保存完成）
setTimeout(async () => {
    const { getFirestore, collection, query, where, orderBy, getDocs } = 
        await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    const db = getFirestore();
    const q = query(
        collection(db, "scores"),
        where("userName", "==", window.currentUserName),
        orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    console.log("我的成绩数量:", snapshot.size);
    snapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`No.${index + 1}`, data.score, "分", data.timestamp?.toDate());
    });
}, 2000);
```

---

## 📝 检查清单

完成测试后，请确认：

- [ ] Firestore 有 `scores` 集合
- [ ] Firestore Rules 已正确设置
- [ ] 完成笔试后，控制台显示成功消息
- [ ] Firestore 中有新的成绩记录
- [ ] 历史成绩页面能正确显示
- [ ] 成绩按时间降序排列
- [ ] 显示为 No.1, No.2, No.3... 格式

---

**系统已准备就绪！请按照上述步骤进行测试。** 🚀

如果遇到任何问题，请提供完整的控制台输出和错误信息！
