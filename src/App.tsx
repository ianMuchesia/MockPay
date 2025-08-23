import React, { useEffect } from 'react';

import AppRoutes from './routes/AppRoutes';
import './main.css'; // Tailwind CSS import
import NotificationProvider from './components/common/NotificationProvider';

import { setCredentials } from './features/auth/authSlice';
import { useAppDispatch } from './hooks/reduxHooks';
import { SessionStorageManager } from './utils/SessionStorageManager';


const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    SessionStorageManager.cleanupExpiredItems();

    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (token && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ token, refreshToken, user }));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);
useEffect(() => {
    // Remove all dark mode logic and just set smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  
  return (
    
      <NotificationProvider position="top-right" maxNotifications={3}>
        <AppRoutes />
      </NotificationProvider>

  );
}

export default App;