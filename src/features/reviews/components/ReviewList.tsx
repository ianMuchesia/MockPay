import React, { useState } from 'react';
;
import ReviewCard from './ReviewCard';
import AddReviewModal from './AddReviewModal';
import type { SingleBusiness } from '../../businesses/businessApi';
import StarRating from './StarRating';

interface ReviewsListProps {
  business: SingleBusiness;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ business }) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterByRating, setFilterByRating] = useState<number | null>(null);

  const reviews = business.reviews || [];
  
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 : 0
  }));

  // Sort and filter reviews
  const sortedAndFilteredReviews = reviews
    .filter(review => filterByRating ? review.rating === filterByRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
        case 'oldest':
          return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  if (reviews.length === 0) {
    return (
      <>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-star text-primary text-4xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">No Reviews Yet</h3>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Be the first to share your experience with {business.name}. Your review helps other customers make informed decisions.
          </p>
          <button
            onClick={() => setIsAddReviewModalOpen(true)}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <i className="fas fa-star mr-2"></i>
            Write the First Review
          </button>
        </div>

        <AddReviewModal
          isOpen={isAddReviewModalOpen}
          onClose={() => setIsAddReviewModalOpen(false)}
          businessId={business.businessID}
          businessName={business.name}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 p-6 border-b border-neutral-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">Customer Reviews</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <StarRating rating={business.rating} readonly size="lg" />
                  <span className="ml-3 text-3xl font-bold text-neutral-800">{business.rating.toFixed(1)}</span>
                </div>
                <div className="text-neutral-600">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAddReviewModalOpen(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <i className="fas fa-star mr-2"></i>
              Write a Review
            </button>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="p-6 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-800 mb-4">Rating Breakdown</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilterByRating(filterByRating === rating ? null : rating)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all ${
                  filterByRating === rating 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center min-w-[60px]">
                  <span className="text-sm font-medium mr-2">{rating}</span>
                  <i className="fas fa-star text-amber-400 text-xs"></i>
                </div>
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-neutral-600 min-w-[40px] text-right">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-neutral-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>

            {filterByRating && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">
                  Showing {filterByRating}-star reviews
                </span>
                <button
                  onClick={() => setFilterByRating(null)}
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6">
          {sortedAndFilteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-filter text-4xl text-neutral-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No reviews match your filter</h3>
              <button
                onClick={() => setFilterByRating(null)}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Clear filter to see all reviews
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedAndFilteredReviews.map((review) => (
                <ReviewCard
                  key={review.reviewID}
                  review={review}
                  businessId={business.businessID}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        businessId={business.businessID}
        businessName={business.name}
      />
    </>
  );
};

export default ReviewsList;