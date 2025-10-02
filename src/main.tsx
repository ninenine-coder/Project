import React from 'react';
import { createRoot } from 'react-dom/client';
import './lib/i18n'; // 引入 i18n 配置
import PBLSKnowledgeBase from './components/PBLSKnowledgeBase';

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

// 渲染應用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PBLSKnowledgeBase />);
} else {
  console.error('Root element not found');
}
