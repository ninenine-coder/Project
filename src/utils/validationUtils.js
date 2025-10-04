/**
 * 數據驗證工具類
 * 提供統一的數據驗證和錯誤處理機制
 */

export class ValidationUtils {
  /**
   * 驗證電子郵件格式
   * @param {string} email - 電子郵件
   * @returns {boolean} 是否有效
   */
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * 驗證密碼強度
   * @param {string} password - 密碼
   * @returns {Object} 驗證結果
   */
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return {
        isValid: false,
        errors: ['密碼不能為空']
      };
    }

    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasUpperCase) {
      errors.push('密碼需包含至少一個大寫字母');
    }
    if (!hasLowerCase) {
      errors.push('密碼需包含至少一個小寫字母');
    }
    if (!hasNumbers) {
      errors.push('密碼需包含至少一個數字');
    }
    if (!hasMinLength) {
      errors.push('密碼至少需要8個字元');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * 計算密碼強度
   * @param {string} password - 密碼
   * @returns {number} 強度分數 (0-100)
   */
  static calculatePasswordStrength(password) {
    let score = 0;
    
    // 長度分數
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // 字符類型分數
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[^a-zA-Z\d]/.test(password)) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * 驗證電話號碼格式
   * @param {string} phone - 電話號碼
   * @returns {boolean} 是否有效
   */
  static isValidPhone(phone) {
    if (!phone) return true; // 電話是選填的
    if (typeof phone !== 'string') return false;
    
    // 支援多種電話格式
    const phoneRegex = /^[\d\-\s\(\)\+]+$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    return phoneRegex.test(phone) && cleanPhone.length >= 8 && cleanPhone.length <= 15;
  }

  /**
   * 驗證姓名格式
   * @param {string} name - 姓名
   * @returns {Object} 驗證結果
   */
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      return {
        isValid: false,
        errors: ['姓名不能為空']
      };
    }

    const trimmedName = name.trim();
    const errors = [];

    if (trimmedName.length === 0) {
      errors.push('姓名不能為空');
    } else if (trimmedName.length > 20) {
      errors.push('姓名不能超過20個字元');
    } else if (trimmedName.length < 2) {
      errors.push('姓名至少需要2個字元');
    }

    // 檢查是否包含特殊字符
    if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(trimmedName)) {
      errors.push('姓名只能包含中文、英文和空格');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 驗證學號/工號格式
   * @param {string} studentId - 學號/工號
   * @returns {Object} 驗證結果
   */
  static validateStudentId(studentId) {
    if (!studentId || typeof studentId !== 'string') {
      return {
        isValid: false,
        errors: ['學號/工號不能為空']
      };
    }

    const trimmedId = studentId.trim().toUpperCase();
    const errors = [];

    if (trimmedId.length === 0) {
      errors.push('學號/工號不能為空');
    } else if (trimmedId.length < 3) {
      errors.push('學號/工號至少需要3個字元');
    } else if (trimmedId.length > 20) {
      errors.push('學號/工號不能超過20個字元');
    }

    // 檢查格式（字母開頭，後跟數字）
    if (!/^[A-Z][A-Z0-9]*$/.test(trimmedId)) {
      errors.push('學號/工號格式不正確（應為字母開頭，後跟字母或數字）');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      normalizedId: trimmedId
    };
  }

  /**
   * 驗證必填欄位
   * @param {Object} data - 數據對象
   * @param {Array} requiredFields - 必填欄位列表
   * @returns {Object} 驗證結果
   */
  static validateRequiredFields(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim().length === 0)) {
        errors.push(`${field} 為必填欄位`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 清理和標準化數據
   * @param {Object} data - 原始數據
   * @returns {Object} 清理後的數據
   */
  static sanitizeData(data) {
    const sanitized = {};
    
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        sanitized[key] = data[key].trim();
      } else {
        sanitized[key] = data[key];
      }
    });

    return sanitized;
  }

  /**
   * 綜合驗證用戶註冊數據
   * @param {Object} userData - 用戶數據
   * @returns {Object} 驗證結果
   */
  static validateUserRegistrationData(userData) {
    const errors = [];
    const warnings = [];

    // 清理數據
    const cleanData = this.sanitizeData(userData);

    // 驗證必填欄位
    const requiredFields = ['account', 'password', 'name', 'studentId', 'department', 'school'];
    const requiredValidation = this.validateRequiredFields(cleanData, requiredFields);
    if (!requiredValidation.isValid) {
      errors.push(...requiredValidation.errors);
    }

    // 驗證電子郵件
    if (cleanData.account && !this.isValidEmail(cleanData.account)) {
      errors.push('帳號必須是有效的電子郵件格式');
    }

    // 驗證密碼
    if (cleanData.password) {
      const passwordValidation = this.validatePassword(cleanData.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
      if (passwordValidation.strength < 50) {
        warnings.push('密碼強度較弱，建議使用更複雜的密碼');
      }
    }

    // 驗證姓名
    if (cleanData.name) {
      const nameValidation = this.validateName(cleanData.name);
      if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors);
      }
    }

    // 驗證學號/工號
    if (cleanData.studentId) {
      const studentIdValidation = this.validateStudentId(cleanData.studentId);
      if (!studentIdValidation.isValid) {
        errors.push(...studentIdValidation.errors);
      }
    }

    // 驗證電話（選填）
    if (cleanData.phone && !this.isValidPhone(cleanData.phone)) {
      errors.push('電話格式不正確');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      warnings: warnings,
      sanitizedData: cleanData
    };
  }
}

/**
 * 錯誤處理工具類
 */
export class ErrorHandler {
  /**
   * 格式化錯誤訊息
   * @param {Error|string} error - 錯誤對象或訊息
   * @returns {string} 格式化的錯誤訊息
   */
  static formatError(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === 'object') {
      if (error.message) {
        return error.message;
      }
      if (error.code) {
        return `錯誤代碼: ${error.code}`;
      }
    }

    return '發生未知錯誤';
  }

  /**
   * 處理Firebase錯誤
   * @param {Error} error - Firebase錯誤
   * @returns {string} 用戶友好的錯誤訊息
   */
  static handleFirebaseError(error) {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '此電子郵件已被使用';
      case 'auth/weak-password':
        return '密碼強度不足';
      case 'auth/invalid-email':
        return '電子郵件格式不正確';
      case 'auth/user-not-found':
        return '找不到此用戶';
      case 'auth/wrong-password':
        return '密碼錯誤';
      case 'auth/too-many-requests':
        return '嘗試次數過多，請稍後再試';
      case 'permission-denied':
        return '權限不足';
      case 'unavailable':
        return '服務暫時不可用，請稍後再試';
      case 'deadline-exceeded':
        return '操作超時，請重試';
      default:
        return this.formatError(error);
    }
  }

  /**
   * 記錄錯誤到控制台
   * @param {string} context - 錯誤上下文
   * @param {Error|string} error - 錯誤對象或訊息
   * @param {Object} additionalData - 額外數據
   */
  static logError(context, error, additionalData = {}) {
    console.error(`❌ ${context}:`, {
      error: this.formatError(error),
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }

  /**
   * 創建標準化的錯誤回應
   * @param {string} message - 錯誤訊息
   * @param {string} code - 錯誤代碼
   * @param {Object} details - 詳細信息
   * @returns {Object} 標準化錯誤回應
   */
  static createErrorResponse(message, code = null, details = null) {
    return {
      success: false,
      error: message,
      code: code,
      details: details,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 創建標準化的成功回應
   * @param {string} message - 成功訊息
   * @param {Object} data - 回應數據
   * @returns {Object} 標準化成功回應
   */
  static createSuccessResponse(message, data = null) {
    return {
      success: true,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    };
  }
}

export default {
  ValidationUtils,
  ErrorHandler
};
