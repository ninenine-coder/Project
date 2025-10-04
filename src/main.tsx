import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/i18n'; // 引入 i18n 配置
import AppRouter from './components/AppRouter';

// 添加 FontAwesome 圖標
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(link);

// 添加全局樣式
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Microsoft JhengHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f8f9fa;
  }
  
  #root {
    width: 100%;
    min-height: 100vh;
  }
  
  .language-switcher:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  }
`;
document.head.appendChild(style);

// 主要應用組件
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // 監聽路由變化
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // 監聽瀏覽器前進/後退
    window.addEventListener('popstate', handleRouteChange);

    // 監聽點擊事件（處理內部連結）
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, '', path);
        setCurrentPath(path);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <AppRouter currentPath={currentPath} />;
};

// 渲染應用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
