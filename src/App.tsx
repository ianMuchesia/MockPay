import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import './main.css'; // Tailwind CSS import
import NotificationProvider from './components/common/NotificationProvider';

const App: React.FC = () => {
  // Apply global theme settings
  useEffect(() => {
    // Check for user dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  
  return (
    <Provider store={store}>
      <NotificationProvider position="top-right" maxNotifications={3}>
        <AppRoutes />
      </NotificationProvider>
    </Provider>
  );
}

export default App;