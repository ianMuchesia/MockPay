import { api } from '../api/apiSlice';

export interface Review {
  reviewID: number;
  userID: number;
  userName: string;
  businessID: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  notHelpfulCount: number;
  reviewDate: string;
  status: number;
  reviewResponses: any[];
  userVote?: 'helpful' | 'not_helpful' | null;
}

interface AddReviewRequest {
  rating: number;
  comment: string;
  userID: number;
  userName: string;
  businessID: string;
}

interface VoteRequest {
  reviewId: number;
  userId: number;
  isHelpful: boolean;
}

interface FlagRequest {
  reason: string;
}

interface ReviewResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation<ReviewResponse, AddReviewRequest>({
      query: (body) => ({
        url: '/api/business/review',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    voteOnReview: builder.mutation<ReviewResponse, VoteRequest>({
      query: (body) => ({
        url: '/api/business/review/vote',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    flagReview: builder.mutation<ReviewResponse, { reviewId: number; flagData: FlagRequest }>({
      query: ({ reviewId, flagData }) => ({
        url: `/api/business/review/${reviewId}/flag`,
        method: 'POST',
        body: flagData,
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const { 
  useAddReviewMutation,
  useVoteOnReviewMutation,
  useFlagReviewMutation 
} = reviewApi;