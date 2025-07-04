import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  initials?: string;
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  status = 'none',
  initials,
  rounded = true,
  className = '',
  onClick,
}) => {
  // Size classes
  const getSizeClasses = (): string => {
    switch (size) {
      case 'xs': return 'w-6 h-6 text-xs';
      case 'sm': return 'w-8 h-8 text-sm';
      case 'md': return 'w-10 h-10 text-base';
      case 'lg': return 'w-12 h-12 text-lg';
      case 'xl': return 'w-16 h-16 text-xl';
      default: return 'w-10 h-10 text-base';
    }
  };

  // Status indicator classes and position
  const getStatusClasses = (): string => {
    if (status === 'none') return '';
    
    let color = '';
    switch (status) {
      case 'online': color = 'bg-green-500'; break;
      case 'offline': color = 'bg-gray-500'; break;
      case 'away': color = 'bg-yellow-500'; break;
      case 'busy': color = 'bg-red-500'; break;
      default: color = '';
    }
    
    // Status dot size based on avatar size
    let dotSize = '';
    switch (size) {
      case 'xs': dotSize = 'w-1.5 h-1.5'; break;
      case 'sm': dotSize = 'w-2 h-2'; break;
      case 'md': dotSize = 'w-2.5 h-2.5'; break;
      case 'lg': dotSize = 'w-3 h-3'; break;
      case 'xl': dotSize = 'w-3.5 h-3.5'; break;
      default: dotSize = 'w-2.5 h-2.5';
    }
    
    return `${color} ${dotSize} absolute ring-2 ring-white dark:ring-gray-800 rounded-full`;
  };
  
  // Status position
  const getStatusPosition = (): string => {
    return 'bottom-0 right-0';
  };
  
  // Generate background color based on initials
  const getInitialsBgColor = (): string => {
    if (!initials) return 'bg-primary';
    
    // Simple hash function for consistent color
    const hash = [...initials].reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // List of background colors
    const colors = [
      'bg-primary',
      'bg-secondary',
      'bg-pink-600',
      'bg-blue-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-red-600',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-600',
      'bg-green-600',
      'bg-teal-600',
      'bg-cyan-600',
    ];
    
    return colors[hash % colors.length];
  };
  
  return (
    <div 
      className={`inline-flex relative ${getSizeClasses()} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`object-cover ${rounded ? 'rounded-full' : 'rounded-md'} ${getSizeClasses()}`}
        />
      ) : (
        <div 
          className={`${getInitialsBgColor()} text-white flex items-center justify-center font-medium ${rounded ? 'rounded-full' : 'rounded-md'} ${getSizeClasses()}`}
          aria-label={alt}
        >
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}
      
      {status !== 'none' && (
        <span className={`${getStatusClasses()} ${getStatusPosition()}`}></span>
      )}
    </div>
  );
};

export default Avatar;
