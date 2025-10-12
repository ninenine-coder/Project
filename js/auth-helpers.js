// js/auth-helpers.js - 共用的认证辅助函数
import { ensureSignedIn } from './ensureSignedIn.js';

/**
 * 获取当前用户的学号/工号
 * @returns {string|null} 学号/工号或 null
 */
export function getUserKey() {
  try {
    const p = JSON.parse(localStorage.getItem('pbls_user_profile') || 'null');
    // 依你專案的欄位順序取值
    return p?.学号 || p?.工号 || p?.name || p?.studentId || null;
  } catch { 
    return null; 
  }
}

// 重新导出 ensureSignedIn，保持向后兼容
export { ensureSignedIn };

// 暴露到 window 供调试
window.getUserKey = getUserKey;
window.ensureSignedIn = ensureSignedIn;
