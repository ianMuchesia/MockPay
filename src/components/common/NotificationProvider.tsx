import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { NotificationType } from './Notification';
import Notification from './Notification';


interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ) => void;
  hideNotification: (id: string) => void;
  hideAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = 'top-right',
  maxNotifications = 3,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000 // Default 5 seconds
  ) => {
    const id = uuidv4();
    
    // Add new notification
    setNotifications((prev) => {
      // Ensure we don't exceed maxNotifications
      const filteredNotifications = prev.length >= maxNotifications
        ? prev.slice(0, maxNotifications - 1)
        : prev;
        
      return [
        ...filteredNotifications,
        {
          id,
          type,
          title,
          message,
          duration,
          isVisible: true,
        },
      ];
    });
    
    // If duration is set to 0, notification won't auto-close
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  };

  const hideNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isVisible: false } : notification
      )
    );
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 500);
  };

  const hideAllNotifications = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isVisible: false }))
    );
    
    // Remove all from DOM after animation
    setTimeout(() => {
      setNotifications([]);
    }, 500);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, hideAllNotifications }}>
      {children}
      <div
        className={`fixed ${positionClasses[position]} p-4 space-y-3 z-50 pointer-events-none w-full sm:max-w-sm`}
        aria-live="assertive"
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              onClose={hideNotification}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationProvider;
