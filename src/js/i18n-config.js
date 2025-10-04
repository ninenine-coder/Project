// i18next 配置和初始化
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯資源
const resources = {
  'zh-TW': {
    translation: {
      "common": {
        "pageTitle": {
          "info": "資訊 - PBLS VR教學平台",
          "practice": "練習專區 - PBLS VR教學平台",
          "exam": "考試專區 - PBLS VR教學平台",
          "history": "歷史成績 - PBLS VR教學平台",
          "team": "團隊 - PBLS VR教學平台",
          "quiz": "筆試測驗 - PBLS VR教學平台"
        },
        "header": {
          "title": "歡迎使用PBLS教學平台",
          "userInfo": "長庚大學, 資管系"
        },
        "marquee": {
          "item1": "🎯 歡迎使用PBLS VR教學平台！",
          "item2": "📚 360°實境教學影片，身臨其境的學習體驗",
          "item3": "🤖 虛擬人互動，提升急救溝通技巧",
          "item4": "🎮 VR實際操作，模擬真實急救情境",
          "item5": "📊 即時成績追蹤，掌握學習進度",
          "item6": "💡 問題導向學習法，提升急救技能"
        },
        "menu": {
          "info": "資訊",
          "practice": "練習專區",
          "exam": "考試專區",
          "history": "歷史成績",
          "team": "團隊"
        },
        "language": {
          "toggle": "EN"
        }
      },
      "info": {
        "hero": {
          "title": "小兒基本生命支持（PBLS）",
          "description": "小兒基本生命支持（PBLS）是專為兒童與嬰幼兒設計的重要急救流程，協助第一時間正確判斷並處理呼吸或心跳驟停的狀況。本平台提供完整的學習資源，涵蓋標準理論基礎、系統化流程操作與多情境模擬，透過圖解說明與互動式演練，幫助學員快速理解並熟練應變步驟，最終目標是讓每位學習者在關鍵時刻都能正確反應，提升急救成功率，守護孩子的生命安全",
          "learnMoreButton": "了解更多"
        },
        "flowchart": {
          "title": "PBLS 流程圖"
        },
        "scenarios": {
          "title": "模擬情境案例",
          "cardiac": {
            "title": "心臟驟停",
            "treatment": "處理措施"
          },
          "poisoning": {
            "title": "食物中毒",
            "treatment": "處理措施"
          },
          "drowning": {
            "title": "溺水",
            "treatment": "處理措施"
          },
          "fire": {
            "title": "火災嗆傷",
            "treatment": "處理措施"
          },
          "trauma": {
            "title": "外傷",
            "treatment": "處理措施"
          }
        },
        "treatmentModal": {
          "title": "處理措施"
        },
        "treatmentData": {
          "cardiac": {
            "title": "心臟驟停處理措施",
            "steps": [
              "立即進行CPR（心肺復甦術）",
              "使用AED進行電擊（50J）",
              "給予腎上腺素",
              "漸進式電擊治療",
              "轉送加護病房"
            ]
          },
          "poisoning": {
            "title": "食物中毒處理措施",
            "steps": [
              "清理呼吸道，確保氣道暢通",
              "使用袋瓣罩進行人工呼吸",
              "進行心肺復甦術",
              "使用AED進行電擊（80J）",
              "給予胺碘酮"
            ]
          },
          "drowning": {
            "title": "溺水處理措施",
            "steps": [
              "抽吸呼吸道中的水分",
              "使用袋瓣罩進行人工呼吸",
              "進行心肺復甦術",
              "使用AED進行電擊（60J）",
              "給予胺碘酮"
            ]
          },
          "fire": {
            "title": "火災嗆傷處理措施",
            "steps": [
              "進行氣管插管並給予氧氣",
              "進行心肺復甦術",
              "使用AED進行電擊（80-100J）",
              "給予腎上腺素"
            ]
          },
          "trauma": {
            "title": "外傷處理措施",
            "steps": [
              "進行止血並建立靜脈輸液",
              "進行心肺復甦術",
              "使用AED進行電擊（70J）",
              "給予腎上腺素"
            ]
          }
        },
        "buttons": {
          "practice": "立即練習模擬",
          "exam": "進入考試測驗"
        }
      },
      "practice": {
        "title": "練習專區",
        "description": "這裡提供 360° 實境教學影片與虛擬人互動學習。",
        "videoSection": {
          "title": "360° 實境教學影片",
          "description": "觀看高品質的360度影片，體驗身臨其境的急救情境"
        },
        "virtualHumanSection": {
          "title": "虛擬人互動",
          "description": "與AI驅動的虛擬患者進行對話練習，提升溝通技巧"
        }
      },
      "quiz": {
        "title": "筆試測驗",
        "description": "20題選擇題，每題5秒鐘的時間作答，請把握寶貴的急救時間，正確做出應對措施",
        "startButton": "開始筆試測驗",
        "exitConfirmation": "尚未完成筆試測驗，若現在離開測驗將不會記錄，確定是否離開？",
        "results": {
          "score": "分",
          "correctAnswers": "答對題數",
          "totalQuestions": "總題數",
          "timeUsed": "用時",
          "details": "測驗詳情",
          "retakeButton": "重新測驗",
          "correct": "正確",
          "incorrect": "錯誤",
          "noAnswer": "未作答",
          "yourAnswer": "您的答案：",
          "explanation": "解釋",
          "correctAnswer": "正確答案"
        }
      },
      "history": {
        "title": "歷史成績",
        "totalAttempts": "總測驗次數",
        "averageScore": "平均分數",
        "bestScore": "最佳成績",
        "lastAttempt": "最後測驗時間",
        "noData": "尚無測驗記錄",
        "loading": "載入中...",
        "error": "載入失敗，請重新整理頁面"
      },
      "team": {
        "title": "團隊介紹",
        "description": "我們的團隊致力於提供最優質的PBLS教學體驗"
      }
    }
  },
  'en': {
    translation: {
      "common": {
        "pageTitle": {
          "info": "Information - PBLS VR Learning Platform",
          "practice": "Practice Area - PBLS VR Learning Platform",
          "exam": "Exam Area - PBLS VR Learning Platform",
          "history": "History Results - PBLS VR Learning Platform",
          "team": "Team - PBLS VR Learning Platform",
          "quiz": "Written Test - PBLS VR Learning Platform"
        },
        "header": {
          "title": "Welcome to PBLS Learning Platform",
          "userInfo": "CGU, Information Management"
        },
        "marquee": {
          "item1": "🎯 Welcome to PBLS VR Learning Platform!",
          "item2": "📚 360° Immersive Teaching Videos for Realistic Learning",
          "item3": "🤖 Virtual Human Interaction to Improve Communication Skills",
          "item4": "🎮 VR Practical Operations Simulating Real Emergency Situations",
          "item5": "📊 Real-time Score Tracking to Monitor Learning Progress",
          "item6": "💡 Problem-Based Learning to Enhance First Aid Skills"
        },
        "menu": {
          "info": "Information",
          "practice": "Practice",
          "exam": "Exam",
          "history": "History",
          "team": "Team"
        },
        "language": {
          "toggle": "中"
        }
      },
      "info": {
        "hero": {
          "title": "Pediatric Basic Life Support (PBLS)",
          "description": "Pediatric Basic Life Support (PBLS) is the essential guideline for rescuing infants and children in cardiac or respiratory arrest. This platform provides systematic training combining theory, process flow, and scenario simulations.",
          "learnMoreButton": "Learn More"
        },
        "flowchart": {
          "title": "PBLS Flowchart"
        },
        "scenarios": {
          "title": "Scenario Simulation Cases",
          "cardiac": {
            "title": "Cardiac Arrest",
            "treatment": "Treatment Measures"
          },
          "poisoning": {
            "title": "Food Poisoning",
            "treatment": "Treatment Measures"
          },
          "drowning": {
            "title": "Drowning",
            "treatment": "Treatment Measures"
          },
          "fire": {
            "title": "Fire Inhalation Injury",
            "treatment": "Treatment Measures"
          },
          "trauma": {
            "title": "Trauma",
            "treatment": "Treatment Measures"
          }
        },
        "treatmentModal": {
          "title": "Treatment Measures"
        },
        "treatmentData": {
          "cardiac": {
            "title": "Cardiac Arrest Treatment Measures",
            "steps": [
              "Immediately perform CPR (Cardiopulmonary Resuscitation)",
              "Use AED for defibrillation (50J)",
              "Administer Epinephrine",
              "Progressive defibrillation treatment",
              "Transfer to ICU"
            ]
          },
          "poisoning": {
            "title": "Food Poisoning Treatment Measures",
            "steps": [
              "Clear airway to ensure patency",
              "Use bag-mask for artificial ventilation",
              "Perform CPR",
              "Use AED for defibrillation (80J)",
              "Administer Amiodarone"
            ]
          },
          "drowning": {
            "title": "Drowning Treatment Measures",
            "steps": [
              "Suction water from airway",
              "Use bag-mask for artificial ventilation",
              "Perform CPR",
              "Use AED for defibrillation (60J)",
              "Administer Amiodarone"
            ]
          },
          "fire": {
            "title": "Fire Inhalation Injury Treatment Measures",
            "steps": [
              "Perform endotracheal intubation and provide oxygen",
              "Perform CPR",
              "Use AED for defibrillation (80-100J)",
              "Administer Epinephrine"
            ]
          },
          "trauma": {
            "title": "Trauma Treatment Measures",
            "steps": [
              "Perform hemostasis and establish IV access",
              "Perform CPR",
              "Use AED for defibrillation (70J)",
              "Administer Epinephrine"
            ]
          }
        },
        "buttons": {
          "practice": "Start Practice Simulation",
          "exam": "Enter Exam Test"
        }
      },
      "practice": {
        "title": "Practice Area",
        "description": "Here we provide 360° immersive teaching videos and virtual human interaction learning.",
        "videoSection": {
          "title": "360° Immersive Teaching Videos",
          "description": "Watch high-quality 360-degree videos and experience immersive first aid scenarios"
        },
        "virtualHumanSection": {
          "title": "Virtual Human Interaction",
          "description": "Practice dialogue with AI-driven virtual patients to improve communication skills"
        }
      },
      "quiz": {
        "title": "Written Test",
        "description": "20 multiple choice questions, 5 seconds per question. Please make the most of your precious first aid time and respond correctly.",
        "startButton": "Start Written Test",
        "exitConfirmation": "The written test is not completed yet. If you leave now, the test will not be recorded. Are you sure you want to leave?",
        "results": {
          "score": "points",
          "correctAnswers": "Correct Answers",
          "totalQuestions": "Total Questions",
          "timeUsed": "Time Used",
          "details": "Test Details",
          "retakeButton": "Retake Test",
          "correct": "Correct",
          "incorrect": "Incorrect",
          "noAnswer": "No Answer",
          "yourAnswer": "Your answer: ",
          "explanation": "Explanation",
          "correctAnswer": "Correct Answer"
        }
      },
      "history": {
        "title": "History Results",
        "totalAttempts": "Total Attempts",
        "averageScore": "Average Score",
        "bestScore": "Best Score",
        "lastAttempt": "Last Attempt Time",
        "noData": "No test records available",
        "loading": "Loading...",
        "error": "Failed to load, please refresh the page"
      },
      "team": {
        "title": "Team Introduction",
        "description": "Our team is committed to providing the best PBLS learning experience"
      }
    }
  }
};

// 初始化 i18next
i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pbls_language'
    },
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

// 語言切換函數
export function setLanguage(language) {
  localStorage.setItem('pbls_language', language);
  return i18next.changeLanguage(language);
}

// 獲取當前語言
export function getCurrentLanguage() {
  return i18next.language || 'zh-TW';
}

// 翻譯函數
export function t(key, options = {}) {
  return i18next.t(key, options);
}

// 等待 i18next 初始化完成
export function waitForI18n() {
  return new Promise((resolve) => {
    if (i18next.isInitialized) {
      resolve();
    } else {
      i18next.on('initialized', resolve);
    }
  });
}

// 導出 i18next 實例
export default i18next;
