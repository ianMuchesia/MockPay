import React, { useState } from 'react';
import type { SingleBusiness } from '../businessApi';

interface BusinessDetailsProps {
  business: SingleBusiness;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business }) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const displayedAttributes = showAllAttributes 
    ? business.businessAttributes 
    : business.businessAttributes.slice(0, 6);

  const displayedTags = showAllTags 
    ? business.businessTags 
    : business.businessTags.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">About {business.name}</h2>
        <p className="text-neutral-700 leading-relaxed text-lg">
          {business.description}
        </p>
      </div>

      {/* Business Notices */}
      {business.businessNotices && business.businessNotices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Important Notices</h2>
          <div className="space-y-3">
            {business.businessNotices.map((notice, index) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
                  <p className="text-blue-800">{notice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attributes */}
      {business.businessAttributes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Services & Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedAttributes.map((attribute, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-neutral-50 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-check text-primary"></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800">{attribute.attributeName}</h3>
                  {attribute.attributeValue && (
                    <p className="text-sm text-neutral-600">{attribute.attributeValue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {business.businessAttributes.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllAttributes(!showAllAttributes)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {showAllAttributes ? 'Show Less' : `Show ${business.businessAttributes.length - 6} More Services`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {business.businessTags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Specialties & Tags</h2>
          <div className="flex flex-wrap gap-3">
            {displayedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary rounded-full font-medium hover:from-primary/20 hover:to-primary-light/20 transition-all"
              >
                <i className="fas fa-tag mr-2 text-sm"></i>
                {tag.tagName.trim()}
              </span>
            ))}
          </div>
          
          {business.businessTags.length > 8 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {showAllTags ? 'Show Less' : `Show ${business.businessTags.length - 8} More Tags`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Business Association */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Business Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl text-center ${
            business.businessAssociation.addedToMall 
              ? 'bg-green-50 text-green-800' 
              : 'bg-neutral-50 text-neutral-600'
          }`}>
            <i className={`fas fa-building text-2xl mb-2 ${
              business.businessAssociation.addedToMall ? 'text-green-600' : 'text-neutral-400'
            }`}></i>
            <p className="font-medium">Mall Location</p>
            <p className="text-sm">
              {business.businessAssociation.addedToMall ? 'Available' : 'Not Available'}
            </p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            business.businessAssociation.addedToPetrolStation 
              ? 'bg-green-50 text-green-800' 
              : 'bg-neutral-50 text-neutral-600'
          }`}>
            <i className={`fas fa-gas-pump text-2xl mb-2 ${
              business.businessAssociation.addedToPetrolStation ? 'text-green-600' : 'text-neutral-400'
            }`}></i>
            <p className="font-medium">Petrol Station</p>
            <p className="text-sm">
              {business.businessAssociation.addedToPetrolStation ? 'Available' : 'Not Available'}
            </p>
          </div>
          
          <div className={`p-4 rounded-xl text-center ${
            business.businessAssociation.hasBrands 
              ? 'bg-green-50 text-green-800' 
              : 'bg-neutral-50 text-neutral-600'
          }`}>
            <i className={`fas fa-award text-2xl mb-2 ${
              business.businessAssociation.hasBrands ? 'text-green-600' : 'text-neutral-400'
            }`}></i>
            <p className="font-medium">Brand Partners</p>
            <p className="text-sm">
              {business.businessAssociation.hasBrands ? 'Available' : 'Not Available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;