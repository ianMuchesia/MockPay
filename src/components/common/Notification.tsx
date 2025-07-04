import React, { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  isVisible: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000, // Default 5 seconds
  onClose,
  isVisible,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && duration > 0) {
      // Start countdown animation
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          handleClose();
        }
      }, 10);
      
      setIntervalId(interval);
      
      // Auto-close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        if (interval) clearInterval(interval);
      };
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Animation duration
  };

  const getNotificationStyles = () => {
    let styles = {
      icon: <></>,
      bgClass: '',
      borderClass: '',
      progressClass: '',
    };

    switch (type) {
      case 'success':
        styles.bgClass = 'bg-green-50 dark:bg-green-900/20';
        styles.borderClass = 'border-green-500';
        styles.progressClass = 'bg-green-500';
        styles.icon = (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
        break;
      case 'error':
        styles.bgClass = 'bg-red-50 dark:bg-red-900/20';
        styles.borderClass = 'border-red-500';
        styles.progressClass = 'bg-red-500';
        styles.icon = (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
        break;
      case 'warning':
        styles.bgClass = 'bg-yellow-50 dark:bg-yellow-900/20';
        styles.borderClass = 'border-yellow-500';
        styles.progressClass = 'bg-yellow-500';
        styles.icon = (
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-800/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
        break;
      case 'info':
      default:
        styles.bgClass = 'bg-blue-50 dark:bg-blue-900/20';
        styles.borderClass = 'border-blue-500';
        styles.progressClass = 'bg-blue-500';
        styles.icon = (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
    
    return styles;
  };

  const styles = getNotificationStyles();

 return (
  <div 
    className={`max-w-sm w-full ${styles.bgClass} rounded-lg shadow-lg border-l-4 ${styles.borderClass} overflow-hidden
    transform transition-all duration-300 ease-in-out ${isVisible && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    role="alert"
    aria-live="assertive"
  >
    <div className="relative">
      <div className="p-4">
        <div className="flex items-start">
          {styles.icon}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full ${styles.progressClass} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  </div>
);
}

export default Notification;
