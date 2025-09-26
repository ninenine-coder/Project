import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase配置 - 請替換為您的Firebase專案配置
const firebaseConfig = {
  apiKey: "AIzaSyBuWO8hFVjjTUe2tqJDrqdbeGTrp4PoT5Q",
  authDomain: "progect-115a5.firebaseapp.com",
  projectId: "progect-115a5",
  storageBucket: "progect-115a5.appspot.com",
  messagingSenderId: "109099222287",
  appId: "1:109099222287:web:your-app-id"
}

// 初始化Firebase
const app = initializeApp(firebaseConfig)

// 初始化Firebase服務
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
