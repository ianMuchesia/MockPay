import React from 'react';
import type { Service } from '../../features/subscriptions/subscriptionApi';

interface ServiceCardProps {
  service: Service;
  onAdd: (serviceId: number) => void;
  isAdded: boolean;
  isFeatured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onAdd, isAdded, isFeatured = false }) => {
  // Calculate a unique color based on the service type and id
  const getServiceStyling = () => {
    const type = service.type;
    switch (type) {
      case 'ListingEnhancement':
        return {
          gradient: 'from-blue-500 via-blue-600 to-blue-700',
          icon: 'fa-star',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          category: 'Listing Boost',
          categoryBg: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'NotificationEnhancement':
        return {
          gradient: 'from-green-500 via-green-600 to-green-700',
          icon: 'fa-bell',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          category: 'Notifications',
          categoryBg: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'BannerDisplay':
        return {
          gradient: 'from-purple-500 via-purple-600 to-purple-700',
          icon: 'fa-bullhorn',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          category: 'Banner Ads',
          categoryBg: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      default:
        const colors = [
          {
            gradient: 'from-orange-500 via-orange-600 to-orange-700',
            icon: 'fa-cog',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            category: 'Enhancement',
            categoryBg: 'bg-orange-50 text-orange-700 border-orange-200'
          },
          {
            gradient: 'from-pink-500 via-pink-600 to-pink-700',
            icon: 'fa-magic',
            iconBg: 'bg-pink-100',
            iconColor: 'text-pink-600',
            category: 'Premium',
            categoryBg: 'bg-pink-50 text-pink-700 border-pink-200'
          },
          {
            gradient: 'from-indigo-500 via-indigo-600 to-indigo-700',
            icon: 'fa-bolt',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            category: 'Power-up',
            categoryBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }
        ];
        return colors[service.id % colors.length];
    }
  };

  const serviceStyle = getServiceStyling();

  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isAdded 
          ? 'border-2 border-primary ring-4 ring-primary/20 shadow-2xl' 
          : 'border border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Service Header */}
      <div className={`relative p-6 ${
        isFeatured 
          ? `bg-gradient-to-br ${serviceStyle.gradient}` 
          : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
      }`}>
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-2 py-1">
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                <i className="fas fa-crown mr-1"></i>
                Featured
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isFeatured ? 'bg-white/20 backdrop-blur-sm border border-white/30' : serviceStyle.iconBg
          }`}>
            <i className={`fas ${serviceStyle.icon} text-xl ${
              isFeatured ? 'text-white' : serviceStyle.iconColor
            }`}></i>
          </div>

          {!isFeatured && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${serviceStyle.categoryBg}`}>
              {serviceStyle.category}
            </div>
          )}
        </div>

        <h3 className={`font-bold text-xl mb-2 leading-tight ${
          isFeatured ? 'text-white' : 'text-neutral-800'
        }`}>
          {service.name}
        </h3>

        {isFeatured && (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 inline-block">
            <span className="text-sm font-medium text-white">
              {serviceStyle.category}
            </span>
          </div>
        )}
      </div>

      {/* Service Body */}
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-neutral-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {service.description}
        </p>
        
        {/* Service Details */}
        <div className="space-y-4 mb-6">
          {/* Pricing */}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-primary">
              KES {service.standalonePrice.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500 mb-1">
              /{service.standaloneBillingCycle.toLowerCase()}
            </span>
          </div>
          
          {/* Duration & Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neutral-600">
              <i className="fas fa-clock mr-2 text-neutral-400"></i>
              {service.standaloneDurationInDays} days duration
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.status === 'Active' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              <i className={`fas ${service.status === 'Active' ? 'fa-check-circle' : 'fa-pause-circle'} mr-1`}></i>
              {service.status}
            </div>
          </div>
        </div>

        {/* Benefits highlight */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-lightbulb text-primary text-sm"></i>
            <span className="text-sm font-medium text-neutral-700">Key Benefit</span>
          </div>
          <p className="text-xs text-neutral-600">
            {service.type === 'ListingEnhancement' && 'Boost your business visibility in search results and listings'}
            {service.type === 'NotificationEnhancement' && 'Stay connected with customers through enhanced notifications'}
            {service.type === 'BannerDisplay' && 'Maximum visual impact with premium banner placements'}
            {!['ListingEnhancement', 'NotificationEnhancement', 'BannerDisplay'].includes(service.type) && 'Premium business enhancement for better reach'}
          </p>
        </div>
        
        {/* Action Button */}
        <button
          onClick={() => onAdd(service.id)}
          className={`w-full py-4 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg
            ${isAdded
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/25 transform scale-105'
              : isFeatured
                ? `bg-gradient-to-r ${serviceStyle.gradient} text-white hover:shadow-lg hover:-translate-y-0.5`
                : 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white hover:from-neutral-800 hover:to-neutral-900 hover:shadow-neutral-200 hover:-translate-y-0.5'
            }`}
        >
          {isAdded ? (
            <>
              <i className="fas fa-check-circle mr-2"></i>
              Service Added
            </>
          ) : (
            <>
              <i className="fas fa-plus-circle mr-2"></i>
              Add Service
            </>
          )}
        </button>

        {!isAdded && (
          <div className="text-center mt-3">
            <span className="text-xs text-neutral-500">
              <i className="fas fa-shield-alt mr-1"></i>
              Instant activation • Cancel anytime
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;