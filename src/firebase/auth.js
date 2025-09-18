import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from './config'

// Google登入提供者
const googleProvider = new GoogleAuthProvider()

// 電子郵件登入
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 電子郵件註冊
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Google登入
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 登出
export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 監聽認證狀態變化
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// 獲取當前用戶
export const getCurrentUser = () => {
  return auth.currentUser
}
