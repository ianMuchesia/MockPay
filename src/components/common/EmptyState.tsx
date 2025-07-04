import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'default',
  className = '',
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg 
      className="w-12 h-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="1.5" 
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
      />
    </svg>
  );

  return (
    <div 
      className={`flex flex-col items-center justify-center ${
        variant === 'compact' ? 'p-6' : 'p-10'
      } bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center ${className}`}
    >
      <div className={`${variant === 'compact' ? 'mb-3' : 'mb-6'}`}>
        {icon || defaultIcon}
      </div>
      
      <h3 className={`font-semibold text-gray-900 dark:text-white ${variant === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'}`}>
        {title}
      </h3>
      
      {description && (
        <p className={`text-gray-600 dark:text-gray-400 ${variant === 'compact' ? 'text-sm mb-3 max-w-xs' : 'mb-6 max-w-md'}`}>
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className={`
            inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark 
            text-white font-medium rounded-md transition-colors
            ${variant === 'compact' ? 'text-xs' : 'text-sm'}
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
