import React from 'react';
import type { SubscriptionOfferingPackage, SubscriptionPlan } from '../../features/subscriptions/subscriptionApi';

interface PlanCardProps {
  plan: SubscriptionPlan|SubscriptionOfferingPackage ;
  onSelect: (planId: number) => void;
  isSelected: boolean;
  isPopular?: boolean;
  animate?: boolean;
   isAvailableForPurchase?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onSelect, 
  isSelected,
  isPopular = false,
  animate = true ,
  isAvailableForPurchase = true
}) => {
  const popularBadge = isPopular && (
    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white text-xs font-bold uppercase py-2 px-4 rounded-full shadow-lg border border-yellow-300">
        <i className="fas fa-crown mr-1"></i>
        Most Popular
      </div>
    </div>
  );

  // Get plan tier styling
  const getTierStyling = () => {
    const name = plan.name.toLowerCase();
    if (name.includes('gold') || name.includes('premium')) {
      return {
        gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
        icon: 'fa-crown',
        badge: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
      };
    } else if (name.includes('silver') || name.includes('pro')) {
      return {
        gradient: 'from-gray-400 via-gray-500 to-gray-600',
        icon: 'fa-gem',
        badge: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
      };
    } else if (name.includes('bronze') || name.includes('basic')) {
      return {
        gradient: 'from-orange-400 via-orange-500 to-orange-600',
        icon: 'fa-medal',
        badge: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800'
      };
    } else {
      return {
        gradient: 'from-blue-400 via-blue-500 to-blue-600',
        icon: 'fa-star',
        badge: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
      };
    }
  };

  const tierStyle = getTierStyling();

  return (
    <div className="relative">
      {popularBadge}
      <div
        className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden h-full flex flex-col relative z-10 ${
          isSelected 
            ? 'border-primary ring-4 ring-primary/20 shadow-2xl' 
            : isPopular 
              ? 'border-yellow-400 shadow-xl' 
              : 'border-neutral-200 hover:border-neutral-300'
        } ${animate ? 'transform transition-all duration-300 hover:scale-105 hover:shadow-xl' : ''}`}
      >
        {/* Plan Header with Gradient */}
        <div className={`relative p-6 bg-gradient-to-br ${isPopular ? 'from-yellow-50 to-yellow-100' : 'from-neutral-50 to-neutral-100'}`}>
          {/* Plan Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${tierStyle.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <i className={`fas ${tierStyle.icon} text-white text-xl`}></i>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${tierStyle.badge}`}>
              {plan.services.length} Services
            </div>
          </div>

          <h3 className="font-bold text-2xl text-neutral-800 mb-2">
            {plan.name}
          </h3>
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {plan.description}
          </p>

          {/* Pricing */}
          <div className="flex items-end mb-2">
            <span className="text-4xl font-extrabold text-primary">
              KES {plan.price.toLocaleString()}
            </span>
            <span className="text-lg text-neutral-500 ml-2 mb-1">
              /{plan.billingCycle.toLowerCase()}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-500">
            <i className="fas fa-calendar-alt mr-1"></i>
            {plan.durationInDays} days duration
            {plan.isRenewable && (
              <>
                <span className="mx-2">•</span>
                <i className="fas fa-sync-alt mr-1"></i>
                Auto-renewable
              </>
            )}
          </div>
        </div>

        {/* Plan Features */}
        <div className="p-6 flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-check-circle text-green-500"></i>
            <p className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
              Included Services
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            {plan.services.map((service, index) => (
              <div key={service.id} className="flex items-start gap-3 group">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <i className="fas fa-check text-green-600 text-xs"></i>
                </div>
                <div className="flex-grow">
                  <span className="text-neutral-700 font-medium text-sm leading-relaxed">
                    {service.name}
                  </span>
                  {service.description&& (
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Value Highlight */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2">
              <i className="fas fa-calculator text-primary text-sm"></i>
              <span className="text-sm font-medium text-neutral-700">Value Breakdown</span>
            </div>
            <div className="mt-2 text-xs text-neutral-600">
              {plan.services.length > 0 && (
                <>
                  Individual services worth: KES {plan.services.reduce((total, service) => total + service.standalonePrice, 0).toLocaleString()}
                  <div className="font-semibold text-green-600 mt-1">
                    You save: KES {Math.max(0, plan.services.reduce((total, service) => total + service.standalonePrice, 0) - plan.price).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
         <button
    onClick={() => onSelect(plan.id)}
    disabled={!isAvailableForPurchase}
    className={`w-full py-4 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg
      ${!isAvailableForPurchase ? 'opacity-60 cursor-not-allowed' : ''}
      ${isSelected
        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/25 transform scale-105'
        : isPopular
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 hover:shadow-yellow-200'
          : 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-white hover:from-neutral-800 hover:to-neutral-900 hover:shadow-neutral-200'
      }`}
    title={!isAvailableForPurchase ? "You already own this package" : ""}
  >
    {isSelected ? (
      <>
        <i className="fas fa-check-circle mr-2"></i>
        Selected Plan
      </>
    ) : (
      <>
        <i className="fas fa-rocket mr-2"></i>
        {isAvailableForPurchase ? `Select ${plan.name}` : "Already Purchased"}
      </>
    )}
  </button>
          
          {!isSelected && (
            <div className="text-center mt-2">
              <span className="text-xs text-neutral-500">
                <i className="fas fa-lock mr-1"></i>
                Secure • Instant activation
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;