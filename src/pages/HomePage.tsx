import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BannerSlider from '../features/banners/components/BannerSlider';
import { useGetHomeBusinessesMutation } from '../features/businesses/businessApi';
import BusinessCard from '../features/businesses/components/BusinessCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [getBusinesses, { data, isLoading, isError }] = useGetHomeBusinessesMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBusinesses(1, true);
  }, []);

  const loadBusinesses = async (page: number, reset = false) => {
    try {
      const response = await getBusinesses({ 
        pageNumber: page, 
        pageSize: 12, 
        sortBy: 'random' 
      }).unwrap();
      
      if (reset) {
        setAllBusinesses(response.data.items);
      } else {
        setAllBusinesses(prev => [...prev, ...response.data.items]);
      }
      
      const totalLoaded = reset ? response.data.items.length : allBusinesses.length + response.data.items.length;
      setHasMore(totalLoaded < response.data.totalCount);
      
    } catch (error) {
      console.error('Failed to load businesses:', error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadBusinesses(nextPage, false);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/businesses/${category.toLowerCase()}`);
  };

  const filteredBusinesses = allBusinesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Full Width Banner Only */}
        <section className="relative">
          <BannerSlider />
        </section>

        {/* Search & Categories Section - Separate from Banner */}
        {/* <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-primary-light/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                    Find Your Perfect Business
                  </h2>
                  <p className="text-neutral-600 text-lg lg:text-xl">
                    Discover amazing local businesses and exclusive subscription offers
                  </p>
                </div>
                
              
                <div className="relative mb-10">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <i className="fas fa-search text-neutral-400 text-xl"></i>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-16 pr-6 py-5 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg bg-white shadow-sm"
                    placeholder="Search businesses, services, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors font-semibold">
                      Search
                    </button>
                  </div>
                </div>
                
               
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-6 text-center">
                    Browse by Category
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { name: 'Restaurants', icon: 'fa-utensils', color: 'from-red-500 to-red-600' },
                      { name: 'Services', icon: 'fa-tools', color: 'from-blue-500 to-blue-600' },
                      { name: 'Retail', icon: 'fa-shopping-bag', color: 'from-green-500 to-green-600' },
                      { name: 'Health', icon: 'fa-heartbeat', color: 'from-purple-500 to-purple-600' },
                      { name: 'Hotels', icon: 'fa-bed', color: 'from-amber-500 to-amber-600' },
                      { name: 'Technology', icon: 'fa-laptop', color: 'from-indigo-500 to-indigo-600' },
                    ].map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className="group bg-neutral-50 hover:bg-gradient-to-r hover:from-primary hover:to-primary-dark rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white mb-3 mx-auto group-hover:bg-white group-hover:text-primary transition-all`}>
                          <i className={`fas ${category.icon} text-lg`}></i>
                        </div>
                        <h3 className="font-semibold text-neutral-800 group-hover:text-white transition-colors text-sm">
                          {category.name}
                        </h3>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Businesses Section - Mixed Layout */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">
                  Discover Local Businesses
                </h2>
                <p className="text-neutral-600 text-xl">
                  From featured partnerships to hidden gems
                </p>
              </div>
              <div className="text-neutral-500">
                {filteredBusinesses.length} businesses
              </div>
            </div> */}
            
            {isLoading && currentPage === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-neutral-200"></div>
                    <div className="p-6">
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
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-exclamation-circle text-red-400 text-4xl mb-4"></i>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Businesses</h3>
                    <p className="text-red-600">Please refresh the page or try again later.</p>
                  </div>
                </div>
              </div>
            )}
            
            {!isLoading && !isError && filteredBusinesses.length === 0 && currentPage === 1 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-search text-4xl text-neutral-400"></i>
                </div>
                <h3 className="text-2xl font-semibold text-neutral-800 mb-4">No businesses found</h3>
                <p className="text-neutral-600 text-lg">Try adjusting your search terms</p>
              </div>
            )}
            
            {filteredBusinesses.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard key={business.businessID} business={business} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-16">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-primary to-primary-dark text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-3"></i>
                          Loading More...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-3"></i>
                          Load More Businesses
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-primary-light/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">How MockPay Works</h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Connecting you with local businesses through smart subscription services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: 'fa-magnifying-glass',
                  title: 'Discover',
                  description: 'Browse verified local businesses offering subscription services and exclusive packages.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: 'fa-credit-card',
                  title: 'Subscribe',
                  description: 'Choose flexible plans that fit your lifestyle. Cancel or modify anytime with ease.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: 'fa-gift',
                  title: 'Enjoy Perks',
                  description: 'Unlock exclusive discounts, priority service, and member-only benefits.',
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((step, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full border border-neutral-100">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`fas ${step.icon}`}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center">{step.title}</h3>
                    <p className="text-neutral-600 text-center leading-relaxed text-lg">{step.description}</p>
                    <div className="mt-8 text-center">
                      <div className={`inline-block w-16 h-1 bg-gradient-to-r ${step.color} rounded-full`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: 'fa-building', number: '1,500+', label: 'Local Businesses' },
                { icon: 'fa-users', number: '50K+', label: 'Happy Customers' },
                { icon: 'fa-handshake', number: '25K+', label: 'Active Subscriptions' },
                { icon: 'fa-star', number: '4.9', label: 'Average Rating' }
              ].map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i className={`fas ${stat.icon} text-2xl`}></i>
                  </div>
                  <div className="text-4xl font-bold mb-3">{stat.number}</div>
                  <div className="text-white/90 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Stay Connected</h2>
              <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
                Get updates on new businesses, exclusive offers, and platform features.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-8 py-5 rounded-2xl border-0 focus:ring-2 focus:ring-primary text-lg bg-white"
                />
                <button className="bg-gradient-to-r from-primary to-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-6 text-primary">MockPay</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed text-lg">
                The premier platform connecting customers with local businesses through innovative subscription services.
              </p>
              <div className="flex space-x-4">
                {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((social) => (
                  <a key={social} href="#" className="w-12 h-12 bg-neutral-700 hover:bg-primary rounded-xl flex items-center justify-center transition-colors">
                    <i className={`fab fa-${social} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-8">Platform</h3>
              <ul className="space-y-4">
                {['For Businesses', 'For Customers', 'Pricing', 'Features'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-neutral-400 hover:text-white transition-colors text-lg">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-8">Support</h3>
              <ul className="space-y-4">
                {['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-neutral-400 hover:text-white transition-colors text-lg">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <hr className="border-neutral-700 mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 mb-4 md:mb-0 text-lg">
              © {new Date().getFullYear()} MockPay. All rights reserved.
            </p>
            <div className="flex space-x-8 text-lg">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;