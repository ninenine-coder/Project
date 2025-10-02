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
          // 資訊頁面專用內容
          hero: {
            title: '小兒基本生命支持（PBLS）',
            description: '小兒基本生命支持（PBLS）是專為兒童與嬰幼兒設計的重要急救流程，協助第一時間正確判斷並處理呼吸或心跳驟停的狀況。本平台提供完整的學習資源，涵蓋標準理論基礎、系統化流程操作與多情境模擬，透過圖解說明與互動式演練，幫助學員快速理解並熟練應變步驟，最終目標是讓每位學習者在關鍵時刻都能正確反應，提升急救成功率，守護孩子的生命安全',
            learnMoreButton: '了解更多'
          },
          flowchart: {
            title: 'PBLS 流程圖'
          },
          scenarios: {
            title: '模擬情境案例',
            cardiac: {
              title: '心臟驟停',
              treatment: '處理措施'
            },
            poisoning: {
              title: '食物中毒',
              treatment: '處理措施'
            },
            drowning: {
              title: '溺水',
              treatment: '處理措施'
            },
            fire: {
              title: '火災嗆傷',
              treatment: '處理措施'
            },
            trauma: {
              title: '外傷',
              treatment: '處理措施'
            }
          },
          treatmentModal: {
            title: '處理措施'
          },
          treatmentData: {
            cardiac: {
              title: '心臟驟停處理措施',
              steps: [
                '立即進行CPR（心肺復甦術）',
                '使用AED進行電擊（50J）',
                '給予腎上腺素',
                '漸進式電擊治療',
                '轉送加護病房'
              ]
            },
            poisoning: {
              title: '食物中毒處理措施',
              steps: [
                '清理呼吸道，確保氣道暢通',
                '使用袋瓣罩進行人工呼吸',
                '進行心肺復甦術',
                '使用AED進行電擊（80J）',
                '給予胺碘酮'
              ]
            },
            drowning: {
              title: '溺水處理措施',
              steps: [
                '抽吸呼吸道中的水分',
                '使用袋瓣罩進行人工呼吸',
                '進行心肺復甦術',
                '使用AED進行電擊（60J）',
                '給予胺碘酮'
              ]
            },
            fire: {
              title: '火災嗆傷處理措施',
              steps: [
                '進行氣管插管並給予氧氣',
                '進行心肺復甦術',
                '使用AED進行電擊（80-100J）',
                '給予腎上腺素'
              ]
            },
            trauma: {
              title: '外傷處理措施',
              steps: [
                '進行止血並建立靜脈輸液',
                '進行心肺復甦術',
                '使用AED進行電擊（70J）',
                '給予腎上腺素'
              ]
            }
          },
          buttons: {
            practice: '立即練習模擬',
            exam: '進入考試測驗'
          },
          // 練習專區頁面專用內容
          practice: {
            pageTitle: '練習專區 - PBLS VR教學平台',
            title: '練習專區',
            description: '這裡提供 360° 實境教學影片與虛擬人互動學習。',
            videoSection: {
              title: '360° 實境教學影片',
              description: '觀看高品質的360度影片，體驗身臨其境的急救情境'
            },
            virtualHumanSection: {
              title: '虛擬人互動',
              description: '與AI驅動的虛擬患者進行對話練習，提升溝通技巧'
            }
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
          // 資訊頁面專用內容
          hero: {
            title: 'Pediatric Basic Life Support (PBLS)',
            description: 'Pediatric Basic Life Support (PBLS) is the essential guideline for rescuing infants and children in cardiac or respiratory arrest. This platform provides systematic training combining theory, process flow, and scenario simulations.',
            learnMoreButton: 'Learn More'
          },
          flowchart: {
            title: 'PBLS Flowchart'
          },
          scenarios: {
            title: 'Scenario Simulation Cases',
            cardiac: {
              title: 'Cardiac Arrest',
              treatment: 'Treatment Measures'
            },
            poisoning: {
              title: 'Food Poisoning',
              treatment: 'Treatment Measures'
            },
            drowning: {
              title: 'Drowning',
              treatment: 'Treatment Measures'
            },
            fire: {
              title: 'Fire Inhalation Injury',
              treatment: 'Treatment Measures'
            },
            trauma: {
              title: 'Trauma',
              treatment: 'Treatment Measures'
            }
          },
          treatmentModal: {
            title: 'Treatment Measures'
          },
          treatmentData: {
            cardiac: {
              title: 'Cardiac Arrest Treatment Measures',
              steps: [
                'Immediately perform CPR (Cardiopulmonary Resuscitation)',
                'Use AED for defibrillation (50J)',
                'Administer Epinephrine',
                'Progressive defibrillation treatment',
                'Transfer to ICU'
              ]
            },
            poisoning: {
              title: 'Food Poisoning Treatment Measures',
              steps: [
                'Clear airway to ensure patency',
                'Use bag-mask for artificial ventilation',
                'Perform CPR',
                'Use AED for defibrillation (80J)',
                'Administer Amiodarone'
              ]
            },
            drowning: {
              title: 'Drowning Treatment Measures',
              steps: [
                'Suction water from airway',
                'Use bag-mask for artificial ventilation',
                'Perform CPR',
                'Use AED for defibrillation (60J)',
                'Administer Amiodarone'
              ]
            },
            fire: {
              title: 'Fire Inhalation Injury Treatment Measures',
              steps: [
                'Perform endotracheal intubation and provide oxygen',
                'Perform CPR',
                'Use AED for defibrillation (80-100J)',
                'Administer Epinephrine'
              ]
            },
            trauma: {
              title: 'Trauma Treatment Measures',
              steps: [
                'Perform hemostasis and establish IV access',
                'Perform CPR',
                'Use AED for defibrillation (70J)',
                'Administer Epinephrine'
              ]
            }
          },
          buttons: {
            practice: 'Start Practice Simulation',
            exam: 'Enter Exam Test'
          },
          // 練習專區頁面專用內容
          practice: {
            pageTitle: 'Practice Area - PBLS VR Learning Platform',
            title: 'Practice Area',
            description: 'Here we provide 360° immersive teaching videos and virtual human interaction learning.',
            videoSection: {
              title: '360° Immersive Teaching Videos',
              description: 'Watch high-quality 360-degree videos and experience immersive first aid scenarios'
            },
            virtualHumanSection: {
              title: 'Virtual Human Interaction',
              description: 'Practice dialogue with AI-driven virtual patients to improve communication skills'
            }
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
    
    // 注意：測驗中的語言切換現在由 updateQuizPage 自動處理
    // 不需要在這裡重複調用 handleQuizLanguageSwitch
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
    
    // 如果測驗尚未開始，只更新測驗描述文字，不重新載入題目
    const isQuizActiveForDescription = typeof window.isQuizActive === 'function' ? window.isQuizActive() : false;
    if (typeof window.updateQuizDescriptionText === 'function' && !isQuizActiveForDescription) {
      window.updateQuizDescriptionText();
    }
    
    // 如果測驗正在進行中，需要特殊處理題目內容的語言切換
    const isQuizActive = typeof window.isQuizActive === 'function' ? window.isQuizActive() : false;
    const isQuizCompleted = typeof window.isQuizCompleted === 'function' ? window.isQuizCompleted() : false;
    
    if (isQuizActive && !isQuizCompleted) {
      console.log('Quiz is active, handling question content language switch');
      // 調用測驗中的語言切換處理函數
      if (typeof window.handleQuizLanguageSwitch === 'function') {
        window.handleQuizLanguageSwitch();
      }
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

    // 更新 Hero Section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = content.hero.title;

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = content.hero.description;

    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) learnMoreBtn.textContent = content.hero.learnMoreButton;

    // 更新流程圖標題
    const flowchartTitle = document.querySelector('.section-white .section-title');
    if (flowchartTitle) flowchartTitle.textContent = content.flowchart.title;

    // 更新情境案例標題
    const scenariosTitle = document.querySelector('.section-purple .section-title');
    if (scenariosTitle) scenariosTitle.textContent = content.scenarios.title;

    // 更新情境卡片標題和按鈕
    const scenarioTitles = document.querySelectorAll('.scenario-title');
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    const scenarioData = [
      content.scenarios.cardiac,
      content.scenarios.poisoning,
      content.scenarios.drowning,
      content.scenarios.fire,
      content.scenarios.trauma
    ];

    scenarioTitles.forEach((title, index) => {
      if (scenarioData[index]) {
        title.textContent = scenarioData[index].title;
      }
    });

    scenarioButtons.forEach((button, index) => {
      if (scenarioData[index]) {
        button.textContent = scenarioData[index].treatment;
      }
    });

    // 更新模態框標題
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = content.treatmentModal.title;

    // 更新處理措施數據（全局變量）
    window.treatmentData = content.treatmentData;

    // 更新按鈕文字
    const practiceBtn = document.querySelector('.practice-btn');
    if (practiceBtn) practiceBtn.textContent = content.buttons.practice;

    const examBtn = document.querySelector('.exam-btn');
    if (examBtn) examBtn.textContent = content.buttons.exam;
  }

  updateIndexPage(content) {
    // 更新頁面標題
    document.title = content.practice.pageTitle;

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

    // 更新練習專區標題
    const practiceTitle = document.querySelector('.practice-homepage h1');
    if (practiceTitle) practiceTitle.textContent = content.practice.title;

    // 更新練習專區描述
    const practiceDescription = document.querySelector('.practice-homepage p');
    if (practiceDescription) practiceDescription.textContent = content.practice.description;

    // 更新360°影片區段標題
    const videoSectionTitle = document.querySelector('.section-header h2');
    if (videoSectionTitle && videoSectionTitle.textContent.includes('360')) {
      videoSectionTitle.innerHTML = `<i class="fas fa-video"></i> ${content.practice.videoSection.title}`;
    }

    // 更新360°影片區段描述
    const videoSectionDescription = document.querySelector('.section-header p');
    if (videoSectionDescription) {
      videoSectionDescription.textContent = content.practice.videoSection.description;
    }

    // 更新虛擬人互動區段標題
    const virtualHumanTitle = document.querySelector('.virtual-human-section .section-header h2');
    if (virtualHumanTitle) {
      virtualHumanTitle.innerHTML = `<i class="fas fa-comment-dots"></i> ${content.practice.virtualHumanSection.title}`;
    }

    // 更新虛擬人互動區段描述
    const virtualHumanDescription = document.querySelector('.virtual-human-section .section-header p');
    if (virtualHumanDescription) {
      virtualHumanDescription.textContent = content.practice.virtualHumanSection.description;
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
  
}

// 初始化語言切換器
window.languageSwitcher = new LanguageSwitcher();

// 將處理函數暴露到全局作用域
window.handleQuizLanguageSwitch = window.languageSwitcher.handleQuizLanguageSwitch.bind(window.languageSwitcher);

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
