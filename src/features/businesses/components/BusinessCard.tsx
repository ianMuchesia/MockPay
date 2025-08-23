import React from 'react';
import type {  Business } from '../businessApi';
import { useNavigate } from 'react-router-dom';


interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const navigate = useNavigate();
  const primaryPhoto = business.businessPhotos?.[0]?.photoURL || '/api/placeholder/300/200';
  const rating = business.reviewsData?.rating || 0;
  const reviewCount = business.reviewsData?.count || 0;

  return (
    <div className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
      business.isSponsored ? 'ring-2 ring-primary/20 shadow-lg' : ''
    }`}>
      {/* Sponsored Badge */}
      {business.isSponsored && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
            <i className="fas fa-star mr-1"></i>
            Featured
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/300/200';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Tags */}
        {business.businessSubCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {business.businessSubCategories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
              >
                {category.subCategoryName}
              </span>
            ))}
            {business.businessSubCategories.length > 2 && (
              <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md">
                +{business.businessSubCategories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Business Name */}
        <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {business.name}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {business.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-neutral-500 text-sm mb-4">
          <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
          <span className="line-clamp-1">{business.address}, {business.city}</span>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star text-sm ${
                    i < Math.floor(rating) ? 'text-amber-400' : 'text-neutral-300'
                  }`}
                ></i>
              ))}
            </div>
            <span className="ml-2 text-sm text-neutral-600">
              {rating > 0 ? `${rating.toFixed(1)} (${reviewCount})` : 'No reviews'}
            </span>
          </div>
          {business.isVerified && (
            <div className="flex items-center text-green-600">
              <i className="fas fa-check-circle text-sm mr-1"></i>
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200" onClick={()=>navigate(`/businesses/${business.businessID}`)}>
          <i className="fas fa-eye mr-2"></i>
          View Details
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;