import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { onAuthStateChange } from '@/firebase/auth';
import { User } from 'firebase/auth';
import Navigation from './Navigation';

// 語言切換按鈕組件
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
      }}
    >
      {i18n.language === 'zh' ? 'EN' : '中文'}
    </button>
  );
};

// 情境卡片組件
interface ScenarioCardProps {
  title: string;
  description: string;
  imagePath: string;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, description, imagePath }) => {
  return (
    <motion.div
      className="scenario-card"
      style={{
        background: 'white',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={imagePath} 
        alt={title}
        style={{
          width: '100%',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '15px',
          marginBottom: '15px'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) {
            placeholder.style.display = 'flex';
          }
        }}
      />
      <div 
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '120px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '15px',
          marginBottom: '15px',
          color: 'white',
          fontSize: '24px'
        }}
      >
        <i className="fas fa-heartbeat"></i>
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#2c3e50'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#7f8c8d',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </motion.div>
  );
};

// 主要組件
const PBLSKnowledgeBase: React.FC = () => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 背景圖片輪播
  const backgroundImages = [
    'assets/場景1.png',
    'assets/場景2.png', 
    'assets/場景3.png',
    'assets/場景4.png'
  ];

  useEffect(() => {
    // 監聽認證狀態變化
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // 根據語言獲取流程圖圖片路徑
  const getFlowchartImage = () => {
    const { i18n } = useTranslation();
    return i18n.language === 'zh' 
      ? '/PBLS流程圖.png' 
      : '/PBLS_Flowchart_EN.png';
  };

  // 根據語言獲取情境圖片路徑
  const getScenarioImage = (scenario: string) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'zh' ? '' : '_EN';
    return `assets/${scenario}情境${lang}.png`;
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  // 如果正在載入認證狀態
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <motion.div
          style={{
            textAlign: 'center',
            color: 'white'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto'
          }} />
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
            載入中...
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            正在檢查登入狀態
          </p>
        </motion.div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // 如果未登入，顯示登入提示
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Navigation user={user} onLoginClick={handleLoginClick} />
        
        <motion.div
          style={{
            textAlign: 'center',
            color: 'white',
            maxWidth: '600px',
            paddingTop: '100px'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            style={{
              fontSize: '80px',
              marginBottom: '30px'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          >
            🔒
          </motion.div>
          
          <motion.h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            請先登入
          </motion.h1>
          
          <motion.p
            style={{
              fontSize: '18px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.6'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            您需要登入才能使用PBLS VR教學平台的功能
          </motion.p>
          
          <motion.button
            onClick={handleLoginClick}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            立即登入
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // 已登入，顯示完整內容
  return (
    <div className="pbls-knowledge-base" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* 導航欄 */}
      <Navigation user={user} onLoginClick={handleLoginClick} />

      {/* 語言切換按鈕 */}
      <LanguageSwitcher />

      {/* 主要內容區域 */}
      <div style={{ paddingTop: '70px' }}>
        {/* Hero Section */}
        <motion.div
          className="hero-section"
          style={{
            position: 'relative',
            background: `url('${backgroundImages[currentImage]}') center/cover no-repeat`,
            padding: '100px 40px',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden',
            transition: 'all 0.8s ease-in-out'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '25px'
          }} />
          <motion.div
            style={{ position: 'relative', zIndex: 2 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '0 3px 6px rgba(0, 0, 0, 0.8)'
            }}>
              {t('hero.title')}
            </h1>
            <p style={{
              fontSize: '20px',
              maxWidth: '900px',
              margin: '0 auto 35px auto',
              lineHeight: '1.7',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
            }}>
              {t('hero.description')}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => {
                  const flowchartSection = document.getElementById('flowchart-section');
                  if (flowchartSection) {
                    flowchartSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                {t('hero.learnMore')}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 流程圖區 */}
        <section
          id="flowchart-section"
          style={{
            padding: '80px 40px',
            background: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '40px',
            color: '#2c3e50'
          }}>
            {t('flowchart.title')}
          </h2>
          <motion.img
            src={getFlowchartImage()}
            alt={t('flowchart.title')}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </section>

        {/* 五大情境模擬區 */}
        <section style={{
          padding: '80px 40px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '50px',
            color: '#2c3e50'
          }}>
            {t('scenarios.title')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <ScenarioCard
              title={t('scenarios.cardiac.title')}
              description={t('scenarios.cardiac.description')}
              imagePath={getScenarioImage('心臟驟停')}
            />
            <ScenarioCard
              title={t('scenarios.foodPoisoning.title')}
              description={t('scenarios.foodPoisoning.description')}
              imagePath={getScenarioImage('食物中毒')}
            />
            <ScenarioCard
              title={t('scenarios.drowning.title')}
              description={t('scenarios.drowning.description')}
              imagePath={getScenarioImage('溺水')}
            />
            <ScenarioCard
              title={t('scenarios.fireInjury.title')}
              description={t('scenarios.fireInjury.description')}
              imagePath={getScenarioImage('火災嗆傷')}
            />
            <ScenarioCard
              title={t('scenarios.trauma.title')}
              description={t('scenarios.trauma.description')}
              imagePath={getScenarioImage('外傷')}
            />
          </div>
        </section>

        {/* 模擬按鈕 */}
        <section style={{
          padding: '60px 40px',
          background: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = 'index.html'}
            >
              {t('buttons.practice')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = 'exam.html'}
            >
              {t('buttons.exam')}
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PBLSKnowledgeBase;