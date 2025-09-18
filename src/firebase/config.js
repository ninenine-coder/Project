import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase配置 - 請替換為您的Firebase專案配置
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}

// 初始化Firebase
const app = initializeApp(firebaseConfig)

// 初始化Firebase服務
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
