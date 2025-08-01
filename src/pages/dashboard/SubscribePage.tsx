import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSubscriptionPlansQuery,
  useGetServicesQuery,
  useCreateSubscriptionMutation,
} from "../../features/subscriptions/subscriptionApi";
import PlanCard from "../../components/subscription/PlanCard";
import ServiceCard from "../../components/subscription/ServiceCard";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
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
    setSelectedServiceId(null); // Deselect service if a plan is chosen
  };

  const handleAddService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setSelectedPlanId(null); // Deselect plan if a service is chosen
  };

  // In SubscribePage.tsx, modify the submit handler

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
            <div className="h-8 bg-neutral-100 w-48 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-100 w-64 rounded animate-pulse"></div>
          </div>
          <div className="bg-neutral-100 h-10 w-24 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-7 bg-neutral-100 w-40 rounded mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-60 bg-neutral-100 rounded-xl"></div>
            ))}
          </div>

          <div className="h-7 bg-neutral-100 w-40 rounded mb-8 mt-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-neutral-100 rounded-xl"></div>
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
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">Failed to load subscription options.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back button and title */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">
            Subscribe to Business
          </h1>
          <p className="text-neutral-500">
            Choose a subscription plan or standalone service for this business
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

      <Card className="mb-6">
        {/* Business info banner */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
            <i className="fas fa-building text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Business ID: {businessId?.substring(0, 8)}...
            </h2>
            <p className="text-neutral-500">
              Select subscription options below
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("plans")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "plans"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "services"
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Standalone Services
            </button>
          </nav>
        </div>

        {/* Subscription Plans Tab */}
        <div className={activeTab === "plans" ? "block" : "hidden"}>
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
              <div className="col-span-3 text-center py-10">
                <div className="text-neutral-400 text-5xl mb-4">
                  <i className="fas fa-box-open"></i>
                </div>
                <h3 className="text-xl font-medium text-neutral-700">
                  No subscription plans available
                </h3>
                <p className="text-neutral-500 mt-2">
                  Try checking out the standalone services
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Standalone Services Tab */}
        <div className={activeTab === "services" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {servicesData?.data.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAdd={handleAddService}
                isAdded={selectedServiceId === service.id}
              />
            ))}
            {servicesData?.data.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <div className="text-neutral-400 text-5xl mb-4">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <h3 className="text-xl font-medium text-neutral-700">
                  No standalone services available
                </h3>
                <p className="text-neutral-500 mt-2">
                  Try selecting a subscription plan instead
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Selection summary */}
      {(selectedPlan || selectedService) && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Subscription Summary</h3>

          <div className="flex flex-col md:flex-row border border-neutral-100 rounded-lg p-4 bg-neutral-50 mb-6">
            <div className="flex-grow">
              <div className="flex items-center">
                <i
                  className={`fas ${
                    selectedPlan ? "fa-cube" : "fa-cog"
                  } text-primary mr-2`}
                ></i>
                <span className="font-medium">
                  {selectedPlan ? "Subscription Plan" : "Standalone Service"}
                </span>
              </div>
              <h4 className="text-lg font-bold mt-1">
                {selectedPlan?.name || selectedService?.name}
              </h4>
              <p className="text-neutral-600 text-sm mt-1 mb-4">
                {selectedPlan?.description || selectedService?.description}
              </p>

              {selectedPlan && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">
                      Includes Services
                    </p>
                    <ul className="mt-1 text-sm">
                      {selectedPlan.services.map((service) => (
                        <li key={service.id} className="flex items-center">
                          <i className="fas fa-check text-green-500 mr-1 text-xs"></i>
                          {service.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Duration</p>
                    <p className="text-sm font-medium">
                      {selectedPlan.durationInDays} days
                    </p>
                  </div>
                </div>
              )}

              {selectedService && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Service Type</p>
                    <p className="text-sm font-medium">
                      {selectedService.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Duration</p>
                    <p className="text-sm font-medium">
                      {selectedService.standaloneDurationInDays} days
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-right flex flex-col">
              <div className="text-neutral-500 text-sm">Total Price</div>
              <div className="text-3xl font-bold text-primary">
                ${selectedPlan?.price || selectedService?.standalonePrice}
              </div>
              <div className="text-sm text-neutral-500">
                {selectedPlan
                  ? `${selectedPlan.billingCycle} billing`
                  : `${selectedService?.standaloneBillingCycle} billing`}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="text"
              onClick={() => {
                setSelectedPlanId(null);
                setSelectedServiceId(null);
              }}
            >
              Clear Selection
            </Button>

            <Button
              onClick={handleSubmitSubscription}
              isLoading={creatingSubscription}
              disabled={!selectedPlanId && !selectedServiceId}
              rightIcon={<i className="fas fa-arrow-right"></i>}
            >
              Complete Subscription
            </Button>
          </div>
        </Card>
      )}

      {/* Subscribe button (when no selection is made yet) */}
      {!selectedPlan && !selectedService && (
        <div className="text-center mt-8">
          <p className="text-neutral-500 mb-4">
            Please select a subscription plan or service to continue
          </p>
          <Button disabled={true} isFullWidth>
            Complete Subscription
          </Button>
        </div>
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
