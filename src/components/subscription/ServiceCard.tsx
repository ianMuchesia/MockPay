import React from 'react';
import type { Service } from '../../features/subscriptions/subscriptionApi';

interface ServiceCardProps {
  service: Service;
  onAdd: (serviceId: number) => void;
  isAdded: boolean;
  isFeatured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onAdd, isAdded, isFeatured = false }) => {
  // Calculate a unique color based on the service id
  const getServiceColor = (id: number) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-teal-500 to-teal-700',
      'from-indigo-500 to-indigo-700',
      'from-pink-500 to-pink-700'
    ];
    return colors[id % colors.length];
  };

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg ${
        isAdded 
          ? 'border-2 border-primary ring-2 ring-primary/20' 
          : 'border border-gray-200 dark:border-gray-700'
      } h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Service Header with Icon */}
      <div 
        className={`${isFeatured ? `bg-gradient-to-r ${getServiceColor(service.id)}` : 'bg-gray-100 dark:bg-gray-700'} p-4 flex items-center justify-between`}
      >
        <div className={`${isFeatured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {/* Display service category icon or badge */}
          {isFeatured && (
            <span className="inline-block px-2 py-1 text-xs font-bold uppercase bg-white bg-opacity-20 rounded-md mb-2">
              Featured
            </span>
          )}
          <h3 className="font-bold text-xl mb-1">{service.name}</h3>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-full 
          ${isFeatured ? 'bg-white bg-opacity-20' : 'bg-primary/10'}`}
        >
          <svg 
            className={`w-6 h-6 ${isFeatured ? 'text-white' : 'text-primary'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
      </div>

      {/* Service Body */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-end mb-2">
            <span className="text-3xl font-extrabold text-primary dark:text-primary-light">
              ${service.standalonePrice}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 mb-1">
              /{service.standaloneBillingCycle}
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm mb-4">
            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {service.standaloneDurationInDays} days
          </div>
          
          <button
            onClick={() => onAdd(service.id)}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center
              ${isAdded
                ? 'bg-primary dark:bg-primary-light text-white'
                : isFeatured
                  ? `bg-gradient-to-r ${getServiceColor(service.id)} text-white hover:shadow-lg`
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {isAdded ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              'Add Service'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;