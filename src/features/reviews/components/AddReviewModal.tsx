import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNotification } from "../../../components/common/NotificationProvider";
import { useAddReviewMutation } from "../reviewsApi";
import type { RootState } from "../../../redux/store";
import StarRating from "./StarRating";
import { SessionStorageManager } from "../../../utils/SessionStorageManager";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [addReview, { isLoading }] = useAddReviewMutation();

  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const watchedComment = watch("comment");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue("rating", newRating);
  };

  const onSubmit = async (data: ReviewFormData) => {
    // Check authentication
    if (!token || !user) {
      // Save current form data
      const reviewData = {
        rating: data.rating,
        comment: data.comment,
        businessId,
        timestamp: Date.now(),
      };
      SessionStorageManager.setPendingReview(businessId, {
        rating: data.rating,
        comment: data.comment,
        businessId,
      });

      // Set redirect URL
      SessionStorageManager.setRedirectUrl(`/businesses/${businessId}`);

      showNotification(
        "info",
        "Login Required",
        "Please log in to submit your review."
      );
      navigate(`/login?redirect=/business/${businessId}`);
      return;
    }

    try {
      await addReview({
        rating: data.rating,
        comment: data.comment,
        userID: user.id,
        userName: user.name || user.email,
        businessID: businessId,
      }).unwrap();

      // Clear session storage on success
      sessionStorage.removeItem(`mockpay_pending_review_${businessId}`);

      showNotification(
        "success",
        "Review Submitted",
        "Thank you for your review!"
      );
      reset();
      setRating(0);
      onClose();
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        error.data?.message || "Failed to submit review"
      );
    }
  };

  const handleClose = () => {
    // Keep session data when closing modal
    reset();
    setRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-scroll">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Write a Review</h2>
              <p className="text-primary-light mt-1">{businessName}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Rating Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-neutral-800 mb-4">
              Rate your experience
            </label>
            <div className="flex items-center justify-center p-6 bg-neutral-50 rounded-2xl">
              <StarRating
                rating={rating}
                onRatingChange={handleRatingChange}
                size="xl"
                className="justify-center"
              />
            </div>
            {rating > 0 && (
              <div className="text-center mt-4">
                <span className="text-2xl font-bold text-primary">
                  {rating}
                </span>
                <span className="text-neutral-600 ml-2">
                  {rating === 1 ? "star" : "stars"}
                </span>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      rating >= 4
                        ? "bg-green-100 text-green-800"
                        : rating >= 3
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rating >= 4
                      ? "Excellent"
                      : rating >= 3
                      ? "Good"
                      : rating >= 2
                      ? "Fair"
                      : "Poor"}
                  </span>
                </div>
              </div>
            )}
            {errors.rating && (
              <p className="text-red-600 text-sm mt-2 text-center">
                Please select a rating
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-neutral-800 mb-4">
              Share your experience
            </label>
            <textarea
              {...register("comment", {
                required: "Please write a comment",
                minLength: {
                  value: 10,
                  message: "Comment must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Comment must be less than 500 characters",
                },
              })}
              className="w-full h-32 p-4 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Tell others about your experience with this business..."
            />
            <div className="flex justify-between items-center mt-2">
              {errors.comment && (
                <p className="text-red-600 text-sm">{errors.comment.message}</p>
              )}
              <div className="ml-auto text-sm text-neutral-500">
                {watchedComment?.length || 0}/500
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">
              Review Guidelines
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Be honest and constructive</li>
              <li>• Focus on your experience with the business</li>
              <li>• Avoid personal information or offensive language</li>
              <li>• Help other customers make informed decisions</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-neutral-100 text-neutral-700 py-4 rounded-2xl font-semibold hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || rating === 0}
              className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </span>
              ) : (
                <>
                  <i className="fas fa-star mr-2"></i>
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
