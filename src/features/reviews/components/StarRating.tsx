import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  readonly = false,
  showValue = false,
  className = ''
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const getStarClass = (starIndex: number) => {
    const currentRating = hoveredRating || rating;
    
    if (starIndex <= currentRating) {
      if (readonly) {
        return 'text-amber-400';
      }
      return hoveredRating ? 'text-amber-500' : 'text-amber-400';
    }
    
    return readonly ? 'text-neutral-300' : 'text-neutral-300 hover:text-amber-300';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div 
        className="flex items-center space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${sizeClasses[size]} ${getStarClass(star)} transition-all duration-200 ${
              !readonly ? 'cursor-pointer transform hover:scale-110' : 'cursor-default'
            } focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 rounded`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-neutral-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
      
      {!readonly && hoveredRating > 0 && (
        <span className="ml-3 text-neutral-500 text-sm font-medium">
          {hoveredRating} star{hoveredRating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;