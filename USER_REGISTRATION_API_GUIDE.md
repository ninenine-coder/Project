# 用戶註冊 API 使用指南

## 📋 概述

本系統提供統一的用戶註冊和登入API，所有註冊數據都會寫入Firestore資料庫的`user`集合中。系統包含完整的數據驗證、錯誤處理和安全性檢查。

## 🏗️ 系統架構

```
src/
├── services/
│   └── userRegistrationService.js    # 主要API服務
├── utils/
│   └── validationUtils.js            # 數據驗證工具
└── ...

HTML頁面:
├── login.html                        # 登入/註冊頁面
├── register.html                     # 獨立註冊頁面
└── test-firestore-integration.html   # 測試頁面
```

## 🔧 API 服務

### 導入服務

```javascript
import { userRegistrationService } from './src/services/userRegistrationService.js';
```

### 主要方法

#### 1. 用戶註冊

```javascript
const result = await userRegistrationService.registerUser(userData);
```

**參數：**
```javascript
const userData = {
    email: "user@example.com",        // 電子郵件（必填）
    password: "Password123",          // 密碼（必填，需符合強度要求）
    name: "張三",                     // 姓名（必填，最多20字）
    studentId: "S1234567",           // 學號/工號（必填，作為文檔ID）
    unit: "長庚大學",                 // 單位（必填）
    department: "資管系",             // 系所/部門（必填）
    phone: "0912-345-678"            // 電話（選填）
};
```

**回應格式：**
```javascript
// 成功
{
    success: true,
    message: "註冊成功！",
    data: {
        studentId: "S1234567",
        account: "user@example.com",
        name: "張三",
        department: "資管系",
        school: "長庚大學"
    },
    timestamp: "2024-01-01T00:00:00.000Z"
}

// 失敗
{
    success: false,
    error: "此學號/工號已存在，請更換",
    code: "STUDENT_ID_EXISTS",
    details: null,
    timestamp: "2024-01-01T00:00:00.000Z"
}
```

#### 2. 用戶登入

```javascript
const result = await userRegistrationService.loginUser(account, password);
```

**參數：**
- `account`: 電子郵件帳號
- `password`: 密碼

**回應格式：**
```javascript
// 成功
{
    success: true,
    message: "登入成功",
    data: {
        uid: "S1234567",
        email: "user@example.com",
        name: "張三",
        displayName: "張三",
        photoURL: "https://via.placeholder.com/40/17a2b8/ffffff?text=張",
        loginTime: "2024-01-01T00:00:00.000Z",
        loginMethod: "firebase",
        where: "長庚大學",
        department: "資管系",
        phone: "0912-345-678"
    },
    timestamp: "2024-01-01T00:00:00.000Z"
}
```

#### 3. 獲取用戶資料

```javascript
const result = await userRegistrationService.getUserData(studentId);
```

#### 4. 獲取所有用戶

```javascript
const result = await userRegistrationService.getAllUsers(unit); // unit為可選參數
```

#### 5. 更新用戶資料

```javascript
const result = await userRegistrationService.updateUserData(studentId, updateData);
```

## 📊 Firestore 數據結構

### 集合：`user`
### 文檔ID：學號/工號

```javascript
{
    // 基本資訊
    account: "user@example.com",           // 登入帳號（電子郵件）
    password: "Password123",               // 密碼（明文，示範用）
    "姓名": "張三",                        // 中文姓名
    studentId: "S1234567",                // 學號/工號
    
    // 單位資訊
    department: "資管系",                  // 系所/部門
    "school/hospital": "長庚大學",         // 學校/醫院
    
    // 聯絡資訊
    phone: "0912-345-678",                // 連絡電話（選填）
    
    // 系統資訊
    createdAt: Timestamp,                  // 註冊時間
    isActive: true,                        // 帳號狀態
    lastLogin: Timestamp                   // 最後登入時間
}
```

## ✅ 數據驗證規則

### 電子郵件
- 必須符合標準電子郵件格式
- 不能為空

### 密碼
- 至少8個字元
- 包含至少一個大寫字母
- 包含至少一個小寫字母
- 包含至少一個數字

### 姓名
- 2-20個字元
- 只能包含中文、英文和空格

### 學號/工號
- 3-20個字元
- 字母開頭，後跟字母或數字
- 作為文檔ID，必須唯一

### 電話
- 選填欄位
- 支援多種格式（數字、連字號、括號、空格）
- 8-15個數字

## 🚨 錯誤處理

### 錯誤代碼

| 代碼 | 說明 |
|------|------|
| `VALIDATION_ERROR` | 數據驗證失敗 |
| `STUDENT_ID_EXISTS` | 學號/工號已存在 |
| `ACCOUNT_EXISTS` | 帳號已存在 |
| `MISSING_CREDENTIALS` | 缺少登入憑證 |
| `INVALID_CREDENTIALS` | 登入憑證錯誤 |
| `REGISTRATION_ERROR` | 註冊過程錯誤 |
| `LOGIN_ERROR` | 登入過程錯誤 |

### 錯誤處理範例

```javascript
try {
    const result = await userRegistrationService.registerUser(userData);
    
    if (result.success) {
        console.log('註冊成功:', result.data);
    } else {
        console.error('註冊失敗:', result.error);
        
        // 處理特定錯誤
        if (result.code === 'STUDENT_ID_EXISTS') {
            alert('此學號已被使用，請更換');
        } else if (result.code === 'VALIDATION_ERROR') {
            // 顯示驗證錯誤詳情
            result.details.forEach(error => {
                console.error('驗證錯誤:', error);
            });
        }
    }
} catch (error) {
    console.error('系統錯誤:', error);
}
```

## 🧪 測試

### 使用測試頁面

1. 開啟 `test-firestore-integration.html`
2. 測試用戶註冊功能
3. 測試用戶登入功能
4. 測試數據查詢功能
5. 檢查系統狀態

### 測試數據範例

```javascript
const testUser = {
    email: "test@example.com",
    password: "TestPassword123",
    name: "測試用戶",
    studentId: "T1234567",
    unit: "長庚大學",
    department: "測試系所",
    phone: "0912-345-678"
};
```

## 🔒 安全性注意事項

1. **密碼存儲**：目前使用明文存儲，生產環境建議使用Firebase Auth或密碼雜湊
2. **數據驗證**：所有輸入數據都會進行嚴格驗證
3. **唯一性檢查**：學號/工號和帳號都會檢查唯一性
4. **錯誤處理**：不會洩露敏感信息給前端

## 📱 使用範例

### 在HTML頁面中使用

```html
<script type="module">
    import { userRegistrationService } from './src/services/userRegistrationService.js';
    
    // 註冊用戶
    async function registerUser() {
        const userData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value,
            studentId: document.getElementById('studentId').value,
            unit: document.getElementById('unit').value,
            department: document.getElementById('department').value,
            phone: document.getElementById('phone').value
        };
        
        const result = await userRegistrationService.registerUser(userData);
        
        if (result.success) {
            alert('註冊成功！');
            // 跳轉到登入頁面
        } else {
            alert('註冊失敗：' + result.error);
        }
    }
</script>
```

## 🔄 更新日誌

- **v1.0.0** - 初始版本，基本註冊和登入功能
- **v1.1.0** - 添加完整的數據驗證
- **v1.2.0** - 添加錯誤處理機制
- **v1.3.0** - 添加測試頁面和文檔

## 📞 支援

如有問題或建議，請聯繫開發團隊或查看相關文檔。

---

**Firebase 專案ID**: `progect-115a5`  
**Firestore 集合**: `user`  
**狀態**: ✅ 已配置完成並可正常使用
