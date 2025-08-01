import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/apiConfig';
import type { RootState } from '../../redux/store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Business', 'Subscription', 'Banner', 'SubscriptionPlan', 'Service','PaymentRecord'], // Define tag types for caching and invalidation
  endpoints: (builder) => ({
    // This is where all specific endpoints will be injected
  }),
});