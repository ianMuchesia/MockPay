import React, { useState, useEffect } from 'react';
import { useGetScheduledBannersQuery } from '../bannerApi';

const BannerSlider: React.FC = () => {
  const { data: bannersData, isLoading, isError } = useGetScheduledBannersQuery();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const banners = bannersData?.data || [];

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-br from-primary/20 via-primary-light/10 to-primary/30 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isError || banners.length === 0) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-br from-primary via-primary-dark to-primary-light flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/800')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Amazing 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">
              Local Businesses
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Connect with local businesses and unlock exclusive subscription benefits
          </p>
          <button className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <i className="fas fa-search mr-3"></i>
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] overflow-hidden group">
      {banners.map((banner, index) => (
        <div
          key={banner.bannerId}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <img
            src={isMobile ? banner.mobileImageUrl : banner.webImageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/1920/800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-4 h-4 bg-amber-400 rounded-full mr-4"></div>
                  <span className="text-white/90 text-lg font-semibold tracking-wide">Featured Business</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  {banner.title}
                </h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    <i className="fas fa-external-link-alt mr-3"></i>
                    Visit Business
                  </a>
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-lg">Active Subscription</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <i className="fas fa-chevron-left text-xl"></i>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <i className="fas fa-chevron-right text-xl"></i>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-white rounded-full' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;