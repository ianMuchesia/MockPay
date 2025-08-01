import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import './main.css'; // Tailwind CSS import
import NotificationProvider from './components/common/NotificationProvider';


const App: React.FC = () => {
  // Apply global theme settings
useEffect(() => {
    // Remove all dark mode logic and just set smooth scrolling
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