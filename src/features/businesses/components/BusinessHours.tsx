import React from 'react';
import type { SingleBusiness } from '../businessApi';

interface BusinessHoursProps {
  business: SingleBusiness;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ business }) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const isOpen24Hours = (openTime: string, closeTime: string) => {
    return openTime === '00:00:00' && closeTime === '23:59:59';
  };

  const sortedHours = [...business.businessHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Business Hours</h2>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          business.openCloseHours.isOpen 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            business.openCloseHours.isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {business.openCloseHours.isOpen ? 'Open Now' : 'Closed'}
        </div>
      </div>

      <div className="space-y-3">
        {sortedHours.map((hour) => {
          const isToday = hour.dayOfWeek === currentDay;
          const dayName = dayNames[hour.dayOfWeek];
          const is24Hours = isOpen24Hours(hour.openTime, hour.closeTime);
          
          return (
            <div
              key={hour.id}
              className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all ${
                isToday 
                  ? 'bg-primary/10 border-2 border-primary/20' 
                  : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center">
                {isToday && (
                  <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                )}
                <span className={`font-medium ${
                  isToday ? 'text-primary' : 'text-neutral-700'
                }`}>
                  {dayName}
                  {isToday && <span className="ml-2 text-sm">(Today)</span>}
                </span>
              </div>
              
              <div className="text-right">
                {is24Hours ? (
                  <span className="font-semibold text-green-600">24 Hours</span>
                ) : (
                  <span className={`font-medium ${
                    isToday ? 'text-primary' : 'text-neutral-600'
                  }`}>
                    {formatTime(hour.openTime)} - {formatTime(hour.closeTime)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      {business.openCloseHours.extMessage && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-amber-600 mt-1 mr-3"></i>
            <p className="text-amber-800 text-sm">{business.openCloseHours.extMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessHours;