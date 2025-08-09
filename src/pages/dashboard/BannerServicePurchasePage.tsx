import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBannerServiceQuery, useGetBannerEntitlementsQuery } from '../../features/banners/bannerApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const BannerServicePurchasePage: React.FC = () => {
  const navigate = useNavigate();
  
  // API hooks
  const { data: bannerServiceData, isLoading: loadingService } = useGetBannerServiceQuery();
  const { data: entitlementsData, isLoading: loadingEntitlements } = useGetBannerEntitlementsQuery();

  // State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // Handle service purchase
  const handlePurchase = () => {
    if (!bannerServiceData?.data) {
      setModalMessage('Banner service information is not available.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    const service = bannerServiceData.data;
    
    // Navigate to banner payment details page
    const params = new URLSearchParams({
      serviceId: service.id.toString(),
      subscriptionType: 'SERVICE',
      price: service.standalonePrice.toString(),
      name: service.name,
      billingCycle: service.standaloneBillingCycle,
    });

    navigate(`/dashboard/banners/payment-details?${params.toString()}`);
  };

  // Loading state
  if (loadingService || loadingEntitlements) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="h-8 bg-neutral-100 w-48 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-64 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-96 bg-neutral-100 rounded"></div>
        </div>
      </div>
    );
  }

  const bannerService = bannerServiceData?.data;
  const entitlements = entitlementsData?.data;

  if (!bannerService) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Service Unavailable</h3>
            <p className="text-red-700">Banner service is currently not available.</p>
            <Button 
              variant="outline" 
              className="mt-3" 
              onClick={() => navigate('/dashboard/banners')}
            >
              Back to Banners
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">Banner Advertising Service</h1>
          <p className="text-neutral-500">
            Boost your visibility with our premium banner advertising platform
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => navigate('/dashboard/banners')}
        >
          Back to Banners
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-white to-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Content */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-lg">
                <i className="fas fa-bullhorn text-3xl text-white"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-800">{bannerService.name}</h2>
                <p className="text-neutral-600 text-lg">{bannerService.description}</p>
              </div>
            </div>

            {/* Pricing Hero */}
            <div className="mb-8 text-center">
              <div className="inline-block bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-end justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold">
                    KES {bannerService.standalonePrice.toLocaleString()}
                  </span>
                  <span className="text-xl mb-2">
                    / {bannerService.standaloneBillingCycle.toLowerCase()}
                  </span>
                </div>
                <p className="text-primary-light text-sm">
                  {bannerService.standaloneDurationInDays} days duration • Auto-renewable
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: 'fa-eye', title: 'Maximum Visibility', desc: 'Hero section placement' },
                { icon: 'fa-mobile-alt', title: 'Multi-Platform', desc: 'Web & mobile reach' },
                { icon: 'fa-chart-line', title: 'Real Analytics', desc: 'Track performance' },
                { icon: 'fa-headset', title: '24/7 Support', desc: 'Professional assistance' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className={`fas ${benefit.icon} text-primary`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">{benefit.title}</p>
                    <p className="text-sm text-neutral-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                onClick={handlePurchase}
                size="lg"
                className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                rightIcon={<i className="fas fa-arrow-right"></i>}
              >
                Get Started Now
              </Button>
              <p className="text-sm text-neutral-500 mt-3">
                <i className="fas fa-shield-alt text-green-600 mr-1"></i>
                30-day money-back guarantee
              </p>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-8 flex items-center">
            <div className="w-full space-y-6">
              {/* Desktop Banner Mock */}
              <div className="bg-white rounded-lg shadow-xl p-4">
                <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg h-32 flex items-center justify-center text-white font-bold text-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">Your Banner Here</div>
                  <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs">
                    Web
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">Desktop Banner Preview (1200x400)</p>
              </div>

              {/* Mobile Banner Mock */}
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-xl p-3 w-48">
                  <div className="bg-gradient-to-r from-primary to-primary-dark rounded h-20 flex items-center justify-center text-white font-semibold text-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">Mobile Banner</div>
                    <div className="absolute top-1 right-1 bg-white/20 rounded px-1 text-xs">
                      Mobile
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 text-center">Mobile Preview (400x300)</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-neutral-600">Daily Views</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-neutral-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* What's Included */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-xl font-semibold mb-6">What's Included</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: 'fa-desktop', title: 'Premium Web Placement', desc: 'Hero section visibility on desktop and tablet devices' },
                { icon: 'fa-mobile-alt', title: 'Mobile Optimized', desc: 'Responsive design that looks great on all mobile devices' },
                { icon: 'fa-chart-bar', title: 'Analytics Dashboard', desc: 'Track clicks, impressions, and conversion rates' },
                { icon: 'fa-calendar-alt', title: 'Monthly Reports', desc: 'Detailed performance reports delivered monthly' },
                { icon: 'fa-tools', title: 'Easy Management', desc: 'User-friendly dashboard to manage your banners' },
                { icon: 'fa-headset', title: 'Professional Support', desc: '24/7 customer support and technical assistance' }
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${feature.icon} text-green-600`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">{feature.title}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <h4 className="font-semibold text-neutral-800 mb-4">Current Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Banner Slots</span>
                <span className="font-medium">{entitlements?.availableSlots || 0} available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Active Banners</span>
                <span className="font-medium">{entitlements?.existingBanners?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Services</span>
                <span className="font-medium">{entitlements?.availableSubscriptionIdsForNewBanner?.length || 0} active</span>
              </div>
            </div>

            {!entitlements?.canCreateBanner && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-orange-600"></i>
                  <span className="text-sm font-medium text-orange-800">Purchase Required</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  Get this service to start creating banners.
                </p>
              </div>
            )}
          </Card>

          {/* Trust Indicators */}
          <Card>
            <h4 className="font-semibold text-neutral-800 mb-4">Why Choose Us?</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-shield-alt text-green-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Secure & Reliable</p>
                  <p className="text-xs text-neutral-600">SSL encrypted, 99.9% uptime</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Trusted by 1000+</p>
                  <p className="text-xs text-neutral-600">Businesses across East Africa</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-rocket text-purple-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Instant Activation</p>
                  <p className="text-xs text-neutral-600">Get started immediately</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-undo text-orange-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Money-back Guarantee</p>
                  <p className="text-xs text-neutral-600">30 days, no questions asked</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Status */}
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-neutral-800">Service Available</h4>
              <p className="text-sm text-neutral-600 mt-1">
                Status: {bannerService.status}
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Ready for immediate activation
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mb-8">
        <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How long does it take to activate?",
              a: "Your banner service is activated immediately after successful payment."
            },
            {
              q: "Can I change my banner content?",
              a: "Yes, you can update your banner content anytime through your dashboard."
            },
            {
              q: "What banner sizes are supported?",
              a: "We support web banners (1200x400px) and mobile banners (400x300px)."
            },
            {
              q: "How do I track performance?",
              a: "Access detailed analytics through your dashboard including clicks and impressions."
            }
          ].map((faq, index) => (
            <div key={index} className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-medium text-neutral-800 mb-2">{faq.q}</h4>
              <p className="text-sm text-neutral-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Final CTA */}
      <Card className="text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">
            Ready to Boost Your Visibility?
          </h3>
          <p className="text-neutral-600 mb-6">
            Join thousands of businesses already using our banner advertising platform to reach more customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handlePurchase}
              size="lg"
              className="px-8"
              rightIcon={<i className="fas fa-arrow-right"></i>}
            >
              Purchase Service - KES {bannerService.standalonePrice.toLocaleString()}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard/banners')}
              leftIcon={<i className="fas fa-eye"></i>}
            >
              View Examples
            </Button>
          </div>
          
          <p className="text-sm text-neutral-500 mt-4">
            <i className="fas fa-lock text-green-600 mr-1"></i>
            Secure payment • Cancel anytime • 30-day guarantee
          </p>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'success' ? 'Success!' : 'Error'}
        type={modalType}
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
};

export default BannerServicePurchasePage;