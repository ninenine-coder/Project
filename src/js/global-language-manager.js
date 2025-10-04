// 全局語言管理器 - 確保整個網站語言統一
class GlobalLanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('pbls_language') || 'zh';
    this.observers = []; // 語言變化觀察者
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
          pageTitle: {
            info: '資訊 - PBLS VR教學平台',
            index: '練習專區 - PBLS VR教學平台',
            exam: '考試專區 - PBLS VR教學平台',
            history: '歷史成績 - PBLS VR教學平台',
            team: '團隊 - PBLS VR教學平台',
            quiz: '筆試測驗 - PBLS VR教學平台'
          },
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
          info: {
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
            }
          },
          // 練習專區頁面專用內容
          practice: {
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
          // 考試專區頁面專用內容
          exam: {
            writtenTest: {
              title: '筆試測驗',
              description: '20題選擇題，每題5秒鐘的時間作答，請把握寶貴的急救時間，正確做出應對措施',
              startButton: '開始筆試測驗'
            },
            scenarioTest: {
              title: '情境測驗',
              description: '模擬真實急救情境，測試您的應變能力',
              startButton: '開始情境測驗'
            }
          },
          // 歷史成績頁面專用內容
          history: {
            title: '歷史成績',
            description: '查看您的學習進度和成績記錄',
            tableHeaders: {
              date: '日期',
              testType: '測驗類型',
              score: '分數',
              time: '用時',
              status: '狀態'
            },
            noDataMessage: '暫無成績記錄',
            retakeButton: '重新測驗'
          },
          // 團隊頁面專用內容
          team: {
            title: '團隊',
            description: '認識我們的開發團隊',
            members: {
              leader: '專案負責人',
              developer: '開發工程師',
              designer: 'UI/UX設計師',
              tester: '測試工程師'
            }
          },
          // 筆試測驗內容
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
          pageTitle: {
            info: 'Information - PBLS VR Learning Platform',
            index: 'Practice Area - PBLS VR Learning Platform',
            exam: 'Exam Area - PBLS VR Learning Platform',
            history: 'History - PBLS VR Learning Platform',
            team: 'Team - PBLS VR Learning Platform',
            quiz: 'Written Test - PBLS VR Learning Platform'
          },
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
          info: {
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
            }
          },
          // 練習專區頁面專用內容
          practice: {
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
          // 考試專區頁面專用內容
          exam: {
            writtenTest: {
              title: 'Written Test',
              description: '20 multiple choice questions, 5 seconds per question. Please make the most of your precious first aid time and respond correctly.',
              startButton: 'Start Written Test'
            },
            scenarioTest: {
              title: 'Scenario Test',
              description: 'Simulate real emergency situations and test your response capabilities',
              startButton: 'Start Scenario Test'
            }
          },
          // 歷史成績頁面專用內容
          history: {
            title: 'History',
            description: 'View your learning progress and score records',
            tableHeaders: {
              date: 'Date',
              testType: 'Test Type',
              score: 'Score',
              time: 'Time Used',
              status: 'Status'
            },
            noDataMessage: 'No score records yet',
            retakeButton: 'Retake Test'
          },
          // 團隊頁面專用內容
          team: {
            title: 'Team',
            description: 'Meet our development team',
            members: {
              leader: 'Project Leader',
              developer: 'Developer',
              designer: 'UI/UX Designer',
              tester: 'Test Engineer'
            }
          },
          // 筆試測驗內容
          quiz: {
            title: 'Written Test',
            description: '20 multiple choice questions, 5 seconds per question. Please make the most of your precious first aid time and respond correctly.',
            startButton: 'Start Written Test',
            exitConfirmation: 'The written test is not completed yet. If you leave now, the test will not be recorded. Are you sure you want to leave?',
            results: {
              score: 'Score',
              correctAnswers: 'Correct Answers',
              totalQuestions: 'Total Questions',
              timeUsed: 'Time Used',
              details: 'Test Details',
              retakeButton: 'Retake Test',
              correct: 'Correct',
              incorrect: 'Incorrect',
              noAnswer: 'No Answer',
              yourAnswer: 'Your Answer:',
              explanation: 'Explanation',
              correctAnswer: 'Correct Answer'
            }
          }
        },
        // 語言切換按鈕
        lang: {
          toggle: '中'
        }
      }
    };
    
    // 初始化全局語言管理器
    this.init();
  }

  // 初始化
  init() {
    console.log('GlobalLanguageManager initialized with language:', this.currentLang);
    
    // 監聽語言變化事件
    window.addEventListener('languageChanged', (event) => {
      this.handleLanguageChange(event.detail.newLang);
    });

    // 監聽頁面可見性變化，確保語言設置同步
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncLanguage();
      }
    });

    // 監聽存儲變化事件（多標籤頁同步）
    window.addEventListener('storage', (event) => {
      if (event.key === 'pbls_language' && event.newValue !== this.currentLang) {
        this.currentLang = event.newValue;
        this.applyLanguage(this.currentLang);
      }
    });

    // 立即應用當前語言
    this.applyLanguage(this.currentLang);
  }

  // 獲取當前頁面類型
  getCurrentPageType() {
    const path = window.location.pathname;
    const href = window.location.href;
    
    if (path.includes('exam_quiz.html') || href.includes('exam_quiz.html')) return 'quiz';
    if (path.includes('info.html') || href.includes('info.html')) return 'info';
    if (path.includes('index.html') || href.includes('index.html')) return 'index';
    if (path.includes('exam.html') || href.includes('exam.html')) return 'exam';
    if (path.includes('history.html') || href.includes('history.html')) return 'history';
    if (path.includes('team.html') || href.includes('team.html')) return 'team';
    
    return 'info'; // 默認
  }

  // 切換語言
  toggleLanguage() {
    const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
    console.log('GlobalLanguageManager: switching from', this.currentLang, 'to', newLang);
    
    this.currentLang = newLang;
    localStorage.setItem('pbls_language', newLang);
    
    // 觸發全局語言變化事件
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { newLang: newLang }
    }));
    
    this.applyLanguage(newLang);
  }

  // 處理語言變化
  handleLanguageChange(newLang) {
    console.log('GlobalLanguageManager: handling language change to', newLang);
    this.currentLang = newLang;
    this.applyLanguage(newLang);
  }

  // 同步語言設置
  syncLanguage() {
    const storedLang = localStorage.getItem('pbls_language') || 'zh';
    if (storedLang !== this.currentLang) {
      console.log('GlobalLanguageManager: syncing language from', this.currentLang, 'to', storedLang);
      this.currentLang = storedLang;
      this.applyLanguage(this.currentLang);
    }
  }

  // 應用語言到當前頁面
  applyLanguage(lang) {
    console.log('GlobalLanguageManager: applying language', lang, 'to page type', this.getCurrentPageType());
    
    const translation = this.translations[lang];
    const pageType = this.getCurrentPageType();
    
    // 更新語言切換按鈕文字
    this.updateLanguageButton(translation.lang.toggle);
    
    // 更新選單項目
    this.updateMenuItems(translation.menu);
    
    // 更新頁面標題
    this.updatePageTitle(translation.content.pageTitle[pageType]);
    
    // 更新通用內容
    this.updateCommonContent(translation.content);
    
    // 更新頁面特定內容
    this.updatePageSpecificContent(translation.content, pageType);
    
    // 更新圖片路徑
    this.updateImages(lang);
    
    // 通知所有觀察者
    this.notifyObservers(lang);
  }

  // 更新語言切換按鈕文字
  updateLanguageButton(text) {
    const languageButton = document.getElementById('language-text');
    if (languageButton) {
      languageButton.textContent = text;
    }
  }

  // 更新選單項目
  updateMenuItems(menuTranslation) {
    const menuItems = document.querySelectorAll('.sidebar-icon span');
    const menuKeys = ['info', 'practice', 'exam', 'history', 'team'];
    
    menuItems.forEach((item, index) => {
      if (menuKeys[index]) {
        item.textContent = menuTranslation[menuKeys[index]];
      }
    });
  }

  // 更新頁面標題
  updatePageTitle(title) {
    document.title = title;
  }

  // 更新通用內容
  updateCommonContent(content) {
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

  // 更新頁面特定內容
  updatePageSpecificContent(content, pageType) {
    switch (pageType) {
      case 'info':
        this.updateInfoPage(content.info);
        break;
      case 'index':
        this.updatePracticePage(content.practice);
        break;
      case 'exam':
        this.updateExamPage(content.exam);
        break;
      case 'history':
        this.updateHistoryPage(content.history);
        break;
      case 'team':
        this.updateTeamPage(content.team);
        break;
      case 'quiz':
        this.updateQuizPage(content.quiz);
        break;
    }
  }

  // 更新資訊頁面
  updateInfoPage(infoContent) {
    // Hero Section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = infoContent.hero.title;

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = infoContent.hero.description;

    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) learnMoreBtn.textContent = infoContent.hero.learnMoreButton;

    // 流程圖標題
    const flowchartTitle = document.querySelector('.section-white .section-title');
    if (flowchartTitle) flowchartTitle.textContent = infoContent.flowchart.title;

    // 情境案例標題
    const scenariosTitle = document.querySelector('.section-purple .section-title');
    if (scenariosTitle) scenariosTitle.textContent = infoContent.scenarios.title;

    // 情境卡片
    const scenarioTitles = document.querySelectorAll('.scenario-title');
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    const scenarioData = [
      infoContent.scenarios.cardiac,
      infoContent.scenarios.poisoning,
      infoContent.scenarios.drowning,
      infoContent.scenarios.fire,
      infoContent.scenarios.trauma
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

    // 模態框標題
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = infoContent.treatmentModal.title;

    // 處理措施數據
    window.treatmentData = infoContent.treatmentData;

    // 按鈕文字
    const practiceBtn = document.querySelector('.practice-btn');
    if (practiceBtn) practiceBtn.textContent = infoContent.buttons.practice;

    const examBtn = document.querySelector('.exam-btn');
    if (examBtn) examBtn.textContent = infoContent.buttons.exam;
  }

  // 更新練習專區頁面
  updatePracticePage(practiceContent) {
    const practiceTitle = document.querySelector('.practice-homepage h1');
    if (practiceTitle) practiceTitle.textContent = practiceContent.title;

    const practiceDescription = document.querySelector('.practice-homepage p');
    if (practiceDescription) practiceDescription.textContent = practiceContent.description;

    // 360°影片區段
    const videoSectionTitle = document.querySelector('.section-header h2');
    if (videoSectionTitle && videoSectionTitle.textContent.includes('360')) {
      videoSectionTitle.innerHTML = `<i class="fas fa-video"></i> ${practiceContent.videoSection.title}`;
    }

    const videoSectionDescription = document.querySelector('.section-header p');
    if (videoSectionDescription) {
      videoSectionDescription.textContent = practiceContent.videoSection.description;
    }

    // 虛擬人互動區段
    const virtualHumanTitle = document.querySelector('.virtual-human-section .section-header h2');
    if (virtualHumanTitle) {
      virtualHumanTitle.innerHTML = `<i class="fas fa-comment-dots"></i> ${practiceContent.virtualHumanSection.title}`;
    }

    const virtualHumanDescription = document.querySelector('.virtual-human-section .section-header p');
    if (virtualHumanDescription) {
      virtualHumanDescription.textContent = practiceContent.virtualHumanSection.description;
    }
  }

  // 更新考試專區頁面
  updateExamPage(examContent) {
    // 筆試測驗卡片
    const writtenTestTitle = document.querySelector('.exam-card h3');
    if (writtenTestTitle) writtenTestTitle.textContent = examContent.writtenTest.title;

    const writtenTestDescription = document.querySelector('.exam-card p');
    if (writtenTestDescription) writtenTestDescription.textContent = examContent.writtenTest.description;

    const writtenTestButton = document.querySelector('.exam-card .exam-btn');
    if (writtenTestButton) writtenTestButton.textContent = examContent.writtenTest.startButton;

    // 情境測驗卡片
    const scenarioTestTitle = document.querySelectorAll('.exam-card h3')[1];
    if (scenarioTestTitle) scenarioTestTitle.textContent = examContent.scenarioTest.title;

    const scenarioTestDescription = document.querySelectorAll('.exam-card p')[1];
    if (scenarioTestDescription) scenarioTestDescription.textContent = examContent.scenarioTest.description;

    const scenarioTestButton = document.querySelectorAll('.exam-card .exam-btn')[1];
    if (scenarioTestButton) scenarioTestButton.textContent = examContent.scenarioTest.startButton;
  }

  // 更新歷史成績頁面
  updateHistoryPage(historyContent) {
    const historyTitle = document.querySelector('.history-section h1');
    if (historyTitle) historyTitle.textContent = historyContent.title;

    const historyDescription = document.querySelector('.history-section p');
    if (historyDescription) historyDescription.textContent = historyContent.description;

    // 更新表格標題
    const tableHeaders = document.querySelectorAll('th');
    if (tableHeaders.length >= 5) {
      tableHeaders[0].textContent = historyContent.tableHeaders.date;
      tableHeaders[1].textContent = historyContent.tableHeaders.testType;
      tableHeaders[2].textContent = historyContent.tableHeaders.score;
      tableHeaders[3].textContent = historyContent.tableHeaders.time;
      tableHeaders[4].textContent = historyContent.tableHeaders.status;
    }
  }

  // 更新團隊頁面
  updateTeamPage(teamContent) {
    const teamTitle = document.querySelector('.team-section h1');
    if (teamTitle) teamTitle.textContent = teamContent.title;

    const teamDescription = document.querySelector('.team-section p');
    if (teamDescription) teamDescription.textContent = teamDescription;
  }

  // 更新筆試測驗頁面
  updateQuizPage(quizContent) {
    const quizTitle = document.querySelector('.quiz-title');
    if (quizTitle) quizTitle.textContent = quizTitle;

    const quizDescription = document.querySelector('.quiz-description');
    if (quizDescription) quizDescription.textContent = quizContent.description;

    const startButton = document.querySelector('.start-quiz-btn');
    if (startButton) startButton.textContent = quizContent.startButton;

    // 更新測驗結果相關文字
    window.quizTranslations = quizContent.results;
    window.quizExitMessage = quizContent.exitConfirmation;

    // 如果是測驗進行中，處理語言切換
    if (typeof window.handleQuizLanguageSwitch === 'function') {
      window.handleQuizLanguageSwitch();
    }
  }

  // 更新圖片路徑
  updateImages(lang) {
    // 圖片路徑保持中文版本（因為只有中文版本的圖片文件）
    // 這裡可以根據需要添加圖片切換邏輯
  }

  // 通知觀察者
  notifyObservers(lang) {
    this.observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer(lang);
      }
    });
  }

  // 添加觀察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 移除觀察者
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // 獲取當前語言
  getCurrentLanguage() {
    return this.currentLang;
  }

  // 設置語言
  setLanguage(lang) {
    if (lang === 'zh' || lang === 'en') {
      this.currentLang = lang;
      localStorage.setItem('pbls_language', lang);
      this.applyLanguage(lang);
    }
  }
}

// 創建全局實例
window.globalLanguageManager = new GlobalLanguageManager();

// 全局函數供 HTML 調用
window.toggleLanguage = function() {
  window.globalLanguageManager.toggleLanguage();
};

// 頁面載入時確保語言同步
document.addEventListener('DOMContentLoaded', function() {
  // 延遲執行以確保所有元素都已載入
  setTimeout(() => {
    window.globalLanguageManager.syncLanguage();
  }, 100);
});

// 導出供其他模塊使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalLanguageManager;
}
