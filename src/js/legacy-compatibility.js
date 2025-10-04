// 舊版語言切換器兼容性腳本
// 這個腳本確保舊的語言切換器仍然可以工作，同時整合新的 i18next 系統

// 等待增強的語言管理器初始化
function waitForEnhancedLanguageManager() {
  return new Promise((resolve) => {
    const checkManager = () => {
      if (window.enhancedLanguageManager && window.enhancedLanguageManager.isReady()) {
        resolve(window.enhancedLanguageManager);
      } else {
        setTimeout(checkManager, 100);
      }
    };
    checkManager();
  });
}

// 創建兼容性包裝器
class LegacyLanguageSwitcherCompatibility {
  constructor() {
    this.enhancedManager = null;
    this.init();
  }

  async init() {
    try {
      this.enhancedManager = await waitForEnhancedLanguageManager();
      console.log('Legacy compatibility layer initialized');
    } catch (error) {
      console.error('Failed to initialize legacy compatibility layer:', error);
    }
  }

  // 兼容舊的 toggleLanguage 函數
  toggleLanguage() {
    if (this.enhancedManager) {
      return this.enhancedManager.toggleLanguage();
    } else {
      console.warn('Enhanced language manager not ready, falling back to basic toggle');
      // 基本回退邏輯
      const currentLang = localStorage.getItem('pbls_language') || 'zh-TW';
      const newLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
      localStorage.setItem('pbls_language', newLang);
      location.reload(); // 簡單的頁面重新載入
    }
  }

  // 兼容舊的 applyLanguage 函數
  applyLanguage(lang) {
    if (this.enhancedManager) {
      this.enhancedManager.currentLang = lang;
      this.enhancedManager.applyLanguage(lang);
    }
  }

  // 兼容舊的 getCurrentLanguage 函數
  getCurrentLanguage() {
    if (this.enhancedManager) {
      return this.enhancedManager.currentLang;
    }
    return localStorage.getItem('pbls_language') || 'zh-TW';
  }

  // 兼容舊的翻譯函數
  getTranslation(key, options = {}) {
    if (this.enhancedManager) {
      return this.enhancedManager.getTranslation(key, options);
    }
    return key; // 回退到鍵值本身
  }
}

// 創建全局兼容性實例
window.legacyLanguageCompatibility = new LegacyLanguageSwitcherCompatibility();

// 覆蓋舊的全局函數
window.toggleLanguage = function() {
  return window.legacyLanguageCompatibility.toggleLanguage();
};

// 如果舊的語言切換器存在，將其方法重定向到新的管理器
document.addEventListener('DOMContentLoaded', function() {
  // 等待一段時間確保所有腳本都已載入
  setTimeout(() => {
    if (window.languageSwitcher && window.enhancedLanguageManager) {
      console.log('Redirecting old language switcher methods to enhanced manager');
      
      // 重定向舊的方法到新的管理器
      window.languageSwitcher.toggleLanguage = function() {
        return window.enhancedLanguageManager.toggleLanguage();
      };
      
      window.languageSwitcher.applyLanguage = function(lang) {
        window.enhancedLanguageManager.currentLang = lang;
        window.enhancedLanguageManager.applyLanguage(lang);
      };
      
      window.languageSwitcher.getCurrentLanguage = function() {
        return window.enhancedLanguageManager.currentLang;
      };
    }
  }, 1000);
});

export default LegacyLanguageSwitcherCompatibility;
