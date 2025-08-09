import React from 'react';

interface BannerStatusBadgeProps {
  status: 'ACTIVE' | 'PENDING' | 'PAUSED' | 'EXPIRED' | 'DRAFT' | 'REJECTED';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const BannerStatusBadge: React.FC<BannerStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: 'fa-check-circle',
          iconColor: 'text-green-600',
          label: 'Active',
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: 'fa-clock',
          iconColor: 'text-yellow-600',
          label: 'Pending',
        };
      case 'PAUSED':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'fa-pause-circle',
          iconColor: 'text-gray-600',
          label: 'Paused',
        };
      case 'EXPIRED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: 'fa-times-circle',
          iconColor: 'text-red-600',
          label: 'Expired',
        };
      case 'DRAFT':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: 'fa-edit',
          iconColor: 'text-blue-600',
          label: 'Draft',
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: 'fa-exclamation-triangle',
          iconColor: 'text-red-600',
          label: 'Rejected',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'fa-question-circle',
          iconColor: 'text-gray-600',
          label: status,
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.color} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <i className={`fas ${config.icon} ${config.iconColor}`}></i>
      )}
      {config.label}
    </span>
  );
};

export default BannerStatusBadge;