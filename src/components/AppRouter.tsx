import React from 'react';
import PBLSKnowledgeBase from './PBLSKnowledgeBase';
import Login from '@/pages/Login';

interface AppRouterProps {
  currentPath: string;
}

const AppRouter: React.FC<AppRouterProps> = ({ currentPath }) => {
  // 根據當前路徑渲染對應的組件
  switch (currentPath) {
    case '/login':
      return <Login />;
    case '/':
    case '/info':
    default:
      return <PBLSKnowledgeBase />;
  }
};

export default AppRouter;
