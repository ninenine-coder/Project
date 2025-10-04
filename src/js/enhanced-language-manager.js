// 增強的語言管理器，整合 i18next
import { setLanguage, getCurrentLanguage, t, waitForI18n } from './i18n-config.js';

class EnhancedLanguageManager {
  constructor() {
    this.currentLang = getCurrentLanguage();
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      await waitForI18n();
      this.isInitialized = true;
      this.applyLanguage(this.currentLang);
      console.log('Enhanced Language Manager initialized with language:', this.currentLang);
    } catch (error) {
      console.error('Failed to initialize Enhanced Language Manager:', error);
    }
  }

  async toggleLanguage() {
    const newLang = this.currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    console.log('toggleLanguage: switching from', this.currentLang, 'to', newLang);
    
    try {
      await setLanguage(newLang);
      this.currentLang = newLang;
      this.applyLanguage(newLang);
      
      // 觸發自定義事件，通知其他組件語言已變更
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: newLang } 
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  }

  applyLanguage(lang) {
    if (!this.isInitialized) {
      console.warn('Language manager not initialized yet');
      return;
    }

    console.log('Applying language:', lang);
    
    // 更新語言切換按鈕文字
    this.updateLanguageButton();
    
    // 更新選單項目文字
    this.updateMenuItems();
    
    // 根據當前頁面更新內容
    this.updatePageContent();
    
    // 更新頁面標題
    this.updatePageTitle();
    
    // 更新圖片路徑（如果需要）
    this.updateImages(lang);
  }

  updateLanguageButton() {
    const languageButton = document.getElementById('language-text');
    if (languageButton) {
      languageButton.textContent = t('common.language.toggle');
    }
  }

  updateMenuItems() {
    const menuItems = document.querySelectorAll('.sidebar-icon span');
    const menuKeys = ['info', 'practice', 'exam', 'history', 'team'];
    
    menuItems.forEach((item, index) => {
      if (menuKeys[index]) {
        item.textContent = t(`common.menu.${menuKeys[index]}`);
      }
    });
  }

  updatePageContent() {
    const currentPage = this.getCurrentPage();
    console.log('Current page detected:', currentPage);
    
    switch (currentPage) {
      case 'quiz':
        this.updateQuizPage();
        break;
      case 'info':
        this.updateInfoPage();
        break;
      case 'index':
        this.updateIndexPage();
        break;
      case 'exam':
        this.updateExamPage();
        break;
      case 'history':
        this.updateHistoryPage();
        break;
      case 'team':
        this.updateTeamPage();
        break;
    }
  }

  updatePageTitle() {
    const currentPage = this.getCurrentPage();
    const pageTitleKey = `common.pageTitle.${currentPage}`;
    const title = t(pageTitleKey);
    
    if (title && title !== pageTitleKey) {
      document.title = title;
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const href = window.location.href;
    
    if (path.includes('exam_quiz.html') || href.includes('exam_quiz.html')) {
      return 'quiz';
    }
    if (path.includes('info.html') || href.includes('info.html')) return 'info';
    if (path.includes('index.html') || href.includes('index.html')) return 'index';
    if (path.includes('exam.html') || href.includes('exam.html')) return 'exam';
    if (path.includes('history.html') || href.includes('history.html')) return 'history';
    if (path.includes('team.html') || href.includes('team.html')) return 'team';
    
    return 'info'; // 默認
  }

  updateQuizPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
      headerTitle.textContent = t('common.header.title');
    }

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.textContent = t('common.header.userInfo');
    }

    // 更新跑馬燈內容
    this.updateMarquee();

    // 更新筆試測驗相關內容
    const quizTitle = document.querySelector('.quiz-title');
    if (quizTitle) {
      quizTitle.textContent = t('quiz.title');
    }

    const quizDescription = document.querySelector('.quiz-description');
    if (quizDescription) {
      quizDescription.textContent = t('quiz.description');
    }

    const startButton = document.querySelector('.start-quiz-btn');
    if (startButton) {
      startButton.textContent = t('quiz.startButton');
    }

    // 更新測驗結果相關文字（全局變量）
    window.quizTranslations = {
      score: t('quiz.results.score'),
      correctAnswers: t('quiz.results.correctAnswers'),
      totalQuestions: t('quiz.results.totalQuestions'),
      timeUsed: t('quiz.results.timeUsed'),
      details: t('quiz.results.details'),
      retakeButton: t('quiz.results.retakeButton'),
      correct: t('quiz.results.correct'),
      incorrect: t('quiz.results.incorrect'),
      noAnswer: t('quiz.results.noAnswer'),
      yourAnswer: t('quiz.results.yourAnswer'),
      explanation: t('quiz.results.explanation'),
      correctAnswer: t('quiz.results.correctAnswer')
    };
    window.quizExitMessage = t('quiz.exitConfirmation');
    
    // 如果測驗正在進行中，需要特殊處理題目內容的語言切換
    const isQuizActive = typeof window.isQuizActive === 'function' ? window.isQuizActive() : false;
    const isQuizCompleted = typeof window.isQuizCompleted === 'function' ? window.isQuizCompleted() : false;
    
    if (isQuizActive && !isQuizCompleted) {
      console.log('Quiz is active, handling question content language switch');
      if (typeof window.handleQuizLanguageSwitch === 'function') {
        window.handleQuizLanguageSwitch();
      }
    }
  }

  updateInfoPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = t('common.header.title');

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = t('common.header.userInfo');

    // 更新跑馬燈內容
    this.updateMarquee();

    // 更新 Hero Section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = t('info.hero.title');

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = t('info.hero.description');

    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) learnMoreBtn.textContent = t('info.hero.learnMoreButton');

    // 更新流程圖標題
    const flowchartTitle = document.querySelector('.section-white .section-title');
    if (flowchartTitle) flowchartTitle.textContent = t('info.flowchart.title');

    // 更新情境案例標題
    const scenariosTitle = document.querySelector('.section-purple .section-title');
    if (scenariosTitle) scenariosTitle.textContent = t('info.scenarios.title');

    // 更新情境卡片標題和按鈕
    this.updateScenarioCards();

    // 更新模態框標題
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = t('info.treatmentModal.title');

    // 更新處理措施數據（全局變量）
    window.treatmentData = {
      cardiac: {
        title: t('info.treatmentData.cardiac.title'),
        steps: t('info.treatmentData.cardiac.steps', { returnObjects: true })
      },
      poisoning: {
        title: t('info.treatmentData.poisoning.title'),
        steps: t('info.treatmentData.poisoning.steps', { returnObjects: true })
      },
      drowning: {
        title: t('info.treatmentData.drowning.title'),
        steps: t('info.treatmentData.drowning.steps', { returnObjects: true })
      },
      fire: {
        title: t('info.treatmentData.fire.title'),
        steps: t('info.treatmentData.fire.steps', { returnObjects: true })
      },
      trauma: {
        title: t('info.treatmentData.trauma.title'),
        steps: t('info.treatmentData.trauma.steps', { returnObjects: true })
      }
    };

    // 更新按鈕文字
    const practiceBtn = document.querySelector('.practice-btn');
    if (practiceBtn) practiceBtn.textContent = t('info.buttons.practice');

    const examBtn = document.querySelector('.exam-btn');
    if (examBtn) examBtn.textContent = t('info.buttons.exam');
  }

  updateIndexPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = t('common.header.title');

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = t('common.header.userInfo');

    // 更新跑馬燈內容
    this.updateMarquee();

    // 更新練習專區標題
    const practiceTitle = document.querySelector('.practice-homepage h1');
    if (practiceTitle) practiceTitle.textContent = t('practice.title');

    // 更新練習專區描述
    const practiceDescription = document.querySelector('.practice-homepage p');
    if (practiceDescription) practiceDescription.textContent = t('practice.description');

    // 更新360°影片區段標題
    const videoSectionTitle = document.querySelector('.section-header h2');
    if (videoSectionTitle && videoSectionTitle.textContent.includes('360')) {
      videoSectionTitle.innerHTML = `<i class="fas fa-video"></i> ${t('practice.videoSection.title')}`;
    }

    // 更新360°影片區段描述
    const videoSectionDescription = document.querySelector('.section-header p');
    if (videoSectionDescription) {
      videoSectionDescription.textContent = t('practice.videoSection.description');
    }

    // 更新虛擬人互動區段標題
    const virtualHumanTitle = document.querySelector('.virtual-human-section .section-header h2');
    if (virtualHumanTitle) {
      virtualHumanTitle.innerHTML = `<i class="fas fa-comment-dots"></i> ${t('practice.virtualHumanSection.title')}`;
    }

    // 更新虛擬人互動區段描述
    const virtualHumanDescription = document.querySelector('.virtual-human-section .section-header p');
    if (virtualHumanDescription) {
      virtualHumanDescription.textContent = t('practice.virtualHumanSection.description');
    }
  }

  updateExamPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = t('common.header.title');

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = t('common.header.userInfo');

    // 更新跑馬燈內容
    this.updateMarquee();
  }

  updateHistoryPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = t('common.header.title');

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = t('common.header.userInfo');

    // 更新跑馬燈內容
    this.updateMarquee();

    // 更新歷史成績相關內容
    const historyTitle = document.querySelector('.history-title, .section-title');
    if (historyTitle) historyTitle.textContent = t('history.title');

    // 更新統計信息
    this.updateHistoryStats();
  }

  updateTeamPage() {
    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = t('common.header.title');

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = t('common.header.userInfo');

    // 更新跑馬燈內容
    this.updateMarquee();

    // 更新團隊相關內容
    const teamTitle = document.querySelector('.team-title, .section-title');
    if (teamTitle) teamTitle.textContent = t('team.title');

    const teamDescription = document.querySelector('.team-description');
    if (teamDescription) teamDescription.textContent = t('team.description');
  }

  updateMarquee() {
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = t('common.marquee.item1');
      marqueeItems[1].textContent = t('common.marquee.item2');
      marqueeItems[2].textContent = t('common.marquee.item3');
      marqueeItems[3].textContent = t('common.marquee.item4');
      marqueeItems[4].textContent = t('common.marquee.item5');
      marqueeItems[5].textContent = t('common.marquee.item6');
    }
  }

  updateScenarioCards() {
    const scenarioTitles = document.querySelectorAll('.scenario-title');
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    const scenarioKeys = ['cardiac', 'poisoning', 'drowning', 'fire', 'trauma'];

    scenarioTitles.forEach((title, index) => {
      if (scenarioKeys[index]) {
        title.textContent = t(`info.scenarios.${scenarioKeys[index]}.title`);
      }
    });

    scenarioButtons.forEach((button, index) => {
      if (scenarioKeys[index]) {
        button.textContent = t(`info.scenarios.${scenarioKeys[index]}.treatment`);
      }
    });
  }

  updateHistoryStats() {
    // 更新歷史統計信息
    const totalAttemptsElement = document.querySelector('.total-attempts, [data-i18n="history.totalAttempts"]');
    if (totalAttemptsElement) {
      totalAttemptsElement.textContent = t('history.totalAttempts');
    }

    const averageScoreElement = document.querySelector('.average-score, [data-i18n="history.averageScore"]');
    if (averageScoreElement) {
      averageScoreElement.textContent = t('history.averageScore');
    }

    const bestScoreElement = document.querySelector('.best-score, [data-i18n="history.bestScore"]');
    if (bestScoreElement) {
      bestScoreElement.textContent = t('history.bestScore');
    }

    const lastAttemptElement = document.querySelector('.last-attempt, [data-i18n="history.lastAttempt"]');
    if (lastAttemptElement) {
      lastAttemptElement.textContent = t('history.lastAttempt');
    }
  }

  updateImages(lang) {
    // 由於英文版本的圖片文件不存在，我們始終使用中文版本的圖片
    console.log('updateImages called with lang:', lang, '- using Chinese images for compatibility');
  }

  // 處理測驗中的語言切換
  async handleQuizLanguageSwitch() {
    console.log('handleQuizLanguageSwitch: handling language switch during quiz');
    
    // 如果正在轉換中，忽略語言切換請求
    if (typeof window.isTransitioning === 'function' && window.isTransitioning()) {
      console.log('Language switch ignored: currently transitioning');
      return;
    }
    
    // 檢查當前題目是否已作答
    const isAnswered = window.isCurrentQuestionAnswered && window.isCurrentQuestionAnswered();
    const currentIndex = typeof window.getCurrentQuestionIndex === 'function' ? window.getCurrentQuestionIndex() : 0;
    const questions = typeof window.getSelectedQuestions === 'function' ? window.getSelectedQuestions() : [];
    
    console.log('Current question answered:', isAnswered);
    console.log('Current question index:', currentIndex);
    console.log('Total questions:', questions.length);
    
    if (isAnswered) {
      // 如果當前題目已作答，直接進入下一題
      console.log('Current question answered, proceeding to next question');
      if (currentIndex < questions.length - 1) {
        console.log('Moving to next question, new index:', currentIndex + 1);
        // 使用特殊的函數來顯示下一題（使用新語言）
        if (window.displayNextQuestionAfterLanguageSwitch) {
          await window.displayNextQuestionAfterLanguageSwitch();
        } else if (window.displayQuestionWithDelay) {
          // 先更新索引，再顯示題目
          if (typeof window.setCurrentQuestionIndex === 'function') {
            window.setCurrentQuestionIndex(currentIndex + 1);
          }
          window.displayQuestionWithDelay();
        }
      } else {
        // 如果是最後一題，結束測驗
        console.log('Last question answered, ending quiz');
        if (window.endQuiz) {
          window.endQuiz();
        }
      }
    } else {
      // 如果當前題目未作答，繼續顯示當前題目（使用新語言）
      console.log('Current question not answered, continuing with current question in new language');
      console.log('Current question index:', currentIndex);
      if (window.displayCurrentQuestionAfterLanguageSwitch) {
        await window.displayCurrentQuestionAfterLanguageSwitch();
      } else if (window.displayQuestion) {
        window.displayQuestion();
      }
    }
  }

  // 獲取翻譯文本
  getTranslation(key, options = {}) {
    return t(key, options);
  }

  // 檢查是否已初始化
  isReady() {
    return this.isInitialized;
  }
}

// 創建全局實例
window.enhancedLanguageManager = new EnhancedLanguageManager();

// 全局函數供 HTML 調用
window.toggleLanguage = function() {
  return window.enhancedLanguageManager.toggleLanguage();
};

// 將處理函數暴露到全局作用域
window.handleQuizLanguageSwitch = window.enhancedLanguageManager.handleQuizLanguageSwitch.bind(window.enhancedLanguageManager);

// 頁面載入時應用語言
document.addEventListener('DOMContentLoaded', function() {
  if (window.enhancedLanguageManager) {
    // 等待初始化完成後再應用語言
    const checkInitialization = () => {
      if (window.enhancedLanguageManager.isReady()) {
        window.enhancedLanguageManager.applyLanguage(window.enhancedLanguageManager.currentLang);
      } else {
        setTimeout(checkInitialization, 100);
      }
    };
    checkInitialization();
  }
});

export default EnhancedLanguageManager;
