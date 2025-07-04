import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'confirmation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
  size = 'md',
  primaryAction,
  secondaryAction,
  closeOnClickOutside = true,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isVisible) return null;

  // Modal styling based on type
  const getModalStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'border-green-500',
          titleColor: 'text-green-600',
          icon: (
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )
        };
      case 'error':
        return {
          borderColor: 'border-red-500',
          titleColor: 'text-red-600',
          icon: (
            <div className="bg-red-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )
        };
      case 'warning':
        return {
          borderColor: 'border-yellow-500',
          titleColor: 'text-yellow-600',
          icon: (
            <div className="bg-yellow-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )
        };
      case 'confirmation':
        return {
          borderColor: 'border-indigo-500',
          titleColor: 'text-indigo-600',
          icon: (
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )
        };
      default: // info
        return {
          borderColor: 'border-blue-500',
          titleColor: 'text-blue-600',
          icon: (
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )
        };
    }
  };

  const modalStyles = getModalStyles();
  
  // Modal size
  const getModalSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default:   return 'max-w-md'; // md is default
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${getModalSizeClass()} transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className={`border-t-4 ${modalStyles.borderColor} rounded-t-lg`}></div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              {modalStyles.icon}
              <h3 className={`text-xl font-semibold ${modalStyles.titleColor}`}>{title}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            {children}
          </div>
          
          {(primaryAction || secondaryAction) && (
            <div className="flex justify-end space-x-3 mt-6">
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {secondaryAction.label}
                </button>
              )}
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {primaryAction.label}
                </button>
              )}
              {!primaryAction && !secondaryAction && (
                <button
                  onClick={onClose}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;