import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import AuthForm from '@/components/AuthForm';
import { onAuthStateChange } from '@/firebase/auth';
import { User } from 'firebase/auth';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 監聽認證狀態變化
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        // 如果已經登入，重定向到首頁
        window.location.href = '/';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSuccess = () => {
    // 認證成功後會觸發認證狀態變化，自動重定向
  };

  if (user) {
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
            登入成功！
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            正在重定向到首頁...
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* 背景裝飾 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
        `
      }} />

      <motion.div
        style={{ position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 歡迎文字 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <motion.h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            歡迎來到 PBLS VR教學平台
          </motion.h1>
          <motion.p
            style={{
              fontSize: '18px',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            小兒基本生命支持（PBLS）專業培訓平台，提供完整的理論學習、流程操作與情境模擬
          </motion.p>
        </div>

        {/* 認證表單 */}
        <AuthForm 
          mode={mode} 
          onModeChange={setMode}
          onSuccess={handleSuccess}
        />

        {/* 功能特色 */}
        <motion.div
          style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            color: 'white'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '10px'
            }}>
              📚
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              理論學習
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              完整的PBLS理論知識體系
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '10px'
            }}>
              🎯
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              流程操作
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              系統化的操作流程訓練
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '10px'
            }}>
              🎮
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              情境模擬
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              多種真實情境模擬練習
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
