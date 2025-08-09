import React, { useState } from 'react';
import { useLinkBannerToSubscriptionMutation } from '../bannerApi';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';


interface LinkSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bannerId: number;
  bannerTitle: string;
  availableSubscriptions: Array<{
    id: number;
    name: string;
    type: string;
    endDate: string;
    status: string;
  }>;
  onSuccess: () => void;
}

const LinkSubscriptionModal: React.FC<LinkSubscriptionModalProps> = ({
  isOpen,
  onClose,
  bannerId,
  bannerTitle,
  availableSubscriptions,
  onSuccess,
}) => {
  const [linkBannerToSubscription, { isLoading }] = useLinkBannerToSubscriptionMutation();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleLink = async () => {
    if (!selectedSubscriptionId) {
      setError('Please select a subscription');
      return;
    }

    try {
      await linkBannerToSubscription({
        bannerId,
        subscriptionId: selectedSubscriptionId,
      }).unwrap();

      onSuccess();
      onClose();
      setSelectedSubscriptionId(0);
      setError('');
    } catch (error: any) {
      setError(error?.data?.message || 'Failed to link banner to subscription');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedSubscriptionId(0);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Link Banner to Subscription"

    >
      <div className="space-y-4">
        {/* Banner Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-1">Banner to Link:</h4>
          <p className="text-gray-600">{bannerTitle}</p>
          <p className="text-sm text-gray-500">ID: #{bannerId}</p>
        </div>

        {/* Subscription Selection */}
        <div>
          <label className="form-label">
            Select Subscription <span className="text-red-500">*</span>
          </label>
          
          {availableSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-exclamation-triangle text-gray-400"></i>
              </div>
              <p className="text-gray-600 mb-2">No available subscriptions</p>
              <p className="text-sm text-gray-500">
                You need an active banner service subscription to link this banner.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableSubscriptions.map((subscription) => (
                <label
                  key={subscription.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="subscription"
                    value={subscription.id}
                    checked={selectedSubscriptionId === subscription.id}
                    onChange={(e) => setSelectedSubscriptionId(parseInt(e.target.value))}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{subscription.name}</p>
                        <p className="text-sm text-gray-600">{subscription.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-600"></i>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          {availableSubscriptions.length > 0 && (
            <Button
              onClick={handleLink}
              isLoading={isLoading}
              disabled={!selectedSubscriptionId}
              leftIcon={<i className="fas fa-link"></i>}
            >
              Link Banner
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LinkSubscriptionModal;