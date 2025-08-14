import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import {
  useGetSubscriptionByIdQuery,
  useGetSubscriptionsBySubscriberQuery,
  useRenewSubscriptionMutation,
  useRetrySubscriptionMutation,
} from "../../features/subscriptions/subscriptionApi";
import { useGetPayerInformationQuery } from "../../features/payments/paymentApi";
import Button from "../../components/common/Button";
import PaymentDetailsForm from "../../features/payments/components/PaymentDetailsForm";

const SubscriptionPaymentDetailsPage: React.FC = () => {
  const { subscriptionId, action } = useParams<{
    subscriptionId: string;
    action: "retry" | "renew";
  }>();
  const navigate = useNavigate();

  const { data: payerInfoData, isLoading: loadingPayerInfo } =
    useGetPayerInformationQuery();
  const { data: subscriptionData, isLoading: loadingSubscription } =
    useGetSubscriptionByIdQuery(subscriptionId || "");

  const [retryPayment, { isLoading: retrying }] =
    useRetrySubscriptionMutation();
  const [renewSubscription, { isLoading: renewing }] =
    useRenewSubscriptionMutation();

  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });

  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (form: any) => {
    setError(undefined);
    try {
      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/dashboard/payment-status`;

      const payload = {
        subscriptionId: Number(subscriptionId),
        userId: 0,
        payerInfo: {
          email: form.email,
          phoneNumber: form.phoneNumber,
          firstName: form.firstName,
          lastName: form.lastName,
          countryCode: form.countryCode,
        },
        gatewayName: form.gatewayName,
        returnUrl,
      };

      let response;
      if (action === "retry") {
        response = await retryPayment(payload).unwrap();
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        }
      } else {
        response = await renewSubscription(payload).unwrap();
        if (response.data.paymentResponse?.redirectUrl) {
          window.location.href = response.data.paymentResponse.redirectUrl;
        } else if (response.data.createdSubscription?.status === "Active") {
          setModal({
            open: true,
            message: "Subscription activated successfully!",
            type: "success",
          });
          setTimeout(() => {
            setModal({ ...modal, open: false });
            navigate("/dashboard/subscriptions");
          }, 2000);
        } else {
          setModal({
            open: true,
            message: "Payment initialization failed. Please try again.",
            type: "error",
          });
        }
      }

    
    } catch (err: any) {
      setError(
        err?.data?.error || "Failed to process payment. Please try again."
      );
    }
  };

  const payerInfo = payerInfoData?.data
    ? {
        firstName: payerInfoData.data.firstName,
        lastName: payerInfoData.data.lastName,
        email: payerInfoData.data.email,
        phoneNumber: payerInfoData.data.phoneNumber,
        countryCode: payerInfoData.data.countryCode,
        gatewayName: payerInfoData.data.preferredGateway || "Pesapal",
      }
    : undefined;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-neutral-800">
            {action === "retry" ? "Retry Payment" : "Renew Subscription"}
          </h1>
          <p className="text-neutral-500">
            {action === "retry"
              ? "Update your payment details and retry payment for your subscription."
              : "Update your payment details and renew your subscription."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<i className="fas fa-arrow-left"></i>}
          onClick={() => navigate(-1)}
        >
          Back to Subscriptions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Payer Information</h2>
            <PaymentDetailsForm
              initialPayerInfo={payerInfo}
              loading={retrying || renewing}
              onSubmit={handleSubmit}
              error={error}
              submitLabel={
                action === "retry" ? "Retry Payment" : "Renew Subscription"
              }
            />
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            {loadingSubscription ? (
              <div className="text-neutral-500">Loading subscription...</div>
            ) : subscriptionData?.data ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                  <div>
                    <p className="text-neutral-500">Subscription</p>
                    <p className="font-medium">
                      {subscriptionData.data.subscriptionPlanName ||
                        subscriptionData.data.serviceName ||
                        "Unknown Subscription"}
                    </p>
                  </div>
                  <div className="text-lg font-semibold">
                    {subscriptionData.data.pricePaid
                      ? `KES ${subscriptionData.data.pricePaid}`
                      : ""}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                  <div>
                    <p className="text-neutral-500">Type</p>
                    <p className="font-medium">
                      {subscriptionData.data.subscriptionType === "PACKAGE"
                        ? "Package Plan"
                        : "Standalone Service"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                  <div>
                    <p className="text-neutral-500">Subscriber ID</p>
                    <p className="font-medium text-sm">
                      {subscriptionData.data.subscriberId}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-lg">Total</p>
                    <p className="font-bold text-xl text-primary">
                      {subscriptionData.data.pricePaid
                        ? `KES ${subscriptionData.data.pricePaid}`
                        : ""}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Taxes included if applicable
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-neutral-500">
                No subscription info found.
              </div>
            )}
            <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <h3 className="text-sm font-semibold flex items-center">
                <i className="fas fa-shield-alt text-primary mr-2"></i>
                Secure Payment
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Your payment information is processed securely. We do not store
                credit card details.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.type === "success" ? "Success!" : "Error"}
        type={modal.type}
      >
        <p>{modal.message}</p>
      </Modal>
    </div>
  );
};

export default SubscriptionPaymentDetailsPage;
