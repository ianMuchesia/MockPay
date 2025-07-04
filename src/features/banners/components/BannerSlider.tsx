import React, { useState, useEffect } from 'react';
import { useGetBannersQuery } from '../bannerApi';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

const BannerSlider: React.FC = () => {
  const { data, isLoading, isError } = useGetBannersQuery();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Auto rotate banners every 5 seconds if there's more than one
    if (data?.data && data?.data?.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % data.data.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data]);

  if (isLoading) return (
    <div className="relative w-full h-96 bg-neutral-100 animate-pulse rounded-2xl overflow-hidden mb-12">
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );

  if (isError || !data?.data.length) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-r from-primary-light/10 to-primary/10 rounded-2xl overflow-hidden mb-12 flex items-center justify-center">
        <div className="max-w-4xl text-center px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-4">
            Discover and Subscribe to <span className="text-primary">Local Businesses</span>
          </h1>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Find and support businesses in your community with flexible subscription options
          </p>
          <button className="btn-primary text-lg">Get Started</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-12 group">
      {/* Banner images with transition */}
      <div className="relative w-full h-full">
        {data.data.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.webImageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/30 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-lg">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {banner.title}
                  </h2>
                  <p className="text-lg text-white/90 mb-6">
                    {banner.description}
                  </p>
                  <a 
                    href={banner.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Banner controls - only show if there are multiple banners */}
      {data.data.length > 1 && (
        <>
          {/* Navigation dots */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-10">
            {data.data.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Arrow navigation */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setActiveIndex(prevIndex => (prevIndex === 0 ? data.data.length - 1 : prevIndex - 1))}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setActiveIndex(prevIndex => (prevIndex + 1) % data.data.length)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default BannerSlider;