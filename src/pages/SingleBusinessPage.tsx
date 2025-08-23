import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useGetSingleBusinessQuery } from '../features/businesses/businessApi';
import BusinessPhotoCarousel from '../features/businesses/components/BusinessPhotoCarousel';
import BusinessHeader from '../features/businesses/components/BusinessHeader';
import BusinessDetails from '../features/businesses/components/BusinessDetails';
import BusinessHours from '../features/businesses/components/BusinessHours';
import BusinessProducts from '../features/businesses/components/BusinessProducts';
import ReviewsList from '../features/reviews/components/ReviewList';


const SingleBusinessPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { data: business, isLoading, isError, error } = useGetSingleBusinessQuery(businessId!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-grow">
          {/* Loading Photo Carousel */}
          <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-primary/20 via-primary-light/10 to-primary/30 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* Loading Header */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 -mt-20 relative z-10 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="h-8 bg-neutral-200 rounded mb-4 w-3/4"></div>
                  <div className="h-12 bg-neutral-200 rounded mb-6"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-4 w-1/2"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-6 w-2/3"></div>
                </div>
                <div>
                  <div className="h-32 bg-neutral-200 rounded-2xl mb-6"></div>
                  <div className="h-12 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Loading Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-2 space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded mb-4 w-1/3"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-neutral-200 rounded"></div>
                      <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
                      <div className="h-4 bg-neutral-200 rounded w-3/5"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-neutral-200 rounded mb-4 w-1/2"></div>
                  <div className="space-y-4">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Business Not Found</h1>
            <p className="text-neutral-600 mb-8 max-w-md">
              The business you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/"
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Photo Carousel */}
        <BusinessPhotoCarousel photos={business.businessPhotos} businessName={business.name} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Business Header */}
          <BusinessHeader business={business} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <BusinessDetails business={business} />
              
              {/* Products */}
              {business.businessProducts.length > 0 && (
                <BusinessProducts business={business} />
              )}
              
              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">Location</h2>
                <div className="relative h-64 bg-neutral-100 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-4xl text-neutral-400 mb-3"></i>
                      <h3 className="text-lg font-semibold text-neutral-600 mb-2">Interactive Map</h3>
                      <p className="text-neutral-500">Map integration coming soon</p>
                    </div>
                  </div>
                  {/* Overlay with business address */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                    <p className="font-semibold text-neutral-800">{business.address}</p>
                    <p className="text-neutral-600">{business.city}, {business.country}</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <ReviewsList business={business} />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              <BusinessHours business={business} />
              
              {/* Business Brands */}
              {business.businessBrands.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-neutral-800 mb-4">Partner Brands</h2>
                  <div className="space-y-4">
                    {business.businessBrands.map((brand) => (
                      <div key={brand.brandID} className="flex items-center p-3 bg-neutral-50 rounded-xl">
                        <img
                          src={brand.brandPhotos[0]?.photoUrl || '/api/placeholder/50/50'}
                          alt={brand.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/50/50';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-neutral-800">{brand.name}</h3>
                          <p className="text-sm text-neutral-600 line-clamp-1">{brand.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors border border-neutral-200">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save Business
                  </button>
                  <button className="w-full bg-white text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors border border-neutral-200">
                    <i className="fas fa-flag mr-2"></i>
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleBusinessPage;