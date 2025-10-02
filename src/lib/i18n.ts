import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯資源
const resources = {
  zh: {
    translation: {
      // Hero 區塊
      hero: {
        title: 'Pediatric Basic Life Support (PBLS)',
        description: 'Pediatric Basic Life Support (PBLS) is the essential guideline for rescuing infants and children in cardiac or respiratory arrest. This platform provides systematic training combining theory, process flow, and scenario simulations.',
        learnMore: 'Learn More'
      },
      
      // 流程圖區塊
      flowchart: {
        title: 'PBLS 流程圖'
      },
      
      // 情境模擬區塊
      scenarios: {
        title: '模擬情境案例',
        cardiac: {
          title: '心臟驟停',
          description: 'CPR → AED (50J) → Epinephrine → 漸進電擊 → ICU。'
        },
        foodPoisoning: {
          title: '食物中毒',
          description: '清理氣道 → Bag-Mask → CPR → AED (80J) → Amiodarone。'
        },
        drowning: {
          title: '溺水',
          description: '抽吸水分 → Bag-Mask → CPR → AED (60J) → Amiodarone。'
        },
        fireInjury: {
          title: '火災嗆傷',
          description: '插管 + 氧氣 → CPR → AED (80-100J) → Epinephrine。'
        },
        trauma: {
          title: '外傷',
          description: '止血 + 輸液 → CPR → AED (70J) → Epinephrine。'
        }
      },
      
      // 按鈕文字
      buttons: {
        startSimulation: '開始模擬訓練',
        practice: '立即練習模擬',
        exam: '進入考試測驗'
      },
      
      // 語言切換
      lang: {
        toggle: 'EN'
      }
    }
  },
  en: {
    translation: {
      // Hero 區塊
      hero: {
        title: 'Pediatric Basic Life Support (PBLS)',
        description: 'Pediatric Basic Life Support (PBLS) is the essential guideline for rescuing infants and children in cardiac or respiratory arrest. This platform provides systematic training combining theory, process flow, and scenario simulations.',
        learnMore: 'Learn More'
      },
      
      // 流程圖區塊
      flowchart: {
        title: 'PBLS Flowchart'
      },
      
      // 情境模擬區塊
      scenarios: {
        title: 'Simulation Scenario Cases',
        cardiac: {
          title: 'Cardiac Arrest',
          description: 'CPR → AED (50J) → Epinephrine → Progressive Shock → ICU.'
        },
        foodPoisoning: {
          title: 'Food Poisoning',
          description: 'Clear Airway → Bag-Mask → CPR → AED (80J) → Amiodarone.'
        },
        drowning: {
          title: 'Drowning',
          description: 'Suction Water → Bag-Mask → CPR → AED (60J) → Amiodarone.'
        },
        fireInjury: {
          title: 'Fire Inhalation Injury',
          description: 'Intubation + Oxygen → CPR → AED (80-100J) → Epinephrine.'
        },
        trauma: {
          title: 'Trauma',
          description: 'Hemostasis + Fluid → CPR → AED (70J) → Epinephrine.'
        }
      },
      
      // 按鈕文字
      buttons: {
        startSimulation: 'Start Simulation Training',
        practice: 'Practice Now',
        exam: 'Enter Exam Test'
      },
      
      // 語言切換
      lang: {
        toggle: '中'
      }
    }
  }
};

// 初始化 i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
