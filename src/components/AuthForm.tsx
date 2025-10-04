import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle 
} from '@/firebase/auth';

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange, onSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error);
        }
      } else {
        // 註冊模式
        if (password !== confirmPassword) {
          setError('密碼確認不匹配');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('密碼長度至少需要6個字符');
          setLoading(false);
          return;
        }
        
        const result = await signUpWithEmail(email, password);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Google登入失敗');
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <motion.div
      className="auth-form-container"
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '40px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          {isLogin ? '登入' : '註冊'}
        </h2>
        <p style={{
          color: '#7f8c8d',
          fontSize: '14px'
        }}>
          {isLogin ? '歡迎回來！' : '創建新帳戶'}
        </p>
      </div>

      {error && (
        <motion.div
          style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            電子郵件
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            密碼
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              確認密碼
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading 
              ? '#bdc3c7' 
              : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '10px'
              }} />
              處理中...
            </div>
          ) : (
            isLogin ? '登入' : '註冊'
          )}
        </motion.button>
      </form>

      <div style={{
        borderTop: '1px solid #e9ecef',
        paddingTop: '20px',
        textAlign: 'center'
      }}>
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            color: '#333',
            border: '2px solid #e9ecef',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: googleLoading ? 0.6 : 1
          }}
          whileHover={!googleLoading ? { scale: 1.02 } : {}}
          whileTap={!googleLoading ? { scale: 0.98 } : {}}
        >
          {googleLoading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(0,0,0,0.3)',
                borderTop: '2px solid #333',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }} />
              Google登入中...
            </div>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
          使用Google登入
            </>
          )}
        </motion.button>

        <p style={{
          fontSize: '14px',
          color: '#7f8c8d',
          margin: 0
        }}>
          {isLogin ? '還沒有帳戶？' : '已經有帳戶？'}
          <button
            type="button"
            onClick={() => onModeChange(isLogin ? 'register' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3498db',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginLeft: '5px',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? '立即註冊' : '立即登入'}
          </button>
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </motion.div>
  );
};

export default AuthForm;
