// 語言切換器類
class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('pbls_language') || 'zh';
    this.translations = {
      zh: {
        menu: {
          info: '資訊',
          practice: '練習專區',
          exam: '考試專區',
          history: '歷史成績',
          team: '團隊'
        },
        content: {
          // 通用內容
          pageTitle: '資訊 - PBLS VR教學平台',
          header: {
            title: '歡迎使用PBLS教學平台',
            userInfo: 'CGU(長庚大學), Nursing'
          },
          marquee: {
            item1: '🎯 歡迎使用PBLS VR教學平台！',
            item2: '📚 360°實境教學影片，身臨其境的學習體驗',
            item3: '🤖 虛擬人互動，提升急救溝通技巧',
            item4: '🎮 VR實際操作，模擬真實急救情境',
            item5: '📊 即時成績追蹤，掌握學習進度',
            item6: '💡 問題導向學習法，提升急救技能'
          },
          // 筆試測驗內容
          quiz: {
            pageTitle: '筆試測驗 - PBLS VR教學平台',
            header: {
              title: '歡迎使用PBLS教學平台',
              userInfo: 'CGU(長庚大學), Nursing'
            },
            marquee: {
              item1: '🎯 歡迎使用PBLS VR教學平台！',
              item2: '📚 360°實境教學影片，身臨其境的學習體驗',
              item3: '🤖 虛擬人互動，提升急救溝通技巧',
              item4: '🎮 VR實際操作，模擬真實急救情境',
              item5: '📊 即時成績追蹤，掌握學習進度',
              item6: '💡 問題導向學習法，提升急救技能'
            },
            quiz: {
              title: '筆試測驗',
              description: '20題選擇題，每題5秒鐘的時間作答，請把握寶貴的急救時間，正確做出應對措施',
              startButton: '開始筆試測驗',
              exitConfirmation: '尚未完成筆試測驗，若現在離開測驗將不會記錄，確定是否離開？',
              results: {
                score: '分',
                correctAnswers: '答對題數',
                totalQuestions: '總題數',
                timeUsed: '用時',
                details: '測驗詳情',
                retakeButton: '重新測驗',
                correct: '正確',
                incorrect: '錯誤',
                noAnswer: '未作答',
                yourAnswer: '您的答案：',
                explanation: '解釋',
                correctAnswer: '正確答案'
              }
            }
          }
        },
        // 語言切換按鈕
        lang: {
          toggle: 'EN'
        }
      },
      en: {
        menu: {
          info: 'Information',
          practice: 'Practice',
          exam: 'Exam',
          history: 'History',
          team: 'Team'
        },
        content: {
          // 通用內容
          pageTitle: 'Information - PBLS VR Learning Platform',
          header: {
            title: 'Welcome to PBLS Learning Platform',
            userInfo: 'CGU (Chang Gung University), Nursing'
          },
          marquee: {
            item1: '🎯 Welcome to PBLS VR Learning Platform!',
            item2: '📚 360° Immersive Teaching Videos for Realistic Learning',
            item3: '🤖 Virtual Human Interaction to Improve Communication Skills',
            item4: '🎮 VR Practical Operations Simulating Real Emergency Situations',
            item5: '📊 Real-time Score Tracking to Monitor Learning Progress',
            item6: '💡 Problem-Based Learning to Enhance First Aid Skills'
          },
          // 筆試測驗內容
          quiz: {
            pageTitle: 'Written Test - PBLS VR Learning Platform',
            header: {
              title: 'Welcome to PBLS Learning Platform',
              userInfo: 'CGU (Chang Gung University), Nursing'
            },
            marquee: {
              item1: '🎯 Welcome to PBLS VR Learning Platform!',
              item2: '📚 360° Immersive Teaching Videos for Realistic Learning',
              item3: '🤖 Virtual Human Interaction to Improve Communication Skills',
              item4: '🎮 VR Practical Operations Simulating Real Emergency Situations',
              item5: '📊 Real-time Score Tracking to Monitor Learning Progress',
              item6: '💡 Problem-Based Learning to Enhance First Aid Skills'
            },
            quiz: {
              title: 'Written Test',
              description: '20 multiple choice questions, 5 seconds per question. Please make the most of your precious first aid time and respond correctly.',
              startButton: 'Start Written Test',
              exitConfirmation: 'The written test is not completed yet. If you leave now, the test will not be recorded. Are you sure you want to leave?',
              results: {
                score: 'points',
                correctAnswers: 'Correct Answers',
                totalQuestions: 'Total Questions',
                timeUsed: 'Time Used',
                details: 'Test Details',
                retakeButton: 'Retake Test',
                correct: 'Correct',
                incorrect: 'Incorrect',
                noAnswer: 'No Answer',
                yourAnswer: 'Your answer: ',
                explanation: 'Explanation',
                correctAnswer: 'Correct Answer'
              }
            }
          }
        },
        lang: {
          toggle: '中'
        }
      }
    };
  }

  init() {
    this.applyLanguage(this.currentLang);
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
    console.log('toggleLanguage: switching from', this.currentLang, 'to', newLang);
    this.currentLang = newLang;
    localStorage.setItem('pbls_language', newLang);
    this.applyLanguage(newLang);
  }

  applyLanguage(lang) {
    const translation = this.translations[lang];
    
    // 更新語言切換按鈕文字
    const languageButton = document.getElementById('language-text');
    if (languageButton) {
      languageButton.textContent = translation.lang.toggle;
    }

    // 更新選單項目文字
    this.updateMenuItems(translation.menu);

    // 根據當前頁面更新內容
    this.updatePageContent(translation.content);

    // 更新圖片路徑
    this.updateImages(lang);
  }

  updateMenuItems(menuTranslation) {
    const menuItems = document.querySelectorAll('.sidebar-icon span');
    menuItems.forEach((item, index) => {
      const menuKeys = ['info', 'practice', 'exam', 'history', 'team'];
      if (menuKeys[index]) {
        item.textContent = menuTranslation[menuKeys[index]];
      }
    });
  }

  updatePageContent(contentTranslation) {
    const currentPage = this.getCurrentPage();
    console.log('Current page detected:', currentPage);
    
    switch (currentPage) {
      case 'quiz':
        this.updateQuizPage(contentTranslation);
        break;
      case 'info':
        this.updateInfoPage(contentTranslation);
        break;
      case 'index':
        this.updateIndexPage(contentTranslation);
        break;
      case 'exam':
        this.updateExamPage(contentTranslation);
        break;
      case 'history':
        this.updateHistoryPage(contentTranslation);
        break;
      case 'team':
        this.updateTeamPage(contentTranslation);
        break;
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const href = window.location.href;
    console.log('getCurrentPage: path =', path, 'href =', href);
    
    if (path.includes('exam_quiz.html') || href.includes('exam_quiz.html')) {
      console.log('Detected quiz page');
      return 'quiz';
    }
    if (path.includes('info.html') || href.includes('info.html')) return 'info';
    if (path.includes('index.html') || href.includes('index.html')) return 'index';
    if (path.includes('exam.html') || href.includes('exam.html')) return 'exam';
    if (path.includes('history.html') || href.includes('history.html')) return 'history';
    if (path.includes('team.html') || href.includes('team.html')) return 'team';
    
    console.log('No specific page detected, returning default');
    return 'info'; // 默認
  }

  updateQuizPage(content) {
    console.log('updateQuizPage called with content:', content);
    
    // 更新頁面標題
    document.title = content.quiz.pageTitle;
    console.log('Page title updated to:', content.quiz.pageTitle);

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
      headerTitle.textContent = content.quiz.header.title;
      console.log('Header title updated to:', content.quiz.header.title);
    } else {
      console.log('Header title element not found');
    }

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.textContent = content.quiz.header.userInfo;
      console.log('User info updated to:', content.quiz.header.userInfo);
    } else {
      console.log('User info element not found');
    }

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.quiz.marquee.item1;
      marqueeItems[1].textContent = content.quiz.marquee.item2;
      marqueeItems[2].textContent = content.quiz.marquee.item3;
      marqueeItems[3].textContent = content.quiz.marquee.item4;
      marqueeItems[4].textContent = content.quiz.marquee.item5;
      marqueeItems[5].textContent = content.quiz.marquee.item6;
    }

    // 更新筆試測驗相關內容
    const quizTitle = document.querySelector('.quiz-title');
    if (quizTitle) {
      quizTitle.textContent = content.quiz.quiz.title;
      console.log('Quiz title updated to:', content.quiz.quiz.title);
    } else {
      console.log('Quiz title element not found');
    }

    const quizDescription = document.querySelector('.quiz-description');
    if (quizDescription) {
      quizDescription.textContent = content.quiz.quiz.description;
      console.log('Quiz description updated to:', content.quiz.quiz.description);
    } else {
      console.log('Quiz description element not found');
    }

    const startButton = document.querySelector('.start-quiz-btn');
    if (startButton) {
      startButton.textContent = content.quiz.quiz.startButton;
      console.log('Start button updated to:', content.quiz.quiz.startButton);
    } else {
      console.log('Start button element not found');
    }

    // 更新測驗結果相關文字（這些是動態生成的，需要在JavaScript中處理）
    // 這裡我們將更新全局變量，以便在生成結果時使用正確的語言
    window.quizTranslations = content.quiz.quiz.results;
    window.quizExitMessage = content.quiz.quiz.exitConfirmation;
    
    // 如果測驗尚未開始，重新載入對應語言的題目
    if (typeof loadQuestions === 'function' && !window.isQuizActive) {
      loadQuestions();
    }
    
    // 動態更新測驗描述，顯示實際題目數量
    this.updateQuizDescription();
  }

  updateQuizDescription() {
    // 這個函數會在 exam_quiz.html 中被定義和調用
    // 用於動態更新測驗描述文字
    if (typeof window.updateQuizDescriptionText === 'function') {
      window.updateQuizDescriptionText();
    }
  }

  updateInfoPage(content) {
    // 更新頁面標題
    document.title = content.pageTitle;

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = content.header.title;

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = content.header.userInfo;

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.marquee.item1;
      marqueeItems[1].textContent = content.marquee.item2;
      marqueeItems[2].textContent = content.marquee.item3;
      marqueeItems[3].textContent = content.marquee.item4;
      marqueeItems[4].textContent = content.marquee.item5;
      marqueeItems[5].textContent = content.marquee.item6;
    }
  }

  updateIndexPage(content) {
    // 更新頁面標題
    document.title = content.pageTitle;

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = content.header.title;

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = content.header.userInfo;

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.marquee.item1;
      marqueeItems[1].textContent = content.marquee.item2;
      marqueeItems[2].textContent = content.marquee.item3;
      marqueeItems[3].textContent = content.marquee.item4;
      marqueeItems[4].textContent = content.marquee.item5;
      marqueeItems[5].textContent = content.marquee.item6;
    }
  }

  updateExamPage(content) {
    // 更新頁面標題
    document.title = content.pageTitle;

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = content.header.title;

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = content.header.userInfo;

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.marquee.item1;
      marqueeItems[1].textContent = content.marquee.item2;
      marqueeItems[2].textContent = content.marquee.item3;
      marqueeItems[3].textContent = content.marquee.item4;
      marqueeItems[4].textContent = content.marquee.item5;
      marqueeItems[5].textContent = content.marquee.item6;
    }
  }

  updateHistoryPage(content) {
    // 更新頁面標題
    document.title = content.pageTitle;

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = content.header.title;

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = content.header.userInfo;

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.marquee.item1;
      marqueeItems[1].textContent = content.marquee.item2;
      marqueeItems[2].textContent = content.marquee.item3;
      marqueeItems[3].textContent = content.marquee.item4;
      marqueeItems[4].textContent = content.marquee.item5;
      marqueeItems[5].textContent = content.marquee.item6;
    }
  }

  updateTeamPage(content) {
    // 更新頁面標題
    document.title = content.pageTitle;

    // 更新頂部標題
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = content.header.title;

    // 更新用戶信息
    const userInfo = document.querySelector('.user-info');
    if (userInfo) userInfo.textContent = content.header.userInfo;

    // 更新跑馬燈內容
    const marqueeItems = document.querySelectorAll('.marquee-item');
    if (marqueeItems.length >= 6) {
      marqueeItems[0].textContent = content.marquee.item1;
      marqueeItems[1].textContent = content.marquee.item2;
      marqueeItems[2].textContent = content.marquee.item3;
      marqueeItems[3].textContent = content.marquee.item4;
      marqueeItems[4].textContent = content.marquee.item5;
      marqueeItems[5].textContent = content.marquee.item6;
    }
  }

  updateImages(lang) {
    // 由於英文版本的圖片文件不存在，我們始終使用中文版本的圖片
    // 這確保了圖片在任何語言設置下都能正常顯示
    console.log('updateImages called with lang:', lang, '- using Chinese images for compatibility');
  }
}

// 初始化語言切換器
window.languageSwitcher = new LanguageSwitcher();

// 全局函數供 HTML 調用
window.toggleLanguage = function() {
  window.languageSwitcher.toggleLanguage();
};

// 頁面載入時應用語言
document.addEventListener('DOMContentLoaded', function() {
  if (window.languageSwitcher) {
    window.languageSwitcher.applyLanguage(window.languageSwitcher.currentLang);
  }
});
