import React from 'react';

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'info' 
  | 'light' 
  | 'dark';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  outline?: boolean;
  className?: string;
  dot?: boolean;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  rounded = false,
  outline = false,
  className = '',
  dot = false,
  onClick,
}) => {
  const getVariantClasses = (): string => {
    if (outline) {
      switch (variant) {
        case 'primary':
          return 'bg-transparent text-primary border-primary dark:text-primary-light dark:border-primary-light';
        case 'secondary':
          return 'bg-transparent text-secondary border-secondary dark:text-secondary-light dark:border-secondary-light';
        case 'success':
          return 'bg-transparent text-green-600 border-green-600 dark:text-green-400 dark:border-green-400';
        case 'danger':
          return 'bg-transparent text-red-600 border-red-600 dark:text-red-400 dark:border-red-400';
        case 'warning':
          return 'bg-transparent text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400';
        case 'info':
          return 'bg-transparent text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400';
        case 'light':
          return 'bg-transparent text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600';
        case 'dark':
          return 'bg-transparent text-gray-800 border-gray-800 dark:text-gray-200 dark:border-gray-300';
        default:
          return 'bg-transparent text-primary border-primary dark:text-primary-light dark:border-primary-light';
      }
    }

    switch (variant) {
      case 'primary':
        return 'bg-primary text-white dark:bg-primary-light dark:text-gray-900';
      case 'secondary':
        return 'bg-secondary text-white dark:bg-secondary-light dark:text-gray-900';
      case 'success':
        return 'bg-green-600 text-white dark:bg-green-500';
      case 'danger':
        return 'bg-red-600 text-white dark:bg-red-500';
      case 'warning':
        return 'bg-yellow-500 text-white dark:bg-yellow-400 dark:text-gray-900';
      case 'info':
        return 'bg-blue-600 text-white dark:bg-blue-500';
      case 'light':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'dark':
        return 'bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-primary text-white dark:bg-primary-light dark:text-gray-900';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'xs':
        return 'text-xs py-0.5 px-1.5';
      case 'sm':
        return 'text-xs py-1 px-2';
      case 'md':
        return 'text-sm py-1 px-2.5';
      case 'lg':
        return 'text-base py-1.5 px-3';
      default:
        return 'text-xs py-1 px-2';
    }
  };

  const badgeClasses = `
    inline-flex items-center justify-center
    font-medium
    ${rounded ? 'rounded-full' : 'rounded'}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${outline ? 'border' : ''}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;

  return (
    <span 
      className={badgeClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current mr-1.5 ${size === 'xs' ? 'w-1 h-1' : ''}`}></span>
      )}
      {children}
    </span>
  );
};

export default Badge;
