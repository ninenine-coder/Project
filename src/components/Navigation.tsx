import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { logout } from '@/firebase/auth';
import { User } from 'firebase/auth';

interface NavigationProps {
  user: User | null;
  onLoginClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLoginClick }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // 登出成功後會觸發認證狀態變化，組件會自動更新
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '0 20px'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
              PBLS
            </span>
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            PBLS VR教學平台
          </span>
        </motion.div>

        {/* 右側按鈕組 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* 語言切換按鈕 */}
          <motion.button
            onClick={toggleLanguage}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </motion.button>

          {/* 用戶狀態 */}
          {user ? (
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(52, 152, 219, 0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(52, 152, 219, 0.2)'
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  lineHeight: 1.2
                }}>
                  {user.displayName || user.email?.split('@')[0] || '用戶'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: 1.2
                }}>
                  {user.email}
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                style={{
                  background: 'rgba(231, 76, 60, 0.1)',
                  color: '#e74c3c',
                  border: '1px solid rgba(231, 76, 60, 0.3)',
                  borderRadius: '15px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(231, 76, 60, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                登出
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              onClick={onLoginClick}
              style={{
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(52, 152, 219, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              登入
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
