
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  };
  footer?: React.ReactNode;
  isHoverable?: boolean;
  isBordered?: boolean;
  isCompact?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  footer,
  isHoverable = false,
  isBordered = false,
  isCompact = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm overflow-hidden';
  const hoverClasses = isHoverable ? 'transition-all duration-300 hover:shadow-md' : '';
  const borderClasses = isBordered ? 'border border-neutral-200' : '';
  
  const badgeVariantClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${borderClasses} ${className}`}>
      {/* Card Header (if title or subtitle exists) */}
      {(title || subtitle) && (
        <div className={`${isCompact ? 'p-4' : 'p-6'} pb-0`}>
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
              {subtitle && <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>}
            </div>
            {badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                badgeVariantClasses[badge.variant || 'primary']
              }`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Card Body */}
      <div className={isCompact ? 'p-4' : 'p-6'}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`${isCompact ? 'px-4 py-3' : 'px-6 py-4'} bg-neutral-50 border-t border-neutral-100`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;