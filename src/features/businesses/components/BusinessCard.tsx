import React from 'react';
import { Link } from 'react-router-dom';

interface BusinessCardProps {
  business: {
    businessID: string;
    name: string;
    description: string;
    address: string;
    city?: string;
    country?: string;
    businessPhotos: { photoURL: string; }[];
  };
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const imageUrl = business.businessPhotos?.[0]?.photoURL || 'https://via.placeholder.com/300x200?text=No+Image';
  
  // Generate a random rating between 3.5 and 5.0 for demo purposes
  const randomRating = (3.5 + Math.random() * 1.5).toFixed(1);
  
  return (
    <div className="card group">
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={imageUrl} 
            alt={business.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-white text-primary shadow-md flex items-center gap-1 font-semibold">
            <i className="fas fa-star text-yellow-500"></i>
            {randomRating}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl text-neutral-800 group-hover:text-primary transition-colors">
            {business.name}
          </h3>
        </div>
        
        <p className="text-neutral-600 text-sm my-3 line-clamp-2">
          {business.description}
        </p>
        
        <div className="flex items-center text-neutral-500 text-sm mb-4">
          <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
          <span className="truncate">{business.address}{business.city ? `, ${business.city}` : ''}</span>
        </div>
        
        {/* Tags - we'll create some random tags for visual appeal */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['Subscription', 'Service', 'Local'].map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/dashboard/subscribe/${business.businessID}`}
            className="btn-primary py-2"
          >
            <i className="fas fa-handshake mr-2"></i>
            Subscribe
          </Link>
          <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
            <i className="fas fa-bookmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
};



export default BusinessCard;