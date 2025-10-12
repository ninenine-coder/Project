# 📊 有序 Scores 系统说明

## ✅ 已实现的功能

### 新的文档 ID 系统
- **之前**: 自动生成的随机 ID (如: `abc123xyz`)
- **现在**: 有序的编号 ID (如: `scores1`, `scores2`, `scores3`...)

---

## 🔄 工作原理

### 1️⃣ 获取下一个序号
```javascript
async function getNextScoreId() {
    // 查询最新的文档
    const q = query(collection(db, "scores"), orderBy(documentId(), "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        return 1; // 第一笔记录
    } else {
        const latestId = snapshot.docs[0].id; // 例如: "scores5"
        const match = latestId.match(/scores(\d+)/); // 提取数字
        return parseInt(match[1]) + 1; // 返回 6
    }
}
```

### 2️⃣ 使用有序 ID 保存
```javascript
async function saveWrittenExamScore(userName, score) {
    const nextScoreId = await getNextScoreId(); // 获取下一个序号
    
    // 使用有序 ID 创建文档
    const docRef = doc(db, "scores", `scores${nextScoreId}`);
    await setDoc(docRef, {
        userName: userName,
        score: score,
        timestamp: serverTimestamp()
    });
}
```

---

## 📋 Firestore 数据结构

### 新的文档结构
```
scores 集合
├── scores1
│   ├── userName: "張三"
│   ├── score: 85
│   └── timestamp: Timestamp
├── scores2
│   ├── userName: "李四"
│   ├── score: 92
│   └── timestamp: Timestamp
├── scores3
│   ├── userName: "張三"
│   ├── score: 78
│   └── timestamp: Timestamp
└── ...
```

---

## 🎯 优势

### 1️⃣ **方便统计测验总数**
- 最新文档的 ID 就是总测验次数
- 例如: `scores15` 表示总共进行了 15 次测验

### 2️⃣ **有序排列**
- 文档按创建时间自然排序
- 容易查找和管理

### 3️⃣ **人类可读**
- ID 格式清晰: `scores1`, `scores2`, `scores3`
- 一目了然知道这是第几次测验

---

## 🔍 调试信息

### 控制台输出示例
```
🔥 Step 7: 下一個序號: 5
🔥 Step 8: 準備寫入的資料: {userName: "張三", score: 85, timestamp: ...}
🔥 Step 9: 目標文檔 ID: scores 5
✅ 筆試成績已儲存成功！Document ID: scores 5
✅ 成功儲存筆試成績：張三 - 85 分
✅ 測驗總數: 5
```

### 第一次保存
```
📊 這是第一筆成績記錄
🔥 Step 7: 下一個序號: 1
✅ 測驗總數: 1
```

### 后续保存
```
📊 最新文檔 ID: scores3
📊 下一個序號: 4
🔥 Step 7: 下一個序號: 4
✅ 測驗總數: 4
```

---

## 🧪 测试方法

### 1️⃣ 手动测试获取序号
```javascript
// 在控制台执行
(async () => {
    const { getFirestore, collection, query, orderBy, limit, getDocs, documentId } = 
        await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    
    const db = getFirestore();
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy(documentId(), "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        console.log("下一个序号: 1 (第一笔记录)");
    } else {
        const latestId = snapshot.docs[0].id;
        console.log("最新文档 ID:", latestId);
        
        const match = latestId.match(/scores(\d+)/);
        if (match) {
            const nextId = parseInt(match[1]) + 1;
            console.log("下一个序号:", nextId);
        }
    }
})();
```

### 2️⃣ 手动测试保存
```javascript
// 手动保存测试成绩
if (window.saveWrittenExamScore && window.currentUserName) {
    window.saveWrittenExamScore(window.currentUserName, 88)
        .then(success => {
            console.log("手动保存结果:", success ? "✅ 成功" : "❌ 失败");
        });
}
```

### 3️⃣ 查看现有文档
```javascript
// 查看所有 scores 文档
(async () => {
    const { getFirestore, collection, getDocs } = 
        await import("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js");
    
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "scores"));
    
    console.log("总测验次数:", snapshot.size);
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`${doc.id}: ${data.userName} - ${data.score} 分`);
    });
})();
```

---

## 📊 统计功能

### 获取总测验次数
```javascript
// 方法 1: 通过文档数量
const snapshot = await getDocs(collection(db, "scores"));
const totalTests = snapshot.size;

// 方法 2: 通过最新文档 ID
const latestDoc = await getLatestScoreDocument();
const totalTests = parseInt(latestDoc.id.replace('scores', ''));
```

### 获取最新测验信息
```javascript
async function getLatestScoreDocument() {
    const q = query(
        collection(db, "scores"), 
        orderBy(documentId(), "desc"), 
        limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0];
}
```

---

## ⚠️ 注意事项

### 1️⃣ **并发问题**
- 如果多个用户同时完成测验，可能会出现序号重复
- 对于小规模使用，这个问题很少发生
- 如果担心，可以考虑使用 Firebase 的 `increment` 功能

### 2️⃣ **迁移现有数据**
- 如果 `scores` 集合已有随机 ID 的文档
- 新系统会从 1 开始编号
- 建议清空现有数据或手动迁移

### 3️⃣ **索引要求**
- 需要在 Firebase Console 创建索引
- 集合: `scores`
- 字段: `__name__` (Document ID)
- 排序: Descending

---

## 🔧 创建索引

### Firebase Console 步骤
1. 打开 Firebase Console → Firestore → Indexes
2. 点击 "Create Index"
3. 设置:
   - **Collection ID**: `scores`
   - **Fields**: 
     - Field: `__name__`, Order: `Descending`
4. 点击 "Create"

---

## 🎯 完整测试流程

### 测试步骤
1. **清空现有 scores 集合**（可选）
2. **完成一次笔试测验**
3. **查看控制台输出**，确认使用了 `scores1`
4. **再次完成测验**，确认使用了 `scores2`
5. **检查 Firebase Console**，确认文档 ID 为 `scores1`, `scores2`
6. **查看历史成绩页面**，确认正常显示

### 预期结果
```
第一次测验:
📊 這是第一筆成績記錄
🔥 Step 7: 下一個序號: 1
✅ Document ID: scores 1

第二次测验:
📊 最新文檔 ID: scores1
📊 下一個序號: 2
🔥 Step 7: 下一個序號: 2
✅ Document ID: scores 2
```

---

**有序 Scores 系统已部署完成！** 🎉

现在每次保存成绩都会使用有序的 ID (`scores1`, `scores2`, `scores3`...)，方便统计和管理测验总数。
