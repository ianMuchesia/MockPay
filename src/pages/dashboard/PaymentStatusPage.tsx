import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useGetPaymentStatusQuery } from '../../features/payments/paymentApi';

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract transaction ID from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('OrderTrackingId') || queryParams.get('tx_ref');
  
  // State for handling the view
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  
  // Fetch payment status
  const { 
    data: paymentData,
    isLoading, 
    isError,
    error,
    refetch 
  } = useGetPaymentStatusQuery(transactionId || '', { 
    skip: !transactionId,
    pollingInterval: isPolling ? 2000 : 0 // Poll every 2 seconds if polling is enabled
  });

  // Start polling when component mounts if we have a transaction ID
  useEffect(() => {
    if (transactionId) {
      setIsPolling(true);
    }
  }, [transactionId]);

  // Monitor polling and stop after success or max attempts
  useEffect(() => {
    if (paymentData?.status && paymentData.status !== 'Pending') {
      // Stop polling once we get a final status
      setIsPolling(false);
      setFinalStatus(paymentData.status);
    } else if (pollCount >= 15) { // Stop after 30 seconds (15 attempts * 2 seconds)
      setIsPolling(false);
      setFinalStatus('timeout');
    }

    if (isPolling) {
      const intervalId = setInterval(() => {
        setPollCount(prev => prev + 1);
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [paymentData, isPolling, pollCount]);

  // Handle "no transaction ID" case
  if (!transactionId) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <div className="text-5xl text-red-500 mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Invalid Request</h1>
          <p className="text-neutral-600 mb-6">
            No transaction ID was found. Please try the payment process again.
          </p>
          <Button onClick={() => navigate('/dashboard/subscriptions')}>
            Go to My Subscriptions
          </Button>
        </Card>
      </div>
    );
  }

  // Loading state while checking payment
  if ((isLoading || isPolling) && !finalStatus) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <LoadingSpinner size="lg" />
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Checking Payment Status
          </h1>
          <p className="text-neutral-600">
            Please wait while we verify your payment. This may take a few moments.
          </p>
          
          <div className="mt-8 w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((pollCount / 15) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Don't close this window
          </p>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError || finalStatus === 'timeout') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <div className="text-5xl text-red-500 mb-4">
            <i className="fas fa-times-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-neutral-600 mb-6">
            {finalStatus === 'timeout' 
              ? "We couldn't verify your payment status in time. Please check your subscriptions page to confirm if the payment was successful."
              : "We encountered an issue while verifying your payment. Please contact support if you believe this is an error."}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setIsPolling(true);
                setPollCount(0);
                refetch();
              }}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
            <Button onClick={() => navigate('/dashboard/subscriptions')} className="w-full">
              Go to My Subscriptions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Success state
  if (paymentData?.status === 'Successful' || paymentData?.status === 'Completed') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <div className="text-5xl text-green-500 mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-neutral-600 mb-6">
            Your subscription has been successfully processed. You can now access your subscription.
          </p>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Transaction Details:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-neutral-500">Transaction ID:</p>
              <p className="font-medium">{transactionId}</p>
              <p className="text-neutral-500">Amount:</p>
              <p className="font-medium">{paymentData.amount} {paymentData.currency}</p>
              <p className="text-neutral-500">Date:</p>
              <p className="font-medium">
                {new Date(paymentData.transactionDate).toLocaleString()}
              </p>
              <p className="text-neutral-500">Status:</p>
              <p className="font-medium text-green-600">
                {paymentData.status}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/dashboard/subscriptions')}>
            View My Subscriptions
          </Button>
        </Card>
      </div>
    );
  }
  
  // Failed payment state
  if (paymentData?.status === 'Failed' || paymentData?.status === 'Cancelled') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <div className="text-5xl text-red-500 mb-4">
            <i className="fas fa-times-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-neutral-600 mb-6">
            Unfortunately, your payment could not be processed. 
            {paymentData.failureReason && (
              <span> Reason: {paymentData.failureReason}</span>
            )}
          </p>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Transaction Details:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-neutral-500">Transaction ID:</p>
              <p className="font-medium">{transactionId}</p>
              <p className="text-neutral-500">Amount:</p>
              <p className="font-medium">{paymentData.amount} {paymentData.currency}</p>
              <p className="text-neutral-500">Date:</p>
              <p className="font-medium">
                {new Date(paymentData.transactionDate).toLocaleString()}
              </p>
              <p className="text-neutral-500">Status:</p>
              <p className="font-medium text-red-600">
                {paymentData.status}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button onClick={() => navigate(-2)} variant="primary" className="w-full">
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/subscriptions')} 
              variant="outline" 
              className="w-full"
            >
              Go to My Subscriptions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Pending or other states
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center p-8">
        <div className="text-5xl text-yellow-500 mb-4">
          <i className="fas fa-clock"></i>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Payment Pending
        </h1>
        <p className="text-neutral-600 mb-6">
          Your payment is being processed. Please check back later for updates.
        </p>
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2">Transaction Details:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-neutral-500">Transaction ID:</p>
            <p className="font-medium">{transactionId}</p>
            {paymentData?.amount && (
              <>
                <p className="text-neutral-500">Amount:</p>
                <p className="font-medium">{paymentData.amount} {paymentData.currency}</p>
              </>
            )}
            {paymentData?.transactionDate && (
              <>
                <p className="text-neutral-500">Date:</p>
                <p className="font-medium">
                  {new Date(paymentData.transactionDate).toLocaleString()}
                </p>
              </>
            )}
            <p className="text-neutral-500">Status:</p>
            <p className="font-medium text-yellow-600">
              {paymentData?.status || 'Pending'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={() => {
              setIsPolling(true);
              setPollCount(0);
              refetch();
            }}
            className="w-full"
          >
            Check Status
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/subscriptions')} 
            variant="outline" 
            className="w-full"
          >
            Go to My Subscriptions
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;