# Firestore 資料庫結構說明

## 📊 用戶資料結構

### 集合名稱：`user`
### 文檔ID：`學號/工號`（例如：S1234567、E7654321）

```javascript
{
  // 基本資訊
  account: "user@example.com",           // 登入帳號（電子郵件）
  password: "Password123",               // 密碼（明文，示範用）
  "姓名": "張三",                        // 中文姓名
  studentId: "S1234567",                // 學號/工號
  
  // 單位資訊
  unit: "長庚大學",                      // 所屬單位
  department: "資管系",                  // 系所/部門
  
  // 聯絡資訊
  phone: "0912-345-678",                // 連絡電話（選填，可為null）
  
  // 系統資訊
  createdAt: Timestamp,                  // 註冊時間（伺服器時間戳）
  isActive: true,                        // 帳號狀態（true=啟用，false=停用）
  lastLogin: null                        // 最後登入時間（首次為null）
}
```

## 🔧 API 寫入流程

### 1. 資料收集
- 前端表單收集所有用戶輸入
- 即時驗證資料格式和完整性
- 檢查必填欄位和格式要求

### 2. 資料驗證
- 電子郵件格式驗證
- 密碼強度驗證（大小寫英文+數字，至少8碼）
- 姓名長度限制（20字以內）
- 電話格式驗證（選填）
- 學號/工號唯一性檢查

### 3. Firestore 寫入
```javascript
// 檢查文檔是否已存在
const docRef = doc(db, "user", studentId);
const snap = await getDoc(docRef);

if (snap.exists()) {
  // 學號/工號已存在，拒絕註冊
  throw new Error('此學號/工號已存在');
}

// 寫入用戶資料
await setDoc(docRef, userData);
```

## 📋 資料欄位說明

### 必填欄位
- `account`：登入帳號（電子郵件格式）
- `password`：密碼（需符合強度要求）
- `姓名`：中文姓名（限制20字以內）
- `studentId`：學號/工號（作為文檔ID，需唯一）
- `unit`：所屬單位（從下拉選單選擇）
- `department`：系所/部門（根據單位動態選擇）

### 選填欄位
- `phone`：連絡電話（可為空）

### 系統欄位
- `createdAt`：註冊時間（自動生成）
- `isActive`：帳號狀態（預設為true）
- `lastLogin`：最後登入時間（首次為null）

## 🎯 單位和系所/部門對應

### 長庚大學
- 醫學系、中醫學系、護理學系、醫學生物技術暨檢驗學系
- 醫學影像暨放射科學系、物理治療學系、職能治療學系
- 呼吸治療學系、生物醫學系、資管系
- 臨床醫學研究所、生物醫學研究所、顱顏口腔醫學研究所
- 早期療育研究所、免疫轉譯醫學研究所

### 長庚科大
- 護理系、保健營養系、高齡暨健康照護管理系

### 長庚醫院
- 內科、外科、婦產科、小兒科、耳鼻喉科、眼科、皮膚科
- 神經內科、神經外科、骨科、泌尿科、心臟內科、心臟血管外科
- 腫瘤科、放射腫瘤科、腸胃科、肝膽科、腎臟科、血液腫瘤科
- 呼吸胸腔科、過敏風濕免疫科、感染科、麻醉科、復健科
- 核子醫學科、精神科、放射科、病理科、胸腔外科、家醫科、急診科

## 🔍 資料查詢範例

### 根據帳號查詢用戶
```javascript
const q = query(
  collection(db, "user"),
  where("account", "==", "user@example.com")
);
const querySnapshot = await getDocs(q);
```

### 根據單位查詢用戶
```javascript
const q = query(
  collection(db, "user"),
  where("unit", "==", "長庚大學")
);
const querySnapshot = await getDocs(q);
```

### 根據系所查詢用戶
```javascript
const q = query(
  collection(db, "user"),
  where("department", "==", "資管系")
);
const querySnapshot = await getDocs(q);
```

## 🚀 使用流程

1. **用戶註冊**：填寫完整資料並提交
2. **資料驗證**：前端即時驗證和格式檢查
3. **唯一性檢查**：確認學號/工號未被使用
4. **Firestore寫入**：所有資料寫入雲端資料庫
5. **成功回饋**：顯示註冊成功並提供返回登入頁面

---

**資料庫**：Firestore
**集合**：user
**文檔ID**：學號/工號
**狀態**：✅ 已配置完成
