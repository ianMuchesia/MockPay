import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BannerSlider from '../features/banners/components/BannerSlider';
import { useGetHomeBusinessesMutation } from '../features/businesses/businessApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import BusinessCard from '../features/businesses/components/BusinessCard';

const HomePage: React.FC = () => {
  const [getBusinesses, { data, isLoading, isError }] = useGetHomeBusinessesMutation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getBusinesses({ pageNumber: 1, pageSize: 12, pageType: 'Home' });
  }, [getBusinesses]);

  // For filtering businesses (if we had search)
  const filteredBusinesses = data?.data.items?.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-6 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BannerSlider />
          </div>
        </section>
        
        {/* Search Section */}
        <section className="py-8 bg-gradient-to-r from-primary/5 to-primary-light/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="form-input pr-12 shadow-lg"
                  placeholder="Search businesses by name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button className="text-neutral-400 hover:text-primary">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <button className="badge bg-white text-neutral-700 hover:bg-primary hover:text-white transition-colors px-4 py-2">All</button>
                <button className="badge bg-white text-neutral-700 hover:bg-primary hover:text-white transition-colors px-4 py-2">Restaurants</button>
                <button className="badge bg-white text-neutral-700 hover:bg-primary hover:text-white transition-colors px-4 py-2">Services</button>
                <button className="badge bg-white text-neutral-700 hover:bg-primary hover:text-white transition-colors px-4 py-2">Retail</button>
                <button className="badge bg-white text-neutral-700 hover:bg-primary hover:text-white transition-colors px-4 py-2">Health & Fitness</button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Businesses */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-neutral-800">
                <span className="border-b-4 border-primary pb-2">Featured</span> Businesses
              </h2>
              <a href="#" className="text-primary hover:underline flex items-center">
                View All <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
                    <div className="h-48 bg-neutral-200"></div>
                    <div className="p-5">
                      <div className="h-6 bg-neutral-200 rounded mb-4"></div>
                      <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded mb-4 w-3/4"></div>
                      <div className="h-10 bg-neutral-200 rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">Error</h3>
                    <p className="text-red-700">Failed to load businesses. Please try refreshing the page.</p>
                  </div>
                </div>
              </div>
            )}
            
            {!isLoading && !isError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.businessID} business={business} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-primary-light/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">How It Works</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Subscribe to your favorite businesses for special perks, discounts, and exclusive services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'fa-magnifying-glass',
                  title: 'Discover',
                  description: 'Find businesses in your area that offer subscription services and packages.'
                },
                {
                  icon: 'fa-credit-card',
                  title: 'Subscribe',
                  description: 'Choose from flexible subscription plans that fit your needs and budget.'
                },
                {
                  icon: 'fa-star',
                  title: 'Enjoy',
                  description: 'Get exclusive perks, discounts, and priority service from businesses you love.'
                }
              ].map((step, index) => (
                <div key={index} className="card p-6 text-center hover:translate-y-[-10px] transition-transform">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter and be the first to know about new businesses and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input flex-grow"
                />
                <button className="btn bg-white text-primary hover:bg-neutral-100 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MockPay</h3>
              <p className="text-neutral-400">
                The easiest way to discover and subscribe to local businesses.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-white hover:text-primary">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-neutral-400">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                  <span>123 Business Street, City, Country</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  <span>info@mockpay.com</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2"></i>
                  <span>+1 (123) 456-7890</span>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-neutral-700 my-8" />
          
          <div className="text-center text-neutral-500">
            <p>© {new Date().getFullYear()} MockPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;