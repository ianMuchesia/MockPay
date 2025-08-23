import React from 'react';
import type { SingleBusiness } from '../businessApi';


interface BusinessHeaderProps {
  business: SingleBusiness;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${
          i < Math.floor(rating) ? 'text-amber-400' : 'text-neutral-300'
        }`}
      ></i>
    ));
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone formatting - adjust based on your needs
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 -mt-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Business Info */}
        <div>
          {/* Categories */}
          {business.businessSubCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {business.businessSubCategories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg font-medium"
                >
                  {category.subCategoryName}
                </span>
              ))}
              {business.businessSubCategories.length > 3 && (
                <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-lg">
                  +{business.businessSubCategories.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Business Name & Verification */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight">
              {business.name}
            </h1>
            {business.isVerified && (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-4">
                <i className="fas fa-check-circle mr-1"></i>
                Verified
              </div>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center mb-6">
            <div className="flex items-center mr-4">
              {renderStars(business.rating)}
            </div>
            <span className="text-xl font-semibold text-neutral-800 mr-2">
              {business.rating.toFixed(1)}
            </span>
            <span className="text-neutral-600">
              ({business.reviews.length} {business.reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Open/Closed Status */}
          <div className="flex items-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              business.openCloseHours.isOpen ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`font-semibold ${
              business.openCloseHours.isOpen ? 'text-green-700' : 'text-red-700'
            }`}>
              {business.openCloseHours.isOpen ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-neutral-600 ml-2">
              {business.openCloseHours.openingHours}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start mb-6">
            <i className="fas fa-map-marker-alt text-primary text-xl mr-3 mt-1"></i>
            <div>
              <p className="text-neutral-800 font-medium">{business.address}</p>
              <p className="text-neutral-600">{business.city}, {business.country}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact & Actions */}
        <div className="lg:pl-8">
          {/* Contact Info */}
          <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-phone text-primary"></i>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Phone</p>
                  <p className="font-medium text-neutral-800">{formatPhoneNumber(business.phoneNumber)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Email</p>
                  <p className="font-medium text-neutral-800">{business.email}</p>
                </div>
              </div>

              {business.website && (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-globe text-primary"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Website</p>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <i className="fas fa-star mr-2"></i>
              Write a Review
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
                <i className="fas fa-phone mr-2"></i>
                Call
              </button>
              <button className="bg-white border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
                <i className="fas fa-directions mr-2"></i>
                Directions
              </button>
            </div>
            
            <button className="w-full bg-white border-2 border-neutral-200 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors">
              <i className="fas fa-share-alt mr-2"></i>
              Share Business
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;