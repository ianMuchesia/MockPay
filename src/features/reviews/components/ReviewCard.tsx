import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useNotification } from "../../../components/common/NotificationProvider";

import FlagReviewModal from "./FlagReviewModal";
import { useVoteOnReviewMutation, type Review } from "../reviewsApi";
import type { RootState } from "../../../redux/store";
import StarRating from "./StarRating";
import { SessionStorageManager } from "../../../utils/SessionStorageManager";

interface ReviewCardProps {
  review: Review;
  businessId: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, businessId }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [voteOnReview] = useVoteOnReviewMutation();

  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleVote = async (isHelpful: boolean) => {
    // Check authentication
    if (!token || !user) {
      // Save vote intent
      const voteData = {
        reviewId: review.reviewID,
        isHelpful,
        businessId,
        timestamp: Date.now(),
      };
      SessionStorageManager.setPendingVote(review.reviewID, voteData);

      // Set redirect URL
      SessionStorageManager.setRedirectUrl(`/businesses/${businessId}`);

      showNotification(
        "info",
        "Login Required",
        "Please log in to vote on reviews."
      );
      navigate(`/login?redirect=/business/${businessId}`);
      return;
    }

    setIsVoting(true);
    try {
      await voteOnReview({
        reviewId: review.reviewID,
        userId: user.id,
        isHelpful,
      }).unwrap();

      // Clear session storage on success
      sessionStorage.removeItem(`mockpay_pending_vote_${review.reviewID}`);

      showNotification(
        "success",
        "Vote Recorded",
        "Thank you for your feedback!"
      );
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        error.data?.message || "Failed to record vote"
      );
    } finally {
      setIsVoting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold mr-4">
              {getInitials(review.userName)}
            </div>

            <div>
              <h4 className="font-semibold text-neutral-800">
                {review.userName}
              </h4>
              <p className="text-neutral-500 text-sm">
                {formatDate(review.reviewDate)}
              </p>
            </div>
          </div>

          {/* Rating Badge */}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
              review.rating
            )}`}
          >
            <span className="mr-1">{review.rating}</span>
            <i className="fas fa-star text-xs"></i>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} readonly size="sm" />
            <span
              className={`text-sm font-medium ${
                getRatingColor(review.rating).split(" ")[0]
              }`}
            >
              {getRatingText(review.rating)}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          {/* Vote Buttons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote(true)}
                disabled={isVoting}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  review.userVote === "helpful"
                    ? "bg-green-100 text-green-700"
                    : "bg-neutral-100 text-neutral-600 hover:bg-green-50 hover:text-green-600"
                } disabled:opacity-50`}
              >
                <i
                  className={`fas fa-thumbs-up ${isVoting ? "fa-spin" : ""}`}
                ></i>
                <span>Helpful</span>
                <span className="bg-white rounded-full px-2 py-1 text-xs">
                  {review.helpfulCount}
                </span>
              </button>

              <button
                onClick={() => handleVote(false)}
                disabled={isVoting}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  review.userVote === "not_helpful"
                    ? "bg-red-100 text-red-700"
                    : "bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600"
                } disabled:opacity-50`}
              >
                <i
                  className={`fas fa-thumbs-down ${isVoting ? "fa-spin" : ""}`}
                ></i>
                <span>Not Helpful</span>
                <span className="bg-white rounded-full px-2 py-1 text-xs">
                  {review.notHelpfulCount}
                </span>
              </button>
            </div>
          </div>

          {/* Flag Button */}
          <button
            onClick={() => setIsFlagModalOpen(true)}
            className="flex items-center space-x-1 text-neutral-500 hover:text-red-600 transition-colors text-sm"
          >
            <i className="fas fa-flag"></i>
            <span>Report</span>
          </button>
        </div>

        {/* Review Responses */}
        {review.reviewResponses && review.reviewResponses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <h5 className="font-semibold text-neutral-800 mb-3">
              Business Response
            </h5>
            {review.reviewResponses.map((response, index) => (
              <div
                key={index}
                className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl"
              >
                <p className="text-blue-800">{response.content}</p>
                <p className="text-blue-600 text-sm mt-2">
                  {formatDate(response.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flag Modal */}
      <FlagReviewModal
        isOpen={isFlagModalOpen}
        onClose={() => setIsFlagModalOpen(false)}
        reviewId={review.reviewID}
        businessId={businessId}
      />
    </>
  );
};

export default ReviewCard;
