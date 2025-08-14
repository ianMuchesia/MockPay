import React, { useState } from "react";
import {
  useCancelSubscriptionMutation,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
  useRenewSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useRetrySubscriptionMutation,
} from "../../features/subscriptions/subscriptionApi";
import Modal from "../../components/common/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SubscriptionsPage: React.FC = () => {

  const navigate = useNavigate();
  

  const { data, isLoading, isError, refetch } = useGetUserSubscriptionsQuery();

  console.log("Fetched subscriptions:", data);

  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const [pauseSubscription, { isLoading: pausing }] =
    usePauseSubscriptionMutation();
  const [resumeSubscription, { isLoading: resuming }] =
    useResumeSubscriptionMutation();
  const [renewSubscription, { isLoading: renewing }] =
    useRenewSubscriptionMutation();
  const [retryPayment, { isLoading: retrying }] =
    useRetrySubscriptionMutation();

  const [filter, setFilter] = useState<
    | "all"
    | "active"
    | "paused"
    | "cancelled"
    | "expired"
    | "pendingpayment"
    | "refunded"
    | "failedpayment"
  >("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [confirmAction, setConfirmAction] = useState<{
    action: "cancel" | "pause" | "resume" | "renew" | "retry" | null;
    id: string | null;
  }>({ action: null, id: null });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pauseEndDate, setPauseEndDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
  );

  const handleConfirmAction = (
    action: "cancel" | "pause" | "resume" | "renew" | "retry",
    id: string | number
  ) => {
    const Id = id.toString();
    setConfirmAction({ action, id: Id });
    setShowConfirmModal(true);
  };
  const handleAction = async (
    action: "cancel" | "pause" | "resume" | "renew" | "retry",
    subscriptionId: string | number
  ) => {
    try {
      setShowConfirmModal(false);

      switch (action) {
        case "cancel":
          await cancelSubscription(subscriptionId).unwrap();
          break;
        case "pause":
          await pauseSubscription({
            subscriptionId,
            pauseEndDate: pauseEndDate.toISOString(),
          }).unwrap();
          break;
        case "resume":
          await resumeSubscription(subscriptionId).unwrap();
          break;
        case "renew":
          navigate(`/dashboard/subscription-payment-details/${subscriptionId}/renew`);
          break;
        case "retry":
          navigate(`/dashboard/subscription-payment-details/${subscriptionId}/retry`);
          break;
      }

      
      const actionText =
        action === "cancel"
          ? "cancelled"
          : action === "pause"
          ? "paused"
          : action === "resume"
          ? "resumed"
          : action === "retry"
          ? "payment retried"
          : "renewed";

      setModalMessage(`Subscription successfully ${actionText}!`);
      setModalType("success");
      setShowModal(true);
      refetch(); 
    } catch (error: any) {
      const errMsg =
        error && "data" in error
          ? (error.data as any).message
          : `Failed to ${action} subscription.`;
      setModalMessage(errMsg);
      setModalType("error");
      setShowModal(true);
    }
  };

  
  const filteredSubscriptions =
    data?.data.filter((sub) => {
      if (filter === "all") return true;
      return sub.status.toLowerCase() === filter;
    }) || [];

  console.log("Filtered subscriptions:", filteredSubscriptions);

  
  const getStatusCounts = () => {
    const counts = {
      all: data?.data.length || 0,
      active: 0,
      paused: 0,
      cancelled: 0,
      expired: 0,
      pendingpayment: 0,
      refunded: 0,
      failedpayment: 0,
    };

    data?.data.forEach((sub) => {
      const status = sub.status.toLowerCase() as
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "pendingpayment"
        | "refunded"
        | "failedpayment";
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Subscriptions</h1>
          <div className="bg-neutral-100 w-40 h-10 rounded-lg animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 animate-pulse">
            <div className="h-8 bg-neutral-100 w-64 mb-4 rounded"></div>
            <div className="h-4 bg-neutral-100 w-1/2 mb-8 rounded"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center gap-4 border-b border-neutral-100 pb-6"
                >
                  <div className="md:w-1/4">
                    <div className="h-5 bg-neutral-100 rounded w-3/4"></div>
                  </div>
                  <div className="md:w-1/4">
                    <div className="h-5 bg-neutral-100 rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-100 rounded w-1/3 mt-2"></div>
                  </div>
                  <div className="md:w-1/4">
                    <div className="h-6 bg-neutral-100 rounded-full w-20"></div>
                  </div>
                  <div className="md:w-1/4 flex justify-end">
                    <div className="h-8 bg-neutral-100 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">
              Failed to load subscriptions. Please try refreshing the page.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">
            My Subscriptions
          </h1>
          <p className="text-neutral-500">
            Manage your active subscriptions and billing
          </p>
        </div>

        <button
          className="btn-primary inline-flex items-center"
          onClick={() => {
            /* Navigate to explore subscriptions */
          }}
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Subscription
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <nav className="flex space-x-8">
          {[
            { id: "all", label: "All", count: statusCounts.all },
            { id: "active", label: "Active", count: statusCounts.active },
            { id: "paused", label: "Paused", count: statusCounts.paused },
            {
              id: "cancelled",
              label: "Cancelled",
              count: statusCounts.cancelled,
            },
            { id: "expired", label: "Expired", count: statusCounts.expired },
            {
              id: "pendingpayment",
              label: "Pending Payment",
              count: statusCounts.pendingpayment,
            },
            { id: "refunded", label: "Refunded", count: statusCounts.refunded },
            {
              id: "failedpayment",
              label: "Failed Payment",
              count: statusCounts.failedpayment,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  filter === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }
              `}
              onClick={() => setFilter(tab.id as any)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.id
                      ? "bg-primary/20 text-primary"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Subscriptions list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredSubscriptions.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-receipt text-2xl text-neutral-400"></i>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-1">
              No subscriptions found
            </h3>
            <p className="text-neutral-500">
              {filter === "all"
                ? "You don't have any subscriptions yet."
                : `You don't have any ${filter} subscriptions.`}
            </p>
            <button
              className="mt-4 btn-primary"
              onClick={() => {
                /* Navigate to explore */
              }}
            >
              Browse Businesses
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {filteredSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Subscription info */}
                    <div className="md:w-1/3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <i className="fas fa-bookmark"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-800">
                            {sub.subscriptionPlanName ||
                              sub.serviceName ||
                              "Unknown Subscription"}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            Type: {sub.subscriberType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="md:w-1/4">
                      <div className="flex space-x-4 text-sm text-neutral-600">
                        <div>
                          <p className="text-neutral-500">Started</p>
                          <p className="font-medium">
                            {new Date(sub.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Expires</p>
                          <p className="font-medium">
                            {new Date(sub.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="md:w-1/6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          sub.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : sub.status === "Paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : sub.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : sub.status === "Expired"
                            ? "bg-gray-100 text-gray-800"
                            : sub.status === "PendingPayment"
                            ? "bg-orange-100 text-orange-800"
                            : sub.status === "FailedPayment"
                            ? "bg-red-200 text-red-800"
                            : sub.status === "Refunded"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {sub.status === "Active" && (
                          <i className="fas fa-circle text-[0.5rem] mr-1"></i>
                        )}
                        {sub.status === "PendingPayment" && (
                          <i className="fas fa-clock text-[0.75rem] mr-1"></i>
                        )}
                        {sub.status === "FailedPayment" && (
                          <i className="fas fa-exclamation-circle text-[0.75rem] mr-1"></i>
                        )}
                        {sub.status}
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">
                        {sub.renewalMode === "AUTO"
                          ? "Auto-renews"
                          : "Manual renewal"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="md:w-1/4 md:text-right">
                      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        {sub.status === "Active" && (
                          <button
                            onClick={() => handleConfirmAction("pause", sub.id)}
                            disabled={pausing}
                            className="btn-outline py-1 px-3 text-xs"
                          >
                            <i className="fas fa-pause mr-1"></i> Pause
                          </button>
                        )}

                        {sub.status === "Paused" && (
                          <button
                            onClick={() =>
                              handleConfirmAction("resume", sub.id)
                            }
                            disabled={resuming}
                            className="btn-outline py-1 px-3 text-xs"
                          >
                            <i className="fas fa-play mr-1"></i> Resume
                          </button>
                        )}

                        {sub.status === "Expired" && (
                          <button
                            onClick={() => handleConfirmAction("renew", sub.id)}
                            disabled={renewing}
                            className="btn-secondary py-1 px-3 text-xs"
                          >
                            <i className="fas fa-sync mr-1"></i> Renew
                          </button>
                        )}

                        {(sub.status === "PendingPayment" ||
                          sub.status === "FailedPayment") && (
                          <button
                            onClick={() => handleConfirmAction("retry", sub.id)}
                            disabled={retrying}
                            className="bg-primary text-white hover:bg-primary-dark py-1 px-3 rounded text-xs font-medium"
                          >
                            <i className="fas fa-redo-alt mr-1"></i> Retry
                            Payment
                          </button>
                        )}

                        {(sub.status === "Active" ||
                          sub.status === "Paused") && (
                          <button
                            onClick={() =>
                              handleConfirmAction("cancel", sub.id)
                            }
                            disabled={cancelling}
                            className="border border-red-300 text-red-600 hover:bg-red-50 py-1 px-3 rounded text-xs font-medium"
                          >
                            <i className="fas fa-times mr-1"></i> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "success" ? "Success!" : "Error"}
        type={modalType}
      >
        <p>{modalMessage}</p>
      </Modal>

      {/* // Confirmation modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Action"
        type="info"
        actions={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirmAction.action && confirmAction.id) {
                  handleAction(confirmAction.action, confirmAction.id);
                }
              }}
              className={`px-4 py-2 rounded-lg text-white ${
                confirmAction.action === "cancel"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
            >
              Confirm
            </button>
          </>
        }
      >
        {confirmAction.action === "pause" ? (
          <div className="space-y-4">
            <p>
              You're about to pause this subscription. You won't be charged
              during the pause period, but you'll also lose access to the
              service.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pause until:
              </label>
              <DatePicker
                selected={pauseEndDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    setPauseEndDate(date);
                  }
                }}
                minDate={new Date()} // Can't select dates in the past
                className="form-input w-full"
                dateFormat="MMMM d, yyyy"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your subscription will automatically resume after this date.
              </p>
            </div>
          </div>
        ) : (
          <p>
            {confirmAction.action === "cancel" &&
              "Are you sure you want to cancel this subscription? You'll lose access to the service."}
            {confirmAction.action === "resume" &&
              "Are you sure you want to resume this subscription? Billing will continue and you'll regain access to the service."}
            {confirmAction.action === "renew" &&
              "Are you sure you want to renew this subscription? Your payment method will be charged."}
            {confirmAction.action === "retry" &&
              "Are you sure you want to retry payment for this subscription?"}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
