/**
 * 用戶數據結構定義
 * 定義所有用戶字段的預設值和驗證規則
 */

// 用戶數據結構定義
export const USER_SCHEMA = {
    // 基本資料
    uid: {
        type: 'string',
        required: true,
        description: '用戶唯一識別碼'
    },
    email: {
        type: 'string',
        required: true,
        description: '電子郵件地址'
    },
    name: {
        type: 'string',
        default: '',
        description: '用戶姓名'
    },
    displayName: {
        type: 'string',
        default: '',
        description: '顯示名稱'
    },
    department: {
        type: 'string',
        default: '',
        description: '系所/部門'
    },
    phone: {
        type: 'string',
        default: '',
        description: '電話號碼'
    },
    studentId: {
        type: 'string',
        default: '',
        description: '學號/員工編號'
    },
    where: {
        type: 'string',
        default: '',
        description: '學校/醫院/單位'
    },
    school: {
        type: 'string',
        default: '',
        description: '學校名稱'
    },
    
    // 統計資料
    totaltesttimes: {
        type: 'number',
        default: 0,
        description: '總測驗次數'
    },
    totalTimeSpent: {
        type: 'number',
        default: 0,
        description: '總練習時間（秒）'
    },
    averageScore: {
        type: 'number',
        default: 0,
        description: '平均分數'
    },
    bestScore: {
        type: 'number',
        default: 0,
        description: '最佳成績'
    },
    
    // 系統資料
    createdAt: {
        type: 'timestamp',
        required: true,
        description: '創建時間'
    },
    updatedAt: {
        type: 'timestamp',
        required: true,
        description: '最後更新時間'
    },
    lastLogin: {
        type: 'timestamp',
        default: null,
        description: '最後登入時間'
    },
    lastQuizDate: {
        type: 'timestamp',
        default: null,
        description: '最後測驗時間'
    },
    isActive: {
        type: 'boolean',
        default: true,
        description: '帳戶是否啟用'
    },
    
    // 學習進度
    learningProgress: {
        type: 'object',
        default: {
            completedModules: [],
            currentModule: '',
            totalTimeSpent: 0,
            lastActivityAt: null
        },
        description: '學習進度'
    },
    
    // 偏好設定
    preferences: {
        type: 'object',
        default: {
            language: 'zh-TW',
            theme: 'light',
            notifications: true,
            autoSave: true
        },
        description: '用戶偏好設定'
    }
};

// 獲取字段預設值
export function getFieldDefault(fieldName) {
    const field = USER_SCHEMA[fieldName];
    if (!field) {
        console.warn(`字段 ${fieldName} 不存在於用戶結構定義中`);
        return null;
    }
    return field.default;
}

// 獲取所有預設值
export function getAllDefaults() {
    const defaults = {};
    Object.keys(USER_SCHEMA).forEach(fieldName => {
        const field = USER_SCHEMA[fieldName];
        if (field.default !== undefined) {
            defaults[fieldName] = field.default;
        }
    });
    return defaults;
}

// 驗證字段值
export function validateField(fieldName, value) {
    const field = USER_SCHEMA[fieldName];
    if (!field) {
        return { valid: false, error: `字段 ${fieldName} 不存在` };
    }
    
    if (field.required && (value === null || value === undefined || value === '')) {
        return { valid: false, error: `字段 ${fieldName} 是必填的` };
    }
    
    if (value !== null && value !== undefined) {
        switch (field.type) {
            case 'string':
                if (typeof value !== 'string') {
                    return { valid: false, error: `字段 ${fieldName} 必須是字符串` };
                }
                break;
            case 'number':
                if (typeof value !== 'number' || isNaN(value)) {
                    return { valid: false, error: `字段 ${fieldName} 必須是數字` };
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    return { valid: false, error: `字段 ${fieldName} 必須是布林值` };
                }
                break;
            case 'timestamp':
                if (!(value instanceof Date) && typeof value !== 'object') {
                    return { valid: false, error: `字段 ${fieldName} 必須是時間戳` };
                }
                break;
            case 'object':
                if (typeof value !== 'object' || Array.isArray(value)) {
                    return { valid: false, error: `字段 ${fieldName} 必須是對象` };
                }
                break;
        }
    }
    
    return { valid: true };
}

// 驗證整個用戶對象
export function validateUserData(userData) {
    const errors = [];
    const warnings = [];
    
    Object.keys(USER_SCHEMA).forEach(fieldName => {
        const field = USER_SCHEMA[fieldName];
        const value = userData[fieldName];
        
        const validation = validateField(fieldName, value);
        if (!validation.valid) {
            if (field.required) {
                errors.push(validation.error);
            } else {
                warnings.push(validation.error);
            }
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// 應用預設值到用戶數據
export function applyDefaults(userData) {
    const result = { ...userData };
    const defaults = getAllDefaults();
    
    Object.keys(defaults).forEach(fieldName => {
        if (result[fieldName] === undefined || result[fieldName] === null) {
            result[fieldName] = defaults[fieldName];
        }
    });
    
    return result;
}

// 獲取字段描述
export function getFieldDescription(fieldName) {
    const field = USER_SCHEMA[fieldName];
    return field ? field.description : '未知字段';
}

// 獲取所有字段列表
export function getAllFields() {
    return Object.keys(USER_SCHEMA);
}

// 獲取必填字段列表
export function getRequiredFields() {
    return Object.keys(USER_SCHEMA).filter(fieldName => 
        USER_SCHEMA[fieldName].required
    );
}

// 獲取可選字段列表
export function getOptionalFields() {
    return Object.keys(USER_SCHEMA).filter(fieldName => 
        !USER_SCHEMA[fieldName].required
    );
}

export default USER_SCHEMA;
