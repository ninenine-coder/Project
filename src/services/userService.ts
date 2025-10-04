import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
  quizResults?: QuizResult[];
  learningProgress?: LearningProgress;
}

export interface QuizResult {
  id: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeUsed: number; // 秒
  completedAt: any;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface LearningProgress {
  completedModules: string[];
  currentModule: string;
  totalTimeSpent: number; // 分鐘
  lastActivityAt: any;
}

// 創建或更新用戶資料
export const createOrUpdateUserProfile = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const userData: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || '用戶',
      photoURL: user.photoURL || '',
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };

    if (!userSnap.exists()) {
      // 新用戶，創建資料
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
    } else {
      // 現有用戶，更新資料
      await updateDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// 獲取用戶資料
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// 保存測驗結果
export const saveQuizResult = async (uid: string, quizResult: Omit<QuizResult, 'id'>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const results = userData.quizResults || [];
      
      // 生成唯一ID
      const resultId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 添加新結果
      results.push({
        ...quizResult,
        id: resultId
      });
      
      // 只保留最近50次測驗結果
      const recentResults = results.slice(-50);
      
      await updateDoc(userRef, {
        quizResults: recentResults,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

// 更新學習進度
export const updateLearningProgress = async (
  uid: string, 
  progress: Partial<LearningProgress>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentProgress = userData.learningProgress || {
        completedModules: [],
        currentModule: '',
        totalTimeSpent: 0,
        lastActivityAt: serverTimestamp()
      };
      
      const updatedProgress: LearningProgress = {
        ...currentProgress,
        ...progress,
        lastActivityAt: serverTimestamp()
      };
      
      await updateDoc(userRef, {
        learningProgress: updatedProgress,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating learning progress:', error);
    throw error;
  }
};

// 獲取用戶測驗結果
export const getUserQuizResults = async (uid: string): Promise<QuizResult[]> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.quizResults || [];
  } catch (error) {
    console.error('Error getting user quiz results:', error);
    throw error;
  }
};

// 獲取用戶學習進度
export const getUserLearningProgress = async (uid: string): Promise<LearningProgress | null> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.learningProgress || null;
  } catch (error) {
    console.error('Error getting user learning progress:', error);
    throw error;
  }
};
