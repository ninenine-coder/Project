// js/ensureSignedIn.js - 确保用户已登录的辅助函数
import { auth, authReady } from './firebase.js';
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

/**
 * 确保用户已登录（匿名或正式）
 * 1. 等待 SDK 从 IndexedDB 还原上次的用户
 * 2. 若没有用户，再做一次匿名登录
 * @returns {Promise<User>} Firebase User 对象
 */
export async function ensureSignedIn() {
  await authReady; // 等還原
  if (auth.currentUser) {
    console.log("✅ 用户已登录:", auth.currentUser.isAnonymous ? "匿名-" + auth.currentUser.uid : auth.currentUser.email || auth.currentUser.uid);
    return auth.currentUser;
  }
  console.log("🔐 未检测到登录状态，执行匿名登录...");
  const { user } = await signInAnonymously(auth);
  console.log("✅ 匿名登录成功:", user.uid);
  return user;
}

// 暴露到 window 供调试
window.ensureSignedIn = ensureSignedIn;

