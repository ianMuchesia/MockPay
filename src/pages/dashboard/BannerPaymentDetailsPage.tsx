import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useCreateSubscriptionWithPaymentMutation } from '../../features/subscriptions/subscriptionApi';

const BannerPaymentDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get service details from URL params
  const serviceId = searchParams.get('serviceId');
  const subscriptionType = searchParams.get('subscriptionType');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const billingCycle = searchParams.get('billingCycle');
  const returnTo = searchParams.get('returnTo'); // 'banner-creation' if coming from create flow

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: 'KE',
    currency: 'KES',
    gatewayName: 'Pesapal',
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // API hooks
  const [createSubscriptionWithPayment, { isLoading }] = useCreateSubscriptionWithPaymentMutation();
  
  // Construct return URL
  const baseUrl = window.location.origin;
  const returnUrl = `${baseUrl}/dashboard/payment-status`;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user changes the value
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Phone number validation - basic check
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{9,12}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!serviceId) {
      setModalMessage('Missing required service information.');
      setModalType('error');
      setShowModal(true);
      return;
    }
    
    try {
      // Prepare the payload (no businessId needed!)
      const payload = {
        subscriberType: 'USER', // Changed from BUSINESS to USER
        subscriberId: '', // Will be handled by backend from auth token
        subscriptionType: subscriptionType || 'SERVICE',
        subscriptionPlanId: 0,
        serviceId: serviceId ? parseInt(serviceId) : 0,
        renewalMode: 'AUTO',
        payerInfo: {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          countryCode: formData.countryCode
        },
        currency: formData.currency,
        gatewayName: formData.gatewayName,
        returnUrl: returnUrl
      };
      
      console.log('Banner Payment Payload:', payload);
      
      const response = await createSubscriptionWithPayment(payload).unwrap();
      
      // If we got a redirect URL from the payment response
      if (response.data.paymentResponse?.redirectUrl) {
        // Store return context if coming from banner creation
        if (returnTo === 'banner-creation') {
          sessionStorage.setItem('paymentContext', 'banner-creation');
        }
        
        // Redirect to the payment gateway
        window.location.href = response.data.paymentResponse.redirectUrl;
      } else if (response.data.createdSubscription?.status === 'Active') {
        // Subscription is immediately active without payment (e.g., free tier)
        setModalMessage('Banner service activated successfully!');
        setModalType('success');
        setShowModal(true);
        
        // Redirect based on context
        setTimeout(() => {
          if (returnTo === 'banner-creation') {
            navigate('/dashboard/banners/create');
          } else {
            navigate('/dashboard/banners');
          }
        }, 2000);
      } else {
        // If no redirect URL and subscription isn't active, show error
        setModalMessage('Payment initialization failed. Please try again.');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error: any) {
      const errMsg = error?.data?.error || 'Failed to process payment. Please try again.';
      setModalMessage(errMsg);
      setModalType('error');
      setShowModal(true);
    }
  };

  // Check if we have the required params
  if (!serviceId) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Missing Information</h3>
            <p className="text-red-700">Required service details are missing.</p>
            <Button 
              variant="outline" 
              className="mt-3" 
              onClick={() => navigate('/dashboard/banners/purchase')}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">Banner Service Payment</h1>
          <p className="text-neutral-500">
            Complete your banner service subscription by providing payment information
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => {
            if (returnTo === 'banner-creation') {
              navigate('/dashboard/banners/create');
            } else {
              navigate('/dashboard/banners/purchase');
            }
          }}
        >
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${formErrors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First Name"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${formErrors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last Name"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="Email Address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Country Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="KE">Kenya (KE)</option>
                    <option value="UG">Uganda (UG)</option>
                    <option value="TZ">Tanzania (TZ)</option>
                    <option value="RW">Rwanda (RW)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`form-input ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="e.g. 712345678"
                  />
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="UGX">Ugandan Shilling (UGX)</option>
                    <option value="TZS">Tanzanian Shilling (TZS)</option>
                    <option value="RWF">Rwandan Franc (RWF)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Payment Gateway <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gatewayName"
                    value={formData.gatewayName}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Pesapal">Pesapal</option>
                    <option value="Flutterwave">Flutterwave</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  rightIcon={<i className="fas fa-arrow-right"></i>}
                  size="lg"
                >
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Service Icon */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-bullhorn text-2xl text-white"></i>
                </div>
                <h3 className="font-semibold text-neutral-800">{name || 'Banner Service'}</h3>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Service</span>
                  <span className="font-medium">{name || 'Banner Service'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Billing Cycle</span>
                  <span className="font-medium">{billingCycle || 'Monthly'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Type</span>
                  <span className="font-medium">Standalone Service</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">
                    KES {price ? parseFloat(price).toLocaleString() : '0'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Taxes included if applicable
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <h3 className="text-sm font-semibold flex items-center">
                <i className="fas fa-shield-alt text-primary mr-2"></i>
                Secure Payment
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Your payment information is processed securely. We do not store credit card details.
              </p>
            </div>

            {returnTo === 'banner-creation' && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold flex items-center text-blue-800">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Next Steps
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  After payment, you'll be redirected back to complete your banner creation.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal for errors/notifications */}
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

export default BannerPaymentDetailsPage;