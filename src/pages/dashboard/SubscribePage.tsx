import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSubscriptionPlansQuery,
  useGetServicesQuery,
  useCreateSubscriptionMutation,
} from "../../features/subscriptions/subscriptionApi";
import PlanCard from "../../components/subscription/PlanCard";
import ServiceCard from "../../components/subscription/ServiceCard";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const SubscribePage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const {
    data: plansData,
    isLoading: loadingPlans,
    isError: errorPlans,
  } = useGetSubscriptionPlansQuery();
  const {
    data: servicesData,
    isLoading: loadingServices,
    isError: errorServices,
  } = useGetServicesQuery();

  const [
    createSubscription,
    {
      isLoading: creatingSubscription,
      isSuccess: subscriptionSuccess,
      isError: subscriptionError,
      error: subscriptionErrMsg,
    },
  ] = useCreateSubscriptionMutation();

  const [activeTab, setActiveTab] = useState<"plans" | "services">("plans");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (subscriptionSuccess) {
      setModalMessage("Subscription created successfully!");
      setModalType("success");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/dashboard/subscriptions");
      }, 2000);
    }
    if (subscriptionError) {
      const errMsg =
        subscriptionErrMsg && "data" in subscriptionErrMsg
          ? (subscriptionErrMsg.data as any).message
          : "Failed to create subscription.";
      setModalMessage(errMsg);
      setModalType("error");
      setShowModal(true);
    }
  }, [subscriptionSuccess, subscriptionError, navigate, subscriptionErrMsg]);

  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setSelectedServiceId(null); // Reset service if a plan is chosen
  };

  const handleAddService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setSelectedPlanId(null); // Reset plan if a service is chosen
  };

  const handleSubmitSubscription = async () => {
    if (!businessId) {
      setModalMessage("Business ID is missing.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    if (!selectedPlanId && !selectedServiceId) {
      setModalMessage("Please select either a plan or a standalone service.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    // Instead of creating subscription, navigate to payment page with params
    const queryParams = new URLSearchParams();
    queryParams.append("businessId", businessId);

    if (selectedPlanId) {
      queryParams.append("subscriptionPlanId", selectedPlanId.toString());
      queryParams.append("subscriptionType", "PACKAGE");
      queryParams.append("price", selectedPlan?.price?.toString() || "0");
      queryParams.append("name", selectedPlan?.name || "Subscription Plan");
    } else if (selectedServiceId) {
      queryParams.append("serviceId", selectedServiceId.toString());
      queryParams.append("subscriptionType", "STANDALONE_SERVICE");
      queryParams.append(
        "price",
        selectedService?.standalonePrice?.toString() || "0"
      );
      queryParams.append("name", selectedService?.name || "Standalone Service");
    }

    navigate(`/dashboard/payment-details?${queryParams.toString()}`);
  };

  // Find the selected plan and service details for summary
  const selectedPlan = plansData?.data.find(
    (plan) => plan.id === selectedPlanId
  );
  const selectedService = servicesData?.data.find(
    (service) => service.id === selectedServiceId
  );

  if (loadingPlans || loadingServices) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="h-8 bg-neutral-100 w-64 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-96 rounded animate-pulse"></div>
          </div>
          <div className="bg-neutral-100 h-10 w-32 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
          <div className="h-20 bg-neutral-100 rounded-lg mb-8"></div>
          <div className="h-12 bg-neutral-100 w-80 rounded mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-100 rounded-xl"></div>
            ))}
          </div>

          <div className="h-7 bg-neutral-100 w-64 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorPlans || errorServices) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Service Unavailable</h3>
            <p className="text-red-700">Failed to load subscription options. Please try again.</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-refresh mr-2"></i>
              Retry
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
          <h1 className="text-2xl font-bold text-neutral-800">Business Enhancement Services</h1>
          <p className="text-neutral-500">
            Boost your business visibility with our premium packages and standalone services
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => navigate(-1)}
        >
          Back to Businesses
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-white to-primary/5">
        <div className="p-8">
          {/* Business Info Banner */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-lg">
              <i className="fas fa-building text-3xl text-white"></i>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-neutral-800">
                Business Enhancement Hub
              </h2>
              <p className="text-neutral-600 text-lg">
                Business ID: {businessId?.substring(0, 8)}...
              </p>
              <p className="text-neutral-500">
                Choose from comprehensive packages or individual services to maximize your reach
              </p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { 
                icon: 'fa-home', 
                title: 'Homepage Priority', 
                desc: 'Featured placement on our homepage',
                color: 'from-blue-500 to-blue-600'
              },
              { 
                icon: 'fa-list', 
                title: 'Category Boost', 
                desc: 'Top visibility in category listings',
                color: 'from-green-500 to-green-600'
              },
              { 
                icon: 'fa-search', 
                title: 'Search Excellence', 
                desc: 'Enhanced search result rankings',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <i className={`fas ${benefit.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-600">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Businesses', value: '1,500+', icon: 'fa-building' },
              { label: 'Monthly Reach', value: '100K+', icon: 'fa-eye' },
              { label: 'Success Rate', value: '95%', icon: 'fa-chart-line' },
              { label: 'Avg. Growth', value: '3x', icon: 'fa-rocket' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-4 text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <i className={`fas ${stat.icon} text-primary text-sm`}></i>
                </div>
                <div className="text-xl font-bold text-neutral-800">{stat.value}</div>
                <div className="text-xs text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Card className="mb-6">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("plans")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === "plans"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <i className="fas fa-cube mr-2"></i>
              Premium Packages
              {plansData?.data && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {plansData.data.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === "services"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Individual Services
              {servicesData?.data && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {servicesData.data.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content Areas */}
        <div className="p-6">
          {/* Subscription Plans Tab */}
          <div className={activeTab === "plans" ? "block" : "hidden"}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Premium Business Packages</h3>
              <p className="text-neutral-600">
                Comprehensive solutions with multiple services bundled for maximum value and impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plansData?.data.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={handleSelectPlan}
                  isSelected={selectedPlanId === plan.id}
                />
              ))}
              {plansData?.data.length === 0 && (
                <div className="col-span-3 text-center py-16">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-box-open text-3xl text-neutral-400"></i>
                  </div>
                  <h3 className="text-xl font-medium text-neutral-700">No Premium Packages Available</h3>
                  <p className="text-neutral-500 mt-2 max-w-md mx-auto">
                    Premium packages are currently being prepared. Check out our individual services below.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("services")}
                  >
                    Browse Individual Services
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Standalone Services Tab */}
          <div className={activeTab === "services" ? "block" : "hidden"}>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Individual Enhancement Services</h3>
              <p className="text-neutral-600">
                Pick specific services that match your business needs and budget requirements
              </p>
            </div>

            {/* Service Categories */}
            <div className="space-y-8">
              {/* Listing Enhancement Services */}
              { servicesData && servicesData?.data.filter(service => service.type === 'ListingEnhancement').length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-star text-white text-sm"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-800">Listing Enhancement Services</h4>
                    <span className="text-sm text-neutral-500">• Boost your business visibility</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {servicesData.data
                      .filter(service => service.type === 'ListingEnhancement')
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAdd={handleAddService}
                          isAdded={selectedServiceId === service.id}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Notification Enhancement Services */}
              {servicesData && servicesData?.data.filter(service => service.type === 'NotificationEnhancement').length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-bell text-white text-sm"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-800">Notification Enhancement</h4>
                    <span className="text-sm text-neutral-500">• Stay connected with customers</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {servicesData.data
                      .filter(service => service.type === 'NotificationEnhancement')
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAdd={handleAddService}
                          isAdded={selectedServiceId === service.id}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Banner Display Services */}
              {servicesData && servicesData?.data.filter(service => service.type === 'BannerDisplay').length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-bullhorn text-white text-sm"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-800">Banner Advertising</h4>
                    <span className="text-sm text-neutral-500">• Maximum visual impact</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {servicesData.data
                      .filter(service => service.type === 'BannerDisplay')
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAdd={handleAddService}
                          isAdded={selectedServiceId === service.id}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Other Services */}
              {servicesData && servicesData?.data.filter(service => 
                !['ListingEnhancement', 'NotificationEnhancement', 'BannerDisplay'].includes(service.type)
              ).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-plus text-white text-sm"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-800">Additional Services</h4>
                    <span className="text-sm text-neutral-500">• Extra business tools</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {servicesData.data
                      .filter(service => 
                        !['ListingEnhancement', 'NotificationEnhancement', 'BannerDisplay'].includes(service.type)
                      )
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAdd={handleAddService}
                          isAdded={selectedServiceId === service.id}
                        />
                      ))}
                  </div>
                </div>
              )}

              {servicesData?.data.length === 0 && (
                <div className="col-span-3 text-center py-16">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-concierge-bell text-3xl text-neutral-400"></i>
                  </div>
                  <h3 className="text-xl font-medium text-neutral-700">No Individual Services Available</h3>
                  <p className="text-neutral-500 mt-2 max-w-md mx-auto">
                    Individual services are currently being prepared. Check out our premium packages above.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("plans")}
                  >
                    Browse Premium Packages
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Selection Summary */}
      {(selectedPlan || selectedService) && (
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <i className={`fas ${selectedPlan ? 'fa-cube' : 'fa-cog'} text-white`}></i>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Selected Enhancement</h3>
              <p className="text-neutral-600">
                Review your selection and proceed to complete your business enhancement
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedPlan 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedPlan ? 'Premium Package' : 'Individual Service'}
                  </span>
                  {selectedPlan && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {selectedPlan.services.length} Services Included
                    </span>
                  )}
                </div>
                
                <h4 className="text-xl font-bold text-neutral-800 mb-2">
                  {selectedPlan?.name || selectedService?.name}
                </h4>
                <p className="text-neutral-600 mb-4">
                  {selectedPlan?.description || selectedService?.description}
                </p>

                {selectedPlan && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 mb-2">Included Services</p>
                      <div className="space-y-2">
                        {selectedPlan.services.map((service) => (
                          <div key={service.id} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-check text-green-600 text-xs"></i>
                            </div>
                            <span className="text-sm text-neutral-700">{service.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-500">Duration</p>
                        <p className="font-medium">{selectedPlan.durationInDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Billing Cycle</p>
                        <p className="font-medium">{selectedPlan.billingCycle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Renewable</p>
                        <p className="font-medium">{selectedPlan.isRenewable ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedService && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Service Type</p>
                      <p className="font-medium">{selectedService.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Duration</p>
                      <p className="font-medium">{selectedService.standaloneDurationInDays} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Billing</p>
                      <p className="font-medium">{selectedService.standaloneBillingCycle}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-64 text-center lg:text-right">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl p-6">
                  <div className="text-neutral-600 text-sm mb-1">Total Investment</div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    KES {(selectedPlan?.price || selectedService?.standalonePrice)?.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {selectedPlan
                      ? `${selectedPlan.billingCycle} billing`
                      : `${selectedService?.standaloneBillingCycle} billing`}
                  </div>
                  <div className="mt-4 text-xs text-neutral-500">
                    <i className="fas fa-shield-alt text-green-600 mr-1"></i>
                    Secure payment processing
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPlanId(null);
                setSelectedServiceId(null);
              }}
              leftIcon={<i className="fas fa-times"></i>}
            >
              Clear Selection
            </Button>

            <Button
              onClick={handleSubmitSubscription}
              isLoading={creatingSubscription}
              disabled={!selectedPlanId && !selectedServiceId}
              rightIcon={<i className="fas fa-arrow-right"></i>}
              size="lg"
              className="px-8"
            >
              Complete Enhancement
            </Button>
          </div>
        </Card>
      )}

      {/* Call to Action when nothing selected */}
      {!selectedPlan && !selectedService && (
        <Card className="text-center bg-gradient-to-r from-neutral-50 to-neutral-100 border-neutral-200">
          <div className="py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-rocket text-2xl text-primary"></i>
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Ready to Enhance Your Business?</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Select a premium package or individual service above to boost your business visibility and reach more customers.
            </p>
            <Button disabled={true} size="lg" className="px-8">
              <i className="fas fa-lock mr-2"></i>
              Make Your Selection First
            </Button>
          </div>
        </Card>
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "success" ? "Success!" : "Error!"}
        type={modalType}
      >
        <p>{modalMessage}</p>
        {modalType === "success" && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setShowModal(false);
                navigate("/dashboard/subscriptions");
              }}
              size="sm"
            >
              View My Subscriptions
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SubscribePage;