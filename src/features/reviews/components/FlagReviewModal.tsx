import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNotification } from "../../../components/common/NotificationProvider";
import { useFlagReviewMutation } from "../reviewsApi";
import type { RootState } from "../../../redux/store";
import { SessionStorageManager } from "../../../utils/SessionStorageManager";

interface FlagReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number;
  businessId: string;
}

interface FlagFormData {
  reason: string;
  customReason?: string;
}

const flagReasons = [
  {
    value: "inappropriate_language",
    label: "Inappropriate Language",
    icon: "fa-exclamation-triangle",
  },
  { value: "spam", label: "Spam or Fake Review", icon: "fa-ban" },
  { value: "personal_attack", label: "Personal Attack", icon: "fa-user-slash" },
  { value: "off_topic", label: "Off Topic Content", icon: "fa-off" },
  {
    value: "false_information",
    label: "False Information",
    icon: "fa-info-circle",
  },
  { value: "copyright", label: "Copyright Violation", icon: "fa-copyright" },
  { value: "other", label: "Other (Please specify)", icon: "fa-ellipsis-h" },
];

const FlagReviewModal: React.FC<FlagReviewModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  businessId,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [flagReview, { isLoading }] = useFlagReviewMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FlagFormData>();

  const selectedReason = watch("reason");

  const onSubmit = async (data: FlagFormData) => {
    // Check authentication
    if (!token || !user) {
      // Save flag intent
      const flagData = {
        reviewId,
        reason: data.reason,
        customReason: data.customReason,
        businessId,
        timestamp: Date.now(),
      };
      SessionStorageManager.setPendingFlag(reviewId, flagData);

      // Set redirect URL
      SessionStorageManager.setRedirectUrl(`/businesses/${businessId}`);

      showNotification(
        "info",
        "Login Required",
        "Please log in to report this review."
      );
      navigate(`/login?redirect=/business/${businessId}`);
      return;
    }

    try {
      const reason =
        data.reason === "other" ? data.customReason || "Other" : data.reason;

      await flagReview({
        reviewId,
        flagData: { reason },
      }).unwrap();

      // Clear session storage on success
      sessionStorage.removeItem(`mockpay_pending_flag_${reviewId}`);

      showNotification(
        "success",
        "Report Submitted",
        "Thank you for reporting this review. Our team will review it shortly."
      );
      reset();
      onClose();
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        error.data?.message || "Failed to report review"
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-scroll">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Report Review</h2>
              <p className="text-red-100 mt-1">
                Help us maintain quality content
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Why are you reporting this review?
            </h3>
            <p className="text-neutral-600 text-sm mb-6">
              Select the reason that best describes the issue with this review.
            </p>

            <div className="space-y-3">
              {flagReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-center p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    value={reason.value}
                    {...register("reason", {
                      required: "Please select a reason",
                    })}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedReason === reason.value
                        ? "border-red-500 bg-red-500"
                        : "border-neutral-300"
                    }`}
                  >
                    {selectedReason === reason.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <i
                      className={`fas ${reason.icon} text-neutral-500 mr-3`}
                    ></i>
                    <span className="font-medium text-neutral-800">
                      {reason.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {errors.reason && (
              <p className="text-red-600 text-sm mt-2">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Custom Reason Input */}
          {selectedReason === "other" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-800 mb-2">
                Please specify the reason
              </label>
              <textarea
                {...register("customReason", {
                  required:
                    selectedReason === "other"
                      ? "Please specify the reason"
                      : false,
                  maxLength: {
                    value: 200,
                    message: "Reason must be less than 200 characters",
                  },
                })}
                className="w-full h-24 p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                placeholder="Please provide more details about why you're reporting this review..."
              />
              {errors.customReason && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customReason.message}
                </p>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-amber-600 mt-1 mr-3"></i>
              <div className="text-amber-800 text-sm">
                <p className="font-semibold mb-1">Please note:</p>
                <ul className="space-y-1">
                  <li>• Reports are reviewed by our moderation team</li>
                  <li>• False reports may result in account restrictions</li>
                  <li>• We'll notify you of the outcome when available</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Reporting...
                </span>
              ) : (
                <>
                  <i className="fas fa-flag mr-2"></i>
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlagReviewModal;
