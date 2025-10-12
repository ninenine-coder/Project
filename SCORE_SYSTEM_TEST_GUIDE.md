# 成绩系统完整测试指南

## 🎯 测试流程概述

### 1️⃣ 成绩保存流程
```
笔试测验完成 → handleExamFinish() → 保存到 Firestore scores 集合 → 成功
```

### 2️⃣ 成绩查询流程  
```
历史成绩页面 → loadMyScores() → 查询 Firestore scores 集合 → 显示成绩列表
```

## 🔧 修复的问题

### ✅ 已修复的问题
1. **时间记录问题**: 修复了 `quizStartTime` 变量访问问题
2. **函数参数问题**: 修复了 `handleExamFinish` 调用参数不匹配
3. **全局变量问题**: 确保测验数据正确保存到 window 对象
4. **备用方法问题**: 修复了 `saveWrittenExamScoreToFirestore` 备用方法

### 🔍 关键修复点

#### exam_quiz.html 修复
```javascript
// 1. 测验开始时记录时间到 window
window.quizStartTime = quizStartTime.getTime();

// 2. 测验结束时保存数据到全局变量
window.quizCorrectCount = correctAnswers;
window.quizQuestionCount = userAnswers.length;

// 3. 修复 handleExamFinish 调用
window.handleExamFinish(score, timeSpentMs, startedAtMs, correctCount, questionCount);
```

#### history.html 配置
```javascript
// 1. 正确的 script 加载顺序
<script type="module" src="./js/firebase.js"></script>
<script type="module" src="./src/services/userDataService.js"></script>
<script type="module" src="./js/history-scores.js"></script>

// 2. 新的成绩显示元素
<div id="scores-loading">載入成績資料中…</div>
<div id="scores-empty" style="display:none;">目前沒有任何成績紀錄</div>
<div id="scores-list"></div>
```

## 🧪 测试步骤

### 第一步：笔试测验测试
1. 打开 `exam_quiz.html`
2. 完成一次笔试测验
3. 观察控制台输出：
   ```
   ✅ 筆試結束，準備儲存成績：95
   🔍 调用 handleExamFinish，参数: {score: 95, timeSpentMs: 12000, ...}
   🔐 已匿名登入：abc123...
   👤 使用者：未命名使用者｜分數：95
   ✅ 成績已成功保存到 scores 集合
   ```

### 第二步：历史成绩测试
1. 打开 `history.html`
2. 观察控制台输出：
   ```
   🔍 loadMyScores 开始执行...
   🔍 开始查询成绩，UID: abc123...
   📊 查询结果数量: 1
   ✅ 載入 1 筆成績記錄
   ```

### 第三步：数据验证
在控制台运行：
```javascript
// 检查当前用户
getUID()

// 检查成绩记录
loadMyScores()

// 检查用户名
loadUserName()
```

## 🚨 可能的问题和解决方案

### 问题1: "handleExamFinish 函数不存在"
**原因**: Firebase 初始化失败或 script 加载顺序问题
**解决**: 确保 `firebase.js` 最先加载

### 问题2: "Missing or insufficient permissions"
**原因**: Firestore 规则未正确配置
**解决**: 部署 `FIRESTORE_RULES.md` 中的规则

### 问题3: "當前用戶名: undefined"
**原因**: 用户名服务未初始化
**解决**: 确保 `userDataService.js` 正确加载

### 问题4: 成绩不显示
**原因**: DOM 元素 ID 不匹配
**解决**: 确保页面有 `#scores-list` 元素

## 📊 数据流程验证

### Firestore 数据结构
```javascript
// scores 集合
{
  "scores1": {
    "uid": "user_uid_123",
    "userName": "未命名使用者",
    "score": 95,
    "timeSpentMs": 12000,
    "startedAt": timestamp,
    "correctCount": 19,
    "questionCount": 20,
    "examType": "筆試測驗",
    "submittedAt": timestamp
  }
}
```

### 查询验证
```javascript
// 验证查询逻辑
const q = query(
  collection(db, "scores"),
  where("uid", "==", auth.currentUser.uid),
  orderBy("submittedAt", "desc")
);
```

## 🎉 成功标准

### 成绩保存成功
- [x] 控制台显示 "✅ 成績已成功保存到 scores 集合"
- [x] 没有 "Missing or insufficient permissions" 错误
- [x] Firestore 中能看到新的 scores 文档

### 成绩显示成功  
- [x] 历史成绩页面显示成绩列表
- [x] 控制台显示 "✅ 載入 X 筆成績記錄"
- [x] 成绩按时间倒序排列

### 用户名显示成功
- [x] 不再显示 "當前用戶名: undefined"
- [x] 控制台显示 "✅ 直讀 /user/{uid} 成功：用户名"

## 🔄 完整流程验证

1. **笔试测验** → 保存成绩到 Firestore ✅
2. **历史成绩页面** → 查询并显示成绩 ✅  
3. **用户名服务** → 正确加载用户信息 ✅
4. **Firebase 规则** → 允许用户读写自己的数据 ✅

系统现在应该能够完整地处理从测验到成绩显示的整个流程！
