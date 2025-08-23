import React, { useState, useEffect } from 'react';
import type { BusinessPhoto } from '../businessApi';


interface BusinessPhotoCarouselProps {
  photos: BusinessPhoto[];
  businessName: string;
}

const BusinessPhotoCarousel: React.FC<BusinessPhotoCarouselProps> = ({ photos, businessName }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (photos.length > 1 && !isFullscreen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % photos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [photos.length, isFullscreen]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (photos.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-image text-6xl text-neutral-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-neutral-600">{businessName}</h3>
            <p className="text-neutral-500">No photos available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group shadow-2xl">
        {/* Main Carousel */}
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={photo.photoURL}
              alt={`${businessName} - Photo ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/800/500';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm text-neutral-800 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
            >
              <i className="fas fa-chevron-left text-xl"></i>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm text-neutral-800 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
            >
              <i className="fas fa-chevron-right text-xl"></i>
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm text-neutral-800 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
        >
          <i className="fas fa-expand text-lg"></i>
        </button>

        {/* Photo Counter */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentSlide + 1} / {photos.length}
        </div>

        {/* Dots Indicator */}
        {photos.length > 1 && photos.length <= 10 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-3 bg-white rounded-full' 
                    : 'w-3 h-3 bg-white/60 hover:bg-white/80 rounded-full'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all z-10"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>
              </>
            )}

            {/* Fullscreen Image */}
            <img
              src={photos[currentSlide]?.photoURL}
              alt={`${businessName} - Photo ${currentSlide + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/800/500';
              }}
            />

            {/* Photo Info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <div className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                <span className="text-lg font-medium">{businessName}</span>
                <span className="mx-3 text-white/60">•</span>
                <span className="text-white/90">{currentSlide + 1} of {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessPhotoCarousel;