import { api } from '../api/apiSlice';

interface BusinessPhoto {
  photoURL: string;
  photoSection: string;
}

export interface Business {
  businessID: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  businessPhotos: BusinessPhoto[];
  reviewsData: any; // Define more specifically if needed
  openCloseHours: any; // Define more specifically if needed
}

interface BusinessListingResponse {
  success: boolean;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: Business[];
  };
}



export const businessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBusinesses: builder.mutation<BusinessListingResponse, { pageNumber: number; pageSize: number; pageType: string }>({
      query: (body) => ({
        url: '/api/Business/home-listing',
        method: 'POST',
        body:{}
      }),
      invalidatesTags: ['Business'], // Invalidate when new data might come in
    }),
    getBusinesses: builder.query<Business[], void>({
      query: () => ({
        url: '/api/Business/user', // Re-using home-listing for simplicity, adjust if needed
        method: 'GET',
      }),
      providesTags: ['Business'],
    }),
  }),
});

export const { useGetHomeBusinessesMutation, useGetBusinessesQuery } = businessApi;