import React from 'react';
import type { SubscriptionPlan } from '../../features/subscriptions/subscriptionApi';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (planId: number) => void;
  isSelected: boolean;
  isPopular?: boolean;
  animate?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onSelect, 
  isSelected,
  isPopular = false,
  animate = true 
}) => {
  const popularBadge = isPopular && (
    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold uppercase py-1 px-3 rounded-full shadow-md">
      Most Popular
    </span>
  );

  return (
    <div className="relative">
      {popularBadge}
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${
          isSelected ? 'border-primary ring-4 ring-primary/20' : isPopular ? 'border-yellow-400' : 'border-gray-200 dark:border-gray-700'
        } ${animate ? 'transform transition duration-300 hover:scale-102 hover:shadow-xl' : ''} 
        overflow-hidden h-full flex flex-col relative z-10`}
      >
        {/* Plan header */}
        <div className={`p-6 border-b ${isPopular ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700' : ''}`}>
          <h3 className={`font-bold text-2xl ${isPopular ? 'text-primary' : 'text-gray-800 dark:text-white'} mb-1`}>
            {plan.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {plan.description}
          </p>
          <div className="flex items-end mb-1">
            <span className="text-4xl font-extrabold text-primary dark:text-primary-light">
              ${plan.price}
            </span>
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1 mb-1">
              /{plan.billingCycle}
            </span>
          </div>
        </div>

        {/* Plan features */}
        <div className="p-6 flex-grow">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase mb-4">
            What's included:
          </p>
          <ul className="text-gray-700 dark:text-gray-300 mb-6 space-y-3">
            {plan.services.map((service) => (
              <li key={service.id} className="flex items-start">
                <svg
                  className={`w-5 h-5 ${isPopular ? 'text-yellow-500' : 'text-green-500'} mr-2 mt-0.5 flex-shrink-0`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>{service.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action button */}
        <div className="p-6 pt-0">
          <button
            onClick={() => onSelect(plan.id)}
            className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 flex items-center justify-center
              ${isSelected
                ? 'bg-primary dark:bg-primary-light text-white'
                : isPopular
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {isSelected ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Selected
              </>
            ) : (
              'Select Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;